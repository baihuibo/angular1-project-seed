// Created by baihuibo on 2017/1/10.
import {bootstrap} from "angular";
import {Names} from "./core";

export function bootstrapModule(appModule) {
    window['appModule'] = appModule;
    bootstrap(document, [appModule[Names.module]]);
}