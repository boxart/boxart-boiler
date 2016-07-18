// Global style. Import it first so its in the DOM first.
import './styles/index.styl';

import React from 'react';
import ReactDOM from 'react-dom';
import {SoundContext} from 'react-soundjs';

import {Sound as SoundJS} from 'soundjs';

import Component from './modules/auto-bind-ancestor';

import Main from './modules/main';
import FullViewport from './modules/full-viewport';
import PreventZoom from './modules/prevent-zoom';
import WebPClassSupport from './modules/webp-class-support';

if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en');
}

import {addLocaleData, IntlProvider} from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
addLocaleData(enLocaleData);

let strings = require('./locale/en/strings.json');

class IntlMain extends Component {
  render() {
    return (
      <SoundContext soundjs={SoundJS}>
        <IntlProvider locale="en" messages={strings}>
          <WebPClassSupport>
            <PreventZoom><FullViewport><Main /></FullViewport></PreventZoom>
          </WebPClassSupport>
        </IntlProvider>
      </SoundContext>
    );
  }
}

ReactDOM.render(
  <IntlMain />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./locale/en/strings.json', function() {
    strings = require('./locale/en/strings.json');
    ReactDOM.render(
      <IntlMain />,
      document.getElementById('root')
    );
  });
}
