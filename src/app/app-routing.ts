// Created by baihuibo on 2016/12/17.
import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";
import {Router} from "core";

export const AppRouting: Router[] = [{
    url: '/pagea',
    name: 'pagea',
    component: PageAComponent
}, {
    url: '/pageb',
    name: 'pageb',
    component: PageBComponent,
    onEnter: class {
        static $inject = ['$state'];

        constructor($state) {
            return false;
        }
    }
}];

export class DefaultRoutingConfig {
    static $inject = ['$urlRouterProvider'];

    constructor($urlRouterProvider: angular.ui.IUrlRouterProvider) {
        $urlRouterProvider.when('', '/pagea');
        $urlRouterProvider.otherwise('/pagea');
    }
}