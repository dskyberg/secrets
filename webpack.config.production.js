/**
 * Build config for electron 'Renderer Process' file
 */

import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import validate from 'webpack-validator';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import BabiliPlugin from 'babili-webpack-plugin';
import baseConfig from './webpack.config.base';
import {
    Joi
} from 'webpack-validator';

// Add any webpack schema extensions not covered by the default 
// webpack schema validation.
// This joi schema will be `Joi.concat`-ed with the internal schema
const yourSchemaExtension = Joi.object({
    // this would just allow the property and doesn't perform any additional validation
    sassLoader: Joi.any()
})

const config = merge(baseConfig, {
    devtool: 'cheap-module-source-map',

    entry: [
        'babel-polyfill',
        './app/index'
    ],

    output: {
        path: path.join(__dirname, 'app/dist'),
        publicPath: '../dist/'
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
        // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // https://github.com/webpack/webpack/issues/864
        new webpack.optimize.OccurrenceOrderPlugin(),

        // NODE_ENV should be production so that modules do not perform certain development checks
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new BabiliPlugin({
            // Disable deadcode until https://github.com/babel/babili/issues/385 fixed
            babili: ['babel-preset-babili', { deadcode: false }],
        }),

        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),

        new HtmlWebpackPlugin({
            filename: '../app.html',
            template: 'app/app.html',
            inject: false
        })
    ],

    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: 'electron-renderer'
});

export default validate(config, {
    schemaExtension: yourSchemaExtension
});