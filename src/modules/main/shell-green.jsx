import React, {Component} from 'react';

import Shell from './shell';

export default class ShellGreen extends Component {
  getWires() {
    return this.shell.getWires();
  }

  render() {
    return <Shell ref={shell => {this.shell = shell;}} color={'green'} />;
  }
}

ShellGreen.previewArmature = true;
