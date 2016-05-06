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

function createGrid() {
  const grid = {
    genState: intGen('seed').state,
    score: 0,
    cells: {},
  };
  return grid;
}

function gridKey(x, y) {
  return `${x},${y}`;
}

function checkGrid(grid, change, gkey, i, j) {
  const g2key = gridKey(i, j);
  if (change.cells[g2key] && change.cells[g2key].$set) {
    if (grid.cells[gkey].value === change.cells[g2key].$set.value) {
      change.cells[g2key].$set = {
        x: i,
        y: j,
        key: grid.cells[gkey].key,
        value: grid.cells[gkey].value * 2,
      };
      change.cells[gkey] = {$set: null};
      return true;
    }
    // if (j + 1 !== j) {
    //   change.cells[g2key] = {$set: {
    //     x: i,
    //     y: j,
    //     key: grid.cells[gkey].key,
    //     value: grid.cells[gkey].value * 2,
    //   }};
    //   change.cells[gkey] = {$set: null};
    // }
  }
  if (!change.cells[g2key] && grid.cells[g2key]) {
    if (grid.cells[gkey].value === grid.cells[g2key].value) {
      change.cells[g2key] = {$set: {
        x: i,
        y: j,
        key: grid.cells[gkey].key,
        value: grid.cells[gkey].value * 2,
      }};
      change.cells[gkey] = {$set: null};
      return true;
    }
    // if (j + 1 !== j) {
    //   change.cells[g2key] = {$set: {
    //     x: i,
    //     y: j,
    //     key: grid.cells[gkey].key,
    //     value: grid.cells[gkey].value * 2,
    //   }};
    //   change.cells[gkey] = {$set: null};
    // }
  }
  return false;
}

function checkGridEmpty(grid, change, gkey, i, j, i2, j2, i3, j3) {
  const g2key = gridKey(i, j);
  const g3key = gridKey(i2, j2);
  if (
    (
      (change.cells[g2key] && change.cells[g2key].$set) || 
      (!change.cells[g2key] && grid.cells[g2key])
    )
  ) {
    if (i2 !== i3 || j2 !== j3) {
      change.cells[g3key] = {$set: {
        x: i2,
        y: j2,
        key: grid.cells[gkey].key,
        value: grid.cells[gkey].value,
      }};
      change.cells[gkey] = {$set: null};
    }
    return true;
  }
  return false;
}

function checkGridEnd(grid, change, gkey, i, j) {
  const g2key = gridKey(i, j);
  if (!change.cells[g2key] && !grid.cells[g2key]) {
    change.cells[g2key] = {$set: {
      x: i,
      y: j,
      key: grid.cells[gkey].key,
      value: grid.cells[gkey].value,
    }};
    change.cells[gkey] = {$set: null};
    return true;
  }
  return false;
}

function genCell(grid, change, gen, i, j, i2, j2) {
  const cells = [];
  for (let jj = j; jj < j2 + 1; jj++) {
    for (let ii = i; ii < i2 + 1; ii++) {
      const gkey = gridKey(ii, jj);
      if (
        (
          (change.cells[gkey] && !change.cells[gkey].$set) ||
          (!change.cells[gkey] && !grid.cells[gkey])
        )
      ) {
        cells.push([ii, jj, change.cells[gkey], grid.cells[gkey]]);
      }
    }
  }
  if (cells.length) {
    const choiceIndex = Math.abs(gen() % cells.length);
    const choice = cells[choiceIndex];
    console.log(cells, choice, choiceIndex);
    const gkey = gridKey(...choice);
    change.cells[gkey] = {$set: {
      x: choice[0],
      y: choice[1],
      key: gen(),
      value: 2,
    }};
  }
}

function updateGrid(grid, direction) {
  const change = {cells: {}};
  const gen = intGen(grid.genState);
  // Up
  if (direction === 0) {
    for (let j = 1; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        const gkey = gridKey(i, j);
        if (grid.cells[gkey]) {
          for (let j2 = j - 1; j2 >= 0; j2--) {
            if (checkGrid(grid, change, gkey, i, j2)) {
              break;
            }
            if (checkGridEmpty(grid, change, gkey, i, j2, i, j2 + 1, i, j)) {
              break;
            }
            if (j2 === 0 && checkGridEnd(grid, change, gkey, i, j2)) {
              break;
            }
          }
        }
      }
    }
    genCell(grid, change, gen, 0, 3, 3, 3);
  }
  // Right
  else if (direction === 1) {
    for (let j = 0; j < 4; j++) {
      for (let i = 2; i >= 0; i--) {
        const gkey = gridKey(i, j);
        if (grid.cells[gkey]) {
          for (let i2 = i + 1; i2 < 4; i2++) {
            if (checkGrid(grid, change, gkey, i2, j)) {
              break;
            }
            if (checkGridEmpty(grid, change, gkey, i2, j, i2 - 1, j, i, j)) {
              break;
            }
            if (i2 === 3 && checkGridEnd(grid, change, gkey, i2, j)) {
              break;
            }
          }
        }
      }
    }
    genCell(grid, change, gen, 0, 0, 0, 3);
  }
  // Down
  else if (direction === 2) {
    for (let j = 2; j >= 0; j--) {
      for (let i = 0; i < 4; i++) {
        const gkey = gridKey(i, j);
        if (grid.cells[gkey]) {
          for (let j2 = j + 1; j2 < 4; j2++) {
            if (checkGrid(grid, change, gkey, i, j2)) {
              break;
            }
            if (checkGridEmpty(grid, change, gkey, i, j2, i, j2 - 1, i, j)) {
              break;
            }
            if (j2 === 3 && checkGridEnd(grid, change, gkey, i, j2)) {
              break;
            }
          }
        }
      }
    }
    genCell(grid, change, gen, 0, 0, 3, 0);
  }
  // Left
  else if (direction === 3) {
    for (let j = 0; j < 4; j++) {
      for (let i = 1; i < 4; i++) {
        const gkey = gridKey(i, j);
        if (grid.cells[gkey]) {
          for (let i2 = i - 1; i2 >= 0; i2--) {
            if (checkGrid(grid, change, gkey, i2, j)) {
              break;
            }
            if (checkGridEmpty(grid, change, gkey, i2, j, i2 + 1, j, i, j)) {
              break;
            }
            if (i2 === 0 && checkGridEnd(grid, change, gkey, i2, j)) {
              break;
            }
          }
        }
      }
    }
    genCell(grid, change, gen, 3, 0, 3, 3);
  }
  change.genState = {$set: gen.state};
  console.log(change);
  return update(grid, change);
}

const colors = {
  2: '#eee',
  4: '#ddd',
  8: '#bbb',
  16: '#aaa',
  32: '#999',
  64: '#888',
  128: '#777',
  256: '#666',
  512: '#555',
  1024: '#444',
  2048: '#333',
  4096: '#222',
  8192: '#111',
  16384: '#000',
};

class Main extends Component {

  constructor() {
    super();

    this.state = {
      grid: createGrid(),
    };
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyDown);
  }

  handleKeyDown(event) {
    const direction =
      event.which === 87 ? 0 :
      event.which === 68 ? 1 :
      event.which === 83 ? 2 :
      event.which === 65 ? 3 :
      event.which === 38 ? 0 :
      event.which === 39 ? 1 :
      event.which === 40 ? 2 :
      event.which === 37 ? 3 :
      -1;
    if (direction >= 0) {
      this.setState({
        grid: updateGrid(this.state.grid, direction),
      });
    }
  }

  renderTile(tile) {
    return <Animated key={tile.key} animateKey={tile.key}><div key={tile.key} style={{
      position: 'absolute',
      width: '25%',
      height: '25%',
      top: `${tile.y / 4 * 100}%`,
      left: `${tile.x / 4 * 100}%`,
      background: colors[tile.value] || '#000',
    }}>{tile.value}</div></Animated>;
  }

  render() {
    console.log(this.state.grid);
    const cells = Object.keys(this.state.grid.cells)
    .map(key => this.state.grid.cells[key])
    .filter(cell => cell);
    console.log(cells);
    // const {width, height} = this.state.grid;
    return (
      <div className="game-board">
        <Clamp
          width={4}
          height={5}>
          <AnimatedAgent>
            <div className="screen">
              <div className="bar" style={{height: `${1 / 5 * 100}%`}}>
                <Score score={this.state.grid.score} />
                <ResetButton reset={this.handleReset} />
              </div>
              <Batch className="board" style={{height: `${(5 - 1) / 5 * 100}%`}} items={cells}
                subbatch={tile => tile.x}
                >
                {this.renderTile}
              </Batch>
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
