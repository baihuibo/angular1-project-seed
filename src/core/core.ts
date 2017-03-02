// Created by baihuibo on 16/8/30.
import {module, forEach, merge} from "angular";
import {
    IModule,
    InjectableOption,
    IComponentOptions,
    IDirectiveOption,
    PipeTransform
} from "core";

export enum Names {
    component = 1,
    directive = 2,
    module = 3,
    injectable = 4,
    pipe = 5
}

const NameMap = {
    done: '_done_',
    registerFn: '_moduleRegister_'
};

let globalTimer: number;
function globalDigest() {// 触发全局的值检查
    clearTimeout(globalTimer);
    globalTimer = setTimeout(function () {
        $(document)['scope']().$digest();
    }, 1);
}

export function Component(option: IComponentOptions): any {
    return function (classes) {
        option.selector = option.selector ? strandToCamel(option.selector.trim()) : 'component' + nextId();
        option.controller = classes;
        let {prototype} = classes;
        if (prototype.$onInit) {
            let old = prototype.$onInit;
            prototype.$onInit = function () {
                setImmediate(() => {
                    old.call(this);
                    globalDigest();
                });
            };
        }
        setMetaData(classes, option, Names.component);
    }
}

export function Directive(option: IDirectiveOption) {
    return function (classes) {
        let selector = option.selector.trim();

        const first = selector[0];

        if (first == '[' && selector.slice(-1) == ']') {// attr
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
        classes[Names.module] = option.name || `ng_module_${classes.name}_${nextId()}`;
        const mod = module(classes[Names.module], transformImports(option.imports || []));

        registerProviders(option.providers, 'service', Names.injectable);
        registerProviders(option.configs, 'config');
        registerProviders(option.runs, 'run');

        registerDeclarations(option.declarations);

        mod.config(['$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$injector',
            function ($controllerProvider, $provide, $compileProvider, $filterProvider, $injector) {
                const providers = {
                    $controllerProvider, $compileProvider, $filterProvider, $provide, $injector
                };

                console.log($controllerProvider);
                mod[NameMap.registerFn] = function registerFn(childModuleName) {
                    const child = module(childModuleName);

                    if (!child[NameMap.done]) {

                        startRegisterBlock(child['_invokeQueue']);
                        startRegisterBlock(child['_configBlocks']);

                        child.requires.forEach(sub => registerFn(sub));

                        startRunsBlock(child['_runBlocks']);

                        child[NameMap.done] = true;
                    }
                };

                function startRunsBlock(queues) {
                    // 启动所有应用的运行模块
                    // TODO 问题，尚未解决子模块依赖的模块队列如何异步执行如队列
                    queues.forEach(block => $injector.invoke(queues));
                }

                function startRegisterBlock(queues) {
                    queues.forEach(args => {// 向父模块注入所有服务，启动所有配置服务
                        const provider = providers[args[0]];
                        provider[args[1]].apply(provider, args[2]);
                    });
                }
            }]);

        function registerDeclarations(list: any[]) {
            list && list.filter(filterEmptyItem).forEach(item => {
                const pipe = item[Names.pipe];
                const component: IComponentOptions = item[Names.component];
                const directive = item[Names.directive];
                if (pipe) {
                    mod.filter(pipe.name, ['$injector', function ($injector) {
                        const instance: PipeTransform = $injector.instantiate(item);
                        return function (value, ...args) {
                            return instance.transform(value, ...args);
                        }
                    }]);
                } else {
                    component && mod.component(component.selector, component);
                    directive && mod.directive(directive);
                }
            });
        }

        function transformImports(imports: any[]) {
            return imports.filter(filterEmptyItem).map(module => {
                if (typeof module === 'string') {
                    return module;
                }
                return module[Names.module] || module.name || 'ng';
            });
        }

        function registerProviders(items: any[], method: string, names?: Names) {
            items && items.filter(filterEmptyItem).forEach(item => mod[method](names ? item[names] : item));
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

export function ViewParent(comp: Function) {
    return function (target, key) {
        const compOption: IComponentOptions = comp[Names.component];
        setMetaData(target.constructor, {
            require: {[key]: '?^' + compOption.selector}
        }, Names.component);
    }
}

export function asyncModuleRegister(parent, childEsModule, ngModuleName) {
    const parentModule = module(parent[Names.module]);
    const childNodeName = childEsModule[ngModuleName][Names.module];
    parentModule[NameMap.registerFn](childNodeName);
}

function bindings_proxy(name, symbol) {
    return function (target, key) {
        setMetaData(target.constructor, {
            bindings: {[name || key]: symbol}
        }, Names.component);
    }
}

function setMetaData(classes, option, names: Names) {
    classes[names] = merge(classes[names] || {}, option);
}

// 串转驼峰 (aaa-test) => (aaaTest)
export function strandToCamel(name: string) {
    return name.replace(/-([a-z])/g, fnCamelCaseReplace);
}

function fnCamelCaseReplace(all, letter) {
    return letter.toUpperCase();
}

let id = 0;
function nextId() {
    return ++id;
}

function filterEmptyItem(i) {
    return !!i;
}