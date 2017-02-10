/**
 * Build config for electron 'Renderer Process' file
 */

import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import BabiliPlugin from 'babili-webpack-plugin';
import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
    devtool: 'cheap-module-source-map',

    entry: [
        'babel-polyfill',
        './app/index'
    ],

    output: {
        path: path.join(__dirname, 'app/dist/www'),
        filename: 'bundle.js',
        publicPath: '../www/'
    },
    externals: ['ws'],
    module: {
        noParse: ['ws'],
        loaders: [
            // Pipe other styles through css modules and append to style.css
            {
                test: /(\.scss|\.css)$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
            },

            // Fonts
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            },

            // Images
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                loader: 'url-loader'
            }
        ]
    },
    postcss: [autoprefixer],
    sassLoader: {
        data: '@import "theme/_config.scss";',
        includePaths: [path.resolve(__dirname, './app')]
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new BabiliPlugin({
            babili: ['babel-preset-babili', { deadcode: false }],
        }),

        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),

        new HtmlWebpackPlugin({
            filename: 'app.html',
            template: 'app/www/app.html',
            inject: false
        })
    ],

    target: 'electron-renderer'
});

export default config;