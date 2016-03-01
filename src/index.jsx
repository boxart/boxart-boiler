// Global style. Import it first so its in the DOM first.
import './styles/index.styl';

import React from 'react';
import ReactDOM from 'react-dom';
import {SoundContext} from 'react-soundjs';

import {Sound as SoundJS} from 'soundjs';

import Main from './modules/main';

if (!global.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en');
}

import {addLocaleData, IntlProvider} from 'react-intl';
import enLocaleData from 'react-intl/dist/locale-data/en';
addLocaleData(enLocaleData);

import strings from './locale/en/strings.json';

ReactDOM.render(
  <SoundContext soundjs={SoundJS}>
    <IntlProvider locale="en" messages={strings}>
      <Main />
    </IntlProvider>
  </SoundContext>,
  document.getElementById('root')
);
