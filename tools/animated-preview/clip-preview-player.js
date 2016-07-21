import ClipPlayer from './clip-player';

export default class ClipPreviewPlayer extends ClipPlayer {
  constructor() {
    super();

    this.listeners = [];

    this.state = {
      state: 'playing',
      t: 0,
      tNormalized: 0,
    };

    this._resume = null;

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.stepForward = this.stepForward.bind(this);
    this.stepBackward = this.stepBackward.bind(this);
  }

  setArmature(armature) {
    if (this.armature !== armature) {
      this._restore();
    }
    this.armature = armature;
    this._replace();
    this.step(0);
  }

  setClip(clip) {
    this._store = null;
    if (this.clip !== clip) {
      this._restore();
    }
    this.clip = clip;
    this._replace();
    this.step(0);
  }

  play() {
    this._update({
      state: 'playing',
    })
    .then(this._resume);
  }

  pause() {
    return this._update({
      state: 'paused',
    });
  }

  stepForward() {
    this.pause()
    .then(() => {
      this.step(Math.min(this.state.t + 16, this.clipDuration()));
    });
  }

  stepBackward() {
    this.pause()
    .then(() => {
      this.step(Math.max(this.state.t - 16, 0));
    });
  }

  step(t) {
    if (!this.armature || !this.clip) {return;}

    const wires = this._getWires();
    if (!wires) {return;}

    const inputs = this._getWireInputs();
    const wireProperties = this._getWireProperties();

    this._primeStore(inputs, wires, wireProperties);
    this._step(t, inputs, wires, wireProperties);

    const tNormalized = t / this.clipDuration();
    this._update({
      t,
      tNormalized,
    });
  }

  animate(options) {
    if (!this.armature || !this.clip) {return null;}

    const wires = this._getWires();
    if (!wires) {return null;}

    const inputs = this._getWireInputs();
    const wireProperties = this._getWireProperties();

    this._primeStore(inputs, wires, wireProperties);

    const timer = options.timer();
    const loop = () => {
      let start = Date.now() - this.state.t;
      const clipDuration = this.clipDuration();
      timer.loop(() => {
        if (this.state.state !== 'playing') {
          return 1;
        }

        const now = Date.now();
        let t = Math.min(now - start, clipDuration);
        if (t >= clipDuration) {
          start = now;
          t = 0;
        }
        const tNormalized = t / clipDuration;
        this._step(t, inputs, wires, wireProperties);
        this._update({
          t,
          tNormalized,
        });
        return 0;
      })
      .then(() => {
        return timer.join(
          new Promise(resolve => {this._resume = resolve;})
          .then(() => {this._resume = null;})
        );
      })
      .then(loop);
    };
    loop();
    return timer;
  }

  _update(_change) {
    return Promise.resolve(_change)
    .then(change => {
      for (const key in this.state) {
        if (!change.hasOwnProperty(key)) {
          change[key] = this.state[key];
        }
      }
      this.state = change;
      this.emitChange();
    });
  }

  emitChange() {
    this.listeners.forEach(listener => listener());
  }

  addChangeListener(fn) {
    const index = this.listeners.indexOf(fn);
    if (index === -1) {
      this.listeners.push(fn);
    }
  }

  removeChangeListener(fn) {
    const index = this.listeners.indexOf(fn);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }
}

ClipPreviewPlayer.isClip = function(data) {
  return data.metadata && data.metadata.duration;
};
