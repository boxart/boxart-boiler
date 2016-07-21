import {Component, Children} from 'react';
import {findDOMNode} from 'react-dom';

export default class WebPClassSupport extends Component {
  constructor(...args) {
    super(...args);

    this.supports = {
      alpha: false,
    };

    if (typeof localStorage !== 'undefined' && localStorage._webp_support) {
      try {
        this.supports = JSON.parse(localStorage._webp_support);
      }
      catch (e) {}
    }

    const setter = (feature, result) => {
      this.supports[feature] = result;
      if (typeof localStorage !== 'undefined') {
        localStorage._webp_support = JSON.stringify(this.supports);
      }
      this.updateClass();
    };
    this.checkWebpFeature('alpha', setter);
  }

  componentDidMount() {
    this.updateClass();
  }

  componentDidUpdate() {
    this.updateClass();
  }

  // checkWebpFeature:
  //   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
  //   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
  checkWebpFeature(feature, callback) {
    if (typeof Image === 'undefined') {
      return callback(feature, false);
    }
    const kTestImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    };
    const img = new Image();
    img.onload = function() {
      const result = (img.width > 0) && (img.height > 0);
      callback(feature, result);
    };
    img.onerror = function() {
      callback(feature, false);
    };
    img.src = 'data:image/webp;base64,' + kTestImages[feature];
  }

  updateClass() {
    if (this.supports.alpha) {
      findDOMNode(this).classList.add('webp');
      findDOMNode(this).classList.remove('png');
    }
    else {
      findDOMNode(this).classList.add('png');
      findDOMNode(this).classList.remove('webp');
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}
