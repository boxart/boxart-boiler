import React, {Component} from 'react';

export default class Shell extends Component {
  getWires() {
    return {
      box: this.root,
      shellChick: this.shellChick,
      shellCover: this.shellCover,
      shellTop: this.shellTop,
      shellRight: this.shellRight,
      shellBottom: this.shellBottom,
      shellLeft: this.shellLeft,
    };
  }

  render() {
    return (<div className={`shell shell-${this.props.color || 'blue'}`} ref={div => {this.root = div;}}>
      <div className="shell-chick" ref={div => {this.shellChick = div;}}></div>
      <div className="shell-top" ref={div => {this.shellTop = div;}}></div>
      <div className="shell-right" ref={div => {this.shellRight = div;}}></div>
      <div className="shell-bottom" ref={div => {this.shellBottom = div;}}></div>
      <div className="shell-left" ref={div => {this.shellLeft = div;}}></div>
      <div className="shell-cover" ref={div => {this.shellCover = div;}}></div>
    </div>);
  }
}

Shell.previewArmature = true;
