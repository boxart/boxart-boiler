module.exports = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${require('!!sub-json?name!../package.json')} ${require('!!sub-json?version!../package.json')}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
