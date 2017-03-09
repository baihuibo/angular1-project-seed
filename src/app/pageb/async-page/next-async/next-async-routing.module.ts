// Created by baihuibo on 2017/3/6.


import {NgModule} from "angular-core";
import {IRouter} from "angular-core-router";
import {RouterModule} from "angular-core-router";

const routers: IRouter[] = [];

@NgModule({
    imports: [RouterModule.forChild(routers)]
})
export class NextAsyncRoutingModule {

}