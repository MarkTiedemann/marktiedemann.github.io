$ErrorActionPreference = 'Stop'
$Env:Path += ';node_modules/.bin'

# Format *.{css,ts,md,json}

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
prettier --config .prettierrc --loglevel silent --write '*.{css,ts,md,json}'
Write-Host -Object "format *.{css,ts,md,json} $($stopwatch.ElapsedMilliseconds)ms"

# Build index.html

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$indexHtml = Get-Content -Path index.html -Raw

function Inline($openTag, $content, $closeTag) {
  $openIndex = $indexHtml.IndexOf($openTag)
  $preData = $indexHtml.Substring(0, $openIndex)
  $closeIndex = $indexHtml.IndexOf($closeTag, $openIndex)
  $postData = $indexHtml.Substring($closeIndex)
  $preData + $openTag + $content + $postData
}

$css = cleancss index.css
$main = marked index.md
$prevCommit = (git log -1 --pretty=format:"%H~%cn~%ce~%cd") -split '~'
$linkedData = Get-Content -Path linked_data.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress

$indexHtml = Inline '<style>' $css '</style>'
$indexHtml = Inline '<main>' $main '</main>'
$indexHtml = Inline '<span id="commit_hash">' $prevCommit[0] '</span>'
$indexHtml = Inline '<span id="commit_author">' $prevCommit[1] '</span>'
$indexHtml = Inline '<span id="commit_email">' ('&lt;' + $prevCommit[2] + '&gt;') '</span>'
$indexHtml = Inline '<span id="commit_date">' $prevCommit[3] '</span>'
$indexHtml = Inline '<script type="application/ld+json">' $linkedData '</script>'

Set-Content -Path index.html -Value $indexHtml -NoNewline
js-beautify --config .jsbeautifyrc --type html --unformatted style `
  --unformatted script --quiet --replace index.html
Write-Host -Object "build index.html $($stopwatch.ElapsedMilliseconds)ms"

# Build *.ts

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
tsc --project tsconfig.json
Write-Host -Object "build *.ts $($stopwatch.ElapsedMilliseconds)ms"

# Minify *.js

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
terser --compress --mangle --enclose --ecma 6 `
  --source-map "url='index.min.js.map'" --output index.min.js -- commit_log.js mode_toggle.js
Write-Host -Object "minify *.js $($stopwatch.ElapsedMilliseconds)ms"
