var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './demo/main.js',
  output: {
    path: path.resolve(__dirname, './demo'),
    publicPath: '/demo/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    port: 9000
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
