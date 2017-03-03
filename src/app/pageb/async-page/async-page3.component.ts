// Created by baihuibo on 2017/3/2.

import {Component} from "core";

@Component({
    template: `
        <h1>async page3 component</h1>
    `
})
export class AsyncPage3Component {
    static $inject = ['$resource'];

    constructor($resource) {
        console.log('testService', $resource);
    }
}