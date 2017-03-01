// Created by baihuibo on 2016/12/20.
import {NgModule} from "core";

import "angular-ui-router";
import "angular-resource";
// import "ng-ui-router-state-events"; // 暂时不启用此插件

import {UiRouterDefaultErrorHandlerConfig} from "./ui-router-default-error.config";
import {InstanceDirective} from "./instance.directive";

@NgModule({
    imports: ['ui.router', 'ngResource'],
    services: [],
    directives: [InstanceDirective],
    runs: [UiRouterDefaultErrorHandlerConfig]
})
export class ShareModule {
}