 function addItemToBom(name, qty, unitPrice, counts) {
 if (!counts[name]) counts[name] = { qty: 0, total: 0, unitPrice: unitPrice || 0 };
 counts[name].qty += qty;
 counts[name].total += (qty * (unitPrice || 0));
 }

 function removePolishAccents(str) {
 const map = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z' };
 return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, match => map[match]);
 }

 function generateKasetonBOM() {
 const config = window.currentKasetonConfig;
 if (!config) return;

 const W = parseFloat(config.width) || 120;
 const H = parseFloat(config.depth) || 200;
 const sys = config.system || 'LMD';
 const isLedSys = ['LMD', 'LMS', 'CTF_LED', 'LCD_LMD'].includes(sys);

 const bomItems = [];

 // 1. PROFIL - suma długości boków w metrach (nazwa zależna od systemu)
 const totalProfileMeters = (2 * W + 2 * H) / 100;
 const profileName = sys === 'LMS' ? 'Profil LMS' : 'Profil LMD odchudzony';
 bomItems.push({ name: profileName, qty: totalProfileMeters.toFixed(2), unit: 'mb' });

 // 2. NAROŻNIKI (nazwa zależna od systemu)
 const cornerName = sys === 'LMS' ? 'adFrame LMS narożnik wzmacniany' : 'adFrame LMD narożnik wzmacniany';
 bomItems.push({ name: cornerName, qty: 8, unit: 'szt' });

 // 3. LED STRIPS
 if (isLedSys) {
 const ledOption = config.light || 'power_long';
 const isPower = ledOption.startsWith('power');

 const nameMap = isPower ? {
 20: 'Oświetlenie AdframeLED POWER LED 20cm 9W ver2',
 24: 'Oświetlenie AdframeLED POWER LED 24cm 11W ver2',
 30: 'Oświetlenie AdframeLED POWER LED 30cm 13W ver2',
 50: 'Oświetlenie AdframeLED POWER LED 50cm 22W ver2'
 } : {
 20: 'Oświetlenie AdframeLED NORMAL LED 20cm 6,5W ver2',
 24: 'Oświetlenie AdframeLED NORMAL LED 24cm 8W ver2',
 30: 'Oświetlenie AdframeLED NORMAL LED 30cm 10W ver2',
 50: 'Oświetlenie AdframeLED NORMAL LED 50cm 16W ver2'
 };

 const drawBottom = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
 const drawTop = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
 const drawLeft = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));
 const drawRight = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));

 function bomSegments(profileLength, isHoriz) {
 let n = 1;
 if (isHoriz) {
 if (config.cut && config.cut.includes('half_w')) n = 2;
 else if (config.cut && config.cut.includes('3w')) n = 3;
 else if (config.cut && config.cut.includes('4w')) n = 4;
 else if (config.cut && config.cut.includes('5w')) n = 5;
 } else {
 if (config.cut && config.cut.includes('half_h')) n = 2;
 else if (config.cut && config.cut.includes('3h')) n = 3;
 else if (config.cut && config.cut.includes('4h')) n = 4;
 else if (config.cut && config.cut.includes('5h')) n = 5;
 }
 if (config.cut && config.cut.startsWith('auto')) { const ml = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200); if (profileLength > ml) n = Math.ceil(profileLength / ml); }
 const avail = profileLength - 10 - (n - 1) * 10;
 if (avail <= 0) return [];
 const segs = [];
 for (let i = 0; i < n; i++) segs.push(avail / n);
 return segs;
 }

 function bomLedCombo(maxLen) {
 const sizes = [50, 30, 24, 20];
 let best = [], bestSum = 0;
 function go(idx, combo, sum) {
 if (sum > maxLen) return;
 if (sum > bestSum || (sum === bestSum && combo.length < best.length)) {
 bestSum = sum; best = [...combo];
 }
 for (let i = idx; i < sizes.length; i++) {
 combo.push(sizes[i]);
 go(i, combo, sum + sizes[i]);
 combo.pop();
 }
 }
 go(0, [], 0);
 return best;
 }

 const ledCounts = { 20: 0, 24: 0, 30: 0, 50: 0 };
 function countProfile(profLen, isHoriz) {
 bomSegments(profLen, isHoriz).forEach(segLen => {
 bomLedCombo(segLen).forEach(size => { ledCounts[size]++; });
 });
 }
 if (drawBottom) countProfile(W, true);
 if (drawTop) countProfile(W, true);
 if (drawLeft) countProfile(H, false);
 if (drawRight) countProfile(H, false);

 [50, 30, 24, 20].forEach(size => {
 if (ledCounts[size] > 0) {
 bomItems.push({ name: nameMap[size], qty: ledCounts[size], unit: 'szt' });
 }
 });
 }

 // 4. POWER SUPPLY
 if (config.psuCombo && config.psuCombo.length > 0) {
 const psuCounts = {};
 config.psuCombo.forEach(p => { psuCounts[p] = (psuCounts[p] || 0) + 1; });
 for (let p in psuCounts) {
 bomItems.push({ name: p, qty: psuCounts[p], unit: 'szt' });
 }
 }

 // 5. SUPPORTY I ŁĄCZNIKI
 const numCutsW = config.numCutsW || 0;
 const numCutsH = config.numCutsH || 0;
 const suppLen = config.totalSupportLengthM || 0;

 if (suppLen > 0) {
 bomItems.push({ name: 'profil support light', qty: suppLen.toFixed(2), unit: 'mb' });
 }

 const zamki = (numCutsW * 2) + (numCutsH * 2);
 if (zamki > 0) {
 bomItems.push({ name: 'adFrame support zamek', qty: zamki, unit: 'szt' });
 }

 const crossConns = numCutsW * numCutsH;
 if (crossConns > 0) {
 bomItems.push({ name: 'adFrame support 180° łącznik', qty: crossConns * 2, unit: 'szt' });
 }

 const totalCuts = numCutsW + numCutsH;
 if (totalCuts > 0) {
 bomItems.push({ name: 'adFrame LMD łącznik 180° długi', qty: totalCuts * 2, unit: 'szt' });
 }

 if (config.usage === 'freestanding') {
 let numFeet = 2;
 if (numCutsW > 0) {
 numFeet += numCutsW;
 } else if (W >= 200) {
 numFeet += 1;
 }
 bomItems.push({ name: 'adFrame stopa LMD/LMS', qty: numFeet, unit: 'szt' });
 }

 // 6b. PODWIESZENIE
 if (config.usage === 'suspended' && config.numSuspensionSets > 0) {
 bomItems.push({ name: 'adFrame - zestaw do podwieszenia \u22122mm', qty: config.numSuspensionSets, unit: 'szt' });
 }

 // 6. WYDRUKI
 const printOption = config.print || (sys === 'LMS' ? 'backlit_white' : 'single');
 if (printOption !== 'no_print') {
 if (printOption === 'single') {
 // LMD default: front print + white blockout back
 bomItems.push({ name: `Wydruk adFrame LMD/LMS/LMSM ${W}x${H}`, qty: 1, unit: 'szt' });
 bomItems.push({ name: `Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU ${W}x${H}`, qty: 1, unit: 'szt' });
 } else if (printOption === 'double') {
 bomItems.push({ name: `Wydruk adFrame LMD/LMS/LMSM ${W}x${H}`, qty: 2, unit: 'szt' });
 } else if (printOption === 'front_blockout' || printOption === 'front_blockout_2') {
 bomItems.push({ name: `Wydruk adFrame LMD/LMS/LMSM ${W}x${H}`, qty: 1, unit: 'szt' });
 bomItems.push({ name: `Wydruk adFrame Blockout ${W}x${H}`, qty: 1, unit: 'szt' });
 } else if (printOption === 'back_blockout') {
 bomItems.push({ name: `Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU ${W}x${H}`, qty: 1, unit: 'szt' });
 } else if (printOption === 'backlit_white') {
 // LMS: front backlit + white back
 bomItems.push({ name: `Wydruk adFrame LMD/LMS/LMSM ${W}x${H}`, qty: 1, unit: 'szt' });
 bomItems.push({ name: `Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU ${W}x${H}`, qty: 1, unit: 'szt' });
 } else if (printOption === 'backlit_blockout') {
 // LMS: front backlit + color blockout back
 bomItems.push({ name: `Wydruk adFrame LMD/LMS/LMSM ${W}x${H}`, qty: 1, unit: 'szt' });
 bomItems.push({ name: `Wydruk adFrame Blockout ${W}x${H}`, qty: 1, unit: 'szt' });
 } else if (printOption === 'back_white') {
 // LMS: only white back
 bomItems.push({ name: `Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU ${W}x${H}`, qty: 1, unit: 'szt' });
 }
 }

 // ==================== NEW LOGIC & DATABASE INTEGRATION ====================

 // 7. NEW ALWAYS-ON ITEMS
 bomItems.push({ name: 'adFrame imbus 2,5mm', qty: 1, unit: 'szt' });
 bomItems.push({ name: 'adFrame imbus 4mm', qty: 1, unit: 'szt' });

 // 8. DYNAMIC CARTON & FOAM LOGIC
 let maxSegmentLen = Math.max(W / (numCutsW + 1), H / (numCutsH + 1));
 let isSplit = false;
 if (maxSegmentLen > 200) {
 maxSegmentLen = maxSegmentLen / 2;
 isSplit = true;
 }

 const requiredCartonLength = maxSegmentLen + 10;
 let cartonName = 'Karton LMD/LMS/DTF - 210x16x33cm'; // Default fallback
 if (requiredCartonLength <= 110) {
 cartonName = 'Karton LMD/LMS - 110x16x33cm';
 } else if (requiredCartonLength <= 135) {
 cartonName = 'Karton LMD/LMS - 135x16x33cm';
 } else if (requiredCartonLength <= 160) {
 cartonName = 'Karton LMD/LMS - 160x16x33cm';
 } else if (requiredCartonLength <= 210) {
 cartonName = 'Karton LMD/LMS/DTF - 210x16x33cm';
 }

 const totalPieces = 2 * (numCutsW + 1) + 2 * (numCutsH + 1);
 let baseCartons = 1;
 if (totalCuts > 4) {
 baseCartons = Math.ceil(totalPieces / 8);
 }

 const finalCartonQty = isSplit ? baseCartons * 2 : baseCartons;
 const foamQty = finalCartonQty * 4;

 bomItems.push({ name: cartonName, qty: finalCartonQty, unit: 'szt' });
 bomItems.push({ name: 'adFrame LMD pianka ochronna', qty: foamQty, unit: 'szt' });

 // Save carton info to config for Spakuj/Rozpakuj feature
 config.cartonName = cartonName;
 config.cartonQty = finalCartonQty;

 // Integrate manual items to BOM
 if (typeof manualItems !== 'undefined') {
     for (let key in manualItems) {
         let item = manualItems[key];
         if (item && typeof item === 'object' && item.qty > 0) {
             bomItems.push({
                 name: item.name,
                 qty: item.qty,
                 unit: 'szt',
                 intranetId: item.intranetId,
                 isManual: true,
                 plnMargin: item.plnMargin,
                 multiplier: item.multiplier || 2.8,
                 plnPrice: item.plnMargin * (item.multiplier || 2.8)
             });
         } else if (item && typeof item === 'number' && item > 0 && typeof DB !== 'undefined' && DB[key]) {
             bomItems.push({
                 name: DB[key].name,
                 qty: item,
                 unit: 'szt',
                 isManual: true,
                 plnPrice: DB[key].price * (window.KURS_PLN_DYNAMIC || 4.20),
                 plnMargin: (DB[key].price * (window.KURS_PLN_DYNAMIC || 4.20)) / 2.8
             });
         }
     }
 }

 finishKasetonBOM(bomItems, W, H, sys, config);
}

// 9. DATABASE & CURRENCY LOGIC
const KASETON_PRICES = {

  // --- Kategoria: adfloor ---
  "adFloor": { plnPrice: 1858.584, plnMargin: 663.78, intranetId: 15376, category: "adfloor" },

  // --- Kategoria: adfloor akcesoria ---
  "adFloor maskownica narożna lewa": { plnPrice: 254.66, plnMargin: 90.95, intranetId: 16154, category: "adfloor akcesoria" },
  "adFloor maskownica narożna prawa": { plnPrice: 254.66, plnMargin: 90.95, intranetId: 16155, category: "adfloor akcesoria" },
  "adFloor Oświetelenie LED RGB": { plnPrice: 1762.684, plnMargin: 629.53, intranetId: 15440, category: "adfloor akcesoria" },
  "adFloor profil panelowy": { plnPrice: 72.996, plnMargin: 26.07, intranetId: 15377, category: "adfloor akcesoria" },
  "adFloor profil wzmocnienie": { plnPrice: 80.864, plnMargin: 28.88, intranetId: 15378, category: "adfloor akcesoria" },
  "adFloor płyta 997x997mm, grubość 12mm": { plnPrice: 194.376, plnMargin: 69.42, intranetId: 15392, category: "adfloor akcesoria" },
  "adFloor łącznik profili": { plnPrice: 61.74, plnMargin: 22.05, intranetId: 15379, category: "adfloor akcesoria" },

  // --- Kategoria: bramy pneumatyczne ---
  "adGate Air Square 6,5m": { plnPrice: 4608.016, plnMargin: 1645.72, intranetId: 18732, category: "bramy pneumatyczne" },
  "adGate Air Triangle 6,5m ver2": { plnPrice: 4208.624, plnMargin: 1503.08, intranetId: 16821, category: "bramy pneumatyczne" },
  "adGate Round": { plnPrice: 4733.176, plnMargin: 1690.42, intranetId: 18730, category: "bramy pneumatyczne" },

  // --- Kategoria: classic ---
  "Śruba M5/30mm": { plnPrice: 0.056, plnMargin: 0.02, intranetId: 17650, category: "classic" },

  // --- Kategoria: części zamienne ---
  "CZ - adTribune Expo 100x100 kurtynka": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19623, category: "części zamienne" },
  "CZ - adTribune Expo 100x100 torba": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19624, category: "części zamienne" },
  "CZ - adTribune Expo 150x100 podpora pod półkę": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19811, category: "części zamienne" },
  "CZ - adWall Vario Presto Light stopa": { plnPrice: 61.74, plnMargin: 22.05, intranetId: 19155, category: "części zamienne" },
  "CZ - adWall Vario Presto Light łuk": { plnPrice: 20.216, plnMargin: 7.22, intranetId: 19157, category: "części zamienne" },
  "CZ - adWall Vario Prosta/Łukowa Light stopa (mocowane na środku)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19844, category: "części zamienne" },

  // --- Kategoria: digital ---
  "adVideo InfoKiosk 55 with flight case": { plnPrice: 9777.404, plnMargin: 3491.93, intranetId: 19010, category: "digital" },
  "adVideo InfoKiosk 55`": { plnPrice: 6132.868, plnMargin: 2190.31, intranetId: 18669, category: "digital" },
  "adVideo InfoKiosk 65 ver2.0": { plnPrice: 10837.708, plnMargin: 3870.61, intranetId: 19027, category: "digital" },
  "adVideo InfoKiosk 65` ver2.0 with flight case": { plnPrice: 15458.94, plnMargin: 5521.05, intranetId: 19029, category: "digital" },
  "adVideo Kiosk 49` RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17612, category: "digital" },
  "adVideo Poster LED Screen": { plnPrice: 23342.732, plnMargin: 8336.69, intranetId: 18868, category: "digital" },
  "adVideo Poster TriFold [P1.86]": { plnPrice: 26142.704, plnMargin: 9336.68, intranetId: 19634, category: "digital" },
  "adVideo Poster TriFold [P2.5]": { plnPrice: 23325.792, plnMargin: 8330.64, intranetId: 19644, category: "digital" },
  "adVideo Stand 32`": { plnPrice: 4818.296, plnMargin: 1720.82, intranetId: 17903, category: "digital" },
  "adVideo Stand 32` RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19304, category: "digital" },
  "VideoWall": { plnPrice: 78129.128, plnMargin: 27903.26, intranetId: 15393, category: "digital" },
  "VideoWall 3x3": { plnPrice: 31655.568, plnMargin: 11305.56, intranetId: 16140, category: "digital" },

  // --- Kategoria: flagi ---
  "adFlag BLADE L": { plnPrice: 167.692, plnMargin: 59.89, intranetId: 15631, category: "flagi" },
  "adFlag BLADE M": { plnPrice: 130.396, plnMargin: 46.57, intranetId: 15630, category: "flagi" },
  "adFlag BLADE PRO L": { plnPrice: 225.204, plnMargin: 80.43, intranetId: 15635, category: "flagi" },
  "adFlag BLADE PRO M": { plnPrice: 186.732, plnMargin: 66.69, intranetId: 15634, category: "flagi" },
  "adFlag BLADE PRO S": { plnPrice: 144.2, plnMargin: 51.5, intranetId: 15633, category: "flagi" },
  "adFlag BLADE PRO XL": { plnPrice: 273.616, plnMargin: 97.72, intranetId: 15636, category: "flagi" },
  "adFlag BLADE S": { plnPrice: 110.348, plnMargin: 39.41, intranetId: 15629, category: "flagi" },
  "adFlag BLADE XL": { plnPrice: 193.312, plnMargin: 69.04, intranetId: 15632, category: "flagi" },
  "adFlag DROP L": { plnPrice: 162.512, plnMargin: 58.04, intranetId: 15656, category: "flagi" },
  "adFlag DROP M": { plnPrice: 127.82, plnMargin: 45.65, intranetId: 15655, category: "flagi" },
  "adFlag DROP PRO L": { plnPrice: 220.024, plnMargin: 78.58, intranetId: 15660, category: "flagi" },
  "adFlag DROP PRO M": { plnPrice: 184.128, plnMargin: 65.76, intranetId: 15659, category: "flagi" },
  "adFlag DROP PRO S": { plnPrice: 141.652, plnMargin: 50.59, intranetId: 15658, category: "flagi" },
  "adFlag DROP S": { plnPrice: 107.8, plnMargin: 38.5, intranetId: 15654, category: "flagi" },
  "adFlag HOOK L": { plnPrice: 167.692, plnMargin: 59.89, intranetId: 15648, category: "flagi" },
  "adFlag HOOK M": { plnPrice: 130.396, plnMargin: 46.57, intranetId: 15647, category: "flagi" },
  "adFlag HOOK PRO L": { plnPrice: 225.204, plnMargin: 80.43, intranetId: 15652, category: "flagi" },
  "adFlag HOOK PRO M": { plnPrice: 186.732, plnMargin: 66.69, intranetId: 15651, category: "flagi" },
  "adFlag HOOK PRO S": { plnPrice: 144.2, plnMargin: 51.5, intranetId: 15650, category: "flagi" },
  "adFlag HOOK PRO XL": { plnPrice: 273.616, plnMargin: 97.72, intranetId: 15653, category: "flagi" },
  "adFlag HOOK S": { plnPrice: 110.348, plnMargin: 39.41, intranetId: 15646, category: "flagi" },
  "adFlag HOOK XL": { plnPrice: 193.312, plnMargin: 69.04, intranetId: 15649, category: "flagi" },
  "adFlag L (bez wydruku)": { plnPrice: 104.86, plnMargin: 37.45, intranetId: 15678, category: "flagi" },
  "adFlag M (bez wydruku)": { plnPrice: 85.988, plnMargin: 30.71, intranetId: 15679, category: "flagi" },
  "adFlag PRO S (bez wydruku)": { plnPrice: 99.764, plnMargin: 35.63, intranetId: 15683, category: "flagi" },
  "adFlag PRO XL (bez wydruku)": { plnPrice: 191.184, plnMargin: 68.28, intranetId: 15685, category: "flagi" },
  "adFlag S (bez wydruku)": { plnPrice: 68.516, plnMargin: 24.47, intranetId: 15680, category: "flagi" },
  "adFlag STANDARD L": { plnPrice: 166.404, plnMargin: 59.43, intranetId: 15640, category: "flagi" },
  "adFlag STANDARD M": { plnPrice: 130.396, plnMargin: 46.57, intranetId: 15639, category: "flagi" },
  "adFlag STANDARD PRO L": { plnPrice: 223.972, plnMargin: 79.99, intranetId: 15644, category: "flagi" },
  "adFlag STANDARD PRO M": { plnPrice: 186.732, plnMargin: 66.69, intranetId: 15643, category: "flagi" },
  "adFlag STANDARD PRO S": { plnPrice: 141.652, plnMargin: 50.59, intranetId: 15642, category: "flagi" },
  "adFlag STANDARD PRO XL": { plnPrice: 273.616, plnMargin: 97.72, intranetId: 15645, category: "flagi" },
  "adFlag STANDARD S": { plnPrice: 107.8, plnMargin: 38.5, intranetId: 15638, category: "flagi" },
  "adFlag STANDARD XL": { plnPrice: 193.312, plnMargin: 69.04, intranetId: 15641, category: "flagi" },
  "adFlag XL (bez wydruku)": { plnPrice: 114.436, plnMargin: 40.87, intranetId: 15681, category: "flagi" },

  // --- Kategoria: frames ---
  "SET1 - Zestaw targowy Sego LED": { plnPrice: 14230.048, plnMargin: 5082.16, intranetId: 18060, category: "frames" },
  "SET4 - Zestaw targowy Standard DTF": { plnPrice: 6186.684, plnMargin: 2209.53, intranetId: 18055, category: "frames" },

  // --- Kategoria: frames light ---
  "adWall Vario Prosta Black 600 (bez wydruku)": { plnPrice: 460.404, plnMargin: 164.43, intranetId: 19435, category: "frames light" },
  "SEGO Bridge handle for HP": { plnPrice: 5.6, plnMargin: 2.0, intranetId: 13542, category: "frames light" },

  // --- Kategoria: hardware ---
  "HDWR-adFolder A4 (bez wydruku)": { plnPrice: 526.064, plnMargin: 187.88, intranetId: 19383, category: "hardware" },
  "HDWR-adFrame Slim 100x200 - 65mm (bez wydruku)": { plnPrice: 797.3, plnMargin: 284.75, intranetId: 19406, category: "hardware" },
  "HDWR-adStand Basic 85 (bez wydruku)": { plnPrice: 93.016, plnMargin: 33.22, intranetId: 19436, category: "hardware" },
  "HDWR-Adstand Drop - 100 (bez wydruku)": { plnPrice: 276.444, plnMargin: 98.73, intranetId: 19370, category: "hardware" },
  "HDWR-adStand Eco 100 (bez wydruku)": { plnPrice: 144.648, plnMargin: 51.66, intranetId: 19376, category: "hardware" },
  "HDWR-adStand Lux 100 (bez wydruku)": { plnPrice: 213.892, plnMargin: 76.39, intranetId: 19372, category: "hardware" },
  "HDWR-adStand Octa 100 (bez wydruku)": { plnPrice: 276.192, plnMargin: 98.64, intranetId: 19378, category: "hardware" },
  "HDWR-adStand R3 Black 100 (bez wydruku)": { plnPrice: 119.196, plnMargin: 42.57, intranetId: 19379, category: "hardware" },
  "HDWR-adStand R3 Black 85 (bez wydruku)": { plnPrice: 93.996, plnMargin: 33.57, intranetId: 19380, category: "hardware" },
  "HDWR-adStand R3 White 100 (bez wydruku)": { plnPrice: 95.508, plnMargin: 34.11, intranetId: 19381, category: "hardware" },
  "HDWR-adStand R3 White 85 (bez wydruku)": { plnPrice: 80.864, plnMargin: 28.88, intranetId: 19382, category: "hardware" },
  "HDWR-adTent EXPRESS 3x4,5m (bez wydruku)": { plnPrice: 3090.948, plnMargin: 1103.91, intranetId: 19419, category: "hardware" },
  "HDWR-adTent EXPRESS 3x6m (bez wydruku)": { plnPrice: 1732.472, plnMargin: 618.74, intranetId: 19420, category: "hardware" },
  "HDWR-adTribune PVC Oval (bez wydruku)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19287, category: "hardware" },
  "HDWR-adWall Vario Prosta Black 240 (bez wydruku)": { plnPrice: 291.984, plnMargin: 104.28, intranetId: 19276, category: "hardware" },

  // --- Kategoria: inne ---
  "Lumina RGB 300x250 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18938, category: "inne" },
  "POKAZÓWKA_adFrame Quick Safe Case BLACK 100x200 (bez wydruku)": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19302, category: "inne" },
  "POKAZÓWKA_adVideo Poster LED Screen": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19322, category: "inne" },
  "POKAZÓWKA_handel.pl_Pop-up Lightbox 100x200": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17875, category: "inne" },
  "POKAZÓWKA_Lumina RGB 300x250 dwustronny": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18569, category: "inne" },
  "SAMPLE_adTribune Flex Expo (bez wydruku)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19289, category: "inne" },
  "Usługa wewnętrzna cięcie Piła [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 13487, category: "inne" },
  "Usługa wewnętrzna krojenie [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10808, category: "inne" },
  "Usługa wewnętrzna montaż Classic [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10794, category: "inne" },
  "Usługa wewnętrzna montaż Kasetony [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 11450, category: "inne" },
  "Usługa wewnętrzna montaż Vario [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10236, category: "inne" },
  "Usługa wewnętrzna montaż Zabudowy [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 11480, category: "inne" },
  "Usługa wewnętrzna szycie [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10809, category: "inne" },
  "Usługa wewnętrzna Wysyłka Zabudowy [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18674, category: "inne" },
  "Weryfikacja reklamacji Vario o nr paczki:": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18319, category: "inne" },
  "Weryfikacja zwrotu Vario o nr paczki:": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18163, category: "inne" },
  "Wykonanie otworów pod półkę mframe/SEGO": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18176, category: "inne" },
  "Śruba imbusowa dociskowa M5": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 16489, category: "inne" },

  // --- Kategoria: leżaki reklamowe ---
  "adDeck personalizowany": { plnPrice: 174.524, plnMargin: 62.33, intranetId: 13773, category: "leżaki reklamowe" },
  "Leżak - stelaż": { plnPrice: 145.376, plnMargin: 51.92, intranetId: 12490, category: "leżaki reklamowe" },
  "Leżak zestaw montażowy (plastiki, śruby, instrukcja)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 15769, category: "leżaki reklamowe" },

  // --- Kategoria: meble reklamowe ---
  "adBeanbag": { plnPrice: 464.156, plnMargin: 165.77, intranetId: 10580, category: "meble reklamowe" },
  "adChair inflate": { plnPrice: 378.364, plnMargin: 135.13, intranetId: 19096, category: "meble reklamowe" },
  "adChair inflate (bez wydruku)": { plnPrice: 198.772, plnMargin: 70.99, intranetId: 18832, category: "meble reklamowe" },
  "adFoam Cube": { plnPrice: 297.024, plnMargin: 106.08, intranetId: 10577, category: "meble reklamowe" },
  "adFoam Cube (bez wydruku)": { plnPrice: 238.448, plnMargin: 85.16, intranetId: 11817, category: "meble reklamowe" },
  "adFoam Forma": { plnPrice: 1707.888, plnMargin: 609.96, intranetId: 10573, category: "meble reklamowe" },
  "adFoam Roller": { plnPrice: 3104.64, plnMargin: 1108.8, intranetId: 11831, category: "meble reklamowe" },
  "adFoam Roller Mini": { plnPrice: 418.88, plnMargin: 149.6, intranetId: 10579, category: "meble reklamowe" },
  "adFoam Via": { plnPrice: 1836.436, plnMargin: 655.87, intranetId: 11374, category: "meble reklamowe" },
  "adPuff inflate": { plnPrice: 235.592, plnMargin: 84.14, intranetId: 19090, category: "meble reklamowe" },
  "adSacco": { plnPrice: 393.904, plnMargin: 140.68, intranetId: 10581, category: "meble reklamowe" },

  // --- Kategoria: media do druku ---
  "Medium Tex Blockout": { plnPrice: 80.472, plnMargin: 28.74, intranetId: 10877, category: "media do druku" },
  "Medium Tex Kaseton LED": { plnPrice: 63.056, plnMargin: 22.52, intranetId: 10814, category: "media do druku" },
  "Medium Tex Kaseton LED 220": { plnPrice: 57.148, plnMargin: 20.41, intranetId: 18729, category: "media do druku" },
  "Medium Tex Premium 250cm": { plnPrice: 78.064, plnMargin: 27.88, intranetId: 10893, category: "media do druku" },
  "Medium Tex SEG": { plnPrice: 60.788, plnMargin: 21.71, intranetId: 17784, category: "media do druku" },
  "Medium Tex Vario": { plnPrice: 78.12, plnMargin: 27.9, intranetId: 10811, category: "media do druku" },

  // --- Kategoria: modern ---
  "SET2 - Zestaw konferencyjny Economic Vario": { plnPrice: 3122.504, plnMargin: 1115.18, intranetId: 18097, category: "modern" },
  "SET4 - Zestaw do promocji Economic Vario": { plnPrice: 1378.16, plnMargin: 492.2, intranetId: 18099, category: "modern" },
  "Worek na wydruki S (45*55cm)": { plnPrice: 0.56, plnMargin: 0.2, intranetId: 12430, category: "modern" },

  // --- Kategoria: modern light ---
  "adWall Vario Łukowa Light 600 SOFT BAG (bez wydruku)": { plnPrice: 990.136, plnMargin: 353.62, intranetId: 17578, category: "modern light" },

  // --- Kategoria: modular ---
  "Boliwia PP białe siedzisko RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17467, category: "modular" },
  "Boliwia PP czarne siedzisko RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17769, category: "modular" },
  "butla dmuchana - GYEON": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18883, category: "modular" },
  "czajnik RENTAL": { plnPrice: 164.752, plnMargin: 58.84, intranetId: 17742, category: "modular" },
  "GŁOŚNIK RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17497, category: "modular" },
  "Hoker Boliwia czarne siedzisko/czarne nogi komplet": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17770, category: "modular" },
  "mFrame PROFIL ŁUK 1165 R1488": { plnPrice: 235.844, plnMargin: 84.23, intranetId: 18854, category: "modular" },
  "Multiframe akcesoria klamra zamka": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17518, category: "modular" },
  "Multiframe akcesoria trzpień profila dolnego": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 17515, category: "modular" },
  "Multiframe akcesoria tuleja zamka": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17517, category: "modular" },
  "Stół Capri 80cm biały komplet RENTAL": { plnPrice: 6.076, plnMargin: 2.17, intranetId: 17635, category: "modular" },
  "Stół Capri 80cm blat biały RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16379, category: "modular" },
  "VideoWall MASTER HUB VX4x15 HDMI RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17667, category: "modular" },
  "VideoWall PANEL ver3 P1.93": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 17826, category: "modular" },
  "Wydruk mFrame na tekstyliach 148,8x148,8cm": { plnPrice: 168.0, plnMargin: 60.0, intranetId: 17597, category: "modular" },
  "Wydruk mFrame na tekstyliach 148,8x99,2cm": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19244, category: "modular" },
  "zabudowa - double deck": { plnPrice: 62347.628, plnMargin: 22267.01, intranetId: 18139, category: "modular" },
  "zabudowa - PRESTIGE BEATA": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19315, category: "modular" },
  "zabudowa - vitasynth": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17628, category: "modular" },
  "złączka LED - Jack 3,5mm 10cm żeński": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17480, category: "modular" },

  // --- Kategoria: namioty ---
  "adTent Air premium - zestaw MARKIZA 4X4": { plnPrice: 1936.2, plnMargin: 691.5, intranetId: 15529, category: "namioty" },
  "adTent Air premium 1x1 SET": { plnPrice: 1300.32, plnMargin: 464.4, intranetId: 18503, category: "namioty" },
  "adTent Air premium 3x3 (bez wydruku)": { plnPrice: 3777.788, plnMargin: 1349.21, intranetId: 13559, category: "namioty" },
  "adTent Air premium 3x3 (stelaż+dach)": { plnPrice: 4745.496, plnMargin: 1694.82, intranetId: 14002, category: "namioty" },
  "adTent Air premium 4x4 (bez wydruku)": { plnPrice: 4679.612, plnMargin: 1671.29, intranetId: 13560, category: "namioty" },
  "adTent Air premium 4x4 (stelaż+dach)": { plnPrice: 5744.76, plnMargin: 2051.7, intranetId: 14009, category: "namioty" },
  "adTent Air premium 4x6 (stelaż+dach)": { plnPrice: 6831.216, plnMargin: 2439.72, intranetId: 18798, category: "namioty" },
  "adTent Air premium 5x5 (bez wydruku)": { plnPrice: 6523.552, plnMargin: 2329.84, intranetId: 13561, category: "namioty" },
  "adTent Air premium 5x5 (stelaż+dach)": { plnPrice: 8107.148, plnMargin: 2895.41, intranetId: 14010, category: "namioty" },
  "adTent Air premium 6x6 (bez wydruku)": { plnPrice: 7619.612, plnMargin: 2721.29, intranetId: 13562, category: "namioty" },
  "adTent Air premium 6x6 (stelaż+dach)": { plnPrice: 9652.272, plnMargin: 3447.24, intranetId: 14011, category: "namioty" },
  "adTent Air premium Automatic 3x3 (bez wydruku)": { plnPrice: 5318.096, plnMargin: 1899.32, intranetId: 18800, category: "namioty" },
  "adTent Air premium Automatic 3x3 (stelaż+dach)": { plnPrice: 6675.032, plnMargin: 2383.94, intranetId: 18806, category: "namioty" },
  "adTent Air premium Automatic 4x4 (stelaż+dach)": { plnPrice: 8142.4, plnMargin: 2908.0, intranetId: 18805, category: "namioty" },
  "adTent Air premium Automatic 5x5 (stelaż+dach)": { plnPrice: 10952.116, plnMargin: 3911.47, intranetId: 18807, category: "namioty" },
  "adTent Air premium Automatic 6x6 (stelaż+dach)": { plnPrice: 12497.24, plnMargin: 4463.3, intranetId: 18808, category: "namioty" },
  "adTent EXPRESS 3x3m (bez wydruku)": { plnPrice: 888.608, plnMargin: 317.36, intranetId: 15586, category: "namioty" },
  "adTent EXPRESS 3x3m (konstrukcja+wydruk dach)": { plnPrice: 1825.516, plnMargin: 651.97, intranetId: 15605, category: "namioty" },
  "adTent EXPRESS 3x3m (konstrukcja+wydruk dach+4x sciany)": { plnPrice: 3307.304, plnMargin: 1181.18, intranetId: 15729, category: "namioty" },
  "adTent EXPRESS 3x4,5m (bez wydruku)": { plnPrice: 3090.948, plnMargin: 1103.91, intranetId: 15588, category: "namioty" },
  "adTent EXPRESS 3x4,5m (konstrukcja+wydruk dach)": { plnPrice: 2569.868, plnMargin: 917.81, intranetId: 15606, category: "namioty" },
  "adTent EXPRESS 3x6m (bez wydruku)": { plnPrice: 1732.472, plnMargin: 618.74, intranetId: 15589, category: "namioty" },
  "adTent EXPRESS 3x6m (konstrukcja+wydruk dach)": { plnPrice: 3292.184, plnMargin: 1175.78, intranetId: 15607, category: "namioty" },
  "adTent EXPRESS baza flagowa do namiotu": { plnPrice: 209.72, plnMargin: 74.9, intranetId: 15829, category: "namioty" },
  "adTent EXPRESS PRO 3x3m (bez wydruku)": { plnPrice: 1828.232, plnMargin: 652.94, intranetId: 15626, category: "namioty" },
  "adTent EXPRESS PRO 3x3m (konstrukcja+wydruk dach)": { plnPrice: 2765.168, plnMargin: 987.56, intranetId: 15617, category: "namioty" },
  "adTent EXPRESS PRO 3x6m (bez wydruku)": { plnPrice: 3336.648, plnMargin: 1191.66, intranetId: 15619, category: "namioty" },
  "adTent EXPRESS PRO 3x6m (konstrukcja+wydruk dach)": { plnPrice: 4835.684, plnMargin: 1727.03, intranetId: 15618, category: "namioty" },
  "adTent EXPRESS PRO 3x6m (konstrukcja+wydruk dach+4x sciany)": { plnPrice: 6615.84, plnMargin: 2362.8, intranetId: 18035, category: "namioty" },
  "adTent V 4x4": { plnPrice: 7878.332, plnMargin: 2813.69, intranetId: 17523, category: "namioty" },
  "adTent V 5x5": { plnPrice: 9430.484, plnMargin: 3368.03, intranetId: 17524, category: "namioty" },
  "adTent V 6x6": { plnPrice: 11583.348, plnMargin: 4136.91, intranetId: 17525, category: "namioty" },
  "adTent Vario 3x3 (stelaż+dach)": { plnPrice: 4153.744, plnMargin: 1483.48, intranetId: 11013, category: "namioty" },
  "adTent Vario 4x4 (bez wydruku)": { plnPrice: 3404.912, plnMargin: 1216.04, intranetId: 11109, category: "namioty" },
  "adTent Vario 4x4 (stelaż+dach)": { plnPrice: 4996.628, plnMargin: 1784.51, intranetId: 11014, category: "namioty" },
  "Markiza konstrukcja Air Tent Premium 4x4": { plnPrice: 1572.144, plnMargin: 561.48, intranetId: 13567, category: "namioty" },
  "SET2 - Economy Set": { plnPrice: 3315.592, plnMargin: 1184.14, intranetId: 18023, category: "namioty" },
  "SET3 - Heavy-Duty Set": { plnPrice: 4815.496, plnMargin: 1719.82, intranetId: 18024, category: "namioty" },

  // --- Kategoria: namioty akcesoria ---
  "adTent EXPRESS obciążnik betonowy 8kg - set 2 szt": { plnPrice: 625.296, plnMargin: 223.32, intranetId: 17507, category: "namioty akcesoria" },
  "Dodatkowa noga/TPU do Air Tent Premium 3x3": { plnPrice: 578.704, plnMargin: 206.68, intranetId: 13563, category: "namioty akcesoria" },
  "Dodatkowa noga/TPU do Air Tent Premium 3x3 zawór bezpieczeństwa na dole": { plnPrice: 517.496, plnMargin: 184.82, intranetId: 19673, category: "namioty akcesoria" },
  "Dodatkowa noga/TPU do Air Tent Premium 4x4": { plnPrice: 677.852, plnMargin: 242.09, intranetId: 13564, category: "namioty akcesoria" },
  "Dodatkowa noga/TPU do Air Tent Premium 5x5": { plnPrice: 981.232, plnMargin: 350.44, intranetId: 13565, category: "namioty akcesoria" },
  "Dodatkowa noga/TPU do Air Tent Premium 5x5 zawór bezpieczeństwa na dole": { plnPrice: 962.108, plnMargin: 343.61, intranetId: 19675, category: "namioty akcesoria" },
  "Dodatkowa noga/TPU do Air Tent Premium 6x6": { plnPrice: 1099.056, plnMargin: 392.52, intranetId: 13566, category: "namioty akcesoria" },
  "Torba na kółkach Air Tent Premium (DUŻA)": { plnPrice: 682.164, plnMargin: 243.63, intranetId: 13576, category: "namioty akcesoria" },
  "Torba na kółkach Air Tent Premium (MAŁA)": { plnPrice: 595.252, plnMargin: 212.59, intranetId: 13575, category: "namioty akcesoria" },
  "Zamek kostkowy biały, dł. 400cm": { plnPrice: 2.716, plnMargin: 0.97, intranetId: 12392, category: "namioty akcesoria" },
  "Zawór ciśnieniowy do Air Tent Premium": { plnPrice: 0.112, plnMargin: 0.04, intranetId: 13588, category: "namioty akcesoria" },

  // --- Kategoria: outdoor ---
  "POKAZÓWKA_adTent V 4x4": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17622, category: "outdoor" },
  "SET4 - Chill Zone": { plnPrice: 8477.392, plnMargin: 3027.64, intranetId: 18025, category: "outdoor" },
  "SET5 - Fan Zone": { plnPrice: 9125.844, plnMargin: 3259.23, intranetId: 18026, category: "outdoor" },
  "Wydruk Adtent Air premium 4x4 (ściana boczna dwustronna PREMIUM BLOCKOUT)": { plnPrice: 818.244, plnMargin: 292.23, intranetId: 17540, category: "outdoor" },
  "Wydruk Adtent Air premium 5x5 (ściana boczna dwustronna PREMIUM BLOCKOUT)": { plnPrice: 939.232, plnMargin: 335.44, intranetId: 18153, category: "outdoor" },
  "Wydruk adTent V 4x4 KOMPLET": { plnPrice: 1639.596, plnMargin: 585.57, intranetId: 17527, category: "outdoor" },

  // --- Kategoria: outdoor akcesoria ---
  "adColumn Air - Obciążnik 10kg": { plnPrice: 361.396, plnMargin: 129.07, intranetId: 11766, category: "outdoor akcesoria" },
  "adColumn Air - zestaw sznurków + śledzie (8szt)": { plnPrice: 50.008, plnMargin: 17.86, intranetId: 17436, category: "outdoor akcesoria" },
  "adColumn Air podstawa biała": { plnPrice: 215.04, plnMargin: 76.8, intranetId: 15745, category: "outdoor akcesoria" },
  "adColumn Air torba": { plnPrice: 144.704, plnMargin: 51.68, intranetId: 15744, category: "outdoor akcesoria" },
  "adFlag Bagnet": { plnPrice: 60.732, plnMargin: 21.69, intranetId: 15686, category: "outdoor akcesoria" },
  "adFlag Krzyżak": { plnPrice: 94.78, plnMargin: 33.85, intranetId: 15691, category: "outdoor akcesoria" },
  "adFlag Płyta 12kg": { plnPrice: 236.74, plnMargin: 84.55, intranetId: 15689, category: "outdoor akcesoria" },
  "adFlag Płyta 4kg": { plnPrice: 136.948, plnMargin: 48.91, intranetId: 15687, category: "outdoor akcesoria" },
  "adFlag Płyta 6kg": { plnPrice: 179.452, plnMargin: 64.09, intranetId: 15748, category: "outdoor akcesoria" },
  "adFlag Płyta 8kg": { plnPrice: 364.056, plnMargin: 130.02, intranetId: 15688, category: "outdoor akcesoria" },
  "adFlag Rotator": { plnPrice: 63.644, plnMargin: 22.73, intranetId: 15690, category: "outdoor akcesoria" },
  "adFlag Sakwa wodna": { plnPrice: 26.656, plnMargin: 9.52, intranetId: 15803, category: "outdoor akcesoria" },
  "Adflag Torba L/XL 120cm do adFlag PRO S/L/XL, standard L/XL": { plnPrice: 77.588, plnMargin: 27.71, intranetId: 15693, category: "outdoor akcesoria" },
  "Adflag Torba S/M 100cm do adFlag PRO M, standard S/M": { plnPrice: 74.312, plnMargin: 26.54, intranetId: 15692, category: "outdoor akcesoria" },
  "adFlag trzpień zapasowy": { plnPrice: 14.98, plnMargin: 5.35, intranetId: 18189, category: "outdoor akcesoria" },
  "adFlag zacisk do masztu S/M/L": { plnPrice: 6.16, plnMargin: 2.2, intranetId: 16818, category: "outdoor akcesoria" },
  "adTent Air - Plecak 4x4/5x5": { plnPrice: 394.38, plnMargin: 140.85, intranetId: 12137, category: "outdoor akcesoria" },
  "adTent Air - śledź prosty": { plnPrice: 6.16, plnMargin: 2.2, intranetId: 14860, category: "outdoor akcesoria" },
  "adTent Air - śledź zakręcony": { plnPrice: 35.924, plnMargin: 12.83, intranetId: 13570, category: "outdoor akcesoria" },
  "adTent Air KOMPLET 2 PLECAKÓW DO NAMIOTU 4X4 I 5X5": { plnPrice: 786.8, plnMargin: 281.0, intranetId: 14029, category: "outdoor akcesoria" },
  "adTent Air Oświetlenie LED - (3x3 & 4x4)": { plnPrice: 753.62, plnMargin: 269.15, intranetId: 16052, category: "outdoor akcesoria" },
  "adTent Air Oświetlenie LED - (5x5 & 6x6)": { plnPrice: 857.416, plnMargin: 306.22, intranetId: 15601, category: "outdoor akcesoria" },
  "adTent Air premium - Młotek": { plnPrice: 36.568, plnMargin: 13.06, intranetId: 13571, category: "outdoor akcesoria" },
  "adTent Air premium - zestaw zaworów": { plnPrice: 1.344, plnMargin: 0.48, intranetId: 18230, category: "outdoor akcesoria" },
  "adTent Air premium - zestaw Śledzie Outdoor 16 szt": { plnPrice: 98.56, plnMargin: 35.2, intranetId: 15523, category: "outdoor akcesoria" },
  "adTent Air premium - Łącznik 2 namiotów 4X4": { plnPrice: 351.344, plnMargin: 125.48, intranetId: 15846, category: "outdoor akcesoria" },
  "adTent Air premium sakwa obciążenie": { plnPrice: 65.912, plnMargin: 23.54, intranetId: 18682, category: "outdoor akcesoria" },
  "adTent EXPRESS - noga narożna": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18751, category: "outdoor akcesoria" },
  "adTent EXPRESS - plastik do noga narożna": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18753, category: "outdoor akcesoria" },
  "adTent EXPRESS - plastikowe narożniki": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 17952, category: "outdoor akcesoria" },
  "adTent EXPRESS 3x3 - zestaw śledzie i sznurki": { plnPrice: 25.9, plnMargin: 9.25, intranetId: 18030, category: "outdoor akcesoria" },
  "adTent EXPRESS 3x3m torba na kółkach": { plnPrice: 125.3, plnMargin: 44.75, intranetId: 15587, category: "outdoor akcesoria" },
  "adTent EXPRESS halfbar 3x3": { plnPrice: 304.92, plnMargin: 108.9, intranetId: 16455, category: "outdoor akcesoria" },
  "adTent EXPRESS sakwa na piasek": { plnPrice: 58.856, plnMargin: 21.02, intranetId: 15747, category: "outdoor akcesoria" },
  "adTent EXPRESS sakwa na piasek podwójna": { plnPrice: 121.996, plnMargin: 43.57, intranetId: 15822, category: "outdoor akcesoria" },
  "OBCIĄŻNIK DO NAMIOTU": { plnPrice: 215.6, plnMargin: 77.0, intranetId: 11717, category: "outdoor akcesoria" },
  "Pompka do Adtent Air Premium Automatic": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18831, category: "outdoor akcesoria" },
  "POMPKA ELEKTRYCZNA BRAVO": { plnPrice: 375.956, plnMargin: 134.27, intranetId: 13572, category: "outdoor akcesoria" },
  "Pompka elektryczna standard": { plnPrice: 231.952, plnMargin: 82.84, intranetId: 11376, category: "outdoor akcesoria" },
  "Pompka ręczna": { plnPrice: 85.148, plnMargin: 30.41, intranetId: 11377, category: "outdoor akcesoria" },

  // --- Kategoria: potykacze ---
  "adBoard Hips 58x100": { plnPrice: 551.992, plnMargin: 197.14, intranetId: 10128, category: "potykacze" },
  "adBoard Hips 58x100 (bez wydruku)": { plnPrice: 504.028, plnMargin: 180.01, intranetId: 15550, category: "potykacze" },
  "adBoard Hips 68x120": { plnPrice: 666.652, plnMargin: 238.09, intranetId: 10417, category: "potykacze" },
  "adBoard LED 85x120": { plnPrice: 1513.4, plnMargin: 540.5, intranetId: 16216, category: "potykacze" },
  "adBoard OWZ A0": { plnPrice: 1006.796, plnMargin: 359.57, intranetId: 10223, category: "potykacze" },
  "adBoard OWZ A0(bez wydruku)": { plnPrice: 828.52, plnMargin: 295.9, intranetId: 13894, category: "potykacze" },
  "adBoard OWZ B2": { plnPrice: 566.132, plnMargin: 202.19, intranetId: 10320, category: "potykacze" },

  // --- Kategoria: półprodukty ---
  "adBox Elypse Mini komplet blat+półka": { plnPrice: 287.616, plnMargin: 102.72, intranetId: 17535, category: "półprodukty" },
  "adBox Hit C komplet blat+półka": { plnPrice: 524.3, plnMargin: 187.25, intranetId: 17494, category: "półprodukty" },
  "adTribune Seg NEW komplet blat+półka": { plnPrice: 328.776, plnMargin: 117.42, intranetId: 17751, category: "półprodukty" },
  "Blat niestandardowy - kasetony (należy dodać dodatkową paczkę na blat, uwzględniając wymiary blatu)": { plnPrice: 18.732, plnMargin: 6.69, intranetId: 16443, category: "półprodukty" },
  "Elypse konstrukcja uzbrojona CN": { plnPrice: 394.436, plnMargin: 140.87, intranetId: 18594, category: "półprodukty" },
  "Formatka Hips 0,50mm": { plnPrice: 40.32, plnMargin: 14.4, intranetId: 10165, category: "półprodukty" },
  "Karton - Elypse": { plnPrice: 25.984, plnMargin: 9.28, intranetId: 11350, category: "półprodukty" },
  "Karton 143/33/22 - kaseton profil max.130cm 3K": { plnPrice: 43.12, plnMargin: 15.4, intranetId: 12205, category: "półprodukty" },
  "Karton Adstand 100/STFL - 105x9,5x26,5cm": { plnPrice: 18.144, plnMargin: 6.48, intranetId: 11353, category: "półprodukty" },
  "Karton LMD/LMS - 110x16x33cm": { plnPrice: 61.516, plnMargin: 21.97, intranetId: 14841, category: "półprodukty" },
  "Karton LMD/LMS - 135x16x33cm": { plnPrice: 69.496, plnMargin: 24.82, intranetId: 14842, category: "półprodukty" },
  "Karton LMD/LMS/DTF - 210x16x33cm": { plnPrice: 99.176, plnMargin: 35.42, intranetId: 14844, category: "półprodukty" },
  "Keder 14x3mm - Adframe": { plnPrice: 2.604, plnMargin: 0.93, intranetId: 11815, category: "półprodukty" },
  "Kółko STANDARD": { plnPrice: 0.392, plnMargin: 0.14, intranetId: 17509, category: "półprodukty" },
  "Produkt wystawienniczy": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10129, category: "półprodukty" },
  "Rzep miękki [pętelka]": { plnPrice: 5.264, plnMargin: 1.88, intranetId: 10250, category: "półprodukty" },
  "Rzep twardy [haczyk]": { plnPrice: 5.404, plnMargin: 1.93, intranetId: 10251, category: "półprodukty" },
  "Tuba 12x150cm - wydruk AdPoster L150": { plnPrice: 19.404, plnMargin: 6.93, intranetId: 11360, category: "półprodukty" },
  "Tuba 12x200cm - wydruk AdPoster L200": { plnPrice: 26.628, plnMargin: 9.51, intranetId: 11593, category: "półprodukty" },
  "Tuba 15x90cm - wydruk stoisko": { plnPrice: 15.764, plnMargin: 5.63, intranetId: 11356, category: "półprodukty" },
  "Zamek zwykły biały, dł. 160cm": { plnPrice: 0.644, plnMargin: 0.23, intranetId: 13964, category: "półprodukty" },
  "Zamek zwykły czarny, dł. 200cm": { plnPrice: 0.896, plnMargin: 0.32, intranetId: 15342, category: "półprodukty" },

  // --- Kategoria: ramy tekstylne akcesoria ---
  "adFrame CTF mocowanie półki": { plnPrice: 59.92, plnMargin: 21.4, intranetId: 19552, category: "ramy tekstylne akcesoria" },
  "adFrame CTF Plastic connector": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 12090, category: "ramy tekstylne akcesoria" },
  "adFrame CTF support bar connector": { plnPrice: 26.964, plnMargin: 9.63, intranetId: 12077, category: "ramy tekstylne akcesoria" },
  "adFrame DTF lampka": { plnPrice: 56.14, plnMargin: 20.05, intranetId: 17410, category: "ramy tekstylne akcesoria" },
  "adFrame DTF stopa płaska": { plnPrice: 116.564, plnMargin: 41.63, intranetId: 10943, category: "ramy tekstylne akcesoria" },
  "adFrame DTF łącznik kątowy 90 stopni": { plnPrice: 52.752, plnMargin: 18.84, intranetId: 17433, category: "ramy tekstylne akcesoria" },
  "adFrame DTF/STF/LMSM łącznik 180°": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 10941, category: "ramy tekstylne akcesoria" },
  "adFrame imbus 2,5mm": { plnPrice: 0.196, plnMargin: 0.07, intranetId: 11315, category: "ramy tekstylne akcesoria" },
  "adFrame imbus 4mm": { plnPrice: 0.252, plnMargin: 0.09, intranetId: 11316, category: "ramy tekstylne akcesoria" },
  "adFrame LCD profil przedni z gumką": { plnPrice: 112.868, plnMargin: 40.31, intranetId: 12073, category: "ramy tekstylne akcesoria" },
  "adFrame LCD profil tylny z gumką/bez gumki": { plnPrice: 195.748, plnMargin: 69.91, intranetId: 12096, category: "ramy tekstylne akcesoria" },
  "adFrame LCD profil z gumką środkowy": { plnPrice: 89.852, plnMargin: 32.09, intranetId: 15412, category: "ramy tekstylne akcesoria" },
  "adFrame LED mocowanie": { plnPrice: 0.196, plnMargin: 0.07, intranetId: 11314, category: "ramy tekstylne akcesoria" },
  "adFrame LMD (narożny) łącznik na płasko": { plnPrice: 4.48, plnMargin: 1.6, intranetId: 15352, category: "ramy tekstylne akcesoria" },
  "adFrame LMD door listwy 100cm NA BOK - zestaw": { plnPrice: 2201.052, plnMargin: 786.09, intranetId: 12051, category: "ramy tekstylne akcesoria" },
  "adFrame LMD narożnik wzmacniany": { plnPrice: 16.828, plnMargin: 6.01, intranetId: 11900, category: "ramy tekstylne akcesoria" },
  "adFrame LMD pianka ochronna": { plnPrice: 0.644, plnMargin: 0.23, intranetId: 11736, category: "ramy tekstylne akcesoria" },
  "adFrame LMD łącznik 180° długi": { plnPrice: 33.712, plnMargin: 12.04, intranetId: 10952, category: "ramy tekstylne akcesoria" },
  "adFrame LMD łącznik narożny mFrame": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 17156, category: "ramy tekstylne akcesoria" },
  "adFrame LMD/LMS - Torba 105cm 3K": { plnPrice: 594.804, plnMargin: 212.43, intranetId: 10596, category: "ramy tekstylne akcesoria" },
  "adFrame LMD/LMS - Torba 105cm z kółkami": { plnPrice: 1055.544, plnMargin: 376.98, intranetId: 11573, category: "ramy tekstylne akcesoria" },
  "adFrame LMD/LMS - Torba 130cm z kółkami": { plnPrice: 1196.58, plnMargin: 427.35, intranetId: 15217, category: "ramy tekstylne akcesoria" },
  "adFrame LMD/LMS - Torba 155cm z kółkami": { plnPrice: 1363.684, plnMargin: 487.03, intranetId: 15218, category: "ramy tekstylne akcesoria" },
  "adFrame LMD/LMS - Torba 205cm z kółkami": { plnPrice: 1627.976, plnMargin: 581.42, intranetId: 11574, category: "ramy tekstylne akcesoria" },
  "adFrame LMS narożnik (bez gwintu)": { plnPrice: 5.6, plnMargin: 2.0, intranetId: 10946, category: "ramy tekstylne akcesoria" },
  "adFrame LMS wieszak": { plnPrice: 44.912, plnMargin: 16.04, intranetId: 10961, category: "ramy tekstylne akcesoria" },
  "adFrame LMS wieszak dolny": { plnPrice: 44.912, plnMargin: 16.04, intranetId: 15410, category: "ramy tekstylne akcesoria" },
  "adFrame LMS łącznik 180°": { plnPrice: 32.9, plnMargin: 11.75, intranetId: 10947, category: "ramy tekstylne akcesoria" },
  "adFrame LMS/STF/DTF narożnik (gwintowany)": { plnPrice: 5.572, plnMargin: 1.99, intranetId: 10940, category: "ramy tekstylne akcesoria" },
  "adFrame LMSM narożnik": { plnPrice: 5.068, plnMargin: 1.81, intranetId: 11118, category: "ramy tekstylne akcesoria" },
  "adFrame LMSM wieszak": { plnPrice: 6.188, plnMargin: 2.21, intranetId: 10954, category: "ramy tekstylne akcesoria" },
  "adFrame Poster hanger set": { plnPrice: 102.2, plnMargin: 36.5, intranetId: 16735, category: "ramy tekstylne akcesoria" },
  "adFrame Quick Clips Plastikowy": { plnPrice: 3.052, plnMargin: 1.09, intranetId: 12405, category: "ramy tekstylne akcesoria" },
  "adFrame SAF/SWF - sklep - klej do płytki": { plnPrice: 10.108, plnMargin: 3.61, intranetId: 15897, category: "ramy tekstylne akcesoria" },
  "adFrame SAF/SWF - sklep - płytka metalowa": { plnPrice: 19.096, plnMargin: 6.82, intranetId: 15896, category: "ramy tekstylne akcesoria" },
  "adFrame Smart 100x250 zasilacz": { plnPrice: 319.032, plnMargin: 113.94, intranetId: 17051, category: "ramy tekstylne akcesoria" },
  "adFrame Smart 200x250 support komplet rurek": { plnPrice: 63.896, plnMargin: 22.82, intranetId: 17056, category: "ramy tekstylne akcesoria" },
  "adFrame Smart 200x250 torba z wkładem": { plnPrice: 282.324, plnMargin: 100.83, intranetId: 19571, category: "ramy tekstylne akcesoria" },
  "adFrame Smart 200x250 zasilacz": { plnPrice: 704.424, plnMargin: 251.58, intranetId: 17052, category: "ramy tekstylne akcesoria" },
  "adFrame Smart 300x250 torba bez pianki": { plnPrice: 342.132, plnMargin: 122.19, intranetId: 17057, category: "ramy tekstylne akcesoria" },
  "adFrame Smart 300x250 zasilacz": { plnPrice: 675.864, plnMargin: 241.38, intranetId: 17053, category: "ramy tekstylne akcesoria" },
  "adFrame Smart Clips Plastikowy": { plnPrice: 2.8, plnMargin: 1.0, intranetId: 12407, category: "ramy tekstylne akcesoria" },
  "adFrame Smart stopa boczna": { plnPrice: 79.576, plnMargin: 28.42, intranetId: 14035, category: "ramy tekstylne akcesoria" },
  "adFrame Smart stopa płaska": { plnPrice: 73.164, plnMargin: 26.13, intranetId: 17439, category: "ramy tekstylne akcesoria" },
  "adFrame Smart Łącznik plastikowy 180°": { plnPrice: 27.58, plnMargin: 9.85, intranetId: 12404, category: "ramy tekstylne akcesoria" },
  "adFrame Smart Łącznik plastikowy 45°": { plnPrice: 26.964, plnMargin: 9.63, intranetId: 18269, category: "ramy tekstylne akcesoria" },
  "adFrame Smart Łącznik plastikowy 90°": { plnPrice: 46.424, plnMargin: 16.58, intranetId: 12406, category: "ramy tekstylne akcesoria" },
  "adFrame Smart Łącznik T": { plnPrice: 26.964, plnMargin: 9.63, intranetId: 14037, category: "ramy tekstylne akcesoria" },
  "adFrame STF/STFL wieszak": { plnPrice: 81.62, plnMargin: 29.15, intranetId: 10944, category: "ramy tekstylne akcesoria" },
  "adFrame STFL łącznik 180°": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 11908, category: "ramy tekstylne akcesoria" },
  "adFrame stopa LMD/LMS": { plnPrice: 153.3, plnMargin: 54.75, intranetId: 10950, category: "ramy tekstylne akcesoria" },
  "adFrame stopa LMD/LMS LIGHT": { plnPrice: 25.788, plnMargin: 9.21, intranetId: 19091, category: "ramy tekstylne akcesoria" },
  "adFrame support 180° łącznik": { plnPrice: 13.468, plnMargin: 4.81, intranetId: 11131, category: "ramy tekstylne akcesoria" },
  "adFrame support zamek": { plnPrice: 6.496, plnMargin: 2.32, intranetId: 10949, category: "ramy tekstylne akcesoria" },
  "adFrame ŁĄCZNIK LMD/LMD (gwintowany)": { plnPrice: 65.912, plnMargin: 23.54, intranetId: 17420, category: "ramy tekstylne akcesoria" },
  "Kabel zasilający do zasilacza (AC 3PIN) 1,8m": { plnPrice: 15.568, plnMargin: 5.56, intranetId: 12129, category: "ramy tekstylne akcesoria" },
  "Kabel zasilający do zasilacza (AC 3PIN) UK": { plnPrice: 210.784, plnMargin: 75.28, intranetId: 12663, category: "ramy tekstylne akcesoria" },
  "Korpus złącza PHM żeński": { plnPrice: 0.224, plnMargin: 0.08, intranetId: 13424, category: "ramy tekstylne akcesoria" },
  "Korpus złącza PWM męski": { plnPrice: 0.168, plnMargin: 0.06, intranetId: 13426, category: "ramy tekstylne akcesoria" },
  "mFrame MASKOWNICA LED 992 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18540, category: "ramy tekstylne akcesoria" },
  "mFrame MASKOWNICA LED PROFIL": { plnPrice: 35.952, plnMargin: 12.84, intranetId: 18227, category: "ramy tekstylne akcesoria" },
  "Oświetlenie AdframeLED NORMAL 45cm": { plnPrice: 100.352, plnMargin: 35.84, intranetId: 11794, category: "ramy tekstylne akcesoria" },
  "Oświetlenie AdframeLED NORMAL LED 50cm 16W ver2": { plnPrice: 47.544, plnMargin: 16.98, intranetId: 18633, category: "ramy tekstylne akcesoria" },
  "Oświetlenie AdframeLED POWER LED 20cm 9W ver2": { plnPrice: 34.944, plnMargin: 12.48, intranetId: 18625, category: "ramy tekstylne akcesoria" },
  "Oświetlenie AdframeLED POWER LED 25cm": { plnPrice: 56.56, plnMargin: 20.2, intranetId: 11448, category: "ramy tekstylne akcesoria" },
  "Oświetlenie AdframeLED POWER LED 30cm 13W ver2": { plnPrice: 45.808, plnMargin: 16.36, intranetId: 18627, category: "ramy tekstylne akcesoria" },
  "Oświetlenie AdframeLED POWER LED 50cm 22W ver2": { plnPrice: 66.248, plnMargin: 23.66, intranetId: 18628, category: "ramy tekstylne akcesoria" },
  "profil CTF": { plnPrice: 42.672, plnMargin: 15.24, intranetId: 12099, category: "ramy tekstylne akcesoria" },
  "profil h": { plnPrice: 13.468, plnMargin: 4.81, intranetId: 17721, category: "ramy tekstylne akcesoria" },
  "profil LMD": { plnPrice: 136.052, plnMargin: 48.59, intranetId: 10933, category: "ramy tekstylne akcesoria" },
  "profil LMD odchudzony": { plnPrice: 110.18, plnMargin: 39.35, intranetId: 18517, category: "ramy tekstylne akcesoria" },
  "profil support light": { plnPrice: 30.324, plnMargin: 10.83, intranetId: 11951, category: "ramy tekstylne akcesoria" },
  "Przedłużacz z uziemieniem 5 gniazd, 10m biały": { plnPrice: 97.412, plnMargin: 34.79, intranetId: 18822, category: "ramy tekstylne akcesoria" },
  "Torba do adFrame Quick 100x250 - na kółkach": { plnPrice: 615.72, plnMargin: 219.9, intranetId: 12435, category: "ramy tekstylne akcesoria" },
  "Wtyczka UK": { plnPrice: 45.36, plnMargin: 16.2, intranetId: 16135, category: "ramy tekstylne akcesoria" },
  "Zasilacz wewnętrzny 100W 24V": { plnPrice: 170.52, plnMargin: 60.9, intranetId: 11422, category: "ramy tekstylne akcesoria" },
  "Zasilacz wewnętrzny 150W 24V": { plnPrice: 129.36, plnMargin: 46.2, intranetId: 11500, category: "ramy tekstylne akcesoria" },
  "Zasilacz wewnętrzny 200W 24V": { plnPrice: 128.604, plnMargin: 45.93, intranetId: 11501, category: "ramy tekstylne akcesoria" },
  "Zasilacz zewnętrzny 220W 24V": { plnPrice: 694.988, plnMargin: 248.21, intranetId: 10386, category: "ramy tekstylne akcesoria" },
  "Zasilacz zewnętrzny 300W 24V": { plnPrice: 886.844, plnMargin: 316.73, intranetId: 13996, category: "ramy tekstylne akcesoria" },
  "złączka LED": { plnPrice: 0.084, plnMargin: 0.03, intranetId: 16965, category: "ramy tekstylne akcesoria" },
  "złączka LED - Jack 3,5mm 10cm męski": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17438, category: "ramy tekstylne akcesoria" },

  // --- Kategoria: ramy tekstylne custom niepodświetlane ---
  "adFrame CTF": { plnPrice: 1858.024, plnMargin: 663.58, intranetId: 18337, category: "ramy tekstylne custom niepodświetlane" },
  "adFrame CTF (bez wydruku)": { plnPrice: 635.04, plnMargin: 226.8, intranetId: 12160, category: "ramy tekstylne custom niepodświetlane" },
  "adFrame DTF": { plnPrice: 1421.812, plnMargin: 507.79, intranetId: 18256, category: "ramy tekstylne custom niepodświetlane" },
  "adFrame DTF (bez wydruku)": { plnPrice: 1110.312, plnMargin: 396.54, intranetId: 10332, category: "ramy tekstylne custom niepodświetlane" },
  "adFrame STF": { plnPrice: 607.796, plnMargin: 217.07, intranetId: 18254, category: "ramy tekstylne custom niepodświetlane" },
  "adFrame STFL": { plnPrice: 371.952, plnMargin: 132.84, intranetId: 18255, category: "ramy tekstylne custom niepodświetlane" },
  "adFrame STFL (bez wydruku)": { plnPrice: 147.448, plnMargin: 52.66, intranetId: 10594, category: "ramy tekstylne custom niepodświetlane" },

  // --- Kategoria: ramy tekstylne custom podświetlane ---
  "adFrame LMD": { plnPrice: 2424.688, plnMargin: 865.96, intranetId: 18251, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMD (bez wydruku)": { plnPrice: 1960.868, plnMargin: 700.31, intranetId: 10334, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMD (bez wydruku) NoLed": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19368, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMS": { plnPrice: 2427.124, plnMargin: 866.83, intranetId: 18252, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMS (bez wydruku)": { plnPrice: 2195.2, plnMargin: 784.0, intranetId: 10331, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMSM": { plnPrice: 1599.136, plnMargin: 571.12, intranetId: 18253, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMSM (bez wydruku)": { plnPrice: 1367.24, plnMargin: 488.3, intranetId: 10444, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMSM Mframe": { plnPrice: 1624.784, plnMargin: 580.28, intranetId: 18338, category: "ramy tekstylne custom podświetlane" },
  "adFrame LMSM Mframe (bez wydruku)": { plnPrice: 1331.344, plnMargin: 475.48, intranetId: 11926, category: "ramy tekstylne custom podświetlane" },
  "adFrame SLM (bez wydruku)": { plnPrice: 1540.028, plnMargin: 550.01, intranetId: 18912, category: "ramy tekstylne custom podświetlane" },

  // --- Kategoria: ramy tekstylne p&p ---
  "Adframe Flex Led 200x250": { plnPrice: 2786.0, plnMargin: 995.0, intranetId: 18555, category: "ramy tekstylne p&p" },
  "Adframe Flex Led 200x250 (bez wydruku)": { plnPrice: 2626.176, plnMargin: 937.92, intranetId: 18414, category: "ramy tekstylne p&p" },
  "Adframe Flex Led 300x250": { plnPrice: 3547.348, plnMargin: 1266.91, intranetId: 18558, category: "ramy tekstylne p&p" },
  "Adframe Flex Led 300x250 (bez wydruku)": { plnPrice: 3319.288, plnMargin: 1185.46, intranetId: 18415, category: "ramy tekstylne p&p" },
  "Adframe Flex Led 300x250 ver2.0 (bez wydruku)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19794, category: "ramy tekstylne p&p" },
  "Adframe Flex Led 400x250": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18559, category: "ramy tekstylne p&p" },
  "Adframe Flex Led 400x250 (bez wydruku)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18848, category: "ramy tekstylne p&p" },
  "Adframe Flex Led extension set 100x250 ver2.0 (bez wydruku)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19795, category: "ramy tekstylne p&p" },
  "Adframe Flex Led extension set 100x250 W KARTONIE": { plnPrice: 842.212, plnMargin: 300.79, intranetId: 19260, category: "ramy tekstylne p&p" },
  "adFrame LPO 100x200": { plnPrice: 1435.448, plnMargin: 512.66, intranetId: 16286, category: "ramy tekstylne p&p" },
  "adFrame LPO 100x200 (bez wydruku)": { plnPrice: 1354.08, plnMargin: 483.6, intranetId: 16198, category: "ramy tekstylne p&p" },
  "adFrame LPO 100x293": { plnPrice: 2274.944, plnMargin: 812.48, intranetId: 16287, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB 100x200cm (bez wydruku)": { plnPrice: 5297.292, plnMargin: 1891.89, intranetId: 18170, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB 100x200cm dwustronny": { plnPrice: 5460.056, plnMargin: 1950.02, intranetId: 18424, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB 100x250 cm (bez wydruku)": { plnPrice: 5718.384, plnMargin: 2042.28, intranetId: 18171, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB 100x250 cm dwustronny": { plnPrice: 5899.908, plnMargin: 2107.11, intranetId: 18430, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB 300x250 cm (bez wydruku)": { plnPrice: 12116.188, plnMargin: 4327.21, intranetId: 18172, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB 300x250 cm dwustronny": { plnPrice: 12572.336, plnMargin: 4490.12, intranetId: 18431, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB tacka": { plnPrice: 202.048, plnMargin: 72.16, intranetId: 18527, category: "ramy tekstylne p&p" },
  "adFrame Lumina RGB uchwyt na ulotki": { plnPrice: 229.46, plnMargin: 81.95, intranetId: 18529, category: "ramy tekstylne p&p" },
  "adFrame Poster 100x100": { plnPrice: 756.028, plnMargin: 270.01, intranetId: 16744, category: "ramy tekstylne p&p" },
  "adFrame Poster 100x150": { plnPrice: 933.828, plnMargin: 333.51, intranetId: 16745, category: "ramy tekstylne p&p" },
  "adFrame Poster 100x200": { plnPrice: 1062.04, plnMargin: 379.3, intranetId: 16746, category: "ramy tekstylne p&p" },
  "adFrame Poster 100x300": { plnPrice: 1576.26, plnMargin: 562.95, intranetId: 16748, category: "ramy tekstylne p&p" },
  "adFrame Poster 100x300 (bez wydruku)": { plnPrice: 1356.768, plnMargin: 484.56, intranetId: 16732, category: "ramy tekstylne p&p" },
  "adFrame Poster 70x100": { plnPrice: 667.492, plnMargin: 238.39, intranetId: 16749, category: "ramy tekstylne p&p" },
  "adFrame Poster 70x100 (bez wydruku)": { plnPrice: 604.996, plnMargin: 216.07, intranetId: 16733, category: "ramy tekstylne p&p" },
  "adFrame Quick 100x200 ver 2.0 w torbie na kółkach (bez wydruku)": { plnPrice: 1197.812, plnMargin: 427.79, intranetId: 17872, category: "ramy tekstylne p&p" },
  "adFrame Quick 100x200 wersja 2.0 w torbie na kółkach": { plnPrice: 1360.576, plnMargin: 485.92, intranetId: 17889, category: "ramy tekstylne p&p" },
  "adFrame Quick 100x250 ver 2.0 w torbie na kółkach": { plnPrice: 1707.72, plnMargin: 609.9, intranetId: 17949, category: "ramy tekstylne p&p" },
  "adFrame Quick 100x250 w torbie na kółkach": { plnPrice: 1754.116, plnMargin: 626.47, intranetId: 12274, category: "ramy tekstylne p&p" },
  "adFrame Quick 85x200 wersja 2.0": { plnPrice: 1317.876, plnMargin: 470.67, intranetId: 18111, category: "ramy tekstylne p&p" },
  "adFrame Quick 85x250 wersja 2.0": { plnPrice: 1607.256, plnMargin: 574.02, intranetId: 18114, category: "ramy tekstylne p&p" },
  "adFrame Quick Battery - narożnik": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 18345, category: "ramy tekstylne p&p" },
  "adFrame Quick Battery - zasilacz": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18344, category: "ramy tekstylne p&p" },
  "adFrame Quick Battery 100x200": { plnPrice: 3908.968, plnMargin: 1396.06, intranetId: 16127, category: "ramy tekstylne p&p" },
  "adFrame Quick Battery 100x200 (bez wydruku)": { plnPrice: 3740.492, plnMargin: 1335.89, intranetId: 16125, category: "ramy tekstylne p&p" },
  "adFrame Quick Budget 100x200 (bez wydruku)": { plnPrice: 511.532, plnMargin: 182.69, intranetId: 13480, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Black 100x200": { plnPrice: 1451.772, plnMargin: 518.49, intranetId: 19033, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case BLACK 100x200 (bez wydruku)": { plnPrice: 1289.008, plnMargin: 460.36, intranetId: 18809, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Black 100x250": { plnPrice: 1715.616, plnMargin: 612.72, intranetId: 19031, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case BLACK 100x250 (bez wydruku)": { plnPrice: 1534.036, plnMargin: 547.87, intranetId: 18811, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Black 85x200": { plnPrice: 1419.824, plnMargin: 507.08, intranetId: 19070, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Silver 100x200": { plnPrice: 1429.904, plnMargin: 510.68, intranetId: 19072, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Silver 100x200 (bez wydruku)": { plnPrice: 1267.14, plnMargin: 452.55, intranetId: 19004, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Silver 100x250": { plnPrice: 1682.828, plnMargin: 601.01, intranetId: 19073, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Silver 100x250 (bez wydruku)": { plnPrice: 1501.276, plnMargin: 536.17, intranetId: 19005, category: "ramy tekstylne p&p" },
  "adFrame Quick Safe Case Silver 85x200": { plnPrice: 1397.984, plnMargin: 499.28, intranetId: 19071, category: "ramy tekstylne p&p" },
  "adFrame Quick Single zasilacz": { plnPrice: 160.58, plnMargin: 57.35, intranetId: 17865, category: "ramy tekstylne p&p" },
  "adFrame Quick Slim - narożnik": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18610, category: "ramy tekstylne p&p" },
  "adFrame Quick Slim - support": { plnPrice: 12.74, plnMargin: 4.55, intranetId: 18611, category: "ramy tekstylne p&p" },
  "adFrame Slim 100x200 - 65mm (bez wydruku)": { plnPrice: 797.3, plnMargin: 284.75, intranetId: 17987, category: "ramy tekstylne p&p" },
  "adFrame Slim 100x200 - 65mm dwustronny": { plnPrice: 960.036, plnMargin: 342.87, intranetId: 18105, category: "ramy tekstylne p&p" },
  "adFrame Slim 100x200 - 65mm jednostronny (tył blockout)": { plnPrice: 986.888, plnMargin: 352.46, intranetId: 18109, category: "ramy tekstylne p&p" },
  "adFrame Slim 100x250 - 65mm (bez wydruku)": { plnPrice: 939.288, plnMargin: 335.46, intranetId: 18321, category: "ramy tekstylne p&p" },
  "adFrame Slim 100x250 - 65mm dwustronny": { plnPrice: 1115.66, plnMargin: 398.45, intranetId: 18534, category: "ramy tekstylne p&p" },
  "adFrame Slim 100x250 - 65mm jednostronny (tył blockout)": { plnPrice: 1135.708, plnMargin: 405.61, intranetId: 18538, category: "ramy tekstylne p&p" },
  "adFrame Smart 100x200": { plnPrice: 2030.448, plnMargin: 725.16, intranetId: 12226, category: "ramy tekstylne p&p" },
  "adFrame Smart 100x200 (bez wydruku)": { plnPrice: 1866.592, plnMargin: 666.64, intranetId: 12227, category: "ramy tekstylne p&p" },
  "adFrame Smart 100x250": { plnPrice: 2078.496, plnMargin: 742.32, intranetId: 12232, category: "ramy tekstylne p&p" },
  "adFrame Smart 100x250 (bez wydruku)": { plnPrice: 1895.824, plnMargin: 677.08, intranetId: 12233, category: "ramy tekstylne p&p" },
  "adFrame Smart 200x200": { plnPrice: 3727.64, plnMargin: 1331.3, intranetId: 14242, category: "ramy tekstylne p&p" },
  "adFrame Smart 200x250": { plnPrice: 3758.356, plnMargin: 1342.27, intranetId: 14238, category: "ramy tekstylne p&p" },
  "adFrame Smart 200x250 (bez wydruku)": { plnPrice: 3438.708, plnMargin: 1228.11, intranetId: 13606, category: "ramy tekstylne p&p" },
  "adFrame Smart 300x200": { plnPrice: 4982.544, plnMargin: 1779.48, intranetId: 15793, category: "ramy tekstylne p&p" },
  "adFrame Smart 300x250": { plnPrice: 5025.076, plnMargin: 1794.67, intranetId: 12235, category: "ramy tekstylne p&p" },
  "adFrame Smart 300x250 (bez wydruku)": { plnPrice: 4568.928, plnMargin: 1631.76, intranetId: 12236, category: "ramy tekstylne p&p" },
  "adFrame Smart 85x250": { plnPrice: 1928.808, plnMargin: 688.86, intranetId: 17563, category: "ramy tekstylne p&p" },
  "adFrame Starter 100x200 (bez wydruku)": { plnPrice: 480.536, plnMargin: 171.62, intranetId: 18663, category: "ramy tekstylne p&p" },
  "adFrame Starter 100x200 DWUSTRONNY": { plnPrice: 643.272, plnMargin: 229.74, intranetId: 15521, category: "ramy tekstylne p&p" },
  "adFrame Starter 100x250 DWUSTRONNY": { plnPrice: 703.892, plnMargin: 251.39, intranetId: 15522, category: "ramy tekstylne p&p" },
  "adFrame SWF - sklep - wieszak na magnes": { plnPrice: 16.38, plnMargin: 5.85, intranetId: 15892, category: "ramy tekstylne p&p" },
  "adTribune Lumina RGB": { plnPrice: 3897.376, plnMargin: 1391.92, intranetId: 18983, category: "ramy tekstylne p&p" },
  "adTribune Lumina RGB (bez wydruku)": { plnPrice: 3743.936, plnMargin: 1337.12, intranetId: 18664, category: "ramy tekstylne p&p" },
  "LuminaStick 250 cm": { plnPrice: 4970.756, plnMargin: 1775.27, intranetId: 18173, category: "ramy tekstylne p&p" },
  "POKAZÓWKA_adTribune Cubic": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18433, category: "ramy tekstylne p&p" },
  "Pop-up Lightbox 100x200": { plnPrice: 1443.596, plnMargin: 515.57, intranetId: 17862, category: "ramy tekstylne p&p" },
  "Pop-up Lightbox 100x200 (bez wydruku)": { plnPrice: 1280.86, plnMargin: 457.45, intranetId: 17789, category: "ramy tekstylne p&p" },
  "Pop-up Lightbox łącznik 180 plastikowy": { plnPrice: 5.6, plnMargin: 2.0, intranetId: 18656, category: "ramy tekstylne p&p" },
  "Pop-up Lightbox/Adtribune 100x200 support": { plnPrice: 5.6, plnMargin: 2.0, intranetId: 18646, category: "ramy tekstylne p&p" },
  "Pop-up Lightbox/Adtribune 100x200 ZAWIAS 180": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18647, category: "ramy tekstylne p&p" },
  "SEGO Mini Display Stand 100x250": { plnPrice: 604.24, plnMargin: 215.8, intranetId: 13697, category: "ramy tekstylne p&p" },
  "SET3 - Zestaw konferencyjny Premium LED": { plnPrice: 6729.94, plnMargin: 2403.55, intranetId: 18086, category: "ramy tekstylne p&p" },
  "Torba do adFrame Quick Single 100x200": { plnPrice: 130.536, plnMargin: 46.62, intranetId: 18257, category: "ramy tekstylne p&p" },
  "Walizka do adFrame Quick Safe Case": { plnPrice: 334.656, plnMargin: 119.52, intranetId: 19231, category: "ramy tekstylne p&p" },
  "Wydruk adFrame Slim 100x200 - 65mm": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 18106, category: "ramy tekstylne p&p" },
  "Wydruk adFrame Slim 100x200 - 65mm tył": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 18107, category: "ramy tekstylne p&p" },
  "Wydruk adFrame Slim 100x200 - 65mm tył Blockout": { plnPrice: 108.22, plnMargin: 38.65, intranetId: 18108, category: "ramy tekstylne p&p" },
  "Wydruk adFrame Slim 100x250 - 65mm": { plnPrice: 88.172, plnMargin: 31.49, intranetId: 18535, category: "ramy tekstylne p&p" },
  "Wydruk adFrame Slim 100x250 - 65mm tył Blockout": { plnPrice: 108.22, plnMargin: 38.65, intranetId: 18537, category: "ramy tekstylne p&p" },
  "Wydruk adTribune Lumina RGB": { plnPrice: 76.72, plnMargin: 27.4, intranetId: 18984, category: "ramy tekstylne p&p" },

  // --- Kategoria: ramy tekstylne standard niepodświetlane ---
  "adFrame CTF 100x100x100": { plnPrice: 1374.604, plnMargin: 490.93, intranetId: 15131, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame CTF 100x50x100": { plnPrice: 1117.9, plnMargin: 399.25, intranetId: 15132, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame CTF 200x200x100": { plnPrice: 1956.304, plnMargin: 698.68, intranetId: 15134, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame CTF 50x50x50": { plnPrice: 845.88, plnMargin: 302.1, intranetId: 15138, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame CTF 50x50x50 LED": { plnPrice: 1098.72, plnMargin: 392.4, intranetId: 18952, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 100x200": { plnPrice: 1205.932, plnMargin: 430.69, intranetId: 14560, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 150x200": { plnPrice: 1312.332, plnMargin: 468.69, intranetId: 14548, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 200x200": { plnPrice: 1757.84, plnMargin: 627.8, intranetId: 14550, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 200x200 (bez wydruku)": { plnPrice: 1368.388, plnMargin: 488.71, intranetId: 14489, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 200x250": { plnPrice: 1852.928, plnMargin: 661.76, intranetId: 14551, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 300x200": { plnPrice: 2153.48, plnMargin: 769.1, intranetId: 14552, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 300x250": { plnPrice: 2248.288, plnMargin: 802.96, intranetId: 14553, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 400x250": { plnPrice: 2787.904, plnMargin: 995.68, intranetId: 14555, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 500x200": { plnPrice: 3181.724, plnMargin: 1136.33, intranetId: 14556, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 500x250": { plnPrice: 3314.444, plnMargin: 1183.73, intranetId: 14557, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame DTF 600x250": { plnPrice: 3702.86, plnMargin: 1322.45, intranetId: 14559, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STF 100x100": { plnPrice: 520.8, plnMargin: 186.0, intranetId: 14580, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STF 100x200": { plnPrice: 727.944, plnMargin: 259.98, intranetId: 14566, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STF 150x200 (bez wydruku)": { plnPrice: 742.784, plnMargin: 265.28, intranetId: 14506, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STF 150x250": { plnPrice: 921.144, plnMargin: 328.98, intranetId: 14569, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STF 500x250": { plnPrice: 1961.26, plnMargin: 700.45, intranetId: 14577, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 100x100": { plnPrice: 404.18, plnMargin: 144.35, intranetId: 14582, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 100x200": { plnPrice: 516.096, plnMargin: 184.32, intranetId: 14583, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 100x250": { plnPrice: 548.744, plnMargin: 195.98, intranetId: 14584, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 150x200": { plnPrice: 552.412, plnMargin: 197.29, intranetId: 14585, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 300x200": { plnPrice: 819.448, plnMargin: 292.66, intranetId: 14589, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 300x250": { plnPrice: 852.796, plnMargin: 304.57, intranetId: 14590, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 400x250": { plnPrice: 980.56, plnMargin: 350.2, intranetId: 14591, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 600x250": { plnPrice: 1325.912, plnMargin: 473.54, intranetId: 14597, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL 70x100 (bez wydruku)": { plnPrice: 304.556, plnMargin: 108.77, intranetId: 18350, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL A0 84x118": { plnPrice: 394.996, plnMargin: 141.07, intranetId: 14599, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL A1 59x84": { plnPrice: 335.552, plnMargin: 119.84, intranetId: 14600, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL A1 59x84 (bez wydruku)": { plnPrice: 282.548, plnMargin: 100.91, intranetId: 14518, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL B1 70x100": { plnPrice: 365.904, plnMargin: 130.68, intranetId: 14601, category: "ramy tekstylne standard niepodświetlane" },
  "adFrame STFL B2 50x70": { plnPrice: 165.284, plnMargin: 59.03, intranetId: 14602, category: "ramy tekstylne standard niepodświetlane" },

  // --- Kategoria: ramy tekstylne standard podświetlane ---
  "adFrame LMD 100x250 PK": { plnPrice: 1821.12, plnMargin: 650.4, intranetId: 17098, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x200 ND (bez wydruku)": { plnPrice: 2365.16, plnMargin: 844.7, intranetId: 14069, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x200 NK": { plnPrice: 2480.268, plnMargin: 885.81, intranetId: 14068, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x200 NK (bez wydruku)": { plnPrice: 2233.924, plnMargin: 797.83, intranetId: 14067, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x200 NO": { plnPrice: 4110.876, plnMargin: 1468.17, intranetId: 14072, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x200 PD": { plnPrice: 2438.268, plnMargin: 870.81, intranetId: 14064, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x200 PO": { plnPrice: 3819.452, plnMargin: 1364.09, intranetId: 14066, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x250 ND": { plnPrice: 2996.448, plnMargin: 1070.16, intranetId: 14082, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x250 NK": { plnPrice: 2870.112, plnMargin: 1025.04, intranetId: 14080, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x250 PD": { plnPrice: 2929.276, plnMargin: 1046.17, intranetId: 14076, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 150x250 PK": { plnPrice: 2527.728, plnMargin: 902.76, intranetId: 14073, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x200 NK": { plnPrice: 3516.8, plnMargin: 1256.0, intranetId: 14091, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x200 PK": { plnPrice: 3111.444, plnMargin: 1111.23, intranetId: 14086, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x200 PK (bez wydruku)": { plnPrice: 2822.316, plnMargin: 1007.97, intranetId: 14087, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x200 PO": { plnPrice: 6373.948, plnMargin: 2276.41, intranetId: 14090, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x250 ND": { plnPrice: 3853.248, plnMargin: 1376.16, intranetId: 14105, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x250 NK": { plnPrice: 3749.48, plnMargin: 1339.1, intranetId: 14103, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x250 NO": { plnPrice: 6210.036, plnMargin: 2217.87, intranetId: 14107, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x250 PD": { plnPrice: 3538.78, plnMargin: 1263.85, intranetId: 14099, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x250 PK": { plnPrice: 3275.944, plnMargin: 1169.98, intranetId: 14095, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 200x250 PO": { plnPrice: 5545.064, plnMargin: 1980.38, intranetId: 14101, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x200 ND": { plnPrice: 3865.26, plnMargin: 1380.45, intranetId: 14118, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x200 NK": { plnPrice: 3655.288, plnMargin: 1305.46, intranetId: 14116, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x200 PD": { plnPrice: 3982.692, plnMargin: 1422.39, intranetId: 14112, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x200 PD (bez wydruku)": { plnPrice: 3531.556, plnMargin: 1261.27, intranetId: 14113, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x200 PK": { plnPrice: 3508.54, plnMargin: 1253.05, intranetId: 14109, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x200 PO": { plnPrice: 5988.052, plnMargin: 2138.59, intranetId: 14115, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x200 PO (bez wydruku)": { plnPrice: 5536.888, plnMargin: 1977.46, intranetId: 14114, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x250 ND": { plnPrice: 4369.288, plnMargin: 1560.46, intranetId: 14129, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x250 NK": { plnPrice: 4062.912, plnMargin: 1451.04, intranetId: 14127, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x250 PD": { plnPrice: 4123.532, plnMargin: 1472.69, intranetId: 14126, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x250 PD (bez wydruku)": { plnPrice: 3666.936, plnMargin: 1309.62, intranetId: 14125, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 300x250 PK": { plnPrice: 4140.304, plnMargin: 1478.68, intranetId: 14122, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 400x200 ND": { plnPrice: 4724.048, plnMargin: 1687.16, intranetId: 14136, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 400x250 ND": { plnPrice: 4862.984, plnMargin: 1736.78, intranetId: 14147, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 400x250 NO": { plnPrice: 8472.744, plnMargin: 3025.98, intranetId: 14149, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 400x250 PD": { plnPrice: 4760.588, plnMargin: 1700.21, intranetId: 14140, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 500x250 ND": { plnPrice: 5691.056, plnMargin: 2032.52, intranetId: 14167, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 500x250 PD": { plnPrice: 6350.456, plnMargin: 2268.02, intranetId: 14161, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 600x250 ND": { plnPrice: 6711.264, plnMargin: 2396.88, intranetId: 14185, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD 600x250 PD": { plnPrice: 6966.82, plnMargin: 2488.15, intranetId: 14181, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD LCD [ ] dzielona grafika": { plnPrice: 4110.876, plnMargin: 1468.17, intranetId: 18563, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMD LCD L dzielona grafika": { plnPrice: 2493.568, plnMargin: 890.56, intranetId: 18524, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 100x200 PD": { plnPrice: 2127.916, plnMargin: 759.97, intranetId: 14441, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 100x250 PD": { plnPrice: 2469.544, plnMargin: 881.98, intranetId: 14449, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 150x250 ND": { plnPrice: 2686.684, plnMargin: 959.53, intranetId: 14456, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 150x250 NO": { plnPrice: 3012.996, plnMargin: 1076.07, intranetId: 14458, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 200x250 PK": { plnPrice: 3060.4, plnMargin: 1093.0, intranetId: 14467, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 300x200 ND": { plnPrice: 3930.556, plnMargin: 1403.77, intranetId: 14475, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 300x200 PK": { plnPrice: 3468.948, plnMargin: 1238.91, intranetId: 14473, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 300x250 ND": { plnPrice: 4025.7, plnMargin: 1437.75, intranetId: 14481, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 500x200 NO": { plnPrice: 6752.928, plnMargin: 2411.76, intranetId: 14767, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMS 600x250 ND": { plnPrice: 6736.8, plnMargin: 2406.0, intranetId: 14776, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMSM 100x100 NK": { plnPrice: 1172.08, plnMargin: 418.6, intranetId: 14683, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMSM 100x200 ND": { plnPrice: 1785.924, plnMargin: 637.83, intranetId: 14690, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMSM 100x200 PD": { plnPrice: 1648.584, plnMargin: 588.78, intranetId: 14692, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMSM 150x200 ND (bez wydruku)": { plnPrice: 1877.12, plnMargin: 670.4, intranetId: 15174, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMSM 80x140 ND": { plnPrice: 1145.788, plnMargin: 409.21, intranetId: 14704, category: "ramy tekstylne standard podświetlane" },
  "adFrame LMSM 80x140 NK": { plnPrice: 1145.816, plnMargin: 409.22, intranetId: 14705, category: "ramy tekstylne standard podświetlane" },

  // --- Kategoria: rental ---
  "ekspres do kawy RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17153, category: "rental" },
  "lodówka RENTAL": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 16540, category: "rental" },
  "mFrame CLAMP CONNECTOR PLASTIC RENTAL": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18958, category: "rental" },
  "mFrame CLAMP CONNECTOR RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17229, category: "rental" },
  "mFrame MASKOWNICA PŁASKA 2480 Stan": { plnPrice: 125.216, plnMargin: 44.72, intranetId: 18688, category: "rental" },
  "mFrame MASKOWNICA PŁASKA 992": { plnPrice: 31.612, plnMargin: 11.29, intranetId: 18910, category: "rental" },
  "mFrame PIN SUPERSLIM 7CM RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17291, category: "rental" },
  "mFrame RAMA 496x1488 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16200, category: "rental" },
  "mFrame RAMA 496x1984 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16201, category: "rental" },
  "mFrame RAMA 496x2480 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15518, category: "rental" },
  "mFrame RAMA 496x2976 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17328, category: "rental" },
  "mFrame RAMA 496x992 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15333, category: "rental" },
  "mFrame RAMA 992x1488 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15335, category: "rental" },
  "mFrame RAMA 992x2480 DRZWI NEW RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19099, category: "rental" },
  "mFrame RAMA 992x2480 DRZWI RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 16107, category: "rental" },
  "mFrame RAMA 992x2480 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15336, category: "rental" },
  "mFrame RAMA 992x2976 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17278, category: "rental" },
  "mFrame RAMA 992x992 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15332, category: "rental" },
  "mFrame RAMA ŁUK 496x992 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15519, category: "rental" },
  "Podstawa do Krzesła Boliwia kolor czarny RENTAL": { plnPrice: 87.388, plnMargin: 31.21, intranetId: 17510, category: "rental" },
  "TELEWIZOR LCD 43\" RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16526, category: "rental" },
  "wieszak na ubrania RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17738, category: "rental" },

  // --- Kategoria: rollupy ---
  "adStand Basic 85 (bez wydruku)": { plnPrice: 93.016, plnMargin: 33.22, intranetId: 19075, category: "rollupy" },
  "Adstand Drop - 100 (bez wydruku)": { plnPrice: 276.444, plnMargin: 98.73, intranetId: 18443, category: "rollupy" },
  "Adstand Drop - 85 (bez wydruku)": { plnPrice: 253.428, plnMargin: 90.51, intranetId: 18442, category: "rollupy" },
  "adStand Drop 100": { plnPrice: 338.38, plnMargin: 120.85, intranetId: 18660, category: "rollupy" },
  "adStand Drop 120": { plnPrice: 399.336, plnMargin: 142.62, intranetId: 18662, category: "rollupy" },
  "adStand Drop 85": { plnPrice: 307.412, plnMargin: 109.79, intranetId: 18661, category: "rollupy" },
  "adStand Eco 100": { plnPrice: 206.584, plnMargin: 73.78, intranetId: 10205, category: "rollupy" },
  "adStand Eco 85": { plnPrice: 189.28, plnMargin: 67.6, intranetId: 10206, category: "rollupy" },
  "adStand Level 85": { plnPrice: 678.384, plnMargin: 242.28, intranetId: 10176, category: "rollupy" },
  "adStand Light 85": { plnPrice: 144.984, plnMargin: 51.78, intranetId: 12261, category: "rollupy" },
  "adStand Light 85 (bez wydruku)": { plnPrice: 91.0, plnMargin: 32.5, intranetId: 12262, category: "rollupy" },
  "adStand Lux 100": { plnPrice: 275.828, plnMargin: 98.51, intranetId: 10092, category: "rollupy" },
  "adStand Lux 100 (bez wydruku)": { plnPrice: 213.892, plnMargin: 76.39, intranetId: 10093, category: "rollupy" },
  "adStand Lux 120": { plnPrice: 395.808, plnMargin: 141.36, intranetId: 10178, category: "rollupy" },
  "adStand Lux 85": { plnPrice: 243.6, plnMargin: 87.0, intranetId: 10200, category: "rollupy" },
  "adStand Octa 85": { plnPrice: 352.968, plnMargin: 126.06, intranetId: 19409, category: "rollupy" },
  "adStand Premium 100": { plnPrice: 562.016, plnMargin: 200.72, intranetId: 9, category: "rollupy" },
  "adStand Premium 120": { plnPrice: 607.488, plnMargin: 216.96, intranetId: 10, category: "rollupy" },
  "adStand Premium 150": { plnPrice: 754.068, plnMargin: 269.31, intranetId: 10133, category: "rollupy" },
  "adStand Premium 85": { plnPrice: 462.924, plnMargin: 165.33, intranetId: 7, category: "rollupy" },
  "Adstand Premium CN 100 (bez wydruku)": { plnPrice: 500.08, plnMargin: 178.6, intranetId: 18439, category: "rollupy" },
  "adStand R3 Black 100": { plnPrice: 181.16, plnMargin: 64.7, intranetId: 19160, category: "rollupy" },
  "adStand R3 Black 85": { plnPrice: 147.98, plnMargin: 52.85, intranetId: 19159, category: "rollupy" },
  "adStand R3 Black 85 (bez wydruku)": { plnPrice: 93.996, plnMargin: 33.57, intranetId: 19079, category: "rollupy" },
  "adStand Twins 85": { plnPrice: 438.424, plnMargin: 156.58, intranetId: 10098, category: "rollupy" },
  "POKAZÓWKA_adStand Basic 85": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19345, category: "rollupy" },

  // --- Kategoria: rollupy akcesoria ---
  "Listwa adStand ECO/LUX/TWINS/R3 100": { plnPrice: 9.24, plnMargin: 3.3, intranetId: 12242, category: "rollupy akcesoria" },
  "Listwa L150 G / Adstand 150 pomalowana": { plnPrice: 63.14, plnMargin: 22.55, intranetId: 11412, category: "rollupy akcesoria" },
  "Listwa L200 D pomalowana": { plnPrice: 85.372, plnMargin: 30.49, intranetId: 11417, category: "rollupy akcesoria" },
  "Torba adStand 100": { plnPrice: 48.076, plnMargin: 17.17, intranetId: 10156, category: "rollupy akcesoria" },
  "Torba adStand 150": { plnPrice: 102.564, plnMargin: 36.63, intranetId: 10158, category: "rollupy akcesoria" },
  "Torba L150": { plnPrice: 258.3, plnMargin: 92.25, intranetId: 10220, category: "rollupy akcesoria" },
  "Torba L200": { plnPrice: 206.416, plnMargin: 73.72, intranetId: 10221, category: "rollupy akcesoria" },

  // --- Kategoria: stoiska degustacyjne ---
  "adBox Elypse": { plnPrice: 1098.272, plnMargin: 392.24, intranetId: 10112, category: "stoiska degustacyjne" },
  "adBox Elypse (bez wydruku)": { plnPrice: 947.744, plnMargin: 338.48, intranetId: 10131, category: "stoiska degustacyjne" },
  "adBox Elypse Mini": { plnPrice: 960.96, plnMargin: 343.2, intranetId: 10113, category: "stoiska degustacyjne" },
  "adBox Elypse Mini (bez wydruku)": { plnPrice: 780.92, plnMargin: 278.9, intranetId: 10138, category: "stoiska degustacyjne" },
  "adBox Hit": { plnPrice: 1013.488, plnMargin: 361.96, intranetId: 17, category: "stoiska degustacyjne" },
  "adBox Hit (bez wydruku)": { plnPrice: 839.524, plnMargin: 299.83, intranetId: 10016, category: "stoiska degustacyjne" },
  "adBox Hit C": { plnPrice: 1241.604, plnMargin: 443.43, intranetId: 10359, category: "stoiska degustacyjne" },
  "adBox Hit Mini": { plnPrice: 948.668, plnMargin: 338.81, intranetId: 10103, category: "stoiska degustacyjne" },
  "adBox Ring": { plnPrice: 1018.556, plnMargin: 363.77, intranetId: 10275, category: "stoiska degustacyjne" },
  "adBox Standard": { plnPrice: 2354.24, plnMargin: 840.8, intranetId: 18, category: "stoiska degustacyjne" },

  // --- Kategoria: stoiska degustacyjne akcesoria ---
  "adBox Elypse blat": { plnPrice: 206.724, plnMargin: 73.83, intranetId: 11336, category: "stoiska degustacyjne akcesoria" },
  "adbox Elypse Mini toper": { plnPrice: 46.788, plnMargin: 16.71, intranetId: 11918, category: "stoiska degustacyjne akcesoria" },
  "adBox Elypse toper": { plnPrice: 77.112, plnMargin: 27.54, intranetId: 10274, category: "stoiska degustacyjne akcesoria" },
  "adBox Ring toper": { plnPrice: 47.852, plnMargin: 17.09, intranetId: 11909, category: "stoiska degustacyjne akcesoria" },
  "adBox Standard blat": { plnPrice: 283.864, plnMargin: 101.38, intranetId: 11343, category: "stoiska degustacyjne akcesoria" },
  "adBox Standard toper": { plnPrice: 46.788, plnMargin: 16.71, intranetId: 11919, category: "stoiska degustacyjne akcesoria" },
  "AS Maszt CN (zestaw 2 szt)": { plnPrice: 59.276, plnMargin: 21.17, intranetId: 18599, category: "stoiska degustacyjne akcesoria" },
  "ELYPSE komplet blat+półka CN": { plnPrice: 340.928, plnMargin: 121.76, intranetId: 18622, category: "stoiska degustacyjne akcesoria" },
  "kółko fi 40 oś gwint M8 z hamulcem": { plnPrice: 1.092, plnMargin: 0.39, intranetId: 12358, category: "stoiska degustacyjne akcesoria" },

  // --- Kategoria: stojaki reklamowe ---
  "adFolder A4 (bez wydruku)": { plnPrice: 526.064, plnMargin: 187.88, intranetId: 10094, category: "stojaki reklamowe" },
  "adFolder A4 z nadstawką": { plnPrice: 602.0, plnMargin: 215.0, intranetId: 19107, category: "stojaki reklamowe" },
  "adFolder Premium (bez wydruku)": { plnPrice: 882.056, plnMargin: 315.02, intranetId: 10259, category: "stojaki reklamowe" },
  "adFolder Prestige 4 komory (bez wydruku)": { plnPrice: 769.58, plnMargin: 274.85, intranetId: 13932, category: "stojaki reklamowe" },
  "adFolder Prestige 4 komory z nadstawką": { plnPrice: 804.104, plnMargin: 287.18, intranetId: 19108, category: "stojaki reklamowe" },

  // --- Kategoria: stojaki reklamowe akcesoria ---
  "adFolder A4 nadstawka": { plnPrice: 75.936, plnMargin: 27.12, intranetId: 12315, category: "stojaki reklamowe akcesoria" },
  "adFolder A4 nadstawka (bez wydruku)": { plnPrice: 64.736, plnMargin: 23.12, intranetId: 12312, category: "stojaki reklamowe akcesoria" },
  "Worek na wydruki M (50*70cm)": { plnPrice: 0.756, plnMargin: 0.27, intranetId: 12431, category: "stojaki reklamowe akcesoria" },

  // --- Kategoria: systemy podwieszane ---
  "adFrame CTF 100x100x100 Hanging LED": { plnPrice: 1869.364, plnMargin: 667.63, intranetId: 15225, category: "systemy podwieszane" },
  "adFrame CTF 100x100x100 Hanging LED (bez wydruku)": { plnPrice: 1225.196, plnMargin: 437.57, intranetId: 15226, category: "systemy podwieszane" },
  "adFrame CTF 100x100x100 LED": { plnPrice: 1729.392, plnMargin: 617.64, intranetId: 17928, category: "systemy podwieszane" },
  "adFrame CTF 100x100x100 LED (bez wydruku)": { plnPrice: 1086.596, plnMargin: 388.07, intranetId: 17926, category: "systemy podwieszane" },
  "adFrame CTF 150x100x150 Hanging": { plnPrice: 1811.096, plnMargin: 646.82, intranetId: 15839, category: "systemy podwieszane" },
  "adFrame CTF 150x100x150 Hanging LED": { plnPrice: 2842.448, plnMargin: 1015.16, intranetId: 15227, category: "systemy podwieszane" },
  "adFrame CTF 150x100x150 Hanging LED (bez wydruku)": { plnPrice: 2228.688, plnMargin: 795.96, intranetId: 15228, category: "systemy podwieszane" },
  "adFrame CTF 150x150x150 Hanging": { plnPrice: 2067.8, plnMargin: 738.5, intranetId: 15842, category: "systemy podwieszane" },
  "adFrame CTF 150x150x150 Hanging LED": { plnPrice: 3064.404, plnMargin: 1094.43, intranetId: 15229, category: "systemy podwieszane" },
  "adFrame CTF 150x150x150 Hanging LED (bez wydruku)": { plnPrice: 2314.032, plnMargin: 826.44, intranetId: 15230, category: "systemy podwieszane" },
  "adFrame CTF Hanging": { plnPrice: 2387.98, plnMargin: 852.85, intranetId: 18690, category: "systemy podwieszane" },
  "adFrame CTF Hanging LED": { plnPrice: 1852.564, plnMargin: 661.63, intranetId: 16131, category: "systemy podwieszane" },
  "adFrame CTF LED": { plnPrice: 1556.548, plnMargin: 555.91, intranetId: 18924, category: "systemy podwieszane" },
  "adFrame CTF LED (bez wydruku)": { plnPrice: 1047.06, plnMargin: 373.95, intranetId: 18925, category: "systemy podwieszane" },
  "adFrame LMD 100x100 PK Hanging": { plnPrice: 1398.656, plnMargin: 499.52, intranetId: 14719, category: "systemy podwieszane" },
  "adFrame LMD 100x300 ND Hanging": { plnPrice: 3010.308, plnMargin: 1075.11, intranetId: 14744, category: "systemy podwieszane" },
  "adFrame LMD 100x300 PK Hanging": { plnPrice: 2253.72, plnMargin: 804.9, intranetId: 14746, category: "systemy podwieszane" },
  "adFrame LMD 70x100 (B1) ND Hanging": { plnPrice: 1266.272, plnMargin: 452.24, intranetId: 14748, category: "systemy podwieszane" },
  "adFrame LMD 85x200 (A1) PD Hanging": { plnPrice: 2195.2, plnMargin: 784.0, intranetId: 14755, category: "systemy podwieszane" },
  "adUp Vario Quadfloat (bez wydruku)": { plnPrice: 1772.876, plnMargin: 633.17, intranetId: 10915, category: "systemy podwieszane" },
  "adUp Vario Quadfloat dwustronne": { plnPrice: 4273.472, plnMargin: 1526.24, intranetId: 12623, category: "systemy podwieszane" },
  "adUp Vario Quadfloat jednostronne": { plnPrice: 4273.472, plnMargin: 1526.24, intranetId: 10911, category: "systemy podwieszane" },
  "adUp Vario Ringfloat (bez wydruku)": { plnPrice: 1219.4, plnMargin: 435.5, intranetId: 10916, category: "systemy podwieszane" },
  "adUp Vario Ringfloat dwustronne": { plnPrice: 1712.312, plnMargin: 611.54, intranetId: 12627, category: "systemy podwieszane" },
  "adUp Vario Ringfloat jednostronne": { plnPrice: 1712.312, plnMargin: 611.54, intranetId: 10912, category: "systemy podwieszane" },
  "adUp Vario Trapfloat dwustronne": { plnPrice: 1720.852, plnMargin: 614.59, intranetId: 12645, category: "systemy podwieszane" },
  "adUp Vario Trifloat dwustronne": { plnPrice: 2741.2, plnMargin: 979.0, intranetId: 12647, category: "systemy podwieszane" },

  // --- Kategoria: systemy podwieszane akcesoria ---
  "adFrame - zestaw do podwieszenia 2m (1 PKT) do ZP": { plnPrice: 39.172, plnMargin: 13.99, intranetId: 17758, category: "systemy podwieszane akcesoria" },
  "adFrame - zestaw do podwieszenia ∅2mm": { plnPrice: 81.004, plnMargin: 28.93, intranetId: 11871, category: "systemy podwieszane akcesoria" },
  "adFrame CTF - zestaw do podwieszenia 2m (4 PKT) do MO": { plnPrice: 138.628, plnMargin: 49.51, intranetId: 17790, category: "systemy podwieszane akcesoria" },
  "adFrame CTF - zestaw do podwieszenia 2m (4 PKT) do ZP": { plnPrice: 156.688, plnMargin: 55.96, intranetId: 17793, category: "systemy podwieszane akcesoria" },
  "Karabińczyk DIN5299": { plnPrice: 1.848, plnMargin: 0.66, intranetId: 11907, category: "systemy podwieszane akcesoria" },
  "Linka stalowa ∅2mm": { plnPrice: 1.148, plnMargin: 0.41, intranetId: 11872, category: "systemy podwieszane akcesoria" },
  "mFrame - zestaw do podwieszenia 2m (1 PKT)": { plnPrice: 67.116, plnMargin: 23.97, intranetId: 18581, category: "systemy podwieszane akcesoria" },
  "Zacisk do linki ∅1,4-2,2mm SMALL": { plnPrice: 9.492, plnMargin: 3.39, intranetId: 11874, category: "systemy podwieszane akcesoria" },

  // --- Kategoria: słupy ---
  "adColumn Air ∅60x100 ver2": { plnPrice: 954.1, plnMargin: 340.75, intranetId: 18678, category: "słupy" },
  "adColumn Air ∅60x220": { plnPrice: 602.168, plnMargin: 215.06, intranetId: 11604, category: "słupy" },
  "adColumn Air ∅60x220 - ver TPU (bez wydruku)": { plnPrice: 694.4, plnMargin: 248.0, intranetId: 18142, category: "słupy" },
  "adColumn Air ∅60x220 ver2": { plnPrice: 845.096, plnMargin: 301.82, intranetId: 18475, category: "słupy" },
  "adColumn Air ∅60x320": { plnPrice: 899.5, plnMargin: 321.25, intranetId: 17706, category: "słupy" },
  "adColumn Air ∅60x320 - ver TPU (bez wydruku)": { plnPrice: 813.54, plnMargin: 290.55, intranetId: 18143, category: "słupy" },
  "adColumn Air ∅60x320 TPU": { plnPrice: 480.088, plnMargin: 171.46, intranetId: 15746, category: "słupy" },
  "adColumn Air ∅60x320 ver2": { plnPrice: 1190.896, plnMargin: 425.32, intranetId: 18471, category: "słupy" },
  "adTribune Air ∅60x100 Tribune ver2": { plnPrice: 969.108, plnMargin: 346.11, intranetId: 18476, category: "słupy" },

  // --- Kategoria: tekstylia użytkowe ---
  "adBlanket 145x200cm": { plnPrice: 159.908, plnMargin: 57.11, intranetId: 15735, category: "tekstylia użytkowe" },
  "adTowel 150x200cm": { plnPrice: 266.392, plnMargin: 95.14, intranetId: 15604, category: "tekstylia użytkowe" },
  "adTowel 50x75cm": { plnPrice: 36.4, plnMargin: 13.0, intranetId: 15603, category: "tekstylia użytkowe" },
  "adTowel 75x100cm": { plnPrice: 68.852, plnMargin: 24.59, intranetId: 15602, category: "tekstylia użytkowe" },
  "adTowel 75x135cm": { plnPrice: 92.26, plnMargin: 32.95, intranetId: 15594, category: "tekstylia użytkowe" },
  "Ponczo": { plnPrice: 467.824, plnMargin: 167.08, intranetId: 15794, category: "tekstylia użytkowe" },

  // --- Kategoria: trybunki reklamowe ---
  "adTribune Big Quick": { plnPrice: 724.192, plnMargin: 258.64, intranetId: 10922, category: "trybunki reklamowe" },
  "adTribune Big Quick (bez wydruku)": { plnPrice: 590.884, plnMargin: 211.03, intranetId: 10923, category: "trybunki reklamowe" },
  "adTribune Big Quick LED": { plnPrice: 1036.924, plnMargin: 370.33, intranetId: 11478, category: "trybunki reklamowe" },
  "adTribune Big Quick LED (bez wydruku)": { plnPrice: 832.748, plnMargin: 297.41, intranetId: 11375, category: "trybunki reklamowe" },
  "adTribune Big Quick LED Auto": { plnPrice: 2648.884, plnMargin: 946.03, intranetId: 18510, category: "trybunki reklamowe" },
  "adTribune Big Quick LED Auto (bez wydruku)": { plnPrice: 2262.008, plnMargin: 807.86, intranetId: 18516, category: "trybunki reklamowe" },
  "adTribune Case": { plnPrice: 1225.868, plnMargin: 437.81, intranetId: 10298, category: "trybunki reklamowe" },
  "adTribune Elypse": { plnPrice: 961.884, plnMargin: 343.53, intranetId: 10010, category: "trybunki reklamowe" },
  "adTribune Elypse (bez wydruku)": { plnPrice: 888.496, plnMargin: 317.32, intranetId: 10045, category: "trybunki reklamowe" },
  "adTribune Elypse Mini": { plnPrice: 924.896, plnMargin: 330.32, intranetId: 10110, category: "trybunki reklamowe" },
  "adTribune Expo 100x100": { plnPrice: 1716.54, plnMargin: 613.05, intranetId: 17039, category: "trybunki reklamowe" },
  "adTribune Expo 100x100 (bez wydruku)": { plnPrice: 1633.016, plnMargin: 583.22, intranetId: 16966, category: "trybunki reklamowe" },
  "adTribune Expo 150x100": { plnPrice: 2126.572, plnMargin: 759.49, intranetId: 17401, category: "trybunki reklamowe" },
  "adTribune Expo 150x100 (bez wydruku)": { plnPrice: 2043.076, plnMargin: 729.67, intranetId: 17326, category: "trybunki reklamowe" },
  "adTribune Flex Expo": { plnPrice: 2213.4, plnMargin: 790.5, intranetId: 19291, category: "trybunki reklamowe" },
  "adTribune Flex Lock": { plnPrice: 3538.136, plnMargin: 1263.62, intranetId: 19290, category: "trybunki reklamowe" },
  "adTribune Flex Lock (bez wydruku)": { plnPrice: 3363.332, plnMargin: 1201.19, intranetId: 19760, category: "trybunki reklamowe" },
  "adTribune Hit": { plnPrice: 896.812, plnMargin: 320.29, intranetId: 10019, category: "trybunki reklamowe" },
  "adTribune Hit (bez wydruku)": { plnPrice: 769.664, plnMargin: 274.88, intranetId: 10027, category: "trybunki reklamowe" },
  "adTribune Hit C": { plnPrice: 981.932, plnMargin: 350.69, intranetId: 10360, category: "trybunki reklamowe" },
  "adTribune Hit Mini": { plnPrice: 891.66, plnMargin: 318.45, intranetId: 10105, category: "trybunki reklamowe" },
  "adTribune Hit Mini (bez wydruku)": { plnPrice: 776.86, plnMargin: 277.45, intranetId: 10106, category: "trybunki reklamowe" },
  "adTribune inflate": { plnPrice: 2218.076, plnMargin: 792.17, intranetId: 19093, category: "trybunki reklamowe" },
  "adTribune inflate (bez wydruku)": { plnPrice: 2128.28, plnMargin: 760.1, intranetId: 18834, category: "trybunki reklamowe" },
  "adTribune Oval": { plnPrice: 856.576, plnMargin: 305.92, intranetId: 10336, category: "trybunki reklamowe" },
  "adTribune Oval Maxi": { plnPrice: 1180.788, plnMargin: 421.71, intranetId: 11591, category: "trybunki reklamowe" },
  "adTribune Oval Maxi wydruk": { plnPrice: 146.832, plnMargin: 52.44, intranetId: 11592, category: "trybunki reklamowe" },
  "adTribune Pop-up Charger": { plnPrice: 1577.66, plnMargin: 563.45, intranetId: 18466, category: "trybunki reklamowe" },
  "adTribune Quick": { plnPrice: 573.636, plnMargin: 204.87, intranetId: 10436, category: "trybunki reklamowe" },
  "adTribune Quick (bez wydruku)": { plnPrice: 462.756, plnMargin: 165.27, intranetId: 10437, category: "trybunki reklamowe" },
  "adTribune Quick Kidney": { plnPrice: 718.872, plnMargin: 256.74, intranetId: 19265, category: "trybunki reklamowe" },
  "adTribune Quick Kidney LED": { plnPrice: 1071.0, plnMargin: 382.5, intranetId: 19268, category: "trybunki reklamowe" },
  "adTribune Quick Kidney LED (bez wydruku)": { plnPrice: 919.94, plnMargin: 328.55, intranetId: 19177, category: "trybunki reklamowe" },
  "adTribune Quick Round": { plnPrice: 611.576, plnMargin: 218.42, intranetId: 19271, category: "trybunki reklamowe" },
  "adTribune Quick Round LED": { plnPrice: 964.208, plnMargin: 344.36, intranetId: 19272, category: "trybunki reklamowe" },
  "adTribune Quick Round LED (bez wydruku)": { plnPrice: 813.176, plnMargin: 290.42, intranetId: 19176, category: "trybunki reklamowe" },
  "adTribune Seg - NIE SPRZEDAWAĆ": { plnPrice: 1804.544, plnMargin: 644.48, intranetId: 12056, category: "trybunki reklamowe" },
  "adTribune Seg NEW": { plnPrice: 1528.156, plnMargin: 545.77, intranetId: 17753, category: "trybunki reklamowe" },
  "adTribune Shell": { plnPrice: 1998.08, plnMargin: 713.6, intranetId: 10304, category: "trybunki reklamowe" },
  "adTribune Shell (bez wydruku)": { plnPrice: 1789.116, plnMargin: 638.97, intranetId: 10305, category: "trybunki reklamowe" },
  "adTribune Shell 2in1": { plnPrice: 5117.224, plnMargin: 1827.58, intranetId: 10442, category: "trybunki reklamowe" },
  "adTribune Shell 2in1 (bez wydruku)": { plnPrice: 5426.708, plnMargin: 1938.11, intranetId: 10443, category: "trybunki reklamowe" },
  "adTribune Smart LED SF": { plnPrice: 1674.568, plnMargin: 598.06, intranetId: 14725, category: "trybunki reklamowe" },
  "adTribune Smart LED SF (bez wydruku)": { plnPrice: 1507.548, plnMargin: 538.41, intranetId: 13607, category: "trybunki reklamowe" },
  "adTribune Standard": { plnPrice: 2037.616, plnMargin: 727.72, intranetId: 10030, category: "trybunki reklamowe" },
  "adTribune Standard (bez wydruku)": { plnPrice: 1865.22, plnMargin: 666.15, intranetId: 10031, category: "trybunki reklamowe" },
  "adTribune Starter": { plnPrice: 880.012, plnMargin: 314.29, intranetId: 18545, category: "trybunki reklamowe" },
  "adTribune Starter (bez wydruku)": { plnPrice: 650.216, plnMargin: 232.22, intranetId: 18115, category: "trybunki reklamowe" },
  "adTribune Tube_OVAL": { plnPrice: 497.336, plnMargin: 177.62, intranetId: 18652, category: "trybunki reklamowe" },
  "adTribune Tube_OVAL (bez wydruku)": { plnPrice: 365.064, plnMargin: 130.38, intranetId: 18394, category: "trybunki reklamowe" },
  "adTribune Tube_SQUARE": { plnPrice: 582.232, plnMargin: 207.94, intranetId: 18653, category: "trybunki reklamowe" },
  "adTribune Tube_SQUARE (bez wydruku)": { plnPrice: 449.988, plnMargin: 160.71, intranetId: 18393, category: "trybunki reklamowe" },
  "COMBO adFrame Pop-up 100x200 and adTribune Pop-up": { plnPrice: 2951.48, plnMargin: 1054.1, intranetId: 18513, category: "trybunki reklamowe" },
  "COMBO adFrame Pop-up 100x200 and adTribune Pop-up incl. charging": { plnPrice: 3021.256, plnMargin: 1079.02, intranetId: 18514, category: "trybunki reklamowe" },
  "COMBO adFrame Starter 100x200 and adTribune Starter": { plnPrice: 1523.284, plnMargin: 544.03, intranetId: 18637, category: "trybunki reklamowe" },
  "POKAZÓWKA_adTribune Quick Kidney (bez wydruku)": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19462, category: "trybunki reklamowe" },
  "Pop-up Counter Lightbox 100x100": { plnPrice: 1507.884, plnMargin: 538.53, intranetId: 17861, category: "trybunki reklamowe" },
  "Pop-up Counter Lightbox 100x100 (bez wydruku)": { plnPrice: 1341.956, plnMargin: 479.27, intranetId: 17788, category: "trybunki reklamowe" },
  "Pop-up Counter Lightbox 100x100 incl. charging (bez wydruku)": { plnPrice: 1411.76, plnMargin: 504.2, intranetId: 18140, category: "trybunki reklamowe" },
  "Wydruk bok adTribune Starter": { plnPrice: 62.552, plnMargin: 22.34, intranetId: 18546, category: "trybunki reklamowe" },
  "Wydruk front adTribune Starter": { plnPrice: 104.804, plnMargin: 37.43, intranetId: 18547, category: "trybunki reklamowe" },
  "Wydruk komplet adTribune Starter": { plnPrice: 229.824, plnMargin: 82.08, intranetId: 18548, category: "trybunki reklamowe" },

  // --- Kategoria: trybunki reklamowe akcesoria ---
  "adTribune Elypse komplet blat+półka": { plnPrice: 335.552, plnMargin: 119.84, intranetId: 17461, category: "trybunki reklamowe akcesoria" },
  "adTribune Elypse Mini blat": { plnPrice: 163.24, plnMargin: 58.3, intranetId: 10376, category: "trybunki reklamowe akcesoria" },
  "adTribune Shell 2in1 blat": { plnPrice: 1848.448, plnMargin: 660.16, intranetId: 11301, category: "trybunki reklamowe akcesoria" },
  "adTribune Shell blat": { plnPrice: 316.904, plnMargin: 113.18, intranetId: 16143, category: "trybunki reklamowe akcesoria" },
  "adTribune Starter blat": { plnPrice: 168.952, plnMargin: 60.34, intranetId: 18780, category: "trybunki reklamowe akcesoria" },
  "Kółko Hit": { plnPrice: 0.392, plnMargin: 0.14, intranetId: 10249, category: "trybunki reklamowe akcesoria" },
  "Półka - Elypse Mini": { plnPrice: 132.44, plnMargin: 47.3, intranetId: 10372, category: "trybunki reklamowe akcesoria" },
  "Półka - Hit/Hit C": { plnPrice: 157.08, plnMargin: 56.1, intranetId: 11346, category: "trybunki reklamowe akcesoria" },
  "Torba Elypse": { plnPrice: 127.12, plnMargin: 45.4, intranetId: 10159, category: "trybunki reklamowe akcesoria" },
  "Torba Hit": { plnPrice: 119.728, plnMargin: 42.76, intranetId: 10161, category: "trybunki reklamowe akcesoria" },

  // --- Kategoria: usługi ---
  "Malowanie proszkowe": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 11906, category: "usługi" },
  "Pakowanie palety - Magazyn": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 12153, category: "usługi" },
  "Pakowanie palety - Vario": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 12149, category: "usługi" },
  "Pakowanie palety - Zabudowy": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 12148, category: "usługi" },
  "Paletyzacja": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 17177, category: "usługi" },
  "Transport": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 42, category: "usługi" },
  "Usługi inne": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 45, category: "usługi" },

  // --- Kategoria: usługi graficzne ---
  "Projekt graficzny": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 55, category: "usługi graficzne" },
  "Sprawdzenie do druku": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 2, category: "usługi graficzne" },
  "Sprawdzenie do druku zaawansowane": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 17783, category: "usługi graficzne" },
  "Usługi graficzne": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10011, category: "usługi graficzne" },
  "WIZUALIZACJA": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 16362, category: "usługi graficzne" },

  // --- Kategoria: usługi montażu ---
  "Montaż / Demontaż [min]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10822, category: "usługi montażu" },
  "Montaż / Demontaż u klienta": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 15592, category: "usługi montażu" },
  "Oczko stalowe M6": { plnPrice: 2.548, plnMargin: 0.91, intranetId: 11882, category: "usługi montażu" },
  "Usługa montażu stoiska targowego": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 17404, category: "usługi montażu" },

  // --- Kategoria: vario akcesoria ---
  "adTribune Big Quick LED RENTAL": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19360, category: "vario akcesoria" },
  "adWall Vario LED - mocowanie fi34 (Black)": { plnPrice: 32.2, plnMargin: 11.5, intranetId: 11812, category: "vario akcesoria" },
  "adWall Vario LED - mocowanie fi34 (Silver)": { plnPrice: 32.2, plnMargin: 11.5, intranetId: 11813, category: "vario akcesoria" },
  "adWall Vario LED - mocowanie fi43 (Silver)": { plnPrice: 24.164, plnMargin: 8.63, intranetId: 11855, category: "vario akcesoria" },
  "Kabel zasilający do zasilacza wew / adFrame Quick": { plnPrice: 33.712, plnMargin: 12.04, intranetId: 17392, category: "vario akcesoria" },
  "Lampka LED 116 czarna": { plnPrice: 544.936, plnMargin: 194.62, intranetId: 11853, category: "vario akcesoria" },
  "Lampka LED 116 srebrna": { plnPrice: 237.524, plnMargin: 84.83, intranetId: 11519, category: "vario akcesoria" },
  "Lampka LED 50 czarna": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 11851, category: "vario akcesoria" },
  "Lampka LED 50 srebrna": { plnPrice: 182.784, plnMargin: 65.28, intranetId: 11847, category: "vario akcesoria" },
  "Oświetlenie do mFrame 116 srebrna": { plnPrice: 330.204, plnMargin: 117.93, intranetId: 17780, category: "vario akcesoria" },
  "Oświetlenie do Multiframe 116 czarna": { plnPrice: 555.632, plnMargin: 198.44, intranetId: 17777, category: "vario akcesoria" },
  "Oświetlenie do Multiframe 60 czarna": { plnPrice: 190.932, plnMargin: 68.19, intranetId: 17778, category: "vario akcesoria" },
  "Oświetlenie do Vario Light 116 czarna": { plnPrice: 577.136, plnMargin: 206.12, intranetId: 17761, category: "vario akcesoria" },
  "Oświetlenie do Vario Light 116 srebrna": { plnPrice: 269.724, plnMargin: 96.33, intranetId: 17772, category: "vario akcesoria" },
  "Oświetlenie do Vario Light 60 czarna": { plnPrice: 212.436, plnMargin: 75.87, intranetId: 17774, category: "vario akcesoria" },
  "Oświetlenie do Vario Light 60 srebrna": { plnPrice: 214.984, plnMargin: 76.78, intranetId: 17773, category: "vario akcesoria" },
  "Oświetlenie do Vario Premium 116 srebrna": { plnPrice: 261.716, plnMargin: 93.47, intranetId: 17775, category: "vario akcesoria" },
  "Oświetlenie do Vario Premium 60 srebrna": { plnPrice: 206.948, plnMargin: 73.91, intranetId: 17776, category: "vario akcesoria" },
  "Torba do Vario Light 240/300/400 z kółkami": { plnPrice: 328.244, plnMargin: 117.23, intranetId: 16033, category: "vario akcesoria" },
  "Vario Light przedłużka prosta": { plnPrice: 25.816, plnMargin: 9.22, intranetId: 16160, category: "vario akcesoria" },
  "Vario Light przedłużka supportu": { plnPrice: 13.468, plnMargin: 4.81, intranetId: 16161, category: "vario akcesoria" },

  // --- Kategoria: vario crazy ---
  "adWall Vario Add lewy dwustronne": { plnPrice: 1155.0, plnMargin: 412.5, intranetId: 13601, category: "vario crazy" },
  "adWall Vario Add prawy dwustronne": { plnPrice: 1155.0, plnMargin: 412.5, intranetId: 15865, category: "vario crazy" },
  "adWall Vario Arch (zestaw A+B - bez wydruku)": { plnPrice: 3339.308, plnMargin: 1192.61, intranetId: 15598, category: "vario crazy" },
  "adWall Vario Arch (zestaw A+B)": { plnPrice: 4715.676, plnMargin: 1684.17, intranetId: 12501, category: "vario crazy" },
  "adWall Vario Arch A": { plnPrice: 2357.824, plnMargin: 842.08, intranetId: 10558, category: "vario crazy" },
  "adWall Vario Arch C": { plnPrice: 2252.376, plnMargin: 804.42, intranetId: 10924, category: "vario crazy" },
  "adWall Vario Arch C (bez wydruku)": { plnPrice: 1447.012, plnMargin: 516.79, intranetId: 10925, category: "vario crazy" },
  "adWall Vario Big Island dwustronne": { plnPrice: 3967.992, plnMargin: 1417.14, intranetId: 12503, category: "vario crazy" },
  "adWall Vario Bow": { plnPrice: 2803.108, plnMargin: 1001.11, intranetId: 11085, category: "vario crazy" },
  "adWall Vario Bow (bez wydruku)": { plnPrice: 1560.272, plnMargin: 557.24, intranetId: 11075, category: "vario crazy" },
  "adWall Vario C-wall dwustronne": { plnPrice: 1692.152, plnMargin: 604.34, intranetId: 12517, category: "vario crazy" },
  "adWall Vario Cone jednostronne": { plnPrice: 4189.724, plnMargin: 1496.33, intranetId: 11073, category: "vario crazy" },
  "adWall Vario Craft dwustronne": { plnPrice: 4222.904, plnMargin: 1508.18, intranetId: 12515, category: "vario crazy" },
  "adWall Vario Craft jednostronne": { plnPrice: 4222.904, plnMargin: 1508.18, intranetId: 10434, category: "vario crazy" },
  "adWall Vario Fall dwustronne": { plnPrice: 1712.592, plnMargin: 611.64, intranetId: 12519, category: "vario crazy" },
  "adWall Vario Fall jednostronne": { plnPrice: 1712.592, plnMargin: 611.64, intranetId: 10329, category: "vario crazy" },
  "adWall Vario Flat Ring (bez wydruku)": { plnPrice: 549.388, plnMargin: 196.21, intranetId: 16191, category: "vario crazy" },
  "adWall Vario Flat Ring dwustronne": { plnPrice: 881.384, plnMargin: 314.78, intranetId: 16355, category: "vario crazy" },
  "adWall Vario Flat Ring jednostronne": { plnPrice: 881.384, plnMargin: 314.78, intranetId: 16211, category: "vario crazy" },
  "adWall Vario Flat Ring Water Base dwustronny": { plnPrice: 1047.928, plnMargin: 374.26, intranetId: 16214, category: "vario crazy" },
  "adWall Vario Flat Ring Water Base jednostronny": { plnPrice: 1047.928, plnMargin: 374.26, intranetId: 16439, category: "vario crazy" },
  "adWall Vario Gate": { plnPrice: 3142.86, plnMargin: 1122.45, intranetId: 10425, category: "vario crazy" },
  "adWall Vario Gate (bez wydruku)": { plnPrice: 1478.148, plnMargin: 527.91, intranetId: 10424, category: "vario crazy" },
  "adWall Vario In": { plnPrice: 2874.172, plnMargin: 1026.49, intranetId: 10338, category: "vario crazy" },
  "adWall Vario Island dwustronne": { plnPrice: 2337.02, plnMargin: 834.65, intranetId: 12523, category: "vario crazy" },
  "adWall Vario Peak dwustronne": { plnPrice: 2126.012, plnMargin: 759.29, intranetId: 12569, category: "vario crazy" },
  "adWall Vario Peak jednostronne": { plnPrice: 2126.012, plnMargin: 759.29, intranetId: 10346, category: "vario crazy" },
  "adWall Vario Qring dwustronne": { plnPrice: 1553.328, plnMargin: 554.76, intranetId: 12621, category: "vario crazy" },
  "adWall Vario Qring jednostronne": { plnPrice: 1553.328, plnMargin: 554.76, intranetId: 10560, category: "vario crazy" },
  "adWall Vario Ring (bez wydruku)": { plnPrice: 1013.908, plnMargin: 362.11, intranetId: 10328, category: "vario crazy" },
  "adWall Vario Ring dwustronne": { plnPrice: 1655.22, plnMargin: 591.15, intranetId: 12625, category: "vario crazy" },
  "adWall Vario Ring jednostronne": { plnPrice: 1655.22, plnMargin: 591.15, intranetId: 10327, category: "vario crazy" },
  "adWall Vario S 100 dwustronne": { plnPrice: 929.936, plnMargin: 332.12, intranetId: 12631, category: "vario crazy" },
  "adWall Vario S 100 jednostronne": { plnPrice: 929.936, plnMargin: 332.12, intranetId: 10323, category: "vario crazy" },
  "adWall Vario S 120 (bez wydruku)": { plnPrice: 654.36, plnMargin: 233.7, intranetId: 10350, category: "vario crazy" },
  "adWall Vario S 120 dwustronne": { plnPrice: 951.776, plnMargin: 339.92, intranetId: 12633, category: "vario crazy" },
  "adWall Vario S 150 dwustronne": { plnPrice: 1347.108, plnMargin: 481.11, intranetId: 12635, category: "vario crazy" },
  "adWall Vario S 80 dwustronne": { plnPrice: 907.48, plnMargin: 324.1, intranetId: 12629, category: "vario crazy" },
  "adWall Vario S 80 jednostronne": { plnPrice: 907.48, plnMargin: 324.1, intranetId: 10321, category: "vario crazy" },
  "adWall Vario Serpentyna 300 dwustronne": { plnPrice: 1725.668, plnMargin: 616.31, intranetId: 12637, category: "vario crazy" },
  "adWall Vario Serpentyna 300 jednostronne": { plnPrice: 1725.668, plnMargin: 616.31, intranetId: 10387, category: "vario crazy" },
  "adWall Vario Serpentyna 600 dwustronne": { plnPrice: 2954.952, plnMargin: 1055.34, intranetId: 12639, category: "vario crazy" },
  "adWall Vario Slope dwustronne": { plnPrice: 1917.328, plnMargin: 684.76, intranetId: 12641, category: "vario crazy" },
  "adWall Vario Slope jednostronne": { plnPrice: 1917.328, plnMargin: 684.76, intranetId: 10340, category: "vario crazy" },
  "adWall Vario Tower": { plnPrice: 1896.048, plnMargin: 677.16, intranetId: 10382, category: "vario crazy" },
  "adWall Vario Tower 3m": { plnPrice: 1630.468, plnMargin: 582.31, intranetId: 10562, category: "vario crazy" },
  "adWall Vario Tunel dwustronne": { plnPrice: 5172.328, plnMargin: 1847.26, intranetId: 12649, category: "vario crazy" },
  "adWall Vario Twist": { plnPrice: 3180.1, plnMargin: 1135.75, intranetId: 10344, category: "vario crazy" },
  "adWall Vario Wave": { plnPrice: 3718.848, plnMargin: 1328.16, intranetId: 10342, category: "vario crazy" },

  // --- Kategoria: vario klasyczne ścianki ---
  "adWall Vario Horizontal (bez wydruku)": { plnPrice: 432.488, plnMargin: 154.46, intranetId: 11811, category: "vario klasyczne ścianki" },
  "adWall Vario Horizontal dwustronne": { plnPrice: 659.764, plnMargin: 235.63, intranetId: 12533, category: "vario klasyczne ścianki" },
  "adWall Vario Horizontal jednostronne": { plnPrice: 659.764, plnMargin: 235.63, intranetId: 11809, category: "vario klasyczne ścianki" },
  "adWall Vario Presto 120 (bez wydruku) - prostokątna podstawa": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 16145, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 240 Ø43 (bez wydruku)": { plnPrice: 986.692, plnMargin: 352.39, intranetId: 11686, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 240 Ø43 dwustronne": { plnPrice: 1401.456, plnMargin: 500.52, intranetId: 12601, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 240 Ø43 jednostronne": { plnPrice: 1401.456, plnMargin: 500.52, intranetId: 11685, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 240 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1192.576, plnMargin: 425.92, intranetId: 19467, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 240 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1607.34, plnMargin: 574.05, intranetId: 19513, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 300 Ø43 dwustronne": { plnPrice: 1586.928, plnMargin: 566.76, intranetId: 12603, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 300 Ø43 jednostronne": { plnPrice: 1586.928, plnMargin: 566.76, intranetId: 10351, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 300 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1257.76, plnMargin: 449.2, intranetId: 19468, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 300 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1766.268, plnMargin: 630.81, intranetId: 19515, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 300 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1766.268, plnMargin: 630.81, intranetId: 19516, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 400 Ø43 dwustronne": { plnPrice: 1769.124, plnMargin: 631.83, intranetId: 12605, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 400 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1317.848, plnMargin: 470.66, intranetId: 19469, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 400 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1982.596, plnMargin: 708.07, intranetId: 19517, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 400 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1982.596, plnMargin: 708.07, intranetId: 19518, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 500 Ø43 (bez wydruku)": { plnPrice: 1517.628, plnMargin: 542.01, intranetId: 10983, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 500 Ø43 dwustronne": { plnPrice: 2338.644, plnMargin: 835.23, intranetId: 12607, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 500 Ø43 jednostronne": { plnPrice: 2338.644, plnMargin: 835.23, intranetId: 10980, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 500 Ø43 w torbie na kółkach dwustronne": { plnPrice: 2528.484, plnMargin: 903.03, intranetId: 19519, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 500 Ø43 w torbie na kółkach jednostronne": { plnPrice: 2528.484, plnMargin: 903.03, intranetId: 19520, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 600 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1794.856, plnMargin: 641.02, intranetId: 19478, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 600 Ø43 w torbie na kółkach dwustronne": { plnPrice: 2772.112, plnMargin: 990.04, intranetId: 19521, category: "vario klasyczne ścianki" },
  "adWall Vario Prosta 600 Ø43 w torbie na kółkach jednostronne": { plnPrice: 2772.112, plnMargin: 990.04, intranetId: 19522, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 240 Ø43 (bez wydruku)": { plnPrice: 1056.608, plnMargin: 377.36, intranetId: 11269, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 240 Ø43 dwustronne": { plnPrice: 1455.552, plnMargin: 519.84, intranetId: 12541, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 240 Ø43 jednostronne": { plnPrice: 1455.552, plnMargin: 519.84, intranetId: 11267, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 240 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1662.136, plnMargin: 593.62, intranetId: 19533, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 300 Ø43 (bez wydruku)": { plnPrice: 1093.428, plnMargin: 390.51, intranetId: 10600, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 300 Ø43 dwustronne": { plnPrice: 1617.588, plnMargin: 577.71, intranetId: 12545, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 300 Ø43 jednostronne": { plnPrice: 1617.588, plnMargin: 577.71, intranetId: 10598, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 300 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1896.608, plnMargin: 677.36, intranetId: 19535, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 300 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1896.608, plnMargin: 677.36, intranetId: 19536, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 400 Ø43 (bez wydruku)": { plnPrice: 1196.132, plnMargin: 427.19, intranetId: 11176, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 400 Ø43 dwustronne": { plnPrice: 1845.256, plnMargin: 659.02, intranetId: 12551, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 400 Ø43 jednostronne": { plnPrice: 1845.256, plnMargin: 659.02, intranetId: 11175, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 500 Ø43 (bez wydruku)": { plnPrice: 1661.576, plnMargin: 593.42, intranetId: 11178, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 500 Ø43 dwustronne": { plnPrice: 2545.172, plnMargin: 908.99, intranetId: 12553, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 500 Ø43 jednostronne": { plnPrice: 2545.172, plnMargin: 908.99, intranetId: 11179, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 600 Ø43 dwustronne": { plnPrice: 2676.408, plnMargin: 955.86, intranetId: 12555, category: "vario klasyczne ścianki" },
  "adWall Vario Łukowa 600 Ø43 jednostronne": { plnPrice: 2676.408, plnMargin: 955.86, intranetId: 10599, category: "vario klasyczne ścianki" },

  // --- Kategoria: vario light ---
  "adGate Quick Arch": { plnPrice: 1139.376, plnMargin: 406.92, intranetId: 18605, category: "vario light" },
  "adWall Vario Classic Light 180 jednostronne": { plnPrice: 1179.584, plnMargin: 421.28, intranetId: 11552, category: "vario light" },
  "adWall Vario Classic Light 240 (bez wydruku)": { plnPrice: 897.092, plnMargin: 320.39, intranetId: 11557, category: "vario light" },
  "adWall Vario Classic Light 240 dwustronne": { plnPrice: 1296.232, plnMargin: 462.94, intranetId: 12529, category: "vario light" },
  "adWall Vario Classic Light 240 jednostronne": { plnPrice: 1296.232, plnMargin: 462.94, intranetId: 11553, category: "vario light" },
  "adWall Vario Classic Light 300 dwustronne": { plnPrice: 1374.156, plnMargin: 490.77, intranetId: 12531, category: "vario light" },
  "adWall Vario Classic Light 300 jednostronne": { plnPrice: 1374.156, plnMargin: 490.77, intranetId: 11554, category: "vario light" },
  "adWall Vario Presto Light 060 (bez wydruku)": { plnPrice: 309.456, plnMargin: 110.52, intranetId: 11711, category: "vario light" },
  "adWall Vario Presto Light 060 dwustronne": { plnPrice: 458.444, plnMargin: 163.73, intranetId: 12577, category: "vario light" },
  "adWall Vario Presto Light 060 jednostronne": { plnPrice: 458.444, plnMargin: 163.73, intranetId: 11708, category: "vario light" },
  "adWall Vario Presto Light 090 (bez wydruku)": { plnPrice: 332.948, plnMargin: 118.91, intranetId: 11759, category: "vario light" },
  "adWall Vario Presto Light 090 dwustronne": { plnPrice: 513.156, plnMargin: 183.27, intranetId: 12579, category: "vario light" },
  "adWall Vario Presto Light 090 jednostronne": { plnPrice: 513.156, plnMargin: 183.27, intranetId: 11761, category: "vario light" },
  "adWall Vario Presto Light 120 (bez wydruku)": { plnPrice: 373.324, plnMargin: 133.33, intranetId: 11712, category: "vario light" },
  "adWall Vario Presto Light 120 dwustronne": { plnPrice: 600.432, plnMargin: 214.44, intranetId: 12581, category: "vario light" },
  "adWall Vario Presto Light 120 jednostronne": { plnPrice: 600.432, plnMargin: 214.44, intranetId: 11709, category: "vario light" },
  "adWall Vario Presto Light 150 (bez wydruku)": { plnPrice: 390.376, plnMargin: 139.42, intranetId: 11713, category: "vario light" },
  "adWall Vario Presto Light 150 dwustronne": { plnPrice: 680.148, plnMargin: 242.91, intranetId: 12583, category: "vario light" },
  "adWall Vario Presto Light 150 jednostronne": { plnPrice: 680.148, plnMargin: 242.91, intranetId: 11710, category: "vario light" },
  "adWall Vario Presto Outdoor (bez wydruku)": { plnPrice: 960.848, plnMargin: 343.16, intranetId: 18600, category: "vario light" },
  "adWall Vario Presto Outdoor dwustronny": { plnPrice: 1200.024, plnMargin: 428.58, intranetId: 18604, category: "vario light" },
  "adWall Vario Presto Outdoor jednostronny": { plnPrice: 1200.024, plnMargin: 428.58, intranetId: 18603, category: "vario light" },
  "adWall Vario Prosta Light 240 (bez wydruku)": { plnPrice: 834.764, plnMargin: 298.13, intranetId: 11767, category: "vario light" },
  "adWall Vario Prosta Light 240 dwustronne": { plnPrice: 1264.984, plnMargin: 451.78, intranetId: 12611, category: "vario light" },
  "adWall Vario Prosta Light 240 jednostronne": { plnPrice: 1264.984, plnMargin: 451.78, intranetId: 11769, category: "vario light" },
  "adWall Vario Prosta Light 240 SOFT BAG (bez wydruku)": { plnPrice: 540.148, plnMargin: 192.91, intranetId: 17569, category: "vario light" },
  "adWall Vario Prosta Light 240 SOFT BAG dwustronne": { plnPrice: 970.368, plnMargin: 346.56, intranetId: 17675, category: "vario light" },
  "adWall Vario Prosta Light 240 SOFT BAG jednostronne": { plnPrice: 970.368, plnMargin: 346.56, intranetId: 17652, category: "vario light" },
  "adWall Vario Prosta Light 300 (bez wydruku)": { plnPrice: 812.924, plnMargin: 290.33, intranetId: 11770, category: "vario light" },
  "adWall Vario Prosta Light 300 dwustronne": { plnPrice: 1337.056, plnMargin: 477.52, intranetId: 12613, category: "vario light" },
  "adWall Vario Prosta Light 300 jednostronne": { plnPrice: 1337.056, plnMargin: 477.52, intranetId: 11772, category: "vario light" },
  "adWall Vario Prosta Light 300 SOFT BAG (bez wydruku)": { plnPrice: 577.696, plnMargin: 206.32, intranetId: 17570, category: "vario light" },
  "adWall Vario Prosta Light 300 SOFT BAG dwustronne": { plnPrice: 1101.856, plnMargin: 393.52, intranetId: 17678, category: "vario light" },
  "adWall Vario Prosta Light 300 SOFT BAG jednostronne": { plnPrice: 1101.856, plnMargin: 393.52, intranetId: 17679, category: "vario light" },
  "adWall Vario Prosta Light 400 (bez wydruku)": { plnPrice: 938.56, plnMargin: 335.2, intranetId: 11544, category: "vario light" },
  "adWall Vario Prosta Light 400 dwustronne": { plnPrice: 1603.308, plnMargin: 572.61, intranetId: 12615, category: "vario light" },
  "adWall Vario Prosta Light 400 jednostronne": { plnPrice: 1603.308, plnMargin: 572.61, intranetId: 11537, category: "vario light" },
  "adWall Vario Prosta Light 400 SOFT BAG (bez wydruku)": { plnPrice: 675.976, plnMargin: 241.42, intranetId: 17571, category: "vario light" },
  "adWall Vario Prosta Light 400 SOFT BAG dwustronne": { plnPrice: 1340.78, plnMargin: 478.85, intranetId: 17680, category: "vario light" },
  "adWall Vario Prosta Light 400 SOFT BAG jednostronne": { plnPrice: 1340.78, plnMargin: 478.85, intranetId: 17681, category: "vario light" },
  "adWall Vario Prosta Light 500 (bez wydruku)": { plnPrice: 1230.376, plnMargin: 439.42, intranetId: 11545, category: "vario light" },
  "adWall Vario Prosta Light 500 dwustronne": { plnPrice: 2051.392, plnMargin: 732.64, intranetId: 12617, category: "vario light" },
  "adWall Vario Prosta Light 500 jednostronne": { plnPrice: 2051.392, plnMargin: 732.64, intranetId: 11538, category: "vario light" },
  "adWall Vario Prosta Light 500 SOFT BAG (bez wydruku)": { plnPrice: 927.024, plnMargin: 331.08, intranetId: 17572, category: "vario light" },
  "adWall Vario Prosta Light 500 SOFT BAG dwustronne": { plnPrice: 1748.04, plnMargin: 624.3, intranetId: 17682, category: "vario light" },
  "adWall Vario Prosta Light 500 SOFT BAG jednostronne": { plnPrice: 1748.04, plnMargin: 624.3, intranetId: 17683, category: "vario light" },
  "adWall Vario Prosta Light 600 (bez wydruku)": { plnPrice: 1236.34, plnMargin: 441.55, intranetId: 11546, category: "vario light" },
  "adWall Vario Prosta Light 600 dwustronne": { plnPrice: 2213.596, plnMargin: 790.57, intranetId: 12619, category: "vario light" },
  "adWall Vario Prosta Light 600 jednostronne": { plnPrice: 2213.596, plnMargin: 790.57, intranetId: 11539, category: "vario light" },
  "adWall Vario Prosta Light 600 SOFT BAG (bez wydruku)": { plnPrice: 993.44, plnMargin: 354.8, intranetId: 17573, category: "vario light" },
  "adWall Vario Prosta Light 600 SOFT BAG dwustronne": { plnPrice: 1970.696, plnMargin: 703.82, intranetId: 17684, category: "vario light" },
  "adWall Vario Prosta Light 600 SOFT BAG jednostronne": { plnPrice: 1970.696, plnMargin: 703.82, intranetId: 17685, category: "vario light" },
  "adWall Vario Łukowa Light 240 (bez wydruku)": { plnPrice: 898.016, plnMargin: 320.72, intranetId: 11525, category: "vario light" },
  "adWall Vario Łukowa Light 240 dwustronne": { plnPrice: 1328.264, plnMargin: 474.38, intranetId: 12557, category: "vario light" },
  "adWall Vario Łukowa Light 240 jednostronne": { plnPrice: 1328.264, plnMargin: 474.38, intranetId: 11520, category: "vario light" },
  "adWall Vario Łukowa Light 240 SOFT BAG (bez wydruku)": { plnPrice: 594.748, plnMargin: 212.41, intranetId: 17574, category: "vario light" },
  "adWall Vario Łukowa Light 240 SOFT BAG dwustronne": { plnPrice: 1024.968, plnMargin: 366.06, intranetId: 17686, category: "vario light" },
  "adWall Vario Łukowa Light 240 SOFT BAG jednostronne": { plnPrice: 1024.968, plnMargin: 366.06, intranetId: 17687, category: "vario light" },
  "adWall Vario Łukowa Light 300 (bez wydruku)": { plnPrice: 915.46, plnMargin: 326.95, intranetId: 11526, category: "vario light" },
  "adWall Vario Łukowa Light 300 dwustronne": { plnPrice: 1439.424, plnMargin: 514.08, intranetId: 12559, category: "vario light" },
  "adWall Vario Łukowa Light 300 jednostronne": { plnPrice: 1439.424, plnMargin: 514.08, intranetId: 11521, category: "vario light" },
  "adWall Vario Łukowa Light 300 SOFT BAG (bez wydruku)": { plnPrice: 626.864, plnMargin: 223.88, intranetId: 17575, category: "vario light" },
  "adWall Vario Łukowa Light 300 SOFT BAG dwustronne": { plnPrice: 1150.828, plnMargin: 411.01, intranetId: 17688, category: "vario light" },
  "adWall Vario Łukowa Light 300 SOFT BAG jednostronne": { plnPrice: 1150.828, plnMargin: 411.01, intranetId: 17689, category: "vario light" },
  "adWall Vario Łukowa Light 400 dwustronne": { plnPrice: 1639.568, plnMargin: 585.56, intranetId: 12561, category: "vario light" },
  "adWall Vario Łukowa Light 400 jednostronne": { plnPrice: 1639.568, plnMargin: 585.56, intranetId: 11522, category: "vario light" },
  "adWall Vario Łukowa Light 400 SOFT BAG (bez wydruku)": { plnPrice: 724.948, plnMargin: 258.91, intranetId: 17576, category: "vario light" },
  "adWall Vario Łukowa Light 400 SOFT BAG dwustronne": { plnPrice: 1405.348, plnMargin: 501.91, intranetId: 17690, category: "vario light" },
  "adWall Vario Łukowa Light 400 SOFT BAG jednostronne": { plnPrice: 1405.348, plnMargin: 501.91, intranetId: 17691, category: "vario light" },
  "adWall Vario Łukowa Light 500 dwustronne": { plnPrice: 2154.488, plnMargin: 769.46, intranetId: 12563, category: "vario light" },
  "adWall Vario Łukowa Light 500 jednostronne": { plnPrice: 2154.488, plnMargin: 769.46, intranetId: 11523, category: "vario light" },
  "adWall Vario Łukowa Light 500 SOFT BAG (bez wydruku)": { plnPrice: 927.024, plnMargin: 331.08, intranetId: 17577, category: "vario light" },
  "adWall Vario Łukowa Light 500 SOFT BAG dwustronne": { plnPrice: 1763.748, plnMargin: 629.91, intranetId: 17692, category: "vario light" },
  "adWall Vario Łukowa Light 500 SOFT BAG jednostronne": { plnPrice: 1763.748, plnMargin: 629.91, intranetId: 17693, category: "vario light" },
  "adWall Vario Łukowa Light 600 dwustronne": { plnPrice: 2396.548, plnMargin: 855.91, intranetId: 12565, category: "vario light" },
  "adWall Vario Łukowa Light 600 jednostronne": { plnPrice: 2396.548, plnMargin: 855.91, intranetId: 11524, category: "vario light" },
  "adWall Vario Łukowa Light 600 SOFT BAG dwustronne": { plnPrice: 2014.32, plnMargin: 719.4, intranetId: 17694, category: "vario light" },
  "adWall Vario Łukowa Light 600 SOFT BAG jednostronne": { plnPrice: 2014.32, plnMargin: 719.4, intranetId: 17695, category: "vario light" },
  "Wydruk adGate Quick Arch": { plnPrice: 216.58, plnMargin: 77.35, intranetId: 18607, category: "vario light" },

  // --- Kategoria: wydruk blockout ---
  "mFrame MASKOWNICA PCV 2480 (szt)": { plnPrice: 159.768, plnMargin: 57.06, intranetId: 18734, category: "wydruk blockout" },
  "Wydruk do ościeżnicy do drzwi NEW": { plnPrice: 116.648, plnMargin: 41.66, intranetId: 18584, category: "wydruk blockout" },
  "Wydruk do ościeżnicy na tekstyliach - KLEJONY": { plnPrice: 275.268, plnMargin: 98.31, intranetId: 17367, category: "wydruk blockout" },
  "Wydruk niestandardowy BIG QUICK LED": { plnPrice: 139.776, plnMargin: 49.92, intranetId: 17627, category: "wydruk blockout" },
  "Wydruk niestandardowy MODERN / BLOCKOUT": { plnPrice: 103.18, plnMargin: 36.85, intranetId: 12179, category: "wydruk blockout" },

  // --- Kategoria: wydruk blockout adframe ---
  "Wydruk adFrame Blockout": { plnPrice: 113.512, plnMargin: 40.54, intranetId: 18167, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 1mb/medium250)": { plnPrice: 61.516, plnMargin: 21.97, intranetId: 11867, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 1mb/medium320)": { plnPrice: 61.516, plnMargin: 21.97, intranetId: 18019, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 3mb/medium250)": { plnPrice: 125.58, plnMargin: 44.85, intranetId: 16435, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 3mb/medium320)": { plnPrice: 125.58, plnMargin: 44.85, intranetId: 18020, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (pow. 3mb/medium250)": { plnPrice: 294.784, plnMargin: 105.28, intranetId: 16437, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (pow. 3mb/medium320)": { plnPrice: 294.784, plnMargin: 105.28, intranetId: 18021, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout 100x200": { plnPrice: 108.304, plnMargin: 38.68, intranetId: 14722, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout 200x250": { plnPrice: 197.344, plnMargin: 70.48, intranetId: 15241, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout 400x250": { plnPrice: 368.76, plnMargin: 131.7, intranetId: 15245, category: "wydruk blockout adframe" },
  "Wydruk adFrame Blockout 99,2x248": { plnPrice: 111.384, plnMargin: 39.78, intranetId: 15260, category: "wydruk blockout adframe" },
  "Wydruk mFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 3mb/medium250)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19242, category: "wydruk blockout adframe" },
  "Wydruk mFrame Blockout - BIAŁY PLECY NIE DO DRUKU (pow. 3mb/medium250)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19243, category: "wydruk blockout adframe" },

  // --- Kategoria: wydruk blockout foldable ---
  "Wydruk Foldable 100x200": { plnPrice: 110.824, plnMargin: 39.58, intranetId: 18029, category: "wydruk blockout foldable" },
  "Wydruk Foldable 100x250": { plnPrice: 110.824, plnMargin: 39.58, intranetId: 16987, category: "wydruk blockout foldable" },
  "Wydruk Foldable 200x200": { plnPrice: 196.532, plnMargin: 70.19, intranetId: 19704, category: "wydruk blockout foldable" },
  "Wydruk Foldable 200x250": { plnPrice: 196.532, plnMargin: 70.19, intranetId: 17059, category: "wydruk blockout foldable" },
  "Wydruk Foldable 300x200": { plnPrice: 282.156, plnMargin: 100.77, intranetId: 19703, category: "wydruk blockout foldable" },
  "Wydruk Foldable 300x250": { plnPrice: 282.156, plnMargin: 100.77, intranetId: 17060, category: "wydruk blockout foldable" },
  "Wydruk Foldable 400x200": { plnPrice: 365.288, plnMargin: 130.46, intranetId: 19764, category: "wydruk blockout foldable" },
  "Wydruk Foldable 400x250": { plnPrice: 367.892, plnMargin: 131.39, intranetId: 17061, category: "wydruk blockout foldable" },
  "Wydruk Foldable 500x250": { plnPrice: 453.544, plnMargin: 161.98, intranetId: 17062, category: "wydruk blockout foldable" },

  // --- Kategoria: wydruk blockout mframe ---
  "Wydruk do mFrame rama curved corner arch 496x496": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 18786, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach (do 1mb/medium250)": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 10790, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach (do 1mb/medium320)": { plnPrice: 153.888, plnMargin: 54.96, intranetId: 18003, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach (do 3mb/medium250)": { plnPrice: 312.396, plnMargin: 111.57, intranetId: 16427, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach (do 3mb/medium320)": { plnPrice: 393.82, plnMargin: 140.65, intranetId: 18006, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach (pow. 3mb/medium250)": { plnPrice: 502.376, plnMargin: 179.42, intranetId: 16428, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach (pow. 3mb/medium320)": { plnPrice: 633.864, plnMargin: 226.38, intranetId: 18007, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - 99,2x248cm KLEJONY": { plnPrice: 381.388, plnMargin: 136.21, intranetId: 17594, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - BIAŁY": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 12215, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - BIAŁY 297,6x248cm": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 17995, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - BIAŁY 99,2x248cm": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 17063, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI (bez wycięcia na klamkę)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 14495, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI (klamka z lewej strony)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 12214, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI (klamka z prawej strony)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 12213, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI NEW (bez wycięcia na klamkę)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 18582, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI NEW Z OŚCIEŻNICĄ": { plnPrice: 238.812, plnMargin: 85.29, intranetId: 18583, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI Z OŚCIEŻNICĄ PCV (bez wycięcia na klamkę)": { plnPrice: 397.488, plnMargin: 141.96, intranetId: 17912, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI Z OŚCIEŻNICĄ PCV (klamka z lewej)": { plnPrice: 397.488, plnMargin: 141.96, intranetId: 18586, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - DRZWI Z OŚCIEŻNICĄ PCV (klamka z prawej": { plnPrice: 397.488, plnMargin: 141.96, intranetId: 18587, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x148,8cm KLEJONY WEWNĘTRZNY": { plnPrice: 337.26, plnMargin: 120.45, intranetId: 17284, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x248cm KLEJONY WEWNĘTRZNY": { plnPrice: 452.312, plnMargin: 161.54, intranetId: 17283, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x49,6cm KLEJONY WEWNĘTRZNY": { plnPrice: 189.42, plnMargin: 67.65, intranetId: 17632, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x99,2cm KLEJONY WEWNĘTRZNY": { plnPrice: 187.656, plnMargin: 67.02, intranetId: 17281, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x148,8cm KLEJONY ZEWNETRZNY": { plnPrice: 273.196, plnMargin: 97.57, intranetId: 18061, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x248cm KLEJONY ZEWNETRZNY": { plnPrice: 429.1, plnMargin: 153.25, intranetId: 18565, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x49,6cm KLEJONY ZEWNETRZNY": { plnPrice: 195.132, plnMargin: 69.69, intranetId: 17631, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x99,2cm KLEJONY ZEWNETRZNY": { plnPrice: 189.98, plnMargin: 67.85, intranetId: 17603, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK WEWNĘTRZNY Z RZEPEM 75x99,2": { plnPrice: 114.296, plnMargin: 40.82, intranetId: 12046, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK ZEWNĘTRZNY 83x248": { plnPrice: 114.296, plnMargin: 40.82, intranetId: 16419, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach - ŁUK ZEWNĘTRZNY 83x99,2": { plnPrice: 114.296, plnMargin: 40.82, intranetId: 12047, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 124x49,6cm": { plnPrice: 63.812, plnMargin: 22.79, intranetId: 18697, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 148,8x198,4cm": { plnPrice: 162.736, plnMargin: 58.12, intranetId: 17330, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 148,8x248cm": { plnPrice: 168.0, plnMargin: 60.0, intranetId: 17265, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 148,8x297,6cm": { plnPrice: 302.596, plnMargin: 108.07, intranetId: 17148, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 148,8x347,2cm": { plnPrice: 350.084, plnMargin: 125.03, intranetId: 17139, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 148,8x396,8cm": { plnPrice: 268.016, plnMargin: 95.72, intranetId: 17596, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 148,8x49,6cm": { plnPrice: 65.128, plnMargin: 23.26, intranetId: 18696, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x148,8cm": { plnPrice: 207.62, plnMargin: 74.15, intranetId: 18709, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x198,4cm": { plnPrice: 210.252, plnMargin: 75.09, intranetId: 17211, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x248cm": { plnPrice: 212.884, plnMargin: 76.03, intranetId: 16944, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x297,6cm": { plnPrice: 268.016, plnMargin: 95.72, intranetId: 16948, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x347,2cm": { plnPrice: 352.744, plnMargin: 125.98, intranetId: 17140, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x396,8cm": { plnPrice: 400.26, plnMargin: 142.95, intranetId: 17259, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x49,6cm": { plnPrice: 67.76, plnMargin: 24.2, intranetId: 18698, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 198,4x99,2cm": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 17280, category: "wydruk blockout mframe" },
  "Wydruk mframe na tekstyliach 24,8x248cm": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19616, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 248x248cm": { plnPrice: 260.372, plnMargin: 92.99, intranetId: 17149, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 248x396,8cm": { plnPrice: 505.372, plnMargin: 180.49, intranetId: 18720, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 248x49,6cm": { plnPrice: 70.392, plnMargin: 25.14, intranetId: 18699, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 248x99,2cm": { plnPrice: 70.392, plnMargin: 25.14, intranetId: 18929, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 297,6x148,8cm": { plnPrice: 302.596, plnMargin: 108.07, intranetId: 18771, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 297,6x198,4cm": { plnPrice: 305.256, plnMargin: 109.02, intranetId: 17244, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 297,6x248cm": { plnPrice: 307.888, plnMargin: 109.96, intranetId: 16945, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 297,6x297,6cm": { plnPrice: 387.968, plnMargin: 138.56, intranetId: 16949, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 297,6x396.8cm": { plnPrice: 508.004, plnMargin: 181.43, intranetId: 17258, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 297,6x49,6cm": { plnPrice: 297.36, plnMargin: 106.2, intranetId: 18700, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 297,6x99,2cm": { plnPrice: 299.992, plnMargin: 107.14, intranetId: 17129, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 347,2x148,8cm": { plnPrice: 347.452, plnMargin: 124.09, intranetId: 18710, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 347,2x198,4cm": { plnPrice: 347.452, plnMargin: 124.09, intranetId: 18711, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 347,2x248cm": { plnPrice: 364.896, plnMargin: 130.32, intranetId: 17398, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 347,2x297,6cm": { plnPrice: 459.508, plnMargin: 164.11, intranetId: 18713, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 347,2x49,6cm": { plnPrice: 344.82, plnMargin: 123.15, intranetId: 18701, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 347,2x99,2cm": { plnPrice: 344.82, plnMargin: 123.15, intranetId: 18705, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 396,8x248cm": { plnPrice: 402.892, plnMargin: 143.89, intranetId: 16946, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 396,8x297,6cm": { plnPrice: 508.004, plnMargin: 181.43, intranetId: 16950, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 396,8x49,6cm": { plnPrice: 392.336, plnMargin: 140.12, intranetId: 17131, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 396,8x99,2cm": { plnPrice: 394.968, plnMargin: 141.06, intranetId: 17260, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 446,4x248cm": { plnPrice: 451.696, plnMargin: 161.32, intranetId: 18797, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 446,4x49,6cm": { plnPrice: 439.824, plnMargin: 157.08, intranetId: 18702, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 446,4x99,2cm": { plnPrice: 442.456, plnMargin: 158.02, intranetId: 18706, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 49,6x198,4cm": { plnPrice: 72.24, plnMargin: 25.8, intranetId: 16936, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 49,6x248cm": { plnPrice: 74.872, plnMargin: 26.74, intranetId: 16937, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 49,6x297,6cm": { plnPrice: 93.856, plnMargin: 33.52, intranetId: 16938, category: "wydruk blockout mframe" },
  "Wydruk mframe na tekstyliach 49,6x347,2cm": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19612, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 49,6x396,8cm": { plnPrice: 494.816, plnMargin: 176.72, intranetId: 18718, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 49,6x49,6cm": { plnPrice: 64.344, plnMargin: 22.98, intranetId: 16932, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 49,6x99,2cm": { plnPrice: 66.976, plnMargin: 23.92, intranetId: 16933, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 496,8x248cm (niestandard)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19854, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 496x248cm": { plnPrice: 497.868, plnMargin: 177.81, intranetId: 16947, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 496x297,6cm": { plnPrice: 622.384, plnMargin: 222.28, intranetId: 17254, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 496x49,6cm": { plnPrice: 487.312, plnMargin: 174.04, intranetId: 17422, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 496x99,2cm": { plnPrice: 489.944, plnMargin: 174.98, intranetId: 17441, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 545,6x248cm": { plnPrice: 554.344, plnMargin: 197.98, intranetId: 18722, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 595,2x248cm": { plnPrice: 581.252, plnMargin: 207.59, intranetId: 17279, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 595,2x297,6cm": { plnPrice: 747.992, plnMargin: 267.14, intranetId: 17407, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 595,2x49,6cm": { plnPrice: 573.384, plnMargin: 204.78, intranetId: 17824, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 595,2x99,2cm": { plnPrice: 576.016, plnMargin: 205.72, intranetId: 17423, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 62x99,2cm": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 17358, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 644,8x297,6cm": { plnPrice: 801.388, plnMargin: 286.21, intranetId: 18714, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 694,4x248cm": { plnPrice: 687.876, plnMargin: 245.67, intranetId: 17264, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 694,4x297,6cm": { plnPrice: 867.944, plnMargin: 309.98, intranetId: 17405, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 793,6x148,8": { plnPrice: 777.644, plnMargin: 277.73, intranetId: 17261, category: "wydruk blockout mframe" },
  "Wydruk mframe na tekstyliach 793,6x297,6cm": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19614, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 793,6x99,2cm": { plnPrice: 765.996, plnMargin: 273.57, intranetId: 18707, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 892,8x297,6cm": { plnPrice: 1110.62, plnMargin: 396.65, intranetId: 18717, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x124cm": { plnPrice: 111.3, plnMargin: 39.75, intranetId: 17653, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x148,8cm": { plnPrice: 112.616, plnMargin: 40.22, intranetId: 16942, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x198,4cm": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 16941, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x248cm": { plnPrice: 117.88, plnMargin: 42.1, intranetId: 16940, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x297,6cm": { plnPrice: 148.036, plnMargin: 52.87, intranetId: 16939, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x347,2cm": { plnPrice: 347.452, plnMargin: 124.09, intranetId: 18496, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x396,8cm": { plnPrice: 497.448, plnMargin: 177.66, intranetId: 18719, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x396,8cm drzwi + ościeżnica z górą (niestandard z docięciem)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19805, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x49,6cm": { plnPrice: 66.976, plnMargin: 23.92, intranetId: 17130, category: "wydruk blockout mframe" },
  "Wydruk mFrame na tekstyliach 99,2x99,2cm": { plnPrice: 109.956, plnMargin: 39.27, intranetId: 16943, category: "wydruk blockout mframe" },
  "Wydruk mFrame PCV - KLEJONY": { plnPrice: 385.196, plnMargin: 137.57, intranetId: 17424, category: "wydruk blockout mframe" },

  // --- Kategoria: wydruk blockout multiframe ---
  "Wydruk Multiframe (do 1mb/medium250)": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 10551, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe (do 3mb/medium250)": { plnPrice: 308.756, plnMargin: 110.27, intranetId: 18014, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe (pow. 3mb/medium250)": { plnPrice: 497.42, plnMargin: 177.65, intranetId: 18015, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe (pow. 3mb/medium320)": { plnPrice: 626.276, plnMargin: 223.67, intranetId: 18684, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe - Dach 200cm": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 18258, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 240 SET1 jednostronny": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 18942, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 240 SET2 jednostronny": { plnPrice: 214.424, plnMargin: 76.58, intranetId: 18944, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 240 SET3 jednostronny": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19254, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 240 SET4 jednostronny": { plnPrice: 403.116, plnMargin: 143.97, intranetId: 18943, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 240 SET6 jednostronny": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19255, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET1 jednostronny": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 16608, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET2 jednostronny": { plnPrice: 214.424, plnMargin: 76.58, intranetId: 16609, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET3 jednostronny": { plnPrice: 308.756, plnMargin: 110.27, intranetId: 16610, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET4 jednostronny": { plnPrice: 403.116, plnMargin: 143.97, intranetId: 16611, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET5 jednostronny": { plnPrice: 497.42, plnMargin: 177.65, intranetId: 16612, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET6 jednostronny": { plnPrice: 591.78, plnMargin: 211.35, intranetId: 16613, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET8 jednostronny": { plnPrice: 780.472, plnMargin: 278.74, intranetId: 16615, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 250 SET9 jednostronny": { plnPrice: 874.776, plnMargin: 312.42, intranetId: 16616, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 301 SET2 jednostronny": { plnPrice: 339.752, plnMargin: 121.34, intranetId: 16752, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 301 SET4 jednostronny": { plnPrice: 581.28, plnMargin: 207.6, intranetId: 18232, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 301 SET5 jednostronny": { plnPrice: 732.312, plnMargin: 261.54, intranetId: 17929, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 301 SET6 jednostronny": { plnPrice: 863.184, plnMargin: 308.28, intranetId: 18683, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 301 SET7 jednostronny": { plnPrice: 994.056, plnMargin: 355.02, intranetId: 18544, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 350 SET1 jednostronny": { plnPrice: 440.328, plnMargin: 157.26, intranetId: 17343, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 350 SET2 jednostronny": { plnPrice: 444.948, plnMargin: 158.91, intranetId: 17344, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe 350 SET3 jednostronny": { plnPrice: 449.568, plnMargin: 160.56, intranetId: 17345, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 240 - Bok kantorka": { plnPrice: 161.812, plnMargin: 57.79, intranetId: 11865, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 240 - Drzwi": { plnPrice: 161.812, plnMargin: 57.79, intranetId: 11863, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 240 - Tył kantorka": { plnPrice: 161.812, plnMargin: 57.79, intranetId: 11864, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 250 - Bok kantorka": { plnPrice: 163.856, plnMargin: 58.52, intranetId: 11994, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 250 - Bok kantorka set2": { plnPrice: 209.748, plnMargin: 74.91, intranetId: 17696, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 250 - Drzwi": { plnPrice: 119.896, plnMargin: 42.82, intranetId: 11995, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 250 - Tył kantorka": { plnPrice: 173.936, plnMargin: 62.12, intranetId: 11996, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 301 - Bok kantorka set2": { plnPrice: 313.74, plnMargin: 112.05, intranetId: 17116, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 301 - Drzwi": { plnPrice: 208.712, plnMargin: 74.54, intranetId: 18941, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Kantorek 301 - Tył kantorka": { plnPrice: 208.712, plnMargin: 74.54, intranetId: 17115, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Nadstawka 100 - Bok": { plnPrice: 133.532, plnMargin: 47.69, intranetId: 16722, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Nadstawka 100 - Nad drzwiami/Tył": { plnPrice: 133.532, plnMargin: 47.69, intranetId: 16723, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Nadstawka 50 - Nad drzwiami/Tył": { plnPrice: 123.424, plnMargin: 44.08, intranetId: 16720, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Tribune": { plnPrice: 93.128, plnMargin: 33.26, intranetId: 12187, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Tribune (H+5cm STARY TYP)": { plnPrice: 93.128, plnMargin: 33.26, intranetId: 17442, category: "wydruk blockout multiframe" },
  "Wydruk Multiframe Tribune tył": { plnPrice: 124.712, plnMargin: 44.54, intranetId: 18849, category: "wydruk blockout multiframe" },

  // --- Kategoria: wydruk classic ---
  "adWall L 200 wydruk": { plnPrice: 168.98, plnMargin: 60.35, intranetId: 10735, category: "wydruk classic" },
  "Wydruk adWall Smart prosta 4x3": { plnPrice: 1891.148, plnMargin: 675.41, intranetId: 10787, category: "wydruk classic" },
  "Wydruk adWall Smart łukowa 3x3": { plnPrice: 1540.84, plnMargin: 550.3, intranetId: 10227, category: "wydruk classic" },
  "Wydruk adWall Smart łukowa 4x3": { plnPrice: 1753.416, plnMargin: 626.22, intranetId: 10228, category: "wydruk classic" },
  "Wydruk do nadstawki A4 jednostronny": { plnPrice: 10.276, plnMargin: 3.67, intranetId: 12314, category: "wydruk classic" },
  "Wydruk do nadstawki premium/prestige jednostronny": { plnPrice: 10.276, plnMargin: 3.67, intranetId: 16959, category: "wydruk classic" },
  "Wydruk mFrame na folii z PCV": { plnPrice: 255.64, plnMargin: 91.3, intranetId: 10799, category: "wydruk classic" },
  "Wydruk niestandardowy CLASSIC / BANER ECONO": { plnPrice: 18.928, plnMargin: 6.76, intranetId: 12185, category: "wydruk classic" },
  "Wydruk niestandardowy CLASSIC / FOLIA 100": { plnPrice: 34.272, plnMargin: 12.24, intranetId: 12171, category: "wydruk classic" },
  "Wydruk niestandardowy CLASSIC / FOLIA 105": { plnPrice: 34.272, plnMargin: 12.24, intranetId: 12172, category: "wydruk classic" },
  "Wydruk niestandardowy CLASSIC / Rollup 91,4": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19676, category: "wydruk classic" },

  // --- Kategoria: wydruk flaga ---
  "Wydruk adFlag BLADE L": { plnPrice: 54.264, plnMargin: 19.38, intranetId: 15662, category: "wydruk flaga" },
  "Wydruk adFlag BLADE M": { plnPrice: 43.932, plnMargin: 15.69, intranetId: 15663, category: "wydruk flaga" },
  "Wydruk adFlag BLADE S": { plnPrice: 36.148, plnMargin: 12.91, intranetId: 15664, category: "wydruk flaga" },
  "Wydruk adFlag BLADE XL": { plnPrice: 60.704, plnMargin: 21.68, intranetId: 15665, category: "wydruk flaga" },
  "Wydruk adFlag DROP M": { plnPrice: 41.328, plnMargin: 14.76, intranetId: 15673, category: "wydruk flaga" },
  "Wydruk adFlag HOOK L": { plnPrice: 54.264, plnMargin: 19.38, intranetId: 15666, category: "wydruk flaga" },
  "Wydruk adFlag HOOK M": { plnPrice: 43.932, plnMargin: 15.69, intranetId: 15668, category: "wydruk flaga" },
  "Wydruk adFlag HOOK S": { plnPrice: 36.148, plnMargin: 12.91, intranetId: 15667, category: "wydruk flaga" },
  "Wydruk adFlag HOOK XL": { plnPrice: 60.704, plnMargin: 21.68, intranetId: 15669, category: "wydruk flaga" },
  "Wydruk adFlag STANDARD L": { plnPrice: 52.976, plnMargin: 18.92, intranetId: 15674, category: "wydruk flaga" },
  "Wydruk adFlag STANDARD M": { plnPrice: 43.932, plnMargin: 15.69, intranetId: 15675, category: "wydruk flaga" },
  "Wydruk adFlag STANDARD S": { plnPrice: 33.6, plnMargin: 12.0, intranetId: 15676, category: "wydruk flaga" },
  "Wydruk adFlag STANDARD XL": { plnPrice: 60.704, plnMargin: 21.68, intranetId: 15677, category: "wydruk flaga" },
  "Wydruk niestandardowy MODERN / FLAG": { plnPrice: 25.788, plnMargin: 9.21, intranetId: 16156, category: "wydruk flaga" },

  // --- Kategoria: wydruk leżak premium ---
  "Wydruk Leżak": { plnPrice: 23.408, plnMargin: 8.36, intranetId: 12489, category: "wydruk leżak premium" },

  // --- Kategoria: wydruk meble reklamowe ---
  "Wydruk adFoam Cube nowy": { plnPrice: 58.576, plnMargin: 20.92, intranetId: 19069, category: "wydruk meble reklamowe" },
  "Wydruk adFoam Cube stary": { plnPrice: 58.576, plnMargin: 20.92, intranetId: 11030, category: "wydruk meble reklamowe" },
  "Wydruk adFoam Forma": { plnPrice: 167.888, plnMargin: 59.96, intranetId: 11426, category: "wydruk meble reklamowe" },
  "Wydruk adFoam Forma podnóżek": { plnPrice: 89.796, plnMargin: 32.07, intranetId: 11822, category: "wydruk meble reklamowe" },
  "Wydruk adFoam Roller": { plnPrice: 89.796, plnMargin: 32.07, intranetId: 10578, category: "wydruk meble reklamowe" },
  "Wydruk adFoam Roller Mini": { plnPrice: 89.796, plnMargin: 32.07, intranetId: 11047, category: "wydruk meble reklamowe" },

  // --- Kategoria: wydruk namioty ---
  "Wydruk adTent Air Premium 6x6 (ściana boczna jednostronna)": { plnPrice: 859.572, plnMargin: 306.99, intranetId: 15862, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x3m DACH": { plnPrice: 936.908, plnMargin: 334.61, intranetId: 15608, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x3m ŚCIANA": { plnPrice: 304.5, plnMargin: 108.75, intranetId: 15611, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x3m ŚCIANA DWUSTRONNA PREMIUM": { plnPrice: 609.0, plnMargin: 217.5, intranetId: 15844, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x3m ŚCIANA DWUSTRONNA PREMIUM-BLOCKOUT": { plnPrice: 618.296, plnMargin: 220.82, intranetId: 15848, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x4,5m DACH": { plnPrice: 1218.0, plnMargin: 435.0, intranetId: 15609, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x4,5m ŚCIANA": { plnPrice: 445.032, plnMargin: 158.94, intranetId: 15612, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x4,5m ŚCIANA DWUSTRONNA PREMIUM": { plnPrice: 890.036, plnMargin: 317.87, intranetId: 16149, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x4,5m ŚCIANA DWUSTRONNA PREMIUM BLOCKOUT": { plnPrice: 903.728, plnMargin: 322.76, intranetId: 16402, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x6m DACH": { plnPrice: 1499.036, plnMargin: 535.37, intranetId: 15610, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x6m ŚCIANA": { plnPrice: 585.592, plnMargin: 209.14, intranetId: 15613, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x6m ŚCIANA DWUSTRONNA PREMIUM": { plnPrice: 1171.128, plnMargin: 418.26, intranetId: 16150, category: "wydruk namioty" },
  "wydruk adTent EXPRESS 3x6m ŚCIANA DWUSTRONNA PREMIUM BLOCKOUT": { plnPrice: 1189.188, plnMargin: 424.71, intranetId: 16785, category: "wydruk namioty" },
  "Wydruk adTent Vario 3x3 - dach": { plnPrice: 1027.936, plnMargin: 367.12, intranetId: 11110, category: "wydruk namioty" },
  "Wydruk adTent Vario 3x3 - ściana dwustronna": { plnPrice: 504.364, plnMargin: 180.13, intranetId: 12195, category: "wydruk namioty" },
  "Wydruk adTent Vario 3x3 - ściana jednostronna": { plnPrice: 305.228, plnMargin: 109.01, intranetId: 11594, category: "wydruk namioty" },
  "Wydruk adTent Vario 3x3 - ściana ŚCIANA DWUSTRONNA PREMIUM-BLOCKOUT": { plnPrice: 620.536, plnMargin: 221.62, intranetId: 18949, category: "wydruk namioty" },
  "Wydruk adTent Vario 4x4 - dach": { plnPrice: 1515.92, plnMargin: 541.4, intranetId: 11111, category: "wydruk namioty" },
  "Wydruk adTent Vario 4x4 - ściana dwustronna": { plnPrice: 637.056, plnMargin: 227.52, intranetId: 12196, category: "wydruk namioty" },
  "Wydruk adTent Vario 4x4 - ściana jednostronna": { plnPrice: 391.132, plnMargin: 139.69, intranetId: 11595, category: "wydruk namioty" },
  "wydruk adTent Vario 4x4m ŚCIANA DWUSTRONNA PREMIUM-BLOCKOUT": { plnPrice: 794.22, plnMargin: 283.65, intranetId: 16482, category: "wydruk namioty" },

  // --- Kategoria: wydruk namioty premium ---
  "Wydruk adTent Air 3x3 - ŚCIANA DWUSTRONNA": { plnPrice: 481.012, plnMargin: 171.79, intranetId: 12191, category: "wydruk namioty premium" },
  "Wydruk adTent Air 3x3 - ŚCIANA JEDNOSTRONNA": { plnPrice: 246.764, plnMargin: 88.13, intranetId: 11470, category: "wydruk namioty premium" },
  "Wydruk adTent Air 5x5 - DACH": { plnPrice: 1964.452, plnMargin: 701.59, intranetId: 11102, category: "wydruk namioty premium" },
  "Wydruk adTent Air 5x5 - ŚCIANA JEDNOSTRONNA": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 11472, category: "wydruk namioty premium" },
  "Wydruk adTent Air 5x5 - ŚCIANA JEDNOSTRONNA WARIANTY": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 15857, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 3x3 (sam dach)": { plnPrice: 859.684, plnMargin: 307.03, intranetId: 14003, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 3x3 (same nogi 4)": { plnPrice: 457.548, plnMargin: 163.41, intranetId: 16636, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 3x3 (ściana boczna dwustronna PREMIUM BLOCKOUT)": { plnPrice: 579.208, plnMargin: 206.86, intranetId: 16972, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 3x3 (ściana boczna dwustronna)": { plnPrice: 481.012, plnMargin: 171.79, intranetId: 14024, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 3x3 (ściana boczna jednostronna)": { plnPrice: 324.884, plnMargin: 116.03, intranetId: 17311, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 3x3 (ściana boczna jednostronna) WARIANT": { plnPrice: 324.884, plnMargin: 116.03, intranetId: 14012, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 4x4 (dach)": { plnPrice: 937.748, plnMargin: 334.91, intranetId: 14005, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 4x4 (sama noga)": { plnPrice: 203.84, plnMargin: 72.8, intranetId: 17292, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 4x4 (same nogi 3)": { plnPrice: 438.06, plnMargin: 156.45, intranetId: 17294, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 4x4 (same nogi 4)": { plnPrice: 555.184, plnMargin: 198.28, intranetId: 17295, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 4x4 (ściana boczna dwustronna)": { plnPrice: 637.14, plnMargin: 227.55, intranetId: 14025, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 4x4 (ściana boczna jednostronna)": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 15860, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 4x4 (ściana boczna jednostronna) WARIANTY": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 14013, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x4 boczna jednostronna)": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 18850, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x4 boczna PREM_BLOCK)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19817, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x6 boczna jednostronna)": { plnPrice: 508.312, plnMargin: 181.54, intranetId: 18818, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x6 boczna PREM_BLOCK)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19819, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 5x5 (dach)": { plnPrice: 1406.188, plnMargin: 502.21, intranetId: 14006, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 5x5 (sama noga)": { plnPrice: 258.496, plnMargin: 92.32, intranetId: 17297, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 5x5 (same nogi 3)": { plnPrice: 625.436, plnMargin: 223.37, intranetId: 17299, category: "wydruk namioty premium" },
  "Wydruk Adtent Air premium 5x5 (same nogi 4)": { plnPrice: 797.216, plnMargin: 284.72, intranetId: 17300, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 5x5 (ściana boczna jednostronna)": { plnPrice: 523.936, plnMargin: 187.12, intranetId: 15861, category: "wydruk namioty premium" },
  "Wydruk adTent Air Premium 5x5 (ściana boczna jednostronna) WARIANTY": { plnPrice: 523.936, plnMargin: 187.12, intranetId: 14014, category: "wydruk namioty premium" },

  // --- Kategoria: wydruk premium ---
  "Wydruk adFrame DTF (do 1mb/medium250)": { plnPrice: 121.828, plnMargin: 43.51, intranetId: 10546, category: "wydruk premium" },
  "Wydruk adFrame DTF (do 1mb/medium320)": { plnPrice: 153.244, plnMargin: 54.73, intranetId: 18011, category: "wydruk premium" },
  "Wydruk adFrame DTF (do 3mb/medium250)": { plnPrice: 311.5, plnMargin: 111.25, intranetId: 16423, category: "wydruk premium" },
  "Wydruk adFrame DTF (do 3mb/medium320)": { plnPrice: 392.924, plnMargin: 140.33, intranetId: 18012, category: "wydruk premium" },
  "Wydruk adFrame DTF (pow. 3mb/medium250)": { plnPrice: 501.228, plnMargin: 179.01, intranetId: 16424, category: "wydruk premium" },
  "Wydruk adFrame DTF (pow. 3mb/medium320)": { plnPrice: 632.604, plnMargin: 225.93, intranetId: 18013, category: "wydruk premium" },
  "Wydruk adFrame STF/STFL (do 1mb/medium250)": { plnPrice: 90.076, plnMargin: 32.17, intranetId: 17953, category: "wydruk premium" },
  "Wydruk adFrame STF/STFL (do 3mb/medium250)": { plnPrice: 224.504, plnMargin: 80.18, intranetId: 17980, category: "wydruk premium" },
  "Wydruk adFrame STF/STFL (pow. 3mb/medium250)": { plnPrice: 358.932, plnMargin: 128.19, intranetId: 17978, category: "wydruk premium" },
  "Wydruk Air Column ∅60x100 NEW (z zaworem)": { plnPrice: 109.284, plnMargin: 39.03, intranetId: 18679, category: "wydruk premium" },
  "Wydruk Air Column ∅60x100 Tribune": { plnPrice: 109.284, plnMargin: 39.03, intranetId: 11613, category: "wydruk premium" },
  "Wydruk Air Column ∅60x220 NEW (z zaworem)": { plnPrice: 109.284, plnMargin: 39.03, intranetId: 18472, category: "wydruk premium" },
  "Wydruk Air Column ∅60x320": { plnPrice: 335.72, plnMargin: 119.9, intranetId: 17707, category: "wydruk premium" },
  "Wydruk Air Column ∅60x320 NEW (z zaworem)": { plnPrice: 335.72, plnMargin: 119.9, intranetId: 18473, category: "wydruk premium" },
  "Wydruk Air GATE ROUND": { plnPrice: 937.748, plnMargin: 334.91, intranetId: 18731, category: "wydruk premium" },
  "Wydruk Air GATE Triangle 6,5m ver2": { plnPrice: 1105.636, plnMargin: 394.87, intranetId: 16822, category: "wydruk premium" },
  "Wydruk niestandardowy MODERN / PREMIUM": { plnPrice: 95.06, plnMargin: 33.95, intranetId: 12181, category: "wydruk premium" },

  // --- Kategoria: wydruk ramy tekstylne custom niepodświetlane ---
  "Pasowanie wydruków (1szt=1łączenie)": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 18322, category: "wydruk ramy tekstylne custom niepodświetlane" },

  // --- Kategoria: wydruk ramy tekstylne custom podświetlane ---
  "Wydruk adFrame CTF LED": { plnPrice: 84.924, plnMargin: 30.33, intranetId: 17137, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk adFrame LMD zaokrąglone rogi (do 3mb/medium250)": { plnPrice: 231.924, plnMargin: 82.83, intranetId: 18838, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM (do 1mb/medium250)": { plnPrice: 92.764, plnMargin: 33.13, intranetId: 14193, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM (do 1mb/medium320)": { plnPrice: 112.448, plnMargin: 40.16, intranetId: 18008, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM (do 3mb/medium250)": { plnPrice: 231.924, plnMargin: 82.83, intranetId: 16405, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM (do 3mb/medium320)": { plnPrice: 281.344, plnMargin: 100.48, intranetId: 18009, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM (pow. 3mb/medium250)": { plnPrice: 373.604, plnMargin: 133.43, intranetId: 17599, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM (pow. 3mb/medium320)": { plnPrice: 439.992, plnMargin: 157.14, intranetId: 18010, category: "wydruk ramy tekstylne custom podświetlane" },
  "Wydruk niestandardowy MODERN / KASETON LED": { plnPrice: 74.116, plnMargin: 26.47, intranetId: 12180, category: "wydruk ramy tekstylne custom podświetlane" },

  // --- Kategoria: wydruk ramy tekstylne p&p ---
  "Wydruk Adframe Flex Led 200x250": { plnPrice: 159.824, plnMargin: 57.08, intranetId: 18551, category: "wydruk ramy tekstylne p&p" },
  "Wydruk Adframe Flex Led 200x250 tył": { plnPrice: 197.232, plnMargin: 70.44, intranetId: 18552, category: "wydruk ramy tekstylne p&p" },
  "Wydruk Adframe Flex Led 300x250": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 18549, category: "wydruk ramy tekstylne p&p" },
  "Wydruk Adframe Flex Led 400x250": { plnPrice: 296.352, plnMargin: 105.84, intranetId: 18553, category: "wydruk ramy tekstylne p&p" },
  "Wydruk Adframe Flex Led 400x250 tył": { plnPrice: 296.352, plnMargin: 105.84, intranetId: 18554, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame LPO 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 16289, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Lumina RGB 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 18425, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Lumina RGB 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 18420, category: "wydruk ramy tekstylne p&p" },
  "wydruk adFrame Pixlip 100x200": { plnPrice: 81.928, plnMargin: 29.26, intranetId: 18755, category: "wydruk ramy tekstylne p&p" },
  "wydruk adFrame Pixlip 100x250": { plnPrice: 88.704, plnMargin: 31.68, intranetId: 18756, category: "wydruk ramy tekstylne p&p" },
  "wydruk adFrame Pixlip 200x225": { plnPrice: 158.368, plnMargin: 56.56, intranetId: 18766, category: "wydruk ramy tekstylne p&p" },
  "wydruk adFrame Pixlip 200x250": { plnPrice: 158.368, plnMargin: 56.56, intranetId: 18767, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Poster 100x100": { plnPrice: 82.964, plnMargin: 29.63, intranetId: 16737, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Poster 100x150": { plnPrice: 85.568, plnMargin: 30.56, intranetId: 16739, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Poster 100x200": { plnPrice: 88.172, plnMargin: 31.49, intranetId: 16740, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Poster 100x300": { plnPrice: 219.52, plnMargin: 78.4, intranetId: 16742, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Poster 70x100": { plnPrice: 62.496, plnMargin: 22.32, intranetId: 16743, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 12165, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick 100x200 tyl": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 17158, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 12245, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick 85x200": { plnPrice: 72.016, plnMargin: 25.72, intranetId: 18178, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick 85x250": { plnPrice: 77.924, plnMargin: 27.83, intranetId: 18112, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick Battery 100x200": { plnPrice: 84.252, plnMargin: 30.09, intranetId: 16126, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick Single 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 13674, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick Single 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 13676, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Quick Single 85x200": { plnPrice: 80.584, plnMargin: 28.78, intranetId: 13682, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Smart 100x200": { plnPrice: 81.928, plnMargin: 29.26, intranetId: 12228, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Smart 100x250": { plnPrice: 91.336, plnMargin: 32.62, intranetId: 12234, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Smart 200x200": { plnPrice: 144.48, plnMargin: 51.6, intranetId: 14240, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Smart 200x250": { plnPrice: 159.824, plnMargin: 57.08, intranetId: 14239, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Smart 300x200": { plnPrice: 206.808, plnMargin: 73.86, intranetId: 14241, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Smart 300x250": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 12237, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Smart 85x250": { plnPrice: 81.088, plnMargin: 28.96, intranetId: 17564, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Starter 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 13678, category: "wydruk ramy tekstylne p&p" },
  "Wydruk adFrame Starter 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 13679, category: "wydruk ramy tekstylne p&p" },
  "wydruk adTribune Cubic - 1 bok": { plnPrice: 74.62, plnMargin: 26.65, intranetId: 18316, category: "wydruk ramy tekstylne p&p" },
  "wydruk adTribune Cubic - 4 boki razem": { plnPrice: 169.344, plnMargin: 60.48, intranetId: 18334, category: "wydruk ramy tekstylne p&p" },
  "Wydruk Pop-up Counter Lightbox 100x100 - keder 14x3mm": { plnPrice: 82.964, plnMargin: 29.63, intranetId: 17858, category: "wydruk ramy tekstylne p&p" },
  "Wydruk Pop-up Lightbox 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 17859, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 100x200 [keder 9x3mm]": { plnPrice: 126.336, plnMargin: 45.12, intranetId: 13700, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 100x200 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 153.188, plnMargin: 54.71, intranetId: 18930, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 100x250 [keder 9x3mm]": { plnPrice: 143.248, plnMargin: 51.16, intranetId: 13698, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 100x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 163.296, plnMargin: 58.32, intranetId: 18570, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 100x300 [keder 9x3mm]": { plnPrice: 170.296, plnMargin: 60.82, intranetId: 17854, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 100x300 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 208.152, plnMargin: 74.34, intranetId: 19098, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 200x250 [keder 9x3mm]": { plnPrice: 246.708, plnMargin: 88.11, intranetId: 18681, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 200x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 263.956, plnMargin: 94.27, intranetId: 18748, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 200x300 [keder 9x3mm]": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19035, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 300x250 [keder 9x3mm]": { plnPrice: 309.736, plnMargin: 110.62, intranetId: 13699, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 300x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 364.588, plnMargin: 130.21, intranetId: 18571, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 300x300 [keder 9x3mm]": { plnPrice: 277.592, plnMargin: 99.14, intranetId: 17853, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 85x200 [keder 9x3mm]": { plnPrice: 117.74, plnMargin: 42.05, intranetId: 17618, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 85x250 [keder 9x3mm]": { plnPrice: 130.732, plnMargin: 46.69, intranetId: 18185, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 85x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 151.2, plnMargin: 54.0, intranetId: 18779, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 85x300 [keder 9x3mm]": { plnPrice: 155.568, plnMargin: 55.56, intranetId: 18184, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box 85x300 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 199.5, plnMargin: 71.25, intranetId: 19097, category: "wydruk ramy tekstylne p&p" },
  "Wydruk SEGO Light Box Counter 100x100 [keder 9x3mm]": { plnPrice: 103.46, plnMargin: 36.95, intranetId: 13701, category: "wydruk ramy tekstylne p&p" },

  // --- Kategoria: wydruk ramy tekstylne standard niepodświetlane ---
  "Wydruk adFrame CTF": { plnPrice: 203.84, plnMargin: 72.8, intranetId: 12161, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF - górny blockout": { plnPrice: 103.544, plnMargin: 36.98, intranetId: 16132, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF 100x100": { plnPrice: 103.544, plnMargin: 36.98, intranetId: 15140, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF 100x245": { plnPrice: 111.384, plnMargin: 39.78, intranetId: 15146, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF 100x300": { plnPrice: 274.904, plnMargin: 98.18, intranetId: 15147, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF 150x150": { plnPrice: 149.016, plnMargin: 53.22, intranetId: 15142, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF 150x150 - górny blockout": { plnPrice: 149.016, plnMargin: 53.22, intranetId: 15262, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF 50x50": { plnPrice: 58.1, plnMargin: 20.75, intranetId: 15153, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame CTF 50x50 - górny blockout": { plnPrice: 58.1, plnMargin: 20.75, intranetId: 18953, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 100x250": { plnPrice: 111.636, plnMargin: 39.87, intranetId: 14828, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 150x200": { plnPrice: 111.664, plnMargin: 39.88, intranetId: 14827, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 200x200": { plnPrice: 194.74, plnMargin: 69.55, intranetId: 14825, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 200x250": { plnPrice: 197.344, plnMargin: 70.48, intranetId: 14823, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 300x200": { plnPrice: 280.532, plnMargin: 100.19, intranetId: 14822, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 300x250": { plnPrice: 282.996, plnMargin: 101.07, intranetId: 14821, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 400x200": { plnPrice: 366.156, plnMargin: 130.77, intranetId: 14820, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 400x250": { plnPrice: 368.76, plnMargin: 131.7, intranetId: 14819, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 500x200": { plnPrice: 451.836, plnMargin: 161.37, intranetId: 14818, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 500x250": { plnPrice: 454.468, plnMargin: 162.31, intranetId: 14817, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame DTF 600x250": { plnPrice: 540.12, plnMargin: 192.9, intranetId: 14815, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 100x200": { plnPrice: 86.38, plnMargin: 30.85, intranetId: 17956, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 100x250": { plnPrice: 88.956, plnMargin: 31.77, intranetId: 17957, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 150x200": { plnPrice: 89.012, plnMargin: 31.79, intranetId: 17960, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 200x200": { plnPrice: 152.376, plnMargin: 54.42, intranetId: 17963, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 300x200": { plnPrice: 218.456, plnMargin: 78.02, intranetId: 17964, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 300x250": { plnPrice: 220.976, plnMargin: 78.92, intranetId: 17965, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 59x84": { plnPrice: 53.004, plnMargin: 18.93, intranetId: 14606, category: "wydruk ramy tekstylne standard niepodświetlane" },
  "Wydruk adFrame STF/STFL 70x100": { plnPrice: 61.348, plnMargin: 21.91, intranetId: 17975, category: "wydruk ramy tekstylne standard niepodświetlane" },

  // --- Kategoria: wydruk ramy tekstylne standard podświetlane ---
  "Wydruk adBoard LED 65x100": { plnPrice: 53.62, plnMargin: 19.15, intranetId: 16220, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adBoard LED 85x120": { plnPrice: 69.356, plnMargin: 24.77, intranetId: 16221, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame CTF LED 100x100": { plnPrice: 83.524, plnMargin: 29.83, intranetId: 15263, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame CTF LED 150x150": { plnPrice: 120.288, plnMargin: 42.96, intranetId: 15265, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame CTF LED 50x50": { plnPrice: 49.364, plnMargin: 17.63, intranetId: 18954, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 100x100": { plnPrice: 83.776, plnMargin: 29.92, intranetId: 14581, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 100x150": { plnPrice: 86.408, plnMargin: 30.86, intranetId: 14613, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 100x200": { plnPrice: 82.208, plnMargin: 29.36, intranetId: 14442, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 100x250": { plnPrice: 91.588, plnMargin: 32.71, intranetId: 14443, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 100x300": { plnPrice: 215.124, plnMargin: 76.83, intranetId: 14832, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 150x150": { plnPrice: 120.568, plnMargin: 43.06, intranetId: 14713, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 150x200": { plnPrice: 123.172, plnMargin: 43.99, intranetId: 10548, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 150x250": { plnPrice: 125.776, plnMargin: 44.92, intranetId: 14075, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 200x200": { plnPrice: 144.536, plnMargin: 51.62, intranetId: 14088, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 200x250": { plnPrice: 159.908, plnMargin: 57.11, intranetId: 14097, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 300x200": { plnPrice: 225.568, plnMargin: 80.56, intranetId: 14111, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 300x250": { plnPrice: 228.312, plnMargin: 81.54, intranetId: 14124, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 400x200": { plnPrice: 293.888, plnMargin: 104.96, intranetId: 14133, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 400x250": { plnPrice: 296.492, plnMargin: 105.89, intranetId: 14142, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 500x200": { plnPrice: 362.208, plnMargin: 129.36, intranetId: 14154, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 500x250": { plnPrice: 364.812, plnMargin: 130.29, intranetId: 14163, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 600x250": { plnPrice: 433.076, plnMargin: 154.67, intranetId: 14180, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 70x100": { plnPrice: 82.712, plnMargin: 29.54, intranetId: 14833, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 70x120": { plnPrice: 82.712, plnMargin: 29.54, intranetId: 14715, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 85x200": { plnPrice: 75.936, plnMargin: 27.12, intranetId: 14834, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame LMD/LMS/LMSM 99,2x248": { plnPrice: 91.308, plnMargin: 32.61, intranetId: 14717, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame Lumina RGB 300x250": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 18428, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame Lumina RGB 300x250 tył": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 18432, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame SLM": { plnPrice: 92.316, plnMargin: 32.97, intranetId: 18573, category: "wydruk ramy tekstylne standard podświetlane" },
  "Wydruk adFrame SLM 992x992": { plnPrice: 90.748, plnMargin: 32.41, intranetId: 18560, category: "wydruk ramy tekstylne standard podświetlane" },

  // --- Kategoria: wydruk rollup ---
  "Wydruk adStand 100": { plnPrice: 61.964, plnMargin: 22.13, intranetId: 10716, category: "wydruk rollup" },
  "Wydruk adStand 85": { plnPrice: 53.984, plnMargin: 19.28, intranetId: 10715, category: "wydruk rollup" },
  "Wydruk adStand Drop 100": { plnPrice: 61.964, plnMargin: 22.13, intranetId: 18658, category: "wydruk rollup" },
  "Wydruk adStand Drop 85": { plnPrice: 53.984, plnMargin: 19.28, intranetId: 18657, category: "wydruk rollup" },
  "Wydruk adStand ECO/LUX 100": { plnPrice: 61.964, plnMargin: 22.13, intranetId: 10749, category: "wydruk rollup" },
  "Wydruk adStand ECO/LUX 85": { plnPrice: 53.984, plnMargin: 19.28, intranetId: 10750, category: "wydruk rollup" },
  "Wymiana wydruku - adStand 100": { plnPrice: 80.108, plnMargin: 28.61, intranetId: 18761, category: "wydruk rollup" },
  "Wymiana wydruku - adStand 120": { plnPrice: 93.352, plnMargin: 33.34, intranetId: 18762, category: "wydruk rollup" },
  "Wymiana wydruku - adStand 85": { plnPrice: 66.864, plnMargin: 23.88, intranetId: 11956, category: "wydruk rollup" },
  "Wymiana wydruku - adStand ECO/LUX": { plnPrice: 241.836, plnMargin: 86.37, intranetId: 11954, category: "wydruk rollup" },
  "Wymiana wydruku - adStand TWINS": { plnPrice: 278.852, plnMargin: 99.59, intranetId: 11955, category: "wydruk rollup" },

  // --- Kategoria: wydruk trybunka classic ---
  "Wydruk adTribune Elypse": { plnPrice: 146.916, plnMargin: 52.47, intranetId: 10719, category: "wydruk trybunka classic" },
  "Wydruk adTribune Elypse mini": { plnPrice: 133.224, plnMargin: 47.58, intranetId: 10720, category: "wydruk trybunka classic" },
  "Wydruk adTribune Hit": { plnPrice: 126.784, plnMargin: 45.28, intranetId: 10721, category: "wydruk trybunka classic" },
  "Wydruk adTribune Shell": { plnPrice: 208.964, plnMargin: 74.63, intranetId: 10588, category: "wydruk trybunka classic" },
  "Wydruk adTribune Shell 2in1": { plnPrice: 408.66, plnMargin: 145.95, intranetId: 10589, category: "wydruk trybunka classic" },
  "Wydruk adTribune Standard": { plnPrice: 172.424, plnMargin: 61.58, intranetId: 10723, category: "wydruk trybunka classic" },
  "Wydruk płaszcz + topper adBox Elypse": { plnPrice: 250.012, plnMargin: 89.29, intranetId: 14335, category: "wydruk trybunka classic" },
  "Wydruk płaszcz + topper adBox Elypse Mini": { plnPrice: 180.04, plnMargin: 64.3, intranetId: 14336, category: "wydruk trybunka classic" },
  "Wydruk płaszcz + topper adBox Hit": { plnPrice: 173.964, plnMargin: 62.13, intranetId: 14337, category: "wydruk trybunka classic" },
  "Wydruk płaszcz + topper adBox Hit Mini": { plnPrice: 156.66, plnMargin: 55.95, intranetId: 14339, category: "wydruk trybunka classic" },
  "Wydruk płaszcz + topper adBox Ring": { plnPrice: 162.652, plnMargin: 58.09, intranetId: 14340, category: "wydruk trybunka classic" },
  "Wydruk płaszcz + topper adBox Standard": { plnPrice: 219.212, plnMargin: 78.29, intranetId: 14341, category: "wydruk trybunka classic" },
  "Wydruk płaszcz adTribune/adBox Elypse": { plnPrice: 146.916, plnMargin: 52.47, intranetId: 11895, category: "wydruk trybunka classic" },
  "Wydruk płaszcz adTribune/adBox Elypse Mini": { plnPrice: 133.224, plnMargin: 47.58, intranetId: 11897, category: "wydruk trybunka classic" },
  "Wydruk płaszcz adTribune/adBox Hit": { plnPrice: 127.148, plnMargin: 45.41, intranetId: 11894, category: "wydruk trybunka classic" },
  "Wydruk płaszcz adTribune/adBox Hit mini": { plnPrice: 114.8, plnMargin: 41.0, intranetId: 11896, category: "wydruk trybunka classic" },
  "Wydruk płaszcz adTribune/adBox Ring": { plnPrice: 114.8, plnMargin: 41.0, intranetId: 11925, category: "wydruk trybunka classic" },

  // --- Kategoria: wydruk trybunka podświetlana ---
  "Wydruk adTribune Big Quick LED": { plnPrice: 204.176, plnMargin: 72.92, intranetId: 11479, category: "wydruk trybunka podświetlana" },
  "Wydruk adTribune Big Quick LED Auto": { plnPrice: 386.876, plnMargin: 138.17, intranetId: 18512, category: "wydruk trybunka podświetlana" },
  "Wydruk adTribune Expo 100x100": { plnPrice: 84.924, plnMargin: 30.33, intranetId: 17040, category: "wydruk trybunka podświetlana" },
  "Wydruk adTribune Expo 150x100": { plnPrice: 83.524, plnMargin: 29.83, intranetId: 17402, category: "wydruk trybunka podświetlana" },
  "Wydruk adTribune Flex Expo": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19293, category: "wydruk trybunka podświetlana" },
  "Wydruk adTribune Smart LED": { plnPrice: 84.924, plnMargin: 30.33, intranetId: 12231, category: "wydruk trybunka podświetlana" },
  "Wydruk EDGE Backlit Tribune 1x1 White - KOMPLET": { plnPrice: 255.528, plnMargin: 91.26, intranetId: 15562, category: "wydruk trybunka podświetlana" },

  // --- Kategoria: wydruk trybunka vario ---
  "Wydruk adTribune Big Quick": { plnPrice: 133.308, plnMargin: 47.61, intranetId: 10927, category: "wydruk trybunka vario" },
  "Wydruk adTribune Case": { plnPrice: 91.196, plnMargin: 32.57, intranetId: 10593, category: "wydruk trybunka vario" },
  "Wydruk adTribune Oval": { plnPrice: 132.244, plnMargin: 47.23, intranetId: 10569, category: "wydruk trybunka vario" },
  "Wydruk adTribune Quick": { plnPrice: 110.908, plnMargin: 39.61, intranetId: 10729, category: "wydruk trybunka vario" },
  "Wydruk adTribune Quick Kidney": { plnPrice: 110.908, plnMargin: 39.61, intranetId: 19266, category: "wydruk trybunka vario" },
  "Wydruk adTribune Quick Kidney LED": { plnPrice: 151.032, plnMargin: 53.94, intranetId: 19269, category: "wydruk trybunka vario" },
  "Wydruk adTribune Quick Round LED": { plnPrice: 151.032, plnMargin: 53.94, intranetId: 19270, category: "wydruk trybunka vario" },
  "Wydruk adTribune Tube_OVAL": { plnPrice: 132.244, plnMargin: 47.23, intranetId: 18650, category: "wydruk trybunka vario" },
  "Wydruk adTribune Tube_SQUARE": { plnPrice: 132.244, plnMargin: 47.23, intranetId: 18651, category: "wydruk trybunka vario" },
  "Wydruk adTribune/adBox Tex": { plnPrice: 86.464, plnMargin: 30.88, intranetId: 10591, category: "wydruk trybunka vario" },
  "Wydruk front adTribune Seg NEW": { plnPrice: 100.772, plnMargin: 35.99, intranetId: 17749, category: "wydruk trybunka vario" },
  "Wydruk komplet adTribune Seg": { plnPrice: 212.1, plnMargin: 75.75, intranetId: 15561, category: "wydruk trybunka vario" },
  "Wydruk komplet adTribune Seg NEW": { plnPrice: 212.1, plnMargin: 75.75, intranetId: 17750, category: "wydruk trybunka vario" },

  // --- Kategoria: wydruk vario ---
  "Wydruk EDGE Plus 3x3S SS - FRONT": { plnPrice: 187.488, plnMargin: 66.96, intranetId: 12306, category: "wydruk vario" },
  "Wydruk niestandardowy MODERN / SEG": { plnPrice: 71.428, plnMargin: 25.51, intranetId: 18175, category: "wydruk vario" },
  "Wydruk niestandardowy MODERN / VARIO": { plnPrice: 95.424, plnMargin: 34.08, intranetId: 12182, category: "wydruk vario" },

  // --- Kategoria: wydruk vario crazy ---
  "Wydruk adWall Vario Arch C": { plnPrice: 805.364, plnMargin: 287.63, intranetId: 10926, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Bow": { plnPrice: 1242.836, plnMargin: 443.87, intranetId: 11086, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Cone jednostronny": { plnPrice: 2742.768, plnMargin: 979.56, intranetId: 11072, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Craft dwustronny": { plnPrice: 1453.816, plnMargin: 519.22, intranetId: 12514, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Craft jednostronny": { plnPrice: 1453.816, plnMargin: 519.22, intranetId: 10542, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Crown": { plnPrice: 2055.312, plnMargin: 734.04, intranetId: 11088, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Cwall dwustronny": { plnPrice: 586.684, plnMargin: 209.53, intranetId: 12518, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Fall dwustronny": { plnPrice: 828.828, plnMargin: 296.01, intranetId: 12520, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Fall jednostronny": { plnPrice: 828.828, plnMargin: 296.01, intranetId: 10520, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Flat Ring dwustronny": { plnPrice: 331.996, plnMargin: 118.57, intranetId: 16280, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Flat Ring jednostronny": { plnPrice: 331.996, plnMargin: 118.57, intranetId: 16212, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Flat Ring Water Base dwustronny": { plnPrice: 300.776, plnMargin: 107.42, intranetId: 16291, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Gate": { plnPrice: 1664.712, plnMargin: 594.54, intranetId: 10537, category: "wydruk vario crazy" },
  "Wydruk adWall Vario In": { plnPrice: 1391.264, plnMargin: 496.88, intranetId: 10521, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Island dwustronny": { plnPrice: 1125.684, plnMargin: 402.03, intranetId: 12524, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Peak dwustronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 12570, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Peak jednostronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 10525, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Qring dwustronny": { plnPrice: 544.46, plnMargin: 194.45, intranetId: 12622, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Qring jednostronny": { plnPrice: 544.46, plnMargin: 194.45, intranetId: 10587, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Ring dwustronny": { plnPrice: 641.34, plnMargin: 229.05, intranetId: 12626, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Ring jednostronny": { plnPrice: 641.34, plnMargin: 229.05, intranetId: 10519, category: "wydruk vario crazy" },
  "Wydruk adWall Vario S 100 dwustronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 12632, category: "wydruk vario crazy" },
  "Wydruk adWall Vario S 100 jednostronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 10517, category: "wydruk vario crazy" },
  "Wydruk adWall Vario S 120 dwustronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 12634, category: "wydruk vario crazy" },
  "Wydruk adWall Vario S 120 jednostronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 10526, category: "wydruk vario crazy" },
  "Wydruk adWall Vario S 150 dwustronny": { plnPrice: 594.44, plnMargin: 212.3, intranetId: 12636, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Serpentyna 300 dwustronny": { plnPrice: 535.08, plnMargin: 191.1, intranetId: 12638, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Serpentyna 300 jednostronny": { plnPrice: 535.08, plnMargin: 191.1, intranetId: 10535, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Serpentyna 600 dwustronny": { plnPrice: 1068.004, plnMargin: 381.43, intranetId: 12640, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Slope dwustronny": { plnPrice: 578.816, plnMargin: 206.72, intranetId: 12642, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Tower": { plnPrice: 703.892, plnMargin: 251.39, intranetId: 10534, category: "wydruk vario crazy" },
  "Wydruk adWall Vario Wave": { plnPrice: 1116.416, plnMargin: 398.72, intranetId: 10523, category: "wydruk vario crazy" },

  // --- Kategoria: wydruk vario klasyczne kształty ---
  "Wydruk adWall Vario Classic 100 dwustronny": { plnPrice: 188.244, plnMargin: 67.23, intranetId: 17717, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 100 jednostronny": { plnPrice: 188.244, plnMargin: 67.23, intranetId: 17718, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 160 dwustronny": { plnPrice: 281.96, plnMargin: 100.7, intranetId: 12492, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 160 jednostronny": { plnPrice: 281.96, plnMargin: 100.7, intranetId: 10510, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 220 dwustronny": { plnPrice: 375.732, plnMargin: 134.19, intranetId: 12494, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 220 jednostronny": { plnPrice: 375.732, plnMargin: 134.19, intranetId: 10501, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 280 dwustronny": { plnPrice: 469.476, plnMargin: 167.67, intranetId: 12496, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 280 jednostronny": { plnPrice: 469.476, plnMargin: 167.67, intranetId: 10502, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Classic 340 jednostronny": { plnPrice: 563.192, plnMargin: 201.14, intranetId: 10511, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Presto 090 dwustronny": { plnPrice: 174.132, plnMargin: 62.19, intranetId: 12572, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Presto 120 dwustronny": { plnPrice: 221.788, plnMargin: 79.21, intranetId: 12574, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 220 dwustronny": { plnPrice: 367.92, plnMargin: 131.4, intranetId: 12594, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 220 jednostronny": { plnPrice: 367.92, plnMargin: 131.4, intranetId: 10503, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 240 Ø43 dwustronny": { plnPrice: 414.764, plnMargin: 148.13, intranetId: 12602, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 240 Ø43 jednostronny": { plnPrice: 414.764, plnMargin: 148.13, intranetId: 11687, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 280 dwustronny": { plnPrice: 469.476, plnMargin: 167.67, intranetId: 12596, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 300 Ø43 dwustronny": { plnPrice: 508.508, plnMargin: 181.61, intranetId: 12604, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 300 Ø43 jednostronny": { plnPrice: 508.508, plnMargin: 181.61, intranetId: 10527, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 340 dwustronny": { plnPrice: 571.032, plnMargin: 203.94, intranetId: 12598, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 340 jednostronny": { plnPrice: 571.032, plnMargin: 203.94, intranetId: 10586, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 400 Ø43 dwustronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 12606, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 400 Ø43 jednostronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 10986, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 500 Ø43 dwustronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 12608, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 500 Ø43 jednostronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 10985, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 600 Ø43 dwustronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 12610, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Prosta 600 Ø43 jednostronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 10528, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 230 Ø34 dwustronny": { plnPrice: 400.484, plnMargin: 143.03, intranetId: 12540, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 240 Ø43 dwustronny": { plnPrice: 398.944, plnMargin: 142.48, intranetId: 12542, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 240 Ø43 dwustronny bez stóp": { plnPrice: 425.516, plnMargin: 151.97, intranetId: 12536, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 240 Ø43 jednostronny": { plnPrice: 398.944, plnMargin: 142.48, intranetId: 11270, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 240 Ø43 jednostronny bez stóp": { plnPrice: 425.516, plnMargin: 151.97, intranetId: 10505, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 300 Ø43 dwustronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 12546, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 300 Ø43 dwustronny bez stóp": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 12655, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 300 Ø43 jednostronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 10938, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 300 Ø43 jednostronny bez stóp": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 10506, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 310 Ø34 dwustronny": { plnPrice: 549.164, plnMargin: 196.13, intranetId: 12548, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 310 Ø34 jednostronny": { plnPrice: 549.164, plnMargin: 196.13, intranetId: 10514, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 360 Ø34 dwustronny": { plnPrice: 696.108, plnMargin: 248.61, intranetId: 12550, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 400 Ø43 dwustronny": { plnPrice: 649.124, plnMargin: 231.83, intranetId: 12552, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 400 Ø43 jednostronny": { plnPrice: 649.124, plnMargin: 231.83, intranetId: 11180, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 500 Ø43 dwustronny": { plnPrice: 883.596, plnMargin: 315.57, intranetId: 12554, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 500 Ø43 jednostronny": { plnPrice: 883.596, plnMargin: 315.57, intranetId: 11181, category: "wydruk vario klasyczne kształty" },
  "Wydruk adWall Vario Łukowa 600 Ø43 dwustronny": { plnPrice: 1008.56, plnMargin: 360.2, intranetId: 12556, category: "wydruk vario klasyczne kształty" },

  // --- Kategoria: wydruk vario light ---
  "Wydruk adWall Vario Classic Light 180 dwustronny": { plnPrice: 305.396, plnMargin: 109.07, intranetId: 12528, category: "wydruk vario light" },
  "Wydruk adWall Vario Classic Light 180 jednostronny": { plnPrice: 305.396, plnMargin: 109.07, intranetId: 11558, category: "wydruk vario light" },
  "Wydruk adWall Vario Classic Light 240 dwustronny": { plnPrice: 399.14, plnMargin: 142.55, intranetId: 12530, category: "wydruk vario light" },
  "Wydruk adWall Vario Classic Light 240 jednostronny": { plnPrice: 399.14, plnMargin: 142.55, intranetId: 11559, category: "wydruk vario light" },
  "Wydruk adWall Vario Classic Light 300 dwustronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 12532, category: "wydruk vario light" },
  "Wydruk adWall Vario Classic Light 300 jednostronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 11560, category: "wydruk vario light" },
  "Wydruk adWall Vario Light Horizontal dwustronny": { plnPrice: 227.276, plnMargin: 81.17, intranetId: 12534, category: "wydruk vario light" },
  "Wydruk adWall Vario Light Horizontal jednostronny": { plnPrice: 227.276, plnMargin: 81.17, intranetId: 11810, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 060 dwustronny": { plnPrice: 148.96, plnMargin: 53.2, intranetId: 12656, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 060 jednostronny": { plnPrice: 148.96, plnMargin: 53.2, intranetId: 11569, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 090 dwustronny": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 12657, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 090 jednostronny": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 11570, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 120 dwustronny": { plnPrice: 227.08, plnMargin: 81.1, intranetId: 12658, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 120 jednostronny": { plnPrice: 227.08, plnMargin: 81.1, intranetId: 11571, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 150 dwustronny": { plnPrice: 289.772, plnMargin: 103.49, intranetId: 12659, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Light 150 jednostronny": { plnPrice: 289.772, plnMargin: 103.49, intranetId: 11572, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Outdoor dwustronny": { plnPrice: 239.204, plnMargin: 85.43, intranetId: 18602, category: "wydruk vario light" },
  "Wydruk adWall Vario Presto Outdoor jednostronny": { plnPrice: 239.204, plnMargin: 85.43, intranetId: 18601, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 240 dwustronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 12660, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 240 jednostronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 11547, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 300 dwustronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 12661, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 300 jednostronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 11548, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 400 dwustronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 12616, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 400 jednostronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 11549, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 500 dwustronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 12618, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 500 jednostronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 11550, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 600 dwustronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 12620, category: "wydruk vario light" },
  "Wydruk adWall Vario Prosta Light 600 jednostronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 11551, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 240 dwustronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 12558, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 240 jednostronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 11530, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 300 dwustronny": { plnPrice: 523.964, plnMargin: 187.13, intranetId: 12560, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 300 jednostronny": { plnPrice: 523.964, plnMargin: 187.13, intranetId: 11531, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 400 dwustronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 12562, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 400 jednostronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 11532, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 500 dwustronny": { plnPrice: 836.724, plnMargin: 298.83, intranetId: 12564, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 500 jednostronny": { plnPrice: 836.724, plnMargin: 298.83, intranetId: 11533, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 600 dwustronny": { plnPrice: 1024.184, plnMargin: 365.78, intranetId: 12566, category: "wydruk vario light" },
  "Wydruk adWall Vario Łukowa Light 600 jednostronny": { plnPrice: 1024.184, plnMargin: 365.78, intranetId: 11534, category: "wydruk vario light" },
  "Wydruk adWall Vario-2 Presto Light 090 dwustronny": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 12580, category: "wydruk vario light" },
  "Wydruk adWall Vario-2 Presto Light 120 dwustronny": { plnPrice: 227.08, plnMargin: 81.1, intranetId: 12582, category: "wydruk vario light" },

  // --- Kategoria: wydruk vario podwieszane ---
  "Wydruk adUp Vario Quadfloat dwustronny": { plnPrice: 2500.596, plnMargin: 893.07, intranetId: 12624, category: "wydruk vario podwieszane" },
  "Wydruk adUp Vario Quadfloat jednostronny": { plnPrice: 2500.596, plnMargin: 893.07, intranetId: 10919, category: "wydruk vario podwieszane" },
  "Wydruk adUp Vario Ringfloat dwustronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 12628, category: "wydruk vario podwieszane" },
  "Wydruk adUp Vario Ringfloat jednostronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 10920, category: "wydruk vario podwieszane" },
  "Wydruk adUp Vario Trapfloat dwustronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 12646, category: "wydruk vario podwieszane" },
  "Wydruk adUp Vario Trifloat dwustronny": { plnPrice: 1430.352, plnMargin: 510.84, intranetId: 12648, category: "wydruk vario podwieszane" },

  // --- Kategoria: zabudowy akcesoria ---
  "WIESZAK TV - VESA 32-82\"": { plnPrice: 142.716, plnMargin: 50.97, intranetId: 16348, category: "zabudowy akcesoria" },
  "Wykładzina targowa CIEMNY SZARY 1897": { plnPrice: 103.04, plnMargin: 36.8, intranetId: 16467, category: "zabudowy akcesoria" },
  "Wykładzina targowa CUSTOM": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 12109, category: "zabudowy akcesoria" },
  "Wykładzina targowa JASNY SZARY 1719": { plnPrice: 103.04, plnMargin: 36.8, intranetId: 16466, category: "zabudowy akcesoria" },
  "Wykładzina targowa NIEBIESKI 4895": { plnPrice: 103.04, plnMargin: 36.8, intranetId: 16468, category: "zabudowy akcesoria" },

  // --- Kategoria: zabudowy foldable ---
  "Foldable 100x250": { plnPrice: 606.172, plnMargin: 216.49, intranetId: 16986, category: "zabudowy foldable" },
  "Foldable 100x250 (bez wydruku)": { plnPrice: 495.348, plnMargin: 176.91, intranetId: 16985, category: "zabudowy foldable" },
  "Foldable 200x250": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19856, category: "zabudowy foldable" },
  "stoisko FOLDABLE 3x2 \"I\"": { plnPrice: 1835.876, plnMargin: 655.67, intranetId: 16990, category: "zabudowy foldable" },
  "stoisko FOLDABLE 3x2 \"L\"": { plnPrice: 3072.356, plnMargin: 1097.27, intranetId: 16991, category: "zabudowy foldable" },
  "stoisko FOLDABLE 3x2 \"U\"": { plnPrice: 4308.92, plnMargin: 1538.9, intranetId: 16992, category: "zabudowy foldable" },
  "stoisko FOLDABLE 3x3 \"L\"": { plnPrice: 3682.924, plnMargin: 1315.33, intranetId: 16993, category: "zabudowy foldable" },
  "stoisko FOLDABLE 3x3 \"U\"": { plnPrice: 5530.0, plnMargin: 1975.0, intranetId: 16994, category: "zabudowy foldable" },
  "stoisko FOLDABLE 4x3 \"L\"": { plnPrice: 4293.52, plnMargin: 1533.4, intranetId: 16996, category: "zabudowy foldable" },
  "stoisko FOLDABLE 4x3 \"U\"": { plnPrice: 6140.54, plnMargin: 2193.05, intranetId: 16997, category: "zabudowy foldable" },
  "stoisko FOLDABLE 5x4 \"L\"": { plnPrice: 5514.544, plnMargin: 1969.48, intranetId: 16999, category: "zabudowy foldable" },

  // --- Kategoria: zabudowy foldable akcesoria ---
  "Foldable foot": { plnPrice: 46.088, plnMargin: 16.46, intranetId: 16982, category: "zabudowy foldable akcesoria" },
  "Foldable foot for 180°": { plnPrice: 70.476, plnMargin: 25.17, intranetId: 17044, category: "zabudowy foldable akcesoria" },
  "Foldable half foot for 180°": { plnPrice: 47.628, plnMargin: 17.01, intranetId: 17045, category: "zabudowy foldable akcesoria" },
  "Foldable half foot left": { plnPrice: 43.764, plnMargin: 15.63, intranetId: 16983, category: "zabudowy foldable akcesoria" },
  "Foldable half foot right": { plnPrice: 43.764, plnMargin: 15.63, intranetId: 17190, category: "zabudowy foldable akcesoria" },
  "Foldable set 180deg connector": { plnPrice: 11.088, plnMargin: 3.96, intranetId: 16979, category: "zabudowy foldable akcesoria" },
  "Foldable set 90deg connector": { plnPrice: 11.284, plnMargin: 4.03, intranetId: 16980, category: "zabudowy foldable akcesoria" },

  // --- Kategoria: zabudowy kasetony ---
  "adfloor taśma LED RGB (5mb)": { plnPrice: 249.788, plnMargin: 89.21, intranetId: 15441, category: "zabudowy kasetony" },

  // --- Kategoria: zabudowy mframe ---
  "mFrame - zestaw łączników": { plnPrice: 156.884, plnMargin: 56.03, intranetId: 16338, category: "zabudowy mframe" },
  "mFrame - zestaw łączników zapas": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19261, category: "zabudowy mframe" },
  "mFrame DRZWI 992x2480 KOMPLET": { plnPrice: 2324.98, plnMargin: 830.35, intranetId: 12423, category: "zabudowy mframe" },
  "mFrame DRZWI 992x2480 KOMPLET NEW (bez wydruku)": { plnPrice: 3051.16, plnMargin: 1089.7, intranetId: 17845, category: "zabudowy mframe" },
  "mFrame MASKOWNICA LED zestaw": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19771, category: "zabudowy mframe" },
  "mFrame MASKOWNICA ŁUK R1488": { plnPrice: 67.396, plnMargin: 24.07, intranetId: 18857, category: "zabudowy mframe" },
  "mFrame MASKOWNICA ŁUK R2976": { plnPrice: 67.396, plnMargin: 24.07, intranetId: 18365, category: "zabudowy mframe" },
  "mFrame MASKOWNICA ŁUK R992": { plnPrice: 54.6, plnMargin: 19.5, intranetId: 18858, category: "zabudowy mframe" },
  "mFrame RAMA 248x248": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19762, category: "zabudowy mframe" },
  "mFrame RAMA 248x2480": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19167, category: "zabudowy mframe" },
  "mFrame RAMA 248x2976": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19168, category: "zabudowy mframe" },
  "mFrame RAMA 248x496": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19165, category: "zabudowy mframe" },
  "mFrame RAMA 248x992": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19166, category: "zabudowy mframe" },
  "mFrame RAMA 496x1488": { plnPrice: 601.44, plnMargin: 214.8, intranetId: 11391, category: "zabudowy mframe" },
  "mFrame RAMA 496x1984": { plnPrice: 749.392, plnMargin: 267.64, intranetId: 11392, category: "zabudowy mframe" },
  "mFrame RAMA 496x2480": { plnPrice: 883.624, plnMargin: 315.58, intranetId: 10863, category: "zabudowy mframe" },
  "mFrame RAMA 496x2480 stan": { plnPrice: 928.48, plnMargin: 331.6, intranetId: 19052, category: "zabudowy mframe" },
  "mFrame RAMA 496x2976": { plnPrice: 1017.828, plnMargin: 363.51, intranetId: 16388, category: "zabudowy mframe" },
  "mFrame RAMA 496x496": { plnPrice: 346.752, plnMargin: 123.84, intranetId: 10860, category: "zabudowy mframe" },
  "mFrame RAMA 496x992": { plnPrice: 480.956, plnMargin: 171.77, intranetId: 10861, category: "zabudowy mframe" },
  "mFrame RAMA 992x1240": { plnPrice: 711.396, plnMargin: 254.07, intranetId: 10864, category: "zabudowy mframe" },
  "mFrame RAMA 992x1488": { plnPrice: 735.672, plnMargin: 262.74, intranetId: 11393, category: "zabudowy mframe" },
  "mFrame RAMA 992x1984": { plnPrice: 883.624, plnMargin: 315.58, intranetId: 11394, category: "zabudowy mframe" },
  "mFrame RAMA 992x2480": { plnPrice: 1017.828, plnMargin: 363.51, intranetId: 10865, category: "zabudowy mframe" },
  "mFrame RAMA 992x2480 stan": { plnPrice: 1222.116, plnMargin: 436.47, intranetId: 17164, category: "zabudowy mframe" },
  "mFrame RAMA 992x2976": { plnPrice: 1152.06, plnMargin: 411.45, intranetId: 16434, category: "zabudowy mframe" },
  "mFrame RAMA 992x992": { plnPrice: 615.16, plnMargin: 219.7, intranetId: 11232, category: "zabudowy mframe" },
  "mFrame rama curved corner arch 496x496": { plnPrice: 393.064, plnMargin: 140.38, intranetId: 18361, category: "zabudowy mframe" },
  "mFrame RAMA ŁUK 496x1488": { plnPrice: 930.244, plnMargin: 332.23, intranetId: 11395, category: "zabudowy mframe" },
  "mFrame RAMA ŁUK 496x2480": { plnPrice: 1352.232, plnMargin: 482.94, intranetId: 10870, category: "zabudowy mframe" },
  "mFrame RAMA ŁUK 496x2480 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18372, category: "zabudowy mframe" },
  "mFrame RAMA ŁUK 496x2976": { plnPrice: 1346.66, plnMargin: 480.95, intranetId: 16549, category: "zabudowy mframe" },
  "mFrame RAMA ŁUK 496x496": { plnPrice: 701.904, plnMargin: 250.68, intranetId: 10867, category: "zabudowy mframe" },
  "mFrame RAMA ŁUK 496x992": { plnPrice: 809.816, plnMargin: 289.22, intranetId: 10868, category: "zabudowy mframe" },
  "mFrame trybunka 100x50": { plnPrice: 2358.524, plnMargin: 842.33, intranetId: 17354, category: "zabudowy mframe" },
  "mFrame trybunka LED z drzwiami 100x50": { plnPrice: 6395.788, plnMargin: 2284.21, intranetId: 18791, category: "zabudowy mframe" },
  "mFrame trybunka LED z drzwiami 100x50 (bez wydruku)": { plnPrice: 5961.788, plnMargin: 2129.21, intranetId: 18789, category: "zabudowy mframe" },
  "mFrame trybunka z drzwiami 100x50 (bez wydruku)": { plnPrice: 5713.484, plnMargin: 2040.53, intranetId: 18579, category: "zabudowy mframe" },
  "mFrame zabudowa": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 10789, category: "zabudowy mframe" },
  "stoisko mFrame - ZABUDOWY 2x3 \"I\"": { plnPrice: 4923.352, plnMargin: 1758.34, intranetId: 17012, category: "zabudowy mframe" },
  "stoisko mFrame - ZABUDOWY 5x4 \"L\"": { plnPrice: 15270.332, plnMargin: 5453.69, intranetId: 17037, category: "zabudowy mframe" },
  "stoisko multiframe - custom 1": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19699, category: "zabudowy mframe" },
  "stoisko multiframe - custom 1 z dodatkami": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19700, category: "zabudowy mframe" },

  // --- Kategoria: zabudowy mframe akcesoria ---
  "Adtent express - Rzep miękki szary 25mm [pętelka]": { plnPrice: 0.112, plnMargin: 0.04, intranetId: 18736, category: "zabudowy mframe akcesoria" },
  "Blat niestandardowy - zabudowy": { plnPrice: 0.196, plnMargin: 0.07, intranetId: 16345, category: "zabudowy mframe akcesoria" },
  "mFrame - PCV 3mm 5,6x87,3cm OŚCIEŻNICA DRZWI(góra)": { plnPrice: 68.348, plnMargin: 24.41, intranetId: 17365, category: "zabudowy mframe akcesoria" },
  "mFrame - PCV 3mm 6,2x248cm maskownica pcv": { plnPrice: 27.916, plnMargin: 9.97, intranetId: 18566, category: "zabudowy mframe akcesoria" },
  "mFrame - PCV OŚCIEŻNICA DRZWI KOMPLET": { plnPrice: 110.992, plnMargin: 39.64, intranetId: 17366, category: "zabudowy mframe akcesoria" },
  "mFrame - Rzep miękki szary [pętelka]": { plnPrice: 0.56, plnMargin: 0.2, intranetId: 12041, category: "zabudowy mframe akcesoria" },
  "mFrame - Rzep twardy szary [haczyk]": { plnPrice: 0.504, plnMargin: 0.18, intranetId: 12042, category: "zabudowy mframe akcesoria" },
  "mFrame Blaszka do równania maskownic": { plnPrice: 12.572, plnMargin: 4.49, intranetId: 15080, category: "zabudowy mframe akcesoria" },
  "mFrame CLAMP CONNECTOR": { plnPrice: 53.256, plnMargin: 19.02, intranetId: 10847, category: "zabudowy mframe akcesoria" },
  "mFrame CLAMP CONNECTOR PLASTIC": { plnPrice: 14.392, plnMargin: 5.14, intranetId: 12060, category: "zabudowy mframe akcesoria" },
  "mFrame CLAMP DOOR CONNECTOR": { plnPrice: 77.756, plnMargin: 27.77, intranetId: 10846, category: "zabudowy mframe akcesoria" },
  "mFrame DOOR NEW ZAWIAS komplet": { plnPrice: 220.836, plnMargin: 78.87, intranetId: 19044, category: "zabudowy mframe akcesoria" },
  "mFrame Glass wall 992x2480 Door set": { plnPrice: 3200.456, plnMargin: 1143.02, intranetId: 18455, category: "zabudowy mframe akcesoria" },
  "mFrame Glass wall pin connector + srew nut": { plnPrice: 140.364, plnMargin: 50.13, intranetId: 18451, category: "zabudowy mframe akcesoria" },
  "mFrame Glass wall rama 99,2x248 boczny RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 19101, category: "zabudowy mframe akcesoria" },
  "mFrame Glass wall rama 99,2x248 środkowy RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19100, category: "zabudowy mframe akcesoria" },
  "mFrame Klamka do drzwi": { plnPrice: 101.556, plnMargin: 36.27, intranetId: 15082, category: "zabudowy mframe akcesoria" },
  "mFrame LAMPKA ADAPTER": { plnPrice: 66.248, plnMargin: 23.66, intranetId: 12079, category: "zabudowy mframe akcesoria" },
  "mFrame LAMPKA LED": { plnPrice: 318.052, plnMargin: 113.59, intranetId: 10848, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA KWADRATOWA": { plnPrice: 81.676, plnMargin: 29.17, intranetId: 12089, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA KWADRATOWA GRAFIKA": { plnPrice: 112.112, plnMargin: 40.04, intranetId: 11323, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA KWADRATOWA z gwintem": { plnPrice: 257.824, plnMargin: 92.08, intranetId: 17842, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA KWADRATOWA z gwintem x4": { plnPrice: 269.528, plnMargin: 96.26, intranetId: 18362, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA MOCOWANIE PLASTIKOWE": { plnPrice: 2.94, plnMargin: 1.05, intranetId: 10859, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA PŁASKA": { plnPrice: 29.82, plnMargin: 10.65, intranetId: 11321, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA ZAŚLEPKA KWADRATOWA": { plnPrice: 9.716, plnMargin: 3.47, intranetId: 12078, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA ZAŚLEPKA KWADRATOWA z gwintem": { plnPrice: 9.016, plnMargin: 3.22, intranetId: 17843, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA ZAŚLEPKA KWADRATOWA z gwintem x3 i x4": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18370, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA ĆWIERĆWAŁEK": { plnPrice: 83.104, plnMargin: 29.68, intranetId: 11322, category: "zabudowy mframe akcesoria" },
  "mFrame MASKOWNICA ŁUKU ALUMINIOWA": { plnPrice: 73.724, plnMargin: 26.33, intranetId: 10855, category: "zabudowy mframe akcesoria" },
  "mFrame mocowanie płyty OSB": { plnPrice: 46.144, plnMargin: 16.48, intranetId: 17136, category: "zabudowy mframe akcesoria" },
  "mFrame NAKRĘTKA DOOR CONNECTOR": { plnPrice: 24.248, plnMargin: 8.66, intranetId: 10878, category: "zabudowy mframe akcesoria" },
  "mFrame NAKRĘTKA FAT": { plnPrice: 24.248, plnMargin: 8.66, intranetId: 10882, category: "zabudowy mframe akcesoria" },
  "mFrame NAKRĘTKA SUPERSLIM": { plnPrice: 28.084, plnMargin: 10.03, intranetId: 17882, category: "zabudowy mframe akcesoria" },
  "mFrame PANEL TV": { plnPrice: 274.372, plnMargin: 97.99, intranetId: 10853, category: "zabudowy mframe akcesoria" },
  "mFrame PANEL TV z łącznikami": { plnPrice: 476.84, plnMargin: 170.3, intranetId: 17121, category: "zabudowy mframe akcesoria" },
  "mFrame PIN FAT 10CM": { plnPrice: 34.076, plnMargin: 12.17, intranetId: 11380, category: "zabudowy mframe akcesoria" },
  "mFrame PIN FAT 4CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 10880, category: "zabudowy mframe akcesoria" },
  "mFrame PIN FAT 5,6CM (do maskownicy)": { plnPrice: 25.816, plnMargin: 9.22, intranetId: 17844, category: "zabudowy mframe akcesoria" },
  "mFrame PIN FAT 7CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 11504, category: "zabudowy mframe akcesoria" },
  "mFrame PIN MOCOWANIE MASKOWNICY ŁUKOWEJ": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 12125, category: "zabudowy mframe akcesoria" },
  "mFrame PIN SLIM 4CM": { plnPrice: 33.712, plnMargin: 12.04, intranetId: 15077, category: "zabudowy mframe akcesoria" },
  "mFrame PIN SUPERSLIM 4CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 10881, category: "zabudowy mframe akcesoria" },
  "mFrame PIN SUPERSLIM 7CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 15076, category: "zabudowy mframe akcesoria" },
  "mFrame PIN T LMSM": { plnPrice: 11.06, plnMargin: 3.95, intranetId: 11735, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL L=1488": { plnPrice: 195.216, plnMargin: 69.72, intranetId: 11383, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL L=248": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18842, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL L=2976": { plnPrice: 353.752, plnMargin: 126.34, intranetId: 13603, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL L=496": { plnPrice: 74.256, plnMargin: 26.52, intranetId: 10884, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL L=992": { plnPrice: 117.908, plnMargin: 42.11, intranetId: 10885, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL ŁUK FI 496MM": { plnPrice: 235.844, plnMargin: 84.23, intranetId: 10888, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL ŁĄCZNIK 90°": { plnPrice: 9.548, plnMargin: 3.41, intranetId: 11898, category: "zabudowy mframe akcesoria" },
  "mFrame PROFIL ŁĄCZNIK 90° ŁUK R1488": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18855, category: "zabudowy mframe akcesoria" },
  "mFrame Próg do drzwi": { plnPrice: 101.052, plnMargin: 36.09, intranetId: 15084, category: "zabudowy mframe akcesoria" },
  "mFrame PÓŁKA UCHWYT PIN LED KOMPLET": { plnPrice: 224.868, plnMargin: 80.31, intranetId: 12464, category: "zabudowy mframe akcesoria" },
  "mFrame PÓŁKA ZESTAW": { plnPrice: 598.556, plnMargin: 213.77, intranetId: 17938, category: "zabudowy mframe akcesoria" },
  "mFrame płyta OSB 18mm 860x400mm (pod mocowanie)": { plnPrice: 89.068, plnMargin: 31.81, intranetId: 17449, category: "zabudowy mframe akcesoria" },
  "mFrame STOPA": { plnPrice: 231.308, plnMargin: 82.61, intranetId: 10857, category: "zabudowy mframe akcesoria" },
  "mFrame STOPA BLACHA DWUSTRONNA METALOWA 992x496": { plnPrice: 583.464, plnMargin: 208.38, intranetId: 14780, category: "zabudowy mframe akcesoria" },
  "mFrame STOPA BLACHA JEDNOSTRONNA KRÓTKA": { plnPrice: 143.892, plnMargin: 51.39, intranetId: 11933, category: "zabudowy mframe akcesoria" },
  "mFrame STOPA POŁÓWKA": { plnPrice: 152.74, plnMargin: 54.55, intranetId: 11141, category: "zabudowy mframe akcesoria" },
  "mFrame STOPA POŁÓWKA BOCZNA ZESTAW": { plnPrice: 252.812, plnMargin: 90.29, intranetId: 17908, category: "zabudowy mframe akcesoria" },
  "mFrame STOPA ZESTAW": { plnPrice: 296.94, plnMargin: 106.05, intranetId: 17907, category: "zabudowy mframe akcesoria" },
  "mFrame TRANSPORT PLASTIK OCHRONNY": { plnPrice: 1.792, plnMargin: 0.64, intranetId: 12468, category: "zabudowy mframe akcesoria" },
  "mFrame TRANSPORT PLASTIK OCHRONNY ver2 (narożny)": { plnPrice: 5.404, plnMargin: 1.93, intranetId: 17714, category: "zabudowy mframe akcesoria" },
  "mFrame WÓZEK 6 RAM": { plnPrice: 341.964, plnMargin: 122.13, intranetId: 12092, category: "zabudowy mframe akcesoria" },
  "mFrame WÓZEK 6/8 RAM PAS BLOKUJĄCY": { plnPrice: 43.82, plnMargin: 15.65, intranetId: 12467, category: "zabudowy mframe akcesoria" },
  "mFrame WÓZEK 8 RAM": { plnPrice: 383.908, plnMargin: 137.11, intranetId: 12091, category: "zabudowy mframe akcesoria" },
  "mFrame WÓZEK 8 RAM PAS BLOKUJĄCY": { plnPrice: 43.82, plnMargin: 15.65, intranetId: 12466, category: "zabudowy mframe akcesoria" },
  "mFrame Zawias do drzwi (komplet)": { plnPrice: 129.164, plnMargin: 46.13, intranetId: 15086, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK I 2PIN 180 STOPNI": { plnPrice: 92.4, plnMargin: 33.0, intranetId: 16017, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK I 4PIN 180 STOPNI": { plnPrice: 77.392, plnMargin: 27.64, intranetId: 10833, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK I 6PIN 180 STOPNI": { plnPrice: 82.852, plnMargin: 29.59, intranetId: 11386, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK I REG. DŁ. 180 STOPNI": { plnPrice: 137.48, plnMargin: 49.1, intranetId: 10837, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK L 90 STOPNI": { plnPrice: 115.612, plnMargin: 41.29, intranetId: 10832, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK L REG. DŁ. 90 STOPNI": { plnPrice: 170.24, plnMargin: 60.8, intranetId: 10838, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK LMD UNIWER": { plnPrice: 68.376, plnMargin: 24.42, intranetId: 16113, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK RAMA REGULOWANA": { plnPrice: 76.692, plnMargin: 27.39, intranetId: 16442, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK REGULOWANY KĄT": { plnPrice: 148.372, plnMargin: 52.99, intranetId: 10836, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK T": { plnPrice: 132.216, plnMargin: 47.22, intranetId: 10835, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK WEW/ZEW 90 STOPNI": { plnPrice: 35.196, plnMargin: 12.57, intranetId: 10839, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK ZEW/ZEW 90 STOPNI": { plnPrice: 35.196, plnMargin: 12.57, intranetId: 10840, category: "zabudowy mframe akcesoria" },
  "mFrame ŁĄCZNIK ZEW/ZEW/ZEW": { plnPrice: 46.872, plnMargin: 16.74, intranetId: 11143, category: "zabudowy mframe akcesoria" },
  "Taśma dwustronna do wykładzin 50mm x 25m": { plnPrice: 4.648, plnMargin: 1.66, intranetId: 18275, category: "zabudowy mframe akcesoria" },
  "Usługa cięcia mFrame RAMA": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 19114, category: "zabudowy mframe akcesoria" },

  // --- Kategoria: zabudowy multiframe ---
  "Multiframe 250 SET1 (Black)": { plnPrice: 2978.024, plnMargin: 1063.58, intranetId: 12111, category: "zabudowy multiframe" },
  "Multiframe 250 SET1 (Black) (bez wydruku)": { plnPrice: 2857.96, plnMargin: 1020.7, intranetId: 16599, category: "zabudowy multiframe" },
  "Multiframe 250 SET2 (Black)": { plnPrice: 4280.5, plnMargin: 1528.75, intranetId: 12112, category: "zabudowy multiframe" },
  "Multiframe 250 SET2 (Black) (bez wydruku)": { plnPrice: 4066.076, plnMargin: 1452.17, intranetId: 16600, category: "zabudowy multiframe" },
  "Multiframe 250 SET2 (Black) dwustronny": { plnPrice: 4494.896, plnMargin: 1605.32, intranetId: 17892, category: "zabudowy multiframe" },
  "Multiframe 250 SET3 (Black)": { plnPrice: 5582.948, plnMargin: 1993.91, intranetId: 12113, category: "zabudowy multiframe" },
  "Multiframe 250 SET3 (Black) dwustronny": { plnPrice: 5891.704, plnMargin: 2104.18, intranetId: 17893, category: "zabudowy multiframe" },
  "Multiframe 250 SET4 (Black)": { plnPrice: 7800.66, plnMargin: 2785.95, intranetId: 12114, category: "zabudowy multiframe" },
  "Multiframe 250 SET4 (Black) (bez wydruku)": { plnPrice: 7397.544, plnMargin: 2641.98, intranetId: 16602, category: "zabudowy multiframe" },
  "Multiframe 250 SET4 (Black) dwustronny": { plnPrice: 8203.748, plnMargin: 2929.91, intranetId: 17894, category: "zabudowy multiframe" },
  "Multiframe 250 SET5 (Black)": { plnPrice: 9103.164, plnMargin: 3251.13, intranetId: 12115, category: "zabudowy multiframe" },
  "Multiframe 250 SET6 (Black)": { plnPrice: 10405.64, plnMargin: 3716.3, intranetId: 12116, category: "zabudowy multiframe" },
  "Multiframe 301 SET1 (Black)": { plnPrice: 3519.628, plnMargin: 1257.01, intranetId: 17342, category: "zabudowy multiframe" },
  "Multiframe 301 SET1 (Black) (bez wydruku)": { plnPrice: 3366.076, plnMargin: 1202.17, intranetId: 17332, category: "zabudowy multiframe" },
  "Multiframe 301 SET2 (Black)": { plnPrice: 5140.268, plnMargin: 1835.81, intranetId: 16754, category: "zabudowy multiframe" },
  "Multiframe 301 SET3 (Black)": { plnPrice: 7134.68, plnMargin: 2548.1, intranetId: 17347, category: "zabudowy multiframe" },
  "Multiframe 301 SET3 (Black) dwustronny": { plnPrice: 7524.58, plnMargin: 2687.35, intranetId: 17898, category: "zabudowy multiframe" },
  "Multiframe 301 SET4 (Black)": { plnPrice: 9003.792, plnMargin: 3215.64, intranetId: 16755, category: "zabudowy multiframe" },
  "Multiframe kantorek 250 (Black)": { plnPrice: 9949.268, plnMargin: 3553.31, intranetId: 11989, category: "zabudowy multiframe" },
  "Multiframe kantorek 250 (Black) (bez wydruku)": { plnPrice: 9467.444, plnMargin: 3381.23, intranetId: 17931, category: "zabudowy multiframe" },
  "Multiframe kantorek 301cm (Black)": { plnPrice: 11790.772, plnMargin: 4210.99, intranetId: 16727, category: "zabudowy multiframe" },
  "Multiframe kantorek drzwi 250 (Black)": { plnPrice: 3172.204, plnMargin: 1132.93, intranetId: 11991, category: "zabudowy multiframe" },
  "Multiframe NADSTAWKA 100cm (Black) (bez wydruku)": { plnPrice: 2740.976, plnMargin: 978.92, intranetId: 16718, category: "zabudowy multiframe" },
  "Multiframe Tribune (Black)": { plnPrice: 3355.24, plnMargin: 1198.3, intranetId: 11841, category: "zabudowy multiframe" },
  "Multiframe Tribune (Black) (bez wydruku)": { plnPrice: 3263.904, plnMargin: 1165.68, intranetId: 10403, category: "zabudowy multiframe" },
  "stoisko Multiframe 250 3x3 \"L\"": { plnPrice: 11281.34, plnMargin: 4029.05, intranetId: 17091, category: "zabudowy multiframe" },
  "stoisko Multiframe 250 4x3 \"L\"": { plnPrice: 19812.716, plnMargin: 7075.97, intranetId: 17095, category: "zabudowy multiframe" },
  "stoisko Multiframe 250 5x4 \"L\"": { plnPrice: 23332.848, plnMargin: 8333.16, intranetId: 17104, category: "zabudowy multiframe" },

  // --- Kategoria: zabudowy multiframe akcesoria ---
  "mFrame blat 995x620 trybunka z drzwiami": { plnPrice: 590.212, plnMargin: 210.79, intranetId: 18402, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria kostka 3x - bez stopki": { plnPrice: 25.116, plnMargin: 8.97, intranetId: 12455, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria kostka 3x - ze stopką": { plnPrice: 32.76, plnMargin: 11.7, intranetId: 12425, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria kostka 4x - bez stopki": { plnPrice: 26.18, plnMargin: 9.35, intranetId: 12454, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria kostka 4x - ze stopką": { plnPrice: 32.76, plnMargin: 11.7, intranetId: 12453, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria ledy do półki": { plnPrice: 132.384, plnMargin: 47.28, intranetId: 11987, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria mocowanie LED dokręcane (Black)": { plnPrice: 10.696, plnMargin: 3.82, intranetId: 11518, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria stopka do kostki 3x": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 16410, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria wypełnienie kostki (black)": { plnPrice: 0.112, plnMargin: 0.04, intranetId: 12412, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria zamek profila": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 17516, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria zawieszka (pojedyncza)": { plnPrice: 11.116, plnMargin: 3.97, intranetId: 10407, category: "zabudowy multiframe akcesoria" },
  "Multiframe akcesoria zawieszka okrągła 3W": { plnPrice: 135.52, plnMargin: 48.4, intranetId: 11272, category: "zabudowy multiframe akcesoria" },
  "Multiframe Blat 1045x400": { plnPrice: 581.224, plnMargin: 207.58, intranetId: 12427, category: "zabudowy multiframe akcesoria" },
  "Multiframe panel na zawieszki": { plnPrice: 348.628, plnMargin: 124.51, intranetId: 10400, category: "zabudowy multiframe akcesoria" },
  "Multiframe panel TV (Black) NEW": { plnPrice: 821.8, plnMargin: 293.5, intranetId: 10406, category: "zabudowy multiframe akcesoria" },
  "Multiframe panel TV (Black) PL OLD": { plnPrice: 1212.596, plnMargin: 433.07, intranetId: 16448, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil pionowy dolny 250 (Black)": { plnPrice: 368.704, plnMargin: 131.68, intranetId: 11975, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil pionowy górny 250 (Black)": { plnPrice: 368.704, plnMargin: 131.68, intranetId: 11974, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil poziomy 25cm (Black)": { plnPrice: 154.952, plnMargin: 55.34, intranetId: 11541, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil poziomy 40cm (Black)": { plnPrice: 153.776, plnMargin: 54.92, intranetId: 11192, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil poziomy 89,9cm (Black)": { plnPrice: 196.028, plnMargin: 70.01, intranetId: 11977, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil przedłużka 100 (Black)": { plnPrice: 341.18, plnMargin: 121.85, intranetId: 10402, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil przedłużka 50 (Black)": { plnPrice: 213.388, plnMargin: 76.21, intranetId: 15427, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil rozpórka (Black)": { plnPrice: 83.3, plnMargin: 29.75, intranetId: 11978, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil rozpórka 40cm (Black)": { plnPrice: 66.276, plnMargin: 23.67, intranetId: 14213, category: "zabudowy multiframe akcesoria" },
  "Multiframe profil rozpórka do kantorka (Black)": { plnPrice: 126.14, plnMargin: 45.05, intranetId: 10967, category: "zabudowy multiframe akcesoria" },
  "Multiframe półka": { plnPrice: 410.34, plnMargin: 146.55, intranetId: 11980, category: "zabudowy multiframe akcesoria" },
  "Multiframe stopa ciężka (Black)": { plnPrice: 273.028, plnMargin: 97.51, intranetId: 11982, category: "zabudowy multiframe akcesoria" },
  "Multiframe stopa ciężka PL (Black) 1 szt bez opakowania": { plnPrice: 520.52, plnMargin: 185.9, intranetId: 16100, category: "zabudowy multiframe akcesoria" },
  "Multiframe stopa połówka": { plnPrice: 214.032, plnMargin: 76.44, intranetId: 10745, category: "zabudowy multiframe akcesoria" },
  "Multiframe stopy ciężkie (Black) 2szt z torba": { plnPrice: 1132.6, plnMargin: 404.5, intranetId: 17125, category: "zabudowy multiframe akcesoria" },
  "Multiframe stopy połówki 2szt z torbą": { plnPrice: 1132.6, plnMargin: 404.5, intranetId: 17126, category: "zabudowy multiframe akcesoria" },
  "Multiframe torba bez kółek 250": { plnPrice: 372.372, plnMargin: 132.99, intranetId: 11976, category: "zabudowy multiframe akcesoria" },
  "Multiframe torba na kółkach krótka": { plnPrice: 475.468, plnMargin: 169.81, intranetId: 11836, category: "zabudowy multiframe akcesoria" },
  "Multiframe uchwyt na zawieszki płaski MF003": { plnPrice: 146.804, plnMargin: 52.43, intranetId: 11275, category: "zabudowy multiframe akcesoria" },
  "Multiframe zestaw dwóch półek": { plnPrice: 911.848, plnMargin: 325.66, intranetId: 15578, category: "zabudowy multiframe akcesoria" },
  "Multiframe zestaw łączników kantorek 250": { plnPrice: 1008.532, plnMargin: 360.19, intranetId: 17349, category: "zabudowy multiframe akcesoria" },
  "Multiframe łącznik dwustronny nadstawka Black": { plnPrice: 47.152, plnMargin: 16.84, intranetId: 11905, category: "zabudowy multiframe akcesoria" },
  "Multiframe łącznik kantorek 250 klamka (dolny+górny)": { plnPrice: 314.048, plnMargin: 112.16, intranetId: 12119, category: "zabudowy multiframe akcesoria" },
  "Multiframe łącznik kantorek 250 zawias (dolny+górny)": { plnPrice: 321.524, plnMargin: 114.83, intranetId: 12120, category: "zabudowy multiframe akcesoria" },
  "Multiframe łącznik kantorek 350": { plnPrice: 169.4, plnMargin: 60.5, intranetId: 16922, category: "zabudowy multiframe akcesoria" },
  "Multiframe łącznik kantorek prosty": { plnPrice: 142.1, plnMargin: 50.75, intranetId: 12121, category: "zabudowy multiframe akcesoria" },
  "Multiframe łącznik L 90° (Black)": { plnPrice: 57.708, plnMargin: 20.61, intranetId: 11575, category: "zabudowy multiframe akcesoria" },
  "Multiframe łącznik TV bok kantorka (zestaw NEW TV)": { plnPrice: 323.568, plnMargin: 115.56, intranetId: 17998, category: "zabudowy multiframe akcesoria" },
  "Multiframe śruba do stopy": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17159, category: "zabudowy multiframe akcesoria" },
  "Multiframe śruba do łącznika L": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17160, category: "zabudowy multiframe akcesoria" },

  // --- Kategoria: zabudowy sego ---
  "adTribune SEGO Cubic 1x1": { plnPrice: 1142.904, plnMargin: 408.18, intranetId: 18335, category: "zabudowy sego" },
  "adTribune SEGO Cubic 4x1": { plnPrice: 1271.928, plnMargin: 454.26, intranetId: 18326, category: "zabudowy sego" },
  "adTribune SEGO Cubic lock": { plnPrice: 2332.988, plnMargin: 833.21, intranetId: 19259, category: "zabudowy sego" },
  "POKAZÓWKA_SEGO 100x250": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 17932, category: "zabudowy sego" },
  "SEGO 100x200": { plnPrice: 2434.208, plnMargin: 869.36, intranetId: 13692, category: "zabudowy sego" },
  "SEGO 100x200 (bez wydruku)": { plnPrice: 2181.564, plnMargin: 779.13, intranetId: 13524, category: "zabudowy sego" },
  "SEGO 100x250": { plnPrice: 2617.468, plnMargin: 934.81, intranetId: 13693, category: "zabudowy sego" },
  "SEGO 100x250 (bez wydruku)": { plnPrice: 2331.0, plnMargin: 832.5, intranetId: 13525, category: "zabudowy sego" },
  "SEGO 100x250 v2": { plnPrice: 2452.772, plnMargin: 875.99, intranetId: 17833, category: "zabudowy sego" },
  "SEGO 200x250": { plnPrice: 4577.048, plnMargin: 1634.66, intranetId: 18680, category: "zabudowy sego" },
  "SEGO 200x250 (bez wydruku)": { plnPrice: 4083.66, plnMargin: 1458.45, intranetId: 18495, category: "zabudowy sego" },
  "SEGO 300x250": { plnPrice: 5931.884, plnMargin: 2118.53, intranetId: 13694, category: "zabudowy sego" },
  "SEGO 300x250 (bez wydruku)": { plnPrice: 5312.328, plnMargin: 1897.26, intranetId: 13526, category: "zabudowy sego" },
  "SEGO 85x250": { plnPrice: 2494.744, plnMargin: 890.98, intranetId: 18347, category: "zabudowy sego" },
  "SEGO 85x250 (bez wydruku)": { plnPrice: 2233.28, plnMargin: 797.6, intranetId: 18100, category: "zabudowy sego" },
  "SEGO 85x250 v2": { plnPrice: 2460.36, plnMargin: 878.7, intranetId: 18346, category: "zabudowy sego" },
  "SEGO Counter 100x100": { plnPrice: 2064.188, plnMargin: 737.21, intranetId: 13695, category: "zabudowy sego" },
  "SEGO Counter 100x100 (bez wydruku)": { plnPrice: 1857.268, plnMargin: 663.31, intranetId: 13523, category: "zabudowy sego" },
  "SEGO Cubic Counter 50x50x100 (bez wydruku)": { plnPrice: 973.56, plnMargin: 347.7, intranetId: 18104, category: "zabudowy sego" },
  "SEGO Door Kit 100cm with wheel": { plnPrice: 818.244, plnMargin: 292.23, intranetId: 17143, category: "zabudowy sego" },
  "stoisko SEGO": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 17997, category: "zabudowy sego" },
  "stoisko SEGO Light Box 2x3 \"L\"": { plnPrice: 11363.016, plnMargin: 4058.22, intranetId: 17002, category: "zabudowy sego" },
  "stoisko SEGO Light Box 3x3 \"L\"": { plnPrice: 12036.556, plnMargin: 4298.77, intranetId: 17004, category: "zabudowy sego" },

  // --- Kategoria: zabudowy sego akcesoria ---
  "GVE zasilacz 252W SEGO": { plnPrice: 608.524, plnMargin: 217.33, intranetId: 13536, category: "zabudowy sego akcesoria" },
  "Pasek ledowy do SEGO 100cm": { plnPrice: 404.292, plnMargin: 144.39, intranetId: 13534, category: "zabudowy sego akcesoria" },
  "SEGO 180 Connector": { plnPrice: 52.304, plnMargin: 18.68, intranetId: 16963, category: "zabudowy sego akcesoria" },
  "SEGO End block L for VP": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 13543, category: "zabudowy sego akcesoria" },
  "SEGO End block R for VP": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 13544, category: "zabudowy sego akcesoria" },
  "SEGO Extender 50 cm": { plnPrice: 97.076, plnMargin: 34.67, intranetId: 16964, category: "zabudowy sego akcesoria" },
  "SEGO Extension Cable 5m": { plnPrice: 59.696, plnMargin: 21.32, intranetId: 13555, category: "zabudowy sego akcesoria" },
  "SEGO Hi-LOW connector": { plnPrice: 12.348, plnMargin: 4.41, intranetId: 16962, category: "zabudowy sego akcesoria" },
  "SEGO kabel S 1.2m": { plnPrice: 43.792, plnMargin: 15.64, intranetId: 13538, category: "zabudowy sego akcesoria" },
  "SEGO kabel Y 2.6m": { plnPrice: 96.572, plnMargin: 34.49, intranetId: 13537, category: "zabudowy sego akcesoria" },
  "SEGO kabel Y 3.5m": { plnPrice: 123.76, plnMargin: 44.2, intranetId: 18774, category: "zabudowy sego akcesoria" },
  "SEGO klamra do stóp": { plnPrice: 1.092, plnMargin: 0.39, intranetId: 13548, category: "zabudowy sego akcesoria" },
  "SEGO LED Extension – łącznik": { plnPrice: 35.252, plnMargin: 12.59, intranetId: 13539, category: "zabudowy sego akcesoria" },
  "SEGO Mini FOOT": { plnPrice: 23.94, plnMargin: 8.55, intranetId: 17145, category: "zabudowy sego akcesoria" },
  "SEGO MP cross": { plnPrice: 0.0, plnMargin: 0.0, intranetId: 13551, category: "zabudowy sego akcesoria" },
  "SEGO MP support": { plnPrice: 1.092, plnMargin: 0.39, intranetId: 13550, category: "zabudowy sego akcesoria" },
  "SEGO Półstopa lewa": { plnPrice: 295.456, plnMargin: 105.52, intranetId: 16960, category: "zabudowy sego akcesoria" },
  "SEGO Półstopa prawa": { plnPrice: 187.964, plnMargin: 67.13, intranetId: 16961, category: "zabudowy sego akcesoria" },
  "SEGO Shelf Kit 100cm": { plnPrice: 708.512, plnMargin: 253.04, intranetId: 13529, category: "zabudowy sego akcesoria" },
  "SEGO Slide block for HP": { plnPrice: 5.6, plnMargin: 2.0, intranetId: 13545, category: "zabudowy sego akcesoria" },
  "SEGO Slide block R for HP": { plnPrice: 5.516, plnMargin: 1.97, intranetId: 13541, category: "zabudowy sego akcesoria" },
  "SEGO TV Bracket Kit 100cm": { plnPrice: 830.816, plnMargin: 296.72, intranetId: 13528, category: "zabudowy sego akcesoria" },
  "SEGO łącznik Bridge": { plnPrice: 38.052, plnMargin: 13.59, intranetId: 13533, category: "zabudowy sego akcesoria" },
  "SEGO łącznik clamp": { plnPrice: 11.676, plnMargin: 4.17, intranetId: 13530, category: "zabudowy sego akcesoria" },
  "SEGO łącznik wewnętrzny L": { plnPrice: 11.676, plnMargin: 4.17, intranetId: 13531, category: "zabudowy sego akcesoria" },
  "SEGO łącznik zewnętrzny L": { plnPrice: 57.624, plnMargin: 20.58, intranetId: 13532, category: "zabudowy sego akcesoria" },

  // --- Kategoria: zabudowy smart ---
  "SET10 adFrame Smart 200x250 3szt + 100x200 + 100x250 + adtribune smart": { plnPrice: 17519.152, plnMargin: 6256.84, intranetId: 16258, category: "zabudowy smart" },
  "SET2 adFrame Smart 100x250 3szt + adtribune smart": { plnPrice: 7761.768, plnMargin: 2772.06, intranetId: 16244, category: "zabudowy smart" },
  "SET3 adFrame Smart 100x250 7szt + adtribune smart": { plnPrice: 16630.124, plnMargin: 5939.33, intranetId: 16245, category: "zabudowy smart" },
  "SET4 adFrame Smart 100x250 5szt + adtribune smart": { plnPrice: 12325.18, plnMargin: 4401.85, intranetId: 16246, category: "zabudowy smart" },
  "SET5 adFrame Smart 200x250 4szt + adtribune smart": { plnPrice: 16948.344, plnMargin: 6052.98, intranetId: 16247, category: "zabudowy smart" },
  "SET6 adFrame Smart 300x250 2szt + 200x250 2szt + adtribune smart": { plnPrice: 26998.496, plnMargin: 9642.32, intranetId: 16254, category: "zabudowy smart" },
  "SET7 adFrame Smart 300x250 + 200x250 + adtribune smart": { plnPrice: 10643.556, plnMargin: 3801.27, intranetId: 16255, category: "zabudowy smart" },

  // --- Kategoria: ścianki banerowe ---
  "adStand L 100": { plnPrice: 312.76, plnMargin: 111.7, intranetId: 16, category: "ścianki banerowe" },
  "adStand L 120": { plnPrice: 449.736, plnMargin: 160.62, intranetId: 10039, category: "ścianki banerowe" },
  "adStand L 150": { plnPrice: 688.128, plnMargin: 245.76, intranetId: 10041, category: "ścianki banerowe" },
  "adStand L 60": { plnPrice: 346.192, plnMargin: 123.64, intranetId: 10009, category: "ścianki banerowe" },
  "adStand L 80": { plnPrice: 360.08, plnMargin: 128.6, intranetId: 69, category: "ścianki banerowe" },
  "adWall L 200": { plnPrice: 774.844, plnMargin: 276.73, intranetId: 10043, category: "ścianki banerowe" },

  // --- Kategoria: ścianki banerowe akcesoria ---
  "adStand L maszt": { plnPrice: 65.912, plnMargin: 23.54, intranetId: 10149, category: "ścianki banerowe akcesoria" },
};
window.KASETON_PRICES = KASETON_PRICES;

function finishKasetonBOM(bomItems, W, H, sys, config) {
  const ratePLN = window.KURS_PLN_DYNAMIC || 4.20;
  const rateUSD = window.KURS_USD_DYNAMIC || 1.15;
  let totalEUR = 0;

  bomItems.forEach(item => {
    let plnPrice = 0;
    let plnMargin = 0;

    if (item.isManual) {
      plnPrice = item.plnPrice;
      plnMargin = item.plnMargin;
    } else if (KASETON_PRICES[item.name]) {
      plnPrice = KASETON_PRICES[item.name].plnPrice;
      plnMargin = KASETON_PRICES[item.name].plnMargin;
      if (KASETON_PRICES[item.name].intranetId) {
        item.intranetId = KASETON_PRICES[item.name].intranetId;
      }
    } else if (item.name.startsWith("Wydruk adFrame")) {
      const areaM2 = (W * H) / 10000;
      plnPrice = areaM2 * 85.148;
      plnMargin = areaM2 * 30.41;
      const PRINT_INTRANET_IDS = {
        "Wydruk adFrame LMD/LMS/LMSM 100x200": 14442,
        "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU 100x200": 14722,
        "Wydruk adFrame Blockout 100x200 plecy nie do druku": 14722
      };
      if (PRINT_INTRANET_IDS[item.name]) {
        item.intranetId = PRINT_INTRANET_IDS[item.name];
      }
    }

    item.plnPrice = plnPrice;
    item.plnMargin = plnMargin; // Hidden material margin saved in object structure
    item.price = plnPrice / ratePLN; // Unit price in EUR
    totalEUR += item.price * parseFloat(item.qty);
  });

  // Update global pricing metrics
  globalTotalEUR = totalEUR;
  globalTotalPLN = totalEUR * ratePLN;

  const finalPLN = globalTotalPLN;
  const finalUSD = totalEUR * rateUSD;

  document.getElementById('valPLN').innerHTML = `<b>${Math.round(finalPLN).toLocaleString()} PLN</b>`;
  document.getElementById('valUSD').innerHTML = `<b>${Math.round(finalUSD).toLocaleString()} $</b>`;

  // Render BOM to sidebar
  let html = '<div class="bom-item highlight" style="margin-top:8px; border-bottom:1px solid #444; padding-bottom:4px;">';
  html += '<span><b>KASETON ' + sys + ' (' + W + '\u00d7' + H + ' cm)</b></span><span></span></div>';

  bomItems.forEach(item => {
    const q = item.qty;
    const u = item.unit ? (' ' + item.unit) : 'x';
    const lineTotal = item.price * parseFloat(q);
 // Displaying line total price in € rounded to 2 decimal places to be extremely precise
 html += '<div class="bom-item"><span>' + q + u + ' ' + item.name + '</span> <span>' + lineTotal.toFixed(2) + ' \u20ac</span></div>';
 });

 document.getElementById('bomList').innerHTML = html;
 document.getElementById('totalPrice').innerText = Math.round(totalEUR).toLocaleString() + ' \u20ac';
 document.getElementById('totalPower').innerText = '\u26a1 Moc: ' + Math.round(config.totalPowerW || 0) + ' W';
 window.lastGeneratedBOM = bomItems;
 }

 function calculateKasetonWeight(config) {
 const sys = config.system || 'LMD';
 const W = parseFloat(config.width) || 120;
 const H = parseFloat(config.depth) || 200;
 const wt = KASETON_WEIGHT_DATA[sys] || KASETON_WEIGHT_DATA.LMD;
 let total = 0;

 // Profile
 const profileM = (2 * W + 2 * H) / 100;
 total += profileM * wt.profile;

 // Support
 total += (config.totalSupportLengthM || 0) * wt.support;

 // Accessories (1 set)
 total += wt.accessories;

 // LED (approximate total LED = profile length)
 total += profileM * wt.led;

 // Feet
 if (config.usage === 'freestanding' && wt.feet > 0) {
 const nCW = config.numCutsW || 0;
 let nFeet = 2;
 if (nCW > 0) nFeet += nCW;
 else if (W >= 200) nFeet += 1;
 total += nFeet * wt.feet;
 }

 // PSUs
 if (config.psuCombo && config.psuCombo.length > 0) {
 config.psuCombo.forEach(p => { total += KASETON_PSU_WEIGHTS[p] || 0.3; });
 total += config.psuCombo.length * 0.1; // cables
 }

 // Cartons
 const cName = config.cartonName || 'Karton LMD/LMS/DTF - 210x16x33cm';
 const cQty = config.cartonQty || 1;
 total += (KASETON_CARTON_WEIGHTS[cName] || 2.0) * cQty;

 // Foam
 total += cQty * 4 * 0.05; // ~50g per foam piece

 // Prints
 const areaM2 = (W * H) / 10000;
 const printOpt = config.print || 'single';
 if (printOpt !== 'no_print') {
 if (printOpt === 'single') {
 total += areaM2 * KASETON_PRINT_WEIGHTS.led;
 total += areaM2 * KASETON_PRINT_WEIGHTS.blockout;
 } else if (printOpt === 'double') {
 total += areaM2 * KASETON_PRINT_WEIGHTS.led * 2;
 } else if (printOpt.includes('blockout')) {
 total += areaM2 * KASETON_PRINT_WEIGHTS.led;
 total += areaM2 * KASETON_PRINT_WEIGHTS.blockout;
 }
 }

 // Allen keys + misc hardware
 total += 0.15;

 return total;
 }
