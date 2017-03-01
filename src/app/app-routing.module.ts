// Created by baihuibo on 2016/12/17.
import {NgModule} from "core";
import {RouterModule, IRouter} from "router";
import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";
import {PageAGuard} from "./pagea/pagea.guard";

const configs: IRouter[] = [{
    url: '/pagea',
    name: 'pagea',
    component: PageAComponent
}, {
    url: '/pageb',
    name: 'pageb',
    component: PageBComponent,
    canActivate: [PageAGuard]
}];

export class DefaultRoutingConfig {
    static $inject = ['$urlRouterProvider'];

    constructor($urlRouterProvider: angular.ui.IUrlRouterProvider) {
        $urlRouterProvider.when('', '/pagea');
        $urlRouterProvider.otherwise('/pagea');
    }
}

@NgModule({
    imports: [RouterModule.forRoot(configs)],
    configs: [DefaultRoutingConfig]
})
export class AppRoutingModule {
}