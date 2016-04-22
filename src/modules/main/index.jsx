import React from 'react';
import update from 'react-addons-update';

import Component from '../update-ancestor';

import Animated from '../animated';
import AnimatedAgent from '../animated-agent';
import Clamp from '../clamp';
import Batch from '../batch';

import {int} from '../../util/rng';

function intGen(rngState) {
  const fn = () => {
    const {number, state} = int(fn.state);
    fn.state = state;
    return number;
  };
  fn.state = rngState;
  return fn;
}

function createGrid(_width, _height) {
  const colors = 4;
  const width = _width || 8;
  const height = _height || 10;
  const gen = intGen({seed: 'fff'});
  const grid = {
    colors,
    width,
    height,
    cells: {},
  };
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const key = `${i}-${j}`;
      const cell = {
        x: i,
        y: j,
        key: gen(),
        color: Math.abs(gen() % colors),
      };
      grid.cells[key] = cell;
    }
  }
  return grid;
}

function gridKeyXY(x, y) {
  return `${x}-${y}`;
}

function gridKey([x, y]) {
  return `${x}-${y}`;
}

// function swapGrid(grid, {from, to}) {
//   return update(grid, {
//     [gridKey(from)]: grid[gridKey[to]],
//     [gridKey(to)]: grid[gridKey[from]],
//   });
// }

function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function addXY(a, x, y) {
  return [a[0] + x, a[1] + y];
}

const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

function isSameColor(here, cell) {
  return cell && cell.color === here;
}

function matchGrid(grid, target) {
  const matches = {};
  (() => {
    const tmp = [];
    const [i, j] = target;
    const here = grid.cells[gridKeyXY(i, j)].color;
    if (
      isSameColor(here, grid.cells[gridKey(addXY(directions[0], i, j))]) ||
      isSameColor(here, grid.cells[gridKey(addXY(directions[1], i, j))]) ||
      isSameColor(here, grid.cells[gridKey(addXY(directions[2], i, j))]) ||
      isSameColor(here, grid.cells[gridKey(addXY(directions[3], i, j))])
    ) {
      let newestChecked = 0;
      tmp.push([i, j]);
      while (newestChecked < tmp.length) {
        const coord = tmp[newestChecked++];
        const neighbor = grid.cells[gridKey(coord)].color;
        for (let d = 0; d < 4; d++) {
          const newCoord = add(coord, directions[d]);
          if (isSameColor(neighbor, grid.cells[gridKey(newCoord)])) {
            let alreadyChecked = false;
            for (let t = 0; t < tmp.length; t++) {
              if (tmp[t][0] === newCoord[0] && tmp[t][1] === newCoord[1]) {
                alreadyChecked = true;
                break;
              }
            }
            if (!alreadyChecked) {
              tmp.push(newCoord);
            }
          }
        }
      }
      if (tmp.length >= 2) {
        for (let t = 0; t < tmp.length; t++) {
          matches[gridKey(tmp[t])] = tmp[t];
        }
      }
      else {
        return grid;
      }
      tmp.length = 0;
    }
  })();
  const change = {cells: {}};
  for (let j = grid.height - 1; j >= 0; j--) {
    for (let i = 0; i < grid.width; i++) {
      if (matches[gridKeyXY(i, j)]) {
        change.cells[gridKeyXY(i, j) + '-matched'] = {$set: {
          x: i,
          y: j,
          key: grid.cells[gridKeyXY(i, j)].key,
          color: grid.cells[gridKeyXY(i, j)].color,
          matchX: target[0],
          matchY: target[1],
        }};
        for (let jj = j; jj < grid.height; jj++) {
          const keyHere = gridKeyXY(i, jj);
          const keyAbove = gridKeyXY(i, jj + 1);
          if (change.cells[keyAbove] && change.cells[keyAbove].$set) {
            change.cells[keyHere] = {$set: {
              x: i,
              y: jj,
              key: change.cells[keyAbove].$set.key,
              color: change.cells[keyAbove].$set.color,
            }};
          }
          else if (change.cells[keyAbove]) {
            change.cells[keyHere] = {$set: null};
          }
          else if (grid.cells[keyAbove]) {
            change.cells[keyHere] = {$set: {
              x: i,
              y: jj,
              key: grid.cells[keyAbove].key,
              color: grid.cells[keyAbove].color,
            }};
          }
          else {
            change.cells[keyHere] = {$set: null};
          }
        }

        if (
          j === 0 &&
          change.cells[gridKeyXY(i, j)] &&
          change.cells[gridKeyXY(i, j)].$set === null
        ) {
          for (let jj = 0; jj < grid.height; jj++) {
            const keyHere = gridKeyXY(i, jj);
            if (matches[keyHere]) {
              matches[keyHere] = null;
            }
          }

          for (let ii = i; ii < grid.width; ii++) {
            for (let jj = 0; jj < grid.height; jj++) {
              const keyHere = gridKeyXY(ii, jj);
              const keyRight = gridKeyXY(ii + 1, jj);
              if (change.cells[keyRight] && change.cells[keyRight].$merge) {
                change.cells[keyHere] = {$set: {
                  x: ii,
                  y: jj,
                  key: change.cells[keyRight].$merge.key,
                  color: change.cells[keyRight].$merge.color,
                }};
              }
              else if (change.cells[keyRight] && change.cells[keyRight].$set) {
                change.cells[keyHere] = {$set: {
                  x: ii,
                  y: jj,
                  key: change.cells[keyRight].$set.key,
                  color: change.cells[keyRight].$set.color,
                }};
              }
              else if (change.cells[keyRight]) {
                change.cells[keyHere] = {$set: null};
              }
              else if (grid.cells[keyRight]) {
                change.cells[keyHere] = {$set: {
                  x: ii,
                  y: jj,
                  key: grid.cells[keyRight].key,
                  color: grid.cells[keyRight].color,
                }};
              }
              else {
                change.cells[keyHere] = {$set: null};
              }

              if (matches[keyRight]) {
                matches[keyHere] = matches[keyRight];
                matches[keyRight] = null;
              }
            }
          }

          i--;
        }
      }
    }
  }
  return update(grid, change);
}

function cleanGrid(grid, cells) {
  const change = {cells: {}};
  cells.forEach(function(cell) {
    change.cells[gridKeyXY(cell.x, cell.y) + '-matched'] = {$set: null};
  });
  return update(grid, change);
}

const colors = ['#777', '#999', '#bbb', '#ddd'];

class Main extends Component {

  constructor() {
    super();

    this.gravity = 256;
    this.state = {
      grid: createGrid(24, 30),
    };
  }

  matchTile(tile) {
    this.updateState({
      grid: {$set: matchGrid(this.state.grid, [tile.x, tile.y])},
    });
  }

  cleanTile(tile) {
    if (!this._cleanTile) {
      this._cleanTiles = [];
      this._cleanTile = Promise.resolve()
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

  gravityFromLast(options, gravity) {
    const top = options.rect.top;
    const lastTop = options.lastRect.top;
    const duration = Math.sqrt(Math.abs(top - lastTop) / gravity);
    const easing = t => t * t;
    return options.animateFromLast(duration, easing);
  }

  fallAnimation(options) {
    return (options.timer(timer => {
      const tRect = options.lastRect.clone();
      timer.cancelable(() => tRect);
      return Promise.resolve()
      .then(() => timer.frame())
      .then(() => {
        const gravity = options._agent.rect.width / 4;
        const start = Date.now();
        const {rect, lastRect} = options;
        const top = rect.top;
        const lastTop = lastRect.top;
        const style = {
          transform: '',
          zIndex: 1,
        };
        return timer.loop(() => {
          const seconds = (Date.now() - start) / 1000;
          const y = lastTop + gravity * seconds * seconds;
          const t = Math.min(1 - (top - y) / (top - lastTop), 1);
          rect.interpolate(lastRect, t, tRect);
          style.transform = tRect.transform(rect);
          options.setStyle(style);
          return t;
        });
      })
      .then(() => options.setStyle());
    }));
  }

  explodeAnimation(options, tile) {
    return (options.timer(timer => {
      const {rect, lastRect} = options;
      const tRect = lastRect.clone();
      timer.cancelable(() => tRect);
      return Promise.resolve()
      .then(() => timer.frame())
      .then(() => {
        const gravity = options._agent.rect.width / 4;
        const start = Date.now();
        const top = rect.top;
        const lastTop = lastRect.top;
        const vx = (tile.x - tile.matchX) * gravity / 4 + (Math.random() - 0.5) * gravity / 2;
        const vy = -(tile.y - tile.matchY) * gravity / 4 - Math.random() * gravity;
        lastRect.angle = Math.PI * Math.random() * 4;
        const style = {
          transform: '',
          zIndex: 2,
        };
        return timer.loop(() => {
          const seconds = (Date.now() - start) / 1000;
          const y = lastTop + vy * seconds + gravity * seconds * seconds;
          const t = Math.min(1 - (top - y) / (top - lastTop), 1);
          tRect.left = lastRect.left + vx * seconds;
          tRect.top = y;
          tRect.width = lastRect.width * (1 - seconds) / 1;
          tRect.height = lastRect.height * (1 - seconds) / 1;
          tRect.angle = lastRect.angle * seconds / 1;
          // rect.interpolate(lastRect, t, tRect);
          style.transform = tRect.transform(rect);
          options.setStyle(style);
          return seconds / 1;
        });
      })
      .then(() => {
        options.setStyle();
        this.cleanTile(tile);
      });
    }));
  }

  animateTile(tile) {
    return typeof tile.matchX === 'number' ?
      (options => this.explodeAnimation(options, tile)) :
      options => (
        // Don't animate if it didn't move
        options.lastRect.equal(options.rect) ? null :
        // No vertical movement but there is horizontal movement, just slide
        options.lastRect.top === options.rect.top ?
        options.animateFromLast(
          Math.sqrt(
            Math.abs(options.rect.left - options.lastRect.left) / this.gravity
          )
        ) :
        // Perform a gravity like fall
        this.fallAnimation(options)
        // Simplest animation to demo
        // options.animateFromLast(0.3)
      );
  }

  renderTile(tile) {
    return (<Animated
      key={tile.key} animateKey={tile.key}
      animate={this.animateTile(tile)}
      >
      <div style={{
        position: 'absolute',
        width: `${100 / this.state.grid.width}%`,
        height: `${100 / this.state.grid.height}%`,
        left: `${tile.x * 100 / this.state.grid.width}%`,
        bottom: `${tile.y * 100 / this.state.grid.height}%`,
        background: colors[tile.color],
      }} onClick={() => this.matchTile(tile)}></div>
    </Animated>);
  }

  render() {
    const cells = Object.keys(this.state.grid.cells)
    .map(key => this.state.grid.cells[key])
    .filter(cell => cell);
    return (
      <div className="game-board">
        <Clamp
          width={this.state.grid.width}
          height={this.state.grid.height}>
          <AnimatedAgent>
            <Batch items={cells}
              subbatch={tile => tile.x}
              subbatchIndex={tile => tile.matchY >= 0 ? tile.y + this.state.grid.height : tile.y}
              >
              {this.renderTile}
            </Batch>
          </AnimatedAgent>
        </Clamp>
      </div>
    );
  }
}

export default Main;
