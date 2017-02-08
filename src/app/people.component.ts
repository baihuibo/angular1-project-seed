// Created by baihuibo on 2016/12/22.
import {Component, Input, Output, Require} from "core";
import {AppComponent} from "./app.component";

@Component({
    selector: 'app-people',
    template: `
        <dl ng-click="ctrl.peopleClick({$event:11})">
            <dt>name : {{ctrl.people.name}}</dt>
            <dd>age : {{ctrl.people.age}}</dd>
        </dl>
    `,
    controllerAs: 'ctrl'
})
export class PeopleComponent {
    static $inject = [];

    @Input() people;

    @Output() peopleClick: Function;

    @Require('^app') appCtrl: AppComponent;

    $onInit() {
        console.log('people component :', this.appCtrl);
    }
}