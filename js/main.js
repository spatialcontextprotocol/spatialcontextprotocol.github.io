const html = document.documentElement;
const zone = document.getElementById('transition-zone');
const curtain = document.getElementById('theme-curtain');
const label = document.getElementById('transitionLabel');
const scrollBar = document.getElementById('scrollBar');

let isDark = false;
let lastScrollY = window.scrollY;
let scrollDir = 'down';

function getZoneProgress() {
  const rect = zone.getBoundingClientRect();
  const zoneHeight = zone.offsetHeight - window.innerHeight;
  // progress 0 when zone top hits viewport top, 1 when zone bottom hits viewport top
  const scrolled = -rect.top;
  return Math.max(0, Math.min(1, scrolled / zoneHeight));
}

function updateScrollBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? scrollTop / docHeight : 0;
  scrollBar.style.width = (p * 100).toFixed(1) + '%';
}

function applyDark() {
  if (!isDark) {
    isDark = true;
    html.classList.add('is-dark');
  }
}

function applyLight() {
  if (isDark) {
    isDark = false;
    html.classList.remove('is-dark');
  }
}

function onScroll() {
  const currentY = window.scrollY;
  scrollDir = currentY >= lastScrollY ? 'down' : 'up';
  lastScrollY = currentY;

  updateScrollBar();

  const rect = zone.getBoundingClientRect();
  const zoneTop = rect.top;
  const zoneBottom = rect.bottom;

  // Are we inside the transition zone?
  const inZone = zoneTop <= 0 && zoneBottom >= window.innerHeight;

  if (inZone) {
    const progress = getZoneProgress();
    label.classList.add('visible');

    // Label follows direction only — direction is always the right signal
    label.textContent = scrollDir === 'down'
      ? '— switching to night mode —'
      : '— switching to day mode —';

    // Drive theme at midpoint of the zone
    if (progress >= 0.5 && !isDark) {
      applyDark();
    } else if (progress < 0.5 && isDark) {
      applyLight();
    }
  } else {
    label.classList.remove('visible');
    // If we've scrolled past the zone, ensure dark
    if (zoneBottom < window.innerHeight) {
      applyDark();
    }
    // If we're above the zone, ensure light
    if (zoneTop > 0) {
      applyLight();
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // init
