window.ignoreWarningOnce = false;

function checkKasetonWarnings(config) {
    const warnings = [];
    
    // Rule 1: CTF_LED + zarowka + height > 150
    if (config.system === 'CTF_LED') {
        if (config.light === 'zarowka' && config.depth > 150) {
            warnings.push({
                title: 'Za wysoki kaseton na oświetlenie żarówkowe',
                message: `Wybrano opcję oświetlenia "Żarówka" dla kasetonu o wysokości ${config.depth} cm. Maksymalna zalecana wysokość dla oświetlenia żarówkowego to 150 cm. Powyżej tej wysokości światło żarówki nie doświetli dostatecznie całego kasetonu.`,
                suggestionText: 'Zmień układ oświetlenia na opcję doświetlaną plafonami (góra + dół) dla równomiernego oświetlenia.',
                apply: () => {
                    const lightEl = document.getElementById('kasetonLight');
                    if (lightEl) {
                        lightEl.value = 'plafon_gora_dol';
                        if (typeof submitKasetonConfig === 'function') {
                            submitKasetonConfig();
                        }
                    }
                }
            });
        }
    }

    // Rule 2: CTF_LED + zarowka + (W < 50 || D < 50)
    if (config.system === 'CTF_LED' && config.light === 'zarowka') {
        const W = config.width;
        const D = config.height3D;
        if (W < 50 || D < 50) {
            warnings.push({
                title: 'Żarówka zbyt blisko wydruku',
                message: `Wybrano oświetlenie żarówkowe dla kasetonu o szerokości ${W} cm i głębokości 3D ${D} cm. Żarówka znajduje się zbyt blisko wydruku na szerokości lub głębokości konstrukcji, co może skutkować przegrzaniem tkaniny lub powstawaniem plam świetlnych.`,
                suggestionText: 'Zmiana na CTF z blatem z płyty meblowej MDF z paskiem ledowym zamontowanym podblatowo.',
                apply: () => {
                    const topEl = document.getElementById('kasetonTop');
                    if (topEl) {
                        topEl.value = 'mdf';
                        if (typeof updateKasetonLightOptions === 'function') {
                            updateKasetonLightOptions();
                        }
                        const lightEl = document.getElementById('kasetonLight');
                        if (lightEl) {
                            lightEl.value = 'paski_led';
                        }
                        if (typeof submitKasetonConfig === 'function') {
                            submitKasetonConfig();
                        }
                    }
                }
            });
        }
    }

    // Rule 3: Global print size exceeding 300cm in both dimensions on any single face
    const print = config.print || 'single';
    if (print !== 'no_print') {
        const W = parseFloat(config.width) || 0;
        const H = parseFloat(config.depth) || 0; // standard kaseton height
        const D = parseFloat(config.height3D) || 0; // CTF depth
        const sys = config.system || 'LMD';
        
        let faces = [];
        if (sys === 'CTF' || sys === 'CTF_LED') {
            const printOption = config.print || '6_sides';
            if (['6_sides', 'all_sides', 'front_back', 'single_front'].includes(printOption)) {
                faces.push({ w: W, h: H, label: 'przód/tył' });
                faces.push({ w: D, h: H, label: 'boki' });
                faces.push({ w: W, h: D, label: 'góra/dół' });
            } else if (printOption === '4_sides') {
                faces.push({ w: W, h: H, label: 'przód/tył' });
                faces.push({ w: D, h: H, label: 'boki' });
            } else if (printOption === '5_sides_top_open') {
                faces.push({ w: W, h: H, label: 'przód/tył' });
                faces.push({ w: D, h: H, label: 'boki' });
                faces.push({ w: W, h: D, label: 'dół' });
            } else if (printOption === '5_sides_bottom_open') {
                faces.push({ w: W, h: H, label: 'przód/tył' });
                faces.push({ w: D, h: H, label: 'boki' });
                faces.push({ w: W, h: D, label: 'góra' });
            }
        } else if (sys === 'LCD_LMD') {
            const isWrapping = ['double_wrapping', 'front_wrapping_back_blockout'].includes(print);
            if (isWrapping) {
                const wrapW = 2 * W + 2 * D;
                faces.push({ w: wrapW, h: H, label: 'zewnętrzny przechodzący A+B+C+D' });
            } else {
                faces.push({ w: W, h: H, label: 'zewnętrzny przód/tył' });
                faces.push({ w: D, h: H, label: 'zewnętrzny boki' });
            }
            // inner
            faces.push({ w: W - 28, h: H, label: 'wewnętrzny przód/tył' });
            faces.push({ w: D - 28, h: H, label: 'wewnętrzny boki' });
        } else {
            // Standard flat system (LMD, LMS, LMSM, STF, DTF, STFL, SEGO)
            faces.push({ w: W, h: H, label: 'przód/tył' });
        }
        
        const oversizedFace = faces.find(f => f.w > 300 && f.h > 300);
        if (oversizedFace) {
            warnings.push({
                title: 'Wydruk przekracza wymiary rolki (szycie)',
                message: `Wydruk dla płaszczyzny/ściany (${oversizedFace.label}: ${oversizedFace.w}x${oversizedFace.h} cm) przekracza 300 cm w obu wymiarach. Nie mieści się on na rolce drukarskiej w żadnej orientacji i wymaga szycia.`,
                suggestionText: 'Zaakceptuj to ostrzeżenie. Usługi szycia i krojenia zostaną automatycznie doliczone do zestawienia BOM.',
                apply: () => {
                    window.ignoreWarningOnce = true;
                    if (typeof submitKasetonConfig === 'function') {
                        submitKasetonConfig();
                    }
                }
            });
        }
    }
    
    return warnings;
}

function showWarningModal(warning) {
    const existing = document.getElementById('kaseton-warning-modal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'kaseton-warning-modal';
    overlay.className = 'height-modal-overlay';
    overlay.style.zIndex = '20000';
    overlay.style.display = 'flex';
    
    overlay.innerHTML = `
        <div class="height-modal-container" style="max-width: 480px; min-height: auto;" onclick="event.stopPropagation();">
            <div class="height-modal-header" style="border-bottom: 1px solid #ff4466;">
                <h2 style="color: #ff4466; text-shadow: 0 0 10px rgba(255, 68, 102, 0.4);">⚠️ Ostrzeżenie konfiguracji</h2>
                <span class="height-modal-close" onclick="document.getElementById('kaseton-warning-modal').remove()">✕</span>
            </div>
            <div style="padding: 20px; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; gap: 15px;">
                <h3 style="margin: 0; color: #ffcc00; font-size: 14px;">${warning.title}</h3>
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #ddd;">${warning.message}</p>
                <div style="background: rgba(255, 204, 0, 0.1); border-left: 3px solid #ffcc00; padding: 10px; border-radius: 4px; font-size: 11px; color: #ffcc00; line-height: 1.4;">
                    <b>Sugerowane rozwiązanie:</b> ${warning.suggestionText}
                </div>
            </div>
            <div class="height-modal-footer" style="padding: 15px 20px; background: rgba(0,0,0,0.2); display: flex; justify-content: flex-end; gap: 12px;">
                <button class="btn-bottom neon-pink" style="min-width: 100px;" onclick="window.ignoreWarningOnce = true; document.getElementById('kaseton-warning-modal').remove(); if (typeof submitKasetonConfig === 'function') submitKasetonConfig();">Ignoruj</button>
                <button id="applyWarningSuggestion" class="btn-bottom neon-green" style="min-width: 150px;">Zastosuj sugestię</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('#applyWarningSuggestion').onclick = () => {
        overlay.remove();
        warning.apply();
    };
}
