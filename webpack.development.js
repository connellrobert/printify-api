const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = (env) => {
    return [
        {
            mode: 'development',
            target: 'node',
            devtool: 'source-map',
            externals: [nodeExternals()], // This line is added to exclude node modules from the bundle
            node: {
                // In more recent versions of Webpack, you might not need to manually set these properties
                // as Webpack will handle them more intelligently. However, if you encounter issues with __dirname or __filename,
                // you can uncomment these lines and adjust their values.
                // __dirname: false,
                // __filename: false,
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                            },
                        },
                    },
                    // Add loaders for other file types here, e.g., CSS, HTML, etc.
                ],
            },
            plugins: [
                // Add any other plugins you need here
            ],
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'index.js',
            },
            // Add any other Webpack configuration options you need here
        },
    ];
};