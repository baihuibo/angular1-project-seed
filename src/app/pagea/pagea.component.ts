// Created by baihuibo on 2016/12/16.
import {Component} from "core";
import {PageAService} from "./pagea.service";

@Component({
    template: require('./pagea.component.html')
})
export class PageAComponent {
    user: any;

    static $inject = ['PageAService'];

    constructor(aService: PageAService) {
        aService.addItem({newItem: true, name: 'new item'}).then((user) => {
            this.user = user;
        });
    }
}