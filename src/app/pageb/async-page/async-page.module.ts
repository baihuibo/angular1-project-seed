// Created by baihuibo on 2017/3/2.
import {NgModule} from "core";
import {AsyncPageComponent} from "./async-page.component";
import {ShareModule} from "../../share/share.module";

import "angular-resource";

@NgModule({
    imports: ['ngResource', ShareModule],
    declarations: [AsyncPageComponent]
})
export class AsyncPageModule {

}