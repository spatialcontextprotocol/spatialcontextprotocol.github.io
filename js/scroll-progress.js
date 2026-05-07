export function initScrollProgress() {
  const scrollBar = document.getElementById('scrollBar')
  if (!scrollBar) return

  function update() {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const p = docHeight > 0 ? scrollTop / docHeight : 0
    scrollBar.style.width = (p * 100).toFixed(1) + '%'
  }

  window.addEventListener('scroll', update, { passive: true })
  update()
}
