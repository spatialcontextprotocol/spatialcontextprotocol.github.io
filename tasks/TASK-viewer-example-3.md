# TASK-viewer-example-3

**Status**: Pending
**Branch**: viewer-example-3
**Commit**: —

## Problem

Figure 4 (route-conditioned building control) is currently an animated GIF showing a top-down view of the building with rooms lighting up in sequence. Replacing it with a live Three.js viewer replicating this effect would remove the GIF artefact, allow responsive sizing, and be consistent with the other example viewers.

## Fix

Create `js/viewer-example-3.js` — a Three.js viewer with an orthographic top-down camera and a looping point-light animation.

**Camera**: `THREE.OrthographicCamera` positioned directly above the scene centre, looking straight down. Frustum size derived from scene bounding box so the full building fits the canvas. No OrbitControls — camera is fixed.

**Lighting**: Global ambient set very low (intensity ~0.08) to produce the dark dimmed scene shown in the reference GIF. One `THREE.PointLight` per room in the route (entrance lobby, main corridor, briefing room, lounge), all off (`intensity: 0`) initially. Each light is positioned at the centre of its room at ceiling height.

**Animation loop** (driven by elapsed time in RAF):

| Step | Duration | Behaviour |
|---|---|---|
| Light 1 on | 0.6 s fade in | Entrance lobby light ramps up |
| Light 2 on | 0.6 s fade in | Corridor light ramps up |
| Light 3 on | 0.6 s fade in | Briefing room light ramps up |
| Light 4 on | 0.6 s fade in | Lounge light ramps up |
| Hold | 1.5 s | All route lights on |
| Reset | 0.4 s fade out | All lights fade out simultaneously |
| Pause | 0.8 s | Dark scene before repeating |

Light intensity target when fully on: ~2.5. Colour: warm white (`0xfff5e0`).

The existing `.figure` for Fig 4 in `index.html` (currently the GIF) is replaced with a `.viewer-wrap` canvas. The figcaption is updated to remove the reference to the GIF.

**Coordinate discovery prerequisite**: use `TASK-debug-coords` to find the centre position of each of the four rooms at ceiling height. These are defined as named constants:

```js
const ROUTE_LIGHTS = [
  { label: 'entrance-lobby',  position: { x: ?, y: ?, z: ? } },
  { label: 'main-corridor',   position: { x: ?, y: ?, z: ? } },
  { label: 'briefing-room',   position: { x: ?, y: ?, z: ? } },
  { label: 'lounge',          position: { x: ?, y: ?, z: ? } },
];
```

## Files

- `js/viewer-example-3.js` — new; orthographic top-down viewer with sequential room light animation
- `index.html` — replace Fig 4 `<figure>` (GIF) with `.viewer-wrap` canvas; update figcaption

## Verification

- [ ] The camera shows a top-down orthographic view of the full building
- [ ] The scene is visibly dark/dimmed on load (ambient only, no route lights)
- [ ] Lights ramp on in sequence: entrance lobby → corridor → briefing room → lounge
- [ ] Each light visibly illuminates the geometry of its room
- [ ] All lights fade out and the loop restarts
- [ ] The animation runs continuously without drift
- [ ] Page scroll is not blocked when the cursor is over the canvas
- [ ] The viewer initialises only when the canvas enters the viewport (IntersectionObserver)
- [ ] No console errors on load
