import { CELL, CELL_NAMES, GRID_SIZE } from './constants.js';

const CYCLE = [CELL.EMPTY, CELL.WALL, CELL.MIRROR_FWD, CELL.MIRROR_BACK, CELL.SUN_EMITTER, CELL.MOON_EMITTER, CELL.SUN_RECEPTOR, CELL.MOON_RECEPTOR];
const CYCLE_LABELS = CYCLE.map(c => CELL_NAMES[c]);

export default class LevelEditor {
  constructor(container, game, renderer) {
    this.container = container;
    this.game = game;
    this.renderer = renderer;
    this.active = false;
    this.currentTool = CELL.EMPTY;
    this.buttons = [];
    this.setup();
  }

  setup() {
    const panel = document.createElement('div');
    panel.id = 'editor-panel';
    panel.innerHTML = '<div class="ed-title">LEVEL EDITOR</div>';
    const tools = document.createElement('div');
    tools.className = 'ed-tools';
    this.buttons = CYCLE.map((val, i) => {
      const btn = document.createElement('button');
      btn.textContent = CYCLE_LABELS[i];
      btn.className = val === CELL.EMPTY ? 'ed-active' : '';
      btn.addEventListener('click', () => {
        this.currentTool = val;
        this.buttons.forEach(b => b.className = '');
        btn.className = 'ed-active';
      });
      tools.appendChild(btn);
      return btn;
    });
    panel.appendChild(tools);

    const actions = document.createElement('div');
    actions.className = 'ed-actions';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'EXPORT JSON';
    exportBtn.addEventListener('click', () => this.exportLevel());
    actions.appendChild(exportBtn);

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'CLEAR';
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear the entire grid?')) {
        for (let y = 0; y < GRID_SIZE; y++)
          for (let x = 0; x < GRID_SIZE; x++)
            this.game.grid[y][x] = CELL.EMPTY;
      }
    });
    actions.appendChild(clearBtn);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'CLOSE';
    closeBtn.addEventListener('click', () => this.hide());
    actions.appendChild(closeBtn);

    panel.appendChild(actions);
    this.container.appendChild(panel);

    const canvas = document.getElementById('grid');
    this.container.addEventListener('click', (e) => {
      if (!this.active || this.currentTool === CELL.EMPTY) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect) return;
      const scale = 560 / rect.width;
      const mx = (e.clientX - rect.left) * scale;
      const my = (e.clientY - rect.top) * scale;
      const gx = Math.floor(mx / (560 / GRID_SIZE));
      const gy = Math.floor(my / (560 / GRID_SIZE));
      if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) {
        this.game.grid[gy][gx] = this.currentTool;
      }
    });
  }

  show() { this.active = true; this.container.style.display = 'block'; }
  hide() { this.active = false; this.container.style.display = 'none'; }
  toggle() { this.active ? this.hide() : this.show(); }

  exportLevel() {
    const grid = this.game.grid;
    const data = { cells: [] };
    for (let y = 0; y < GRID_SIZE; y++)
      for (let x = 0; x < GRID_SIZE; x++)
        if (grid[y][x] !== CELL.EMPTY)
          data.cells.push({ y, x, type: CELL_NAMES[grid[y][x]] });
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      const status = document.querySelector('#editor-panel .ed-title');
      if (status) { status.textContent = 'COPIED TO CLIPBOARD!'; setTimeout(() => { status.textContent = 'LEVEL EDITOR'; }, 2000); }
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = json;
      document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      ta.remove();
    });
  }
}
