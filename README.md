# Embervale

**A cozy angled top-down voxel PvE grove — waves, combos, bosses, and handcrafted scenes.**

Play live → **[embervale.vercel.app](https://embervale.vercel.app)**  
*(production URL is set after first deploy; if this 404s briefly, check the repo homepage / Vercel dashboard.)*

---

## About

Embervale is a browser-native action game set in a warm, handcrafted voxel meadow. You play as the **Hearthkeeper**, clearing waves of wild spirits and facing the **Grove Tyrant** in boss encounters.

Built as a **Grok 4.5** production build with:

- **React + Vite** — fast web runtime  
- **React Three Fiber + Drei** — declarative 3D  
- **Rapier 3D** — physics ground & colliders  
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
- Blender bpy generators for exportable GLB kitbash assets  

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:2035
npm run build      # production bundle
npm run typecheck
```

### Optional: regenerate Blender assets

Requires Blender on `PATH` (tested on 4.5.11 LTS; scripts avoid 5.1-only APIs):

```bash
npm run assets:generate
```

Outputs GLBs to `public/assets/models/`. See `tools/blender/README.md`.

---

## Project layout

```
src/
  animation/     # combat attacks, poses, locomotion
  components/    # R3F scene, player, mobs, VFX, nameplates
  game/          # store, constants, runtime, types
  meshes/        # voxel props + rigged characters
  ui/            # HUD, unit frames, overlays
  styles/        # voxel / MMO HUD design system
tools/blender/   # bpy procedural asset generators
public/
  assets/models/ # exported GLBs + manifest
  fonts/         # Pixelify Sans for 3D nameplates
```

---

## Stack

| Layer | Tech |
|-------|------|
| App | React 19, TypeScript, Vite 8 |
| 3D | Three.js, R3F, Drei |
| Physics | @react-three/rapier |
| State | Zustand |
| Assets | Blender bpy (procedural voxels) |
| Deploy | Vercel |

---

## License

MIT — see repository for details.

---

Built with **Grok 4.5** by [xAI](https://x.ai).
