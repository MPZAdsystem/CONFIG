const DB = {

    // --- SYSTEM FOLDABLE ---

    foldable100x250: { name: "Foldable 100x250 (bez wydruku)", labelEN: "Foldable 100x250", catNo: "FOLD-100X250", type: "wall", length: 100, height: 250, thickness: 4.5, isFoldable: true, price: 119 },

    // --- SYSTEM SEGO ---

    sego300x250: { name: "Moduł 300x250", labelEN: "Wall 300x250", catNo: "SEGO-LIG-BOX-300X250", intranetId: 13694, type: "wall", length: 300, height: 250, price: 1341 },

    sego200x250: { name: "Moduł 200x250", labelEN: "Wall 200x250", catNo: "SEGO-LIG-BOX-200X250", intranetId: 18680, type: "wall", length: 200, height: 250, price: 1019 },

    sego100x250: { name: "Moduł 100x250", labelEN: "Wall 100x250", catNo: "SEGO-LIG-BOX-100X250", intranetId: 13693, type: "wall", length: 100, height: 250, price: 580 },

    sego85x250: { name: "Moduł 85x250", labelEN: "Wall 85x250", catNo: "SEGO-LIG-BOX-85X250", intranetId: 18347, type: "wall", length: 85, height: 250, price: 512 },

    door100: { name: "SEGO Door 100 (H:250)", labelEN: "Door 100x250", catNo: "SEGO-DOOR-KIT-100X250", intranetId: 17143, type: "wall", length: 100, height: 250, price: 191, color: "#00d2ff", isDoor: true },

    sego300x300: { name: "Moduł 300x300", labelEN: "Wall 300x300", catNo: "SEGO-LIG-BOX-300X300", intranetId: 18494, type: "wall", length: 300, height: 300, price: 1453, color: "var(--tall-color)" },

    sego200x300: { name: "Moduł 200x300", labelEN: "Wall 200x300", catNo: "SEGO-LIG-BOX-200X300", intranetId: 19727, type: "wall", length: 200, height: 300, price: 1107, color: "var(--tall-color)" },

    sego100x300: { name: "Moduł 100x300", labelEN: "Wall 100x300", catNo: "SEGO-LIG-BOX-100X300", intranetId: 18493, type: "wall", length: 100, height: 300, price: 644, color: "var(--tall-color)" },

    sego85x300: { name: "Moduł 85x300", labelEN: "Wall 85x300", catNo: "SEGO-LIG-BOX-85X300", intranetId: 18490, type: "wall", length: 85, height: 300, price: 572, color: "var(--tall-color)" },

    tvPanel: { id: "tvPanel", name: "Panel TV", labelEN: "TV Mount", catNo: "SEGO-TV-PANEL", intranetId: 13528, type: "accessory", price: 124, color: "#ffcc00", short: "TV" },

    shelfKit: { id: "shelfKit", name: "Shelf Kit", labelEN: "Shelf Kit", catNo: "SEGO-SHELF-KIT", intranetId: 13529, type: "accessory", price: 157, color: "#ff9900", short: "SH" },

    daszek: { id: "daszek", name: "Daszek", labelEN: "Roof Tunnel", catNo: "SEGO-ROOF-TUNNEL", type: "accessory", price: 0, color: "#cc00ff", short: "DSZ" },

    clamp: { name: "Łącznik prosty (Clamp)", catNo: "SEGO-LAC-PRO", intranetId: 13530, price: 7 },

    wewzew: { name: "Łącznik kątowy (wew/zew)", catNo: "SEGO-LAC-WEW-ZEW", intranetId: 13531, price: 3 },

    zewzew: { name: "SEGO łącznik zewnętrzny L", catNo: "SEGO-LAC-ZEW-L", intranetId: 13532, price: 3 },

    miniFoot: { name: "SEGO Mini FOOT", catNo: "SEGO-MINI-FOOT", intranetId: 17145, price: 5 },

    extCable: { name: "Extension Cable", catNo: "SEGO-EXT-CABLE", intranetId: 13555, price: 9 },

    bridge: { name: "Bridge Connector", catNo: "SEGO-BRIDGE-CONN", intranetId: 13533, price: 8 },

    adTribuneExpo: {

        id: "adTribuneExpo", name: "AdTribune Expo 100x100", labelEN: "White LED Counter", catNo: "AD-TRIBUNE-EXPO-W",

        type: "freestanding", width: 100, height: 95, depth: 40, price: 350, color: "#ffffff"

    },

    tableChairs: {

        id: "tableChairs", name: "Okrągły stół z 3 krzesłami", labelEN: "Round Table and 3 Chairs", catNo: "TABLE-CHAIRS-SET",

        type: "table_chairs", width: 160, height: 75, depth: 160, price: 0, color: "#ffffff"

    },

    pottedPlant: {

        id: "pottedPlant", name: "Roślina doniczkowa", labelEN: "Potted Plant", catNo: "POTTED-PLANT",

        type: "potted_plant", width: 60, height: 120, depth: 60, price: 0, color: "#00ff88"

    },

    adFolderA4: {

        id: "adFolderA4", name: "adFolder A4", labelEN: "adFolder A4", catNo: "10094",

        type: "adfolder", width: 27, height: 127, depth: 35, price: 88.76, color: "#c0c0c0"

    },

    adUpVarioS80: {

        id: "adUpVarioS80", name: "Ścianka tekstylna Vario S-80", labelEN: "Vario S-80", catNo: "AD-VARIO-S80",

        type: "freestanding_s", width: 80, height: 235, depth: 40, price: 281, color: "#ff5500"

    },

    adUpQuadfloat: {

        id: "adUpQuadfloat", name: "adUp Vario quadfloat", labelEN: "Quadfloat", catNo: "AD-VARIO-QUAD",

        type: "suspended", width: 300, height: 100, depth: 300, price: 1008, color: "#00d2ff"

    },

    adUpRingfloat: {

        id: "adUpRingfloat", name: "adUp Vario Ringfloat dwustronne", labelEN: "Ringfloat", catNo: "AD-VARIO-RING",

        type: "suspended_ring", diameter: 300, height: 100, price: 470, color: "#cc00ff"

    }

};

const KURS_PLN = 4.00;

const KURS_USD = 1.18;

const flavorTexts = [

    "Gubienie łączników...", "Malowanie trawy na zielono...", "Stykanie ledów...",

    "Gdzie jest technolog?...", "Lepsze niż vario...", "Budowanie kantorka...",

    "Pasowanie wydruków...", "Rzeźbienie niestandardów...", "to miała być śruba m6 czy m8?...",

    "Wkurzanie order care...", "Pytanie Karola czy nie jebnie...", "Deadlajny na ASAAAPIE...",

    "Zamiatanie fuckupów pod aFloora", "Pytanie Right Information co tak długo...",

    "Standaryzacja niestandardów", "Clever tak nie umi...", "Gaszenie kalandra",

    "Oklejanie lodówki...", "Zamawianie dedyka..."

]; // <-- Tutaj kończymy tablicę tekstów

// To musi być osobny obiekt poza tablicą tekstów

const guidelineLinks = {

    "Moduł 100x250": "https://noname.tey.pl/file/requirements?type=product&hash=MDAwMDAwMDAwMDAwMDAwMNUcXmJmQ_iGp7VecLysTtMbvE3Ufnvc8BuIHin5qbP3PBv37giHozZfvOpSu3_UHw!!&lang=en"

};

// ---- NOWOŚĆ: SYSTEM LOGOWANIA I UPRAWNIEŃ ----

let currentUserRole = null; // 'klient', 'agencja', 'admin'

// 📦 FUNKCJA DODAJĄCA KANTOREK JAKO JEDEN MODUŁ

// ⌨️ OBSŁUGA KLAWISZA "K" DO SZYBKIEGO DODAWANIA

document.addEventListener('keydown', function (event) {

    // Reaguj tylko, jeśli użytkownik nie wpisuje niczego w pole tekstowe (np. zniżki)
    if (!event.key) return;

    if (event.key.toLowerCase() === 'k' && document.activeElement.tagName !== 'INPUT') {

        addKantorek1x1();

    }

});

// NOWE: Funkcja sprawdzająca przy uruchomieniu, czy ktoś był zalogowany

// NOWE: Funkcja wylogowywania

// ---- SILNIK EDYTORA BAZY DANYCH (ADMIN) ----

// ----------------------------------------------

let currentSystem = 'SEGO';

// Inicjalizacja globalnych ustawień systemu zaraz po starcie

window.currentSystemConfig = {

    name: "SEGO",

    defaultWidth: 100,

    defaultHeight: 250,

    cornerType: 'sego_overlap',

    bomPrefix: 'SEGO-',

    canDoubleSide: true

};

// ----------------------------------------------

let plan = [];

let wydrukiImages = [];

let wydrukiSelectedIndex = -1;

let currentScannerIndex = -1;

let selectedItemIndex = null;

// --- 🎯 MULTI-SELECT I TRYB PRZESUWANIA (M) ---
let selectedItemIndices = new Set(); // Zbiór indeksów wielokrotnie zaznaczonych elementów
let isMoveMode = false;             // Flaga trybu przesuwania (klawisz M)
let moveModeTargets = [];           // Lista {index, initX, initY} przesuwanych elementów
let clipboardItems = [];            // Schowek do Ctrl+C/V (lista elementów)

// --- 🎯 POMOCNIKI DLA TRYBU PRZESUWANIA (M) ---
let currentMouseX = 0;
let currentMouseY = 0;
let initMoveMouseX = 0;
let initMoveMouseY = 0;

document.addEventListener('mousemove', (e) => {
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
});

function _startMoveModeTracking(targets) {
    moveModeTargets = targets;
    initMoveMouseX = currentMouseX;
    initMoveMouseY = currentMouseY;

    document.addEventListener('mousemove', _onMoveModeMouseMove);
    setTimeout(() => {
        document.addEventListener('mousedown', _onMoveModeClickDetector, true);
    }, 50);
}

function _onMoveModeMouseMove(e) {
    if (!isMoveMode) return;
    const vs = typeof viewScale !== 'undefined' ? viewScale : 1;
    const deltaX = (e.clientX - initMoveMouseX) / vs;
    const deltaY = (e.clientY - initMoveMouseY) / vs;

    moveModeTargets.forEach(target => {
        const item = plan[target.index];
        if (item) {
            item.offsetX = target.initX + deltaX;
            item.offsetY = target.initY + deltaY;
        }
    });
    render();
}

function _onMoveModeClickDetector(e) {
    if (!isMoveMode) return;
    if (e.button !== 0) return; // Tylko LPM
    e.preventDefault();
    e.stopPropagation();
    _exitMoveMode(false);
}

function _exitMoveMode(cancel = false) {
    isMoveMode = false;
    document.removeEventListener('mousemove', _onMoveModeMouseMove);
    document.removeEventListener('mousedown', _onMoveModeClickDetector, true);

    const stage = document.getElementById('stage');
    if (stage) stage.classList.remove('move-mode');

    if (cancel) {
        moveModeTargets.forEach(target => {
            const item = plan[target.index];
            if (item) {
                item.offsetX = target.initX;
                item.offsetY = target.initY;
            }
        });
        moveModeTargets = [];
        render();
    } else {
        const movers = moveModeTargets.map(t => t.index);
        moveModeTargets = [];

        // Clear connections of all moved walls and their partners!
        movers.forEach(idx => {
            const item = plan[idx];
            if (item) {
                let partnerIdx = item._cornerWith;
                if (partnerIdx !== undefined && plan[partnerIdx]) {
                    delete plan[partnerIdx]._cornerWith;
                    delete plan[partnerIdx]._clipCornerX;
                    delete plan[partnerIdx]._clipCornerY;
                    delete plan[partnerIdx]._cornerType;
                }
                let collPartnerIdx = item._collinearWith;
                if (collPartnerIdx !== undefined && plan[collPartnerIdx]) {
                    delete plan[collPartnerIdx]._collinearWith;
                }
                delete item._cornerWith;
                delete item._clipCornerX;
                delete item._clipCornerY;
                delete item._cornerType;
                delete item._collinearWith;
            }
        });

        // Automatyczny clipping zbliżeniowy po umieszczeniu (kolinearne najpierw, potem reszta)
        const collinearClipped = new Set();
        movers.forEach(idx => {
            const item = plan[idx];
            if (!item || item.type !== 'wall' || item.offsetX === undefined) return;

            const SNAP_THRESHOLD = 10;
            let bestOtherIdx = null;
            let bestDist = SNAP_THRESHOLD;
            const angleA = ((item.freeAngle || 0) + 360) % 360;
            const epA = typeof getWallEndpoints === 'function' ? getWallEndpoints(idx, item) : null;
            if (!epA) return;

            if (typeof getWallPositions === 'function') {
                const allPositions = getWallPositions(plan);
                for (let wB of allPositions) {
                    if (wB.planIndex === idx) continue;
                    const itemB = plan[wB.planIndex];
                    if (!itemB || itemB.type !== 'wall') continue;

                    const angleB = ((wB.angle || 0) + 360) % 360;
                    let diff = Math.abs(angleA - angleB) % 360;
                    if (diff > 180) diff = 360 - diff;

                    if (diff < 15 || Math.abs(diff - 180) < 15) {
                        const pairs = [
                            [epA.x2, epA.y2, wB.startX, wB.startY],
                            [epA.x2, epA.y2, wB.endX, wB.endY],
                            [epA.x1, epA.y1, wB.startX, wB.startY],
                            [epA.x1, epA.y1, wB.endX, wB.endY],
                        ];
                        const minPairDist = Math.min(...pairs.map(([ax, ay, bx, by]) => Math.hypot(ax - bx, ay - by)));
                        if (minPairDist <= bestDist) {
                            bestDist = minPairDist;
                            bestOtherIdx = wB.planIndex;
                        }
                    }
                }
            }

            if (bestOtherIdx !== null) {
                if (typeof _snapAndClipPair === 'function') {
                    _snapAndClipPair(idx, item, bestOtherIdx, plan[bestOtherIdx], true);
                    collinearClipped.add(idx);
                    collinearClipped.add(bestOtherIdx);
                }
            }
        });

        movers.forEach(idx => {
            if (!collinearClipped.has(idx)) {
                if (typeof _autoClipProximity === 'function') _autoClipProximity(idx);
            }
        });

        render();
    }
}

// Uwidocznienie funkcji globalnie
window._startMoveModeTracking = _startMoveModeTracking;
window._exitMoveMode = _exitMoveMode;

let computed3DData = [];

// --- 🛒 LOGIKA DODAWANIA RĘCZNEGO ---

// Intranet WBS Input Rule:
// If target element === '#ordp_count' or '#sto_ch', stringify float values using .replace('.', ',').
window.formatWBSValue = function (value, targetElement) {
    if (targetElement === '#ordp_count' || targetElement === '#sto_ch') {
        if (typeof value === 'number') {
            return value.toString().replace('.', ',');
        }
        if (typeof value === 'string') {
            return value.replace('.', ',');
        }
    }
    return value;
};

let manualItems = {};

let lastSystemForManual = null;

window.changeManualQty = function (id, delta) {

    if (manualItems[id]) {

        manualItems[id] += delta;

        if (manualItems[id] <= 0) delete manualItems[id]; // Usuń całkowicie jeśli spadnie do 0

        refreshManualPanel();

        render();

    }

};

let globalWidth = 0;

let globalDepth = 0;

let globalCounts = {};

let globalTotalEUR = 0;

let globalTotalPLN = 0;

let floorConfig = { type: 'none', width: 0, depth: 0, textureName: null, textureData: null, offsetX: 0, offsetY: 0 };

let viewPanX = 0, viewPanY = 0, viewScale = 1;

let isDraggingView = false, startPanX = 0, startPanY = 0;

let scene, camera, renderer, controls;

let is3DMode = false;

// --- NOWE ZMIENNE DO OBSŁUGI PDF ---

let isPdfGenerating = false;

let cancelPdfGeneration = false;

let mixer; // Mikser animacji Three.js
let humanPos = { x: 0, z: 350 }; // Pozycja człowieka w układzie 3D (x, z)
let human3DModel = null; // Referencja do obiektu 3D człowieka
let isDraggingHuman3D = false; // Flaga przeciągania modelu ludzkiego w 3D


const clock = new THREE.Clock(); // Zegar odmierzający czas między klatkami

// --- NASŁUCHIWANIE KLAWISZA ESC ---

document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {

        const pdfModal = document.getElementById('pdfModalOverlay');

        if (isPdfGenerating) {

            // Jeśli PDF się generuje - zgłaszamy przerwanie procesu

            cancelPdfGeneration = true;

            document.getElementById('pdfProgressText').innerText = "❌ Anulowanie, proszę czekać...";

            document.getElementById('pdfProgressBar').style.background = "#ff5555"; // Zmiana na czerwony

            document.getElementById('pdfProgressBar').style.boxShadow = "0 0 10px #ff5555";

        } else if (pdfModal && pdfModal.style.display !== 'none') {

            // Jeśli menu jest po prostu otwarte - zamykamy je

            pdfModal.style.display = 'none';

        }

    }

});

let showDimensions = false; // Zmienna sterująca widocznością wymiarów
let showModuleListMode = false; // Zmienna sterująca widocznością listy modułów

let isAnimating = false;

let sceneObjects = [];

let arGroup = null;

let reticle = null;

let hitTestSource = null;

let hitTestSourceRequested = false;

let isARMode = false;

let windowAmbientLight = null;

let windowDirLights = [];

let windowGridHelper = null;

let windowExpoFloor = null;

let windowExpoCeiling = null;

let windowExpoWalls = null;

let currentLedMode = 'auto';

let currentLedColor = '#ff0000';

let currentLedIntensity = 1.5;

window.activeLedMaterials = [];

let studioLights = [

    { id: 1, offsetX: -400, offsetY: -400 },

    { id: 2, offsetX: 400, offsetY: -400 },

    { id: 3, offsetX: -400, offsetY: 400 },

    { id: 4, offsetX: 400, offsetY: 400 }

];

const stageEl = document.getElementById('stage');

stageEl.addEventListener('mousedown', (e) => {

    if (e.target.id === 'stage') {

        isDraggingView = true;

        startPanX = e.clientX - viewPanX;

        startPanY = e.clientY - viewPanY;

    }

});

document.addEventListener('mousemove', (e) => {

    if (isDraggingView) {

        viewPanX = e.clientX - startPanX;

        viewPanY = e.clientY - startPanY;

        applyTransform2D();

    }

});

document.addEventListener('mouseup', () => { isDraggingView = false; });

stageEl.addEventListener('wheel', (e) => {

    e.preventDefault();

    const zoomAmount = 0.05;

    if (e.deltaY < 0) viewScale = Math.min(viewScale + zoomAmount, 2);

    else viewScale = Math.max(viewScale - zoomAmount, 0.3);

    applyTransform2D();

});

let isBlueprintMode = false; //

// --- FUNKCJE OKNA MODAL (DODAWANIE RĘCZNE) ---

window.cycleAccSlot = function (planIndex, accIndex, e) {

    e.stopPropagation(); let acc = plan[planIndex].accessories[accIndex]; if (!acc.slot) acc.slot = 2; acc.slot = acc.slot === 3 ? 1 : acc.slot + 1; render();

};

// Przerzuca drzwi na przeciwległą ścianę wewnątrz Kantorka

window.cycleLegAccSlot = function (pIdx, aIdx, legAccIdx, e) {

    e.stopPropagation(); let acc = plan[pIdx].accessories[aIdx].accessories[legAccIdx];

    if (!acc.slot) acc.slot = 2; acc.slot = acc.slot === 3 ? 1 : acc.slot + 1; render();

};

window.showHeightSlider = function (itemIndex, accIndex, isLeg, event) {
    event.stopPropagation();
    
    const existing = document.getElementById('accessory-height-popover');
    if (existing) existing.remove();
    
    const popover = document.createElement('div');
    popover.id = 'accessory-height-popover';
    popover.style.cssText = `
        position: absolute;
        background: rgba(20, 20, 25, 0.95);
        border: 1px solid var(--highlight, #ff0080);
        box-shadow: 0 4px 15px rgba(255, 0, 128, 0.3);
        border-radius: 8px;
        padding: 8px 12px;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        gap: 6px;
        color: #fff;
        font-family: sans-serif;
        font-size: 11px;
        min-width: 150px;
    `;
    
    const rect = event.currentTarget.getBoundingClientRect();
    popover.style.left = (window.scrollX + rect.left) + 'px';
    popover.style.top = (window.scrollY + rect.top - 65) + 'px';
    
    const wall = plan[itemIndex];
    let acc = null;
    if (isLeg) {
        const daszek = wall.accessories.find(a => a.id === 'daszek');
        if (daszek && daszek.accessories) acc = daszek.accessories[accIndex];
    } else {
        acc = wall.accessories[accIndex];
    }
    
    if (!acc) return;
    
    if (acc.heightPct === undefined) {
        if (acc.slot === 1) acc.heightPct = 33;
        else if (acc.slot === 3) acc.heightPct = 66;
        else acc.heightPct = 50;
    }
    
    popover.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:bold; align-items:center;">
            <span>Wysokość: ${acc.heightPct}%</span>
            <span style="cursor:pointer; color:#ff5555; font-size:12px; font-weight:bold;" onclick="document.getElementById('accessory-height-popover').remove()">✕</span>
        </div>
        <input type="range" min="10" max="90" value="${acc.heightPct}" style="width:100%; cursor:pointer;" id="heightRangeInput">
    `;
    
    document.body.appendChild(popover);
    
    const slider = popover.querySelector('#heightRangeInput');
    slider.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        acc.heightPct = val;
        popover.querySelector('span').innerText = `Wysokość: ${val}%`;
        
        if (typeof is3DMode !== 'undefined' && is3DMode) {
            if (typeof update3DScene === 'function') update3DScene();
        } else {
            if (typeof render === 'function') render();
        }
    };
    
    const outsideClickListener = (e) => {
        if (!popover.contains(e.target) && e.target !== event.currentTarget) {
            popover.remove();
            document.removeEventListener('click', outsideClickListener);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', outsideClickListener);
    }, 10);
};

window.onresize = () => {

    render();

    if (camera && renderer) {

        const container = document.getElementById('stage3DContainer');

        camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight);

    }

};

// --- SYSTEM SKRÓTÓW KLAWIATUROWYCH (HOTKEYS) ---

document.addEventListener('keydown', function (e) {

    // Blokada skrótów, jeśli użytkownik wpisuje np. nazwę projektu w polu tekstowym

    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    // ESC – wyjście z trybu M lub czyszczenie selekcji

    if (e.key === 'Escape') {

        if (isMoveMode) {

            e.preventDefault();

            if (typeof _exitMoveMode === 'function') {
                _exitMoveMode(true);
            } else {
                isMoveMode = false;
                moveModeTargets = [];
                const stage = document.getElementById('stage');
                if (stage) stage.classList.remove('move-mode');
                render();
            }

            return;

        }

        if (selectedItemIndices.size > 0) {

            e.preventDefault();

            selectedItemIndices.clear();

            selectedItemIndex = null;

            render();

            return;

        }

    }

    // 1. SKRÓTY DO RYSOWANIA ŚCIAN (Zależne od systemu)

    if (currentSystem === 'foldable') {

        if (e.key === '1') { e.preventDefault(); addModule('foldable100x250'); }

    } else {

        // SEGO / INNE

        if (!e.shiftKey) {

            if (e.key === '1') { e.preventDefault(); addModule('sego100x250'); }

            if (e.key === '2') { e.preventDefault(); addModule('sego200x250'); }

            if (e.key === '3') { e.preventDefault(); addModule('sego300x250'); }

            if (e.key === '4') { e.preventDefault(); addModule('sego85x250'); }

            if (e.key === '5') { e.preventDefault(); addModule('door100'); }

        } else {

            if (e.key === '1' || e.key === '!') { e.preventDefault(); addModule('sego100x300'); }

            if (e.key === '2' || e.key === '@') { e.preventDefault(); addModule('sego200x300'); }

            if (e.key === '3' || e.key === '#') { e.preventDefault(); addModule('sego300x300'); }

            if (e.key === '4' || e.key === '$') { e.preventDefault(); addModule('sego85x300'); }

        }

    }

    // 2. KIERUNKI (Strzałki)

    if (e.key === 'ArrowLeft') { e.preventDefault(); addTurn('left'); }

    if (e.key === 'ArrowRight') { e.preventDefault(); addTurn('right'); }

    // 3. OPERACJE NA ZAZNACZONYM ELEMENCIE / ZAZNACZONYCH ELEMENTACH

    // Zbieramy zbiór aktywnych indeksów (singiel lub multi)

    let activeIndices = new Set(selectedItemIndices);

    if (selectedItemIndex !== null && plan[selectedItemIndex]) activeIndices.add(selectedItemIndex);

    if (activeIndices.size > 0) {

        // --- KASOWANIE (Del/Backspace) ---

        if (e.key === 'Delete' || e.key === 'Backspace') {

            e.preventDefault();

            // Sortujemy malejąco, by nie przesuwać indeksów przy splice

            let toDelete = Array.from(activeIndices).sort((a, b) => b - a);

            toDelete.forEach(idx => {

                if (idx >= 0 && idx < plan.length) {

                    // Jeśli to ściana w łańcuchu, usuń też sąsiednie turn/jump jeśli samotne

                    plan.splice(idx, 1);

                }

            });

            selectedItemIndex = null;

            selectedItemIndices.clear();

            render();

            return;

        }

        // --- TRYB PRZESUWANIA (M) ---

        if (e.key.toLowerCase() === 'm' && !e.ctrlKey) {

            e.preventDefault();

            if (isMoveMode) {

                // Drugie M – zakończ ruch (finalizuj, klipuj, wróć do normalnego)
                if (typeof _exitMoveMode === 'function') _exitMoveMode();

            } else {

                // Wejście w tryb M – wyrywamy ściany z łańcucha
                moveModeTargets = [];

                activeIndices.forEach(idx => {
                    const item = plan[idx];
                    if (!item) return;
                    if ((item.type === 'wall' && item.offsetX === undefined) || (item.type === 'kantorek_1x1' && !item.isFree)) {
                        if (typeof detachElementFromChain === 'function') {
                            detachElementFromChain(idx);
                        } else if (typeof detachWallFromChain === 'function') {
                            detachWallFromChain(idx);
                        }
                    }
                    moveModeTargets.push({ index: idx, initX: plan[idx].offsetX || 0, initY: plan[idx].offsetY || 0 });
                });

                isMoveMode = true;
                const stage = document.getElementById('stage');
                if (stage) stage.classList.add('move-mode');

                // Uruchom śledzenie kursora
                if (typeof _startMoveModeTracking === 'function') _startMoveModeTracking(moveModeTargets);

                render();
            }

            return;

        }

        // --- MAGNET PULL (Shift+C) ---

        if (e.key.toLowerCase() === 'c' && e.shiftKey && !e.ctrlKey) {

            e.preventDefault();

            if (typeof magnetPull === 'function') magnetPull();

            return;

        }

        // --- RĘCZNY CLIPPING (C) ---

        if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.shiftKey) {

            e.preventDefault();

            if (typeof clipSelectedWalls === 'function') clipSelectedWalls(Array.from(activeIndices));

            return;

        }

        // --- ROTACJA (Q) – 9 stopni w prawo ---

        if (e.key.toLowerCase() === 'q' && !e.ctrlKey) {

            e.preventDefault();

            activeIndices.forEach(idx => {

                let item = plan[idx];

                if (!item) return;

                const rotatableTypes = ['freestanding', 'freestanding_s', 'suspended', 'table_chairs', 'potted_plant', 'adfolder', 'suspended_ring'];

                if (rotatableTypes.includes(item.type)) {

                    item.rotation = ((item.rotation || 0) + 9) % 360;

                } else if (item.type === 'wall' && item.freeAngle !== undefined) {

                    // Wolna ściana (wyrwana z łańcucha) – obrót o 9°

                    item.freeAngle = ((item.freeAngle || 0) + 9) % 360;

                }

            });

            render();

            return;

        }

        // --- Upgrade/Downgrade (tylko dla pojedynczego zaznaczenia) ---

        if (activeIndices.size === 1) {

            let idx = Array.from(activeIndices)[0];

            let item = plan[idx];

            if (!item) return;

            if (e.key === '+' || e.key === '=') {

                const upgradeMap = { "Moduł 300x250": "sego300x300", "Moduł 200x250": "sego200x300", "Moduł 100x250": "sego100x300", "Moduł 85x250": "sego85x300" };

                if (upgradeMap[item.name]) {

                    let preservedData = { accessories: item.accessories || [], textureFrontName: item.textureFrontName, textureBackName: item.textureBackName, textureFront: item.textureFront, textureBack: item.textureBack };

                    plan[idx] = Object.assign(JSON.parse(JSON.stringify(DB[upgradeMap[item.name]])), preservedData);

                    render();

                }

            }

            if (e.key === '-' || e.key === '_') {

                const downgradeMap = { "Moduł 300x300": "sego300x250", "Moduł 200x300": "sego200x250", "Moduł 100x300": "sego100x250", "Moduł 85x300": "sego85x250" };

                if (downgradeMap[item.name]) {

                    let preservedData = { accessories: item.accessories || [], textureFrontName: item.textureFrontName, textureBackName: item.textureBackName, textureFront: item.textureFront, textureBack: item.textureBack };

                    plan[idx] = Object.assign(JSON.parse(JSON.stringify(DB[downgradeMap[item.name]])), preservedData);

                    render();

                }

            }

        }

    }

});


// --- LOGIKA MFRAME PALLET ---

const mframePalletData = {

    palletWeight: 60,

    palletWidth: 270,

    palletDepth: 120,

    palletHeight: 15,

    profileWidth: 5.5,

    profileDepth: 6.2,

    items: [

        { id: 'frame496x496', name: 'Rama 496x496', width: 49.6, height: 49.6, weight: 3.86, count: 0 },

        { id: 'frame496x992', name: 'Rama 496x992', width: 49.6, height: 99.2, weight: 5.49, count: 0 },

        { id: 'frame496x1240', name: 'Rama 496x1240', width: 49.6, height: 124.0, weight: 6.28, count: 0 },

        { id: 'frame496x1488', name: 'Rama 496x1488', width: 49.6, height: 148.8, weight: 6.72, count: 0 },

        { id: 'frame496x1984', name: 'Rama 496x1984', width: 49.6, height: 198.4, weight: 8.5, count: 0 },

        { id: 'frame496x2480', name: 'Rama 496x2480', width: 49.6, height: 248.0, weight: 9.92, count: 0 },

        { id: 'frame496x2976', name: 'Rama 496x2976', width: 49.6, height: 297.6, weight: 11.53, count: 0 },

        { id: 'frame992x992', name: 'Rama 992x992', width: 99.2, height: 99.2, weight: 7.12, count: 0 },

        { id: 'frame992x1240', name: 'Rama 992x1240', width: 99.2, height: 124.0, weight: 7.9, count: 0 },

        { id: 'frame992x1488', name: 'Rama 992x1488', width: 99.2, height: 148.8, weight: 8.35, count: 0 },

        { id: 'frame992x1984', name: 'Rama 992x1984', width: 99.2, height: 198.4, weight: 10.13, count: 0 },

        { id: 'frame992x2480', name: 'Rama 992x2480', width: 99.2, height: 248.0, weight: 11.55, count: 0 },

        { id: 'frame992x2976', name: 'Rama 992x2976', width: 99.2, height: 297.6, weight: 13.15, count: 0 },

        { id: 'door992x2480', name: 'Drzwi 992x2480', width: 99.2, height: 248.0, weight: 26, count: 0 }

    ],

    layers: []

};

// Zbuduj UI palety na start

window.onload = function () {
    if (typeof checkSavedLogin === 'function') checkSavedLogin();
    if (typeof renderMframeUI === 'function') renderMframeUI();
    if (typeof updateThemeColors === 'function' && typeof currentSystem !== 'undefined') updateThemeColors(currentSystem);
    if (typeof render === 'function') render();
};

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXwLqKo2jTxHt4NryosZkRbwS2h4Ze8mLTWMR1xYX1Pt6UWAgexk4am4-sI8lA3rJEVg/exec';

// ========================================================

// --- KONTROLA KOLORU INTERFEJSU I NAPĘDU WARP ---

// ========================================================

// --- FUNKCJA OBSŁUGUJĄCA ZWIJANIE GŁÓWNEGO PASKA BOCZNEGO ---

// --- FUNKCJA OBSŁUGUJĄCA ZWIJANIE KATEGORII (AKORDEONY) ---

document.addEventListener('keydown', function (event) {

    // Zabezpieczenie: Ignoruj skróty, jeśli użytkownik pisze w jakimkolwiek polu tekstowym
    if (!event.key) return;

    const activeElement = document.activeElement;

    const activeTag = activeElement.tagName.toLowerCase();

    if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {

        return;

    }

    // 1. CTRL + Z -> Cofnij krok

    if (event.ctrlKey && event.key.toLowerCase() === 'z') {

        event.preventDefault(); // Zapobiega domyślnym akcjom przeglądarki

        if (typeof undo === 'function') undo();

    }

    // 1b. CTRL + C -> Kopiuj element(y) – wsparcie multi-select

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {

        event.preventDefault();

        // Zbieramy zbiór aktywnych indeksów
        let toCopy = new Set(typeof selectedItemIndices !== 'undefined' ? selectedItemIndices : []);
        if (typeof selectedItemIndex !== 'undefined' && selectedItemIndex !== null && plan[selectedItemIndex]) {
            toCopy.add(selectedItemIndex);
        }

        if (toCopy.size > 0) {
            // Schowek wieloelementowy
            clipboardItems = Array.from(toCopy)
                .filter(idx => plan[idx])
                .map(idx => JSON.parse(JSON.stringify(plan[idx])));
            // Kompatybilność z istniejącym kodem
            window.clipboardItem = clipboardItems[0] || null;
        }

    }

    // 1c. CTRL + V -> Wklej element(y)

    if (event.ctrlKey && event.key.toLowerCase() === 'v') {

        event.preventDefault();

        const itemsToPaste = (clipboardItems && clipboardItems.length > 0)
            ? clipboardItems
            : (window.clipboardItem ? [window.clipboardItem] : []);

        if (itemsToPaste.length > 0) {

            selectedItemIndices.clear();
            selectedItemIndex = null;

            itemsToPaste.forEach(src => {
                let newItem = JSON.parse(JSON.stringify(src));
                if (newItem.offsetX !== undefined) newItem.offsetX += 40;
                if (newItem.offsetY !== undefined) newItem.offsetY += 40;
                plan.push(newItem);
                selectedItemIndices.add(plan.length - 1);
            });

            selectedItemIndex = plan.length - 1;
            if (typeof render === 'function') render();

        }

    }

    // 2. BACKSPACE -> Cofnij krok (tylko gdy NIE MA zaznaczenia – wtedy Delete/Backspace usuwa)

    if (event.key === 'Backspace') {

        event.preventDefault(); // Ekstremalnie ważne! Zapobiega cofnięciu strony w przeglądarce

        let hasSelection = (typeof selectedItemIndices !== 'undefined' && selectedItemIndices.size > 0)
            || (typeof selectedItemIndex !== 'undefined' && selectedItemIndex !== null);

        if (!hasSelection && typeof undo === 'function') undo();

    }

    // 3. Klawisz 'T' -> Dodanie Trybunki Expo

    if (event.key.toLowerCase() === 't') {

        event.preventDefault();

        if (typeof addFreestanding === 'function') addFreestanding('adTribuneExpo');

    }

    // 4. Klawisz 'R' -> Dodanie Daszku do zaznaczonego modułu

    if (event.key.toLowerCase() === 'r') {

        event.preventDefault();

        // Daszek wymaga, aby jakiś moduł na scenie był kliknięty (zaznaczony)

        if (typeof addAccessory === 'function') addAccessory('daszek');

    }

    // 5. Klawisz 'D' -> Dodanie Drzwi 100cm

    if (event.key.toLowerCase() === 'd') {

        event.preventDefault();

        if (typeof addModule === 'function') addModule('door100');

    }

});

// --- KONFIGURATOR WYDRUKÓW LOGIC ---

// DPI extraction from image binary data

// Color profile detection from binary data

// PDF advanced analysis: fonts, overprints, layers

// Loading bar helpers

// UI tick — let browser repaint

const uiTick = () => new Promise(r => setTimeout(r, 16));

// Preview constants — aggressive for stability

const PREVIEW_MAX = 512;

const PREVIEW_QUALITY = 0.55;

// Delete key handler for wydruki

document.addEventListener('keydown', (e) => {

    if (currentSystem !== 'wydruki') return;

    if (e.key === 'Delete' && wydrukiSelectedIndex >= 0 && wydrukiSelectedIndex < wydrukiImages.length) {

        wydrukiImages.splice(wydrukiSelectedIndex, 1);

        wydrukiSelectedIndex = -1;

        render();

    }

    if (e.key === 'Escape') { wydrukiSelectedIndex = -1; render(); }

});

// --- ANALIZA WARSTW / PROFILI KOLORYSTYCZNYCH NA ŻĄDANIE ---

// --- PODŚWIETLANIE NAZW PLIKÓW ---

const SYSTEM_GUIDELINES = {

    'SEGO': {

        '100x250': { w: 1008, h: 2506 },

        '200x250': { w: 2010, h: 2508 },

        '300x250': { w: 3008, h: 2508 },

        '85x250': { w: 860, h: 2508 },

        '100x300': { w: 1010, h: 3006 },

        '200x300': { w: 2011, h: 3012 },

        '300x300': { w: 3012, h: 3012 },

        '85x300': { w: 860, h: 3006 },

        '100x200': { w: 1008, h: 2008 },

        '200x200': { w: 2010, h: 2008 },

        '85x200': { w: 860, h: 2008 }

    }

};

// --- RAPORT PARAMETRÓW ---

// --- SPRAWDZANIE PASOWAŃ KRAWĘDZI ---

// --- LOGIKA WYDRUKÓW FOLDABLE ---

var foldablePlanes = []; // Przechowuje zidentyfikowane ciągi ścian

// ========================================================

// --- DEV SHORTCUT: BŁYSKAWICZNE LOGOWANIE (Ctrl + M) ---

// ========================================================

document.addEventListener('keydown', function (e) {

    // Sprawdzamy, czy wciśnięto Ctrl + M (niezależnie od wielkości liter)
    if (!e.key) return;

    if (e.ctrlKey && e.key.toLowerCase() === 'm') {

        e.preventDefault(); // Blokujemy domyślne działanie przeglądarki

        console.log('🚀 DEV MODE: Wymuszono pominięcie logowania (Ctrl+M)');

        // 1. Zdejmujemy ekrany startowe

        // Wypisałem najczęstsze ID. Jeśli Twoje nazywają się inaczej, dopisz je do tej listy:

        const screensToHide = [

            'loginScreen', 'login-screen', 'loginContainer', 'loginOverlay',

            'loadingScreen', 'loading-screen', 'loader', 'flavourTextContainer'

        ];

        screensToHide.forEach(id => {

            let el = document.getElementById(id);

            if (el) el.style.display = 'none';

        });

        // 2. Opcjonalnie: jeśli masz główny kontener edytora, który domyślnie jest ukryty, wymuś jego pokazanie

        let appUi = document.getElementById('app') || document.getElementById('mainUI');

        if (appUi) appUi.style.display = 'block';

        // 3. Wymuszamy start silnika rysującego, aby odblokować płótno

        if (typeof render === 'function') render();

        if (typeof resizeCanvas === 'function') resizeCanvas();

    }

});

// ========================================================

// --- POKAŻ / UKRYJ MENU RADIALNE (Konfigurator Wydruków) ---

// ========================================================

let radialMenusVisible = true;

// ========================================================

// ========================================================

// --- ZINTEGROWANY TRYB NOCNY ---

// ========================================================

let isNightMode = false;

let originalAmbient = 0.45;

let originalSun = 0.25;


if (stageEl) {

    stageEl.ondragover = (e) => {

        if (currentSystem !== 'wydruki') return;

        e.preventDefault();

        stageEl.style.background = 'rgba(255,255,255,0.05)';

    };

    stageEl.ondragleave = () => {

        stageEl.style.background = '';

    };

    stageEl.ondrop = (e) => {

        if (currentSystem !== 'wydruki') return;

        e.preventDefault();

        stageEl.style.background = '';

        if (e.dataTransfer.files) {

            handleWydrukiFiles(e.dataTransfer.files);

        }

    };

}

// ============ DPD: Sprawdzanie dostępności usług ============

// ==========================================================

// LUPA 1:1 (SKANER PIKSELI)

// ==========================================================

let isScannerDragging = false;

let scannerStartX, scannerStartY, scannerScrollLeft, scannerScrollTop;

document.addEventListener('DOMContentLoaded', () => {

    const scannerContainer = document.getElementById('wydrukiScannerContainer');

    if (scannerContainer) {

        scannerContainer.addEventListener('mousedown', (e) => {

            isScannerDragging = true;

            scannerContainer.style.cursor = 'grabbing';

            scannerStartX = e.pageX - scannerContainer.offsetLeft;

            scannerStartY = e.pageY - scannerContainer.offsetTop;

            scannerScrollLeft = scannerContainer.scrollLeft;

            scannerScrollTop = scannerContainer.scrollTop;

        });

        scannerContainer.addEventListener('mouseleave', () => {

            isScannerDragging = false;

            scannerContainer.style.cursor = 'grab';

        });

        scannerContainer.addEventListener('mouseup', () => {

            isScannerDragging = false;

            scannerContainer.style.cursor = 'grab';

        });

        scannerContainer.addEventListener('mousemove', (e) => {

            if (!isScannerDragging) return;

            e.preventDefault();

            const x = e.pageX - scannerContainer.offsetLeft;

            const y = e.pageY - scannerContainer.offsetTop;

            const walkX = (x - scannerStartX) * 1.5;

            const walkY = (y - scannerStartY) * 1.5;

            scannerContainer.scrollLeft = scannerScrollLeft - walkX;

            scannerContainer.scrollTop = scannerScrollTop - walkY;

        });

    }

});

// ==================== KASETON CONFIGURATOR LOGIC ====================

// Neon color map per kaseton system type

const KASETON_NEON_MAP = {

    'LMD': { neon: '#00e5ff', alpha: 'rgba(0, 229, 255, @@)' },

    'LMS': { neon: '#00ff88', alpha: 'rgba(0, 255, 136, @@)' },

    'LMSM': { neon: '#00ff88', alpha: 'rgba(0, 255, 136, @@)' },

    'DTF': { neon: '#ff6600', alpha: 'rgba(255, 102, 0, @@)' },

    'STF': { neon: '#ffcc00', alpha: 'rgba(255, 204, 0, @@)' },

    'STFL': { neon: '#ff0080', alpha: 'rgba(255, 0, 128, @@)' },

    'CTF': { neon: '#aa55ff', alpha: 'rgba(170, 85, 255, @@)' },

    'CTF_LED': { neon: '#55ffdd', alpha: 'rgba(85, 255, 221, @@)' },

    'LCD_LMD': { neon: '#ff3355', alpha: 'rgba(255, 51, 85, @@)' },

};

// Systems that have LED options (power supply + lighting)

const KASETON_LED_SYSTEMS = ['LMD', 'LMS', 'LMSM', 'CTF_LED', 'LCD_LMD'];

// Close modal on backdrop click

document.addEventListener('click', function (e) {

    const modal = document.getElementById('kasetonModal');

    if (e.target === modal) closeKasetonModal();

});

// Close modal on Escape key

document.addEventListener('keydown', function (e) {

    if (e.key === 'Escape') closeKasetonModal();

});

// System change → update neon colors + conditional fields

// Afterglow animation trigger for any select

// Add afterglow to all kaseton selects on focus

document.addEventListener('DOMContentLoaded', function () {

    const allKasetonSelects = document.querySelectorAll('.kaseton-select');

    allKasetonSelects.forEach(sel => {

        sel.addEventListener('mousedown', function () {

            kasetonAfterglowTrigger(this);

        });

    });

});

// Submit / validate kaseton configuration

// ==================== 3D SCENE GENERATOR FOR KASETONY NIESTANDARDOWE ====================

// ==================== KASETON BOM GENERATOR ====================

// ==================== SPAKUJ / ROZPAKUJ (PACK / UNPACK) SYSTEM ====================

window.isKasetonPackedMode = false;

// --- Weight data for all kaseton systems (from Google Sheets calculator) ---

const KASETON_WEIGHT_DATA = {

    LMD: { profile: 1.0, support: 0.6, accessories: 2.0, led: 0.2, feet: 1.0 },

    LMS: { profile: 2.0, support: 0.6, accessories: 2.0, led: 0.2, feet: 1.0 },

    LMSM: {
        profile: 1.3, support: 0.6, accessories: 2.0, led: 0.2, feet: 0,
        getWeight: function(w, h) {
            // w, h podane w metrach
            const profileWeight = (2 * (w + h)) * 1.14;
            const panelAndStabilizers = w * h * 0.45;
            return parseFloat((profileWeight + panelAndStabilizers).toFixed(2));
        }
    },

    DTF: { profile: 2.4, support: 0.6, accessories: 2.0, led: 0.2, feet: 0 },

    STF: { profile: 2.1, support: 0.6, accessories: 2.0, led: 0.2, feet: 0 },

    STFL: { profile: 2.0, support: 0.6, accessories: 2.0, led: 0.2, feet: 0 }

};

// Wstrzyknąć do istniejącego obiektu bazodanowego systemów profilowych
window.PROFILE_DB = window.PROFILE_DB || {};
window.PROFILE_DB["LMSM"] = {
    depth: 6.0,
    weightPerM: 1.14,
    ledType: "SLIM_EDGE_24V",
    maxLength: 600.0,
    priceGroup: "SLIM",
    skuBase: "ALU-060-SLIM"
};

window.KASETON_WEIGHT_DATA = KASETON_WEIGHT_DATA;

const KASETON_PSU_WEIGHTS = {

    'Zasilacz zewnętrzny 120W 24V': 0.5,

    'Zasilacz zewnętrzny 160W 24V': 0.6,

    'Zasilacz zewnętrzny 220W 24V': 1.0,

    'Zasilacz zewnętrzny 300W 24V': 1.0,

    'Zasilacz zewnętrzny 360W 24V': 1.2,

    'Zasilacz wewnętrzny 75W 24V': 0.2,

    'Zasilacz wewnętrzny 100W 24V': 0.2,

    'Zasilacz wewnętrzny 150W 24V': 0.2,

    'Zasilacz wewnętrzny 200W 24V': 0.3,

    'Zasilacz wewnętrzny 240W 24V': 0.3

};

const KASETON_CARTON_WEIGHTS = {

    'Karton LMD/LMS - 110x16x33cm': 1.5,

    'Karton LMD/LMS - 135x16x33cm': 2.0,

    'Karton LMD/LMS - 160x16x33cm': 2.5,

    'Karton LMD/LMS/DTF - 210x16x33cm': 3.5

};

const KASETON_CARTON_DIMENSIONS = {

    'Karton LMD/LMS - 110x16x33cm': { l: 110, w: 16, h: 33 },

    'Karton LMD/LMS - 135x16x33cm': { l: 135, w: 16, h: 33 },

    'Karton LMD/LMS - 160x16x33cm': { l: 160, w: 16, h: 33 },

    'Karton LMD/LMS/DTF - 210x16x33cm': { l: 210, w: 16, h: 33 }

};

const KASETON_PRINT_WEIGHTS = { led: 0.4, blockout: 0.6 }; // kg per m²

// --- Weight calculation ---

// --- Toggle Spakuj / Rozpakuj ---

// --- 3D Carton Scene ---
