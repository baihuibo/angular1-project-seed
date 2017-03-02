// Created by baihuibo on 2016/12/20.
import {NgModule} from "core";

import {InstanceDirective} from "./instance.directive";
import {TestService} from "./test.service";

@NgModule({
    declarations: [InstanceDirective],
    providers: [TestService]
})
export class ShareModule {
}