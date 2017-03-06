// Created by baihuibo on 2017/3/6.


import {NgModule} from "core";
import {IRouter} from "router";
import {RouterModule} from "router";

const routers: IRouter[] = [];

@NgModule({
    imports: [RouterModule.forChild(routers)]
})
export class NextAsyncRoutingModule {

}