import React, {Children} from 'react';

import {Animated as Component} from 'boxart';

import ClipPlayer from './clip-player';

export default class AnimatedClipPlayer extends Component {
  constructor(props) {
    super(props);

    this.clipPlayer = null;
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (
      typeof newProps.clipPlayer !== 'undefined' &&
      this.clipPlayer !== newProps.clipPlayer
    ) {
      this.clipPlayer = newProps.clipPlayer;
    }
    if (!this.clipPlayer) {
      this.clipPlayer = new ClipPlayer();
    }
  }

  getAnimateKey() {
    if (this.props.animateKey) {
      return this.props.animateKey;
    }
    if (!this.animateKey) {
      this.animateKey = Math.random().toString();
    }
    return this.animateKey;
  }

  animate(options) {
    this.clipPlayer.setArmature(null);
    this.clipPlayer.setClip(this.props.clip);
    this.clipPlayer.setArmature(this.props.armature || this.child);
    return this.clipPlayer.animate(options);
  }

  render() {
    let child = Children.toArray(this.props.children)[0];
    if (child) {
      const original = child;
      child = React.cloneElement(child, {key: child.key, ref: component => {
        if (original.ref) {
          original.ref(component);
        }
        this.child = component;
      }});
    }
    else {
      child = <span></span>;
    }
    return child;
  }
}

AnimatedClipPlayer.propTypes = {
  animateKey: React.PropTypes.any,
  clip: React.PropTypes.object,
  armature: React.PropTypes.object,
  children: React.PropTypes.node,
};
