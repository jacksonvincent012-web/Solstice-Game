import { GRID_SIZE, CANVAS_SIZE } from './constants.js';

export default class InputManager {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.hoverCell = null;
    this.onPlace = null;
    this.onRemove = null;
    this.setup();
  }

  getGridPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scale = CANVAS_SIZE / rect.width;
    const mx = (e.clientX - rect.left) * scale;
    const my = (e.clientY - rect.top) * scale;
    return {
      x: Math.floor(mx / (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(my / (CANVAS_SIZE / GRID_SIZE))
    };
  }

  setup() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.game.hasWon) { this.hoverCell = null; return; }
      const { x, y } = this.getGridPos(e);
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && this.game.isCellPlayable(x, y))
        this.hoverCell = { x, y };
      else
        this.hoverCell = null;
    });

    this.canvas.addEventListener('mouseleave', () => { this.hoverCell = null; });

    this.canvas.addEventListener('click', (e) => {
      if (this.game.hasWon) return;
      const { x, y } = this.getGridPos(e);
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
      if (!this.game.isCellPlayable(x, y)) return;
      this.game.placeMirror(x, y);
      if (this.onPlace) this.onPlace(x, y);
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.game.hasWon) return;
      const { x, y } = this.getGridPos(e);
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
      const cell = this.game.grid[y][x];
      if (cell === 1 || cell === 2) {
        this.game.removeMirror(x, y);
        if (this.onRemove) this.onRemove(x, y);
      }
    });
  }
}
