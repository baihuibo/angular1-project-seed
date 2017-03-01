//Created by baihuibo on 2016/12/15.
const path = require('path');
const webpack = require('webpack');
const remove = require('remove');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
    remove.removeAsync(angular.app.outDir);
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
            {test: /\.ts/, loaders: "ts-loader"},
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
        new CopyWebpackPlugin(copyList),
        new ExtractTextPlugin("[name].bundle.css"),
        new HtmlWebpackPlugin({
            template: angular.app.index // 源文件位置
        }),
        new AddAssetsFilesToHtml()
    ],
    output: {
        filename: '[name].bundle.js',
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