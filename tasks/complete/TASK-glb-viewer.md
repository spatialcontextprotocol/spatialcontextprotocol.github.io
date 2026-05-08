# TASK-glb-viewer

**Status**: Complete
**Branch**: glb
**Commit**: 804a2a5

## Problem

The Overview section (section 01) displays a static top-down PNG image of the demonstration building (`assets/images/top_down.png`). This gives a flat, non-interactive view of the scene. The GLB model for the same building (`assets/models/scene-208.glb`) is already in the repository but is not surfaced on the page.

## Fix

Replace the `<figure>` containing the static top-down image in `index.html` with an interactive Three.js GLB viewer. The viewer follows the reference implementation at `spatialintelligence-site/js/viewer.js` as closely as possible, adapted for the SCP site:

- `js/viewer.js` — new file; adapted from the reference: canvas ID changed to `scp-viewer`, renderer uses `alpha: true` with transparent clear colour so the canvas CSS `background: var(--bg)` shows through (handles the light/dark theme transition without JS).
- `css/styles.css` — new `.viewer-wrap`, `.viewer-loading`, and `.viewer-hint` / `.viewer-hint--hidden` rules appended.
- `index.html` — the `<figure>` with `<img src="assets/images/top_down.png">` is replaced with a viewer wrapper containing a `<canvas id="scp-viewer">`, loading indicator, and drag hint. An importmap for Three.js `0.169.0` (from jsDelivr) is inserted immediately before the existing module scripts. The figcaption is updated to say "Interactive 3D model" rather than "Top-down view".

## Files

- `tasks/TASK-glb-viewer.md` — this file
- `js/viewer.js` — new; Three.js GLB viewer adapted from reference
- `css/styles.css` — viewer layout and hint styles appended
- `index.html` — figure replaced with viewer markup; importmap added

## Verification

- [x] Page loads without console errors
- [x] The viewer canvas renders the scene-208 GLB model in the Overview section
- [x] The model auto-rotates on load
- [x] Dragging on the canvas orbits the model; the hint fades after first interaction
- [x] Pressing R cycles rotation speed
- [x] The viewer background matches the page background colour in both light and dark mode (scroll past the transition zone to check dark mode)
- [x] The viewer is responsive — resize the browser window and confirm the canvas fills its container without distortion
