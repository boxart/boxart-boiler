---
layout: post
title:  "Getting started with Boxart"
date:   2016-04-25 11:05:11 -0400
categories: documentation
---
To start working with this repo and build your own responsive, accessible game we recommend you either download the code for the latest release from the releases page, or fork this repo and use git to clone your fork.

Once the code is on your machine open a terminal in its directory and run <code>npm install</code>; this will install all our dependencies, and you’ll be able to run the project's grunt tasks. To see the site hosted locally run <code>grunt</code>, then visit: [http://localhost:8080](http://localhost:8080) in your browser of choice.</p>

### Build Tasks

The following tasks are provided by this boilerplate for use during development.</p>

<div class="example">
    <h4 class="ex-hed">default grunt</h4>
    <p>The default grunt task runs webpack-dev-server; a task which hosts your site on a local http server and watches your code for changes. When changes are detected webpack will automatically cut a new build and the code (where possible) will be automatically swapped into the browser, meaning you don't have to refresh the page to see updates. If the code cannot be hotswapped the page will be refreshed so the latest changes are visible. The webpack-dev-server task is configured in the grunt-webpack.js file in the tasks directory, and is setup to read the webpack.config.js file to configure webpack's behavior.</p>
</div>
