// Created by baihuibo on 2017/2/8.

import {Pipe, PipeTransform} from "core";

@Pipe({
    name: "states"
})
export class StatePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        return value + ' __transform';
    }
}