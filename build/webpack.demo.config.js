const merge = require('webpack-merge')
const devWebpackConfig = require('./webpack.dev.config.js')

const webpackConfig = merge(devWebpackConfig, {
  devtool: 'source-map',
  mode: 'production',
  externals: {
    'vue': 'Vue',
    '@/index': 'DatePicker'
  },
})

module.exports = webpackConfig
