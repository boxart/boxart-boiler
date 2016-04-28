---
layout: post
title:  "Getting started with Boxart"
date:   2016-04-25 11:05:11 -0400
categories: home
---
To start working with this repo and build your own responsive, accessible game we recommend you either download the code for the latest release from the releases page, or fork this repo and use git to clone your fork.

Once the code is on your machine open a terminal in its directory and run <code>npm install</code>; this will install all our dependencies, and you’ll be able to run the project's grunt tasks. To see the site hosted locally run <code>grunt</code>, then visit: [http://localhost:8080](http://localhost:8080) in your browser of choice.

### Build Tasks

The following tasks are provided by this boilerplate for use during development.

#### default
    grunt

The default grunt task runs `webpack-dev-server`; a task which hosts your site on a local http server and watches your code for changes. When changes are detected webpack will automatically cut a new build and the code (where possible) will be automatically swapped into the browser, meaning you don't have to refresh the page to see updates. If the code cannot be hotswapped the page will be refreshed so the latest changes are visible. The `webpack-dev-server` task is configured in the `grunt-webpack.js` file in the [tasks directory](https://github.com/bocoup/rwd-game-boiler/tree/master/tasks), and is setup to read the <code>webpack.config.js</code> file to configure webpack's behavior.

#### lint 
    grunt lint

This repo uses [eslint](http://eslint.org/) to enforce code quality and a consistent style across the project. Running `grunt lint` will notify you of any possible JS errors or style variations. This task is configured with numerous `.eslintrc` files that are scattered throughout the repo. Note that none of those files actually define linting rules, instead they reference predefined rule sets which live in the [eslint directory](https://github.com/bocoup/rwd-game-boiler/tree/master/eslint).

An `.editorconfig` file is also provided to help reduce frustrating style 
errors that could bog down this linting task. If your text editor or IDE 
supports it, install an [editor config plugin](http://editorconfig.org/#download).

#### test 
    grunt test

The test task first lints the code the runs our tests using the [karma test runner](https://karma-runner.github.io/0.13/index.html). Testing in JS typically involves lots of moving parts and this project is no exception: tests leverage the [Mocha Testing Framework](https://mochajs.org/), and the [Chai Assertion Library](http://chaijs.com).

This task also sets up a watcher that will re-run tests when changes are detected. To run the tests only once the task `karma:ci` can be used instead, but note it will only run the tests and skip linting.

#### build 
    grunt build:dev

The build task uses [Webpack](https://webpack.github.io/) to bundle our code for release for a dev environment. Before building this task runs both the `lint` and `karma:ci` tasks, to ensure code quality. The `webpack.config.build.js` file is used to configure webpack's behavior during this task.

### Tech Stack and Tool Chain

This project makes liberal use of the following technologies:

* [ES2015](https://babeljs.io/docs/learn-es2015/)
* [SoundJS](http://www.createjs.com/soundjs)
* [React](https://facebook.github.io/react/)
* [Webpack](https://webpack.github.io/)
* [Stylus](http://stylus-lang.com/)
* [Autoprefixer](https://github.com/postcss/autoprefixer)
