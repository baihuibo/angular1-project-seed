// Created by baihuibo on 2016/12/15.
import {Component} from "annotation";

@Component({
    template: require('./app.component.html'),
    controllerAs: 'ctrl'
})
export class AppComponent {
    static $inject = [];
    static componentName = 'app';

    list = ['a', 'b', 'c']
}