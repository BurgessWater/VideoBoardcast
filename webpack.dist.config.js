// 'use strict';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var extractCSS = new ExtractTextPlugin('css/[name].css', { allChunks: true });
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  entry: {
    index: './src/index',
    login: './src/single-page/login',
    reg: './src/single-page/reg',
    reset: './src/single-page/reset',
    user_center: './src/single-page/user-center',
  },
  output: {
    path: path.join(__dirname, 'dist'), // 输出文件路径
    publicPath: '',
    filename: 'js/[name].entry.js', // 输出文件名
  },
  module: {
    postLoaders: [
      {
        test: /\.jsx?$/, // 通过正则匹配js,jsx文件
        loaders: ['es3ify'], //IE8兼容
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/, // 通过正则匹配js,jsx文件
        loaders: ['babel'], // 调用 babel进行es6->es5转换,并且启用react热替换
        exclude: /node_modules/, // 跳过 node_modules 目录
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        exclude: path.resolve(__dirname, 'src/css'),
        loader: extractCSS.extract([
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss',
          'resolve-url',
          'sass',
        ], { publicPath: '../' }),
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/css'),
        loader: extractCSS.extract(['css', 'postcss', 'resolve-url', 'sass'], { publicPath: '../' }),
      },
      { test: /\.(jpg|gif|png|ico)$/, loader: 'file?name=images/[name].[ext]' },
    ],
  },
  postcss: function () {
    return [precss, autoprefixer];
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    extractCSS,
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    // }),
  ],
};
