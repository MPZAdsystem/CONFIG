function removeSuspended(index, e) { e.stopPropagation(); plan.splice(index, 1); render(); }

function toggleAccDir(planIndex, accIndex, e) { e.stopPropagation(); plan[planIndex].accessories[accIndex].dir *= -1; render(); }

function removeAccessory(planIndex, accIndex, e) { e.stopPropagation(); plan[planIndex].accessories.splice(accIndex, 1); render(); }

function toggleLegAccDir(pIdx, aIdx, legAccIdx, e) {
    e.stopPropagation(); plan[pIdx].accessories[aIdx].accessories[legAccIdx].dir *= -1; render();
}

function removeLegAccessory(pIdx, aIdx, legAccIdx, e) {
    e.stopPropagation(); plan[pIdx].accessories[aIdx].accessories.splice(legAccIdx, 1); render();
}

// Kod do wklejenia wewnątrz funkcji executePDFGeneration()

function removeSuspended(index, e) { e.stopPropagation(); plan.splice(index, 1); render(); }

function toggleAccDir(planIndex, accIndex, e) { e.stopPropagation(); plan[planIndex].accessories[accIndex].dir *= -1; render(); }

function removeAccessory(planIndex, accIndex, e) { e.stopPropagation(); plan[planIndex].accessories.splice(accIndex, 1); render(); }

function toggleLegAccDir(pIdx, aIdx, legAccIdx, e) {
    e.stopPropagation(); plan[pIdx].accessories[aIdx].accessories[legAccIdx].dir *= -1; render();
}

function removeLegAccessory(pIdx, aIdx, legAccIdx, e) {
    e.stopPropagation(); plan[pIdx].accessories[aIdx].accessories.splice(legAccIdx, 1); render();
}

async function executePDFGeneration() {
    isPdfGenerating = true; cancelPdfGeneration = false;
    document.getElementById('pdfModalButtons').style.display = 'none';
    document.getElementById('pdfLoadingStatus').style.display = 'block';

    const updateProgress = (percent, text) => {
        const bar = document.getElementById('pdfProgressBar');
        if (bar) { bar.style.width = percent + '%'; bar.style.background = "var(--led-color)"; bar.style.boxShadow = "0 0 10px var(--led-color)"; }
        const pt = document.getElementById('pdfProgressText'); if (pt) pt.innerText = text;
    };

    const curCode = document.getElementById('pdfCurrency').value;
    const lang = document.getElementById('pdfLang').value;
    const isAgency = document.getElementById('pdfClientType').value === 'agency';

    let rate = 1; let sym = '€';
    const dynamicPln = window.KURS_PLN_DYNAMIC || 4.20;
    const dynamicUsd = window.KURS_USD_DYNAMIC || 1.15;

    if (curCode === 'PLN') { rate = dynamicPln; sym = 'PLN'; }
    else if (curCode === 'USD') { rate = dynamicUsd; sym = '$'; }

    const i18n = {
        PL: { title: "OFERTA I SPECYFIKACJA", proj: "Projekt:", date: "Data:", client: "Klient:", cost: "KOSZTORYS I ZESTAWIENIE", elem: "Element", dim: "Wymiary / Wytyczne", qty: "Ilość", priceBase: "Cena katalogowa", priceDisc: isAgency ? "Cena po rabacie" : "Cena", val: "Wartość", total: "ŁĄCZNIE (Netto):", savings: "Oszczędzasz:", tech: "SPECYFIKACJA TECHNICZNA", layout: "RZUT Z GÓRY (LAYOUT 2D)" },
        ENG: { title: "OFFER & SPECIFICATION", proj: "Project:", date: "Date:", client: "Client:", cost: "BILL OF MATERIALS", elem: "Item", dim: "Dimensions / Guidelines", qty: "Qty", priceBase: "List Price", priceDisc: isAgency ? "Discounted Price" : "Unit Price", val: "Total", total: "GRAND TOTAL (Net):", savings: "You save:", tech: "TECHNICAL SPECIFICATION", layout: "TOP VIEW (2D LAYOUT)" }
    };
    const t = i18n[lang] || i18n['ENG'];

    updateProgress(5, "⏳ Inicjalizacja silnika PDF...");
    await new Promise(r => setTimeout(r, 100));

    const container3D = document.getElementById('stage3DContainer');
    const was3DMode = is3DMode; const originalDimState = showDimensions; const originalBlueState = isBlueprintMode;

    const abortPdf = () => {
        if (!was3DMode) { is3DMode = false; container3D.style.display = 'none'; container3D.style.opacity = '1'; }
        showDimensions = originalDimState; isBlueprintMode = originalBlueState;
        if (human3DModel) human3DModel.visible = true; // Przywrócenie człowieka w razie awarii
        if (is3DMode) update3DScene();
        isPdfGenerating = false;
        document.getElementById('pdfModalOverlay').style.display = 'none'; document.getElementById('pdfModalButtons').style.display = 'flex'; document.getElementById('pdfLoadingStatus').style.display = 'none';
    };

    if (cancelPdfGeneration) return abortPdf();

    const { jsPDF } = window.jspdf; const doc = new jsPDF('p', 'mm', 'a4');

    try {
        if (window.pdfMake && window.pdfMake.vfs && window.pdfMake.vfs["Roboto-Regular.ttf"]) {
            doc.addFileToVFS("Roboto-Regular.ttf", window.pdfMake.vfs["Roboto-Regular.ttf"]); doc.addFont("Roboto-Regular.ttf", "Roboto", "normal"); doc.setFont("Roboto", "normal");
        }
    } catch (e) { }

    const pageWidth = doc.internal.pageSize.getWidth(); const pageHeight = doc.internal.pageSize.getHeight();
    const pName = document.getElementById('projectName').value || 'System_EXPO'; const cName = document.getElementById('customerName').value || '...';

    const applyDarkThemeAndFooter = (pageNo, sectionTitle) => {
        doc.setFillColor(18, 18, 18); doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setDrawColor(255, 0, 128); doc.setLineWidth(1.5); doc.line(15, 25, pageWidth - 15, 25);
        doc.setFontSize(22); doc.setTextColor(255, 255, 255); doc.text(sectionTitle, 15, 20);
        doc.setLineWidth(0.5); doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
        doc.setFontSize(8); doc.setTextColor(100, 100, 100); doc.text("EXPO Builder PRO - Generated Automatically", 15, pageHeight - 10); doc.text(`${pageNo}`, pageWidth - 20, pageHeight - 10);
    };

    const applyLightThemeAndFooter = (pageNo, sectionTitle) => {
        doc.setDrawColor(42, 117, 211); doc.setLineWidth(1.5); doc.line(15, 25, pageWidth - 15, 25);
        doc.setFontSize(22); doc.setTextColor(33, 33, 33); doc.text(sectionTitle, 15, 20);
        doc.setLineWidth(0.5); doc.setDrawColor(220, 220, 220); doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
        doc.setFontSize(8); doc.setTextColor(120, 120, 120); doc.text("EXPO Builder PRO - Generated Automatically", 15, pageHeight - 10); doc.text(`${pageNo}`, pageWidth - 20, pageHeight - 10);
    };

    if (!was3DMode) {
        updateProgress(15, "🔧 Wybudzanie rdzenia 3D...");
        is3DMode = true; container3D.style.display = 'block';
        container3D.style.opacity = (document.getElementById('pdfScreenshotMode').value === 'manual') ? '1' : '0';
        if (!scene) init3D();
        renderer.setSize(container3D.clientWidth, container3D.clientHeight);
        await new Promise(r => setTimeout(r, 400));
    }
    if (cancelPdfGeneration) return abortPdf();

    let imgDataLeft, imgDataRight;
    const pdfScreenshotMode = document.getElementById('pdfScreenshotMode').value;

    if (pdfScreenshotMode === 'manual') {
        document.getElementById('pdfModalOverlay').style.display = 'none';
        try {
            const images = await captureManualScreenshots();
            imgDataLeft = images[0]; imgDataRight = images[1];
            document.getElementById('pdfModalOverlay').style.display = 'flex';
        } catch (e) { return abortPdf(); }
    } else {
        updateProgress(30, "📸 Renderowanie rzutu lewego (-30°)...");
        showDimensions = false; isBlueprintMode = false; update3DScene();
        await new Promise(r => setTimeout(r, 400));
        imgDataLeft = autoFrameForScreenshot(-30);

        updateProgress(45, "📸 Renderowanie rzutu prawego (+30°)...");
        imgDataRight = autoFrameForScreenshot(30);
    }

    let ratio = renderer.domElement.height / renderer.domElement.width;
    if (cancelPdfGeneration) return abortPdf();

    // ===================================
    // RZUT TECHNICZNY 3D (ZABEZPIECZONY I OCZYSZCZONY)
    // ===================================
    updateProgress(60, "📐 Przeliczanie inżynierii technicznej...");
    showDimensions = true; isBlueprintMode = true;

    // ZMIANA: Ukrywamy trójwymiarowy model człowieka przed wygenerowaniem rzutu technicznego
    if (human3DModel) human3DModel.visible = false;

    update3DScene();

    scene.background = new THREE.Color(0x000000);
    if (windowGridHelper) windowGridHelper.visible = false;
    sceneObjects.forEach(obj => {
        const tBox = new THREE.Box3().setFromObject(obj);
        if (tBox.getSize(new THREE.Vector3()).x > 3000) obj.visible = false;
    });

    // ZMIANA: Wydłużone opóźnienie do 800ms, aby sterownik GPU zdążył przetworzyć geometrię dużych projektów
    await new Promise(r => setTimeout(r, 800));
    let imgDataTech = autoFrameForScreenshot(-30);

    // Przywracamy widoczność człowieka dla sceny runtime
    if (human3DModel) human3DModel.visible = true;

    if (cancelPdfGeneration) return abortPdf();

    if (!was3DMode) { is3DMode = false; container3D.style.display = 'none'; container3D.style.opacity = '1'; }
    showDimensions = originalDimState; isBlueprintMode = originalBlueState;
    if (is3DMode) update3DScene();

    let tableData = []; let totalFinal = 0; let totalBase = 0;
    const discountPercent = parseFloat(document.getElementById('discountInput').value) || 0;

    for (let name in globalCounts) {
        let item = globalCounts[name];
        let itemName = (lang !== 'PL') ? (Object.values(DB).find(e => e.name === name)?.labelEN || name) : name;
        let priceObj = typeof getPriceForRole === 'function' ? getPriceForRole(name) : { basePrice: item.unitPrice, price: item.unitPrice };
        let baseRowUnit = priceObj.basePrice * rate;
        let finalRowUnit = priceObj.price * rate * (1 - (discountPercent / 100));

        totalBase += (baseRowUnit * item.qty); totalFinal += (finalRowUnit * item.qty);

        let dimText = "-";
        let baseObj = Object.values(DB).find(e => e.name === name);
        if (baseObj && (baseObj.width || baseObj.length)) {
            dimText = `${baseObj.width || baseObj.length} x ${baseObj.height || baseObj.depth} cm`;
        }
        if (typeof guidelineLinks !== 'undefined' && guidelineLinks[name]) {
            dimText = "Pobierz wytyczne";
        }

        if (isAgency) tableData.push([itemName, dimText, `${item.qty}`, `${baseRowUnit.toFixed(2)} ${sym}`, `${finalRowUnit.toFixed(2)} ${sym}`, `${(finalRowUnit * item.qty).toFixed(2)} ${sym}`]);
        else tableData.push([itemName, dimText, `${item.qty}`, `${finalRowUnit.toFixed(2)} ${sym}`, `${(finalRowUnit * item.qty).toFixed(2)} ${sym}`]);
    }

    const selectedTheme = document.getElementById('pdfTheme') ? document.getElementById('pdfTheme').value : 'white';

    if (selectedTheme === 'white') {
        // ========================================================
        // ⚪ SZATA GRAFICZNA: BIAŁA
        // ========================================================
        updateProgress(75, "🖨️ Formatowanie dokumentu PDF (Szata Biała)...");
        applyLightThemeAndFooter(1, t.title);

        doc.setFontSize(11); doc.setTextColor(50, 50, 50);
        doc.text(`${t.proj} ${pName}`, 15, 33);
        doc.text(`${t.date} ${new Date().toLocaleDateString()}`, 15, 39);
        doc.text(`${t.client} ${cName}`, pageWidth - 80, 33);

        const origAddPage = doc.addPage.bind(doc);
        doc.addPage = function (...args) {
            origAddPage(...args);
            applyLightThemeAndFooter(doc.internal.getNumberOfPages(), t.cost);
        };

        doc.autoTable({
            startY: 46, head: isAgency ? [[t.elem, t.dim, t.qty, t.priceBase, t.priceDisc, t.val]] : [[t.elem, t.dim, t.qty, t.priceDisc, t.val]],
            body: tableData, theme: 'grid', styles: { font: 'Roboto', fontSize: 10, cellPadding: 4, valign: 'middle' },
            headStyles: { fillColor: [42, 117, 211], textColor: 255, fontStyle: 'normal', halign: 'center' },
            bodyStyles: { fillColor: [255, 255, 255], textColor: 33, lineColor: [220, 220, 220] },
            alternateRowStyles: { fillColor: [248, 249, 250] },
            columnStyles: isAgency ? { 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right', textColor: [42, 117, 211] }, 6: { halign: 'right' } } : { 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 1 && data.cell.text[0] === "Pobierz wytyczne") {
                    data.cell.styles.textColor = [0, 110, 220]; data.cell.styles.fontStyle = 'bold';
                }
            },
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 1 && data.cell.text[0] === "Pobierz wytyczne") {
                    const rowItemName = data.row.raw[0];
                    const origName = Object.keys(globalCounts).find(n => {
                        let loc = (lang !== 'PL') ? (Object.values(DB).find(e => e.name === n)?.labelEN || n) : n;
                        return loc === rowItemName;
                    }) || rowItemName;
                    if (typeof guidelineLinks !== 'undefined' && guidelineLinks[origName]) {
                        doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: guidelineLinks[origName] });
                    }
                }
            }
        });

        doc.addPage = origAddPage;

        let finalY = doc.lastAutoTable.finalY + 15;
        if (finalY > 260) { doc.addPage(); applyLightThemeAndFooter(doc.internal.getNumberOfPages(), t.cost); finalY = 35; }

        doc.setFontSize(14); doc.setTextColor(33, 33, 33); doc.text(t.total, 110, finalY);
        doc.setTextColor(42, 117, 211); doc.text(`${totalFinal.toFixed(2)} ${sym}`, 160, finalY);
        if (isAgency && (totalBase > totalFinal)) {
            doc.setFontSize(11); doc.setTextColor(120, 120, 120); doc.text(t.savings, 110, finalY + 8);
            doc.setTextColor(42, 117, 211); doc.text(`${(totalBase - totalFinal).toFixed(2)} ${sym}`, 160, finalY + 8);
        }

        // ═══════════════════════════════════════════════════════════
        // ⚪ STRONA 2: DWUKOLUMNOWY UKŁAD KAFELKOWY 2x2
        // ═══════════════════════════════════════════════════════════
        updateProgress(85, "🗺️ Generowanie rysunków technicznych i kafelków wizualizacji...");
        doc.addPage();
        applyLightThemeAndFooter(doc.internal.getNumberOfPages(), lang === 'PL' ? "WIZUALIZACJE I SPECYFIKACJE" : "VISUALIZATIONS & SPECS");

        const tileW = 86; const tileH = 60;
        const leftX = 15; const rightX = 109;

        doc.setDrawColor(210, 215, 225); doc.setLineWidth(0.3);
        doc.setFontSize(10); doc.setTextColor(80, 80, 80);

        if (imgDataLeft && imgDataRight) {
            doc.addImage(imgDataLeft, 'JPEG', leftX, 35, tileW, tileH);
            doc.rect(leftX, 35, tileW, tileH, 'S');
            doc.text(lang === 'PL' ? "Wizualizacja poglądowa 1" : "Perspective View 1", leftX, 35 + tileH + 5);

            doc.addImage(imgDataRight, 'JPEG', rightX, 35, tileW, tileH);
            doc.rect(rightX, 35, tileW, tileH, 'S');
            doc.text(lang === 'PL' ? "Wizualizacja poglądowa 2" : "Perspective View 2", rightX, 35 + tileH + 5);
        }

        const bottomY = 112;

        // ZMIANA: Dodano klasę '.man2DElement' (ikonka człowieka) do selektora ukrywania warstw interfejsu rzutu 2D
        const hiddenElements = document.querySelectorAll('.light-toggle-btn, .studio-light-2d, .turn-toggle-btn, .acc-controls, .sego-joint, #man2DElement');
        hiddenElements.forEach(el => el.style.display = 'none');

        const blueprintStyle = document.createElement('style');
        blueprintStyle.id = 'pdf-temp-blueprint-style';
        blueprintStyle.innerHTML = `
            #stage, #stage * { 
                color: #ffffff !important; 
                border-color: #ffffff !important; 
                box-shadow: none !important;
                text-shadow: none !important;
            }
            .total-dim-2d { border-color: #ffffff !important; color: #ffffff !important; }
        `;
        document.head.appendChild(blueprintStyle);

        await new Promise(r => setTimeout(r, 150));
        if (cancelPdfGeneration) { blueprintStyle.remove(); hiddenElements.forEach(el => el.style.display = ''); return abortPdf(); }

        try {
            const stageDiv = document.getElementById('stage');
            const canvas2D = await html2canvas(stageDiv, { scale: 2, backgroundColor: "#0a1a35" });
            doc.addImage(canvas2D.toDataURL('image/png'), 'PNG', leftX, bottomY, tileW, tileH);
            doc.setDrawColor(210, 215, 225); doc.rect(leftX, bottomY, tileW, tileH, 'S');
            doc.text(t.layout, leftX, bottomY + tileH + 5);
        } catch (e) { doc.text("Brak danych rzutu 2D.", leftX, bottomY + 15); }

        blueprintStyle.remove();
        hiddenElements.forEach(el => el.style.display = '');

        if (imgDataTech) {
            doc.addImage(imgDataTech, 'JPEG', rightX, bottomY, tileW, tileH);
            doc.setDrawColor(210, 215, 225); doc.rect(rightX, bottomY, tileW, tileH, 'S');
            doc.text(lang === 'PL' ? "Rzut techniczny z wymiarami" : "Technical Dimensions 3D", rightX, bottomY + tileH + 5);
        }

    } else {
        // ========================================================
        // ⬛ SZATA GRAFICZNA: CZARNA
        // ========================================================
        updateProgress(75, "🖨️ Formatowanie dokumentu PDF (Szata Ciemna)...");
        applyDarkThemeAndFooter(1, t.title);
        doc.setFontSize(11); doc.setTextColor(200, 200, 200);
        doc.text(`${t.proj} ${pName}`, 15, 33); doc.text(`${t.date} ${new Date().toLocaleDateString()}`, 15, 39); doc.text(`${t.client} ${cName}`, pageWidth - 80, 33);

        if (imgDataLeft && imgDataRight) {
            const imgW = 180; let imgH = imgW * ratio; if (imgH > 105) imgH = 105;
            doc.addImage(imgDataLeft, 'JPEG', 15, 45, imgW, imgH);
            doc.setDrawColor(255, 0, 128); doc.setLineWidth(0.3); doc.rect(15, 45, imgW, imgH, 'S');
            const secondY = 45 + imgH + 8;
            doc.addImage(imgDataRight, 'JPEG', 15, secondY, imgW, imgH);
            doc.rect(15, secondY, imgW, imgH, 'S');
        }

        doc.addPage(); applyDarkThemeAndFooter(2, t.cost);

        const origAddPage = doc.addPage.bind(doc);
        doc.addPage = function (...args) {
            origAddPage(...args); applyDarkThemeAndFooter(doc.internal.getNumberOfPages(), t.cost);
        };

        doc.autoTable({
            startY: 35, head: isAgency ? [[t.elem, t.dim, t.qty, t.priceBase, t.priceDisc, t.val]] : [[t.elem, t.dim, t.qty, t.priceDisc, t.val]],
            body: tableData, theme: 'grid', styles: { font: 'Roboto', fontSize: 10, cellPadding: 4, valign: 'middle' },
            headStyles: { fillColor: [255, 0, 128], textColor: 255, fontStyle: 'normal', halign: 'center' }, bodyStyles: { fillColor: [30, 30, 30], textColor: 230, lineColor: [50, 50, 50] }, alternateRowStyles: { fillColor: [22, 22, 22] },
            columnStyles: isAgency ? { 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right', textColor: [255, 0, 128] }, 5: { halign: 'right' } } : { 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 1 && data.cell.text[0] === "Pobierz wytyczne") {
                    data.cell.styles.textColor = [0, 210, 255]; data.cell.styles.fontStyle = 'bold';
                }
            },
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 1 && data.cell.text[0] === "Pobierz wytyczne") {
                    const rowItemName = data.row.raw[0];
                    const origName = Object.keys(globalCounts).find(n => {
                        let loc = (lang !== 'PL') ? (Object.values(DB).find(e => e.name === n)?.labelEN || n) : n;
                        return loc === rowItemName;
                    }) || rowItemName;
                    if (typeof guidelineLinks !== 'undefined' && guidelineLinks[origName]) {
                        doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: guidelineLinks[origName] });
                    }
                }
            }
        });

        doc.addPage = origAddPage;

        let finalY = doc.lastAutoTable.finalY + 15;
        if (finalY > 260) { doc.addPage(); applyDarkThemeAndFooter(doc.internal.getNumberOfPages(), t.cost); finalY = 35; }

        doc.setFontSize(14); doc.setTextColor(230, 230, 230); doc.text(t.total, 110, finalY);
        doc.setTextColor(255, 0, 128); doc.text(`${totalFinal.toFixed(2)} ${sym}`, 160, finalY);
        if (isAgency && (totalBase > totalFinal)) {
            doc.setFontSize(11); doc.setTextColor(150, 150, 150); doc.text(t.savings, 110, finalY + 8);
            doc.setTextColor(0, 210, 255); doc.text(`${(totalBase - totalFinal).toFixed(2)} ${sym}`, 160, finalY + 8);
        }

        if (imgDataTech) {
            doc.addPage(); applyDarkThemeAndFooter(doc.internal.getNumberOfPages(), t.tech);
            const maxW = 180; let finalH = maxW * ratio; if (finalH > 220) finalH = 220;
            doc.addImage(imgDataTech, 'JPEG', 15, 35, maxW, finalH);
            doc.setDrawColor(255, 0, 128); doc.rect(15, 35, maxW, finalH, 'S');
        }

        updateProgress(85, "🗺️ Skanowanie czystej architektury 2D...");
        const hiddenElements = document.querySelectorAll('.light-toggle-btn, .studio-light-2d, .turn-toggle-btn, .acc-controls, .sego-joint');
        hiddenElements.forEach(el => el.style.display = 'none');

        await new Promise(r => setTimeout(r, 200));
        if (cancelPdfGeneration) { hiddenElements.forEach(el => el.style.display = ''); return abortPdf(); }

        doc.addPage(); applyDarkThemeAndFooter(doc.internal.getNumberOfPages(), t.layout);
        try {
            const stageDiv = document.getElementById('stage');
            const canvas2D = await html2canvas(stageDiv, { scale: 2, backgroundColor: "#121212" });
            const ratio2D = canvas2D.height / canvas2D.width;
            const maxW = 180; let finalH = maxW * ratio2D; if (finalH > 220) finalH = 220;
            doc.addImage(canvas2D.toDataURL('image/png'), 'PNG', 15, 35, maxW, finalH);
            doc.setDrawColor(255, 0, 128); doc.rect(15, 35, maxW, finalH, 'S');
        } catch (e) { doc.text("Brak danych rzutu 2D.", 15, 45); }
        hiddenElements.forEach(el => el.style.display = '');
    }

    // =========================================================================
    // AUTOMATYCZNE STAPLOWANIE ZAŁĄCZNIKA OFERTY Z GITHUB RAW
    // =========================================================================
    updateProgress(90, "📥 Pobieranie oficjalnych załączników firmy z repozytorium...");
    const GITHUB_APPEND_URL = "https://raw.githubusercontent.com/MPZAdsystem/CONFIG/main/Oferta/OF%20SEGO.pdf.pdf";

    try {
        const response = await fetch(GITHUB_APPEND_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`Serwer GitHub zwrócił status: ${response.status}`);

        const externalBuffer = await response.arrayBuffer();
        const externalPdf = await pdfjsLib.getDocument({ data: new Uint8Array(externalBuffer) }).promise;
        const totalAppendPages = externalPdf.numPages;

        for (let pageNum = 1; pageNum <= totalAppendPages; pageNum++) {
            const currentProgress = 90 + Math.round((pageNum / totalAppendPages) * 9);
            updateProgress(currentProgress, `📄 Scalanie dokumentów: Dołączanie strony ${pageNum} z ${totalAppendPages}...`);

            const page = await externalPdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });

            const appendCanvas = document.createElement('canvas');
            appendCanvas.width = viewport.width;
            appendCanvas.height = viewport.height;
            const appendCtx = appendCanvas.getContext('2d');

            await page.render({ canvasContext: appendCtx, viewport: viewport }).promise;
            const pageImgData = appendCanvas.toDataURL('image/jpeg', 0.92);

            doc.addPage();
            doc.addImage(pageImgData, 'JPEG', 0, 0, pageWidth, pageHeight);

            appendCanvas.width = 0;
            appendCanvas.height = 0;
        }
        updateProgress(100, "✅ Operacja zakończona! Pobieranie pliku...");
        await new Promise(r => setTimeout(r, 300));

    } catch (appendError) {
        console.error("[Architect Fallback] Wykryto błąd podsystemu staplowania:", appendError);
        doc.addPage();
        doc.setFont("Roboto", "normal");
        doc.setFontSize(13);
        doc.setTextColor(235, 59, 90);
        doc.text("⚠️ [BŁĄD SYSTEMU INTEGRACJI DOKUMENTÓW]:", 15, 45);
        doc.setFontSize(10);
        doc.setTextColor(170, 170, 170);
        doc.text(`Nie udało się automatycznie dołączyć pliku specyfikacji handlowej: OF SEGO.pdf.pdf`, 15, 53);
        doc.text(`Powód anomalii: ${appendError.message}`, 15, 59);
    }

    doc.save(`Oferta_EXPO_${pName.replace(/\s+/g, '_')}.pdf`);
    abortPdf();
}

async function sendTicket() {
    const btn = document.querySelector('.btn-send');
    const data = {
        date: new Date().toLocaleString('pl-PL'),
        type: document.getElementById('ticketType').value,
        priority: document.getElementById('ticketPriority').value,
        description: document.getElementById('ticketDescription').value,
        author: document.getElementById('ticketAuthor').value
    };

    if (!data.description || !data.author) {
        alert("Proszę wypełnić opis i podać autora!");
        return;
    }

    btn.innerText = "Wysyłanie...";
    btn.disabled = true;

    try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXwLqKo2jTxHt4NryosZkRbwS2h4Ze8mLTWMR1xYX1Pt6UWAgexk4am4-sI8lA3rJEVg/exec';

        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        alert("Zgłoszenie zostało wysłane!");
        document.getElementById('ticketModal').style.display = 'none';
        document.getElementById('ticketDescription').value = "";
    } catch (error) {
        console.error(error);
        alert("Błąd podczas wysyłki!");
    } finally {
        btn.innerText = "Wyślij zgłoszenie";
        btn.disabled = false;
    }
}

async function exportToSheets() {
    let exportItems = {};
    for (let name in globalCounts) {
        let catNo = null;
        if (name === "Moduł 300x250") catNo = DB.sego300x250.catNo; else if (name === "Moduł 200x250") catNo = DB.sego200x250.catNo;
        else if (name === "Moduł 100x250" || name === "- Daszek: Moduł 100x250 (Dach)") catNo = DB.sego100x250.catNo; else if (name === "Moduł 85x250") catNo = DB.sego85x250.catNo;
        else if (name === "SEGO Door 100 (H:250)") catNo = DB.door100.catNo; else if (name === "Moduł 300x300") catNo = DB.sego300x300.catNo;
        else if (name === "Moduł 200x300") catNo = DB.sego200x300.catNo; else if (name === "Moduł 100x300" || name === "- Daszek: Moduł 100x300 (Noga)") catNo = DB.sego100x300.catNo;
        else if (name === "Moduł 85x300") catNo = DB.sego85x300.catNo; else if (name === "Panel TV") catNo = DB.tvPanel.catNo;
        else if (name === "Shelf Kit") catNo = DB.shelfKit.catNo; else if (name === "- Daszek: Bridge Connector" || name === "Bridge Connector") catNo = DB.bridge.catNo;
        else if (name === "łącznik prosty (Clamp)") catNo = DB.clamp.catNo;
        else if (name === "łącznik kątowy (wew/zew)") catNo = DB.wewzew.catNo;
        else if (name === "SEGO łącznik zewnętrzny L") catNo = DB.zewzew.catNo;
        else if (name === "Mini Foot" || name === "Mini Foot (Kantorek)") catNo = DB.miniFoot.catNo; else if (name === "Extension Cable") catNo = DB.extCable.catNo;
        else if (name === "AdTribune Expo 100x100") catNo = DB.adTribuneExpo.catNo; else if (name === "adUp Vario quadfloat") catNo = DB.adUpQuadfloat.catNo;
        else if (name === "adUp Vario Ringfloat dwustronne") catNo = DB.adUpRingfloat.catNo;
        else if (name === "Ścianka tekstylna Vario S-80") catNo = DB.adUpVarioS80.catNo;
        else if (name === "Wykładzina dywanowa (m2)") catNo = "FLOOR-CARPET";
        else if (name === "- Płyty Adfloor prosty (m2)") catNo = "FLOOR-ADFLOOR";
        else if (name === "Adfloor z najazdami LED" || name === "Adfloor prosty") continue;
        else if (name === "- Adfloor płyta 997x997") catNo = "ADF-PLYTA";
        else if (name === "- Adfloor łącznik profili") catNo = "ADF-LACZNIK";
        else if (name === "- Adfloor najazd narożny prawy") catNo = "ADF-NAJ-PRAWY";
        else if (name === "- Adfloor najazd narożny lewy") catNo = "ADF-NAJ-LEWY";
        else if (name === "- Adfloor najazd prosty") catNo = "ADF-NAJ-PROSTY";
        else if (name === "- Adfloor Oświetlenie LED RGB (zestaw 10m)") catNo = "ADF-LED-RGB";
        else if (name === "- Adfloor najazd plastikowy narożnik") catNo = "ADF-PLASTIK";
        else if (name === "- Adfloor profil panelowy") catNo = "ADF-PROFIL-PANEL";
        else if (name === "- Adfloor profil wzmocnienie") catNo = "ADF-PROFIL-WZMOC";

        if (catNo) exportItems[catNo] = (exportItems[catNo] || 0) + globalCounts[name].qty;
    }

    let payload = { projectName: document.getElementById('projectName').value || "Brak nazwy", customerName: document.getElementById('customerName').value || "Nieznany Klient", items: exportItems };
    let btn = document.getElementById('btnExportSheets'); let oldText = btn.innerText; btn.innerText = "⏳ Wysyłanie...";

    try {
        const GOOGLE_APP_URL = "https://script.google.com/macros/s/AKfycbzsNG6y83U20DZY34QflHL74JaEDb5RDL7ZcGFGJ0wSyu3QWoBIY1jZWDPf4gBqwqP4Rw/exec";
        await fetch(GOOGLE_APP_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        alert("Wysłano dane do arkusza Google Sheets!");
    } catch (e) { console.error(e); alert("Wystąpił błąd podczas wysyłania do Google Sheets."); } finally { btn.innerText = oldText; }
}

function renderMframeUI() {
    const container = document.getElementById('mframe-items');
    if (!container) return;
    container.innerHTML = '';
    mframePalletData.items.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #1a1a1a; padding: 8px; border-radius: 5px; border-left: 3px solid var(--led-color);";
        div.innerHTML = `
 <div style="font-size: 12px; line-height: 1.2;">
 <div style="color: #fff; font-weight: bold;">${item.name}</div>
 <div style="color: #888;">${item.weight} kg / szt</div>
 </div>
 <div style="display: flex; align-items: center; gap: 5px;">
 <button class="btn" style="padding: 2px 8px; min-width: unset; font-weight:bold;" onclick="changeMframeItem('${item.id}', -1)">-</button>
 <input type="number" id="mframe-qty-${item.id}" value="${item.count}" style="width: 40px; text-align: center; padding: 2px; background: #000; color: #fff; border: 1px solid #444;" onchange="setMframeItem('${item.id}', this.value)">
 <button class="btn" style="padding: 2px 8px; min-width: unset; font-weight:bold;" onclick="changeMframeItem('${item.id}', 1)">+</button>
 </div>
 `;
        container.appendChild(div);
    });
    updateMframeStats();
}

async function fetchData(mode) {
    toggleFab();
    const modal = document.getElementById('dataViewModal');
    const container = document.getElementById('dataContainer');
    const title = document.getElementById('dataModalTitle');

    modal.style.display = 'flex';
    container.innerHTML = '<div style="text-align:center; padding:20px;">⏳ Pobieranie danych z Google Sheets...</div>';
    title.innerText = mode === 'reports' ? "Lista zgłoszonych poprawek" : "Changelog - Historia zmian";

    try {
        // Wywołujemy skrypt z parametrem akcji (musi być obsłużony w doGet)
        const response = await fetch(`${SCRIPT_URL}?action=${mode}`);
        const data = await response.json();

        if (mode === 'reports') renderReportsTable(data, container);
        else renderChangelogTable(data, container);

    } catch (err) {
        container.innerHTML = `<div style="color:#ff0055;">Błąd pobierania danych. Upewnij się, że funkcja doGet w Google Apps Script jest poprawnie skonfigurowana.</div>`;
        console.error(err);
    }
}

function updateThemeColors(systemName) {
    const root = document.documentElement;

    if (systemName === 'Foldable' || systemName === 'foldable') {
        // Tryb Foldable: Żółty / Złoty
        root.style.setProperty('--warp-color', 'rgba(255, 204, 0, 0.6)');
        root.style.setProperty('--led-color', '#ffcc00');
    } else if (systemName === 'kasetony_niestandardowe') {
        // Tryb Kasetony: Cyjan / Neon
        root.style.setProperty('--warp-color', 'rgba(0, 229, 255, 0.6)');
        root.style.setProperty('--led-color', '#00e5ff');
    } else {
        // Tryb SEGO (domyślny): Różowy / Magenta
        root.style.setProperty('--warp-color', 'rgba(255, 0, 128, 0.6)');
        root.style.setProperty('--led-color', '#ff0080');
    }
} // <--- TEJ KLAMRY BRAKOWAŁO (Zamyka updateThemeColors)

async function analyzePdfAdvanced(pdf, page) {
    const result = { fonts: [], hasOverprint: false, layers: [], rasterWidth: null, rasterHeight: null, ppi: null };
    try {
        // Fonts
        const opList = await page.getOperatorList();
        const fontNames = new Set();
        for (let i = 0; i < opList.fnArray.length; i++) {
            const fn = opList.fnArray[i];
            if (fn === pdfjsLib.OPS.setFont) {
                fontNames.add(opList.argsArray[i][0]);
            }
            // Overprint detection via setGState
            if (fn === pdfjsLib.OPS.setGState) {
                const gs = opList.argsArray[i][0];
                if (gs && (gs.OP === true || gs.op === true)) result.hasOverprint = true;
            }
            // Raster Image detection
            if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintJpegXObject) {
                const objId = opList.argsArray[i][0];
                try {
                    const imgObj = await page.objs.get(objId);
                    if (imgObj && imgObj.width && imgObj.height) {
                        if (!result.rasterWidth || (imgObj.width * imgObj.height > result.rasterWidth * result.rasterHeight)) {
                            result.rasterWidth = imgObj.width;
                            result.rasterHeight = imgObj.height;
                        }
                    }
                } catch (e) { }
            }
        }

        if (result.rasterWidth && result.rasterHeight) {
            const unscaledVP = page.getViewport({ scale: 1.0 });
            const wInches = unscaledVP.width / 72;
            result.ppi = Math.round(result.rasterWidth / wInches);
        }
        result.fonts = Array.from(fontNames).map(f => f.replace(/^g_d+_/, ''));
        // OCG layers
        if (pdf.getOptionalContentConfig) {
            try {
                const occ = await pdf.getOptionalContentConfig();
                if (occ && occ.getGroups) {
                    const groups = occ.getGroups();
                    if (groups) Object.keys(groups).forEach(k => { const g = groups[k]; if (g && g.name) result.layers.push(g.name); });
                }
            } catch (e) { }
        }
    } catch (e) { console.warn('PDF analysis error:', e); }
    return result;
}

async function handleWydrukiFiles(files) {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);
    const total = fileArr.length;
    showWydrukiLoading(total);
    let done = 0;

    for (const file of fileArr) {
        const fileSize = file.size;
        const fileName = file.name;
        const ext = fileName.split('.').pop().toLowerCase();
        updateWydrukiLoading(done, total, fileName);
        setFileProgress(0, 'Odczyt pliku...');
        await uiTick();

        try {
            // --- PDF ---
            if (ext === 'pdf' || file.type === 'application/pdf') {
                setFileProgress(10, 'Odczyt PDF...');
                await uiTick();
                const buf = await file.arrayBuffer();
                setFileProgress(25, 'Dekodowanie PDF...');
                await uiTick();
                const typedarray = new Uint8Array(buf);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const page = await pdf.getPage(1);
                const pdfPages = pdf.numPages;
                const unscaledVP = page.getViewport({ scale: 1.0 });
                const wPt = unscaledVP.width, hPt = unscaledVP.height;
                // Pominięto analizę warstw/fontów/overprintów — przeniesiono na żądanie
                setFileProgress(60, 'Renderowanie podglądu...');
                await uiTick();
                const maxDim = Math.max(wPt, hPt);
                let safeScale = maxDim > PREVIEW_MAX ? (PREVIEW_MAX / maxDim) : 1.0;
                const viewport = page.getViewport({ scale: safeScale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                setFileProgress(85, 'Kompozycja tła...');
                await uiTick();
                const fc = document.createElement('canvas');
                fc.width = canvas.width; fc.height = canvas.height;
                const fCtx = fc.getContext('2d');
                fCtx.fillStyle = '#ffffff';
                fCtx.fillRect(0, 0, fc.width, fc.height);
                fCtx.drawImage(canvas, 0, 0);
                setFileProgress(95, 'Kodowanie JPEG...');
                await uiTick();
                wydrukiImages.push({
                    src: fc.toDataURL('image/jpeg', PREVIEW_QUALITY),
                    width: Math.round(wPt * (150 / 72)), height: Math.round(hPt * (150 / 72)),
                    name: fileName, fileSize, dpi: null, // zmienione z 'Wektor'
                    widthMm: Math.round(wPt / 72 * 25.4), heightMm: Math.round(hPt / 72 * 25.4),
                    colorProfile: null, format: 'PDF', pages: pdfPages,
                    pdfFonts: null, pdfOverprint: null, pdfLayers: null,
                    _rawFile: file // Zachowujemy referencję do pliku dla późniejszej analizy
                });
            }
            // --- TIFF ---
            else if (ext === 'tif' || ext === 'tiff' || file.type === 'image/tiff') {
                if (fileSize > 100 * 1024 * 1024) {
                    alert(`TIFF "${fileName}" (${(fileSize / 1024 / 1024).toFixed(0)}MB) za duży. Limit: 100MB.`);
                    done++; continue;
                }
                setFileProgress(10, 'Odczyt TIFF...');
                await uiTick();
                const buf = await file.arrayBuffer();
                setFileProgress(30, 'Dekodowanie IFD...');
                await uiTick();
                const ifds = UTIF.decode(buf);
                UTIF.decodeImage(buf, ifds[0]);
                setFileProgress(55, 'Konwersja RGBA...');
                await uiTick();
                const rgba = UTIF.toRGBA8(ifds[0]);
                const origW = ifds[0].width, origH = ifds[0].height;
                let tiffDpi = null;
                const xRes = ifds[0].t282 || ifds[0][282];
                if (xRes) tiffDpi = Array.isArray(xRes) ? Math.round(xRes[0]) : Math.round(xRes);
                // Pominięto analizę profilu kolorystycznego — przeniesiono na żądanie
                setFileProgress(70, 'Skalowanie podglądu...');
                await uiTick();
                // Scale directly to preview size — skip full-size canvas for large TIFFs
                const s = Math.min(1, PREVIEW_MAX / Math.max(origW, origH));
                const pw = Math.round(origW * s), ph = Math.round(origH * s);
                const oc = document.createElement('canvas');
                oc.width = origW; oc.height = origH;
                const ctx = oc.getContext('2d');
                const id = ctx.createImageData(origW, origH);
                id.data.set(rgba); ctx.putImageData(id, 0, 0);
                let displayUrl;
                if (s < 1) {
                    const sc = document.createElement('canvas');
                    sc.width = pw; sc.height = ph;
                    sc.getContext('2d').drawImage(oc, 0, 0, pw, ph);
                    displayUrl = sc.toDataURL('image/jpeg', PREVIEW_QUALITY);
                } else { displayUrl = oc.toDataURL('image/jpeg', PREVIEW_QUALITY); }
                setFileProgress(95, 'Zapis...');
                wydrukiImages.push({
                    src: displayUrl, width: origW, height: origH,
                    name: fileName, fileSize, dpi: tiffDpi,
                    widthMm: tiffDpi ? Math.round((origW / tiffDpi) * 25.4) : null,
                    heightMm: tiffDpi ? Math.round((origH / tiffDpi) * 25.4) : null,
                    colorProfile: null, format: 'TIFF', layers: null,
                    _rawFile: file // Zachowujemy referencję do pliku dla późniejszej analizy
                });
            }
            // --- JPG/PNG/etc ---
            else if (file.type.startsWith('image/')) {
                const fileType = file.type;
                setFileProgress(10, 'Odczyt metadanych...');
                await uiTick();
                // Read only first 64KB for DPI metadata (profil kolorystyczny przeniesiony na żądanie)
                const metaBuf = await file.slice(0, 65536).arrayBuffer();
                const dpiInfo = extractImageDpi(metaBuf, fileType);
                setFileProgress(30, 'Dekodowanie obrazu...');
                await uiTick();
                // Single createImageBitmap — decode + get originals in one call
                const fullBmp = await createImageBitmap(file);
                const origW = fullBmp.width, origH = fullBmp.height;
                setFileProgress(60, 'Skalowanie podglądu...');
                await uiTick();
                // Render scaled preview
                const c = document.createElement('canvas');
                const s = Math.min(1, PREVIEW_MAX / Math.max(origW, origH));
                c.width = Math.round(origW * s); c.height = Math.round(origH * s);
                c.getContext('2d').drawImage(fullBmp, 0, 0, c.width, c.height);
                fullBmp.close();
                setFileProgress(90, 'Kodowanie JPEG...');
                await uiTick();
                const dpi = dpiInfo ? dpiInfo.x : null;
                wydrukiImages.push({
                    src: c.toDataURL('image/jpeg', PREVIEW_QUALITY),
                    width: origW, height: origH,
                    name: fileName, fileSize, dpi,
                    widthMm: dpi ? Math.round((origW / dpi) * 25.4) : null,
                    heightMm: dpi ? Math.round((origH / dpi) * 25.4) : null,
                    colorProfile: null, format: ext.toUpperCase(),
                    _rawFile: file // Zachowujemy referencję do pliku dla późniejszej analizy
                });
            }
        } catch (e) { console.error('Błąd:', fileName, e); alert('Błąd: ' + fileName + '\n' + e.message); }

        done++;
        setFileProgress(100, 'Gotowe ✓');
        updateWydrukiLoading(done, total, done < total ? fileArr[done]?.name || '' : 'Zakończono!');
        render();
        await uiTick();
    }
    hideWydrukiLoading();
}

async function analyzeWydrukiAdvanced() {
    if (wydrukiImages.length === 0) { alert('Brak zaimportowanych grafik.'); return; }
    const modal = document.getElementById('wydrukiReportModal');
    const content = document.getElementById('wydrukiReportContent');
    content.innerHTML = '<div style="text-align:center; color:#6c5ce7; padding:40px; font-size:16px;">⏳ Analizuję profile kolorystyczne i warstwy...<br><span style="font-size:12px; color:#888;">Może to potrwać chwilę dla dużych plików.</span></div>';
    modal.style.display = 'flex';
    await new Promise(r => setTimeout(r, 100));

    let analyzed = 0;
    for (const img of wydrukiImages) {
        try {
            if (img.format === 'PDF' && img._rawFile) {
                const buf = await img._rawFile.arrayBuffer();
                const typedarray = new Uint8Array(buf);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const page = await pdf.getPage(1);
                const pdfInfo = await analyzePdfAdvanced(pdf, page);
                img.pdfFonts = pdfInfo.fonts;
                img.pdfOverprint = pdfInfo.hasOverprint;
                img.pdfLayers = pdfInfo.layers;

                if (pdfInfo.rasterWidth && pdfInfo.rasterHeight) {
                    img.pdfRasterWidth = pdfInfo.rasterWidth;
                    img.pdfRasterHeight = pdfInfo.rasterHeight;
                    img.dpi = pdfInfo.ppi;
                }

                // Szybka heurystyka profili z tekstu PDF
                const textChunk = new TextDecoder('ascii').decode(typedarray.slice(0, Math.min(typedarray.length, 5000000)));
                const hasCMYK = /\/DeviceCMYK/i.test(textChunk);
                const hasRGB = /\/DeviceRGB/i.test(textChunk);
                const hasPantone = /PANTONE/i.test(textChunk) || /\/Separation/i.test(textChunk);

                let profiles = [];
                if (hasCMYK) profiles.push('CMYK');
                if (hasRGB) profiles.push('RGB');
                if (hasPantone) profiles.push('PANTONE');

                img.colorProfile = profiles.length > 0 ? profiles.join(' + ') : 'Inny/Mieszany';

                // BEZWZGLĘDNY SKAN BINARNY OVERPRINTU (Niezależny od renderera PDF.js)
                // Skanujemy całą tablicę bitową, zamiast tylko pierwszych 5MB, aby ominąć duże pliki
                let opFound = false;
                const len = typedarray.length;
                for (let i = 0; i < len - 10; i++) {
                    if (typedarray[i] === 47) { // '/'
                        // Szukamy /OP (79, 80) lub /op (111, 112)
                        if ((typedarray[i + 1] === 79 && typedarray[i + 2] === 80) || (typedarray[i + 1] === 111 && typedarray[i + 2] === 112)) {
                            let offset = i + 3;
                            if (typedarray[offset] === 77) offset++; // OPM
                            // Pomiń białe znaki
                            while (typedarray[offset] === 32 || typedarray[offset] === 9 || typedarray[offset] === 13 || typedarray[offset] === 10) {
                                offset++;
                            }
                            // Sprawdź '1' (49) lub 'true' (116, 114, 117, 101)
                            if (typedarray[offset] === 49) {
                                opFound = true; break;
                            }
                            if (typedarray[offset] === 116 && typedarray[offset + 1] === 114 && typedarray[offset + 2] === 117 && typedarray[offset + 3] === 101) {
                                opFound = true; break;
                            }
                        }
                    }
                }
                if (opFound) img.pdfOverprint = true;

            } else if (img.format === 'TIFF' && img._rawFile) {
                const buf = await img._rawFile.arrayBuffer();
                const ifds = UTIF.decode(buf);
                img.colorProfile = detectColorProfile(buf, 'image/tiff', ifds[0]);
                img.layers = ifds.length > 1 ? ifds.length : null;
            } else if (img._rawFile && img._rawFile.type && img._rawFile.type.startsWith('image/')) {
                const metaBuf = await img._rawFile.slice(0, 65536).arrayBuffer();
                img.colorProfile = detectColorProfile(metaBuf, img._rawFile.type, null);
            }
            analyzed++;
        } catch (e) {
            console.warn('Analiza błąd:', img.name, e);
        }
        // Update progress
        content.innerHTML = `<div style="text-align:center; color:#6c5ce7; padding:40px; font-size:16px;">⏳ Analizuję... (${analyzed}/${wydrukiImages.length})<br><span style="font-size:12px; color:#888;">${img.name}</span></div>`;
        await new Promise(r => setTimeout(r, 16));
    }

    // Po zakończeniu analizy od razu generujemy raport
    generateWydrukiReport();
}

async function checkEdgeMatching() {
    if (wydrukiImages.length < 2) { alert('Potrzebujesz co najmniej 2 grafik do porównania krawędzi.'); return; }
    const modal = document.getElementById('wydrukiMatchModal');
    const content = document.getElementById('wydrukiMatchContent');
    content.innerHTML = '<div style="text-align:center; color:#e17055; padding:40px; font-size:16px;">⏳ Analizuję krawędzie grafik...<br><span style="font-size:12px; color:#888;">Porównuję wzory na krawędziach wszystkich par.</span></div>';
    modal.style.display = 'flex';
    await new Promise(r => setTimeout(r, 100)); // let modal render

    // Extract edges for all images
    const allEdges = [];
    for (const imgData of wydrukiImages) {
        // Normalize extraction canvas to physical dimensions for consistent edge comparison
        const baseW = imgData.widthMm || 1000;
        const baseH = imgData.heightMm || 1000;
        const scale = 200 / Math.max(baseW, baseH);
        const w = Math.round(baseW * scale);
        const h = Math.round(baseH * scale);
        allEdges.push(await getEdgePixels(imgData.src, w, h));
    }

    const results = [];
    const sides = [
        { a: 'right', b: 'left', dimKey: 'height', arrow: '→→', label: 'prawa ↔ lewa' },
        { a: 'left', b: 'right', dimKey: 'height', arrow: '←←', label: 'lewa ↔ prawa' },
        { a: 'bottom', b: 'top', dimKey: 'width', arrow: '↓↓', label: 'dół ↔ góra' },
        { a: 'top', b: 'bottom', dimKey: 'width', arrow: '↑↑', label: 'góra ↔ dół' }
    ];

    for (let i = 0; i < wydrukiImages.length; i++) {
        for (let j = i + 1; j < wydrukiImages.length; j++) {
            // NOWE: Nigdy nie pasuj plików o różnych rozmiarach krawędzi (max 5% różnicy)
            const wMmI = wydrukiImages[i].widthMm || wydrukiImages[i].width;
            const hMmI = wydrukiImages[i].heightMm || wydrukiImages[i].height;
            const wMmJ = wydrukiImages[j].widthMm || wydrukiImages[j].width;
            const hMmJ = wydrukiImages[j].heightMm || wydrukiImages[j].height;

            // Odrzuć parę, jeśli OBA wymiary drastycznie się różnią (np. 100cm vs 300cm)
            const wRatio = Math.abs(wMmI - wMmJ) / Math.max(wMmI, wMmJ);
            const hRatio = Math.abs(hMmI - hMmJ) / Math.max(hMmI, hMmJ);
            if (wRatio > 0.05 && hRatio > 0.05) continue; // Oba wymiary się nie zgadzają — pomiń

            for (const side of sides) {
                const edgeA = allEdges[i][side.a];
                const edgeB = allEdges[j][side.b];
                // NOWE: Ignoruj krawędzie z jednolitym tłem — wystarczy JEDNA strona jednolita
                if (isSolidEdge(edgeA) || isSolidEdge(edgeB)) continue;

                // Compare physical dimensions (mm) instead of raw pixels for compatibility
                const dimA = wydrukiImages[i][side.dimKey + 'Mm'] || wydrukiImages[i][side.dimKey];
                const dimB = wydrukiImages[j][side.dimKey + 'Mm'] || wydrukiImages[j][side.dimKey];
                // Dodatkowe sprawdzenie 5% tolerancji na porównywanej krawędzi
                if (Math.abs(dimA - dimB) / Math.max(dimA, dimB) > 0.05) continue;
                const score = compareEdgeStrips(edgeA, edgeB, dimA, dimB);
                if (score > 0.55) {
                    results.push({
                        imgA: wydrukiImages[i].name, imgB: wydrukiImages[j].name,
                        sideLabel: side.label, arrow: side.arrow,
                        score: score, sideA: side.a, sideB: side.b
                    });
                }
            }
        }
    }

    // Build report
    let html = '';
    if (results.length === 0) {
        html = '<div style="text-align:center; padding:40px;"><div style="font-size:48px; margin-bottom:15px;">✅</div>';
        html += '<div style="color:#00ff88; font-size:16px; font-weight:bold;">Nie znaleziono pasujących krawędzi</div>';
        html += '<div style="color:#888; font-size:13px; margin-top:8px;">Żadna para grafik nie wykazuje kontynuacji wzorów/linii na krawędziach (z wyłączeniem jednolitego tła).</div></div>';
    } else {
        html = `<div style="margin-bottom:15px; color:#e17055; font-weight:bold;">⚠️ Znaleziono ${results.length} potencjalnych pasowań:</div>`;
        html += '<table style="width:100%; border-collapse:collapse; font-size:12px; color:#ddd;">';
        html += '<thead><tr style="background:#2d1f1f; color:#e17055;">';
        html += '<th style="padding:10px; border:1px solid #333;">Grafika A</th>';
        html += '<th style="padding:10px; border:1px solid #333;">Kierunek</th>';
        html += '<th style="padding:10px; border:1px solid #333;">Grafika B</th>';
        html += '<th style="padding:10px; border:1px solid #333;">Dopasowanie</th>';
        html += '</tr></thead><tbody>';
        results.sort((a, b) => b.score - a.score);
        results.forEach((r, i) => {
            const pct = Math.round(r.score * 100);
            const barColor = pct > 85 ? '#00ff88' : pct > 70 ? '#ffcc00' : '#e17055';
            const rowBg = i % 2 === 0 ? '#1e1e2e' : '#252540';
            html += `<tr style="background:${rowBg};">`;
            html += `<td style="padding:8px; border:1px solid #333;">📄 ${r.imgA}</td>`;
            html += `<td style="padding:8px; border:1px solid #333; text-align:center; font-size:14px;">${r.arrow}<br><span style="font-size:10px; color:#888;">${r.sideLabel}</span></td>`;
            html += `<td style="padding:8px; border:1px solid #333;">📄 ${r.imgB}</td>`;
            html += `<td style="padding:8px; border:1px solid #333; text-align:center;"><div style="background:#333; border-radius:4px; overflow:hidden; height:16px; margin-bottom:3px;"><div style="background:${barColor}; height:100%; width:${pct}%;"></div></div><span style="color:${barColor}; font-weight:bold;">${pct}%</span></td>`;
            html += '</tr>';
        });
        html += '</tbody></table>';
        html += '<div style="margin-top:15px; padding:10px; background:#2d1f1f; border-radius:6px; font-size:11px; color:#888;">💡 Dopasowanie &gt;85% oznacza bardzo prawdopodobną kontynuację elementu graficznego. 70-85% to możliwe pasowanie. Jednokolorowe tła są pomijane.</div>';
    }
    content.innerHTML = html;
}

function redefineSystemRules(system) {
    switch (system) {
        case 'LMSM':
            window.currentSystemConfig = {
                name: "LMSM",
                prefix: "LMSM",
                defaultWidth: 100,
                defaultHeight: 250,
                defWidth: 100,
                defHeight: 250,
                cornerType: "BI_FOLD_SLIM",
                neonColorHex: 0x00FF88,
                bomPrefix: "ALU-060-SLIM",
                canDoubleSide: true
            };
            break;

        case 'SEGO':
            window.currentSystemConfig = {
                name: "SEGO",
                defaultWidth: 100,
                defaultHeight: 250,
                cornerType: 'sego_overlap',
                bomPrefix: 'SEGO-',
                canDoubleSide: true
            };
            break;

        case 'multiframe':
            window.currentSystemConfig = {
                name: "Multiframe",
                defaultWidth: 100,
                defaultHeight: 248,
                cornerType: 'cube', // Alternatywna metoda łączenia przez kostki
                bomPrefix: 'MF-',
                canDoubleSide: true
            };
            break;

        case 'foldable':
            window.currentSystemConfig = {
                name: "Foldable",
                defaultWidth: 100,
                defaultHeight: 230, // Zabudowa budżetowa jest zazwyczaj niższa
                cornerType: 'simple_overlap',
                bomPrefix: 'FOLD-',
                canDoubleSide: false // Zazwyczaj systemy jednostronne
            };
            break;

        case 'adframe':
            window.currentSystemConfig = {
                name: "adFrame",
                defaultWidth: 100,
                defaultHeight: 200,
                cornerType: 'adframe_corner',
                bomPrefix: 'AF-',
                canDoubleSide: true
            };
            break;

        case 'wydruki':
            window.currentSystemConfig = {
                name: "Wydruki",
                defaultWidth: 100,
                defaultHeight: 100,
                cornerType: 'none', // Wydruki nie mają złącz kątowych
                bomPrefix: 'PRNT-',
                canDoubleSide: false
            };
            break;

        case 'Flex_noLEd':
            window.currentSystemConfig = {
                name: "Flex noLEd",
                defaultWidth: 100,
                defaultHeight: 250,
                cornerType: 'flex_joint', // Bez elektroniki w złączach
                bomPrefix: 'FLEX-',
                canDoubleSide: true
            };
            break;

        case 'SEGO_2_0':
            window.currentSystemConfig = {
                name: "SEGO 2.0 (Beta)",
                defaultWidth: 100,
                defaultHeight: 250,
                cornerType: 'sego_v2_overlap', // Nowy system zapięć
                bomPrefix: 'SEGO2-',
                canDoubleSide: true
            };
            break;

        case 'multigenerator':
            window.currentSystemConfig = {
                name: "Multi-Generator",
                defaultWidth: 100,
                defaultHeight: 250,
                cornerType: 'hybrid', // Łączy różne technologie
                bomPrefix: 'GEN-',
                canDoubleSide: true,
                isAutoMode: true // Specjalna flaga aktywująca logikę AI
            };
            break;

        case 'mframe_pallet':
            window.currentSystemConfig = {
                name: "mFrame Pallet",
                defaultWidth: 100,
                defaultHeight: 100,
                cornerType: 'none',
                bomPrefix: 'MFP-',
                canDoubleSide: false
            };
            break;

        default:
            // Zabezpieczenie (fallback), gdyby skrypt zgubił nazwę
            window.currentSystemConfig = {
                name: "SEGO",
                defaultWidth: 100,
                defaultHeight: 250,
                cornerType: 'sego_overlap',
                bomPrefix: 'SEGO-',
                canDoubleSide: true
            };
            break;
    }
}

function updateFoldableRadialMenus(camera, renderer) {
    if (currentSystem !== 'foldable') {
        document.getElementById('foldable-ui-layer').innerHTML = '';
        return;
    }

    const layer = document.getElementById('foldable-ui-layer');
    let htmlContent = '';

    foldablePlanes.forEach((plane, index) => {
        const centerPos = plane.center3D.clone().project(camera);
        const x = (centerPos.x * .5 + .5) * renderer.domElement.clientWidth;
        const y = (centerPos.y * -.5 + .5) * renderer.domElement.clientHeight;

        if (centerPos.z > 1) return;

        // UWAGA: Tło radial-ring-bg i napisy w <span> dla zgodności z nowym CSS
        htmlContent += `
 <div class="radial-menu" id="rm-${index}" style="left: ${x}px; top: ${y}px;">
 <div class="radial-ring-bg"></div>
 <div class="radial-item item-1" onclick="setPlanePrint(${index}, 'div', 'seamless')" title="Wydruk w całości"><span>⬜</span>Całość</div>
 <div class="radial-item item-2" onclick="setPlanePrint(${index}, 'div', 'half')" title="Podziel na pół"><span>🌗</span>Pół</div>
 <div class="radial-item item-3" onclick="setPlanePrint(${index}, 'div', 'single')" title="Pojedyncze moduły"><span>🔲</span>Pojed.</div>
 <div class="radial-item item-4" onclick="setPlanePrint(${index}, 'side', 'front')" title="Tylko Front"><span>⬇️</span>Front</div>
 <div class="radial-item item-5" onclick="setPlanePrint(${index}, 'side', 'back')" title="Tylko Tył"><span>⬆️</span>Tył</div>
 <div class="radial-item item-6" onclick="setPlanePrint(${index}, 'side', 'double')" title="Dwustronny"><span>↕️</span>Oba</div>
 <div class="radial-center" onclick="document.getElementById('rm-${index}').classList.toggle('open')" title="Ustawienia Wydruku">⚙️</div>
 </div>
 `;
    });

    // Blokada znikania przy ruchu kursorem
    const anyOpen = !!document.querySelector('.radial-menu.open');
    if (!layer.matches(':hover') && !anyOpen) {
        layer.innerHTML = htmlContent;
    } else {
        foldablePlanes.forEach((plane, index) => {
            const menuDiv = document.getElementById(`rm-${index}`);
            if (menuDiv) {
                const centerPos = plane.center3D.clone().project(camera);
                const x = (centerPos.x * .5 + .5) * renderer.domElement.clientWidth;
                const y = (centerPos.y * -.5 + .5) * renderer.domElement.clientHeight;
                menuDiv.style.left = x + 'px';
                menuDiv.style.top = y + 'px';
            }
        });
    }
}

function setPlanePrint(planeIndex, type, value) {
    let plane = foldablePlanes[planeIndex];

    plane.walls.forEach(wallItem => {
        let originalPlanItem = plan[wallItem.planIndex];
        if (!originalPlanItem.foldableSettings) {
            originalPlanItem.foldableSettings = { div: 'seamless', side: 'double', hasPrint: false };
        }

        // Jeśli klikamy jakąkolwiek opcję wydruku, aktywujemy widoczność płótna
        originalPlanItem.foldableSettings.hasPrint = true;
        originalPlanItem.foldableSettings[type] = value;
    });

    document.getElementById(`rm-${planeIndex}`).classList.remove('open');
    render();
}

async function checkDPDServices() {
    const senderCode = document.getElementById('dpd-sender-code').value.trim();
    const receiverCode = document.getElementById('dpd-receiver-code').value.trim();
    const btn = document.getElementById('dpd-check-btn');
    const resultsDiv = document.getElementById('dpd-results');
    const errorDiv = document.getElementById('dpd-error');
    const allDiv = document.getElementById('dpd-all-services');
    const toggleDiv = document.getElementById('dpd-toggle-all');

    // Walidacja formatu XX-XXX
    const codeRegex = /^\d{2}-\d{3}$/;
    if (!codeRegex.test(senderCode)) {
        errorDiv.textContent = '❌ Nieprawidłowy kod nadawcy (format: XX-XXX)';
        errorDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        return;
    }
    if (!codeRegex.test(receiverCode)) {
        errorDiv.textContent = '❌ Wpisz kod pocztowy odbiorcy (format: XX-XXX)';
        errorDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        return;
    }

    // UI: spinner
    errorDiv.style.display = 'none';
    resultsDiv.style.display = 'none';
    allDiv.classList.remove('expanded');
    toggleDiv.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<span class="dpd-spinner"></span> Sprawdzam...';

    try {
        const response = await fetch('http://localhost:3099/dpd-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderPostCode: senderCode,
                receiverPostCode: receiverCode
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Wyświetl wyniki główne (9:30 / 12:00 / Sobota)
        let html = '';
        for (const svc of data.services) {
            const cls = svc.available ? 'available' : 'unavailable';
            const icon = svc.available ? '✅' : '❌';
            const text = svc.available ? 'Dostępna' : 'Niedostępna';
            let detail = '';
            if (!svc.available) {
                const parts = [];
                if (!svc.senderAvailable) parts.push('nadawca');
                if (!svc.receiverAvailable) parts.push('odbiorca');
                if (parts.length > 0) detail = ` (brak: ${parts.join(', ')})`;
            }
            html += `<div class="dpd-service-row ${cls}">`;
            html += ` <span class="dpd-service-name">${svc.name}</span>`;
            html += ` <span class="dpd-service-status">${icon} ${text}${detail}</span>`;
            html += `</div>`;
        }
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';

        // Pokaż wszystkie usługi (debug / szczegóły)
        const allSvcs = [...(data.allSenderServices || []), ...(data.allReceiverServices || [])];
        if (allSvcs.length > 0) {
            let allHtml = '<div style="margin-bottom:4px; color:#888; font-weight:bold;">Wszystkie usługi z API:</div>';
            const uniqueNames = new Set();
            for (const s of allSvcs) {
                const key = s.name || s.code;
                if (key && !uniqueNames.has(key)) {
                    uniqueNames.add(key);
                    allHtml += `<div style="padding:2px 0; border-bottom:1px solid #222;">• ${s.name || ''} <span style="color:#555">[${s.code || ''}]</span></div>`;
                }
            }
            allDiv.innerHTML = allHtml;
            toggleDiv.style.display = 'block';
        }

    } catch (err) {
        let msg = err.message;
        const isOffline = msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ERR_CONNECTION_REFUSED');

        if (isOffline) {
            // Wbudowany Tryb Demo / Mock bezpośrednio w przeglądarce!
            errorDiv.innerHTML = '⚠️ Serwer proxy DPD jest wyłączony.<br>Uruchomiono wbudowany <strong>tryb demonstracyjny (Mock)</strong>.<br><div style="margin-top: 8px;"><button class="dpd-check-btn" style="background: linear-gradient(135deg, #ffa500, #ff7700); border: 1px solid #ffaa00; width: auto; display: inline-block; padding: 6px 12px; font-size: 11px;" onclick="downloadNodeInstaller()">⚡ Zainstaluj Node.js i uruchom serwer (.bat)</button></div>';
            errorDiv.style.display = 'block';
            errorDiv.style.background = 'rgba(255, 150, 0, 0.08)';
            errorDiv.style.borderColor = 'rgba(255, 150, 0, 0.3)';
            errorDiv.style.color = '#ffa500';

            // Symulacja wyników oparta na sumie cyfr kodu odbiorcy (aby kody się różniły wynikami)
            const digits = receiverCode.replace(/\D/g, '');
            const sum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);

            const has930 = (sum % 3 !== 0); // ~66% szans
            const has1200 = (sum % 4 !== 0); // ~75% szans
            const hasSat = (sum % 2 === 0); // ~50% szans

            const services = [
                { name: 'DPD 9:30', available: has930 },
                { name: 'DPD 12:00', available: has1200 },
                { name: 'DPD Sobota', available: hasSat }
            ];

            let html = '';
            for (const svc of services) {
                const cls = svc.available ? 'available' : 'unavailable';
                const icon = svc.available ? '✅' : '❌';
                const text = svc.available ? 'Dostępna' : 'Niedostępna';
                html += `<div class="dpd-service-row ${cls}">`;
                html += ` <span class="dpd-service-name">${svc.name}</span>`;
                html += ` <span class="dpd-service-status">${icon} ${text}</span>`;
                html += `</div>`;
            }

            resultsDiv.innerHTML = html;
            resultsDiv.style.display = 'block';
        } else {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
            errorDiv.style.background = 'rgba(255, 0, 0, 0.1)';
            errorDiv.style.borderColor = 'rgba(255, 0, 0, 0.2)';
            errorDiv.style.color = '#ff5555';
            resultsDiv.style.display = 'none';
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🔍 Sprawdź dostępność usług';
    }
}

async function openWydrukiScanner(index) {
    currentScannerIndex = index;
    const imgData = wydrukiImages[index];
    if (!imgData || !imgData._rawFile) return;

    const modal = document.getElementById('wydrukiScannerModal');
    const container = document.getElementById('wydrukiScannerContainer');
    const canvas = document.getElementById('wydrukiScannerCanvas');
    const loading = document.getElementById('wydrukiScannerLoading');
    const filenameTitle = document.getElementById('scanFilename');

    filenameTitle.textContent = imgData.name + " (Podgląd 1:1)";
    modal.style.display = 'flex';
    loading.style.display = 'block';
    canvas.style.display = 'none';

    try {
        if (imgData.format === 'TIFF') {
            // UTIF.js do dekodowania potężnych TIFFów w locie
            const buf = await imgData._rawFile.arrayBuffer();
            const ifds = UTIF.decode(buf);
            UTIF.decodeImage(buf, ifds[0]);
            const rgba = UTIF.toRGBA8(ifds[0]);

            canvas.width = ifds[0].width;
            canvas.height = ifds[0].height;
            const ctx = canvas.getContext('2d');
            const imgDataObj = ctx.createImageData(canvas.width, canvas.height);
            imgDataObj.data.set(rgba);
            ctx.putImageData(imgDataObj, 0, 0);

        } else if (imgData.format === 'JPG' || imgData.format === 'JPEG' || imgData.format === 'PNG') {
            const bmp = await createImageBitmap(imgData._rawFile);
            canvas.width = bmp.width;
            canvas.height = bmp.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bmp, 0, 0);
            bmp.close();

        } else if (imgData.format === 'PDF') {
            const buf = await imgData._rawFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(new Uint8Array(buf)).promise;
            const page = await pdf.getPage(1);

            // Renderer 1:1 bazujący na wyliczonym DPI (lub domyślnie 150)
            const targetPpi = imgData.dpi || 150;
            const scale = targetPpi / 72;
            const viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        }

        // Ustawienie fizycznych rozmiarów w CSS dla wizualnej skali 1:1
        // Wymuszamy tylko szerokość, zostawiając wysokość na 'auto', aby uniknąć rozciągania w pionie (zachowanie proporcji)!
        canvas.style.width = '';
        canvas.style.height = '';
        const w_mm = imgData.w_mm || (imgData.pdfRasterWidth ? (imgData.pdfRasterWidth / imgData.dpi * 25.4) : null);

        if (w_mm) {
            canvas.style.width = Math.round(w_mm) + 'mm';
            canvas.style.height = 'auto'; // ZAPOBIEGANIE ZNIEKSZTAŁCENIOM
        }

        // Reset wyników AI
        const resultDiv = document.getElementById('wydrukiScannerAiResult');
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';

        loading.style.display = 'none';
        canvas.style.display = 'block';

        setTimeout(() => {
            container.scrollLeft = Math.max(0, (canvas.offsetWidth - container.clientWidth) / 2);
            container.scrollTop = Math.max(0, (canvas.offsetHeight - container.clientHeight) / 2);
        }, 100);

    } catch (e) {
        console.error(e);
        loading.textContent = '❌ Błąd renderowania: Plik jest uszkodzony lub brakuje pamięci RAM.';
    }
}

async function analyzeGraphicQuality(imgData, canvas) {
    const resultDiv = document.getElementById('wydrukiScannerAiResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '⏳ Weryfikacja DTP i analiza wizualna...';

    if (!imgData) { resultDiv.innerHTML = '❌ Brak danych grafiki.'; return; }

    await new Promise(r => setTimeout(r, 50));

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    if (!w || !h) {
        resultDiv.innerHTML = '❌ Brak obrazu do analizy.';
        return;
    }

    try {
        // ==========================================
        // SEKCJA A: CHECKLIST DTP
        // ==========================================
        let dtpScore = 0;
        let dtpTotal = 8;
        let dtpWarns = 0;
        let dtpErrors = 0;

        let dtpHtml = `<div style="margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:10px;">
 <div style="font-weight:bold; font-size:15px; margin-bottom:10px; color:#00cec9;">📋 Weryfikacja DTP</div>`;

        const checkRow = (label, value, status, info) => {
            let icon, color;
            if (status === 'ok') { icon = '✅'; color = '#00ff88'; dtpScore++; }
            else if (status === 'warn') { icon = '⚠️'; color = '#ffcc00'; dtpWarns++; }
            else if (status === 'err') { icon = '❌'; color = '#ff5555'; dtpErrors++; }
            else { icon = '❔'; color = '#888'; }

            return `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
 <span>${icon} ${label}:</span>
 <span style="color:${color}; font-weight:bold;" title="${info}">${value}</span>
 </div>`;
        };

        // 1. Rozdzielczość (PPI)
        if (typeof imgData.dpi === 'number') {
            if (imgData.dpi >= 120) dtpHtml += checkRow('Rozdzielczość', `${imgData.dpi} PPI`, 'ok', 'Wymagane minimum 120 PPI');
            else if (imgData.dpi >= 61) dtpHtml += checkRow('Rozdzielczość', `${imgData.dpi} PPI`, 'warn', 'Poniżej 120 PPI - jakość może być słaba');
            else dtpHtml += checkRow('Rozdzielczość', `${imgData.dpi} PPI`, 'err', 'Krytycznie niska rozdzielczość');
        } else {
            dtpHtml += checkRow('Rozdzielczość', 'Brak danych', 'unknown', 'Uzupełnij dane pliku');
            dtpTotal--;
        }

        // 2. Kolor (CMYK)
        if (imgData.colorProfile) {
            if (imgData.colorProfile.includes('CMYK') && !imgData.colorProfile.includes('RGB')) {
                dtpHtml += checkRow('Przestrzeń barw', 'CMYK', 'ok', 'Prawidłowa przestrzeń kolorów');
            } else {
                dtpHtml += checkRow('Przestrzeń barw', imgData.colorProfile, 'err', 'Wymagany CMYK. Kolory będą mniej nasycone po konwersji.');
            }
        } else {
            dtpHtml += checkRow('Przestrzeń barw', 'nieanalizowany', 'unknown', 'Kliknij Analizuj profile w tabeli');
            dtpTotal--;
        }

        // 3. Wymiary (z tolerancją)
        const systemSelect = document.getElementById('wydrukiSystemSelect');
        const selectedSystem = systemSelect ? systemSelect.value : 'none';

        if (selectedSystem !== 'none' && SYSTEM_GUIDELINES[selectedSystem] && imgData.widthMm && imgData.heightMm) {
            // Autowykrywanie najbliższej ściany
            const possibleWidths = [85, 100, 200, 300, 400, 500];
            const possibleHeights = [200, 230, 248, 250, 300];
            let nearestW = possibleWidths[0], nearestH = possibleHeights[0];
            let minDiffW = Infinity, minDiffH = Infinity;

            for (const w of possibleWidths) {
                const diff = Math.abs((imgData.widthMm / 10) - w);
                if (diff < minDiffW) { minDiffW = diff; nearestW = w; }
            }
            for (const h of possibleHeights) {
                const diff = Math.abs((imgData.heightMm / 10) - h);
                if (diff < minDiffH) { minDiffH = diff; nearestH = h; }
            }

            const wallKey = `${nearestW}x${nearestH}`;
            const target = SYSTEM_GUIDELINES[selectedSystem][wallKey];

            if (target) {
                const diffW = imgData.widthMm - target.w;
                const diffH = imgData.heightMm - target.h;

                // Tolerancja -3mm / +10mm
                const wOk = diffW >= -3 && diffW <= 10;
                const hOk = diffH >= -3 && diffH <= 10;

                // Proporcje: max 2% błędu
                const errRatioW = Math.abs(diffW) / target.w;
                const errRatioH = Math.abs(diffH) / target.h;
                const ratioOk = Math.abs(errRatioW - errRatioH) <= 0.02;

                if (wOk && hOk && ratioOk) {
                    dtpHtml += checkRow('Wymiary', `${imgData.widthMm}x${imgData.heightMm}mm`, 'ok', `Zgodne z ${wallKey} (cel: ${target.w}x${target.h}mm)`);
                } else if (!ratioOk) {
                    dtpHtml += checkRow('Wymiary', `${imgData.widthMm}x${imgData.heightMm}mm`, 'err', `Zaburzone proporcje! Błąd szer: ${(errRatioW * 100).toFixed(1)}%, wys: ${(errRatioH * 100).toFixed(1)}%`);
                } else {
                    dtpHtml += checkRow('Wymiary', `${imgData.widthMm}x${imgData.heightMm}mm`, 'err', `Niezgodne z ${wallKey} (cel: ${target.w}x${target.h}mm, tolerancja -3mm/+10mm)`);
                }
            } else {
                dtpHtml += checkRow('Wymiary', 'Brak wytycznych', 'unknown', `Nie znaleziono ściany ${wallKey}`);
                dtpTotal--;
            }
        } else {
            dtpHtml += checkRow('Wymiary', 'Brak danych systemu', 'unknown', 'Wybierz system z listy');
            dtpTotal--;
        }

        // 4. Format
        if (imgData.format === 'PDF') dtpHtml += checkRow('Format', 'PDF', 'ok', 'Optymalny format dla druku');
        else if (['PNG', 'JPG', 'JPEG', 'TIFF'].includes(imgData.format)) dtpHtml += checkRow('Format', imgData.format, 'warn', 'Format rastrowy akceptowalny, ale PDF jest preferowany');
        else dtpHtml += checkRow('Format', imgData.format || 'Nieznany', 'err', 'Nieobsługiwany format pliku');

        // 5-8. PDF Specific (Overprint, Fonts, Layers, Pages)
        if (imgData.format === 'PDF') {
            if (imgData.pdfOverprint === false) dtpHtml += checkRow('Overprint', 'Brak (OK)', 'ok', 'Nie wykryto atrybutu overprint');
            else if (imgData.pdfOverprint === true) dtpHtml += checkRow('Overprint', 'Wykryto', 'err', 'Overprint nie jest obsługiwany przez drukarnię');
            else { dtpHtml += checkRow('Overprint', 'Nieanalizowany', 'unknown', 'Uzupełnij dane'); dtpTotal--; }

            if (imgData.pdfFonts && imgData.pdfFonts.length === 0) dtpHtml += checkRow('Fonty (krzywe)', 'Wszystkie zamienione', 'ok', 'Wszystkie fonty zamienione na krzywe');
            else if (imgData.pdfFonts && imgData.pdfFonts.length > 0) dtpHtml += checkRow('Fonty (krzywe)', `Wykryto ${imgData.pdfFonts.length}`, 'err', 'Zamień wszystkie fonty na krzywe w projekcie');
            else { dtpHtml += checkRow('Fonty (krzywe)', 'Nieanalizowane', 'unknown', 'Uzupełnij dane'); dtpTotal--; }

            if (!imgData.pdfLayers || imgData.pdfLayers.length <= 1) dtpHtml += checkRow('Warstwy', 'Spłaszczone', 'ok', 'Brak warstw (spłaszczone)');
            else dtpHtml += checkRow('Warstwy', `${imgData.pdfLayers.length} warstw`, 'warn', 'Projekt zawiera warstwy - mogą powodować problemy na RIPie');

            if (imgData.pages <= 1) dtpHtml += checkRow('Strony', '1', 'ok', 'Jedna strona - poprawnie');
            else dtpHtml += checkRow('Strony', `${imgData.pages}`, 'err', 'Akceptowane są tylko pliki jednostronicowe');
        } else {
            // Rastry nie mają overprintu ani fontów - zaliczamy automatycznie
            dtpHtml += checkRow('Overprint', 'Nie dotyczy (raster)', 'ok', '');
            dtpHtml += checkRow('Fonty (krzywe)', 'Nie dotyczy (raster)', 'ok', '');
            dtpHtml += checkRow('Warstwy', 'Nie dotyczy', 'ok', '');
            dtpHtml += checkRow('Strony', '1', 'ok', '');
        }

        // Wynik punktowy
        dtpHtml += `<div style="margin-top:10px; padding-top:10px; border-top:1px dashed #444; text-align:center; font-size:12px;">
 Wynik: ${dtpScore}/${dtpTotal} ✅ &nbsp;&nbsp; ${dtpWarns} ⚠️ &nbsp;&nbsp; ${dtpErrors} ❌
 </div>`;

        // Przycisk do analizy szczegółowej PDF
        if (imgData.colorProfile === null) {
            dtpHtml += `<button onclick="document.getElementById('wydrukiScannerModal').style.display='none'; analyzeWydrukiAdvanced()" style="width:100%; margin-top:10px; background:#6c5ce7; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">🔬 Uzupełnij dane o pliku</button>`;
        }

        dtpHtml += `</div>`;

        // ==========================================
        // SEKCJA B: ANALIZA WIZUALNA (WYŻSZE PROGI)
        // ==========================================
        let visualHtml = `<div style="font-weight:bold; font-size:14px; margin-bottom:5px; color:#aaa;">🔬 Analiza wizualna</div>`;

        // Skanujemy duży obszar centralny
        const sampleW = Math.min(w, 2500);
        const sampleH = Math.min(h, 2500);
        const startX = Math.floor((w - sampleW) / 2);
        const startY = Math.floor((h - sampleH) / 2);

        const imgDataRaw = ctx.getImageData(startX, startY, sampleW, sampleH);
        const data = imgDataRaw.data;

        function getColor(x, y) {
            const idx = (y * sampleW + x) * 4;
            return [data[idx], data[idx + 1], data[idx + 2]];
        }
        function colorDiff(c1, c2) {
            return Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]) + Math.abs(c1[2] - c2[2]);
        }

        function getCandidatesInRange(possible, centerX, range) {
            const results = [];
            for (let step of possible) {
                if (step.visited) continue;
                if (step.center.x < centerX - range) continue;
                if (step.center.x > centerX + range) break;
                results.push(step);
            }
            return results;
        }
        function getVCandidatesInRange(possible, centerY, range) {
            const results = [];
            for (let step of possible) {
                if (step.visited) continue;
                if (step.center.y < centerY - range) continue;
                if (step.center.y > centerY + range) break;
                results.push(step);
            }
            return results;
        }

        // --- 1. Pikseloza (PODWYŻSZONE PROGI) ---
        let edgeSegments = [];
        const EDGE_THRESH = 80; // Było 15
        const UNIFORM_THRESH = 25; // Było 40

        for (let y = 0; y < sampleH - 1; y += 2) {
            let runLen = 0;
            let runStartX = 0;
            for (let x = 0; x < sampleW; x++) {
                const c1 = getColor(x, y);
                const c2 = getColor(x, y + 1);
                if (colorDiff(c1, c2) > EDGE_THRESH) {
                    if (runLen === 0) runStartX = x;
                    runLen++;
                } else {
                    if (runLen >= 3 && runLen <= 100) {
                        const startAbove = getColor(runStartX, y);
                        const startBelow = getColor(runStartX, y + 1);
                        const endAbove = getColor(x - 1, y);
                        const endBelow = getColor(x - 1, y + 1);

                        if (colorDiff(startAbove, endAbove) < UNIFORM_THRESH && colorDiff(startBelow, endBelow) < UNIFORM_THRESH) {
                            edgeSegments.push({ x: startX + runStartX, y: startY + y, w: runLen, h: 2 });
                        }
                    }
                    runLen = 0;
                }
            }
        }

        for (let x = 0; x < sampleW - 1; x += 2) {
            let runLen = 0;
            let runStartY = 0;
            for (let y = 0; y < sampleH; y++) {
                const c1 = getColor(x, y);
                const c2 = getColor(x + 1, y);
                if (colorDiff(c1, c2) > EDGE_THRESH) {
                    if (runLen === 0) runStartY = y;
                    runLen++;
                } else {
                    if (runLen >= 3 && runLen <= 100) {
                        const startLeft = getColor(x, runStartY);
                        const startRight = getColor(x + 1, runStartY);
                        const endLeft = getColor(x, y - 1);
                        const endRight = getColor(x + 1, y - 1);

                        if (colorDiff(startLeft, endLeft) < UNIFORM_THRESH && colorDiff(startRight, endRight) < UNIFORM_THRESH) {
                            edgeSegments.push({ x: startX + x, y: startY + runStartY, w: 2, h: runLen });
                        }
                    }
                    runLen = 0;
                }
            }
        }

        let clusters = [];
        for (const seg of edgeSegments) {
            let found = false;
            for (let i = 0; i < clusters.length; i++) {
                const c = clusters[i];
                const isClose = (
                    seg.x < c.x + c.w + 40 && // Było 60
                    seg.x + seg.w + 40 > c.x &&
                    seg.y < c.y + c.h + 40 &&
                    seg.y + seg.h + 40 > c.y
                );
                if (isClose) {
                    c.x = Math.min(c.x, seg.x);
                    c.y = Math.min(c.y, seg.y);
                    c.w = Math.max(c.x + c.w, seg.x + seg.w) - c.x;
                    c.h = Math.max(c.y + c.h, seg.y + seg.h) - c.y;
                    c.count++;
                    c.stepSizes.push(Math.max(seg.w, seg.h));
                    found = true;
                    break;
                }
            }
            if (!found) clusters.push({ x: seg.x, y: seg.y, w: seg.w, h: seg.h, count: 1, stepSizes: [Math.max(seg.w, seg.h)] });
        }

        let finalClusters = clusters.filter(c => c.count >= 25); // Było 8

        // --- 2. Schodkowanie (PODWYŻSZONE PROGI) ---
        const STAIR_EDGE_THRESH = 60; // Było 25
        const hStepsByY = Array.from({ length: sampleH }, () => []);
        const vStepsByX = Array.from({ length: sampleW }, () => []);

        for (let y = 0; y < sampleH - 1; y++) {
            let runLen = 0, runStartX = 0;
            for (let x = 0; x < sampleW; x++) {
                if (colorDiff(getColor(x, y), getColor(x, y + 1)) > STAIR_EDGE_THRESH) {
                    if (runLen === 0) runStartX = x;
                    runLen++;
                } else {
                    if (runLen >= 4 && runLen <= 15) { // Było 2
                        hStepsByY[y].push({ x: startX + runStartX, y: startY + y, w: runLen, h: 1, center: { x: startX + runStartX + runLen / 2, y: startY + y + 0.5 }, visited: false });
                    }
                    runLen = 0;
                }
            }
        }

        for (let x = 0; x < sampleW - 1; x++) {
            let runLen = 0, runStartY = 0;
            for (let y = 0; y < sampleH; y++) {
                if (colorDiff(getColor(x, y), getColor(x + 1, y)) > STAIR_EDGE_THRESH) {
                    if (runLen === 0) runStartY = y;
                    runLen++;
                } else {
                    if (runLen >= 4 && runLen <= 15) { // Było 2
                        vStepsByX[x].push({ x: startX + x, y: startY + runStartY, w: 1, h: runLen, center: { x: startX + x + 0.5, y: startY + runStartY + runLen / 2 }, visited: false });
                    }
                    runLen = 0;
                }
            }
        }

        let allChains = [];
        function buildChain(startStep, isHoriz) {
            startStep.visited = true;
            let chain = [startStep];
            let current = startStep;
            let lastValid = true;
            while (lastValid && chain.length < 50) {
                lastValid = false;
                const nextIdx = isHoriz ? (current.y - startY + 1) : (current.x - startX + 1);
                if (nextIdx >= (isHoriz ? sampleH : sampleW)) break;
                const possible = isHoriz ? hStepsByY[nextIdx] : vStepsByX[nextIdx];
                if (!possible) break;
                const candidates = isHoriz ? getCandidatesInRange(possible, current.center.x, 20) : getVCandidatesInRange(possible, current.center.y, 20);
                let best = null, bestErr = Infinity;
                for (let step of candidates) {
                    const err = Math.abs(isHoriz ? (step.center.x - current.center.x) : (step.center.y - current.center.y));
                    if (err < bestErr && err <= 6) { bestErr = err; best = step; }
                }
                if (best) { best.visited = true; chain.push(best); current = best; lastValid = true; }
            }
            return chain;
        }

        for (let y = 0; y < sampleH; y++) {
            for (let step of hStepsByY[y]) {
                if (!step.visited) {
                    const chain = buildChain(step, true);
                    if (chain.length >= 15) allChains.push(chain); // Było 6
                }
            }
        }
        for (let x = 0; x < sampleW; x++) {
            for (let step of vStepsByX[x]) {
                if (!step.visited) {
                    const chain = buildChain(step, false);
                    if (chain.length >= 15) allChains.push(chain); // Było 6
                }
            }
        }

        // --- 3. Rozmyte czcionki (PODWYŻSZONE PROGI) ---
        const gray = new Uint8Array(sampleW * sampleH);
        for (let i = 0; i < sampleW * sampleH; i++) {
            gray[i] = Math.round(0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]);
        }

        const Gx = new Uint16Array(sampleW * sampleH);
        const Gy = new Uint16Array(sampleW * sampleH);
        for (let y = 1; y < sampleH - 1; y++) {
            for (let x = 1; x < sampleW - 1; x++) {
                const idx = y * sampleW + x;
                Gx[idx] = Math.abs(gray[idx + 1] - gray[idx - 1]);
                Gy[idx] = Math.abs(gray[idx + sampleW] - gray[idx - sampleW]);
            }
        }

        const blockSize = 64;
        const blocksX = Math.floor(sampleW / blockSize);
        const blocksY = Math.floor(sampleH / blockSize);
        const blurredBlocks = [];

        for (let by = 0; by < blocksY; by++) {
            for (let bx = 0; bx < blocksX; bx++) {
                const bStartX = bx * blockSize;
                const bStartY = by * blockSize;
                let edgeCount = 0, totalEdgeWidth = 0, minVal = 255, maxVal = 0;

                for (let y = bStartY + 1; y < bStartY + blockSize - 1; y++) {
                    for (let x = bStartX + 1; x < bStartX + blockSize - 1; x++) {
                        const idx = y * sampleW + x;
                        const val = gray[idx];
                        if (val < minVal) minVal = val;
                        if (val > maxVal) maxVal = val;

                        const gx = Gx[idx];
                        const gy = Gy[idx];

                        if (gx > 30 && gx > Gx[idx - 1] && gx > Gx[idx + 1]) { // Było 12
                            let left = x, right = x;
                            while (left > bStartX && Gx[y * sampleW + left - 1] > 0.1 * gx) left--;
                            while (right < bStartX + blockSize - 1 && Gx[y * sampleW + right + 1] > 0.1 * gx) right++;
                            const width = right - left + 1;
                            if (width >= 1 && width <= 15) { totalEdgeWidth += width; edgeCount++; }
                        }

                        if (gy > 30 && gy > Gy[idx - sampleW] && gy > Gy[idx + sampleW]) { // Było 12
                            let top = y, bottom = y;
                            while (top > bStartY && Gy[(top - 1) * sampleW + x] > 0.1 * gy) top--;
                            while (bottom < bStartY + blockSize - 1 && Gy[(bottom + 1) * sampleW + x] > 0.1 * gy) bottom++;
                            const height = bottom - top + 1;
                            if (height >= 1 && height <= 15) { totalEdgeWidth += height; edgeCount++; }
                        }
                    }
                }

                const contrast = maxVal - minVal;
                if (contrast > 80) { // Było 50
                    const avgWidth = edgeCount > 0 ? totalEdgeWidth / edgeCount : 0;
                    if (edgeCount >= 50 && avgWidth > 4.5) { // Było 20 i 3.0
                        blurredBlocks.push({ x: startX + bStartX, y: startY + bStartY, w: blockSize, h: blockSize });
                    }
                }
            }
        }

        let blueClusters = [];
        for (const b of blurredBlocks) {
            let found = false;
            for (const c of blueClusters) {
                if (b.x < c.x + c.w + 64 && b.x + b.w + 64 > c.x && b.y < c.y + c.h + 64 && b.y + b.h + 64 > c.y) {
                    c.x = Math.min(c.x, b.x); c.y = Math.min(c.y, b.y);
                    c.w = Math.max(c.x + c.w, b.x + b.w) - c.x; c.h = Math.max(c.y + c.h, b.y + b.h) - c.y;
                    c.count++; found = true; break;
                }
            }
            if (!found) blueClusters.push({ x: b.x, y: b.y, w: b.w, h: b.h, count: 1 });
        }

        // --- RYSOWANIE WYNIKÓW ---
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ff0000';
        for (const c of finalClusters) { ctx.strokeRect(c.x, c.y, c.w, c.h); ctx.fillStyle = 'rgba(255,0,0,0.15)'; ctx.fillRect(c.x, c.y, c.w, c.h); }

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffd32d';
        for (const chain of allChains) {
            ctx.beginPath(); ctx.moveTo(chain[0].center.x, chain[0].center.y);
            for (let k = 1; k < chain.length; k++) ctx.lineTo(chain[k].center.x, chain[k].center.y);
            ctx.stroke();
        }

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#0066ff';
        for (const c of blueClusters) { ctx.strokeRect(c.x, c.y, c.w, c.h); ctx.fillStyle = 'rgba(0,102,255,0.1)'; ctx.fillRect(c.x, c.y, c.w, c.h); }

        // --- RAPORT WIZUALNY ---
        if (finalClusters.length > 0) visualHtml += `<div style="font-size:12px; color:#ff5555; margin-bottom:4px;">⚠️ Pikseloza wykryta (Poważny upscaling)</div>`;
        else visualHtml += `<div style="font-size:12px; color:#aaa; margin-bottom:4px;">✅ Brak ewidentnej pikselozy</div>`;

        if (allChains.length > 0) visualHtml += `<div style="font-size:12px; color:#ffd32d; margin-bottom:4px;">⚠️ Widoczne ząbkowanie linii diagonalnych</div>`;
        else visualHtml += `<div style="font-size:12px; color:#aaa; margin-bottom:4px;">✅ Brak ostrego ząbkowania</div>`;

        if (blueClusters.length > 0) visualHtml += `<div style="font-size:12px; color:#0066ff; margin-bottom:4px;">⚠️ Poważne rozmycie elementów grafiki</div>`;
        else visualHtml += `<div style="font-size:12px; color:#aaa; margin-bottom:4px;">✅ Brak rozmytego tekstu/elementów</div>`;

        resultDiv.innerHTML = dtpHtml + visualHtml;

    } catch (e) {
        console.error(e);
        resultDiv.innerHTML = '❌ Błąd analizy algorytmicznej.';
    }

}
/**
 * Asynchroniczny silnik automatycznego dobierania i losowania grafik teksturalnych
 * z obsługą łączenia płaszczyzn (Plane-Aware Aspect Ratio Solver) dla Mateusza.
 */
async function randomizeProjectGraphics(btnElement) {
    const btn = btnElement || document.getElementById('btnRandomizeGraphics');

    // 1. TRYB RESETU: Przywracanie czystej bieli tkanin wystawienniczych
    if (window.isGraphicsRandomized) {
        if (btn) btn.innerHTML = '⏳ Wybielanie stoiska...';

        if (window.currentKasetonConfig) {
            const conf = window.currentKasetonConfig;
            conf.textureFront = null; conf.textureFrontName = null;
            conf.textureBack = null; conf.textureBackName = null;
        }

        plan.forEach(item => {
            if (item.type === 'wall' || item.type === 'freestanding' || item.type === 'freestanding_s') {
                item.textureFront = null; item.textureFrontName = null;
                item.textureBack = null; item.textureBackName = null;
            } else if (item.type === 'suspended' || item.type === 'suspended_ring' || item.type === 'kantorek_1x1') {
                item.quadTextures = {};
            }

            if (item.accessories) {
                item.accessories.forEach(acc => {
                    if (acc.id === 'daszek') {
                        acc.texRoofFront = null; acc.texRoofFrontName = null;
                        acc.texRoofBack = null; acc.texRoofBackName = null;
                        acc.texLegFront = null; acc.texLegFrontName = null;
                        acc.texLegBack = null; acc.texLegBackName = null;
                    }
                });
            }
        });

        window.isGraphicsRandomized = false;
        if (btn) {
            btn.innerHTML = '🎲 Losuj grafiki';
            btn.style.background = 'linear-gradient(135deg, #10ac84, #1dd1a1)';
            btn.style.color = '#000';
        }

        render();
        if (typeof refreshGraphicsList === 'function') refreshGraphicsList();
        return;
    }

    // 2. TRYB LOSOWANIA: Pobieranie i inteligentne dopasowywanie
    if (btn) btn.innerHTML = '⏳ Losowanie...';

    const generateSolidColorTexture = (colorHex) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1; canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = colorHex;
        ctx.fillRect(0, 0, 1, 1);
        return canvas.toDataURL('image/jpeg', 0.95);
    };

    const greenFallback = {
        url: generateSolidColorTexture('#20bf6b'),
        name: 'MOCK_ZIELONA_APLA_FALLBACK.jpg'
    };

    try {
        const response = await fetch('https://api.github.com/repos/MPZAdsystem/CONFIG/contents/Zapisane%20grafiki');
        if (!response.ok) throw new Error('GitHub API Error');
        const files = await response.json();

        const validExts = ['jpg', 'jpeg', 'png', 'pdf', 'tif', 'tiff'];
        const sysLower = currentSystem.toLowerCase();

        const parsedGraphics = files
            .filter(f => f.type === 'file' && validExts.includes(f.name.split('.').pop().toLowerCase()))
            .map(f => {
                const nameLower = f.name.toLowerCase();
                const dimMatch = f.name.match(/(\d+)\s*[xX*]\s*(\d+)/);
                let w = 100, h = 100;
                if (dimMatch) {
                    w = parseInt(dimMatch[1], 10);
                    h = parseInt(dimMatch[2], 10);
                }
                return {
                    name: f.name,
                    url: f.download_url,
                    width: w,
                    height: h,
                    ratio: w / h,
                    isGeneric: nameLower.includes('generic'),
                    systems: ['sego', 'foldable', 'adframe', 'multiframe'].filter(sys => nameLower.includes(sys))
                };
            });

        // Inteligentny Solver Proporcji z uwzględnieniem tolerancji
        const findBestGraphic = (targetW, targetH) => {
            const targetRatio = targetW / targetH;

            let pool = parsedGraphics.filter(g => g.isGeneric || g.systems.includes(sysLower));
            if (pool.length === 0) pool = parsedGraphics.filter(g => g.isGeneric);
            if (pool.length === 0) pool = parsedGraphics;
            if (pool.length === 0) return greenFallback;

            let minDiff = Infinity;
            pool.forEach(g => {
                const diff = Math.abs(g.ratio - targetRatio);
                if (diff < minDiff) minDiff = diff;
            });

            // Bezpiecznik: jeśli rozjazd proporcji przekracza 0.4, ładujemy zieleń
            if (minDiff > 0.4) {
                return greenFallback;
            }

            const bestMatches = pool.filter(g => Math.abs(Math.abs(g.ratio - targetRatio) - minDiff) < 0.02);
            return bestMatches[Math.floor(Math.random() * bestMatches.length)];
        };

        // ═══════════════════════════════════════════════════════════
        // MAPOWANIE CIĄGÓW ŚCIAN DLA SYSTEMU FOLDABLE (BEZSZWOWE PANORAMY)
        // ═══════════════════════════════════════════════════════════
        let foldableWidthMap = {};
        if (currentSystem === 'foldable' && typeof foldablePlanes !== 'undefined') {
            foldablePlanes.forEach(plane => {
                if (!plane.walls || plane.walls.length === 0) return;

                // Obliczamy całkowity wymiar połączonej ściany
                let totalLen = plane.walls.reduce((sum, w) => sum + w.length, 0);
                let leaderItem = plane.walls[0];
                let originalPlanItem = plan[leaderItem.planIndex];
                let fSet = (originalPlanItem && originalPlanItem.foldableSettings) ? originalPlanItem.foldableSettings : { div: 'seamless', side: 'double', hasPrint: false };

                // Domyślnie flagujemy wszystkie moduły w płaszczyźnie jako ukryte/podrzędne
                plane.walls.forEach(w => {
                    foldableWidthMap[w.planIndex] = { w: w.length, h: w.height, skip: true };
                });

                if (fSet.div === 'seamless') {
                    // Tylko lider ciągu otrzymuje pełnowymiarową grafikę panoramy!
                    foldableWidthMap[leaderItem.planIndex] = { w: totalLen, h: leaderItem.height, skip: false };
                }
                else if (fSet.div === 'half') {
                    let len1 = Math.ceil((totalLen / 2) / 100) * 100;
                    if (len1 >= totalLen) len1 = totalLen / 2;
                    let len2 = totalLen - len1;

                    let MathMidIndex = Math.floor(plane.walls.length / 2);
                    let wall2Ref = plane.walls[MathMidIndex] || leaderItem;

                    foldableWidthMap[leaderItem.planIndex] = { w: len1, h: leaderItem.height, skip: false };
                    foldableWidthMap[wall2Ref.planIndex] = { w: len2, h: wall2Ref.height, skip: false };
                }
                else if (fSet.div === 'single') {
                    plane.walls.forEach(w => {
                        foldableWidthMap[w.planIndex] = { w: w.length, h: w.height, skip: false };
                    });
                }
            });
        }

        let updatedAny = false;

        if (currentSystem === 'kasetony_niestandardowe' && window.currentKasetonConfig) {
            const conf = window.currentKasetonConfig;
            const kw = parseFloat(conf.width) || 100;
            const kh = parseFloat(conf.depth) || 200;

            if (conf.print !== 'no_print') {
                const gFront = findBestGraphic(kw, kh);
                if (gFront) { conf.textureFront = gFront.url; conf.textureFrontName = gFront.name; updatedAny = true; }
                if (['double', 'backlit_blockout', 'backlit_white'].includes(conf.print)) {
                    const gBack = findBestGraphic(kw, kh);
                    if (gBack) { conf.textureBack = gBack.url; conf.textureBackName = gBack.name; }
                }
            }
        } else {
            plan.forEach((item, index) => {
                if (item.type === 'wall') {
                    let targetW = item.length;
                    let targetH = item.height;

                    // Nadpisanie wymiarów celowych dla bezszwowych grafik Foldable
                    if (currentSystem === 'foldable' && foldableWidthMap[index]) {
                        if (foldableWidthMap[index].skip) {
                            // Czyszczenie tekstur podrzędnych modułów ramy
                            item.textureFront = null; item.textureFrontName = null;
                            item.textureBack = null; item.textureBackName = null;
                            return;
                        }
                        targetW = foldableWidthMap[index].w;
                        targetH = foldableWidthMap[index].h;
                    }

                    const gFront = findBestGraphic(targetW, targetH);
                    if (gFront) { item.textureFront = gFront.url; item.textureFrontName = gFront.name; updatedAny = true; }
                    const gBack = findBestGraphic(targetW, targetH);
                    if (gBack) { item.textureBack = gBack.url; item.textureBackName = gBack.name; }
                }
                else if (item.type === 'freestanding' || item.type === 'freestanding_s') {
                    const gFront = findBestGraphic(item.width, item.height);
                    if (gFront) { item.textureFront = gFront.url; item.textureFrontName = gFront.name; updatedAny = true; }
                    const gBack = findBestGraphic(item.width, item.height);
                    if (gBack) { item.textureBack = gBack.url; item.textureBackName = gBack.name; }
                }
                else if (item.type === 'suspended' || item.type === 'suspended_ring') {
                    if (!item.quadTextures) item.quadTextures = {};
                    const maxSegs = item.type === 'suspended_ring' ? 3 : 4;
                    const segW = item.width || item.diameter || 300;
                    const segH = item.height || 100;

                    for (let i = 1; i <= maxSegs; i++) {
                        const gOut = findBestGraphic(segW, segH);
                        if (gOut) { item.quadTextures['Out' + i] = gOut.url; item.quadTextures['Out' + i + 'Name'] = gOut.name; updatedAny = true; }
                        const gIn = findBestGraphic(segW, segH);
                        if (gIn) { item.quadTextures['In' + i] = gIn.url; item.quadTextures['In' + i + 'Name'] = gIn.name; }
                    }
                }
                else if (item.type === 'kantorek_1x1') {
                    if (!item.quadTextures) item.quadTextures = {};
                    for (let i = 1; i <= 4; i++) {
                        const gOut = findBestGraphic(100, 250);
                        if (gOut) { item.quadTextures['Out' + i] = gOut.url; item.quadTextures['Out' + i + 'Name'] = gOut.name; updatedAny = true; }
                        const gIn = findBestGraphic(100, 250);
                        if (gIn) { item.quadTextures['In' + i] = gIn.url; item.quadTextures['In' + i + 'Name'] = gIn.name; }
                    }
                }

                if (item.accessories) {
                    item.accessories.forEach(acc => {
                        if (acc.id === 'daszek') {
                            const gRoof = findBestGraphic(100, 250);
                            if (gRoof) { acc.texRoofFront = gRoof.url; acc.texRoofFrontName = gRoof.name; acc.texRoofBack = gRoof.url; acc.texRoofBackName = gRoof.name; updatedAny = true; }
                            const gLeg = findBestGraphic(100, item.height);
                            if (gLeg) { acc.texLegFront = gLeg.url; acc.texLegFrontName = gLeg.name; acc.texLegBack = gLeg.url; acc.texLegBackName = gLeg.name; }
                        }
                    });
                }
            });
        }

        if (updatedAny) {
            window.isGraphicsRandomized = true;
            if (btn) {
                btn.innerHTML = '🚫 Przywróć biel';
                btn.style.background = 'linear-gradient(135deg, #34495e, #2c3e50)';
                btn.style.color = '#fff';
            }
            render();
            if (typeof refreshGraphicsList === 'function') refreshGraphicsList();
        } else {
            alert('Projekt jest pusty. Postaw najpierw moduły ramy, abym miał co kolorować!');
        }

    } catch (error) {
        console.error('Anomalia sieciowa repozytorium GitHub:', error);
        alert('Błąd API GitHub. Spróbuj ponownie.');
    } finally {
        if (!window.isGraphicsRandomized && btn) btn.innerHTML = '🎲 Losuj grafiki';
    }
}