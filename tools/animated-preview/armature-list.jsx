import React from 'react';

import Component from '../../src/modules/update-ancestor';

import NavList from './nav-list';

const armatures = require('./js-list')
.map(function(exports) {
  return exports.default || exports;
})
.filter(function(exports) {
  return (
    (
      exports.prototype &&
      exports.prototype.previewArmature === true &&
      exports.previewArmature !== false
    ) ||
    exports.previewArmature === true
  );
});

export default class ArmatureList extends Component {
  handleItemSelected(arm) {
    if (this.props.selectArmature) {
      this.props.selectArmature(arm);
    }
  }

  render() {
    const {selected} = this.props;
    return (<NavList title="Armatures" {...this.props}>
      {armatures.map(arm => (
        <div
          key={arm.name || arm.prototype.armatureName || arm.armatureName}
          onClick={() => this.handleItemSelected(arm)}
          className={selected === arm ? 'nav-list-item-selected' : ''}>
          {arm.name || arm.prototype.armatureName || arm.armatureName}
        </div>
      ))}
    </NavList>);
  }
}

ArmatureList.propTypes = {
  selectArmature: React.PropTypes.func,
  selected: React.PropTypes.func,
};
