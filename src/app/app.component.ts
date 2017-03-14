// Created by baihuibo on 2016/12/15.
import {Component} from "angular-core";
import {ILogService} from "angular";
import {TestService} from "./share/test.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    peopleList: any[];

    static $inject: string[] = ['$log', 'TestService'];

    constructor(private $log: ILogService, testService: TestService) {
        console.debug('as');
        console.log(testService);
    }

    $onInit() {
        console.log('asd');

        this.peopleList = [{
            name: 'xiaobai',
            age: 11
        }, {
            name: 'xiaohei',
            age: 13
        }];
    }

    peopleClick(peopleReturnValue) {
        this.$log.log('clicked', peopleReturnValue);
    }
}