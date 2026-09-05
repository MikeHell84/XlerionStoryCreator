<#
.SYNOPSIS
    Launcher for XlerionStoryCreator
    Auto-detects free port, starts dev server.
#>

param(
    [int]$PreferredPort = 5173,
    [switch]$NoBrowser,
    [switch]$SkipInstall
)

$ProjectDir = "X:\Programacion\XlerionStoryCreator"
$ProjectName = "XlerionStoryCreator"

Write-Host "=== $ProjectName Launcher ===" -ForegroundColor Cyan
Write-Host "Project directory: $ProjectDir" -ForegroundColor Gray

if (-not (Test-Path $ProjectDir)) {
    Write-Error "Project directory not found: $ProjectDir"
    exit 1
}

Set-Location $ProjectDir

function Find-FreePort {
    param([int]$StartPort = 5173, [int]$Count = 500)
    for ($p = $StartPort; $p -lt $StartPort + $Count; $p++) {
        $client = New-Object System.Net.Sockets.TcpClient
        try {
            $client.Connect([System.Net.IPAddress]::Loopback, $p)
            $client.Close()
            continue
        }
        catch {
            # Port is free
        }
        $client.Close()

        $listener = $null
        try {
            $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::IPv6Loopback, $p)
            $listener.Start()
            $listener.Stop()
            return $p
        }
        catch {
            if ($listener) { $listener.Stop() }
        }
    }
    $ranges = @(
        @{ Start = 3000; Count = 200 },
        @{ Start = 4000; Count = 200 },
        @{ Start = 5000; Count = 200 },
        @{ Start = 8000; Count = 200 },
        @{ Start = 9000; Count = 200 }
    )
    foreach ($r in $ranges) {
        for ($p = $r.Start; $p -lt $r.Start + $r.Count; $p++) {
            $client = New-Object System.Net.Sockets.TcpClient
            try {
                $client.Connect([System.Net.IPAddress]::Loopback, $p)
                $client.Close()
                continue
            }
            catch {
                $client.Close()
            }

            $listener = $null
            try {
                $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::IPv6Loopback, $p)
                $listener.Start()
                $listener.Stop()
                return $p
            }
            catch {
                if ($listener) { $listener.Stop() }
            }
        }
    }
    throw "Could not find free port in any range. Try specifying -PreferredPort manually."
}

$Port = Find-FreePort -StartPort $PreferredPort
Write-Host "Using port: $Port" -ForegroundColor Green

if (-not $SkipInstall -and -not (Test-Path "node_modules")) {
    if (Test-Path "package.json") {
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "npm install had issues, continuing..."
        }
    }
}

Write-Host "Starting development server on port $Port..." -ForegroundColor Green

$StartCmd = ""
if (Test-Path "package.json") {
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json
    $scripts = $pkg.scripts
    if ($scripts -and $scripts.dev -match "vite") {
        $StartCmd = "npm run dev -- --port $Port --host"
    } elseif ($scripts.dev -match "react-scripts") {
        $StartCmd = "npm start"
    } else {
        $StartCmd = "npm run dev"
    }
} else {
    # Sitio estatico + backend PHP (publish/update/data.json): preferir PHP
    if (Get-Command php -ErrorAction SilentlyContinue) {
        $StartCmd = "php -S localhost:$Port router.php"
    } else {
        $StartCmd = "python -m http.server $Port"
    }
}

Write-Host "Starting server process..." -ForegroundColor Cyan

try {
    $proc = Start-Process "cmd" -ArgumentList @("/c", $StartCmd) -PassThru -WindowStyle Hidden

    do {
        Start-Sleep -Seconds 1
    } while ($proc.HasExited -eq $false)

    Write-Host ""
    Write-Host "Server process ended." -ForegroundColor Yellow
}
catch {
    Write-Host ""
    Write-Host "Server stopped (Ctrl+C detected)." -ForegroundColor Yellow
}

if (-not $NoBrowser) {
    $Url = "http://localhost:$Port"
    Write-Host "Opening browser at $Url..." -ForegroundColor Cyan
    Start-Process $Url
}

Write-Host ""
Write-Host "$ProjectName launcher finished." -ForegroundColor Cyan
Write-Host "Port used: $Port" -ForegroundColor Cyan
