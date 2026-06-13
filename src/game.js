import { GRID_SIZE } from './constants.js';
import { getLevelGrid, getLevel } from './levels.js';

export default class Game {
  constructor() {
    this.levelId = 1;
    this.grid = [];
    this.isDay = true;
    this.hasWon = false;
    this.paused = false;
    this.mirrorCount = 0;
    this.solved = new Set();
    this.loadProgress();
    this.loadLevel(this.levelId);
  }

  loadLevel(id) {
    this.levelId = id;
    this.grid = getLevelGrid(id);
    this.hasWon = false;
    this.paused = false;
    this.mirrorCount = 0;
    this.countMirrors();
  }

  resetLevel() {
    this.loadLevel(this.levelId);
  }

  loadProgress() {
    try {
      const data = JSON.parse(localStorage.getItem('solstice_progress') || '{}');
      this.solved = new Set(data.solved || []);
      this.levelId = data.levelId || 1;
    } catch { this.solved = new Set(); }
  }

  saveProgress() {
    localStorage.setItem('solstice_progress', JSON.stringify({
      solved: [...this.solved],
      levelId: this.levelId,
    }));
  }

  unlockNext() {
    const next = this.levelId + 1;
    if (next <= 5) this.solved.add(this.levelId);
    this.saveProgress();
    return next;
  }

  toggleDay() {
    this.isDay = !this.isDay;
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
