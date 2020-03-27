'use strict';
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                indentedSyntax: true
              }
            }
          }
        ]
      },
      {
        test: [/\.css$/],
        use: ['vue-style-loader', 'style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new VuetifyLoaderPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      allowAsyncCycles: false,
      cwd: process.cwd()
    })
  ]
};
