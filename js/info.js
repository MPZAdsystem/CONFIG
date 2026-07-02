// info.js - Interactive User Guides and Explanations Framework

(function() {
    // 1. DYNAMIC STYLESHEET INJECTION (Modular and self-contained)
    const style = document.createElement('style');
    style.textContent = `
        .info-helper-btn {
            background: none;
            border: none;
            color: var(--kaseton-neon, #00e5ff);
            font-size: 18px;
            cursor: pointer;
            padding: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, filter 0.2s;
            outline: none;
            text-shadow: 0 0 8px var(--kaseton-neon-alpha, rgba(0, 229, 255, 0.4));
        }
        .info-helper-btn:hover {
            transform: scale(1.25);
            filter: brightness(1.2);
        }

        /* Modal styles */
        .info-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 15000;
            opacity: 0;
            transition: opacity 0.25s ease;
        }
        .info-modal-overlay.visible {
            opacity: 1;
        }
        .info-modal-container {
            background: #111;
            border: 2px solid var(--kaseton-neon, #00e5ff);
            box-shadow: 0 0 30px var(--kaseton-neon-alpha, rgba(0, 229, 255, 0.35));
            border-radius: 14px;
            width: 92%;
            max-width: 580px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.92);
            transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .info-modal-overlay.visible .info-modal-container {
            transform: scale(1);
        }
        
        /* Header */
        .info-modal-header {
            padding: 16px 22px;
            border-bottom: 1px solid #222;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #141414;
        }
        .info-modal-title {
            color: #fff;
            font-size: 17px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-shadow: 0 0 10px var(--kaseton-neon-alpha, rgba(0, 229, 255, 0.4));
            margin: 0;
        }
        .info-modal-close-x {
            background: none;
            border: none;
            color: #777;
            font-size: 24px;
            line-height: 1;
            cursor: pointer;
            transition: color 0.2s, transform 0.2s;
            padding: 0;
        }
        .info-modal-close-x:hover {
            color: #fff;
            transform: scale(1.1);
        }

        /* Tabs Navigation */
        .info-modal-tabs {
            display: flex;
            background: #181818;
            border-bottom: 1px solid #222;
            user-select: none;
        }
        .info-modal-tab {
            flex: 1;
            padding: 13px 8px;
            text-align: center;
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.2s, color 0.2s;
            border-bottom: 2px solid transparent;
            outline: none;
        }
        .info-modal-tab:hover {
            color: #fff;
            background: #202020;
        }
        .info-modal-tab.active {
            color: var(--kaseton-neon, #00e5ff);
            border-bottom-color: var(--kaseton-neon, #00e5ff);
            background: #121212;
            text-shadow: 0 0 6px var(--kaseton-neon-alpha, rgba(0, 229, 255, 0.25));
        }

        /* Content Area */
        .info-modal-body {
            padding: 24px;
            overflow-y: auto;
            color: #bbb;
            font-size: 14px;
            line-height: 1.6;
            background: #121212;
        }
        .info-modal-pane {
            display: none;
        }
        .info-modal-pane.active {
            display: block;
            animation: infoFadeIn 0.3s ease forwards;
        }

        /* Lists & Styling elements inside body */
        .info-modal-pane p {
            margin-top: 0;
            margin-bottom: 15px;
        }
        .info-modal-pane ul {
            margin: 0 0 15px 0;
            padding-left: 20px;
        }
        .info-modal-pane li {
            margin-bottom: 8px;
        }
        .info-highlight {
            color: var(--kaseton-neon, #00e5ff);
            font-weight: bold;
        }

        /* Footer */
        .info-modal-footer {
            padding: 15px 22px;
            border-top: 1px solid #222;
            display: flex;
            justify-content: flex-end;
            background: #141414;
        }
        .info-modal-btn-close {
            background: var(--kaseton-neon, #00e5ff);
            color: #000;
            border: none;
            padding: 9px 24px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            outline: none;
        }
        .info-modal-btn-close:hover {
            transform: scale(1.04);
            box-shadow: 0 0 14px var(--kaseton-neon, #00e5ff);
        }

        @keyframes infoFadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 2. TUTORIALS/HELP SYSTEM DATABASE
    const INFO_DATABASE = {
        coating: {
            title: "Malowanie proszkowe - Informacje",
            tabs: [
                {
                    id: "ordering",
                    label: "Czas realizacji i zamawianie",
                    html: `
                        <p>Czas potrzebny na lakierowanie proszkowe zależy od wybranej palety kolorów:</p>
                        <ul>
                            <li><span class="info-highlight">Kolory standardowe (dostępne na naszej lakierni):</span> Przybliżony czas realizacji wynosi <span class="info-highlight">około 10 dni roboczych</span>. Kolory te lakierujemy na bieżąco.</li>
                            <li><span class="info-highlight">Kolory niestandardowe (na zamówienie):</span> Wymagają sprowadzenia specjalnego lakieru proszkowego. Czas realizacji może wydłużyć się <span class="info-highlight">do 15 dni roboczych</span>.</li>
                            <li><span class="info-highlight">⚠️ Bardzo ważne:</span> Złożenie zamówienia na lakierowanie w kolorze niestandardowym musi być bezwzględnie poprzedzone kontaktem z opiekunem handlowym, który powiadomi dział zakupów zewnętrznych w celu weryfikacji dostępności farby u dostawców.</li>
                        </ul>
                    `
                },
                {
                    id: "finishes",
                    label: "Wykończenie (Mat vs Półmat vs Połysk)",
                    html: `
                        <p>Wybór stopnia połysku decyduje o końcowym efekcie wizualnym oraz walorach użytkowych kasetonu:</p>
                        <ul>
                            <li><span class="info-highlight">Mat (Matowe):</span> Całkowicie matowe wykończenie o bardzo eleganckim, nowoczesnym charakterze. Pochłania refleksy świetlne i doskonale maskuje drobne ślady użytkowania (np. odciski palców powstające przy montażu lub mikrozarysowania).</li>
                            <li><span class="info-highlight">Półmatowe / Satyna:</span> Wykończenie o delikatnym satynowym połysku. Jest najbardziej uniwersalne i klasyczne – lekko odbija światło, co nadaje malowanej powłoce szlachetną głębię.</li>
                            <li><span class="info-highlight">Połysk (Błyszczące):</span> Wykończenie odbijające światło, nadające profilom żywy, luksusowy i nowoczesny wygląd. Znakomicie eksponuje intensywne barwy i świetnie sprawdza się w miejscach o silnym oświetleniu.</li>
                        </ul>
                    `
                }
            ]
        }
    };

    // 3. MAIN MODAL GENERATION & RENDERING FUNCTION
    window.openInfoTutorialModal = function(infoKey) {
        const info = INFO_DATABASE[infoKey];
        if (!info) return;

        // Prevent opening multiple overlay modals
        const existing = document.getElementById('kasetonInfoModalOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'kasetonInfoModalOverlay';
        overlay.className = 'info-modal-overlay';

        let tabsHtml = "";
        let panesHtml = "";

        info.tabs.forEach((tab, index) => {
            const activeClass = index === 0 ? "active" : "";
            tabsHtml += `<button class="info-modal-tab ${activeClass}" data-tab-id="${tab.id}">${tab.label}</button>`;
            panesHtml += `<div class="info-modal-pane ${activeClass}" id="pane-${tab.id}">${tab.html}</div>`;
        });

        overlay.innerHTML = `
            <div class="info-modal-container">
                <div class="info-modal-header">
                    <h3 class="info-modal-title">${info.title}</h3>
                    <button class="info-modal-close-x" onclick="closeInfoTutorialModal()">&times;</button>
                </div>
                <div class="info-modal-tabs">
                    ${tabsHtml}
                </div>
                <div class="info-modal-body">
                    ${panesHtml}
                </div>
                <div class="info-modal-footer">
                    <button class="info-modal-btn-close" onclick="closeInfoTutorialModal()">Rozumiem</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Animate overlay visible
        setTimeout(() => overlay.classList.add('visible'), 10);

        // Bind tabs interactions
        const tabs = overlay.querySelectorAll('.info-modal-tab');
        const panes = overlay.querySelectorAll('.info-modal-pane');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const targetPane = overlay.querySelector(`#pane-${tab.getAttribute('data-tab-id')}`);
                if (targetPane) targetPane.classList.add('active');
            });
        });

        // Close on escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeInfoTutorialModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Close on clicking overlay background
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeInfoTutorialModal();
            }
        });
    };

    window.closeInfoTutorialModal = function() {
        const overlay = document.getElementById('kasetonInfoModalOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 250);
        }
    };

    // 4. AUTOMATIC DECLARATIVE SCANNING & INJECTION
    window.scanAndAttachInfoButtons = function() {
        const containers = document.querySelectorAll('[data-info-key]');
        containers.forEach(container => {
            // Avoid adding duplicate buttons
            if (container.querySelector('.info-helper-btn')) return;

            const key = container.getAttribute('data-info-key');
            if (!INFO_DATABASE[key]) return;

            const btn = document.createElement('button');
            btn.className = 'info-helper-btn';
            btn.type = 'button';
            btn.innerHTML = 'ℹ️';
            btn.title = 'Dowiedz się więcej';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.openInfoTutorialModal(key);
            });

            container.appendChild(btn);
        });
    };

    // Auto-scan on load
    document.addEventListener('DOMContentLoaded', () => {
        window.scanAndAttachInfoButtons();
    });

})();
