import React, {Component} from 'react';

export default class Box extends Component {
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
    return (<div ref="parent" style={{width: '100%', height: '100%'}}>
      <div ref="box" style={{width: '33%', paddingBottom: '33%', background: 'black'}}></div>
      <div ref="boxDestination" style={{position: 'absolute', right: 0, width: '33%', paddingBottom: '33%'}}></div>
    </div>);
  }
}

Box.previewArmature = true;
