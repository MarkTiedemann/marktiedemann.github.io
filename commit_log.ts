let commitHash = document.querySelector('#commit_hash') as HTMLSpanElement
let commitAuthor = document.querySelector('#commit_author') as HTMLSpanElement
let commitEmail = document.querySelector('#commit_email') as HTMLSpanElement
let commitDate = document.querySelector('#commit_date') as HTMLSpanElement

interface ApiResponse {
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

let latestCommitUrl = 'https://api.github.com/repos/marktiedemann/marktiedemann.github.io/commits?page=1&per_page=1'
if ('fetch' in window) {
  fetch(latestCommitUrl)
    .then(res => res.json())
    .then((res: ApiResponse) => {
      let item = res[0]
      let author = item.commit.author
      commitHash.textContent = item.sha
      commitAuthor.textContent = author.name
      commitEmail.textContent = '<' + author.email + '>'
      commitDate.textContent = formatGitDate(new Date(author.date))
    })
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
  let offsetInHours = Math.abs(Math.round(offsetInMinutes / 60)).toString()
  let offsetInHoursPadded = leftPad(offsetInHours, 2, '0')
  let offsetRemainder = (offsetInMinutes % 60).toString()
  let offsetRemainderPadded = leftPad(offsetRemainder, 2, '0')
  let prefix = offsetInMinutes > 0 ? '-' : '+'
  return prefix + offsetInHoursPadded + offsetRemainderPadded
}

/**
 * Left pad the given string with a padding string to the specified length.
 */
function leftPad(string: string, length: number, padString: string): string {
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
