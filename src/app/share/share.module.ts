// Created by baihuibo on 2016/12/20.
import {NgModule} from "angular-core";

import {AliasDirective} from "./alias.directive";
import {TestService} from "./test.service";
import {ShowColorComponent} from "./show-color/show-color.component";

@NgModule({
    declarations: [AliasDirective, ShowColorComponent],
    providers: [TestService]
})
export class ShareModule {
}