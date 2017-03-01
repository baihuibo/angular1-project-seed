// Created by baihuibo on 2017/3/1.

import {Directive} from "core";
@Directive({
    selector: '[instance]'
})
export class InstanceDirective {
    static $inject = ['$element', '$scope', '$attrs', '$parse'];

    constructor($el, $scope, $attrs, $parse) {
        const elName = InstanceDirective.camelCase($el[0].localName);

        if ($attrs.instance) {
            const setter = $parse($attrs.instance).assign;
            setter($scope, $el.data(`$${elName}Controller`) || $el[0]);
        }
    }

    static camelCase(str) {
        return str.replace(/-(\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        });
    }
}