let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function soundEnabled() {
  return localStorage.getItem('solstice_sound') !== '0';
}

function playTone(freq, duration, type = 'sine', volume = 0.08) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch { /* silent */ }
}

export function playPlace() {
  if (!soundEnabled()) return;
  playTone(600, 0.08, 'sine', 0.06);
}

export function playRemove() {
  if (!soundEnabled()) return;
  playTone(300, 0.06, 'sine', 0.05);
}

export function playToggle() {
  if (!soundEnabled()) return;
  playTone(800, 0.1, 'triangle', 0.05);
  setTimeout(() => playTone(1000, 0.1, 'triangle', 0.05), 80);
}

export function playWin() {
  if (!soundEnabled()) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.07), i * 120));
}

export function playReceptor() {
  if (!soundEnabled()) return;
  playTone(880, 0.15, 'sine', 0.06);
}
