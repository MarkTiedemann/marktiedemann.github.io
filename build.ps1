$ErrorActionPreference = 'Stop'
$Env:Path += ';node_modules/.bin'

# Build index.md

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
prettier.cmd --config .prettierrc --loglevel silent --write index.md
$main = md2html.cmd index.md
Write-Host -Object "index.md $($stopwatch.ElapsedMilliseconds)ms"

# Build index.html

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
$indexHtml = Get-Content -Path index.html -Raw
$openTag = '<main>'
$closeTag = '</main>'
$openIndex = $indexHtml.IndexOf($openTag)
$preData = $indexHtml.Substring(0, $openIndex)
$closeIndex = $indexHtml.IndexOf($closeTag, $openIndex)
$postData = $indexHtml.Substring($closeIndex)
$indexHtml = $preData + $openTag + $main + $postData
Set-Content -Path index.html -Value $indexHtml -NoNewline
js-beautify.cmd --config .jsbeautifyrc --type html --quiet --replace index.html
Write-Host -Object "index.html $($stopwatch.ElapsedMilliseconds)ms"

# Build index.css

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
prettier.cmd --config .prettierrc --loglevel silent --write index.css
Write-Host -Object "index.css $($stopwatch.ElapsedMilliseconds)ms"

# Format *.ts

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
prettier.cmd --config .prettierrc --loglevel silent --write *.ts
Write-Host -Object "format *.ts $($stopwatch.ElapsedMilliseconds)ms"

# Build *.ts

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
tsc.cmd --project tsconfig.json
Write-Host -Object "build *.ts $($stopwatch.ElapsedMilliseconds)ms"

# Minify *.js

$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
# TODO: minify *.js
Write-Host -Object "minify *.js $($stopwatch.ElapsedMilliseconds)ms"
