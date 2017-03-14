// Created by baihuibo on 2016/12/21.
import {Directive} from "angular-core";

@Directive({
    selector: '[test]'
})
export class TestDirective {
    static $inject: string[] = ['$element'];

    constructor($element: JQuery) {
        $element.css('color', 'red');
    }
}