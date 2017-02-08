// Created by baihuibo on 2016/12/22.
import {Component, Input, Output, Require} from "core";
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

    @Input() people;

    @Output() peopleClick: Function;

    @Require('^app') appCtrl: AppComponent;

    $onInit() {
        this.$log.log('people', this.people);
        this.$log.log('people component $onInit :', this.appCtrl);
    }
}