// Created by baihuibo on 2016/12/15.
///<reference path="../node_modules/@types/angular/index.d.ts"/>

declare module "core" {
    import IDirectiveCompileFn = angular.IDirectiveCompileFn;
    import Injectable = angular.Injectable;
    import IControllerConstructor = angular.IControllerConstructor;
    import IDirectiveLinkFn = angular.IDirectiveLinkFn;
    import IDirectivePrePost = angular.IDirectivePrePost;
    import IAttributes = angular.IAttributes;
    import IStateParamsService = angular.ui.IStateParamsService;
    import IUrlMatcher = angular.ui.IUrlMatcher;

    export function Component(option: IComponentOptions);

    export function NgModule(option: IModule);

    export function Injectable(option: InjectableOption);

    export function Directive(option: IDirectiveOption);

    export function Input(name?: string, optional?: boolean);

    export function InputOnly(name?: string, optional?: boolean);

    export function Bindings(name?: string, optional?: boolean);

    export function Output(name?: string);

    export function Require(require?: string);

    interface IComponentOptions {
        selector?: string
        controller?: string | Injectable<any>;
        controllerAs?: string;
        template?: string | Injectable<(...args: any[]) => string>;
        templateUrl?: string | Injectable<(...args: any[]) => string>;
        bindings?: {[boundProperty: string]: string};
        transclude?: boolean | {[slot: string]: string};
        require?: {[controller: string]: string};
    }

    interface IDirectiveOption {
        selector: string
        compile?: IDirectiveCompileFn;
        controller?: string | Injectable<IControllerConstructor>;
        controllerAs?: string;
        bindToController?: boolean | {[boundProperty: string]: string};
        link?: IDirectiveLinkFn | IDirectivePrePost;
        multiElement?: boolean;
        priority?: number;
        replace?: boolean;
        require?: string | string[] | {[controller: string]: string};
        restrict?: string;
        scope?: boolean | {[boundProperty: string]: string};
        template?: string | ((tElement: JQuery, tAttrs: IAttributes) => string);
        templateNamespace?: string;
        templateUrl?: string | ((tElement: JQuery, tAttrs: IAttributes) => string);
        terminal?: boolean;
        transclude?: boolean | 'element' | {[slot: string]: string};
    }

    interface IModule {
        name?: string // 模块名称
        imports?: any[] // 导入模块
        routers?: any[] // 路由支持
        components?: any[] // 组件支持
        directives?: any[] // 指令支持
        services?: any[] // 服务提供
        providers?: any[] // 服务提供
        configs?: any[] // 模块配置
        runs?: any[] // 运行时模块
        pipes?: any[] // 过滤器 filter服务支持
        bootstrap?: any[]
    }

    interface CanActivate {
        canActivate();
    }

    interface CanActivateChild {
        canActivateChild();
    }

    interface InjectableOption {
        name: string
    }

    interface Router {
        name?: string;
        template?: string | {(params: IStateParamsService): string};
        templateUrl?: string | {(params: IStateParamsService): string};
        templateProvider?: Function | Array<string | Function>;
        component?: string | Function;
        controller?: Function | string | Array<string | Function>;
        controllerAs?: string;
        controllerProvider?: Function | Array<string | Function>;
        parent?: string | Router;
        resolve?: {[name: string]: any};
        url?: string | IUrlMatcher;
        params?: any;
        views?: {[name: string]: Router};
        abstract?: boolean;

        canActivate?: Array<Function>;
        canActivateChild?: Function;
        CanDeactivate?: Function;

        onEnter?: Function | Array<string | Function>;
        onExit?: Function | Array<string | Function>;
        data?: any;
        reloadOnSearch?: boolean;
        cache?: boolean;
    }
}

declare const require;