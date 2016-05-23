---
layout: default
title: Animation
permalink: /animation/
categories: mainpage
---

BoxArt is a tool for building games in the DOM: Every object in your game, from cards to player avatars, is represented by a DOM element, and rendering is handled by the browser. This sets BoxArt apart from other graphical web game environments such as Canvas or WebGL. To simplify working with complex animations in this environment, BoxArt provides a set of React components and code structures to encapsulate, design and implement DOM animation.

### DOM Animation

#### Animated and Animated Agent

BoxArt structures animation with two React components, `Animated` and `AnimatedAgent`. `Animated` is used to wrap an object in the document that is going to be animated, and to define how that object will move. `AnimatedAgent` wraps one or many `Animated` components and coordinates their animation. Both are necessary to define an animation:

~~~javascript
import {Animated, AnimatedAgent} from 'boxart';
~~~

`Animated` components have a required `animateKey` property, which is used by the parent `AnimatedAgent` to identify unique animations: no two `<Animated>` components within any one `<AnimatedAgent>` should use the same `animateKey`.

`Animated` can also take a `animate` property, which should be a function defining the desired animation. Animations can be as complex as you require, but one of the simplest kinds of motion is a linear transition; `Animated` will default to this if no `animate` function is provided.

If on successive renders that element moves to different places in the DOM, the `AnimatedAgent` will use the `animateKey` property to identify the new position. Rather than moving the element to the new location through JavaScript (which would require the browser to re-draw the page many times, causing irregular, stuttery motion or "jank"), the AnimatedAgent is instead identified in its new location, transformed back to the original position through CSS transforms (which do not cause a reflow), and then animated into the desired final position via CSS.

<iframe src="../examples/animation-simple.html" class="somewhat-short"></iframe>
<a href="#">View Fullscreen</a>

~~~html
<div class="board">
class Main extends UpdateAncestor {

  constructor() {
    super();

    this.state = {
      pos: 'left'
    };
  }

  swap() {
    this.setState({
      pos: this.state.pos === 'left' ? 'right' : 'left'
    });
  }

  render() {
    var pos1, pos2;
    var animatedContent = (
      <Animated animateKey="h1">
        <p><strong>Animated Content</strong></p>
      </Animated>
    );

    if (this.state.pos === 'right') {
      pos1 = animatedContent;
    } else {
      pos2 = animatedContent;
    }

    return (
      <AnimatedAgent>
        <div className="game-board">
          <p>Click either container to swap the content from one to the other</p>
          <div className="container" id="container1" onClick={this.swap}>
            {pos1}
          </div>
          <div className="container" id="container2" onClick={this.swap}>
            {pos2}
          </div>
        </div>
      </AnimatedAgent>
    );
  }
}
</div>
~~~

This can work with any number of elements, so long as they have unique `animateKey` attributes:

<iframe src="../examples/animation-simple-list.html" class="very-short"></iframe>
<a href="#">View Fullscreen</a>

~~~javascript
class Main extends UpdateAncestor {
  constructor() {
    super();

    this.state = {
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    };
  }

  shuffle() {
    this.setState({
      // Unreliable one-line array reverse & shuffle
      numbers: this.state.numbers.reverse().sort(() => Math.random() - 0.5 > 0 ? -1 : 1),
    });
  }

  render() {
    setTimeout(this.shuffle, 1000);
    return (
      <div className="game-board">
        <AnimatedAgent>
          <ul>
            {this.state.numbers.map((num) => (
              <Animated
                animateKey={num}
                key={num}>
                <li>{num}</li>
              </Animated>
            )}
          </ul>
        </AnimatedAgent>
      </div>
    );
  }
}
~~~

#### UpdateAncestor

`Animated` and `AnimatedAgent` are exports of the [boxart](http://github.com/boxart/boxart) package; the `UpdateAncestor` component used in the examples above is defined within [boxart-boiler](http://github.com/boxart/boxart-boiler). `UpdateAncestor` provides auto-binding and convenience methods for using [react-addons-update](https://facebook.github.io/react/docs/update.html), and can be used to wrap animated elements in order to simplify the process of re-rendering on update.

`UpdateAncestor` may be imported from `src/modules/update-ancestor`.

### Sprites

Coming Soon!
