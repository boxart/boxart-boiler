import React from 'react';

import Component from '../update-ancestor';

export default class Action extends Component {
  action() {
    this.props.action();
  }

  handleClick() {
    this.action();
  }

  handleKeyDown(e) {
    if (this.focused && e.which === 32 || e.which === 13) {
      this.action();
    }
  }

  handleFocus() {
    this.focused = true;
  }

  handleBlur() {
    this.focused = false;
  }

  render() {
    const opts = {
      onClick: this.handleClick,
      onKeyDown: this.handleKeyDown,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
    };
    if (this.props.focusable && !this.props.disabled) {
      opts.tabIndex = '0';
    }
    return (<div
      className={'action' +
        (this.props.disabled ? ' disabled' : '') +
        (this.props.className ? ' ' + this.props.className : '')
      }
      {...opts} >
      {this.props.children}
    </div>);
  }
}
