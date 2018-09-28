$ErrorActionPreference = 'Stop'
$Env:Path += ';node_modules/.bin'

Write-Host http://localhost:80
opn http://localhost:80
serve --listen 80 | Out-Null