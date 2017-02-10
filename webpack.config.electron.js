/**
 * Build config for electron 'Main Process' file
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import BabiliPlugin from 'babili-webpack-plugin';
import baseConfig from './webpack.config.base';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config = merge(baseConfig, {
    devtool: 'source-map',

    entry: {
        electron_google_oauth: './app/main/electron_google_oauth',
        main: [
            'babel-polyfill',
            './app/main/main'
        ]
    },

    // 'main.js' in root
    output: {
        path: path.resolve(__dirname, './app/dist/main'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },

    plugins: [
        new BabiliPlugin({
            deadcode: false,
        }),
        // Add source map support for stack traces in node
        // https://github.com/evanw/node-source-map-support
        // new webpack.BannerPlugin(
        //   'require("source-map-support").install();',
        //   { raw: true, entryOnly: false }
        // ),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CopyWebpackPlugin([
            { from: 'app/package.json', to: '../package.json' }
        ], {
            copyUnmodified: true
        })
    ],

    /**
     * Set target to Electron specific node.js env.
     * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
     */
    target: 'electron-main',

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    },
});
export default config;