// Created by baihuibo on 2016/12/17.
import {NgModule} from "core";
import {RouterModule, IRouter} from "router";
import {PageAComponent} from "./pagea/pagea.component";
import {PageAGuard} from "./pagea/pagea.guard";

const configs: IRouter[] = [{
    url: '/pagea',
    name: 'pagea',
    component: PageAComponent,
    canActivate: [PageAGuard]
}, {
    url: '/pageb',
    name: 'pageb',
    component: 'app-async-page',
    resolve: {
        loadChildren: "./pageb/async-page/async-page.module.ts#AsyncPageModule"
    }
}, {
    url: '',
    redirectTo: '/pagea',
}, {
    url: '**',
    redirectTo: '/pagea'
}];

@NgModule({
    imports: [RouterModule.forRoot(configs)]
})
export class AppRoutingModule {
}