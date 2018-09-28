let $commitHash = document.querySelector('#commit_hash') as HTMLSpanElement
let $commitAuthor = document.querySelector('#commit_author') as HTMLSpanElement
let $commitEmail = document.querySelector('#commit_email') as HTMLSpanElement
let $commitDate = document.querySelector('#commit_date') as HTMLSpanElement

let commitHash = localStorage.getItem('commit_hash')
let commitAuthor = localStorage.getItem('commit_author')
let commitEmail = localStorage.getItem('commit_email')
let commitDate = localStorage.getItem('commit_date')

if (commitHash !== null) $commitHash.textContent = commitHash
if (commitAuthor !== null) $commitAuthor.textContent = commitAuthor
if (commitEmail !== null) $commitEmail.textContent = commitEmail
if (commitDate !== null) $commitDate.textContent = commitDate

requestLatestCommit()

function requestLatestCommit() {
  let request = new XMLHttpRequest()
  request.timeout = 1000
  request.addEventListener('load', () => {
    if (request.status === 200) {
      renderResponse(JSON.parse(request.responseText))
    }
  })
  let latestCommitUrl = 'https://api.github.com/repos/marktiedemann/marktiedemann.github.io/commits?page=1&per_page=1'
  request.open('GET', latestCommitUrl)
  request.send()
}

interface Response {
  0: {
    sha: string
    commit: {
      author: {
        name: string
        email: string
        date: string
      }
    }
  }
}

function renderResponse(response: Response) {
  let item = response[0]
  let author = item.commit.author

  commitHash = item.sha
  commitAuthor = author.name
  commitEmail = '<' + author.email + '>'
  commitDate = formatGitDate(new Date(author.date))

  $commitHash.textContent = commitHash
  $commitAuthor.textContent = commitAuthor
  $commitEmail.textContent = commitEmail
  $commitDate.textContent = commitDate

  localStorage.setItem('commit_hash', commitHash)
  localStorage.setItem('commit_author', commitAuthor)
  localStorage.setItem('commit_email', commitEmail)
  localStorage.setItem('commit_date', commitDate)
}

/**
 * Formats a JavaScript date (e.g. `2018-09-26T18:31:08.000Z`)
 * into a Git date (e.g. `Wed Sep 26 20:31:08 2018 +0200`).
 */
function formatGitDate(date: Date): string {
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
 */
function formatGitTimezoneOffset(offsetInMinutes: number): string {
  let offsetInHours = Math.abs(Math.floor(offsetInMinutes / 60)).toString()
  let offsetRemainder = (offsetInMinutes % 60).toString()
  let offsetInHoursPadded = leftPad(offsetInHours, 2, '0')
  let offsetRemainderPadded = leftPad(offsetRemainder, 2, '0')
  let prefix = offsetInMinutes > 0 ? '-' : '+'
  return prefix + offsetInHoursPadded + offsetRemainderPadded
}

/**
 * Left pad the given string with a padding string to the specified length.
 */
function leftPad(string: string, length: number, padString: string): string {
  // TODO(future): Replace this function with ES2017 `String.prototype.padStart()`.
  while (string.length < length) {
    string = padString + string
  }
  return string
}
