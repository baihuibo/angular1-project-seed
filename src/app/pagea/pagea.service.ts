// Created by baihuibo on 2016/12/20.

import {Injectable} from "angular-core";
import {IHttpPromiseCallbackArg, IHttpService, ILogService} from "angular";

@Injectable({
    name: 'PageAService'
})
export class PageAService {
    static $inject: string[] = ['$http', '$log'];

    constructor(private http: IHttpService, private $log: ILogService) {
    }

    addItem(item) {
        return this.http.get('users/list', {params: item})
            .then((response: IHttpPromiseCallbackArg<any>) => {
                return response.data;
            });
    }
}