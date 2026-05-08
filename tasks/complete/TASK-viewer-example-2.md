# TASK-viewer-example-2

**Status**: Complete
**Branch**: viewer-example-2
**Commit**: 8a0f006

## Problem

Figure 3 (changing room identification) is a static PNG showing the changing room from a close overhead angle. Replacing it with an animated viewer that zooms from a wide scene overview into the changing room, pauses, then zooms back out on a loop would better communicate the "agent locating a room within a building" concept.

## Fix

Create `js/viewer-example-2.js` — a Three.js viewer with a looping camera animation and no user orbit controls (the animation speaks for itself; controls would fight it).

The animation is a four-state loop driven by elapsed time in the RAF loop:

| State | Duration | Behaviour |
|---|---|---|
| `zoom-in` | ~2.5 s | Lerp camera position and orbit target from OVERVIEW to ROOM with smoothstep easing |
| `pause-in` | ~2.0 s | Hold at ROOM position |
| `zoom-out` | ~2.5 s | Lerp back from ROOM to OVERVIEW with smoothstep easing |
| `pause-out` | ~1.5 s | Hold at OVERVIEW position before repeating |

Two camera states are defined as named constants:
- `OVERVIEW` — `position` and `target` for the wide diagonal scene view (matching the existing Overview viewer's default angle)
- `ROOM` — `position` and `target` for the close elevated view of the changing room shown in showcase_2a

Smoothstep easing: `t * t * (3 - 2 * t)` applied to the lerp parameter.

OrbitControls is not used. Camera is moved directly each frame. `enableZoom`, `enableRotate`, `enablePan` are all false (or OrbitControls is omitted entirely).

The existing `.figure` for Fig 3 in `index.html` is replaced with a `.viewer-wrap` canvas. The figcaption is updated to reflect the interactive animation.

**Coordinate discovery prerequisite**: use `TASK-debug-coords` to find:
- `OVERVIEW.position` and `OVERVIEW.target` — match the wide diagonal starting angle
- `ROOM.position` and `ROOM.target` — match the close overhead view of the changing room in showcase_2a

## Files

- `js/viewer-example-2.js` — new; looping camera animation viewer
- `index.html` — replace Fig 3 `<figure>` with `.viewer-wrap` canvas; update figcaption

## Verification

- [x] On load the camera starts at the wide overview position
- [x] The camera smoothly zooms into the changing room and holds
- [x] The camera smoothly zooms back out to the overview and holds, then repeats
- [x] The easing is smooth (no linear snapping at start or end of transitions)
- [x] The loop runs continuously without drift or accumulating error
- [x] Page scroll is not blocked when the cursor is over the canvas
- [x] The viewer initialises only when the canvas enters the viewport (IntersectionObserver)
- [x] No console errors on load
