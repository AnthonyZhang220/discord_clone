import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { resolve as _resolve, join } from 'path';

export const entry = './index.js';
export const mode = 'development';
export const output = {
    path: _resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
    publicPath: '/',
};
export const target = 'web';
export const devServer = {
    port: '5000',
    static: {
        directory: join(__dirname, 'public')
    },
    open: true,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
};
export const resolve = {
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "stream": require.resolve("stream-browserify")
    },
    alias: {
        stream: 'stream-browserify'
    }
};
export const module = {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader',
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
        },
        {
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        },
    ],
};
export const plugins = [
    new HtmlWebpackPlugin({
        template: join(__dirname, 'public', 'index.html')
    }),
    new Dotenv(),
    new NodePolyfillPlugin(),
];