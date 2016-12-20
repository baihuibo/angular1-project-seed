// Created by baihuibo on 2016/12/15.
import AppRouting from "./app-routing";
import {PageAComponent} from "./pagea/pagea.component";
import {PageBComponent} from "./pageb/pageb.component";
import {AppComponent} from "./app.component";
import {NgModule} from "annotation";
import {PageAService} from "./pagea/pagea.service";
import {ShareModule} from "./share/share.module";

@NgModule({
    imports: ['ui.router' , ShareModule],
    components: [PageAComponent, PageBComponent, AppComponent],
    services: [PageAService],
    routers: [AppRouting]
})
export class AppModule {

}