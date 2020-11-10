var path = require("path")

module.exports = {
    entry: "./client",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    output: {
        filename: "bundle.js"
    },
    devServer: {
      contentBase: path.join(__dirname,"dist"),   
      historyApiFallback: true
    }
}