import React, {Component} from 'react';

export default class BoxCenter extends Component {
  getWires() {
    return {box: this.refs.box};
  }

  getWireInputs() {
    return {
      offset: (
        this.refs.parent.getBoundingClientRect().width -
          this.refs.box.getBoundingClientRect().width
      ),
    };
  }

  getWireProperties() {
    return {};
  }

  render() {
    return (<div ref="parent" style={{width: '100%', height: '100%', transform: 'translate(50%, 50%)'}}>
      <div style={{width: '33%', paddingBottom: '33%'}}>
        <div style={{width: '100%', height: '100%', transform: 'translate(-50%, -50%)'}}>
          <div ref="box" style={{width: '100%', paddingBottom: '100%', background: 'black'}}></div>
        </div>
      </div>
    </div>);
  }
}

BoxCenter.previewArmature = true;
