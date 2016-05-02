'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-jekyll');

  grunt.config.set('jekyll', {
    default: {
      options: {
        dest: 'docs',
        src: 'docs-src',
        serve: true,
      },
    },
  });
};