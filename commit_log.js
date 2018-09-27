"use strict";
var commitHash = document.querySelector('#commit_hash');
var commitAuthor = document.querySelector('#commit_author');
var commitEmail = document.querySelector('#commit_email');
var commitDate = document.querySelector('#commit_date');
initCommitLog();
function initCommitLog() {
    var latestCommitUrl = 'https://api.github.com/repos/marktiedemann/marktiedemann.github.io/commits?page=1&per_page=1';
    if ('fetch' in window) {
        fetch(latestCommitUrl)
            .then(function (res) { return res.json(); })
            .then(function (commits) {
            var commit = commits.shift();
            commitHash.textContent = commit.sha;
            commitAuthor.textContent = commit.author.login;
            if (commit.author.login !== 'MarkTiedemann') {
                commitEmail.textContent = '<unknown_email>';
            }
            commitDate.textContent = formatGitDate(new Date(commit.commit.committer.date));
        });
    }
}
function formatGitDate(date) {
    var weekday_dayInMonth_month_year = date.toDateString();
    var weekday_dayInMonth_month = weekday_dayInMonth_month_year.replace(/ \d+$/, '');
    var hours = leftPad(date.getHours().toString(), 2, '0');
    var minutes = leftPad(date.getMinutes().toString(), 2, '0');
    var seconds = leftPad(date.getSeconds().toString(), 2, '0');
    var time = hours + ':' + minutes + ':' + seconds;
    var year = date.getFullYear();
    var offset = formatGitTimezoneOffset(date.getTimezoneOffset());
    return [weekday_dayInMonth_month, time, year, offset].join(' ');
}
function formatGitTimezoneOffset(offsetInMinutes) {
    var offsetInHours = Math.abs(Math.round(offsetInMinutes / 60)).toString();
    var offsetInHoursPadded = leftPad(offsetInHours, 2, '0');
    var offsetRemainder = (offsetInMinutes % 60).toString();
    var offsetRemainderPadded = leftPad(offsetRemainder, 2, '0');
    var prefix = offsetInMinutes > 0 ? '-' : '+';
    return prefix + offsetInHoursPadded + offsetRemainderPadded;
}
function leftPad(string, length, padString) {
    if (string.padStart !== undefined) {
        return string.padStart(length, padString);
    }
    else {
        while (string.length < length) {
            string = padString + string;
        }
        return string;
    }
}
