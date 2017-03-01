// Created by baihuibo on 2017/1/10.

import {Component} from "core";
import {UsersService} from "./users.service";
import {User} from "./user";

@Component({
    template: `
     <div>
        <h1>all Users..</h1>
         <ul>
            <li ng-repeat="user in $ctrl.userList">
            {{user}}
            
            ---
            
            <a href="javascript:" ng-click="$ctrl.deleteUser(user)">delete this user</a>
            </li>
         </ul>
     </div>  
    `
})
export class UserComponent {

    userList: User[];

    static $inject = ['UsersService'];

    constructor(private usersService: UsersService) {
    }

    $onInit() {
        this.queryUser();
    }

    private queryUser() {
        this.usersService.queryAllUser().then((users: User[]) => {
            this.userList = users;
        });
    }

    deleteUser(user: User) {
        this.usersService.deleteUser(user.id);
        this.queryUser();
    }
}