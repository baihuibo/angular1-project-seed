//Created by baihuibo on 2016/12/15.
const path = require('path');
const webpack = require('webpack');
const del = require('del');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const {NoEmitOnErrorsPlugin} = webpack;
const {CommonsChunkPlugin} = webpack.optimize;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');
const angular = require('./angular-conf.json');

const PROD_MODE = process.argv.some(v => v === '-p' || v === '-production');
const extensions = ['.ts', '.js', '.json', '.html'];

const nodeModules = path.join(process.cwd(), 'node_modules');
const entryPoints = ["inline", "polyfills", "sw-register", "styles", "scripts", "vendor", "main"];

const copyList = Array.from(angular.app.assets).map(file => {
    return {from: file, to: 'assets'};
});

const baseScript = [
    path.resolve(__dirname, "node_modules/tslib/tslib.js"),
    path.resolve(__dirname, "node_modules/angular/angular.js")
];

if (PROD_MODE) {
    extensions.unshift('.prod.ts');
}

const watch = PROD_MODE ? false : {ignored: /node_modules|\.(spec|test)\.(ts|js)/};

const hash = PROD_MODE ? '[hash]' : 'bundle';
const scripts = scriptLoader(angular.app.scripts || [], baseScript);
const styles = angular.app.styles.map(file => path.join(process.cwd(), angular.app.root, file));

/////// 删除输出目录文件
try {
    del.sync([angular.app.outDir]);
} catch (e) {
}

module.exports = {
    context: path.resolve(__dirname, angular.app.root),
    entry: {
        main: [angular.app.main],
        polyfills: [angular.app.polyfills],
        scripts: scripts,
        styles: styles
    },
    output: {
        filename: `[name].${hash}.js`,
        path: angular.app.outDir
    },
    watch: watch,
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
        rules: [
            {
                enforce: "pre",
                test: /\.ts$/,
                loader: "tslint-loader"
            },
            {
                "enforce": "pre",
                "test": /\.js$/,
                "loader": "source-map-loader",
                "exclude": [/\/node_modules\//]
            },
            {
                test: /\.ts$/,
                loaders: StringReplaceWebpackPlugin.replace("ts-loader", {
                    replacements: [
                        {pattern: /loadChildren\s*\:\s*['"](.*)#(.*)['"]/g, replacement: replacement}, // loadChildren
                        {pattern: /templateUrl\s*\:\s*['"](.*)['"]/g, replacement: replacementTemplate}, // load template
                        {pattern: /styleUrls\s*\:\s*\[['"](.*)['"]\]/g, replacement: replacementStyles},// load styles
                    ]
                }).split('!'),
            },

            /////// 静态资源文件
            {test: /\.json$/, loader: "json-loader"},
            {test: /\.html/, loader: "raw-loader"},
            {
                "test": /\.(eot|svg)$/,
                "loader": "file-loader?name=[name].[hash:20].[ext]"
            },
            {
                "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
                "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
            },

            /////// 组件样式
            {
                "exclude": styles,
                "test": /\.css$/,
                "loaders": ["css-loader?{\"sourceMap\":false,\"importLoaders\":1}"]
            },
            {
                "exclude": styles,
                "test": /\.less$/,
                "loaders": ["css-loader?{\"sourceMap\":false,\"importLoaders\":1}", "less-loader"]
            },

            /////// 公共样式
            {
                "include": styles,
                "test": /\.css$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": ["css-loader?{\"sourceMap\":false,\"importLoaders\":1}"],
                    "fallback": "style-loader",
                    "publicPath": ""
                })
            },
            {
                "include": styles,
                "test": /\.less$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": ["css-loader?{\"sourceMap\":false,\"importLoaders\":1}", "less-loader"],
                    "fallback": "style-loader",
                    "publicPath": ""
                })
            },
        ]
    },
    plugins: [
        new StringReplaceWebpackPlugin(),
        new NoEmitOnErrorsPlugin(),
        new ProgressPlugin(),
        new CopyWebpackPlugin(copyList),
        new CommonsChunkPlugin({
            "name": "inline",
            "minChunks": null
        }),
        new CommonsChunkPlugin({
            "name": "vendor",
            "minChunks": (module) => module.resource && module.resource.startsWith(nodeModules),
            "chunks": ["main"]
        }),
        new HtmlWebpackPlugin({
            template: angular.app.index, // 源文件位置
            "hash": false,
            "inject": true,
            "compile": true,
            "favicon": false,
            "minify": false,
            "cache": true,
            "showErrors": true,
            "chunks": "all",
            "excludeChunks": [],
            "title": "Webpack App",
            "xhtml": true,
            "chunksSortMode": function sort(left, right) {
                let leftIndex = entryPoints.indexOf(left.names[0]);
                let rightindex = entryPoints.indexOf(right.names[0]);
                if (leftIndex > rightindex) {
                    return 1;
                }
                else if (leftIndex < rightindex) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        }),
        new ExtractTextPlugin({
            "filename": "[name].bundle.css",
            "disable": true
        }),
    ],
    "node": {
        "fs": "empty",
        "global": true,
        "crypto": "empty",
        "tls": "empty",
        "net": "empty",
        "process": true,
        "module": false,
        "clearImmediate": false,
        "setImmediate": false
    }
};

function scriptLoader() {
    let uglify = '';
    if (PROD_MODE) {
        uglify = '!uglify-loader'
    }
    return [].concat(...arguments).map(file => {
        if (/\.ts$/.test(file)) {
            return `script-loader${uglify}!ts-loader!${file}`;
        } else if (/\.js$/.test(file)) {
            return `script-loader${uglify}!${file}`;
        }
    });
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