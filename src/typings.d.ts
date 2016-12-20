// Created by baihuibo on 2016/12/15.
///<reference path="../node_modules/@types/angular/index.d.ts"/>

declare module "annotation" {
    export function Component(option: angular.IComponentOptions);

    export function NgModule(option: IModule);

    export function Injectable(option: InjectableOption);

    interface IModule {
        name?: string // 模块名称
        imports?: any[] // 导入模块
        routers?: any[] // 路由支持
        components?: any[] // 组件支持
        services?: any[] // 服务提供
        providers?: any[] // 服务提供
        configs?: any[] // 模块配置
        pipes?: any[] // 过滤器 filter服务支持
    }
    interface InjectableOption {
        name: string
    }
}


declare var require;