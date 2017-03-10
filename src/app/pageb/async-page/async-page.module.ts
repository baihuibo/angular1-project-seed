// Created by baihuibo on 2017/3/2.
import {NgModule} from "angular-core";
import {AsyncPageComponent} from "./async-page.component";
import {ShareModule} from "../../share/share.module";
import {AsyncPageRoutingModule} from "./async-page-routing.module";
import {AsyncPage2Component} from "./async-page2.component";
import {AsyncPage3Component} from "./async-page3.component";
import {NamePipe} from "./name.pipe";

@NgModule({
    imports: [ShareModule, AsyncPageRoutingModule],
    declarations: [AsyncPageComponent, AsyncPage2Component,
        AsyncPage3Component, NamePipe]
})
export class AsyncPageModule {

}