'use strict';

var glob = require('glob');
var path = require('path');
var HtmlWepbackPlugin = require('html-webpack-plugin');

// We have a number of example files, which should all be built into
// individual HTML files so that they can be included in the docs as
// discrete examples.
var entryFiles = glob.sync('./examples/*/index.jsx').reduce(function(entry, filepath) {
  var folderMatch = filepath.match(/[\/]([^\/]+)\/index.jsx/i);
  // Folder name should always match something, but safeguard against issues
  // with conditionals. Convert all non-(letters|numbers) in name to dashes.
  // This will be the name of the generated HTML file that can be embedded
  // in an <iframe> from the documentation site.
  var foldername = folderMatch && folderMatch[1] && folderMatch[1].replace(/[^\w]/g, '-');
  if (foldername) {
    entry[foldername] = filepath;
  }
  return entry;
}, {});

var exportExampleHTML = Object.keys(entryFiles).map(function(chunk) {
  return new HtmlWepbackPlugin({
    chunks: [chunk],
    filename: chunk + '.html',
    template: './src/index.html',
    inject: 'body',
  });
});

module.exports = {
  context: __dirname,
  // Build one example script for each example entry (index.jsx)
  entry: entryFiles,
  output: {
    // Output into docs-src
    path: path.join(__dirname, 'docs-src/examples'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  // Same loaders and resolution rules as in the main build
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
        test: /\.(png|webm|svg)$/,
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
  // Use an array of HtmlWebpackPlugin instances to handle building the HTML
  // for each example
  plugins: exportExampleHTML,
};
