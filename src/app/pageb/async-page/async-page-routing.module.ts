// Created by baihuibo on 2017/3/3.
import {NgModule} from "core";
import {IRouter} from "router";
import {RouterModule} from "router";
import {AsyncPage2Component} from "./async-page2.component";
import {AsyncPage3Component} from "./async-page3.component";

const routers: IRouter[] = [
    {
        name: 'pagec',
        children: [
            {
                url: '/async-page',
                name: 'async-page2',
                component: AsyncPage2Component
            }, {
                url: '/async-page',
                name: 'async-page3',
                component: AsyncPage3Component
            }, {
                url: '/next-async-page',
                name: 'async-page3.next-async-page',
                component: 'next-async-page',
                resolve: {
                    loadChildren: './next-async/next-async.module.ts#NextAsyncModule'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routers)]
})
export class AsyncPageRoutingModule {
}