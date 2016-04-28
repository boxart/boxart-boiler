'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-webpack');

  grunt.config.set('webpack', {
    build: require('../webpack.config.build'),
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
