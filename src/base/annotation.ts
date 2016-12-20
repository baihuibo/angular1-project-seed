// Created by baihuibo on 16/8/30.
import {module, forEach} from "angular";
import {IModule, InjectableOption} from "annotation";

const uniqcomp = {};
export function Component(option: angular.IComponentOptions): any {
    return function (classes) {
        const name = classes['componentName'] || 'comp' + nextId();
        if (uniqcomp[name]) {
            throw `请不要设置重复的组件名称(${name})`;
        }
        uniqcomp[name] = true;
        option.controller = classes;
        classes['componentName'] = name;
        classes['componentOption'] = option;
    }
}

export function Injectable(option: InjectableOption) {
    return function (classes) {
        classes.serviceName = option.name;
    }
}

export function NgModule(option: IModule) {
    return function (target) {
        target['moduleName'] = option.name || "module" + nextId();
        const mod = module(target['moduleName'], transformImports(option.imports || []));

        if (option.routers) {
            registerRouter(option.routers);
        }
        if (option.components) {
            registerComponents(option.components);
        }
        option.providers && registerProviders(option.providers, 'provider');
        option.services && registerProviders(option.services, 'service');
        option.pipes && registerProviders(option.pipes, 'filter');

        if (option.configs) {
            registerConfigs(option.configs);
        }

        function transformImports(imports: any[]) {
            return imports.map(item => {
                if (typeof item === 'string') {
                    return item;
                }
                return item.moduleName || item.name;
            })
        }

        function registerComponents(comps: any[]) {
            comps.forEach(comp => mod.component(comp['componentName'], comp['componentOption']));
        }

        function registerProviders(prods: any[], method) {
            prods.forEach(prod => mod[method](prod.serviceName, prod));
        }

        function registerConfigs(configs: any[]) {
            configs.forEach(config => mod.config(config));
        }

        function registerRouter(routers: any[]) {
            routers.forEach(router => {
                mod.config(['$stateProvider', function ($stateProvider) {
                    if (Array.isArray(router)) {
                        router.forEach(state => register(fromState(state), $stateProvider));
                    } else if (router.name) {
                        register(fromState(router), $stateProvider);
                    }
                }]);
            });

            function register(state, $stateProvider) {
                $stateProvider.state(state.name, state);
            }
        }

        function fromState(state) {
            state.component && comp(state);

            if (state.views) {
                forEach(state.views, function (view, key) {
                    view.component && comp(view);
                });
            }

            return state;
        }

        function comp(state) {
            state.component = state.component.componentName || state.component;
        }
    }
}

let id = 0;
function nextId() {
    return ++id;
}