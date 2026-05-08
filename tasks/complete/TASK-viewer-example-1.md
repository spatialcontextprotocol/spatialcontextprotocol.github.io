# TASK-viewer-example-1

**Status**: Complete
**Branch**: viewer-example-1
**Commit**: ee6dde6

## Problem

Figures 2a and 2b (wayfinding route and landmark identification) are currently static PNG images. They show a yellow route line through the building and yellow arrows at corridor landmarks. Replacing them with interactive 3D viewers that embed this annotation directly in the GLB scene would be more engaging and consistent with the Overview viewer.

## Fix

Create `js/viewer-example-1.js` — a static (non-rotating, non-auto-spinning) Three.js viewer that loads `scene-208.glb` and overlays:

1. **Route line** — a `THREE.TubeGeometry` along a sequence of waypoints following the entrance lobby → junction → changing room path, rendered in yellow (`0xf5c842` or similar to match the reference images).
2. **Landmark arrows** — three downward-pointing `THREE.ConeGeometry` instances at the landmark positions shown in showcase_1b (the orange noticeboard, kitchen door, and changing room entrance), rendered in the same yellow.

The camera is locked to a pre-configured isometric-ish position matching showcase_1a (diagonal elevated angle showing the full route). OrbitControls is enabled for orbit and pan but `autoRotate` is false and zoom is disabled until first `pointerdown` (same pattern as the Overview viewer). No loading hint is needed for interaction since the view is pre-set — keep the loading indicator only.

The figure pair (Fig 2a and Fig 2b) in `index.html` is replaced with a single full-width viewer container using the existing `.viewer-wrap` pattern.

**Coordinate discovery prerequisite**: use `TASK-debug-coords` to find:
- Path waypoints (4–6 points tracing the route at floor level)
- Arrow positions (3 points at landmark locations)
- Camera position and orbit target for the locked view

These values are defined as named constants at the top of the module.

## Files

- `js/viewer-example-1.js` — new; static viewer with route line and landmark arrows
- `index.html` — replace `.figure-pair` (Fig 2a / Fig 2b) with a single `.viewer-wrap` canvas

## Verification

- [x] The yellow route line traces the entrance → junction → changing room path at floor level
- [x] Three yellow arrows point downward at the landmark positions shown in showcase_1b
- [x] The camera opens at the pre-configured angle showing the full route — no auto-rotation
- [x] OrbitControls orbit and pan work; scroll-to-zoom is disabled until first click
- [x] Page scroll is not blocked when the cursor is over the canvas (zoom disabled until pointerdown)
- [x] The viewer initialises only when the canvas enters the viewport (IntersectionObserver)
- [x] No console errors on load
