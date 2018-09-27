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
  commitDate.textContent = formatGitDate(commit.commit.committer.date)
}

function formatGitDate(dateString) {
  let date = new Date(dateString)
  let formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    year: 'numeric',
    timeZoneName: 'short'
  })
  return formatter.format(date)
}
