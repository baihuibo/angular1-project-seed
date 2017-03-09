// Created by baihuibo on 2016/12/15.
import {Component} from "angular-core";
import {TestService} from "./share/test.service";
import {ILogService} from "angular";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    peopleList = [{
        name: 'xiaobai',
        age: 11
    }, {
        name: 'xiaohei',
        age: 13
    }];

    static $inject = ['$log', 'TestService'];

    constructor(private $log: ILogService, testService: TestService) {
        console.log(testService);
    }

    peopleClick(peopleReturnValue) {
        this.$log.log('clicked', peopleReturnValue);
    }
}