# Embervale

**A cozy angled top-down voxel PvE grove — waves, combos, bosses, and handcrafted scenes.**

**Play live → [embervale-amber.vercel.app](https://embervale-amber.vercel.app)**

Made by **[Carlo Miguel Dy](https://carlomigueldy.dev)** · [carlomigueldy.dev](https://carlomigueldy.dev)

---

## About

Embervale is a browser-native action game set in a warm, handcrafted voxel meadow. You play as the **Hearthkeeper**, clearing waves of wild spirits and facing the **Grove Tyrant** in boss encounters.

Built as a **Grok 4.5** production build with:

- **React + Vite** — fast web runtime  
- **React Three Fiber + Drei** — declarative 3D  
- **Rapier 3D** — physics ground & colliders  
- **Soft body collision** — player, mobs, and world props  
- **ElevenLabs SFX** — combat, UI, and grove ambience  
- **Zustand** — combat / wave state  
- **Blender bpy** — procedural voxel asset pipeline  

Designed for short, satisfying runs: camera-relative movement, **two-handed greatsword combos**, enemy nameplates, MMORPG-style unit frames, and level-up VFX that stay out of your way.

---

## Play

| Action | Input |
|--------|--------|
| Move | **WASD** / Arrows *(camera-relative)* |
| Aim | Mouse |
| Attack | **Click** or **Space** |
| Combo | Chain attacks mid-swing |
| Dash | **Shift** |

**Goal:** Survive to wave **15** and fell the bosses along the way.

---

## Features

- Angled top-down cozy voxel world with trees, cottage, shrine, lanterns  
- Random wave spawns: Moss Slimes, Caplings, Ember Imps, Grove Beetles  
- Boss every 5 waves — **Grove Tyrant** with projectile patterns  
- Two-handed sword combat with openers + 4-hit combo route  
- Procedural character / mob rigs (idle, walk, sidestep, dash, attack, hit, death)  
- Enemy nameplates + HP bars (HUD-matched Pixelify Sans)  
- Player & target unit frames inspired by classic MMO layouts  
- Level-up world particles (no blocking modals mid-fight)  
- Hurt feedback: vignette, ring burst, floating damage  
- Collision with trees, rocks, cottage, shrine, hedges, pond, and mobs  
- ElevenLabs sound effects (swing, hit, dash, hurt, level-up, ambience)  
- Blender bpy generators for exportable GLB kitbash assets  

---

## Agents & contributors

This repo has a **shared agent harness** so every AI session and human
contributor follows the same rules:

| File | Purpose |
|------|---------|
| [`AGENTS.md`](./AGENTS.md) / [`CLAUDE.md`](./CLAUDE.md) | Canonical hard rules (same file) |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Setup + quality gates |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Layers & hot paths |
| [`docs/DESIGN.md`](./docs/DESIGN.md) | Feel, palette, HUD |
| [`docs/MEMORY.md`](./docs/MEMORY.md) | Cross-session gotchas |
| [`.agents/`](./.agents/) | Workflows & checklists |

```bash
npm run gate   # typecheck + lint + build
```

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:2035
npm run build      # production bundle
npm run typecheck
npm run gate       # full local quality gate
```

### Optional: regenerate Blender assets

Requires Blender on `PATH` (tested on 4.5.11 LTS; scripts avoid 5.1-only APIs):

```bash
npm run assets:generate
```

Outputs GLBs to `public/assets/models/`. See `tools/blender/README.md`.

### Optional: regenerate SFX (ElevenLabs)

Requires `ELEVENLABS_API_KEY` in the environment:

```bash
npm run sfx:generate
```

Writes MP3s + `manifest.json` to `public/audio/`.

---

## Project layout

```
AGENTS.md / CLAUDE.md   # agent harness (canonical rules)
CONTRIBUTING.md
docs/                   # architecture, design, memory
.agents/                # workflows + checklists
src/
  animation/            # combat attacks, poses, locomotion
  audio/                # WebAudio manager + ElevenLabs SFX
  components/           # R3F scene, player, mobs, VFX, nameplates
  game/                 # store, constants, runtime, collision, navigation
  meshes/               # voxel props + rigged characters
  ui/                   # HUD, unit frames, overlays
  styles/               # voxel / MMO HUD design system
tools/
  blender/              # bpy procedural asset generators
  audio/                # ElevenLabs SFX generation script
public/
  assets/models/        # exported GLBs + manifest
  audio/                # SFX + ambience
  fonts/                # Pixelify Sans for 3D nameplates
  robots.txt            # crawl rules
  sitemap.xml           # search sitemap
  og.png                # social preview
```

---

## Stack

| Layer | Tech |
|-------|------|
| App | React 19, TypeScript, Vite 8 |
| 3D | Three.js, R3F, Drei |
| Physics | @react-three/rapier + soft body collision |
| Audio | Web Audio API · ElevenLabs sound generation |
| State | Zustand |
| Assets | Blender bpy (procedural voxels) |
| Deploy | Vercel |

---

## Attribution

**Author:** [Carlo Miguel Dy](https://carlomigueldy.dev)  
**Site:** [carlomigueldy.dev](https://carlomigueldy.dev)  
**SFX:** [ElevenLabs](https://elevenlabs.io)

---

## License

MIT — see repository for details.

---

Built with **Grok 4.5** by [xAI](https://x.ai) · by [carlomigueldy.dev](https://carlomigueldy.dev).
