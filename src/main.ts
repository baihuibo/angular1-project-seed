// Created by baihuibo on 2016/12/15.


// 文件命名规则
//  [name].[type].[html,css,js,ts]
// type = [component , module , service , filter , directive]

import {RootModule} from "./root.module";
import {bootstrapModule} from "./core/browser-bootstrap";

bootstrapModule(RootModule);