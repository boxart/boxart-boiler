import React from 'react';

import {Animated, AnimatedAgent} from 'boxart';

import Component from '../../src/modules/update-ancestor';

class Main extends Component {

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
            {this.state.numbers.map(num => <Animated
              animateKey={num}
              key={num}>
              <li>{num}</li>
            </Animated>)}
          </ul>
        </AnimatedAgent>
      </div>
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
