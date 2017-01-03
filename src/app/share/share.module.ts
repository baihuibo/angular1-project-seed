// Created by baihuibo on 2016/12/20.
import {NgModule} from "annotation";

import {CoreService} from "./core.service";
import {HttpProxy} from "./http-proxy.service";

import "angular-ui-router";
import "angular-resource";

@NgModule({
    imports: ['ui.router', 'ngResource'],
    services: [CoreService, HttpProxy]
})
export class ShareModule {
}