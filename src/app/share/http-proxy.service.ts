// Created by baihuibo on 2017/1/3.
import {Injectable} from "annotation";
import {coupling} from "../../properties";

@Injectable({
    name: 'HttpProxy'
})
export class HttpProxy {
    static $inject = ['$http', '$resource', '$window', '$log'];

    constructor(private http: angular.IHttpService,
                private $resource,
                private $window: Window,
                private $log: angular.ILogService) {
    }

    createHttp(config: IConfig): IHttpProxy {
        const self = this;
        return {
            get<T>(name: string, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>{
                return self.proxy('get', name, config, httpConfig);
            },
            delete<T>(name: string, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>{
                return self.proxy('delete', name, config, httpConfig);
            },
            remove<T>(name: string, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>{
                return self.proxy('delete', name, config, httpConfig);
            },
            post<T>(name: string, data: Object, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>{
                return self.proxy('post', name, config, data, httpConfig);
            },
            put<T>(name: string, data: Object, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>{
                return self.proxy('put', name, config, data, httpConfig);
            },
            pagingResource(name: string = 'paging'){
                return self.$resource(self.getUrl(config, name, true));
            }
        }
    }

    private proxy<T>(type: string, name: string, config: IConfig, data?, httpConfig?): angular.IHttpPromise<T> {
        const url = this.getUrl(config, name);
        const method = this.getMethod(type);
        return this.http[method](url, data, httpConfig);
    }

    private getUrl(config: IConfig, name: string, noautocombo?: boolean) {
        if (coupling) {
            if (noautocombo) { // 不需要合并参数
                return config.url;
            }
            return `${config.url}?${name}=true`;
        }

        if (config.mappings[name]) {
            return config.mappings[name];
        }

        const e = `无法找到静态资源地址，请检查配置文件: \n url = ${config.url} \n name = ${name}`;
        this.$window.alert(e);
        throw e;
    }

    private getMethod(method: string) {
        if (coupling) {
            return method;
        }
        return 'post';
    }
}

interface IConfig {
    url: string
    mappings: Object
}

export interface IHttpProxy {
    get<T>(name: string, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>
    post<T>(name: string, data?: Object, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>
    put<T>(name: string, data?: Object, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>
    delete<T>(name: string, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>
    remove<T>(name: string, httpConfig?: angular.IRequestShortcutConfig): angular.IHttpPromise<T>
    pagingResource(name?: string)
}