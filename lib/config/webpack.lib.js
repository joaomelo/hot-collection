'use strict';
const path = require('path');
const merge = require('webpack-merge');

const common = require('../../config/webpack.common.js');

const dist = path.resolve(__dirname, '../dist');

module.exports = merge(common, {
  mode: 'production',
  entry: ['./lib/src/index.js'],
  output: {
    path: dist,
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'lib-template'
  }
});
