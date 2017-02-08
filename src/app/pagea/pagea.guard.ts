// Created by baihuibo on 2017/2/8.
import {CanActivate} from "core";

export class PageAGuard implements CanActivate {

    static $inject = ['$state', '$log'];

    constructor(private $state: angular.ui.IStateService,
                private $log: angular.ILogService) {
    }

    canActivate() {
        this.$log.log('不允许激活');
        return false;
    }
}