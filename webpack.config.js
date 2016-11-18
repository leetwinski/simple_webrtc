module.exports = {
    context: __dirname,
    entry: "./src/main/js/app.jsx",
    output: {
        filename: "bundle.js",
        path: __dirname
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ["syntax-object-rest-spread"]
                }
            }
        ]
    }
}

