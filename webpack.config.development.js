/* eslint-disable max-len */
/**
 * Build config for development process that uses Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */
import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import merge from 'webpack-merge';
import formatter from 'eslint-formatter-pretty';
import baseConfig from './webpack.config.base';

const port = process.env.PORT || 3000;

const config = merge(baseConfig, {
    debug: true,

    devtool: 'inline-source-map',

    entry: [
        `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
        'babel-polyfill',
        './app/index'
    ],

    output: {
        publicPath: `http://localhost:${port}/dist/`
    },
    externals: ['ws'],
    module: {
        noParse: ['ws'],
        // preLoaders: [
        //   {
        //     test: /\.js$/,
        //     loader: 'eslint-loader',
        //     exclude: /node_modules/
        //   }
        // ],
        loaders: [
            // Pipe other styles through css modules and append to style.css
            {
                test: /(\.scss|\.css)$/,
                loaders: [
                    'style-loader',
                    'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'postcss-loader',
                    'sass-loader'
                ]
            },

            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=[name].[ext]' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
            { test: /\.(ico|jpg|png|jpg|png|gif|ttf|eot|svg)$/, loader: 'file?name=[name].[ext]' }
        ]
    },

    eslint: {
        formatter
    },
    postcss: [autoprefixer],
    sassLoader: {
        data: '@import "theme/_config.scss";',
        includePaths: [path.resolve(__dirname, './app')]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    target: 'electron-renderer'
});

export default config;