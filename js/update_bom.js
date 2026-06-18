# PowerShell replacement for update_bom.js
$ErrorActionPreference = "Stop"

function Unescape-JsonString {
    param([string]$str)
    if ($null -eq $str) { return "" }
    # Resolve unicode escape sequences like \u0119 to actual characters
    $unescaped = [regex]::Replace($str, '\\u([0-9a-fA-F]{4})', {
        param($match)
        [char][int]("0x" + $match.Groups[1].Value)
    })
    return $unescaped
}

function Format-Double {
    param([double]$val)
    return $val.ToString("G", [System.Globalization.CultureInfo]::InvariantCulture)
}

function Safe-ParseDouble {
    param([string]$str)
    if ($null -eq $str) { return 0.0 }
    $str = $str.Trim().Replace(',', '.')
    $val = 0.0
    if ([double]::TryParse($str, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$val)) {
        return $val
    }
    return 0.0
}

function Run-UpdateBom {
    Write-Host "--> Uruchamiam pancerny procesor bazy danych (Anchor-Based Engine)..."
    
    # Standard paths matching the workspace
    $bomPath = "c:\Users\Telarvin\Downloads\CONFIG-main (1)\CONFIG-main\js\bom.js"
    $csvPath = "c:\Users\Telarvin\Downloads\CONFIG-main (1)\CONFIG-main\js\product.csv"
    $outPath = "c:\Users\Telarvin\Downloads\CONFIG-main (1)\CONFIG-main\js\bom_updated.js"
    
    if (!(Test-Path $bomPath) -or !(Test-Path $csvPath)) {
        Write-Error "❌ Błąd: Upewnij się, że pliki bom.js oraz product.csv znajdują się w folderze js!"
        return
    }
    
    $bomContent = [System.IO.File]::ReadAllText($bomPath, [System.Text.Encoding]::UTF8)
    $csvContent = [System.IO.File]::ReadAllText($csvPath, [System.Text.Encoding]::UTF8)
    
    # Locate KASETON_PRICES start
    $startRegex = [regex]'const\s+KASETON_PRICES\s*=\s*\{'
    $startMatch = $startRegex.Match($bomContent)
    if (!$startMatch.Success) {
        Write-Error "❌ Błąd: Nie udało się zlokalizować początku struktury KASETON_PRICES = { w pliku bom.js!"
        return
    }
    
    # Locate anchor
    $anchorText = "function calculateWydrukArea"
    $anchorIndex = $bomContent.IndexOf($anchorText)
    if ($anchorIndex -eq -1) {
        Write-Error "❌ Błąd: Nie udało się zlokalizować funkcji kotwicy 'function calculateWydrukArea' w pliku bom.js!"
        return
    }
    
    # Locate the closing brace before the anchor
    $endIndex = $bomContent.LastIndexOf("}", $anchorIndex)
    if ($endIndex -eq -1 -or $endIndex -lt $startMatch.Index) {
        Write-Error "❌ Błąd: Rozjazd struktury klamer w pliku bom.js!"
        return
    }
    
    $startIndex = $startMatch.Index + $startMatch.Length
    $objectInnerText = $bomContent.Substring($startIndex, $endIndex - $startIndex)
    
    # Parse KASETON_PRICES into an ordered hashtable
    $prices = [ordered]@{}
    $lines = $objectInnerText -split "`r?`n"
    
    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if (!$trimmed) { continue }
        if ($trimmed -eq "};") { continue }
        
        # Regex to capture the key and body
        if ($trimmed -match '^\s*(.*?)\s*:\s*\{\s*(.*)\s*\},?$') {
            $rawKey = $Matches[1].Trim()
            $body = $Matches[2].Trim()
            
            # Resolve key quotes and escapes
            $key = $rawKey
            if ($key.StartsWith('"') -and $key.EndsWith('"')) {
                $key = $key.Substring(1, $key.Length - 2)
                $key = $key -replace '\\"', '"'
            } elseif ($key.StartsWith("'") -and $key.EndsWith("'")) {
                $key = $key.Substring(1, $key.Length - 2)
                $key = $key -replace "\\'", "'"
            }
            
            # Unescape unicode sequences in the key
            $key = Unescape-JsonString $key
            
            # Extract attributes from body
            $plnPrice = 0.0
            $plnMargin = 0.0
            $intranetId = $null
            $category = "nowo_dodane"
            $noPrice = $false
            
            if ($body -match 'plnPrice:\s*([0-9.]+)') { $plnPrice = [double]$Matches[1] }
            if ($body -match 'plnMargin:\s*([0-9.]+)') { $plnMargin = [double]$Matches[1] }
            if ($body -match 'intranetId:\s*([0-9]+)') { $intranetId = [int]$Matches[1] }
            # Match category with possible unicode escape sequences
            if ($body -match 'category:\s*"([^"]+)"') { $category = Unescape-JsonString $Matches[1] }
            if ($body -match 'noPrice:\s*true') { $noPrice = $true }
            
            $prices[$key] = [ordered]@{
                plnPrice = $plnPrice
                plnMargin = $plnMargin
                intranetId = $intranetId
                category = $category
                noPrice = $noPrice
            }
        }
    }
    
    # Process product.csv
    $csvLines = $csvContent -split "`r?`n"
    $updatedCount = 0
    $addedCount = 0
    
    # Skip header line 0
    for ($i = 1; $i -lt $csvLines.Length; $i++) {
        $line = $csvLines[$i].Trim()
        if (!$line) { continue }
        
        $columns = $line.Split(';') | ForEach-Object { $_.Trim().Trim('"') }
        if ($columns.Length -lt 34) { continue }
        
        $csvId = 0
        if (![int]::TryParse($columns[0], [ref]$csvId)) { continue }
        $csvName = $columns[3]
        $csvCostPrice = Safe-ParseDouble $columns[32]
        $csvCostMatPrice = Safe-ParseDouble $columns[33]
        
        # Search by ID
        $matchedKey = $null
        foreach ($k in $prices.Keys) {
            if ($prices[$k].intranetId -eq $csvId) {
                $matchedKey = $k
                break
            }
        }
        
        # Search by product name
        if ($null -eq $matchedKey -and $prices.Contains($csvName)) {
            $matchedKey = $csvName
        }
        
        if ($null -ne $matchedKey) {
            # Update existing
            $item = $prices[$matchedKey]
            $updated = $false
            if ($item.plnMargin -eq 0) {
                $item.plnMargin = $csvCostMatPrice
                $updated = $true
            }
            if ($item.plnPrice -eq 0) {
                if ($csvCostPrice -gt 0) {
                    $item.plnPrice = $csvCostPrice
                } else {
                    $item.plnPrice = [Math]::Round($csvCostMatPrice * 2.8, 3)
                }
                $updated = $true
            }
            if ($updated) {
                $updatedCount++
            }
        } else {
            # Create new record
            $defaultSalesPrice = if ($csvCostPrice -gt 0) { $csvCostPrice } else { [Math]::Round($csvCostMatPrice * 2.8, 3) }
            $prices[$csvName] = [ordered]@{
                plnPrice = $defaultSalesPrice
                plnMargin = $csvCostMatPrice
                intranetId = $csvId
                category = "nowo_dodane"
                noPrice = $false
            }
            $addedCount++
        }
    }
    
    # Rebuild KASETON_PRICES string
    $newObjectStr = "const KASETON_PRICES = {`n"
    foreach ($key in $prices.Keys) {
        $item = $prices[$key]
        
        # Format key safely
        $safeKey = ConvertTo-Json $key -Compress
        $plnPriceStr = Format-Double $item.plnPrice
        $plnMarginStr = Format-Double $item.plnMargin
        $intranetIdStr = if ($null -eq $item.intranetId) { "null" } else { $item.intranetId.ToString() }
        $categoryStr = ConvertTo-Json $item.category -Compress
        $noPriceStr = if ($item.noPrice) { ", noPrice: true" } else { "" }
        
        # Escape colon parsing error by concatenation
        $newObjectStr += "  " + $safeKey + ": { plnPrice: " + $plnPriceStr + ", plnMargin: " + $plnMarginStr + ", intranetId: " + $intranetIdStr + ", category: " + $categoryStr + $noPriceStr + " },`n"
    }
    $newObjectStr += "};`nwindow.KASETON_PRICES = KASETON_PRICES;`n`n"
    
    $finalBomContent = $bomContent.Substring(0, $startMatch.Index) + $newObjectStr + $bomContent.Substring($anchorIndex)
    
    # Write output as UTF-8 without BOM (standard web JS)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($outPath, $finalBomContent, $utf8NoBom)
    
    Write-Host "`n🎉 [PROCES ZAKOŃCZONY SUKCESEM]"
    Write-Host "- Uzupełniono zerowe ceny w: $updatedCount istniejących pozycjach."
    Write-Host "- Dopisano zupełnie nowych rekordów z CSV: $addedCount"
    Write-Host "- Kompletny, w pełni zaktualizowany plik zapisano jako: bom_updated.js"
}

Run-UpdateBom