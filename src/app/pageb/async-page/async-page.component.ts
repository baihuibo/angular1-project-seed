// Created by baihuibo on 2017/3/2.

import {Component} from "core";

@Component({
    selector: 'app-async-page',
    template: `
        <h1>async page component</h1>
    `
})
export class AsyncPageComponent {
    static $inject = ['$resource'];

    constructor($resource) {
        console.log('testService', $resource);
    }
}