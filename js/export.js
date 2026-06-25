function saveProjectLocal() {
    if (plan.length === 0 && floorConfig.type === 'none') {
        alert("Projekt jest pusty. Nie ma czego zapisywać!");
        return;
    }

    // Pakujemy cały stan aplikacji do jednego obiektu
    const projectData = {
        version: 1,
        system: currentSystem,
        projectName: document.getElementById('projectName').value,
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        floorConfig: floorConfig,
        plan: plan
    };

    // ZMIANA: Zapis do Blob pozwala na zapisywanie ogromnych grafik bez zawieszania przeglądarki
    const jsonString = JSON.stringify(projectData);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Tworzymy wirtualny link do pobrania i symulujemy kliknięcie
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);

    let pName = projectData.projectName ? projectData.projectName.replace(/\s+/g, '_') : 'BezNazwy';
    downloadAnchorNode.setAttribute("download", `EXPO_${pName}.json`);

    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // Czyszczenie pamięci tymczasowej
    URL.revokeObjectURL(url);

    // Próba zapisu na serwerze (w tle)
    uploadProjectToServer(projectData.projectName, jsonString);
}

function generateBOMCSV() {
    let csv = "Index/SKU;Nazwa;Wymiary;Ilosc;Cena jedn. (EUR);Razem (EUR)\r\n";
    if (typeof globalCounts === 'undefined' || !globalCounts) {
        return csv;
    }
    for (let name in globalCounts) {
        let item = globalCounts[name];
        let baseObj = typeof DB !== 'undefined' ? Object.values(DB).find(e => e.name === name) : null;
        let catNo = baseObj ? (baseObj.catNo || "-") : "-";
        
        let dimText = "-";
        if (baseObj && (baseObj.width || baseObj.length)) {
            dimText = `${baseObj.width || baseObj.length} x ${baseObj.height || baseObj.depth} cm`;
        }

        let cleanName = name.replace(/"/g, '""');
        let qty = item.qty;
        let unitPrice = item.unitPrice || 0;
        let total = item.total || (qty * unitPrice);

        csv += `"${catNo}";"${cleanName}";"${dimText}";${qty};${unitPrice.toFixed(2)};${total.toFixed(2)}\r\n`;
    }
    return csv;
}

function getIntranetXlsBase64() {
    if (typeof window.initIntranetBomDraft === 'function') {
        window.initIntranetBomDraft();
    }
    if (!window.intranetBOMDraft || window.intranetBOMDraft.length === 0) {
        return "";
    }
    const rows = [];
    rows.push([
        'ID Produktu',
        'ID Produktu\nnadrzędnego',
        'Nazwa\n(ignorowane)',
        'Ilość',
        'Cena netto',
        'VAT',
        'Nazwa wyświetlana',
        'Opis',
        'Dodaj BOM'
    ]);
    window.intranetBOMDraft.forEach(item => {
        const idVal = (item.isParent || !item.isKaseton) ? (item.id ? parseFloat(item.id) : null) : null;
        const parentIdVal = (!item.isParent && item.isKaseton) ? (item.parentId ? parseFloat(item.parentId) : null) : null;
        rows.push([
            idVal,
            parentIdVal,
            item.name,
            item.qty !== null ? parseFloat(item.qty) : null,
            item.price !== null ? parseFloat(item.price) : null,
            item.vat,
            item.displayName || null,
            item.description || null,
            0
        ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Worksheet");
    return XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
}

function uploadProjectToServer(projectName, jsonString, customXlsBase64 = null) {
    let csvString = "";
    if (typeof generateBOMCSV === 'function') {
        csvString = generateBOMCSV();
    }

    let xlsBase64 = "";
    if (customXlsBase64 !== null) {
        xlsBase64 = customXlsBase64;
    } else if (typeof getIntranetXlsBase64 === 'function') {
        xlsBase64 = getIntranetXlsBase64();
    }

    fetch('Api/api_save.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectName: projectName || 'BezNazwy',
            jsonData: jsonString,
            csvData: csvString,
            xlsData: xlsBase64
        })
    })
    .then(response => {
        if (response.status === 401) {
            console.warn("Wygasła sesja serwerowa. Wyświetlanie ekranu logowania.");
            if (typeof showNotification === 'function') {
                showNotification("Sesja wygasła", "Twoja sesja wygasła. Zaloguj się ponownie, aby zapisać projekt na serwerze.");
            }
            const overlay = document.getElementById('loginOverlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
            throw new Error('Session expired (401)');
        }
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'OK') {
            console.log("Projekt został automatycznie zapisany na serwerze:", data.files);
            showNotification("Zapisano na serwerze", "Zaktualizowano pliki projektu (.json i .csv).");
        } else {
            console.warn("Błąd zapisu na serwerze:", data.message);
        }
    })
    .catch(err => {
        console.warn("Brak zapisu na serwerze (lokalny dev lub brak sesji):", err);
    });
}

function showNotification(title, message) {
    let toast = document.getElementById('expo-toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'expo-toast-notification';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a1a1a;
            color: #fff;
            padding: 12px 20px;
            border-radius: 8px;
            border-left: 4px solid #00e5ff;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            z-index: 100000;
            font-family: sans-serif;
            font-size: 13px;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateY(20px);
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<strong style="color: #00e5ff; display: block; margin-bottom: 4px;">${title}</strong>${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 4000);
}


function loadProjectLocal() {
    // Wywołujemy kliknięcie w nasz ukryty input typu file
    document.getElementById('loadFileInput').click();
}

function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            // Odtwarzanie danych tekstowych (z zabezpieczeniem sprawdzającym, czy pole istnieje)
            if (document.getElementById('projectName')) document.getElementById('projectName').value = data.projectName || '';
            if (document.getElementById('customerName')) document.getElementById('customerName').value = data.customerName || '';
            if (document.getElementById('customerEmail')) document.getElementById('customerEmail').value = data.customerEmail || '';

            // Odtwarzanie systemu
            if (data.system) {
                currentSystem = data.system;
                // POPRAWKA: Zmiana systemType na prawidłowe ID: systemSelector
                const sysSel = document.getElementById('systemSelector');
                if (sysSel) sysSel.value = data.system;

                document.querySelectorAll('.system-ui-panel').forEach(panel => panel.style.display = 'none');
                const activePanel = document.getElementById('ui-system-' + currentSystem);
                if (activePanel) activePanel.style.display = 'block';
            }

            // Odtwarzanie podłogi
            if (data.floorConfig) {
                floorConfig = data.floorConfig;
                if (document.getElementById('floorType')) document.getElementById('floorType').value = floorConfig.type || 'none';
                if (document.getElementById('floorWidth')) document.getElementById('floorWidth').value = floorConfig.width || '';
                if (document.getElementById('floorDepth')) document.getElementById('floorDepth').value = floorConfig.depth || '';
            }

            // Odtwarzanie ścian i akcesoriów
            if (data.plan) {
                plan = data.plan;
            }

            // POPRAWKA: Prawidłowa zmienna globalna to selectedItemIndex
            selectedItemIndex = null;
            render(); // Przeliczamy i rysujemy od nowa
            if (typeof refreshGraphicsList === 'function') refreshGraphicsList();

            alert("Projekt załadowany pomyślnie!");
        } catch (err) {
            alert("Błąd odczytu pliku. Upewnij się, że to poprawny plik projektu (.json).");
            console.error("Szczegóły błędu parsowania:", err);
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset inputa, by można było wgrać ten sam plik ponownie
}

const PARENT_PRODUCTS = {
    'LMS': { id: 10331, name: 'adFrame LMS (bez wydruku)' },
    'LMD': { id: 10334, name: 'adFrame LMD (bez wydruku)' },
    'LMSM': { id: 10444, name: 'adFrame LMSM (bez wydruku)' },
    'DTF': { id: 10332, name: 'adFrame DTF (bez wydruku)' },
    'STFL': { id: 10594, name: 'adFrame STFL (bez wydruku)' },
    'CTF': { id: 18337, name: 'adFrame CTF' },
    'CTF_LED': { id: 12160, name: 'adFrame CTF (bez wydruku)' },
    'LCD_LMD': { id: 10334, name: 'adFrame LMD (bez wydruku)' },
    'STF': { id: 18254, name: 'adFrame STF' } // <-- 1. DODANO AKTYWNE ID DLA STF
};

function saveToGoogleDrive() {
    if (typeof generateKasetonBOM === 'function') {
        generateKasetonBOM();
    }
    const bomItems = window.lastGeneratedBOM;
    if (!bomItems || bomItems.length === 0) {
        alert("Brak wygenerowanego zestawienia BOM do zapisania!");
        return;
    }
    window.initIntranetBomDraft();
    const modal = document.getElementById('intranetBomModalOverlay');
    if (modal) {
        modal.style.display = 'flex';
        window.renderIntranetBomTable();
    }
}

window.initIntranetBomDraft = function () {
    const config = window.currentKasetonConfig || {};
    const W = parseFloat(config.width) || 120;
    const H = parseFloat(config.depth) || 200;
    const sys = config.system || 'LMD';

    const bomItems = window.lastGeneratedBOM || [];
    const draft = [];
    const isKasetonSystem = (currentSystem === 'kasetony_niestandardowe');

    if (isKasetonSystem) {
        const parentInfo = PARENT_PRODUCTS[sys] || { id: null, name: 'Kaseton ' + sys };

        let usageStr = '';
        if (config.usage === 'freestanding') usageStr = 'wolnostojący';
        else if (config.usage === 'suspended') usageStr = 'wieszany';
        else if (config.usage === 'wall') usageStr = 'wieszany na ścianie';
        else usageStr = config.usage || '';

        let cutsStr = '';
        const numCutsW = config.numCutsW || 0;
        const numCutsH = config.numCutsH || 0;
        const totalCuts = numCutsW + numCutsH;
        if (totalCuts > 0) {
            cutsStr = `${totalCuts} (pionowe: ${numCutsW}, poziome: ${numCutsH})`;
        } else {
            cutsStr = 'brak (ramy w całości)';
        }

        let ledProfilesStr = 'brak';
        if (['LMD', 'LMS', 'LMSM', 'CTF_LED', 'LCD_LMD'].includes(sys)) {
            const ledOption = config.light || 'power_long';
            if (ledOption === 'no_light') {
                ledProfilesStr = 'brak';
            } else {
                const drawBottom = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
                const drawTop = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
                const drawLeft = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));
                const drawRight = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));

                if (drawBottom && drawTop && drawLeft && drawRight) {
                    ledProfilesStr = 'wszystkie 4 profile (obwodowo)';
                } else if (drawBottom && drawTop && !drawLeft && !drawRight) {
                    ledProfilesStr = 'profile poziome (góra + dół)';
                } else if (!drawBottom && !drawTop && drawLeft && drawRight) {
                    ledProfilesStr = 'profile pionowe (lewy + prawy)';
                } else {
                    const activeSides = [];
                    if (drawTop) activeSides.push('góra');
                    if (drawBottom) activeSides.push('dół');
                    if (drawLeft) activeSides.push('lewy');
                    if (drawRight) activeSides.push('prawy');
                    ledProfilesStr = activeSides.join(' + ') || 'brak';
                }
            }
        }

        let parentDesc = '';
        if (sys === 'CTF') {
            const D = parseFloat(config.height3D) || 120;
            const topPanel = config.topPanel || 'none';
            let topPanelStr = topPanel === 'none' ? 'brak blatu' : (topPanel === 'mdf' ? 'blat MDF' : (topPanel === 'plexi' ? 'blat PLEXI' : 'blat poliwęglan'));
            parentDesc = `Kostka CTF ${W}x${H}x${D} cm, zastosowanie: ${usageStr}, wykończenie: ${topPanelStr}`;
        } else {
            const totalPower = Math.round(config.totalPowerW || 0);
            parentDesc = `Kaseton ${sys} ${W}x${H} cm, zastosowanie: ${usageStr}, liczba cięć: ${cutsStr}, LED na profilach: ${ledProfilesStr}, moc LED: ${totalPower}W`;
        }

        const finalEUR = window.globalTotalEUR || 0;

        // 2. WYMUSZENIE CENY 0 DLA RODZICA STF/STFL/DTF (Produkt nadrzędny staje się czystym indeksem)
        draft.push({
            id: parentInfo.id,
            parentId: null,
            name: parentInfo.name,
            qty: 1,
            price: (sys === 'STF' || sys === 'STFL' || sys === 'DTF') ? 0 : finalEUR,
            vat: '23%',
            displayName: '',
            description: parentDesc,
            isParent: true,
            isManual: false,
            isKaseton: false
        });

        // Generowanie podzespołów składowych (Children)
        bomItems.forEach(item => {
            if (sys === 'CTF' && (item.intranetId === 18337 || item.name === 'adFrame CTF')) {
                return; // Przeskakuje do następnego elementu, nie dublując pozycji
            }
            let idVal = item.intranetId;
            if (!idVal) {
                if (window.KASETON_PRICES && window.KASETON_PRICES[item.name]) {
                    idVal = window.KASETON_PRICES[item.name].intranetId;
                }
                if (!idVal && typeof DB !== 'undefined') {
                    for (let key in DB) {
                        if (DB[key].name === item.name) { idVal = DB[key].intranetId || DB[key].catNo; break; }
                    }
                }
            }

            const isStandalone = item.isManual && !item.isKaseton;
            if (isStandalone) {
                draft.push({
                    id: idVal || null, parentId: null, name: item.name, qty: item.qty, price: item.price || 0, vat: '23%', displayName: '', description: '', isParent: false, isManual: true, isKaseton: false
                });
                return;
            }

            // 3. DLA STF/STFL/DTF WPISUJEMY CENĘ I ID BEZPOŚREDNIO DO DZIECKA (Bypass paczkowania cenowego)
            if (sys === 'STF' || sys === 'STFL' || sys === 'DTF') {
                draft.push({
                    id: idVal || null,
                    parentId: parentInfo.id, // Łączenie z id rodzica
                    name: item.name,
                    qty: item.qty,
                    price: item.price || 0, // Przekazanie realnej ceny podzespołu z bom.js
                    vat: '23%',            // Aktywacja stawki VAT dla wycenianej linii
                    displayName: '',
                    description: item.description || '',
                    isParent: false,
                    isManual: item.isManual || false,
                    isKaseton: true
                });
                return;
            }

            // Standardowa logika pakietowa dla LMD/LMS/LMSM (Ceny dzieci = null)
            const isMainProfile = item.name.startsWith('profil LMS') || item.name.startsWith('profil LMD') || item.name.startsWith('profil LMSM') || item.name.startsWith('profil LMSO');
            if (isMainProfile) {
                draft.push({
                    id: null, parentId: idVal || null, name: 'szerokość - ' + item.name, qty: W / 100, price: null, vat: '0%', displayName: '', description: `${W}cm / oświetlenie LED: ${ledProfilesStr} / cięcie: ${config.numCutsW > 0 ? 'cięty na pół' : 'cały'}`, isParent: false, isManual: false, isKaseton: true
                });
                draft.push({
                    id: null, parentId: idVal || null, name: 'wysokość - ' + item.name, qty: H / 100, price: null, vat: '0%', displayName: '', description: `${H}cm / cięcie: ${config.numCutsH > 0 ? 'cięty na pół' : 'cały'}`, isParent: false, isManual: false, isKaseton: true
                });
                return;
            }

            const isSupportProfile = item.name.includes('support') && item.name.includes('profil');
            if (isSupportProfile) {
                if (numCutsW > 0) {
                    draft.push({
                        id: null, parentId: idVal || null, name: 'support pionowy - ' + item.name, qty: H / 100, price: null, vat: '0%', displayName: '', description: 'krzyżowy', isParent: false, isManual: false, isKaseton: true
                    });
                }
                if (numCutsH > 0) {
                    draft.push({
                        id: null, parentId: idVal || null, name: 'support poziomy - ' + item.name, qty: W / 100, price: null, vat: '0%', description: 'krzyżowy', isParent: false, isManual: false, isKaseton: true
                    });
                }
                if (numCutsW === 0 && numCutsH === 0) {
                    draft.push({
                        id: null, parentId: idVal || null, name: item.name, qty: item.qty, price: null, vat: '0%', displayName: '', description: item.description || '', isParent: false, isManual: false, isKaseton: true
                    });
                }
                return;
            }

            draft.push({
                id: null, parentId: idVal || null, name: item.name, qty: item.qty, price: null, vat: '0%', displayName: '', description: item.description || '', isParent: false, isManual: item.isManual || false, isKaseton: true
            });
        });
    } else {
        bomItems.forEach(item => {
            let idVal = item.intranetId;
            if (!idVal) {
                if (window.KASETON_PRICES && window.KASETON_PRICES[item.name]) { idVal = window.KASETON_PRICES[item.name].intranetId; }
                if (!idVal && typeof DB !== 'undefined') {
                    for (let key in DB) { if (DB[key].name === item.name) { idVal = DB[key].intranetId || DB[key].catNo; break; } }
                }
            }
            draft.push({
                id: idVal || null, parentId: null, name: item.name, qty: item.qty, price: item.price || 0, vat: '23%', displayName: '', description: item.description || '', isParent: false, isManual: item.isManual || false, isKaseton: false
            });
        });
    }

    window.intranetBOMDraft = draft;
};

// 4. KOREKTA INTERFEJSU GRAFICZNEGO (Uwidocznienie cen i ID dzieci dla systemu STF)
window.renderIntranetBomTable = function () {
    const tbody = document.getElementById('intranetBomTableBody');
    if (!tbody) return;

    let html = '';
    window.intranetBOMDraft.forEach((item, idx) => {
        let rowClass = '';
        let prefix = '';
        if (item.isParent) {
            rowClass = 'parent-row';
        } else if (item.isKaseton) {
            rowClass = 'child-row';
            prefix = '├─ ';
        } else if (item.isManual) {
            rowClass = 'manual-row';
        }

        const priceVal = item.price !== null ? item.price.toFixed(2) : '';

        // Modyfikacja warunku: Jeśli element ma przypisaną cenę (jak w STF), wymuszamy wyświetlenie unikalnego ID podzespołu
        const idVal = (item.price !== null && !item.isParent) ? (item.id || '') : ((item.isParent || !item.isKaseton) ? (item.id || '') : (item.parentId || ''));

        const isDeleteDisabled = item.isParent || !item.isManual;
        const displayNameHtml = `<input type="text" class="row-display-name" value="${item.displayName || ''}" onchange="window.updateIntranetDraftField(${idx}, 'displayName', this.value)">`;
        const descHtml = `<input type="text" class="row-description" value="${item.description || ''}" onchange="window.updateIntranetDraftField(${idx}, 'description', this.value)">`;
        const qtyHtml = `<input type="number" step="0.01" class="row-qty" value="${item.qty}" onchange="window.updateIntranetDraftField(${idx}, 'qty', this.value)">`;

        // Uwidocznienie pól input ceny dla dzieci, które posiadają niezależną wycenę
        const priceHtml = (item.price !== null)
            ? `<input type="number" step="0.01" class="row-price" value="${priceVal}" onchange="window.updateIntranetDraftField(${idx}, 'price', this.value)">`
            : `<span style="color:#666; font-style:italic;">BOM (brak)</span>`;

        const vatOptions = ['23%', '8%', '5%', '0%', 'np.'];
        let vatHtml = `<select class="row-vat" onchange="window.updateIntranetDraftField(${idx}, 'vat', this.value)" style="width:70px;">`;
        vatOptions.forEach(opt => {
            const selected = item.vat === opt ? 'selected' : '';
            vatHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
        });
        vatHtml += `</select>`;

        const deleteBtnHtml = !isDeleteDisabled ? `<button class="btn-row-del" onclick="window.deleteIntranetDraftRow(${idx})" title="Usuń pozycję">🗑️</button>` : `<span style="color:#444;">—</span>`;
        const draggableAttr = item.isParent ? 'draggable="false"' : 'draggable="true"';

        html += `
                    <tr class="${rowClass}" data-index="${idx}" ${draggableAttr} ondragstart="window.handleIntranetDragStart(event, ${idx})" ondragover="window.handleIntranetDragOver(event, ${idx})" ondragleave="window.handleIntranetDragLeave(event, ${idx})" ondrop="window.handleIntranetDrop(event, ${idx})" ondragend="window.handleIntranetDragEnd(event)">
                        <td style="font-weight:600; text-align:left;">${prefix}${item.name}</td>
                        <td>${idVal}</td>
                        <td>${displayNameHtml}</td>
                        <td>${descHtml}</td>
                        <td>${qtyHtml}</td>
                        <td>${priceHtml}</td>
                        <td style="text-align: center;">${vatHtml}</td>
                        <td style="text-align: center;">${deleteBtnHtml}</td>
                    </tr>
                `;
    });
    tbody.innerHTML = html;
};

// Drag-and-Drop Global Handlers
window.handleIntranetDragStart = function (event, idx) {
    window.draggedRowIndex = idx;
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
};

window.handleIntranetDragOver = function (event, idx) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const tr = event.target.closest('tr');
    if (tr && !tr.classList.contains('dragging')) {
        tr.classList.add('drag-over');
    }
};

window.handleIntranetDragLeave = function (event, idx) {
    const tr = event.target.closest('tr');
    if (tr) {
        tr.classList.remove('drag-over');
    }
};

window.handleIntranetDragEnd = function (event) {
    event.target.classList.remove('dragging');
    const trs = document.querySelectorAll('#intranetBomTable tr');
    trs.forEach(tr => tr.classList.remove('drag-over'));
};

window.handleIntranetDrop = function (event, targetIdx) {
    event.preventDefault();
    const tr = event.target.closest('tr');
    if (tr) {
        tr.classList.remove('drag-over');
    }

    const draggedIdx = window.draggedRowIndex;
    if (draggedIdx === undefined || draggedIdx === null || draggedIdx === targetIdx) return;

    const draft = window.intranetBOMDraft;
    const itemA = draft[draggedIdx];
    const itemB = draft[targetIdx];

    if (!itemA || !itemB) return;
    if (itemA.isParent) return; // Cannot drag the main parent row

    // Check if dropped onto the parent row or a child row
    if (itemB.isParent || itemB.isKaseton) {
        // Change to a child BOM row
        itemA.isKaseton = true;
        const parentRow = draft.find(r => r.isParent);
        itemA.parentId = parentRow ? parentRow.id : null;
        itemA.id = null;
        itemA.vat = '0%';
        itemA.price = null;
    } else {
        // Change to a standalone item row
        itemA.isKaseton = false;
        itemA.parentId = null;

        let idVal = itemA.id || itemA.parentId;
        if (!idVal) {
            if (window.KASETON_PRICES && window.KASETON_PRICES[itemA.name]) {
                idVal = window.KASETON_PRICES[itemA.name].intranetId;
            }
            if (!idVal && typeof DB !== 'undefined') {
                for (let key in DB) {
                    if (DB[key].name === itemA.name) {
                        idVal = DB[key].intranetId || DB[key].catNo;
                        break;
                    }
                }
            }
        }
        itemA.id = idVal || null;
        itemA.vat = '23%';

        // Restore pricing if it is empty
        if (itemA.price === null || itemA.price === 0) {
            let basePrice = 0;
            if (window.KASETON_PRICES && window.KASETON_PRICES[itemA.name]) {
                const ratePLN = window.KURS_PLN_DYNAMIC || 4.20;
                basePrice = (window.KASETON_PRICES[itemA.name].plnPrice || 0) / ratePLN;
            } else if (typeof DB !== 'undefined') {
                for (let key in DB) {
                    if (DB[key].name === itemA.name) {
                        basePrice = DB[key].price || 0;
                        break;
                    }
                }
            }
            itemA.price = basePrice;
        }
    }

    // Reorder
    draft.splice(draggedIdx, 1);
    draft.splice(targetIdx, 0, itemA);

    // Re-render
    window.renderIntranetBomTable();
};

window.updateIntranetDraftField = function (index, field, value) {
    if (window.intranetBOMDraft[index]) {
        if (field === 'qty') {
            window.intranetBOMDraft[index][field] = value !== '' ? parseFloat(value) : 0;
        } else if (field === 'price') {
            window.intranetBOMDraft[index][field] = value !== '' ? parseFloat(value) : null;
        } else {
            window.intranetBOMDraft[index][field] = value;
        }
    }
};

window.deleteIntranetDraftRow = function (index) {
    const item = window.intranetBOMDraft[index];
    if (item && item.isManual) {
        if (typeof manualItems !== 'undefined') {
            for (let k in manualItems) {
                if (manualItems[k].name === item.name) {
                    delete manualItems[k];
                    break;
                }
            }
        }
        window.intranetBOMDraft.splice(index, 1);
        window.renderIntranetBomTable();
    }
};

window.closeIntranetBomModal = function () {
    const modal = document.getElementById('intranetBomModalOverlay');
    if (modal) modal.style.display = 'none';
};

window.openManualModalFromIntranet = function () {
    window.openedFromIntranetModal = true;
    openManualModal();
};

window.generateIntranetXls = function () {
    if (!window.intranetBOMDraft || window.intranetBOMDraft.length === 0) {
        alert("Brak danych do wygenerowania pliku XLS!");
        return;
    }

    const rows = [];

    // Add header row
    rows.push([
        'ID Produktu',
        'ID Produktu\nnadrzędnego',
        'Nazwa\n(ignorowane)',
        'Ilość',
        'Cena netto',
        'VAT',
        'Nazwa wyświetlana',
        'Opis',
        'Dodaj BOM'
    ]);

    // Add data rows
    window.intranetBOMDraft.forEach(item => {
        const idVal = (item.isParent || !item.isKaseton) ? (item.id ? parseFloat(item.id) : null) : null;
        const parentIdVal = (!item.isParent && item.isKaseton) ? (item.parentId ? parseFloat(item.parentId) : null) : null;

        rows.push([
            idVal,
            parentIdVal,
            item.name,
            item.qty !== null ? parseFloat(item.qty) : null,
            item.price !== null ? parseFloat(item.price) : null,
            item.vat,
            item.displayName || null,
            item.description || null,
            0
        ]);
    });

    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Worksheet");

    // Download
    const projectNameEl = document.getElementById('projectName');
    const pName = projectNameEl ? projectNameEl.value.trim() : 'Projekt';
    const filename = `${pName.replace(/\s+/g, '_')}_BOM.xlsx`;

    XLSX.writeFile(wb, filename);

    // Zapisz na serwerze wygenerowany XLS (w tle)
    const editedXlsBase64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    const jsonString = JSON.stringify({
        version: 1,
        system: currentSystem,
        projectName: document.getElementById('projectName').value,
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        floorConfig: floorConfig,
        plan: plan
    });
    uploadProjectToServer(pName, jsonString, editedXlsBase64);

    // Close modal after successful generation
    window.closeIntranetBomModal();
};

function handleDroppedFile(file, fileExt, callback) {
    // PARAMETRY KOMPRESORA
    const MAX_SIZE = 2048; // Maksymalna rozdzielczość (1K px) - w zupełności wystarczy do 3D
    const QUALITY = 0.95;   // Agresywna kompresja JPEG (60% jakości)

    const reader = new FileReader();

    if (fileExt === 'pdf') {
        reader.onload = async function () {
            const typedarray = new Uint8Array(this.result);
            try {
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                const page = await pdf.getPage(1);

                // Zabezpieczenie przed gigantycznymi PDF-ami (np. 3GB plików od agencji reklamowych)
                const unscaledViewport = page.getViewport({ scale: 1.0 });
                const maxDim = Math.max(unscaledViewport.width, unscaledViewport.height);

                // Kalkulacja optymalnej skali
                let safeScale = maxDim > MAX_SIZE ? (MAX_SIZE / maxDim) : 2.0;

                const viewport = page.getViewport({ scale: safeScale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                // Eksport z płótna (RAW) do lekkiego pliku tekstowego JPEG w locie!
                callback(canvas.toDataURL('image/jpeg', QUALITY));
            } catch (err) { alert("Błąd przetwarzania PDF. Plik może być uszkodzony."); }
        };
        reader.readAsArrayBuffer(file);
    } else if (fileExt === 'tif' || fileExt === 'tiff') {
        reader.onload = function () {
            try {
                const buffer = this.result;
                const ifds = UTIF.decode(buffer);
                UTIF.decodeImage(buffer, ifds[0]);
                const rgba = UTIF.toRGBA8(ifds[0]);

                let origW = ifds[0].width;
                let origH = ifds[0].height;

                const origCanvas = document.createElement('canvas');
                origCanvas.width = origW;
                origCanvas.height = origH;
                const ctx = origCanvas.getContext('2d');
                const imageData = ctx.createImageData(origW, origH);
                imageData.data.set(rgba);
                ctx.putImageData(imageData, 0, 0);

                // Skalowanie wielkich TIFF-ów do rozmiaru maksymalnego (MAX_SIZE)
                let scale = 1.0;
                if (Math.max(origW, origH) > MAX_SIZE) {
                    scale = MAX_SIZE / Math.max(origW, origH);
                }

                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = origW * scale;
                scaledCanvas.height = origH * scale;
                scaledCanvas.getContext('2d').drawImage(origCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

                callback(scaledCanvas.toDataURL('image/jpeg', QUALITY));
            } catch (err) { alert("Błąd przetwarzania pliku TIFF."); }
        };
        reader.readAsArrayBuffer(file);
    } else {
        // System obróbki dla standardowych zdjęć: JPG, PNG
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                let width = img.width;
                let height = img.height;

                // Skurczenie wymiarów, jeśli grafika to np. bilbord 8000x8000 px
                if (Math.max(width, height) > MAX_SIZE) {
                    const scale = MAX_SIZE / Math.max(width, height);
                    width *= scale;
                    height *= scale;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // Zabezpieczenie przed przezroczystością: wylewamy podkład z białej farby
                // Dzięki temu PNG z przezroczystym tłem nie zapisze się z "czarnym kleksem"
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0, width, height);

                // Przekazanie malutkiego jpega do silnika 3D
                callback(canvas.toDataURL('image/jpeg', QUALITY));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function renderReportsTable(data, container) {
    // Rozdzielenie danych na oczekujące i wykonane
    const pending = [];
    const done = [];

    data.forEach(row => {
        if (row.priority && row.priority.toString().toLowerCase().trim() === 'done') {
            done.push(row);
        } else {
            pending.push(row);
        }
    });

    let html = `<table class="data-table">
                <thead><tr><th>Data</th><th>Typ</th><th>Prio / Status</th><th>Opis</th><th>Autor</th></tr></thead><tbody>`;

    const renderRow = (row, isDone) => {
        let prioText = (row.priority || '').toString().trim();
        let prioLower = prioText.toLowerCase();

        let badgeStyle = '';

        if (isDone) {
            badgeStyle = 'background-color: #0f9d58; color: #fff;'; // Done - Zielony
        } else {
            // 🎨 COLOR CODING PRIORYTETÓW
            if (prioLower.includes('kryt') || prioLower.includes('crit')) {
                badgeStyle = 'background-color: #d93025; color: #fff; font-weight: bold; box-shadow: 0 0 8px rgba(217, 48, 37, 0.6);'; // Krytyczny - Czerwony z poświatą
            } else if (prioLower.includes('wysok') || prioLower.includes('high')) {
                badgeStyle = 'background-color: #f29900; color: #fff; font-weight: bold;'; // Wysoki - Pomarańczowy
            } else if (prioLower.includes('średn') || prioLower.includes('sredn') || prioLower.includes('normal') || prioLower.includes('med')) {
                badgeStyle = 'background-color: #1a73e8; color: #fff;'; // Średni/Normalny - Niebieski
            } else if (prioLower.includes('nisk') || prioLower.includes('low')) {
                badgeStyle = 'background-color: #80868b; color: #fff;'; // Niski - Szary
            } else {
                badgeStyle = 'background-color: #5f6368; color: #fff;'; // Domyślny ciemnoszary (gdy wpisano coś innego)
            }
        }

        let rowOpacity = isDone ? 'opacity: 0.5;' : ''; // Przygaszenie wykonanych

        return `<tr class="type-${row.type}" style="${rowOpacity}">
                    <td style="white-space:nowrap">${row.date ? row.date.split(',')[0] : ''}</td>
                    <td><span class="badge">${row.type}</span></td>
                    <td><span class="badge" style="${badgeStyle}">${row.priority}</span></td>
                    <td>${row.description}</td>
                    <td>${row.author}</td>
                </tr>`;
    };

    // 1. Renderuj oczekujące (Pending)
    pending.forEach(row => { html += renderRow(row, false); });

    // 2. Jeśli są wykonane (Done), dodaj czerwoną linię i zrenderuj resztę
    if (done.length > 0) {
        html += `<tr><td colspan="5" style="border-bottom: 2px solid #ff0055; padding-top: 15px;"></td></tr>`;
        html += `<tr><td colspan="5" style="text-align: center; color: #ff0055; font-weight: bold; font-size: 13px; padding: 10px;">ZREALIZOWANE ZGŁOSZENIA</td></tr>`;
        done.forEach(row => { html += renderRow(row, true); });
    }

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function renderChangelogTable(data, container) {
    // Rozdzielenie danych na oczekujące i wykonane
    const pending = [];
    const done = [];

    data.forEach(row => {
        // Szuka "done" zarówno w kolumnie zmiany jak i statusie (na wszelki wypadek)
        if ((row.status && row.status.toString().toLowerCase().trim() === 'done') ||
            (row.changes && row.changes.toString().toLowerCase().trim() === 'done')) {
            done.push(row);
        } else {
            pending.push(row);
        }
    });

    let html = `<table class="data-table">
                <thead><tr><th>Wersja</th><th>Data</th><th>Zmiany</th><th>Status</th></tr></thead><tbody>`;

    const renderRow = (row, isDone) => {
        let bg = (row.bgColor && row.bgColor !== '#ffffff') ? row.bgColor : 'transparent';
        let fc = (row.fontColor && row.fontColor !== '#000000') ? row.fontColor : '#eee';
        let statusBg = isDone ? '#0f9d58' : '#444'; // Zielony jeśli done, inaczej standardowy szary
        let rowOpacity = isDone ? 'opacity: 0.5;' : '';

        return `<tr style="${rowOpacity}">
                    <td style="font-weight:bold; color:#ffcc00">${row.version || ''}</td>
                    <td>${row.date || ''}</td>
                    <td style="background-color: ${bg}; color: ${fc}; border-radius: 4px;">${row.changes || ''}</td>
                    <td><span class="badge" style="background:${statusBg}">${row.status || ''}</span></td>
                </tr>`;
    };

    // 1. Renderuj oczekujące (Pending)
    pending.forEach(row => { html += renderRow(row, false); });

    // 2. Jeśli są wykonane (Done), dodaj czerwoną linię i zrenderuj resztę
    if (done.length > 0) {
        html += `<tr><td colspan="4" style="border-bottom: 2px solid #ff0055; padding-top: 15px;"></td></tr>`;
        html += `<tr><td colspan="4" style="text-align: center; color: #ff0055; font-weight: bold; font-size: 13px; padding: 10px;">ZREALIZOWANE ZADANIA</td></tr>`;
        done.forEach(row => { html += renderRow(row, true); });
    }

    html += `</tbody></table>`;
    container.innerHTML = html;
}

function extractImageDpi(arrayBuffer, fileType) {
    try {
        const view = new DataView(arrayBuffer);
        if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
            if (view.getUint16(0) !== 0xFFD8) return null;
            let offset = 2;
            while (offset < Math.min(view.byteLength - 4, 65536)) {
                const marker = view.getUint16(offset);
                if ((marker & 0xFF00) !== 0xFF00) break;
                if (marker === 0xFFE0) {
                    const units = view.getUint8(offset + 11);
                    const xD = view.getUint16(offset + 12);
                    const yD = view.getUint16(offset + 14);
                    if (units === 1 && xD > 0) return { x: xD, y: yD };
                    if (units === 2 && xD > 0) return { x: Math.round(xD * 2.54), y: Math.round(yD * 2.54) };
                }
                const segLen = view.getUint16(offset + 2);
                offset += 2 + segLen;
            }
        }
        if (fileType === 'image/png') {
            if (view.getUint32(0) !== 0x89504E47) return null;
            let offset = 8;
            while (offset < view.byteLength - 12) {
                const chunkLen = view.getUint32(offset);
                const ct = String.fromCharCode(view.getUint8(offset + 4), view.getUint8(offset + 5), view.getUint8(offset + 6), view.getUint8(offset + 7));
                if (ct === 'pHYs') {
                    const ppuX = view.getUint32(offset + 8);
                    const unit = view.getUint8(offset + 16);
                    if (unit === 1 && ppuX > 0) return { x: Math.round(ppuX / 39.3701), y: Math.round(view.getUint32(offset + 12) / 39.3701) };
                }
                if (ct === 'IEND') break;
                offset += 12 + chunkLen;
            }
        }
    } catch (e) { console.warn('DPI extraction error:', e); }
    return null;
}

function detectColorProfile(arrayBuffer, fileType, tiffIfd) {
    try {
        const bytes = new Uint8Array(arrayBuffer);
        // TIFF: check PhotometricInterpretation tag (262)
        if (tiffIfd) {
            const pi = tiffIfd.t262 || tiffIfd[262];
            if (pi === 5 || pi === 32844) return 'CMYK';
            if (pi === 8) return 'CIELAB';
            // Check ICC profile in TIFF tag 34675
            const icc = tiffIfd.t34675 || tiffIfd[34675];
            if (icc) return detectIccColorSpace(icc);
            // Check SamplesPerPixel
            const spp = tiffIfd.t277 || tiffIfd[277];
            if (spp === 4) return 'CMYK (4ch)';
            if (spp === 3) return 'RGB';
            if (spp === 1) return 'Grayscale';
        }
        // JPEG: search for ICC_PROFILE marker (APP2 = 0xFFE2)
        if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
            const view = new DataView(arrayBuffer);
            if (view.getUint16(0) !== 0xFFD8) return null;
            let offset = 2;
            while (offset < Math.min(view.byteLength - 4, 65536)) {
                const marker = view.getUint16(offset);
                if ((marker & 0xFF00) !== 0xFF00) break;
                if (marker === 0xFFE2) {
                    // Check for "ICC_PROFILE" signature
                    const seg = new Uint8Array(arrayBuffer, offset + 4, 14);
                    const sig = String.fromCharCode(...seg.slice(0, 12));
                    if (sig.startsWith('ICC_PROFILE')) {
                        // Read color space from ICC header (offset 16, 4 bytes)
                        const iccStart = offset + 4 + 14;
                        if (iccStart + 20 < view.byteLength) {
                            const cs = String.fromCharCode(view.getUint8(iccStart + 16), view.getUint8(iccStart + 17), view.getUint8(iccStart + 18), view.getUint8(iccStart + 19)).trim();
                            if (cs === 'CMYK') return 'CMYK';
                            if (cs === 'RGB') return 'RGB';
                            if (cs === 'GRAY') return 'Grayscale';
                            return cs || 'ICC (unknown)';
                        }
                    }
                }
                // JPEG APP14 Adobe marker for CMYK detection
                if (marker === 0xFFEE) {
                    const segLen = view.getUint16(offset + 2);
                    if (segLen >= 12) {
                        const id = String.fromCharCode(view.getUint8(offset + 4), view.getUint8(offset + 5), view.getUint8(offset + 6), view.getUint8(offset + 7), view.getUint8(offset + 8));
                        if (id === 'Adobe') {
                            const colorTransform = view.getUint8(offset + 15);
                            if (colorTransform === 0) return 'CMYK (Adobe)';
                            if (colorTransform === 2) return 'YCCK→CMYK';
                        }
                    }
                }
                const segLen = view.getUint16(offset + 2);
                offset += 2 + segLen;
            }
        }
        // PNG: check iCCP or sRGB chunks
        if (fileType === 'image/png') {
            const view = new DataView(arrayBuffer);
            let offset = 8;
            while (offset < view.byteLength - 12) {
                const chunkLen = view.getUint32(offset);
                const ct = String.fromCharCode(view.getUint8(offset + 4), view.getUint8(offset + 5), view.getUint8(offset + 6), view.getUint8(offset + 7));
                if (ct === 'sRGB') return 'sRGB';
                if (ct === 'iCCP') {
                    // Read profile name
                    let nameEnd = offset + 8;
                    while (nameEnd < offset + 8 + 80 && view.getUint8(nameEnd) !== 0) nameEnd++;
                    let profName = '';
                    for (let k = offset + 8; k < nameEnd; k++) profName += String.fromCharCode(view.getUint8(k));
                    return profName || 'ICC embedded';
                }
                if (ct === 'IEND') break;
                offset += 12 + chunkLen;
            }
        }
    } catch (e) { console.warn('Color profile detection error:', e); }
    return null;
}

function showWydrukiLoading(total) {
    const m = document.getElementById('wydrukiLoadingModal');
    if (m) m.style.display = 'flex';
    updateWydrukiLoading(0, total, 'Przygotowywanie...');
    setFileProgress(0, '—');
}

function updateWydrukiLoading(done, total, fileName) {
    const bar = document.getElementById('wydrukiLoadingBar');
    const cnt = document.getElementById('wydrukiLoadingCount');
    const fn = document.getElementById('wydrukiLoadingFile');
    if (bar) bar.style.width = (total > 0 ? Math.round((done / total) * 100) : 0) + '%';
    if (cnt) cnt.textContent = done + ' / ' + total;
    if (fn) fn.textContent = fileName;
}

function setFileProgress(pct, stage) {
    const bar = document.getElementById('wydrukiFileBar');
    const lbl = document.getElementById('wydrukiFilePercent');
    const stg = document.getElementById('wydrukiFileStage');
    if (bar) bar.style.width = pct + '%';
    if (lbl) lbl.textContent = pct + '%';
    if (stg) stg.textContent = stage;
}

function hideWydrukiLoading() {
    const m = document.getElementById('wydrukiLoadingModal');
    if (m) m.style.display = 'none';
}

function clearWydruki() {
    wydrukiImages = [];
    wydrukiSelectedIndex = -1;
    render();
}

function renderWydruki(layer) {
    let currentX = 100; let currentY = 100; const padding = 40;
    if (wydrukiImages.length === 0) {
        wydrukiSelectedIndex = -1;
        const hint = document.createElement('div');
        hint.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:rgba(255,255,255,0.2);font-size:24px;text-align:center;';
        hint.innerHTML = '✨ Przeciągnij pliki graficzne bezpośrednio tutaj<br><span style="font-size:14px;">(Automatyczne generowanie brytów wydruku)</span>';
        layer.appendChild(hint); return;
    }
    wydrukiImages.forEach((imgData, idx) => {
        const displayScale = 0.125; // Zmniejszony 4x (1/4 oryginalnego rozmiaru)
        // Użyj fizycznych wymiarów (mm), aby obiekty w edytorze miały poprawne proporcje względem siebie
        // Jeśli brak, fallback na oryginalne piksele z ograniczeniem
        const baseW = imgData.widthMm ? imgData.widthMm : (typeof imgData.width === 'number' ? imgData.width : 1000);
        const baseH = imgData.heightMm ? imgData.heightMm : (typeof imgData.height === 'number' ? imgData.height : 1000);
        const dWidth = baseW * displayScale;
        const dHeight = baseH * displayScale;
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `position:absolute;left:${currentX}px;top:${currentY}px;width:${dWidth}px;display:flex;flex-direction:column;align-items:center;cursor:pointer;`;
        const isSelected = idx === wydrukiSelectedIndex;
        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `width:${dWidth}px;height:${dHeight}px;background-image:url(${imgData.src});background-size:cover;background-position:center;border:4px solid ${isSelected ? '#00aaff' : '#fff'};box-shadow:${isSelected ? '0 0 20px rgba(0,170,255,0.6), 0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.5)'};border-radius:2px;position:relative;transition:border 0.2s, box-shadow 0.2s;`;
        // Click to select/deselect
        wrapper.onclick = (e) => { e.stopPropagation(); wydrukiSelectedIndex = (wydrukiSelectedIndex === idx) ? -1 : idx; render(); };
        // Delete badge on selected
        if (isSelected) {
            const badge = document.createElement('div');
            badge.style.cssText = 'position:absolute;top:-12px;right:-12px;width:28px;height:28px;background:#ff5555;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(255,0,0,0.4);z-index:10;';
            badge.innerHTML = '🗑';
            badge.onclick = (e) => { e.stopPropagation(); wydrukiImages.splice(idx, 1); wydrukiSelectedIndex = -1; render(); };
            imgContainer.appendChild(badge);
        }
        const dimLabel = document.createElement('div');
        dimLabel.style.cssText = 'position:absolute;bottom:0;right:0;background:rgba(0,0,0,0.7);color:#00ff00;padding:2px 6px;font-size:10px;font-family:monospace;';
        let dimText = `${imgData.width}x${imgData.height} px`;
        if (imgData.widthMm) dimText += ` | ${imgData.widthMm}x${imgData.heightMm} mm`;
        if (imgData.dpi) dimText += ` | ${imgData.dpi} PPI`;
        dimLabel.innerText = dimText; imgContainer.appendChild(dimLabel);
        const titleLabel = document.createElement('div');
        titleLabel.style.cssText = `margin-top:10px;color:${isSelected ? '#00aaff' : '#fff'};font-size:12px;font-weight:500;width:100%;text-align:center;word-break:break-word;line-height:1.3;padding:0 5px;`;
        titleLabel.innerHTML = highlightFilename(imgData.name);
        wrapper.appendChild(imgContainer); wrapper.appendChild(titleLabel); layer.appendChild(wrapper);
        currentX += dWidth + padding;
        if (currentX > 1400) { currentX = 100; currentY += dHeight + padding + 40; }
    });
}

function highlightFilename(name) {
    let extMatch = name.match(/\.[a-zA-Z0-9]+$/);
    let ext = extMatch ? extMatch[0] : '';
    let base = extMatch ? name.slice(0, -ext.length) : name;

    // 1. Podkreśl tylko PIERWSZY rozmiar na zielono.
    // Wspiera opcjonalne jednostki: mm lub cm (np. 1007x2007mm) i liczby dziesiętne.
    let sizeMatched = false;
    base = base.replace(/(^|[^a-zA-Z0-9])(\d+(?:[.,]\d+)?\s*[xX*]\s*\d+(?:[.,]\d+)?\s*(?:mm|cm)?)(?=[^a-zA-Z0-9]|$)/i, (m, sep, size) => {
        sizeMatched = true;
        return `${sep}<span style="color:#00ff88; font-weight:bold;">${size}</span>`;
    });

    // 2. Szukamy liczby porządkowej lub litery na samym końcu nazwy przed rozszerzeniem (np. _1_5, _L) i dajemy ją na czerwono
    base = base.replace(/([_\-\s]+)(\d+[_\-\s]\d+|[a-zA-Z0-9]+)$/, (m, sep, suffix) => {
        return `${sep}<span style="color:#ff5555; font-weight:bold; font-size:1.1em;">${suffix}</span>`;
    });

    return base + ext;
}

function generateWydrukiReport() {
    if (wydrukiImages.length === 0) { alert('Brak zaimportowanych grafik. Przeciągnij pliki na edytor.'); return; }
    const modal = document.getElementById('wydrukiReportModal');
    const content = document.getElementById('wydrukiReportContent');
    const systemSelect = document.getElementById('wydrukiSystemSelect');
    const selectedSystem = systemSelect ? systemSelect.value : 'none';

    let html = '<table style="width:100%; border-collapse:collapse; font-size:12px; color:#ddd;">';
    html += '<thead><tr style="background:#16213e; color:#00cec9;">';
    html += '<th style="padding:10px; border:1px solid #333; text-align:left;">Nazwa pliku</th>';
    html += '<th style="padding:10px; border:1px solid #333;">Format</th>';
    html += '<th style="padding:10px; border:1px solid #333;">Wymiary (px)</th>';
    html += '<th style="padding:10px; border:1px solid #333;">Wymiary (mm)</th>';
    if (selectedSystem !== 'none') {
        html += '<th style="padding:10px; border:1px solid #333; background:#2c3e50;">Poprawność wymiaru (System)</th>';
    }
    html += '<th style="padding:10px; border:1px solid #333;">PPI</th>';
    html += '<th style="padding:10px; border:1px solid #333;">Rozmiar (MB)</th>';
    html += '<th style="padding:10px; border:1px solid #333;">Profil koloru</th>';
    html += '<th style="padding:10px; border:1px solid #333;">PDF Info</th>';
    html += '<th style="padding:10px; border:1px solid #333; text-align:center;">Akcje</th>';
    html += '</tr></thead><tbody>';
    wydrukiImages.forEach((img, i) => {
        const sizeMB = img.fileSize ? (img.fileSize / (1024 * 1024)).toFixed(2) : '—';
        const mmStr = img.widthMm ? `${img.widthMm} × ${img.heightMm}` : '<span style="color:#888;">Brak DPI</span>';

        let dimPxStr = '<span style="color:#555;">—</span>';
        if (img.format === 'PDF') {
            if (img.pdfRasterWidth && img.pdfRasterHeight) {
                dimPxStr = `${img.pdfRasterWidth} × ${img.pdfRasterHeight}`;
            }
        } else {
            dimPxStr = `${img.width} × ${img.height}`;
        }

        const ppiStr = typeof img.dpi === 'number' ? img.dpi : '<span style="color:#555;">—</span>';
        let ppiColor = '#555';
        if (typeof img.dpi === 'number') {
            ppiColor = img.dpi >= 120 ? '#00ff88' : img.dpi >= 61 ? '#ffcc00' : '#ff5555';
        }
        const rowBg = i % 2 === 0 ? '#1e1e2e' : '#252540';
        const fmt = img.format || img.name.split('.').pop().toUpperCase();
        const profileStr = img.colorProfile ? img.colorProfile : '<span style="color:#6c5ce7; font-style:italic; font-size:10px;">nieanalizowany</span>';

        let profileColor = '#6c5ce7';
        if (img.colorProfile) {
            // CMYK zielony, reszta (RGB, PANTONE itp.) czerwona
            profileColor = (img.colorProfile.includes('CMYK') && !img.colorProfile.includes('RGB')) ? '#00ff88' : '#ff5555';
        }

        let extra = '';
        if (img.pages && img.pages > 1) extra += `<span style="color:#888; font-size:10px;"> (${img.pages} str.)</span>`;
        if (img.layers && img.layers > 1) extra += `<span style="color:#888; font-size:10px;"> (${img.layers} warstw)</span>`;
        // PDF Info cell
        let pdfInfoHtml = '<span style="color:#555;">—</span>';
        if (img.format === 'PDF') {
            const parts = [];
            if (img.pdfFonts && img.pdfFonts.length > 0) parts.push(`<span title="${img.pdfFonts.join(', ')}">🔤 ${img.pdfFonts.length} font${img.pdfFonts.length > 1 ? 'ów' : ''}</span>`);
            if (img.pdfOverprint) parts.push('<span style="color:#ff9500; font-weight:bold;">⚠️ Overprint</span>');
            else if (img.pdfOverprint === false) parts.push('<span style="color:#00ff88;">✓ Brak OP</span>');
            if (img.pdfLayers && img.pdfLayers.length > 0) parts.push(`<span title="${img.pdfLayers.join(', ')}">📑 ${img.pdfLayers.length} warstw</span>`);
            if (img.pages) parts.push(`📄 ${img.pages} str.`);
            pdfInfoHtml = parts.join('<br>');
        }

        let validationHtml = '';
        if (selectedSystem !== 'none') {
            if (img.widthMm && img.heightMm && SYSTEM_GUIDELINES[selectedSystem]) {
                // Znajdź najbliższą "ścianę" co kilkadziesiąt cm (np. zaokrąglamy wymiary pliku ze spadem do ścian co 5/10 cm)
                // Typowo ściany to 85, 100, 200, 300 itp. Użyjemy prostej tablicy dopuszczalnych szerokości:
                const possibleWidths = [85, 100, 200, 300, 400, 500];
                const possibleHeights = [200, 230, 248, 250, 300];

                let nearestW = possibleWidths[0], nearestH = possibleHeights[0];
                let minDiffW = Infinity, minDiffH = Infinity;

                for (const w of possibleWidths) {
                    const diff = Math.abs((img.widthMm / 10) - w);
                    if (diff < minDiffW) { minDiffW = diff; nearestW = w; }
                }
                for (const h of possibleHeights) {
                    const diff = Math.abs((img.heightMm / 10) - h);
                    if (diff < minDiffH) { minDiffH = diff; nearestH = h; }
                }

                const wallKey = `${nearestW}x${nearestH}`;
                const target = SYSTEM_GUIDELINES[selectedSystem][wallKey];

                if (target) {
                    const errW = Math.abs(img.widthMm - target.w) / target.w * 100;
                    const errH = Math.abs(img.heightMm - target.h) / target.h * 100;

                    const formatErr = (err) => {
                        const c = err < 0.1 ? '#00ff88' : (err <= 1.0 ? '#ffcc00' : '#ff5555');
                        return `<span style="color:${c}; font-weight:bold;">${err.toFixed(2)}%</span>`;
                    };
                    validationHtml = `<td style="padding:8px 10px; border:1px solid #333; text-align:center; background:#1e293b;">
                                <div style="font-size:10px; color:#888; margin-bottom:2px;">Wykryto: ${wallKey} (cel: ${target.w}x${target.h})</div>
                                <div>W: ${formatErr(errW)} | H: ${formatErr(errH)}</div>
                            </td>`;
                } else {
                    validationHtml = `<td style="padding:8px 10px; border:1px solid #333; text-align:center; color:#888; background:#1e293b; font-size:10px;">Brak wytycznych dla ściany ${wallKey}</td>`;
                }
            } else if (!SYSTEM_GUIDELINES[selectedSystem]) {
                validationHtml = `<td style="padding:8px 10px; border:1px solid #333; text-align:center; color:#888; background:#1e293b; font-size:10px;">Brak bazy dla ${selectedSystem}</td>`;
            } else {
                validationHtml = `<td style="padding:8px 10px; border:1px solid #333; text-align:center; color:#888; background:#1e293b; font-size:10px;">Brak rozmiaru mm</td>`;
            }
        }

        html += `<tr style="background:${rowBg};">`;
        html += `<td style="padding:8px 10px; border:1px solid #333;" title="${img.name}">${highlightFilename(img.name)}${extra}</td>`;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center; font-size:11px; color:#aaa;">${fmt}</td>`;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center; font-family:monospace;">${dimPxStr}</td>`;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center;">${mmStr}</td>`;
        if (selectedSystem !== 'none') html += validationHtml;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center; color:${ppiColor}; font-weight:bold;">${ppiStr}</td>`;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center;">${sizeMB}</td>`;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center; color:${profileColor};">${profileStr}</td>`;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center; font-size:11px; line-height:1.5;">${pdfInfoHtml}</td>`;
        html += `<td style="padding:8px 10px; border:1px solid #333; text-align:center;">
                    <button onclick="openWydrukiScanner(${i})" style="background:#0984e3; color:#fff; border:none; border-radius:4px; padding:6px 12px; cursor:pointer; font-weight:bold; font-size:11px; box-shadow:0 2px 5px rgba(9,132,227,0.4); white-space:nowrap;">🔍 Skaner 1:1</button>
                </td>`;
        html += '</tr>';
    });
    html += '</tbody></table>';
    // Summary
    const totalMB = wydrukiImages.reduce((s, im) => s + (im.fileSize || 0), 0) / (1024 * 1024);
    html += `<div style="margin-top:15px; padding:12px; background:#16213e; border-radius:8px; display:flex; gap:20px; flex-wrap:wrap; font-size:13px; color:#aaa;">`;
    html += `<span>📁 Plików: <b style="color:#fff;">${wydrukiImages.length}</b></span>`;
    html += `<span>💾 Łącznie: <b style="color:#fff;">${totalMB.toFixed(2)} MB</b></span>`;
    const withDpi = wydrukiImages.filter(i => typeof i.dpi === 'number' && !isNaN(i.dpi));
    if (withDpi.length > 0) {
        const avgDpi = Math.round(withDpi.reduce((s, i) => s + i.dpi, 0) / withDpi.length);
        html += `<span>📐 Śr. PPI: <b style="color:#00cec9;">${avgDpi}</b></span>`;
    }
    const cmykCount = wydrukiImages.filter(i => i.colorProfile && i.colorProfile.includes('CMYK')).length;
    if (cmykCount > 0) html += `<span>🎨 CMYK: <b style="color:#ff9500;">${cmykCount}</b></span>`;
    // Przycisk analizy warstw/profili na żądanie
    const hasUnanalyzed = wydrukiImages.some(i => i.colorProfile === null);
    if (hasUnanalyzed) {
        html += `<button onclick="analyzeWydrukiAdvanced()" style="margin-left:auto; background:linear-gradient(135deg, #6c5ce7, #a29bfe); color:#fff; border:none; border-radius:6px; padding:8px 16px; cursor:pointer; font-weight:bold; font-size:12px; box-shadow: 0 4px 12px rgba(108,92,231,0.4); transition:all 0.3s;">🔬 Analizuj profile / warstwy</button>`;
    } else {
        html += `<span style="margin-left:auto; color:#00ff88; font-size:11px;">✅ Profile przeanalizowane</span>`;
    }
    html += '</div>';
    // Legend
    html += '<div style="margin-top:10px; font-size:11px; color:#666; display:flex; gap:15px;">';
    html += '<span>PPI: <span style="color:#ff5555;">■</span> &lt;60 | <span style="color:#ffcc00;">■</span> 61-119 | <span style="color:#00ff88;">■</span> ≥120</span>';
    if (hasUnanalyzed) html += '<span style="color:#6c5ce7;">💡 Profile kolorystyczne i warstwy nie zostały jeszcze przeanalizowane. Kliknij przycisk powyżej.</span>';
    html += '</div>';
    content.innerHTML = html;
    modal.style.display = 'flex';
}

function getEdgePixels(src, w, h) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas'); c.width = w; c.height = h;
            const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
            const strip = 8; // px strip width for comparison
            resolve({
                left: ctx.getImageData(0, 0, strip, h),
                right: ctx.getImageData(w - strip, 0, strip, h),
                top: ctx.getImageData(0, 0, w, strip),
                bottom: ctx.getImageData(0, h - strip, w, strip)
            });
        };
        img.src = src;
    });
}

function isSolidEdge(imageData) {
    const d = imageData.data;
    if (d.length < 16) return true;

    let sumR = 0, sumG = 0, sumB = 0;
    const total = d.length / 4;

    // Oblicz średnią
    for (let i = 0; i < d.length; i += 4) {
        sumR += d[i];
        sumG += d[i + 1];
        sumB += d[i + 2];
    }
    const meanR = sumR / total;
    const meanG = sumG / total;
    const meanB = sumB / total;

    // Oblicz wariancję
    let varR = 0, varG = 0, varB = 0;
    for (let i = 0; i < d.length; i += 4) {
        varR += Math.pow(d[i] - meanR, 2);
        varG += Math.pow(d[i + 1] - meanG, 2);
        varB += Math.pow(d[i + 2] - meanB, 2);
    }
    varR /= total;
    varG /= total;
    varB /= total;

    const stdDevR = Math.sqrt(varR);
    const stdDevG = Math.sqrt(varG);
    const stdDevB = Math.sqrt(varB);

    // Jeśli średnie odchylenie na krawędzi we wszystkich kanałach jest bardzo małe,
    // oznacza to jednokolorową aplę lub ledwo zauważalny gradient. Pomijamy to.
    if (stdDevR < 8 && stdDevG < 8 && stdDevB < 8) return true;

    // Stara logika bezpieczeństwa dla bardzo ostrych jednolitych tłach z drobnymi szumami
    const r0 = d[0], g0 = d[1], b0 = d[2];
    let diffCount = 0;
    for (let i = 4; i < d.length; i += 4) {
        if (Math.abs(d[i] - r0) > 15 || Math.abs(d[i + 1] - g0) > 15 || Math.abs(d[i + 2] - b0) > 15) diffCount++;
    }
    return (diffCount / total) < 0.05; // mniej niż 5% pikseli zmiennych = apla
}

function compareEdgeStrips(edgeA, edgeB, dimA, dimB) {
    // Edges must have compatible perpendicular dimension — max 5% difference allowed
    const tolerance = 0.05;
    if (Math.abs(dimA - dimB) / Math.max(dimA, dimB) > tolerance) return 0;
    const dA = edgeA.data, dB = edgeB.data;
    const samples = Math.min(dA.length, dB.length) / 4;
    if (samples < 10) return 0;
    let matchCount = 0; const threshold = 20; // lower threshold = less sensitive to slight color differences
    const step = Math.max(1, Math.floor(samples / 500)); // sample up to 500 points
    let checked = 0;
    for (let i = 0; i < samples; i += step) {
        const idx = i * 4;
        if (idx + 2 >= dA.length || idx + 2 >= dB.length) break;
        const dr = Math.abs(dA[idx] - dB[idx]);
        const dg = Math.abs(dA[idx + 1] - dB[idx + 1]);
        const db = Math.abs(dA[idx + 2] - dB[idx + 2]);
        if (dr < threshold && dg < threshold && db < threshold) matchCount++;
        checked++;
    }
    return checked > 0 ? matchCount / checked : 0;
}
