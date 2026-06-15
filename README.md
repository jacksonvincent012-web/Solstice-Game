# Solstice

**A light-routing puzzle game with a custom ray-tracing engine, dual-spectrum beam physics, 10 graduated levels, a CRT terminal narrative, undo/redo, and a star-based rating system.**

Built with vanilla JavaScript, rendered on HTML Canvas 2D, with audio synthesis via the Web Audio API and optional AI-powered dialogue through Google Gemini. Deployed as a static site on the Netlify CDN.

**[vinny-deploy.netlify.app](https://vinny-deploy.netlify.app)**

---

## Architecture

Each subsystem is a standalone ES module communicating through a central game state, orchestrated by a `requestAnimationFrame` game loop.

### Core Rendering Pipeline

```mermaid
flowchart LR
    subgraph Pipeline[Core Pipeline]
        direction LR
        GL["GAME LOOP<br>main.js<br>requestAnimationFrame<br>renderer.draw()<br>updateUI()"]
        RT["RAY TRACER<br>raytracer.js<br>Dual-pass simulation<br>SUN + MOON paths<br>Cycle detection"]
        RD["RENDERER<br>renderer.js<br>3-pass canvas draw<br>Glow + dashes + pulses<br>Particle integration"]
        PS["PARTICLES<br>particles.js<br>emit() / burst()<br>update(dt) / draw()<br>Lifecycle management"]
    end

    GL --> RT --> RD --> PS

    style GL fill:#1a1a3a,stroke:#ffd700,color:#ffd700
    style RT fill:#1a1a3a,stroke:#4a90d9,color:#4a90d9
    style RD fill:#1a1a3a,stroke:#7b68ee,color:#7b68ee
    style PS fill:#1a1a3a,stroke:#00ff88,color:#00ff88
    style Pipeline fill:#0a0a1a,stroke:#333,color:#888
```

### Supporting Systems

```mermaid
flowchart TB
    subgraph Systems[Supporting Systems]
        direction TB
        IM["INPUT<br>input.js<br>Mouse + Touch<br>Long-press gesture<br>Coord mapping"]
        GS["GAME STATE<br>game.js<br>8x8 grid state<br>Undo / redo history<br>Star rating (1-3)<br>Level load / reset<br>Save / load progress<br>Win detection"]
        AU["AUDIO<br>audio.js<br>Web Audio synthesis<br>Osc + Gain nodes<br>5 sound effects<br>Zero audio files"]
        ED["EDITOR<br>editor.js<br>Tool palette<br>Grid painting<br>JSON export"]
    end

    IM --> GS --> AU
    GS --> ED

    style IM fill:#1a1a3a,stroke:#ffd700,color:#ffd700
    style GS fill:#1a1a3a,stroke:#00ff41,color:#00ff41
    style AU fill:#1a1a3a,stroke:#ff6b35,color:#ff6b35
    style ED fill:#1a1a3a,stroke:#4a90d9,color:#4a90d9
    style Systems fill:#0a0a1a,stroke:#333,color:#888
```

### Terminal System

```mermaid
flowchart LR
    subgraph Terminal[Terminal System]
        direction LR
        TM["TERMINAL<br>terminal.js<br>3 questions max<br>Typewriter output<br>Turing test finale"]
        GA["GEMINI AI<br>if key configured<br>fetch /api/chat<br>Bletchley persona<br>Dynamic responses"]
        DM["DEMO MODE<br>fallback<br>11 pre-recorded<br>Fragmented memory<br>Random selection"]
    end

    TM --> GA
    TM --> DM

    style TM fill:#1a1a3a,stroke:#00ff41,color:#00ff41
    style GA fill:#1a1a3a,stroke:#7b68ee,color:#7b68ee
    style DM fill:#1a1a3a,stroke:#555,color:#888
    style Terminal fill:#0a0a1a,stroke:#333,color:#888
```

---

## Beam Physics

The ray tracer uses grid-based ray marching with cycle detection.

```mermaid
flowchart TB
    subgraph RayMarch[Ray Marching Step]
        direction TB
        A["Ray enters cell<br>x += dirX, y += dirY"] --> B{"Cell type"}
        B -->|"WALL"| C["Terminate"]
        B -->|"RECEPTOR"| D["hitReceptor = true<br>Terminate"]
        B -->|"MIRROR_FWD (/)"| E["Transform direction<br>[dx, dy] = [-dy, -dx]"]
        B -->|"MIRROR_BACK (\\)"| F["Transform direction<br>[dx, dy] = [dy, dx]"]
        B -->|"EMPTY"| G["Continue to next cell"]
        E --> A
        F --> A
    end

    style A fill:#1a1a3a,stroke:#8888bb,color:#bbb
    style B fill:#1a1a3a,stroke:#ffd700,color:#ffd700
    style C fill:#1a1a3a,stroke:#ff4444,color:#ff4444
    style D fill:#1a1a3a,stroke:#00ff41,color:#00ff41
    style E fill:#1a1a3a,stroke:#4a90d9,color:#4a90d9
    style F fill:#1a1a3a,stroke:#4a90d9,color:#4a90d9
    style G fill:#1a1a3a,stroke:#555,color:#888
    style RayMarch fill:#0a0a1a,stroke:#333,color:#888
```

Mirror reflection rules:

| Mirror | Direction in | Direction out |
|--------|-------------|--------------|
| `/`    | Right (1,0)  | Up (0,-1)    |
| `/`    | Down (0,1)   | Left (-1,0)  |
| `/`    | Left (-1,0)  | Down (0,1)   |
| `/`    | Up (0,-1)    | Right (1,0)  |
| `\`    | Right (1,0)  | Down (0,1)   |
| `\`    | Down (0,1)   | Right (1,0)  |
| `\`    | Left (-1,0)  | Up (0,-1)    |
| `\`    | Up (0,-1)    | Left (-1,0)  |

The simulation runs twice per frame — once for SUN mode and once for MOON mode — storing both results independently. Win detection fires when both spectra report a receptor hit, regardless of the active toggle state.

---

## Key Technical Challenges

### Mirrors and Vector Reflection
Each mirror orientation (`/` and `\`) applies a specific transformation to the ray direction vector. The `/` mirror swaps and negates both components (`[dx, dy] → [-dy, -dx]`), while the `\` mirror swaps them without negation (`[dx, dy] → [dy, dx]`). This determines the full 16-state reflection table that governs all beam interactions.

### Cycle Detection in Closed Paths
Mirror arrangements can create infinite loops (e.g., two `/` mirrors facing each other). A visited-set indexed by `x * GRID_SIZE + y` breaks cycles and prevents stack overflow, allowing the tracer to terminate predictably on any arrangement.

### Dual-Pass Simulation
Two complete ray traces execute per frame — one for SUN emitters/receptors, one for MOON. Both results persist in memory simultaneously so the renderer can show the appropriate beam set and detect cross-mode wins. This is not a toggle-switch; the inactive mode's result is still computed for win validation.

### First-Play Demo
On first launch, a brief animated demo plays on level 1. It highlights a cell, places a `\` mirror, and shows the beam reaching the receptor — teaching the core click → place → reflect cycle without text. A `localStorage` flag prevents replay.

### Undo/Redo via Grid Snapshots
The undo system stores full grid snapshots before each mutation. Each snapshot is a deep copy of the 8×8 grid (64 integers). History is truncated on new actions after an undo, and cleared on level load. This keeps the implementation simple — no diffing or inverse operations — at minimal memory cost (~2 KB per 100 snapshots for 64 cells × 4 bytes).

### Star Rating by Par
Each level defines a `par` (minimum mirror count to solve). The player earns 3 stars if their mirror count ≤ par, 2 stars if ≤ par + 2, and 1 star otherwise. The highest star rating achieved per level is persisted in localStorage alongside the solved set.

### Rising-Edge Sound Triggers
Audio effects for receptor activation use a state comparison pattern: `currentLit && !previousLit`. The previous state must update *after* the comparison, not before — a sequence bug that suppresses sound if reversed.

### Responsive Canvas Scaling
The canvas maintains a fixed internal resolution (560×560) while CSS scales it to fill its container. Input coordinates are reverse-mapped by `clientX → (clientX - rect.left) × (internalSize / rect.width)`, preserving pixel-accurate grid hits at any viewport size.

---

## Development Progression

The project evolved across four phases, each building on the previous. Source snapshots for each phase are in the `day1/`–`day4/` directories.

```mermaid
flowchart LR
    subgraph Dev[Development Timeline]
        direction LR
        D1["Phase 1<br>Core Mechanics<br>8x8 grid · Canvas renderer<br>Ray tracer · SUN emitter<br>Mirror placement"]
        D2["Phase 2<br>Game Systems<br>MOON emitter · Day/night toggle<br>5 levels · Win detection<br>localStorage save"]
        D3["Phase 3<br>Terminal + Audio<br>CRT terminal · 3-question AI chat<br>Gemini API · Web Audio SFX<br>Bletchley narrative"]
        D4["Phase 4<br>Editor + Polish<br>Level editor · JSON export<br>Animated beams · Particles<br>Touch support · Intro screen"]
    end
    D1 --> D2 --> D3 --> D4

    style D1 fill:#1a1a3a,stroke:#ffd700,color:#ffd700
    style D2 fill:#1a1a3a,stroke:#4a90d9,color:#4a90d9
    style D3 fill:#1a1a3a,stroke:#00ff41,color:#00ff41
    style D4 fill:#1a1a3a,stroke:#7b68ee,color:#7b68ee
    style Dev fill:#0a0a1a,stroke:#333,color:#888
```

| Phase | Focus | Key Additions | Snapshot |
|-------|-------|---------------|----------|
| **1** | Core Mechanics | Grid, Canvas renderer, ray tracer, SUN emitter, mirror placement (`/` `\`) | (DAY1) |
| **2** | Game Systems | MOON emitter, day/night toggle, 5 levels, win detection, level selector, localStorage | (DAY2) |
| **5** | Level Expansion | 10 levels with graduated difficulty, undo/redo, star rating (1-3), sound settings, first-play demo tutorial | (post-launch) |
| **3** | Terminal + Audio | CRT terminal, Gemini API, 3-question chat, Web Audio synthesis, Bletchley narrative | (DAY3) |
| **4** | Editor + Polish | Level editor, particle system, animated beams, intro screen, touch support, responsive CSS | (DAY4) |

## Technologies

| Layer | Technology |
|-------|-----------|
| Language | Vanilla JavaScript (ES Modules) |
| Rendering | HTML Canvas 2D API |
| Build | Vite |
| Audio | Web Audio API (OscillatorNode + GainNode) |
| AI | Google Gemini API (optional) |
| Hosting | Netlify CDN |
| Persistence | localStorage |

---

## Project Structure

```
├── index.html              Entry point, DOM structure, modal overlays
├── package.json            Vite build configuration
├── vite.config.js
├── src/
│   ├── main.js             Game loop, UI updates, event wiring, win modal, settings
│   ├── game.js             State machine, undo/redo, star rating, level loading, save/load
│   ├── demo.js             First-play tutorial: animates a mirror placement
│   ├── levels.js           Level definitions (build functions)
│   ├── raytracer.js        Ray marching engine, mirror reflection
│   ├── renderer.js         Canvas draw: cells, beams, particles
│   ├── particles.js        Particle system: emit, burst, update, draw
│   ├── input.js            Mouse/touch handlers, coordinate mapping
│   ├── terminal.js         CRT terminal, Gemini API, demo dialogue
│   ├── editor.js           Level editor, tool palette, JSON export
│   ├── audio.js            Web Audio sound synthesis
│   ├── demo.js             First-play animated tutorial
│   ├── constants.js        Enums, colors, grid dimensions
│   └── main.css            Full stylesheet, responsive media queries
└── README.md
```

---

## Deployment

```mermaid
flowchart LR
    subgraph Deploy[Deployment Pipeline]
        direction LR
        SRC["Source<br>src/"] --> VITE["Vite Build<br>npm run build"]
        VITE --> DIST["dist/<br>index.html + assets"]
        DIST --> NETLIFY["Netlify CDN<br>HTTPS · Edge cache<br>Instant rollback"]
        NETLIFY --> LIVE["Production<br>vinny-deploy.netlify.app"]
    end

    style SRC fill:#1a1a3a,stroke:#8888bb,color:#bbb
    style VITE fill:#1a1a3a,stroke:#7b68ee,color:#7b68ee
    style DIST fill:#1a1a3a,stroke:#555,color:#888
    style NETLIFY fill:#1a1a3a,stroke:#00ff41,color:#00ff41
    style LIVE fill:#1a1a3a,stroke:#ffd700,color:#ffd700
    style Deploy fill:#0a0a1a,stroke:#333,color:#888
```

Build produces a versioned bundle with content-hashed assets for cache busting. The site is served over HTTPS with global edge distribution, instant rollback, and zero server-side runtime.

---

## License

Apache 2.0. See [LICENSE](LICENSE).
