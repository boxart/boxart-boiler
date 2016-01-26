import React, {Component} from 'react';
import {render} from 'react-dom';

import Main from '../../src/modules/main';

describe('<Main>', function() {

  it('is a React Component', function() {
    expect(Main.prototype).is.an.instanceof(Component);
  });

  it('renders a div.game-board elment', function() {
    const root = document.createElement('div');
    render(<Main />, root);
    expect(root.querySelector('div.game-board')).to.be.ok;
  });

});
