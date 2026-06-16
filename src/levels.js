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
    par: 3,
    hint: 'Each beam needs its own turn. Walls block the straight paths — work around them.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 5, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 2, 0, CELL.MOON_RECEPTOR);
      // Wall corridor forces indirect routing
      set(g, 0, 3, CELL.WALL);
      set(g, 0, 4, CELL.WALL);
      set(g, 0, 5, CELL.WALL);
      set(g, 7, 2, CELL.WALL);
      set(g, 7, 3, CELL.WALL);
      set(g, 7, 4, CELL.WALL);
      set(g, 3, 3, CELL.WALL);
      set(g, 4, 4, CELL.WALL);
      return g;
    }
  },
  {
    id: 6,
    name: 'The Split',
    subtitle: 'SUN and MOON take different routes through the maze',
    par: 4,
    hint: 'The central walls force each beam through a specific corridor. Plan one path at a time.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 7, 6, CELL.SUN_RECEPTOR);
      set(g, 0, 7, CELL.MOON_EMITTER);
      set(g, 7, 1, CELL.MOON_RECEPTOR);
      // Vertical wall barrier splitting the board
      set(g, 1, 3, CELL.WALL);
      set(g, 2, 3, CELL.WALL);
      set(g, 3, 3, CELL.WALL);
      set(g, 4, 4, CELL.WALL);
      set(g, 5, 4, CELL.WALL);
      set(g, 6, 4, CELL.WALL);
      set(g, 2, 6, CELL.WALL);
      set(g, 5, 1, CELL.WALL);
      return g;
    }
  },
  {
    id: 7,
    name: 'Crossings',
    subtitle: 'Beams must weave through a wall gauntlet',
    par: 4,
    hint: 'The walls leave only a few valid mirror positions. Work backward from each receptor.',
    build() {
      const g = emptyGrid();
      set(g, 0, 1, CELL.SUN_EMITTER);
      set(g, 6, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 6, CELL.MOON_EMITTER);
      set(g, 1, 0, CELL.MOON_RECEPTOR);
      // Dense wall grid — only narrow corridors remain
      set(g, 0, 4, CELL.WALL);
      set(g, 1, 4, CELL.WALL);
      set(g, 2, 2, CELL.WALL);
      set(g, 2, 5, CELL.WALL);
      set(g, 3, 2, CELL.WALL);
      set(g, 4, 5, CELL.WALL);
      set(g, 5, 2, CELL.WALL);
      set(g, 5, 5, CELL.WALL);
      set(g, 6, 3, CELL.WALL);
      set(g, 7, 3, CELL.WALL);
      return g;
    }
  },
  {
    id: 8,
    name: 'The Divide',
    subtitle: 'Stone walls close every obvious path',
    par: 4,
    hint: 'Count the open columns carefully. Each beam has only one valid route through.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 7, 7, CELL.SUN_RECEPTOR);
      set(g, 0, 7, CELL.MOON_EMITTER);
      set(g, 7, 0, CELL.MOON_RECEPTOR);
      // Staggered walls blocking direct diagonals
      set(g, 1, 2, CELL.WALL);
      set(g, 1, 5, CELL.WALL);
      set(g, 2, 4, CELL.WALL);
      set(g, 3, 1, CELL.WALL);
      set(g, 3, 6, CELL.WALL);
      set(g, 4, 1, CELL.WALL);
      set(g, 4, 6, CELL.WALL);
      set(g, 5, 3, CELL.WALL);
      set(g, 6, 2, CELL.WALL);
      set(g, 6, 5, CELL.WALL);
      return g;
    }
  },
  {
    id: 9,
    name: 'The Maze',
    subtitle: 'Only one path exists for each beam',
    par: 5,
    hint: 'Map the open cells first. Each beam is forced through a single corridor — find it.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 4, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 3, 0, CELL.MOON_RECEPTOR);
      // Dense wall maze — leaves only forced corridors
      set(g, 0, 2, CELL.WALL); set(g, 0, 3, CELL.WALL);
      set(g, 1, 5, CELL.WALL); set(g, 1, 6, CELL.WALL);
      set(g, 2, 1, CELL.WALL); set(g, 2, 4, CELL.WALL);
      set(g, 3, 3, CELL.WALL); set(g, 3, 6, CELL.WALL);
      set(g, 4, 2, CELL.WALL); set(g, 4, 5, CELL.WALL);
      set(g, 5, 1, CELL.WALL); set(g, 5, 4, CELL.WALL);
      set(g, 6, 3, CELL.WALL); set(g, 6, 6, CELL.WALL);
      set(g, 7, 1, CELL.WALL); set(g, 7, 4, CELL.WALL);
      return g;
    }
  },
  {
    id: 10,
    name: 'Solstice',
    subtitle: 'The final balance — nothing is obvious',
    par: 5,
    hint: 'Solve SUN first, then check MOON does not break it. A shared mirror is the key.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 6, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 1, 0, CELL.MOON_RECEPTOR);
      // Tight wall structure — very few open cells
      set(g, 0, 3, CELL.WALL); set(g, 0, 4, CELL.WALL); set(g, 0, 5, CELL.WALL);
      set(g, 1, 2, CELL.WALL); set(g, 1, 6, CELL.WALL);
      set(g, 2, 4, CELL.WALL);
      set(g, 3, 1, CELL.WALL); set(g, 3, 5, CELL.WALL);
      set(g, 4, 2, CELL.WALL); set(g, 4, 6, CELL.WALL);
      set(g, 5, 4, CELL.WALL);
      set(g, 6, 1, CELL.WALL); set(g, 6, 3, CELL.WALL);
      set(g, 7, 2, CELL.WALL); set(g, 7, 3, CELL.WALL); set(g, 7, 4, CELL.WALL);
      return g;
    }
  },
  // --- MASTER LEVELS ---
  {
    id: 11,
    name: 'Master\'s Gate',
    subtitle: 'The corridors narrow — think before you place',
    par: 5,
    hint: 'Walls cut off the obvious routes. Trace each beam from emitter to receptor before placing anything.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 5, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 2, 0, CELL.MOON_RECEPTOR);
      // Horizontal wall barriers forcing beams through specific rows
      set(g, 0, 2, CELL.WALL); set(g, 0, 3, CELL.WALL); set(g, 0, 4, CELL.WALL);
      set(g, 2, 5, CELL.WALL); set(g, 2, 6, CELL.WALL);
      set(g, 3, 1, CELL.WALL); set(g, 3, 2, CELL.WALL);
      set(g, 4, 4, CELL.WALL); set(g, 4, 5, CELL.WALL);
      set(g, 5, 2, CELL.WALL); set(g, 5, 3, CELL.WALL);
      set(g, 7, 1, CELL.WALL); set(g, 7, 2, CELL.WALL); set(g, 7, 3, CELL.WALL);
      return g;
    }
  },
  {
    id: 12,
    name: 'The Gauntlet',
    subtitle: 'Run the gauntlet — walls block every shortcut',
    par: 5,
    hint: 'Both beams must navigate the same central zone. One mirror position can redirect both.',
    build() {
      const g = emptyGrid();
      set(g, 0, 1, CELL.SUN_EMITTER);
      set(g, 6, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 6, CELL.MOON_EMITTER);
      set(g, 1, 0, CELL.MOON_RECEPTOR);
      // Interlocking wall pattern — forces beams through centre
      set(g, 0, 4, CELL.WALL); set(g, 0, 5, CELL.WALL);
      set(g, 1, 3, CELL.WALL); set(g, 1, 6, CELL.WALL);
      set(g, 2, 2, CELL.WALL); set(g, 2, 5, CELL.WALL);
      set(g, 3, 4, CELL.WALL); set(g, 3, 7, CELL.WALL);
      set(g, 4, 0, CELL.WALL); set(g, 4, 3, CELL.WALL);
      set(g, 5, 2, CELL.WALL); set(g, 5, 5, CELL.WALL);
      set(g, 6, 1, CELL.WALL); set(g, 6, 4, CELL.WALL);
      set(g, 7, 3, CELL.WALL);
      return g;
    }
  },
  {
    id: 13,
    name: 'Mirror Maze',
    subtitle: 'The maze has no obvious entrance',
    par: 5,
    hint: 'Count available cells per row. Most are blocked — the open ones are your only options.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 4, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 3, 0, CELL.MOON_RECEPTOR);
      // Very dense wall pattern — few cells remain open
      set(g, 0, 3, CELL.WALL); set(g, 0, 4, CELL.WALL); set(g, 0, 6, CELL.WALL);
      set(g, 1, 2, CELL.WALL); set(g, 1, 5, CELL.WALL); set(g, 1, 7, CELL.WALL);
      set(g, 2, 1, CELL.WALL); set(g, 2, 4, CELL.WALL); set(g, 2, 6, CELL.WALL);
      set(g, 3, 2, CELL.WALL); set(g, 3, 5, CELL.WALL);
      set(g, 4, 1, CELL.WALL); set(g, 4, 3, CELL.WALL); set(g, 4, 6, CELL.WALL);
      set(g, 5, 2, CELL.WALL); set(g, 5, 4, CELL.WALL);
      set(g, 6, 1, CELL.WALL); set(g, 6, 5, CELL.WALL); set(g, 6, 7, CELL.WALL);
      set(g, 7, 2, CELL.WALL); set(g, 7, 4, CELL.WALL);
      return g;
    }
  },
  {
    id: 14,
    name: 'Double Cross',
    subtitle: 'Both beams fight for the same space',
    par: 6,
    hint: 'Shared mirrors are essential — a mirror that serves SUN will also redirect MOON. Plan collisions deliberately.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 7, 6, CELL.SUN_RECEPTOR);
      set(g, 0, 7, CELL.MOON_EMITTER);
      set(g, 7, 1, CELL.MOON_RECEPTOR);
      // Symmetrical dense walls — forces beams to cross through centre
      set(g, 0, 3, CELL.WALL); set(g, 0, 4, CELL.WALL);
      set(g, 1, 2, CELL.WALL); set(g, 1, 5, CELL.WALL);
      set(g, 2, 1, CELL.WALL); set(g, 2, 3, CELL.WALL); set(g, 2, 4, CELL.WALL); set(g, 2, 6, CELL.WALL);
      set(g, 3, 2, CELL.WALL); set(g, 3, 5, CELL.WALL);
      set(g, 4, 2, CELL.WALL); set(g, 4, 5, CELL.WALL);
      set(g, 5, 1, CELL.WALL); set(g, 5, 3, CELL.WALL); set(g, 5, 4, CELL.WALL); set(g, 5, 6, CELL.WALL);
      set(g, 6, 2, CELL.WALL); set(g, 6, 5, CELL.WALL);
      set(g, 7, 3, CELL.WALL); set(g, 7, 4, CELL.WALL);
      return g;
    }
  },
  {
    id: 15,
    name: 'The Crucible',
    subtitle: 'Only the most precise routing survives',
    par: 6,
    hint: 'Almost every row and column has a wall. Find the two open corridors and route both beams through them.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 6, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 1, 0, CELL.MOON_RECEPTOR);
      // Near-complete wall coverage — surgical routing required
      set(g, 0, 2, CELL.WALL); set(g, 0, 4, CELL.WALL); set(g, 0, 6, CELL.WALL);
      set(g, 1, 3, CELL.WALL); set(g, 1, 5, CELL.WALL); set(g, 1, 7, CELL.WALL);
      set(g, 2, 1, CELL.WALL); set(g, 2, 4, CELL.WALL); set(g, 2, 6, CELL.WALL);
      set(g, 3, 2, CELL.WALL); set(g, 3, 3, CELL.WALL); set(g, 3, 5, CELL.WALL);
      set(g, 4, 1, CELL.WALL); set(g, 4, 4, CELL.WALL); set(g, 4, 6, CELL.WALL);
      set(g, 5, 2, CELL.WALL); set(g, 5, 3, CELL.WALL); set(g, 5, 5, CELL.WALL);
      set(g, 6, 1, CELL.WALL); set(g, 6, 4, CELL.WALL);
      set(g, 7, 2, CELL.WALL); set(g, 7, 3, CELL.WALL); set(g, 7, 5, CELL.WALL);
      return g;
    }
  },
  // --- GRANDMASTER LEVELS ---
  {
    id: 16,
    name: 'Shadow Realm',
    subtitle: 'Darkness consumes everything but the path',
    par: 6,
    hint: 'The wall density leaves almost no free cells. Every mirror must serve a purpose — no wasted placements.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 5, 7, CELL.SUN_RECEPTOR);
      set(g, 7, 7, CELL.MOON_EMITTER);
      set(g, 2, 0, CELL.MOON_RECEPTOR);
      // Extremely dense walls — maximum constraint
      set(g, 0, 2, CELL.WALL); set(g, 0, 3, CELL.WALL); set(g, 0, 5, CELL.WALL); set(g, 0, 6, CELL.WALL);
      set(g, 1, 1, CELL.WALL); set(g, 1, 4, CELL.WALL); set(g, 1, 6, CELL.WALL);
      set(g, 2, 2, CELL.WALL); set(g, 2, 4, CELL.WALL); set(g, 2, 6, CELL.WALL);
      set(g, 3, 1, CELL.WALL); set(g, 3, 3, CELL.WALL); set(g, 3, 5, CELL.WALL);
      set(g, 4, 2, CELL.WALL); set(g, 4, 4, CELL.WALL); set(g, 4, 6, CELL.WALL);
      set(g, 5, 1, CELL.WALL); set(g, 5, 3, CELL.WALL); set(g, 5, 5, CELL.WALL);
      set(g, 6, 2, CELL.WALL); set(g, 6, 4, CELL.WALL); set(g, 6, 6, CELL.WALL);
      set(g, 7, 1, CELL.WALL); set(g, 7, 3, CELL.WALL); set(g, 7, 5, CELL.WALL);
      return g;
    }
  },
  {
    id: 17,
    name: 'The Abyss',
    subtitle: 'One wrong mirror and both paths collapse',
    par: 6,
    hint: 'The open cells form two interlocking snake paths. Both beams must share some mirrors. Draw the paths on paper first.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 7, 7, CELL.SUN_RECEPTOR);
      set(g, 0, 7, CELL.MOON_EMITTER);
      set(g, 7, 0, CELL.MOON_RECEPTOR);
      // Snake corridor — both beams forced through same narrow passages
      set(g, 0, 2, CELL.WALL); set(g, 0, 3, CELL.WALL); set(g, 0, 4, CELL.WALL); set(g, 0, 5, CELL.WALL);
      set(g, 1, 1, CELL.WALL); set(g, 1, 3, CELL.WALL); set(g, 1, 5, CELL.WALL); set(g, 1, 7, CELL.WALL);
      set(g, 2, 1, CELL.WALL); set(g, 2, 3, CELL.WALL); set(g, 2, 5, CELL.WALL); set(g, 2, 7, CELL.WALL);
      set(g, 3, 0, CELL.WALL); set(g, 3, 2, CELL.WALL); set(g, 3, 4, CELL.WALL); set(g, 3, 6, CELL.WALL);
      set(g, 4, 1, CELL.WALL); set(g, 4, 3, CELL.WALL); set(g, 4, 5, CELL.WALL); set(g, 4, 7, CELL.WALL);
      set(g, 5, 0, CELL.WALL); set(g, 5, 2, CELL.WALL); set(g, 5, 4, CELL.WALL); set(g, 5, 6, CELL.WALL);
      set(g, 6, 1, CELL.WALL); set(g, 6, 3, CELL.WALL); set(g, 6, 5, CELL.WALL); set(g, 6, 7, CELL.WALL);
      set(g, 7, 2, CELL.WALL); set(g, 7, 3, CELL.WALL); set(g, 7, 4, CELL.WALL); set(g, 7, 5, CELL.WALL);
      return g;
    }
  },
  {
    id: 18,
    name: 'The Impossible',
    subtitle: 'Only geniuses and dreamers need apply',
    par: 7,
    hint: 'Fewer than 10 cells are free. Every single one is part of the solution. There is no margin for error.',
    build() {
      const g = emptyGrid();
      set(g, 0, 0, CELL.SUN_EMITTER);
      set(g, 7, 6, CELL.SUN_RECEPTOR);
      set(g, 0, 7, CELL.MOON_EMITTER);
      set(g, 7, 1, CELL.MOON_RECEPTOR);
      // Maximum wall density — absolute minimum free cells
      set(g, 0, 2, CELL.WALL); set(g, 0, 3, CELL.WALL); set(g, 0, 4, CELL.WALL); set(g, 0, 5, CELL.WALL);
      set(g, 1, 1, CELL.WALL); set(g, 1, 3, CELL.WALL); set(g, 1, 4, CELL.WALL); set(g, 1, 5, CELL.WALL); set(g, 1, 6, CELL.WALL);
      set(g, 2, 2, CELL.WALL); set(g, 2, 3, CELL.WALL); set(g, 2, 5, CELL.WALL); set(g, 2, 6, CELL.WALL);
      set(g, 3, 1, CELL.WALL); set(g, 3, 3, CELL.WALL); set(g, 3, 4, CELL.WALL); set(g, 3, 6, CELL.WALL);
      set(g, 4, 1, CELL.WALL); set(g, 4, 3, CELL.WALL); set(g, 4, 4, CELL.WALL); set(g, 4, 6, CELL.WALL);
      set(g, 5, 2, CELL.WALL); set(g, 5, 3, CELL.WALL); set(g, 5, 5, CELL.WALL); set(g, 5, 6, CELL.WALL);
      set(g, 6, 1, CELL.WALL); set(g, 6, 3, CELL.WALL); set(g, 6, 4, CELL.WALL); set(g, 6, 5, CELL.WALL);
      set(g, 7, 2, CELL.WALL); set(g, 7, 3, CELL.WALL); set(g, 7, 4, CELL.WALL); set(g, 7, 5, CELL.WALL);
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
