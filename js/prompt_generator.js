// prompt_generator.js - Engine and Main-Screen UI for AI Prompt Generator

(function () {
    window.promptSelections = window.promptSelections || {
        style: 'hyper-detailed photorealistic digital graphic artwork, tangible material textures and macro surface details rendered flat onto the canvas, rich tactile depth in 2D graphic design, embedded cinematic lighting within digital artwork, realistic material shaders',
        material: 'incorporating automatically selected premium material textures tailored specifically to the company line of business and industry profile, while strictly maintaining a realistic photographic tactile material finish',
        logo: 'generate automatically based on the company name profile and line of business',
        logoPos: 'centered in large font',
        format: '2:5',
        extras: '',
        language: 'Polish language (Polski)'
    };

    const tileGroups = [
        {
            id: 'style',
            title: '1. STYL GRAFICZNY',
            options: [
                { label: 'Fotorealistyczny / Premium', val: 'hyper-detailed photorealistic digital graphic artwork, tangible material textures and macro surface details rendered flat onto the canvas, rich tactile depth in 2D graphic design, embedded cinematic lighting within digital artwork, realistic material shaders', bg: '#09152b', neon: '#00d2ff' },
                { label: 'Nowoczesny 3D Render', val: 'contemporary 3D digital abstract fluid art artwork rendered flat onto the canvas, translucent frosted glass and liquid metallic graphic shapes, volumetric studio shading embedded in graphic composition, soft raytraced reflections', bg: '#2b061e', neon: '#ff0055' },
                { label: 'Cyberpunk / Neon HUD', val: 'futuristic cyberpunk digital graphic artwork, glowing neon cyan and magenta HUD interfaces, luminous holographic vector grids and network nodes rendered flat onto the canvas, high-contrast dark atmosphere, glowing circuit pathways', bg: '#081a24', neon: '#00f0ff' },
                { label: 'Japoński Ink-Wash (Sumi-e)', val: 'elegant Japanese Sumi-e ink-wash brushstroke graphic artwork, delicate watercolor gradients rendered flat onto the canvas, authentic rice paper texture look, massive breathable negative space, zen botanical and fluid ink aesthetic', bg: '#1f1e1b', neon: '#e6c594' },
                { label: 'Szwajcarski Design & Bauhaus', val: 'clean Swiss style and Bauhaus graphic artwork, bold typographic grid layout, striking asymmetrical geometric shapes and diagonal vector lines rendered flat onto the canvas, high-contrast modernist corporate composition', bg: '#2b110b', neon: '#ff3300' },
                { label: 'Bioluminescencyjny Bio-Tech', val: 'glowing bioluminescent organic fluid graphic artwork, translucent liquid shapes and cellular micro-structures illuminated from within, vibrant aquatic neon flows rendered flat onto the canvas, futuristic scientific aesthetic', bg: '#05242b', neon: '#00ffcc' },
                { label: 'Luksusowe Art Deco & Złoto', val: 'opulent Art Deco geometric graphic artwork, symmetrical gold filigree vector patterns on deep emerald green and navy blue canvas, polished marble textures rendered flat, high-end luxury architectural elegance', bg: '#082119', neon: '#d4af37' },
                { label: 'Retro Synthwave 80s', val: 'vibrant 80s retro synthwave digital graphic artwork, chrome metal reflections, luminous perspective vector grid lines, glowing sunset gradients of magenta, violet and teal rendered flat onto the canvas', bg: '#24062b', neon: '#ff00aa' },
                { label: 'Kreskówkowy (Styl Pixar)', val: 'vibrant 3D Pixar-style cartoon animation digital artwork, expressive animated character and environmental graphic artwork rendered flat onto the canvas, smooth stylized 3D volumetric shading, playful rich color palette, charming cinematic studio illumination, high-end 3D animation feature film quality', bg: '#1c0b36', neon: '#ff00aa' },
                { label: 'Średniowieczna Rycina', val: 'intricate medieval woodcut engraving art style graphic artwork, detailed vintage linework and crosshatching rendered flat onto the canvas, historical antique manuscript illustration look, monochromatic ink hatching, authentic Renaissance woodblock print aesthetic', bg: '#261e12', neon: '#d4af37' },
                { label: 'Elegancki Minimalizm', val: 'minimalist sophisticated fine art style graphic artwork, clean elegant lines, subtle geometric harmony, massive negative space, understated premium corporate composition, artistic and breathable flat layout', bg: '#072417', neon: '#00ff88' },
                { label: 'Płaski Wektor', val: '2D vector flat design style graphic artwork, clean corporate geometric illustrations, sharp crisp edges, solid color blocks, modern professional graphics, completely flat surface with zero gradient depth', bg: '#2b1b00', neon: '#ff9900' }
            ]
        },
        {
            id: 'material',
            title: '2. GŁÓWNE MATERIAŁY',
            options: [
                { label: 'Automatyczny (Dobierz do branży)', val: 'incorporating automatically selected premium material textures tailored specifically to the company line of business and industry profile, while strictly maintaining a realistic photographic tactile material finish', bg: '#121e2b', neon: '#00d2ff' },
                { label: 'Szczotkowany Metal', val: 'incorporating premium brushed metal and anodized aluminum surfaces with a subtle metallic sheen', bg: '#16202c', neon: '#7fa5d4' },
                { label: 'Surowy Beton', val: 'incorporating raw industrial micro-concrete and fair-faced cement texture with fine organic structural grain', bg: '#212121', neon: '#bbbbbb' },
                { label: 'Luksusowy Marmur', val: 'incorporating high-end polished marble and elegant natural veined stone texture', bg: '#292218', neon: '#e8c38a' },
                { label: 'Ciepłe Drewno', val: 'incorporating fine organic wood grain and architectural warm timber texture details', bg: '#2e1507', neon: '#ff6600' },
                { label: 'Matowy Polimer', val: 'incorporating smooth matte polymer plastic and non-reflective architectural satin finish surfaces', bg: '#2b0c1b', neon: '#ff0066' },
                { label: 'Szkło Akrylowe / Pleksi', val: 'incorporating glossy high-tech acrylic plexiglass and translucent polycarbonate surfaces', bg: '#05272e', neon: '#00e5ff' },
                { label: 'Tekstylny Splot / Len', val: 'incorporating luxurious woven linen textile texture and fine organic fabric mesh structure', bg: '#241e12', neon: '#d4af37' }
            ]
        },
        {
            id: 'logo',
            title: '3. IKONA / LOGO',
            options: [
                { label: 'Generuj automatycznie', val: 'generate automatically based on the company name profile and line of business', bg: '#101026', neon: '#6666ff' },
                { label: 'Użyj załącznika', val: 'use the attached file. Adjust the colours to match the colour pattern from selected main colour section', bg: '#26101e', neon: '#ff66cc' }
            ]
        },
        {
            id: 'logoPos',
            title: '4. POZYCJA LOGO',
            options: [
                { label: 'Centrala / duża czcionka', val: 'centered in large font', bg: '#1a1a1a', neon: '#ffffff' },
                { label: 'lewy górny róg', val: 'in the top left corner', bg: '#1a1a1a', neon: '#ffffff' },
                { label: 'prawy górny róg', val: 'in the top right corner', bg: '#1a1a1a', neon: '#ffffff' },
                { label: 'lewy dolny róg', val: 'in the bottom left corner', bg: '#1a1a1a', neon: '#ffffff' },
                { label: 'prawy dolny róg', val: 'in the bottom right corner', bg: '#1a1a1a', neon: '#ffffff' },
                { label: 'pionowo wzdłuż lewego profila', val: 'vertically along the left profile', bg: '#1a1a1a', neon: '#ffffff' },
                { label: 'pionowo wzdłuż prawego profila', val: 'vertically along the right profile', bg: '#1a1a1a', neon: '#ffffff' }
            ]
        },
        {
            id: 'format',
            title: '5. FORMAT (PROPORCJE)',
            options: [
                { label: '100x250 (AR 2:5)', val: '2:5', bg: '#2e0000', neon: '#ff3333' },
                { label: '200x250 (AR 4:5)', val: '4:5', bg: '#2e0000', neon: '#ff3333' },
                { label: '300x250 (AR 6:5)', val: '6:5', bg: '#2e0000', neon: '#ff3333' },
                { label: '100x300 (AR 1:3)', val: '1:3', bg: '#2e0000', neon: '#ff3333' },
                { label: '200x300 (AR 2:3)', val: '2:3', bg: '#2e0000', neon: '#ff3333' },
                { label: '300x300 / 100x100 (AR 1:1)', val: '1:1', bg: '#2e0000', neon: '#ff3333' },
                { label: '100x300 banner (AR 1:3)', val: '1:3', bg: '#2e0000', neon: '#ff3333' },
                { label: '85x250 (AR 17:50)', val: '17:50', bg: '#2e0000', neon: '#ff3333' },
                { label: '85x300 (AR 17:60)', val: '17:60', bg: '#2e0000', neon: '#ff3333' }
            ]
        },
        {
            id: 'extras',
            title: '6. DODATKOWE ELEMENTY',
            options: [
                { label: 'Brak dodatkowych elementów', val: '', bg: '#1a1a1a', neon: '#666666' },
                { label: 'Przewagi konkurencyjne', val: "On the side, incorporate a clean, highly legible infographic section displaying 3 key competitive advantages of the product. The design must feature 3 distinct blocks, each starting with a sharp, bold English headline (such as 'MAXIMUM EFFICIENCY', 'ECO-FRIENDLY', 'PREMIUM QUALITY'), followed by 2 lines of actual, readable, grammatically correct English description text explaining the feature. Ensure the typography is crisp, flat, and perfectly aligned, with zero gibberish characters.", bg: '#190033', neon: '#b366ff' },
                { label: 'Lista asortymentu', val: "Incorporate a dedicated, well-structured product assortment list on the right side of the panel. The layout must display a clean typographic menu with a bold main header 'PRODUCT RANGE'. Below it, render a perfectly aligned vertical list of 4 to 5 actual, readable product category names in English (e.g., 'INDUSTRIAL SYSTEMS', 'SMART SOLUTIONS', 'PREMIUM ACCESSORIES'), each preceded by a simple bullet point or a minimalist vector icon. The text must be clean, flat, and completely legible for a trade show audience.", bg: '#190033', neon: '#b366ff' },
                { label: 'Więcej o firmie', val: "Integrate a professional 'ABOUT US' corporate profile section into the graphic composition. This section must feature a bold section title 'OUR STORY', followed by a short, coherent, and fully readable paragraph in English describing the company's mission and global scale. Next to the paragraph, render 2 clean data badges displaying sharp, legible numbers and text (such as 'EST. 1998' or 'GLOBAL REACH'). All typography must be flat, vector-style, and free of visual artifacts or broken characters.", bg: '#190033', neon: '#b366ff' }
            ]
        },
        {
            id: 'language',
            title: '7. JĘZYK TEKSTÓW NA GRAFICE',
            options: [
                { label: '🇵🇱 Polski', val: 'Polish language (Polski)', bg: '#240a0a', neon: '#ff4d4d' },
                { label: '🇬🇧 Angielski', val: 'English language (English)', bg: '#0a192f', neon: '#3399ff' },
                { label: '🇩🇪 Niemiecki', val: 'German language (Deutsch)', bg: '#2b2100', neon: '#ffcc00' },
                { label: '🇫🇷 Francuski', val: 'French language (Français)', bg: '#081c24', neon: '#00ccff' },
                { label: '🇮🇹 Włoski', val: 'Italian language (Italiano)', bg: '#082411', neon: '#00ff66' },
                { label: '🇨🇳 Chiński (Uproszczony)', val: 'Simplified Chinese language (Simplified Chinese Characters - 简体中文)', bg: '#2b0606', neon: '#ff0033' },
                { label: '🇯🇵 Japoński', val: 'Japanese language (Japanese Kanji and Kana scripts - 日本語)', bg: '#2b061e', neon: '#ff00aa' }
            ]
        }
    ];

    let activeModalGroup = null;

    window.togglePromptGeneratorMode = function (enable) {
        const stage = document.getElementById('stage');
        if (!stage) return;

        let overlay = document.getElementById('prompt-generator-stage-overlay');

        if (enable) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'prompt-generator-stage-overlay';
                overlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at 50% 10%, #140821 0%, #050505 80%);
                    z-index: 500;
                    overflow-y: auto;
                    padding: 40px 20px;
                    box-sizing: border-box;
                    color: #fff;
                    font-family: 'Segoe UI', sans-serif;
                `;
                stage.appendChild(overlay);
            }
            overlay.style.display = 'block';
            renderMainStageContent();
        } else {
            if (overlay) overlay.style.display = 'none';
        }
    };

    function renderMainStageContent() {
        const overlay = document.getElementById('prompt-generator-stage-overlay');
        if (!overlay) return;

        overlay.innerHTML = `
            <div style="max-width: 1150px; margin: 0 auto;">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #00d2ff, #ff0080); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; letter-spacing: 2px;">
                        🎨 Generator Promptów AI dla Grafiki
                    </h1>
                    <p style="margin: 8px 0 0 0; color: #aaa; font-size: 13px;">
                        Określ parametry stoiska targowego oraz wybierz kafelki stylu, aby wygenerować optymalny prompt dla AI
                    </p>
                </div>

                <!-- JSON Structure Box -->
                <div style="background: rgba(20, 20, 20, 0.8); border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                        <h3 style="margin: 0; font-size: 13px; text-transform: uppercase; color: #ff00ea; letter-spacing: 1px; font-weight: bold;">
                            📦 Struktura JSON Stoiska (Import / Odczyt Projektu)
                        </h3>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="window.syncBoothJsonFromScene()" style="background: #1a1a1a; border: 1px solid #ff00ea; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s;" onmouseenter="this.style.background='#ff00ea'; this.style.color='#000'" onmouseleave="this.style.background='#1a1a1a'; this.style.color='#fff'">
                                ⚡ Pobierz z obecnej sceny
                            </button>
                            <label style="background: #1a1a1a; border: 1px solid #00d2ff; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s;" onmouseenter="this.style.background='#00d2ff'; this.style.color='#000'" onmouseleave="this.style.background='#1a1a1a'; this.style.color='#fff'">
                                📂 Wgraj plik projektu (.json)
                                <input type="file" id="pg-json-file-input" accept=".json" onchange="window.handleJsonFileUpload(event)" style="display: none;">
                            </label>
                        </div>
                    </div>
                    <div id="pg-json-status" style="font-size: 12px; color: #00ff88; font-family: monospace; background: #0a0a0a; padding: 8px 12px; border-radius: 6px; border: 1px solid #222;">
                        ⚡ System gotowy. Możesz pobrać strukturę z aktywnej sceny 3D lub wgrać zapisany plik projektu .json z dysku.
                    </div>
                </div>

                <!-- Text Parameters Box -->
                <div style="background: rgba(20, 20, 20, 0.8); border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <h3 style="margin: 0; font-size: 13px; text-transform: uppercase; color: var(--highlight, #00d2ff); letter-spacing: 1px; font-weight: bold;">
                            📝 Parametry Tekstowe (Wpisz ręcznie lub wylosuj)
                        </h3>
                        <button onclick="window.randomizeAllFields()" style="background: #1a1a1a; border: 1px solid var(--highlight, #00d2ff); color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 6px; box-shadow: 0 0 10px rgba(0,210,255,0.2); transition: all 0.2s;" onmouseenter="this.style.background='var(--highlight)'; this.style.color='#000'" onmouseleave="this.style.background='#1a1a1a'; this.style.color='#fff'">
                            🎲 Losuj pełny zestaw inspiracji
                        </button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                <label style="font-size: 11px; color: #888;">Branża / Tematyka:</label>
                                <span onclick="window.randomizeSingleField('branza')" style="cursor: pointer; font-size: 13px; opacity: 0.7; transition: opacity 0.2s;" title="Losuj tę wartość" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'">🎲</span>
                            </div>
                            <input type="text" id="pg-branza" placeholder="np. Fotowoltaika" style="width:100%; padding:9px 12px; background:#0e0e0e; color:#fff; border:1px solid #333; border-radius:6px; box-sizing:border-box; outline:none; font-size:13px; transition:border 0.3s;" onfocus="this.style.borderColor='#00d2ff'" onblur="this.style.borderColor='#333'" oninput="window.buildPromptEngine()">
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                <label style="font-size: 11px; color: #888;">Główny motyw graficzny:</label>
                                <span onclick="window.randomizeSingleField('motyw')" style="cursor: pointer; font-size: 13px; opacity: 0.7; transition: opacity 0.2s;" title="Losuj tę wartość" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'">🎲</span>
                            </div>
                            <input type="text" id="pg-motyw" placeholder="np. Abstrakcyjne linie światła" style="width:100%; padding:9px 12px; background:#0e0e0e; color:#fff; border:1px solid #333; border-radius:6px; box-sizing:border-box; outline:none; font-size:13px; transition:border 0.3s;" onfocus="this.style.borderColor='#00d2ff'" onblur="this.style.borderColor='#333'" oninput="window.buildPromptEngine()">
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                <label style="font-size: 11px; color: #888;">Nazwa firmy:</label>
                                <span onclick="window.randomizeSingleField('firma')" style="cursor: pointer; font-size: 13px; opacity: 0.7; transition: opacity 0.2s;" title="Losuj tę wartość" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'">🎲</span>
                            </div>
                            <input type="text" id="pg-firma" placeholder="np. SolarTech" style="width:100%; padding:9px 12px; background:#0e0e0e; color:#fff; border:1px solid #333; border-radius:6px; box-sizing:border-box; outline:none; font-size:13px; transition:border 0.3s;" onfocus="this.style.borderColor='#00d2ff'" onblur="this.style.borderColor='#333'" oninput="window.buildPromptEngine()">
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                <label style="font-size: 11px; color: #888;">2-3 główne kolory:</label>
                                <div style="display: flex; gap: 6px; align-items: center;">
                                    <label style="font-size: 9px; color: #aaa; display: flex; align-items: center; gap: 3px; cursor: pointer; user-select: none;">
                                        <input type="checkbox" id="pg-lock-colors" style="margin: 0; cursor: pointer;"> Zablokuj
                                    </label>
                                    <span onclick="window.randomizeColorPalette()" style="cursor: pointer; font-size: 13px; opacity: 0.7; transition: opacity 0.2s;" title="Losuj harmonijną paletę barw" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'">🎨</span>
                                    <span onclick="window.randomizeSingleField('kolory')" style="cursor: pointer; font-size: 13px; opacity: 0.7; transition: opacity 0.2s;" title="Losuj tę wartość" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'">🎲</span>
                                </div>
                            </div>
                            <input type="text" id="pg-kolory" placeholder="np. granat, neon błękit, biel" style="width:100%; padding:9px 12px; background:#0e0e0e; color:#fff; border:1px solid #333; border-radius:6px; box-sizing:border-box; outline:none; font-size:13px; transition:border 0.3s;" onfocus="this.style.borderColor='#00d2ff'" onblur="this.style.borderColor='#333'" oninput="window.buildPromptEngine()">
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                <label style="font-size: 11px; color: #888;">Hasło / Slogan:</label>
                                <span onclick="window.randomizeSingleField('haslo')" style="cursor: pointer; font-size: 13px; opacity: 0.7; transition: opacity 0.2s;" title="Losuj tę wartość" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'">🎲</span>
                            </div>
                            <input type="text" id="pg-haslo" placeholder="np. Czysta energia dla Ciebie" style="width:100%; padding:9px 12px; background:#0e0e0e; color:#fff; border:1px solid #333; border-radius:6px; box-sizing:border-box; outline:none; font-size:13px; transition:border 0.3s;" onfocus="this.style.borderColor='#00d2ff'" onblur="this.style.borderColor='#333'" oninput="window.buildPromptEngine()">
                        </div>
                    </div>
                </div>

                <!-- 6 Large Category Cards Grid -->
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 13px; text-transform: uppercase; color: var(--highlight, #00d2ff); letter-spacing: 1px; font-weight: bold;">
                        🎛️ Opcje Graficzne (Kliknij kafelek, aby rozwinąć wybór)
                    </h3>
                    <div id="pg-large-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
                        <!-- Large Cards dynamically injected here -->
                    </div>
                </div>

                <!-- Output Area -->
                <div style="background: rgba(15, 15, 15, 0.9); border: 1px solid #333; border-radius: 12px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <h3 style="margin: 0; font-size: 13px; text-transform: uppercase; color: #00ff88; letter-spacing: 1px; font-weight: bold;">
                            📜 Wygenerowana Treść Promptu
                        </h3>
                        <!-- AI Model Selector Buttons -->
                        <div style="display: flex; align-items: center; gap: 6px; background: #0a0a0a; padding: 4px; border-radius: 8px; border: 1px solid #222;">
                            <span style="font-size: 10px; color: #888; margin-right: 4px; font-weight: bold;">SILNIK AI:</span>
                            <button class="pg-aimodel-btn" data-model="midjourney" onclick="window.selectAiModel('midjourney')" style="padding: 4px 8px; background: #00d2ff; color: #000; border: none; border-radius: 5px; font-size: 10px; font-weight: bold; cursor: pointer; transition: all 0.2s;">Midjourney v6</button>
                            <button class="pg-aimodel-btn" data-model="gemini" onclick="window.selectAiModel('gemini')" style="padding: 4px 8px; background: #1a1a1a; color: #aaa; border: none; border-radius: 5px; font-size: 10px; font-weight: bold; cursor: pointer; transition: all 0.2s;">Gemini Imagen</button>
                            <button class="pg-aimodel-btn" data-model="dalle3" onclick="window.selectAiModel('dalle3')" style="padding: 4px 8px; background: #1a1a1a; color: #aaa; border: none; border-radius: 5px; font-size: 10px; font-weight: bold; cursor: pointer; transition: all 0.2s;">DALL-E 3</button>
                            <button class="pg-aimodel-btn" data-model="flux" onclick="window.selectAiModel('flux')" style="padding: 4px 8px; background: #1a1a1a; color: #aaa; border: none; border-radius: 5px; font-size: 10px; font-weight: bold; cursor: pointer; transition: all 0.2s;">FLUX.1</button>
                        </div>
                    </div>
                    
                    <textarea id="pg-output-prompt" rows="7" readonly style="width: 100%; background: #080808; color: #00ff88; border: 1px solid #222; border-radius: 8px; padding: 12px; font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; line-height: 1.5; box-sizing: border-box; resize: vertical; outline: none;" placeholder="Wypełnij parametry powyżej..."></textarea>

                    <div style="display: flex; gap: 15px; margin-top: 15px;">
                        <button id="pg-btn-gemini" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #1a4da0, #2b6cb0); color: #fff; border: 1px solid #4299e1; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3); transition: all 0.2s;">
                            🚀 Wygeneruj z Gemini (Kopiuj i Otwórz)
                        </button>
                        <button id="pg-btn-chatgpt" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #0f766e, #14b8a6); color: #fff; border: 1px solid #2dd4bf; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 4px 15px rgba(45, 212, 191, 0.3); transition: all 0.2s;">
                            🤖 Wygeneruj z ChatGPT (Kopiuj i Otwórz)
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal Overlay for Selecting Options -->
            <div id="pg-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.88); z-index: 10000; align-items: center; justify-content: center; backdrop-filter: blur(12px);">
                <style>
                    @keyframes pgModalPopIn {
                        0% { opacity: 0; transform: scale(0.75) translateY(25px); box-shadow: 0 0 0px #00d2ff, 0 0 0px #ff00ff; border-color: #00d2ff; }
                        50% { opacity: 0.95; transform: scale(1.03) translateY(-4px); box-shadow: 0 0 80px #00d2ff, 0 0 140px #ff0077, inset 0 0 40px #00d2ff; border-color: #ffffff; }
                        75% { transform: scale(0.98) translateY(2px); }
                        100% { opacity: 1; transform: scale(1) translateY(0); box-shadow: 0 0 45px #00d2ff, 0 0 90px rgba(255,0,119,0.4), inset 0 0 25px rgba(0,210,255,0.25); border-color: #00d2ff; }
                    }
                    @keyframes pgModalPopOut {
                        0% { opacity: 1; transform: scale(1); box-shadow: 0 0 45px #00d2ff; }
                        40% { opacity: 0.7; transform: scale(1.04); box-shadow: 0 0 100px #ff0077; }
                        100% { opacity: 0; transform: scale(0.7) translateY(-30px); filter: blur(12px); }
                    }
                    @keyframes pgTileCyberFlash {
                        0% { transform: scale(1); filter: brightness(1); }
                        30% { transform: scale(1.08) rotate(-1deg); filter: brightness(2.2) contrast(1.3); box-shadow: 0 0 50px #ffffff, 0 0 100px #00d2ff; border-color: #ffffff; }
                        60% { transform: scale(1.03) rotate(1deg); filter: brightness(1.8); box-shadow: 0 0 40px #ff0077; }
                        100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
                    }
                    .pg-modal-box-animated {
                        animation: pgModalPopIn 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    }
                    .pg-modal-box-closing {
                        animation: pgModalPopOut 0.22s ease-in forwards;
                    }
                    .pg-tile-flash-anim {
                        animation: pgTileCyberFlash 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    }
                </style>
                <div id="pg-modal-box" style="background: rgba(12, 12, 16, 0.95); border: 2px solid var(--highlight, #00d2ff); border-radius: 14px; width: 90%; max-width: 820px; max-height: 85vh; overflow-y: auto; padding: 25px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px;">
                        <h3 id="pg-modal-title" style="margin: 0; color: #fff; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Wybierz opcję</h3>
                        <span id="pg-modal-close" style="color: #888; font-size: 24px; cursor: pointer; line-height: 1;" onclick="window.closeOptionsModal()" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='#888'">✖</span>
                    </div>
                    <div id="pg-modal-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
                        <!-- Options dynamically inserted here -->
                    </div>
                </div>
            </div>
        `;

        renderLargeCards();
        bindMainStageEvents();
        window.buildPromptEngine();
    }

    window.closeOptionsModal = function () {
        const modal = document.getElementById('pg-modal-overlay');
        const modalBox = document.getElementById('pg-modal-box');
        if (!modal) return;
        if (modalBox) {
            modalBox.classList.remove('pg-modal-box-animated');
            modalBox.classList.add('pg-modal-box-closing');
            setTimeout(() => {
                modal.style.display = 'none';
                modalBox.classList.remove('pg-modal-box-closing');
            }, 180);
        } else {
            modal.style.display = 'none';
        }
    };

    function renderLargeCards() {
        const grid = document.getElementById('pg-large-cards-grid');
        if (!grid) return;
        let html = '';

        tileGroups.forEach(group => {
            const currentVal = window.promptSelections[group.id];
            const selectedOpt = group.options.find(o => o.val === currentVal) || group.options[0];

            const activeBg = selectedOpt ? selectedOpt.bg : '#1a1a1a';
            const activeNeon = selectedOpt ? selectedOpt.neon : '#00d2ff';
            const displayLabel = selectedOpt ? selectedOpt.label : 'Brak - kliknij aby wybrać';

            html += `
                <div class="pg-large-card" data-group-id="${group.id}" style="background: ${activeBg}; border: 2px solid ${activeNeon}; box-shadow: 0 0 15px ${activeNeon}44; border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px;" onmouseenter="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 0 25px ${activeNeon}aa'" onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 0 15px ${activeNeon}44'">
                    <div>
                        <div style="font-size: 11px; font-weight: 800; color: #aaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                            ${group.title}
                        </div>
                        <div style="font-size: 14px; font-weight: bold; color: #fff; line-height: 1.3;">
                            ${displayLabel}
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                        <span style="font-size: 10px; color: ${activeNeon}; font-weight: bold; text-transform: uppercase;">Kliknij, aby zmienić</span>
                        <span style="font-size: 12px; color: ${activeNeon};">⚙️</span>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;

        grid.querySelectorAll('.pg-large-card').forEach(card => {
            card.addEventListener('click', function () {
                const groupId = this.getAttribute('data-group-id');
                this.classList.add('pg-tile-flash-anim');
                setTimeout(() => this.classList.remove('pg-tile-flash-anim'), 300);
                openOptionsModal(groupId);
            });
        });
    }

    function openOptionsModal(groupId) {
        const group = tileGroups.find(g => g.id === groupId);
        if (!group) return;

        activeModalGroup = groupId;
        const modal = document.getElementById('pg-modal-overlay');
        const modalBox = document.getElementById('pg-modal-box');
        const modalTitle = document.getElementById('pg-modal-title');
        const modalGrid = document.getElementById('pg-modal-options-grid');

        if (!modal || !modalGrid) return;

        modalTitle.textContent = group.title + ' — Wybierz opcję';

        let html = '';
        group.options.forEach(opt => {
            const isSelected = window.promptSelections[groupId] === opt.val;
            const borderStyle = isSelected ? `border: 2px solid ${opt.neon}; box-shadow: 0 0 20px ${opt.neon}; font-weight: bold; transform: scale(1.02);` : `border: 1.5px solid ${opt.neon}77; opacity: 0.85;`;

            html += `
                <div class="pg-modal-tile" data-val="${encodeURIComponent(opt.val)}" style="background: ${opt.bg}; ${borderStyle} color: #fff; padding: 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; justify-content: space-between; min-height: 90px;" onmouseenter="this.style.opacity='1'; this.style.borderColor='${opt.neon}'" onmouseleave="if(!${isSelected}) this.style.opacity='0.85'">
                    <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #fff;">
                        ${opt.label}
                    </div>
                    <div style="text-align: right;">
                        ${isSelected ? `<span style="font-size: 11px; background: ${opt.neon}; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold;">AKTYWNA</span>` : `<span style="font-size: 10px; color: #aaa;">Wybierz</span>`}
                    </div>
                </div>
            `;
        });

        modalGrid.innerHTML = html;
        modal.style.display = 'flex';
        if (modalBox) {
            modalBox.classList.remove('pg-modal-box-closing');
            modalBox.classList.add('pg-modal-box-animated');
        }

        modalGrid.querySelectorAll('.pg-modal-tile').forEach(tile => {
            tile.addEventListener('click', function () {
                const val = decodeURIComponent(this.getAttribute('data-val'));
                this.classList.add('pg-tile-flash-anim');
                setTimeout(() => {
                    window.promptSelections[activeModalGroup] = val;
                    window.closeOptionsModal();
                    renderLargeCards();
                    window.buildPromptEngine();
                }, 120);
            });
        });
    }

    window.activeBoothJsonObject = null;

    window.syncBoothJsonFromScene = function () {
        let projectData = {
            version: 1,
            system: (document.getElementById('systemSelect')?.value || window.currentSystem || 'SEGO 2.0').toUpperCase(),
            projectName: document.getElementById('projectName')?.value.trim() || 'Stoisko Targowe',
            customerName: document.getElementById('customerName')?.value.trim() || 'Klient',
            floorConfig: window.floorConfig || {},
            plan: window.plan || []
        };
        window.activeBoothJsonObject = projectData;
        const statusEl = document.getElementById('pg-json-status');
        if (statusEl) statusEl.innerHTML = `✅ Pomyślnie zsynchronizowano aktywny projekt ze sceny (${(window.plan || []).length} elementów w planie).`;
        window.buildPromptEngine();
    };

    window.handleJsonFileUpload = function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (evt) {
            try {
                const parsed = JSON.parse(evt.target.result);
                window.activeBoothJsonObject = parsed;
                const statusEl = document.getElementById('pg-json-status');
                if (statusEl) statusEl.innerHTML = `📂 Pomyślnie załadowano plik JSON: <strong>${file.name}</strong> (System: ${parsed.system || 'N/A'})`;
                window.buildPromptEngine();
            } catch (err) {
                alert("Błąd odczytu pliku JSON. Upewnij się, że plik jest poprawnym plikiem projektu EXPO (.json).");
            }
        };
        reader.readAsText(file);
    };

    function extractBoothJsonData() {
        let boothData = {
            projectName: 'Stoisko Targowe',
            customerName: 'Klient',
            system: 'SEGO 2.0',
            modules: [],
            counters: [],
            accessories: [],
            totalItemsCount: 0,
            hasDoor: false,
            rawJson: null
        };

        if (window.activeBoothJsonObject) {
            let obj = window.activeBoothJsonObject;
            boothData.projectName = obj.projectName || 'Stoisko Targowe';
            boothData.customerName = obj.customerName || 'Klient';
            boothData.system = (obj.system || 'SEGO 2.0').toUpperCase();
            boothData.rawJson = obj;

            if (Array.isArray(obj.plan)) {
                obj.plan.forEach(item => {
                    boothData.totalItemsCount++;
                    let name = item.name || item.id || 'Element';
                    let lowerName = name.toLowerCase();
                    if (lowerName.includes('door') || lowerName.includes('drzwi') || lowerName.includes('kantorek') || lowerName.includes('storage')) {
                        boothData.hasDoor = true;
                    }
                    if (lowerName.includes('moduł') || lowerName.includes('wall') || lowerName.includes('door') || lowerName.includes('kaseton') || lowerName.includes('foldable')) {
                        boothData.modules.push({ name: name, quantity: 1, width: item.width, height: item.height });
                    } else if (lowerName.includes('lada') || lowerName.includes('counter') || lowerName.includes('tribune') || lowerName.includes('stolik')) {
                        boothData.counters.push({ name: name, quantity: 1 });
                    } else {
                        // Filter out internal CAD hardware items, connectors, feet, and generic 'Element' strings
                        if (!lowerName.includes('element') && !lowerName.includes('łącznik') && !lowerName.includes('stopka') && !lowerName.includes('adapter') && !lowerName.includes('profil') && !lowerName.includes('uchwyt')) {
                            boothData.accessories.push({ name: name, quantity: 1 });
                        }
                    }
                });
            }
            return boothData;
        }

        boothData.projectName = document.getElementById('projectName')?.value.trim() || 'Stoisko Targowe';
        boothData.customerName = document.getElementById('customerName')?.value.trim() || 'Klient';
        boothData.system = (document.getElementById('systemSelect')?.value || window.currentSystem || 'SEGO 2.0').toUpperCase();

        if (window.globalCounts && typeof window.globalCounts === 'object') {
            for (let name in window.globalCounts) {
                let item = window.globalCounts[name];
                if (!item || !item.qty) continue;
                boothData.totalItemsCount += item.qty;

                let lowerName = name.toLowerCase();
                if (lowerName.includes('door') || lowerName.includes('drzwi') || lowerName.includes('kantorek') || lowerName.includes('storage')) {
                    boothData.hasDoor = true;
                }
                if (lowerName.includes('moduł') || lowerName.includes('wall') || lowerName.includes('door') || lowerName.includes('kaseton') || lowerName.includes('foldable')) {
                    boothData.modules.push({ name: name, quantity: item.qty });
                } else if (lowerName.includes('lada') || lowerName.includes('counter') || lowerName.includes('tribune') || lowerName.includes('stolik')) {
                    boothData.counters.push({ name: name, quantity: item.qty });
                } else {
                    if (!lowerName.includes('element') && !lowerName.includes('łącznik') && !lowerName.includes('stopka') && !lowerName.includes('adapter') && !lowerName.includes('profil') && !lowerName.includes('uchwyt')) {
                        boothData.accessories.push({ name: name, quantity: item.qty });
                    }
                }
            }
        }
        return boothData;
    }

    function extractWallSpatialCoordinates() {
        let activePlan = (window.activeBoothJsonObject && Array.isArray(window.activeBoothJsonObject.plan)) ? window.activeBoothJsonObject.plan : window.plan;
        if (!activePlan || !Array.isArray(activePlan)) return { leftWingPanels: [], backWallPanels: [], rightWingPanels: [], kantorekPanels: [], summary: { layoutType: "L-SHAPE", leftWingWidth: 300, backWallWidth: 300, rightWingDepth: 300, totalWidth: 400, totalDepth: 400, hasKantorek: false } };

        let calculatedPositions = [];
        if (typeof window.getWallPositions === 'function') {
            try {
                calculatedPositions = window.getWallPositions(activePlan) || [];
            } catch (e) {}
        }

        let rawLeftItems = [];
        let rawBackItems = [];
        let rawRightItems = [];
        let kantorekPanels = [];
        let pIndex = 0;
        let hasKantorek = false;

        activePlan.forEach((item, idx) => {
            if (item.type === 'wall' || item.type === 'door' || (item.name && (item.name.toLowerCase().includes('moduł') || item.name.toLowerCase().includes('wall') || item.name.toLowerCase().includes('door') || item.name.toLowerCase().includes('sego')))) {
                pIndex++;
                let posObj = calculatedPositions.find(w => w.planIndex === idx);
                let angle = posObj ? Math.round(((posObj.angle || 0) + 360) % 360) : (item.freeAngle || 0);
                let wCm = item.width || item.length || 100;
                let hCm = item.height || 250;

                let isDoor = (item.name || '').toLowerCase().includes('door') || (item.name || '').toLowerCase().includes('drzwi');
                let pObj = {
                    panel_id: `PANEL-${pIndex < 10 ? '0' + pIndex : pIndex}`,
                    name: item.name || item.id || 'Moduł Ścianki SEGO',
                    width_cm: wCm,
                    height_cm: hCm,
                    is_storage_door: isDoor
                };

                if (isDoor || (item.name || '').toLowerCase().includes('kantorek')) {
                    pObj.wall_section = "3D Enclosed Storage Room Cubicle (Kantorek)";
                    pObj.joinType = isDoor 
                        ? "Continuous flush wall panel with hidden storage access; features only an ultra-subtle 4cm silver cylinder lock on the left at 125cm height (NO door frames, NO rectangular cutouts, NO handles)"
                        : "Corner storage room enclosure panel";
                    kantorekPanels.push(pObj);
                    hasKantorek = true;
                } else if (angle === 90) {
                    rawRightItems.push(pObj);
                } else if (angle === 270) {
                    rawLeftItems.push(pObj);
                } else {
                    rawBackItems.push(pObj);
                }
            }
        });

        // Smart classification into dynamic facade wings
        let leftWingPanels = [];
        let backWallPanels = [];
        let rightWingPanels = [];
        let leftWingWidth = 0;
        let backWallWidth = 0;
        let rightWingDepth = 0;

        // Process Left Return Wing (angle 270)
        let left300 = rawLeftItems.find(i => i.width_cm >= 300 || i.name.includes('300'));
        if (left300) {
            left300.wall_section = "Left Side Return Wall Wing";
            left300.joinType = "Continuous 300cm left graphic facade wall module";
            leftWingPanels.push(left300);
            leftWingWidth = 300;
        } else {
            let sum = 0;
            rawLeftItems.forEach(i => {
                if (sum < 300) {
                    i.wall_section = "Left Side Return Wall Wing";
                    i.joinType = "Coplanar module in continuous left graphic facade";
                    leftWingPanels.push(i);
                    sum += i.width_cm;
                }
            });
            leftWingWidth = sum || (rawLeftItems.length > 0 ? 300 : 0);
        }

        // Process Back Wall Wing (angle 0)
        let back300 = rawBackItems.find(i => i.width_cm >= 300 || i.name.includes('300'));
        if (back300) {
            back300.wall_section = "Main Back Backdrop Wall Wing";
            back300.joinType = "Continuous 300cm back graphic backdrop module";
            backWallPanels.push(back300);
            backWallWidth = 300;
        } else {
            let sum = 0;
            rawBackItems.forEach(i => {
                if (sum < 300) {
                    i.wall_section = "Main Back Backdrop Wall Wing";
                    i.joinType = "Coplanar module in main back graphic backdrop";
                    backWallPanels.push(i);
                    sum += i.width_cm;
                } else {
                    i.wall_section = "3D Enclosed Storage Room Cubicle (Kantorek)";
                    i.joinType = "Corner storage room enclosure panel";
                    kantorekPanels.push(i);
                }
            });
            backWallWidth = sum || 300;
        }

        // Process Right Return Wing (angle 90)
        let right300 = rawRightItems.find(i => i.width_cm >= 300 || i.name.includes('300'));
        if (right300) {
            right300.wall_section = "Right Side Return Wall Wing";
            right300.joinType = "Continuous 300cm right graphic facade wall module";
            rightWingPanels.push(right300);
            rightWingDepth = 300;
        } else {
            let sum = 0;
            rawRightItems.forEach(i => {
                if (sum < 300) {
                    i.wall_section = "Right Side Return Wall Wing";
                    i.joinType = "Coplanar module in continuous right graphic facade";
                    rightWingPanels.push(i);
                    sum += i.width_cm;
                }
            });
            rightWingDepth = sum || (rawRightItems.length > 0 ? 300 : 0);
        }

        let isUShape = (leftWingPanels.length > 0 || rawLeftItems.length > 0) && (rightWingPanels.length > 0 || rawRightItems.length > 0);
        let isLShape = !isUShape && ((leftWingPanels.length > 0 || rawLeftItems.length > 0) || (rightWingPanels.length > 0 || rawRightItems.length > 0));
        let layoutTypeStr = isUShape ? "THREE-SIDED U-SHAPED EXPOSITION STAND LAYOUT (U-SHAPE)" : (isLShape ? "SYMMETRICAL L-SHAPED CORNER STAND LAYOUT (L-SHAPE)" : "STRAIGHT LINE BACKDROP EXPOSITION STAND LAYOUT (I-SHAPE)");

        // Dynamic detection of Kantorek corner location (back-left vs back-right)
        let kantorekCornerStr = "back-left corner junction joining the main back wall and left wing";
        let kantorekCornerShort = "back-left corner";
        let doorItemIdx = activePlan.findIndex(i => (i.type === 'door') || (i.name || '').toLowerCase().includes('drzwi') || (i.name || '').toLowerCase().includes('kantorek'));
        if (doorItemIdx !== -1) {
            let doorPos = calculatedPositions.find(w => w.planIndex === doorItemIdx);
            if (doorPos && calculatedPositions.length > 0) {
                let allX = calculatedPositions.map(w => (w.startX + w.endX) / 2);
                let minX = Math.min(...allX);
                let maxX = Math.max(...allX);
                let midX = (minX + maxX) / 2;
                let doorX = (doorPos.startX + doorPos.endX) / 2;
                if (doorX > midX) {
                    kantorekCornerStr = "back-right corner junction joining the main back wall and right wing";
                    kantorekCornerShort = "back-right corner";
                }
            } else if (doorItemIdx > activePlan.length / 2) {
                kantorekCornerStr = "back-right corner junction joining the main back wall and right wing";
                kantorekCornerShort = "back-right corner";
            }
        }

        return {
            leftWingPanels: leftWingPanels,
            backWallPanels: backWallPanels,
            rightWingPanels: rightWingPanels,
            kantorekPanels: kantorekPanels,
            summary: {
                layoutType: layoutTypeStr,
                isUShape: isUShape,
                isLShape: isLShape,
                isIShape: !isUShape && !isLShape,
                leftWingWidth: leftWingWidth || (isUShape ? 300 : 0),
                backWallWidth: backWallWidth || 300,
                rightWingDepth: rightWingDepth || 300,
                totalWidth: (backWallWidth || 300) + (hasKantorek ? 100 : 0),
                totalDepth: Math.max(leftWingWidth, rightWingDepth) || 300,
                hasKantorek: hasKantorek,
                kantorekCornerStr: kantorekCornerStr,
                kantorekCornerShort: kantorekCornerShort
            }
        };
    }

    window.onPromptTypeChange = function () {
        const pType = document.getElementById('promptTypeSelector')?.value;
        const subControls = document.getElementById('ui-3d-vis-subcontrols');
        if (subControls) {
            subControls.style.display = (pType === 'booth_3d_vis') ? 'block' : 'none';
        }
        window.onPrompt3dVariantChange();
    };

    window.onPrompt3dVariantChange = function () {
        const pType = document.getElementById('promptTypeSelector')?.value;
        const variant = document.getElementById('prompt3dVariantSelector')?.value;
        const dimsBox = document.getElementById('ui-3d-tech-dims-box');
        if (dimsBox) {
            dimsBox.style.display = (pType === 'booth_3d_vis' && variant === 'tech') ? 'flex' : 'none';
        }
        window.buildPromptEngine();
    };

    window.buildPromptEngine = function () {
        const promptType = document.getElementById('promptTypeSelector')?.value || 'graphic_project';

        const branza = document.getElementById('pg-branza')?.value.trim() || '[BRANŻA/TEMATYKA]';
        const motyw = document.getElementById('pg-motyw')?.value.trim() || '[MOTYW_PRZEWODNI]';
        const firma = document.getElementById('pg-firma')?.value.trim() || '[NAZWA_FIRMY]';
        const kolory = document.getElementById('pg-kolory')?.value.trim() || '[KOLORY]';
        const haslo = document.getElementById('pg-haslo')?.value.trim() || '[HASŁO_TAGLINE]';

        const ikona = window.promptSelections.logo || '[IKONA_LOGO]';
        const pozycja = window.promptSelections.logoPos || '[POZYCJA_LOGO]';
        const dodatki = window.promptSelections.extras ? window.promptSelections.extras + '\n\n' : '';
        const proporcje = window.promptSelections.format || '2:5';

        const selectedStyle = window.promptSelections.style || '';
        const selectedMaterial = window.promptSelections.material || '';
        const selectedLanguage = window.promptSelections.language || 'Polish language (Polski)';
        const aiModel = window.promptSelections.aiModel || 'midjourney';

        const colorConsistencyRule = `COLOR CONSISTENCY COMPLIANCE MANDATE: The color scheme of this graphic MUST strictly match the color specification: "${kolory}". Since this graphic is part of a larger printed wall series, it is CRITICAL that the primary background color and accent colors remain exactly identical to the other panels in the series. Do not introduce new colors, gradients, or shades that are not specified. Strictly keep the exact same hex/CMYK palette across the whole print layout.`;

        if (promptType === 'booth_3d_vis') {
            const variant = document.getElementById('prompt3dVariantSelector')?.value || 'graphic';
            const boothData = extractBoothJsonData();
            const spatialData = extractWallSpatialCoordinates();
            let leftPanels = spatialData.leftWingPanels || [];
            let backPanels = spatialData.backWallPanels || [];
            let rightPanels = spatialData.rightWingPanels || [];
            let kantorekPanels = spatialData.kantorekPanels || [];
            let summary = spatialData.summary;

            let modulesListStr = boothData.modules.map(m => `${m.quantity}x ${m.name}`).join(', ') || 'modular fabric SEG wall panels';
            let countersListStr = boothData.counters.map(c => `${c.quantity}x ${c.name}`).join(', ') || 'freestanding exhibition reception counter';
            let accessoriesListStr = boothData.accessories.map(a => `${a.quantity}x ${a.name}`).join(', ') || '';

            let macroLayoutStr = '';
            let kantorekTextDesc = summary.hasKantorek ? `connected to an EXACT 100cm x 100cm square corner storage room cubicle (kantorek) situated at the ${summary.kantorekCornerShort}.` : `meeting directly in a clean 90-degree orthogonal corner with ABSOLUTELY NO storage cabin or storage room.`;

            if (summary.isUShape) {
                macroLayoutStr = `THREE-SIDED U-SHAPED EXPOSITION STAND LAYOUT (U-SHAPE: Left Return Wing + Main Back Wall + Right Return Wing): The stand features THREE GRAPHIC WALL FACADES forming an open U-shaped booth layout. Specifically: 1) LEFT SIDE RETURN WALL WING is a continuous ${summary.leftWingWidth}cm long by 250cm high graphic wall wing composed of ${leftPanels.length || 3} panels extending forward on the left. 2) MAIN BACK BACKDROP WALL WING is a continuous ${summary.backWallWidth}cm long by 250cm high rear wall wing composed of ${backPanels.length || 3} panels ${kantorekTextDesc} 3) RIGHT SIDE RETURN WALL WING is a continuous ${summary.rightWingDepth}cm long by 250cm high graphic wall wing composed of ${rightPanels.length || 3} panels extending forward on the right.`;
            } else if (summary.isLShape) {
                let activeSideWing = rightPanels.length > 0 ? `RIGHT SIDE RETURN WING (${summary.rightWingDepth}cm deep, extending forward at a 90-degree right angle). ABSOLUTELY NO LEFT SIDE WALL (THE LEFT SIDE IS COMPLETELY OPEN TO THE EXPO HALL!)` : `LEFT SIDE RETURN WING (${summary.leftWingWidth}cm long, extending forward at a 90-degree angle). ABSOLUTELY NO RIGHT SIDE WALL (THE RIGHT SIDE IS COMPLETELY OPEN TO THE EXPO HALL!)`;
                macroLayoutStr = `CORNER L-SHAPED EXPOSITION STAND LAYOUT (L-SHAPE: 2 Wall Facades Only): The stand features EXACTLY TWO GRAPHIC WALL WINGS connected at a strict 90-degree angle ${summary.hasKantorek ? 'joined by a 100x100cm corner storage cubicle at the ' + summary.kantorekCornerShort : 'with ZERO storage cabin'}. Specifically: 1) MAIN BACK WALL FACADE is a continuous ${summary.backWallWidth}cm long by 250cm high graphic wall wing composed of ${backPanels.length || 3} panels. 2) ${activeSideWing}. CRITICAL CONSTRAINT: DO NOT ADD A 3RD WALL FACADE! This is strictly an open 2-sided corner booth!`;
            } else {
                macroLayoutStr = `STRAIGHT LINE BACKDROP EXPOSITION STAND LAYOUT (I-SHAPE: Single Straight Wall Backdrop): The stand features a single continuous flat back wall facade (no side wings) measuring ${summary.backWallWidth}cm wide by 250cm high composed strictly of ${backPanels.length || 3} panels${summary.hasKantorek ? ' connected to a 100x100cm storage cabin' : ''}. ABSOLUTELY NO SIDE RETURN WALLS!`;
            }

            let spatialDescription = `Photorealistic 3D architectural rendering of an exhibition stand built strictly according to the CAD layout specification. The stand features ${macroLayoutStr}`;
            if (countersListStr) spatialDescription += `, equipped with ${countersListStr} placed in the front open floor area`;
            if (accessoriesListStr) spatialDescription += `, accompanied by ${accessoriesListStr}`;
            spatialDescription += `. Set in a professional trade show hall environment with subtle neutral lighting.`;

            let topologyRules = `STRICT GEOMETRY & ZERO-HALLUCINATION RULES: Render ONLY the exact wall panels and furniture components listed in the JSON architectural manifest. ABSOLUTELY DO NOT ADD extra wall panels, DO NOT create floating diagonal beams, DO NOT add pedestals, DO NOT add extra furniture or floating objects. NO EXTRA DISPLAY PEDESTALS OR TRYBUNKI MANDATE: Render ONLY the reception counter in front. ABSOLUTELY NO EXTRA DISPLAY PEDESTALS, NO FREE-STANDING TALL DISPLAY BOXES, NO TRYBUNKI ON THE FLOOR! The carpet floor area around the counter must remain clean and empty! ${summary.hasKantorek ? 'KANTOREK FOOTPRINT MANDATE: The storage room (kantorek) is strictly 100cm wide by 100cm deep (1x1m square cubicle). DO NOT render a 300cm wide storage room!' : 'NO STORAGE ROOM MANDATE: ABSOLUTELY NO STORAGE ROOM, NO KANTOREK CUBICLE, NO DOOR, NO LOCK DIAL!'} NO OVERHEAD FASCIA WALLS, NO EXTRA TOP WALL PANELS EXTENDING ABOVE THE GRAPHICS! The top horizontal edge of the wall panels (at exactly 250cm height) is the absolute highest physical top limit of the booth structure. RIGID ORTHOGONAL CORNER MANDATE: Every corner joint between adjacent wall panels MUST BE A STRICT PERPENDICULAR 90-DEGREE RIGHT ANGLE. All vertical wall panels stand 100% plumb and upright.`;

            let storageRulesStr = summary.hasKantorek 
                ? `SEGO SECRET INTEGRATED FLUSH STORAGE PANEL MANDATE: The storage room wall surface situated dynamically at the ${summary.kantorekCornerStr} is 100% FLAT AND SEAMLESS. ABSOLUTELY ZERO RECTANGULAR DOOR OUTLINE CUTOUTS, ZERO VISIBLE DOOR SEAMS, ZERO FRAME LINES, ZERO BLACK DOOR BOXES! The printed fabric graphic artwork flows completely unbroken and smooth across the entire wall face. The hidden storage entry is indicated ONLY by a tiny, ultra-subtle, minimal 4cm silver cylinder keyhole dial on the left side at 125cm height (NO large circular lock plates, NO handles, NO door frames).`
                : `NO STORAGE ENCLOSURE MANDATE: This stand DOES NOT HAVE a storage room, cubicle, or door! All wall surfaces are continuous 100% flat graphic facade panels meeting cleanly in a 90-degree corner. ABSOLUTELY ZERO STORAGE DOORS, ZERO LOCK DIALS, ZERO ROOM BOXES!`;

            const structConstructionRules = `SLIMLINE 12CM SILVER ANODIZED ALUMINUM PROFILE SPECIFICATION: Each modular wall panel has a slender physical side depth of exactly 12cm (120mm profile thickness). The exposed physical side edges and outer metallic borders of the wall modules ARE FINISHED IN NATURAL SATIN SILVER ANODIZED ALUMINUM. ABSOLUTELY NO BLACK FRAMES, NO BLACK POWDER-COATED PROFILE EDGES, NO BLACK PLASTIC BORDERS! ABSOLUTELY NO THICK HOLLOW MONOLITHIC BOX WALLS, NO 30CM THICK BLOCKWORK PARTITIONS, NO HEAVY PILLARS! ULTRA-SLIM EDGELESS SPECIFICATION: Wall graphics feature 100% frameless tension-stretched SEG fabric printing. ABSOLUTELY NO VISIBLE FRONT ALUMINUM FRAMES, NO METALLIC BORDERS, NO THICK PROFILE BEAMS, NO PICTURE-FRAME MOLDINGS SURROUNDING THE GRAPHIC FACES, NO VERTICAL METALLIC DIVIDERS BETWEEN MODULES! Printed fabric artwork fills 100% of the front wall surface cleanly to the outer edges with zero frame margin. ${storageRulesStr} ${topologyRules}`;

            let opening = '';
            let body = '';
            let constraints = '';

            if (variant === 'white') {
                opening = `Photorealistic 3D architectural rendering of a clean white modular trade show booth structure`;
                body = `${spatialDescription} ${structConstructionRules} ALL WALL SURFACES, COUNTERS, AND PANELS ARE FINISHED IN PRISTINE UNPRINTED SOLID MATTE WHITE FABRIC AND POLYMER MATERIALS. Absolutely ZERO graphic prints, NO text, NO logos, NO artwork on any wall surface. Clean, elegant, unbranded architectural mockup with soft realistic studio lighting.`;
                constraints = `CRITICAL REQUIREMENT: Pure white architectural booth mockup without any graphic elements or text. 3D perspective camera angle.`;
            } else if (variant === 'tech') {
                const showDims = document.getElementById('promptShowDimensions')?.checked !== false;
                const dimInstruction = showDims ? `PRECISE ISOMETRIC CAD ARCHITECTURAL STRUCTURAL BREAKDOWN, HIGHLIGHTING SLIM 12CM SILVER ANODIZED PROFILE EDGES, PLUMB VERTICAL MODULE SEAMS, AND RIGID 90-DEGREE ORTHOGONAL CORNERS.` : `CLEAN TECHNICAL ISOMETRIC CAD ARCHITECTURAL DRAWING STYLE, SHARP LINEWORK AND STRUCTURAL PROFILE OUTLINES.`;
                opening = `3D technical architectural CAD structural breakdown rendering of a modular exhibition stand`;
                body = `${spatialDescription} ${structConstructionRules} The rendering showcases the exact engineering breakdown and assembly structure of the booth in clean isometric CAD architectural visualization style. ${dimInstruction} Absolutely NO hand-drawn messy text tables, NO hallucinated 2D diagram overlays on the photo! Clean, high-precision unbranded architectural CAD visualization with crisp structural edge highlights.`;
                constraints = `CRITICAL REQUIREMENT: Technical engineering perspective view with 100% structural precision and rigid 90-degree orthogonal corners.`;
            } else { // 'graphic'
                opening = `Photorealistic 3D exhibition stand visualization of a fully branded trade show booth on a lively expo hall floor`;
                body = `${spatialDescription} ${structConstructionRules} Designed for the ${branza} industry (${getIndustryMood(branza)}). The wall modules feature vibrant graphic prints execution in ${selectedStyle}. Dominant color palette: ${kolory}. ${colorConsistencyRule} Applied on the central wall is a crisp company logo of ${firma} with icon ${ikona} (${pozycja}), alongside event slogan "${haslo}". ${selectedMaterial ? 'Material textures: ' + selectedMaterial + '.' : ''} All printed artwork strictly matches native ${selectedLanguage} typography.`;
                constraints = `CRITICAL REQUIREMENT: Complete 3D trade show booth perspective showing fully applied graphic artwork, illuminated LED backlights, and realistic trade show environment.`;
            }

            let modelSuffix = `--ar ${proporcje === '2:5' ? '16:9' : proporcje} --v 6.0`;
            if (aiModel === 'gemini') {
                modelSuffix = `Target aspect ratio: 16:9 widescreen. 8k resolution photorealistic 3D commercial architectural photograph. CRITICAL VISUAL CONSTRAINT FOR RENDER: ABSOLUTELY NO OVERLAID TEXT ANNOTATIONS, NO MEASUREMENT ARROWS, NO DRAWN DIMENSION NUMBERS (NO '300cm', NO '250cm' TEXT ON IMAGE), NO BLUEPRINT INFOGRAPHICS, NO DRAWN TECHNICAL LINES ON THE PHOTO! Clean pristine commercial exhibition hall photography.`;
            } else if (aiModel === 'dalle3') {
                modelSuffix = `Aspect ratio widescreen 16:9. Wide-angle 3D booth perspective. Clean architectural photography without overlaid dimension text.`;
            } else if (aiModel === 'flux') {
                modelSuffix = `--ar 16:9`;
            }

            // Construct clean semantic architectural JSON block for AI spatial understanding
            let cleanArchitecturalJson = {
                booth_architecture: {
                    system_specification: "SEGO 2.0 (120mm Ultra-Slim Silver Anodized Aluminum Frameless Tension Fabric System)",
                    layout_type: summary.layoutType,
                    graphic_facade_wings: {
                        left_side_return_wing: {
                            exists: leftPanels.length > 0,
                            length_cm: summary.leftWingWidth,
                            height_cm: 250,
                            facade_modules: leftPanels
                        },
                        main_back_wall_wing: {
                            exists: true,
                            length_cm: summary.backWallWidth,
                            height_cm: 250,
                            facade_modules: backPanels
                        },
                        right_side_return_wing: {
                            exists: rightPanels.length > 0,
                            length_cm: summary.rightWingDepth,
                            height_cm: 250,
                            facade_modules: rightPanels
                        }
                    },
                    corner_storage_room_kantorek: {
                        exists: summary.hasKantorek,
                        type: summary.hasKantorek ? "3D Enclosed Room Box Cubicle (STRICTLY 100x100cm square footprint)" : "None",
                        dimensions_cm: summary.hasKantorek ? "100x100x250" : "N/A",
                        location: summary.hasKantorek ? summary.kantorekCornerStr : "N/A",
                        cubicle_components: kantorekPanels
                    },
                    furniture: boothData.counters,
                    accessories: boothData.accessories
                }
            };

            let leftText = leftPanels.map(s => `    * ${s.panel_id}: ${s.name} (${s.width_cm}x${s.height_cm}cm)`).join('\n');
            let backText = backPanels.map(s => `    * ${s.panel_id}: ${s.name} (${s.width_cm}x${s.height_cm}cm)`).join('\n');
            let rightText = rightPanels.map(s => `    * ${s.panel_id}: ${s.name} (${s.width_cm}x${s.height_cm}cm)`).join('\n');
            let kantorekText = kantorekPanels.map(s => `    * ${s.panel_id}: ${s.name} (${s.width_cm}x${s.height_cm}cm)`).join('\n');

            const spatialSummaryInstruction = `\n\nEXACT ARCHITECTURAL WALL MANIFEST (${summary.layoutType}):\n1. LEFT SIDE RETURN WING (${summary.leftWingWidth}cm long):\n${leftPanels.length > 0 ? leftText : '    * ABSOLUTELY NONE (OPEN SIDE)'}\n2. MAIN BACK WALL WING (${summary.backWallWidth}cm long):\n${backText || '    * (Main Backdrop Modules)'}\n3. RIGHT SIDE RETURN WING (${summary.rightWingDepth}cm long):\n${rightPanels.length > 0 ? rightText : '    * ABSOLUTELY NONE (OPEN SIDE)'}\n4. CORNER STORAGE ROOM KANTOREK:\n${summary.hasKantorek ? kantorekText : '    * ABSOLUTELY NONE (NO STORAGE ROOM)'}\nCRITICAL GEOMETRY MANDATE: Render ONLY the wall wings that exist in the manifest above! DO NOT add missing walls or unlisted storage rooms!`;

            const jsonBlockInstruction = `${spatialSummaryInstruction}\n\nEXACT BOOTH STRUCTURE ARCHITECTURAL JSON:\n\`\`\`json\n${JSON.stringify(cleanArchitecturalJson, null, 2)}\n\`\`\`\nINSTRUCTION FOR AI: Parse the JSON architectural structure above to understand the exact physical composition. Render the 3D architectural visualization strictly matching this clean structural manifest.`;

            let full3dPrompt = `${opening}. ${body} ${constraints}${jsonBlockInstruction} ${modelSuffix}`;

            // Dedicated ultra-clean prompt architecture optimized specifically for Google Gemini (Imagen 3)
            if (aiModel === 'gemini') {
                let geminiVariantDesc = '';
                if (variant === 'white') {
                    geminiVariantDesc = 'All wall surfaces, panels, and counters are finished in pristine unprinted solid matte white fabric. Pure unbranded architectural mockup.';
                } else if (variant === 'tech') {
                    geminiVariantDesc = 'Clean technical isometric architectural drawing style with sharp structural profile outlines.';
                } else {
                    geminiVariantDesc = `Designed for the ${branza} industry. The wall panels feature vibrant graphic prints execution in ${selectedStyle}. Dominant color palette: ${kolory}. ${colorConsistencyRule} Applied on the central wall is a crisp company logo of ${firma} with icon ${ikona} (${pozycja}), alongside event slogan "${haslo}".`;
                }

                let geminiKantorekPhrase = summary.hasKantorek 
                    ? `with a compact 1x1m storage cabin built into the ${summary.kantorekCornerStr}.`
                    : `meeting perpendicularly at a strict 90-degree angle with ABSOLUTELY NO storage cabin or room cubicle.`;

                let layoutGeminiDesc = summary.isUShape 
                    ? `three-sided U-shaped modular trade show booth on a modern exhibition hall carpet floor. The booth consists of three graphic wall wings forming an open U-shape: a 3-meter left side return wing, a 3-meter main back backdrop wall ${geminiKantorekPhrase}, and a 3-meter right side return wing.`
                    : (summary.isLShape 
                        ? (rightPanels.length > 0 
                            ? `two-sided L-shaped corner modular trade show booth on a modern exhibition hall carpet floor. The booth consists strictly of two graphic wall wings: a 3-meter main back backdrop wall and a 3-meter right side return wing ${geminiKantorekPhrase}. ABSOLUTELY NO LEFT WALL FACADE (the left side is completely open!).`
                            : `two-sided L-shaped corner modular trade show booth on a modern exhibition hall carpet floor. The booth consists strictly of two graphic wall wings: a 3-meter main back backdrop wall and a 3-meter left side return wing ${geminiKantorekPhrase}. ABSOLUTELY NO RIGHT WALL FACADE (the right side is completely open!).`)
                        : `straight single-wall backdrop modular trade show booth on a modern exhibition hall carpet floor. The booth consists of a single continuous flat back wall facade.`);

                let geminiStorageFaceDesc = summary.hasKantorek 
                    ? `The wall face of the ${summary.kantorekCornerShort} storage cabin is completely flat, smooth, unbroken, and seamless fabric graphic with zero door frames, zero door cutlines, zero black door boxes, zero hinges, and zero traditional door handles. Mounted on the smooth fabric wall face at a height of 125cm is a single tiny 4cm round silver lock cylinder dial.`
                    : `ABSOLUTELY NO STORAGE CABIN, NO STORAGE DOORS, NO LOCK DIALS! The booth walls consist solely of continuous smooth graphic facade panels meeting in an open 90-degree corner.`;

                full3dPrompt = `Photorealistic 3D commercial architectural photograph of a ${layoutGeminiDesc} The wall physical side profile edges are slender 12cm thin natural satin silver anodized aluminum frames (strictly zero black frames!). The front wall graphics are smooth, 100% frameless, tension-stretched SEG fabric artwork. ${geminiStorageFaceDesc} Positioned neatly in front of the booth is a single freestanding reception counter desk. ${geminiVariantDesc} Soft professional exhibition lighting. Clean wide-angle perspective photography, zero overlaid text, zero measurement arrows, zero blueprint lines, zero extra pedestals. Target aspect ratio 16:9 widescreen. 8k resolution photorealistic 3D architectural render.`;
            }

            const outEl = document.getElementById('pg-output-prompt');
            if (outEl) outEl.value = full3dPrompt;
            return full3dPrompt;
        }

        // 🧠 Strict Production Print File Framing (Plik produkcyjny do druku na płasko, a nie zdjęcie ścianki)
        let openingPrefix = 'Direct flat front-facing 2D digital graphic production print artwork file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire frame edge-to-edge';
        let closingConstraint = 'CRITICAL PRODUCTION FILE REQUIREMENTS: This is a 2D flat digital graphic source artwork for print production. Absolutely NO physical trade show booth structures, NO 3D exhibition stand mockups, NO trade show hall background, NO floor, NO artificial drawn borders or framing around edges, NO perimeter lines, NO angled perspective photos, NO shadows. Direct 90-degree orthogonal front view filling 100% of the image frame edge-to-edge';

        if (selectedStyle.includes('photorealistic')) {
            if (aiModel === 'gemini') {
                openingPrefix = 'A high-resolution photorealistic commercial photograph of a direct flat front-facing 2D digital graphic print layout, completely flat 2D graphic design on canvas filling the entire canvas frame edge-to-edge';
            } else {
                openingPrefix = 'Direct flat front-facing photorealistic 2D digital graphic production print artwork file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
            }
        } else if (selectedStyle.includes('contemporary 3D')) {
            openingPrefix = 'Direct flat front-facing 3D abstract artwork 2D digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('cyberpunk')) {
            openingPrefix = 'Direct flat front-facing futuristic cyberpunk neon HUD digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('Sumi-e')) {
            openingPrefix = 'Direct flat front-facing elegant Japanese Sumi-e ink-wash digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('Swiss style')) {
            openingPrefix = 'Direct flat front-facing modernist Swiss style and Bauhaus digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('bioluminescent')) {
            openingPrefix = 'Direct flat front-facing glowing bioluminescent organic fluid digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('Art Deco')) {
            openingPrefix = 'Direct flat front-facing opulent Art Deco gold geometric digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('synthwave')) {
            openingPrefix = 'Direct flat front-facing 80s retro synthwave digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('Pixar-style')) {
            openingPrefix = 'Direct flat front-facing vibrant 3D Pixar-style cartoon animation digital graphic production print artwork file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('medieval woodcut')) {
            openingPrefix = 'Direct flat front-facing intricate medieval woodcut engraving artwork 2D digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('minimalist')) {
            openingPrefix = 'Direct flat front-facing minimalist fine-art 2D digital graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        } else if (selectedStyle.includes('2D vector')) {
            openingPrefix = 'Direct flat front-facing 2D vector style graphic production print file for SEG fabric wall printing, 100% full-bleed rectangular layout filling the entire canvas edge-to-edge';
        }

        const stylePart = selectedStyle ? ` Award-winning exhibition graphic design quality, ultra-crisp vector typography, pristine branding placement with zero visual artifacts. Visual style execution: ${selectedStyle}.` : '';
        const matPart = selectedMaterial ? ` Material texture details: ${selectedMaterial}.` : '';
        const moodPart = ` ${getIndustryMood(branza)}`;

        let modelSuffix = `--ar ${proporcje} --style raw`;
        if (aiModel === 'gemini') {
            modelSuffix = `Target aspect ratio for print layout: ${proporcje}. High resolution, clean 2D print composition.`;
        } else if (aiModel === 'dalle3') {
            modelSuffix = `Aspect ratio ${proporcje}. Clean wide-screen exhibition graphic layout.`;
        } else if (aiModel === 'flux') {
            modelSuffix = `--ar ${proporcje}`;
        }

        const langConstraint = `CRITICAL MANDATORY LANGUAGE REQUIREMENT: All written textual branding elements, company brand slogan, headers, infographics, and typography embedded anywhere on the graphic MUST BE STRICTLY WRITTEN IN ${selectedLanguage}. Maintain 100% accurate native script, correct alphabetic characters, zero spelling errors, and authentic typographic alignment specifically tailored for ${selectedLanguage}.`;

        let geminiPhotoConstraint = '';
        if (aiModel === 'gemini' && selectedStyle.includes('photorealistic')) {
            geminiPhotoConstraint = '\n\nCRITICAL PHOTOREALISM MANDATE FOR GEMINI: This image must be 100% photorealistic, resembling a high-resolution professional commercial product photograph of a flat canvas. Absolutely NO cartoons, sketches, digital drawings, low-quality vectors, or paintings! Every surface texture must have high tactile realism and authentic photographic depth.';
        }

        const fullPrompt = `${openingPrefix}, designed for a high-end ${branza} trade show booth application.${stylePart}${matPart} ${moodPart} The composition features a masterfully balanced arrangement of ${motyw} set against a clean, seamless solid background color. Predominant harmonious color palette: ${kolory}. ${colorConsistencyRule} All graphic elements, shapes, icons, and text are arranged with golden-ratio visual hierarchy and generous negative space breathing room away from the outer boundaries, allowing the uniform solid background color to naturally flow smoothly to all canvas edges without any artificial drawn frames, borders, or lines around the perimeter. No elements or shapes are cropped or cut off at the edges.

Included is a sharp, vector-crisp fictional logo icon of ${ikona} paired with clean, perfectly legible company name typography reading "${firma}" positioned ${pozycja}. Below the logo is the fictional event tagline rendered in elegant readable font: "${haslo}". Ensure 100% typographic accuracy, razor-sharp letterforms, and perfect optical kerning without broken characters. ${langConstraint}${geminiPhotoConstraint}

${dodatki}${closingConstraint} ${modelSuffix}`;

        const outEl = document.getElementById('pg-output-prompt');
        if (outEl) outEl.value = fullPrompt;
        return fullPrompt;
    };

    function getIndustryMood(branza) {
        const str = (branza || '').toLowerCase();
        if (str.includes('cyber') || str.includes('ai') || str.includes('software') || str.includes('5g') || str.includes('fintech') || str.includes('gaming')) {
            return "Aesthetic atmosphere: futuristic, cutting-edge, high-tech, digital innovation, sleek and glowing.";
        } else if (str.includes('architekt') || str.includes('wnętrz') || str.includes('luxury') || str.includes('zegar') || str.includes('biżuter')) {
            return "Aesthetic atmosphere: sophisticated, luxurious, opulent, refined elegance, architectural harmony.";
        } else if (str.includes('kawa') || str.includes('eko') || str.includes('herbat') || str.includes('owoc') || str.includes('zioł')) {
            return "Aesthetic atmosphere: organic, pure, natural, artisanal, eco-conscious, botanical freshness.";
        } else if (str.includes('roboty') || str.includes('automatyk') || str.includes('maszyn') || str.includes('stal') || str.includes('spawal')) {
            return "Aesthetic atmosphere: industrial strength, robust, heavy-duty engineering, precise mechanical power.";
        } else if (str.includes('medy') || str.includes('biotech') || str.includes('weteryn')) {
            return "Aesthetic atmosphere: sterile, clinical perfection, advanced scientific research, crystal clean.";
        }
        return "Aesthetic atmosphere: premium commercial brand presence, professional, modern and impactful.";
    }

    function bindMainStageEvents() {
        const closeBtn = document.getElementById('pg-modal-close');
        const modal = document.getElementById('pg-modal-overlay');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => window.closeOptionsModal());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) window.closeOptionsModal();
            });
        }

        const geminiBtn = document.getElementById('pg-btn-gemini');
        if (geminiBtn) {
            geminiBtn.addEventListener('click', function () {
                const promptText = window.buildPromptEngine();
                navigator.clipboard.writeText(promptText).then(() => {
                    alert('📋 Treść promptu została skopiowana do schowka! Otwieram stronę Gemini...');
                }).catch(() => {});
                window.open('https://gemini.google.com/app', '_blank');
            });
        }

        const chatgptBtn = document.getElementById('pg-btn-chatgpt');
        if (chatgptBtn) {
            chatgptBtn.addEventListener('click', function () {
                const promptText = window.buildPromptEngine();
                navigator.clipboard.writeText(promptText).then(() => {
                    alert('📋 Treść promptu została skopiowana do schowka! Otwieram stronę ChatGPT...');
                }).catch(() => {});
                window.open('https://chat.openai.com/', '_blank');
            });
        }
    }

    const randomPresets = [
        { branza: "Fotowoltaika i Energia Odnawialna", motyw: "Abstrakcyjne linie słoneczne, panele fotowoltaiczne i światłość", firma: "EcoVolt Global", kolory: "głęboki granat, turkusowy neon, błękit, biel", haslo: "Czysta energia dla przyszłości Twojego biznesu" },
        { branza: "Cyberbezpieczeństwo i AI", motyw: "Światłowodowe węzły sieci neuronowych i cyfrowe cząsteczki", firma: "AetherMind Tech", kolory: "ciemny fiolet, neonowa cyjan, elektryczna magenta", haslo: "Autonomiczne rozwiązania AI nowej ery" },
        { branza: "Architektura i Wnętrza Premium", motyw: "Subtelna mikro-geometria, tekstura kamienia i złote profile", firma: "Aura Living Design", kolory: "matowa czerń, antyczne złoto, miedź, ciepły szary", haslo: "Elegancja i harmonia w każdej przestrzeni" },
        { branza: "Robotyka Przemysłowa i Automatyka", motyw: "Precyzyjne przekładnie, robotyczne ramiona i schematy cyfrowe", firma: "RoboSync Industrial", kolory: "antracyt, przemysłowy pomarańcz, srebrny metal", haslo: "Niezawodna automatyzacja i maksymalna wydajność" },
        { branza: "Ekologiczna Kawa Artisanal", motyw: "Subtelne rysunki ziaren kawy, liści i organiczne tekstury", firma: "BeanCraft Organics", kolory: "ciepła czekolada, palona ochra, matowy beż", haslo: "Prawdziwy smak natury w każdej filiżance" },
        { branza: "Medycyna Nowoczesna i Biotechnologia", motyw: "Helix DNA, molekularne struktury i kryształowe cząstki", firma: "BioGenix Pharma", kolory: "sterylny błękit, szmaragdowa zielona, biel", haslo: "Innowacje dla zdrowia i życia" },
        { branza: "Lotnictwo i Kosmonautyka", motyw: "Dynamiczne linie aerodynamiki, konstelacje i orbita", firma: "AeroSpace Dynamics", kolory: "nocny granat, kosmiczne srebro, jaskrawy błękit", haslo: "Przekraczamy granice ziemskiej grawitacji" },
        { branza: "E-Mobility i Pojazdy Elektryczne", motyw: "Strumienie energii, dynamiczne wyładowania i wektorowe samochody", firma: "PulseMotion Drive", kolory: "neonowa zielona, głęboka czerń, tytanowa biel", haslo: "Napędzamy przyszłość czystej mobilności" },
        { branza: "Fintech i Bankowość Cyfrowa", motyw: "Złote wykresy wektorowe, bloki danych i geometryczna siatka", firma: "VaultFlow Capital", kolory: "szmaragdowy zielony, matowa czerń, złoty neon", haslo: "Inteligentne finanse bez granic" },
        { branza: "Gaming i E-sport High-End", motyw: "Futurystyczne geometryczne pancerze i ostry cyber-rytm", firma: "Vortex Gaming Gear", kolory: "głęboka czerń, kwasowy zielony, mroźna biel", haslo: "Maksymalna precyzja w każdej rozgrywce" },
        { branza: "Automatyka Domowa i Smart Home", motyw: "Połączone czujniki IoT, faliste linie sygnału i ikony smart", firma: "Homix Smart Systems", kolory: "biel, błękit nieba, ciepłe drewniane akcenty", haslo: "Twój dom myślący razem z Tobą" },
        { branza: "Przemysł Stoczniowy i Jachtowy", motyw: "Eleganckie linie kadłubów, fali i stalowa mikro-struktura", firma: "Oceanic Marine Craft", kolory: "ciemny marynarski granat, biel, srebny grafit", haslo: "Luksus na falach światowych oceanów" },
        { branza: "Ochrona Środowiska i Recykling", motyw: "Organiczny zielony liść połączony z cykliczną pętlą Mobiusa", firma: "ReTerra Solutions", kolory: "soczysta zielona, ziemski brąz, biel", haslo: "Drugie życie surowców dla planety" },
        { branza: "Technologia Wodoru i Ogniw Paliwowych", motyw: "Cząsteczki H2, czysta para wodna i energetyczny błękit", firma: "HydroPulse Energy", kolory: "krystaliczny błękit, cyjan, bielszy od bieli", haslo: "Czysty wodór – bezemisyjny napęd przemysłu" },
        { branza: "Nanotechnologia i Nowe Materiały", motyw: "Struktury grafenowe, heksagonalna siatka atomowa", firma: "NanoStructure Tech", kolory: "grafitowy metal, neonowy turkus, platyna", haslo: "Potęga inżynierii w skali nano" },
        { branza: "Optyka i Technika Laserowa", motyw: "Precyzyjne promienie laserowe, pryzmaty i załamania światła", firma: "OptiBeam Systems", kolory: "rubinowy czerwony neon, czerń, głęboki fiolet", haslo: "Światło skrojone na miarę przemysłu" },
        { branza: "Logistyka Przemysłowa i Supply Chain", motyw: "Strumienie tras, geometryczne kontenery i globalny glob", firma: "GlobalCargo Express", kolory: "ciemnobłękitny, przemysłowy żółty, grafit", haslo: "Zawsze na czas na całym świecie" },
        { branza: "Górnictwo Odkrywkowe i Przetwórstwo Surowców", motyw: "Krystaliczne sekcje minerałów, wektorowa geologia", firma: "MineralCore Resources", kolory: "głęboki ugier, bazaltowa czerń, miedź", haslo: "Surowce niezbędne dla nowoczesnej gospodarki" },
        { branza: "Drony i Systemy Autonomiczne UAV", motyw: "Siatka skanowania terenu LIDAR i wektorowe drony", firma: "AeroScan Drones", kolory: "matowy popielaty, ogniście pomarańczowy, czerń", haslo: "Precyzyjna perspektywa z powietrza" },
        { branza: "Medycyna Estetyczna i Cosmeceuticals", motyw: "Jedwabiste fale, złote kropelki eliksiru i płatki róż", firma: "AuraDerm Clinical", kolory: "pudrowy róż, różowe złoto, czysta biel", haslo: "Naturalne piękno poparte nauką" },
        { branza: "Przemysł Winiarski i Enologia", motyw: "Wektorowe kiście winogron, dębowe faktury i grawerowane linie", firma: "Château Vintners", kolory: "głęboki burgund, zgaszone złoto, oliwkowa zieleń", haslo: "Tradycja i pasja w każdym roczniku" },
        { branza: "Technologia Druku 3D i Additive Manufacturing", motyw: "Warstwowe nakładanie polimerów i geometryczny sześcian", firma: "LayerCraft 3D", kolory: "ciemna purpura, limonkowy neon, szarość", haslo: "Od cyfrowego projektu do fizycznego detalu" },
        { branza: "Telekomunikacja 5G / 6G i Infrastruktura", motyw: "Falowe przesyły danych, maszty antenowe i cyfrowa siatka", firma: "TelcoGrid Global", kolory: "kobaltowy błękit, jaskrawy cyjan, czerń", haslo: "Łączność z prędkością światła" },
        { branza: "Przemysł Papierniczy i Opakowania Eco", motyw: "Faktura tektury falistej, liść ekologiczny i zgięcia materiału", firma: "EcoPack Box", kolory: "naturalny kraft, leśna zieleń, ciepły beż", haslo: "Zrównoważone opakowania dla nowoczesnego handlu" },
        { branza: "Klimatyzacja, Wentylacja i HVAC", motyw: "Strumienie ciepłego i zimnego powietrza, niewidzialny przepływ", firma: "AeroClimate Systems", kolory: "lodowaty błękit, słoneczny pomarańcz, biel", haslo: "Idealny klimat w każdym budynku" },
        { branza: "Maszyny Budowlane i Ciężki Sprzęt", motyw: "Mocarne zęby łyżki koparki, bieżnik opon i stal", firma: "TitanEquip Heavy", kolory: "żółty maszynowy, matowy czarny, grafit", haslo: "Niezłomna moc na placu budowy" },
        { branza: "Rzemieślniczy Browarnictwo (Craft Beer)", motyw: "Szyszki chmielu, kłosy jęczmienia i tradycyjne liternictwo", firma: "Hops & Malt Brewery", kolory: "bursztynowy, głęboka czerń, stare złoto", haslo: "Warzone z tradycją i charakteryzacja" },
        { branza: "Przemysł Skórzany i Galanteria Luxury", motyw: "Precyzyjne przeszycia krawieckie, faktura skóry grain", firma: "LuxeLeather Atelier", kolory: "koniakowy brąz, ciemna czekolada, złoto", haslo: "Kunszt rzemiosła i nieprzemijający styl" },
        { branza: "Systemy Bezpieczeństwa i Kontrola Dostępu", motyw: "Skaner linii papilarnych, osłona tarczowa i klucz cyfrowy", firma: "SecureGuard Systems", kolory: "stalowy niebieski, ogniście czerwony akcent, czerń", haslo: "Pełna ochrona Twoich zasobów" },
        { branza: "Medycyna Weterynaryjna i Diagnostic", motyw: "Zarys łapy połączony z pulsem serca i czystą formą", firma: "VetCare Diagnostics", kolory: "turkusowa zieleń, biel, błękit", haslo: "Zdrowie i troska o małych pacjentów" },
        { branza: "Technika Hydrauliczna i Pneumatyka", motyw: "Cylindry tłokowe, podwojony przepływ oleju i zawory", firma: "HydroFluid Power", kolory: "ciemno-niebieski, czerwone zawory, stal", haslo: "Precyzyjne sterowanie siłą płynów" },
        { branza: "Przemysł Szkła Architektonicznego", motyw: "Geometryczne załamania światła na szklanych taflach", firma: "VitroGlaz Facades", kolory: "szklana zielonkawa biel, matowy czarny profil", haslo: "Przejrzystość i nowoczesność architektury" },
        { branza: "Ochrona Przeciwpożarowa i Sprinkler Systems", motyw: "Płomień i tarcza wodna w abstrakcyjnym geście", firma: "FireShield Safety", kolory: "czerwony signal, czarny grafit, biel", haslo: "Bezpieczeństwo pożarowe bez kompromisów" },
        { branza: "Technologia Mleczarska i Przetwórstwo Mleka", motyw: "Kropla mleka rozbryzgująca się w koronę, fala czystości", firma: "PureLactis Dairy", kolory: "mleczna biel, niebieski pastel, zieleń", haslo: "Niezmienna świeżość z polskich łąk" },
        { branza: "Edukacja Cyfrowa i EdTech", motyw: "Otwarta księga przekształcająca się w cyfrowe kropki", firma: "EduSpark Learning", kolory: "szafirowy, ciepły żółty, błękit", haslo: "Wiedza dostępna na wyciągnięcie ręki" },
        { branza: "Oświetlenie LED i Illuminations", motyw: "Rozproszone widmo światła, mikro-diody i aureola", firma: "LuminaLED Systems", kolory: "głęboka czerń, złoty neon, krystaliczna biel", haslo: "Kreujemy nastrój światłem" },
        { branza: "Chemia Przemysłowa i Polimery", motyw: "Reakcje probówkowe, kolumny destylacyjne i powłoki", firma: "ChemTech Polymers", kolory: "fioletowy neon, cyjan, grafit", haslo: "Zaawansowana chemia dla przemysłu" },
        { branza: "Przemysł Meblarski i Design", motyw: "Czyste gięte linie sklejki, gięcia materiału i forma", firma: "FormaWood Design", kolory: "naturalny dąb, antracyt, matowy beż", haslo: "Ergonomia połączona z unikalną formą" },
        { branza: "Technologia Odmaślania i Czyszczenia Przemysłowego", motyw: "Bąbelki ultradźwiękowe i błyszcząca czysta powierzchnia", firma: "UltraClean Systems", kolory: "krystaliczna błękitna, srebro, biel", haslo: "Perfekcyjna czystość detali przemysłowych" },
        { branza: "Sporty Zimowe i Sprzęt Narciarski", motyw: "Dynamiczne ślady krawędzi nart na śniegu, kryształy lodu", firma: "AlpinePro Ski", kolory: "śnieżna biel, błękit lodowca, energetyczna czerwień", haslo: "Pasja do prędkości na ośnieżonych stokach" },
        { branza: "Fotografia Przemysłowa i Film", motyw: "Przysłona obiektywu, kadrowanie i taśma filmowa", firma: "CineVision Media", kolory: "matowa czerń, ciepłe światło 3200K, złoto", haslo: "Uchwycić to, co najważniejsze" },
        { branza: "Przetwórstwo Rybne i Aquaculture", motyw: "Fale morskie, łuski rybie i czysta morska woda", firma: "NordicFish Harvest", kolory: "granat arktyczny, srebrny, błękit", haslo: "Najwyższa jakość z zimnych wód północy" },
        { branza: "Technika Spawalnicza i Cięcie Plazmowe", motyw: "Iskry spawalnicze, łuk elektryczny i cięta stal", firma: "WeldMaster Pro", kolory: "ciemny szary, elektryczny niebieski, iskra pomarańczowa", haslo: "Trwałe łączenia odporne na próby czasu" },
        { branza: "Systemy Wyciszeń i Akustyka", motyw: "Fale dźwiękowe tłumione przez panele piramidkowe", firma: "AcousticSilent Wall", kolory: "antracyt, zgaszona czerwień, szarość", haslo: "Cisza i idealny dźwięk w Twoim biurze" },
        { branza: "Przemysł Zegarmistrzowski Luxury", motyw: "Tryby mechanizmu tourbillon i grawerowane tarcze", firma: "ChronoPrecision Horology", kolory: "głęboki błękit nocy, różowe złoto, srebro", haslo: "Mistrzowska precyzja mierzenia czasu" },
        { branza: "Gospodarka Wodna i Hydrologia", motyw: "Kropla spadająca na lustro wody, rozchodzące się okręgi", firma: "AquaAqua Water Tech", kolory: "głęboka turkusowa, cyjan, biel", haslo: "Czysta woda dla przyszłych pokoleń" },
        { branza: "Technologia Geodezyjna i GIS", motyw: "Siatka warstwicowa terenu, punkty pomiarowe i wektory", firma: "GeoGeo Mapping", kolory: "zieleń wojskowa, pomarańcz odblaskowy, czerń", haslo: "Precyzyjny wymiar każdej przestrzeni" },
        { branza: "Biżuteria Rzemieślnicza i Kamienie Szlachetne", motyw: "Szlif diamentowy, załamania światła na krawędziach", firma: "GemsGems Fine Jewelry", kolory: "szmaragdowy, złoto, diamentowa biel", haslo: "Niepowtarzalne piękno zaklęte w kamieniu" },
        { branza: "Przemysł Tytoniowy i Cigar Culture", motyw: "Liście tytoniu, aromatyczny dym i faktura drewna cedar", firma: "HabanaCigar Select", kolory: "ciemny mahoń, stary złocisty, złamana biel", haslo: "Tradycja i unikalny aromat chwik relaksu" },
        { branza: "Technologia Chłodnictwa Przemysłowego", motyw: "Kryształki szronu, parownik chłodniczy i lód", firma: "FrostTech Cooling", kolory: "lodowaty niebieski, cyjan, biel", haslo: "Stabilna niska temperatura dla Twoich produktów" },
        { branza: "Zabawki Edukacyjne i Kreatywne", motyw: "Geometryczne klocki, kolorowe zębatki i uśmiech", firma: "JoyToys Creative", kolory: "czerwony, żółty, niebieski, zielony", haslo: "Radość tworzenia i rozwój przez zabawę" },
        { branza: "Przemysł Drobiarski i Hodowla", motyw: "Zarys skrzydła, naturalne ziarno i wiejski krajobraz", firma: "AgroPoultry Eco", kolory: "słoneczny żółty, zielony, biel", haslo: "Zdrowy chów i najwyższa jakość mięsa" },
        { branza: "Instrumenty Muzyczne i Pro Audio", motyw: "Struny gitary, klawisze fortepianu i korektor graficzny", firma: "SoundHarmony Music", kolory: "czarny fortepianowy, drewno palisander, mosiądz", haslo: "Twórz muzykę z doskonałym brzmieniem" },
        { branza: "Technologia Próżniowa i Pomp Próżniowych", motyw: "Symbole ciśnienia podrzędnego, przepływ gazów", firma: "VacuTech Vacuum", kolory: "srebrzysty grafit, błękit przemysłowy", haslo: "Czysta próżnia dla procesów wysokie technologii" },
        { branza: "Przemysł Piekarniczy i Cukierniczy", motyw: "Kłosy pszenicy, zawijasy kremu i wałek do ciasta", firma: "BakeArt Bakery", kolory: "ciepły złocisty chleb, kremowy, czekoladowy", haslo: "Zapach świeżego pieczywa każdego dnia" },
        { branza: "Turystyka Górska i Outdoor", motyw: "Ostre kontury szczytów górskich i ścieżka trekkingowa", firma: "SummitPeak Outdoor", kolory: "granat górski, pomarańczowy trekingowy, leśna zieleń", haslo: "Odkrywaj nieprzetarte szlaki" },
        { branza: "Systemy Transportu Wewnętrznego i Przenośniki", motyw: "Rolki przenośnikowe, taśmociąg i paczki w ruchu", firma: "ConveyorTech Solutions", kolory: "żółty ostrzegawczy, ciemny szary, niebieski", haslo: "Płynny przepływ materiałów w zakładzie" },
        { branza: "Przemysł Opt elektroniczny i Wyświetlacze OLED", motyw: "Piksele RGB, elastyczne ekrany i jasność", firma: "OLEDTech Displays", kolory: "głęboka czerń OLED, jaskrawa czerwień, zielony, niebieski", haslo: "Nieskończony kontrast i żywe kolory" },
        { branza: "Technologia Szyb i Szyb samochodowych", motyw: "Krople deszczu staczające się po szybie hydrofobowej", firma: "AutoGlass Vision", kolory: "przezroczysty błękit, czerń, biel", haslo: "Idealna widoczność na każdej drodze" },
        { branza: "Przemysł Owocowo-Warzywny (Fresh Produce)", motyw: "Świeże przekrojone cytrusy, krople rosy i kosz zbiorów", firma: "FreshHarvest Market", kolory: "pomarańczowy, soczysta zieleń, czerwień", haslo: "Witaminy prosto z natury" },
        { branza: "Rozwiązania HR i Recruiting", motyw: "Połączone sylwetki ludzi, most i geometryczne puzzle", firma: "TalentBridge HR", kolory: "granat korporacyjny, ciepły żółty akcent", haslo: "Łączymy wartościowych ludzi z firmami" },
        { branza: "Przemysł Przędzalniczy i Przędza", motyw: "Nici szpulowe tworzące wzór tkaniny, watek i osnowa", firma: "SpinningYarn Mills", kolory: "biel lnu, pastelowy błękit, zieleń", haslo: "Trwała przędza dla przemysłu tekstylnego" },
        { branza: "Systemy Parkingowe i Smart Parking", motyw: "Zarys samochodu wjeżdżającego na szlaban z czujnikiem Green", firma: "ParkSmart Mobility", kolory: "ciemno-szary asfalt, neonowy zielony P, biel", haslo: "Parkowanie szybkie i bezstresowe" },
        { branza: "Przemysł Garbarski i Obróbka Skór", motyw: "Faktura zamszu i miękkiej skóry nappa, nożyce garbarskie", firma: "TanneryMaster Craft", kolory: "rudy koniak, czekoladowy, beż", haslo: "Najwyższa miękkość i trwałość naturalnej skóry" },
        { branza: "Technologia Rolet i Żaluzji", motyw: "Lamele żaluzji przepuszczające promienie słoneczne", firma: "ShadeStyle Blinds", kolory: "antracyt, biel, matowe srebro", haslo: "Kontrola światła i prywatności w Twoim domu" },
        { branza: "Przemysł Mięsny i Wędliniarski", motyw: "Zioła, ziarna pieprzu i tradycyjne wędzarnicze dymy", firma: "MeatCraft Smokehouse", kolory: "głęboka czerwień bordo, drewno, biel", haslo: "Smak prawdziwych tradycyjnych wyrobów" },
        { branza: "Systemy Pomiarowe i Metrologia", motyw: "Mikrometr, suwmiarka cyfrowa i punkt zerowy", firma: "MetroMeasure Precision", kolory: "stalowy niebieski, czarny, żółty laser", haslo: "Dokładność co do ułamka mikrona" },
        { branza: "Przemysł Nawozowy i Agrochemia", motyw: "Granulki nawozu wchodzące w glebę i rosnący pęd", firma: "AgroNutri Crop", kolory: "bujna zieleń, brąz glebowy, złoty wiecha", haslo: "Obfite plony dzięki mądremu nawożeniu" },
        { branza: "Technologia Podłóg Podniesionych i Biurowych", motyw: "Modułowe płyty podłogowe z trasami kablowymi pod spodem", firma: "FloorTech Access", kolory: "szary beton, srebro aluminiowe, czerń", haslo: "Elastyczna przestrzeń dla nowoczesnych biur" },
        { branza: "Przemysł Płyt Meblech i MDF", motyw: "Struktura wiórów drewnianych, laminat wysokociśnieniowy HPL", firma: "BoardPanel Craft", kolory: "ciepły orzech, beż laminatu, szarość", haslo: "Solidna baza dla każdego mebla" },
        { branza: "Systemy Czyszczenia Kominów i Wentylacji", motyw: "Szczotka kominiarska i czysty ciąg powietrza", firma: "ChimneyClean Pro", kolory: "sadzowa czerń, miedź, biel", haslo: "Czyste kominy i bezpieczny dom" },
        { branza: "Przemysł Kosmetyków Kolorowych (Make-up)", motyw: "Rozsypany puder, smuga pomadki i pędzel w ruchu", firma: "GlamourMakeArt", kolory: "głęboka czerń, koralowy róż, złoto", haslo: "Podkreśl swoje unikalne piękno" },
        { branza: "Technologia Wózków Widłowych", motyw: "Widły maszyny unoszące paletę, stabilność i udźwig", firma: "ForkliftLift Heavy", kolory: "pomarańczowy, czerń, grafitowy", haslo: "Niezawodne podnoszenie w ciężkich warunkach" },
        { branza: "Przemysł Herbaciarski i Napary", motyw: "Liść herbaty zaparzający się w wodzie, parujące aromaty", firma: "TeaLeaf Infusions", kolory: "szmaragdowa zieleń, bursztynowy, złoto", haslo: "Chwila wyciszenia z filiżanką jakości" },
        { branza: "Systemy Izolacji Termicznej (EPS / Wełna)", motyw: "Struktura wełny mineralnej zatrzymująca ciepło", firma: "ThermoIsol Insulation", kolory: "żółty insulation, szary, zieleń eco", haslo: "Ciepło pozostające w Twoim domu" },
        { branza: "Przemysł Guzików i Dodatków Krawieckich", motyw: "Mozaika guzików, igła z nitką i suwaki", firma: "ButtonCraft Style", kolory: "wielokolorowa paleta, czerń, srebro", haslo: "Detale tworzące idealną całość odzieży" },
        { branza: "Technologia Gazów Technicznych", motyw: "Butla gazowa, cząsteczki azotu i argonu pod ciśnieniem", firma: "TechGas Industrial", kolory: "ciemno-niebieski, szary, czerwień", haslo: "Czyste gazy dla procesów spawalniczych i cięcia" },
        { branza: "Przemysł Zabawek Drewnianych Eco", motyw: "Gładko oszlifowane klocki drewniane, uśmiechnięte zwierzątka", firma: "WoodyJoy Toys", kolory: "jasne drewno dębowe, zgaszona zieleń, czerwień", haslo: "Naturalne i bezpieczne zabawki dla najmłodszych" },
        { branza: "Technologia Taśm Samoprzylepnych", motyw: "Rolka taśmy odwijająca się, warstwa kleju silikonowego", firma: "TapeMaster Adhesive", kolory: "niebieski, żółty, przeźroczysty", haslo: "Mocne łączenie w każdych warunkach" },
        { branza: "Przemysł Karm dla Zwierząt (Pet Food)", motyw: "Granulki karmy w kształcie serc i kości, sylwetka psa i kota", firma: "PetNutri Select", kolory: "ciepły brąz, zielony trawiasty, pomarańcz", haslo: "Smaczne i zdrowe żywienie Twojego pupila" },
        { branza: "Systemy Osuszania Powietrza i Budynków", motyw: "Kropla wody wyciągana z wilgotnego powietrza w filtr", firma: "DryAir Systems", kolory: "niebieski morski, szary, biel", haslo: "Skuteczne osuszanie po zalaniach i na budowach" },
        { branza: "Przemysł Guzików i Zapięć Zipper", motyw: "Ząbki zamka błyskawicznego zazębiające się płynnie", firma: "ZipperFast Accessories", kolory: "srebrny chwyt, czarna taśma, mosiądz", haslo: "Niezawodne zapięcia dla branży odzieżowej" },
        { branza: "Technologia Basenowa i SPA", motyw: "Turkusowa woda w basenie z bąbelkami gejzera SPA", firma: "AquaPool Spa", kolory: "błękit basenowy, cyjan, bielszy od bieli", haslo: "Relaks i czysta woda w Twoim ogrodzie" },
        { branza: "Przemysł Kołder i Materacy (Bedding)", motyw: "Puchowe pióra, sprężyny kieszeniowe i miekki splot", firma: "DreamSleep Comfort", kolory: "pastelowy niebieski, biały puszysty, złoto", haslo: "Zdrowy i spokojny sen każdej nocy" },
        { branza: "Technologia Etykietowania i Kody Kreskowe", motyw: "Kod QR, kod kreskowy i etykieta samoprzylepna w druku", firma: "LabelCode Print", kolory: "czerń kodu, biel etykiety, czerwień lasera", haslo: "Precyzyjna identyfikacja produktów w łańcuchu" },
        { branza: "Przemysł Pędzelny i Narzędzi Malarskich", motyw: "Włosie pędzla malarskiego pozostawiające świeżą smugę farby", firma: "BrushMaster Paint", kolory: "drewniany trzonek, niebieski, pomarańczowy", haslo: "Perfekcyjne krycie i czyste krawędzie" },
        { branza: "Technologia Przesiewaczy i Sit Przemysłowych", motyw: "Siatka sita oczkowego separująca granulaty", firma: "SieveScreen Tech", kolory: "stal nierdzewna, ciemny grafit, żółty", haslo: "Dokładna klasyfikacja frakcji materiałowych" },
        { branza: "Przemysł Słodyczy i Czekolady", motyw: "Płynna czekolada spływająca na orzechy, kostka czekolady", firma: "ChocoLuxe Chocolatier", kolory: "głęboki brąz kakao, złoty, kremowy", haslo: "Aksamitna słodycz w najwyższej formie" },
        { branza: "Systemy Czyszczenia Suchym Lodem", motyw: "Granulki CO2 uderzające w zabrudzenie i parujące", firma: "DryIce Clean", kolory: "mroźna biel, ciemny niebieski, szarość", haslo: "Czyszczenie bezużycia wody i chemii" },
        { branza: "Przemysł Namiotów Halowych i Membran", motyw: "Naciągnięta biała membrana strukturalna hal namiotowych", firma: "CoverTent Structures", kolory: "śnieżnobiały, granat, metalik", haslo: "Szybka przestrzeń magazynowa i eventowa" },
        { branza: "Technologia Smarów i Olejów Silnikowych", motyw: "Kropla złocistego oleju zmniejszająca tarcie kół zębatych", firma: "LubricOil Extreme", kolory: "złoty olejowy, czarny, czerwony neon", haslo: "Maksymalna ochrona silnika w skrajnych temperaturach" },
        { branza: "Przemysł Sitodruku i Tekstyliów", motyw: "Siatka sitodrukowa, rakla malarska i wielokolorowy druk", firma: "SilkScreen Print", kolory: "cyjan, magenta, żółty, czarny", haslo: "Trwały i żywy nadruk na każdej tkaninie" },
        { branza: "Systemy Sygnalizacji Kolejowej", motyw: "Semafory kolejowe z zielonym światłem, tory w wektorze", firma: "RailSignal Tech", kolory: "ciemny szary, zielony signal, czerwony", haslo: "Bezpieczny ruch na szlakach kolejowych" },
        { branza: "Przemysł Grzejnikowy i Radiators", motyw: "Nowoczesne pionowe panele grzewcze, falowanie ciepła", firma: "WarmHeat Radiators", kolory: "matowy czarny, miedź, czysta biel", haslo: "Nowoczesny design i wydajne ciepło" },
        { branza: "Technologia Rusztowań i Desdeskowań", motyw: "Konstrukcja rur rusztowaniowych ze złączami stalowymi", firma: "ScaffoldBuild Systems", kolory: "srebrna ocynkowana stal, niebieski, żółty", haslo: "Bezpieczna praca na każdej wysokości" },
        { branza: "Przemysł Ekstrudowania Polimerów", motyw: "Profil z tworzywa wychodzący z ustnika ekstrudera", firma: "ExtruPoly Profiles", kolory: "niebieski przemysłowy, szary, szmaragd", haslo: "Precyzyjne profile z tworzyw sztucznych" },
        { branza: "Systemy Nawadniania Ogrodniczego", motyw: "Zraszalnik wynurzalny rozpylający mgiełkę wodną na trawnik", firma: "IrrigoGarden Systems", kolory: "trawiasta zieleń, błękit nieba, biel", haslo: "Soczysta zieleń w Twoim ogrodzie bez wysiłku" },
        { branza: "Przemysł Pasów Transmisyjnych i Klinowych", motyw: "Zębaty pas klinowy opasujący koła pasowe w ruchu", firma: "BeltDrive Transmission", kolory: "czarny kauczuk, czerwony napis, stal", haslo: "Niezawodne przekazywanie momentu obrotowego" },
        { branza: "Technologia Komór Klimatycznych i Szokowych", motyw: "Komora z cyfrowym wyświetlaczem temperatury -40C do +100C", firma: "ChamberTest Labs", kolory: "biel laboratoryjna, niebieski, czerwony", haslo: "Badań symulacyjne w ekstremalnych warunkach" },
        { branza: "Przemysł Odzieży Roboczej i BHP", motyw: "Wzmocnienia z Cordury, taśmy odblaskowe 3M na kurtce", firma: "WorkWear Safety", kolory: "żółty ostrzegawczy hi-vis, granat, grafit", haslo: "Wygoda i maksymalna ochrona w pracy" }
    ];

    window.randomizeAllFields = function () {
        const preset = randomPresets[Math.floor(Math.random() * randomPresets.length)];
        if (document.getElementById('pg-branza')) document.getElementById('pg-branza').value = preset.branza;
        if (document.getElementById('pg-motyw')) document.getElementById('pg-motyw').value = preset.motyw;
        if (document.getElementById('pg-firma')) document.getElementById('pg-firma').value = preset.firma;
        
        const lockColors = document.getElementById('pg-lock-colors')?.checked;
        if (!lockColors && document.getElementById('pg-kolory')) {
            document.getElementById('pg-kolory').value = preset.kolory;
        }
        
        if (document.getElementById('pg-haslo')) document.getElementById('pg-haslo').value = preset.haslo;
        window.buildPromptEngine();
    };

    window.randomizeSingleField = function (fieldKey) {
        if (fieldKey === 'kolory' && document.getElementById('pg-lock-colors')?.checked) {
            alert('Kolory są zablokowane! Odznacz "Zablokuj", aby je wylosować.');
            return;
        }
        const preset = randomPresets[Math.floor(Math.random() * randomPresets.length)];
        const inputMap = {
            branza: 'pg-branza',
            motyw: 'pg-motyw',
            firma: 'pg-firma',
            kolory: 'pg-kolory',
            haslo: 'pg-haslo'
        };
        const elId = inputMap[fieldKey];
        if (elId && document.getElementById(elId)) {
            document.getElementById(elId).value = preset[fieldKey];
            window.buildPromptEngine();
        }
    };

    window.selectAiModel = function (model) {
        window.promptSelections.aiModel = model;
        document.querySelectorAll('.pg-aimodel-btn').forEach(btn => {
            if (btn.getAttribute('data-model') === model) {
                btn.style.background = '#00d2ff';
                btn.style.color = '#000';
            } else {
                btn.style.background = '#1a1a1a';
                btn.style.color = '#aaa';
            }
        });
        window.buildPromptEngine();
    };

    const colorPalettes = [
        "głęboki granat, turkusowy neon, błękit, biel",
        "matowa czerń, antyczne złoto, miedź, ciepły szary",
        "szmaragdowy zielony, matowa czerń, złoty neon",
        "ciemny fiolet, neonowa cyjan, elektryczna magenta",
        "ciemny burgund, zgaszone złoto, oliwkowa zieleń",
        "antracyt, przemysłowy pomarańcz, srebrny metal",
        "koniakowy brąz, ciemna czekolada, złoto",
        "mleczna biel, niebieski pastel, zieleń",
        "lodowaty błękit, słoneczny pomarańcz, biel",
        "pudrowy róż, różowe złoto, czysta biel",
        "nocny granat, kosmiczne srebro, jaskrawy błękit",
        "neonowa zielona, głęboka czerń, tytanowa biel",
        "szmaragdowy, złoto, diamentowa biel",
        "cyjan, magenta, żółty, czarny",
        "czarny fortepianowy, drewno palisander, mosiądz"
    ];

    window.randomizeColorPalette = function () {
        if (document.getElementById('pg-lock-colors')?.checked) {
            alert('Kolory są zablokowane! Odznacz "Zablokuj", aby je wylosować.');
            return;
        }
        const pal = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        if (document.getElementById('pg-kolory')) {
            document.getElementById('pg-kolory').value = pal;
            window.buildPromptEngine();
        }
    };
})();
