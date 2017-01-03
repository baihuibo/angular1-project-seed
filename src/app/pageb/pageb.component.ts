// Created by baihuibo on 2016/12/16.
import {Component} from "annotation";
import {CoreService} from "../share/core.service";

@Component({
    template: require('./pageb.component.html'),
    controllerAs: 'ctrl'
})
export class PageBComponent {
    static $inject = ['$state', 'CoreService', '$log'];

    constructor($state, core: CoreService, $log: angular.ILogService) {
    }
}