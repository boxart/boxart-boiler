// Global style. Import it first so its in the DOM first.
import './styles/index.styl';

import React from 'react';
import ReactDOM from 'react-dom';

import Main from './modules/main';

import {addLocaleData, IntlProvider} from 'react-intl';
import enLocaleData from 'react-intl/dist/locale-data/en';
addLocaleData(enLocaleData);

import strings from './locale/en/strings.json';

ReactDOM.render(
    <IntlProvider locale="en" messages={strings}>
        <Main />
    </IntlProvider>,
    document.getElementById('root')
);
