let body = document.body
let modeToggle = document.querySelector('#mode_toggle') as HTMLButtonElement
let moon = document.querySelector('#moon') as SVGSVGElement
let sun = document.querySelector('#sun') as SVGSVGElement

type Mode = 'dark' | 'light'

initModeToggle()

function initModeToggle(): void {
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
  modeToggle.addEventListener('click', () => {
    toggleMode(oppositeMode(getMode()))
  })
}

function toggleMode(mode: Mode): void {
  let newMode = mode
  let oldMode = oppositeMode(newMode)

  modeToggle.classList.add(newMode)
  modeToggle.classList.remove(oldMode)
  modeToggle.setAttribute('title', 'Toggle ' + oldMode + ' mode')

  moon.style.display = newMode === 'dark' ? 'none' : 'inline'
  sun.style.display = newMode === 'dark' ? 'inline' : 'none'

  body.classList.add(newMode)
  body.classList.remove(oldMode)

  setMode(newMode)
}

function getMode(): Mode {
  let item = localStorage.getItem('mode')
  switch (item) {
    case 'light':
      return 'light'
    default:
      return 'dark'
  }
}

function setMode(mode: Mode): void {
  localStorage.setItem('mode', mode)
}

function oppositeMode(mode: Mode) {
  return mode === 'light' ? 'dark' : 'light'
}
