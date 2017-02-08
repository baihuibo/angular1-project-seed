// Created by baihuibo on 2017/2/8.

import {Injectable} from "core";

@Injectable({
    name: 'HttpDevProxyInterceptor'
})
export class HttpDevProxyInterceptor {
    static $inject = ['$log'];

    constructor(private $log: angular.ILogService) {
        $log.debug('非开发环境，使用本地http代理模式');
    }

    request(request: angular.IRequestConfig) {
        request.method = 'get';
        request.url = `assets/api/${request.url}.json`;
        return request;
    }
}