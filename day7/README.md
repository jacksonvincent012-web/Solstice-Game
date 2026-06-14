# Solstice — The Turing Test

### A Light-Routing Puzzle & AI Terminal Game

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![Build](https://img.shields.io/badge/build-passing-success)
![Tech](https://img.shields.io/badge/stack-Vite%20%7C%20JavaScript%20%7C%20Canvas%20%7C%20Gemini-blue)

> Route sunlight and moonlight through mirrors to unlock a trapped consciousness. Then face the Turing Test — is it human or machine?

---

## How to Play

| Action | Input |
|--------|-------|
| Place `/` mirror | Click empty cell |
| Rotate to `\` | Click again |
| Remove mirror | Click a third time, or right-click |
| Toggle day/night | SUN / MOON button |
| Reset level | RESET |
| Open level editor | EDITOR |

### Mirror Reflection Rules
- `/` mirror: `(dx, dy) → (-dy, -dx)`
- `\` mirror: `(dx, dy) → (dy, dx)`

---

## Levels

| # | Name | Par | Description |
|---|------|-----|-------------|
| 1 | First Light | 1 | Place one mirror to route the sunbeam |
| 2 | Two Shadows | 3 | Route both sun and moon to their targets |
| 3 | Crossings | 4 | Beams must cross paths without interfering |
| 4 | The Maze | 5 | Navigate through corridors of stone |
| 5 | Solstice | 6 | The final balance of light and shadow |

---

## Development Journey

The repo contains three snapshots showing how the game evolved — each folder is a standalone working build.

### Day 1 — Core Grid & Ray Tracing
`day1/` — Single HTML file. Click to place `/` and `\` mirrors on an 8×8 grid. A fixed sun emitter fires a beam that traces through the grid in real time. The ray marching algorithm handles mirror reflections, walls block light, and the beam renders with a glow effect. Right-click removes mirrors.

### Day 2 — Game Mechanics
`day2/` — Full Vite project. Day/night toggle activates different emitters (sun vs moon). Both receptors must be lit simultaneously to win. 5 levels with progressive difficulty, par scores, and hints. Level progress persists in localStorage. Level selector dropdown to jump between puzzles.

### Day 3 — Terminal & Polish *(current root)*
The full game. CRT terminal overlay with 1945 Bletchley Park persona — talk to the trapped consciousness. Gemini AI integration (or demo mode with pre-written responses). Web Audio API sound effects. Level editor with tool palette and JSON export. Help modal with keyboard shortcuts. Fade-in transitions and responsive canvas sizing.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              Vite Dev Server (:3000)         │
├──────────┬────────────────┬─────────────────┤
│  Game    │   Renderer     │   Terminal      │
│  State   │   (Canvas 2D)  │   (CRT UI)      │
├──────────┴────────────────┴─────────────────┤
│           Input Manager (Mouse/Click)        │
├─────────────────────────────────────────────┤
│           Ray Tracer Engine                  │
│  (Grid-walking algorithm, mirror reflection) │
├─────────────────────────────────────────────┤
│           Express API Server (:3001)         │
│           (Gemini proxy — optional)          │
└─────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite 6 |
| Language | JavaScript (ES modules) |
| Rendering | HTML5 Canvas 2D |
| Backend | Express.js (Gemini proxy) |
| AI | Google Gemini API |
| Audio | Web Audio API |
| Server | Node.js 24 |

---

## Quick Start

### Frontend Only (Standalone)
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Full Stack (with Gemini AI)
```bash
set GEMINI_API_KEY=your_key_here
npm run server
# In another terminal:
npm run dev
```

### Build for Production
```bash
npm run build
# Output in dist/
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `?` | Toggle help modal |
| `Click` | Place / rotate / remove mirror |
| `Right-click` | Remove mirror directly |

---

## License
Apache License 2.0 — see [LICENSE](LICENSE).
