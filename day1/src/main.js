import Game from './game.js';
import { Renderer } from './renderer.js';
import InputManager from './input.js';

const game = new Game();
const canvas = document.getElementById('grid');
const renderer = new Renderer(canvas);
const input = new InputManager(canvas, game);

function updateUI() {
  const statusEl = document.getElementById('status');
  const mirrorCount = document.getElementById('mirror-count');
  if (mirrorCount) mirrorCount.textContent = 'Mirrors: ' + game.mirrorCount;

  const result = renderer.draw(game.grid, input.hoverCell);

  if (game.hasWon) {
    statusEl.textContent = '\u2726 LEVEL COMPLETE \u2726';
    statusEl.className = 'success';
  } else if (result.lit) {
    statusEl.textContent = '\u2726 Receptor lit!';
    statusEl.className = 'success';
  } else {
    statusEl.textContent = 'Route the light to the receptor';
    statusEl.className = '';
  }
}

function gameLoop() {
  updateUI();
  requestAnimationFrame(gameLoop);
}

document.getElementById('reset-btn').addEventListener('click', () => {
  game.resetLevel();
});

gameLoop();
