// Created by baihuibo on 2016/12/15.


// 文件命名规则
//  [name].[type].[html,css,js,ts]
// type = [component , module , service , filter , directive]

import {bootstrap} from "angular";
import {RootModule} from "./root.module";

bootstrap(document, [RootModule['moduleName']]);