param(
  [string]$ProjectPath = 'C:\Users\sabri\OneDrive\Documentos\GSR NOVO',
  [string]$OutputRoot = (Join-Path $env:USERPROFILE 'gsr-deploy-export')
)

$ErrorActionPreference = 'Stop'
$pgBin = 'C:\Program Files\PostgreSQL\18\bin'
$dumpExe = Join-Path $pgBin 'pg_dump.exe'
$restoreExe = Join-Path $pgBin 'pg_restore.exe'
$psqlExe = Join-Path $pgBin 'psql.exe'
foreach ($exe in @($dumpExe, $restoreExe, $psqlExe)) {
  if (-not (Test-Path -LiteralPath $exe)) { throw 'PostgreSQL 18 binaries not found.' }
}
$envFile = Join-Path $ProjectPath '.env.local'
$mediaDir = Join-Path $ProjectPath 'media'
if (-not (Test-Path -LiteralPath $mediaDir)) { throw 'Original media folder not found.' }
$line = Get-Content -LiteralPath $envFile | Where-Object { $_ -match '^\s*DATABASE_URI\s*=' } | Select-Object -First 1
if (-not $line) { throw 'DATABASE_URI missing in .env.local.' }
$connectionValue = ($line -replace '^\s*DATABASE_URI\s*=\s*', '').Trim().Trim('"').Trim("'")
$databaseUri = [Uri]$connectionValue
if ($databaseUri.Host -notin @('localhost', '127.0.0.1') -or $databaseUri.AbsolutePath -ne '/gsr') {
  throw 'Export blocked: expected the local gsr database.'
}
$credentialParts = $databaseUri.UserInfo.Split(':', 2)
if ($credentialParts.Count -ne 2) { throw 'Database credentials missing.' }
$pgUser = [Uri]::UnescapeDataString($credentialParts[0])
$pgPassword = [Uri]::UnescapeDataString($credentialParts[1])
$pgPort = if ($databaseUri.Port -gt 0) { [string]$databaseUri.Port } else { '5432' }
$pgArgs = @('-h', $databaseUri.Host, '-p', $pgPort, '-U', $pgUser, '-d', 'gsr')
$oldPassword = $env:PGPASSWORD
$oldOptions = $env:PGOPTIONS
try {
  $env:PGPASSWORD = $pgPassword
  $env:PGOPTIONS = '-c default_transaction_read_only=on'
  $version = & $psqlExe @pgArgs -X -At -v ON_ERROR_STOP=1 -c 'SHOW server_version_num;'
  if ($LASTEXITCODE -ne 0 -or [int]$version -lt 180000 -or [int]$version -ge 190000) {
    throw 'Export blocked: PostgreSQL 18 is required.'
  }
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $outputDir = Join-Path $OutputRoot $stamp
  if (Test-Path -LiteralPath $outputDir) { throw 'Output directory already exists.' }
  New-Item -ItemType Directory -Path $outputDir | Out-Null
  # Output is outside the repository and outside the original media directory.
  $countsSql = @'
SELECT json_build_object(
 'posts', (SELECT count(*) FROM posts),
 'services', (SELECT count(*) FROM services),
 'case_studies', (SELECT count(*) FROM case_studies),
 'testimonials', (SELECT count(*) FROM testimonials),
 'leads', (SELECT count(*) FROM leads),
 'users', (SELECT count(*) FROM users),
 'media', (SELECT count(*) FROM media)
);
'@
  $counts = & $psqlExe @pgArgs -X -At -v ON_ERROR_STOP=1 -c $countsSql
  if ($LASTEXITCODE -ne 0) { throw 'Failed to count original records.' }
  $counts | Set-Content -LiteralPath (Join-Path $outputDir 'counts-before.json') -Encoding UTF8
  $dumpPath = Join-Path $outputDir ('gsr-' + $stamp + '.dump')
  & $dumpExe @pgArgs -Fc --no-owner --no-acl -f $dumpPath
  if ($LASTEXITCODE -ne 0 -or (Get-Item -LiteralPath $dumpPath).Length -eq 0) { throw 'Database dump failed.' }
  & $restoreExe --list $dumpPath | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Dump catalog validation failed.' }
  $mediaFiles = @(Get-ChildItem -LiteralPath $mediaDir -File -Recurse -Force)
  $manifest = @($mediaFiles | ForEach-Object {
    [PSCustomObject]@{
      path = $_.FullName.Substring($mediaDir.Length + 1).Replace('\', '/')
      bytes = $_.Length
      sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
  })
  ConvertTo-Json -InputObject $manifest -Depth 4 | Set-Content -LiteralPath (Join-Path $outputDir 'media-manifest.json') -Encoding UTF8
  $mediaArchive = Join-Path $outputDir 'media.tar.gz'
  & tar.exe -czf $mediaArchive -C $ProjectPath media
  if ($LASTEXITCODE -ne 0 -or (Get-Item -LiteralPath $mediaArchive).Length -eq 0) { throw 'Media archive failed.' }
  $countsAfter = & $psqlExe @pgArgs -X -At -v ON_ERROR_STOP=1 -c $countsSql
  if ($LASTEXITCODE -ne 0) { throw 'Failed to verify final record counts.' }
  $countsAfter | Set-Content -LiteralPath (Join-Path $outputDir 'counts-after.json') -Encoding UTF8
  if ($counts -ne $countsAfter) { throw 'Record counts changed during export. Stop editing and export again.' }
  foreach ($p in @($dumpPath, $mediaArchive)) {
    $h = (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant()
    ($h + '  ' + (Split-Path $p -Leaf)) | Add-Content -LiteralPath (Join-Path $outputDir 'SHA256SUMS.txt') -Encoding ASCII
  }
  Write-Host ('Export verified: ' + $outputDir)
  Write-Host ('Media files: ' + $mediaFiles.Count)
  Write-Host 'Original database and media were read only. Do not send .env.local or passwords.'
} finally {
  $env:PGPASSWORD = $oldPassword
  $env:PGOPTIONS = $oldOptions
  $pgPassword = $null
  $connectionValue = $null
  $databaseUri = $null
  $credentialParts = $null
}
