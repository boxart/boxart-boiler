# rwd-game-boiler

[![Build Status](https://ci.appveyor.com/api/projects/status/github/Bocoup/rwd-game-boiler?branch=master&svg=true)](https://ci.appveyor.com/project/Bocoup/rwd-game-boiler)
[![Build Status](https://travis-ci.org/bocoup/rwd-game-boiler.svg?branch=master)](https://travis-ci.com/bocoup/rwd-game-boiler)

A boilerplate repo for building responsive and accessible games on the web.

## System Dependencies

In order to use or contribute to this repo you'll need the following things 
installed on your system:

  - [NodeJS/NPM]
  - [GruntCLI] `npm install -g grunt-cli`
  - [Git]

## Getting Started

To start working with this repo and build your own responsive, accessible 
game we recommend you either download the code for the latest release from 
the [releases] page, or fork this repo and use git to clone your fork. 

Once the code is on your machine open a terminal in its directory and run 
`npm install`; this will install all our dependencies and you'll be
able to run the project's grunt tasks. To see the site hosted locally run
`grunt` and visit: [http://localhost:8080] in your browser of choice.

## Build Tasks

The following tasks are provided by this boilerplate for use during development.

### default 
`grunt`

The default grunt task runs `webpack-dev-server`; a task which hosts your 
site on a local http server and watches your code for changes. When 
changes are detected webpack will automatically cut a new build and the code 
(where possible) will be automatically swapped into the browser, meaning you 
don't have to refresh the page to see updates. If the code cannot be 
hotswapped the page will be refreshed so the latest changes are visible. The 
`webpack-dev-server` task is configured in the `grunt-webpack.js` file in the
[tasks directory], and is setup to read the `webpack.config.js` file to 
configure webpack's behavior.

### Generate Docs Site
`grunt docs`

TK

### Lint
`grunt lint`

This repo uses [eslint](http://eslint.org/) to enforce code quality and 
a consistent style across the project. Running `grunt lint` will notify
you of any possible JS errors or style variations. This task is configured 
with numerous `.eslintrc` files that are scattered throughout the repo. Note 
that none of those files actually define linting rules, instead they 
reference predefined rule sets which live in the [eslint directory].

An `.editorconfig` file is also provided to help reduce frustrating style 
errors that could bog down this linting task. If your text editor or IDE 
supports it, install an [editor config plugin].

### Test 
`grunt test`

The test task first lints the code the runs our tests using the [karma test runner]. 
Testing in JS typically involves lots of moving parts and this project is no 
exception: tests leverage the [Mocha Testing Framework], and the [Chai Assertion Library]. 

This task also sets up a watcher that will re-run tests when changes are 
detected. To run the tests only once the task `karma:ci` can be used instead,
but note it will _only_ run the tests and skip linting.

### Build 
`grunt build:dev`

The build task uses [Webpack] to bundle our code for release for a dev 
environment. Before building this task runs both the `lint` and 
`karma:ci` tasks, to ensure code quality. The `webpack.config.build.js` 
file is used to configure webpack's behavior during this task.

## Tech Stack and Tool Chain

This project makes liberal use of the following technologies:

  - [ES2015]
  - [SoundJS]
  - [React]
  - [Webpack]
  - [Stylus]
  - [Autoprefixer]

[GruntCLI]: http://gruntjs.com/getting-started
[Git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[NodeJS/NPM]: https://nodejs.org/en/download/
[releases]: https://github.com/bocoup/rwd-game-boiler/releases
[http://localhost:8080]: http://localhost:8080
[tasks directory]: https://github.com/bocoup/rwd-game-boiler/tree/master/tasks
[eslint directory]: https://github.com/bocoup/rwd-game-boiler/tree/master/eslint
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
