// Created by baihuibo on 2016/12/16.
import {Component} from "angular-core";
import {ILogService} from "angular";

@Component({
    templateUrl: './pageb.component.html'
})
export class PageBComponent {
    static $inject: string[] = ['$state', '$log'];
    gradient: any = {id: 1, name: 'baihuibo'};

    constructor($state: angular.ui.IStateService, $log: ILogService) {

    }

}