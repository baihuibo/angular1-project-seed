//Created by baihuibo on 2016/12/15.
const path = require('path');
const webpack = require('webpack');
const del = require('del');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');
const angular = require('./angular-conf.json');

const PROD_MODE = /prod|production/i.test(process.env['ENV_WEBPACK']);

const copyList = [];
const libPath = 'libs/';
const extensions = ['.ts', '.js', '.json', '.html'];

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

addToCopyList(baseScript);
addToCopyList(angular.app.scripts);
addToCopyList(angular.app.styles);
addToCopyList(angular.app.assets, "assets");

/////// 删除输出目录文件
try {
    console.log('删除目录', path.resolve(__dirname, angular.app.outDir));
    del.sync([angular.app.outDir]);
} catch (e) {
    console.log('删除失败');
}

module.exports = {
    context: path.resolve(__dirname, angular.app.root),
    entry: {
        'app': angular.app.main
    },
    resolve: {
        extensions: extensions,
        alias: {
            'core$': path.resolve(__dirname, "src/core/core.ts"),
            'router$': path.resolve(__dirname, "src/core/router.ts")
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
                        {
                            pattern: /loadChildren\s*\:\s*['"](.*)#(.*)['"]/g,
                            replacement: function (match, file, moduleName, offset, string) {
                                return `
                                    loadChildren : (function(){
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
                                    }()) ,
                                `;
                            }
                        }
                    ]
                }),

            },
            {test: /\.html/, loaders: "html-loader"},
            {
                test: /\.css/,
                loaders: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader',
                    publicPath: ''
                })
            },
            {
                test: /\.less/,
                loaders: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader!less-loader',
                    publicPath: ''
                })
            },
            {test: /\.(svg|woff2|woff|ttf|eot|jpg|png)/, loaders: "url-loader?limit=10240"},
        ]
    },
    plugins: [
        new StringReplaceWebpackPlugin(),
        new CopyWebpackPlugin(copyList),
        new ExtractTextPlugin(PROD_MODE ? '[name].[hash].css' : "[name].bundle.css"),
        new HtmlWebpackPlugin({
            template: angular.app.index // 源文件位置
        }),
        new AddAssetsFilesToHtml()
    ],
    output: {
        filename: PROD_MODE ? '[name].[hash].js' : '[name].bundle.js',
        path: angular.app.outDir
    }
};

function AddAssetsFilesToHtml() {
}

AddAssetsFilesToHtml.prototype.apply = function (compiler) {
    // ...
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
            addToBeforeList(baseScript, htmlPluginData.assets, 'js');
            addToBeforeList(angular.app.scripts, htmlPluginData.assets, 'js');
            addToBeforeList(angular.app.styles, htmlPluginData.assets, 'css');

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

function addToBeforeList(list, assets, key) {
    if (Array.isArray(list)) {
        const arr = list.map(function (file) {
            return libPath + path.basename(file);
        });
        assets[key] = [].concat(arr, assets[key]);
    }
}