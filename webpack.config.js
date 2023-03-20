const DotenvWebpackPlugin = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle.js',
    },
    target: 'web',
    devServer: {
        port: '5000',
        static: {
            directory: path.join(__dirname, 'public')
        },
        open: true,
        hot: true,
        liveReload: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
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
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
        }),
        new DotenvWebpackPlugin(),
        // new EnvironmentPlugin(['REACT_APP_FIREBASE_API_KEY', 'REACT_APP_AUTH_DOMAIN', "REACT_APP_DATABASE_URL", "REACT_APP_PROJECT_ID", "REACT_APP_STORAGE_BUCKET", "REACT_APP_MESSAGING_SENDER_ID", "REACT_APP_FIREBASE_APP_ID", "REACT_APP_MEASUREMENT_ID"]),
        // new DefinePlugin({
        //     'process.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY),
        //     'process.env.REACT_APP_AUTH_DOMAIN': JSON.stringify(process.env.REACT_APP_AUTH_DOMAIN),
        //     'process.env.REACT_APP_DATABASE_URL': JSON.stringify(process.env.REACT_APP_REACT_APP_DATABASE_URL),
        //     'process.env.REACT_APP_PROJECT_ID': JSON.stringify(process.env.REACT_APP_REACT_APP_PROJECT_ID),
        //     'process.env.REACT_APP_STORAGE_BUCKET': JSON.stringify(process.env.REACT_APP_STORAGE_BUCKET),
        //     'process.env.REACT_APP_MESSAGING_SENDER_ID': JSON.stringify(process.env.REACT_APP_MESSAGING_SENDER_ID),
        //     'process.env.REACT_APP_FIREBASE_APP_ID': JSON.stringify(process.env.REACT_APP_FIREBASE_APP_ID),
        //     'process.env.REACT_APP_MEASUREMENT_ID': JSON.stringify(process.env.REACT_APP_MEASUREMENT_ID),
        // }),
    ]
};