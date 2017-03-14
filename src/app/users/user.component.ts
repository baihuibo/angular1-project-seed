// Created by baihuibo on 2017/1/10.

import {Component} from "angular-core";
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
     
     <button ng-click="showColor.setColor('black')">set color black</button>
<button ng-click="showColor.setColor('yellow')">set color yellow</button>

<app-show-color alias="showColor"></app-show-color>
    `
})
export class UserComponent {

    userList: User[];

    static $inject: string[] = ['UsersService'];

    constructor(private usersService: UsersService) {
    }

    $onInit() {
        this.queryUser();
    }

    queryUser() {
        return this.usersService.queryAllUser().then((users: User[]) => {
            this.userList = users;
        });
    }

    deleteUser(user: User) {
        this.usersService.deleteUser(user.id);
        this.queryUser();
    }
}