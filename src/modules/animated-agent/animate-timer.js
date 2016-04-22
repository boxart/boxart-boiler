export default class AnimateTimer {
  constructor(agent) {
    this._agent = agent;
    this.run = 1;
    this._oncancel = null;
    this.promise = Promise.resolve();
  }

  _init(fn = function() {}) {
    this._oncancel = null;
    this.promise = Promise.resolve(fn.call(this, this));
    return this;
  }

  frame() {
    const run = this.run;
    return this._agent.frame()
    // return new Promise(requestAnimationFrame)
    .then(() => {
      if (this.run !== run) {
        throw new Error('Timer canceled');
      }
    });
  }

  timeout(delay) {
    const run = this.run;
    return new Promise(resolve => setTimeout(resolve, delay))
    .then(() => {
      if (this.run !== run) {
        throw new Error('Timer canceled');
      }
    });
  }

  loop(fn) {
    const run = this.run;
    return new Promise((resolve, reject) => {
      const loop = () => {
        if (this.run !== run) {
          reject(new Error('Timer canceled'));
        }
        else if (fn() >= 1) {
          resolve();
        }
        else {
          requestAnimationFrame(loop);
        }
      };
      loop();
    })
    .then(() => {
      if (this.run !== run) {
        throw new Error('Timer canceled');
      }
    });
  }

  cancelable(fn) {
    this._oncancel = fn;
  }

  cancel() {
    this.run++;
    let cancelResult;
    if (this._oncancel) {
      cancelResult = this._oncancel();
    }
    return cancelResult;
  }

  then(cb, eb) {
    return this.promise.then(cb, eb);
  }
}
