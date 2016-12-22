// Created by baihuibo on 2016/12/15.
import {NgModule} from "annotation";
import {ShareModule} from "./share/share.module";
import {DefaultRoutingConfig, AppRouting} from "./app-routing";

import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";
import {AppComponent} from "./app.component";

import {PageAService} from "./pagea/pagea.service";
import {TestDirective} from "./pagea/test.directive";
import {PeopleComponent} from "./people.component";

@NgModule({
    imports: [ShareModule],
    components: [PageAComponent, PageBComponent, AppComponent , PeopleComponent],
    services: [PageAService],
    directives: [TestDirective],
    routers: [AppRouting],
    configs: [DefaultRoutingConfig]
})
export class AppModule {

}