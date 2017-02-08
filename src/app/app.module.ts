// Created by baihuibo on 2016/12/15.
import {NgModule} from "core";
import {ShareModule} from "./share/share.module";
import {UsersModule} from "./users/users.module";

import {DefaultRoutingConfig, AppRouting} from "./app-routing";

import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";
import {AppComponent} from "./app.component";
import {PeopleComponent} from "./people.component";
import {GradientBComponent} from "./pageb/gradient/gradient.component";

import {PageAService} from "./pagea/pagea.service";
import {TestDirective} from "./pagea/test.directive";
import {HttpDevProxyInterceptor} from "../core/http-dev-proxy.interceptor";
import {HttpConfig} from "./http.config";
import {HttpCacheInterceptor} from "../core/http-cache.interceptor";

@NgModule({
    imports: [ShareModule, UsersModule],
    components: [PageAComponent, PageBComponent, AppComponent, PeopleComponent, GradientBComponent],
    services: [PageAService, HttpDevProxyInterceptor, HttpCacheInterceptor],
    directives: [TestDirective],
    routers: [AppRouting],
    configs: [DefaultRoutingConfig, HttpConfig]
})
export class AppModule {

}