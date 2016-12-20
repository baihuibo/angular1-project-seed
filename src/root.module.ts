// Created by baihuibo on 2016/12/15.
import "angular-ui-router";
import "angular-resource";

import "./styles/main.less";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import {AppModule} from "./app/app.module";
import {NgModule} from "annotation";

@NgModule({
    imports: [AppModule, 'ui.router', 'ngResource']
})
export class RootModule {

}