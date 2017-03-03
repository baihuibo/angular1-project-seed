// Created by baihuibo on 2017/3/3.
import {NgModule} from "core";
import {IRouter} from "router";
import {RouterModule} from "router";
import {AsyncPage2Component} from "./async-page2.component";
import {AsyncPage3Component} from "./async-page3.component";

const routers: IRouter[] = [
    {
        url: '/async-page',
        name: 'pageb.async-page2',
        component: AsyncPage2Component
    }, {
        url: '/async-page',
        name: 'pageb.async-page3',
        component: AsyncPage3Component
    }
];

@NgModule({
    imports: [RouterModule.forChild(routers)]
})
export class AsyncPageRoutingModule {
}