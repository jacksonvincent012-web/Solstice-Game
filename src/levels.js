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
    name: 'Second Glance',
    subtitle: 'Try the other mirror orientation',
    par: 1,
    hint: 'A / mirror sends a rightward beam upward. Place one to redirect the beam to the receptor.',
    build() {
      const g = emptyGrid();
      set(g, 2, 0, CELL.SUN_EMITTER);
      set(g, 0, 6, CELL.SUN_RECEPTOR);
      return g;
    }
  },
  {
    id: 3,
    name: 'Crossroads',
    subtitle: 'Chain two mirrors to bend the beam twice',
    par: 2,
    hint: 'One mirror turns the beam, another turns it again. Both mirrors face the same way here.',
    build() {
      const g = emptyGrid();
      set(g, 2, 0, CELL.SUN_EMITTER);
      set(g, 1, 7, CELL.SUN_RECEPTOR);
      set(g, 2, 7, CELL.WALL);
      return g;
    }
  },
  {
    id: 4,
    name: 'Detour',
    subtitle: 'Navigate around a stone wall',
    par: 2,
    hint: 'A wall blocks the direct path. Turn downward before reaching it, then turn right again.',
    build() {
      const g = emptyGrid();
      set(g, 2, 0, CELL.SUN_EMITTER);
      set(g, 4, 6, CELL.SUN_RECEPTOR);
      set(g, 2, 5, CELL.WALL);
      return g;
    }
  },
  {
    id: 5,
    name: 'Two Shadows',
    subtitle: 'Route both sun and moon to their targets',
    par: 4,
    hint: 'Toggle between SUN and MOON mode. Each beam follows its own path through the mirrors you place.',
    build() {
      const g = emptyGrid();
      set(g, 1, 0, CELL.SUN_EMITTER);
      set(g, 3, 7, CELL.SUN_RECEPTOR);
      set(g, 5, 7, CELL.MOON_EMITTER);
      set(g, 7, 0, CELL.MOON_RECEPTOR);
      set(g, 1, 7, CELL.WALL);
      set(g, 5, 0, CELL.WALL);
      return g;
    }
  },
  {
    id: 6,
    name: 'The Split',
    subtitle: 'SUN and MOON take different routes',
    par: 4,
    hint: 'SUN needs a \\ near the right edge. MOON needs a / near the left edge. Plan both paths.',
    build() {
      const g = emptyGrid();
      set(g, 1, 0, CELL.SUN_EMITTER);
      set(g, 4, 7, CELL.SUN_RECEPTOR);
      set(g, 6, 7, CELL.MOON_EMITTER);
      set(g, 3, 0, CELL.MOON_RECEPTOR);
      set(g, 1, 7, CELL.WALL);
      set(g, 6, 0, CELL.WALL);
      return g;
    }
  },
  {
    id: 7,
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
      set(g, 0, 7, CELL.WALL);
      set(g, 7, 0, CELL.WALL);
      set(g, 2, 2, CELL.WALL);
      set(g, 5, 5, CELL.WALL);
      return g;
    }
  },
  {
    id: 8,
    name: 'The Divide',
    subtitle: 'Two walls split the board into passages',
    par: 4,
    hint: 'SUN goes right and turns down. MOON goes left and turns up. Plan two turns per path.',
    build() {
      const g = emptyGrid();
      set(g, 1, 0, CELL.SUN_EMITTER);
      set(g, 4, 7, CELL.SUN_RECEPTOR);
      set(g, 6, 7, CELL.MOON_EMITTER);
      set(g, 3, 0, CELL.MOON_RECEPTOR);
      set(g, 1, 5, CELL.WALL); set(g, 1, 6, CELL.WALL);
      set(g, 6, 4, CELL.WALL);
      return g;
    }
  },
  {
    id: 9,
    name: 'The Maze',
    subtitle: 'Navigate through corridors of stone',
    par: 4,
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
    id: 10,
    name: 'Solstice',
    subtitle: 'The final balance of light and shadow',
    par: 5,
    hint: 'Use both toggle states to verify your solution.',
    build() {
      const g = emptyGrid();
      set(g, 0, 1, CELL.SUN_EMITTER);
      set(g, 5, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 6, CELL.MOON_EMITTER);
      set(g, 2, 0, CELL.MOON_RECEPTOR);
      set(g, 0, 7, CELL.WALL);
      set(g, 7, 0, CELL.WALL);
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
