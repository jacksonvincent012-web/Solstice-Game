import Game from './game.js';
import { Renderer } from './renderer.js';
import InputManager from './input.js';
import Terminal from './terminal.js';
import LevelEditor from './editor.js';
import { ParticleSystem } from './particles.js';
import { LEVELS } from './levels.js';
import { playPlace, playRemove, playToggle, playWin, playReceptor } from './audio.js';
import { GRID_SIZE, CANVAS_SIZE } from './constants.js';

const game = new Game();
const canvas = document.getElementById('grid');
const particles = new ParticleSystem();
const renderer = new Renderer(canvas, particles);
const input = new InputManager(canvas, game, renderer);
const terminal = new Terminal(document.getElementById('terminal-overlay'));
const editor = new LevelEditor(document.getElementById('editor-container'), game, renderer);

// Intro screen
const introOverlay = document.getElementById('intro-overlay');
const introCanvas = document.getElementById('intro-canvas');
const introCtx = introCanvas.getContext('2d');
const introParticles = new ParticleSystem();
let introDone = false;

function resizeIntroCanvas() {
  introCanvas.width = window.innerWidth;
  introCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeIntroCanvas);
resizeIntroCanvas();

// Emit ambient particles for intro
for (let i = 0; i < 40; i++) {
  introParticles.particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 15,
    vy: (Math.random() - 0.5) * 15,
    life: 2 + Math.random() * 2,
    maxLife: 4,
    color: ['#ffd700', '#4a90d9', '#7b68ee'][Math.floor(Math.random() * 3)],
    size: 1.5 + Math.random() * 2,
    alive: true,
    alpha: 1,
    radius: 2,
    update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt; if (this.life <= 0) this.alive = false; }
  });
}

function introLoop() {
  if (introDone) return;
  const dt = 0.016;
  introCtx.clearRect(0, 0, introCanvas.width, introCanvas.height);

  // Replenish particles
  if (introParticles.count < 30) {
    introParticles.emit(
      Math.random() * introCanvas.width,
      Math.random() * introCanvas.height,
      2,
      { speed: 10, life: 3, size: 2, color: ['#ffd700', '#4a90d9', '#7b68ee'][Math.floor(Math.random() * 3)] }
    );
  }

  introParticles.update(dt);
  introParticles.draw(introCtx);
  requestAnimationFrame(introLoop);
}

document.getElementById('intro-start').addEventListener('click', () => {
  introOverlay.classList.add('fade-out');
  setTimeout(() => {
    introOverlay.classList.add('hidden');
    introDone = true;
    game.loadLevel(game.levelId);
    updateUI();
  }, 800);
});

introLoop();

let prevDayLit = false;
let prevNightLit = false;

input.onPlace = (x, y, wasEmpty) => {
  playPlace();
  if (wasEmpty && particles) {
    const px = x * (CANVAS_SIZE / GRID_SIZE) + (CANVAS_SIZE / GRID_SIZE) / 2;
    const py = y * (CANVAS_SIZE / GRID_SIZE) + (CANVAS_SIZE / GRID_SIZE) / 2;
    particles.burst(px, py, { color: '#8888bb', life: 0.4, speed: 50 });
  }
};
input.onRemove = (x, y) => {
  playRemove();
  if (particles) {
    const px = x * (CANVAS_SIZE / GRID_SIZE) + (CANVAS_SIZE / GRID_SIZE) / 2;
    const py = y * (CANVAS_SIZE / GRID_SIZE) + (CANVAS_SIZE / GRID_SIZE) / 2;
    particles.burst(px, py, { color: '#ff6b35', life: 0.3, speed: 40 });
  }
};

terminal.onClose = () => {
  terminal.close();
  game.paused = false;
  game.loadLevel(1);
  updateUI();
};

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
  if (level) {
    levelName.textContent = `Level ${level.id}: ${level.name}`;
    levelSub.textContent = level.subtitle;
  }

  levelSelect.innerHTML = '';
  LEVELS.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = `${l.id}. ${l.name}`;
    opt.disabled = l.id > 1 && !game.solved.has(l.id - 1) && l.id !== game.levelId;
    if (l.id === game.levelId) opt.selected = true;
    levelSelect.appendChild(opt);
  });

  const dayLit = prevDayLit;
  const nightLit = prevNightLit;
  const bothLit = dayLit && nightLit;

  toggleBtn.classList.toggle('pulse', (dayLit || nightLit) && !bothLit && !game.hasWon);

  if (game.hasWon) {
    statusEl.textContent = '\u2726 LEVEL COMPLETE \u2726';
    statusEl.className = 'success';
  } else if (bothLit) {
    statusEl.textContent = '\u2726 All receptors lit!';
    statusEl.className = 'success';
  } else if (game.isDay) {
    statusEl.textContent = dayLit ? '\u2726 SUN lit! Toggle to MOON.' : 'Route SUN \u2600 to the golden receptor \u25C9';
    statusEl.className = '';
  } else {
    statusEl.textContent = nightLit ? '\u2726 MOON lit! Toggle to SUN.' : 'Route MOON \u263D to the blue receptor \u25CE';
    statusEl.className = '';
  }
}

function gameLoop() {
  if (!game.paused && !introDone) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (!game.paused) {
    const result = renderer.draw(game, input.hoverCell);

    if (result.dayLit && !prevDayLit) playReceptor();
    if (result.nightLit && !prevNightLit) playReceptor();

    prevDayLit = result.dayLit;
    prevNightLit = result.nightLit;

    if (result.bothLit && !game.hasWon) {
      game.hasWon = true;
      playWin();

      // Win celebration particles
      const cs = CANVAS_SIZE / GRID_SIZE;
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const x = Math.random() * CANVAS_SIZE;
          const y = Math.random() * CANVAS_SIZE;
          particles.burst(x, y, {
            color: ['#ffd700', '#4a90d9', '#ff6b35', '#7b68ee', '#00ff88'][Math.floor(Math.random() * 5)],
            life: 1.0, speed: 100, spread: Math.PI * 2
          });
        }, i * 150);
      }

      const next = game.unlockNext();
      setTimeout(() => {
        if (next <= LEVELS.length) {
          if (confirm(`Level ${game.levelId} complete! Load Level ${next}?`)) {
            game.loadLevel(next);
            updateUI();
          } else {
            terminal.open();
          }
        } else {
          terminal.open();
        }
        updateUI();
      }, 800);
    }
  }

  updateUI();
  requestAnimationFrame(gameLoop);
}

// Event listeners
document.getElementById('toggle-btn').addEventListener('click', () => {
  if (game.hasWon || game.paused) return;
  game.toggleDay();
  playToggle();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  game.resetLevel();
  updateUI();
});

document.getElementById('editor-btn').addEventListener('click', () => {
  editor.toggle();
});

document.getElementById('level-select').addEventListener('change', (e) => {
  const id = parseInt(e.target.value);
  game.loadLevel(id);
  updateUI();
});

document.getElementById('help-btn').addEventListener('click', () => {
  document.getElementById('help-modal').classList.add('visible');
});
document.getElementById('help-close').addEventListener('click', () => {
  document.getElementById('help-modal').classList.remove('visible');
});
document.getElementById('help-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('help-modal'))
    document.getElementById('help-modal').classList.remove('visible');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 't' || e.key === 'T') {
    if (game.hasWon || game.paused) return;
    game.toggleDay(); playToggle(); updateUI();
  }
  if (e.key === 'r' || e.key === 'R') { game.resetLevel(); updateUI(); }
  if (e.key === 'Escape') {
    document.getElementById('help-modal').classList.remove('visible');
    if (terminal.isOpen) terminal.close();
    if (editor.active) editor.hide();
  }
});

// API key modal
const apiModal = document.getElementById('api-key-modal');
const apiInput = document.getElementById('api-key-input');
if (localStorage.getItem('gemini_api_key')) {
  apiModal.classList.remove('visible');
} else {
  apiModal.classList.add('visible');
}
document.getElementById('api-key-submit').addEventListener('click', () => {
  const key = apiInput.value.trim();
  if (key) {
    localStorage.setItem('gemini_api_key', key);
    terminal.geminiKey = key;
    apiModal.classList.remove('visible');
  }
});
document.getElementById('api-key-skip').addEventListener('click', () => {
  localStorage.setItem('gemini_api_key', '');
  apiModal.classList.remove('visible');
});

// Remove duplicate CSS block for api-key-settings-btn if it exists
// (moved to earlier in main.css to avoid duplication)

updateUI();
gameLoop();
