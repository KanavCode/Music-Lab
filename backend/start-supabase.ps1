param(
    [string]$EnvFile = ".env"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $EnvFile)) {
    Write-Error "Missing $EnvFile. Copy .env.example to .env and set DB_PASSWORD first."
    exit 1
}

Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()

    if ([string]::IsNullOrWhiteSpace($line)) {
        return
    }

    if ($line.StartsWith("#")) {
        return
    }

    $parts = $line.Split("=", 2)
    if ($parts.Count -ne 2) {
        return
    }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim()

    # Support quoted env values in .env files.
    if ($value.Length -ge 2) {
        $isDoubleQuoted = $value.StartsWith('"') -and $value.EndsWith('"')
        $isSingleQuoted = $value.StartsWith("'") -and $value.EndsWith("'")

        if ($isDoubleQuoted -or $isSingleQuoted) {
            $value = $value.Substring(1, $value.Length - 2)
        }
    }

    if (-not [string]::IsNullOrWhiteSpace($key)) {
        Set-Item -Path ("Env:" + $key) -Value $value
    }
}

if ([string]::IsNullOrWhiteSpace($env:DB_PASSWORD)) {
    Write-Error "DB_PASSWORD is empty in $EnvFile. Set it and run again."
    exit 1
}

if ([string]::IsNullOrWhiteSpace($env:DB_URL)) {
    Write-Error "DB_URL is missing in $EnvFile."
    exit 1
}

if ([string]::IsNullOrWhiteSpace($env:DB_USERNAME)) {
    Write-Error "DB_USERNAME is missing in $EnvFile."
    exit 1
}

Write-Host "Starting backend with Supabase datasource..."
Write-Host "DB_URL: $($env:DB_URL)"
Write-Host "DB_USERNAME: $($env:DB_USERNAME)"

./mvnw.cmd spring-boot:run
