// Created by baihuibo on 2016/12/15.
import {Component} from "annotation";

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    controllerAs: 'ctrl'
})
export class AppComponent {
    static $inject = [];

    list = ['a', 'b', 'c']
}