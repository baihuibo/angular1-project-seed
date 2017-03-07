// Created by baihuibo on 2016/12/15.
import {NgModule} from "core";
import {ShareModule} from "./share/share.module";
import {UsersModule} from "./users/users.module";

import {AppRoutingModule} from "./app-routing.module";

import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";
import {AppComponent} from "./app.component";
import {PeopleComponent} from "./people.component";
import {GradientBComponent} from "./pageb/gradient/gradient.component";

import {PageAService} from "./pagea/pagea.service";
import {TestDirective} from "./pagea/test.directive";
import {HttpDevProxyService} from "../core/http-dev-proxy.service";
import {HttpConfig} from "./http.config";
import {HttpCacheService} from "../core/http-cache.service";
import {StatePipe} from "./pagea/state.pipe";
import {AppConfig} from "./app.config";

@NgModule({
    imports: [ShareModule, UsersModule, AppRoutingModule],
    providers: [PageAService, HttpDevProxyService, HttpCacheService],
    configs: [HttpConfig, AppConfig],
    declarations: [
        PageAComponent, PageBComponent, AppComponent,
        PeopleComponent, GradientBComponent,
        TestDirective, StatePipe
    ]
})
export class AppModule {

}