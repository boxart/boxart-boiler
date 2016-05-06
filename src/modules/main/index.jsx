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
    score: 0,
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
  grid.gen = gen.state;
  return grid;
}

function buildMatch(grid, [i, j], tmp = []) {
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
  }
  return tmp;
}

function hasMatchesAvailable(grid) {
  const {width, height} = grid;
  const tmp = [];
  const target = [];
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      if (!grid.cells[gridKeyXY(i, j)]) {continue;}
      target[0] = i; target[1] = j;
      buildMatch(grid, target, tmp);
      if (tmp.length > 1) {
        return true;
      }
      tmp.length = 0;
    }
  }
  return false;
}

function resetGrid(grid) {
  const {width, height} = grid;
  const cells = {};
  const change = {
    score: {$set: 0},
    cells: {$set: cells},
  };
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const id = gridKeyXY(i, j);
      const idLeaving = id + '-disappear';
      if (grid.cells[id]) {
        cells[idLeaving] = {
          x: i,
          y: j,
          disappear: true,
          key: grid.cells[id].key,
          color: grid.cells[id].color,
        };
      }
    }
  }

  const {colors} = grid;
  const gen = intGen(grid.gen);
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const id = gridKeyXY(i, j);
      const key = gen();
      const color = Math.abs(gen() % colors);
      cells[id] = {
        x: i,
        y: j,
        key,
        // key: grid.cells[id] && grid.cells[id].color === color ?
        //   grid.cells[id].key :
        //   key,
        color,
      };
    }
  }
  change.gen = {$set: gen.state};
  return update(grid, change);
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
  const tmp = buildMatch(grid, target);
  if (tmp.length >= 2) {
    for (let t = 0; t < tmp.length; t++) {
      matches[gridKey(tmp[t])] = tmp[t];
    }
  }
  else {
    return grid;
  }
  const change = {
    score: {$apply: score => score + Math.pow(Object.keys(matches).length, 2)},
    cells: {},
  };
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
    const key = gridKeyXY(cell.x, cell.y);
    const keyMatched = key + '-matched';
    if (grid.cells[keyMatched]) {
      change.cells[keyMatched] = {$set: null};
    }
    const keyDisappear = key + '-disappear';
    if (grid.cells[keyDisappear]) {
      change.cells[keyDisappear] = {$set: null};
    }
  });
  return update(grid, change);
}

const colors = ['#777', '#999', '#bbb', '#ddd'];

class Main extends Component {

  constructor() {
    super();

    this.gravity = 256;
    this.state = {
      lastGrid: {cells: {}},
      grid: createGrid(12, 8),
    };
  }

  matchTile(tile) {
    this.updateState({
      grid: {$set: matchGrid(this.state.grid, [tile.x, tile.y])},
    });
    // Promise.resolve()
    // .then(() => {
    //   for (const item of this.state.grid) {
    //     if (item.matchX) {
    //       this.cleanTile(item);
    //     }
    //   }
    // });
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

  gravityFromLast(options, gravity) {
    const top = options.rect.top;
    const lastTop = options.lastRect.top;
    const duration = Math.sqrt(Math.abs(top - lastTop) / gravity);
    const easing = t => t * t;
    return options.animateFromLast(duration, easing);
  }

  appearAnimation(options) {
    return (options.timer(timer => {
      // const tRect = options.rect.clone();
      const start = Date.now();
      const style = {transform: ''};
      const replaced = {transform: options.animatedEl.style.transform};
      return Promise.resolve()
      // .then(() => timer.frame())
      .then(() => {
        timer.cancelable(() => {
          options.animatedEl.style.transform = replaced.transform;
          return options.lastRect;
        });
        return timer.loop(() => {
          const t = Math.min((Date.now() - start) / 1000, 1);
          // tRect.width = options.rect.width * t;
          // tRect.height = options.rect.height * t;
          // tRect.angle = 2 * Math.PI * t;
          const angle = -Math.PI * (t / 2 - 0.5);
          // style.transform = `translateZ(0) scale(${t}) rotateZ(${angle}rad)`;
          const c = Math.cos(angle);
          const s = Math.sin(angle);
          style.transform = `matrix3d(${t * c}, ${t * s}, 0, 0, ${-t * s}, ${t * c}, 0, 0, 0, 0, ${(1 - c) + c}, 0, 0, 0, 0, 1)`;
          // console.log(style.transform);
          // style.transform = tRect.transform(options.rect);
          // options.setStyle(style);
          options.animatedEl.style.transform = style.transform;
          return t;
        });
      })
      .then(() => {options.animatedEl.style.transform = replaced.transform;});
      // .then(() => options.setStyle());
    }));
  }

  disappearAnimation(options, tile) {
    return (options.timer(timer => {
      // const tRect = options.rect.clone();
      const start = Date.now();
      const style = {transform: ''};
      const replaced = {transform: options.animatedEl.style.transform};
      return Promise.resolve()
      // .then(() => timer.frame())
      .then(() => {
        timer.cancelable(() => {
          options.animatedEl.style.transform = replaced.transform;
          return options.lastRect;
        });
        return timer.loop(() => {
          const t = 1 - Math.min((Date.now() - start) / 1000, 1);
          // tRect.width = options.rect.width * t;
          // tRect.height = options.rect.height * t;
          // tRect.angle = 2 * Math.PI * t;
          const angle = Math.PI * (t / 2 - 0.5);
          // style.transform = `translateZ(0) scale(${t}) rotateZ(${angle}rad)`;
          const c = Math.cos(angle);
          const s = Math.sin(angle);
          style.transform = `matrix3d(${t * c}, ${t * s}, 0, 0, ${-t * s}, ${t * c}, 0, 0, 0, 0, ${(1 - c) + c}, 0, 0, 0, 0, 1)`;
          // console.log(style.transform);
          // style.transform = tRect.transform(options.rect);
          // options.setStyle(style);
          options.animatedEl.style.transform = style.transform;
          return 1 - t;
        });
      })
      .then(() => {
        // options.animatedEl.style.transform = replaced.transform;
        this.cleanTile(tile);
      });
      // .then(() => options.setStyle());
    }));
  }

  slideAnimation(options) {
    return (options.timer(timer => {
      const tRect = options.lastRect.clone();
      timer.cancelable(() => tRect);
      return Promise.resolve()
      // .then(() => timer.frame())
      .then(() => {
        const gravity = options._agent.rect.width / 4;
        const start = Date.now();
        const {rect, lastRect} = options;
        const top = rect.top;
        const lastTop = lastRect.top;
        const duration = Math.sqrt(Math.abs(rect.left - lastRect.left) / gravity);
        const style = {
          transform: '',
          zIndex: 1,
        };
        return timer.loop(() => {
          const seconds = (Date.now() - start) / 1000;
          const t = seconds / duration;
          const t2 = t * t;
          rect.interpolate(lastRect, t2, tRect);
          style.transform = tRect.transform(rect);
          options.setStyle(style);
          return t2;
        });
      })
      .then(() => options.setStyle());
    }));
  }

  fallAnimation(options) {
    return (options.timer(timer => {
      const tRect = options.lastRect.clone();
      timer.cancelable(() => tRect);
      // return Promise.resolve()
      // .then(() => timer.frame())
      // .then(() => {
        const gravity = options._agent.rect.width / 4;
        const start = Date.now();
        const {rect, lastRect} = options;
        const top = rect.top;
        const lastTop = lastRect.top;
        const duration = Math.sqrt((top - lastTop) / gravity);
        const style = {
          transform: lastRect.transform(rect),
          zIndex: 1,
        };
        options.setStyle(style);
        return timer.loop(() => {
          const seconds = (Date.now() - start) / 1000;
          // const y = lastTop + gravity * seconds * seconds;
          // const t = Math.min(1 - (top - y) / (top - lastTop), 1);
          const t = Math.min(seconds / duration, 1);
          let s;
          if (rect.left === lastRect.left) {
            s = t;
          }
          else {
            s = Math.min(seconds * 4 / (Math.abs(rect.left - lastRect.left) / rect.width), 1);
          }
          rect.interpolate(lastRect, t * t, tRect);
          tRect.left = (rect.left - lastRect.left) * s + lastRect.left;
          style.transform = tRect.transform(rect);
          options.setStyle(style);
          return t * t * s;
        })
        .then(() => options.setStyle());
      // });
    }));
  }

  explodeAnimation(options, tile) {
    return (options.timer(timer => {
      const {rect, lastRect} = options;
      const tRect = lastRect.clone();
      timer.cancelable(() => tRect);
      return Promise.resolve()
      // .then(() => timer.frame())
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
          // style.transform = tRect.transform(rect);
          const theta = rect.angle - tRect.angle;
          const c = Math.cos(theta);
          const s = Math.sin(theta);
          const dx = tRect.left - rect.left;
          const dy = tRect.top - rect.top;
          const t2 = (1 - seconds);
          style.transform = `matrix3d(${t2 * c}, ${t2 * s}, 0, 0, ${-t2 * s}, ${t2 * c}, 0, 0, 0, 0, ${(1 - c) + c}, 0, ${dx}, ${dy}, 0, 1)`;
          options.setStyle(style);
          return seconds / 1;
        });
      })
      .then(() => {
        this.cleanTile(tile);
      });
    }));
  }

  animateTile(tile) {
    // return this.fallAnimation;
    return (
      typeof tile.matchX === 'number' ?
      // (options => this.cleanTile(tile)) :
      (options => this.explodeAnimation(options, tile)) :
      tile.disappear ?
      (options => this.disappearAnimation(options, tile)) :
      options => (
        // Don't animate if it didn't move
        options.lastRect.equal(options.rect) ?
          // (() => {
          //   const key = gridKeyXY(tile.x, tile.y);
          //   const lastCell = this.state.lastGrid.cells[key];
          //   return lastCell && lastCell.color === tile.color ?
          //     null :
          //     this.appearAnimation(options);
          // })() :
          this.appearAnimation(options) :
        // No vertical movement but there is horizontal movement, just slide
        // options.lastRect.top === options.rect.top ?
        // this.slideAnimation(options) :
        // options.animateFromLast(
        //   Math.sqrt(
        //     Math.abs(options.rect.left - options.lastRect.left) / this.gravity
        //   )
        // ) :
        // Perform a gravity like fall
        this.fallAnimation(options)
        // Simplest animation to demo
        // options.animateFromLast(0.3)
      )
    );
  }

  renderTile(tile) {
    // return (
    return (<Animated
      key={tile.key} animateKey={tile.key}
      animate={this.animateTile(tile)}
      >
      <div key={tile.key} style={{
        position: 'absolute',
        width: `${100 / this.state.grid.width + 0.001953125}%`,
        height: `${100 / this.state.grid.height + 0.001953125}%`,
        left: `${tile.x * 100 / this.state.grid.width - 0.0009765625}%`,
        bottom: `${tile.y * 100 / this.state.grid.height - 0.0009765625}%`,
        background: colors[tile.color],
      }} onClick={() => this.matchTile(tile)}></div>
    </Animated>);
    // );
  }

  handleReset() {
    console.log('reset');
    this.updateState({
      lastGrid: {$set: this.state.grid},
      grid: {$set: resetGrid(this.state.grid)},
    });
  }

  handlePlayAgain() {
    this.handleReset();
  }

  render() {
    const cells = Object.keys(this.state.grid.cells)
    .map(key => this.state.grid.cells[key])
    .filter(cell => cell);
    const {width, height} = this.state.grid;
    return (
      <div className="game-board">
        <Clamp
          width={width}
          height={height + 1}>
          <AnimatedAgent>
            <div className="screen">
              <div className="bar" style={{height: `${1 / height * 100}%`}}>
                <Score score={this.state.grid.score} />
                <ResetButton reset={this.handleReset} />
              </div>
              <Batch className="board" style={{height: `${(height - 1) / height * 100}%`}} items={cells}
                subbatch={tile => tile.x}
                subbatchIndex={tile => tile.y + ((tile.matchY >= 0 || tile.disappear) ? height : 0)}
                >
                {this.renderTile}
              </Batch>
              <WinScreen
                grid={this.state.grid}
                playAgain={this.handlePlayAgain} />
            </div>
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
    const hasMatches = hasMatchesAvailable(this.props.grid);
    if (!hasMatches) {
      return (<div className="win-screen" style={{
        position: 'absolute',
        top: `${100 / 9 * 4}%`,
        // left: `${100 / 12 * 4}%`,
        width: '100%',
      }}>
        <div>Score: {this.props.grid.score}</div>
        <div className="win-screen-button"
          onClick={this.props.playAgain}>
          Play Again
        </div>
      </div>);
    }
    return <div></div>;
  }
}
