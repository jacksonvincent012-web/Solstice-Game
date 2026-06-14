import { CELL } from './constants.js';

export function traceRay(grid, startX, startY, dirX, dirY) {
  let x = startX + dirX;
  let y = startY + dirY;
  let dx = dirX, dy = dirY;
  const path = [];
  const visited = new Set();

  while (x >= 0 && x < 8 && y >= 0 && y < 8) {
    const key = x * 8 + y;
    if (visited.has(key)) break;
    visited.add(key);
    path.push({ x, y });
    const cell = grid[y][x];
    if (cell === CELL.WALL) break;
    if (cell === CELL.SUN_RECEPTOR) { return { path, hitReceptor: true }; }
    if (cell === CELL.MIRROR_FWD) { [dx, dy] = [-dy, -dx]; }
    else if (cell === CELL.MIRROR_BACK) { [dx, dy] = [dy, dx]; }
    else if (cell === CELL.SUN_EMITTER) break;
    x += dx; y += dy;
  }
  return { path, hitReceptor: false };
}

export function traceAll(grid) {
  const paths = [];
  const lit = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (grid[y][x] === CELL.SUN_EMITTER) {
        const result = traceRay(grid, x, y, 1, 0);
        paths.push(result);
        if (result.hitReceptor) lit.push({ x, y });
      }
    }
  }
  return { paths, lit };
}
