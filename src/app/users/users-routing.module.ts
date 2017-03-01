// Created by baihuibo on 2016/12/17.
import {IRouter, RouterModule} from "router";
import {NgModule} from "core";
import {UserComponent} from "./user.component";

const configs: IRouter[] = [{
    url: '/users',
    name: 'users',
    component: UserComponent
}];


@NgModule({
    imports: [RouterModule.forChild(configs)]
})
export class UsersRoutingModule {

}