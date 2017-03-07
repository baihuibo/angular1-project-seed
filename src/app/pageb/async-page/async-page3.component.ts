// Created by baihuibo on 2017/3/2.

import {Component} from "core";

@Component({
    template: `
        <h1>async page3 component</h1>
        
        <a ui-sref="pagec.async-page3.next-async-page">next async page</a>
        
        <ui-view></ui-view>
    `
})
export class AsyncPage3Component {
    constructor() {
    }
}