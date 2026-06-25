# Auto-push script — watches for file changes and pushes to GitHub
Write-Host "Auto-push watcher started. Save any file to trigger a push." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor Yellow

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PSScriptRoot
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite

# Ignore these folders/files
$ignore = @('.next', 'node_modules', '.git', 'autopush.ps1')

$timer = $null
$pending = $false

$action = {
    $path = $Event.SourceEventArgs.FullPath
    foreach ($ig in $ignore) {
        if ($path -like "*\$ig*") { return }
    }
    $script:pending = $true
}

Register-ObjectEvent $watcher Changed -Action $action | Out-Null
Register-ObjectEvent $watcher Created -Action $action | Out-Null
Register-ObjectEvent $watcher Deleted -Action $action | Out-Null

while ($true) {
    Start-Sleep -Seconds 5
    if ($pending) {
        $pending = $false
        Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] Changes detected — pushing to GitHub..." -ForegroundColor Cyan

        Set-Location $PSScriptRoot
        git add -A
        $msg = "auto: update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git commit -m $msg 2>&1 | Out-Null
        $result = git push 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Pushed successfully." -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Push failed: $result" -ForegroundColor Red
        }
    }
}
