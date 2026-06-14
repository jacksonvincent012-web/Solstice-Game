import Game from './game.js';
import { Renderer } from './renderer.js';
import InputManager from './input.js';
import { LEVELS } from './levels.js';

const game = new Game();
const canvas = document.getElementById('grid');
const renderer = new Renderer(canvas);
const input = new InputManager(canvas, game);

function updateUI() {
  const toggleBtn = document.getElementById('toggle-btn');
  const modeLabel = document.getElementById('mode-label');
  const statusEl = document.getElementById('status');
  const levelName = document.getElementById('level-name');
  const levelSub = document.getElementById('level-subtitle');
  const levelSelect = document.getElementById('level-select');
  const mirrorCount = document.getElementById('mirror-count');
  if (mirrorCount) mirrorCount.textContent = 'Mirrors: ' + game.mirrorCount;

  toggleBtn.textContent = game.isDay ? '\u2600 TOGGLE' : '\u263E TOGGLE';
  toggleBtn.className = game.isDay ? 'day' : 'night';
  modeLabel.innerHTML = game.isDay
    ? '<span class="day-active">SUN</span><span style="color:#333"> / </span><span class="dim">MOON</span>'
    : '<span class="dim">SUN</span><span style="color:#333"> / </span><span class="night-active">MOON</span>';

  const level = LEVELS.find(l => l.id === game.levelId);
  if (level) { levelName.textContent = `Level ${level.id}: ${level.name}`; levelSub.textContent = level.subtitle; }

  levelSelect.innerHTML = '';
  LEVELS.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = `${l.id}. ${l.name}`;
    opt.disabled = l.id > 1 && !game.solved.has(l.id - 1) && l.id !== game.levelId;
    if (l.id === game.levelId) opt.selected = true;
    levelSelect.appendChild(opt);
  });

  result = renderer.draw(game, input.hoverCell);

  if (game.hasWon) {
    statusEl.textContent = '\u2726 LEVEL COMPLETE \u2726';
    statusEl.className = 'success';
  } else if (result.bothLit) {
    statusEl.textContent = '\u2726 All receptors lit!';
    statusEl.className = 'success';
  } else if (game.isDay) {
    statusEl.textContent = result.dayLit ? '\u2726 SUN lit! Toggle to MOON.' : 'Route SUN \u2600 to the golden receptor \u25C9';
    statusEl.className = '';
  } else {
    statusEl.textContent = result.nightLit ? '\u2726 MOON lit! Toggle to SUN.' : 'Route MOON \u263D to the blue receptor \u25CE';
    statusEl.className = '';
  }
}

let result;

function gameLoop() {
  if (!game.paused) {
    result = renderer.draw(game, input.hoverCell);

    if (result.bothLit && !game.hasWon) {
      game.hasWon = true;
      const next = game.unlockNext();
      setTimeout(() => {
        if (next <= LEVELS.length) {
          if (confirm(`Level ${game.levelId} complete! Load Level ${next}?`)) {
            game.loadLevel(next);
          }
        }
        updateUI();
      }, 800);
    }
  }
  updateUI();
  requestAnimationFrame(gameLoop);
}

document.getElementById('toggle-btn').addEventListener('click', () => {
  if (game.hasWon) return;
  game.toggleDay();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  game.resetLevel();
});

document.getElementById('level-select').addEventListener('change', (e) => {
  const id = parseInt(e.target.value);
  game.loadLevel(id);
});

gameLoop();
