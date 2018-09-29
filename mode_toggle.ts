let $body = document.body

let $modeToggle = document.querySelector('#mode_toggle') as HTMLButtonElement
let $moon = document.querySelector('#moon') as SVGSVGElement
let $sun = document.querySelector('#sun') as SVGSVGElement

let $brightness = document.querySelector('#brightness') as HTMLSpanElement
let $icon = document.querySelector('#icon') as HTMLSpanElement
let $theme = document.querySelector('#theme') as HTMLSpanElement

let $anchors = document.querySelectorAll('a')

type Mode = 'dark' | 'light'

/**
 * The theme is selected based on the time of day. Between 06:00 and 18:00,
 * the light theme will be chosen. Otherwise, the dark theme.
 * However, once the toggle button was clicked, the selected mode will be
 * persisted and used for repeated visits in the current session.
 */

let mode = sessionStorage.getItem('mode') as Mode | null
if (mode === 'dark' || mode === 'light') {
  toggleMode(mode)
} else {
  let hour = new Date().getHours()
  if (hour >= 6 && hour < 18) {
    mode = 'light'
    toggleMode(mode)
  } else {
    mode = 'dark'
    toggleMode(mode)
  }
}

$modeToggle.addEventListener('click', () => {
  mode = oppositeMode(mode)
  sessionStorage.setItem('mode', mode)
  toggleMode(mode)
})

function toggleMode(mode: Mode): void {
  let newMode = mode
  let oldMode = oppositeMode(newMode)

  // Toggle elements

  $body.classList.add(newMode)
  $body.classList.remove(oldMode)

  $anchors.forEach(a => {
    a.classList.add(oldMode + 'blue')
    a.classList.remove(newMode + 'blue')
  })

  $commitHash.classList.add(oldMode + 'green')
  $commitHash.classList.remove(newMode + 'green')

  $commitAuthor.classList.add(oldMode + 'green')
  $commitAuthor.classList.remove(newMode + 'green')

  $commitDate.classList.add(oldMode + 'green')
  $commitDate.classList.remove(newMode + 'green')

  // Toggle controls

  $modeToggle.classList.add(newMode)
  $modeToggle.classList.remove(oldMode)
  $modeToggle.setAttribute('title', 'Toggle ' + oldMode + ' mode')

  if (newMode === 'light') {
    $moon.style.display = 'inline'
    $sun.style.display = 'none'

    $brightness.textContent = 'dark'
    $icon.textContent = 'moon'
    $theme.textContent = 'dark'
  } else {
    $moon.style.display = 'none'
    $sun.style.display = 'inline'

    $brightness.textContent = 'bright'
    $icon.textContent = 'sun'
    $theme.textContent = 'light'
  }
}

function oppositeMode(mode: Mode | null): Mode {
  return mode === 'light' ? 'dark' : 'light'
}
