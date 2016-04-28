export default class Rect {
  constructor(left = 0, top = 0, width = 0, height = 0, angle = 0) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.angle = angle;
  }

  relativeTo(rect) {
    this.left -= rect.left;
    this.top -= rect.top;
    this.angle -= rect.angle;
    return this;
  }

  set(left, top, width, height, angle = 0) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.angle = angle;
    return this;
  }

  clone(dst = new Rect()) {
    return dst.copy(this);
  }

  copy(src) {
    this.left = src.left;
    this.top = src.top;
    this.width = src.width;
    this.height = src.height;
    this.angle = src.angle || 0;
    return this;
  }

  interpolate(last, t, dst = new Rect()) {
    return dst.set(
      (this.left - last.left) * t + last.left,
      (this.top - last.top) * t + last.top,
      (this.width - last.width) * t + last.width,
      (this.height - last.height) * t + last.height,
      (this.angle - last.angle) * t + last.angle
    );
  }

  equal(other) {
    return (
      this.left === other.left &&
      this.top === other.top &&
      this.width === other.width &&
      this.height === other.height &&
      this.angle === other.angle
    );
  }

  transform(last) {
    let transform;
    const leftDiff = this.left - last.left;
    const topDiff = this.top - last.top;
    if (last.width !== this.width || last.height !== this.height) {
      const {width, height} = this;
      const widthScale = width / last.width;
      const heightScale = height / last.height;
      if (last.angle !== this.angle) {
        const angleDiff = this.angle - last.angle;
        transform = `translate3d(${leftDiff}px, ${topDiff}px, 0)` +
          ` scale(${widthScale}, ${heightScale}) rotateZ(${angleDiff}rad)`;
      }
      else {
        transform = `translate3d(${leftDiff}px, ${topDiff}px, 0) scale(${widthScale}, ${heightScale})`;
      }
    }
    else if (last.angle !== this.angle) {
      const angleDiff = this.angle - last.angle;
      transform = `translate3d(${leftDiff}px, ${topDiff}px, 0) rotateZ(${angleDiff}rad)`;
    }
    else {
      transform = `translate3d(${leftDiff}px, ${topDiff}px, 0)`;
    }
    return transform;
  }
}

Rect.getBoundingClientRect = function(element, dst = new Rect()) {
  return dst.copy(element.getBoundingClientRect());
};
