// Created by baihuibo on 2017/3/2.

import {Component} from "core";

@Component({
    selector: 'app-async-page',
    template: `
        <h1>async page component</h1>
        
        <ul>
            <li> <a ui-sref="pageb.async-page2">page2</a> </li>
            <li> <a ui-sref="pageb.async-page3">page3</a> </li>
        </ul>
        
        <ui-view></ui-view>
    `
})
export class AsyncPageComponent {
    static $inject = ['$resource'];

    constructor($resource) {
        console.log('testService', $resource);
    }
}