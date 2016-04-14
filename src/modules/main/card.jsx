import React, {Component} from 'react';

export default class Card extends Component {
  getWires() { return {
    box: this.card,
  }; }
  render() { return (
    <div
      className={`card rooster-${this.props.rooster || 1} ${this.props.faceDown ? 'card-face-down' : ''}`}
      ref={card => {this.card = card;}}>
      <div className="card-back"></div>
    </div>
  ); }
}

Card.previewArmature = true;
