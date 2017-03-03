// Created by baihuibo on 2017/3/2.
import {NgModule} from "core";
import "angular-resource";
import {AsyncPageComponent} from "./async-page.component";
import {ShareModule} from "../../share/share.module";
import {AsyncPageRoutingModule} from "./async-page-routing.module";
import {AsyncPage2Component} from "./async-page2.component";
import {AsyncPage3Component} from "./async-page3.component";

@NgModule({
    imports: ['ngResource', ShareModule, AsyncPageRoutingModule],
    declarations: [AsyncPageComponent, AsyncPage2Component, AsyncPage3Component]
})
export class AsyncPageModule {

}