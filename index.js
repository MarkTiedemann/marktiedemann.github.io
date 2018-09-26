// @ts-check
var body = document.body

/** @type { HTMLButtonElement } */
var modeToggle = document.querySelector('#mode_toggle')
/** @type { SVGSVGElement } */
var moon = document.querySelector('#moon')
/** @type { SVGSVGElement } */
var sun = document.querySelector('#sun')

var anchors = document.querySelectorAll('a')
var spans = document.querySelectorAll('span')

switch (getMode()) {
  case null:
    toggleMode('dark')
    break
  case 'dark':
    toggleMode('dark')
    break
  case 'light':
    toggleMode('light')
    break
}

modeToggle.addEventListener('click', function() {
  toggleMode(oppositeMode(getMode()))
})

function toggleMode(mode) {
  var newMode = mode
  var oldMode = oppositeMode(newMode)

  // Toggle controls

  modeToggle.classList.add(newMode)
  modeToggle.classList.remove(oldMode)
  modeToggle.setAttribute('title', 'Toggle ' + oldMode + ' mode')

  moon.style.display = newMode === 'dark' ? 'none' : 'inline'
  sun.style.display = newMode === 'dark' ? 'inline' : 'none'

  // Toggle elements

  body.classList.add(newMode)
  body.classList.remove(oldMode)

  anchors.forEach(function(a) {
    a.classList.add(newMode)
    a.classList.remove(oldMode)
  })

  spans.forEach(function(s) {
    s.classList.add(newMode)
    s.classList.remove(oldMode)
  })

  setMode(newMode)
}

// Helper functions

function getMode() {
  return localStorage.getItem('mode')
}

function setMode(mode) {
  localStorage.setItem('mode', mode)
}

function oppositeMode(mode) {
  return mode === 'dark' ? 'light' : 'dark'
}
