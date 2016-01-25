// Global style. Import it first so its in the DOM first.
import './styles/index.styl';

import React from 'react';
import ReactDom from 'react-dom';

import Main from './modules/main';

ReactDom.render(
  <Main />,
  document.getElementById('root')
);
