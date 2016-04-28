import React from 'react';

import QaAction from '../qa-action';

export default class QaState extends QaAction {
  action() {
    try {
      this._update(this._closeQa({
        [this.props.stateKey]: {$set: JSON.parse(this.refs.stateArea.value)},
      }));
    }
    catch (error) {
      /* eslint no-console: 0 */
      console.error('Unable to parse given state', error);
    }
  }

  render() {
    const updateTarget = this.props.updateTarget || this.context.updateTarget;
    return (<div
      className={'action' +
        (this.props.disabled ? ' disabled' : '') +
        (this.props.className ? ' ' + this.props.className : '')
      } >
      <div>
        {this.props.children}
        <button onKeyDown={this.action} onClick={this.action}>APPLY</button>
      </div>
      <textarea cols="80" rows="50"
        ref={'stateArea'}
        defaultValue={JSON.stringify(updateTarget.state[this.props.stateKey])}>
      </textarea>
    </div>);
  }
}

QaState.contextTypes = {
  handleUpdateClose: React.PropTypes.func,
  updateTarget: React.PropTypes.object,
};
