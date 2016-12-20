//Created by baihuibo on 2016/12/15.
const path = require('path');

module.exports = {
    entry: {
        app: './src/main.ts'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.html'],
        alias: {
            'annotation$': path.resolve(__dirname, "src/base/annotation.ts"),
        }
    },
    externals: {
        jquery: 'jQuery',
        angular: 'angular'
    },
    module: {
        loaders: [
            {test: /\.html/, loaders: "html-loader"},
            {test: /\.css/, loaders: "style-loader!css-loader"},
            {test: /\.less/, loaders: "style-loader!css-loader!less-loader"},
            {test: /\.(svg|woff2|woff|ttf|eot)/, loaders: "url-loader?limit=10240"},
            {test: /\.ts/, loaders: "ts-loader"}
        ],
        noParse: /(angular|jquery)\.js$/
    }
    ,
    output: {
        filename: '[name].bundle.js',
        publicPath: './dist/',
        path: './dist'
    }
};