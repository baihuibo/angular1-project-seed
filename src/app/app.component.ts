// Created by baihuibo on 2016/12/15.
import {Component} from "core";

@Component({
    selector: 'app',
    template: require('./app.component.html')
})
export class AppComponent {
    peopleList = [{
        name: 'xiaobai',
        age: 11
    }, {
        name: 'xiaohei',
        age: 13
    }];

    static $inject = ['$log'];

    constructor(private $log:angular.ILogService) {

    }

    peopleClick(peopleReturnValue) {
        this.$log.log('clicked', peopleReturnValue);
    }
}