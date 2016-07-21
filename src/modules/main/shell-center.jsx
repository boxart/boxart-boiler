import React, {Component} from 'react';
import Shell from './shell';

export default class ShellCenter extends Component {
  getWires() {
    return Object.assign({}, this.shell && this.shell.getWires());
  }

  render() {
    return (<div style={{position: 'absolute', display: 'table', width: '100%', height: '100%'}}>
      <div style={{display: 'table-cell', textAlign: 'center', verticalAlign: 'middle'}}>
        <div style={{display: 'inline-block', verticalAlign: 'top', width: '10%'}}>
          <Shell ref={shell => {this.shell = shell;}} color={this.props.color} />
        </div>
      </div>
    </div>);
  }
}

ShellCenter.previewArmature = true;


// .clamp-a {
//   position absolute;
//   display: table;
//   width: 100%;
//   height: 100%;
// }
//
// .clamp-b {
//   display: table-cell;
//   text-align: center;
//   vertical-align: middle;
// }
//
// .clamp-c {
//   width: 100%;
//   display: inline-block;
//   vertical-align: top;
// }
//
// .clamp-d {
//   position: relative;
//   display: inline-block;
//   vertical-align: top;
//   // background: #ddd;
// }
//
// .clamp-e {
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   // background: #ccc;
// }
