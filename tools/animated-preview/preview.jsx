import React from 'react';

import {AnimatedAgent} from 'boxart';

import Component from '../../src/modules/update-ancestor';

import AnimatedClipPlayer from './animated-clip-player';

export default class Preview extends Component {
  render() {
    const Armature = this.props.armature || 'span';
    return (<AnimatedAgent>
      <div className="preview">
        <div className="preview-sub">
          <AnimatedClipPlayer clip={this.props.clip}
            clipPlayer={this.props.player}>
            <Armature key={this.props.clip && this.props.clip.metadata.name} />
          </AnimatedClipPlayer>
        </div>
      </div>
    </AnimatedAgent>);
  }
}

Preview.propTypes = {
  armature: React.PropTypes.func,
  clip: React.PropTypes.object,
  player: React.PropTypes.object,
};
