var loaderUtils = require('loader-utils');

module.exports = function(content) {
  var query = loaderUtils.parseQuery(this.query);
  var key = Object.keys(query)[0];
  console.log(key, JSON.parse(content)[key]);
  return 'module.exports = ' + JSON.stringify(JSON.parse(content)[key]) + ';';
};
