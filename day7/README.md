# Solstice — The Turing Test

A Light-Routing Puzzle & AI Terminal Game

![Version](https://img.shields.io/badge/version-1.0.0-cyan)
![Build](https://img.shields.io/badge/build-passing-success)
![Tech](https://img.shields.io/badge/stack-Vite%20%7C%20JavaScript%20%7C%20Canvas%20%7C%20Gemini-blue)

> Route sunlight and moonlight through mirrors to unlock a trapped consciousness. Then face the Turing Test — is it human or machine?give it a try to find out
> <img width="1920" height="1032" alt="Screenshot 2026-06-13 214124" src="https://github.com/user-attachments/assets/3d34bb1c-dd27-48e8-8ada-aad98f85c340" />

---

<<<<<<< HEAD
  Features

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
=======
## Development Journey — 7 Days

The repo contains snapshots from each day of development. Every folder is a standalone working build so you can trace the progression.

### Day 1 — Grid & Mirror Placement
`day1/` — Single HTML file. Renders an 8×8 canvas grid with alternating cell colors. Click to cycle cells: empty → `/` → `\` → empty. Right-click to remove a mirror directly. No ray tracing yet — just the visual foundation and the mirror data model.

### Day 2 — Ray Tracing
`day2/` — Adds a fixed sun emitter at position (3,0). The ray marching algorithm steps through grid cells, reflecting direction on `/` (`dx,dy→-dy,-dx`) and `\` (`dx,dy→dy,dx`) mirrors. Walls stop the beam. Beam renders with a golden glow and cells highlight along the path. Status text shows where the beam ends.

### Day 3 — Day & Night Toggle
`day3/` — Introduces the second emitter type (moon) and two receptor types. A toggle button switches between SUN and MOON modes — only the active mode's emitters fire. Both receptors must be lit simultaneously for a win. Gold glow for sun mode, blue glow for moon mode. Win state triggers a visual celebration on mirrors.

### Day 4 — Vite + Multiple Levels
`day4/` — First architectural upgrade from single-file to a Vite project with ES modules. Separate files for constants, ray tracer, game state, renderer, input handling, and level definitions. 5 progressive levels (First Light, Two Shadows, Crossings, The Maze, Solstice) with par scores and hints. Level selector dropdown. Progress persists in localStorage.

### Day 5 — Terminal & Sound
`day5/` — Adds a CRT-style terminal overlay with green-on-black aesthetic, typewriter text animation, and pre-written dialogue responses. The entity speaks in a 1945 Bletchley Park persona — philosophical, introspective, afraid. 7 response categories (greeting, identity, world, accusation, plea, goodbye). Web Audio API sound effects: sine wave tones for mirror placement, toggle, and victory arpeggio.

### Day 6 — Gemini AI Integration
`day6/` — Real AI conversations. An Express server (`server/server.js`) proxies requests to the Google Gemini API. The terminal first tries the API on open; if the server is unreachable it falls back to demo mode. System prompt sets the 1945 consciousness persona. The server requires `GEMINI_API_KEY` environment variable. `npm run server` starts the API on port 3001.

### Day 7 — Editor & Polish *(current root)*
`day7/` — The final build. Level editor overlay with 8-cell palette (empty, wall, `/`, `\`, sun/moon emitters and receptors) and JSON export to clipboard. Hover highlight on canvas cells. Help modal toggled with `?`. Pulse animation on the toggle button. Responsive canvas sizing. Fade-in terminal transition. Game pauses when terminal opens. All polish to make it submission-ready.

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
| Open terminal | TERMINAL or press `T` |
| Close terminal | ESC |
| Help modal | `?` |

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

## Architecture
>>>>>>> 5a2b374 (Add 7-day development journey snapshots)

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

<<<<<<< HEAD
##  Quick Start
=======
## Quick Start
>>>>>>> 5a2b374 (Add 7-day development journey snapshots)

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

<<<<<<< HEAD
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
=======
## Keyboard Shortcuts
>>>>>>> 5a2b374 (Add 7-day development journey snapshots)

| Key | Action |
|-----|--------|
| `?` | Toggle help modal |
| `T` | Open terminal |
| `ESC` | Close terminal |
| `Click` | Place / rotate / remove mirror |
| `Right-click` | Remove mirror directly |

---

<<<<<<< HEAD
##  License
This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

---

*Built  for the Solstice Game Jam*
=======
## License
Apache License 2.0 — see [LICENSE](LICENSE).
>>>>>>> 5a2b374 (Add 7-day development journey snapshots)
