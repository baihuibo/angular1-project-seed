// Created by baihuibo on 2017/3/7.

export class AppConfig {
    static $inject = ['$compileProvider'];

    constructor($compileProvider: angular.ICompileProvider) {
        $compileProvider.cssClassDirectivesEnabled(false); // 禁用 css class 名称的指令
        $compileProvider.commentDirectivesEnabled(false);// 禁用 comment 注释节点指令
    }
}