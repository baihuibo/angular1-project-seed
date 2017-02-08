// Created by baihuibo on 2017/2/8.
export class UiRouterDefaultErrorHandlerConfig {
    static $inject = ['$state'];

    constructor($state: angular.ui.IStateService) {
        $state['defaultErrorHandler'](function (error) {
        });
    }
}