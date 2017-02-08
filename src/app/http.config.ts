// Created by baihuibo on 2017/2/8.
import {environment} from "../environments/environment";

export class HttpConfig {
    static $inject = ['$httpProvider'];

    constructor($httpProvider: angular.IHttpProvider) {
        // 缓存处理器
        $httpProvider.interceptors.push('HttpCacheInterceptor');

        if (!environment.production) {
            // 开发模式的请求拦截器
            $httpProvider.interceptors.push('HttpDevProxyInterceptor');
        }
    }
}