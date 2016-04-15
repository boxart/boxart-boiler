import seedrandom from 'seedrandom';

/**
 * Stateful PRNG example
 *
 * seed(str) {
 *   // initial seed will give you a number and a state
 *   const seed = rng({ seed: str });
 *   // save this state
 *   this.setState({ rng: seed.state });
 * }
 *
 * rng() {
 *   const result = rng(this.state.rng);
 *   this.setState({ rng: result.state });
 *   return rng.number;
 * }
 *
 */

function _rng(state = {}, handler = gen => gen()) {
  const seed = state.seed;
  const options = {
    state: state.arc || {},
  };

  const result = seedrandom(seed, options);

  return {
    number: handler(result),
    state: {
      seed,
      arc: result.state(),
      count: (state.count || 0) + 1,
    },
  };
}

export default function rng(state) {
  return _rng(state);
}

export function custom(state, handler) {
  return _rng(state, handler);
}

export function int(state) {
  return _rng(state, gen => gen.int32());
}

// split one random number
export function splitChance({split, chance}) {
  const match = chance < split;
  return {
    match,
    chance: match ? chance / split : (chance - split) / (1 - split),
  };
}
