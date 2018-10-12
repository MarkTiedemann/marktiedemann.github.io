$ErrorActionPreference = 'Stop'
$Env:Path += ';node_modules/.bin'

prettier-if-modified '*.{css,ts,md,json}' -- prettier --write | ForEach-Object {
  $file = $_.Split(' ')[0]
  Write-Host "formatted $file"
}

function Hash($text) {
  $sha256 = New-Object System.Security.Cryptography.SHA256Managed
  $textBytes = [System.Text.Encoding]::UTF8.GetBytes($text)
  $hashBytes = $sha256.ComputeHash($textBytes)
  foreach ($byte in $hashBytes) {
    $hash += $byte.ToString()
  }
  $hash
}

if (Test-Path -Path .lastwrites) {
  $lastWrites = Get-Content -Path .lastwrites -Raw
  $lastWritesHash = Hash $lastWrites
  $lastWrites = $lastWrites | ConvertFrom-Json
}
else {
  $lastWrites = @{}
  $lastWritesHash = $null
}

$indexHtml = Get-Content -Path index.html -Raw
$indexHtmlHash = Hash $indexHtml

function Inline($openTag, $content, $closeTag) {
  $openIndex = $indexHtml.IndexOf($openTag)
  $preData = $indexHtml.Substring(0, $openIndex)
  $closeIndex = $indexHtml.IndexOf($closeTag, $openIndex)
  $postData = $indexHtml.Substring($closeIndex)
  $preData + $openTag + $content + $postData
}

function Build($files, $command) {
  $shouldBuild = @()
  $shouldRebuild = @()
  foreach ($file in $files) {
    $lastRecordedWrite = $lastWrites.$file
    $actualLastWrite = (Get-Item -Path $file).LastWriteTime
    $lastWrites | Add-Member -NotePropertyName $file -NotePropertyValue $actualLastWrite -Force
    if ($null -ne $lastRecordedWrite) {
      $lastRecordedWrite = Get-Date -Date $lastRecordedWrite
      if ($lastRecordedWrite -ne $actualLastWrite) {
        $shouldRebuild += $file
      }
    }
    else {
      $shouldBuild += $file
    }
  }
  if ($shouldBuild.Length -gt 0 -or $shouldRebuild.Length -gt 0) {
    $result = & $command
    foreach ($build in $shouldBuild) {
      Write-Host "built $build"
    }
    foreach ($rebuild in $shouldRebuild) {
      Write-Host "rebuilt $rebuild"
    }
    $result
  }
  else {
    $indexHtml
  }
}

$indexHtml = Build @('index.css') {
  $css = cleancss index.css
  Inline '<style>' $css '</style>'
}

$indexHtml = Build @('index.md') {
  $main = marked index.md
  Inline '<main>' $main '</main>'
}

$indexHtml = Build @('ld.json') {
  $ld = Get-Content -Path ld.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress
  Inline '<script type="application/ld+json">' $ld '</script>'
}

Build @('commit_log.ts', 'mode_toggle.ts') {
  tsc
} | Out-Null

$indexHtml = Build @('commit_log.js', 'mode_toggle.js') {
  $js = terser --compress --mangle --enclose --ecma 5 -- commit_log.js mode_toggle.js
  Inline '<script type="text/javascript">' $js '</script>'
}

$commit = (git log -1 --pretty=format:'%H~%cn~%ce~%cd') -split '~'
$indexHtml = Inline '<span id="commit_hash">' $commit[0] '</span>'
$indexHtml = Inline '<span id="commit_author">' $commit[1] '</span>'
$indexHtml = Inline '<span id="commit_email">' ('&lt;' + $commit[2] + '&gt;') '</span>'
$indexHtml = Inline '<span id="commit_date">' $commit[3] '</span>'

if ($indexHtmlHash -ne (Hash $indexHtml)) {
  Set-Content -Path index.html -Value $indexHtml -NoNewline
  Write-Host "rebuilt index.html"
  js-beautify --config .jsbeautifyrc --type html --unformatted style `
    --unformatted script --quiet --replace index.html
  Write-Host "formatted index.html"
}

$lastWrites = $lastWrites | ConvertTo-Json
if ($null -ne $lastWritesHash) {
  if ($lastWritesHash -ne (Hash $lastWrites)) {
    Set-Content -Path .lastwrites -Value $lastWrites -NoNewline
    Write-Host "rebuilt .lastwrites"
  }
}
else {
  Set-Content -Path .lastwrites -Value $lastWrites -NoNewline
  Write-Host "built .lastwrites"
}
