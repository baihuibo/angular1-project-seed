// Created by baihuibo on 16/8/30.
import {module, forEach, copy} from "angular";
import {IModule, InjectableOption, IComponentOptions, IDirectiveOption, Router, PipeTransform, CanActivate} from "core";

export enum Names {
    component = 1,
    directive = 2,
    module = 3,
    injectable = 4,
    pipe = 5
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

export function Pipe(option: InjectableOption) {
    return function (classes) {
        classes[Names.pipe] = option;
    }
}

export function NgModule(option: IModule) {
    return function (classes) {
        classes[Names.module] = option.name || "module" + nextId();
        const mod = module(classes[Names.module], transformImports(option.imports || []));

        registerProviders(option.providers, 'provider', Names.injectable);
        registerProviders(option.services, 'service', Names.injectable);
        registerProviders(option.directives, 'directive', Names.directive);
        registerProviders(option.configs, 'config');
        registerProviders(option.runs, 'run');
        registerRouter(option.routers);
        registerComponents(option.components);
        registerPipe(option.pipes);

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

        function registerPipe(pipes: any[]) {
            pipes && pipes.forEach(pipe => {
                const option: InjectableOption = pipe[Names.pipe];
                mod.filter(option.name, ['$injector', function ($injector: angular.auto.IInjectorService) {
                    const instance: PipeTransform = <any>$injector.instantiate(pipe);
                    return function (value, ...args) {
                        return instance.transform(value, ...args);
                    }
                }]);
            });
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

            function register(router: Router, $stateProvider) {
                if (router.canActivate) {
                    router.onEnter = function ($injector: angular.auto.IInjectorService) {
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
    option && extend(classes[names], option);
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

// 深度copy
function extend(obj, deep) {
    for (const key in deep) {
        const target = deep[key];
        if (typeof target === 'object') {
            obj[key] = obj[key] || target.constructor();
            extend(obj[key], target);
        } else {
            obj[key] = target;
        }
    }
}