import { GRID_SIZE } from './constants.js';
import { getLevelGrid, getLevel, LEVELS } from './levels.js';

export const BEGINNER_IDS = [1, 2];
export const BASIC_IDS = [3, 4];
export const AVERAGE_IDS = [5, 6, 7, 8, 9];
export const EXPERT_IDS = [10];
export const MASTER_IDS = [11, 12, 13, 14, 15, 16];
export const GRANDMASTER_IDS = [17];
export const GREAT_GRANDMASTER_IDS = [18];

export function getTierName(id) {
  if (BEGINNER_IDS.includes(id)) return 'BEGINNER';
  if (BASIC_IDS.includes(id)) return 'BASIC';
  if (AVERAGE_IDS.includes(id)) return 'AVERAGE';
  if (EXPERT_IDS.includes(id)) return 'EXPERT';
  if (MASTER_IDS.includes(id)) return 'MASTER';
  if (GRANDMASTER_IDS.includes(id)) return 'GRAND MASTER';
  if (GREAT_GRANDMASTER_IDS.includes(id)) return 'GREAT GRAND MASTER';
  return '';
}

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
    this.greatGrandmasterUnlocked = false;
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
      this.greatGrandmasterUnlocked = !!data.greatGrandmasterUnlocked;
    } catch { this.solved = new Set(); this.stars = {}; }
  }

  saveProgress() {
    localStorage.setItem('solstice_progress', JSON.stringify({
      solved: [...this.solved],
      levelId: this.levelId,
      stars: this.stars,
      masterUnlocked: this.masterUnlocked,
      grandmasterUnlocked: this.grandmasterUnlocked,
      greatGrandmasterUnlocked: this.greatGrandmasterUnlocked,
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

  allPreMasterSolved() {
    return [...BEGINNER_IDS, ...BASIC_IDS, ...AVERAGE_IDS, ...EXPERT_IDS].every(id => this.solved.has(id));
  }

  allMasterSolved() {
    return MASTER_IDS.every(id => this.solved.has(id));
  }

  allGrandmasterSolved() {
    return GRANDMASTER_IDS.every(id => this.solved.has(id));
  }

  allGreatGrandmasterSolved() {
    return GREAT_GRANDMASTER_IDS.every(id => this.solved.has(id));
  }

  isMaster(id) { return MASTER_IDS.includes(id); }
  isGrandmaster(id) { return GRANDMASTER_IDS.includes(id); }
  isGreatGrandmaster(id) { return GREAT_GRANDMASTER_IDS.includes(id); }

  isLevelAccessible(id) {
    const preMaster = [...BEGINNER_IDS, ...BASIC_IDS, ...AVERAGE_IDS, ...EXPERT_IDS];
    if (preMaster.includes(id)) {
      return id === 1 || this.solved.has(id - 1);
    }
    if (MASTER_IDS.includes(id)) {
      if (!this.masterUnlocked) return false;
      return id === 11 || this.solved.has(id - 1);
    }
    if (GRANDMASTER_IDS.includes(id)) {
      if (!this.grandmasterUnlocked) return false;
      return id === 17 || this.solved.has(id - 1);
    }
    if (GREAT_GRANDMASTER_IDS.includes(id)) {
      if (!this.greatGrandmasterUnlocked) return false;
      return id === 18 || this.solved.has(id - 1);
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
