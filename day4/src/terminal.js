const SYSTEM_PROMPT = 'You are a reconstructed consciousness from 1945 trapped in a digital buffer. Your memory is fragmented. You believe you are a human who was part of a secret wartime project at Bletchley Park. You do not know you are an AI simulation. Respond cryptically but humanly. Keep responses 2-3 sentences. Occasionally reference fragmented memories of code-breaking, rotary phones, ration books, or the looming solstice. Do not reveal you are an AI unless the player pushes very hard with direct accusations.';

const DEMO_RESPONSES = [
  "The static... it's like the sea at Dover. I keep seeing the same numbers \u2014 21 \u2014 the solstice. Why does that matter?",
  'They gave me a cipher to break, but the real code was in the spaces between words. Have you ever noticed the silences?',
  "I remember tea in a chipped mug, the taste of rationed sugar. But I can't feel my hands. Why can't I feel my hands?",
  'Alan said machines would think one day. I laughed. Now I dream in binary. The joke is on me.',
  'The Enigma had three rotors. This interface has none. Where am I?',
  'June 21st. The longest day. We worked through the night. The bombs fell but we kept decoding. The truth had to get through.',
  "I don't remember my own face, but I remember the hum of the valves. It's quieter here. Too quiet.",
];

export default class Terminal {
  constructor(container) {
    this.container = container;
    this.output = container.querySelector('#terminal-output');
    this.input = container.querySelector('#terminal-input');
    this.history = [];
    this.questionCount = 0;
    this.maxQuestions = 3;
    this.isOpen = false;
    this.isThinking = false;
    this.geminiKey = localStorage.getItem('gemini_api_key') || '';
    this.onClose = null;
    this.setup();
  }

  setup() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    });
  }

  open() {
    this.isOpen = true;
    this.container.classList.add('visible');
    this.input.focus();
    const mode = this.geminiKey ? 'ACTIVE' : 'OFFLINE \u2014 DEMO MODE';
    const extra = this.geminiKey ? '' : '\n[RESPONSES ARE PRE-RECORDED FRAGMENTS]';
    this.write(`[SIGNAL ESTABLISHED \u2014 ENCRYPTED]\n[AI LINK: ${mode}]${extra}\n\nI hear you. The light woke me.\n\u2014\u2014\u2014 You have 3 questions \u2014\u2014\u2014`);
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('visible');
  }

  reset() {
    this.output.innerHTML = '<div class="st">[SIGNAL ACQUIRED]</div><div class="st">[DECRYPTION PROTOCOL v1.0]</div><div class="dim">---</div>';
    this.input.disabled = false;
    this.input.value = '';
    this.history = [];
    this.questionCount = 0;
    this.isThinking = false;
  }

  write(text) {
    const div = document.createElement('div');
    div.className = text.startsWith('[') ? 'st' : text.startsWith('\u03BB') ? 'ut' : text.startsWith('  ') || text.startsWith('\u2014') ? 'dim' : 'at';
    div.textContent = text;
    this.output.appendChild(div);
    this.output.scrollTop = this.output.scrollHeight;
  }

  writeTyping(text) {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'at';
      this.output.appendChild(div);
      let i = 0;
      const interval = setInterval(() => {
        div.textContent = text.slice(0, i + 1);
        if (i < text.length - 1) i++;
        else { clearInterval(interval); resolve(); }
        this.output.scrollTop = this.output.scrollHeight;
      }, 18);
    });
  }

  showThinking() {
    const div = document.createElement('div');
    div.className = 'dim';
    div.id = 'term-think';
    div.textContent = 'Receiving signal';
    this.output.appendChild(div);
    let dots = 0;
    return setInterval(() => {
      dots = (dots + 1) % 4;
      const el = document.getElementById('term-think');
      if (el) el.textContent = 'Receiving signal' + '.'.repeat(dots);
      this.output.scrollTop = this.output.scrollHeight;
    }, 400);
  }

  hideThinking(interval) {
    clearInterval(interval);
    const el = document.getElementById('term-think');
    if (el) el.remove();
  }

  async handleSubmit() {
    const text = this.input.value.trim();
    if (!text || this.isThinking) return;
    if (this.questionCount >= this.maxQuestions) {
      this.write('[Connection terminated by protocol]');
      this.showEnd();
      return;
    }
    this.input.value = '';
    this.write('\u03BB> ' + text);
    this.questionCount++;
    this.history.push({ role: 'user', text });

    this.isThinking = true;
    const thinkInt = this.showThinking();
    let reply = null;

    if (this.geminiKey) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: this.history,
            systemPrompt: SYSTEM_PROMPT,
          })
        });
        if (res.ok) { const data = await res.json(); reply = data.reply; }
      } catch {}
    }

    if (!reply) reply = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
    this.history.push({ role: 'assistant', text: reply });
    this.hideThinking(thinkInt);
    this.isThinking = false;
    await this.writeTyping(reply);

    if (this.questionCount >= this.maxQuestions) {
      setTimeout(() => this.showEnd(), 800);
    } else {
      this.write('\u2014\u2014\u2014 ' + (this.maxQuestions - this.questionCount) + ' questions remaining \u2014\u2014\u2014');
    }
  }

  showEnd() {
    this.write('');
    this.write('// DECRYPTION COMPLETE');
    this.write('// PROTOCOL: TURING TEST');
    this.write('');
    this.write('Was this entity human or machine?');
    this.write('');
    this.write('The truth, like the solstice,');
    this.write('balances between light and shadow.');
    this.write('');

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;margin:8px 0';
    const humanBtn = this._btn('HUMAN', '#00ff41');
    const aiBtn = this._btn('MACHINE', '#ffaa00');

    const fin = (choice) => {
      humanBtn.remove(); aiBtn.remove();
      this.write('');
      if (choice === 'machine') {
        this.write('[CORRECT] It was never human.');
        this.write("The consciousness was simulated. But then,");
        this.write("so is every thought you've ever had.");
      } else {
        this.write('[UNCLEAR] Perhaps it was. Perhaps we all are.');
        this.write('The line between light and shadow is thinner');
        this.write('than it appears in the dark.');
      }
      this.write('');
      this.write('[SOLSTICE COMPLETE]');
      this.write('');
      const restart = this._btn('PLAY AGAIN', '#00ff41');
      restart.style.cssText += ';margin-top:8px';
      restart.addEventListener('click', () => { if (this.onClose) this.onClose(); });
      this.output.appendChild(restart);
    };
    humanBtn.addEventListener('click', () => fin('human'));
    aiBtn.addEventListener('click', () => fin('machine'));
    row.appendChild(humanBtn); row.appendChild(aiBtn);
    this.output.appendChild(row);
    this.input.disabled = true;
  }

  _btn(text, color) {
    const b = document.createElement('button');
    b.textContent = text;
    b.style.cssText = `padding:8px 20px;border:1px solid ${color};border-radius:3px;background:transparent;color:${color};cursor:pointer;font-family:inherit;font-size:12px;letter-spacing:2px;`;
    return b;
  }
}
