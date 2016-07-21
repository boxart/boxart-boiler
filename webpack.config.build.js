'use strict';

var autoprefixer = require('autoprefixer');
var ChildCompilerLoaderListPlugin = require(
  'child-compiler-loader-list-webpack-plugin'
);
var DefinePlugin = require('webpack').DefinePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWepbackPlugin = require('html-webpack-plugin');
var OfflinePlugin = require('offline-plugin');
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;

// This is used to extract the css into a separate stylesheet. We do that only
// for production builds so development builds can make use of hot module
// replacement and faster builds (extracting takes time).
//
// Multiple extractions could be done, as one option a critical section of css
// could be extracted and with a small plugin to HtmlWebpackPlugin, inlined
// into the output html.
var mainCssExtraction = new ExtractTextPlugin('[contenthash].css');

var loaders = [
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
      loader: mainCssExtraction.extract(
        'style-loader',
        'css-loader!postcss-loader!stylus-loader'
      ),
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
];

module.exports = {
  context: __dirname,
  entry: {
    main: './src',
  },
  output: {
    path: 'dist',
    filename: '[hash].js',
  },
  module: {
    loaders: loaders,
  },
  resolve: {
    modulesDirectories: ['node_modules', 'vendor'],
    extensions: ['', '.min.js', '.js', '.jsx'],
  },
  resolveLoaders: {
    modulesDirectories: ['node_modules', 'web_loaders'],
  },
  postcss: function() {
    return [autoprefixer];
  },
  plugins: [
    mainCssExtraction,
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new OfflinePlugin({
      caches: {
        main: ['index.html', '*'],
      },
      updateStrategy: 'changed',
      // scope is any subdirectory the deployed files will be under.
      // scope: '/rwd-game-boiler/',
    }),
    new ChildCompilerLoaderListPlugin({
      test: /html-webpack-plugin/,
      loaders: loaders
      .filter(function(loader) {return loader.test.source !== '\\.styl$';})
      .concat({
        test: /\.styl$/,
        loader: 'css-loader/locals!stylus-loader',
      }),
    }),
    new HtmlWepbackPlugin({
      filename: 'index.html',
      template: './src/index.bake.html',
      inject: 'body',
      chunks: ['main'],
    }),
    new UglifyJsPlugin(),
  ],
};
