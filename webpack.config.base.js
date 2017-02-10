/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import {
    dependencies as externals
} from './app/package.json';

export default {
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },

    output: {
        path: path.join(__dirname, 'app'),
        libraryTarget: 'commonjs2'
    },

    // https://webpack.github.io/docs/configuration.html#resolve
    resolve: {
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ],
        extensions: ['', '.js', '.jsx', '.scss', '.css', '.json'],
        packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    },

    plugins: [],

    externals: Object.keys(externals || {})
};