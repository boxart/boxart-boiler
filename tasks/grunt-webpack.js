'use strict';

var webpack = require('webpack');

var docsExamplesWebpackConfig = require('../webpack.config.docs-examples');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-webpack');

  grunt.config.set('webpack', {
    build: require('../webpack.config.build'),
    // grunt build-examples will build _and minify_ the documentation examples
    // (should be part of gh-pages deploy process)
    examples: Object.assign({}, docsExamplesWebpackConfig, {
      plugins: docsExamplesWebpackConfig.plugins.concat(
        // The grunt build-env task will cause Babel to exclude hmre code; to
        // ensure the production version of React is used, we must also define
        // NODE_ENV as production within the context of the webpack bundle.
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        // Minify
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
      ),
    }),
    // grunt build-examples-dev will start a watcher to rebuild the
    // examples in debug mode when their code changes, for development
    'examples-dev': Object.assign({}, docsExamplesWebpackConfig, {
      debug: true,
      // Watch mode
      watch: true,
      keepalive: true,
    }),
  });

  grunt.config.set('webpack-dev-server', {
    dev: {
      hot: true,
      inline: true,
      keepalive: true,
      host: '0.0.0.0',
      webpack: require('../webpack.config'),
    },
  });
};
