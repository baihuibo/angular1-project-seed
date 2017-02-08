// Created by baihuibo on 16/8/30.
import {module, forEach} from "angular";
import {IModule, InjectableOption, IComponentOptions, IDirectiveOption} from "core";

export enum Names {
    component = 1,
    directive = 2,
    module = 3,
    injectable = 4,
}

export function Component(option: IComponentOptions): any {
    return function (classes) {
        option.selector = option.selector ? strandToCamel(option.selector.trim()) : 'component' + nextId();
        option.controller = classes;
        setMetaData(classes, option, Names.component);
    }
}

export function Directive(option: IDirectiveOption) {
    return function (classes) {
        let selector = option.selector.trim();

        const first = selector[0];

        if (first == '[') {// attr
            selector = selector.slice(1, -1);
            option.restrict = 'A';
        } else if (first == '.') {// class
            selector = selector.slice(1);
            option.restrict = 'C';
        }
        selector = strandToCamel(selector);

        option.controller = classes;
        setMetaData(classes, {
            [selector](){
                return option
            }
        }, Names.directive);
    }
}

export function Injectable(option: InjectableOption) {
    return function (classes) {
        setMetaData(classes, {
            [option.name]: classes
        }, Names.injectable);
    }
}

export function NgModule(option: IModule) {
    return function (classes) {
        classes[Names.module] = option.name || "module" + nextId();
        const mod = module(classes[Names.module], transformImports(option.imports || []));

        registerProviders(option.providers, 'provider', Names.injectable);
        registerProviders(option.services, 'service', Names.injectable);
        registerProviders(option.pipes, 'filter', Names.injectable);
        registerProviders(option.directives, 'directive', Names.directive);
        registerProviders(option.configs, 'config');
        registerRouter(option.routers);
        registerComponents(option.components);

        function transformImports(imports: any[]) {
            return imports.map(module => {
                if (typeof module === 'string') {
                    return module;
                }
                return module[Names.module] || module.name;
            });
        }

        function registerComponents(comps: any[]) {
            comps && comps.forEach(comp => {
                const option: IComponentOptions = comp[Names.component];
                mod.component(option.selector, option);
            });
        }

        function registerProviders(items: any[], method: string, names?: Names) {
            items && items.forEach(item => mod[method](names ? item[names] : item));
        }

        function registerRouter(routers: any[]) {
            routers && routers.forEach(router => {
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

        function fromState(state: angular.ui.IState) {
            state.component && transformCompToString(state);

            if (state.views) {
                forEach(state.views, function (view: angular.ui.IState, key) {
                    view.component && transformCompToString(view);
                });
            }

            return state;
        }

        function transformCompToString(state: angular.ui.IState) {
            const comp = state.component;
            const option: IComponentOptions = comp[Names.component];
            state.component = option.selector || comp;
        }
    }
}

export function Input(name?: string, optional?: boolean) {
    return bindings_proxy(name, optional ? '<?' : '<');
}
export function InputOnly(name?: string, optional?: boolean) {
    return bindings_proxy(name, optional ? '@?' : '@');
}
export function Bindings(name?: string, optional?: boolean) {
    return bindings_proxy(name, optional ? '=?' : '=');
}
export function Output(name?: string) {
    return bindings_proxy(name, '&');
}

export function Require(require: string) {
    return function (target, key) {
        setMetaData(target.constructor, {
            require: {[key]: require}
        }, Names.component);
    }
}

function bindings_proxy(name, symbol) {
    return function (target, key) {
        setMetaData(target.constructor, {
            bindings: {[name || key]: symbol}
        }, Names.component);
    }
}

function setMetaData(classes, option, names: Names) {
    classes[names] = classes[names] || {};
    if (option) {
        Object.assign(classes[names] , option);
    }
}

// 串转驼峰 (aaa-test) => (aaaTest)
function strandToCamel(name: string) {
    return name.replace(/-([a-z])/g, fnCamelCaseReplace);
}

function fnCamelCaseReplace(all, letter) {
    return letter.toUpperCase();
}

let id = 0;
function nextId() {
    return ++id;
}