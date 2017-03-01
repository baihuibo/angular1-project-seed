// Created by baihuibo on 2017/1/10.

import {NgModule} from "core";
import {ShareModule} from "../share/share.module";
import {UsersRoutingModule} from "./users-routing";

import {UserComponent} from "./user.component";
import {UsersService} from "./users.service";

@NgModule({
    imports: [
        ShareModule,
        UsersRoutingModule
    ],
    providers: [UsersService],
    declarations: [
        UserComponent
    ]
})
export class UsersModule {
}