// Created by baihuibo on 2016/12/17.
import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";

export const AppRouting = [{
    url: '/pagea',
    name: 'pagea',
    component: PageAComponent
}, {
    url: '/pageb',
    name: 'pageb',
    component: PageBComponent
}];

export class DefaultRoutingConfig {
    static $inject = ['$urlRouterProvider'];

    constructor($urlRouterProvider: angular.ui.IUrlRouterProvider) {
        $urlRouterProvider.when('', '/pagea');
        $urlRouterProvider.otherwise('/pagea');
    }
}