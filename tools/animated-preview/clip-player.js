export default class ClipPlayer {
  constructor() {
    this.armature = null;
    this.clip = null;

    this._replaced = null;
    this._store = null;
  }

  setArmature(armature) {
    this.armature = armature;
  }

  setClip(clip) {
    this.clip = clip;
  }

  _replace() {
    const wires = this._getWires();
    if (!wires) {return;}

    const wireProperties = this._getWireProperties();

    this._replaced = {};
    for (const wireKey in this.clip) {
      if (wireKey === 'metadata') {continue;}
      if (!wires[wireKey]) {continue;}

      this._replaced[wireKey] = {};

      const wireValue = this.clip[wireKey];
      if (wireValue.styles) {
        this._replaced[wireKey].styles = {};
        for (const styleKey in wireValue.styles) {
          this._replaced[wireKey].styles[styleKey] = wires[wireKey].style[styleKey];
        }
      }
      if (wireValue.attributes) {
        this._replaced[wireKey].attributes = {};
        for (const attributeKey in wireValue.attributes) {
          this._replaced[wireKey].attributes[attributeKey] = wires[wireKey].getAttribute(attributeKey);
        }
      }
      if (wireValue.properties && wireProperties) {
        this._replaced[wireKey].properties = {};
        for (const propertyKey in wireValue.properties) {
          if (!wireProperties[wireKey][propertyKey]) {continue;}
          this._replaced[wireKey].properties[propertyKey] = wireProperties[wireKey][propertyKey](wires[wireKey]);
        }
      }
    }
  }

  _primeStore(inputs, wires, wireProperties) {
    if (!this._store) {
      this._store = {};
    }

    for (const wireKey in this.clip) {
      if (wireKey === 'metadata') {continue;}
      if (!wires[wireKey]) {continue;}

      this._store[wireKey] = this._store[wireKey] || {};

      const wireValue = this.clip[wireKey];
      if (wireValue.styles) {
        this._store[wireKey].styles = this._store[wireKey].styles || {};
        for (const styleKey in wireValue.styles) {
          const _compiled = this._store[wireKey].styles[styleKey];
          if (!_compiled || _compiled.inputs !== inputs) {
            this._store[wireKey].styles[styleKey] = [];
            this._store[wireKey].styles[styleKey].inputs = inputs;
          }
        }
      }
      if (wireValue.attributes) {
        this._store[wireKey].attributes = this._store[wireKey].styles || {};
        for (const attributeKey in wireValue.attributes) {
          const _compiled = this._store[wireKey].attributes[attributeKey];
          if (!_compiled || _compiled.inputs !== inputs) {
            this._store[wireKey].attributes[attributeKey] = [];
            this._store[wireKey].attributes[attributeKey].inputs = inputs;
          }
        }
      }
      if (wireValue.properties && wireProperties) {
        this._store[wireKey].properties = this._store[wireKey].styles || {};
        for (const propertyKey in wireValue.properties) {
          if (!wireProperties[wireKey][propertyKey]) {continue;}
          const _compiled = this._store[wireKey].properties[propertyKey];
          if (!_compiled || _compiled.inputs !== inputs) {
            this._store[wireKey].properties[propertyKey] = [];
            this._store[wireKey].properties[propertyKey].inputs = inputs;
          }
        }
      }
    }
  }

  _restore() {
    if (!this._replaced) {return;}

    const wires = this._getWires();
    if (!wires) {return;}

    const wireProperties = this._getWireProperties();

    for (const wireKey in this.clip) {
      if (wireKey === 'metadata') {continue;}
      if (!wires[wireKey]) {continue;}

      const wireValue = this.clip[wireKey];
      if (wireValue.styles) {
        for (const styleKey in wireValue.styles) {
          wires[wireKey].style[styleKey] = this._replaced[wireKey].styles[styleKey];
        }
      }
      if (wireValue.attributes) {
        for (const attributeKey in wireValue.attributes) {
          wires[wireKey].setAttribute(attributeKey, this._replaced[wireKey].attributes[attributeKey]);
        }
      }
      if (wireValue.properties && wireProperties) {
        for (const propertyKey in wireValue.properties) {
          if (!wireProperties[wireKey][propertyKey]) {continue;}
          wireProperties[wireKey][propertyKey](wires[wireKey], this._replaced[wireKey].properties[propertyKey]);
        }
      }
    }

    this._replaced = null;
  }

  _step(t, inputs, wires, wireProperties) {
    for (const wireKey in this.clip) {
      if (wireKey === 'metadata') {continue;}
      if (!wires[wireKey]) {continue;}

      const wireValue = this.clip[wireKey];
      const wireStore = this._store[wireKey];
      if (wireValue.styles) {
        for (const styleKey in wireValue.styles) {
          const styleValue = wireValue.styles[styleKey];
          const styleValueStore = wireStore.styles[styleKey];
          wires[wireKey].style[styleKey] = this._stepValue(t, inputs, styleValue, styleValueStore);
        }
      }
      if (wireValue.attributes) {
        for (const attributeKey in wireValue.attributes) {
          const attributeValue = wireValue.attributes[attributeKey];
          const attributeValueStore = wireStore.attribute[attributeKey];
          wires[wireKey].setAttribute(attributeKey, this._stepValue(t, inputs, attributeValue, attributeValueStore));
        }
      }
      if (wireValue.properties && wireProperties) {
        for (const propertyKey in wireValue.properties) {
          if (!wireProperties[wireKey][propertyKey]) {continue;}
          const propertyValue = wireValue.properties[propertyKey];
          const propertyValueStore = wireStore.properties[propertyKey];
          wireProperties[propertyKey](wires[wireKey], this._stepValue(t, inputs, propertyValue, propertyValueStore));
        }
      }
    }
  }

  _stepValue(t, inputs, values, store) {
    return this._stepValueArray(t, inputs, values, store);
  }

  _interpolate(a, b, t) {
    if (typeof a === 'number') {
      return (b - a) * t + a;
    }
    return a;
  }

  _compileNumber(a, b) {
    return t => (b - a) * t + a;
  }

  _compile(a, b) {
    if (typeof a === 'function') {
      return a;
    }
    if (typeof a === 'number') {
      return this._compileNumber(a, b);
    }
    return t => a;
  }

  _compileInputs(a, inputs) {
    if (typeof a === 'function') {
      const result = a(inputs);
      if (typeof result === 'function') {
        return result;
      }
    }
    return a;
  }

  _compileArrayMember(values, i, inputs) {
    const a = values[i + 1];

    const minT = values[i];
    const maxT = i < values.length - 2 ? values[i + 2] : this.clipDuration();
    const duration = maxT - minT;

    let bound;
    if (typeof a === 'function') {
      bound = this._compileInputs(a, inputs);
    }
    else if (i < values.length - 2) {
      const boundB = this._compileInputs(values[i + 3], inputs);
      const b = typeof boundB === 'function' ? b(0) : b;
      bound = this._compile(a, b);
    }
    else {
      bound = a;
    }

    if (typeof bound === 'function') {
      return t => bound((t - minT) / duration);
    }
    return t => bound;
  }

  _stepValueArray(t, inputs, values, store) {
    for (let i = values.length - 2; i >= 0; i -= 2) {
      if (values[i] <= t) {
        let member = store[i + 1];
        if (!member) {
          member = store[i + 1] = this._compileArrayMember(values, i, inputs);
        }
        return member(t);
      }
    }
    return '';
  }

  _getWires() {
    return this.armature && this.armature.getWires && this.armature.getWires();
  }

  _getWireInputs() {
    return this.armature.getWireInputs && this.armature.getWireInputs();
  }

  _getWireProperties() {
    return this.armature.getWireProperties && this.armature.getWireProperties();
  }

  animate(options) {
    if (!this.armature || !this.clip) {return null;}

    const wires = this._getWires();
    if (!wires) {return null;}

    const inputs = this._getWireInputs();
    const wireProperties = this._getWireProperties();

    this._replace();
    this._primeStore(inputs, wires, wireProperties);
    const timer = options.timer();
    timer.cancelable(() => this._restore());
    const start = Date.now();
    const clipDuration = this.clipDuration();
    timer.loop(() => {
      const now = Date.now();
      const t = Math.min(now - start, clipDuration);
      this._step(t, inputs, wires, wireProperties);
      return t / clipDuration;
    })
    .then(() => this._restore())
    .catch(() => {});

    return timer;
  }

  clipDuration() {
    return this.clip.metadata.duration;
  }
}

ClipPlayer.isClip = function(data) {
  return data.metadata && data.metadata.duration;
};

ClipPlayer.animate = function(options, armature, clip) {
  const player = new ClipPlayer();
  player.setArmature(armature);
  player.setClip(clip);
  return player.animate(options);
};
