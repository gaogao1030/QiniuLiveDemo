var webpack = require("webpack");
var path = require("path");

module.exports = {
  resolve: {
    fallback: path.join(__dirname,"node_modules"),
    alias: {
      YouYuChatJs: './src/YouYuChat/javascript',
      YouYuChatStyle: './src/YouYuChat/stylesheets',
      YouYuChat: './src/YouYuChat',
    },
    extensions: ["",".js",".coffee"]
  },
  devtool: 'source-map',
  entry: {
    YouYuChat: [
      'YouYuChat/YouYuChatEnter'
    ]
  },
  output: {
    path: path.resolve(__dirname,'public','build'),
    filename: '[name].js',
    publicPath: "/build/",
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.scss$/, loaders: ["style","css","sass"] }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin("common","common.js")
  ]
}
