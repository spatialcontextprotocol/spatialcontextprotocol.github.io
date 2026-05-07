export function initThemeTransition() {
  const html = document.documentElement
  const zone = document.getElementById('transition-zone')
  const label = document.getElementById('transitionLabel')
  if (!zone || !label) return

  let isDark = false
  let lastScrollY = window.scrollY
  let scrollDir = 'down'

  function getZoneProgress() {
    const rect = zone.getBoundingClientRect()
    const zoneHeight = zone.offsetHeight - window.innerHeight
    const scrolled = -rect.top
    return Math.max(0, Math.min(1, scrolled / zoneHeight))
  }

  function applyDark() {
    if (!isDark) {
      isDark = true
      html.classList.add('dark')
    }
  }

  function applyLight() {
    if (isDark) {
      isDark = false
      html.classList.remove('dark')
    }
  }

  function onScroll() {
    const currentY = window.scrollY
    scrollDir = currentY >= lastScrollY ? 'down' : 'up'
    lastScrollY = currentY

    const rect = zone.getBoundingClientRect()
    const zoneTop = rect.top
    const zoneBottom = rect.bottom
    const inZone = zoneTop <= 0 && zoneBottom >= window.innerHeight

    if (inZone) {
      const progress = getZoneProgress()
      label.classList.add('visible')
      label.textContent = scrollDir === 'down'
        ? '— switching to night mode —'
        : '— switching to day mode —'

      if (progress >= 0.5 && !isDark) applyDark()
      else if (progress < 0.5 && isDark) applyLight()
    } else {
      label.classList.remove('visible')
      if (zoneBottom < window.innerHeight) applyDark()
      if (zoneTop > 0) applyLight()
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
