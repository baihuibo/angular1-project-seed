// Created by baihuibo on 2017/2/8.
import {environment} from "../environments/environment";
import {IHttpProvider} from "angular";

export class HttpConfig {
    static $inject: string[] = ['$httpProvider'];

    constructor($httpProvider: IHttpProvider) {
        // 缓存处理器
        $httpProvider.interceptors.push('HttpCacheService');

        if (!environment.production) {
            // 开发模式的请求拦截器
            $httpProvider.interceptors.push('HttpDevProxyService');
        }
    }
}