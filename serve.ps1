$ErrorActionPreference = 'Stop'
$Env:Path += ';node_modules/.bin'

$port = 80
$url = "http://localhost:$port"

# Start server in background
Start-Job -ScriptBlock {
  param($location, $port)
  $ErrorActionPreference = 'Stop'
  $Env:Path += ';node_modules/.bin'

  Set-Location -Path $location
  serve --listen 80 | Out-Null
} -ArgumentList $PSScriptRoot, $port | Out-Null

# Probe until server is live
$isServing = $false
while (!$isServing) {
  try {
    Invoke-WebRequest -Uri $url -TimeoutSec 1 | Out-Null
    $isServing = $true
  }
  catch {
    $isServing = $false
  }
}

# Open the site in the browser
Write-Host -Object $url
opn $url

# Wait until server is shutdown
Get-Job | Wait-Job