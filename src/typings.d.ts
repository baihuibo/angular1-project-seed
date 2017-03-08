// Created by baihuibo on 2016/12/15.
///<reference path="../node_modules/@types/angular/index.d.ts"/>

declare module "router" {
    export module RouterModule {
        export function forRoot(routers: IRouter[]);

        export function forChild(routers: IRouter[]);
    }

    /**
     * 路由配置
     */
    export interface IRouter {
        name?: string;
        template?: string | {(params: angular.ui.IStateParamsService): string};
        templateUrl?: string | {(params: angular.ui.IStateParamsService): string};
        templateProvider?: Function | Array<string | Function>;
        component?: string | Function;
        controller?: Function | string | Array<string | Function>;
        controllerAs?: string;
        controllerProvider?: Function | Array<string | Function>;
        parent?: string | IRouter;
        resolve?: {[name: string]: any, loadChildren?: any};
        url?: string | angular.ui.IUrlMatcher;
        redirectTo?: string | Function | any[];
        params?: any;
        views?: {[name: string]: IRouter};
        abstract?: boolean;

        children?: IRouter[];

        canActivate?: Array<Function>;
        canActivateChild?: Function;
        CanDeactivate?: Function;

        onEnter?: Function | Array<string | Function>;
        onExit?: Function | Array<string | Function>;
        data?: any;
        reloadOnSearch?: boolean;
        cache?: boolean;
    }

    /**
     * 决定路由器是否允许激活
     */
    export interface CanActivate {
        canActivate();
    }

    /**
     * 是否允许激活子路由
     */
    export interface CanActivateChild {
        canActivateChild();
    }
}

declare module "core" {
    import IDirectiveCompileFn = angular.IDirectiveCompileFn;
    import Injectable = angular.Injectable;
    import IControllerConstructor = angular.IControllerConstructor;
    import IDirectiveLinkFn = angular.IDirectiveLinkFn;
    import IDirectivePrePost = angular.IDirectivePrePost;
    import IAttributes = angular.IAttributes;

    export enum Names{
        component,
        directive,
        module,
        injectable,
        pipe
    }

    export function Component(option: IComponentOptions);

    export function NgModule(option: IModule);

    export function Injectable(option: InjectableOption);

    export function Pipe(option: InjectableOption);

    export function Directive(option: IDirectiveOption);

    export function Input(name?: string, optional?: boolean);

    export function InputOnly(name?: string, optional?: boolean);

    export function Bindings(name?: string, optional?: boolean);

    export function Output(name?: string);

    export function ViewParent(comp: Function);

    export function strandToCamel(str: string): string;

    export function asyncModuleRegister(moduleClasses: Function);

    /**
     * 组件配置
     */
    interface IComponentOptions {
        selector?: string
        controller?: string | Injectable<any>;
        controllerAs?: string;
        template?: string;
        templateUrl?: string;
        styleUrls?: string[];
        styles?: string[];
        bindings?: {[boundProperty: string]: string};
        transclude?: boolean | {[slot: string]: string};
        require?: {[controller: string]: string};
    }

    /**
     * 指令配置
     */
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

    /**
     * 模块配置
     */
    interface IModule {
        name?: string // 模块名称
        imports?: any[] // 导入模块,路由模块

        declarations?: any[]// 组件，指令，管道
        providers?: any[] // 服务提供

        configs?: any[] // 模块配置
        runs?: any[] // 运行时模块

        bootstrap?: any[]
    }

    /** 可允许注入的name参数 */
    interface InjectableOption {
        name: string
    }

    /**
     * 管道接口
     * @example
     *
     * ```ts
     * @Pipe({name : 'test'})
     * class TestPipe implements PipeTransform{
     *      transform(value){
     *          return value + '!!!';
     *      }
     * }
     * ```
     *
     * ```html
     * {{ 'hello word' | test}}
     * ```
     *
     */
    interface PipeTransform {
        transform(value: any, ...args: any[]): any
    }
}


interface webpackRequire {
    (mod: string): any
    ensure(mod: string[], done: Function);
}

declare const require: webpackRequire;