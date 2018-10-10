$ErrorActionPreference = 'Stop'
$Env:Path += ';node_modules/.bin'

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

prettier-if-modified '*.{css,ts,md,json}' -- prettier --write

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
tsc --project tsconfig.json
$js = terser --compress --mangle --enclose --ecma 6 -- commit_log.js mode_toggle.js

$indexHtml = Inline '<style>' $css '</style>'
$indexHtml = Inline '<main>' $main '</main>'
$indexHtml = Inline '<span id="commit_hash">' $prevCommit[0] '</span>'
$indexHtml = Inline '<span id="commit_author">' $prevCommit[1] '</span>'
$indexHtml = Inline '<span id="commit_email">' ('&lt;' + $prevCommit[2] + '&gt;') '</span>'
$indexHtml = Inline '<span id="commit_date">' $prevCommit[3] '</span>'
$indexHtml = Inline '<script type="text/javascript">' $js '</script>'
$indexHtml = Inline '<script type="application/ld+json">' $linkedData '</script>'

Set-Content -Path index.html -Value $indexHtml -NoNewline
js-beautify --config .jsbeautifyrc --type html --unformatted style `
  --unformatted script --quiet --replace index.html

Write-Host -Object "Done in $($stopwatch.ElapsedMilliseconds)ms."
