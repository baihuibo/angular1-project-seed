// Created by baihuibo on 2017/3/1.

import {IRouter, CanActivate} from "router";
import {Names, NgModule, IComponentOptions, strandToCamel} from "core";
import {asyncModuleRegister} from "core";
import {forEach} from "angular";
import "angular-ui-router";
// import "ng-ui-router-state-events"; // 暂时不启用此插件

export module RouterModule {
    export function forRoot(routers: IRouter[]) {
        const module = getModule(class RouterConfig {
            static $inject = ['$stateProvider', '$urlRouterProvider', '$templateFactoryProvider'];

            constructor($stateProvider: angular.ui.IStateProvider,
                        $urlRouterProvider: angular.ui.IUrlRouterProvider,
                        $templateFactoryProvider) {
                routers.forEach(router => {

                    // console.log('$templateFactoryProvider', $templateFactoryProvider);

                    if (router.resolve && router.resolve['loadChildren']) {
                        const loadFn = router.resolve['loadChildren'];
                        // router.templateProvider = function () {
                        //     return new Promise(function (resolve) {
                        //         console.log('template');
                        //         resolve('<app-async-page></app-async-page>');
                        //     });
                        // };
                        // 注入异步模块
                        loadFn['asyncModuleRegister'] = function (esModule, moduleName) {
                            asyncModuleRegister(module, esModule, moduleName);
                        };
                    }

                    if (Array.isArray(router)) {
                        (<Array<IRouter>>router).forEach(state => register(fromState(state), $stateProvider));
                    } else if (router.name) {
                        register(fromState(router), $stateProvider);
                    } else {
                        registerRouterProvider(router, $urlRouterProvider);
                    }
                })
            }
        });

        return module;
    }

    export function forChild(routers: IRouter[]) {
        return forRoot(routers);
    }
}

function registerRouterProvider(router: IRouter, $urlRouterProvider) {
    if (router.url == '**' && router.redirectTo) {// 无效的路由
        $urlRouterProvider.otherwise(router.redirectTo);
    } else if (router.url === '' && router.redirectTo) {// 默认路由
        $urlRouterProvider.when('', router.redirectTo);
    }
}

function register(router: IRouter, $stateProvider) {
    if (router.canActivate) {
        router.onEnter = function ($injector) {
            let result;
            if (router.canActivate) {
                router.canActivate.forEach(function (guard) {
                    const instance: CanActivate = <any>$injector.instantiate(guard);
                    result = result || instance.canActivate();
                });
            }
            return result;
        };
        router.onEnter['$inject'] = ['$injector'];
    }
    $stateProvider.state(router.name, router);
}

function fromState(state: IRouter) {
    state.component && transformCompToString(state);

    state.views && forEach(state.views, function (view: IRouter, key) {
        view.component && transformCompToString(view);
    });

    return state;
}

function transformCompToString(state: IRouter) {
    const comp = state.component;
    const option: IComponentOptions = comp[Names.component];
    state.component = strandToCamel(option.selector || String(comp));
}

function getModule(config) {
    class ErrorHandlerOverwrite {
        static $inject = ['$state', '$log'];

        constructor($state: angular.ui.IStateService) {
            $state['defaultErrorHandler'](() => {
            });
        }
    }

    @NgModule({
        imports: ['ui.router'],
        configs: [config],
        runs: [ErrorHandlerOverwrite]
    })
    class Module {
    }

    return Module;
}