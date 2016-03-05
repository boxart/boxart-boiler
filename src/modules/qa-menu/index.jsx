import React from 'react';

import BaseComponent from '../../classes/base-component';

export default class QaMenu extends BaseComponent {

  constructor() {
    super();

    this.state = {};
  }

  getChildContext() {
    return {
      handleUpdateClose: this.props.handleUpdateClose,
      updateTarget: this.props.updateTarget,
    };
  }

  render() {
    return (<div className={'qa-menu'}>
      {this.props.items}
    </div>);
  }
}

QaMenu.childContextTypes = {
  handleUpdateClose: React.PropTypes.func,
  updateTarget: React.PropTypes.object,
};
