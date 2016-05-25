'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-eslint');

  grunt.config.set('eslint', {
    src: {
      options: {
        configFile: 'src/.eslintrc',
      },
      src: ['src/**/*.js{,x}'],
    },
    examples: {
      options: {
        configFile: 'examples/.eslintrc',
      },
      src: ['examples/**/*.js{,x}'],
    },
    tools: {
      options: {
        configFile: 'tools/.eslintrc',
      },
      src: ['tools/**/*.js{,x}'],
    },
    tests: {
      options: {
        configFile: 'tests/.eslintrc',
      },
      src: ['tests/**/*.js{,x}'],
    },
    config: {
      options: {
        configFile: '.eslintrc',
      },
      src: ['*.js', 'tasks/*.js'],
    },
  });
};
