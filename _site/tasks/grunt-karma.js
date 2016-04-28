'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');

  var ciOptions = {
    singleRun: true,
    browserStack: {
      username: process.env.BS_USERNAME,
      accessKey: process.env.BS_ACCESS_KEY,
      retryLimit: 2,
    },
    // define browsers
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '21.0',
        os: 'OS X',
        os_version: 'Mountain Lion',
      },
      bs_chrome_windows: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '48',
        os: 'Windows',
        os_version: '8.1',
      },
      bs_ie_windows: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '8',
      },
      bs_iphone5: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '6.0',
      },
      bs_iphone6: {
        base: 'BrowserStack',
        device: 'iPhone 6',
        os: 'ios',
        os_version: '8.0',
      },
      // Commenting these out because they aren't working right now.
      // I'm not sure if it's browserstack or us... -gnarf
      //
      // bs_ipad2: {
      //   base: 'BrowserStack',
      //   device: 'iPad 2 (5.0)',
      //   os: 'ios',
      //   os_version: '5.0',
      // },
      // bs_samsung_galaxy_s3: {
      //   base: 'BrowserStack',
      //   device: 'Samsung Galaxy S3',
      //   os: 'android',
      //   os_version: '4.1',
      // },
      // bs_samsung_galaxy_tab_4_10_1: {
      //   base: 'BrowserStack',
      //   device: 'Samsung Galaxy Tab 4 10.1',
      //   os: 'android',
      //   os_version: '4.4',
      // },
      // bs_google_nexus_5: {
      //   base: 'BrowserStack',
      //   device: 'Google Nexus 5',
      //   os: 'android',
      //   os_version: '5.0',
      // },
    },
  };

  if (process.env.BS_USERNAME) {
    ciOptions.browsers = Object.keys(ciOptions.customLaunchers);
  }

  if (process.env.BROWSERS) {
    ciOptions.browsers = process.env.BROWSERS.split(' ');
  }

  grunt.config.set('karma', {
    dev: {
      configFile: 'karma.conf.js',
    },
    ci: {
      options: ciOptions,
      configFile: 'karma.conf.js',
    },
  });
};
