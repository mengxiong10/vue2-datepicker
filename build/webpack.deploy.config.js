const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'index.js',
    library: "DatePicker",
    libraryTarget: "umd"
  },
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true }
    })
  ]
})

const webpackConfigExtractCss = merge(baseWebpackConfig, {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'datepicker.js',
    library: "DatePicker",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test:/\.scss$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'datepicker.css'
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true }
    })
  ]
})

module.exports = [ webpackConfig, webpackConfigExtractCss]
