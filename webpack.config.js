var webpack = require("webpack");
var path = require("path");


module.exports = {
  resolve: {
    fallback: path.join(__dirname,"node_modules"),
    alias: {
      js: './_assets/javascript',
      bow: './bower_components'
    },
    extensions: ["",".js",".coffee"]
  },
  entry: {
    YouYuChat: [
      'webpack-dev-server/client?http://0.0.0.0:4000',
      'webpack/hot/dev-server',
      'js/YouYuChatBase','js/YouYuChatUtil','js/YouYuChatCheatCode',
      'js/YouYuChatVisitor','js/YouYuChatUser','js/YouYuChatMain',
      'js/YouYuChatState','js/YouYuChatExpose','./_assets/YouYuChatModule'
    ],
    vendor: [
      'bow/leancloud-realtime/dist/AV.realtime.min.js',
      'bow/js-md5/src/md5.js',
      'bow/video.js/dist/video.js',
      'js/initPlayer.coffee',
      'js/videojs.hls.min.js',
      'js/videojs-media-sources.js',
    ]
  },
  output: {
    path: path.resolve(__dirname,'./build'),
    filename: '[name].js',
    publicPath: "/assets",
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.scss$/, loaders: ["style","css","sass"] }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
