// Created by baihuibo on 16/8/30.
import {module, forEach} from "angular";
import {IModule, InjectableOption, IComponentOptions, IDirectiveOption} from "annotation";

const uniqcomp = {};
export function Component(option: IComponentOptions): any {
    return function (classes) {
        option.selector = option.selector || 'comp' + nextId();
        if (uniqcomp[option.selector]) {
            throw `请不要设置重复的 'selector' 名称(${option.selector})`;
        }
        uniqcomp[option.selector] = true;
        option.controller = classes;
        classes['$componentOption'] = option;
    }
}

export function Directive(option: IDirectiveOption) {
    return function (classes) {
        if (option.selector) {
            const first = option.selector[0];
            if (first == '[') {// attr
                option.selector = option.selector.slice(1, -1);
                option.restrict = 'A';
            } else if (first == '.') {// class
                option.selector = option.selector.slice(1);
                option.restrict = 'C';
            }
        }
        option.controller = classes;
        classes['$directiveOption'] = {
            [option.selector]() {
                return option;
            }
        };
    }
}

export function Injectable(option: InjectableOption) {
    return function (classes) {
        classes['$injectable'] = {
            [option.name]: classes
        };
    }
}

export function NgModule(option: IModule) {
    return function (target) {
        target['$moduleName'] = option.name || "module" + nextId();
        const mod = module(target['$moduleName'], transformImports(option.imports || []));

        option.providers && registerProviders(option.providers, 'provider', '$injectable');
        option.services && registerProviders(option.services, 'service', '$injectable');
        option.pipes && registerProviders(option.pipes, 'filter', '$injectable');
        option.directives && registerProviders(option.directives, 'directive', '$directiveOption');
        option.configs && registerProviders(option.configs, 'config');

        if (option.routers) {
            registerRouter(option.routers);
        }
        if (option.components) {
            registerComponents(option.components);
        }

        function transformImports(imports: any[]) {
            return imports.map(item => {
                if (typeof item === 'string') {
                    return item;
                }
                return item['$moduleName'] || item.name;
            })
        }

        function registerComponents(comps: any[]) {
            comps.forEach(comp => {
                const option: IComponentOptions = comp['$componentOption'];
                mod.component(option.selector, option);
            });
        }

        function registerProviders(prods: any[], method: string, inject?: string) {
            prods.forEach(prod => mod[method](inject ? prod[inject] : prod));
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
            state.component && transformCompToString(state);

            if (state.views) {
                forEach(state.views, function (view, key) {
                    view.component && transformCompToString(view);
                });
            }

            return state;
        }

        function transformCompToString(state) {
            const component = state.component;
            const option: IComponentOptions = component['$componentOption'];
            state.component = option.selector || component;
        }
    }
}

let id = 0;
function nextId() {
    return ++id;
}