'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');

  grunt.config.set('karma', {
    dev: {
      configFile: 'karma.conf.js',
    },
    ci: {
      options: {
        singleRun: true,
      },
      configFile: 'karma.conf.js',
    },
  });
};
