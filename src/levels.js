import { CELL } from './constants.js';

function emptyGrid() {
  return Array.from({ length: 8 }, () => Array(8).fill(CELL.EMPTY));
}

function set(g, y, x, val) { g[y][x] = val; }

export const LEVELS = [
  {
    id: 1,
    name: 'First Light',
    subtitle: 'Place a mirror to route the sunbeam',
    par: 1,
    hint: '\\ mirrors reflect rightward beams downward. / mirrors reflect them upward. Try both orientations.',
    build() {
      const g = emptyGrid();
      set(g, 1, 0, CELL.SUN_EMITTER);
      set(g, 3, 7, CELL.SUN_RECEPTOR);
      return g;
    }
  },
  {
    id: 2,
    name: 'Two Shadows',
    subtitle: 'Route both sun and moon to their targets',
    par: 3,
    hint: 'Toggle between SUN and MOON mode. Each beam follows its own path through the mirrors you place.',
    build() {
      const g = emptyGrid();
      set(g, 1, 0, CELL.SUN_EMITTER);
      set(g, 3, 7, CELL.SUN_RECEPTOR);
      set(g, 5, 7, CELL.MOON_EMITTER);
      set(g, 7, 0, CELL.MOON_RECEPTOR);
      return g;
    }
  },
  {
    id: 3,
    name: 'Crossings',
    subtitle: 'Beams must cross paths without interfering',
    par: 4,
    hint: 'SUN and MOON beams pass through each other without interference. Plan each route independently.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 4, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 3, 0, CELL.MOON_RECEPTOR);
      set(g, 2, 2, CELL.WALL);
      set(g, 5, 5, CELL.WALL);
      return g;
    }
  },
  {
    id: 4,
    name: 'The Maze',
    subtitle: 'Navigate through corridors of stone',
    par: 5,
    hint: 'Trace each path backward from the receptor.',
    build() {
      const g = emptyGrid();
      set(g, 0, 3, CELL.SUN_EMITTER);
      set(g, 7, 3, CELL.SUN_RECEPTOR);
      set(g, 7, 4, CELL.MOON_EMITTER);
      set(g, 0, 4, CELL.MOON_RECEPTOR);
      for (let i = 1; i <= 5; i++) {
        set(g, i, 1, CELL.WALL);
        set(g, i, 6, CELL.WALL);
      }
      set(g, 3, 2, CELL.WALL);
      set(g, 3, 3, CELL.WALL);
      set(g, 3, 4, CELL.WALL);
      set(g, 4, 3, CELL.WALL);
      set(g, 4, 4, CELL.WALL);
      set(g, 4, 5, CELL.WALL);
      return g;
    }
  },
  {
    id: 5,
    name: 'Solstice',
    subtitle: 'The final balance of light and shadow',
    par: 6,
    hint: 'Use both toggle states to verify your solution.',
    build() {
      const g = emptyGrid();
      set(g, 0, 1, CELL.SUN_EMITTER);
      set(g, 5, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 6, CELL.MOON_EMITTER);
      set(g, 2, 0, CELL.MOON_RECEPTOR);
      const walls = [
        [1,2],[1,3],[1,4],[1,5],
        [3,1],[4,1],[5,1],
        [3,5],[4,5],[5,5],
        [6,2],[6,3],[6,4],
      ];
      for (const [r, c] of walls) set(g, r, c, CELL.WALL);
      return g;
    }
  },
];

export function getLevel(id) {
  return LEVELS.find(l => l.id === id) || LEVELS[0];
}

export function getLevelGrid(id) {
  const level = getLevel(id);
  return level ? level.build() : LEVELS[0].build();
}
