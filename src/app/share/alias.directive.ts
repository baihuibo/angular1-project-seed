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
 * <canvas alias="$ctrl.canvas"></canvas>
 * <app-people alias="$ctrl.people"></app-people>
 * ```
 */

@Directive({
    selector: '[alias]'
})
export class AliasDirective {
    static $inject = ['$element', '$scope', '$attrs', '$parse'];

    constructor($el, $scope, $attrs, $parse) {
        if ($attrs['alias']) {
            const assign = $parse($attrs['alias']).assign;
            const name = strandToCamel($el[0].localName);
            assign($scope, $el.data(`$${name}Controller`) || $el[0]);
        }
    }
}