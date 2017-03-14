// Created by baihuibo on 2017/3/6.
import {Component} from "angular-core";

@Component({
    selector: 'app-show-color',
    template: `
        current color : {{$ctrl.color}}
        <p> show color P tag </p>
    `
})
export class ShowColorComponent {

    private color: string = 'red';

    setColor(color: string) {
        this.color = color;
    }
}