// Created by baihuibo on 2017/3/6.


import {Component} from "angular-core";
import {ShowColorComponent} from "../../../share/show-color/show-color.component";
@Component({
    selector: 'next-async-page',
    template: `
        <h1>Next async page.</h1>
        
        <button ng-click="$ctrl.setColor('black')">set color black</button>
        <button ng-click="$ctrl.setColor('yellow')">set color yellow</button>
        <app-show-color alias="$ctrl.showColor"></app-show-color>
    `
})
export class NextAsyncPageComponent {
    showColor: ShowColorComponent;

    constructor() {

    }

    setColor(color: string) {
        this.showColor.setColor(color);
    }
}