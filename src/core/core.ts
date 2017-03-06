// Created by baihuibo on 16/8/30.
import {module, forEach, merge, element, injector} from "angular";
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
    loaded: '_loaded_',
    registerFn: '_moduleRegister_'
};

let globalTimer: number;
function globalDigest() {// 触发全局的值检查
    clearTimeout(globalTimer);
    globalTimer = setTimeout(function () {
        element(document)['scope']().$digest();
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
        classes[Names.module] = option.name || `ngModule_${classes.name}_${nextId()}`;
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

                const requires = mod.requires;
                const runBlocks = [];
                const modulesToLoad = ['ng'];

                mod[NameMap.registerFn] = function (childModuleName) {
                    // 不要注入重复的模块
                    if (!requires.includes(childModuleName)) {
                        requires.push(childModuleName);
                        if (mod['asyncModule']) {// 如果本身就是异步注入的模块，那就注入到当前节点的上级模块
                            mod['rootModule'][NameMap.registerFn](childModuleName);
                        } else {
                            register(childModuleName);
                            startRunsBlock(runBlocks);
                            runBlocks.length = 0;// clear all
                            modulesToLoad.length = 1;
                        }
                    }

                    function register(moduleName) {
                        const childModule = module(moduleName);
                        if (!childModule[NameMap.loaded]) {
                            modulesToLoad.push(moduleName);

                            childModule['rootModule'] = mod;// 保存真实的上级模块

                            // 1 加载依赖模块
                            childModule.requires.forEach(sub => register(sub));

                            // 2 运行注册服务，组件，配置
                            startRegisterBlock(childModule['_invokeQueue']);
                            startRegisterBlock(childModule['_configBlocks']);

                            // 3 运行初始化模块方法
                            runBlocks.push(...childModule['_runBlocks']);

                            childModule[NameMap.loaded] = true;
                        }
                    }
                };

                function startRunsBlock(queues) {
                    // 启动所有应用的运行模块
                    // queues.forEach(block => $injector.invoke(block));
                }

                function startRegisterBlock(queues) {
                    queues.forEach(([register, method, args]) => {
                        const provider = providers[register];
                        const copyArgs = Array.from(args).slice();
                        const suffix = method.charAt(0).toUpperCase() + method.slice(1);

                        let [first] = copyArgs;
                        if (Array.isArray(first)) {
                            // config
                        } else if (typeof first === 'string') {
                            // component,directive,service,filter
                            if ($injector.has(first + suffix)) {
                                return; // 不注册重复的组件和服务
                            }
                        } else {
                            // service , directive, filter
                            for (let [key, value] of Object.entries(first)) {
                                // 重复的组件不在注入父模块
                                if ($injector.has(key + suffix)) {
                                    delete first[key];
                                }
                            }
                            copyArgs[0] = first;
                        }
                        provider[method].apply(provider, copyArgs);
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

function bindings_proxy(name: string, symbol: string) {
    return function (target, key) {
        setMetaData(target.constructor, {
            bindings: {[key]: symbol + (name || key)}
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