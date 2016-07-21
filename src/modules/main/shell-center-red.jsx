import React, {Component} from 'react';
import ShellCenter from './shell-center';

export default class ShellCenterRed extends Component {
  getWires() {
    return Object.assign({}, this.shell && this.shell.getWires());
  }

  render() {
    return <ShellCenter ref={shell => {this.shell = shell;}} color={'red'} />;
  }
}

ShellCenterRed.previewArmature = true;
