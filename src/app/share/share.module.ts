// Created by baihuibo on 2016/12/20.
import {NgModule} from "annotation";

import {CoreService} from "./core.service";

import "angular-ui-router";
import "angular-resource";

@NgModule({
    imports: ['ui.router', 'ngResource'],
    services: [CoreService]
})
export class ShareModule {
}