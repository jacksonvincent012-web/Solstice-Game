import { CELL } from './constants.js';

function emptyGrid() {
  return Array.from({ length: 8 }, () => Array(8).fill(CELL.EMPTY));
}

function set(g, y, x, val) { g[y][x] = val; }

const LEVELS = [
  {
    id: 1,
    name: 'First Light',
    subtitle: 'Place a mirror to route the sunbeam',
    build() {
      const g = emptyGrid();
      set(g, 1, 0, CELL.SUN_EMITTER);
      set(g, 3, 7, CELL.SUN_RECEPTOR);
      return g;
    }
  },
];

export function getLevelGrid() {
  return LEVELS[0].build();
}
