const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: ["./src/index.js"],
  output: {
    filename: "./output.js",
    path: path.resolve(__dirname)
  },
  plugins: [new webpack.NamedModulesPlugin()],
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
