// Created by baihuibo on 2016/12/20.

import {Injectable} from "annotation";
import {HttpProxy, IHttpProxy} from "../share/http-proxy.service";

@Injectable({
    name: 'PageAService'
})
export class PageAService {
    static $inject = ['HttpProxy', '$log'];
    http: IHttpProxy;

    constructor(httpProxy: HttpProxy, private $log: angular.ILogService) {
        this.http = httpProxy.createHttp({
            url: 'path/to/users.shtml',
            mappings: {
                paging: 'resource/paging-users.json'
            }
        });
    }

    addItem(item) {
        // 联调模式 coupling => GET  http://host/path/to/test.shtml?paging=true
        // 开发模式 => POST http://host/tsconfig.json
        return this.http.get('paging', {params: item}).then((response: angular.IHttpPromiseCallbackArg<any>) => {
            return response.data;
        });
    }
}