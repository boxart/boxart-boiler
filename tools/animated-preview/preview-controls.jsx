import React from 'react';

import Component from '../../src/modules/update-ancestor';

class PreviewButtons extends Component {
  shouldComponentUpdate(newProps, newState) {
    return this.props.state !== newProps.state;
  }

  buttonClass(name, active) {
    return `preview-controls-${name}` + (
      active ? ` preview-controls-${name}-active` : ''
    );
  }

  render() {
    const {player, state} = this.props;
    return (<span>
      <span onClick={player.play}
        className={this.buttonClass('play', state === 'playing')}>Play</span>
      <span onClick={player.pause}
        className={this.buttonClass('pause', state === 'paused')}>Pause</span>
      <span onClick={player.stepBackward}
        className={'preview-controls-backward'}>Back</span>
      <span onClick={player.stepForward}
        className={'preview-controls-forward'}>Forward</span>
    </span>);
  }
}

PreviewButtons.propTypes = {
  player: React.PropTypes.object,
  state: React.PropTypes.string,
};

class PreviewTime extends Component {
  shouldComponentUpdate(newProps, newState) {
    return this.props.time !== newProps.time;
  }

  render() {
    return (<div style={{
      display: 'inline-block',
      transform: 'translateZ(0)',
    }}>{this.props.time}</div>);
  }
}

PreviewTime.propTypes = {
  time: React.PropTypes.number,
};

export default class PreviewControls extends Component {
  constructor(props) {
    super(props);
    this.componentWillReceiveProps(props);
    this.state = {
      player: props.player && props.player.state || {},
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.player) {
      this.props.player.removeChangeListener(this.handleClipPlayerChange);
    }
    if (newProps.player) {
      newProps.player.addChangeListener(this.handleClipPlayerChange);
    }
  }

  handleClipPlayerChange() {
    this.setState({
      player: this.props.player.state,
    });
  }

  render() {
    return (<div className="preview-controls">
      <PreviewButtons state={this.state.player.state}
        player={this.props.player} />
      <PreviewTime time={this.state.player.t} />
    </div>);
  }
}

PreviewControls.propTypes = {
  player: React.PropTypes.object,
};
