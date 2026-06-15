import Game, { BEGINNER_IDS, BASIC_IDS, AVERAGE_IDS, EXPERT_IDS, MASTER_IDS, GRANDMASTER_IDS, GREAT_GRANDMASTER_IDS, getTierName } from './game.js';
import { Renderer } from './renderer.js';
import InputManager from './input.js';
import Terminal from './terminal.js';
import LevelEditor from './editor.js';
import DemoPlayer from './demo.js';
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
const demo = new DemoPlayer(canvas, game, renderer);

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
    if (!localStorage.getItem('solstice_demo_done')) {
      demo.playLevel1(() => {
        localStorage.setItem('solstice_demo_done', '1');
        game.paused = false;
        updateUI();
      });
    }
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

function buildLevelOpts(ids, label, unlocked) {
  const frag = document.createDocumentFragment();
  if (!unlocked) return frag;
  const group = document.createElement('optgroup');
  group.label = label;
  ids.forEach(id => {
    const level = LEVELS.find(l => l.id === id);
    if (!level) return;
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${id}. ${level.name}`;
    opt.disabled = !game.isLevelAccessible(id) && id !== game.levelId;
    if (id === game.levelId) opt.selected = true;
    group.appendChild(opt);
  });
  frag.appendChild(group);
  return frag;
}

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
    const prefix = getTierName(level.id);
    levelName.textContent = `${prefix} ${level.id}: ${level.name}`;
    levelSub.textContent = level.subtitle;
  }

  levelSelect.innerHTML = '';
  const append = (ids, label, unlocked) => {
    const frag = buildLevelOpts(ids, label, unlocked);
    if (frag.hasChildNodes()) levelSelect.appendChild(frag);
  };
  append(BEGINNER_IDS, 'BEGINNER', true);
  append(BASIC_IDS, 'BASIC', true);
  append(AVERAGE_IDS, 'AVERAGE', true);
  append(EXPERT_IDS, 'EXPERT', true);
  append(MASTER_IDS, 'MASTER', game.masterUnlocked);
  append(GRANDMASTER_IDS, 'GRAND MASTER', game.grandmasterUnlocked);
  append(GREAT_GRANDMASTER_IDS, 'GREAT GRAND MASTER', game.greatGrandmasterUnlocked);

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
  if (!introDone) {
    requestAnimationFrame(gameLoop);
    return;
  }

  if (!game.paused || demo.active) {
    const result = renderer.draw(game, demo.active ? null : input.hoverCell);
    if (demo.active) { updateUI(); requestAnimationFrame(gameLoop); return; }

    if (result.dayLit && !prevDayLit) playReceptor();
    if (result.nightLit && !prevNightLit) playReceptor();

    prevDayLit = result.dayLit;
    prevNightLit = result.nightLit;

    if (result.bothLit && !game.hasWon) {
      game.hasWon = true;
      game.paused = true;
      playWin();

      // Win celebration particles
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
      setTimeout(() => showWinModal(next), 600);
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

document.getElementById('settings-btn').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.add('visible');
});
document.getElementById('settings-close').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.remove('visible');
});
document.getElementById('settings-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('settings-modal'))
    document.getElementById('settings-modal').classList.remove('visible');
});
document.getElementById('sound-toggle').addEventListener('change', (e) => {
  localStorage.setItem('solstice_sound', e.target.checked ? '1' : '0');
});
const soundToggle = document.getElementById('sound-toggle');
if (localStorage.getItem('solstice_sound') === '0') soundToggle.checked = false;

// Win flow
function showMasterUnlock() {
  const modal = document.getElementById('win-modal');
  modal.classList.remove('visible');
  game.masterUnlocked = true;
  game.saveProgress();
  const unlock = document.getElementById('master-unlock-modal');
  unlock.classList.add('visible');
}

document.getElementById('master-unlock-close').addEventListener('click', () => {
  document.getElementById('master-unlock-modal').classList.remove('visible');
  const next = game.levelId + 1;
  const nextLevel = LEVELS.find(l => l.id === next);
  if (nextLevel) {
    game.loadLevel(next);
    game.paused = false;
  } else {
    window.location.hash = '';
    game.loadLevel(1);
    game.paused = false;
  }
  updateUI();
});
document.getElementById('master-unlock-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('master-unlock-modal'))
    document.getElementById('master-unlock-modal').click();
});

function showGrandmasterUnlock() {
  const modal = document.getElementById('win-modal');
  modal.classList.remove('visible');
  const gmModal = document.getElementById('grandmaster-loading-modal');
  gmModal.classList.add('visible');
  let remaining = 30;
  const countEl = document.getElementById('gm-countdown');
  const progressEl = document.getElementById('gm-progress');
  countEl.textContent = remaining;
  const interval = setInterval(() => {
    remaining--;
    countEl.textContent = remaining;
    progressEl.style.width = ((30 - remaining) / 30 * 100) + '%';
    if (remaining <= 0) {
      clearInterval(interval);
      gmModal.classList.remove('visible');
      game.grandmasterUnlocked = true;
      game.saveProgress();
      const reveal = document.getElementById('grandmaster-reveal-modal');
      reveal.classList.add('visible');
    }
  }, 1000);
}

document.getElementById('gm-reveal-close').addEventListener('click', () => {
  document.getElementById('grandmaster-reveal-modal').classList.remove('visible');
  game.loadLevel(17);
  game.paused = false;
  updateUI();
});
document.getElementById('grandmaster-reveal-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('grandmaster-reveal-modal'))
    document.getElementById('grandmaster-reveal-modal').click();
});

function showGreatGrandmasterUnlock() {
  const modal = document.getElementById('win-modal');
  modal.classList.remove('visible');
  game.greatGrandmasterUnlocked = true;
  game.saveProgress();
  document.getElementById('great-grandmaster-reveal-modal').classList.add('visible');
}

document.getElementById('ggm-reveal-close').addEventListener('click', () => {
  document.getElementById('great-grandmaster-reveal-modal').classList.remove('visible');
  game.loadLevel(18);
  game.paused = false;
  updateUI();
});
document.getElementById('great-grandmaster-reveal-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('great-grandmaster-reveal-modal'))
    document.getElementById('great-grandmaster-reveal-modal').click();
});

function showGeniusScreen() {
  const modal = document.getElementById('win-modal');
  modal.classList.remove('visible');
  document.getElementById('genius-modal').classList.add('visible');
}

document.getElementById('genius-close').addEventListener('click', () => {
  document.getElementById('genius-modal').classList.remove('visible');
  game.loadLevel(1);
  game.paused = false;
  updateUI();
});
document.getElementById('genius-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('genius-modal'))
    document.getElementById('genius-modal').click();
});

function showWinModal(next) {
  if (game.levelId === 10 && game.allPreMasterSolved()) {
    showMasterUnlock();
    return;
  }
  if (game.levelId === 16 && game.allMasterSolved()) {
    showGrandmasterUnlock();
    return;
  }
  if (game.levelId === 17) {
    showGreatGrandmasterUnlock();
    return;
  }
  if (game.levelId === 18) {
    showGeniusScreen();
    return;
  }

  const modal = document.getElementById('win-modal');
  const title = document.getElementById('win-title');
  const sub = document.getElementById('win-sub');
  const mirrorsEl = document.getElementById('win-mirrors');
  const parEl = document.getElementById('win-par');
  const starsEl = document.getElementById('win-stars');
  const nextBtn = document.getElementById('win-next');

  title.textContent = 'LEVEL ' + game.levelId + ' COMPLETE';
  sub.textContent = 'You routed the light to both receptors';
  mirrorsEl.textContent = 'Mirrors used: ' + game.mirrorCount;

  const par = game.getPar();
  const stars = game.getStars();
  parEl.textContent = 'Par: ' + par;
  starsEl.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    span.textContent = '\u2605';
    span.className = i < stars ? 'star filled' : 'star empty';
    starsEl.appendChild(span);
  }

  const level = LEVELS.find(l => l.id === game.levelId);
  const nextLevel = LEVELS.find(l => l.id === next);
  if (nextLevel) {
    nextBtn.textContent = 'NEXT: ' + nextLevel.name.toUpperCase();
    nextBtn.style.display = '';
  } else {
    nextBtn.textContent = 'VIEW TERMINAL';
    nextBtn.style.display = '';
  }

  modal.classList.add('visible');
}

document.getElementById('win-next').addEventListener('click', () => {
  const modal = document.getElementById('win-modal');
  modal.classList.remove('visible');
  const next = game.levelId + 1;
  const nextLevel = LEVELS.find(l => l.id === next);
  if (nextLevel) {
    game.loadLevel(next);
    game.paused = false;
  } else {
    terminal.open();
  }
  updateUI();
});

document.getElementById('win-restart').addEventListener('click', () => {
  document.getElementById('win-modal').classList.remove('visible');
  game.paused = false;
  game.resetLevel();
  updateUI();
});

document.getElementById('win-terminal').addEventListener('click', () => {
  document.getElementById('win-modal').classList.remove('visible');
  terminal.open();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 't' || e.key === 'T') {
    if (game.hasWon || game.paused) return;
    game.toggleDay(); playToggle(); updateUI();
  }
  if (e.key === 'r' || e.key === 'R') { game.resetLevel(); updateUI(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    if (game.undo()) { renderer.dirty = true; updateUI(); }
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' && e.shiftKey || e.key === 'Z' && e.shiftKey || e.key === 'y')) {
    e.preventDefault();
    if (game.redo()) { renderer.dirty = true; updateUI(); }
  }
  if (e.key === 'Escape') {
    document.getElementById('help-modal').classList.remove('visible');
    document.getElementById('win-modal').classList.remove('visible');
    document.getElementById('settings-modal').classList.remove('visible');
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
