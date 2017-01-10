// Created by baihuibo on 2016/12/16.
import {Component} from "annotation";
import {CoreService} from "../share/core.service";

@Component({
    template: require('./pageb.component.html')
})
export class PageBComponent {
    static $inject = ['$state', 'CoreService', '$log'];

    constructor($state: angular.ui.IStateService, core: CoreService, $log: angular.ILogService) {

    }

    gradient: any;

    setGradient() {
        this.gradient = {id: 1, name: 'baihuibo'};
    }
}