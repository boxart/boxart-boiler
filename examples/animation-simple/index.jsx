import React from 'react';

import {Animated, AnimatedAgent} from 'boxart';

import Component from '../../src/modules/update-ancestor';

import './index.styl';

class Main extends Component {

  constructor() {
    super();

    this.state = {
      pos: 'left',
    };
  }

  swap() {
    this.setState({
      pos: this.state.pos === 'left' ? 'right' : 'left',
    });
  }

  render() {
    let pos1, pos2;
    const animatedContent = (
      <Animated animateKey="h1">
        <p><strong>Animated Content</strong></p>
      </Animated>
    );

    if (this.state.pos === 'right') {
      pos1 = animatedContent;
    }
    else {
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

// Boilerplate
// ============================================================================

import '../../src/styles/index.styl';
import ReactDOM from 'react-dom';
import FullViewport from '../../src/modules/full-viewport';
import PreventZoom from '../../src/modules/prevent-zoom';

class Example extends Component {
  render() {
    return (
      <PreventZoom><FullViewport>
        <Main />
      </FullViewport></PreventZoom>
    );
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('root')
);
