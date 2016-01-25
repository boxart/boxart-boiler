require('babel-register')
var getConfig = require('hjs-webpack')

var config = getConfig({
  in: 'src/index.jsx',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    var initialState = {};

    function render (state) {
      return context.defaultTemplate({
        title: 'React Skeleton POC'
      });
    }

    return {
      'index.html': render(initialState)
    }
  }
});

config.module.loaders.push({
  test: /.*\.svg$/i,
  loader: 'file',
});

module.exports = config;
