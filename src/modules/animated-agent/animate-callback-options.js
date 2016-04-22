export default class AnimateCallbackOptions {
  constructor() {
    this._agent = null;
    this.animated = null;
    this.animatedEl = null;
    this.lastRect = null;
    this.rect = null;
  }

  set(agent, animated, animatedEl, lastRect, rect) {
    this._agent = agent;
    this.animated = animated;
    this.animatedEl = animatedEl;
    this.lastRect = lastRect;
    this.rect = rect;
    return this;
  }

  transitionFromLast(duration) {
    return this.transitionFrom(this.lastRect, this.rect, duration);
  }

  animateFromLast(duration) {
    return this.animateFrom(this.lastRect, this.rect, duration);
  }

  transitionFrom(lastRect, rect, duration) {
    return this._agent.transitionFrom(this.animated, this.animatedEl, lastRect, rect, duration);
  }

  animateFrom(lastRect, rect, duration) {
    return this._agent.animateFrom(this.animated, this.animatedEl, lastRect, rect, duration);
  }

  removeStyle() {
    this._agent.removeAnimatedStyle(this.animated, this.animatedEl);
  }

  setStyle(style) {
    this._agent.setAnimatedStyle(this.animated, this.animatedEl, style);
  }

  timer(fn) {
    const timer = this._agent.timer(fn);
    return timer;
  }
}
