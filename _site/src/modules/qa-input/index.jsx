import React from 'react';

import QaAction from '../qa-action';

export default class QaInput extends QaAction {
  action() {
    this._update(this._closeQa(this.props.apply));
  }

  render() {
    return (<div
      className={'action' +
        (this.props.disabled ? ' disabled' : '') +
        (this.props.className ? ' ' + this.props.className : '')
      } >
      {this.props.children}
      <button onKeyDown={this.action} onClick={this.action}>APPLY</button>
    </div>);
  }
}

QaInput.contextTypes = {
  handleUpdateClose: React.PropTypes.func,
  updateTarget: React.PropTypes.object,
};
