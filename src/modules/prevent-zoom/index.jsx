import React, {Children} from 'react';
import {findDOMNode} from 'react-dom';

import Component from '../auto-bind-ancestor';

export default class PreventZoom extends Component {
  componentDidMount() {
    if (typeof window === 'object') {
      findDOMNode(this).addEventListener('touchstart', this.preventZoom);
    }
  }

  preventZoom(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

PreventZoom.propTypes = {
  children: React.PropTypes.any,
};
