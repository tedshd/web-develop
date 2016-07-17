const webpack = require('webpack');
const url = './src/';

module.exports = {
    entry: {
        app: ['./src/lib_b.js', './src/lib_a.js'],
        all: ['./src/lib_a.js', './src/lib_b.js', url + 'cats.js'],
        mode: [url + 'app.js', url + 'app1.js'],
        index: ['./src/style.js']
    },
    output: {
        filename: '[name].js',
        path: './built'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
 };

