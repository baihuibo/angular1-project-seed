// Created by baihuibo on 2017/1/10.

import {Component} from "core";

@Component({
    template: `
     <div>
        <h1>my page is Users..</h1>
         <ul>
            <li>user 1</li>
            <li>user 2</li>
            <li>user 3</li>
         </ul>
     </div>  
    `
})
export class UserComponent {
    static $inject = [];

    constructor() {

    }
}