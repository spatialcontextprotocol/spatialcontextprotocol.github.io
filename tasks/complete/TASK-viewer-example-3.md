# TASK-viewer-example-3

**Status**: Complete
**Branch**: viewer-example-3
**Commit**: c6ac817

## Problem

Figure 4 (route-conditioned building control) is currently an animated GIF showing a top-down view of the building with rooms lighting up in sequence. Replacing it with a live Three.js viewer replicating this effect would remove the GIF artefact, allow responsive sizing, and be consistent with the other example viewers.

## Fix

Create `js/viewer-example-3.js` — a Three.js viewer with a perspective camera starting top-down and a looping point-light + route animation.

**Camera**: `THREE.PerspectiveCamera` positioned directly above the scene centre, looking straight down (`camera.up = (0,0,-1)`). OrbitControls enabled (same config as viewer-example-1) so the user can freely explore; zoom locked until first `pointerdown` to avoid blocking page scroll.

**Lighting**: Global ambient set very low (intensity ~0.2) for a dark dimmed scene. One `THREE.PointLight` per room in the route (entrance lobby, main corridor, briefing room, lounge), all off (`intensity: 0`) initially. Each light is positioned at the centre of its room at ceiling height.

**Route animation**: A `CatmullRomCurve3` through 6 floor-level waypoints traces the full entrance-lobby → lounge path. Rendered as a `TubeGeometry` revealed progressively via `setDrawRange`, with a small sphere at the current path head. The path reveal is synchronised with the light animation: the head reaches the lounge exactly when the lounge light finishes fading in.

Route waypoints (first 4 from viewer-example-1, final 2 from light XZ positions at y=0):

```js
const ROUTE_WAYPOINTS = [
  new THREE.Vector3(-7.85, 0.00, 11.00),  // entrance lobby doorway
  new THREE.Vector3(-7.85, 0.00,  7.10),  // lobby → corridor opening
  new THREE.Vector3(-4.00, 0.00,  7.10),  // corridor
  new THREE.Vector3(-4.00, 0.00, -0.85),  // corridor junction
  new THREE.Vector3( 2.50, 0.00,  0.50),  // briefing room
  new THREE.Vector3( 1.00, 0.00, -7.75),  // lounge
];
```

**Animation loop** (driven by elapsed time in RAF):

| Step | Duration | Behaviour |
|---|---|---|
| Light 1 on | 0.6 s fade in | Entrance lobby light ramps up; path head begins moving |
| Light 2 on | 0.6 s fade in | Corridor light ramps up; path head continues |
| Light 3 on | 0.6 s fade in | Briefing room light ramps up; path head continues |
| Light 4 on | 0.6 s fade in | Lounge light ramps up; path head reaches lounge |
| Hold | 1.5 s | All lights on; full route visible |
| Reset | 0.4 s fade out | Lights and route fade out simultaneously |
| Pause | 0.8 s | Dark scene before repeating |

Light intensity target when fully on: ~5.0. Colour: warm white (`0xfff5e0`). Route colour: yellow (`0xffff00`).

The existing `.figure` for Fig 4 in `index.html` (currently the GIF) is replaced with a `.viewer-wrap` canvas. The figcaption is updated to remove the reference to the GIF.

## Files

- `js/viewer-example-3.js` — new; perspective top-down viewer with sequential room light animation and synchronised route reveal
- `index.html` — replace Fig 4 `<figure>` (GIF) with `.viewer-wrap` canvas; update figcaption

## Verification

- [ ] The camera starts in a top-down view of the full building
- [ ] OrbitControls allow free orbit/pan/zoom after first click; scroll is not blocked before interaction
- [ ] The scene is visibly dark/dimmed on load (ambient only, no route lights)
- [ ] Lights ramp on in sequence: entrance lobby → corridor → briefing room → lounge
- [ ] Each light visibly illuminates the geometry of its room
- [ ] The route tube is revealed progressively in sync with the lights
- [ ] The path head (sphere) moves along the route and reaches the lounge as the lounge light finishes
- [ ] Route and lights fade out together and the loop restarts
- [ ] The animation runs continuously without drift
- [ ] The viewer initialises only when the canvas enters the viewport (IntersectionObserver)
- [ ] No console errors on load
