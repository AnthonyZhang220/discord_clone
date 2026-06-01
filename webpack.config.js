const DotenvWebpackPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./index.js",
    mode: "development",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].[contenthash].js",
        publicPath: "/",
    },
    target: "web",
    devServer: {
        port: "5000",
        static: {
            directory: path.join(__dirname, "public"),
        },
        open: true,
        hot: true,
        liveReload: true,
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            zlib: require.resolve("browserify-zlib"),
            stream: require.resolve("stream-browserify"),
        },
        alias: {
            stream: "stream-browserify",
            "@": path.resolve(__dirname, "src"),
            "@styles": path.resolve(__dirname, "src/styles"), // 新增
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            url: {
                                filter: (url, resourcePath) => {
                                    // don't attempt to resolve absolute public assets, leave them as-is
                                    if (typeof url === "string" && url.startsWith("/assets/")) {
                                        return false;
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            api: "modern",
                            additionalData: `@use "sass:color";\n@use "variables" as *;\n`,
                            sassOptions: {
                                loadPaths: [path.resolve(__dirname, "src/styles")],
                                quietDeps: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
        new DotenvWebpackPlugin({
            safe: false,
            systemvars: true,
            expand: true,
        }),
        new NodePolyfillPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: "single",
    },
};
