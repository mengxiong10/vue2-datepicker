const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  entry: './demo/index.js',
  output: {
    path: path.resolve(__dirname, '../demo'),
    filename: 'build.js'
  },
  externals: {
    'vue': 'Vue'
  },
  devServer: {
    historyApiFallback: {
      index: './demo/index.html'
    },
    noInfo: true,
    port: 9000
  },
  performance: {
    hints: false
  },
  devtool: 'cheap-module-eval-source-map'
})

module.exports = webpackConfig
