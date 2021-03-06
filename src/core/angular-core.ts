// Created by baihuibo on 16/8/30.
import {element, IAugmentedJQuery, merge, module} from "angular";
import {IComponentOptions, IDirectiveOption, IModule, InjectableOption, PipeTransform} from "angular-core";

export enum Names {
    component = 1,
    directive = 2,
    module = 3,
    injectable = 4,
    pipe = 5
}

const NameMap = {
    loaded: '_loaded_',
    registerChild: '_moduleRegister_'
};

const nextTick = window.setImmediate || window.setTimeout;
const $doc: IAugmentedJQuery = <IAugmentedJQuery>element(document);

let globalTimer: number;
function globalDigest() {// 触发全局的值检查
    clearTimeout(globalTimer);
    globalTimer = setTimeout(() => $doc.scope().$apply(), 0);
}

export function Component(option: IComponentOptions): any {
    return function (classes) {
        const selector = (option.selector || `app-component${nextId()}`).trim();
        const style = getStyle(option);
        if (style && option.template) {
            // 如果没有样式的情况下，没有必要做scoped隔离
            const attrScoped = 'ngcontent' + nextId(),
                {prototype} = classes, {$onInit} = prototype;
            prototype.$onInit = function () {
                if ($onInit) {
                    nextTick(() => {
                        $onInit.call(this);
                        globalDigest();
                    });
                } else {// 如果未曾实现过此接口，则在样式初始化后销毁它
                    delete prototype.$onInit;
                }
                if (!option['applyStyle']) {
                    addStyle(style, attrScoped, selector);
                    option['applyStyle'] = true;
                }
            };

            option.template = option.template.replace(/<([\w-]+)/g, "<$1 " + attrScoped);
        }

        option.selector = strandToCamel(selector);// 转换为驼峰
        option.controller = classes;
        setMetaData(classes, option, Names.component);
    };
}

export function Directive(option: IDirectiveOption) {
    return function (classes) {
        let selector = option.selector.trim();

        const first = selector[0];

        if (first === '[' && selector.slice(-1) === ']') {// attr
            selector = selector.slice(1, -1);
            option.restrict = 'A';
        } else if (first === '.') {// class
            selector = selector.slice(1);
            option.restrict = 'C';
        }

        option.controller = classes;
        setMetaData(classes, {
            [strandToCamel(selector)]() {
                return option;
            }
        }, Names.directive);
    };
}

export function Injectable(option: InjectableOption) {
    return function (classes) {
        setMetaData(classes, {
            [option.name]: classes
        }, Names.injectable);
    };
}

export function Pipe(option: InjectableOption) {
    return function (classes) {
        classes[Names.pipe] = option;
    };
}

export function NgModule(option: IModule) {
    return function (classes) {
        classes[Names.module] = option.name || `ngModule_${classes.name}_${nextId()}`;
        const iModule = module(classes[Names.module], transformImports(option.imports || []));
        classes['ngModule'] = iModule;

        registerProviders(option.providers, 'service', Names.injectable);
        registerProviders(option.configs, 'config');
        registerProviders(option.runs, 'run');

        registerDeclarations(option.declarations);

        iModule.config(['$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$injector',
            function ($controllerProvider, $provide, $compileProvider, $filterProvider, $injector) {
                iModule['providers'] = {$controllerProvider, $compileProvider, $filterProvider, $provide, $injector};
            }]);

        iModule[NameMap.registerChild] = registerChildModule;
        function registerChildModule(childNgModuleName) {
            // 不要注入重复的模块
            if (!iModule.requires.includes(childNgModuleName)) {
                iModule.requires.push(childNgModuleName);
                addChildrenModule(childNgModuleName);
            }
        }

        function addChildrenModule(childNgModuleName) {
            const childNgModule = module(childNgModuleName);
            if (!childNgModule[NameMap.loaded]) {
                // 1 加载依赖模块
                childNgModule.requires.forEach(name => registerChildModule(name));

                const providers = iModule['providers'], {$injector} = providers;

                // 2 运行注册服务，组件，配置
                _invokeQueues(childNgModule['_invokeQueue'], providers, $injector);
                _invokeQueues(childNgModule['_configBlocks'], providers, $injector);

                childNgModule[NameMap.loaded] = true;
            }
        }

        function _invokeQueues(queues, providers, $injector) {
            queues.forEach(([register, method, args]) => {
                const provider = providers[register];
                const copyArgs = Array.from(args);
                let suffix = 'Provider';

                if (/directive|component/i.test(method)) {
                    suffix = 'Directive';
                }

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
                    for (let [key] of Object.entries(first)) {
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

        function registerDeclarations(list: any[]) {
            list && list.filter(filterEmptyItem).forEach(item => {
                const pipe = item[Names.pipe];
                const component: IComponentOptions = item[Names.component];
                const directive = item[Names.directive];
                if (pipe) {
                    iModule.filter(pipe.name, ['$injector', function ($injector) {
                        const instance: PipeTransform = $injector.instantiate(item);
                        return function (value, ...args) {
                            return instance.transform(value, ...args);
                        };
                    }]);
                } else {
                    component && iModule.component(component.selector, component);
                    directive && iModule.directive(directive);
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
            items && items.filter(filterEmptyItem).forEach(item => iModule[method](names ? item[names] : item));
        }
    };
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
    };
}

export function asyncModuleRegister(ngModuleClasses: Function) {
    const appModule = window['appModule']['ngModule'];
    appModule[NameMap.registerChild](ngModuleClasses[Names.module]);
}

function bindings_proxy(name: string, symbol: string) {
    return function (target, key) {
        setMetaData(target.constructor, {
            bindings: {[key]: symbol + (name || key)}
        }, Names.component);
    };
}

function setMetaData(classes, option, names) {
    classes[names] = merge(classes[names] || {}, option);
}

let id = 0;
function nextId() {
    return ++id;
}

function filterEmptyItem(i) {
    return !!i;
}

// 串转驼峰 (aaa-test) => (aaaTest)
export function strandToCamel(name: string) {
    return name.replace(/-([a-z])/g, function camelCaseReplace(all, letter) {
        return letter.toUpperCase();
    });
}

///// 添加样式
function getStyle(option) {
    let styles = '';
    option.styleUrls && option.styleUrls.forEach(style => {
        styles += style.toString() + '\n';
    });
    option.styles && option.styles.forEach(style => styles += style + '\n');
    return styles.trim();
}

function addStyle(styles: string, scoped: string, selector: string) {
    styles = scopeCss(styles, selector, scoped);

    let styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.media = 'screen';
    if (styleElement['styleSheet']) {
        styleElement['styleSheet'].cssText = styles;
    } else {
        styleElement.appendChild(document.createTextNode(styles));
    }
    styleElement.setAttribute('component', selector);
    document.head.appendChild(styleElement);
}

// 范围css
export function scopeCss(css: string, parent: string, attr: string) {
    css = replace(css, parent, attr);

    // regexp.escape
    let parentRe = parent.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // replace self-selectors
    css = css.replace(new RegExp('(' + parentRe + ')\\s*\\1(?=[\\s\\r\\n,{])', 'g'), '$1');

    // replace `:host` with parent
    css = css.replace(new RegExp('(' + parentRe + ')\\s*:host', 'g'), '$1');

    // revoke wrongly replaced @ statements, like @supports, @import, @media etc.
    css = css.replace(new RegExp('(' + parentRe + ')\\s*@', 'g'), '@');

    return css;
}
function replace(css, parent, attr) {
    // strip block comments
    css = css.replace(/\/\*([\s\S]*?)\*\//g, '');

    return css.replace(/([^\r\n,{}]+)(,(?=[^}]*\{)|\s*\{)/g, function (mat, $1, $2) {
        if ($1.trim() === ':host') {
            return `${parent} ${$2}`;// 如果是host自己，则直接转换为 parent标签
        }
        return `${parent} ${$1.trim()}[${attr}]${$2}`;
    });
}