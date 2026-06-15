import { GRID_SIZE, CANVAS_SIZE } from './constants.js';

export default class DemoPlayer {
  constructor(canvas, game, renderer) {
    this.canvas = canvas;
    this.game = game;
    this.renderer = renderer;
    this.active = false;
  }

  createOverlay() {
    const el = document.createElement('div');
    el.id = 'demo-hl';
    el.style.cssText = 'position:fixed;pointer-events:none;z-index:55;border:2px solid #00ff88;border-radius:4px;box-shadow:0 0 24px rgba(0,255,136,0.5);opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(el);

    const tip = document.createElement('div');
    tip.id = 'demo-tip';
    tip.style.cssText = 'position:fixed;pointer-events:none;z-index:56;background:rgba(0,0,0,0.92);border:1px solid #00ff88;border-radius:4px;padding:6px 14px;color:#00ff88;font-family:\'Courier New\',monospace;font-size:12px;letter-spacing:1px;white-space:nowrap;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(tip);
    return { el, tip };
  }

  removeOverlay(o) {
    o.el.remove();
    o.tip.remove();
  }

  cellRect(cx, cy) {
    const r = this.canvas.getBoundingClientRect();
    const s = r.width / GRID_SIZE;
    return { left: r.left + cx * s, top: r.top + cy * s, width: s, height: s };
  }

  playLevel1(callback) {
    if (this.active) return;
    this.active = true;
    this.game.paused = true;

    const o = this.createOverlay();
    const cx = 7, cy = 1;

    const pos = () => this.cellRect(cx, cy);

    setTimeout(() => {
      const p = pos();
      o.el.style.left = p.left + 'px';
      o.el.style.top = p.top + 'px';
      o.el.style.width = p.width + 'px';
      o.el.style.height = p.height + 'px';
      o.el.style.opacity = '1';
      o.tip.textContent = '> CLICK A CELL TO PLACE A MIRROR';
      o.tip.style.left = p.left + 'px';
      o.tip.style.top = (p.top - 34) + 'px';
      o.tip.style.opacity = '1';
    }, 400);

    setTimeout(() => {
      this.game.grid[cy][cx] = 2;
      this.game.mirrorCount = 1;
      this.renderer.dirty = true;
    }, 1200);

    setTimeout(() => {
      o.tip.textContent = '> THE BEAM BENDS AND REACHES THE RECEPTOR';
    }, 1800);

    setTimeout(() => {
      this.game.hasWon = true;
      this.renderer.dirty = true;
    }, 2400);

    setTimeout(() => {
      o.tip.textContent = '> NOW YOU TRY!';
    }, 3000);

    setTimeout(() => {
      this.removeOverlay(o);
      this.game.loadLevel(1);
      this.game.paused = false;
      this.active = false;
      if (callback) callback();
    }, 4000);
  }
}
