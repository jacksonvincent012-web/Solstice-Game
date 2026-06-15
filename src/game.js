import { GRID_SIZE } from './constants.js';
import { getLevelGrid, getLevel, LEVELS } from './levels.js';

export const STANDARD_IDS = [1,2,3,4,5,6,7,8,9,10];
export const MASTER_IDS = [11,12,13,14,15];
export const GRANDMASTER_IDS = [16,17,18];

export default class Game {
  constructor() {
    this.levelId = 1;
    this.grid = [];
    this.isDay = true;
    this.hasWon = false;
    this.paused = false;
    this.mirrorCount = 0;
    this.solved = new Set();
    this.stars = {};
    this.masterUnlocked = false;
    this.grandmasterUnlocked = false;
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
    this.resetHistory();
  }

  resetLevel() { this.loadLevel(this.levelId); }

  loadProgress() {
    try {
      const data = JSON.parse(localStorage.getItem('solstice_progress') || '{}');
      this.solved = new Set(data.solved || []);
      this.levelId = data.levelId || 1;
      this.stars = data.stars || {};
      this.masterUnlocked = !!data.masterUnlocked;
      this.grandmasterUnlocked = !!data.grandmasterUnlocked;
    } catch { this.solved = new Set(); this.stars = {}; }
  }

  saveProgress() {
    localStorage.setItem('solstice_progress', JSON.stringify({
      solved: [...this.solved],
      levelId: this.levelId,
      stars: this.stars,
      masterUnlocked: this.masterUnlocked,
      grandmasterUnlocked: this.grandmasterUnlocked,
    }));
  }

  unlockNext() {
    this.solved.add(this.levelId);
    const stars = this.getStars();
    const prev = this.stars[this.levelId] || 0;
    if (stars > prev) this.stars[this.levelId] = stars;
    this.saveProgress();
    return this.levelId + 1;
  }

  getPar() {
    const level = getLevel(this.levelId);
    return level ? level.par : 99;
  }

  getStars() {
    const par = this.getPar();
    if (this.mirrorCount <= par) return 3;
    if (this.mirrorCount <= par + 2) return 2;
    return 1;
  }

  allStandardSolved() {
    return STANDARD_IDS.every(id => this.solved.has(id));
  }

  allMasterSolved() {
    return MASTER_IDS.every(id => this.solved.has(id));
  }

  allGrandmasterSolved() {
    return GRANDMASTER_IDS.every(id => this.solved.has(id));
  }

  isLevelAccessible(id) {
    if (STANDARD_IDS.includes(id)) {
      return id === 1 || this.solved.has(id - 1);
    }
    if (MASTER_IDS.includes(id)) {
      if (!this.masterUnlocked) return false;
      return id === 11 || this.solved.has(id - 1);
    }
    if (GRANDMASTER_IDS.includes(id)) {
      if (!this.grandmasterUnlocked) return false;
      return id === 16 || this.solved.has(id - 1);
    }
    return true;
  }

  toggleDay() { this.isDay = !this.isDay; }

  saveSnapshot() {
    return this.grid.map(row => [...row]);
  }

  restoreSnapshot(snap) {
    this.grid = snap.map(row => [...row]);
    this.countMirrors();
  }

  resetHistory() {
    this.history = [this.saveSnapshot()];
    this.historyIndex = 0;
  }

  pushHistory() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(this.saveSnapshot());
    this.historyIndex++;
  }

  undo() {
    if (this.historyIndex <= 0) return false;
    this.historyIndex--;
    this.restoreSnapshot(this.history[this.historyIndex]);
    return true;
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return false;
    this.historyIndex++;
    this.restoreSnapshot(this.history[this.historyIndex]);
    return true;
  }

  placeMirror(x, y) {
    const cell = this.grid[y][x];
    if (cell !== 0 && cell !== 1 && cell !== 2) return false;
    this.pushHistory();
    if (cell === 0) { this.grid[y][x] = 1; this.mirrorCount++; return true; }
    if (cell === 1) { this.grid[y][x] = 2; return true; }
    if (cell === 2) { this.grid[y][x] = 0; this.mirrorCount--; return true; }
    return false;
  }

  removeMirror(x, y) {
    const cell = this.grid[y][x];
    if (cell !== 1 && cell !== 2) return false;
    this.pushHistory();
    this.grid[y][x] = 0;
    this.mirrorCount--;
    return true;
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
