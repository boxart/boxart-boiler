import React from 'react';
import {render} from 'react-dom';

import WebPClassSupport from '../../src/modules/webp-class-support';

import Main from './main';

render(
  <WebPClassSupport><Main /></WebPClassSupport>,
  document.getElementById('root')
);
