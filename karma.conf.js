// Karma configuration

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'tests/**/*.jsx',
      'tests/**/*.js',
    ],

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon-chai'),
      require('karma-webpack'),
      require('karma-browserstack-launcher'),
      require('karma-chrome-launcher'),
      require('karma-safari-launcher'),
      require('karma-firefox-launcher'),
      require('karma-ie-launcher'),
    ],

    // Configure mocha
    client: {
      mocha: {
        // change Karma's debug.html to the mocha web reporter
        reporter: 'html',
        ui: 'bdd',
      },
    },

    webpack: (function() {
      process.env.NODE_ENV = 'production';
      var webpackConf = require('./webpack.config');
      delete webpackConf.entry;
      delete webpackConf.context;
      delete webpackConf.plugins;
      return webpackConf;
    })(),

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/**/*.jsx': ['webpack'],
      'tests/**/*.js': ['webpack'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

  });
};
