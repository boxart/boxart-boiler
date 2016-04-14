import React from 'react';
import update from 'react-addons-update';

import {Animated, AnimatedAgent, Batch, BatchFactory} from 'boxart';

import Component from '../update-ancestor';

import Clamp from '../clamp';
import ClipPlayer from '../../../tools/animated-preview/clip-player';

import {int} from '../../util/rng';

import Card from './card';

const clips = require.context('./clips');

function intGen(rngState) {
  const fn = () => {
    const {number, state} = int(fn.state);
    fn.state = state;
    return number;
  };
  fn.state = rngState;
  return fn;
}

function createIndex(gen, unmatched) {
  let rows = [[], [], [], []]
  .map(row => {
    row.key = gen();
    return row;
  });
  for (const card of unmatched) {
    rows[card.y][card.x] = card;
  }
  return rows;
}

function updateIndex(index, unmatched) {
  let rows = index.slice();
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      let card = null;
      for (const check_card of unmatched) {
        if (check_card.y === j && check_card.x === i) {
          card = check_card;
          break;
        }
      }
      if (rows[j][i] !== card) {
        if (rows[j] === index[j]) {
          rows[j] = index[j].slice();
          rows[j].key = index[j].key;
        }
        rows[j][i] = card;
      }
    }
    // Filter out null entries;
    if (rows[j] !== index[j]) {
      rows[j] = rows[j].filter(card => Boolean(card));
      rows[j].key = index[j].key;
    }
  }
  return rows;
}

function createGame(rngState) {
  let gen = intGen(rngState);

  const game = {
    cards: [],
    grid: null,
    matches: [],
    faceUp: [],
    rngState: null,
    score: 0,
  };

  let faces = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let faceIndex = Math.abs(gen()) % faces.length;
      let face = faces[faceIndex];
      faces.splice(faceIndex, 1);
      game.cards.push({
        face: face,
        faceDown: true,
        known: false,
        key: gen(),
        x: i,
        y: j,
      })
    }
  }

  game.grid = createIndex(gen, game.cards);

  game.rngState = gen.state;

  return game;
}

function cantFlip(lastGame) {
  let faceUp = lastGame.faceUp;
  for (let i = 0; i < faceUp.length && faceUp.length - i >= 2; i += 2) {
    if (faceUp[i].face !== faceUp[i + 1].face) {
      return true;
    }
  }
  return false;
}

function flipCard(lastGame, card) {
  let cards = lastGame.cards.slice();

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].x === card.x && cards[i].y === card.y) {
      card = cards[i] = Object.assign({}, card, {
        faceDown: false,
        known: true,
      });
      break;
    }
  }

  return Object.assign({}, lastGame, {
    cards,
    grid: updateIndex(lastGame.grid, cards),
    faceUp: lastGame.faceUp.concat(card),
    score: lastGame.score + 1,
  });
}

function checkMatch(lastGame) {
  // let faceUp = lastGame.cards.reduce((carry, card) => {
  //   if (!card.faceDown) {
  //     carry.push(card);
  //   }
  //   return carry;
  // }, []);
  let faceUp = lastGame.faceUp;

  if (faceUp.length >= 2) {
    if (faceUp[0].face === faceUp[1].face) {
      let cards = lastGame.cards.reduce((carry, card) => {
        if (card !== faceUp[0] && card !== faceUp[1]) {
          carry.push(card);
        }
        return carry;
      }, []);
      return Object.assign({}, lastGame, {
        cards: cards,
        grid: updateIndex(lastGame.grid, cards),
        matches: lastGame.matches.concat([faceUp]),
        // score: lastGame.matches.length + 1,
        faceUp: lastGame.faceUp.slice(2),
      });
    }
    else {
      let cards = lastGame.cards.slice();

      for (let i = 0; i < cards.length; i++) {
        if (cards[i] === faceUp[0] || cards[i] === faceUp[1]) {
          cards[i] = Object.assign({}, cards[i], {
            faceDown: true,
          });
        }
      }

      return Object.assign({}, lastGame, {
        cards: cards,
        grid: updateIndex(lastGame.grid, cards),
        faceUp: lastGame.faceUp.slice(2),
      });
    }
  }

  return lastGame;
}

function hasMatchesAvailable(game) {
  return game.cards.length > 0;
}

class Main extends Component {

  constructor() {
    super();

    this.state = {
      game: createGame({seed: 'seed'}),
    };
  }

  flipCard(card) {
    // Slow down the player if they just flipped two unmatching cards. This is
    // to make the lack of a match unambiguous as opposed to flipping a third
    // card that does match one of the first two and then to follow the rules of
    // the game flip the first two back because they didn't match.
    if (cantFlip(this.state.game)) {
      return;
    }

    this.setState(Object.assign({}, this.state, {game: flipCard(this.state.game, card)}));

    if (this.state.game.faceUp.length % 2 == 0) {
      setTimeout(() => {
        this.setState(Object.assign({}, this.state, {game: checkMatch(this.state.game)}));
      }, 3000);
    }
  }

  matchTile(tile) {
  }

  cleanTile(tile) {
    if (!this._cleanTile) {
      this._cleanTiles = [];
      this._cleanTile = Promise.resolve()
      .then(() => new Promise(requestAnimationFrame))
      .then(() => {
        this._cleanTile = null;
        this.updateState({
          grid: {$set: cleanGrid(this.state.grid, this._cleanTiles)},
        });
        this._cleanTiles = [];
      });
    }
    this._cleanTiles.push(tile);
  }

  animateTile(tile) {
    return options => options.timer();
  }

  renderTile(card) {
    return (<Animated
      key={card.key} animateKey={card.key}
      animate={this.animateTile(card)}
      >
      <div key={card.key} style={{
        position: 'absolute',
        width: `${100 / 4.5 + 0.001953125}%`,
        height: `${100 / 4.5 + 0.001953125}%`,
        left: `${card.x * 100 / 4 + (100/4 - 100/4.5) / 2.0 - 0.0009765625}%`,
        bottom: `${card.y * 100 / 4 + (100/4 - 100/4.5) / 2.0 - 0.0009765625}%`,
      }} onClick={() => this.flipCard(card)}>
        <Card rooster={card.face} faceDown={card.faceDown}/>
      </div>
    </Animated>);
  }

  handleReset() {
    console.log('reset');
    this.updateState({
      lastGame: {$set: this.state.game},
      game: {$set: createGame(this.state.game.rngState)},
    });
  }

  handlePlayAgain() {
    this.handleReset();
  }

  animateScreen(options) {
    const {rect, lastRect} = options;
    lastRect.top = rect.top;
    lastRect.left = rect.left;
    lastRect.width = rect.width / 2;
    lastRect.height = rect.height / 2;
    const tRect = lastRect.clone();
    tRect.t = rect.t || 0;
    if (tRect.t >= 1) {
      return options.timer();
    }
    const style = {opacity: 0};
    rect.transformStyle(tRect, style);
    options.replaceStyle(style);
    const start = Date.now() - 1000 * Math.sqrt(Math.pow(2, tRect.t) - 1);
    const timer = options.timer();
    timer.cancelable(() => tRect);
    timer.loop(() => {
      const t = Math.min(
        Math.log(
          1 + Math.pow((Date.now() - start) / 1000, 2)
        ) / Math.log(2),
        1
      );
      lastRect.interpolate(rect, t, tRect);
      rect.transformStyle(tRect, style);
      style.opacity = t;
      rect.t = t;
      options.setStyle(style);
      return t;
    })
    .then(() => options.replaceStyle());
    return timer;
  }

  render() {
    // const cells = Object.keys(this.state.grid.cells)
    // .map(key => this.state.grid.cells[key])
    // .filter(cell => cell);
    const {grid} = this.state.game;
    const {width, height} = {width: 5, height: 7};
    return (
      <div className="game-board">
        <Clamp
          width={width}
          height={height + 1}>
          <AnimatedAgent>
            <Animated key="screen" animateKey="screen" animate={this.animateScreen}>
            <div className="screen">
              <div className="bar" style={{height: `${1 / (height + 1) * 100}%`}}>
                <Score score={this.state.game.score} />
                <ResetButton reset={this.handleReset} />
              </div>
              <Batch
                className="board"
                style={{
                  position: 'absolute',
                  top: `${1 / (height + 1) * 100}%`,
                  width: '100%',
                  height: `${height / (height + 1) * 100}%`,
                }}
                items={grid}
                itemKey={item => item.key}>
                {row => <Batch
                  items={row}
                  itemKey={item => item.key}>
                  {this.renderTile}
                </Batch>}
              </Batch>
              <WinScreen
                game={this.state.game}
                playAgain={this.handlePlayAgain} />
            </div>
            </Animated>
          </AnimatedAgent>
        </Clamp>
      </div>
    );
  }
}

export default Main;

class Score extends Component {
  render() {
    return <div className="score">{this.props.score || 0}</div>;
  }
}

class ResetButton extends Component {
  render() {
    return <div className="reset" onClick={this.props.reset}>{'\u21bb'}</div>;
  }
}

class WinScreen extends Component {
  render() {
    const hasMatches = hasMatchesAvailable(this.props.game);
    if (!hasMatches) {
      return (<div className="win-screen" style={{
        position: 'absolute',
        top: `${100 / 9 * 4}%`,
        // left: `${100 / 12 * 4}%`,
        width: '100%',
      }}>
        <div>Score: {this.props.game.score}</div>
        <div className="win-screen-button"
          onClick={this.props.playAgain}>
          Play Again
        </div>
      </div>);
    }
    return <div></div>;
  }
}
