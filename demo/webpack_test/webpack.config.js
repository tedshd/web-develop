const webpack = require('webpack');
const url = './src/';

module.exports = {
    entry: {
        app: ['./src/lib_b.js', './src/lib_a.js'],
        all: ['./src/lib_a.js', './src/lib_b.js', url + 'cats.js'],
        mode: [url + 'app.js', url + 'app1.js']
    },
    output: {
        filename: '[name].js',
        path: './built'
    },
    // entry: {
    //     app: './src/lib_a.js',
    //     search: './src/mod.js'
    // },
    // output: {
    //     filename: '[name].js',
    //     path: './built'
    // },
     // entry: './src/app.js',
     // output: {
     //     path: './bin',
     //     filename: 'app.bundle.js'
     // },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false,
    //         },
    //         output: {
    //             comments: false,
    //         },
    //     }),
    // ]
 };
