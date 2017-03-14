// Created by baihuibo on 2016/12/16.
import {Component} from "angular-core";

@Component({
    selector: 'app-gradient',
    templateUrl: './gradient.component.html'
})
export class GradientBComponent {
    gradient: any;

    static $inject: string[] = [];

    private modelId: string = Date.now().toString();

    constructor() {
        //
    }

    open(gradient) {
        this.gradient = gradient;
        $('#' + this.modelId).modal('show');
    }
}