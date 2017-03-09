// Created by baihuibo on 2017/3/6.
import {NgModule} from "angular-core";
import {ShareModule} from "../../../share/share.module";
import {NextAsyncPageComponent} from "./next-async-page.component";
import {NextAsyncRoutingModule} from "./next-async-routing.module";

@NgModule({
    imports: [ShareModule, NextAsyncRoutingModule],
    declarations: [NextAsyncPageComponent]
})
export class NextAsyncModule {

}