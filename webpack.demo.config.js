const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.js')
const webpack = require('webpack')

const webpackConfig = merge(baseWebpackConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
})

module.exports = webpackConfig
