// Created by baihuibo on 2016/12/17.
import {Router} from "core";
import {UserComponent} from "./user.component";

export const UsersRouting: Router[] = [{
    url: '/users',
    name: 'users',
    component: UserComponent
}];