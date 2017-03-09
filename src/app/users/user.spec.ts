// Created by baihuibo on 2017/3/9.


import {User} from "./user";
import {UserComponent} from "./user.component";
import {UsersService} from "./users.service";

describe('user test', () => {
    it("user not null", () => {
        const name = 1;
        const age = 1;
        expect(typeof User).not.toBe(null);
    });

    it("userComp not null", () => {
        expect(UserComponent).not.toBe(null);
    });

    it("userComp userList has queryed", async () => {
        // 伪造服务
        const userService: UsersService = <UsersService>{
            queryAllUser(): Promise<User[]>{
                return Promise.resolve([
                    {userName: 'a', id: '1'},
                    {userName: 'b', id: '2'}
                ]);
            }
        };

        const u: UserComponent = new UserComponent(userService);

        expect(u.userList).toBe(undefined);

        await u.queryUser();

        expect(Array.isArray(u.userList)).toBe(true);

        expect(u.userList.length).toBe(2);
    })
});