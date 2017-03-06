// Created by baihuibo on 2017/1/10.
import {bootstrap} from "angular";
import {Names} from "./core";

export function bootstrapModule(tsModule) {
    bootstrap(document, [tsModule[Names.module]]);

    const angular = window['angular'];
    const module = angular.module;
    angular.module = function (name, deps, configFn) {
        const mod = module(name, deps, configFn);
        if (deps) {
            mod['asyncModule'] = true;
        }
        return mod;
    };
}