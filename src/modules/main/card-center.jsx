import React, {Component} from 'react';
import Card from './card';

export default class CardCenter extends Component {
  getWires() {
    return Object.assign({}, this.card && this.card.getWires());
  }

  render() {
    return (<div style={{position: 'absolute', display: 'table', width: '100%', height: '100%'}}>
      <div style={{display: 'table-cell', textAlign: 'center', verticalAlign: 'middle'}}>
        <div style={{display: 'inline-block', verticalAlign: 'top', width: '24%'}}>
          <Card ref={card => {this.card = card;}} rooster={this.props.rooster} />
        </div>
      </div>
    </div>);
  }
}

CardCenter.previewArmature = true;
