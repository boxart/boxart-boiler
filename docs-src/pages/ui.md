---
layout: default
title:  "UI Helpers"
permalink: /ui/
categories: mainpage
---

A game board is just HTML: your markup can have whatever structure makes sense for your game. However, certain types of responsive layouts may occur across a wide variety of games: toolbars and sidebars, for instance, or a container that combines the two like a sidebar that snaps to the bottom of the screen on small devices.

This page provides a set of starter layouts that you can adapt to your own game. Since this documentation is generated from the boxart-boiler repository itself, you can edit the `docs-src/css/demos.css` file to see the effect your changes have on each type of layout. (To utilize these helpers in your own game, copy the CSS rules from this stylesheet into one of the stylus files inside `src/`.)

### Game Board

#### Basic Markup

Simple games usually have a play area and some form of status UI (turn number, score, etc) contained together within a "game board" container. Representing that layout in HTML, we get a generic, empty game container:

<iframe src="/layout/playarea"></iframe>
<a href="/layout/playarea">View Fullscreen</a>

~~~html
<div class="board">
  <div class="play-area">
  </div>
</div>
~~~

### Toolbars

We usually want a little more subdivision than one single container provides, though, so boxart-boiler provides a set of helper classes to help structure content within that game board.


#### Basic Usage

A div with class `.toolbar` will pin itself to the top of the game board:

<iframe src="/layout/toolbar"></iframe>
<a href="/layout/toolbar">View Fullscreen</a>

~~~html
<div class="board">
  <div class="toolbar">
    Basic Toolbar
  </div>
  <div class="play-area"></div>
</div>
~~~

#### Secondary Toolbar

A secondary toolbar, by contrast, will pin itself to the bottom of the page:

<iframe src="/layout/toolbar-secondary"></iframe>
<a href="/layout/toolbar-secondary">View Fullscreen</a>

~~~html
<div class="board">
  <div class="play-area"></div>
  <div class="toolbar toolbar-secondary">
    Secondary Toolbar
  </div>
</div>
~~~

#### Responsive Behavior

We describe toolbars as "primary" and "secondary" because they may not always be shown as headers or footers, depending on the device (and orientation thereof) that a player is using to enjoy your game. By default they will:

<iframe src="/layout/rwd-default" class="short"></iframe>
<a href="/layout/rwd-default">View Fullscreen</a>

~~~html
<div class="board">
  <div class="toolbar">
    Primary Toolbar
  </div>
  <div class="play-area"></div>
  <div class="toolbar toolbar-secondary">
    Secondary Toolbar
  </div>
</div>
~~~


but if you add the `.break-col` class to the containing `.board`, the toolbars will start out alongside your play area, and collapse to the top and bottom of the board only on smaller screens (try viewing this page on a desktop browser and manually resizing the browser window to see this behavior in action):

<iframe src="/layout/rwd-break-col/" class="short"></iframe>
<a href="/layout/rwd-break-col/">View Fullscreen</a>

~~~html
<div class="board break-col">
  <div class="toolbar break-top">
    Primary Toolbar
  </div>
  <div class="play-area"></div>
  <div class="toolbar toolbar-secondary break-top">
    Secondary Toolbar
  </div>
</div>
~~~

Individual toolbars within a `.break-col` board can be pushed to the top of their column by adding the `.break-top` class:

<iframe src="/layout/rwd-break-top/" class="short"></iframe>
<a href="/layout/rwd-break-top/">View Fullscreen</a>

~~~html
<div class="board break-col">
  <div class="toolbar break-top">
    Primary Toolbar
  </div>
  <div class="play-area"></div>
  <div class="toolbar toolbar-secondary break-top">
    Secondary Toolbar
  </div>
</div>
~~~

And `.break-bottom` does the same thing in reverse, pinning the column's contents to the bottom of the screen. These can be mixed and matched, as in this example below; and it is important to note that with the `<Clamp>` component, your game is not limited to the central play area, so you can structure your UI elements in columns however suits your game and still make use of the entire game board.

<iframe src="/layout/rwd-break-bottom/" class="short"></iframe>
<a href="/layout/rwd-break-bottom/">View Fullscreen</a>

~~~html
<div class="board break-col">
  <div class="toolbar break-bottom">Primary Toolbar</div>
  <div class="play-area"></div>
  <div class="toolbar toolbar-secondary break-top">
    Secondary Toolbar, .break-top
  </div>
  <div class="toolbar toolbar-secondary break-bottom">
    Another Secondary Toolbar, .break-bottom
  </div>
</div>
~~~


### Buttons

#### Markup

The `.btn` helper class consistently styles `a`,`button`, and `input` elements as buttons. You can apply the `.theme-light` or `.theme-dark` classes to the game board for different effects, but these styles (in `docs-src/css/demo.css`) are provided purely to serve as a base for your game's custom styling needs.

<iframe src="/layout/buttons/" class="very-short"></iframe>
<iframe src="/layout/buttons-dark/" class="very-short"></iframe>
~~~html
<a href="#" class="btn">Go</a>
<input type="submit" value="Go" class="btn">
<button class="btn">Go</button>
~~~
