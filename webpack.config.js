//Created by baihuibo on 2016/12/15.
const path = require('path');
const webpack = require('webpack');
const del = require('del');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');
const angular = require('./angular-conf.json');

const PROD_MODE = /prod|production/i.test(process.env['ENV_WEBPACK']);
const extensions = ['.ts', '.js', '.json', '.html'];

const copyList = [];
addToCopyList(angular.app.assets, "assets");

let baseScript = [
    path.resolve(__dirname, "node_modules/core-js/client/core.js"),
    path.resolve(__dirname, "node_modules/tslib/tslib.js"),
    path.resolve(__dirname, "node_modules/angular/angular.js")
];

if (PROD_MODE) {
    baseScript = [
        path.resolve(__dirname, "node_modules/core-js/client/core.min.js"),
        path.resolve(__dirname, "node_modules/tslib/tslib.js"),
        path.resolve(__dirname, "node_modules/angular/angular.min.js")
    ];
    extensions.unshift('.prod.ts');
}

/////// 删除输出目录文件
try {
    del.sync([angular.app.outDir]);
} catch (e) {
}

module.exports = {
    context: path.resolve(__dirname, angular.app.root),
    entry: {
        'app': angular.app.main
    },
    resolve: {
        extensions: extensions,
        alias: {
            'angular-core$': path.resolve(__dirname, "src/core/angular-core.ts"),
            'angular-core-router$': path.resolve(__dirname, "src/core/angular-core-router.ts")
        }
    },
    externals: {
        jquery: 'window.jQuery',
        angular: 'window.angular'
    },
    module: {
        loaders: [
            {
                test: /\.ts/,
                loaders: StringReplaceWebpackPlugin.replace("ts-loader", {
                    replacements: [
                        {pattern: /loadChildren\s*\:\s*['"](.*)#(.*)['"]/g, replacement: replacement}, // loadChildren
                        {pattern: /templateUrl\s*\:\s*['"](.*)['"]/g, replacement: replacementTemplate}, // load template
                        {pattern: /styleUrls\s*\:\s*\[['"](.*)['"]\]/g, replacement: replacementStyles},// load styles
                    ]
                }),
            },
            {
                test: /\.js/, loaders: StringReplaceWebpackPlugin.replace({
                replacements: [
                    {
                        pattern: /#\s*sourceMappingURL=(.*\.map)\s*/g,
                        replacement: function () {
                            return ' remove sourceMapping '
                        }
                    }
                ]
            })
            },
            {test: /\.html/, loaders: "html-loader"},
            {test: /\.css/, loaders: 'css-loader'},
            {test: /\.less/, loaders: 'css-loader!less-loader'},
            {test: /\.(svg|woff2|woff|ttf|eot|jpg|png)/, loaders: "url-loader?limit=10240"},
        ]
    },
    plugins: [
        new CopyWebpackPlugin(copyList),
        new StringReplaceWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: angular.app.index // 源文件位置
        }),
        new AddAssetsFilesToHtml()
    ],
    output: {
        filename: PROD_MODE ? '[name].[hash].js' : '[name].bundle.js',
        path: angular.app.outDir
    },
    watch: {
        ignored: /node_modules|\.spec\.(ts|js)/
    }
};

function AddAssetsFilesToHtml() {
}

AddAssetsFilesToHtml.prototype.apply = function (compiler) {
    // ...
    compiler.plugin('compilation', function (compilation) {
        const vendorJs = PROD_MODE ? 'vendors.[hash].js' : 'vendors.js';
        const vendorCss = PROD_MODE ? 'styles.[hash].css' : 'styles.css';
        const scripts = [...baseScript, ...angular.app.scripts];
        const styles = [...angular.app.styles];

        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
            makeVendorFile(scripts, vendorJs, 'js');
            makeVendorFile(styles, vendorCss, 'css');

            function makeVendorFile(files, name, type) {
                name = name.replace('[hash]', compilation.hash);
                const contents = [];
                let size = 0;
                files.forEach(file => {
                    let fileContent = '';
                    try {
                        fileContent = fs.readFileSync(file);
                    } catch (e) {
                        try {
                            fileContent = fs.readFileSync(path.resolve(angular.app.root, file));
                        } catch (e) {
                            throw 'not found : ' + file;
                        }
                    }
                    size += fileContent.length;
                    let content = fileContent.toString();
                    let match = content.match(/#\s*sourceMappingURL=(.*\.map)\s*/);
                    if (match && match.length) {
                        content = content.replace(match[0], ' remove sourceMapping ');
                    }
                    contents.push(content);
                });
                compilation.assets[name] = {
                    source(){
                        return contents.join(' \n ');
                    },
                    size(){
                        return size;
                    }
                };
                htmlPluginData.assets[type].unshift(name);
            }

            callback(null, htmlPluginData);
        });
    });
};

function addToCopyList(list, to) {
    if (Array.isArray(list)) {
        list.forEach(function (file) {
            copyList.push({from: file, to: to || libPath});
        });
    }
}

function replacement(match, file, moduleName, offset, string) {
    return `loadChildren : (function(){
              let promise; // 优化异步模块加载器
              return function loadFn(){
                 if(promise) return promise;
                 
                  return promise = new Promise(function (resolve) {
                     require.ensure(["${file}"], function (require) {
                         loadFn['asyncModuleRegister'](require("${file}"), '${moduleName}');
                         resolve();
                     });
                  });
              }
            }())`;
}

function replacementTemplate(match, file, offset, string) {
    return `template : require("${file}")`;
}

function replacementStyles(match, file, offset, string) {
    const files = file.replace(/['"]/g, '').split(/\s*,\s*/);
    const content = files.map(file => `require("${file}")`).join(',');
    return `styleUrls : [${content}]`;
}