// Created by baihuibo on 2016/12/16.
import {Component} from "core";
import {PageAService} from "./pagea.service";

@Component({
    template: require('./pagea.component.html')
})
export class PageAComponent {
    user: any;

    static $inject = ['TesPageAServicetService'];

    constructor(pageAService: PageAService) {
        console.log(pageAService);
    }
}