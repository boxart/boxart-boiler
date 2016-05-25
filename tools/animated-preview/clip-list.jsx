import React from 'react';

import Component from '../../src/modules/update-ancestor';

import NavList from './nav-list';

import ClipPlayer from './clip-player';

const clips = require('./js-list')
.map(function(exports) {
  return exports.default || exports;
})
.filter(function(exports) {
  return ClipPlayer.isClip(exports);
});

export default class ClipList extends Component {
  handleItemSelected(clip) {
    if (this.props.selectClip) {
      this.props.selectClip(clip);
    }
  }

  render() {
    const {selected} = this.props;
    if (
      selected &&
      !clips.reduce((carry, clip) => carry || clip === selected, false)
    ) {
      Promise.resolve()
      .then(() => this.handleItemSelected(clips.reduce((carry, clip) => {
        return clip.metadata.name === selected.metadata.name ? clip : carry;
      }, null)));
    }
    return (<NavList title="Clips" {...this.props}>
      {clips.map(clip => (
        <div
          key={clip.metadata.name}
          onClick={() => this.handleItemSelected(clip)}
          className={selected === clip ? 'nav-list-item-selected' : ''}>
          {clip.metadata.name}
        </div>
      ))}
    </NavList>);
  }
}

ClipList.propTypes = {
  selectClip: React.PropTypes.func,
  selected: React.PropTypes.object,
};
