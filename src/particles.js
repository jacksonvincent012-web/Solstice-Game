export class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.life = life; this.maxLife = life;
    this.color = color; this.size = size;
    this.alive = true;
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.alive = false;
  }
  get alpha() { return Math.max(0, this.life / this.maxLife); }
  get radius() { return this.size * (0.3 + 0.7 * this.alpha); }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }
  emit(x, y, count, opts = {}) {
    const {
      speed = 60, spread = Math.PI * 2, life = 0.8,
      color = '#ffd700', size = 3, vx = 0, vy = 0
    } = opts;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * spread - spread / 2 - Math.PI / 2;
      const s = speed * (0.5 + Math.random());
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * s + vx,
        Math.sin(angle) * s + vy,
        life * (0.5 + Math.random() * 0.5),
        color, size * (0.5 + Math.random() * 0.5)
      ));
    }
  }
  burst(x, y, opts = {}) {
    this.emit(x, y, 30, { spread: Math.PI * 2, speed: 80, life: 0.6, ...opts });
  }
  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (!this.particles[i].alive) this.particles.splice(i, 1);
    }
  }
  draw(ctx) {
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.size * 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  get count() { return this.particles.length; }
}
