// Created by baihuibo on 2016/12/16.
import {Component} from "core";

@Component({
    template: require('./pageb.component.html')
})
export class PageBComponent {
    static $inject = ['$state', '$log'];

    constructor($state: angular.ui.IStateService, $log: angular.ILogService) {

    }

    gradient: any;

    setGradient() {
        this.gradient = {id: 1, name: 'baihuibo'};
    }
}