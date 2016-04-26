import React from 'react';
import update from 'react-addons-update';

import Box2D from 'box2d';

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
    // debugger;
    this.b2Gravity = new Box2D.b2Vec2(0, -3);
    this.world = new Box2D.b2World(this.b2Gravity);
    this.shapes = {};
    this.shapeCount = 0;
    this.state = {
      width: 8,
      height: 10,
      tiles: {},
    };
    this.addStatic(0, 0, 8, 1);
    this.addStatic(-1, 10, 1, 10);
    this.addStatic(8, 10, 1, 10);
    this._stepBox2dId = null;
    this._stepBox2dTimer = 0;
    this._stepBox2dLast = Date.now();
  }

  addStatic(x, y, w, h) {
    const bodyDef = new Box2D.b2BodyDef();
    bodyDef.set_type(Box2D.b2_staticBody);
    const body = this.world.CreateBody(bodyDef);
    const shape = new Box2D.b2PolygonShape();
    shape.SetAsBox(w / 2, h / 2);
    // const shape = Box2D.createPolygonShape([
    //   new Box2D.b2Vec2(0, 0),
    //   new Box2D.b2Vec2(w, 0),
    //   new Box2D.b2Vec2(w, -h),
    //   new Box2D.b2Vec2(0, -h),
    // ]);
    const fixtureDef = new Box2D.b2FixtureDef();
    fixtureDef.set_shape(shape);
    body.CreateFixture(fixtureDef);
    body.SetTransform(new Box2D.b2Vec2(x + w / 2, y - h / 2), 0);
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

  box2dAnimation(tile) {
    return (options => {
      const agentRect = this.refs.agent.rect;
      const body = this.createBody(
        (options.lastRect.left - agentRect.left) / options.lastRect.width,
        10 - (options.lastRect.top - agentRect.top) / options.lastRect.width
      );
      return options.timer(timer => {
        const rect = options.rect.clone();
        timer.cancelable(() => {
          this.destroyBody(body);
          return rect;
        });
        const style = {
          transform: '',
        };
        return timer.loop(() => {
          const transform = body.GetTransform();
          const position = transform.get_p();
          const width = rect.width;
          rect.left = agentRect.left + (position.get_x() - 0.5) * width;
          rect.top = agentRect.top + (10 - position.get_y() - 0.5) * width;
          rect.angle = -transform.get_q().GetAngle();
          style.transform = rect.transform(options.rect);
          options.setStyle(style);
          return 0;
        });
      });
    });
  }

  animateTile(tile) {
    return this.box2dAnimation(tile);
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

  handleAddRepeatStart(event) {
    this._addRepeatLocation = [event.pageX, event.pageY];
    this._addRepeatId = setTimeout(this.handleAddRepeat, 250);
  }

  handleAddRepeatEnd() {
    clearTimeout(this._addRepeatId);
  }

  handleAddRepeat() {
    clearTimeout(this._addRepeatId);
    this._addRepeatId = setTimeout(this.handleAddRepeat, 250);
    this.handleAdd(...this._addRepeatLocation);
  }

  createBody(x, y) {
    if (this.shapeCount === 0) {
      // This is the first dynamic physics body in a while. Set the last time so
      // the physics loop doesn't do a lot of steps to account since page load
      // or when there was last a dynamic body.
      this._stepBox2dLast = Date.now();
    }

    const bodyDef = new Box2D.b2BodyDef();
    const canvasRect = this.refs.agent.rect;
    bodyDef.set_position(new Box2D.b2Vec2(x, y));
    bodyDef.set_angle(Math.PI * 2 * Math.random());
    bodyDef.set_type(Box2D.b2_dynamicBody);
    bodyDef.set_awake(1);
    bodyDef.set_active(1);
    const body = this.world.CreateBody(bodyDef);

    const shape = new Box2D.b2PolygonShape();
    shape.SetAsBox(0.5, 0.5);
    const fixtureDef = new Box2D.b2FixtureDef();
    fixtureDef.set_shape(shape);
    fixtureDef.set_density(1);
    fixtureDef.set_friction(0.3);
    body.CreateFixture(fixtureDef);

    // this.shapes[id] = body;
    this.shapeCount++;

    this.stepBox2d();

    return body;
  }

  destroyBody(body) {
    this.world.DestroyBody(body);
    this.shapeCount--;
  }

  handleAdd(pageX, pageY) {
    const id = Math.random().toString(36).substring(2);
    const key = Math.random().toString(36).substring(2);
    const canvasRect = this.refs.agent.rect;
    this.updateState({tiles: {[id]: {$set: {
      key,
      shapeId: id,
      startX: (pageX - canvasRect.left) / canvasRect.width,
      startY: (pageY - canvasRect.top) / (canvasRect.width / 8 * 10),
    }}}});
  }

  stepBox2d() {
    cancelAnimationFrame(this._stepBox2dId);
    if (this.shapeCount === 0) {
      return;
    }
    this._stepBox2dId = requestAnimationFrame(this.stepBox2d);
    this._stepBox2dTimer += (Date.now() - this._stepBox2dLast) / 1000;
    this._stepBox2dLast = Date.now();
    // console.log(this._stepBox2dTimer);
    if (this._stepBox2dTimer > 0.05) {
      this.world.Step(0.05, 5, 5);
      this._stepBox2dTimer -= 0.05;
    }
  }

  removeTile(tile, event) {
    this.updateState({tiles: {[tile.shapeId]: {$set: null}}});
    event.stopPropagation();
    return false;
  }

  renderTile(tile) {
    return (<Animated
      key={tile.key} animateKey={tile.key}
      animate={this.animateTile(tile)}
      >
      <div style={{
        position: 'absolute',
        width: `${100 / this.state.width}%`,
        height: `${100 / this.state.height}%`,
        left: `${tile.startX * 100}%`,
        top: `${tile.startY * 100}%`,
        // left: `${tile.x * 100 / this.state.grid.width}%`,
        // bottom: `${tile.y * 100 / this.state.grid.height}%`,
        background: colors[0],
      }} onClick={event => this.removeTile(tile, event)}>
      </div>
    </Animated>);
  }

  render() {
    const tiles = Object.keys(this.state.tiles)
    .map(key => this.state.tiles[key])
    .filter(tile => tile);
    return (
      <div className="game-board">
        <Clamp
          width={this.state.width}
          height={this.state.height}>
          <AnimatedAgent ref="agent">
          <div style={{width: '100%', height: '100%'}} onClick={event => this.handleAdd(event.pageX, event.pageY)} onMouseDown={this.handleAddRepeatStart} onMouseUp={this.handleAddRepeatEnd}>
              <Batch items={tiles}>
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
