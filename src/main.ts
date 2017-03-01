// Created by baihuibo on 2016/12/15.


// 文件命名规则
//  [name].[type].[html,css,js,ts]
// type = [component , module , service , pipe , directive , interceptor , guard , config]

import {AppModule} from "./app/app.module";
import {bootstrapModule} from "./core/browser-bootstrap";

bootstrapModule(AppModule);