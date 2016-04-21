import React, {Component} from 'react';

/**
 * Clamp
 *
 * Clamp children into a box that maintains aspect ratio and is centered in
 * the viewport.
 */
export default class Clamp extends Component {
  render() {
    const {
      width = 2,
      height = 3,
    } = this.props;
    return (<div className="clamp-a">
      <div className="clamp-b">
        <div className="clamp-c" style={{
          maxWidth: `${width / height * 100}vh`,
        }}>
          <div className="clamp-d" style={{
            width: `100%`,
            paddingBottom: `${height / width * 100}%`,
          }}>
            <div className="clamp-e">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}
