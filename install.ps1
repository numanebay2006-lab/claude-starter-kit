# Installs the kit for Claude Code on Windows.
#  1. Copies skills/agents/commands/rules into %USERPROFILE%\.claude (backs up existing folders)
#  2. Copies the plugin marketplace to %USERPROFILE%\.claude\student-kit\marketplace
#  3. Registers that marketplace and enables every plugin in settings.json (backed up first)
$ErrorActionPreference = "Stop"
$dest = Join-Path $env:USERPROFILE ".claude"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
New-Item -ItemType Directory -Force $dest | Out-Null

foreach ($d in "skills","agents","commands","rules") {
  $target = Join-Path $dest $d
  if (Test-Path $target) { Copy-Item $target "$target.bak-$stamp" -Recurse }
  Copy-Item (Join-Path $PSScriptRoot $d) $dest -Recurse -Force
}

$kit = Join-Path $dest "student-kit"
if (Test-Path $kit) { Remove-Item $kit -Recurse -Force }
New-Item -ItemType Directory -Force $kit | Out-Null
Copy-Item (Join-Path $PSScriptRoot "marketplace") $kit -Recurse
$mpPath = Join-Path $kit "marketplace"

$settingsFile = Join-Path $dest "settings.json"
if (Test-Path $settingsFile) {
  Copy-Item $settingsFile "$settingsFile.bak-$stamp"
  $settings = Get-Content $settingsFile -Raw | ConvertFrom-Json
} else { $settings = New-Object PSObject }
foreach ($key in "enabledPlugins","extraKnownMarketplaces") {
  if (-not ($settings.PSObject.Properties.Name -contains $key)) {
    $settings | Add-Member -NotePropertyName $key -NotePropertyValue (New-Object PSObject)
  }
}
$source = @{ source = @{ source = "directory"; path = $mpPath } }
$settings.extraKnownMarketplaces | Add-Member -NotePropertyName "student-kit" -NotePropertyValue $source -Force
$manifest = Get-Content (Join-Path $mpPath ".claude-plugin\marketplace.json") -Raw | ConvertFrom-Json
foreach ($p in $manifest.plugins) {
  $settings.enabledPlugins | Add-Member -NotePropertyName "$($p.name)@student-kit" -NotePropertyValue $true -Force
}
# Write UTF-8 without BOM: PowerShell 5.1's "utf8" adds a BOM that JSON parsers reject.
$json = $settings | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText($settingsFile, $json, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Done: $($manifest.plugins.Count) plugins enabled. Restart Claude Code."
