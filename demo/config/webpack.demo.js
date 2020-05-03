'use strict';
const path = require('path');
const merge = require('webpack-merge');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('../../config/webpack.common.js');

const src = path.resolve(__dirname, '../src');
const dist = path.resolve(__dirname, '../dist');
const lib = path.resolve(__dirname, '../../lib/src');

module.exports = merge(common, {
  mode: 'development',
  entry: ['./demo/src/index.js'],
  output: {
    publicPath: '/',
    path: dist,
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      __demo: src,
      __lib: lib
    }
  },
  devServer: {
    hot: true,
    port: 8080,
    historyApiFallback: true,
    noInfo: false,
    stats: 'normal',
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new Dotenv({ path: path.resolve(__dirname, './demo.env') }),
    new HtmlWebpackPlugin({ template: src + '/index.html' })
  ]
});
