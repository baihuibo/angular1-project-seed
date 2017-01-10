// Created by baihuibo on 2016/12/16.
import {Component} from "annotation";
import {PageAService} from "./pagea.service";
import {CoreService} from "../share/core.service";

@Component({
    template: require('./pagea.component.html')
})
export class PageAComponent {
    static $inject = ['PageAService', 'CoreService'];

    user: any;

    constructor(aService: PageAService, core: CoreService) {
        aService.addItem({newItem: true, name: 'new item'}).then((user) => {
            this.user = user;
        });
    }
}