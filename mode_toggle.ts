function classListAdd(element: Element, className: string): void {
  element.classList.add(className)
}

function classListRemove(element: Element, className: string): void {
  element.classList.remove(className)
}

let $body = document.body

let $modeToggle = documentGetElementById('mode_toggle') as HTMLButtonElement
let $moon = (documentGetElementById('moon') as unknown) as SVGSVGElement
let $sun = (documentGetElementById('sun') as unknown) as SVGSVGElement

let $welcome = documentGetElementById('welcome') as HTMLSpanElement

let $brightness = documentGetElementById('brightness') as HTMLSpanElement
let $icon = documentGetElementById('icon') as HTMLSpanElement
let $theme = documentGetElementById('theme') as HTMLSpanElement

let $anchors = document.querySelectorAll('a')

let _mode = 'mode'
let _dark = 'dark' as 'dark'
let _light = 'light' as 'light'
let _blue = 'blue'
let _red = 'red'
let _green = 'green'
let _inline = 'inline'
let _none = 'none'

type Mode = 'dark' | 'light'

/**
 * The theme is selected based on the time of day. Between 06:00 and 18:00,
 * the light theme will be chosen. Otherwise, the dark theme.
 * However, once the toggle button was clicked, the selected mode will be
 * persisted and used for repeated visits in the current session.
 */

let mode = sessionStorage.getItem(_mode) as Mode | null
if (mode === _dark || mode === _light) {
  toggleMode(mode)
} else {
  let hour = new Date().getHours()
  if (hour >= 6 && hour < 18) {
    mode = _light
    toggleMode(mode)
  } else {
    mode = _dark
    toggleMode(mode)
  }
}

$modeToggle.addEventListener('click', () => {
  mode = oppositeMode(mode)
  sessionStorage.setItem(_mode, mode)
  toggleMode(mode)
})

function toggleMode(mode: Mode): void {
  let newMode = mode
  let oldMode = oppositeMode(newMode)

  // Toggle elements

  classListAdd($body, newMode)
  classListRemove($body, oldMode)

  $anchors.forEach(a => {
    classListAdd(a, oldMode + _blue)
    classListRemove(a, newMode + _blue)
  })

  classListAdd($welcome, oldMode + _red)
  classListRemove($welcome, newMode + _red)

  classListAdd($commitHash, oldMode + _green)
  classListRemove($commitHash, newMode + _green)

  classListAdd($commitAuthor, oldMode + _green)
  classListRemove($commitAuthor, newMode + _green)

  classListAdd($commitDate, oldMode + _green)
  classListRemove($commitDate, newMode + _green)

  // Toggle controls

  classListAdd($modeToggle, newMode)
  classListRemove($modeToggle, oldMode)
  $modeToggle.setAttribute('title', 'Toggle ' + oldMode + ' mode')

  if (newMode === _light) {
    $moon.style.display = _inline
    $sun.style.display = _none

    setTextContent($brightness, _dark)
    setTextContent($icon, 'moon')
    setTextContent($theme, _dark)
  } else {
    $moon.style.display = _none
    $sun.style.display = _inline

    setTextContent($brightness, 'bright')
    setTextContent($icon, 'sun')
    setTextContent($theme, _light)
  }
}

function oppositeMode(mode: Mode | null): Mode {
  return mode === _light ? _dark : _light
}
