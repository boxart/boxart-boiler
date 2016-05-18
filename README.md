# boxart-boiler

[![Build Status](https://ci.appveyor.com/api/projects/status/github/boxart/boxart-boiler?branch=master&svg=true)](https://ci.appveyor.com/project/boxart/boxart-boiler)
[![Build Status](https://travis-ci.org/boxart/boxart-boiler.svg?branch=master)](https://travis-ci.com/boxart/boxart-boiler)

BoxArt-Boiler is a boilerplate repo for building responsive and accessible Open Web Games using the DOM.

## Why the DOM?

The HTML Document Object Model, or [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), and its accompanying CSS [box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model) lend themselves to responsive 2D-casual game board layouts. The highly-tuned HTML render flows of our browsers are more battery safe than canvas or WebGL alternatives, while also providing opportunities for graphics acceleration and performance. With boxart-boiler games, the idea is to build DOM-first. If you want to drop down into lower level drawing APIs, you can always temporarily rasterize and enhance an element outside of boxart.

## Getting Started with BoxArt

To start working with this repo and build your own responsive, accessible game we recommend you either download the code for the latest release from the [releases] page, or fork this repo and use git to clone your fork.

Once the code is on your machine open a terminal in its directory and run `npm install`; this will install all our dependencies and you'll be able to run the project's grunt tasks. To see the site hosted locally run `grunt` and visit [http://localhost:8080] in your browser of choice.

## System Dependencies

In order to use or contribute to this repo you'll need the following things installed on your system:

  - [NodeJS/NPM]
  - [Git]
  - [Grunt-CLI] `npm install -g grunt-cli`

## Build Tasks

The following tasks are provided by this boilerplate for use during development.

### default 
`grunt` or `npm start`

The default `grunt` task (aliased to `npm start`) runs `webpack-dev-server`; a task which hosts your site on a local http server and watches your code for changes. When changes are detected webpack will automatically cut a new build and the code (where possible) will be automatically swapped into the browser, meaning you don't have to refresh the page to see updates. If the code cannot be hotswapped the page will be refreshed so the latest changes are visible. The `webpack-dev-server` task is configured in the `grunt-webpack.js` file in the [tasks directory], and is setup to read the `webpack.config.js` file to configure webpack's behavior.

### Lint
`grunt lint` or `npm run lint`

This repo uses [eslint] to enforce code quality and a consistent style across the project. Running `grunt lint` (aliased to `npm run lint`) will notify you of any possible JS errors or style variations. This task is configured with numerous `.eslintrc` files that are scattered throughout the repo. Note that none of those files actually define linting rules, instead they reference predefined rule sets which live in the [eslint directory].

An `.editorconfig` file is also provided to help reduce frustrating style 
errors that could bog down this linting task. If your text editor or IDE 
supports it, install an [editor config plugin].

### Test
`grunt test` or `npm test`

The `grunt test` task (aliased to `npm test`) first lints the code, then runs our tests using the [karma test runner]. This task runs the test suite once, then exits; this mirrors what happens in our [continuous integration environment].

Testing in JS typically involves lots of moving parts, and this project is no  exception: tests leverage the [Mocha Testing Framework], and the [Chai Assertion Library].

To _skip_ linting and run only the tests themselves, use the command `grunt karma:ci` instead.

### Test-Dev
`grunt test-dev` or `npm run test-dev`

The `grunt test-dev` task (aliased to `npm run test-dev`) first lints the code, then starts the tests in a watcher that will re-run tests when code changes are detected. This task is designed to be run in the background while coding, to help catch errors as they occur.

### Build
`grunt build` or `npm run build`

The `grunt build` task (aliased to `npm run build`) uses [Webpack] to bundle our code for release for a dev  environment. Before building the code this task runs both the `lint` and  `karma:ci` tasks, to ensure code quality. The `webpack.config.build.js` file is used to configure webpack's behavior during this task.

Built files are output into the `dist/` directory.

## Documentation

The BoxArt-Boiler source contains a number of useful inline comments embedded within the code, but this repository also includes user documentation for all available BoxArt & BoxArt-Boiler features. This documentation is contained within the [docs-src directory], and can be rendered and viewed using the commands below.

### Generate Docs
`grunt docs` or `npm run docs`

The `grunt docs` command (aliased to `npm run docs`) will use Jekyll to build the documentation from the [docs-src directory] into the `docs/` folder, and will then start a web server on http://localhost:4000/ : the documentation site can be viewed at this address, and the HTML documentation will automatically be re-generated if any of the source markdown files change. (Note however that this server does not include live reload, so you will need to manually refresh your browser window to see those changes.)

## Tech Stack and Tool Chain

This project makes liberal use of the following technologies:

  - [ES2015]
  - [SoundJS]
  - [React]
  - [Webpack]
  - [Stylus]
  - [Autoprefixer]

[Grunt-CLI]: http://gruntjs.com/getting-started
[Git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[NodeJS/NPM]: https://nodejs.org/en/download/
[eslint]: http://eslint.org
[releases]: https://github.com/boxart/boxart-boiler/releases
[http://localhost:8080]: http://localhost:8080
[tasks directory]: https://github.com/boxart/boxart-boiler/tree/master/tasks
[eslint directory]: https://github.com/boxart/boxart-boiler/tree/master/eslint
[docs-src directory]: https://github.com/boxart/boxart-boiler/tree/master/docs-src
[karma test runner]: https://karma-runner.github.io/0.13/index.html
[Mocha Testing Framework]: https://mochajs.org/
[Chai Assertion Library]: http://chaijs.com/
[Webpack]: https://webpack.github.io/
[ES2015]: https://babeljs.io/docs/learn-es2015/
[SoundJS]: http://www.createjs.com/soundjs
[React]: https://facebook.github.io/react/
[Stylus]: http://stylus-lang.com/
[Autoprefixer]: https://github.com/postcss/autoprefixer
[editor config plugin]: http://editorconfig.org/#download
[continuous integration environment]: https://travis-ci.com

Cross-Browser Testing generously provided by

[![BrowserStack](docs-src/img/browserstack_logo.png)](https://www.browserstack.com)
