import React, {Component, Children} from 'react';
import {findDOMNode} from 'react-dom';

export default class WebPClassSupport extends Component {
  constructor(...args) {
    super(...args);

    this.supports = {
      lossy: false,
      lossless: false,
      alpha: false,
    };

    const setter = (feature, result) => {
      this.supports[feature] = result;
      this.updateClass();
    };
    this.check_webp_feature('lossy', setter);
    this.check_webp_feature('lossless', setter);
    this.check_webp_feature('alpha', setter);
  }

  // check_webp_feature:
  //   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
  //   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
  check_webp_feature(feature, callback) {
      var kTestImages = {
          lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
          lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
          alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
          animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
      };
      var img = new Image();
      img.onload = function () {
          var result = (img.width > 0) && (img.height > 0);
          callback(feature, result);
      };
      img.onerror = function () {
          callback(feature, false);
      };
      img.src = "data:image/webp;base64," + kTestImages[feature];
  }

  componentDidUpdate() {
    this.updateClass();
  }

  updateClass() {
    console.log(this.supports);
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
