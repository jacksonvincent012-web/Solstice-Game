import { GRID_SIZE, CANVAS_SIZE } from './constants.js';

export default class InputManager {
  constructor(canvas, game, renderer) {
    this.canvas = canvas;
    this.game = game;
    this.renderer = renderer;
    this.hoverCell = null;
    this.onPlace = null;
    this.onRemove = null;
    this.longPressTimer = null;
    this.setup();
  }

  getGridPos(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const scale = CANVAS_SIZE / rect.width;
    const mx = (clientX - rect.left) * scale;
    const my = (clientY - rect.top) * scale;
    return {
      x: Math.floor(mx / (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(my / (CANVAS_SIZE / GRID_SIZE))
    };
  }

  handleClick(clientX, clientY) {
    if (this.game.hasWon || this.game.paused) return;
    const { x, y } = this.getGridPos(clientX, clientY);
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
    if (!this.game.isCellPlayable(x, y)) return;
    const cell = this.game.grid[y][x];
    const wasEmpty = cell === 0;
    this.game.placeMirror(x, y);
    if (this.onPlace) this.onPlace(x, y, wasEmpty);
  }

  handleRightClick(clientX, clientY) {
    if (this.game.hasWon || this.game.paused) return;
    const { x, y } = this.getGridPos(clientX, clientY);
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;
    const cell = this.game.grid[y][x];
    if (cell === 1 || cell === 2) {
      this.game.removeMirror(x, y);
      if (this.onRemove) this.onRemove(x, y);
    }
  }

  setup() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.game.hasWon || this.game.paused) { this.hoverCell = null; return; }
      const { x, y } = this.getGridPos(e.clientX, e.clientY);
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && this.game.isCellPlayable(x, y))
        this.hoverCell = { x, y };
      else
        this.hoverCell = null;
    });

    this.canvas.addEventListener('mouseleave', () => { this.hoverCell = null; });

    this.canvas.addEventListener('click', (e) => {
      this.handleClick(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleRightClick(e.clientX, e.clientY);
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this._touchPos = { x: touch.clientX, y: touch.clientY };
      this._touchStart = Date.now();
      this.longPressTimer = setTimeout(() => {
        if (this._touchPos) this.handleRightClick(this._touchPos.x, this._touchPos.y);
        this._touchPos = null;
      }, 500);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const moved = Math.abs(touch.clientX - this._touchPos.x) > 10 ||
                    Math.abs(touch.clientY - this._touchPos.y) > 10;
      if (moved) {
        clearTimeout(this.longPressTimer);
        this._touchPos = null;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      clearTimeout(this.longPressTimer);
      if (this._touchPos) {
        const elapsed = Date.now() - this._touchStart;
        if (elapsed < 400) this.handleClick(this._touchPos.x, this._touchPos.y);
      }
      this._touchPos = null;
    });

    this.canvas.addEventListener('touchcancel', () => {
      clearTimeout(this.longPressTimer);
      this._touchPos = null;
    });
  }
}
