// Created by baihuibo on 2017/1/10.

import {NgModule} from "core";
import {ShareModule} from "../share/share.module";
import {UsersRouting} from "./users-routing";

import {UserComponent} from "./user.component";

@NgModule({
    imports: [ShareModule],
    components: [UserComponent],
    services: [],
    directives: [],
    routers: [UsersRouting],
    configs: []
})
export class UsersModule {
}