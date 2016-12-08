// 'use strict';

var webpack = require('webpack');
var path = require('path');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:8000',
    'webpack/hot/only-dev-server',
    './src/index', // 定义程序入口文件
  ],
  output: {
    path: path.join(__dirname, 'dist'), // 输出文件路径
    publicPath: '/',
    filename: 'bundle.js', // 输出文件名
  },
  module: {
    // postLoaders: [
    //   {
    //     test: /\.jsx?$/, // 通过正则匹配js,jsx文件
    //     loaders: ['es3ify'], //IE8兼容
    //   }
    // ],
    loaders: [
      {
        test: /\.jsx?$/, // 通过正则匹配js,jsx文件
        loaders: ['babel'], // 调用 babel进行es6->es5转换,并且启用react热替换
        exclude: /node_modules/, // 跳过 node_modules 目录
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.scss$/,
        exclude: path.resolve(__dirname, 'src/css/'), // 跳过 node_modules 目录
        loaders: [
          'style',
          'css-loader?modules&sourceMap=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss',
          'resolve-url',
          'sass?sourceMap',
        ],
      },
      {
        test: /\.css/,
        loaders: [
          'style',
          'css-loader',
          'resolve-url',
        ],
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/css/'),
        loaders: ['style', 'css?sourceMap', 'postcss', 'resolve-url', 'sass?sourceMap'],
      },
      { test: /\.(jpg|gif|png|ico)$/, loader: 'url-loader?limit=10000000' },
    ],
  },
  postcss: function () {
    return [precss, autoprefixer];
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 启用热替换插件
  ],
};
