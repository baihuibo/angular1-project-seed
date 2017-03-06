// Created by baihuibo on 2017/3/6.
import {Component} from "core";

@Component({
    selector: 'app-show-color',
    template: `
        current color : {{$ctrl.color}}
    `
})
export class ShowColorComponent {

    private color = 'red';

    setColor(color: string) {
        this.color = color;
    }
}