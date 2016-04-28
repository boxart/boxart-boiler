/* global sinon */
'use strict';

import rng, {custom, int, splitChance} from '../../src/util/rng';

describe('util/rng', function() {

  it('exports a function', function() {
    expect(rng).to.be.a('function');
  });

  it('returns a perditcable random number', function() {
    const g = rng({seed: 'random'});
    expect(g.number).to.eq(0.4414309585167568);
  });

  it('returns a rng state', function() {
    const g = rng({seed: 'random'});
    expect(g.state).to.be.a('object');
    expect(g.state.count).to.eq(1);
    expect(g.state.seed).to.eq('random');
  });

  it('produces the same number given the same state', function() {
    let g = rng({seed: 'random'});

    const firstTry = rng(g.state).number;
    expect(firstTry, 'first try').to.eq(rng(g.state).number);

    // add a few steps down the PRNG and test again
    g = rng(g.state);
    g = rng(g.state);
    g = rng(g.state);
    g = rng(g.state);
    g = rng(g.state);
    g = rng(g.state);

    expect(firstTry, 'first try no longer matches')
      .to.not.eq(rng(g.state).number);

    expect(rng(g.state).number, 'still matches').to.eq(rng(g.state).number);

  });

  describe('int', function() {
    it('returns a predictable whole number', function() {
      const g = int({seed: 'random'});
      expect(g.number).to.eq(1895931530);
    });
  });

  describe('splitChance', function() {

    it('does not match on the edge', function() {
      const result = splitChance({split: 0.1, chance: 0.1});
      expect(result).to.deep.equal({
        match: false,
        // After losing the 10% chance, the remainder is at 0%
        chance: 0.0,
      });
    });

    it('matches are scaled', function() {
      const result = splitChance({split: 0.25, chance: 0.1});
      expect(result).to.deep.equal({
        match: true,
        // Of the 25%, 10% is the 40% mark (*4)
        chance: 0.4,
      });
    });

    it('misses are scaled', function() {
      const result = splitChance({split: 0.25, chance: 0.75});
      expect(result).to.deep.equal({
        match: false,
        // Of the 75% that didn't match, 0.75 is 50% of the way,
        // so 66.666666%, better to express as math:
        chance: 0.5 / 0.75,
      });
    });

    it('Custom RNG utilizes a passed in handler', function() {
      const myHandler = function(gen) {
        return gen();
      };
      const spy = sinon.spy(myHandler);
      const myRng = custom({seed: 'wakawaka'}, spy);
      const num = myRng.number;
      expect(num).to.equal(0.7354555783423689);
      expect(spy).to.be.called.once;
    });
  });

});
