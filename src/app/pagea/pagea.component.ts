// Created by baihuibo on 2016/12/16.
import {Component} from "angular-core";
import {PageAService} from "./pagea.service";
import {ShowColorComponent} from "../share/show-color/show-color.component";

@Component({
    templateUrl: './pagea.component.html',
    styleUrls: ['./pagea.component.less'],
    styles: ['.test{name:1}']
})
export class PageAComponent {
    user: any;

    static $inject: string[] = ['PageAService'];

    showColor: ShowColorComponent;

    constructor(pageAService: PageAService) {
        console.log(pageAService);
    }

    $onInit() {
        console.log('showColor', this.showColor);
    }
}