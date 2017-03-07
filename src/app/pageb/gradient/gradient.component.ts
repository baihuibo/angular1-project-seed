// Created by baihuibo on 2016/12/16.
import {Component, InputOnly, Input} from "core";

@Component({
    selector: 'app-gradient',
    templateUrl: './gradient.component.html'
})
export class GradientBComponent {

    @InputOnly() modelId: string;

    @Input() gradient: any;

    static $inject = [];

    constructor() {

    }
}