//Created by baihuibo on 2016/12/15.
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        vendor: ["angular-ui-router", "angular-resource", "bootstrap"],
        app: './src/main.ts'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.html'],
        alias: {
            'annotation$': path.resolve(__dirname, "src/base/annotation.ts"),
            'angular-ui-router': path.resolve(__dirname, "node_modules/angular-ui-router/release/angular-ui-router.min.js"),
            'angular-resource': path.resolve(__dirname, "node_modules/angular-resource/angular-resource.min.js"),
            'bootstrap/dist/css/bootstrap.min.css': path.resolve(__dirname, "node_modules/bootstrap/dist/css/bootstrap.min.css"),
            'bootstrap': path.resolve(__dirname, "node_modules/bootstrap/dist/js/bootstrap.min.js"),
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
        ],
        noParse: /(angular|jquery|bootstrap)\.js$/
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor"],
            minChunks: Infinity
        }),
        new ExtractTextPlugin("[name].bundle.css"),
    ],
    output: {
        filename: '[name].bundle.js',
        publicPath: './dist/',
        path: './dist'
    }
};