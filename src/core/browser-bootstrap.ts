// Created by baihuibo on 2017/1/10.
import {bootstrap} from "angular";
import {Names} from "./angular-core";

export function bootstrapModule(appModule) {
    window['appModule'] = appModule;
    bootstrap(document, [appModule[Names.module]]);
}