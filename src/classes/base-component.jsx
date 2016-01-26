/**
 * @file Base Component for React that auto-binds in ES6
 * @module classes/base-component
 * @see BaseComponent
 */

import React from 'react';

import bindMethods from '../util/bind-methods';

/**
 * Creates a new Base React component with self-bound methods
 * @constructor
 * @alias BaseComponent
 * @requires React
 * @requires module:utilBindMethods
 * @extends React.Component
 */
class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    bindMethods(this, null, BaseComponent.prototype);
  }
}

if (module.hot) {
  BaseComponent.prototype.componentWillUpdate = function(...args) {
    (React.Component.componentWillUpdate || (() => {})).call(this, ...args);
    bindMethods(this, null, BaseComponent.prototype);
  };
}

export default BaseComponent;
