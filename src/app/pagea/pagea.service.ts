// Created by baihuibo on 2016/12/20.

import {Injectable} from "core";

@Injectable({
    name: 'PageAService'
})
export class PageAService {
    static $inject = ['$http', '$log'];

    constructor(private http: angular.IHttpService, private $log: angular.ILogService) {
    }

    addItem(item) {
        return this.http.get('users/list', {params: item})
            .then((response: angular.IHttpPromiseCallbackArg<any>) => {
                return response.data;
            });
    }
}