import React from 'react';

import Component from '../../src/modules/update-ancestor';

export default class NavList extends Component {
  handleHeaderClick() {
    if (this.props.shouldExpand) {
      this.props.shouldExpand();
    }
  }

  render() {
    return (<div className={`nav-list ${this.props.expand ? 'nav-list-expand' : ''}`}>
      <div className="nav-list-header" onClick={this.handleHeaderClick}>{this.props.title}</div>
      <div className={`nav-list-content ${this.props.expand ? 'nav-list-content-expand' : ''}`}>
        {this.props.children}
      </div>
    </div>);
  }
}

NavList.propTypes = {
  children: React.PropTypes.node,
  expand: React.PropTypes.bool,
  shouldExpand: React.PropTypes.func,
  title: React.PropTypes.string,
};
