// Created by baihuibo on 2016/12/15.
import {Component} from "annotation";

@Component({
    selector: 'app',
    template: require('./app.component.html')
})
export class AppComponent {
    static $inject = [];

    peopleList = [{
        name: 'xiaobai',
        age: 11
    }, {
        name: 'xiaohei',
        age: 13
    }];

    peopleClick(peopleReturnValue) {
        console.log('clicked', peopleReturnValue);
    }
}