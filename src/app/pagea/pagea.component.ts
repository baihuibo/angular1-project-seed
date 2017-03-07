// Created by baihuibo on 2016/12/16.
import {Component} from "core";
import {PageAService} from "./pagea.service";

@Component({
    templateUrl: './pagea.component.html',
    styleUrls: ['./pagea.component.css'],
    styles: ['.test{name:1}']
})
export class PageAComponent {
    user: any;

    static $inject = ['PageAService'];

    constructor(pageAService: PageAService) {
        console.log(pageAService);
    }
}