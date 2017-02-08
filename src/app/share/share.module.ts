// Created by baihuibo on 2016/12/20.
import {NgModule} from "core";

import {CoreService} from "./core.service";
import {HttpProxy} from "./http-proxy.service";

@NgModule({
    imports: ['ui.router', 'ngResource'],
    services: [CoreService, HttpProxy]
})
export class ShareModule {
}