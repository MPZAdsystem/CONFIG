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

 // 9. DATABASE & CURRENCY LOGIC
 const KASETON_PRICES = {
 // 1. Profile
 "Profil LMD odchudzony": { plnPrice: 85.382, plnMargin: 38.81, intranetId: 18517 },
 "Profil LMS": { plnPrice: 0, plnMargin: 0 },
 // 2. Narożniki
 "adFrame LMD narożnik wzmacniany": { plnPrice: 13.64, plnMargin: 6.20 },
 "adFrame LMS narożnik wzmacniany": { plnPrice: 0, plnMargin: 0 },
 // 3. LED Strips
 "Oświetlenie AdframeLED POWER LED 20cm 9W ver2": { plnPrice: 27.544, plnMargin: 12.52 },
 "Oświetlenie AdframeLED POWER LED 24cm 11W ver2": { plnPrice: 31.262, plnMargin: 14.21 },
 "Oświetlenie AdframeLED POWER LED 30cm 13W ver2": { plnPrice: 36.124, plnMargin: 16.42 },
 "Oświetlenie AdframeLED POWER LED 50cm 22W ver2": { plnPrice: 52.184, plnMargin: 23.72 },
 "Oświetlenie AdframeLED NORMAL LED 20cm 6,5W ver2": { plnPrice: 39.27, plnMargin: 17.85 },
 "Oświetlenie AdframeLED NORMAL LED 50cm 16W ver2": { plnPrice: 79.068, plnMargin: 35.94 },
 // 4. Power Supplies (Internal)
 "Zasilacz wewnętrzny 75W 24V": { plnPrice: 110.424, plnMargin: 50.19 },
 "Zasilacz wewnętrzny 100W 24V": { plnPrice: 180.444, plnMargin: 82.02 },
 "Zasilacz wewnętrzny 150W 24V": { plnPrice: 145.156, plnMargin: 65.98 },
 "Zasilacz wewnętrzny 200W 24V": { plnPrice: 209.506, plnMargin: 95.23 },
 "Zasilacz wewnętrzny 240W 24V": { plnPrice: 357.236, plnMargin: 162.38 },
 // Power Supplies (External)
 "Zasilacz zewnętrzny 120W 24V": { plnPrice: 435.072, plnMargin: 197.76 },
 "Zasilacz zewnętrzny 160W 24V": { plnPrice: 416.878, plnMargin: 189.49 },
 "Zasilacz zewnętrzny 220W 24V": { plnPrice: 546.392, plnMargin: 248.36 },
 "Zasilacz zewnętrzny 300W 24V": { plnPrice: 1332.716, plnMargin: 605.78 },
 "Zasilacz zewnętrzny 360W 24V": { plnPrice: 859.166, plnMargin: 390.53 },
 // 5. Support & Connectors
 "profil support light": { plnPrice: 25.212, plnMargin: 11.46 },
 "adFrame support zamek": { plnPrice: 5.126, plnMargin: 2.33 },
 "adFrame support 180° łącznik": { plnPrice: 10.604, plnMargin: 4.82 },
 "adFrame LMD łącznik 180° długi": { plnPrice: 26.554, plnMargin: 12.07 },
 "adFrame stopa LMD/LMS": { plnPrice: 116.006, plnMargin: 52.73 },
 // 6. Tools, Cartons & Foam (New Items)
 "adFrame imbus 2,5mm": { plnPrice: 0.44, plnMargin: 0.20 },
 "adFrame imbus 4mm": { plnPrice: 0.198, plnMargin: 0.09 },
 "Karton LMD/LMS - 110x16x33cm": { plnPrice: 47.30, plnMargin: 21.50 },
 "Karton LMD/LMS - 135x16x33cm": { plnPrice: 47.30, plnMargin: 21.50 },
 "Karton LMD/LMS - 160x16x33cm": { plnPrice: 47.30, plnMargin: 21.50 },
 "Karton LMD/LMS/DTF - 210x16x33cm": { plnPrice: 47.30, plnMargin: 21.50 },
 "adFrame LMD pianka ochronna": { plnPrice: 0.242, plnMargin: 0.11 }
 };

 const ratePLN = window.KURS_PLN_DYNAMIC || 4.20;
 const rateUSD = window.KURS_USD_DYNAMIC || 1.15;
 let totalEUR = 0;

 bomItems.forEach(item => {
 let plnPrice = 0;
 let plnMargin = 0;

 if (KASETON_PRICES[item.name]) {
 plnPrice = KASETON_PRICES[item.name].plnPrice;
 plnMargin = KASETON_PRICES[item.name].plnMargin;
 if (KASETON_PRICES[item.name].intranetId) {
 item.intranetId = KASETON_PRICES[item.name].intranetId;
 }
 } else if (item.name.startsWith("Wydruk adFrame")) {
 const areaM2 = (W * H) / 10000;
 plnPrice = areaM2 * 66.902;
 plnMargin = areaM2 * 30.41;
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