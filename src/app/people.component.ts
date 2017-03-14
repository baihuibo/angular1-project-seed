// Created by baihuibo on 2016/12/22.
import {Component, Input, Output, ViewParent} from "angular-core";
import {AppComponent} from "./app.component";
import {ILogService} from "angular";

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
    static $inject: string[] = ['$log'];

    constructor(private $log: ILogService) {
    }

    @Input() people;

    @Output() peopleClick: Function;

    @ViewParent(AppComponent) appCtrl: AppComponent;
}