import React from 'react';

import Component from '../../src/modules/update-ancestor';

import ArmatureList from './armature-list';
import ClipList from './clip-list';
import ClipPreviewPlayer from './clip-preview-player';
import PreviewControls from './preview-controls';
import Preview from './preview';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.clipPlayer = new ClipPreviewPlayer();
    this.state = {
      ux: {
        expandArmatures: false,
        expandClips: false,
      },
    };
  }

  expandArmatures() {
    this.updateState({ux: {expandArmatures: {$apply: expanded => !expanded}}});
  }

  selectArmature(_arm) {
    const arm = _arm === this.state.ux.armature ? null : _arm;
    this.updateState({ux: {armature: {$set: arm}}});
  }

  expandClips() {
    this.updateState({ux: {expandClips: {$apply: expanded => !expanded}}});
  }

  selectClip(_clip) {
    const clip = _clip === this.state.ux.clip ? null : _clip;
    this.updateState({ux: {clip: {$set: clip}}});
  }

  render() {
    return (<div className="main">
      <ArmatureList shouldExpand={this.expandArmatures}
        expand={this.state.ux.expandArmatures} selected={this.state.ux.armature}
        selectArmature={this.selectArmature}/>
      <ClipList shouldExpand={this.expandClips}
        expand={this.state.ux.expandClips} selected={this.state.ux.clip}
        selectClip={this.selectClip}/>
      <div className="preview-col">
        <PreviewControls clip={this.state.ux.clip} player={this.clipPlayer}/>
        <Preview armature={this.state.ux.armature} clip={this.state.ux.clip}
          player={this.clipPlayer}/>
      </div>
    </div>);
  }
}
