const fs = require('fs');
const path = require('path');

const bomPath = path.join(__dirname, 'bom.js');
const csvPath = path.join(__dirname, 'product.csv');

function autoUpdateBom() {
    console.log("--> Uruchamiam pancerny procesor bazy danych (Anchor-Based Engine z obsługą CORIGIN)...");

    if (!fs.existsSync(bomPath) || !fs.existsSync(csvPath)) {
        console.error("❌ Błąd: Upewnij się, że pliki bom.js oraz product.csv znajdują się w tym samym folderze co ten skrypt!");
        return;
    }

    // Wczytanie zawartości plików
    let bomContent = fs.readFileSync(bomPath, 'utf-8');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Lokalizujemy początek bazy danych
    const startRegex = /const\s+KASETON_PRICES\s*=\s*\{/;
    const startMatch = bomContent.match(startRegex);

    if (!startMatch) {
        console.error("❌ Błąd: Nie udało się zlokalizować początku struktury KASETON_PRICES = { w pliku bom.js!");
        return;
    }

    // ⚓ KOTWICA: Szukamy funkcji rdzeniowej, która zawsze występuje tuż pod bazą danych
    const anchorText = 'function calculateWydrukArea';
    const anchorIndex = bomContent.indexOf(anchorText);

    if (anchorIndex === -1) {
        console.error("❌ Błąd: Nie udało się zlokalizować funkcji kotwicy 'function calculateWydrukArea' w pliku bom.js!");
        return;
    }

    // Cofamy się od kotwicy, aby znaleźć ostatni nawias zamykający słownik
    const endIndex = bomContent.lastIndexOf('}', anchorIndex);
    if (endIndex === -1 || endIndex < startMatch.index) {
        console.error("❌ Błąd: Rozjazd struktury klamer w pliku bom.js!");
        return;
    }

    // Wyciągamy bezpiecznie surowy środek bazy danych
    const objectInnerText = bomContent.substring(startMatch.index + startMatch[0].length, endIndex);

    // Dynamiczne i bezpieczne sparowanie starego obiektu JS do pamięci RAM
    let KASETON_PRICES;
    try {
        KASETON_PRICES = new Function(`return { ${objectInnerText} };`)();
    } catch (e) {
        console.error("❌ Błąd wewnętrznego parsowania bazy danych. Sprawdź, czy w bom.js nie ma błędów składni:", e.message);
        return;
    }

    // Przetwarzanie arkusza CSV
    const lines = csvContent.split(/\r?\n/);
    let updatedCount = 0;
    let addedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Rozbicie średnikami i oczyszczenie z cudzysłowów
        const columns = line.split(';').map(col => col.replace(/^"|"$/g, '').trim());
        if (columns.length < 43) continue; // Weryfikacja minimalnej długości linii pod kolumnę 42

        const csvId = parseInt(columns[0], 10);
        const csvName = columns[3];
        const csvCostPrice = parseFloat(columns[32]) || 0;
        const csvCostMatPrice = parseFloat(columns[33]) || 0;
        const csvOrigin = columns[42] || "Polska"; // Pobranie kraju pochodzenia (kolumna CORIGIN)

        if (isNaN(csvId)) continue;

        // Szukanie powiązania po ID (intranetId)
        let matchedKey = null;
        for (const key in KASETON_PRICES) {
            if (KASETON_PRICES[key].intranetId === csvId) {
                matchedKey = key;
                break;
            }
        }

        // Szukanie powiązania po nazwie produktu
        if (!matchedKey && KASETON_PRICES[csvName]) {
            matchedKey = csvName;
        }

        if (matchedKey) {
            // AKTUALIZACJA: Pozycja istnieje -> uzupełniamy ceny oraz wymuszamy wstrzyknięcie kraju pochodzenia
            const item = KASETON_PRICES[matchedKey];
            item.origin = csvOrigin; // Trwałe wstrzyknięcie metadanych pochodzenia

            if (item.plnPrice === 0 || item.plnMargin === 0) {
                if (item.plnMargin === 0) item.plnMargin = csvCostMatPrice;
                if (item.plnPrice === 0) {
                    item.plnPrice = csvCostPrice > 0 ? csvCostPrice : parseFloat((csvCostMatPrice * 2.8).toFixed(3));
                }
                updatedCount++;
            }
        } else {
            // NOWOŚĆ: Pozycja nie istnieje -> tworzymy nowy rekord z kompletem danych i CORIGIN
            const defaultSalesPrice = csvCostPrice > 0 ? csvCostPrice : parseFloat((csvCostMatPrice * 2.8).toFixed(3));
            KASETON_PRICES[csvName] = {
                plnPrice: defaultSalesPrice,
                plnMargin: csvCostMatPrice,
                intranetId: csvId,
                category: "nowo_dodane",
                origin: csvOrigin
            };
            addedCount++;
        }
    }

    // Budowanie nowego, zaktualizowanego stringa tekstowego dla pliku bom.js z jawnym polem origin
    let newObjectStr = "const KASETON_PRICES = {\n";
    for (const key in KASETON_PRICES) {
        const item = KASETON_PRICES[key];
        const safeKey = key.includes('"') || key.includes("'") || key.includes(' ') || key.includes('-') ? JSON.stringify(key) : `"${key}"`;

        // Zapisujemy strukturę rozszerzoną o właściwość origin
        newObjectStr += `  ${safeKey}: { plnPrice: ${item.plnPrice}, plnMargin: ${item.plnMargin}, intranetId: ${item.intranetId}, category: ${JSON.stringify(item.category || "nowo_dodane")}, origin: ${JSON.stringify(item.origin || "Polska")}${item.noPrice ? ", noPrice: true" : ""} },\n`;
    }
    newObjectStr += "};\nwindow.KASETON_PRICES = KASETON_PRICES;\n\n";

    // Scalanie pliku (zastępujemy stary blok nowym od początku deklaracji do samej kotwicy)
    const finalBomContent = bomContent.substring(0, startMatch.index) + newObjectStr + bomContent.substring(anchorIndex);

    // Zapis do bezpiecznego pliku wynikowego
    fs.writeFileSync(path.join(__dirname, 'bom_updated.js'), finalBomContent, 'utf-8');

    console.log(`\n🎉 [PROCES ZAKOŃCZONY SUKCESEM]`);
    console.log(`- Uzupełniono/Zaktualizowano pole origin w pozycjach: ${Object.keys(KASETON_PRICES).length}`);
    console.log(`- Uzupełniono zerowe ceny w: ${updatedCount} istniejących pozycjach.`);
    console.log(`- Dopisano zupełnie nowych rekordów z CSV: ${addedCount}`);
    console.log(`- Kompletny, w pełni zaktualizowany plik z obsługą walut/krajów zapisano jako: bom_updated.js`);
}

autoUpdateBom();