// Created by baihuibo on 2017/3/1.

import {IRouter, CanActivate} from "router";
import {Names, NgModule, IComponentOptions} from "core";
import {forEach} from "angular";
import "angular-ui-router";
import {strandToCamel} from "core";
// import "ng-ui-router-state-events"; // 暂时不启用此插件

export module RouterModule {
    export function forRoot(routers: IRouter[]) {
        return getModule(class RouterRegister {
            static $inject = ['$stateProvider', '$urlRouterProvider'];

            constructor($stateProvider: angular.ui.IStateProvider,
                        $urlRouterProvider: angular.ui.IUrlRouterProvider) {
                routers.forEach(router => {
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