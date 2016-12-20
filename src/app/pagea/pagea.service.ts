// Created by baihuibo on 2016/12/20.

import {Injectable} from "annotation";

@Injectable({
    name: 'PageAService'
})
export class PageAService {
    addItem(item) {
        console.log('call add item', item);
    }
}