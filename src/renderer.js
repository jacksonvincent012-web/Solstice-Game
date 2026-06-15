import { CELL, GRID_SIZE, CANVAS_SIZE, COLORS } from './constants.js';
import { traceAll } from './raytracer.js';

export class Renderer {
  constructor(canvas, particleSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    this.cellSize = CANVAS_SIZE / GRID_SIZE;
    this.particles = particleSystem;
    this.lastTime = 0;
  }

  draw(game, hoverCell) {
    const ctx = this.ctx;
    const now = Date.now() / 1000;
    const dt = this.lastTime ? Math.min(now - this.lastTime, 0.05) : 0.016;
    this.lastTime = now;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const dayResults = traceAll(game.grid, true);
    const nightResults = traceAll(game.grid, false);
    const activeResults = game.isDay ? dayResults : nightResults;
    const hasDay = game.grid.some(row => row.includes(CELL.SUN_EMITTER));
    const hasNight = game.grid.some(row => row.includes(CELL.MOON_EMITTER));
    const dayLit = dayResults.lit.length > 0;
    const nightLit = nightResults.lit.length > 0;
    const bothLit = (!hasDay || dayLit) && (!hasNight || nightLit);

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const px = x * this.cellSize;
        const py = y * this.cellSize;
        const cell = game.grid[y][x];
        const isHover = hoverCell && hoverCell.x === x && hoverCell.y === y;

        ctx.fillStyle = (x + y) % 2 === 0 ? COLORS.CELL_A : COLORS.CELL_B;
        if (isHover && cell === CELL.EMPTY) ctx.fillStyle = '#131338';
        ctx.fillRect(px, py, this.cellSize, this.cellSize);
        ctx.strokeStyle = isHover ? '#2a2a5a' : COLORS.GRID_BORDER;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, this.cellSize, this.cellSize);

        const cx = px + this.cellSize / 2;
        const cy = py + this.cellSize / 2;

        if (cell === CELL.WALL) {
          ctx.fillStyle = COLORS.WALL_BG;
          ctx.fillRect(px + 2, py + 2, this.cellSize - 4, this.cellSize - 4);
          ctx.fillStyle = COLORS.WALL_FG;
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('\u25A0', cx, cy);
        } else if (cell === CELL.MIRROR_FWD || cell === CELL.MIRROR_BACK) {
          ctx.strokeStyle = isHover ? '#aaaadd' : COLORS.MIRROR;
          ctx.lineWidth = 3;
          ctx.shadowColor = COLORS.MIRROR;
          ctx.shadowBlur = isHover ? 10 : 6;
          ctx.beginPath();
          if (cell === CELL.MIRROR_FWD) {
            ctx.moveTo(px + 6, py + this.cellSize - 6);
            ctx.lineTo(px + this.cellSize - 6, py + 6);
          } else {
            ctx.moveTo(px + 6, py + 6);
            ctx.lineTo(px + this.cellSize - 6, py + this.cellSize - 6);
          }
          ctx.stroke(); ctx.shadowBlur = 0;
        } else if (cell === CELL.SUN_EMITTER) {
          ctx.fillStyle = COLORS.SUN;
          ctx.shadowColor = COLORS.SUN; ctx.shadowBlur = 16 + Math.sin(now * 2) * 4;
          ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#000';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('\u2600', cx, cy);
          ctx.fillStyle = COLORS.SUN;
          ctx.font = '10px sans-serif';
          ctx.fillText('\u25B6', cx + 22, cy);
        } else if (cell === CELL.MOON_EMITTER) {
          ctx.fillStyle = COLORS.MOON;
          ctx.shadowColor = COLORS.MOON; ctx.shadowBlur = 16 + Math.sin(now * 2) * 4;
          ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#000';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('\u263D', cx, cy);
          ctx.fillStyle = COLORS.MOON;
          ctx.font = '10px sans-serif';
          ctx.fillText('\u25C0', cx - 22, cy);
        } else if (cell === CELL.SUN_RECEPTOR) {
          const sunLit = dayResults.lit.some(r => r.x === x && r.y === y);
          ctx.strokeStyle = sunLit ? COLORS.SUN : '#554400';
          ctx.lineWidth = sunLit ? 2.5 : 1.5;
          ctx.shadowColor = sunLit ? COLORS.SUN : 'transparent';
          ctx.shadowBlur = sunLit ? 10 + Math.sin(now * 3) * 4 : 0;
          ctx.strokeRect(px + 4, py + 4, this.cellSize - 8, this.cellSize - 8);
          ctx.shadowBlur = 0;
          ctx.fillStyle = sunLit ? COLORS.SUN : '#332200';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('\u25C9', cx, cy);
        } else if (cell === CELL.MOON_RECEPTOR) {
          const moonLit = nightResults.lit.some(r => r.x === x && r.y === y);
          ctx.strokeStyle = moonLit ? COLORS.MOON : '#002244';
          ctx.lineWidth = moonLit ? 2.5 : 1.5;
          ctx.shadowColor = moonLit ? COLORS.MOON : 'transparent';
          ctx.shadowBlur = moonLit ? 10 + Math.sin(now * 3) * 4 : 0;
          ctx.strokeRect(px + 4, py + 4, this.cellSize - 8, this.cellSize - 8);
          ctx.shadowBlur = 0;
          ctx.fillStyle = moonLit ? COLORS.MOON : '#001122';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('\u25CE', cx, cy);
        }
      }
    }

    for (const result of activeResults.paths) {
      if (result.path.length === 0) continue;
      const clr = game.isDay ? [255, 215, 0] : [74, 144, 217];
      const points = result.path.map(p => ({
        x: p.x * this.cellSize + this.cellSize / 2,
        y: p.y * this.cellSize + this.cellSize / 2
      }));

      // Soft glow beneath
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = `rgba(${clr[0]},${clr[1]},${clr[2]},0.08)`;
      ctx.lineWidth = 18;
      ctx.stroke();

      // Animated dashed beam
      ctx.save();
      ctx.setLineDash([6, 10]);
      ctx.lineDashOffset = -now * 60;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = `rgba(${clr[0]},${clr[1]},${clr[2]},0.7)`;
      ctx.lineWidth = 3;
      ctx.shadowColor = `rgb(${clr[0]},${clr[1]},${clr[2]})`;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // Light pulses along beam
      const speed = 50;
      const offset = (now * speed) % (points.length * 20);
      const pulseIdx = Math.floor(offset / 20);
      for (let p = Math.max(0, pulseIdx - 1); p <= Math.min(points.length - 1, pulseIdx + 1); p++) {
        const alpha = 1 - Math.abs(p - pulseIdx) * 0.4;
        ctx.fillStyle = `rgba(${clr[0]},${clr[1]},${clr[2]},${alpha * 0.5})`;
        ctx.shadowColor = `rgb(${clr[0]},${clr[1]},${clr[2]})`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(points[p].x, points[p].y, 5 + alpha * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Emit particles at collision points
      if (this.particles && result.hitReceptor) {
        const last = points[points.length - 1];
        this.particles.emit(last.x, last.y, 1, {
          speed: 20, life: 0.4, size: 2,
          color: game.isDay ? COLORS.SUN : COLORS.MOON,
          vx: 0, vy: 0
        });
      }
    }

    // Update game particles
    if (this.particles && !game.paused) {
      this.particles.update(dt);
      this.particles.draw(ctx);
    }

    return { dayLit, nightLit, bothLit };
  }
}
