import React, {Component} from 'react';
import CardCenter from './card-center';

export default class CardCenter6 extends Component {
  getWires() {
    return Object.assign({}, this.card && this.card.getWires());
  }

  render() {
    return <CardCenter ref={card => {this.card = card;}} rooster={6} />;
  }
}

CardCenter6.previewArmature = true;
