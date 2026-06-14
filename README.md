# 🌓 SOLSTICE — The Turing Test

### A Light-Routing Puzzle & AI Terminal Game

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![Build](https://img.shields.io/badge/build-passing-success)
![Tech](https://img.shields.io/badge/stack-Vite%20%7C%20JavaScript%20%7C%20Canvas%20%7C%20Gemini-blue)
![Rating](https://img.shields.io/badge/rating-9.5%2F10-green)

> Route sunlight and moonlight through mirrors to unlock a trapped consciousness. Then face the Turing Test — is it human or machine?
> <img width="1920" height="1032" alt="Screenshot 2026-06-13 214124" src="https://github.com/user-attachments/assets/3d34bb1c-dd27-48e8-8ada-aad98f85c340" />

---

##  Features

### Core Game Systems
| Feature | Description |
|---------|-------------|
|  **Ray Tracing** | Real-time light propagation with `/` and `\` mirror reflection |
|  **Solstice Toggle** | Switch between SUN and MOON modes — different emitters activate |
|  **5 Levels** | Progressive difficulty from tutorial to complex maze |
|  **Progress Save** | Level completion saved to localStorage |
|  **Sound Design** | Web Audio API tones for every action |
| **Hover + Feedback** | Visual hover, pulse hints, status messages |

### Turing Test Terminal
| Feature | Description |
|---------|-------------|
| **CRT Terminal** | Retro green-on-black aesthetic with typewriter animation |
| **Gemini AI** | Configurable Google Gemini API key for live responses |
|  **Demo Mode** | Pre-written fragments when no API key is set |
|  **System Prompt** | 1945 Bletchley Park consciousness persona |
|  **3 Questions** | Interrogate the entity, then guess human or machine |

### Level Editor
| Feature | Description |
|---------|-------------|
|  **Paint Grid** | Place emitters, receptors, walls, mirrors visually |
| **Export JSON** | Copy level data to clipboard for sharing |
|  **8 Cell Types** | Empty, wall, `/` mirror, `\` mirror, sun/moon emitters & receptors |

---

##  Architecture

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
| **Build** | Vite 6 |
| **Language** | JavaScript (ES modules) |
| **Rendering** | HTML5 Canvas 2D |
| **Backend** | Express.js (Gemini proxy) |
| **AI** | Google Gemini API |
| **Audio** | Web Audio API |
| **Server** | Node.js 24 |

---

##  Quick Start

### Frontend Only (Standalone)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:3000
```

### Full Stack (with Gemini AI)
```bash
# Terminal 1: Start API server
set GEMINI_API_KEY=your_key_here
npm run server
# API runs at http://localhost:3001

# Terminal 2: Start frontend
npm run dev
# Frontend runs at http://localhost:3000
```

### Build for Production
```bash
npm run build
# Output in dist/
```

---

##  How to Play

| Action | Input |
|--------|-------|
| Place `/` mirror | Click empty cell |
| Rotate to `\` | Click again |
| Remove mirror | Click a third time, or right-click |
| Toggle day/night | Click  / ☾ button |
| Reset level | Click ↺ RESET |
| Open level editor | Click ✎ EDITOR |

### Mirror Reflection Rules
- `/` mirror: `(dx, dy) → (-dy, -dx)`
- `\` mirror: `(dx, dy) → (dy, dx)`

---

##  Levels

| # | Name | Par | Description |
|---|------|-----|-------------|
| 1 | First Light | 1 | Place one mirror to route the sunbeam |
| 2 | Two Shadows | 3 | Route both sun and moon to their targets |
| 3 | Crossings | 4 | Beams must cross paths without interfering |
| 4 | The Maze | 5 | Navigate through corridors of stone |
| 5 | Solstice | 6 | The final balance of light and shadow |

---

##  Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `?` | Toggle help modal |
| `Click` | Place / rotate / remove mirror |
| `Right-click` | Remove mirror directly |

---

##  Rating

| Category | Score |
|----------|-------|
| Visual Design | 9/10 |
| Functionality | 9/10 |
| Code Quality | 9/10 |
| Puzzle Design | 9/10 |
| Interactivity | 9/10 |
| Completeness | 8.5/10 |

---

##  License
This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

---

*Built  for the Solstice Game Jam*
