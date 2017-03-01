// Created by baihuibo on 2016/12/17.
import {NgModule} from "core";
import {RouterModule, IRouter} from "router";
import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";
import {PageAGuard} from "./pagea/pagea.guard";

const configs: IRouter[] = [{
    url: '/pagea',
    name: 'pagea',
    component: PageAComponent,
    canActivate: [PageAGuard]
}, {
    url: '/pageb',
    name: 'pageb',
    component: PageBComponent
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