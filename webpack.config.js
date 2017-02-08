//Created by baihuibo on 2016/12/15.
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const angular = require('./angular-conf.json');

const copyList = [];
const libPath = 'libs/';

addToCopyList(angular.app.scripts);
addToCopyList(angular.app.styles);
addToCopyList(angular.app.assets, "assets");

module.exports = {
    context: path.resolve(__dirname, angular.app.root),
    entry: {
        'app': angular.app.main
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.html'],
        alias: {
            'core$': path.resolve(__dirname, "src/core/core.ts")
        }
    },
    externals: {
        jquery: 'jQuery',
        angular: 'angular'
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
            if (Array.isArray(angular.app.scripts)) {
                const arr = angular.app.scripts.map(function (file) {
                    return libPath + path.basename(file);
                });
                htmlPluginData.assets.js = [].concat(arr, htmlPluginData.assets.js);
            }
            if (Array.isArray(angular.app.styles)) {
                const arr = angular.app.styles.map(function (file) {
                    return libPath + path.basename(file);
                });
                htmlPluginData.assets.css = [].concat(arr, htmlPluginData.assets.css);
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