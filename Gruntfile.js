'use strict';

module.exports = function(grunt) {
  grunt.loadTasks('tasks');

  grunt.registerTask('build-env', function() {
    process.env.NODE_ENV = 'production';
  });

  grunt.registerTask('default', ['webpack-dev-server']);
  grunt.registerTask('test', ['karma:ci']);
  grunt.registerTask('build', ['karma:ci', 'build-env', 'webpack']);
};
