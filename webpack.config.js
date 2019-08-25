const webpack = require('webpack');

module.exports = {
    entry: {
        app: ['./public/App.js']
    },
    output: {
        path: './public/js',
        filename: 'app.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react']
                }
            }
        ]
    },
    plugins: [
        // new webpack.NoErrorsPlugin()
    ]
};
