# Solstice

A light-routing puzzle game built with vanilla JavaScript and rendered on HTML Canvas. Players place diagonal mirrors on an 8x8 grid to redirect beams from celestial emitters (Sun and Moon) to their matching receptors. Both receptors must be lit simultaneously to complete each level.

The game features a full ray-tracing engine, dual day/night mode, five hand-crafted levels, a level editor with JSON export, atmospheric sound design via the Web Audio API, and a CRT-style terminal interface with an optional Gemini AI integration.

---

## Development Log

### Day 1 -- Core Grid and Mirror Placement
Established the foundational 8x8 grid with an HTML Canvas renderer. Implemented click-to-cycle mirror placement, alternating between forward-slash (/) and backslash (\) orientations. The grid renders with a checkerboard pattern and interactive cell highlighting on hover.

### Day 2 -- Ray Tracing Engine
Built the beam simulation system. Rays emit from the Sun emitter and travel across the grid, reflecting off mirrors at physically accurate angles. Beams render with a two-pass glow effect for visual clarity, and terminate on walls, receptors, or out-of-bounds.

### Day 3 -- Day/Night Toggle and Win Detection
Added the Moon emitter and a toggle mechanism to switch between Sun and Moon modes. Each mode activates only its corresponding emitter and receptor. Win detection fires when both receptors register a hit simultaneously, regardless of the current toggle state.

### Day 4 -- Level System and Persistence
Restructured the project into ES modules with Vite as the build tool. Introduced five levels with increasing complexity, a level selector dropdown, and localStorage persistence for unlocked levels. Each level stores emitter positions, wall layouts, and par scores.

### Day 5 -- Terminal Interface and Audio
Integrated a CRT-style terminal overlay featuring a Bletchley Park narrative theme. The terminal limits interaction to three questions and culminates in a Turing test. Added Web Audio API sound effects for mirror placement, removal, toggle, win, and receptor activation.

### Day 6 -- Gemini AI Integration (Server)
Built an Express proxy server that forwards terminal chat requests to the Google Gemini API. The server acts as a relay, injecting a system prompt that establishes the wartime 1945 persona. On static hosting, the terminal falls back to seven pre-recorded dialogue fragments.

### Day 7 -- Level Editor and Polish
Implemented an in-game level editor with an eight-cell palette, canvas-based placement, and one-click JSON export to clipboard. Added keyboard shortcuts (T to toggle, R to reset, Esc to close modals), a help modal, hover-highlight refinements, and responsive canvas scaling.

---

## Deployment

The application is deployed as a static site via Netlify. Below is the deployment pipeline.

```
Source Code (src/)
       |
       v
  npm run build (Vite)
       |
       v
  dist/  ---------------------------+
  index.html                        |
  assets/index-xxxxxxxx.js          |
  assets/index-xxxxxxxx.css         |
       |                            |
       v                            v
  Netlify Deploy API          Netlify Git Import
  (zip upload)                (auto-build from repo)
       |                            |
       +----------+-----------------+
                  |
                  v
        Netlify CDN (edge network)
                  |
                  v
        Production URL
    https://vinny-deploy.netlify.app
```

### Deployment Steps

1. Run `npm run build` to generate the `dist/` directory containing the production bundle.
2. Upload the contents of `dist/` to Netlify via the Deploy API or connect the GitHub repository through the Netlify dashboard for automatic builds on push.
3. Netlify distributes the static assets across its global CDN edge network.
4. The site is served at the assigned production URL with automatic HTTPS, asset hashing for cache busting, and instant rollback support.

---

## Project Structure

```
├── index.html              Entry point with full DOM structure
├── package.json            Vite dependencies and build scripts
├── vite.config.js          Vite configuration
├── src/
│   ├── main.js             Application entry point and game loop
│   ├── constants.js        Cell type enums, colors, grid dimensions
│   ├── game.js             Game state, level loading, progress save
│   ├── levels.js           Five level definitions
│   ├── raytracer.js        Beam path simulation
│   ├── renderer.js         Canvas drawing and animation
│   ├── input.js            Mouse interaction and grid coordinate mapping
│   ├── terminal.js         CRT terminal with Gemini API integration
│   ├── editor.js           Level editor with JSON export
│   ├── audio.js            Web Audio API sound effects
│   └── main.css            Full application stylesheet
├── server/
│   └── server.js           Express proxy for Gemini API (optional)
└── README.md
```

---

## Technologies

- Vanilla JavaScript (ES Modules)
- HTML Canvas 2D API
- Vite (build tool and development server)
- Web Audio API
- Google Gemini API (optional, terminal integration)
- Netlify (static hosting and CDN)

---

## License

Apache 2.0. See [LICENSE](LICENSE).
