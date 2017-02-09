// Created by baihuibo on 2016/12/22.
import {Component, Input, Output, ViewParent} from "core";
import {AppComponent} from "./app.component";

@Component({
    selector: 'app-people',
    template: `
        <dl ng-click="$ctrl.peopleClick({$event:11})">
            <dt>name : {{$ctrl.people.name}}</dt>
            <dd>age : {{$ctrl.people.age}}</dd>
        </dl>
    `
})
export class PeopleComponent {
    static $inject = ['$log'];

    constructor(private $log: angular.ILogService) {
    }

    private _obj;

    @Input() set people(obj) {
        console.log('people', obj);
        this._obj = obj;
    };

    get people() {
        return this._obj;
    }

    @Output() peopleClick: Function;

    @ViewParent(AppComponent) appCtrl: AppComponent;
}