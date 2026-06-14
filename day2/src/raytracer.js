import { CELL } from './constants.js';

export function traceRay(grid, startX, startY, dirX, dirY, isDayMode) {
  let x = startX + dirX;
  let y = startY + dirY;
  let dx = dirX, dy = dirY;
  const path = [];
  const visited = new Set();
  const receptorType = isDayMode ? CELL.SUN_RECEPTOR : CELL.MOON_RECEPTOR;
  const emitterType = isDayMode ? CELL.SUN_EMITTER : CELL.MOON_EMITTER;
  let hitReceptor = false;

  while (x >= 0 && x < 8 && y >= 0 && y < 8) {
    const key = x * 8 + y;
    if (visited.has(key)) break;
    visited.add(key);
    path.push({ x, y });
    const cell = grid[y][x];
    if (cell === CELL.WALL) break;
    if (cell === receptorType) { hitReceptor = true; break; }
    if (cell === CELL.MIRROR_FWD) { [dx, dy] = [-dy, -dx]; }
    else if (cell === CELL.MIRROR_BACK) { [dx, dy] = [dy, dx]; }
    else if (cell === emitterType) break;
    x += dx; y += dy;
  }
  return { path, hitReceptor };
}

export function traceAll(grid, isDayMode) {
  const paths = [];
  const lit = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const cell = grid[y][x];
      const isEmitter = isDayMode ? (cell === CELL.SUN_EMITTER) : (cell === CELL.MOON_EMITTER);
      if (isEmitter) {
        const dirX = isDayMode ? 1 : -1;
        const result = traceRay(grid, x, y, dirX, 0, isDayMode);
        paths.push(result);
        if (result.hitReceptor) lit.push({ x, y });
      }
    }
  }
  return { paths, lit };
}
