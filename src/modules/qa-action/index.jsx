import React from 'react';
import update from 'react-addons-update';

import Action from '../action';

export default class QaAction extends Action {
  _update(_updateChange) {
    let updateChange = _updateChange;
    const updateTarget = this.props.updateTarget || this.context.updateTarget;
    if (typeof updateChange === 'function') {
      updateChange = updateChange();
    }
    updateTarget.setState(update(updateTarget.state, updateChange));
  }

  _closeQa(_updateChange) {
    let updateChange = _updateChange;
    if (this.context.handleUpdateClose) {
      if (typeof updateChange === 'function') {
        updateChange = updateChange();
      }
      updateChange = this.context.handleUpdateClose(updateChange);
    }
    return updateChange;
  }
}

QaAction.contextTypes = {
  handleUpdateClose: React.PropTypes.func,
  updateTarget: React.PropTypes.object,
};
