// Created by baihuibo on 2016/12/16.
import {Component} from "angular-core";
import {ILogService} from "angular";

@Component({
    templateUrl: './pageb.component.html'
})
export class PageBComponent {
    static $inject = ['$state', '$log'];

    constructor($state: angular.ui.IStateService, $log: ILogService) {

    }

    gradient: any = {id: 1, name: 'baihuibo'};
}