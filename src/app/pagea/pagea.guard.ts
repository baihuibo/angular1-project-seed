// Created by baihuibo on 2017/2/8.
import {CanActivate} from "angular-core-router";
import {ILogService} from "angular";

export class PageAGuard implements CanActivate {

    static $inject: string[] = ['$state', '$log'];

    constructor(private $state: angular.ui.IStateService,
                private $log: ILogService) {
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