import React from 'react';

import Component from '../update-ancestor';

export default class QaMenu extends Component {

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
