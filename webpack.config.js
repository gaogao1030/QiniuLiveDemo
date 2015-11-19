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
  entry: {
    YouYuChat: [
      'webpack-dev-server/client?http://0.0.0.0:4000',
      'webpack/hot/dev-server',
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
    new webpack.optimize.CommonsChunkPlugin("common","common.js"),
    new webpack.HotModuleReplacementPlugin()
  ]
}
