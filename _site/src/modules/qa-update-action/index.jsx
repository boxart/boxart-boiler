import React from 'react';

import QaAction from '../qa-action';

export default class QaUpdateAction extends QaAction {
  action() {
    this._update(this._closeQa(this.props.update));
  }
}

QaUpdateAction.contextTypes = {
  handleUpdateClose: React.PropTypes.func,
  updateTarget: React.PropTypes.object,
};
