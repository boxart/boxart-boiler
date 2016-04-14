'use strict';

var autoprefixer = require('autoprefixer');
var HtmlWepbackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    main: './src',
    'animated-preview': './tools/animated-preview',
  },
  output: {
    path: 'dist',
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      // Autoload style files named like an included jsx file.
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'baggage-loader?[file].styl',
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader',
      },
      {
        test: /\.(png|webm|webp|svg)$/,
        loader: 'file-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /[/\\]soundjs/,
        loader: 'exports-loader?createjs!script-loader',
      },
      {
        test: /\.wav$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    modulesDirectories: ['node_modules', 'vendor'],
    extensions: ['', '.js', '.jsx', '.min.js'],
  },
  postcss: function() {
    return [autoprefixer];
  },
  plugins: [
    new HtmlWepbackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: 'body',
      chunks: ['main'],
    }),
    new HtmlWepbackPlugin({
      filename: 'animated-preview.html',
      template: './tools/animated-preview/index.html',
      inject: 'body',
      chunks: ['animated-preview'],
    }),
  ],
};
