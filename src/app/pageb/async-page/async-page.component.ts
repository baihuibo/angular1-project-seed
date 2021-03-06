// Created by baihuibo on 2017/3/2.

import {Component} from "angular-core";
import {TestService} from "../../share/test.service";

@Component({
    selector: 'app-async-page',
    template: `
        <h1>async page component</h1>
        
        <ul>
            <li> <a ui-sref="pagec.async-page2">page2</a> </li>
            <li> <a ui-sref="pagec.async-page3">page3</a> </li>
        </ul>
        
        测试异步加载的管道: {{'qi' | name}}
        
        <ui-view></ui-view>
    `
})
export class AsyncPageComponent {
    static $inject: string[] = ['TestService'];

    constructor(testService: TestService) {
        console.log('testService', testService);
    }
}