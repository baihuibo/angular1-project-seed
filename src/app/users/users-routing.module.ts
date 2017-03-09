// Created by baihuibo on 2016/12/17.
import {IRouter, RouterModule} from "angular-core-router";
import {NgModule} from "angular-core";
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