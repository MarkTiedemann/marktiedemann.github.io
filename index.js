// @ts-check
let body = document.body

// Mode toggle

/** @type { HTMLButtonElement } */
let modeToggle = document.querySelector('#mode_toggle')
/** @type { SVGSVGElement } */
let moon = document.querySelector('#moon')
/** @type { SVGSVGElement } */
let sun = document.querySelector('#sun')

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

function getMode() {
  return localStorage.getItem('mode')
}

function setMode(mode) {
  localStorage.setItem('mode', mode)
}

function oppositeMode(mode) {
  return mode === 'dark' ? 'light' : 'dark'
}

// Commit log

/** @type { HTMLSpanElement } */
let commitHash = document.querySelector('#commit_hash')
/** @type { HTMLSpanElement } */
let commitAuthor = document.querySelector('#commit_author')
/** @type { HTMLSpanElement } */
let commitEmail = document.querySelector('#commit_email')
/** @type { HTMLSpanElement } */
let commitDate = document.querySelector('#commit_date')

let latestCommitUrl =
  'https://api.github.com/repos/marktiedemann/marktiedemann.github.io/commits?page=1&per_page=1'

if (location.hostname !== 'localhost') {
  fetch(latestCommitUrl)
    .then(res => res.json())
    .then(commits => renderCommit(commits.shift()))
}

function renderCommit(commit) {
  commitHash.textContent = commit.sha
  commitAuthor.textContent = commit.author.login
  if (commit.author.login !== 'MarkTiedemann') {
    commitEmail.textContent = '<unknown>'
  }
  commitDate.textContent = formatGitDate(new Date(commit.commit.committer.date))
}

/**
 * Formats a JavaScript date (e.g. `2018-09-26T18:31:08.000Z`)
 * into a Git date (e.g. `Wed Sep 26 20:31:08 2018 +0200`).
 * @param {Date} date
 * @returns {string}
 */
function formatGitDate(date) {
  let weekday_dayInMonth_month_year = date.toDateString()
  let weekday_dayInMonth_month = weekday_dayInMonth_month_year.replace(/ \d+$/, '')
  let hours = leftPad(date.getHours().toString(), 2, '0')
  let minutes = leftPad(date.getMinutes().toString(), 2, '0')
  let seconds = leftPad(date.getSeconds().toString(), 2, '0')
  let time = hours + ':' + minutes + ':' + seconds
  let year = date.getFullYear()
  let offset = formatGitTimezoneOffset(date.getTimezoneOffset())
  return [weekday_dayInMonth_month, time, year, offset].join(' ')
}

/**
 * Formats a JavaScript timezone offset in minutes (e.g `-120`)
 * into a Git timezone offset (e.g. `+0200`).
 * @param {number} offsetInMinutes
 * @returns {string}
 */
function formatGitTimezoneOffset(offsetInMinutes) {
  let offsetInHours = Math.abs(Math.round(offsetInMinutes / 60)).toString()
  let offsetInHoursPadded = leftPad(offsetInHours, 2, '0')
  let offsetRemainder = (offsetInMinutes % 60).toString()
  let offsetRemainderPadded = leftPad(offsetRemainder, 2, '0')
  let prefix = offsetInMinutes > 0 ? '-' : '+'
  return prefix + offsetInHoursPadded + offsetRemainderPadded
}

/**
 * Left pad the given string with a padding string to the specified length.
 * @param {string} string
 * @param {number} length
 * @param {string} padString
 * @returns {string}
 */
function leftPad(string, length, padString) {
  if (string.padStart !== undefined) {
    // ES2017
    return string.padStart(length, padString)
  } else {
    while (string.length < length) {
      string = padString + string
    }
    return string
  }
}
