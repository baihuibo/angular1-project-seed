// Created by baihuibo on 2016/12/21.
import {Directive} from "core";

@Directive({
    selector: '[test]'
})
export class TestDirective {
    static $inject = ['$element'];

    constructor($element) {
        $element.css('color', 'red');
    }
}