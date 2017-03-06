// Created by baihuibo on 2017/2/8.
import {CanActivate} from "router";

export class PageAGuard implements CanActivate {

    static $inject = ['$state', '$log'];

    constructor(private $state: angular.ui.IStateService,
                private $log: angular.ILogService) {
    }

    canActivate() {
        // promise
        // false
        // promise
        // return Promise.reject(true);
        // return Promise.resolve(false);
        // return false;
    }
}