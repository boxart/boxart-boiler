// Global style. Import it first so its in the DOM first.
import './styles/index.styl';

import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import {SoundContext} from 'react-soundjs';

// Needs a browser context but we can safely mock it.
// import {Sound as SoundJS} from 'soundjs';

function Sound() {}

Sound.prototype.registerSound = function() {};
Sound.prototype.play = function() {};

const SoundJS = new Sound();

import Main from './modules/main';
import FullViewport from './modules/full-viewport';
import PreventZoom from './modules/prevent-zoom';

if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en');
}

import {addLocaleData, IntlProvider} from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
addLocaleData(enLocaleData);

const strings = require('./locale/en/strings.json');

class IntlMain extends Component {
  render() {
    return (
      <SoundContext soundjs={SoundJS}>
        <IntlProvider locale="en" messages={strings}>
          <PreventZoom><FullViewport><Main /></FullViewport></PreventZoom>
        </IntlProvider>
      </SoundContext>
    );
  }
}

module.exports = ReactDOMServer.renderToString(<IntlMain />);
