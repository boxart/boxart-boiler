import React from 'react';
import {findDOMNode} from 'react-dom';

import Component from '../auto-bind-ancestor';

/**
 * FullViewport
 *
 * Fill the full viewport on all systems.
 *
 * Help dismiss navigation elements in browsers for mobile browsers by
 * increasing the height of the container and scrolling to 0. This lets the
 * user scroll down to get rid of the browser's hud. This will not stop it from
 * coming back, a top near the top (or bottom) of the viewport will back those
 * elements as well as scrolling up.
 */
export default class FullViewport extends Component {
  constructor(...args) {
    super(...args);

    this.loopScrollLoopId = null;
    this.modifiedStyle = false;

    this.state = {
      landscape: false,
    };
  }

  componentDidMount() {
    if (typeof window === 'object') {
      window.addEventListener('touchstart', this.handleScrollStart);
      window.addEventListener('touchend', this.handleScrollEnd);
      window.addEventListener('orientationchange', this.handleOrientation);
      window.addEventListener('resize', this.handleLandscape);
      setTimeout(this.handleOrientation, 0);
    }
  }

  componentWillUnmount() {
    if (typeof window === 'object') {
      window.removeEventListener('touchstart', this.handleScrollStart);
      window.removeEventListener('touchend', this.handleScrollEnd);
      window.removeEventListener('orientationchange', this.handleOrientation);
      window.removeEventListener('resize', this.handleLandscape);
      this.cancelLandscape();
    }
  }

  cancelLandscape() {
    cancelAnimationFrame(this.loopScrollLoopId);
  }

  handleScrollStart(event) {
    this.cancelLandscape();
  }

  handleScrollEnd() {
    if (event.touches.length === 0) {
      this.handleLandscape();
    }
  }

  handleLandscape() {
    this.cancelLandscape();
    if (Math.abs(window.orientation) === 90) {
      let i = 0;
      const loop = () => {
        if (i++ > 120) {return;}
        this.loopScrollLoopId = requestAnimationFrame(loop);
        window.scrollTo(window.scrollX, Math.floor(window.scrollY * 0.9));
        this.modifiedStyle = true;

        findDOMNode(this.refs.fullViewport).style.height =
          `${window.innerHeight}px`;
      };
      loop();
    }
    else if (this.modifiedStyle) {
      findDOMNode(this.refs.fullViewport).style.height =
        `${window.innerHeight}px`;
    }
  }

  handleOrientation() {
    if (Math.abs(window.orientation) === 90) {
      this.setState({landscape: true});
    }
    else {
      this.setState({landscape: false});
    }
    this.handleLandscape();
  }

  render() {
    return (<div className={
      `full-viewport-container ${this.state.landscape ? 'landscape' : ''}`
     }>
      <div ref="fullViewport" className="full-viewport">
        {this.props.children}
      </div>
    </div>);
  }
}

FullViewport.propTypes = {
  children: React.PropTypes.any,
};
