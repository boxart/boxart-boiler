import React, {Component} from 'react';
import CardCenter from './card-center';

export default class CardCenter4 extends Component {
  getWires() {
    return Object.assign({}, this.card && this.card.getWires());
  }

  render() {
    return <CardCenter ref={card => {this.card = card;}} rooster={4} />;
  }
}

CardCenter4.previewArmature = true;
