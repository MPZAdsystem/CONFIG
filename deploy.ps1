# ===============================================================
# deploy.ps1 - Skrypt wgrywania EXPO Builder na serwer firmowy
# Serwer: builder.adsystem.pl | Protokol: SFTP | Port: 20022
# ===============================================================
#
# UZYCIE:
#   .\deploy.ps1                    -> Wgraj wszystkie pliki
#   .\deploy.ps1 -FilesOnly         -> Wgraj tylko pliki z katalogu files/
#   .\deploy.ps1 -DryRun            -> Pokaz co zostanie wgrane (bez wgrywania)
#
# WYMAGANIA:
#   - WinSCP (zalecany) LUB OpenSSH (wbudowany w Windows 10/11)
#   - Dostep sieciowy do builder.adsystem.pl:20022
#
# ===============================================================

param(
    [switch]$FilesOnly,
    [switch]$DryRun
)

# --- KONFIGURACJA ---
$SERVER   = "builder.adsystem.pl"
$PORT     = 20022
$USER     = "builder"
$PASS     = "MatPoo33#"
$REMOTE   = "/public_html"
$LOCAL    = $PSScriptRoot  # Katalog gdzie lezy ten skrypt (root projektu)

# --- PLIKI DO WGRYWANIA ---
$deployFiles = @(
    # PHP Backend
    "index.php",
    "api_login.php",
    "api_logout.php",
    "api_check_session.php",
    "api_files.php",
    "api_save.php",

    # CSS
    "css/styles.css",

    # JavaScript
    "js/data.js",
    "js/export.js",
    "js/ui.js",
    "js/3d-builder.js",
    "js/3d-engine.js",
    "js/bom.js",
    "js/main.js",

    # Modele 3D
    "models/ctf_lacznik.gltf",
    "models/ctf_profil.gltf",

    # Binarne (geometria)
    "ctf_lacznik.bin",
    "ctf_profil.bin"
)

# Sprawdzenie czy istnieje tlo.webm (opcjonalny plik)
if (Test-Path "$LOCAL\tlo.webm") {
    $deployFiles += "tlo.webm"
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  EXPO Builder - Deploy na $SERVER" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN] Nie beda wgrywane zadne pliki." -ForegroundColor Yellow
    Write-Host ""
}

# --- METODA 1: WinSCP (preferowana) ---
$winscpPath = @(
    "${env:ProgramFiles(x86)}\WinSCP\WinSCP.com",
    "${env:ProgramFiles}\WinSCP\WinSCP.com",
    "$env:LOCALAPPDATA\Programs\WinSCP\WinSCP.com"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($winscpPath) {
    Write-Host "[INFO] Wykryto WinSCP: $winscpPath" -ForegroundColor Green
    
    # Budowanie skryptu WinSCP
    $scriptLines = @()
    $scriptLines += "open sftp://${USER}:$($PASS -replace '#','%23')@${SERVER}:${PORT}/ -hostkey=*"
    $scriptLines += "option batch abort"
    $scriptLines += "option confirm off"

    if ($FilesOnly) {
        # Tylko katalog files/
        $scriptLines += "synchronize remote `"$LOCAL\files`" `"$REMOTE/files`""
        Write-Host "[INFO] Tryb: Tylko pliki z katalogu files/" -ForegroundColor Yellow
    } else {
        # Tworzenie katalogow na serwerze
        $scriptLines += "mkdir `"$REMOTE/css`""
        $scriptLines += "mkdir `"$REMOTE/js`""
        $scriptLines += "mkdir `"$REMOTE/models`""
        $scriptLines += "mkdir `"$REMOTE/files`""

        # Wgrywanie plikow
        foreach ($file in $deployFiles) {
            $localFile = "$LOCAL\$($file -replace '/', '\')"
            $remoteFile = "$REMOTE/$file"
            
            if (Test-Path $localFile) {
                if ($DryRun) {
                    Write-Host "  [OK] $file" -ForegroundColor Green
                } else {
                    $scriptLines += "put `"$localFile`" `"$remoteFile`""
                }
            } else {
                Write-Host "  [SKIP] $file (nie znaleziono lokalnie)" -ForegroundColor DarkGray
            }
        }

        # Synchronizacja katalogu files/ jesli istnieje
        if (Test-Path "$LOCAL\files") {
            $scriptLines += "synchronize remote `"$LOCAL\files`" `"$REMOTE/files`""
        }
    }

    $scriptLines += "exit"

    if (-not $DryRun) {
        $tempScript = [System.IO.Path]::GetTempFileName()
        $scriptLines | Out-File -FilePath $tempScript -Encoding UTF8

        Write-Host ""
        Write-Host "[UPLOAD] Rozpoczynam wgrywanie..." -ForegroundColor Cyan
        & $winscpPath /script=$tempScript /log="$LOCAL\deploy_log.txt"
        
        $exitCode = $LASTEXITCODE
        Remove-Item $tempScript -ErrorAction SilentlyContinue

        if ($exitCode -eq 0) {
            Write-Host ""
            Write-Host "===================================================" -ForegroundColor Green
            Write-Host "  SUCCESS: DEPLOY ZAKONCZONY POMYSLNIE!" -ForegroundColor Green
            Write-Host "  URL: https://$SERVER/" -ForegroundColor Green
            Write-Host "===================================================" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "  ERROR: BLAD DEPLOY! Kod: $exitCode" -ForegroundColor Red
            Write-Host "  Sprawdz log: $LOCAL\deploy_log.txt" -ForegroundColor Red
        }
    }
} elseif (Get-Command sftp -ErrorAction SilentlyContinue) {
    # --- METODA 2: OpenSSH sftp (fallback) ---
    Write-Host "[INFO] Uzywam wbudowanego SFTP (OpenSSH)" -ForegroundColor Yellow
    Write-Host "[INFO] Bedziesz musial podac haslo recznie: $PASS" -ForegroundColor Yellow
    Write-Host ""

    if ($FilesOnly) {
        Write-Host "Uruchom recznie:" -ForegroundColor Cyan
        Write-Host "  sftp -P $PORT $USER@$SERVER" -ForegroundColor White
        Write-Host "  put -r files/ $REMOTE/files/" -ForegroundColor White
    } else {
        # Generowanie skryptu batch dla sftp
        $batchFile = "$LOCAL\sftp_batch.txt"
        $batchLines = @()
        $batchLines += "mkdir $REMOTE/css"
        $batchLines += "mkdir $REMOTE/js"
        $batchLines += "mkdir $REMOTE/models"
        $batchLines += "mkdir $REMOTE/files"

        foreach ($file in $deployFiles) {
            $localFile = "$LOCAL\$($file -replace '/', '\')"
            $remoteFile = "$REMOTE/$file"
            if (Test-Path $localFile) {
                $batchLines += "put `"$localFile`" `"$remoteFile`""
                if (-not $DryRun) {
                    Write-Host "  [OK] $file" -ForegroundColor Green
                }
            }
        }

        if (Test-Path "$LOCAL\files") {
            $batchLines += "put -r `"$LOCAL\files\*`" `"$REMOTE/files/`""
        }

        $batchLines += "quit"
        $batchLines | Out-File -FilePath $batchFile -Encoding UTF8

        if (-not $DryRun) {
            Write-Host ""
            Write-Host "[UPLOAD] Uruchamiam SFTP (podaj haslo: $PASS)..." -ForegroundColor Cyan
            sftp -P $PORT -b $batchFile "$USER@$SERVER"
        }

        Write-Host ""
        Write-Host "Skrypt batch zapisany: $batchFile" -ForegroundColor DarkGray
    }
} else {
    Write-Host ""
    Write-Host "  ERROR: Nie znaleziono WinSCP ani OpenSSH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Zainstaluj WinSCP:" -ForegroundColor Yellow
    Write-Host "  https://winscp.net/eng/download.php" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Lub wlacz OpenSSH w Windows:" -ForegroundColor Yellow
    Write-Host "  Ustawienia > Aplikacje > Funkcje opcjonalne > Klient OpenSSH" -ForegroundColor Cyan
}

Write-Host ""
