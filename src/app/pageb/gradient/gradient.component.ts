// Created by baihuibo on 2016/12/16.
import {Component, InputOnly, Input} from "core";

@Component({
    selector: 'app-gradient',
    templateUrl: './gradient.component.html'
})
export class GradientBComponent {

    private modelId: string = Date.now().toString();

    gradient: any;

    static $inject = [];

    constructor() {

    }

    open(gradient) {
        this.gradient = gradient;
        $('#' + this.modelId).modal('show');
    }
}