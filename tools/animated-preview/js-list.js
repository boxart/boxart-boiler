module.exports = (() => {
  // Use webpack's context feature to load all of the js files in src and tools.
  // `context`'s arguments are the path to load, a boolean for whether to load
  // recursively or not, and a regex to filter by. Its statically analyzed by
  // webpack so we cannot store the regex and reuse it. The literal regex needs
  // to be passed.
  //
  // We need to make sure not to require entry points. Its not possible to
  // reason that in a normal js file. This may need to become a loader. Avoiding
  // that addition of complexity we can opt to exclude index files since they
  // are the entry into a folder. This does mean making armatures as the index
  // of a folder would be invisible to the preview tool. If a project can make
  // more specific assumptions it should do so to reopen that oppurtunity, like
  // how animated-preview excludes its root folder.
  const srcContext = require.context(
    '../../src', true,
    /(^(?!.*(index|animated-preview)).*\.jsx?$)|(animated-preview\/[^\\]*\/.*\.jsx?$)/);
  const toolsContext = require.context(
    '..', true,
    /(^(?!.*(index|animated-preview)).*\.jsx?$)|(animated-preview\/[^\\]*\/.*\.jsx?$)/);
  return srcContext.keys().map(key => srcContext(key))
  .concat(toolsContext.keys().map(key => toolsContext(key)));
})();
