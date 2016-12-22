// Created by baihuibo on 2016/12/22.
import {Component, Input, Output} from "annotation";

@Component({
    selector: 'appPeople',
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

    @Output() peopleClick;
}