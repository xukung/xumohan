var webpack = require('webpack');
var path = require('path');
var packageJson = require('./package.json');

module.exports = {
    mode: 'development',    //[ production,development ]
    entry: {
        main: ['./public/src/js/router.js'],
        vendor: Object.keys(packageJson.dependencies),
    },
    output: {
        path: path.join(__dirname, 'public/dist/js/'),
        filename: 'bundle_[name].js',

        publicPath: "/dist/js/",
        // chunkFilename: 'chunk_[id]_[chunkhash].js',
        chunkFilename: 'chunk_[id].js',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    },
    node: {
        fs: "empty"
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     "process.env": {
        //         NODE_ENV: JSON.stringify("production")
        //         // NODE_ENV: JSON.stringify("development")
        //     }
        // }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};