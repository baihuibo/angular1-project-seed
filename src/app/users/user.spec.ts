// Created by baihuibo on 2017/3/9.


import {User} from "./user";

describe('user test', () => {
    it("user not null", () => {
        expect(typeof User).not.toBe(null);
    })
});