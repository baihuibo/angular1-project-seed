// Created by baihuibo on 2016/12/20.
import {NgModule} from "core";

import {InstanceDirective} from "./instance.directive";
import {TestService} from "./test.service";
import {ShowColorComponent} from "./show-color/show-color.component";

@NgModule({
    declarations: [InstanceDirective, ShowColorComponent],
    providers: [TestService]
})
export class ShareModule {
}