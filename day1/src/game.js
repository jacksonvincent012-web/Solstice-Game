import { GRID_SIZE } from './constants.js';
import { getLevelGrid } from './levels.js';

export default class Game {
  constructor() {
    this.grid = [];
    this.hasWon = false;
    this.mirrorCount = 0;
    this.loadLevel();
  }

  loadLevel() {
    this.grid = getLevelGrid();
    this.hasWon = false;
    this.mirrorCount = 0;
    this.countMirrors();
  }

  resetLevel() {
    this.loadLevel();
  }

  placeMirror(x, y) {
    const cell = this.grid[y][x];
    if (cell === 0) { this.grid[y][x] = 1; this.mirrorCount++; return true; }
    if (cell === 1) { this.grid[y][x] = 2; return true; }
    if (cell === 2) { this.grid[y][x] = 0; this.mirrorCount--; return true; }
    return false;
  }

  removeMirror(x, y) {
    const cell = this.grid[y][x];
    if (cell === 1 || cell === 2) { this.grid[y][x] = 0; this.mirrorCount--; return true; }
    return false;
  }

  countMirrors() {
    this.mirrorCount = 0;
    for (let y = 0; y < GRID_SIZE; y++)
      for (let x = 0; x < GRID_SIZE; x++)
        if (this.grid[y][x] === 1 || this.grid[y][x] === 2) this.mirrorCount++;
  }

  isCellPlayable(x, y) {
    const c = this.grid[y][x];
    return c === 0 || c === 1 || c === 2;
  }
}
