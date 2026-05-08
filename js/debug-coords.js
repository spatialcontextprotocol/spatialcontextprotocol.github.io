/**
 * Debug coordinate overlay for Three.js viewers.
 *
 * Usage:
 *   import { initDebugCoords } from './debug-coords.js';
 *   const dbg = initDebugCoords(camera, controls, container);
 *   // Press C to toggle. Call dbg.destroy() to clean up.
 */

export function initDebugCoords(camera, controls, container) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:        'absolute',
    top:             '8px',
    left:            '8px',
    padding:         '6px 10px',
    background:      'rgba(0,0,0,0.65)',
    color:           '#e0e0e0',
    fontFamily:      'monospace',
    fontSize:        '12px',
    lineHeight:      '1.6',
    whiteSpace:      'pre',
    pointerEvents:   'none',
    zIndex:          '9999',
    display:         'none',
    borderRadius:    '4px',
  });

  // Container must be a positioned element for absolute children to work.
  const existingPosition = getComputedStyle(container).position;
  if (existingPosition === 'static') {
    container.style.position = 'relative';
  }

  container.appendChild(overlay);

  let visible = false;
  let rafId = null;

  function fmt(v) {
    // Fixed-width: sign + up to 3 digits + '.' + 2 decimals = 7 chars total
    const s = v.toFixed(2);
    return v >= 0 ? ' ' + s : s;
  }

  function update() {
    rafId = requestAnimationFrame(update);
    if (!visible) return;

    const p = camera.position;
    const t = controls.target;
    overlay.textContent =
      `pos  x:${fmt(p.x)}  y:${fmt(p.y)}  z:${fmt(p.z)}\n` +
      `tgt  x:${fmt(t.x)}  y:${fmt(t.y)}  z:${fmt(t.z)}`;
  }

  function onKeyDown(e) {
    if (e.key !== 'c' && e.key !== 'C') return;
    visible = !visible;
    overlay.style.display = visible ? 'block' : 'none';
  }

  window.addEventListener('keydown', onKeyDown);
  rafId = requestAnimationFrame(update);

  return {
    destroy() {
      window.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(rafId);
      overlay.remove();
    },
  };
}