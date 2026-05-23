function runFlavorLoading(callback) {
    const overlay = document.getElementById('loadingOverlay');
    const bar = document.getElementById('flavorProgressBar');
    const textEl = document.getElementById('flavorText');

    overlay.style.display = 'flex';
    bar.style.transition = 'none'; bar.style.width = '0%'; // Reset paska

    // Losowanie 3 unikalnych tekstów
    let shuffled = [...flavorTexts].sort(() => 0.5 - Math.random());

    textEl.innerText = shuffled[0];
    void bar.offsetWidth; // Wymuszenie odświeżenia przeglądarki

    // Start animacji na równe 6 sekund
    bar.style.transition = 'width 6s linear';
    bar.style.width = '100%';

    // Zmiany tekstu co 2 sekundy
    setTimeout(() => { textEl.innerText = shuffled[1]; }, 2000);
    setTimeout(() => { textEl.innerText = shuffled[2]; }, 4000);

    // Koniec po 6 sekundach
    setTimeout(() => {
        overlay.style.display = 'none';
        if (callback) callback();
    }, 6000);
}

function handleLoginKey(e) {
    if (e.key === 'Enter') attemptLogin();
}

function attemptLogin() {
    const user = document.getElementById('loginUser').value.toLowerCase().trim();
    const pass = document.getElementById('loginPass').value.trim();
    const err = document.getElementById('loginError');
    const remember = document.getElementById('rememberMe').checked;

    if (user === 'klient' && pass === 'klient123') currentUserRole = 'klient';
    else if (user === 'agencja' && pass === 'agencja123') currentUserRole = 'agencja';
    else if (user === 'admin' && pass === 'admin123') currentUserRole = 'admin';
    else {
        err.style.display = 'block';
        return;
    }

    // NOWE: Jeśli zaznaczono "Zapamiętaj mnie", zapisujemy rolę w przeglądarce
    if (remember) localStorage.setItem('expoBuilderRole', currentUserRole);
    document.getElementById('loginOverlay').style.display = 'none';
    runFlavorLoading(() => { applyRolePermissions(); });
}

function checkSavedLogin() {
    const savedRole = localStorage.getItem('expoBuilderRole');
    if (savedRole) {
        currentUserRole = savedRole;
        document.getElementById('loginOverlay').style.display = 'none';

        // 🔥 ZMIANA: Zamiast od razu włączać uprawnienia, najpierw odpalamy ekran ładowania
        runFlavorLoading(() => {
            applyRolePermissions();
        });
    }
}

function logout() {
    localStorage.removeItem('expoBuilderRole'); // Czyścimy pamięć
    currentUserRole = null;

    // Czyścimy pola formularza
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('rememberMe').checked = false;
    document.getElementById('loginError').style.display = 'none';

    // Pokazujemy ekran logowania ponownie
    document.getElementById('loginOverlay').style.display = 'flex';
}

function applyRolePermissions() {
    const adminBtn = document.getElementById('btnAdminDB');
    const discountRow = document.getElementById('discountInput') ? document.getElementById('discountInput').parentElement : null;
    const sheetsBtn = document.getElementById('btnExportSheets');

    // Bezpieczny reset do stanu domyślnego
    if (adminBtn) adminBtn.style.display = 'none';
    if (discountRow) discountRow.style.display = 'flex';
    if (sheetsBtn) sheetsBtn.style.display = 'flex';

    // Narzucenie ograniczeń dla ról
    if (currentUserRole === 'admin') {
        if (adminBtn) adminBtn.style.display = 'flex';
    } else if (currentUserRole === 'klient') {
        if (discountRow) discountRow.style.display = 'none';
        if (sheetsBtn) sheetsBtn.style.display = 'none';
    }
}

function openDbEditor() {
    const content = document.getElementById('dbEditorContent');
    content.innerHTML = '';

    // Przelatujemy przez baza DB i budujemy dla każdego elementu wiersz z ceną
    for (const key in DB) {
        const item = DB[key];
        if (item.price !== undefined) {
            content.innerHTML += `
                        <div class="db-row">
                            <span><b>${item.name}</b> <br><i style="color:#888;">${item.catNo || 'Brak SKU'}</i></span>
                            <div>
                                <input type="number" id="db_price_${key}" value="${item.price}" step="1"> €
                            </div>
                        </div>
                    `;
        }
    }
    document.getElementById('dbEditorOverlay').style.display = 'flex';
}

function closeDbEditor() {
    document.getElementById('dbEditorOverlay').style.display = 'none';
}

function saveDbEdits() {
    // Zapisujemy nowe ceny z powrotem do głównego obiektu DB
    for (const key in DB) {
        if (DB[key].price !== undefined) {
            const inp = document.getElementById(`db_price_${key}`);
            if (inp) {
                DB[key].price = parseFloat(inp.value) || 0;
            }
        }
    }
    closeDbEditor();
    render(); // Aktualizuje koszty w aktywnym projekcie na żywo!
    alert("Baza cen (DB) została zaktualizowana!");
}

function refreshManualPanel() {
    const availableContainer = document.getElementById('manualAddAvailable');
    const selectedContainer = document.getElementById('manualAddSelected');
    if (!availableContainer || !selectedContainer) return;

    // 1. Odbuduj listę dostępnych elementów TYLKO gdy zmienił się system
    if (lastSystemForManual !== currentSystem) {
        availableContainer.innerHTML = '';
        let keys = Object.keys(DB);

        keys.forEach(key => {
            let item = DB[key];
            if (!item.price) return; // Ukrywamy elementy z ceną 0 lub bez ceny

            let isFoldable = key.toLowerCase().includes('foldable');

            // Magiczne filtrowanie: SEGO nie widzi Foldable, Foldable widzi tylko swoje ramy + uniwersalne akcesoria TV/Półki
            if (currentSystem === 'foldable' && !isFoldable && !['tvPanel', 'shelfKit'].includes(key)) return;
            if (currentSystem === 'SEGO' && isFoldable) return;

            let btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.cssText = 'padding: 4px 6px; font-size: 10px; background: #222; border: 1px solid #444; color: #fff; cursor: pointer; border-radius: 3px;';
            btn.innerText = `+ ${item.short || item.name}`;

            // Funkcja dodająca do koszyka
            btn.onclick = () => {
                if (!manualItems[key]) manualItems[key] = 0;
                manualItems[key]++;
                refreshManualPanel();
                render(); // Odświeżamy tabelę BOM
            };
            availableContainer.appendChild(btn);
        });
        lastSystemForManual = currentSystem;
    }

    // 2. Odbuduj listę "W koszyku" z przyciskami +/-
    selectedContainer.innerHTML = '';
    for (let key in manualItems) {
        let qty = manualItems[key];
        if (qty > 0 && DB[key]) {
            let div = document.createElement('div');
            div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: #333; padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #fff;';
            div.innerHTML = `
                        <span style="flex:1;">${DB[key].short || DB[key].name}</span>
                        <div style="display:flex; gap: 8px; align-items:center;">
                            <button onclick="changeManualQty('${key}', -1)" style="background:#555; border:none; color:white; width:20px; height:20px; border-radius:3px; cursor:pointer;">-</button>
                            <span style="min-width: 12px; text-align: center; font-weight: bold;">${qty}</span>
                            <button onclick="changeManualQty('${key}', 1)" style="background:#555; border:none; color:white; width:20px; height:20px; border-radius:3px; cursor:pointer;">+</button>
                        </div>
                    `;
            selectedContainer.appendChild(div);
        }
    }
}

function toggleDimensions() {
    showDimensions = !showDimensions;
    isBlueprintMode = showDimensions; // Tryb techniczny włącza się razem z wymiarami
    if (is3DMode) update3DScene();
}

function toggleSceneSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function toggleGraphicsPanel() {
    const panel = document.getElementById('graphicsPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        if (panel.style.display === 'block') refreshGraphicsList();
    }
}

function refreshGraphicsList() {
    const container = document.getElementById('graphicsListContent');
    if (!container) return;
    let html = '';
    let hasFiles = false;

    if (floorConfig.textureName) {
        hasFiles = true;
        html += `<div class="graphics-item"><div class="graphics-item-title">Podłoga</div><div>Grafika: <span class="graphics-item-file">${floorConfig.textureName}</span></div></div>`;
    }

    if (currentSystem === 'kasetony_niestandardowe' && window.currentKasetonConfig) {
        const conf = window.currentKasetonConfig;
        if (conf.textureFrontName || conf.textureBackName) {
            hasFiles = true;
            html += `<div class="graphics-item"><div class="graphics-item-title">Kaseton Niestandardowy (${conf.system})</div>`;
            if (conf.textureFrontName) html += `<div>Przód: <span class="graphics-item-file">${conf.textureFrontName}</span></div>`;
            if (conf.textureBackName) html += `<div>Tył: <span class="graphics-item-file">${conf.textureBackName}</span></div>`;
            html += `</div>`;
        }
    }

    plan.forEach((item, index) => {
        if ((item.type === 'wall' || item.type === 'freestanding' || item.type === 'freestanding_s') && (item.textureFrontName || item.textureBackName)) {
            hasFiles = true;
            let dispName = item.type === 'wall' ? ('Moduł ' + (index + 1)) : (item.type === 'freestanding_s' ? 'Vario S-80' : 'Trybunka');
            html += `<div class="graphics-item"><div class="graphics-item-title">${dispName}: ${item.name}</div>`;
            if (item.textureFrontName) html += `<div>Przód: <span class="graphics-item-file">${item.textureFrontName}</span></div>`;
            if (item.textureBackName) html += `<div>Tył: <span class="graphics-item-file">${item.textureBackName}</span></div>`;

            if (typeof guidelineLinks !== 'undefined' && guidelineLinks[item.name]) {
                html += `<a href="${guidelineLinks[item.name]}" target="_blank" class="btn-guidelines" style="margin-top:5px; padding:6px; font-size:11px; background:#00d2ff; color:#000;">📥 Pobierz wytyczne</a>`;
            }
            html += `</div>`;
        }
        else if ((item.type === 'suspended' || item.type === 'suspended_ring') && item.quadTextures) {
            let quadHasFiles = false;
            let dispName = item.type === 'suspended_ring' ? 'Ringfloat' : 'Quadfloat';
            let qHtml = `<div class="graphics-item"><div class="graphics-item-title">${dispName}: ${item.name}</div>`;
            let maxSegments = item.type === 'suspended_ring' ? 3 : 4;
            for (let i = 1; i <= maxSegments; i++) {
                if (item.quadTextures['Out' + i + 'Name']) { qHtml += `<div>Zewn. ${i}: <span class="graphics-item-file">${item.quadTextures['Out' + i + 'Name']}</span></div>`; quadHasFiles = true; }
                if (item.quadTextures['In' + i + 'Name']) { qHtml += `<div>Wewn. ${i}: <span class="graphics-item-file">${item.quadTextures['In' + i + 'Name']}</span></div>`; quadHasFiles = true; }
            }
            qHtml += `</div>`;
            if (quadHasFiles) { hasFiles = true; html += qHtml; }
        }
        else if (item.type === 'kantorek_1x1' && item.quadTextures) {
            let quadHasFiles = false;
            let qHtml = `<div class="graphics-item"><div class="graphics-item-title">Kantorek 1x1</div>`;
            for (let i = 1; i <= 4; i++) {
                if (item.quadTextures['Out' + i + 'Name']) { qHtml += `<div>Zewn. Ściana ${i}: <span class="graphics-item-file">${item.quadTextures['Out' + i + 'Name']}</span></div>`; quadHasFiles = true; }
                if (item.quadTextures['In' + i + 'Name']) { qHtml += `<div>Wewn. Ściana ${i}: <span class="graphics-item-file">${item.quadTextures['In' + i + 'Name']}</span></div>`; quadHasFiles = true; }
            }
            qHtml += `</div>`;
            if (quadHasFiles) { hasFiles = true; html += qHtml; }
        }
        if (item.accessories) {
            item.accessories.forEach(acc => {
                if (acc.id === 'daszek') {
                    let dHasFiles = acc.texRoofFrontName || acc.texRoofBackName || acc.texLegFrontName || acc.texLegBackName;
                    if (dHasFiles) {
                        hasFiles = true;
                        html += `<div class="graphics-item"><div class="graphics-item-title">Daszek na Moduł ${index + 1}</div>`;
                        if (acc.texRoofFrontName) html += `<div>Dach Góra: <span class="graphics-item-file">${acc.texRoofFrontName}</span></div>`;
                        if (acc.texRoofBackName) html += `<div>Dach Dół: <span class="graphics-item-file">${acc.texRoofBackName}</span></div>`;
                        if (acc.texLegFrontName) html += `<div>Noga Przód: <span class="graphics-item-file">${acc.texLegFrontName}</span></div>`;
                        if (acc.texLegBackName) html += `<div>Noga Tył: <span class="graphics-item-file">${acc.texLegBackName}</span></div>`;
                        html += `</div>`;
                    }
                }
            });
        }
    });
    container.innerHTML = hasFiles ? html : 'Brak przypisanych grafik w projekcie.';
}

function toggleAutoRotate() {
    if (!controls) return;
    controls.autoRotate = !controls.autoRotate;
    const btn = document.getElementById('btnAutoRotate');
    if (!btn) return;
    if (controls.autoRotate) { btn.classList.add('active'); btn.innerText = "🔄 Auto-Obrót: WŁ"; }
    else { btn.classList.remove('active'); btn.innerText = "🔄 Auto-Obrót: WYŁ"; }
}

function openManualModal() {
    const modal = document.getElementById('manualModalOverlay');
    if (modal) modal.style.display = 'flex';
    if (typeof refreshManualPanel === 'function') refreshManualPanel();
}

function closeManualModal() {
    const modal = document.getElementById('manualModalOverlay');
    if (modal) modal.style.display = 'none';
    if (typeof render === 'function') render();
}

function toggle3D() {
    try {
        if (typeof THREE === 'undefined') {
            alert("KRYTYCZNY BŁĄD: Biblioteka Three.js nie mogła zostać załadowana z internetu. Sprawdź połączenie sieciowe lub adblocka.");
            return;
        }

        is3DMode = !is3DMode;
        const container = document.getElementById('stage3DContainer');

        const btnRadial = document.getElementById('btnToggleRadial');
        if (btnRadial) {
            btnRadial.style.display = (is3DMode && currentSystem === 'foldable') ? 'flex' : 'none';
        }

        if (is3DMode) {
            if (container) container.style.display = 'block';

            setTimeout(() => {
                try {
                    if (!scene) {
                        init3D();
                    }
                    if (!isAnimating) {
                        animate3D();
                    }
                    update3DScene();
                } catch (innerError) {
                    alert("Błąd podczas inicjalizacji sceny 3D: " + innerError.message);
                    console.error("Szczegóły błędu wewnątrz pętli renderera:", innerError);
                }
            }, 50);

        } else {
            if (container) container.style.display = 'none';
            isAnimating = false;
        }
    } catch (error) {
        alert("Wystąpił błąd silnika 3D: " + error.message);
        console.error("Szczegóły błędu 3D:", error);
    }
}

function toggleFab() {
    const subs = document.getElementById('fabSubs');
    if (subs) subs.style.display = (subs.style.display === 'flex') ? 'none' : 'flex';
}

function openBugModal() {
    toggleFab();
    const modal = document.getElementById('ticketModal');
    if (modal) modal.style.display = 'flex';
}

function closeDataModal() {
    const modal = document.getElementById('dataViewModal');
    if (modal) modal.style.display = 'none';
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const icon = document.getElementById('sidebarToggleIcon');
    const ghost = document.getElementById('sidebarGhost');

    if (!sidebar) return;

    sidebar.classList.remove('surge');
    void sidebar.offsetWidth;
    sidebar.classList.add('surge');

    sidebar.classList.toggle('collapsed');
    if (toggleBtn) toggleBtn.classList.toggle('collapsed');

    if (ghost) {
        ghost.classList.toggle('collapsed');
    }

    if (icon) {
        if (sidebar.classList.contains('collapsed')) {
            icon.innerText = '▶';
        } else {
            icon.innerText = '◀';
        }
    }

    setTimeout(() => window.dispatchEvent(new Event('resize')), 600);
}

function toggleCategory(id, headerEl) {
    const content = document.getElementById(id);
    if (!content || !headerEl) return;
    const arrow = headerEl.querySelector('.cat-arrow');

    if (!arrow) return;

    headerEl.classList.remove('category-flash');
    void headerEl.offsetWidth;
    headerEl.classList.add('category-flash');

    content.classList.toggle('collapsed');
    arrow.classList.toggle('collapsed');

    if (content.classList.contains('collapsed')) {
        headerEl.classList.remove('active');
    } else {
        headerEl.classList.add('active');
    }

    arrow.style.color = '#fff';
    arrow.style.textShadow = '0 0 15px #fff, 0 0 30px var(--warp-color, var(--highlight))';
    setTimeout(() => {
        arrow.style.color = '';
        arrow.style.textShadow = '';
    }, 150);
}

function switchSystem(newSystem) {
    if (currentSystem === newSystem) return;

    const stage = document.getElementById('stage');
    if (stage) {
        stage.style.filter = 'brightness(3) blur(10px) hue-rotate(90deg)';
        setTimeout(() => stage.style.filter = '', 300);
    }

    if (typeof plan !== 'undefined' && plan.length > 0) {
        if (!confirm("Zmiana systemu wymaga wyczyszczenia obecnego projektu ze względu na inne metody łączenia. Kontynuować?")) {
            const selector = document.getElementById('systemSelector');
            if (selector) selector.value = currentSystem;
            return;
        }
        plan = [];
        if (typeof undoHistory !== 'undefined') undoHistory = [];
    }

    currentSystem = newSystem;

    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
        if (currentSystem === 'foldable') {
            sidebarElement.classList.add('foldable-theme');
        } else {
            sidebarElement.classList.remove('foldable-theme');
        }
    }

    if (typeof updateThemeColors === 'function') {
        updateThemeColors(currentSystem);
    }

    const btnRadial = document.getElementById('btnToggleRadial');
    if (btnRadial) {
        btnRadial.style.display = (is3DMode && currentSystem === 'foldable') ? 'flex' : 'none';
    }

    const btnSpakuj = document.getElementById('btnSpakuj');
    if (btnSpakuj) {
        btnSpakuj.style.display = (is3DMode && newSystem === 'kasetony_niestandardowe') ? 'flex' : 'none';
        if (newSystem !== 'kasetony_niestandardowe') {
            window.isKasetonPackedMode = false;
            btnSpakuj.classList.remove('packed');
            btnSpakuj.innerHTML = '📦 Spakuj';
        }
    }

    const allPanels = document.querySelectorAll('.system-ui-panel');
    allPanels.forEach(p => p.style.display = 'none');

    const collapsible = document.getElementById('sidebar-collapsible-content');
    if (collapsible) {
        collapsible.style.display = (newSystem === 'wydruki') ? 'none' : 'block';
    }

    const wydrukiBtns = ['btnWydrukiReport', 'btnWydrukiMatch', 'btnWydrukiClearStage', 'btnClearWydruki'];
    wydrukiBtns.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (newSystem === 'wydruki') ? 'flex' : 'none';
    });

    const targetPanel = document.getElementById('ui-system-' + newSystem);
    if (targetPanel) {
        targetPanel.style.display = 'block';
        targetPanel.classList.add('category-flash');
        setTimeout(() => targetPanel.classList.remove('category-flash'), 500);
    }

    if (typeof redefineSystemRules === 'function') {
        redefineSystemRules(newSystem);
    }

    if (typeof render === 'function') render();
    if (typeof is3DMode !== 'undefined' && is3DMode && typeof update3DScene === 'function') {
        update3DScene();
    }

    console.log("🚀 System switched to: " + newSystem + " (Theme updated)");

    if (newSystem === 'mframe_pallet' && typeof is3DMode !== 'undefined' && !is3DMode) {
        if (typeof toggle3D === 'function') toggle3D();
    }

    if (newSystem === 'kasetony_niestandardowe') {
        setTimeout(() => {
            if (typeof openKasetonModal === 'function') openKasetonModal();
        }, 400);
    }
}

function toggleRadialMenus() {
    radialMenusVisible = !radialMenusVisible;
    const layer = document.getElementById('foldable-ui-layer');
    const btn = document.getElementById('btnToggleRadial');
    if (!layer || !btn) return;

    if (radialMenusVisible) {
        layer.style.display = 'block';
        btn.style.opacity = '1.0';
        btn.innerHTML = '⚙️ Konfigurator wydruków';
    } else {
        layer.style.display = 'none';
        btn.style.opacity = '0.5';
        btn.innerHTML = '⚙️ Ukryto menu';
    }
}

function toggleNightMode() {
    isNightMode = !isNightMode;
    const btn = document.getElementById('btnNightMode');
    const ambSlider = document.getElementById('ambLightSlider');
    const dirSlider = document.getElementById('dirLightSlider');
    if (!btn || !ambSlider || !dirSlider) return;

    if (isNightMode) {
        originalAmbient = ambSlider.value;
        originalSun = dirSlider.value;

        ambSlider.value = 0.05;
        dirSlider.value = 0.1;

        setSceneBg('black');

        btn.innerHTML = "☀️ Tryb Dzienny";
        btn.style.background = "#ffcc00";
        btn.style.color = "#000";
        btn.style.boxShadow = "0 0 15px rgba(255, 204, 0, 0.5)";
    } else {
        ambSlider.value = originalAmbient;
        dirSlider.value = originalSun;

        setSceneBg(typeof isBlueprintMode !== 'undefined' && isBlueprintMode ? 'blue' : 'white');

        btn.innerHTML = "🌙 Tryb Nocny";
        btn.style.background = "#2c3e50";
        btn.style.color = "#fff";
        btn.style.boxShadow = "none";
    }

    if (typeof updateLighting === 'function') updateLighting();
    if (typeof updateWallEmissive === 'function') updateWallEmissive();
}

function toggleDpdAllServices() {
    const allDiv = document.getElementById('dpd-all-services');
    const toggleDiv = document.getElementById('dpd-toggle-all');
    if (!allDiv || !toggleDiv) return;
    if (allDiv.classList.contains('expanded')) {
        allDiv.classList.remove('expanded');
        toggleDiv.textContent = '▼ Pokaż wszystkie usługi';
    } else {
        allDiv.classList.add('expanded');
        toggleDiv.textContent = '▲ Ukryj wszystkie usługi';
    }
}

function downloadNodeInstaller() {
    const batContent = `@echo off
:: Kodowanie UTF-8
chcp 65001 >nul
title Instalator Node.js & DPD Proxy

echo ===================================================
echo       Automatyczny Instalator Node.js i DPD
echo ===================================================
echo.
echo Krok 1: Sprawdzanie czy Node.js jest juz zainstalowany...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js jest juz zainstalowany.
    goto run_proxy
)

echo [INFO] Brak Node.js. Rozpoczynam instalacje za pomoca winget...
winget --version >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Uzywam systemowego menedzera pakietow winget...
    winget install --id OpenJS.NodeJS --silent --accept-package-agreements --accept-source-agreements
    if %errorlevel% neq 0 (
        echo [BLAD] Instalacja winget nie powiodla sie. Probuje pobrac instalator MSI...
        goto download_msi
    )
    echo [OK] Instalacja Node.js zakonczona sukcesem!
    goto refresh_path
) else (
    goto download_msi
)

:download_msi
echo [INFO] Pobieranie oficjalnego instalatora Node.js MSI za pomoca PowerShell...
powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi' -OutFile 'node_installer.msi'"
if not exist node_installer.msi (
    echo [BLAD] Nie udalo sie pobrac instalatora Node.msi. Pobierz go recznie z nodejs.org
    pause
    exit /b 1
)
echo [INFO] Uruchamianie instalatora MSI... Prosze przejsc przez kreator instalacji.
msiexec /i node_installer.msi
del node_installer.msi
echo [OK] Instalator MSI zakonczyl prace.
goto refresh_path

:refresh_path
echo [INFO] Odswiezanie zmiennych srodowiskowych PATH...
for /f "tokens=2* delims= " %%a in ('reg query "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path') do set "syspath=%%b"
for /f "tokens=2* delims= " %%a in ('reg query "HKCU\\Environment" /v Path') do set "usrpath=%%b"
set "PATH=%syspath%;%usrpath%"
echo.

:run_proxy
echo Krok 2: Uruchamianie serwera DPD proxy (dpd-proxy.js)...
echo ===================================================
node dpd-proxy.js
if %errorlevel% neq 0 (
    echo.
    echo [BLAD] Nie udalo sie uruchomic serwera. Upewnij sie, ze jestes w folderze z plikiem dpd-proxy.js.
    echo Aktualny folder: %cd%
)
pause
`;

    const blob = new Blob([batContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Instaluj_NodeJS_i_Uruchom.bat';
    document.body.appendChild(a);
    a.click();
    a.remove(); // Bezpieczne usunięcie z DOM
    URL.revokeObjectURL(url);
}

function openKasetonModal() {
    const modal = document.getElementById('kasetonModal');
    if (modal) {
        modal.style.display = 'flex';
        const inner = modal.querySelector('.kaseton-modal-inner');
        if (inner) {
            inner.style.animation = 'none';
            void inner.offsetWidth;
            inner.style.animation = '';
        }
    }
}

function closeKasetonModal() {
    const modal = document.getElementById('kasetonModal');
    if (modal) modal.style.display = 'none';
}

function onKasetonSystemChange(sel) {
    if (!sel) return;
    const sys = sel.value;
    const root = document.documentElement;

    if (typeof KASETON_NEON_MAP !== 'undefined' && KASETON_NEON_MAP[sys]) {
        const map = KASETON_NEON_MAP[sys];
        root.style.setProperty('--kaseton-neon', map.neon);
        root.style.setProperty('--kaseton-neon-alpha', map.alpha.replace('@@', '0.3'));
    } else {
        root.style.setProperty('--kaseton-neon', '#00e5ff');
        root.style.setProperty('--kaseton-neon-alpha', 'rgba(0, 229, 255, 0.3)');
    }

    if (typeof kasetonAfterglowTrigger === 'function') kasetonAfterglowTrigger(sel);

    if (typeof KASETON_LED_SYSTEMS !== 'undefined') {
        const isLED = KASETON_LED_SYSTEMS.includes(sys);
        const powerSec = document.getElementById('kasetonPowerSection');
        const lightSec = document.getElementById('kasetonLightSection');

        if (powerSec) {
            if (isLED) powerSec.classList.add('visible');
            else powerSec.classList.remove('visible');
        }
        if (lightSec) {
            if (isLED) lightSec.classList.add('visible');
            else lightSec.classList.remove('visible');
        }
    }

    // Dynamiczne opcje wydruku zależne od systemu
    var printSel = document.getElementById('kasetonPrint');
    if (printSel) {
        printSel.innerHTML = '';
        if (sys === 'LMS') {
            // LMS: kaseton jednostronny - ograniczone opcje
            printSel.innerHTML = '<option value="backlit_white" selected>Przód backlit + Tył białe plecy</option>' +
                '<option value="backlit_blockout">Przód backlit + Tył kolorowy blockout</option>' +
                '<option value="back_white">Tylko białe plecy</option>' +
                '<option value="no_print">Bez wydruku (sama rama)</option>';
        } else {
            // LMD i inne: pełne opcje dwustronne
            printSel.innerHTML = '<option value="single">Jednostronny + Blockout tył</option>' +
                '<option value="double">Dwustronny (2x wydruk)</option>' +
                '<option value="front_blockout">Przód Wydruk, Tył Blockout biały</option>' +
                '<option value="back_blockout">Tylko Blockout tył</option>' +
                '<option value="no_print">Bez wydruku (sama rama)</option>';
        }
    }

    console.log('🔲 Kaseton system changed to:', sys);
}

function kasetonAfterglowTrigger(el) {
    if (!el) return;
    el.classList.remove('afterglow');
    void el.offsetWidth;
    el.classList.add('afterglow');
    setTimeout(() => el.classList.remove('afterglow'), 700);
}

function submitKasetonConfig() {
    const sysEl = document.getElementById('kasetonSystem');
    const widthEl = document.getElementById('kasetonWidth');
    const depthEl = document.getElementById('kasetonDepth');

    if (!sysEl || !widthEl || !depthEl) return;

    const sys = sysEl.value;
    const width = parseInt(widthEl.value);
    const depth = parseInt(depthEl.value);

    const cutEl = document.getElementById('kasetonCut');
    const printEl = document.getElementById('kasetonPrint');
    const usageEl = document.getElementById('kasetonUsage');

    const cut = cutEl ? cutEl.value : '';
    const print = printEl ? printEl.value : '';
    const usage = usageEl ? usageEl.value : '';

    if (!sys) {
        alert('⚠️ Wybierz system kasetonu!');
        sysEl.focus();
        return;
    }
    if (isNaN(width) || width < 40 || width > 1000) {
        alert('⚠️ Szerokość musi być w zakresie 40–1000 cm!');
        widthEl.focus();
        return;
    }
    if (isNaN(depth) || depth < 40 || depth > 1000) {
        alert('⚠️ Głębokość musi być w zakresie 40–1000 cm!');
        depthEl.focus();
        return;
    }

    const config = {
        system: sys,
        width: width,
        depth: depth,
        cut: cut,
        print: print,
        usage: usage
    };

    const kasetonPowerEl = document.getElementById('kasetonPower');
    const kasetonLightEl = document.getElementById('kasetonLight');

    if (typeof KASETON_LED_SYSTEMS !== 'undefined' && KASETON_LED_SYSTEMS.includes(sys)) {
        config.power = kasetonPowerEl ? kasetonPowerEl.value : '';
        config.light = kasetonLightEl ? kasetonLightEl.value : '';
    }

    console.log('✅ Kaseton configuration:', config);
    window.currentKasetonConfig = config;

    const btn = document.querySelector('.kaseton-submit');
    if (btn) {
        const origText = btn.textContent;
        btn.textContent = '✅ Zapisano konfigurację!';
        btn.style.background = 'var(--kaseton-neon)';
        btn.style.color = '#000';
        setTimeout(() => {
            btn.textContent = origText;
            btn.style.background = '';
            btn.style.color = '';
            closeKasetonModal();

            if (currentSystem !== 'kasetony_niestandardowe') {
                switchSystem('kasetony_niestandardowe');
            }

            if (!is3DMode) {
                toggle3D();
            } else {
                if (typeof update3DScene === 'function') update3DScene();
            }
        }, 800);
    }
}

function toggleSpakuj() {
    window.isKasetonPackedMode = !window.isKasetonPackedMode;
    const btn = document.getElementById('btnSpakuj');
    if (btn) {
        if (window.isKasetonPackedMode) {
            btn.innerHTML = '📦 Rozpakuj';
            btn.classList.add('packed');
        } else {
            btn.innerHTML = '📦 Spakuj';
            btn.classList.remove('packed');
        }
    }
    if (typeof update3DScene === 'function') update3DScene();
}