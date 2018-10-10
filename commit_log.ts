function documentGetElementById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T
}

function getItemLocalStorage(key: string): string | null {
  return localStorage.getItem(key)
}

function setItemLocalStorage(key: string, value: string): void {
  localStorage.setItem(key, value)
}

function setTextContent(element: Element, text: string): void {
  element.textContent = text
}

let _commitHash = 'commit_hash'
let _commitAuthor = 'commit_author'
let _commitEmail = 'commit_email'
let _commitDate = 'commit_date'

let $commitHash = documentGetElementById(_commitHash) as HTMLSpanElement
let $commitAuthor = documentGetElementById(_commitAuthor) as HTMLSpanElement
let $commitEmail = documentGetElementById(_commitEmail) as HTMLSpanElement
let $commitDate = documentGetElementById(_commitDate) as HTMLSpanElement

let commitHash = getItemLocalStorage(_commitHash)
let commitAuthor = getItemLocalStorage(_commitAuthor)
let commitEmail = getItemLocalStorage(_commitEmail)
let commitDate = getItemLocalStorage(_commitDate)

if (commitHash !== null) setTextContent($commitHash, commitHash)
if (commitAuthor !== null) setTextContent($commitAuthor, commitAuthor)
if (commitEmail !== null) setTextContent($commitEmail, commitEmail)
if (commitDate !== null) setTextContent($commitDate, commitDate)

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

  setTextContent($commitHash, commitHash)
  setTextContent($commitAuthor, commitAuthor)
  setTextContent($commitEmail, commitEmail)
  setTextContent($commitDate, commitDate)

  setItemLocalStorage(_commitHash, commitHash)
  setItemLocalStorage(_commitAuthor, commitAuthor)
  setItemLocalStorage(_commitEmail, commitEmail)
  setItemLocalStorage(_commitDate, commitDate)
}

/**
 * Format a JavaScript date (e.g. `2018-09-26T18:31:08.000Z`)
 * into a Git date (e.g. `Wed Sep 26 20:31:08 2018 +0200`).
 */
function formatGitDate(date: Date): string {
  let weekday_dayInMonth_month_year = date.toDateString()
  let weekday_dayInMonth_month = weekday_dayInMonth_month_year.replace(/ \d+$/, '')
  let hours = padTwoDigits(date.getHours().toString())
  let minutes = padTwoDigits(date.getMinutes().toString())
  let seconds = padTwoDigits(date.getSeconds().toString())
  let time = hours + ':' + minutes + ':' + seconds
  let year = date.getFullYear()
  let offset = formatGitTimezoneOffset(date.getTimezoneOffset())
  return [weekday_dayInMonth_month, time, year, offset].join(' ')
}

/**
 * Format a JavaScript timezone offset in minutes (e.g `-120`)
 * into a Git timezone offset (e.g. `+0200`).
 */
function formatGitTimezoneOffset(offsetInMinutes: number): string {
  let offsetInHours = Math.abs(Math.floor(offsetInMinutes / 60)).toString()
  let offsetRemainder = (offsetInMinutes % 60).toString()
  let offsetInHoursPadded = padTwoDigits(offsetInHours)
  let offsetRemainderPadded = padTwoDigits(offsetRemainder)
  let prefix = offsetInMinutes > 0 ? '-' : '+'
  return prefix + offsetInHoursPadded + offsetRemainderPadded
}

function padTwoDigits(string: string): string {
  return string.length < 2 ? '0' + string : string
}
