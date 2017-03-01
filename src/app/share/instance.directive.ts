// Created by baihuibo on 2017/3/1.

import {Directive, strandToCamel} from "core";

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
        if ($attrs['#']) {
            const assign = $parse($attrs['#']).assign;
            const name = strandToCamel($el[0].localName);
            assign($scope, $el.data(`$${name}Controller`) || $el[0]);
        }
    }
}