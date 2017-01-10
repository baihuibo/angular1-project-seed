// Created by baihuibo on 2016/12/16.
import {Component, InputOnly, Input} from "annotation";

@Component({
    selector: 'appGradient',
    template: require('./gradient.component.html')
})
export class GradientBComponent {
    static $inject = [];

    @InputOnly() modelId: string;

    @Input() gradient: any;

    constructor() {

    }
}