// Created by baihuibo on 2017/3/1.

import {Directive} from "core";

/**
 * 绑定组件实例化对象
 * @example
 * ```ts
 * class PeopleComponent{};
 *
 * class TestComponent{
 *   canvas:HTMLCanvasElement
 *
 *   people:PeopleComponent
 *
 *   $onInit(){
 *     console.log(this.canvas);
 *     console.log(this.people);
 *   }
 * }
 * ```
 *
 * ```html
 * <canvas #="$ctrl.canvas"></canvas>
 * <app-people #="$ctrl.people"></app-people>
 * ```
 */

@Directive({
    selector: '[#]'
})
export class InstanceDirective {
    static $inject = ['$element', '$scope', '$attrs', '$parse'];

    constructor($el, $scope, $attrs, $parse) {
        const name = InstanceDirective.camelCase($el[0].localName);

        if ($attrs['#']) {
            const assign = $parse($attrs['#']).assign;
            assign($scope, $el.data(`$${name}Controller`) || $el[0]);
        }
    }

    static camelCase(str) {
        return str.replace(/-(\w)/g, function ($0, $1) {
            return $1.toUpperCase();
        });
    }
}