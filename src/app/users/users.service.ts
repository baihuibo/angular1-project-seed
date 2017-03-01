// Created by baihuibo on 2017/2/9.
import {Injectable} from "core";
import {User} from "./user";
import {copy} from "angular";

@Injectable({
    name: 'UsersService'
})
export class UsersService {
    static $inject = ['$http'];

    private userList: User[] = [
        {userName: 'a', id: '1'},
        {userName: 'b', id: '2'},
        {userName: 'c', id: '3'},
        {userName: 'd', id: '4'},
    ];

    constructor(private http: angular.IHttpService) {

    }

    queryAllUser() {
        return Promise.resolve(copy(this.userList));
    }

    deleteUser(userId: string) {
        const index = this.userList.findIndex(user => user.id == userId);
        this.userList.splice(index, 1);
    }
}