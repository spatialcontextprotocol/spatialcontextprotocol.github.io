# TASK-viewer-scroll-optimisation

**Status**: Complete
**Branch**: main
**Commit**: e0fd81f

## Problem

All four GLB viewer rAF loops (`js/viewer.js`, `js/viewer-example-1.js`, `js/viewer-example-2.js`, `js/viewer-example-3.js`) run continuously at ~60 FPS from the moment the viewer initialises, regardless of whether the canvas is visible. With four simultaneous WebGL contexts all rendering every frame, GPU bandwidth is shared with the CSS compositor during scrolling and the scroll-jacked theme transition in `js/theme-transition.js`, producing scroll jank and sluggish animation. Additionally, the canvas elements lack a compositor-layer hint, so WebGL repaints can trigger recomposition of adjacent CSS layers.

## Fix

1. **Pause rAF loop when off-screen.** In each viewer's `startViewer()`, replace the unconditional `requestAnimationFrame` self-call with a start/stop pattern controlled by a second `IntersectionObserver` (the existing one disconnects immediately after init). When the canvas leaves the viewport the loop is cancelled; when it re-enters it is restarted. For time-based animations (viewers 2 and 3), `startTime` is reset to `null` on resume so the animation restarts cleanly rather than jumping ahead.

2. **Pause on hidden tab.** Add a `document.visibilitychange` listener in each viewer that calls `stopLoop()` when the tab becomes hidden and `startLoop()` when it becomes visible again.

3. **Promote canvas to compositor layer.** Add `will-change: contents` to `.viewer-wrap canvas` in `css/styles.css`. This tells the browser to keep the canvas on its own compositor layer, preventing WebGL repaints from invalidating adjacent CSS transition layers during the theme switch.

## Files

- `js/viewer.js` — replace `animate()` block with start/stop pattern; add visibility IntersectionObserver and `visibilitychange` listener
- `js/viewer-example-1.js` — same; arrow oscillation uses global `performance.now()` so resumes seamlessly
- `js/viewer-example-2.js` — same; reset `startTime = null` on `startLoop()` so camera animation restarts on resume
- `js/viewer-example-3.js` — same; reset `startTime = null` on `startLoop()` so light/route animation restarts on resume
- `css/styles.css` — add `will-change: contents` to `.viewer-wrap canvas`

## Verification

- [x] Scroll to a viewer, then scroll past it — open DevTools Performance panel and confirm the rAF loop for that viewer stops firing once the canvas is fully off-screen
- [x] Switch browser tab away and back — confirm no rAF activity while the tab is hidden (DevTools Performance or console log)
- [x] Scroll through the theme transition zone (between Example 2 and Example 3) — confirm the dark/light switch animates as smoothly as before the change
- [x] All four viewer canvases still display and animate correctly when scrolled into view
- [x] No JS console errors on page load or during scroll
- [x] `css/styles.css` contains `will-change: contents` under `.viewer-wrap canvas`
