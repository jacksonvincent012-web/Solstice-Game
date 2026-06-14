export const CELL = Object.freeze({
  EMPTY: 0,
  MIRROR_FWD: 1,
  MIRROR_BACK: 2,
  WALL: 3,
  SUN_EMITTER: 4,
  MOON_EMITTER: 5,
  SUN_RECEPTOR: 6,
  MOON_RECEPTOR: 7,
});

export const GRID_SIZE = 8;
export const CANVAS_SIZE = 560;

export const COLORS = {
  SUN: '#ffd700',
  MOON: '#4a90d9',
  GRID_BORDER: '#1a1a3a',
  CELL_A: '#0d0d22',
  CELL_B: '#0f0f28',
  MIRROR: '#8888bb',
  WALL_BG: '#12122a',
  WALL_FG: '#222244',
};
