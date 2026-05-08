# TASK-debug-coords

**Status**: Pending
**Branch**: debug-coords
**Commit**: —

## Problem

Three viewer tasks (TASK-viewer-example-1, TASK-viewer-example-2, TASK-viewer-example-3) each require precise 3D coordinates from the scene-208 GLB — path waypoints, room centres, camera positions. These coordinates are not known and must be discovered empirically by navigating the live scene. There is currently no tool for this.

## Fix

Create `js/debug-coords.js` — a lightweight debug overlay that any viewer can import. When active, it renders a `<div>` overlay in the top-left corner of the viewer's container showing the current camera position and orbit target, updated every frame. Toggle with the `C` key. Overlay is hidden by default.

The module exports a single `initDebugCoords(camera, controls, container)` function. The caller passes the Three.js camera, OrbitControls instance, and the canvas parent element. The overlay is appended to `container` so it is scoped to the viewer and not the page.

Display format (monospace, values to 2 decimal places):

```
pos  x: 12.34  y:  5.67  z: -8.90
tgt  x:  0.12  y: -0.05  z:  0.34
```

The function returns a `destroy()` method that removes the overlay and unbinds the key listener, for use in viewers that reinitialise.

No changes to `index.html` or `css/styles.css` are needed — the overlay is injected and styled entirely via JS.

## Files

- `js/debug-coords.js` — new; exports `initDebugCoords(camera, controls, container)`

## Verification

- [ ] Importing `initDebugCoords` and calling it in the existing `js/viewer.js` does not cause any errors
- [ ] Pressing C toggles the overlay visible/hidden
- [ ] The displayed position and target values update in real time as the camera is dragged
- [ ] The overlay does not appear on page load (hidden by default)
- [ ] Removing the import from `viewer.js` after coordinate discovery leaves no trace in the DOM
