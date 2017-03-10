// Created by baihuibo on 2017/3/10.

import {Pipe, PipeTransform} from "angular-core";
@Pipe({
    name: "name"
})
export class NamePipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return 'name_pipe ' + value;
    }
}