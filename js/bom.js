function addItemToBom(name, qty, unitPrice, counts) {
  if (!counts[name]) counts[name] = { qty: 0, total: 0, unitPrice: unitPrice || 0 };
  counts[name].qty += qty;
  counts[name].total += (qty * (unitPrice || 0));
}

function removePolishAccents(str) {
  const map = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z' };
  return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, match => map[match]);
}

function addCustomSupportsToBOM(bomItems, W, H, config) {
  if (!config.customSupports) return;
  const sys = config.system || 'LMD';
  const isCTF = (sys === 'CTF' || sys === 'CTF_LED');
  const D = config.height3D || 120;

  if (isCTF) {
    const cs = config.customSupports;
    cs.frontBack = cs.frontBack || { vertical: [], horizontal: [] };
    cs.leftRight = cs.leftRight || { vertical: [], horizontal: [] };
    cs.topBottom = cs.topBottom || { vertical: [], horizontal: [] };

    let ctfBarConns = 0;
    let locks = 0;
    let conns180 = 0;

    // Category 1: profil support light (pionowy przód/tył)
    const fbV = cs.frontBack.vertical || [];
    if (fbV.length > 0) {
      const len = 2 * fbV.length * (H - 4.2426) / 100;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(len.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support pionowy przód/tył. Ilość sztuk: ${fbV.length * 2}. Odległość od lewej: ` + fbV.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
      ctfBarConns += fbV.length * 2 * 2;
    }

    // Category 2: profil support light (poziomy przód/tył)
    const fbH = cs.frontBack.horizontal || [];
    if (fbH.length > 0) {
      const len = 2 * fbH.length * (W - 4.2426) / 100;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(len.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support poziomy przód/tył. Ilość sztuk: ${fbH.length * 2}. Odległość od dołu: ` + fbH.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
      ctfBarConns += fbH.length * 2 * 2;
    }

    const fbCross = fbV.length * fbH.length;
    locks += fbCross * 2 * 2;
    conns180 += fbCross * 2 * 2;

    // Category 3: profil support light (pionowy boki)
    const lrV = cs.leftRight.vertical || [];
    if (lrV.length > 0) {
      const len = 2 * lrV.length * (H - 4.2426) / 100;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(len.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support pionowy boki. Ilość sztuk: ${lrV.length * 2}. Odległość od lewej: ` + lrV.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
      ctfBarConns += lrV.length * 2 * 2;
    }

    // Category 4: profil support light (poziomy boki)
    const lrH = cs.leftRight.horizontal || [];
    if (lrH.length > 0) {
      const len = 2 * lrH.length * (D - 4.2426) / 100;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(len.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support poziomy boki. Ilość sztuk: ${lrH.length * 2}. Odległość od dołu: ` + lrH.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
      ctfBarConns += lrH.length * 2 * 2;
    }

    const lrCross = lrV.length * lrH.length;
    locks += lrCross * 2 * 2;
    conns180 += lrCross * 2 * 2;

    // Category 5: profil support light (szerokość góra/dół)
    const tbV = cs.topBottom.vertical || [];
    if (tbV.length > 0) {
      const len = 2 * tbV.length * (W - 4.2426) / 100;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(len.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support szerokość góra/dół. Ilość sztuk: ${tbV.length * 2}. Odległość od lewej: ` + tbV.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
      ctfBarConns += tbV.length * 2 * 2;
    }

    // Category 6: profil support light (głębokość góra/dół)
    const tbH = cs.topBottom.horizontal || [];
    if (tbH.length > 0) {
      const len = 2 * tbH.length * (D - 4.2426) / 100;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(len.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support głębokość góra/dół. Ilość sztuk: ${tbH.length * 2}. Odległość od dołu: ` + tbH.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
      ctfBarConns += tbH.length * 2 * 2;
    }

    const tbCross = tbV.length * tbH.length;
    locks += tbCross * 2 * 2;
    conns180 += tbCross * 2 * 2;

    if (ctfBarConns > 0) {
      bomItems.push({
        name: 'adFrame CTF support bar connector',
        qty: ctfBarConns,
        unit: 'szt',
        intranetId: 12077
      });
    }

    if (locks > 0) {
      bomItems.push({
        name: 'adFrame support zamek',
        qty: locks,
        unit: 'szt',
        intranetId: 10949
      });
    }

    if (conns180 > 0) {
      bomItems.push({
        name: 'adFrame support 180° łącznik',
        qty: conns180,
        unit: 'szt',
        intranetId: 11131
      });
    }
  } else {
    const multiplier = 1;
    const vSupports = config.customSupports.vertical || [];
    const hSupports = config.customSupports.horizontal || [];

    if (vSupports.length > 0) {
      const vSuppMeters = multiplier * vSupports.length * (H - 5.4) / 100;
      const descCount = multiplier * vSupports.length;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(vSuppMeters.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support pionowy. Ilość sztuk: ${descCount}. Odległość od lewej: ` + vSupports.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
    }

    if (hSupports.length > 0) {
      const hSuppMeters = multiplier * hSupports.length * (W - 5.4) / 100;
      const descCount = multiplier * hSupports.length;
      bomItems.push({
        name: "profil support light",
        qty: parseFloat(hSuppMeters.toFixed(2)),
        unit: "mb",
        intranetId: 11951,
        description: `Support poziomy. Ilość sztuk: ${descCount}. Odległość od dołu: ` + hSupports.map((s, idx) => `#${idx + 1} = ${s.pos}cm`).join(' / ')
      });
    }

    const numCross = vSupports.length * hSupports.length;
    const numZamki = multiplier * ((vSupports.length * 2) + (hSupports.length * 2) + (numCross * 2));
    const num180 = multiplier * (numCross * 2);

    if (numZamki > 0) {
      bomItems.push({
        name: 'adFrame support zamek',
        qty: numZamki,
        unit: 'szt',
        intranetId: 10949
      });
    }

    if (num180 > 0) {
      bomItems.push({
        name: 'adFrame support 180° łącznik',
        qty: num180,
        unit: 'szt',
        intranetId: 11131
      });
    }
  }
}

function generateKasetonBOM() {
  const config = window.currentKasetonConfig;
  if (!config) return;

  const W = parseFloat(config.width) || 120;
  const H = parseFloat(config.depth) || 200;
  const D = parseFloat(config.height3D) || 120;
  const sys = config.system || 'LMD';
  const isLedSys = ['LMD', 'LMS', 'LMSM', 'CTF_LED', 'LCD_LMD'].includes(sys);

  const bomItems = [];

  if (sys === 'CTF' || sys === 'CTF_LED') {
    const D = parseFloat(config.height3D) || 120; // Głębokość przestrzenna ramy 3D
    const wMeters = W / 100;
    const hMeters = H / 100;
    const dMeters = D / 100;

    // 1. Indeks nadrzędny całego zestawu kasetonu (bez ceny, spięty z ID 18337)
    bomItems.push({ name: "adFrame CTF", qty: 1, unit: "szt", intranetId: 18337, forceZeroPrice: true });

    // 2. 12 profili głównych CTF (4x szerokość, 4x wysokość, 4x głębokość)
    const totalProfileMeters = 4 * wMeters + 4 * hMeters + 4 * dMeters;
    bomItems.push({ name: "profil CTF", qty: parseFloat(totalProfileMeters.toFixed(2)), unit: "mb", intranetId: 12099 });

    // 3. 8 łączników narożnych ramy zewnętrznej sześcianu
    bomItems.push({ name: "adFrame CTF Plastic connector", qty: 8, unit: "szt", intranetId: 12090 });

    // 4. Układ wzmocnień (Supporty) oraz łączniki wewnętrzne rurek
    if (config.cut === 'custom') {
      addCustomSupportsToBOM(bomItems, W, H, config);
    } else {
      const ctfSuppLen = config.totalSupportLengthM || 0;
      if (ctfSuppLen > 0) {
        bomItems.push({ name: 'profil support light', qty: parseFloat(ctfSuppLen.toFixed(2)), unit: 'mb', intranetId: 11951 });

        // Odtworzenie siatki podziałów ramy celem precyzyjnego wyliczenia spinek supportu
        let numSegmentsW = 1, numSegmentsH = 1;
        if (config.cut && config.cut.includes('half_w')) numSegmentsW = 2;
        else if (config.cut && config.cut.includes('3w')) numSegmentsW = 3;
        else if (config.cut && config.cut.includes('4w')) numSegmentsW = 4;
        else if (config.cut && config.cut.includes('5w')) numSegmentsW = 5;

        if (config.cut && config.cut.includes('half_h')) numSegmentsH = 2;
        else if (config.cut && config.cut.includes('3h')) numSegmentsH = 3;
        else if (config.cut && config.cut.includes('4h')) numSegmentsH = 4;
        else if (config.cut && config.cut.includes('5h')) numSegmentsH = 5;

        if (config.cut && config.cut.startsWith('auto')) {
          const maxLen = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200);
          if (W > maxLen) numSegmentsW = Math.ceil(W / maxLen);
          if (H > maxLen) numSegmentsH = Math.ceil(H / maxLen);
        }

        const numCutsW = numSegmentsW - 1;
        const numCutsH = numSegmentsH - 1;
        const numCutsZ = D > 200 ? 1 : 0;

        // Solver zliczający spinki rurek (adFrame CTF support bar connector)
        let supportConnectorsQty = (numCutsW * 4) + (numCutsH * 4) + (numCutsZ * 4);
        if (numCutsW > 0 && numCutsH > 0) {
          supportConnectorsQty += (numCutsW * numCutsH * 2); // Punkty krzyżowe wewnętrzne
        }

        // Dodatkowe spinki/łączniki dla belek wiszących żarówek
        if (sys === 'CTF_LED' && config.light === 'zarowka') {
          const numZ_zar = 1 + Math.ceil(Math.max(0, D - 100) / 100);
          supportConnectorsQty += numZ_zar * 2;
        }

        // Bezpiecznik dla dużych gabarytów bez wymuszonych cięć kurierskich (stabilizacja ramy)
        if (supportConnectorsQty === 0 && (W > 200 || H > 200 || D > 200)) {
          supportConnectorsQty = 8;
        }

        if (supportConnectorsQty > 0) {
          bomItems.push({ name: "adFrame CTF support bar connector", qty: supportConnectorsQty, unit: "szt", intranetId: 12077 });
        }
      }
    }

    // 5. Blat CTF (Zaciągany z ID 16443, wyliczany z bazy wyjściowej, opis XML w milimetrach -45mm)
    const topPanel = config.topPanel || 'none';
    if (topPanel !== 'none') {
      const topPanelAreaM2 = (W * D) / 10000;
      const topPanelPlnPrice = topPanelAreaM2 * 400; // 400 PLN za m2
      const topPanelPlnMargin = topPanelPlnPrice / 2.8;

      // Formatowanie opisu dla XML handlowego (zamiana cm -> mm i odjęcie 45mm luzu technologicznego)
      const blatDescription = `${Math.round(W * 10 - 45)}x${Math.round(D * 10 - 45)} mm`;

      bomItems.push({
        name: "Blat CTF",
        qty: 1,
        unit: "szt",
        intranetId: 16443,
        customPlnPrice: topPanelPlnPrice,
        customPlnMargin: topPanelPlnMargin,
        description: blatDescription // Parametr zaczytywany przez Wasz generator eksportu XML
      });
    }

    // 6. Elementy montażowe / Zawiesia
    if (config.usage === 'suspended') {
      bomItems.push({ name: "adFrame CTF - zestaw do podwieszenia 2m (4 PKT) do MO", qty: 1, unit: "szt", intranetId: 17790 });
    }

    // 6a. Plafony LED dla systemu CTF LED
    if (sys === 'CTF_LED' && (config.light === 'plafon_dol' || config.light === 'plafon_gora' || config.light === 'plafon_gora_dol')) {
      let numX = Math.floor((W - 5) / 35);
      if (numX < 1 && W >= 40) numX = 1;
      let numZ = Math.floor((D - 5) / 35);
      if (numZ < 1 && D >= 40) numZ = 1;

      let totalPlafonds = (numX >= 1 && numZ >= 1) ? (numX * numZ) : 0;
      if (config.light === 'plafon_gora_dol') {
        totalPlafonds *= 2;
      }
      if (totalPlafonds > 0) {
        bomItems.push({
          name: "Plafon LED 30x30",
          qty: totalPlafonds,
          unit: "szt",
          intranetId: 18957
        });

        // Puszka instalacyjna i kable zasilające dla Plafonów (1 dla góra lub dół, 2 dla góra+dół)
        const extraQty = (config.light === 'plafon_gora_dol') ? 2 : 1;

        bomItems.push({
          name: "puszka instalacyjna",
          qty: extraQty,
          unit: "szt",
          intranetId: 15284
        });

        bomItems.push({
          name: "Kabel zasilający do zasilacza wew / adFrame Quick",
          qty: extraQty,
          unit: "szt",
          intranetId: 17392
        });
      }
    }

    // 6b. Żarówki LED dla systemu CTF LED (zarowka)
    if (sys === 'CTF_LED' && config.light === 'zarowka') {
      const numX = 1 + Math.ceil(Math.max(0, W - 100) / 100);
      const numZ = 1 + Math.ceil(Math.max(0, D - 100) / 100);
      const totalBulbs = numX * numZ;
      if (totalBulbs > 0) {
        // Żarówki 100W
        bomItems.push({
          name: "żarówka 100W do adFrame CTF Hanging (duża)",
          qty: totalBulbs,
          unit: "szt",
          intranetId: 17711
        });

        // Kabel zasilający
        bomItems.push({
          name: "Kabel zasilający do zasilacza wew / adFrame Quick",
          qty: 1,
          unit: "szt",
          intranetId: 17392
        });

        // Puszka instalacyjna z dynamiczną logiką ilości
        let puszkaQty = 1;
        if (totalBulbs === 2) {
          puszkaQty = 2;
        } else if (totalBulbs === 3) {
          puszkaQty = 4;
        } else if (totalBulbs === 4) {
          puszkaQty = 6;
        } else if (totalBulbs > 4) {
          puszkaQty = 6 + Math.ceil((totalBulbs - 4) * 1.5);
        }

        bomItems.push({
          name: "puszka instalacyjna",
          qty: puszkaQty,
          unit: "szt",
          intranetId: 15284
        });
      }
    }

    // 7. Kartony i pianki (Dobór matematyczny skopiowany 1:1 z algorytmu LMD)
    let numCutsW = 0, numCutsH = 0;
    if (config.cut && config.cut.includes('half_w')) numCutsW = 1;
    else if (config.cut && config.cut.includes('3w')) numCutsW = 2;
    else if (config.cut && config.cut.includes('4w')) numCutsW = 3;
    else if (config.cut && config.cut.includes('5w')) numCutsW = 4;

    if (config.cut && config.cut.includes('half_h')) numCutsH = 1;
    else if (config.cut && config.cut.includes('3h')) numCutsH = 2;
    else if (config.cut && config.cut.includes('4h')) numCutsH = 3;
    else if (config.cut && config.cut.includes('5h')) numCutsH = 4;

    if (config.cut && config.cut.startsWith('auto')) {
      const maxLen = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200);
      if (W > maxLen) numCutsW = Math.ceil(W / maxLen) - 1;
      if (H > maxLen) numCutsH = Math.ceil(H / maxLen) - 1;
    }

    let maxSegmentLen = Math.max(W / (numCutsW + 1), H / (numCutsH + 1));
    let isSplit = false;
    if (maxSegmentLen > 200) {
      maxSegmentLen = maxSegmentLen / 2;
      isSplit = true;
    }

    const requiredCartonLength = maxSegmentLen + 10;
    let cartonName = 'Karton LMD/LMS/DTF - 210x16x33cm';
    if (requiredCartonLength <= 110) cartonName = 'Karton LMD/LMS - 110x16x33cm';
    else if (requiredCartonLength <= 135) cartonName = 'Karton LMD/LMS - 135x16x33cm';
    else if (requiredCartonLength <= 160) cartonName = 'Karton LMD/LMS - 160x16x33cm';

    const totalCuts = numCutsW + numCutsH;
    const totalPieces = 2 * (numCutsW + 1) + 2 * (numCutsH + 1);
    let baseCartons = 1;
    if (totalCuts > 4) {
      baseCartons = Math.ceil(totalPieces / 8);
    }

    let finalCartonQty = isSplit ? baseCartons * 2 : baseCartons;
    finalCartonQty = adjustCartonsByWeight(config, finalCartonQty, cartonName);
    const foamQty = finalCartonQty * 4;

    bomItems.push({ name: cartonName, qty: finalCartonQty, unit: 'szt' });
    bomItems.push({ name: 'adFrame LMD pianka ochronna', qty: foamQty, unit: 'szt' });
    config.cartonName = cartonName;
    config.cartonQty = finalCartonQty;

    // 8. Rozbicie wydruków na pojedyncze pozycje (Dla ERP/DTP - unikalne pliki graficzne)
    const printOption = config.print || '6_sides';
    if (printOption !== 'no_print') {
      const facesTemp = [];

      // Definiujemy każdą płaszczyznę bryły 3D od razu z jej fizyczną rolą/kierunkiem
      if (printOption === '6_sides' || printOption === 'all_sides') {
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'przód' });
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'tył' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok lewy' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok prawy' });
        facesTemp.push({ w: W, h: D, isBlockout: false, side: 'góra' });
        facesTemp.push({ w: W, h: D, isBlockout: false, side: 'dół' });
      } else if (printOption === '4_sides') {
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'przód' });
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'tył' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok lewy' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok prawy' });
      } else if (printOption === '5_sides_top_open') {
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'przód' });
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'tył' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok lewy' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok prawy' });
        facesTemp.push({ w: W, h: D, isBlockout: false, side: 'dół' });
      } else if (printOption === '5_sides_bottom_open') {
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'przód' });
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'tył' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok lewy' });
        facesTemp.push({ w: D, h: H, isBlockout: false, side: 'bok prawy' });
        facesTemp.push({ w: W, h: D, isBlockout: false, side: 'góra' });
      } else if (printOption === 'front_back') {
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'przód' });
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'tył' });
        facesTemp.push({ w: D, h: H, isBlockout: true, side: 'bok lewy' });
        facesTemp.push({ w: D, h: H, isBlockout: true, side: 'bok prawy' });
        facesTemp.push({ w: W, h: D, isBlockout: true, side: 'góra' });
        facesTemp.push({ w: W, h: D, isBlockout: true, side: 'dół' });
      } else if (printOption === 'single_front') {
        facesTemp.push({ w: W, h: H, isBlockout: false, side: 'przód' });
        facesTemp.push({ w: W, h: H, isBlockout: true, side: 'tył' });
        facesTemp.push({ w: D, h: H, isBlockout: true, side: 'bok lewy' });
        facesTemp.push({ w: D, h: H, isBlockout: true, side: 'bok prawy' });
        facesTemp.push({ w: W, h: D, isBlockout: true, side: 'góra' });
        facesTemp.push({ w: W, h: D, isBlockout: true, side: 'dół' });
      }

      const exactSizes = [
        { w: 100, h: 100, id: 15140 }, { w: 50, h: 100, id: 15141 }, { w: 150, h: 150, id: 15142 },
        { w: 100, h: 200, id: 15143 }, { w: 200, h: 200, id: 15144 }, { w: 100, h: 300, id: 15147 },
        { w: 100, h: 245, id: 15146 }, { w: 30, h: 30, id: 15149 }, { w: 300, h: 300, id: 15148 },
        { w: 120, h: 30, id: 15150 }, { w: 50, h: 50, id: 15153 }
      ];

      // Rezygnujemy z printAggregator - każda płaszczyzna ląduje w osobnym wierszu zestawienia
      facesTemp.forEach(face => {
        let nameKey = "";
        let intranetId = null;

        if (face.isBlockout) {
          nameKey = `Wydruk adFrame Blockout ${face.w}x${face.h}`;
          intranetId = 15267;
        } else {
          let match = exactSizes.find(function (s) {
            return (s.w === face.w && s.h === face.h) || (s.w === face.h && s.h === face.w);
          });

          if (match) {
            nameKey = `Wydruk adFrame CTF ${match.w}x${match.h}`;
            intranetId = match.id;
          } else {
            nameKey = `Wydruk adFrame CTF`;
            intranetId = 12161; // Ogólny fallback wskazany przez Ciebie
          }
        }

        // Popychamy każdą krawędź bezpośrednio jako pojedynczy, spersonalizowany wiersz
        bomItems.push({
          name: nameKey,
          qty: 1, // Sztywne wymuszenie pojedynczych sztuk
          unit: "szt",
          intranetId: intranetId,
          description: `${face.w}x${face.h} cm (${face.side})` // Odróżnienie boków w cm
        });
      });
    }

    // 9. Koszyk manualny
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
        }
      }
    }

    finishKasetonBOM(bomItems, W, H, sys, config);
    return;
  }
  // =========================================================================
  // 🔲 SYSTEM: adFrame STF — KLASYCZNA RAMA JEDNOSTRONNA (BEZ PRĄDU)
  // =========================================================================
  // =========================================================================
  // 🔲 SYSTEM: adFrame STF / STFL / DTF — KLASYCZNE RAMY BEZ PRĄDU
  // =========================================================================
  if (sys === 'STF' || sys === 'STFL' || sys === 'DTF') {
    // Przedterminowe wyliczenie linii cięć (identyczne z logiką LMD/LMSM)
    let numCutsW = 0, numCutsH = 0;
    if (config.cut && config.cut.includes('half_w')) numCutsW = 1;
    else if (config.cut && config.cut.includes('3w')) numCutsW = 2;
    else if (config.cut && config.cut.includes('4w')) numCutsW = 3;
    else if (config.cut && config.cut.includes('5w')) numCutsW = 4;

    if (config.cut && config.cut.includes('half_h')) numCutsH = 1;
    else if (config.cut && config.cut.includes('3h')) numCutsH = 2;
    else if (config.cut && config.cut.includes('4h')) numCutsH = 3;
    else if (config.cut && config.cut.includes('5h')) numCutsH = 4;

    if (config.cut && config.cut.startsWith('auto')) {
      const maxLen = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200);
      if (W > maxLen) numCutsW = Math.ceil(W / maxLen) - 1;
      if (H > maxLen) numCutsH = Math.ceil(H / maxLen) - 1;
    }

    const totalCuts = numCutsW + numCutsH;

    // 1. Indeks nadrzędny całego zestawu ramy (bez ceny, spięty z odpowiednim ID)
    const parentName = sys === 'STFL' ? "adFrame STFL" : (sys === 'DTF' ? "adFrame DTF" : "adFrame STF");
    const parentId = sys === 'STFL' ? 10594 : (sys === 'DTF' ? 10332 : 18254);
    bomItems.push({ name: parentName, qty: 1, unit: "szt", intranetId: parentId, forceZeroPrice: true });

    // 2. Profil obwodowy rozbity na pozycje szerokość oraz wysokość + informacja o cięciach
    const profileName = sys === 'STFL' ? "profil STFL" : (sys === 'DTF' ? "profil DTF" : "profil STF");
    const profileId = sys === 'STFL' ? 10934 : (sys === 'DTF' ? 10932 : 10937);

    const descW = `Szerokość ${W}cm / cięcie: ${numCutsW > 0 ? 'pocięty na ' + (numCutsW + 1) + ' części' : 'w całości'}`;
    bomItems.push({ name: profileName, qty: parseFloat((2 * W / 100).toFixed(2)), unit: "mb", intranetId: profileId, description: descW });

    const descH = `Wysokość ${H}cm / cięcie: ${numCutsH > 0 ? 'pocięty na ' + (numCutsH + 1) + ' części' : 'w całości'}`;
    bomItems.push({ name: profileName, qty: parseFloat((2 * H / 100).toFixed(2)), unit: "mb", intranetId: profileId, description: descH });

    // 3. Narożniki dedykowane — dokładnie 4 sztuki zawsze
    const cornerName = sys === 'STFL' ? "adFrame STFL narożnik" : "adFrame LMS/STF/DTF narożnik (gwintowany)";
    const cornerId = sys === 'STFL' ? 10953 : 10940;
    bomItems.push({ name: cornerName, qty: 4, unit: "szt", intranetId: cornerId });

    // 4. Układ wzmocnień (Supporty light) i zamki / łączniki
    let finalTotalCuts = totalCuts;
    if (config.cut === 'custom') {
      addCustomSupportsToBOM(bomItems, W, H, config);
      if (config.customCuts) {
        numCutsW = config.customCuts.vertical ? config.customCuts.vertical.length : 0;
        numCutsH = config.customCuts.horizontal ? config.customCuts.horizontal.length : 0;
      }
      finalTotalCuts = numCutsW + numCutsH;
    } else {
      const isWallSTF_STFL = (sys === 'STF' || sys === 'STFL') && config.usage === 'wall';
      const suppLen = isWallSTF_STFL ? 0 : (config.totalSupportLengthM || ((numCutsW * H + numCutsH * W) / 100));
      if (suppLen > 0) {
        bomItems.push({ name: 'profil support light', qty: parseFloat(suppLen.toFixed(2)), unit: 'mb', intranetId: 11951 });
      }

      // Zamki rurek (ID 10949) oraz wewnętrzne łączniki 180° krzyżaków (ID 11131)
      const zamki = isWallSTF_STFL ? 0 : ((numCutsW * 2) + (numCutsH * 2));
      if (zamki > 0) {
        bomItems.push({ name: 'adFrame support zamek', qty: zamki, unit: 'szt', intranetId: 10949 });
      }
      const crossConns = isWallSTF_STFL ? 0 : (numCutsW * numCutsH);
      if (crossConns > 0) {
        bomItems.push({ name: 'adFrame support 180° łącznik', qty: crossConns * 2, unit: 'szt', intranetId: 11131 });
      }
    }

    // Łączniki 180° pociętych krawędzi profili obwodowych ramy — po 2 szt. na każde fizyczne cięcie ramy
    if (finalTotalCuts > 0) {
      const connName = sys === 'STFL' ? "adFrame STFL łącznik 180°" : "adFrame DTF/STF/LMSM łącznik 180°";
      const connId = sys === 'STFL' ? 11908 : 10941;
      bomItems.push({ name: connName, qty: finalTotalCuts * 2, unit: 'szt', intranetId: connId });
    }

    // 5. Wieszaki naścienne dla opcji ściennej (Skopiowane 1:1 z retencji LMSM, ID 10944) - dotyczy tylko STF/STFL
    if ((sys === 'STF' || sys === 'STFL') && config.usage === 'wall') {
      let hangerQty = (H <= 150) ? 2 : 4;
      if (W > 150) {
        let extraMeters = Math.ceil((W - 150) / 100);
        hangerQty += 2 * extraMeters;
      }
      if (numCutsW > 0) {
        let totalTopSegments = numCutsW + 1;
        let cutRequiredHangers = 2 * totalTopSegments;
        if (hangerQty < cutRequiredHangers) {
          hangerQty = cutRequiredHangers;
        }
      }
      bomItems.push({ name: 'adFrame STF/STFL wieszak', qty: hangerQty, unit: 'szt', intranetId: 10944 });
    }

    // 5a. Stopy płaskie lub trójkątne (DTF) - zawsze dokładnie 2 sztuki montowane po bokach
    if (sys === 'DTF' && (config.usage === 'freestanding' || config.usage === 'freestanding_tri')) {
      if (config.usage === 'freestanding') {
        bomItems.push({ name: 'adFrame DTF stopa płaska', qty: 2, unit: 'szt', intranetId: 10943 });
      } else {
        bomItems.push({ name: 'adFrame DTF stopa trójkątna', qty: 2, unit: 'szt', intranetId: 10942 });
      }
    }

    // 5b. Zestaw do podwieszenia dla opcji podwieszanej (STF/STFL/DTF)
    if (config.usage === 'suspended') {
      let numSuspensionSets = config.numSuspensionSets || 2;
      bomItems.push({ name: 'adFrame - zestaw do podwieszenia ∅2mm', qty: numSuspensionSets, unit: 'szt', intranetId: 11871 });
    }

    // [RETENCJA PRODUKCYJNA]: Brak modułów LED, zasilaczy i przewodów zasilających — rama niepodświetlana

    // 6. Zestaw narzędzi montażowych (Imbusy + Torx)
    bomItems.push({ name: 'adFrame imbus 2,5mm', qty: 1, unit: 'szt', intranetId: 11315 });
    bomItems.push({ name: 'adFrame imbus 4mm', qty: 1, unit: 'szt', intranetId: 11316 });
    bomItems.push({ name: 'adFrame torx T30', qty: 1, unit: 'szt', intranetId: 13758 });

    // 7. Dobór opakowań kartonowych oraz pianek ochronnych (ID 14813)
    let maxSegmentLen = Math.max(W / (numCutsW + 1), H / (numCutsH + 1));
    let isSplit = false;
    if (maxSegmentLen > 200) { maxSegmentLen = maxSegmentLen / 2; isSplit = true; }

    const requiredCartonLength = maxSegmentLen + 10;
    let cartonName = 'Karton DTF/STF/LMSM - 110x16x16cm'; // Bazowy domyślny
    if (requiredCartonLength <= 110) {
      cartonName = totalCuts > 4 ? 'Karton DTF/STF/LMSM - 110x16x26cm' : 'Karton DTF/STF/LMSM - 110x16x16cm';
    } else if (requiredCartonLength <= 135) {
      cartonName = 'Karton DTF/STF/LMSM - 135x16x26cm';
    } else {
      cartonName = 'Karton DTF/STF/LMSM - 160x16x26cm';
    }

    // Przypisanie specyficznego ID kartonu pod ERP
    const cartonIdMap = {
      'Karton DTF/STF/LMSM - 110x16x16cm': 14835,
      'Karton DTF/STF/LMSM - 110x16x26cm': 14836,
      'Karton DTF/STF/LMSM - 135x16x26cm': 14838,
      'Karton DTF/STF/LMSM - 160x16x26cm': 14840
    };
    const currentCartonId = cartonIdMap[cartonName] || 14835;

    const totalPieces = 2 * (numCutsW + 1) + 2 * (numCutsH + 1);
    let baseCartons = totalCuts > 4 ? Math.ceil(totalPieces / 8) : 1;
    let finalCartonQty = isSplit ? baseCartons * 2 : baseCartons;
    finalCartonQty = adjustCartonsByWeight(config, finalCartonQty, cartonName);

    bomItems.push({ name: cartonName, qty: finalCartonQty, unit: 'szt', intranetId: currentCartonId });
    bomItems.push({ name: 'adFrame DTF/STF pianka ochronna', qty: finalCartonQty * 4, unit: 'szt', intranetId: 14813 });

    config.cartonName = cartonName;
    config.cartonQty = finalCartonQty;

    // 8. Logika parowania i dobierania wydruków (Siatka exactSizes ze screenshotu + ogólne do ERP)
    const defaultPrint = (sys === 'DTF') ? 'double_blockout' : 'front_blockout';
    const printOption = config.print || defaultPrint;
    if (printOption !== 'no_print') {
      if (sys === 'DTF') {
        const exactDTFSizes = [
          { w: 100, h: 100, id: 14347 }, { w: 100, h: 200, id: 14830 }, { w: 100, h: 250, id: 14828 },
          { w: 150, h: 200, id: 14827 }, { w: 150, h: 210, id: 19025 }, { w: 150, h: 250, id: 14826 },
          { w: 160, h: 200, id: 19873 }, { w: 200, h: 200, id: 14825 }, { w: 200, h: 250, id: 14823 },
          { w: 300, h: 200, id: 14822 }, { w: 300, h: 250, id: 14821 }, { w: 400, h: 200, id: 14820 },
          { w: 400, h: 250, id: 14819 }, { w: 500, h: 200, id: 14818 }, { w: 500, h: 250, id: 14817 },
          { w: 600, h: 200, id: 14816 }, { w: 600, h: 250, id: 14815 }, { w: 80, h: 200, id: 14564 },
          { w: 50, h: 100, id: 14562 }
        ];

        let match = exactDTFSizes.find(function (s) {
          return (s.w === W && s.h === H) || (s.w === H && s.h === W);
        });

        let pName = "";
        let pId = null;
        let pDesc = "";

        if (match) {
          pName = `Wydruk adFrame DTF ${match.w}x${match.h}`;
          pId = match.id;
        } else {
          let longerDim = Math.max(W, H);
          if (longerDim <= 100) {
            pName = "Wydruk adFrame DTF (do 1mb/medium250)";
            pId = 10546;
          } else if (longerDim <= 300) {
            pName = "Wydruk adFrame DTF (do 3mb/medium250)";
            pId = 16423;
          } else {
            pName = "Wydruk adFrame DTF (pow. 3mb/medium250)";
            pId = 16424;
          }
          pDesc = `${W}x${H} cm`;
        }

        bomItems.push({ name: pName, qty: 2, unit: 'szt', intranetId: pId, description: pDesc });
      } else {
        const exactSTFSizes = [
          { w: 100, h: 100, id: 17954 }, { w: 100, h: 200, id: 17956 }, { w: 100, h: 250, id: 17957 },
          { w: 150, h: 200, id: 17960 }, { w: 150, h: 250, id: 17961 }, { w: 200, h: 250, id: 17962 },
          { w: 200, h: 200, id: 17963 }, { w: 300, h: 200, id: 17964 }, { w: 300, h: 250, id: 17965 },
          { w: 400, h: 200, id: 17966 }, { w: 400, h: 250, id: 17967 }, { w: 500, h: 200, id: 17968 },
          { w: 500, h: 250, id: 17969 }, { w: 50, h: 50, id: 17972 }, { w: 600, h: 250, id: 17974 },
          { w: 70, h: 100, id: 17975 }
        ];

        let match = exactSTFSizes.find(function (s) {
          return (s.w === W && s.h === H) || (s.w === H && s.h === W);
        });

        let pName = "";
        let pId = null;
        let pDesc = "";

        if (match) {
          pName = `Wydruk adFrame STF/STFL ${match.w}x${match.h}`;
          pId = match.id;
        } else {
          let longerDim = Math.max(W, H);
          if (longerDim <= 100) {
            pName = "Wydruk adFrame STF/STFL (do 1mb/medium250)";
            pId = 17953;
          } else if (longerDim <= 300) {
            pName = "Wydruk adFrame STF/STFL (do 3mb/medium250)";
            pId = 17980;
          } else {
            pName = "Wydruk adFrame STF/STFL (pow. 3mb/medium250)";
            pId = 17978;
          }
          pDesc = `${W}x${H} cm`;
        }

        bomItems.push({ name: pName, qty: 1, unit: 'szt', intranetId: pId, description: pDesc });
      }
    }

    // 9. Koszyk manualny (Dopłaty handlowców)
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
        }
      }
    }

    // Przekazanie gotowej paczki obiektów do pętli wyceniającej i wyjście z funkcji
    finishKasetonBOM(bomItems, W, H, sys, config);
    return;
  }
  if (sys === 'LMSM') {
    // Przedterminowe wyliczenie linii cięć, niezbędne dla solvera oświetleniowego i strukturalnego
    let numCutsW = 0, numCutsH = 0;
    if (config.cut && config.cut.includes('half_w')) numCutsW = 1;
    else if (config.cut && config.cut.includes('3w')) numCutsW = 2;
    else if (config.cut && config.cut.includes('4w')) numCutsW = 3;
    else if (config.cut && config.cut.includes('5w')) numCutsW = 4;

    if (config.cut && config.cut.includes('half_h')) numCutsH = 1;
    else if (config.cut && config.cut.includes('3h')) numCutsH = 2;
    else if (config.cut && config.cut.includes('4h')) numCutsH = 3;
    else if (config.cut && config.cut.includes('5h')) numCutsH = 4;

    if (config.cut && config.cut.startsWith('auto')) {
      const maxLen = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200);
      if (W > maxLen) numCutsW = Math.ceil(W / maxLen) - 1;
      if (H > maxLen) numCutsH = Math.ceil(H / maxLen) - 1;
    }

    // 1. PROFIL OBWODOWY LMSM (ID: 10936)
    const totalProfileMeters = (2 * W + 2 * H) / 100;
    bomItems.push({ name: "profil LMSM", qty: totalProfileMeters.toFixed(2), unit: 'mb' });

    // 2. NAROŻNIKI LMSM (ID: 11118) - Zawsze dokładnie 4 sztuki na zamówienie
    bomItems.push({ name: "adFrame LMSM narożnik", qty: 4, unit: 'szt' });

    // 3. UKŁAD OŚWIETLENIA LED
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
      if (config.cut === 'custom') {
        const supports = isHoriz ? (config.customSupports?.vertical || []) : (config.customSupports?.horizontal || []);
        const positions = supports.map(s => s.pos).sort((a, b) => a - b);
        const segmentLengths = [];
        let currentStart = 5;
        for (let i = 0; i < positions.length; i++) {
          const pos = positions[i];
          const end = pos - 2.5;
          if (end > currentStart + 1) {
            segmentLengths.push(end - currentStart);
          }
          currentStart = pos + 2.5;
        }
        const finalEnd = profileLength - 5;
        if (finalEnd > currentStart + 1) {
          segmentLengths.push(finalEnd - currentStart);
        }
        return segmentLengths;
      }

      let n = 1;
      if (isHoriz) {
        n = numCutsW + 1;
      } else {
        n = numCutsH + 1;
      }
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

    // 🛠️ DEDYKOWANA RETENCJA: ŁĄCZENIA INTERFEJSU LED JACK 3,5MM DLA SYSTEMU LMSM
    let totalConn = 0;
    if (drawTop) totalConn += numCutsW;
    if (drawBottom) totalConn += numCutsW;
    if (drawLeft) totalConn += numCutsH;
    if (drawRight) totalConn += numCutsH;

    if (totalConn > 0) {
      bomItems.push({ name: 'złączka LED - Jack 3,5mm 10cm męski', qty: totalConn, unit: 'szt' });
      bomItems.push({ name: 'złączka LED - Jack 3,5mm 10cm żeński', qty: totalConn, unit: 'szt' });
    }

    // Dodawanie mostków oraz kabli przelotowych dla przeciwległych uzbrojonych krawędzi
    const isOppositeArmed = (drawTop && drawBottom && !drawLeft && !drawRight) || (drawLeft && drawRight && !drawTop && !drawBottom);
    if (isOppositeArmed) {
      const unarmedLen = (drawTop && drawBottom) ? H : W;
      const targetLen = unarmedLen - 38;
      const remainingLen = targetLen - 50;

      bomItems.push({ name: 'złączka LED - Jack 3,5mm 50cm żeński', qty: 1, unit: 'szt' });

      if (remainingLen > 0) {
        function getExtensionsForLength(len) {
          if (len <= 0) return [];
          const sizes = [100, 150, 200];
          let bestCombo = null;
          let bestSum = Infinity;

          function search(currentCombo, currentSum) {
            if (currentSum >= len) {
              if (currentSum < bestSum || (currentSum === bestSum && currentCombo.length < bestCombo.length)) {
                bestSum = currentSum;
                bestCombo = [...currentCombo];
              }
              return;
            }
            if (currentSum >= len + 200) return;

            for (let size of sizes) {
              currentCombo.push(size);
              search(currentCombo, currentSum + size);
              currentCombo.pop();
            }
          }
          search([], 0);
          return bestCombo || [];
        }

        const extCombo = getExtensionsForLength(remainingLen);
        const extCounts = { 100: 0, 150: 0, 200: 0 };
        extCombo.forEach(size => { extCounts[size]++; });

        if (extCounts[100] > 0) {
          bomItems.push({ name: 'złączka LED - przedłużka Jack 3,5mm 100cm', qty: extCounts[100], unit: 'szt' });
        }
        if (extCounts[150] > 0) {
          bomItems.push({ name: 'złączka LED - przedłużka Jack 3,5mm 150cm', qty: extCounts[150], unit: 'szt' });
        }
        if (extCounts[200] > 0) {
          bomItems.push({ name: 'złączka LED - przedłużka Jack 3,5mm 200cm', qty: extCounts[200], unit: 'szt' });
        }
      }
    }

    // 4. ZASILACZE
    if (config.psuCombo && config.psuCombo.length > 0) {
      const psuCounts = {};
      config.psuCombo.forEach(p => { psuCounts[p] = (psuCounts[p] || 0) + 1; });
      for (let p in psuCounts) {
        bomItems.push({ name: p, qty: psuCounts[p], unit: 'szt' });
      }
    }

    // 4b. PRZEWODY ZASILAJĄCE (ID: 17392) - Tylko dla zasilaczy wewnętrznych
    // 🛠️ FIX: Deklaracja brakujących zmiennych przed sprawdzeniem warunku if
    const psuCount = config.psuCombo ? config.psuCombo.length : 0;
    const psuType = config.power || 'internal';

    if (psuCount > 0 && psuType !== 'external') {
      let maxLedProfileLen = 0;
      if (drawBottom || drawTop) maxLedProfileLen = Math.max(maxLedProfileLen, W);
      if (drawLeft || drawRight) maxLedProfileLen = Math.max(maxLedProfileLen, H);

      let cableQty = 0;
      if (psuCount === 1) {
        cableQty = 1;
      } else if (psuCount > 1) {
        if (maxLedProfileLen < 400) cableQty = 1;
        else cableQty = 2;
      }
      if (cableQty > 0) {
        bomItems.push({ name: 'Kabel zasilający do zasilacza wew / adFrame Quick', qty: cableQty, unit: 'szt' });
      }
    }

    // 5. UKŁAD WZMOCNIEŃ (SUPPORTY) I ŁĄCZNIKI GŁÓWNE
    let finalTotalCuts = 0;
    if (config.cut === 'custom') {
      addCustomSupportsToBOM(bomItems, W, H, config);
      if (config.customCuts) {
        numCutsW = config.customCuts.vertical ? config.customCuts.vertical.length : 0;
        numCutsH = config.customCuts.horizontal ? config.customCuts.horizontal.length : 0;
      }
      finalTotalCuts = numCutsW + numCutsH;
    } else {
      const suppLen = config.totalSupportLengthM || ((numCutsW * H + numCutsH * W) / 100);
      if (suppLen > 0) {
        bomItems.push({ name: 'profil support light', qty: parseFloat(suppLen.toFixed(2)), unit: 'mb' });
      }

      const zamki = (numCutsW * 2) + (numCutsH * 2);
      if (zamki > 0) {
        bomItems.push({ name: 'adFrame support zamek', qty: zamki, unit: 'szt' });
      }

      const crossConns = numCutsW * numCutsH;
      if (crossConns > 0) {
        bomItems.push({ name: 'adFrame support 180° łącznik', qty: crossConns * 2, unit: 'szt' });
      }
      finalTotalCuts = numCutsW + numCutsH;
    }

    // ŁĄCZNIKI 180° GŁÓWNEGO PROFILU OBWODOWEGO
    if (finalTotalCuts > 0) {
      bomItems.push({ name: 'adFrame DTF/STF/LMSM łącznik 180°', qty: finalTotalCuts * 2, unit: 'szt' });
    }

    // 🛠️ NOWA LOGIKA MONTAŻOWA DLA SYSTEMU LMSM (BEZ STÓP)
    if (config.usage === 'wall') {
      // 1. Bazowa ilość wieszaków wyznaczana na podstawie wysokości (H)
      let hangerQty = (H <= 150) ? 2 : 4;

      // 2. Korekta o nadwymiar szerokości (W > 150cm) -> +2 szt. na każde rozpoczęte 100cm
      if (W > 150) {
        let extraMeters = Math.ceil((W - 150) / 100);
        hangerQty += 2 * extraMeters;
      }

      // 3. Rygorystyczny bezpiecznik cięć: Obowiązkowo minimum 2 sztuki na każdy odcięty segment profilu górnego
      if (numCutsW > 0) {
        let totalTopSegments = numCutsW + 1;
        let cutRequiredHangers = 2 * totalTopSegments;

        if (hangerQty < cutRequiredHangers) {
          hangerQty = cutRequiredHangers;
        }
      }

      bomItems.push({ name: 'adFrame LMSM wieszak', qty: hangerQty, unit: 'szt' });

    } else if (config.usage === 'suspended') {
      // System podwieszany (Bez zmian)
      let numSuspensionSets = 2;
      if (numCutsW > 0) numSuspensionSets += numCutsW * 2;
      else if (W >= 200) numSuspensionSets += 1;
      bomItems.push({ name: 'adFrame - zestaw do podwieszenia ∅2mm', qty: numSuspensionSets, unit: 'szt' });
    }

    // 6. PODWIESZENIE (ID: 11871)
    if (config.usage === 'suspended') {
      let numSuspensionSets = 2;
      if (numCutsW > 0) numSuspensionSets += numCutsW * 2;
      else if (W >= 200) numSuspensionSets += 1;
      bomItems.push({ name: 'adFrame - zestaw do podwieszenia ∅2mm', qty: numSuspensionSets, unit: 'szt' });
    }

    // ALWAYS-ON ITEMS
    bomItems.push({ name: 'adFrame imbus 2,5mm', qty: 1, unit: 'szt' });
    bomItems.push({ name: 'adFrame imbus 4mm', qty: 1, unit: 'szt' });

    // KARTONY I PIANKI OCHRONNE
    let maxSegmentLen = Math.max(W / (numCutsW + 1), H / (numCutsH + 1));
    let isSplit = false;
    if (maxSegmentLen > 200) { maxSegmentLen = maxSegmentLen / 2; isSplit = true; }
    const requiredCartonLength = maxSegmentLen + 10;
    let cartonName = 'Karton LMD/LMS/DTF - 210x16x33cm';
    if (requiredCartonLength <= 110) cartonName = 'Karton LMD/LMS - 110x16x33cm';
    else if (requiredCartonLength <= 135) cartonName = 'Karton LMD/LMS - 135x16x33cm';
    else if (requiredCartonLength <= 160) cartonName = 'Karton LMD/LMS - 160x16x33cm';

    const totalPieces = 2 * (numCutsW + 1) + 2 * (numCutsH + 1);
    let baseCartons = totalCuts > 4 ? Math.ceil(totalPieces / 8) : 1;
    let finalCartonQty = isSplit ? baseCartons * 2 : baseCartons;
    finalCartonQty = adjustCartonsByWeight(config, finalCartonQty, cartonName);

    bomItems.push({ name: cartonName, qty: finalCartonQty, unit: 'szt' });
    bomItems.push({ name: 'adFrame LMD pianka ochronna', qty: finalCartonQty * 4, unit: 'szt' });
    config.cartonName = cartonName;
    config.cartonQty = finalCartonQty;

    // 7. ZAAWANSOWANY SOLVER WYDRUKÓW (TKANIN) DLA LMSM
    const printOption = config.print || 'single';
    if (printOption !== 'no_print') {
      let qtyStandard = 0;
      let qtyBlockout = 0;

      // 🛠️ FIX: Rozszerzenie warunków o brakujące opcje backlit i białe plecy (LMS)
      if (printOption === 'single' || printOption === 'front_blockout' || printOption === 'front_blockout_2' || printOption === 'backlit_white' || printOption === 'backlit_blockout') {
        qtyStandard = 1; qtyBlockout = 1;
      } else if (printOption === 'double') {
        qtyStandard = 2;
      } else if (printOption === 'back_blockout' || printOption === 'back_white') {
        qtyBlockout = 1;
      }

      const exactSizes = [
        { w: 70, h: 100 }, { w: 70, h: 120 }, { w: 85, h: 200 }, { w: 60, h: 100 }, { w: 80, h: 140 },
        { w: 100, h: 100 }, { w: 100, h: 150 }, { w: 100, h: 200 }, { w: 100, h: 250 }, { w: 100, h: 300 },
        { w: 150, h: 150 }, { w: 150, h: 200 }, { w: 150, h: 250 }, { w: 200, h: 200 }, { w: 200, h: 250 },
        { w: 300, h: 200 }, { w: 300, h: 250 }, { w: 400, h: 200 }, { w: 400, h: 250 }, { w: 500, h: 200 },
        { w: 500, h: 250 }, { w: 600, h: 250 }, { w: 120, h: 200 }, { w: 200, h: 300 }, { w: 200, h: 350 },
        { w: 99.2, h: 248 }, { w: 198.4, h: 248 }, { w: 99.2, h: 24.8 }, { w: 99.2, h: 99.2 }, { w: 297.6, h: 99.2 },
        { w: 99.2, h: 198.4 }, { w: 198.4, h: 297.6 }
      ];

      let matchedSize = exactSizes.find(s => (s.w === W && s.h === H) || (s.w === H && s.h === W));

      if (matchedSize) {
        const sizeName = `${matchedSize.w}x${matchedSize.h}`.replace('.', ',');
        if (qtyStandard > 0) {
          bomItems.push({ name: `Wydruk adFrame LMD/LMS/LMSM ${sizeName}`, qty: qtyStandard, unit: 'szt' });
        }
        if (qtyBlockout > 0) {
          bomItems.push({ name: `Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU ${sizeName}`, qty: qtyBlockout, unit: 'szt' });
        }
      } else {
        let shorterDim = Math.min(W, H);
        let longerDim = Math.max(W, H);

        let mediumType = 'medium250';
        let runningMetersCm = longerDim;

        if (shorterDim <= 250) {
          mediumType = 'medium250';
        } else if (shorterDim <= 320) {
          mediumType = 'medium320';
        } else {
          mediumType = 'medium320';
        }

        let lengthCat = 'pow. 3mb';
        if (runningMetersCm <= 100) lengthCat = 'do 1mb';
        else if (runningMetersCm <= 300) lengthCat = 'do 3mb';

        if (qtyStandard > 0) {
          bomItems.push({ name: `Wydruk adFrame LMD/LMS/LMSM (${lengthCat}/${mediumType})`, qty: qtyStandard, unit: 'szt' });
        }
        if (qtyBlockout > 0) {
          bomItems.push({ name: `Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 3mb/medium250)`, qty: qtyBlockout, unit: 'szt' });
        }
      }
    }

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
        }
      }
    }

    finishKasetonBOM(bomItems, W, H, sys, config);
    return;
  }

  // 1. PROFIL - suma długości boków w metrach (nazwa zależna od systemu)
  if (sys === 'LCD_LMD') {
    const totalLmdMeters = (4 * W + 4 * D) / 100;
    bomItems.push({ name: 'profil LMD odchudzony', qty: parseFloat(totalLmdMeters.toFixed(2)), unit: 'mb' });

    const totalLcdMeters = (4 * H) / 100;
    const qtyVal = parseFloat(totalLcdMeters.toFixed(2));
    bomItems.push({ name: 'adFrame LCD profil przedni z gumką', qty: qtyVal, unit: 'mb' });
    bomItems.push({ name: 'adFrame LCD profil tylny z gumką/bez gumki', qty: qtyVal, unit: 'mb' });
    bomItems.push({ name: 'adFrame LCD profil z gumką środkowy', qty: qtyVal, unit: 'mb' });
  } else {
    const totalProfileMeters = (2 * W + 2 * H) / 100;
    const profileName = sys === 'LMS' ? 'profil LMS' : 'profil LMD odchudzony';
    bomItems.push({ name: profileName, qty: parseFloat(totalProfileMeters.toFixed(2)), unit: 'mb' });
  }

  // 2. NAROŻNIKI (nazwa zależna od systemu)
  if (sys === 'LCD_LMD') {
    bomItems.push({ name: 'adFrame LCD VER2 łącznik', qty: 16, unit: 'szt' });
    bomItems.push({ name: 'adFrame LCD łącznik 90°', qty: 16, unit: 'szt' });
  } else {
    const cornerName = sys === 'LMS' ? 'adFrame LMS narożnik wzmacniany' : 'adFrame LMD narożnik wzmacniany';
    bomItems.push({ name: cornerName, qty: 8, unit: 'szt' });
  }

  // 3. LED STRIPS
  if (isLedSys) {
    const ledOption = config.light || 'power_long';
    const isPower = ledOption.startsWith('power') || sys === 'LCD_LMD';

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
      if (config.cut === 'custom') {
        const supports = isHoriz ? (config.customSupports?.vertical || []) : (config.customSupports?.horizontal || []);
        const positions = supports.map(s => s.pos).sort((a, b) => a - b);
        const segmentLengths = [];
        let currentStart = 5;
        for (let i = 0; i < positions.length; i++) {
          const pos = positions[i];
          const end = pos - 2.5;
          if (end > currentStart + 1) {
            segmentLengths.push(end - currentStart);
          }
          currentStart = pos + 2.5;
        }
        const finalEnd = profileLength - 5;
        if (finalEnd > currentStart + 1) {
          segmentLengths.push(finalEnd - currentStart);
        }
        return segmentLengths;
      }

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
    if (sys === 'LCD_LMD') {
      const isTop = ledOption === 'top_bottom' || ledOption === 'top_only';
      const isBottom = ledOption === 'top_bottom' || ledOption === 'bottom_only';

      let numW = 0;
      let numD = 0;
      if (isTop) {
        numW += 2;
        numD += 2;
      }
      if (isBottom) {
        numW += 2;
        numD += 2;
      }

      function countLcdProfileLeds(profLen, count) {
        if (count <= 0) return;
        const sideMargin = 14;
        const sortedCuts = [];
        const isW = profLen === W;
        
        let n = 1;
        if (isW) {
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
        if (config.cut && config.cut.startsWith('auto')) {
          const ml = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200);
          if (profLen > ml) n = Math.ceil(profLen / ml);
        }

        if (config.cut === 'custom') {
          const cuts = isW ? (config.customCuts?.vertical || []) : (config.customCuts?.horizontal || []);
          cuts.map(c => c.pos).forEach(p => {
            if (p > sideMargin && p < profLen - sideMargin) sortedCuts.push(p);
          });
        } else {
          for (let i = 1; i < n; i++) {
            const p = (profLen / n) * i;
            if (p > sideMargin && p < profLen - sideMargin) sortedCuts.push(p);
          }
        }
        sortedCuts.sort((a, b) => a - b);

        const segments = [];
        let currentStart = sideMargin;
        for (let i = 0; i < sortedCuts.length; i++) {
          const p = sortedCuts[i];
          const end = p - 2.5;
          if (end > currentStart + 1) {
            segments.push(end - currentStart);
          }
          currentStart = p + 2.5;
        }
        const finalEnd = profLen - sideMargin;
        if (finalEnd > currentStart + 1) {
          segments.push(finalEnd - currentStart);
        }

        segments.forEach(segLen => {
          bomLedCombo(segLen).forEach(size => {
            ledCounts[size] += count;
          });
        });
      }

      countLcdProfileLeds(W, numW);
      countLcdProfileLeds(D, numD);
    } else {
      function countProfile(profLen, isHoriz) {
        bomSegments(profLen, isHoriz).forEach(segLen => {
          bomLedCombo(segLen).forEach(size => { ledCounts[size]++; });
        });
      }
      if (drawBottom) countProfile(W, true);
      if (drawTop) countProfile(W, true);
      if (drawLeft) countProfile(H, false);
      if (drawRight) countProfile(H, false);
    }

    [50, 30, 24, 20].forEach(size => {
      if (ledCounts[size] > 0) {
        bomItems.push({ name: nameMap[size], qty: ledCounts[size], unit: 'szt' });
      }
    });

    // Calculate total LED power and save to config.totalPowerW
    let totalPowerW = 0;
    const wattMap = isPower ? { 20: 9, 24: 11, 30: 13, 50: 22 } : { 20: 6.5, 24: 8, 30: 10, 50: 16 };
    [20, 24, 30, 50].forEach(size => {
      totalPowerW += ledCounts[size] * wattMap[size];
    });
    config.totalPowerW = totalPowerW;

    // Solve PSU combination for LCD_LMD
    if (sys === 'LCD_LMD') {
      let psuType = config.power || 'internal';
      const ledOption = config.light || 'top_bottom';
      if (ledOption.includes('around')) psuType = 'external';

      const reqPower = totalPowerW * 1.1;
      const intPSUs = [
        { name: 'Zasilacz wewnętrzny 75W 24V', w: 75 },
        { name: 'Zasilacz wewnętrzny 100W 24V', w: 100 },
        { name: 'Zasilacz wewnętrzny 150W 24V', w: 150 },
        { name: 'Zasilacz wewnętrzny 200W 24V', w: 200 },
        { name: 'Zasilacz wewnętrzny 240W 24V', w: 240 }
      ];
      const extPSUs = [
        { name: 'Zasilacz zewnętrzny 120W 24V', w: 120 },
        { name: 'Zasilacz zewnętrzny 160W 24V', w: 160 },
        { name: 'Zasilacz zewnętrzny 220W 24V', w: 220 },
        { name: 'Zasilacz zewnętrzny 300W 24V', w: 300 },
        { name: 'Zasilacz zewnętrzny 360W 24V', w: 360 }
      ];
      const list = psuType === 'external' ? extPSUs : intPSUs;

      let candidates = [];
      list.forEach(psu => {
        let count = 1;
        if (psu.w < reqPower) {
          count = Math.ceil(reqPower / psu.w);
          if (count % 2 !== 0) {
            count++;
          }
        }
        candidates.push({
          psu: psu,
          count: count,
          totalW: count * psu.w
        });
      });

      candidates.sort((a, b) => {
        if (a.count !== b.count) {
          return a.count - b.count;
        }
        return a.totalW - b.totalW;
      });

      let bestCombo = [];
      if (candidates.length > 0) {
        const best = candidates[0];
        for (let i = 0; i < best.count; i++) {
          bestCombo.push(best.psu.name);
        }
      }
      config.psuCombo = bestCombo;
    }

    // --- target systems check: LMD, LMS, LMSM, LCD_LMD ---
    const isTargetLedSys = ['LMD', 'LMS', 'LMSM', 'LCD_LMD'].includes(sys);
    if (isTargetLedSys) {
      // 1. Connection with armed profiles (each vertical support has 2 ends; each horizontal has 2 ends)
      let cutsW = config.numCutsW || 0;
      let cutsH = config.numCutsH || 0;
      if (config.cut === 'custom' && config.customSupports) {
        cutsW = config.customSupports.vertical ? config.customSupports.vertical.length : 0;
        cutsH = config.customSupports.horizontal ? config.customSupports.horizontal.length : 0;
      }
      let totalConn = 0;
      if (drawTop) totalConn += cutsW;
      if (drawBottom) totalConn += cutsW;
      if (drawLeft) totalConn += cutsH;
      if (drawRight) totalConn += cutsH;

      if (totalConn > 0) {
        bomItems.push({ name: 'złączka LED - Jack 3,5mm 10cm męski', qty: totalConn, unit: 'szt' });
        bomItems.push({ name: 'złączka LED - Jack 3,5mm 10cm żeński', qty: totalConn, unit: 'szt' });
      }

      // 2. Opposite armed profiles only (exactly 2 out of 4)
      const isOppositeArmed = (drawTop && drawBottom && !drawLeft && !drawRight) || (drawLeft && drawRight && !drawTop && !drawBottom);
      if (isOppositeArmed) {
        const unarmedLen = (drawTop && drawBottom) ? H : W;
        const targetLen = unarmedLen - 38;
        const remainingLen = targetLen - 50;

        // Add 50cm female connector
        bomItems.push({ name: 'złączka LED - Jack 3,5mm 50cm żeński', qty: 1, unit: 'szt' });

        // Add extensions if remaining length is positive
        if (remainingLen > 0) {
          function getExtensionsForLength(len) {
            if (len <= 0) return [];
            const sizes = [100, 150, 200];
            let bestCombo = null;
            let bestSum = Infinity;

            function search(currentCombo, currentSum) {
              if (currentSum >= len) {
                if (currentSum < bestSum || (currentSum === bestSum && currentCombo.length < bestCombo.length)) {
                  bestSum = currentSum;
                  bestCombo = [...currentCombo];
                }
                return;
              }
              if (currentSum >= len + 200) return;

              for (let size of sizes) {
                currentCombo.push(size);
                search(currentCombo, currentSum + size);
                currentCombo.pop();
              }
            }
            search([], 0);
            return bestCombo || [];
          }

          const extCombo = getExtensionsForLength(remainingLen);
          const extCounts = { 100: 0, 150: 0, 200: 0 };
          extCombo.forEach(size => { extCounts[size]++; });

          if (extCounts[100] > 0) {
            bomItems.push({ name: 'złączka LED - przedłużka Jack 3,5mm 100cm', qty: extCounts[100], unit: 'szt' });
          }
          if (extCounts[150] > 0) {
            bomItems.push({ name: 'złączka LED - przedłużka Jack 3,5mm 150cm', qty: extCounts[150], unit: 'szt' });
          }
          if (extCounts[200] > 0) {
            bomItems.push({ name: 'złączka LED - przedłużka Jack 3,5mm 200cm', qty: extCounts[200], unit: 'szt' });
          }
        }

      }
    }
  }

  if (config.psuCombo && config.psuCombo.length > 0) {
    const psuCounts = {};
    config.psuCombo.forEach(p => { psuCounts[p] = (psuCounts[p] || 0) + 1; });
    for (let p in psuCounts) {
      bomItems.push({ name: p, qty: psuCounts[p], unit: 'szt' });
    }
  }

  // 4b. DYNAMICZNA LOGIKA DOBORU KABLI ZASILAJĄCYCH (ID: 17392)
  if (['LMD', 'LMS', 'LMSM', 'LCD_LMD'].includes(sys)) {
    const psuCount = config.psuCombo ? config.psuCombo.length : 0;
    const psuType = config.power || 'internal'; // Fallback do zasilacza wewnętrznego

    // Bezpiecznik: logika wykonuje się TYLKO, gdy zasilacz NIE JEST zewnętrzny
    if (psuCount > 0 && psuType !== 'external') {
      const ledOption = config.light || 'power_around';
      const drawHorizontal = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
      const drawVertical = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));

      // Wyznaczenie najdłuższego profilu, na którym fizycznie montowane są taśmy LED
      let maxLedProfileLen = 0;
      if (drawHorizontal) maxLedProfileLen = Math.max(maxLedProfileLen, W);
      if (drawVertical) maxLedProfileLen = Math.max(maxLedProfileLen, H);

      let cableQty = 0;
      if (psuCount === 1) {
        cableQty = 1;
      } else if (psuCount > 1) {
        if (maxLedProfileLen < 400) {
          cableQty = 1;
        } else {
          cableQty = 2;
        }
      }

      if (cableQty > 0) {
        bomItems.push({ name: 'Kabel zasilający do zasilacza wew / adFrame Quick', qty: cableQty, unit: 'szt' });
      }
    }
  }
  // 5. SUPPORTY I ŁĄCZNIKI
  let numCutsW = 0;
  let numCutsH = 0;
  let totalCuts = 0;
  if (config.cut === 'custom') {
    addCustomSupportsToBOM(bomItems, W, H, config);
    if (config.customCuts) {
      numCutsW = config.customCuts.vertical ? config.customCuts.vertical.length : 0;
      numCutsH = config.customCuts.horizontal ? config.customCuts.horizontal.length : 0;
    }
    totalCuts = numCutsW + numCutsH;
  } else {
    numCutsW = config.numCutsW || 0;
    numCutsH = config.numCutsH || 0;
    const suppLen = config.totalSupportLengthM || 0;

    if (suppLen > 0) {
      bomItems.push({ name: 'profil support light', qty: parseFloat(suppLen.toFixed(2)), unit: 'mb' });
    }

    const zamki = (numCutsW * 2) + (numCutsH * 2);
    if (zamki > 0) {
      bomItems.push({ name: 'adFrame support zamek', qty: zamki, unit: 'szt' });
    }

    const crossConns = numCutsW * numCutsH;
    if (crossConns > 0) {
      bomItems.push({ name: 'adFrame support 180° łącznik', qty: crossConns * 2, unit: 'szt' });
    }
    totalCuts = numCutsW + numCutsH;
  }

  if (totalCuts > 0) {
    bomItems.push({ name: 'adFrame LMD łącznik 180° długi', qty: totalCuts * 2, unit: 'szt' });
  }

  if (config.usage === 'freestanding') {
    let numFeet = 2;
    if (numCutsW > 0 && config.cut !== 'custom') {
      numFeet += numCutsW;
    } else if (W >= 200) {
      numFeet += 1;
    }
    bomItems.push({ name: 'adFrame stopa LMD/LMS', qty: numFeet, unit: 'szt' });
  }

  // 6b. PODWIESZENIE
  if (config.usage === 'suspended' && config.numSuspensionSets > 0) {
    bomItems.push({ name: 'adFrame - zestaw do podwieszenia ∅2mm', qty: config.numSuspensionSets, unit: 'szt' });
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

  let finalCartonQty = isSplit ? baseCartons * 2 : baseCartons;
  finalCartonQty = adjustCartonsByWeight(config, finalCartonQty, cartonName);
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
  if (sys === 'CTF' || sys === 'CTF_LED') {
    if (Array.isArray(window.lastGeneratedBOM)) {
      // Krok A: Usuwamy pozycję składową "adFrame CTF" (18337), aby nie dublowała się jako dziecko
      let filteredBOM = window.lastGeneratedBOM.filter(function (item) {
        return item.intranetId !== 18337 && item.name !== "adFrame CTF";
      });

      // Krok B: Przekształcamy indeks nadrzędny 12160 na właściwe ID 18337
      window.lastGeneratedBOM = filteredBOM.map(function (item) {
        if (item.intranetId === 12160 || item.name === "adFrame CTF (bez wydruku)") {
          return {
            ...item,
            name: "adFrame CTF",
            intranetId: 18337
          };
        }
        return item;
      });
    }
  }
}

// 9. DATABASE & CURRENCY LOGIC
const KASETON_PRICES = {
  "malowanie proszkowe": { plnPrice: 40.0, plnMargin: 14.28, intranetId: 11906, category: "usługi", origin: "Polska" },
  "Plafon LED 30x30": { plnPrice: 150, plnMargin: 50, intranetId: 18957, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "profil LMSM poziomy (ALU-060-SLIM)": { plnPrice: 120, plnMargin: 40, intranetId: 10936, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "profil LMSM pionowy (ALU-060-SLIM)": { plnPrice: 120, plnMargin: 40, intranetId: 10936, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Łącznik narożny wsuwany L-Slim (SL-06)": { plnPrice: 15, plnMargin: 5, intranetId: 17452, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "Mikro-keder silikonowy 9x2mm (KEDER-9X2)": { plnPrice: 5, plnMargin: 2, intranetId: 16194, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Taśma LED obwodowa high-density (LED-SLIM-24V)": { plnPrice: 45, plnMargin: 15, intranetId: 18979, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "PSU-SLIM-60W Zasilacz impulsowy wąskoprofilowy IP20": { plnPrice: 85, plnMargin: 30, intranetId: 14812, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "PSU-SLIM-150W Zasilacz impulsowy wąskoprofilowy IP20": { plnPrice: 125, plnMargin: 45, intranetId: 14812, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "PSU-SLIM-240W Zasilacz impulsowy wąskoprofilowy IP20": { plnPrice: 185, plnMargin: 65, intranetId: 14812, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Karton BOX-SLIM (65x10x10cm)": { plnPrice: 25, plnMargin: 10, intranetId: 14835, category: "półprodukty", origin: "Polska" },
  "adFloor": { plnPrice: 1858.584, plnMargin: 663.78, intranetId: 15376, category: "adfloor", origin: "Polska" },
  "adFloor maskownica narożna lewa": { plnPrice: 254.66, plnMargin: 90.95, intranetId: 16154, category: "adfloor akcesoria", origin: "Polska" },
  "adFloor maskownica narożna prawa": { plnPrice: 254.66, plnMargin: 90.95, intranetId: 16155, category: "adfloor akcesoria", origin: "Polska" },
  "adFloor Oświetelenie LED RGB": { plnPrice: 1762.684, plnMargin: 629.53, intranetId: 15440, category: "adfloor akcesoria", origin: "Polska" },
  "adFloor profil panelowy": { plnPrice: 72.996, plnMargin: 26.07, intranetId: 15377, category: "adfloor akcesoria", origin: "Chiny" },
  "adFloor profil wzmocnienie": { plnPrice: 80.864, plnMargin: 28.88, intranetId: 15378, category: "adfloor akcesoria", origin: "Chiny" },
  "adFloor płyta 997x997mm, grubość 12mm": { plnPrice: 194.376, plnMargin: 69.42, intranetId: 15392, category: "adfloor akcesoria", origin: "Polska" },
  "adFloor łącznik profili": { plnPrice: 61.74, plnMargin: 22.05, intranetId: 15379, category: "adfloor akcesoria", origin: "Chiny" },
  "adGate Air Square 6,5m": { plnPrice: 4608.016, plnMargin: 1645.72, intranetId: 18732, category: "bramy pneumatyczne", origin: "Polska" },
  "adGate Air Triangle 6,5m ver2": { plnPrice: 4208.624, plnMargin: 1503.08, intranetId: 16821, category: "bramy pneumatyczne", origin: "Polska" },
  "adGate Round": { plnPrice: 4733.176, plnMargin: 1690.42, intranetId: 18730, category: "bramy pneumatyczne", origin: "Polska" },
  "Śruba M5/30mm": { plnPrice: 0.056, plnMargin: 0.02, intranetId: 17650, category: "classic", origin: "Chiny" },
  "CZ - adTribune Expo 100x100 kurtynka": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19623, category: "części zamienne", origin: "NULL" },
  "CZ - adTribune Expo 100x100 torba": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19624, category: "części zamienne", origin: "NULL" },
  "CZ - adTribune Expo 150x100 podpora pod półkę": { plnPrice: 0, plnMargin: 0, intranetId: 19811, category: "części zamienne", origin: "NULL" },
  "CZ - adWall Vario Presto Light stopa": { plnPrice: 61.74, plnMargin: 22.05, intranetId: 19155, category: "części zamienne", origin: "Polska" },
  "CZ - adWall Vario Presto Light łuk": { plnPrice: 20.216, plnMargin: 7.22, intranetId: 19157, category: "części zamienne", origin: "Polska" },
  "CZ - adWall Vario Prosta/Łukowa Light stopa (mocowane na środku)": { plnPrice: 0, plnMargin: 0, intranetId: 19844, category: "części zamienne", origin: "NULL" },
  "adVideo InfoKiosk 55 with flight case": { plnPrice: 9777.404, plnMargin: 3491.93, intranetId: 19010, category: "digital", origin: "Polska" },
  "adVideo InfoKiosk 55`": { plnPrice: 6132.868, plnMargin: 2190.31, intranetId: 18669, category: "digital", origin: "Polska" },
  "adVideo InfoKiosk 65 ver2.0": { plnPrice: 10837.708, plnMargin: 3870.61, intranetId: 19027, category: "digital", origin: "Polska" },
  "adVideo InfoKiosk 65` ver2.0 with flight case": { plnPrice: 15458.94, plnMargin: 5521.05, intranetId: 19029, category: "digital", origin: "Polska" },
  "adVideo Kiosk 49` RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17612, category: "digital", origin: "Polska" },
  "adVideo Poster LED Screen": { plnPrice: 23342.732, plnMargin: 8336.69, intranetId: 18868, category: "digital", origin: "Polska" },
  "adVideo Poster TriFold [P1.86]": { plnPrice: 26142.704, plnMargin: 9336.68, intranetId: 19634, category: "digital", origin: "NULL" },
  "adVideo Poster TriFold [P2.5]": { plnPrice: 23325.792, plnMargin: 8330.64, intranetId: 19644, category: "digital", origin: "NULL" },
  "adVideo Stand 32`": { plnPrice: 4818.296, plnMargin: 1720.82, intranetId: 17903, category: "digital", origin: "Chiny" },
  "adVideo Stand 32` RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19304, category: "digital", origin: "Polska" },
  "VideoWall": { plnPrice: 78129.128, plnMargin: 27903.26, intranetId: 15393, category: "digital", origin: "Polska" },
  "VideoWall 3x3": { plnPrice: 31655.568, plnMargin: 11305.56, intranetId: 16140, category: "digital", origin: "Polska" },
  "adFlag BLADE L": { plnPrice: 167.692, plnMargin: 59.89, intranetId: 15631, category: "flagi", origin: "Polska" },
  "adFlag BLADE M": { plnPrice: 130.396, plnMargin: 46.57, intranetId: 15630, category: "flagi", origin: "Polska" },
  "adFlag BLADE PRO L": { plnPrice: 225.204, plnMargin: 80.43, intranetId: 15635, category: "flagi", origin: "Polska" },
  "adFlag BLADE PRO M": { plnPrice: 186.732, plnMargin: 66.69, intranetId: 15634, category: "flagi", origin: "Polska" },
  "adFlag BLADE PRO S": { plnPrice: 144.2, plnMargin: 51.5, intranetId: 15633, category: "flagi", origin: "Polska" },
  "adFlag BLADE PRO XL": { plnPrice: 273.616, plnMargin: 97.72, intranetId: 15636, category: "flagi", origin: "Polska" },
  "adFlag BLADE S": { plnPrice: 110.348, plnMargin: 39.41, intranetId: 15629, category: "flagi", origin: "Polska" },
  "adFlag BLADE XL": { plnPrice: 193.312, plnMargin: 69.04, intranetId: 15632, category: "flagi", origin: "Polska" },
  "adFlag DROP L": { plnPrice: 162.512, plnMargin: 58.04, intranetId: 15656, category: "flagi", origin: "Polska" },
  "adFlag DROP M": { plnPrice: 127.82, plnMargin: 45.65, intranetId: 15655, category: "flagi", origin: "Polska" },
  "adFlag DROP PRO L": { plnPrice: 220.024, plnMargin: 78.58, intranetId: 15660, category: "flagi", origin: "Polska" },
  "adFlag DROP PRO M": { plnPrice: 184.128, plnMargin: 65.76, intranetId: 15659, category: "flagi", origin: "Polska" },
  "adFlag DROP PRO S": { plnPrice: 141.652, plnMargin: 50.59, intranetId: 15658, category: "flagi", origin: "Polska" },
  "adFlag DROP S": { plnPrice: 107.8, plnMargin: 38.5, intranetId: 15654, category: "flagi", origin: "Polska" },
  "adFlag HOOK L": { plnPrice: 167.692, plnMargin: 59.89, intranetId: 15648, category: "flagi", origin: "Polska" },
  "adFlag HOOK M": { plnPrice: 130.396, plnMargin: 46.57, intranetId: 15647, category: "flagi", origin: "Polska" },
  "adFlag HOOK PRO L": { plnPrice: 225.204, plnMargin: 80.43, intranetId: 15652, category: "flagi", origin: "Polska" },
  "adFlag HOOK PRO M": { plnPrice: 186.732, plnMargin: 66.69, intranetId: 15651, category: "flagi", origin: "Polska" },
  "adFlag HOOK PRO S": { plnPrice: 144.2, plnMargin: 51.5, intranetId: 15650, category: "flagi", origin: "Polska" },
  "adFlag HOOK PRO XL": { plnPrice: 273.616, plnMargin: 97.72, intranetId: 15653, category: "flagi", origin: "Polska" },
  "adFlag HOOK S": { plnPrice: 110.348, plnMargin: 39.41, intranetId: 15646, category: "flagi", origin: "Polska" },
  "adFlag HOOK XL": { plnPrice: 193.312, plnMargin: 69.04, intranetId: 15649, category: "flagi", origin: "Polska" },
  "adFlag L (bez wydruku)": { plnPrice: 104.86, plnMargin: 37.45, intranetId: 15678, category: "flagi", origin: "Polska" },
  "adFlag M (bez wydruku)": { plnPrice: 85.988, plnMargin: 30.71, intranetId: 15679, category: "flagi", origin: "Polska" },
  "adFlag PRO S (bez wydruku)": { plnPrice: 99.764, plnMargin: 35.63, intranetId: 15683, category: "flagi", origin: "Polska" },
  "adFlag PRO XL (bez wydruku)": { plnPrice: 191.184, plnMargin: 68.28, intranetId: 15685, category: "flagi", origin: "Polska" },
  "adFlag S (bez wydruku)": { plnPrice: 68.516, plnMargin: 24.47, intranetId: 15680, category: "flagi", origin: "Polska" },
  "adFlag STANDARD L": { plnPrice: 166.404, plnMargin: 59.43, intranetId: 15640, category: "flagi", origin: "Polska" },
  "adFlag STANDARD M": { plnPrice: 130.396, plnMargin: 46.57, intranetId: 15639, category: "flagi", origin: "Polska" },
  "adFlag STANDARD PRO L": { plnPrice: 223.972, plnMargin: 79.99, intranetId: 15644, category: "flagi", origin: "Polska" },
  "adFlag STANDARD PRO M": { plnPrice: 186.732, plnMargin: 66.69, intranetId: 15643, category: "flagi", origin: "Polska" },
  "adFlag STANDARD PRO S": { plnPrice: 141.652, plnMargin: 50.59, intranetId: 15642, category: "flagi", origin: "Polska" },
  "adFlag STANDARD PRO XL": { plnPrice: 273.616, plnMargin: 97.72, intranetId: 15645, category: "flagi", origin: "Polska" },
  "adFlag STANDARD S": { plnPrice: 107.8, plnMargin: 38.5, intranetId: 15638, category: "flagi", origin: "Polska" },
  "adFlag STANDARD XL": { plnPrice: 193.312, plnMargin: 69.04, intranetId: 15641, category: "flagi", origin: "Polska" },
  "adFlag XL (bez wydruku)": { plnPrice: 114.436, plnMargin: 40.87, intranetId: 15681, category: "flagi", origin: "Polska" },
  "SET1 - Zestaw targowy Sego LED": { plnPrice: 14230.048, plnMargin: 5082.16, intranetId: 18060, category: "frames", origin: "Polska" },
  "SET4 - Zestaw targowy Standard DTF": { plnPrice: 6186.684, plnMargin: 2209.53, intranetId: 18055, category: "frames", origin: "Polska" },
  "adWall Vario Prosta Black 600 (bez wydruku)": { plnPrice: 460.404, plnMargin: 164.43, intranetId: 19435, category: "frames light", origin: "Polska" },
  "SEGO Bridge handle for HP": { plnPrice: 5.6, plnMargin: 2, intranetId: 13542, category: "frames light", origin: "Polska" },
  "HDWR-adFolder A4 (bez wydruku)": { plnPrice: 526.064, plnMargin: 187.88, intranetId: 19383, category: "hardware", origin: "Polska" },
  "HDWR-adFrame Slim 100x200 - 65mm (bez wydruku)": { plnPrice: 797.3, plnMargin: 284.75, intranetId: 19406, category: "hardware", origin: "Polska" },
  "HDWR-adStand Basic 85 (bez wydruku)": { plnPrice: 93.016, plnMargin: 33.22, intranetId: 19436, category: "hardware", origin: "Polska" },
  "HDWR-Adstand Drop - 100 (bez wydruku)": { plnPrice: 276.444, plnMargin: 98.73, intranetId: 19370, category: "hardware", origin: "Polska" },
  "HDWR-adStand Eco 100 (bez wydruku)": { plnPrice: 144.648, plnMargin: 51.66, intranetId: 19376, category: "hardware", origin: "Polska" },
  "HDWR-adStand Lux 100 (bez wydruku)": { plnPrice: 213.892, plnMargin: 76.39, intranetId: 19372, category: "hardware", origin: "Polska" },
  "HDWR-adStand Octa 100 (bez wydruku)": { plnPrice: 276.192, plnMargin: 98.64, intranetId: 19378, category: "hardware", origin: "Polska" },
  "HDWR-adStand R3 Black 100 (bez wydruku)": { plnPrice: 119.196, plnMargin: 42.57, intranetId: 19379, category: "hardware", origin: "Polska" },
  "HDWR-adStand R3 Black 85 (bez wydruku)": { plnPrice: 93.996, plnMargin: 33.57, intranetId: 19380, category: "hardware", origin: "Polska" },
  "HDWR-adStand R3 White 100 (bez wydruku)": { plnPrice: 95.508, plnMargin: 34.11, intranetId: 19381, category: "hardware", origin: "Polska" },
  "HDWR-adStand R3 White 85 (bez wydruku)": { plnPrice: 80.864, plnMargin: 28.88, intranetId: 19382, category: "hardware", origin: "Polska" },
  "HDWR-adTent EXPRESS 3x4,5m (bez wydruku)": { plnPrice: 3090.948, plnMargin: 1103.91, intranetId: 19419, category: "hardware", origin: "Polska" },
  "HDWR-adTent EXPRESS 3x6m (bez wydruku)": { plnPrice: 1732.472, plnMargin: 618.74, intranetId: 19420, category: "hardware", origin: "Polska" },
  "HDWR-adTribune PVC Oval (bez wydruku)": { plnPrice: 138.14, plnMargin: 121.47, intranetId: 19287, category: "hardware", origin: "Polska" },
  "HDWR-adWall Vario Prosta Black 240 (bez wydruku)": { plnPrice: 291.984, plnMargin: 104.28, intranetId: 19276, category: "hardware", origin: "Polska" },
  "Lumina RGB 300x250 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18938, category: "inne", origin: "Polska" },
  "POKAZÓWKA_adFrame Quick Safe Case BLACK 100x200 (bez wydruku)": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19302, category: "inne", origin: "Polska" },
  "POKAZÓWKA_adVideo Poster LED Screen": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19322, category: "inne", origin: "Polska" },
  "POKAZÓWKA_handel.pl_Pop-up Lightbox 100x200": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17875, category: "inne", origin: "Polska" },
  "POKAZÓWKA_Lumina RGB 300x250 dwustronny": { plnPrice: 0, plnMargin: 0, intranetId: 18569, category: "inne", origin: "Polska" },
  "SAMPLE_adTribune Flex Expo (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19289, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna cięcie Piła [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 13487, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna krojenie [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 10808, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna montaż Classic [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 10794, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna montaż Kasetony [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 11450, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna montaż Vario [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 10236, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna montaż Zabudowy [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 11480, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna szycie [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 10809, category: "inne", origin: "Polska" },
  "Usługa wewnętrzna Wysyłka Zabudowy [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 18674, category: "inne", origin: "Polska" },
  "Weryfikacja reklamacji Vario o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18319, category: "inne", origin: "Polska" },
  "Weryfikacja zwrotu Vario o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18163, category: "inne", origin: "Polska" },
  "Wykonanie otworów pod półkę mframe/SEGO": { plnPrice: 50, plnMargin: 0, intranetId: 18176, category: "inne", origin: "Polska" },
  "Śruba imbusowa dociskowa M5": { plnPrice: 0.08, plnMargin: 0, intranetId: 16489, category: "inne", origin: "Chiny" },
  "adDeck personalizowany": { plnPrice: 174.524, plnMargin: 62.33, intranetId: 13773, category: "leżaki reklamowe", origin: "Polska" },
  "Leżak - stelaż": { plnPrice: 145.376, plnMargin: 51.92, intranetId: 12490, category: "leżaki reklamowe", origin: "Polska" },
  "Leżak zestaw montażowy (plastiki, śruby, instrukcja)": { plnPrice: 1.67, plnMargin: 0, intranetId: 15769, category: "leżaki reklamowe", origin: "Polska" },
  "adBeanbag": { plnPrice: 464.156, plnMargin: 165.77, intranetId: 10580, category: "meble reklamowe", origin: "Polska" },
  "adChair inflate": { plnPrice: 378.364, plnMargin: 135.13, intranetId: 19096, category: "meble reklamowe", origin: "Polska" },
  "adChair inflate (bez wydruku)": { plnPrice: 198.772, plnMargin: 70.99, intranetId: 18832, category: "meble reklamowe", origin: "Polska" },
  "adFoam Cube": { plnPrice: 297.024, plnMargin: 106.08, intranetId: 10577, category: "meble reklamowe", origin: "Polska" },
  "adFoam Cube (bez wydruku)": { plnPrice: 238.448, plnMargin: 85.16, intranetId: 11817, category: "meble reklamowe", origin: "Polska" },
  "adFoam Forma": { plnPrice: 1707.888, plnMargin: 609.96, intranetId: 10573, category: "meble reklamowe", origin: "Polska" },
  "adFoam Roller": { plnPrice: 3104.64, plnMargin: 1108.8, intranetId: 11831, category: "meble reklamowe", origin: "Polska" },
  "adFoam Roller Mini": { plnPrice: 418.88, plnMargin: 149.6, intranetId: 10579, category: "meble reklamowe", origin: "Polska" },
  "adFoam Via": { plnPrice: 1836.436, plnMargin: 655.87, intranetId: 11374, category: "meble reklamowe", origin: "Polska" },
  "adPuff inflate": { plnPrice: 235.592, plnMargin: 84.14, intranetId: 19090, category: "meble reklamowe", origin: "Polska" },
  "adSacco": { plnPrice: 393.904, plnMargin: 140.68, intranetId: 10581, category: "meble reklamowe", origin: "Polska" },
  "Medium Tex Blockout": { plnPrice: 80.472, plnMargin: 28.74, intranetId: 10877, category: "media do druku", origin: "Polska" },
  "Medium Tex Kaseton LED": { plnPrice: 63.056, plnMargin: 22.52, intranetId: 10814, category: "media do druku", origin: "Polska" },
  "Medium Tex Kaseton LED 220": { plnPrice: 57.148, plnMargin: 20.41, intranetId: 18729, category: "media do druku", origin: "Polska" },
  "Medium Tex Premium 250cm": { plnPrice: 78.064, plnMargin: 27.88, intranetId: 10893, category: "media do druku", origin: "Polska" },
  "Medium Tex SEG": { plnPrice: 60.788, plnMargin: 21.71, intranetId: 17784, category: "media do druku", origin: "Polska" },
  "Medium Tex Vario": { plnPrice: 78.12, plnMargin: 27.9, intranetId: 10811, category: "media do druku", origin: "Polska" },
  "SET2 - Zestaw konferencyjny Economic Vario": { plnPrice: 3122.504, plnMargin: 1115.18, intranetId: 18097, category: "modern", origin: "Polska" },
  "SET4 - Zestaw do promocji Economic Vario": { plnPrice: 1378.16, plnMargin: 492.2, intranetId: 18099, category: "modern", origin: "Polska" },
  "Worek na wydruki S (45*55cm)": { plnPrice: 0.56, plnMargin: 0.2, intranetId: 12430, category: "modern", origin: "Polska" },
  "adWall Vario Łukowa Light 600 SOFT BAG (bez wydruku)": { plnPrice: 990.136, plnMargin: 353.62, intranetId: 17578, category: "modern light", origin: "3" },
  "Boliwia PP białe siedzisko RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17467, category: "modular", origin: "Polska" },
  "Boliwia PP czarne siedzisko RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17769, category: "modular", origin: "Polska" },
  "butla dmuchana - GYEON": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18883, category: "modular", origin: "Polska" },
  "czajnik RENTAL": { plnPrice: 164.752, plnMargin: 58.84, intranetId: 17742, category: "modular", origin: "Polska" },
  "GŁOŚNIK RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17497, category: "modular", origin: "Polska" },
  "Hoker Boliwia czarne siedzisko/czarne nogi komplet": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17770, category: "modular", origin: "Polska" },
  "mFrame PROFIL ŁUK 1165 R1488": { plnPrice: 235.844, plnMargin: 84.23, intranetId: 18854, category: "modular", origin: "Polska" },
  "Multiframe akcesoria klamra zamka": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17518, category: "modular", origin: "Polska" },
  "Multiframe akcesoria trzpień profila dolnego": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 17515, category: "modular", origin: "Polska" },
  "Multiframe akcesoria tuleja zamka": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17517, category: "modular", origin: "Polska" },
  "Stół Capri 80cm biały komplet RENTAL": { plnPrice: 6.076, plnMargin: 2.17, intranetId: 17635, category: "modular", origin: "Polska" },
  "Stół Capri 80cm blat biały RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16379, category: "modular", origin: "Polska" },
  "VideoWall MASTER HUB VX4x15 HDMI RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17667, category: "modular", origin: "Polska" },
  "VideoWall PANEL ver3 P1.93": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 17826, category: "modular", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x148,8cm": { plnPrice: 168, plnMargin: 60, intranetId: 17597, category: "modular", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x99,2cm": { plnPrice: 0, plnMargin: 0, intranetId: 19244, category: "modular", origin: "Polska" },
  "zabudowa - double deck": { plnPrice: 62347.628, plnMargin: 22267.01, intranetId: 18139, category: "modular", origin: "Polska" },
  "zabudowa - PRESTIGE BEATA": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19315, category: "modular", origin: "Polska" },
  "zabudowa - vitasynth": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17628, category: "modular", origin: "Polska" },
  "złączka LED - Jack 3,5mm 10cm żeński": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17480, category: "modular", origin: "Polska" },
  "adTent Air premium - zestaw MARKIZA 4X4": { plnPrice: 1936.2, plnMargin: 691.5, intranetId: 15529, category: "namioty", origin: "Polska" },
  "adTent Air premium 1x1 SET": { plnPrice: 1300.32, plnMargin: 464.4, intranetId: 18503, category: "namioty", origin: "Polska" },
  "adTent Air premium 3x3 (bez wydruku)": { plnPrice: 3777.788, plnMargin: 1349.21, intranetId: 13559, category: "namioty", origin: "Chiny" },
  "adTent Air premium 3x3 (stelaż+dach)": { plnPrice: 4745.496, plnMargin: 1694.82, intranetId: 14002, category: "namioty", origin: "Polska" },
  "adTent Air premium 4x4 (bez wydruku)": { plnPrice: 4679.612, plnMargin: 1671.29, intranetId: 13560, category: "namioty", origin: "Chiny" },
  "adTent Air premium 4x4 (stelaż+dach)": { plnPrice: 5744.76, plnMargin: 2051.7, intranetId: 14009, category: "namioty", origin: "Polska" },
  "adTent Air premium 4x6 (stelaż+dach)": { plnPrice: 6831.216, plnMargin: 2439.72, intranetId: 18798, category: "namioty", origin: "Polska" },
  "adTent Air premium 5x5 (bez wydruku)": { plnPrice: 6523.552, plnMargin: 2329.84, intranetId: 13561, category: "namioty", origin: "Chiny" },
  "adTent Air premium 5x5 (stelaż+dach)": { plnPrice: 8107.148, plnMargin: 2895.41, intranetId: 14010, category: "namioty", origin: "Polska" },
  "adTent Air premium 6x6 (bez wydruku)": { plnPrice: 7619.612, plnMargin: 2721.29, intranetId: 13562, category: "namioty", origin: "Chiny" },
  "adTent Air premium 6x6 (stelaż+dach)": { plnPrice: 9652.272, plnMargin: 3447.24, intranetId: 14011, category: "namioty", origin: "Polska" },
  "adTent Air premium Automatic 3x3 (bez wydruku)": { plnPrice: 5318.096, plnMargin: 1899.32, intranetId: 18800, category: "namioty", origin: "Polska" },
  "adTent Air premium Automatic 3x3 (stelaż+dach)": { plnPrice: 6675.032, plnMargin: 2383.94, intranetId: 18806, category: "namioty", origin: "Polska" },
  "adTent Air premium Automatic 4x4 (stelaż+dach)": { plnPrice: 8142.4, plnMargin: 2908, intranetId: 18805, category: "namioty", origin: "Polska" },
  "adTent Air premium Automatic 5x5 (stelaż+dach)": { plnPrice: 10952.116, plnMargin: 3911.47, intranetId: 18807, category: "namioty", origin: "Polska" },
  "adTent Air premium Automatic 6x6 (stelaż+dach)": { plnPrice: 12497.24, plnMargin: 4463.3, intranetId: 18808, category: "namioty", origin: "Polska" },
  "adTent EXPRESS 3x3m (bez wydruku)": { plnPrice: 888.608, plnMargin: 317.36, intranetId: 15586, category: "namioty", origin: "Chiny" },
  "adTent EXPRESS 3x3m (konstrukcja+wydruk dach)": { plnPrice: 1825.516, plnMargin: 651.97, intranetId: 15605, category: "namioty", origin: "Polska" },
  "adTent EXPRESS 3x3m (konstrukcja+wydruk dach+4x sciany)": { plnPrice: 3307.304, plnMargin: 1181.18, intranetId: 15729, category: "namioty", origin: "Polska" },
  "adTent EXPRESS 3x4,5m (bez wydruku)": { plnPrice: 3090.948, plnMargin: 1103.91, intranetId: 15588, category: "namioty", origin: "Chiny" },
  "adTent EXPRESS 3x4,5m (konstrukcja+wydruk dach)": { plnPrice: 2569.868, plnMargin: 917.81, intranetId: 15606, category: "namioty", origin: "Polska" },
  "adTent EXPRESS 3x6m (bez wydruku)": { plnPrice: 1732.472, plnMargin: 618.74, intranetId: 15589, category: "namioty", origin: "Chiny" },
  "adTent EXPRESS 3x6m (konstrukcja+wydruk dach)": { plnPrice: 3292.184, plnMargin: 1175.78, intranetId: 15607, category: "namioty", origin: "Polska" },
  "adTent EXPRESS baza flagowa do namiotu": { plnPrice: 209.72, plnMargin: 74.9, intranetId: 15829, category: "namioty", origin: "Polska" },
  "adTent EXPRESS PRO 3x3m (bez wydruku)": { plnPrice: 1828.232, plnMargin: 652.94, intranetId: 15626, category: "namioty", origin: "Chiny" },
  "adTent EXPRESS PRO 3x3m (konstrukcja+wydruk dach)": { plnPrice: 2765.168, plnMargin: 987.56, intranetId: 15617, category: "namioty", origin: "Polska" },
  "adTent EXPRESS PRO 3x6m (bez wydruku)": { plnPrice: 3336.648, plnMargin: 1191.66, intranetId: 15619, category: "namioty", origin: "Chiny" },
  "adTent EXPRESS PRO 3x6m (konstrukcja+wydruk dach)": { plnPrice: 4835.684, plnMargin: 1727.03, intranetId: 15618, category: "namioty", origin: "Polska" },
  "adTent EXPRESS PRO 3x6m (konstrukcja+wydruk dach+4x sciany)": { plnPrice: 6615.84, plnMargin: 2362.8, intranetId: 18035, category: "namioty", origin: "Polska" },
  "adTent V 4x4": { plnPrice: 7878.332, plnMargin: 2813.69, intranetId: 17523, category: "namioty", origin: "Polska" },
  "adTent V 5x5": { plnPrice: 9430.484, plnMargin: 3368.03, intranetId: 17524, category: "namioty", origin: "Polska" },
  "adTent V 6x6": { plnPrice: 11583.348, plnMargin: 4136.91, intranetId: 17525, category: "namioty", origin: "Polska" },
  "adTent Vario 3x3 (stelaż+dach)": { plnPrice: 4153.744, plnMargin: 1483.48, intranetId: 11013, category: "namioty", origin: "Polska" },
  "adTent Vario 4x4 (bez wydruku)": { plnPrice: 3404.912, plnMargin: 1216.04, intranetId: 11109, category: "namioty", origin: "6306220000" },
  "adTent Vario 4x4 (stelaż+dach)": { plnPrice: 4996.628, plnMargin: 1784.51, intranetId: 11014, category: "namioty", origin: "Polska" },
  "Markiza konstrukcja Air Tent Premium 4x4": { plnPrice: 1572.144, plnMargin: 561.48, intranetId: 13567, category: "namioty", origin: "Polska" },
  "SET2 - Economy Set": { plnPrice: 3315.592, plnMargin: 1184.14, intranetId: 18023, category: "namioty", origin: "Polska" },
  "SET3 - Heavy-Duty Set": { plnPrice: 4815.496, plnMargin: 1719.82, intranetId: 18024, category: "namioty", origin: "Polska" },
  "adTent EXPRESS obciążnik betonowy 8kg - set 2 szt": { plnPrice: 625.296, plnMargin: 223.32, intranetId: 17507, category: "namioty akcesoria", origin: "Polska" },
  "Dodatkowa noga/TPU do Air Tent Premium 3x3": { plnPrice: 578.704, plnMargin: 206.68, intranetId: 13563, category: "namioty akcesoria", origin: "Chiny" },
  "Dodatkowa noga/TPU do Air Tent Premium 3x3 zawór bezpieczeństwa na dole": { plnPrice: 517.496, plnMargin: 184.82, intranetId: 19673, category: "namioty akcesoria", origin: "NULL" },
  "Dodatkowa noga/TPU do Air Tent Premium 4x4": { plnPrice: 677.852, plnMargin: 242.09, intranetId: 13564, category: "namioty akcesoria", origin: "Chiny" },
  "Dodatkowa noga/TPU do Air Tent Premium 5x5": { plnPrice: 981.232, plnMargin: 350.44, intranetId: 13565, category: "namioty akcesoria", origin: "Chiny" },
  "Dodatkowa noga/TPU do Air Tent Premium 5x5 zawór bezpieczeństwa na dole": { plnPrice: 962.108, plnMargin: 343.61, intranetId: 19675, category: "namioty akcesoria", origin: "NULL" },
  "Dodatkowa noga/TPU do Air Tent Premium 6x6": { plnPrice: 1099.056, plnMargin: 392.52, intranetId: 13566, category: "namioty akcesoria", origin: "Chiny" },
  "Torba na kółkach Air Tent Premium (DUŻA)": { plnPrice: 682.164, plnMargin: 243.63, intranetId: 13576, category: "namioty akcesoria", origin: "Chiny" },
  "Torba na kółkach Air Tent Premium (MAŁA)": { plnPrice: 595.252, plnMargin: 212.59, intranetId: 13575, category: "namioty akcesoria", origin: "Chiny" },
  "Zamek kostkowy biały, dł. 400cm": { plnPrice: 2.716, plnMargin: 0.97, intranetId: 12392, category: "namioty akcesoria", origin: "Polska" },
  "Zawór ciśnieniowy do Air Tent Premium": { plnPrice: 0.112, plnMargin: 0.04, intranetId: 13588, category: "namioty akcesoria", origin: "Polska" },
  "POKAZÓWKA_adTent V 4x4": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17622, category: "outdoor", origin: "Polska" },
  "SET4 - Chill Zone": { plnPrice: 8477.392, plnMargin: 3027.64, intranetId: 18025, category: "outdoor", origin: "Polska" },
  "SET5 - Fan Zone": { plnPrice: 9125.844, plnMargin: 3259.23, intranetId: 18026, category: "outdoor", origin: "Polska" },
  "Wydruk Adtent Air premium 4x4 (ściana boczna dwustronna PREMIUM BLOCKOUT)": { plnPrice: 818.244, plnMargin: 292.23, intranetId: 17540, category: "outdoor", origin: "Polska" },
  "Wydruk Adtent Air premium 5x5 (ściana boczna dwustronna PREMIUM BLOCKOUT)": { plnPrice: 939.232, plnMargin: 335.44, intranetId: 18153, category: "outdoor", origin: "Polska" },
  "Wydruk adTent V 4x4 KOMPLET": { plnPrice: 1639.596, plnMargin: 585.57, intranetId: 17527, category: "outdoor", origin: "Polska" },
  "adColumn Air - Obciążnik 10kg": { plnPrice: 361.396, plnMargin: 129.07, intranetId: 11766, category: "outdoor akcesoria", origin: "Polska" },
  "adColumn Air - zestaw sznurków + śledzie (8szt)": { plnPrice: 50.008, plnMargin: 17.86, intranetId: 17436, category: "outdoor akcesoria", origin: "Polska" },
  "adColumn Air podstawa biała": { plnPrice: 215.04, plnMargin: 76.8, intranetId: 15745, category: "outdoor akcesoria", origin: "Polska" },
  "adColumn Air torba": { plnPrice: 144.704, plnMargin: 51.68, intranetId: 15744, category: "outdoor akcesoria", origin: "Polska" },
  "adFlag Bagnet": { plnPrice: 60.732, plnMargin: 21.69, intranetId: 15686, category: "outdoor akcesoria", origin: "Polska" },
  "adFlag Krzyżak": { plnPrice: 94.78, plnMargin: 33.85, intranetId: 15691, category: "outdoor akcesoria", origin: "Polska" },
  "adFlag Płyta 12kg": { plnPrice: 236.74, plnMargin: 84.55, intranetId: 15689, category: "outdoor akcesoria", origin: "Chiny" },
  "adFlag Płyta 4kg": { plnPrice: 136.948, plnMargin: 48.91, intranetId: 15687, category: "outdoor akcesoria", origin: "Chiny" },
  "adFlag Płyta 6kg": { plnPrice: 179.452, plnMargin: 64.09, intranetId: 15748, category: "outdoor akcesoria", origin: "Chiny" },
  "adFlag Płyta 8kg": { plnPrice: 364.056, plnMargin: 130.02, intranetId: 15688, category: "outdoor akcesoria", origin: "Chiny" },
  "adFlag Rotator": { plnPrice: 63.644, plnMargin: 22.73, intranetId: 15690, category: "outdoor akcesoria", origin: "Polska" },
  "adFlag Sakwa wodna": { plnPrice: 26.656, plnMargin: 9.52, intranetId: 15803, category: "outdoor akcesoria", origin: "Polska" },
  "Adflag Torba L/XL 120cm do adFlag PRO S/L/XL, standard L/XL": { plnPrice: 77.588, plnMargin: 27.71, intranetId: 15693, category: "outdoor akcesoria", origin: "Chiny" },
  "Adflag Torba S/M 100cm do adFlag PRO M, standard S/M": { plnPrice: 74.312, plnMargin: 26.54, intranetId: 15692, category: "outdoor akcesoria", origin: "Chiny" },
  "adFlag trzpień zapasowy": { plnPrice: 14.98, plnMargin: 5.35, intranetId: 18189, category: "outdoor akcesoria", origin: "Chiny" },
  "adFlag zacisk do masztu S/M/L": { plnPrice: 6.16, plnMargin: 2.2, intranetId: 16818, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air - Plecak 4x4/5x5": { plnPrice: 394.38, plnMargin: 140.85, intranetId: 12137, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air - śledź prosty": { plnPrice: 6.16, plnMargin: 2.2, intranetId: 14860, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air - śledź zakręcony": { plnPrice: 35.924, plnMargin: 12.83, intranetId: 13570, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air KOMPLET 2 PLECAKÓW DO NAMIOTU 4X4 I 5X5": { plnPrice: 786.8, plnMargin: 281, intranetId: 14029, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air Oświetlenie LED - (3x3 & 4x4)": { plnPrice: 753.62, plnMargin: 269.15, intranetId: 16052, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air Oświetlenie LED - (5x5 & 6x6)": { plnPrice: 857.416, plnMargin: 306.22, intranetId: 15601, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air premium - Młotek": { plnPrice: 36.568, plnMargin: 13.06, intranetId: 13571, category: "outdoor akcesoria", origin: "Chiny" },
  "adTent Air premium - zestaw zaworów": { plnPrice: 1.344, plnMargin: 0.48, intranetId: 18230, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air premium - zestaw Śledzie Outdoor 16 szt": { plnPrice: 98.56, plnMargin: 35.2, intranetId: 15523, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air premium - Łącznik 2 namiotów 4X4": { plnPrice: 351.344, plnMargin: 125.48, intranetId: 15846, category: "outdoor akcesoria", origin: "Polska" },
  "adTent Air premium sakwa obciążenie": { plnPrice: 65.912, plnMargin: 23.54, intranetId: 18682, category: "outdoor akcesoria", origin: "Polska" },
  "adTent EXPRESS - noga narożna": { plnPrice: 0, plnMargin: 0, intranetId: 18751, category: "outdoor akcesoria", origin: "Polska" },
  "adTent EXPRESS - plastik do noga narożna": { plnPrice: 0, plnMargin: 0, intranetId: 18753, category: "outdoor akcesoria", origin: "Polska" },
  "adTent EXPRESS - plastikowe narożniki": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 17952, category: "outdoor akcesoria", origin: "Chiny" },
  "adTent EXPRESS 3x3 - zestaw śledzie i sznurki": { plnPrice: 25.9, plnMargin: 9.25, intranetId: 18030, category: "outdoor akcesoria", origin: "Polska" },
  "adTent EXPRESS 3x3m torba na kółkach": { plnPrice: 125.3, plnMargin: 44.75, intranetId: 15587, category: "outdoor akcesoria", origin: "Chiny" },
  "adTent EXPRESS halfbar 3x3": { plnPrice: 304.92, plnMargin: 108.9, intranetId: 16455, category: "outdoor akcesoria", origin: "Polska" },
  "adTent EXPRESS sakwa na piasek": { plnPrice: 58.856, plnMargin: 21.02, intranetId: 15747, category: "outdoor akcesoria", origin: "Polska" },
  "adTent EXPRESS sakwa na piasek podwójna": { plnPrice: 121.996, plnMargin: 43.57, intranetId: 15822, category: "outdoor akcesoria", origin: "Polska" },
  "OBCIĄŻNIK DO NAMIOTU": { plnPrice: 215.6, plnMargin: 77, intranetId: 11717, category: "outdoor akcesoria", origin: "Chiny" },
  "Pompka do Adtent Air Premium Automatic": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18831, category: "outdoor akcesoria", origin: "Polska" },
  "POMPKA ELEKTRYCZNA BRAVO": { plnPrice: 375.956, plnMargin: 134.27, intranetId: 13572, category: "outdoor akcesoria", origin: "Chiny" },
  "Pompka elektryczna standard": { plnPrice: 231.952, plnMargin: 82.84, intranetId: 11376, category: "outdoor akcesoria", origin: "Chiny" },
  "Pompka ręczna": { plnPrice: 85.148, plnMargin: 30.41, intranetId: 11377, category: "outdoor akcesoria", origin: "Chiny" },
  "adBoard Hips 58x100": { plnPrice: 551.992, plnMargin: 197.14, intranetId: 10128, category: "potykacze", origin: "Polska" },
  "adBoard Hips 58x100 (bez wydruku)": { plnPrice: 504.028, plnMargin: 180.01, intranetId: 15550, category: "potykacze", origin: "Polska" },
  "adBoard Hips 68x120": { plnPrice: 666.652, plnMargin: 238.09, intranetId: 10417, category: "potykacze", origin: "Polska" },
  "adBoard LED 85x120": { plnPrice: 1513.4, plnMargin: 540.5, intranetId: 16216, category: "potykacze", origin: "Polska" },
  "adBoard OWZ A0": { plnPrice: 1006.796, plnMargin: 359.57, intranetId: 10223, category: "potykacze", origin: "Polska" },
  "adBoard OWZ A0(bez wydruku)": { plnPrice: 828.52, plnMargin: 295.9, intranetId: 13894, category: "potykacze", origin: "Chiny" },
  "adBoard OWZ B2": { plnPrice: 566.132, plnMargin: 202.19, intranetId: 10320, category: "potykacze", origin: "Polska" },
  "adBox Elypse Mini komplet blat+półka": { plnPrice: 287.616, plnMargin: 102.72, intranetId: 17535, category: "półprodukty", origin: "Polska" },
  "adBox Hit C komplet blat+półka": { plnPrice: 524.3, plnMargin: 187.25, intranetId: 17494, category: "półprodukty", origin: "Polska" },
  "adTribune Seg NEW komplet blat+półka": { plnPrice: 328.776, plnMargin: 117.42, intranetId: 17751, category: "półprodukty", origin: "Chiny" },
  "Blat niestandardowy - kasetony (należy dodać dodatkową paczkę na blat, uwzględniając wymiary blatu)": { plnPrice: 18.732, plnMargin: 6.69, intranetId: 16443, category: "półprodukty", origin: "Polska" },
  "Elypse konstrukcja uzbrojona CN": { plnPrice: 394.436, plnMargin: 140.87, intranetId: 18594, category: "półprodukty", origin: "Polska" },
  "Formatka Hips 0,50mm": { plnPrice: 40.32, plnMargin: 14.4, intranetId: 10165, category: "półprodukty", origin: "Polska" },
  "Karton - Elypse": { plnPrice: 25.984, plnMargin: 9.28, intranetId: 11350, category: "półprodukty", origin: "Polska" },
  "Karton 143/33/22 - kaseton profil max.130cm 3K": { plnPrice: 43.12, plnMargin: 15.4, intranetId: 12205, category: "półprodukty", origin: "Polska" },
  "Karton Adstand 100/STFL - 105x9,5x26,5cm": { plnPrice: 18.144, plnMargin: 6.48, intranetId: 11353, category: "półprodukty", origin: "Polska" },
  "Karton LMD/LMS - 110x16x33cm": { plnPrice: 61.516, plnMargin: 21.97, intranetId: 14841, category: "półprodukty", origin: "Polska" },
  "Karton LMD/LMS - 135x16x33cm": { plnPrice: 69.496, plnMargin: 24.82, intranetId: 14842, category: "półprodukty", origin: "Polska" },
  "Karton LMD/LMS/DTF - 210x16x33cm": { plnPrice: 99.176, plnMargin: 35.42, intranetId: 14844, category: "półprodukty", origin: "Polska" },
  "Keder 14x3mm - Adframe": { plnPrice: 2.604, plnMargin: 0.93, intranetId: 11815, category: "półprodukty", origin: "Polska" },
  "Kółko STANDARD": { plnPrice: 0.392, plnMargin: 0.14, intranetId: 17509, category: "półprodukty", origin: "Polska" },
  "Produkt wystawienniczy": { plnPrice: 1.67, plnMargin: 0, intranetId: 10129, category: "półprodukty", origin: "Polska" },
  "Rzep miękki [pętelka]": { plnPrice: 5.264, plnMargin: 1.88, intranetId: 10250, category: "półprodukty", origin: "Polska" },
  "Rzep twardy [haczyk]": { plnPrice: 5.404, plnMargin: 1.93, intranetId: 10251, category: "półprodukty", origin: "Polska" },
  "Tuba 12x150cm - wydruk AdPoster L150": { plnPrice: 19.404, plnMargin: 6.93, intranetId: 11360, category: "półprodukty", origin: "Polska" },
  "Tuba 12x200cm - wydruk AdPoster L200": { plnPrice: 26.628, plnMargin: 9.51, intranetId: 11593, category: "półprodukty", origin: "Polska" },
  "Tuba 15x90cm - wydruk stoisko": { plnPrice: 15.764, plnMargin: 5.63, intranetId: 11356, category: "półprodukty", origin: "Polska" },
  "Zamek zwykły biały, dł. 160cm": { plnPrice: 0.644, plnMargin: 0.23, intranetId: 13964, category: "półprodukty", origin: "Polska" },
  "Zamek zwykły czarny, dł. 200cm": { plnPrice: 0.896, plnMargin: 0.32, intranetId: 15342, category: "półprodukty", origin: "Polska" },
  "adFrame CTF mocowanie półki": { plnPrice: 59.92, plnMargin: 21.4, intranetId: 19552, category: "ramy tekstylne akcesoria", origin: "NULL" },
  "adFrame CTF Plastic connector": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 12090, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame CTF support bar connector": { plnPrice: 26.964, plnMargin: 9.63, intranetId: 12077, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame DTF lampka": { plnPrice: 56.14, plnMargin: 20.05, intranetId: 17410, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame DTF stopa płaska": { plnPrice: 116.564, plnMargin: 41.63, intranetId: 10943, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame DTF łącznik kątowy 90 stopni": { plnPrice: 52.752, plnMargin: 18.84, intranetId: 17433, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame DTF/STF/LMSM łącznik 180°": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 10941, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame imbus 2,5mm": { plnPrice: 0.196, plnMargin: 0.07, intranetId: 11315, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame imbus 4mm": { plnPrice: 0.252, plnMargin: 0.09, intranetId: 11316, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LCD profil przedni z gumką": { plnPrice: 112.868, plnMargin: 40.31, intranetId: 12073, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LCD profil tylny z gumką/bez gumki": { plnPrice: 195.748, plnMargin: 69.91, intranetId: 12096, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LCD profil z gumką środkowy": { plnPrice: 89.852, plnMargin: 32.09, intranetId: 15412, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LED mocowanie": { plnPrice: 0.196, plnMargin: 0.07, intranetId: 11314, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame LMD (narożny) łącznik na płasko": { plnPrice: 4.48, plnMargin: 1.6, intranetId: 15352, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMD door listwy 100cm NA BOK - zestaw": { plnPrice: 2201.052, plnMargin: 786.09, intranetId: 12051, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame LMD narożnik wzmacniany": { plnPrice: 16.828, plnMargin: 6.01, intranetId: 11900, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame LMD pianka ochronna": { plnPrice: 0.644, plnMargin: 0.23, intranetId: 11736, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMD łącznik 180° długi": { plnPrice: 33.712, plnMargin: 12.04, intranetId: 10952, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMD łącznik narożny mFrame": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 17156, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame LMD/LMS - Torba 105cm 3K": { plnPrice: 594.804, plnMargin: 212.43, intranetId: 10596, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMD/LMS - Torba 105cm z kółkami": { plnPrice: 1055.544, plnMargin: 376.98, intranetId: 11573, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMD/LMS - Torba 130cm z kółkami": { plnPrice: 1196.58, plnMargin: 427.35, intranetId: 15217, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMD/LMS - Torba 155cm z kółkami": { plnPrice: 1363.684, plnMargin: 487.03, intranetId: 15218, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMD/LMS - Torba 205cm z kółkami": { plnPrice: 1627.976, plnMargin: 581.42, intranetId: 11574, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMS narożnik (bez gwintu)": { plnPrice: 5.6, plnMargin: 2, intranetId: 10946, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMS wieszak": { plnPrice: 44.912, plnMargin: 16.04, intranetId: 10961, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMS wieszak dolny": { plnPrice: 44.912, plnMargin: 16.04, intranetId: 15410, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMS łącznik 180°": { plnPrice: 32.9, plnMargin: 11.75, intranetId: 10947, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMS/STF/DTF narożnik (gwintowany)": { plnPrice: 5.572, plnMargin: 1.99, intranetId: 10940, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMSM narożnik": { plnPrice: 5.068, plnMargin: 1.81, intranetId: 11118, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame LMSM wieszak": { plnPrice: 6.188, plnMargin: 2.21, intranetId: 10954, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Poster hanger set": { plnPrice: 102.2, plnMargin: 36.5, intranetId: 16735, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame Quick Clips Plastikowy": { plnPrice: 3.052, plnMargin: 1.09, intranetId: 12405, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame SAF/SWF - sklep - klej do płytki": { plnPrice: 10.108, plnMargin: 3.61, intranetId: 15897, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame SAF/SWF - sklep - płytka metalowa": { plnPrice: 19.096, plnMargin: 6.82, intranetId: 15896, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame Smart 100x250 zasilacz": { plnPrice: 319.032, plnMargin: 113.94, intranetId: 17051, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame Smart 200x250 support komplet rurek": { plnPrice: 63.896, plnMargin: 22.82, intranetId: 17056, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame Smart 200x250 torba z wkładem": { plnPrice: 282.324, plnMargin: 100.83, intranetId: 19571, category: "ramy tekstylne akcesoria", origin: "NULL" },
  "adFrame Smart 200x250 zasilacz": { plnPrice: 704.424, plnMargin: 251.58, intranetId: 17052, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame Smart 300x250 torba bez pianki": { plnPrice: 342.132, plnMargin: 122.19, intranetId: 17057, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Smart 300x250 zasilacz": { plnPrice: 675.864, plnMargin: 241.38, intranetId: 17053, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame Smart Clips Plastikowy": { plnPrice: 2.8, plnMargin: 1, intranetId: 12407, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Smart stopa boczna": { plnPrice: 79.576, plnMargin: 28.42, intranetId: 14035, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Smart stopa płaska": { plnPrice: 73.164, plnMargin: 26.13, intranetId: 17439, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Smart Łącznik plastikowy 180°": { plnPrice: 27.58, plnMargin: 9.85, intranetId: 12404, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Smart Łącznik plastikowy 45°": { plnPrice: 26.964, plnMargin: 9.63, intranetId: 18269, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Smart Łącznik plastikowy 90°": { plnPrice: 46.424, plnMargin: 16.58, intranetId: 12406, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame Smart Łącznik T": { plnPrice: 26.964, plnMargin: 9.63, intranetId: 14037, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame STF/STFL wieszak": { plnPrice: 6.16, plnMargin: 2.20, intranetId: 10944, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame STFL łącznik 180°": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 11908, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame stopa LMD/LMS": { plnPrice: 153.3, plnMargin: 54.75, intranetId: 10950, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame stopa LMD/LMS LIGHT": { plnPrice: 25.788, plnMargin: 9.21, intranetId: 19091, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame support 180° łącznik": { plnPrice: 13.468, plnMargin: 4.81, intranetId: 11131, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame support zamek": { plnPrice: 6.496, plnMargin: 2.32, intranetId: 10949, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "adFrame ŁĄCZNIK LMD/LMD (gwintowany)": { plnPrice: 65.912, plnMargin: 23.54, intranetId: 17420, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Kabel zasilający do zasilacza (AC 3PIN) 1,8m": { plnPrice: 15.568, plnMargin: 5.56, intranetId: 12129, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Kabel zasilający do zasilacza (AC 3PIN) UK": { plnPrice: 210.784, plnMargin: 75.28, intranetId: 12663, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Korpus złącza PHM żeński": { plnPrice: 0.224, plnMargin: 0.08, intranetId: 13424, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Korpus złącza PWM męski": { plnPrice: 0.168, plnMargin: 0.06, intranetId: 13426, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "mFrame MASKOWNICA LED 992 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18540, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "mFrame MASKOWNICA LED PROFIL": { plnPrice: 35.952, plnMargin: 12.84, intranetId: 18227, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Oświetlenie AdframeLED NORMAL 45cm": { plnPrice: 100.352, plnMargin: 35.84, intranetId: 11794, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "Oświetlenie AdframeLED NORMAL LED 50cm 16W ver2": { plnPrice: 47.544, plnMargin: 16.98, intranetId: 18633, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Oświetlenie AdframeLED POWER LED 20cm 9W ver2": { plnPrice: 34.944, plnMargin: 12.48, intranetId: 18625, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Oświetlenie AdframeLED POWER LED 25cm": { plnPrice: 56.56, plnMargin: 20.2, intranetId: 11448, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "Oświetlenie AdframeLED POWER LED 30cm 13W ver2": { plnPrice: 45.808, plnMargin: 16.36, intranetId: 18627, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Oświetlenie AdframeLED POWER LED 50cm 22W ver2": { plnPrice: 66.248, plnMargin: 23.66, intranetId: 18628, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "profil CTF": { plnPrice: 42.672, plnMargin: 15.24, intranetId: 12099, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "profil h": { plnPrice: 13.468, plnMargin: 4.81, intranetId: 17721, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "profil LMD": { plnPrice: 136.052, plnMargin: 48.59, intranetId: 10933, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "profil LMD odchudzony": { plnPrice: 110.18, plnMargin: 39.35, intranetId: 18517, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "profil support light": { plnPrice: 30.324, plnMargin: 10.83, intranetId: 11951, category: "ramy tekstylne akcesoria", origin: "Chiny" },
  "Przedłużacz z uziemieniem 5 gniazd, 10m biały": { plnPrice: 97.412, plnMargin: 34.79, intranetId: 18822, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Torba do adFrame Quick 100x250 - na kółkach": { plnPrice: 615.72, plnMargin: 219.9, intranetId: 12435, category: "ramy tekstylne akcesoria", origin: "4202129990" },
  "Wtyczka UK": { plnPrice: 45.36, plnMargin: 16.2, intranetId: 16135, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Zasilacz wewnętrzny 100W 24V": { plnPrice: 170.52, plnMargin: 60.9, intranetId: 11422, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Zasilacz wewnętrzny 150W 24V": { plnPrice: 129.36, plnMargin: 46.2, intranetId: 11500, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Zasilacz wewnętrzny 200W 24V": { plnPrice: 128.604, plnMargin: 45.93, intranetId: 11501, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Zasilacz zewnętrzny 220W 24V": { plnPrice: 694.988, plnMargin: 248.21, intranetId: 10386, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "Zasilacz zewnętrzny 300W 24V": { plnPrice: 886.844, plnMargin: 316.73, intranetId: 13996, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "złączka LED": { plnPrice: 0.084, plnMargin: 0.03, intranetId: 16965, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "złączka LED - Jack 3,5mm 10cm męski": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17438, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adFrame CTF": { plnPrice: 1858.024, plnMargin: 663.58, intranetId: 18337, category: "ramy tekstylne custom niepodświetlane", origin: "Polska" },
  "adFrame CTF (bez wydruku)": { plnPrice: 635.04, plnMargin: 226.8, intranetId: 12160, category: "ramy tekstylne custom niepodświetlane", origin: "Chiny" },
  "adFrame DTF": { plnPrice: 1421.812, plnMargin: 507.79, intranetId: 18256, category: "ramy tekstylne custom niepodświetlane", origin: "Polska" },
  "adFrame DTF (bez wydruku)": { plnPrice: 1110.312, plnMargin: 396.54, intranetId: 10332, category: "ramy tekstylne custom niepodświetlane", origin: "Chiny" },
  "adFrame STF": { plnPrice: 607.796, plnMargin: 217.07, intranetId: 18254, category: "ramy tekstylne custom niepodświetlane", origin: "Polska" },
  "adFrame STFL": { plnPrice: 371.952, plnMargin: 132.84, intranetId: 18255, category: "ramy tekstylne custom niepodświetlane", origin: "Polska" },
  "adFrame STFL (bez wydruku)": { plnPrice: 147.448, plnMargin: 52.66, intranetId: 10594, category: "ramy tekstylne custom niepodświetlane", origin: "Chiny" },
  "adFrame LMD": { plnPrice: 2424.688, plnMargin: 865.96, intranetId: 18251, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMD (bez wydruku)": { plnPrice: 1960.868, plnMargin: 700.31, intranetId: 10334, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMD (bez wydruku) NoLed": { plnPrice: 0, plnMargin: 0, intranetId: 19368, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMS": { plnPrice: 2427.124, plnMargin: 866.83, intranetId: 18252, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMS (bez wydruku)": { plnPrice: 2195.2, plnMargin: 784, intranetId: 10331, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMSM": { plnPrice: 1599.136, plnMargin: 571.12, intranetId: 18253, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMSM (bez wydruku)": { plnPrice: 1367.24, plnMargin: 488.3, intranetId: 10444, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMSM Mframe": { plnPrice: 1624.784, plnMargin: 580.28, intranetId: 18338, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame LMSM Mframe (bez wydruku)": { plnPrice: 1331.344, plnMargin: 475.48, intranetId: 11926, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "adFrame SLM (bez wydruku)": { plnPrice: 1540.028, plnMargin: 550.01, intranetId: 18912, category: "ramy tekstylne custom podświetlane", origin: "Polska" },
  "Adframe Flex Led 200x250": { plnPrice: 2786, plnMargin: 995, intranetId: 18555, category: "ramy tekstylne p&p", origin: "Polska" },
  "Adframe Flex Led 200x250 (bez wydruku)": { plnPrice: 2626.176, plnMargin: 937.92, intranetId: 18414, category: "ramy tekstylne p&p", origin: "Chiny" },
  "Adframe Flex Led 300x250": { plnPrice: 3547.348, plnMargin: 1266.91, intranetId: 18558, category: "ramy tekstylne p&p", origin: "Polska" },
  "Adframe Flex Led 300x250 (bez wydruku)": { plnPrice: 3319.288, plnMargin: 1185.46, intranetId: 18415, category: "ramy tekstylne p&p", origin: "Chiny" },
  "Adframe Flex Led 300x250 ver2.0 (bez wydruku)": { plnPrice: 1147.45, plnMargin: 1130.78, intranetId: 19794, category: "ramy tekstylne p&p", origin: "NULL" },
  "Adframe Flex Led 400x250": { plnPrice: 1587.04, plnMargin: 1496.59, intranetId: 18559, category: "ramy tekstylne p&p", origin: "Polska" },
  "Adframe Flex Led 400x250 (bez wydruku)": { plnPrice: 1432.86, plnMargin: 1391.19, intranetId: 18848, category: "ramy tekstylne p&p", origin: "Chiny" },
  "Adframe Flex Led extension set 100x250 ver2.0 (bez wydruku)": { plnPrice: 268.74, plnMargin: 260.41, intranetId: 19795, category: "ramy tekstylne p&p", origin: "NULL" },
  "Adframe Flex Led extension set 100x250 W KARTONIE": { plnPrice: 842.212, plnMargin: 300.79, intranetId: 19260, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame LPO 100x200": { plnPrice: 1435.448, plnMargin: 512.66, intranetId: 16286, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame LPO 100x200 (bez wydruku)": { plnPrice: 1354.08, plnMargin: 483.6, intranetId: 16198, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame LPO 100x293": { plnPrice: 2274.944, plnMargin: 812.48, intranetId: 16287, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Lumina RGB 100x200cm (bez wydruku)": { plnPrice: 5297.292, plnMargin: 1891.89, intranetId: 18170, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Lumina RGB 100x200cm dwustronny": { plnPrice: 5460.056, plnMargin: 1950.02, intranetId: 18424, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Lumina RGB 100x250 cm (bez wydruku)": { plnPrice: 5718.384, plnMargin: 2042.28, intranetId: 18171, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Lumina RGB 100x250 cm dwustronny": { plnPrice: 5899.908, plnMargin: 2107.11, intranetId: 18430, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Lumina RGB 300x250 cm (bez wydruku)": { plnPrice: 12116.188, plnMargin: 4327.21, intranetId: 18172, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Lumina RGB 300x250 cm dwustronny": { plnPrice: 12572.336, plnMargin: 4490.12, intranetId: 18431, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Lumina RGB tacka": { plnPrice: 202.048, plnMargin: 72.16, intranetId: 18527, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Lumina RGB uchwyt na ulotki": { plnPrice: 229.46, plnMargin: 81.95, intranetId: 18529, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Poster 100x100": { plnPrice: 756.028, plnMargin: 270.01, intranetId: 16744, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Poster 100x150": { plnPrice: 933.828, plnMargin: 333.51, intranetId: 16745, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Poster 100x200": { plnPrice: 1062.04, plnMargin: 379.3, intranetId: 16746, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Poster 100x300": { plnPrice: 1576.26, plnMargin: 562.95, intranetId: 16748, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Poster 100x300 (bez wydruku)": { plnPrice: 1356.768, plnMargin: 484.56, intranetId: 16732, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Poster 70x100": { plnPrice: 667.492, plnMargin: 238.39, intranetId: 16749, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Poster 70x100 (bez wydruku)": { plnPrice: 604.996, plnMargin: 216.07, intranetId: 16733, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Quick 100x200 ver 2.0 w torbie na kółkach (bez wydruku)": { plnPrice: 1197.812, plnMargin: 427.79, intranetId: 17872, category: "ramy tekstylne p&p", origin: "9405618090" },
  "adFrame Quick 100x200 wersja 2.0 w torbie na kółkach": { plnPrice: 1360.576, plnMargin: 485.92, intranetId: 17889, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick 100x250 ver 2.0 w torbie na kółkach": { plnPrice: 1707.72, plnMargin: 609.9, intranetId: 17949, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick 100x250 w torbie na kółkach": { plnPrice: 1754.116, plnMargin: 626.47, intranetId: 12274, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick 85x200 wersja 2.0": { plnPrice: 1317.876, plnMargin: 470.67, intranetId: 18111, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick 85x250 wersja 2.0": { plnPrice: 1607.256, plnMargin: 574.02, intranetId: 18114, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Battery - narożnik": { plnPrice: 22.456, plnMargin: 8.02, intranetId: 18345, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Quick Battery - zasilacz": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18344, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Quick Battery 100x200": { plnPrice: 3908.968, plnMargin: 1396.06, intranetId: 16127, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Battery 100x200 (bez wydruku)": { plnPrice: 3740.492, plnMargin: 1335.89, intranetId: 16125, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Quick Budget 100x200 (bez wydruku)": { plnPrice: 511.532, plnMargin: 182.69, intranetId: 13480, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Quick Safe Case Black 100x200": { plnPrice: 1451.772, plnMargin: 518.49, intranetId: 19033, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case BLACK 100x200 (bez wydruku)": { plnPrice: 1289.008, plnMargin: 460.36, intranetId: 18809, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case Black 100x250": { plnPrice: 1715.616, plnMargin: 612.72, intranetId: 19031, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case BLACK 100x250 (bez wydruku)": { plnPrice: 1534.036, plnMargin: 547.87, intranetId: 18811, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case Black 85x200": { plnPrice: 1419.824, plnMargin: 507.08, intranetId: 19070, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case Silver 100x200": { plnPrice: 1429.904, plnMargin: 510.68, intranetId: 19072, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case Silver 100x200 (bez wydruku)": { plnPrice: 1267.14, plnMargin: 452.55, intranetId: 19004, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case Silver 100x250": { plnPrice: 1682.828, plnMargin: 601.01, intranetId: 19073, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case Silver 100x250 (bez wydruku)": { plnPrice: 1501.276, plnMargin: 536.17, intranetId: 19005, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Safe Case Silver 85x200": { plnPrice: 1397.984, plnMargin: 499.28, intranetId: 19071, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Single zasilacz": { plnPrice: 160.58, plnMargin: 57.35, intranetId: 17865, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Slim - narożnik": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18610, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Quick Slim - support": { plnPrice: 12.74, plnMargin: 4.55, intranetId: 18611, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Slim 100x200 - 65mm (bez wydruku)": { plnPrice: 797.3, plnMargin: 284.75, intranetId: 17987, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Slim 100x200 - 65mm dwustronny": { plnPrice: 960.036, plnMargin: 342.87, intranetId: 18105, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Slim 100x200 - 65mm jednostronny (tył blockout)": { plnPrice: 986.888, plnMargin: 352.46, intranetId: 18109, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Slim 100x250 - 65mm (bez wydruku)": { plnPrice: 939.288, plnMargin: 335.46, intranetId: 18321, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Slim 100x250 - 65mm dwustronny": { plnPrice: 1115.66, plnMargin: 398.45, intranetId: 18534, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Slim 100x250 - 65mm jednostronny (tył blockout)": { plnPrice: 1135.708, plnMargin: 405.61, intranetId: 18538, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Smart 100x200": { plnPrice: 2030.448, plnMargin: 725.16, intranetId: 12226, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Smart 100x200 (bez wydruku)": { plnPrice: 1866.592, plnMargin: 666.64, intranetId: 12227, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Smart 100x250": { plnPrice: 2078.496, plnMargin: 742.32, intranetId: 12232, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Smart 100x250 (bez wydruku)": { plnPrice: 1895.824, plnMargin: 677.08, intranetId: 12233, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Smart 200x200": { plnPrice: 3727.64, plnMargin: 1331.3, intranetId: 14242, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Smart 200x250": { plnPrice: 3758.356, plnMargin: 1342.27, intranetId: 14238, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Smart 200x250 (bez wydruku)": { plnPrice: 3438.708, plnMargin: 1228.11, intranetId: 13606, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Smart 300x200": { plnPrice: 4982.544, plnMargin: 1779.48, intranetId: 15793, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Smart 300x250": { plnPrice: 5025.076, plnMargin: 1794.67, intranetId: 12235, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Smart 300x250 (bez wydruku)": { plnPrice: 4568.928, plnMargin: 1631.76, intranetId: 12236, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adFrame Smart 85x250": { plnPrice: 1928.808, plnMargin: 688.86, intranetId: 17563, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Starter 100x200 (bez wydruku)": { plnPrice: 480.536, plnMargin: 171.62, intranetId: 18663, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Starter 100x200 DWUSTRONNY": { plnPrice: 643.272, plnMargin: 229.74, intranetId: 15521, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame Starter 100x250 DWUSTRONNY": { plnPrice: 703.892, plnMargin: 251.39, intranetId: 15522, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame SWF - sklep - wieszak na magnes": { plnPrice: 16.38, plnMargin: 5.85, intranetId: 15892, category: "ramy tekstylne p&p", origin: "Chiny" },
  "adTribune Lumina RGB": { plnPrice: 3897.376, plnMargin: 1391.92, intranetId: 18983, category: "ramy tekstylne p&p", origin: "Polska" },
  "adTribune Lumina RGB (bez wydruku)": { plnPrice: 3743.936, plnMargin: 1337.12, intranetId: 18664, category: "ramy tekstylne p&p", origin: "Polska" },
  "LuminaStick 250 cm": { plnPrice: 4970.756, plnMargin: 1775.27, intranetId: 18173, category: "ramy tekstylne p&p", origin: "Polska" },
  "POKAZÓWKA_adTribune Cubic": { plnPrice: 0, plnMargin: 0, intranetId: 18433, category: "ramy tekstylne p&p", origin: "Polska" },
  "Pop-up Lightbox 100x200": { plnPrice: 1443.596, plnMargin: 515.57, intranetId: 17862, category: "ramy tekstylne p&p", origin: "Polska" },
  "Pop-up Lightbox 100x200 (bez wydruku)": { plnPrice: 1280.86, plnMargin: 457.45, intranetId: 17789, category: "ramy tekstylne p&p", origin: "Chiny" },
  "Pop-up Lightbox łącznik 180 plastikowy": { plnPrice: 5.6, plnMargin: 2, intranetId: 18656, category: "ramy tekstylne p&p", origin: "Polska" },
  "Pop-up Lightbox/Adtribune 100x200 support": { plnPrice: 5.6, plnMargin: 2, intranetId: 18646, category: "ramy tekstylne p&p", origin: "Polska" },
  "Pop-up Lightbox/Adtribune 100x200 ZAWIAS 180": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18647, category: "ramy tekstylne p&p", origin: "Polska" },
  "SEGO Mini Display Stand 100x250": { plnPrice: 604.24, plnMargin: 215.8, intranetId: 13697, category: "ramy tekstylne p&p", origin: "Polska" },
  "SET3 - Zestaw konferencyjny Premium LED": { plnPrice: 6729.94, plnMargin: 2403.55, intranetId: 18086, category: "ramy tekstylne p&p", origin: "Polska" },
  "Torba do adFrame Quick Single 100x200": { plnPrice: 130.536, plnMargin: 46.62, intranetId: 18257, category: "ramy tekstylne p&p", origin: "Chiny" },
  "Walizka do adFrame Quick Safe Case": { plnPrice: 334.656, plnMargin: 119.52, intranetId: 19231, category: "ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Slim 100x200 - 65mm": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 18106, category: "ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Slim 100x200 - 65mm tył": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 18107, category: "ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Slim 100x200 - 65mm tył Blockout": { plnPrice: 108.22, plnMargin: 38.65, intranetId: 18108, category: "ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Slim 100x250 - 65mm": { plnPrice: 88.172, plnMargin: 31.49, intranetId: 18535, category: "ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Slim 100x250 - 65mm tył Blockout": { plnPrice: 108.22, plnMargin: 38.65, intranetId: 18537, category: "ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adTribune Lumina RGB": { plnPrice: 76.72, plnMargin: 27.4, intranetId: 18984, category: "ramy tekstylne p&p", origin: "Polska" },
  "adFrame CTF 100x100x100": { plnPrice: 1374.604, plnMargin: 490.93, intranetId: 15131, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame CTF 100x50x100": { plnPrice: 1117.9, plnMargin: 399.25, intranetId: 15132, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame CTF 200x200x100": { plnPrice: 1956.304, plnMargin: 698.68, intranetId: 15134, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame CTF 50x50x50": { plnPrice: 845.88, plnMargin: 302.1, intranetId: 15138, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame CTF 50x50x50 LED": { plnPrice: 1098.72, plnMargin: 392.4, intranetId: 18952, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 100x200": { plnPrice: 1205.932, plnMargin: 430.69, intranetId: 14560, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 150x200": { plnPrice: 1312.332, plnMargin: 468.69, intranetId: 14548, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 200x200": { plnPrice: 1757.84, plnMargin: 627.8, intranetId: 14550, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 200x200 (bez wydruku)": { plnPrice: 1368.388, plnMargin: 488.71, intranetId: 14489, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny" },
  "adFrame DTF 200x250": { plnPrice: 1852.928, plnMargin: 661.76, intranetId: 14551, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 300x200": { plnPrice: 2153.48, plnMargin: 769.1, intranetId: 14552, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 300x250": { plnPrice: 2248.288, plnMargin: 802.96, intranetId: 14553, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 400x250": { plnPrice: 2787.904, plnMargin: 995.68, intranetId: 14555, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 500x200": { plnPrice: 3181.724, plnMargin: 1136.33, intranetId: 14556, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 500x250": { plnPrice: 3314.444, plnMargin: 1183.73, intranetId: 14557, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame DTF 600x250": { plnPrice: 3702.86, plnMargin: 1322.45, intranetId: 14559, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STF 100x100": { plnPrice: 520.8, plnMargin: 186, intranetId: 14580, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STF 100x200": { plnPrice: 727.944, plnMargin: 259.98, intranetId: 14566, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STF 150x200 (bez wydruku)": { plnPrice: 742.784, plnMargin: 265.28, intranetId: 14506, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny" },
  "adFrame STF 150x250": { plnPrice: 921.144, plnMargin: 328.98, intranetId: 14569, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STF 500x250": { plnPrice: 1961.26, plnMargin: 700.45, intranetId: 14577, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 100x100": { plnPrice: 404.18, plnMargin: 144.35, intranetId: 14582, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 100x200": { plnPrice: 516.096, plnMargin: 184.32, intranetId: 14583, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 100x250": { plnPrice: 548.744, plnMargin: 195.98, intranetId: 14584, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 150x200": { plnPrice: 552.412, plnMargin: 197.29, intranetId: 14585, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 300x200": { plnPrice: 819.448, plnMargin: 292.66, intranetId: 14589, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 300x250": { plnPrice: 852.796, plnMargin: 304.57, intranetId: 14590, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 400x250": { plnPrice: 980.56, plnMargin: 350.2, intranetId: 14591, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 600x250": { plnPrice: 1325.912, plnMargin: 473.54, intranetId: 14597, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL 70x100 (bez wydruku)": { plnPrice: 304.556, plnMargin: 108.77, intranetId: 18350, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny" },
  "adFrame STFL A0 84x118": { plnPrice: 394.996, plnMargin: 141.07, intranetId: 14599, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL A1 59x84": { plnPrice: 335.552, plnMargin: 119.84, intranetId: 14600, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL A1 59x84 (bez wydruku)": { plnPrice: 282.548, plnMargin: 100.91, intranetId: 14518, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny" },
  "adFrame STFL B1 70x100": { plnPrice: 365.904, plnMargin: 130.68, intranetId: 14601, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame STFL B2 50x70": { plnPrice: 165.284, plnMargin: 59.03, intranetId: 14602, category: "ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "adFrame LMD 100x250 PK": { plnPrice: 1821.12, plnMargin: 650.4, intranetId: 17098, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x200 ND (bez wydruku)": { plnPrice: 2365.16, plnMargin: 844.7, intranetId: 14069, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x200 NK": { plnPrice: 2480.268, plnMargin: 885.81, intranetId: 14068, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x200 NK (bez wydruku)": { plnPrice: 2233.924, plnMargin: 797.83, intranetId: 14067, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x200 NO": { plnPrice: 4110.876, plnMargin: 1468.17, intranetId: 14072, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x200 PD": { plnPrice: 2438.268, plnMargin: 870.81, intranetId: 14064, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x200 PO": { plnPrice: 3819.452, plnMargin: 1364.09, intranetId: 14066, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x250 ND": { plnPrice: 2996.448, plnMargin: 1070.16, intranetId: 14082, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x250 NK": { plnPrice: 2870.112, plnMargin: 1025.04, intranetId: 14080, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x250 PD": { plnPrice: 2929.276, plnMargin: 1046.17, intranetId: 14076, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 150x250 PK": { plnPrice: 2527.728, plnMargin: 902.76, intranetId: 14073, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x200 NK": { plnPrice: 3516.8, plnMargin: 1256, intranetId: 14091, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x200 PK": { plnPrice: 3111.444, plnMargin: 1111.23, intranetId: 14086, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x200 PK (bez wydruku)": { plnPrice: 2822.316, plnMargin: 1007.97, intranetId: 14087, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x200 PO": { plnPrice: 6373.948, plnMargin: 2276.41, intranetId: 14090, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x250 ND": { plnPrice: 3853.248, plnMargin: 1376.16, intranetId: 14105, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x250 NK": { plnPrice: 3749.48, plnMargin: 1339.1, intranetId: 14103, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x250 NO": { plnPrice: 6210.036, plnMargin: 2217.87, intranetId: 14107, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x250 PD": { plnPrice: 3538.78, plnMargin: 1263.85, intranetId: 14099, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x250 PK": { plnPrice: 3275.944, plnMargin: 1169.98, intranetId: 14095, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 200x250 PO": { plnPrice: 5545.064, plnMargin: 1980.38, intranetId: 14101, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x200 ND": { plnPrice: 3865.26, plnMargin: 1380.45, intranetId: 14118, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x200 NK": { plnPrice: 3655.288, plnMargin: 1305.46, intranetId: 14116, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x200 PD": { plnPrice: 3982.692, plnMargin: 1422.39, intranetId: 14112, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x200 PD (bez wydruku)": { plnPrice: 3531.556, plnMargin: 1261.27, intranetId: 14113, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x200 PK": { plnPrice: 3508.54, plnMargin: 1253.05, intranetId: 14109, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x200 PO": { plnPrice: 5988.052, plnMargin: 2138.59, intranetId: 14115, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x200 PO (bez wydruku)": { plnPrice: 5536.888, plnMargin: 1977.46, intranetId: 14114, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x250 ND": { plnPrice: 4369.288, plnMargin: 1560.46, intranetId: 14129, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x250 NK": { plnPrice: 4062.912, plnMargin: 1451.04, intranetId: 14127, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x250 PD": { plnPrice: 4123.532, plnMargin: 1472.69, intranetId: 14126, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x250 PD (bez wydruku)": { plnPrice: 3666.936, plnMargin: 1309.62, intranetId: 14125, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 300x250 PK": { plnPrice: 4140.304, plnMargin: 1478.68, intranetId: 14122, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 400x200 ND": { plnPrice: 4724.048, plnMargin: 1687.16, intranetId: 14136, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 400x250 ND": { plnPrice: 4862.984, plnMargin: 1736.78, intranetId: 14147, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 400x250 NO": { plnPrice: 8472.744, plnMargin: 3025.98, intranetId: 14149, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 400x250 PD": { plnPrice: 4760.588, plnMargin: 1700.21, intranetId: 14140, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 500x250 ND": { plnPrice: 5691.056, plnMargin: 2032.52, intranetId: 14167, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 500x250 PD": { plnPrice: 6350.456, plnMargin: 2268.02, intranetId: 14161, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 600x250 ND": { plnPrice: 6711.264, plnMargin: 2396.88, intranetId: 14185, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD 600x250 PD": { plnPrice: 6966.82, plnMargin: 2488.15, intranetId: 14181, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD LCD [ ] dzielona grafika": { plnPrice: 4110.876, plnMargin: 1468.17, intranetId: 18563, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMD LCD L dzielona grafika": { plnPrice: 2493.568, plnMargin: 890.56, intranetId: 18524, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 100x200 PD": { plnPrice: 2127.916, plnMargin: 759.97, intranetId: 14441, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 100x250 PD": { plnPrice: 2469.544, plnMargin: 881.98, intranetId: 14449, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 150x250 ND": { plnPrice: 2686.684, plnMargin: 959.53, intranetId: 14456, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 150x250 NO": { plnPrice: 3012.996, plnMargin: 1076.07, intranetId: 14458, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 200x250 PK": { plnPrice: 3060.4, plnMargin: 1093, intranetId: 14467, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 300x200 ND": { plnPrice: 3930.556, plnMargin: 1403.77, intranetId: 14475, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 300x200 PK": { plnPrice: 3468.948, plnMargin: 1238.91, intranetId: 14473, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 300x250 ND": { plnPrice: 4025.7, plnMargin: 1437.75, intranetId: 14481, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 500x200 NO": { plnPrice: 6752.928, plnMargin: 2411.76, intranetId: 14767, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMS 600x250 ND": { plnPrice: 6736.8, plnMargin: 2406, intranetId: 14776, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMSM 100x100 NK": { plnPrice: 1172.08, plnMargin: 418.6, intranetId: 14683, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMSM 100x200 ND": { plnPrice: 1785.924, plnMargin: 637.83, intranetId: 14690, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMSM 100x200 PD": { plnPrice: 1648.584, plnMargin: 588.78, intranetId: 14692, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMSM 150x200 ND (bez wydruku)": { plnPrice: 1877.12, plnMargin: 670.4, intranetId: 15174, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMSM 80x140 ND": { plnPrice: 1145.788, plnMargin: 409.21, intranetId: 14704, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "adFrame LMSM 80x140 NK": { plnPrice: 1145.816, plnMargin: 409.22, intranetId: 14705, category: "ramy tekstylne standard podświetlane", origin: "Polska" },
  "ekspres do kawy RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17153, category: "rental", origin: "Polska" },
  "lodówka RENTAL": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 16540, category: "rental", origin: "Polska" },
  "mFrame CLAMP CONNECTOR PLASTIC RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 18958, category: "rental", origin: "Polska" },
  "mFrame CLAMP CONNECTOR RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17229, category: "rental", origin: "Chiny" },
  "mFrame MASKOWNICA PŁASKA 2480 Stan": { plnPrice: 125.216, plnMargin: 44.72, intranetId: 18688, category: "rental", origin: "Polska" },
  "mFrame MASKOWNICA PŁASKA 992": { plnPrice: 31.612, plnMargin: 11.29, intranetId: 18910, category: "rental", origin: "Polska" },
  "mFrame PIN SUPERSLIM 7CM RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17291, category: "rental", origin: "Chiny" },
  "mFrame RAMA 496x1488 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16200, category: "rental", origin: "Chiny" },
  "mFrame RAMA 496x1984 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16201, category: "rental", origin: "Chiny" },
  "mFrame RAMA 496x2480 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15518, category: "rental", origin: "Chiny" },
  "mFrame RAMA 496x2976 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17328, category: "rental", origin: "Chiny" },
  "mFrame RAMA 496x992 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15333, category: "rental", origin: "Chiny" },
  "mFrame RAMA 992x1488 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15335, category: "rental", origin: "Chiny" },
  "mFrame RAMA 992x2480 DRZWI NEW RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19099, category: "rental", origin: "Polska" },
  "mFrame RAMA 992x2480 DRZWI RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 16107, category: "rental", origin: "Chiny" },
  "mFrame RAMA 992x2480 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15336, category: "rental", origin: "Chiny" },
  "mFrame RAMA 992x2976 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17278, category: "rental", origin: "Chiny" },
  "mFrame RAMA 992x992 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15332, category: "rental", origin: "Chiny" },
  "mFrame RAMA ŁUK 496x992 RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 15519, category: "rental", origin: "Chiny" },
  "Podstawa do Krzesła Boliwia kolor czarny RENTAL": { plnPrice: 87.388, plnMargin: 31.21, intranetId: 17510, category: "rental", origin: "Polska" },
  "TELEWIZOR LCD 43\" RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 16526, category: "rental", origin: "Polska" },
  "wieszak na ubrania RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 17738, category: "rental", origin: "Polska" },
  "adStand Basic 85 (bez wydruku)": { plnPrice: 93.016, plnMargin: 33.22, intranetId: 19075, category: "rollupy", origin: "Polska" },
  "Adstand Drop - 100 (bez wydruku)": { plnPrice: 276.444, plnMargin: 98.73, intranetId: 18443, category: "rollupy", origin: "Polska" },
  "Adstand Drop - 85 (bez wydruku)": { plnPrice: 253.428, plnMargin: 90.51, intranetId: 18442, category: "rollupy", origin: "Polska" },
  "adStand Drop 100": { plnPrice: 338.38, plnMargin: 120.85, intranetId: 18660, category: "rollupy", origin: "Polska" },
  "adStand Drop 120": { plnPrice: 399.336, plnMargin: 142.62, intranetId: 18662, category: "rollupy", origin: "Polska" },
  "adStand Drop 85": { plnPrice: 307.412, plnMargin: 109.79, intranetId: 18661, category: "rollupy", origin: "Polska" },
  "adStand Eco 100": { plnPrice: 206.584, plnMargin: 73.78, intranetId: 10205, category: "rollupy", origin: "Polska" },
  "adStand Eco 85": { plnPrice: 189.28, plnMargin: 67.6, intranetId: 10206, category: "rollupy", origin: "Polska" },
  "adStand Level 85": { plnPrice: 678.384, plnMargin: 242.28, intranetId: 10176, category: "rollupy", origin: "Polska" },
  "adStand Light 85": { plnPrice: 144.984, plnMargin: 51.78, intranetId: 12261, category: "rollupy", origin: "Polska" },
  "adStand Light 85 (bez wydruku)": { plnPrice: 91, plnMargin: 32.5, intranetId: 12262, category: "rollupy", origin: "Chiny" },
  "adStand Lux 100": { plnPrice: 275.828, plnMargin: 98.51, intranetId: 10092, category: "rollupy", origin: "Polska" },
  "adStand Lux 100 (bez wydruku)": { plnPrice: 213.892, plnMargin: 76.39, intranetId: 10093, category: "rollupy", origin: "Chiny" },
  "adStand Lux 120": { plnPrice: 395.808, plnMargin: 141.36, intranetId: 10178, category: "rollupy", origin: "Polska" },
  "adStand Lux 85": { plnPrice: 243.6, plnMargin: 87, intranetId: 10200, category: "rollupy", origin: "Polska" },
  "adStand Octa 85": { plnPrice: 352.968, plnMargin: 126.06, intranetId: 19409, category: "rollupy", origin: "Polska" },
  "adStand Premium 100": { plnPrice: 562.016, plnMargin: 200.72, intranetId: 9, category: "rollupy", origin: "Polska" },
  "adStand Premium 120": { plnPrice: 607.488, plnMargin: 216.96, intranetId: 10, category: "rollupy", origin: "Polska" },
  "adStand Premium 150": { plnPrice: 754.068, plnMargin: 269.31, intranetId: 10133, category: "rollupy", origin: "Polska" },
  "adStand Premium 85": { plnPrice: 462.924, plnMargin: 165.33, intranetId: 7, category: "rollupy", origin: "Polska" },
  "Adstand Premium CN 100 (bez wydruku)": { plnPrice: 500.08, plnMargin: 178.6, intranetId: 18439, category: "rollupy", origin: "Chiny" },
  "adStand R3 Black 100": { plnPrice: 181.16, plnMargin: 64.7, intranetId: 19160, category: "rollupy", origin: "Polska" },
  "adStand R3 Black 85": { plnPrice: 147.98, plnMargin: 52.85, intranetId: 19159, category: "rollupy", origin: "Polska" },
  "adStand R3 Black 85 (bez wydruku)": { plnPrice: 93.996, plnMargin: 33.57, intranetId: 19079, category: "rollupy", origin: "Polska" },
  "adStand Twins 85": { plnPrice: 438.424, plnMargin: 156.58, intranetId: 10098, category: "rollupy", origin: "Polska" },
  "POKAZÓWKA_adStand Basic 85": { plnPrice: 0, plnMargin: 0, intranetId: 19345, category: "rollupy", origin: "Polska" },
  "Listwa adStand ECO/LUX/TWINS/R3 100": { plnPrice: 9.24, plnMargin: 3.3, intranetId: 12242, category: "rollupy akcesoria", origin: "Polska" },
  "Listwa L150 G / Adstand 150 pomalowana": { plnPrice: 63.14, plnMargin: 22.55, intranetId: 11412, category: "rollupy akcesoria", origin: "Polska" },
  "Listwa L200 D pomalowana": { plnPrice: 85.372, plnMargin: 30.49, intranetId: 11417, category: "rollupy akcesoria", origin: "Polska" },
  "Torba adStand 100": { plnPrice: 48.076, plnMargin: 17.17, intranetId: 10156, category: "rollupy akcesoria", origin: "Chiny" },
  "Torba adStand 150": { plnPrice: 102.564, plnMargin: 36.63, intranetId: 10158, category: "rollupy akcesoria", origin: "Chiny" },
  "Torba L150": { plnPrice: 258.3, plnMargin: 92.25, intranetId: 10220, category: "rollupy akcesoria", origin: "Chiny" },
  "Torba L200": { plnPrice: 206.416, plnMargin: 73.72, intranetId: 10221, category: "rollupy akcesoria", origin: "Chiny" },
  "adBox Elypse": { plnPrice: 1098.272, plnMargin: 392.24, intranetId: 10112, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Elypse (bez wydruku)": { plnPrice: 947.744, plnMargin: 338.48, intranetId: 10131, category: "stoiska degustacyjne", origin: "Chiny" },
  "adBox Elypse Mini": { plnPrice: 960.96, plnMargin: 343.2, intranetId: 10113, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Elypse Mini (bez wydruku)": { plnPrice: 780.92, plnMargin: 278.9, intranetId: 10138, category: "stoiska degustacyjne", origin: "Chiny" },
  "adBox Hit": { plnPrice: 1013.488, plnMargin: 361.96, intranetId: 17, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Hit (bez wydruku)": { plnPrice: 839.524, plnMargin: 299.83, intranetId: 10016, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Hit C": { plnPrice: 1241.604, plnMargin: 443.43, intranetId: 10359, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Hit Mini": { plnPrice: 948.668, plnMargin: 338.81, intranetId: 10103, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Ring": { plnPrice: 1018.556, plnMargin: 363.77, intranetId: 10275, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Standard": { plnPrice: 2354.24, plnMargin: 840.8, intranetId: 18, category: "stoiska degustacyjne", origin: "Polska" },
  "adBox Elypse blat": { plnPrice: 206.724, plnMargin: 73.83, intranetId: 11336, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "adbox Elypse Mini toper": { plnPrice: 46.788, plnMargin: 16.71, intranetId: 11918, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "adBox Elypse toper": { plnPrice: 77.112, plnMargin: 27.54, intranetId: 10274, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "adBox Ring toper": { plnPrice: 47.852, plnMargin: 17.09, intranetId: 11909, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "adBox Standard blat": { plnPrice: 283.864, plnMargin: 101.38, intranetId: 11343, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "adBox Standard toper": { plnPrice: 46.788, plnMargin: 16.71, intranetId: 11919, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "AS Maszt CN (zestaw 2 szt)": { plnPrice: 59.276, plnMargin: 21.17, intranetId: 18599, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "ELYPSE komplet blat+półka CN": { plnPrice: 340.928, plnMargin: 121.76, intranetId: 18622, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "kółko fi 40 oś gwint M8 z hamulcem": { plnPrice: 1.092, plnMargin: 0.39, intranetId: 12358, category: "stoiska degustacyjne akcesoria", origin: "Polska" },
  "adFolder A4 (bez wydruku)": { plnPrice: 379, plnMargin: 135.36, intranetId: 10094, category: "stojaki reklamowe", origin: "Polska" },
  "adFolder A4": { plnPrice: 379, plnMargin: 135.36, intranetId: 10094, category: "stojaki reklamowe", origin: "Polska" },
  "adFolder A4 z nadstawką": { plnPrice: 602, plnMargin: 215, intranetId: 19107, category: "stojaki reklamowe", origin: "Polska" },
  "adFolder Premium (bez wydruku)": { plnPrice: 882.056, plnMargin: 315.02, intranetId: 10259, category: "stojaki reklamowe", origin: "Chiny" },
  "adFolder Prestige 4 komory (bez wydruku)": { plnPrice: 769.58, plnMargin: 274.85, intranetId: 13932, category: "stojaki reklamowe", origin: "Chiny" },
  "adFolder Prestige 4 komory z nadstawką": { plnPrice: 804.104, plnMargin: 287.18, intranetId: 19108, category: "stojaki reklamowe", origin: "Polska" },
  "adFolder A4 nadstawka": { plnPrice: 75.936, plnMargin: 27.12, intranetId: 12315, category: "stojaki reklamowe akcesoria", origin: "Polska" },
  "adFolder A4 nadstawka (bez wydruku)": { plnPrice: 64.736, plnMargin: 23.12, intranetId: 12312, category: "stojaki reklamowe akcesoria", origin: "Polska" },
  "Worek na wydruki M (50*70cm)": { plnPrice: 0.756, plnMargin: 0.27, intranetId: 12431, category: "stojaki reklamowe akcesoria", origin: "Polska" },
  "adFrame CTF 100x100x100 Hanging LED": { plnPrice: 1869.364, plnMargin: 667.63, intranetId: 15225, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF 100x100x100 Hanging LED (bez wydruku)": { plnPrice: 1225.196, plnMargin: 437.57, intranetId: 15226, category: "systemy podwieszane", origin: "Chiny" },
  "adFrame CTF 100x100x100 LED": { plnPrice: 1729.392, plnMargin: 617.64, intranetId: 17928, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF 100x100x100 LED (bez wydruku)": { plnPrice: 1086.596, plnMargin: 388.07, intranetId: 17926, category: "systemy podwieszane", origin: "Chiny" },
  "adFrame CTF 150x100x150 Hanging": { plnPrice: 1811.096, plnMargin: 646.82, intranetId: 15839, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF 150x100x150 Hanging LED": { plnPrice: 2842.448, plnMargin: 1015.16, intranetId: 15227, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF 150x100x150 Hanging LED (bez wydruku)": { plnPrice: 2228.688, plnMargin: 795.96, intranetId: 15228, category: "systemy podwieszane", origin: "Chiny" },
  "adFrame CTF 150x150x150 Hanging": { plnPrice: 2067.8, plnMargin: 738.5, intranetId: 15842, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF 150x150x150 Hanging LED": { plnPrice: 3064.404, plnMargin: 1094.43, intranetId: 15229, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF 150x150x150 Hanging LED (bez wydruku)": { plnPrice: 2314.032, plnMargin: 826.44, intranetId: 15230, category: "systemy podwieszane", origin: "Chiny" },
  "adFrame CTF Hanging": { plnPrice: 2387.98, plnMargin: 852.85, intranetId: 18690, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF Hanging LED": { plnPrice: 1852.564, plnMargin: 661.63, intranetId: 16131, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF LED": { plnPrice: 1556.548, plnMargin: 555.91, intranetId: 18924, category: "systemy podwieszane", origin: "Polska" },
  "adFrame CTF LED (bez wydruku)": { plnPrice: 1047.06, plnMargin: 373.95, intranetId: 18925, category: "systemy podwieszane", origin: "Polska" },
  "adFrame LMD 100x100 PK Hanging": { plnPrice: 1398.656, plnMargin: 499.52, intranetId: 14719, category: "systemy podwieszane", origin: "Polska" },
  "adFrame LMD 100x300 ND Hanging": { plnPrice: 3010.308, plnMargin: 1075.11, intranetId: 14744, category: "systemy podwieszane", origin: "Polska" },
  "adFrame LMD 100x300 PK Hanging": { plnPrice: 2253.72, plnMargin: 804.9, intranetId: 14746, category: "systemy podwieszane", origin: "Polska" },
  "adFrame LMD 70x100 (B1) ND Hanging": { plnPrice: 1266.272, plnMargin: 452.24, intranetId: 14748, category: "systemy podwieszane", origin: "Polska" },
  "adFrame LMD 85x200 (A1) PD Hanging": { plnPrice: 2195.2, plnMargin: 784, intranetId: 14755, category: "systemy podwieszane", origin: "Polska" },
  "adUp Vario Quadfloat (bez wydruku)": { plnPrice: 1772.876, plnMargin: 633.17, intranetId: 10915, category: "systemy podwieszane", origin: "Chiny" },
  "adUp Vario Quadfloat dwustronne": { plnPrice: 4273.472, plnMargin: 1526.24, intranetId: 12623, category: "systemy podwieszane", origin: "Polska" },
  "adUp Vario Quadfloat jednostronne": { plnPrice: 4273.472, plnMargin: 1526.24, intranetId: 10911, category: "systemy podwieszane", origin: "Polska" },
  "adUp Vario Ringfloat (bez wydruku)": { plnPrice: 1219.4, plnMargin: 435.5, intranetId: 10916, category: "systemy podwieszane", origin: "Chiny" },
  "adUp Vario Ringfloat dwustronne": { plnPrice: 1712.312, plnMargin: 611.54, intranetId: 12627, category: "systemy podwieszane", origin: "Polska" },
  "adUp Vario Ringfloat jednostronne": { plnPrice: 1712.312, plnMargin: 611.54, intranetId: 10912, category: "systemy podwieszane", origin: "Polska" },
  "adUp Vario Trapfloat dwustronne": { plnPrice: 1720.852, plnMargin: 614.59, intranetId: 12645, category: "systemy podwieszane", origin: "Polska" },
  "adUp Vario Trifloat dwustronne": { plnPrice: 2741.2, plnMargin: 979, intranetId: 12647, category: "systemy podwieszane", origin: "Polska" },
  "adFrame - zestaw do podwieszenia 2m (1 PKT) do ZP": { plnPrice: 39.172, plnMargin: 13.99, intranetId: 17758, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "adFrame - zestaw do podwieszenia ∅2mm": { plnPrice: 81.004, plnMargin: 28.93, intranetId: 11871, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "adFrame CTF - zestaw do podwieszenia 2m (4 PKT) do MO": { plnPrice: 138.628, plnMargin: 49.51, intranetId: 17790, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "adFrame CTF - zestaw do podwieszenia 2m (4 PKT) do ZP": { plnPrice: 156.688, plnMargin: 55.96, intranetId: 17793, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "Karabińczyk DIN5299": { plnPrice: 1.848, plnMargin: 0.66, intranetId: 11907, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "Linka stalowa ∅2mm": { plnPrice: 1.148, plnMargin: 0.41, intranetId: 11872, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "mFrame - zestaw do podwieszenia 2m (1 PKT)": { plnPrice: 67.116, plnMargin: 23.97, intranetId: 18581, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "Zacisk do linki ∅1,4-2,2mm SMALL": { plnPrice: 9.492, plnMargin: 3.39, intranetId: 11874, category: "systemy podwieszane akcesoria", origin: "Polska" },
  "adColumn Air ∅60x100 ver2": { plnPrice: 954.1, plnMargin: 340.75, intranetId: 18678, category: "słupy", origin: "Polska" },
  "adColumn Air ∅60x220": { plnPrice: 602.168, plnMargin: 215.06, intranetId: 11604, category: "słupy", origin: "Chiny" },
  "adColumn Air ∅60x220 - ver TPU (bez wydruku)": { plnPrice: 694.4, plnMargin: 248, intranetId: 18142, category: "słupy", origin: "Chiny" },
  "adColumn Air ∅60x220 ver2": { plnPrice: 845.096, plnMargin: 301.82, intranetId: 18475, category: "słupy", origin: "Chiny" },
  "adColumn Air ∅60x320": { plnPrice: 899.5, plnMargin: 321.25, intranetId: 17706, category: "słupy", origin: "Chiny" },
  "adColumn Air ∅60x320 - ver TPU (bez wydruku)": { plnPrice: 813.54, plnMargin: 290.55, intranetId: 18143, category: "słupy", origin: "Chiny" },
  "adColumn Air ∅60x320 TPU": { plnPrice: 480.088, plnMargin: 171.46, intranetId: 15746, category: "słupy", origin: "Chiny" },
  "adColumn Air ∅60x320 ver2": { plnPrice: 1190.896, plnMargin: 425.32, intranetId: 18471, category: "słupy", origin: "Chiny" },
  "adTribune Air ∅60x100 Tribune ver2": { plnPrice: 969.108, plnMargin: 346.11, intranetId: 18476, category: "słupy", origin: "Polska" },
  "adBlanket 145x200cm": { plnPrice: 159.908, plnMargin: 57.11, intranetId: 15735, category: "tekstylia użytkowe", origin: "Polska" },
  "adTowel 150x200cm": { plnPrice: 266.392, plnMargin: 95.14, intranetId: 15604, category: "tekstylia użytkowe", origin: "Polska" },
  "adTowel 50x75cm": { plnPrice: 36.4, plnMargin: 13, intranetId: 15603, category: "tekstylia użytkowe", origin: "Polska" },
  "adTowel 75x100cm": { plnPrice: 68.852, plnMargin: 24.59, intranetId: 15602, category: "tekstylia użytkowe", origin: "Polska" },
  "adTowel 75x135cm": { plnPrice: 92.26, plnMargin: 32.95, intranetId: 15594, category: "tekstylia użytkowe", origin: "Polska" },
  "Ponczo": { plnPrice: 467.824, plnMargin: 167.08, intranetId: 15794, category: "tekstylia użytkowe", origin: "Polska" },
  "adTribune Big Quick": { plnPrice: 724.192, plnMargin: 258.64, intranetId: 10922, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Big Quick (bez wydruku)": { plnPrice: 590.884, plnMargin: 211.03, intranetId: 10923, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Big Quick LED": { plnPrice: 1036.924, plnMargin: 370.33, intranetId: 11478, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Big Quick LED (bez wydruku)": { plnPrice: 832.748, plnMargin: 297.41, intranetId: 11375, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Big Quick LED Auto": { plnPrice: 2648.884, plnMargin: 946.03, intranetId: 18510, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Big Quick LED Auto (bez wydruku)": { plnPrice: 2262.008, plnMargin: 807.86, intranetId: 18516, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Case": { plnPrice: 1225.868, plnMargin: 437.81, intranetId: 10298, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Elypse": { plnPrice: 961.884, plnMargin: 343.53, intranetId: 10010, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Elypse (bez wydruku)": { plnPrice: 888.496, plnMargin: 317.32, intranetId: 10045, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Elypse Mini": { plnPrice: 924.896, plnMargin: 330.32, intranetId: 10110, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Expo 100x100": { plnPrice: 1716.54, plnMargin: 613.05, intranetId: 17039, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Expo 100x100 (bez wydruku)": { plnPrice: 1633.016, plnMargin: 583.22, intranetId: 16966, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Expo 150x100": { plnPrice: 2126.572, plnMargin: 759.49, intranetId: 17401, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Expo 150x100 (bez wydruku)": { plnPrice: 2043.076, plnMargin: 729.67, intranetId: 17326, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Flex Expo": { plnPrice: 2213.4, plnMargin: 790.5, intranetId: 19291, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Flex Lock": { plnPrice: 3538.136, plnMargin: 1263.62, intranetId: 19290, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Flex Lock (bez wydruku)": { plnPrice: 3363.332, plnMargin: 1201.19, intranetId: 19760, category: "trybunki reklamowe", origin: "NULL" },
  "adTribune Hit": { plnPrice: 896.812, plnMargin: 320.29, intranetId: 10019, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Hit (bez wydruku)": { plnPrice: 769.664, plnMargin: 274.88, intranetId: 10027, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Hit C": { plnPrice: 981.932, plnMargin: 350.69, intranetId: 10360, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Hit Mini": { plnPrice: 891.66, plnMargin: 318.45, intranetId: 10105, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Hit Mini (bez wydruku)": { plnPrice: 776.86, plnMargin: 277.45, intranetId: 10106, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune inflate": { plnPrice: 2218.076, plnMargin: 792.17, intranetId: 19093, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune inflate (bez wydruku)": { plnPrice: 2128.28, plnMargin: 760.1, intranetId: 18834, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Oval": { plnPrice: 856.576, plnMargin: 305.92, intranetId: 10336, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Oval Maxi": { plnPrice: 1180.788, plnMargin: 421.71, intranetId: 11591, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Oval Maxi wydruk": { plnPrice: 146.832, plnMargin: 52.44, intranetId: 11592, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Pop-up Charger": { plnPrice: 1577.66, plnMargin: 563.45, intranetId: 18466, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Quick": { plnPrice: 573.636, plnMargin: 204.87, intranetId: 10436, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Quick (bez wydruku)": { plnPrice: 462.756, plnMargin: 165.27, intranetId: 10437, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Quick Kidney": { plnPrice: 718.872, plnMargin: 256.74, intranetId: 19265, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Quick Kidney LED": { plnPrice: 1071, plnMargin: 382.5, intranetId: 19268, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Quick Kidney LED (bez wydruku)": { plnPrice: 919.94, plnMargin: 328.55, intranetId: 19177, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Quick Round": { plnPrice: 611.576, plnMargin: 218.42, intranetId: 19271, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Quick Round LED": { plnPrice: 964.208, plnMargin: 344.36, intranetId: 19272, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Quick Round LED (bez wydruku)": { plnPrice: 813.176, plnMargin: 290.42, intranetId: 19176, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Seg - NIE SPRZEDAWAĆ": { plnPrice: 1804.544, plnMargin: 644.48, intranetId: 12056, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Seg NEW": { plnPrice: 1528.156, plnMargin: 545.77, intranetId: 17753, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Shell": { plnPrice: 1998.08, plnMargin: 713.6, intranetId: 10304, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Shell (bez wydruku)": { plnPrice: 1789.116, plnMargin: 638.97, intranetId: 10305, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Shell 2in1": { plnPrice: 5117.224, plnMargin: 1827.58, intranetId: 10442, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Shell 2in1 (bez wydruku)": { plnPrice: 5426.708, plnMargin: 1938.11, intranetId: 10443, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Smart LED SF": { plnPrice: 1674.568, plnMargin: 598.06, intranetId: 14725, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Smart LED SF (bez wydruku)": { plnPrice: 1507.548, plnMargin: 538.41, intranetId: 13607, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Standard": { plnPrice: 2037.616, plnMargin: 727.72, intranetId: 10030, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Standard (bez wydruku)": { plnPrice: 1865.22, plnMargin: 666.15, intranetId: 10031, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Starter": { plnPrice: 880.012, plnMargin: 314.29, intranetId: 18545, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Starter (bez wydruku)": { plnPrice: 650.216, plnMargin: 232.22, intranetId: 18115, category: "trybunki reklamowe", origin: "Chiny" },
  "adTribune Tube_OVAL": { plnPrice: 497.336, plnMargin: 177.62, intranetId: 18652, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Tube_OVAL (bez wydruku)": { plnPrice: 365.064, plnMargin: 130.38, intranetId: 18394, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Tube_SQUARE": { plnPrice: 582.232, plnMargin: 207.94, intranetId: 18653, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Tube_SQUARE (bez wydruku)": { plnPrice: 449.988, plnMargin: 160.71, intranetId: 18393, category: "trybunki reklamowe", origin: "Polska" },
  "COMBO adFrame Pop-up 100x200 and adTribune Pop-up": { plnPrice: 2951.48, plnMargin: 1054.1, intranetId: 18513, category: "trybunki reklamowe", origin: "Polska" },
  "COMBO adFrame Pop-up 100x200 and adTribune Pop-up incl. charging": { plnPrice: 3021.256, plnMargin: 1079.02, intranetId: 18514, category: "trybunki reklamowe", origin: "Polska" },
  "COMBO adFrame Starter 100x200 and adTribune Starter": { plnPrice: 1523.284, plnMargin: 544.03, intranetId: 18637, category: "trybunki reklamowe", origin: "Polska" },
  "POKAZÓWKA_adTribune Quick Kidney (bez wydruku)": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19462, category: "trybunki reklamowe", origin: "NULL" },
  "Pop-up Counter Lightbox 100x100": { plnPrice: 1507.884, plnMargin: 538.53, intranetId: 17861, category: "trybunki reklamowe", origin: "Polska" },
  "Pop-up Counter Lightbox 100x100 (bez wydruku)": { plnPrice: 1341.956, plnMargin: 479.27, intranetId: 17788, category: "trybunki reklamowe", origin: "Chiny" },
  "Pop-up Counter Lightbox 100x100 incl. charging (bez wydruku)": { plnPrice: 1411.76, plnMargin: 504.2, intranetId: 18140, category: "trybunki reklamowe", origin: "Chiny" },
  "Wydruk bok adTribune Starter": { plnPrice: 62.552, plnMargin: 22.34, intranetId: 18546, category: "trybunki reklamowe", origin: "Polska" },
  "Wydruk front adTribune Starter": { plnPrice: 104.804, plnMargin: 37.43, intranetId: 18547, category: "trybunki reklamowe", origin: "Polska" },
  "Wydruk komplet adTribune Starter": { plnPrice: 229.824, plnMargin: 82.08, intranetId: 18548, category: "trybunki reklamowe", origin: "Polska" },
  "adTribune Elypse komplet blat+półka": { plnPrice: 335.552, plnMargin: 119.84, intranetId: 17461, category: "trybunki reklamowe akcesoria", origin: "Polska" },
  "adTribune Elypse Mini blat": { plnPrice: 163.24, plnMargin: 58.3, intranetId: 10376, category: "trybunki reklamowe akcesoria", origin: "Polska" },
  "adTribune Shell 2in1 blat": { plnPrice: 1848.448, plnMargin: 660.16, intranetId: 11301, category: "trybunki reklamowe akcesoria", origin: "Chiny" },
  "adTribune Shell blat": { plnPrice: 316.904, plnMargin: 113.18, intranetId: 16143, category: "trybunki reklamowe akcesoria", origin: "Chiny" },
  "adTribune Starter blat": { plnPrice: 168.952, plnMargin: 60.34, intranetId: 18780, category: "trybunki reklamowe akcesoria", origin: "Polska" },
  "Kółko Hit": { plnPrice: 0.392, plnMargin: 0.14, intranetId: 10249, category: "trybunki reklamowe akcesoria", origin: "Polska" },
  "Półka - Elypse Mini": { plnPrice: 132.44, plnMargin: 47.3, intranetId: 10372, category: "trybunki reklamowe akcesoria", origin: "Chiny" },
  "Półka - Hit/Hit C": { plnPrice: 157.08, plnMargin: 56.1, intranetId: 11346, category: "trybunki reklamowe akcesoria", origin: "Chiny" },
  "Torba Elypse": { plnPrice: 127.12, plnMargin: 45.4, intranetId: 10159, category: "trybunki reklamowe akcesoria", origin: "Chiny" },
  "Torba Hit": { plnPrice: 119.728, plnMargin: 42.76, intranetId: 10161, category: "trybunki reklamowe akcesoria", origin: "Chiny" },
  "Malowanie proszkowe": { plnPrice: 0, plnMargin: 0, intranetId: 11906, category: "usługi", origin: "Polska" },
  "Pakowanie palety - Magazyn": { plnPrice: 25, plnMargin: 0, intranetId: 12153, category: "usługi", origin: "Polska" },
  "Pakowanie palety - Vario": { plnPrice: 50, plnMargin: 0, intranetId: 12149, category: "usługi", origin: "Polska" },
  "Pakowanie palety - Zabudowy": { plnPrice: 100, plnMargin: 0, intranetId: 12148, category: "usługi", origin: "Polska" },
  "Paletyzacja": { plnPrice: 0, plnMargin: 0, intranetId: 17177, category: "usługi", origin: "Polska" },
  "Transport": { plnPrice: 0, plnMargin: 0, intranetId: 42, category: "usługi", origin: "Polska" },
  "Usługi inne": { plnPrice: 0, plnMargin: 0, intranetId: 45, category: "usługi", origin: "Polska" },
  "Projekt graficzny": { plnPrice: 0, plnMargin: 0, intranetId: 55, category: "usługi graficzne", origin: "Polska" },
  "Sprawdzenie do druku": { plnPrice: 0, plnMargin: 0, intranetId: 2, category: "usługi graficzne", origin: "Polska" },
  "Sprawdzenie do druku zaawansowane": { plnPrice: 0, plnMargin: 0, intranetId: 17783, category: "usługi graficzne", origin: "Polska" },
  "Usługi graficzne": { plnPrice: 0, plnMargin: 0, intranetId: 10011, category: "usługi graficzne", origin: "Polska" },
  "WIZUALIZACJA": { plnPrice: 0, plnMargin: 0, intranetId: 16362, category: "usługi graficzne", origin: "Polska" },
  "Montaż / Demontaż [min]": { plnPrice: 1.67, plnMargin: 0, intranetId: 10822, category: "usługi montażu", origin: "Polska" },
  "Montaż / Demontaż u klienta": { plnPrice: 0, plnMargin: 0, intranetId: 15592, category: "usługi montażu", origin: "Polska" },
  "Oczko stalowe M6": { plnPrice: 2.548, plnMargin: 0.91, intranetId: 11882, category: "usługi montażu", origin: "Chiny" },
  "Usługa montażu stoiska targowego": { plnPrice: 0, plnMargin: 0, intranetId: 17404, category: "usługi montażu", origin: "Polska" },
  "adTribune Big Quick LED RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19360, category: "vario akcesoria", origin: "Polska" },
  "adWall Vario LED - mocowanie fi34 (Black)": { plnPrice: 32.2, plnMargin: 11.5, intranetId: 11812, category: "vario akcesoria", origin: "Polska" },
  "adWall Vario LED - mocowanie fi34 (Silver)": { plnPrice: 32.2, plnMargin: 11.5, intranetId: 11813, category: "vario akcesoria", origin: "Polska" },
  "adWall Vario LED - mocowanie fi43 (Silver)": { plnPrice: 24.164, plnMargin: 8.63, intranetId: 11855, category: "vario akcesoria", origin: "Polska" },
  "Kabel zasilający do zasilacza wew / adFrame Quick": { plnPrice: 33.712, plnMargin: 12.04, intranetId: 17392, category: "vario akcesoria", origin: "Polska" },
  "Lampka LED 116 czarna": { plnPrice: 544.936, plnMargin: 194.62, intranetId: 11853, category: "vario akcesoria", origin: "Chiny" },
  "Lampka LED 116 srebrna": { plnPrice: 237.524, plnMargin: 84.83, intranetId: 11519, category: "vario akcesoria", origin: "Chiny" },
  "Lampka LED 50 czarna": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 11851, category: "vario akcesoria", origin: "Chiny" },
  "Lampka LED 50 srebrna": { plnPrice: 182.784, plnMargin: 65.28, intranetId: 11847, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do mFrame 116 srebrna": { plnPrice: 330.204, plnMargin: 117.93, intranetId: 17780, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Multiframe 116 czarna": { plnPrice: 555.632, plnMargin: 198.44, intranetId: 17777, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Multiframe 60 czarna": { plnPrice: 190.932, plnMargin: 68.19, intranetId: 17778, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Vario Light 116 czarna": { plnPrice: 577.136, plnMargin: 206.12, intranetId: 17761, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Vario Light 116 srebrna": { plnPrice: 269.724, plnMargin: 96.33, intranetId: 17772, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Vario Light 60 czarna": { plnPrice: 212.436, plnMargin: 75.87, intranetId: 17774, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Vario Light 60 srebrna": { plnPrice: 214.984, plnMargin: 76.78, intranetId: 17773, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Vario Premium 116 srebrna": { plnPrice: 261.716, plnMargin: 93.47, intranetId: 17775, category: "vario akcesoria", origin: "Chiny" },
  "Oświetlenie do Vario Premium 60 srebrna": { plnPrice: 206.948, plnMargin: 73.91, intranetId: 17776, category: "vario akcesoria", origin: "Chiny" },
  "Torba do Vario Light 240/300/400 z kółkami": { plnPrice: 328.244, plnMargin: 117.23, intranetId: 16033, category: "vario akcesoria", origin: "Chiny" },
  "Vario Light przedłużka prosta": { plnPrice: 25.816, plnMargin: 9.22, intranetId: 16160, category: "vario akcesoria", origin: "Polska" },
  "Vario Light przedłużka supportu": { plnPrice: 13.468, plnMargin: 4.81, intranetId: 16161, category: "vario akcesoria", origin: "Polska" },
  "adWall Vario Add lewy dwustronne": { plnPrice: 1155, plnMargin: 412.5, intranetId: 13601, category: "vario crazy", origin: "Polska" },
  "adWall Vario Add prawy dwustronne": { plnPrice: 1155, plnMargin: 412.5, intranetId: 15865, category: "vario crazy", origin: "Polska" },
  "adWall Vario Arch (zestaw A+B - bez wydruku)": { plnPrice: 3339.308, plnMargin: 1192.61, intranetId: 15598, category: "vario crazy", origin: "Chiny" },
  "adWall Vario Arch (zestaw A+B)": { plnPrice: 4715.676, plnMargin: 1684.17, intranetId: 12501, category: "vario crazy", origin: "Polska" },
  "adWall Vario Arch A": { plnPrice: 2357.824, plnMargin: 842.08, intranetId: 10558, category: "vario crazy", origin: "Polska" },
  "adWall Vario Arch C": { plnPrice: 2252.376, plnMargin: 804.42, intranetId: 10924, category: "vario crazy", origin: "Polska" },
  "adWall Vario Arch C (bez wydruku)": { plnPrice: 1447.012, plnMargin: 516.79, intranetId: 10925, category: "vario crazy", origin: "Chiny" },
  "adWall Vario Big Island dwustronne": { plnPrice: 3967.992, plnMargin: 1417.14, intranetId: 12503, category: "vario crazy", origin: "Polska" },
  "adWall Vario Bow": { plnPrice: 2803.108, plnMargin: 1001.11, intranetId: 11085, category: "vario crazy", origin: "Polska" },
  "adWall Vario Bow (bez wydruku)": { plnPrice: 1560.272, plnMargin: 557.24, intranetId: 11075, category: "vario crazy", origin: "Chiny" },
  "adWall Vario C-wall dwustronne": { plnPrice: 1692.152, plnMargin: 604.34, intranetId: 12517, category: "vario crazy", origin: "Polska" },
  "adWall Vario Cone jednostronne": { plnPrice: 4189.724, plnMargin: 1496.33, intranetId: 11073, category: "vario crazy", origin: "Polska" },
  "adWall Vario Craft dwustronne": { plnPrice: 4222.904, plnMargin: 1508.18, intranetId: 12515, category: "vario crazy", origin: "Polska" },
  "adWall Vario Craft jednostronne": { plnPrice: 4222.904, plnMargin: 1508.18, intranetId: 10434, category: "vario crazy", origin: "Polska" },
  "adWall Vario Fall dwustronne": { plnPrice: 1712.592, plnMargin: 611.64, intranetId: 12519, category: "vario crazy", origin: "Polska" },
  "adWall Vario Fall jednostronne": { plnPrice: 1712.592, plnMargin: 611.64, intranetId: 10329, category: "vario crazy", origin: "Polska" },
  "adWall Vario Flat Ring (bez wydruku)": { plnPrice: 549.388, plnMargin: 196.21, intranetId: 16191, category: "vario crazy", origin: "Chiny" },
  "adWall Vario Flat Ring dwustronne": { plnPrice: 881.384, plnMargin: 314.78, intranetId: 16355, category: "vario crazy", origin: "Polska" },
  "adWall Vario Flat Ring jednostronne": { plnPrice: 881.384, plnMargin: 314.78, intranetId: 16211, category: "vario crazy", origin: "Polska" },
  "adWall Vario Flat Ring Water Base dwustronny": { plnPrice: 1047.928, plnMargin: 374.26, intranetId: 16214, category: "vario crazy", origin: "Polska" },
  "adWall Vario Flat Ring Water Base jednostronny": { plnPrice: 1047.928, plnMargin: 374.26, intranetId: 16439, category: "vario crazy", origin: "Polska" },
  "adWall Vario Gate": { plnPrice: 3142.86, plnMargin: 1122.45, intranetId: 10425, category: "vario crazy", origin: "Polska" },
  "adWall Vario Gate (bez wydruku)": { plnPrice: 1478.148, plnMargin: 527.91, intranetId: 10424, category: "vario crazy", origin: "Chiny" },
  "adWall Vario In": { plnPrice: 2874.172, plnMargin: 1026.49, intranetId: 10338, category: "vario crazy", origin: "Polska" },
  "adWall Vario Island dwustronne": { plnPrice: 2337.02, plnMargin: 834.65, intranetId: 12523, category: "vario crazy", origin: "Polska" },
  "adWall Vario Peak dwustronne": { plnPrice: 2126.012, plnMargin: 759.29, intranetId: 12569, category: "vario crazy", origin: "Polska" },
  "adWall Vario Peak jednostronne": { plnPrice: 2126.012, plnMargin: 759.29, intranetId: 10346, category: "vario crazy", origin: "Polska" },
  "adWall Vario Qring dwustronne": { plnPrice: 1553.328, plnMargin: 554.76, intranetId: 12621, category: "vario crazy", origin: "Polska" },
  "adWall Vario Qring jednostronne": { plnPrice: 1553.328, plnMargin: 554.76, intranetId: 10560, category: "vario crazy", origin: "Polska" },
  "adWall Vario Ring (bez wydruku)": { plnPrice: 1013.908, plnMargin: 362.11, intranetId: 10328, category: "vario crazy", origin: "Chiny" },
  "adWall Vario Ring dwustronne": { plnPrice: 1655.22, plnMargin: 591.15, intranetId: 12625, category: "vario crazy", origin: "Polska" },
  "adWall Vario Ring jednostronne": { plnPrice: 1655.22, plnMargin: 591.15, intranetId: 10327, category: "vario crazy", origin: "Polska" },
  "adWall Vario S 100 dwustronne": { plnPrice: 929.936, plnMargin: 332.12, intranetId: 12631, category: "vario crazy", origin: "Polska" },
  "adWall Vario S 100 jednostronne": { plnPrice: 929.936, plnMargin: 332.12, intranetId: 10323, category: "vario crazy", origin: "Polska" },
  "adWall Vario S 120 (bez wydruku)": { plnPrice: 654.36, plnMargin: 233.7, intranetId: 10350, category: "vario crazy", origin: "Chiny" },
  "adWall Vario S 120 dwustronne": { plnPrice: 951.776, plnMargin: 339.92, intranetId: 12633, category: "vario crazy", origin: "Polska" },
  "adWall Vario S 150 dwustronne": { plnPrice: 1347.108, plnMargin: 481.11, intranetId: 12635, category: "vario crazy", origin: "Polska" },
  "adWall Vario S 80 dwustronne": { plnPrice: 907.48, plnMargin: 324.1, intranetId: 12629, category: "vario crazy", origin: "Polska" },
  "adWall Vario S 80 jednostronne": { plnPrice: 907.48, plnMargin: 324.1, intranetId: 10321, category: "vario crazy", origin: "Polska" },
  "adWall Vario Serpentyna 300 dwustronne": { plnPrice: 1725.668, plnMargin: 616.31, intranetId: 12637, category: "vario crazy", origin: "Polska" },
  "adWall Vario Serpentyna 300 jednostronne": { plnPrice: 1725.668, plnMargin: 616.31, intranetId: 10387, category: "vario crazy", origin: "Polska" },
  "adWall Vario Serpentyna 600 dwustronne": { plnPrice: 2954.952, plnMargin: 1055.34, intranetId: 12639, category: "vario crazy", origin: "Polska" },
  "adWall Vario Slope dwustronne": { plnPrice: 1917.328, plnMargin: 684.76, intranetId: 12641, category: "vario crazy", origin: "Polska" },
  "adWall Vario Slope jednostronne": { plnPrice: 1917.328, plnMargin: 684.76, intranetId: 10340, category: "vario crazy", origin: "Polska" },
  "adWall Vario Tower": { plnPrice: 1896.048, plnMargin: 677.16, intranetId: 10382, category: "vario crazy", origin: "Polska" },
  "adWall Vario Tower 3m": { plnPrice: 1630.468, plnMargin: 582.31, intranetId: 10562, category: "vario crazy", origin: "Polska" },
  "adWall Vario Tunel dwustronne": { plnPrice: 5172.328, plnMargin: 1847.26, intranetId: 12649, category: "vario crazy", origin: "Polska" },
  "adWall Vario Twist": { plnPrice: 3180.1, plnMargin: 1135.75, intranetId: 10344, category: "vario crazy", origin: "Polska" },
  "adWall Vario Wave": { plnPrice: 3718.848, plnMargin: 1328.16, intranetId: 10342, category: "vario crazy", origin: "Polska" },
  "adWall Vario Horizontal (bez wydruku)": { plnPrice: 432.488, plnMargin: 154.46, intranetId: 11811, category: "vario klasyczne ścianki", origin: "3" },
  "adWall Vario Horizontal dwustronne": { plnPrice: 659.764, plnMargin: 235.63, intranetId: 12533, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Horizontal jednostronne": { plnPrice: 659.764, plnMargin: 235.63, intranetId: 11809, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Presto 120 (bez wydruku) - prostokątna podstawa": { plnPrice: 0, plnMargin: 0, intranetId: 16145, category: "vario klasyczne ścianki", origin: "Chiny" },
  "adWall Vario Prosta 240 Ø43 (bez wydruku)": { plnPrice: 986.692, plnMargin: 352.39, intranetId: 11686, category: "vario klasyczne ścianki", origin: "Chiny" },
  "adWall Vario Prosta 240 Ø43 dwustronne": { plnPrice: 1401.456, plnMargin: 500.52, intranetId: 12601, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Prosta 240 Ø43 jednostronne": { plnPrice: 1401.456, plnMargin: 500.52, intranetId: 11685, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Prosta 240 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1192.576, plnMargin: 425.92, intranetId: 19467, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 240 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1607.34, plnMargin: 574.05, intranetId: 19513, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 300 Ø43 dwustronne": { plnPrice: 1586.928, plnMargin: 566.76, intranetId: 12603, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Prosta 300 Ø43 jednostronne": { plnPrice: 1586.928, plnMargin: 566.76, intranetId: 10351, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Prosta 300 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1257.76, plnMargin: 449.2, intranetId: 19468, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 300 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1766.268, plnMargin: 630.81, intranetId: 19515, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 300 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1766.268, plnMargin: 630.81, intranetId: 19516, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 400 Ø43 dwustronne": { plnPrice: 1769.124, plnMargin: 631.83, intranetId: 12605, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Prosta 400 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1317.848, plnMargin: 470.66, intranetId: 19469, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 400 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1982.596, plnMargin: 708.07, intranetId: 19517, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 400 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1982.596, plnMargin: 708.07, intranetId: 19518, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 500 Ø43 (bez wydruku)": { plnPrice: 1517.628, plnMargin: 542.01, intranetId: 10983, category: "vario klasyczne ścianki", origin: "Chiny" },
  "adWall Vario Prosta 500 Ø43 dwustronne": { plnPrice: 2338.644, plnMargin: 835.23, intranetId: 12607, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Prosta 500 Ø43 jednostronne": { plnPrice: 2338.644, plnMargin: 835.23, intranetId: 10980, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Prosta 500 Ø43 w torbie na kółkach dwustronne": { plnPrice: 2528.484, plnMargin: 903.03, intranetId: 19519, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 500 Ø43 w torbie na kółkach jednostronne": { plnPrice: 2528.484, plnMargin: 903.03, intranetId: 19520, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 600 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 1794.856, plnMargin: 641.02, intranetId: 19478, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 600 Ø43 w torbie na kółkach dwustronne": { plnPrice: 2772.112, plnMargin: 990.04, intranetId: 19521, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Prosta 600 Ø43 w torbie na kółkach jednostronne": { plnPrice: 2772.112, plnMargin: 990.04, intranetId: 19522, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Łukowa 240 Ø43 (bez wydruku)": { plnPrice: 1056.608, plnMargin: 377.36, intranetId: 11269, category: "vario klasyczne ścianki", origin: "Chiny" },
  "adWall Vario Łukowa 240 Ø43 dwustronne": { plnPrice: 1455.552, plnMargin: 519.84, intranetId: 12541, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 240 Ø43 jednostronne": { plnPrice: 1455.552, plnMargin: 519.84, intranetId: 11267, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 240 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1662.136, plnMargin: 593.62, intranetId: 19533, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Łukowa 300 Ø43 (bez wydruku)": { plnPrice: 1093.428, plnMargin: 390.51, intranetId: 10600, category: "vario klasyczne ścianki", origin: "Chiny" },
  "adWall Vario Łukowa 300 Ø43 dwustronne": { plnPrice: 1617.588, plnMargin: 577.71, intranetId: 12545, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 300 Ø43 jednostronne": { plnPrice: 1617.588, plnMargin: 577.71, intranetId: 10598, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 300 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1896.608, plnMargin: 677.36, intranetId: 19535, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Łukowa 300 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1896.608, plnMargin: 677.36, intranetId: 19536, category: "vario klasyczne ścianki", origin: "NULL" },
  "adWall Vario Łukowa 400 Ø43 (bez wydruku)": { plnPrice: 1196.132, plnMargin: 427.19, intranetId: 11176, category: "vario klasyczne ścianki", origin: "Chiny" },
  "adWall Vario Łukowa 400 Ø43 dwustronne": { plnPrice: 1845.256, plnMargin: 659.02, intranetId: 12551, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 400 Ø43 jednostronne": { plnPrice: 1845.256, plnMargin: 659.02, intranetId: 11175, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 500 Ø43 (bez wydruku)": { plnPrice: 1661.576, plnMargin: 593.42, intranetId: 11178, category: "vario klasyczne ścianki", origin: "Chiny" },
  "adWall Vario Łukowa 500 Ø43 dwustronne": { plnPrice: 2545.172, plnMargin: 908.99, intranetId: 12553, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 500 Ø43 jednostronne": { plnPrice: 2545.172, plnMargin: 908.99, intranetId: 11179, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 600 Ø43 dwustronne": { plnPrice: 2676.408, plnMargin: 955.86, intranetId: 12555, category: "vario klasyczne ścianki", origin: "Polska" },
  "adWall Vario Łukowa 600 Ø43 jednostronne": { plnPrice: 2676.408, plnMargin: 955.86, intranetId: 10599, category: "vario klasyczne ścianki", origin: "Polska" },
  "adGate Quick Arch": { plnPrice: 1139.376, plnMargin: 406.92, intranetId: 18605, category: "vario light", origin: "Polska" },
  "adWall Vario Classic Light 180 jednostronne": { plnPrice: 1179.584, plnMargin: 421.28, intranetId: 11552, category: "vario light", origin: "Polska" },
  "adWall Vario Classic Light 240 (bez wydruku)": { plnPrice: 897.092, plnMargin: 320.39, intranetId: 11557, category: "vario light", origin: "3" },
  "adWall Vario Classic Light 240 dwustronne": { plnPrice: 1296.232, plnMargin: 462.94, intranetId: 12529, category: "vario light", origin: "Polska" },
  "adWall Vario Classic Light 240 jednostronne": { plnPrice: 1296.232, plnMargin: 462.94, intranetId: 11553, category: "vario light", origin: "Polska" },
  "adWall Vario Classic Light 300 dwustronne": { plnPrice: 1374.156, plnMargin: 490.77, intranetId: 12531, category: "vario light", origin: "Polska" },
  "adWall Vario Classic Light 300 jednostronne": { plnPrice: 1374.156, plnMargin: 490.77, intranetId: 11554, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 060 (bez wydruku)": { plnPrice: 309.456, plnMargin: 110.52, intranetId: 11711, category: "vario light", origin: "1" },
  "adWall Vario Presto Light 060 dwustronne": { plnPrice: 458.444, plnMargin: 163.73, intranetId: 12577, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 060 jednostronne": { plnPrice: 458.444, plnMargin: 163.73, intranetId: 11708, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 090 (bez wydruku)": { plnPrice: 332.948, plnMargin: 118.91, intranetId: 11759, category: "vario light", origin: "1" },
  "adWall Vario Presto Light 090 dwustronne": { plnPrice: 513.156, plnMargin: 183.27, intranetId: 12579, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 090 jednostronne": { plnPrice: 513.156, plnMargin: 183.27, intranetId: 11761, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 120 (bez wydruku)": { plnPrice: 373.324, plnMargin: 133.33, intranetId: 11712, category: "vario light", origin: "7616999099" },
  "adWall Vario Presto Light 120 dwustronne": { plnPrice: 600.432, plnMargin: 214.44, intranetId: 12581, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 120 jednostronne": { plnPrice: 600.432, plnMargin: 214.44, intranetId: 11709, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 150 (bez wydruku)": { plnPrice: 390.376, plnMargin: 139.42, intranetId: 11713, category: "vario light", origin: "7616999099" },
  "adWall Vario Presto Light 150 dwustronne": { plnPrice: 680.148, plnMargin: 242.91, intranetId: 12583, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Light 150 jednostronne": { plnPrice: 680.148, plnMargin: 242.91, intranetId: 11710, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Outdoor (bez wydruku)": { plnPrice: 960.848, plnMargin: 343.16, intranetId: 18600, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Outdoor dwustronny": { plnPrice: 1200.024, plnMargin: 428.58, intranetId: 18604, category: "vario light", origin: "Polska" },
  "adWall Vario Presto Outdoor jednostronny": { plnPrice: 1200.024, plnMargin: 428.58, intranetId: 18603, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 240 (bez wydruku)": { plnPrice: 834.764, plnMargin: 298.13, intranetId: 11767, category: "vario light", origin: "1" },
  "adWall Vario Prosta Light 240 dwustronne": { plnPrice: 1264.984, plnMargin: 451.78, intranetId: 12611, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 240 jednostronne": { plnPrice: 1264.984, plnMargin: 451.78, intranetId: 11769, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 240 SOFT BAG (bez wydruku)": { plnPrice: 540.148, plnMargin: 192.91, intranetId: 17569, category: "vario light", origin: "1" },
  "adWall Vario Prosta Light 240 SOFT BAG dwustronne": { plnPrice: 970.368, plnMargin: 346.56, intranetId: 17675, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 240 SOFT BAG jednostronne": { plnPrice: 970.368, plnMargin: 346.56, intranetId: 17652, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 300 (bez wydruku)": { plnPrice: 812.924, plnMargin: 290.33, intranetId: 11770, category: "vario light", origin: "1" },
  "adWall Vario Prosta Light 300 dwustronne": { plnPrice: 1337.056, plnMargin: 477.52, intranetId: 12613, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 300 jednostronne": { plnPrice: 1337.056, plnMargin: 477.52, intranetId: 11772, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 300 SOFT BAG (bez wydruku)": { plnPrice: 577.696, plnMargin: 206.32, intranetId: 17570, category: "vario light", origin: "1" },
  "adWall Vario Prosta Light 300 SOFT BAG dwustronne": { plnPrice: 1101.856, plnMargin: 393.52, intranetId: 17678, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 300 SOFT BAG jednostronne": { plnPrice: 1101.856, plnMargin: 393.52, intranetId: 17679, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 400 (bez wydruku)": { plnPrice: 938.56, plnMargin: 335.2, intranetId: 11544, category: "vario light", origin: "1" },
  "adWall Vario Prosta Light 400 dwustronne": { plnPrice: 1603.308, plnMargin: 572.61, intranetId: 12615, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 400 jednostronne": { plnPrice: 1603.308, plnMargin: 572.61, intranetId: 11537, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 400 SOFT BAG (bez wydruku)": { plnPrice: 675.976, plnMargin: 241.42, intranetId: 17571, category: "vario light", origin: "1" },
  "adWall Vario Prosta Light 400 SOFT BAG dwustronne": { plnPrice: 1340.78, plnMargin: 478.85, intranetId: 17680, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 400 SOFT BAG jednostronne": { plnPrice: 1340.78, plnMargin: 478.85, intranetId: 17681, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 500 (bez wydruku)": { plnPrice: 1230.376, plnMargin: 439.42, intranetId: 11545, category: "vario light", origin: "2" },
  "adWall Vario Prosta Light 500 dwustronne": { plnPrice: 2051.392, plnMargin: 732.64, intranetId: 12617, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 500 jednostronne": { plnPrice: 2051.392, plnMargin: 732.64, intranetId: 11538, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 500 SOFT BAG (bez wydruku)": { plnPrice: 927.024, plnMargin: 331.08, intranetId: 17572, category: "vario light", origin: "2" },
  "adWall Vario Prosta Light 500 SOFT BAG dwustronne": { plnPrice: 1748.04, plnMargin: 624.3, intranetId: 17682, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 500 SOFT BAG jednostronne": { plnPrice: 1748.04, plnMargin: 624.3, intranetId: 17683, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 600 (bez wydruku)": { plnPrice: 1236.34, plnMargin: 441.55, intranetId: 11546, category: "vario light", origin: "2" },
  "adWall Vario Prosta Light 600 dwustronne": { plnPrice: 2213.596, plnMargin: 790.57, intranetId: 12619, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 600 jednostronne": { plnPrice: 2213.596, plnMargin: 790.57, intranetId: 11539, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 600 SOFT BAG (bez wydruku)": { plnPrice: 993.44, plnMargin: 354.8, intranetId: 17573, category: "vario light", origin: "2" },
  "adWall Vario Prosta Light 600 SOFT BAG dwustronne": { plnPrice: 1970.696, plnMargin: 703.82, intranetId: 17684, category: "vario light", origin: "Polska" },
  "adWall Vario Prosta Light 600 SOFT BAG jednostronne": { plnPrice: 1970.696, plnMargin: 703.82, intranetId: 17685, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 240 (bez wydruku)": { plnPrice: 898.016, plnMargin: 320.72, intranetId: 11525, category: "vario light", origin: "2" },
  "adWall Vario Łukowa Light 240 dwustronne": { plnPrice: 1328.264, plnMargin: 474.38, intranetId: 12557, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 240 jednostronne": { plnPrice: 1328.264, plnMargin: 474.38, intranetId: 11520, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 240 SOFT BAG (bez wydruku)": { plnPrice: 594.748, plnMargin: 212.41, intranetId: 17574, category: "vario light", origin: "1" },
  "adWall Vario Łukowa Light 240 SOFT BAG dwustronne": { plnPrice: 1024.968, plnMargin: 366.06, intranetId: 17686, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 240 SOFT BAG jednostronne": { plnPrice: 1024.968, plnMargin: 366.06, intranetId: 17687, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 300 (bez wydruku)": { plnPrice: 915.46, plnMargin: 326.95, intranetId: 11526, category: "vario light", origin: "2" },
  "adWall Vario Łukowa Light 300 dwustronne": { plnPrice: 1439.424, plnMargin: 514.08, intranetId: 12559, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 300 jednostronne": { plnPrice: 1439.424, plnMargin: 514.08, intranetId: 11521, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 300 SOFT BAG (bez wydruku)": { plnPrice: 626.864, plnMargin: 223.88, intranetId: 17575, category: "vario light", origin: "1" },
  "adWall Vario Łukowa Light 300 SOFT BAG dwustronne": { plnPrice: 1150.828, plnMargin: 411.01, intranetId: 17688, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 300 SOFT BAG jednostronne": { plnPrice: 1150.828, plnMargin: 411.01, intranetId: 17689, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 400 dwustronne": { plnPrice: 1639.568, plnMargin: 585.56, intranetId: 12561, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 400 jednostronne": { plnPrice: 1639.568, plnMargin: 585.56, intranetId: 11522, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 400 SOFT BAG (bez wydruku)": { plnPrice: 724.948, plnMargin: 258.91, intranetId: 17576, category: "vario light", origin: "2" },
  "adWall Vario Łukowa Light 400 SOFT BAG dwustronne": { plnPrice: 1405.348, plnMargin: 501.91, intranetId: 17690, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 400 SOFT BAG jednostronne": { plnPrice: 1405.348, plnMargin: 501.91, intranetId: 17691, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 500 dwustronne": { plnPrice: 2154.488, plnMargin: 769.46, intranetId: 12563, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 500 jednostronne": { plnPrice: 2154.488, plnMargin: 769.46, intranetId: 11523, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 500 SOFT BAG (bez wydruku)": { plnPrice: 927.024, plnMargin: 331.08, intranetId: 17577, category: "vario light", origin: "4" },
  "adWall Vario Łukowa Light 500 SOFT BAG dwustronne": { plnPrice: 1763.748, plnMargin: 629.91, intranetId: 17692, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 500 SOFT BAG jednostronne": { plnPrice: 1763.748, plnMargin: 629.91, intranetId: 17693, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 600 dwustronne": { plnPrice: 2396.548, plnMargin: 855.91, intranetId: 12565, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 600 jednostronne": { plnPrice: 2396.548, plnMargin: 855.91, intranetId: 11524, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 600 SOFT BAG dwustronne": { plnPrice: 2014.32, plnMargin: 719.4, intranetId: 17694, category: "vario light", origin: "Polska" },
  "adWall Vario Łukowa Light 600 SOFT BAG jednostronne": { plnPrice: 2014.32, plnMargin: 719.4, intranetId: 17695, category: "vario light", origin: "Polska" },
  "Wydruk adGate Quick Arch": { plnPrice: 216.58, plnMargin: 77.35, intranetId: 18607, category: "vario light", origin: "Polska" },
  "mFrame MASKOWNICA PCV 2480 (szt)": { plnPrice: 159.768, plnMargin: 57.06, intranetId: 18734, category: "wydruk blockout", origin: "Polska" },
  "Wydruk do ościeżnicy do drzwi NEW": { plnPrice: 116.648, plnMargin: 41.66, intranetId: 18584, category: "wydruk blockout", origin: "Polska" },
  "Wydruk do ościeżnicy na tekstyliach - KLEJONY": { plnPrice: 275.268, plnMargin: 98.31, intranetId: 17367, category: "wydruk blockout", origin: "Polska" },
  "Wydruk niestandardowy BIG QUICK LED": { plnPrice: 139.776, plnMargin: 49.92, intranetId: 17627, category: "wydruk blockout", origin: "Polska" },
  "Wydruk niestandardowy MODERN / BLOCKOUT": { plnPrice: 103.18, plnMargin: 36.85, intranetId: 12179, category: "wydruk blockout", origin: "Polska" },
  "Wydruk adFrame Blockout": { plnPrice: 113.512, plnMargin: 40.54, intranetId: 18167, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 1mb/medium250)": { plnPrice: 61.516, plnMargin: 21.97, intranetId: 11867, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 1mb/medium320)": { plnPrice: 61.516, plnMargin: 21.97, intranetId: 18019, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 3mb/medium250)": { plnPrice: 125.58, plnMargin: 44.85, intranetId: 16435, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 3mb/medium320)": { plnPrice: 125.58, plnMargin: 44.85, intranetId: 18020, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (pow. 3mb/medium250)": { plnPrice: 294.784, plnMargin: 105.28, intranetId: 16437, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU (pow. 3mb/medium320)": { plnPrice: 294.784, plnMargin: 105.28, intranetId: 18021, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout 100x200": { plnPrice: 108.304, plnMargin: 38.68, intranetId: 14722, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout 200x250": { plnPrice: 197.344, plnMargin: 70.48, intranetId: 15241, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout 400x250": { plnPrice: 368.76, plnMargin: 131.7, intranetId: 15245, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk adFrame Blockout 99,2x248": { plnPrice: 111.384, plnMargin: 39.78, intranetId: 15260, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk mFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 3mb/medium250)": { plnPrice: 0, plnMargin: 0, intranetId: 19242, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk mFrame Blockout - BIAŁY PLECY NIE DO DRUKU (pow. 3mb/medium250)": { plnPrice: 0, plnMargin: 0, intranetId: 19243, category: "wydruk blockout adframe", origin: "Polska" },
  "Wydruk Foldable 100x200": { plnPrice: 110.824, plnMargin: 39.58, intranetId: 18029, category: "wydruk blockout foldable", origin: "Polska" },
  "Wydruk Foldable 100x250": { plnPrice: 110.824, plnMargin: 39.58, intranetId: 16987, category: "wydruk blockout foldable", origin: "Polska" },
  "Wydruk Foldable 200x200": { plnPrice: 196.532, plnMargin: 70.19, intranetId: 19704, category: "wydruk blockout foldable", origin: "NULL" },
  "Wydruk Foldable 200x250": { plnPrice: 196.532, plnMargin: 70.19, intranetId: 17059, category: "wydruk blockout foldable", origin: "Polska" },
  "Wydruk Foldable 300x200": { plnPrice: 282.156, plnMargin: 100.77, intranetId: 19703, category: "wydruk blockout foldable", origin: "NULL" },
  "Wydruk Foldable 300x250": { plnPrice: 282.156, plnMargin: 100.77, intranetId: 17060, category: "wydruk blockout foldable", origin: "Polska" },
  "Wydruk Foldable 400x200": { plnPrice: 365.288, plnMargin: 130.46, intranetId: 19764, category: "wydruk blockout foldable", origin: "NULL" },
  "Wydruk Foldable 400x250": { plnPrice: 367.892, plnMargin: 131.39, intranetId: 17061, category: "wydruk blockout foldable", origin: "Polska" },
  "Wydruk Foldable 500x250": { plnPrice: 453.544, plnMargin: 161.98, intranetId: 17062, category: "wydruk blockout foldable", origin: "Polska" },
  "Wydruk do mFrame rama curved corner arch 496x496": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 18786, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach (do 1mb/medium250)": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 10790, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach (do 1mb/medium320)": { plnPrice: 153.888, plnMargin: 54.96, intranetId: 18003, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach (do 3mb/medium250)": { plnPrice: 312.396, plnMargin: 111.57, intranetId: 16427, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach (do 3mb/medium320)": { plnPrice: 393.82, plnMargin: 140.65, intranetId: 18006, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach (pow. 3mb/medium250)": { plnPrice: 502.376, plnMargin: 179.42, intranetId: 16428, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach (pow. 3mb/medium320)": { plnPrice: 633.864, plnMargin: 226.38, intranetId: 18007, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - 99,2x248cm KLEJONY": { plnPrice: 381.388, plnMargin: 136.21, intranetId: 17594, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - BIAŁY": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 12215, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - BIAŁY 297,6x248cm": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 17995, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - BIAŁY 99,2x248cm": { plnPrice: 122.36, plnMargin: 43.7, intranetId: 17063, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI (bez wycięcia na klamkę)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 14495, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI (klamka z lewej strony)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 12214, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI (klamka z prawej strony)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 12213, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI NEW (bez wycięcia na klamkę)": { plnPrice: 122.192, plnMargin: 43.64, intranetId: 18582, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI NEW Z OŚCIEŻNICĄ": { plnPrice: 238.812, plnMargin: 85.29, intranetId: 18583, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI Z OŚCIEŻNICĄ PCV (bez wycięcia na klamkę)": { plnPrice: 397.488, plnMargin: 141.96, intranetId: 17912, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI Z OŚCIEŻNICĄ PCV (klamka z lewej)": { plnPrice: 397.488, plnMargin: 141.96, intranetId: 18586, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - DRZWI Z OŚCIEŻNICĄ PCV (klamka z prawej": { plnPrice: 397.488, plnMargin: 141.96, intranetId: 18587, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x148,8cm KLEJONY WEWNĘTRZNY": { plnPrice: 337.26, plnMargin: 120.45, intranetId: 17284, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x248cm KLEJONY WEWNĘTRZNY": { plnPrice: 452.312, plnMargin: 161.54, intranetId: 17283, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x49,6cm KLEJONY WEWNĘTRZNY": { plnPrice: 189.42, plnMargin: 67.65, intranetId: 17632, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 75x99,2cm KLEJONY WEWNĘTRZNY": { plnPrice: 187.656, plnMargin: 67.02, intranetId: 17281, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x148,8cm KLEJONY ZEWNETRZNY": { plnPrice: 273.196, plnMargin: 97.57, intranetId: 18061, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x248cm KLEJONY ZEWNETRZNY": { plnPrice: 429.1, plnMargin: 153.25, intranetId: 18565, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x49,6cm KLEJONY ZEWNETRZNY": { plnPrice: 195.132, plnMargin: 69.69, intranetId: 17631, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK 83x99,2cm KLEJONY ZEWNETRZNY": { plnPrice: 189.98, plnMargin: 67.85, intranetId: 17603, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK WEWNĘTRZNY Z RZEPEM 75x99,2": { plnPrice: 114.296, plnMargin: 40.82, intranetId: 12046, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK ZEWNĘTRZNY 83x248": { plnPrice: 114.296, plnMargin: 40.82, intranetId: 16419, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach - ŁUK ZEWNĘTRZNY 83x99,2": { plnPrice: 114.296, plnMargin: 40.82, intranetId: 12047, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 124x49,6cm": { plnPrice: 63.812, plnMargin: 22.79, intranetId: 18697, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x198,4cm": { plnPrice: 162.736, plnMargin: 58.12, intranetId: 17330, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x248cm": { plnPrice: 168, plnMargin: 60, intranetId: 17265, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x297,6cm": { plnPrice: 302.596, plnMargin: 108.07, intranetId: 17148, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x347,2cm": { plnPrice: 350.084, plnMargin: 125.03, intranetId: 17139, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x396,8cm": { plnPrice: 268.016, plnMargin: 95.72, intranetId: 17596, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 148,8x49,6cm": { plnPrice: 65.128, plnMargin: 23.26, intranetId: 18696, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x148,8cm": { plnPrice: 207.62, plnMargin: 74.15, intranetId: 18709, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x198,4cm": { plnPrice: 210.252, plnMargin: 75.09, intranetId: 17211, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x248cm": { plnPrice: 212.884, plnMargin: 76.03, intranetId: 16944, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x297,6cm": { plnPrice: 268.016, plnMargin: 95.72, intranetId: 16948, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x347,2cm": { plnPrice: 352.744, plnMargin: 125.98, intranetId: 17140, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x396,8cm": { plnPrice: 400.26, plnMargin: 142.95, intranetId: 17259, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x49,6cm": { plnPrice: 67.76, plnMargin: 24.2, intranetId: 18698, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 198,4x99,2cm": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 17280, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mframe na tekstyliach 24,8x248cm": { plnPrice: 0, plnMargin: 0, intranetId: 19616, category: "wydruk blockout mframe", origin: "NULL" },
  "Wydruk mFrame na tekstyliach 248x248cm": { plnPrice: 260.372, plnMargin: 92.99, intranetId: 17149, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 248x396,8cm": { plnPrice: 505.372, plnMargin: 180.49, intranetId: 18720, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 248x49,6cm": { plnPrice: 70.392, plnMargin: 25.14, intranetId: 18699, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 248x99,2cm": { plnPrice: 70.392, plnMargin: 25.14, intranetId: 18929, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 297,6x148,8cm": { plnPrice: 302.596, plnMargin: 108.07, intranetId: 18771, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 297,6x198,4cm": { plnPrice: 305.256, plnMargin: 109.02, intranetId: 17244, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 297,6x248cm": { plnPrice: 307.888, plnMargin: 109.96, intranetId: 16945, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 297,6x297,6cm": { plnPrice: 387.968, plnMargin: 138.56, intranetId: 16949, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 297,6x396.8cm": { plnPrice: 508.004, plnMargin: 181.43, intranetId: 17258, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 297,6x49,6cm": { plnPrice: 297.36, plnMargin: 106.2, intranetId: 18700, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 297,6x99,2cm": { plnPrice: 299.992, plnMargin: 107.14, intranetId: 17129, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 347,2x148,8cm": { plnPrice: 347.452, plnMargin: 124.09, intranetId: 18710, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 347,2x198,4cm": { plnPrice: 347.452, plnMargin: 124.09, intranetId: 18711, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 347,2x248cm": { plnPrice: 364.896, plnMargin: 130.32, intranetId: 17398, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 347,2x297,6cm": { plnPrice: 459.508, plnMargin: 164.11, intranetId: 18713, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 347,2x49,6cm": { plnPrice: 344.82, plnMargin: 123.15, intranetId: 18701, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 347,2x99,2cm": { plnPrice: 344.82, plnMargin: 123.15, intranetId: 18705, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 396,8x248cm": { plnPrice: 402.892, plnMargin: 143.89, intranetId: 16946, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 396,8x297,6cm": { plnPrice: 508.004, plnMargin: 181.43, intranetId: 16950, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 396,8x49,6cm": { plnPrice: 392.336, plnMargin: 140.12, intranetId: 17131, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 396,8x99,2cm": { plnPrice: 394.968, plnMargin: 141.06, intranetId: 17260, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 446,4x248cm": { plnPrice: 451.696, plnMargin: 161.32, intranetId: 18797, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 446,4x49,6cm": { plnPrice: 439.824, plnMargin: 157.08, intranetId: 18702, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 446,4x99,2cm": { plnPrice: 442.456, plnMargin: 158.02, intranetId: 18706, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 49,6x198,4cm": { plnPrice: 72.24, plnMargin: 25.8, intranetId: 16936, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 49,6x248cm": { plnPrice: 74.872, plnMargin: 26.74, intranetId: 16937, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 49,6x297,6cm": { plnPrice: 93.856, plnMargin: 33.52, intranetId: 16938, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mframe na tekstyliach 49,6x347,2cm": { plnPrice: 0, plnMargin: 0, intranetId: 19612, category: "wydruk blockout mframe", origin: "NULL" },
  "Wydruk mFrame na tekstyliach 49,6x396,8cm": { plnPrice: 494.816, plnMargin: 176.72, intranetId: 18718, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 49,6x49,6cm": { plnPrice: 64.344, plnMargin: 22.98, intranetId: 16932, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 49,6x99,2cm": { plnPrice: 66.976, plnMargin: 23.92, intranetId: 16933, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 496,8x248cm (niestandard)": { plnPrice: 0, plnMargin: 0, intranetId: 19854, category: "wydruk blockout mframe", origin: "NULL" },
  "Wydruk mFrame na tekstyliach 496x248cm": { plnPrice: 497.868, plnMargin: 177.81, intranetId: 16947, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 496x297,6cm": { plnPrice: 622.384, plnMargin: 222.28, intranetId: 17254, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 496x49,6cm": { plnPrice: 487.312, plnMargin: 174.04, intranetId: 17422, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 496x99,2cm": { plnPrice: 489.944, plnMargin: 174.98, intranetId: 17441, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 545,6x248cm": { plnPrice: 554.344, plnMargin: 197.98, intranetId: 18722, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 595,2x248cm": { plnPrice: 581.252, plnMargin: 207.59, intranetId: 17279, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 595,2x297,6cm": { plnPrice: 747.992, plnMargin: 267.14, intranetId: 17407, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 595,2x49,6cm": { plnPrice: 573.384, plnMargin: 204.78, intranetId: 17824, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 595,2x99,2cm": { plnPrice: 576.016, plnMargin: 205.72, intranetId: 17423, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 62x99,2cm": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 17358, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 644,8x297,6cm": { plnPrice: 801.388, plnMargin: 286.21, intranetId: 18714, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 694,4x248cm": { plnPrice: 687.876, plnMargin: 245.67, intranetId: 17264, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 694,4x297,6cm": { plnPrice: 867.944, plnMargin: 309.98, intranetId: 17405, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 793,6x148,8": { plnPrice: 777.644, plnMargin: 277.73, intranetId: 17261, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mframe na tekstyliach 793,6x297,6cm": { plnPrice: 0, plnMargin: 0, intranetId: 19614, category: "wydruk blockout mframe", origin: "NULL" },
  "Wydruk mFrame na tekstyliach 793,6x99,2cm": { plnPrice: 765.996, plnMargin: 273.57, intranetId: 18707, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 892,8x297,6cm": { plnPrice: 1110.62, plnMargin: 396.65, intranetId: 18717, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x124cm": { plnPrice: 111.3, plnMargin: 39.75, intranetId: 17653, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x148,8cm": { plnPrice: 112.616, plnMargin: 40.22, intranetId: 16942, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x198,4cm": { plnPrice: 115.248, plnMargin: 41.16, intranetId: 16941, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x248cm": { plnPrice: 117.88, plnMargin: 42.1, intranetId: 16940, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x297,6cm": { plnPrice: 148.036, plnMargin: 52.87, intranetId: 16939, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x347,2cm": { plnPrice: 347.452, plnMargin: 124.09, intranetId: 18496, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x396,8cm": { plnPrice: 497.448, plnMargin: 177.66, intranetId: 18719, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x396,8cm drzwi + ościeżnica z górą (niestandard z docięciem)": { plnPrice: 0, plnMargin: 0, intranetId: 19805, category: "wydruk blockout mframe", origin: "NULL" },
  "Wydruk mFrame na tekstyliach 99,2x49,6cm": { plnPrice: 66.976, plnMargin: 23.92, intranetId: 17130, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 99,2x99,2cm": { plnPrice: 109.956, plnMargin: 39.27, intranetId: 16943, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk mFrame PCV - KLEJONY": { plnPrice: 385.196, plnMargin: 137.57, intranetId: 17424, category: "wydruk blockout mframe", origin: "Polska" },
  "Wydruk Multiframe (do 1mb/medium250)": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 10551, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe (do 3mb/medium250)": { plnPrice: 308.756, plnMargin: 110.27, intranetId: 18014, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe (pow. 3mb/medium250)": { plnPrice: 497.42, plnMargin: 177.65, intranetId: 18015, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe (pow. 3mb/medium320)": { plnPrice: 626.276, plnMargin: 223.67, intranetId: 18684, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe - Dach 200cm": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 18258, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 240 SET1 jednostronny": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 18942, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 240 SET2 jednostronny": { plnPrice: 214.424, plnMargin: 76.58, intranetId: 18944, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 240 SET3 jednostronny": { plnPrice: 0, plnMargin: 0, intranetId: 19254, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 240 SET4 jednostronny": { plnPrice: 403.116, plnMargin: 143.97, intranetId: 18943, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 240 SET6 jednostronny": { plnPrice: 0, plnMargin: 0, intranetId: 19255, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET1 jednostronny": { plnPrice: 120.064, plnMargin: 42.88, intranetId: 16608, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET2 jednostronny": { plnPrice: 214.424, plnMargin: 76.58, intranetId: 16609, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET3 jednostronny": { plnPrice: 308.756, plnMargin: 110.27, intranetId: 16610, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET4 jednostronny": { plnPrice: 403.116, plnMargin: 143.97, intranetId: 16611, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET5 jednostronny": { plnPrice: 497.42, plnMargin: 177.65, intranetId: 16612, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET6 jednostronny": { plnPrice: 591.78, plnMargin: 211.35, intranetId: 16613, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET8 jednostronny": { plnPrice: 780.472, plnMargin: 278.74, intranetId: 16615, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 250 SET9 jednostronny": { plnPrice: 874.776, plnMargin: 312.42, intranetId: 16616, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 301 SET2 jednostronny": { plnPrice: 339.752, plnMargin: 121.34, intranetId: 16752, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 301 SET4 jednostronny": { plnPrice: 581.28, plnMargin: 207.6, intranetId: 18232, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 301 SET5 jednostronny": { plnPrice: 732.312, plnMargin: 261.54, intranetId: 17929, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 301 SET6 jednostronny": { plnPrice: 863.184, plnMargin: 308.28, intranetId: 18683, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 301 SET7 jednostronny": { plnPrice: 994.056, plnMargin: 355.02, intranetId: 18544, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 350 SET1 jednostronny": { plnPrice: 440.328, plnMargin: 157.26, intranetId: 17343, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 350 SET2 jednostronny": { plnPrice: 444.948, plnMargin: 158.91, intranetId: 17344, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe 350 SET3 jednostronny": { plnPrice: 449.568, plnMargin: 160.56, intranetId: 17345, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 240 - Bok kantorka": { plnPrice: 161.812, plnMargin: 57.79, intranetId: 11865, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 240 - Drzwi": { plnPrice: 161.812, plnMargin: 57.79, intranetId: 11863, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 240 - Tył kantorka": { plnPrice: 161.812, plnMargin: 57.79, intranetId: 11864, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 250 - Bok kantorka": { plnPrice: 163.856, plnMargin: 58.52, intranetId: 11994, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 250 - Bok kantorka set2": { plnPrice: 209.748, plnMargin: 74.91, intranetId: 17696, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 250 - Drzwi": { plnPrice: 119.896, plnMargin: 42.82, intranetId: 11995, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 250 - Tył kantorka": { plnPrice: 173.936, plnMargin: 62.12, intranetId: 11996, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 301 - Bok kantorka set2": { plnPrice: 313.74, plnMargin: 112.05, intranetId: 17116, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 301 - Drzwi": { plnPrice: 208.712, plnMargin: 74.54, intranetId: 18941, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Kantorek 301 - Tył kantorka": { plnPrice: 208.712, plnMargin: 74.54, intranetId: 17115, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Nadstawka 100 - Bok": { plnPrice: 133.532, plnMargin: 47.69, intranetId: 16722, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Nadstawka 100 - Nad drzwiami/Tył": { plnPrice: 133.532, plnMargin: 47.69, intranetId: 16723, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Nadstawka 50 - Nad drzwiami/Tył": { plnPrice: 123.424, plnMargin: 44.08, intranetId: 16720, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Tribune": { plnPrice: 93.128, plnMargin: 33.26, intranetId: 12187, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Tribune (H+5cm STARY TYP)": { plnPrice: 93.128, plnMargin: 33.26, intranetId: 17442, category: "wydruk blockout multiframe", origin: "Polska" },
  "Wydruk Multiframe Tribune tył": { plnPrice: 124.712, plnMargin: 44.54, intranetId: 18849, category: "wydruk blockout multiframe", origin: "Polska" },
  "adWall L 200 wydruk": { plnPrice: 168.98, plnMargin: 60.35, intranetId: 10735, category: "wydruk classic", origin: "Polska" },
  "Wydruk adWall Smart prosta 4x3": { plnPrice: 1891.148, plnMargin: 675.41, intranetId: 10787, category: "wydruk classic", origin: "Polska" },
  "Wydruk adWall Smart łukowa 3x3": { plnPrice: 1540.84, plnMargin: 550.3, intranetId: 10227, category: "wydruk classic", origin: "Polska" },
  "Wydruk adWall Smart łukowa 4x3": { plnPrice: 1753.416, plnMargin: 626.22, intranetId: 10228, category: "wydruk classic", origin: "Polska" },
  "Wydruk do nadstawki A4 jednostronny": { plnPrice: 10.276, plnMargin: 3.67, intranetId: 12314, category: "wydruk classic", origin: "Polska" },
  "Wydruk do nadstawki premium/prestige jednostronny": { plnPrice: 10.276, plnMargin: 3.67, intranetId: 16959, category: "wydruk classic", origin: "Polska" },
  "Wydruk mFrame na folii z PCV": { plnPrice: 255.64, plnMargin: 91.3, intranetId: 10799, category: "wydruk classic", origin: "Polska" },
  "Wydruk niestandardowy CLASSIC / BANER ECONO": { plnPrice: 18.928, plnMargin: 6.76, intranetId: 12185, category: "wydruk classic", origin: "Polska" },
  "Wydruk niestandardowy CLASSIC / FOLIA 100": { plnPrice: 34.272, plnMargin: 12.24, intranetId: 12171, category: "wydruk classic", origin: "Polska" },
  "Wydruk niestandardowy CLASSIC / FOLIA 105": { plnPrice: 34.272, plnMargin: 12.24, intranetId: 12172, category: "wydruk classic", origin: "Polska" },
  "Wydruk niestandardowy CLASSIC / Rollup 91,4": { plnPrice: 0, plnMargin: 0, intranetId: 19676, category: "wydruk classic", origin: "NULL" },
  "Wydruk adFlag BLADE L": { plnPrice: 54.264, plnMargin: 19.38, intranetId: 15662, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag BLADE M": { plnPrice: 43.932, plnMargin: 15.69, intranetId: 15663, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag BLADE S": { plnPrice: 36.148, plnMargin: 12.91, intranetId: 15664, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag BLADE XL": { plnPrice: 60.704, plnMargin: 21.68, intranetId: 15665, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag DROP M": { plnPrice: 41.328, plnMargin: 14.76, intranetId: 15673, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag HOOK L": { plnPrice: 54.264, plnMargin: 19.38, intranetId: 15666, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag HOOK M": { plnPrice: 43.932, plnMargin: 15.69, intranetId: 15668, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag HOOK S": { plnPrice: 36.148, plnMargin: 12.91, intranetId: 15667, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag HOOK XL": { plnPrice: 60.704, plnMargin: 21.68, intranetId: 15669, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag STANDARD L": { plnPrice: 52.976, plnMargin: 18.92, intranetId: 15674, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag STANDARD M": { plnPrice: 43.932, plnMargin: 15.69, intranetId: 15675, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag STANDARD S": { plnPrice: 33.6, plnMargin: 12, intranetId: 15676, category: "wydruk flaga", origin: "Polska" },
  "Wydruk adFlag STANDARD XL": { plnPrice: 60.704, plnMargin: 21.68, intranetId: 15677, category: "wydruk flaga", origin: "Polska" },
  "Wydruk niestandardowy MODERN / FLAG": { plnPrice: 25.788, plnMargin: 9.21, intranetId: 16156, category: "wydruk flaga", origin: "Polska" },
  "Wydruk Leżak": { plnPrice: 23.408, plnMargin: 8.36, intranetId: 12489, category: "wydruk leżak premium", origin: "Polska" },
  "Wydruk adFoam Cube nowy": { plnPrice: 58.576, plnMargin: 20.92, intranetId: 19069, category: "wydruk meble reklamowe", origin: "Polska" },
  "Wydruk adFoam Cube stary": { plnPrice: 58.576, plnMargin: 20.92, intranetId: 11030, category: "wydruk meble reklamowe", origin: "Polska" },
  "Wydruk adFoam Forma": { plnPrice: 167.888, plnMargin: 59.96, intranetId: 11426, category: "wydruk meble reklamowe", origin: "Polska" },
  "Wydruk adFoam Forma podnóżek": { plnPrice: 89.796, plnMargin: 32.07, intranetId: 11822, category: "wydruk meble reklamowe", origin: "Polska" },
  "Wydruk adFoam Roller": { plnPrice: 89.796, plnMargin: 32.07, intranetId: 10578, category: "wydruk meble reklamowe", origin: "Polska" },
  "Wydruk adFoam Roller Mini": { plnPrice: 89.796, plnMargin: 32.07, intranetId: 11047, category: "wydruk meble reklamowe", origin: "Polska" },
  "Wydruk adTent Air Premium 6x6 (ściana boczna jednostronna)": { plnPrice: 859.572, plnMargin: 306.99, intranetId: 15862, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x3m DACH": { plnPrice: 936.908, plnMargin: 334.61, intranetId: 15608, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x3m ŚCIANA": { plnPrice: 304.5, plnMargin: 108.75, intranetId: 15611, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x3m ŚCIANA DWUSTRONNA PREMIUM": { plnPrice: 609, plnMargin: 217.5, intranetId: 15844, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x3m ŚCIANA DWUSTRONNA PREMIUM-BLOCKOUT": { plnPrice: 618.296, plnMargin: 220.82, intranetId: 15848, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x4,5m DACH": { plnPrice: 1218, plnMargin: 435, intranetId: 15609, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x4,5m ŚCIANA": { plnPrice: 445.032, plnMargin: 158.94, intranetId: 15612, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x4,5m ŚCIANA DWUSTRONNA PREMIUM": { plnPrice: 890.036, plnMargin: 317.87, intranetId: 16149, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x4,5m ŚCIANA DWUSTRONNA PREMIUM BLOCKOUT": { plnPrice: 903.728, plnMargin: 322.76, intranetId: 16402, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x6m DACH": { plnPrice: 1499.036, plnMargin: 535.37, intranetId: 15610, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x6m ŚCIANA": { plnPrice: 585.592, plnMargin: 209.14, intranetId: 15613, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x6m ŚCIANA DWUSTRONNA PREMIUM": { plnPrice: 1171.128, plnMargin: 418.26, intranetId: 16150, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent EXPRESS 3x6m ŚCIANA DWUSTRONNA PREMIUM BLOCKOUT": { plnPrice: 1189.188, plnMargin: 424.71, intranetId: 16785, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Vario 3x3 - dach": { plnPrice: 1027.936, plnMargin: 367.12, intranetId: 11110, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Vario 3x3 - ściana dwustronna": { plnPrice: 504.364, plnMargin: 180.13, intranetId: 12195, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Vario 3x3 - ściana jednostronna": { plnPrice: 305.228, plnMargin: 109.01, intranetId: 11594, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Vario 3x3 - ściana ŚCIANA DWUSTRONNA PREMIUM-BLOCKOUT": { plnPrice: 620.536, plnMargin: 221.62, intranetId: 18949, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Vario 4x4 - dach": { plnPrice: 1515.92, plnMargin: 541.4, intranetId: 11111, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Vario 4x4 - ściana dwustronna": { plnPrice: 637.056, plnMargin: 227.52, intranetId: 12196, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Vario 4x4 - ściana jednostronna": { plnPrice: 391.132, plnMargin: 139.69, intranetId: 11595, category: "wydruk namioty", origin: "Polska" },
  "wydruk adTent Vario 4x4m ŚCIANA DWUSTRONNA PREMIUM-BLOCKOUT": { plnPrice: 794.22, plnMargin: 283.65, intranetId: 16482, category: "wydruk namioty", origin: "Polska" },
  "Wydruk adTent Air 3x3 - ŚCIANA DWUSTRONNA": { plnPrice: 481.012, plnMargin: 171.79, intranetId: 12191, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air 3x3 - ŚCIANA JEDNOSTRONNA": { plnPrice: 246.764, plnMargin: 88.13, intranetId: 11470, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air 5x5 - DACH": { plnPrice: 1964.452, plnMargin: 701.59, intranetId: 11102, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air 5x5 - ŚCIANA JEDNOSTRONNA": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 11472, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air 5x5 - ŚCIANA JEDNOSTRONNA WARIANTY": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 15857, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 3x3 (sam dach)": { plnPrice: 859.684, plnMargin: 307.03, intranetId: 14003, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 3x3 (same nogi 4)": { plnPrice: 457.548, plnMargin: 163.41, intranetId: 16636, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 3x3 (ściana boczna dwustronna PREMIUM BLOCKOUT)": { plnPrice: 579.208, plnMargin: 206.86, intranetId: 16972, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 3x3 (ściana boczna dwustronna)": { plnPrice: 481.012, plnMargin: 171.79, intranetId: 14024, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 3x3 (ściana boczna jednostronna)": { plnPrice: 324.884, plnMargin: 116.03, intranetId: 17311, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 3x3 (ściana boczna jednostronna) WARIANT": { plnPrice: 324.884, plnMargin: 116.03, intranetId: 14012, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 4x4 (dach)": { plnPrice: 937.748, plnMargin: 334.91, intranetId: 14005, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 4x4 (sama noga)": { plnPrice: 203.84, plnMargin: 72.8, intranetId: 17292, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 4x4 (same nogi 3)": { plnPrice: 438.06, plnMargin: 156.45, intranetId: 17294, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 4x4 (same nogi 4)": { plnPrice: 555.184, plnMargin: 198.28, intranetId: 17295, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 4x4 (ściana boczna dwustronna)": { plnPrice: 637.14, plnMargin: 227.55, intranetId: 14025, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 4x4 (ściana boczna jednostronna)": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 15860, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 4x4 (ściana boczna jednostronna) WARIANTY": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 14013, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x4 boczna jednostronna)": { plnPrice: 402.948, plnMargin: 143.91, intranetId: 18850, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x4 boczna PREM_BLOCK)": { plnPrice: 516.46, plnMargin: 291.85, intranetId: 19817, category: "wydruk namioty premium", origin: "NULL" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x6 boczna jednostronna)": { plnPrice: 508.312, plnMargin: 181.54, intranetId: 18818, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 4x6 (ściana 4x6 boczna PREM_BLOCK)": { plnPrice: 784.85, plnMargin: 382.64, intranetId: 19819, category: "wydruk namioty premium", origin: "NULL" },
  "Wydruk Adtent Air premium 5x5 (dach)": { plnPrice: 1406.188, plnMargin: 502.21, intranetId: 14006, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 5x5 (sama noga)": { plnPrice: 258.496, plnMargin: 92.32, intranetId: 17297, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 5x5 (same nogi 3)": { plnPrice: 625.436, plnMargin: 223.37, intranetId: 17299, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk Adtent Air premium 5x5 (same nogi 4)": { plnPrice: 797.216, plnMargin: 284.72, intranetId: 17300, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 5x5 (ściana boczna jednostronna)": { plnPrice: 523.936, plnMargin: 187.12, intranetId: 15861, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adTent Air Premium 5x5 (ściana boczna jednostronna) WARIANTY": { plnPrice: 523.936, plnMargin: 187.12, intranetId: 14014, category: "wydruk namioty premium", origin: "Polska" },
  "Wydruk adFrame DTF (do 1mb/medium250)": { plnPrice: 121.828, plnMargin: 43.51, intranetId: 10546, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame DTF (do 1mb/medium320)": { plnPrice: 153.244, plnMargin: 54.73, intranetId: 18011, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame DTF (do 3mb/medium250)": { plnPrice: 311.5, plnMargin: 111.25, intranetId: 16423, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame DTF (do 3mb/medium320)": { plnPrice: 392.924, plnMargin: 140.33, intranetId: 18012, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame DTF (pow. 3mb/medium250)": { plnPrice: 501.228, plnMargin: 179.01, intranetId: 16424, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame DTF (pow. 3mb/medium320)": { plnPrice: 632.604, plnMargin: 225.93, intranetId: 18013, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame STF/STFL (do 1mb/medium250)": { plnPrice: 90.076, plnMargin: 32.17, intranetId: 17953, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame STF/STFL (do 3mb/medium250)": { plnPrice: 224.504, plnMargin: 80.18, intranetId: 17980, category: "wydruk premium", origin: "Polska" },
  "Wydruk adFrame STF/STFL (pow. 3mb/medium250)": { plnPrice: 358.932, plnMargin: 128.19, intranetId: 17978, category: "wydruk premium", origin: "Polska" },
  "Wydruk Air Column ∅60x100 NEW (z zaworem)": { plnPrice: 109.284, plnMargin: 39.03, intranetId: 18679, category: "wydruk premium", origin: "Polska" },
  "Wydruk Air Column ∅60x100 Tribune": { plnPrice: 109.284, plnMargin: 39.03, intranetId: 11613, category: "wydruk premium", origin: "Polska" },
  "Wydruk Air Column ∅60x220 NEW (z zaworem)": { plnPrice: 109.284, plnMargin: 39.03, intranetId: 18472, category: "wydruk premium", origin: "Polska" },
  "Wydruk Air Column ∅60x320": { plnPrice: 335.72, plnMargin: 119.9, intranetId: 17707, category: "wydruk premium", origin: "Polska" },
  "Wydruk Air Column ∅60x320 NEW (z zaworem)": { plnPrice: 335.72, plnMargin: 119.9, intranetId: 18473, category: "wydruk premium", origin: "Polska" },
  "Wydruk Air GATE ROUND": { plnPrice: 937.748, plnMargin: 334.91, intranetId: 18731, category: "wydruk premium", origin: "Polska" },
  "Wydruk Air GATE Triangle 6,5m ver2": { plnPrice: 1105.636, plnMargin: 394.87, intranetId: 16822, category: "wydruk premium", origin: "Polska" },
  "Wydruk niestandardowy MODERN / PREMIUM": { plnPrice: 95.06, plnMargin: 33.95, intranetId: 12181, category: "wydruk premium", origin: "Polska" },
  "Pasowanie wydruków (1szt=1łączenie)": { plnPrice: 33.33, plnMargin: 0, intranetId: 18322, category: "wydruk ramy tekstylne custom niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF LED": { plnPrice: 84.924, plnMargin: 30.33, intranetId: 17137, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD zaokrąglone rogi (do 3mb/medium250)": { plnPrice: 231.924, plnMargin: 82.83, intranetId: 18838, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM (do 1mb/medium250)": { plnPrice: 92.764, plnMargin: 33.13, intranetId: 14193, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM (do 1mb/medium320)": { plnPrice: 112.448, plnMargin: 40.16, intranetId: 18008, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM (do 3mb/medium250)": { plnPrice: 231.924, plnMargin: 82.83, intranetId: 16405, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM (do 3mb/medium320)": { plnPrice: 281.344, plnMargin: 100.48, intranetId: 18009, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM (pow. 3mb/medium250)": { plnPrice: 373.604, plnMargin: 133.43, intranetId: 17599, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM (pow. 3mb/medium320)": { plnPrice: 439.992, plnMargin: 157.14, intranetId: 18010, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk niestandardowy MODERN / KASETON LED": { plnPrice: 74.116, plnMargin: 26.47, intranetId: 12180, category: "wydruk ramy tekstylne custom podświetlane", origin: "Polska" },
  "Wydruk Adframe Flex Led 200x250": { plnPrice: 159.824, plnMargin: 57.08, intranetId: 18551, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk Adframe Flex Led 200x250 tył": { plnPrice: 197.232, plnMargin: 70.44, intranetId: 18552, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk Adframe Flex Led 300x250": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 18549, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk Adframe Flex Led 400x250": { plnPrice: 296.352, plnMargin: 105.84, intranetId: 18553, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk Adframe Flex Led 400x250 tył": { plnPrice: 296.352, plnMargin: 105.84, intranetId: 18554, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame LPO 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 16289, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Lumina RGB 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 18425, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Lumina RGB 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 18420, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "wydruk adFrame Pixlip 100x200": { plnPrice: 81.928, plnMargin: 29.26, intranetId: 18755, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "wydruk adFrame Pixlip 100x250": { plnPrice: 88.704, plnMargin: 31.68, intranetId: 18756, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "wydruk adFrame Pixlip 200x225": { plnPrice: 158.368, plnMargin: 56.56, intranetId: 18766, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "wydruk adFrame Pixlip 200x250": { plnPrice: 158.368, plnMargin: 56.56, intranetId: 18767, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Poster 100x100": { plnPrice: 82.964, plnMargin: 29.63, intranetId: 16737, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Poster 100x150": { plnPrice: 85.568, plnMargin: 30.56, intranetId: 16739, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Poster 100x200": { plnPrice: 88.172, plnMargin: 31.49, intranetId: 16740, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Poster 100x300": { plnPrice: 219.52, plnMargin: 78.4, intranetId: 16742, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Poster 70x100": { plnPrice: 62.496, plnMargin: 22.32, intranetId: 16743, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 12165, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick 100x200 tyl": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 17158, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 12245, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick 85x200": { plnPrice: 72.016, plnMargin: 25.72, intranetId: 18178, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick 85x250": { plnPrice: 77.924, plnMargin: 27.83, intranetId: 18112, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick Battery 100x200": { plnPrice: 84.252, plnMargin: 30.09, intranetId: 16126, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick Single 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 13674, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick Single 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 13676, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Quick Single 85x200": { plnPrice: 80.584, plnMargin: 28.78, intranetId: 13682, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Smart 100x200": { plnPrice: 81.928, plnMargin: 29.26, intranetId: 12228, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Smart 100x250": { plnPrice: 91.336, plnMargin: 32.62, intranetId: 12234, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Smart 200x200": { plnPrice: 144.48, plnMargin: 51.6, intranetId: 14240, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Smart 200x250": { plnPrice: 159.824, plnMargin: 57.08, intranetId: 14239, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Smart 300x200": { plnPrice: 206.808, plnMargin: 73.86, intranetId: 14241, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Smart 300x250": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 12237, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Smart 85x250": { plnPrice: 81.088, plnMargin: 28.96, intranetId: 17564, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Starter 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 13678, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame Starter 100x250": { plnPrice: 90.776, plnMargin: 32.42, intranetId: 13679, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "wydruk adTribune Cubic - 1 bok": { plnPrice: 74.62, plnMargin: 26.65, intranetId: 18316, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "wydruk adTribune Cubic - 4 boki razem": { plnPrice: 169.344, plnMargin: 60.48, intranetId: 18334, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk Pop-up Counter Lightbox 100x100 - keder 14x3mm": { plnPrice: 82.964, plnMargin: 29.63, intranetId: 17858, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk Pop-up Lightbox 100x200": { plnPrice: 81.368, plnMargin: 29.06, intranetId: 17859, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 100x200 [keder 9x3mm]": { plnPrice: 126.336, plnMargin: 45.12, intranetId: 13700, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 100x200 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 153.188, plnMargin: 54.71, intranetId: 18930, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 100x250 [keder 9x3mm]": { plnPrice: 143.248, plnMargin: 51.16, intranetId: 13698, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 100x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 163.296, plnMargin: 58.32, intranetId: 18570, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 100x300 [keder 9x3mm]": { plnPrice: 170.296, plnMargin: 60.82, intranetId: 17854, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 100x300 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 208.152, plnMargin: 74.34, intranetId: 19098, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 200x250 [keder 9x3mm]": { plnPrice: 246.708, plnMargin: 88.11, intranetId: 18681, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 200x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 263.956, plnMargin: 94.27, intranetId: 18748, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 200x300 [keder 9x3mm]": { plnPrice: 0, plnMargin: 0, intranetId: 19035, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 300x250 [keder 9x3mm]": { plnPrice: 309.736, plnMargin: 110.62, intranetId: 13699, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 300x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 364.588, plnMargin: 130.21, intranetId: 18571, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 300x300 [keder 9x3mm]": { plnPrice: 277.592, plnMargin: 99.14, intranetId: 17853, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 85x200 [keder 9x3mm]": { plnPrice: 117.74, plnMargin: 42.05, intranetId: 17618, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 85x250 [keder 9x3mm]": { plnPrice: 130.732, plnMargin: 46.69, intranetId: 18185, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 85x250 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 151.2, plnMargin: 54, intranetId: 18779, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 85x300 [keder 9x3mm]": { plnPrice: 155.568, plnMargin: 55.56, intranetId: 18184, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box 85x300 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 199.5, plnMargin: 71.25, intranetId: 19097, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk SEGO Light Box Counter 100x100 [keder 9x3mm]": { plnPrice: 103.46, plnMargin: 36.95, intranetId: 13701, category: "wydruk ramy tekstylne p&p", origin: "Polska" },
  "Wydruk adFrame CTF": { plnPrice: 203.84, plnMargin: 72.8, intranetId: 12161, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF - górny blockout": { plnPrice: 103.544, plnMargin: 36.98, intranetId: 16132, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF 100x100": { plnPrice: 103.544, plnMargin: 36.98, intranetId: 15140, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF 100x245": { plnPrice: 111.384, plnMargin: 39.78, intranetId: 15146, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF 100x300": { plnPrice: 274.904, plnMargin: 98.18, intranetId: 15147, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF 150x150": { plnPrice: 149.016, plnMargin: 53.22, intranetId: 15142, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF 150x150 - górny blockout": { plnPrice: 149.016, plnMargin: 53.22, intranetId: 15262, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF 50x50": { plnPrice: 58.1, plnMargin: 20.75, intranetId: 15153, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame CTF 50x50 - górny blockout": { plnPrice: 58.1, plnMargin: 20.75, intranetId: 18953, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 100x250": { plnPrice: 111.636, plnMargin: 39.87, intranetId: 14828, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 150x200": { plnPrice: 111.664, plnMargin: 39.88, intranetId: 14827, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 200x200": { plnPrice: 194.74, plnMargin: 69.55, intranetId: 14825, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 200x250": { plnPrice: 197.344, plnMargin: 70.48, intranetId: 14823, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 300x200": { plnPrice: 280.532, plnMargin: 100.19, intranetId: 14822, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 300x250": { plnPrice: 282.996, plnMargin: 101.07, intranetId: 14821, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 400x200": { plnPrice: 366.156, plnMargin: 130.77, intranetId: 14820, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 400x250": { plnPrice: 368.76, plnMargin: 131.7, intranetId: 14819, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 500x200": { plnPrice: 451.836, plnMargin: 161.37, intranetId: 14818, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 500x250": { plnPrice: 454.468, plnMargin: 162.31, intranetId: 14817, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame DTF 600x250": { plnPrice: 540.12, plnMargin: 192.9, intranetId: 14815, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 100x200": { plnPrice: 86.38, plnMargin: 30.85, intranetId: 17956, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 100x250": { plnPrice: 88.956, plnMargin: 31.77, intranetId: 17957, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 150x200": { plnPrice: 89.012, plnMargin: 31.79, intranetId: 17960, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 200x200": { plnPrice: 152.376, plnMargin: 54.42, intranetId: 17963, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 300x200": { plnPrice: 218.456, plnMargin: 78.02, intranetId: 17964, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 300x250": { plnPrice: 220.976, plnMargin: 78.92, intranetId: 17965, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 59x84": { plnPrice: 53.004, plnMargin: 18.93, intranetId: 14606, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 70x100": { plnPrice: 61.348, plnMargin: 21.91, intranetId: 17975, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska" },
  "Wydruk adBoard LED 65x100": { plnPrice: 53.62, plnMargin: 19.15, intranetId: 16220, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adBoard LED 85x120": { plnPrice: 69.356, plnMargin: 24.77, intranetId: 16221, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame CTF LED 100x100": { plnPrice: 83.524, plnMargin: 29.83, intranetId: 15263, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame CTF LED 150x150": { plnPrice: 120.288, plnMargin: 42.96, intranetId: 15265, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame CTF LED 50x50": { plnPrice: 49.364, plnMargin: 17.63, intranetId: 18954, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 100x100": { plnPrice: 83.776, plnMargin: 29.92, intranetId: 14581, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 100x150": { plnPrice: 86.408, plnMargin: 30.86, intranetId: 14613, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 100x200": { plnPrice: 82.208, plnMargin: 29.36, intranetId: 14442, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 100x250": { plnPrice: 91.588, plnMargin: 32.71, intranetId: 14443, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 100x300": { plnPrice: 215.124, plnMargin: 76.83, intranetId: 14832, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 150x150": { plnPrice: 120.568, plnMargin: 43.06, intranetId: 14713, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 150x200": { plnPrice: 123.172, plnMargin: 43.99, intranetId: 10548, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 150x250": { plnPrice: 125.776, plnMargin: 44.92, intranetId: 14075, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 200x200": { plnPrice: 144.536, plnMargin: 51.62, intranetId: 14088, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 200x250": { plnPrice: 159.908, plnMargin: 57.11, intranetId: 14097, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 300x200": { plnPrice: 225.568, plnMargin: 80.56, intranetId: 14111, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 300x250": { plnPrice: 228.312, plnMargin: 81.54, intranetId: 14124, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 400x200": { plnPrice: 293.888, plnMargin: 104.96, intranetId: 14133, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 400x250": { plnPrice: 296.492, plnMargin: 105.89, intranetId: 14142, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 500x200": { plnPrice: 362.208, plnMargin: 129.36, intranetId: 14154, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 500x250": { plnPrice: 364.812, plnMargin: 130.29, intranetId: 14163, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 600x250": { plnPrice: 433.076, plnMargin: 154.67, intranetId: 14180, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 70x100": { plnPrice: 82.712, plnMargin: 29.54, intranetId: 14833, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 70x120": { plnPrice: 82.712, plnMargin: 29.54, intranetId: 14715, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 85x200": { plnPrice: 75.936, plnMargin: 27.12, intranetId: 14834, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 99,2x248": { plnPrice: 91.308, plnMargin: 32.61, intranetId: 14717, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame Lumina RGB 300x250": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 18428, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame Lumina RGB 300x250 tył": { plnPrice: 228.088, plnMargin: 81.46, intranetId: 18432, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame SLM": { plnPrice: 92.316, plnMargin: 32.97, intranetId: 18573, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adFrame SLM 992x992": { plnPrice: 90.748, plnMargin: 32.41, intranetId: 18560, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska" },
  "Wydruk adStand 100": { plnPrice: 61.964, plnMargin: 22.13, intranetId: 10716, category: "wydruk rollup", origin: "Polska" },
  "Wydruk adStand 85": { plnPrice: 53.984, plnMargin: 19.28, intranetId: 10715, category: "wydruk rollup", origin: "Polska" },
  "Wydruk adStand Drop 100": { plnPrice: 61.964, plnMargin: 22.13, intranetId: 18658, category: "wydruk rollup", origin: "Polska" },
  "Wydruk adStand Drop 85": { plnPrice: 53.984, plnMargin: 19.28, intranetId: 18657, category: "wydruk rollup", origin: "Polska" },
  "Wydruk adStand ECO/LUX 100": { plnPrice: 61.964, plnMargin: 22.13, intranetId: 10749, category: "wydruk rollup", origin: "Polska" },
  "Wydruk adStand ECO/LUX 85": { plnPrice: 53.984, plnMargin: 19.28, intranetId: 10750, category: "wydruk rollup", origin: "Polska" },
  "Wymiana wydruku - adStand 100": { plnPrice: 80.108, plnMargin: 28.61, intranetId: 18761, category: "wydruk rollup", origin: "Polska" },
  "Wymiana wydruku - adStand 120": { plnPrice: 93.352, plnMargin: 33.34, intranetId: 18762, category: "wydruk rollup", origin: "Polska" },
  "Wymiana wydruku - adStand 85": { plnPrice: 66.864, plnMargin: 23.88, intranetId: 11956, category: "wydruk rollup", origin: "Polska" },
  "Wymiana wydruku - adStand ECO/LUX": { plnPrice: 241.836, plnMargin: 86.37, intranetId: 11954, category: "wydruk rollup", origin: "Polska" },
  "Wymiana wydruku - adStand TWINS": { plnPrice: 278.852, plnMargin: 99.59, intranetId: 11955, category: "wydruk rollup", origin: "Polska" },
  "Wydruk adTribune Elypse": { plnPrice: 146.916, plnMargin: 52.47, intranetId: 10719, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk adTribune Elypse mini": { plnPrice: 133.224, plnMargin: 47.58, intranetId: 10720, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk adTribune Hit": { plnPrice: 126.784, plnMargin: 45.28, intranetId: 10721, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk adTribune Shell": { plnPrice: 208.964, plnMargin: 74.63, intranetId: 10588, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk adTribune Shell 2in1": { plnPrice: 408.66, plnMargin: 145.95, intranetId: 10589, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk adTribune Standard": { plnPrice: 172.424, plnMargin: 61.58, intranetId: 10723, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz + topper adBox Elypse": { plnPrice: 250.012, plnMargin: 89.29, intranetId: 14335, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz + topper adBox Elypse Mini": { plnPrice: 180.04, plnMargin: 64.3, intranetId: 14336, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz + topper adBox Hit": { plnPrice: 173.964, plnMargin: 62.13, intranetId: 14337, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz + topper adBox Hit Mini": { plnPrice: 156.66, plnMargin: 55.95, intranetId: 14339, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz + topper adBox Ring": { plnPrice: 162.652, plnMargin: 58.09, intranetId: 14340, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz + topper adBox Standard": { plnPrice: 219.212, plnMargin: 78.29, intranetId: 14341, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz adTribune/adBox Elypse": { plnPrice: 146.916, plnMargin: 52.47, intranetId: 11895, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz adTribune/adBox Elypse Mini": { plnPrice: 133.224, plnMargin: 47.58, intranetId: 11897, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz adTribune/adBox Hit": { plnPrice: 127.148, plnMargin: 45.41, intranetId: 11894, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz adTribune/adBox Hit mini": { plnPrice: 114.8, plnMargin: 41, intranetId: 11896, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk płaszcz adTribune/adBox Ring": { plnPrice: 114.8, plnMargin: 41, intranetId: 11925, category: "wydruk trybunka classic", origin: "Polska" },
  "Wydruk adTribune Big Quick LED": { plnPrice: 204.176, plnMargin: 72.92, intranetId: 11479, category: "wydruk trybunka podświetlana", origin: "Polska" },
  "Wydruk adTribune Big Quick LED Auto": { plnPrice: 386.876, plnMargin: 138.17, intranetId: 18512, category: "wydruk trybunka podświetlana", origin: "Polska" },
  "Wydruk adTribune Expo 100x100": { plnPrice: 84.924, plnMargin: 30.33, intranetId: 17040, category: "wydruk trybunka podświetlana", origin: "Polska" },
  "Wydruk adTribune Expo 150x100": { plnPrice: 83.524, plnMargin: 29.83, intranetId: 17402, category: "wydruk trybunka podświetlana", origin: "Polska" },
  "Wydruk adTribune Flex Expo": { plnPrice: 0, plnMargin: 0, intranetId: 19293, category: "wydruk trybunka podświetlana", origin: "Polska" },
  "Wydruk adTribune Smart LED": { plnPrice: 84.924, plnMargin: 30.33, intranetId: 12231, category: "wydruk trybunka podświetlana", origin: "Polska" },
  "Wydruk EDGE Backlit Tribune 1x1 White - KOMPLET": { plnPrice: 255.528, plnMargin: 91.26, intranetId: 15562, category: "wydruk trybunka podświetlana", origin: "Polska" },
  "Wydruk adTribune Big Quick": { plnPrice: 133.308, plnMargin: 47.61, intranetId: 10927, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Case": { plnPrice: 91.196, plnMargin: 32.57, intranetId: 10593, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Oval": { plnPrice: 132.244, plnMargin: 47.23, intranetId: 10569, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Quick": { plnPrice: 110.908, plnMargin: 39.61, intranetId: 10729, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Quick Kidney": { plnPrice: 110.908, plnMargin: 39.61, intranetId: 19266, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Quick Kidney LED": { plnPrice: 151.032, plnMargin: 53.94, intranetId: 19269, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Quick Round LED": { plnPrice: 151.032, plnMargin: 53.94, intranetId: 19270, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Tube_OVAL": { plnPrice: 132.244, plnMargin: 47.23, intranetId: 18650, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune Tube_SQUARE": { plnPrice: 132.244, plnMargin: 47.23, intranetId: 18651, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk adTribune/adBox Tex": { plnPrice: 86.464, plnMargin: 30.88, intranetId: 10591, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk front adTribune Seg NEW": { plnPrice: 100.772, plnMargin: 35.99, intranetId: 17749, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk komplet adTribune Seg": { plnPrice: 212.1, plnMargin: 75.75, intranetId: 15561, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk komplet adTribune Seg NEW": { plnPrice: 212.1, plnMargin: 75.75, intranetId: 17750, category: "wydruk trybunka vario", origin: "Polska" },
  "Wydruk EDGE Plus 3x3S SS - FRONT": { plnPrice: 187.488, plnMargin: 66.96, intranetId: 12306, category: "wydruk vario", origin: "Polska" },
  "Wydruk niestandardowy MODERN / SEG": { plnPrice: 71.428, plnMargin: 25.51, intranetId: 18175, category: "wydruk vario", origin: "Polska" },
  "Wydruk niestandardowy MODERN / VARIO": { plnPrice: 95.424, plnMargin: 34.08, intranetId: 12182, category: "wydruk vario", origin: "Polska" },
  "Wydruk adWall Vario Arch C": { plnPrice: 805.364, plnMargin: 287.63, intranetId: 10926, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Bow": { plnPrice: 1242.836, plnMargin: 443.87, intranetId: 11086, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Cone jednostronny": { plnPrice: 2742.768, plnMargin: 979.56, intranetId: 11072, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Craft dwustronny": { plnPrice: 1453.816, plnMargin: 519.22, intranetId: 12514, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Craft jednostronny": { plnPrice: 1453.816, plnMargin: 519.22, intranetId: 10542, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Crown": { plnPrice: 2055.312, plnMargin: 734.04, intranetId: 11088, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Cwall dwustronny": { plnPrice: 586.684, plnMargin: 209.53, intranetId: 12518, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Fall dwustronny": { plnPrice: 828.828, plnMargin: 296.01, intranetId: 12520, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Fall jednostronny": { plnPrice: 828.828, plnMargin: 296.01, intranetId: 10520, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Flat Ring dwustronny": { plnPrice: 331.996, plnMargin: 118.57, intranetId: 16280, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Flat Ring jednostronny": { plnPrice: 331.996, plnMargin: 118.57, intranetId: 16212, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Flat Ring Water Base dwustronny": { plnPrice: 300.776, plnMargin: 107.42, intranetId: 16291, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Gate": { plnPrice: 1664.712, plnMargin: 594.54, intranetId: 10537, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario In": { plnPrice: 1391.264, plnMargin: 496.88, intranetId: 10521, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Island dwustronny": { plnPrice: 1125.684, plnMargin: 402.03, intranetId: 12524, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Peak dwustronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 12570, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Peak jednostronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 10525, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Qring dwustronny": { plnPrice: 544.46, plnMargin: 194.45, intranetId: 12622, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Qring jednostronny": { plnPrice: 544.46, plnMargin: 194.45, intranetId: 10587, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Ring dwustronny": { plnPrice: 641.34, plnMargin: 229.05, intranetId: 12626, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Ring jednostronny": { plnPrice: 641.34, plnMargin: 229.05, intranetId: 10519, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario S 100 dwustronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 12632, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario S 100 jednostronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 10517, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario S 120 dwustronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 12634, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario S 120 jednostronny": { plnPrice: 297.416, plnMargin: 106.22, intranetId: 10526, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario S 150 dwustronny": { plnPrice: 594.44, plnMargin: 212.3, intranetId: 12636, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Serpentyna 300 dwustronny": { plnPrice: 535.08, plnMargin: 191.1, intranetId: 12638, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Serpentyna 300 jednostronny": { plnPrice: 535.08, plnMargin: 191.1, intranetId: 10535, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Serpentyna 600 dwustronny": { plnPrice: 1068.004, plnMargin: 381.43, intranetId: 12640, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Slope dwustronny": { plnPrice: 578.816, plnMargin: 206.72, intranetId: 12642, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Tower": { plnPrice: 703.892, plnMargin: 251.39, intranetId: 10534, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Wave": { plnPrice: 1116.416, plnMargin: 398.72, intranetId: 10523, category: "wydruk vario crazy", origin: "Polska" },
  "Wydruk adWall Vario Classic 100 dwustronny": { plnPrice: 188.244, plnMargin: 67.23, intranetId: 17717, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 100 jednostronny": { plnPrice: 188.244, plnMargin: 67.23, intranetId: 17718, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 160 dwustronny": { plnPrice: 281.96, plnMargin: 100.7, intranetId: 12492, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 160 jednostronny": { plnPrice: 281.96, plnMargin: 100.7, intranetId: 10510, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 220 dwustronny": { plnPrice: 375.732, plnMargin: 134.19, intranetId: 12494, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 220 jednostronny": { plnPrice: 375.732, plnMargin: 134.19, intranetId: 10501, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 280 dwustronny": { plnPrice: 469.476, plnMargin: 167.67, intranetId: 12496, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 280 jednostronny": { plnPrice: 469.476, plnMargin: 167.67, intranetId: 10502, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic 340 jednostronny": { plnPrice: 563.192, plnMargin: 201.14, intranetId: 10511, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Presto 090 dwustronny": { plnPrice: 174.132, plnMargin: 62.19, intranetId: 12572, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Presto 120 dwustronny": { plnPrice: 221.788, plnMargin: 79.21, intranetId: 12574, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 220 dwustronny": { plnPrice: 367.92, plnMargin: 131.4, intranetId: 12594, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 220 jednostronny": { plnPrice: 367.92, plnMargin: 131.4, intranetId: 10503, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 240 Ø43 dwustronny": { plnPrice: 414.764, plnMargin: 148.13, intranetId: 12602, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 240 Ø43 jednostronny": { plnPrice: 414.764, plnMargin: 148.13, intranetId: 11687, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 280 dwustronny": { plnPrice: 469.476, plnMargin: 167.67, intranetId: 12596, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 300 Ø43 dwustronny": { plnPrice: 508.508, plnMargin: 181.61, intranetId: 12604, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 300 Ø43 jednostronny": { plnPrice: 508.508, plnMargin: 181.61, intranetId: 10527, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 340 dwustronny": { plnPrice: 571.032, plnMargin: 203.94, intranetId: 12598, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 340 jednostronny": { plnPrice: 571.032, plnMargin: 203.94, intranetId: 10586, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 400 Ø43 dwustronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 12606, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 400 Ø43 jednostronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 10986, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 500 Ø43 dwustronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 12608, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 500 Ø43 jednostronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 10985, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 600 Ø43 dwustronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 12610, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Prosta 600 Ø43 jednostronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 10528, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 230 Ø34 dwustronny": { plnPrice: 400.484, plnMargin: 143.03, intranetId: 12540, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 240 Ø43 dwustronny": { plnPrice: 398.944, plnMargin: 142.48, intranetId: 12542, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 240 Ø43 dwustronny bez stóp": { plnPrice: 425.516, plnMargin: 151.97, intranetId: 12536, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 240 Ø43 jednostronny": { plnPrice: 398.944, plnMargin: 142.48, intranetId: 11270, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 240 Ø43 jednostronny bez stóp": { plnPrice: 425.516, plnMargin: 151.97, intranetId: 10505, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 300 Ø43 dwustronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 12546, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 300 Ø43 dwustronny bez stóp": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 12655, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 300 Ø43 jednostronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 10938, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 300 Ø43 jednostronny bez stóp": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 10506, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 310 Ø34 dwustronny": { plnPrice: 549.164, plnMargin: 196.13, intranetId: 12548, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 310 Ø34 jednostronny": { plnPrice: 549.164, plnMargin: 196.13, intranetId: 10514, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 360 Ø34 dwustronny": { plnPrice: 696.108, plnMargin: 248.61, intranetId: 12550, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 400 Ø43 dwustronny": { plnPrice: 649.124, plnMargin: 231.83, intranetId: 12552, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 400 Ø43 jednostronny": { plnPrice: 649.124, plnMargin: 231.83, intranetId: 11180, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 500 Ø43 dwustronny": { plnPrice: 883.596, plnMargin: 315.57, intranetId: 12554, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 500 Ø43 jednostronny": { plnPrice: 883.596, plnMargin: 315.57, intranetId: 11181, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Łukowa 600 Ø43 dwustronny": { plnPrice: 1008.56, plnMargin: 360.2, intranetId: 12556, category: "wydruk vario klasyczne kształty", origin: "Polska" },
  "Wydruk adWall Vario Classic Light 180 dwustronny": { plnPrice: 305.396, plnMargin: 109.07, intranetId: 12528, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Classic Light 180 jednostronny": { plnPrice: 305.396, plnMargin: 109.07, intranetId: 11558, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Classic Light 240 dwustronny": { plnPrice: 399.14, plnMargin: 142.55, intranetId: 12530, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Classic Light 240 jednostronny": { plnPrice: 399.14, plnMargin: 142.55, intranetId: 11559, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Classic Light 300 dwustronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 12532, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Classic Light 300 jednostronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 11560, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Light Horizontal dwustronny": { plnPrice: 227.276, plnMargin: 81.17, intranetId: 12534, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Light Horizontal jednostronny": { plnPrice: 227.276, plnMargin: 81.17, intranetId: 11810, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 060 dwustronny": { plnPrice: 148.96, plnMargin: 53.2, intranetId: 12656, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 060 jednostronny": { plnPrice: 148.96, plnMargin: 53.2, intranetId: 11569, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 090 dwustronny": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 12657, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 090 jednostronny": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 11570, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 120 dwustronny": { plnPrice: 227.08, plnMargin: 81.1, intranetId: 12658, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 120 jednostronny": { plnPrice: 227.08, plnMargin: 81.1, intranetId: 11571, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 150 dwustronny": { plnPrice: 289.772, plnMargin: 103.49, intranetId: 12659, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Light 150 jednostronny": { plnPrice: 289.772, plnMargin: 103.49, intranetId: 11572, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Outdoor dwustronny": { plnPrice: 239.204, plnMargin: 85.43, intranetId: 18602, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Presto Outdoor jednostronny": { plnPrice: 239.204, plnMargin: 85.43, intranetId: 18601, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 240 dwustronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 12660, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 240 jednostronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 11547, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 300 dwustronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 12661, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 300 jednostronny": { plnPrice: 524.132, plnMargin: 187.19, intranetId: 11548, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 400 dwustronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 12616, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 400 jednostronny": { plnPrice: 664.776, plnMargin: 237.42, intranetId: 11549, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 500 dwustronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 12618, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 500 jednostronny": { plnPrice: 821.016, plnMargin: 293.22, intranetId: 11550, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 600 dwustronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 12620, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Prosta Light 600 jednostronny": { plnPrice: 977.256, plnMargin: 349.02, intranetId: 11551, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 240 dwustronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 12558, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 240 jednostronny": { plnPrice: 430.22, plnMargin: 153.65, intranetId: 11530, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 300 dwustronny": { plnPrice: 523.964, plnMargin: 187.13, intranetId: 12560, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 300 jednostronny": { plnPrice: 523.964, plnMargin: 187.13, intranetId: 11531, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 400 dwustronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 12562, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 400 jednostronny": { plnPrice: 680.372, plnMargin: 242.99, intranetId: 11532, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 500 dwustronny": { plnPrice: 836.724, plnMargin: 298.83, intranetId: 12564, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 500 jednostronny": { plnPrice: 836.724, plnMargin: 298.83, intranetId: 11533, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 600 dwustronny": { plnPrice: 1024.184, plnMargin: 365.78, intranetId: 12566, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario Łukowa Light 600 jednostronny": { plnPrice: 1024.184, plnMargin: 365.78, intranetId: 11534, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario-2 Presto Light 090 dwustronny": { plnPrice: 180.236, plnMargin: 64.37, intranetId: 12580, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adWall Vario-2 Presto Light 120 dwustronny": { plnPrice: 227.08, plnMargin: 81.1, intranetId: 12582, category: "wydruk vario light", origin: "Polska" },
  "Wydruk adUp Vario Quadfloat dwustronny": { plnPrice: 2500.596, plnMargin: 893.07, intranetId: 12624, category: "wydruk vario podwieszane", origin: "Polska" },
  "Wydruk adUp Vario Quadfloat jednostronny": { plnPrice: 2500.596, plnMargin: 893.07, intranetId: 10919, category: "wydruk vario podwieszane", origin: "Polska" },
  "Wydruk adUp Vario Ringfloat dwustronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 12628, category: "wydruk vario podwieszane", origin: "Polska" },
  "Wydruk adUp Vario Ringfloat jednostronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 10920, category: "wydruk vario podwieszane", origin: "Polska" },
  "Wydruk adUp Vario Trapfloat dwustronny": { plnPrice: 492.884, plnMargin: 176.03, intranetId: 12646, category: "wydruk vario podwieszane", origin: "Polska" },
  "Wydruk adUp Vario Trifloat dwustronny": { plnPrice: 1430.352, plnMargin: 510.84, intranetId: 12648, category: "wydruk vario podwieszane", origin: "Polska" },
  "WIESZAK TV - VESA 32-82\"": { plnPrice: 52.64, plnMargin: 50.97, intranetId: 16348, category: "zabudowy akcesoria", origin: "Polska", noPrice: true },
  "Wykładzina targowa CIEMNY SZARY 1897": { plnPrice: 103.04, plnMargin: 36.8, intranetId: 16467, category: "zabudowy akcesoria", origin: "Polska" },
  "Wykładzina targowa CUSTOM": { plnPrice: 6.67, plnMargin: 0, intranetId: 12109, category: "zabudowy akcesoria", origin: "Polska" },
  "Wykładzina targowa JASNY SZARY 1719": { plnPrice: 103.04, plnMargin: 36.8, intranetId: 16466, category: "zabudowy akcesoria", origin: "Polska" },
  "Wykładzina targowa NIEBIESKI 4895": { plnPrice: 103.04, plnMargin: 36.8, intranetId: 16468, category: "zabudowy akcesoria", origin: "Polska" },
  "Foldable 100x250": { plnPrice: 606.172, plnMargin: 216.49, intranetId: 16986, category: "zabudowy foldable", origin: "Polska" },
  "Foldable 100x250 (bez wydruku)": { plnPrice: 495.348, plnMargin: 176.91, intranetId: 16985, category: "zabudowy foldable", origin: "Polska" },
  "Foldable 200x250": { plnPrice: 494.82, plnMargin: 431.33, intranetId: 19856, category: "zabudowy foldable", origin: "NULL" },
  "stoisko FOLDABLE 3x2 \"I\"": { plnPrice: 764.85, plnMargin: 655.67, intranetId: 16990, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "stoisko FOLDABLE 3x2 \"L\"": { plnPrice: 1294.01, plnMargin: 1097.27, intranetId: 16991, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "stoisko FOLDABLE 3x2 \"U\"": { plnPrice: 4308.92, plnMargin: 1538.9, intranetId: 16992, category: "zabudowy foldable", origin: "Polska" },
  "stoisko FOLDABLE 3x3 \"L\"": { plnPrice: 1514.51, plnMargin: 1315.33, intranetId: 16993, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "stoisko FOLDABLE 3x3 \"U\"": { plnPrice: 2305.86, plnMargin: 1975, intranetId: 16994, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "stoisko FOLDABLE 4x3 \"L\"": { plnPrice: 1776.7, plnMargin: 1533.4, intranetId: 16996, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "stoisko FOLDABLE 4x3 \"U\"": { plnPrice: 2547.19, plnMargin: 2193.05, intranetId: 16997, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "stoisko FOLDABLE 5x4 \"L\"": { plnPrice: 5514.544, plnMargin: 1969.48, intranetId: 16999, category: "zabudowy foldable", origin: "Polska" },
  "Foldable foot": { plnPrice: 46.088, plnMargin: 16.46, intranetId: 16982, category: "zabudowy foldable akcesoria", origin: "Chiny" },
  "Foldable foot for 180°": { plnPrice: 70.476, plnMargin: 25.17, intranetId: 17044, category: "zabudowy foldable akcesoria", origin: "Chiny" },
  "Foldable half foot for 180°": { plnPrice: 47.628, plnMargin: 17.01, intranetId: 17045, category: "zabudowy foldable akcesoria", origin: "Chiny" },
  "Foldable half foot left": { plnPrice: 43.764, plnMargin: 15.63, intranetId: 16983, category: "zabudowy foldable akcesoria", origin: "Chiny" },
  "Foldable half foot right": { plnPrice: 43.764, plnMargin: 15.63, intranetId: 17190, category: "zabudowy foldable akcesoria", origin: "Chiny" },
  "Foldable set 180deg connector": { plnPrice: 11.088, plnMargin: 3.96, intranetId: 16979, category: "zabudowy foldable akcesoria", origin: "Chiny" },
  "Foldable set 90deg connector": { plnPrice: 11.284, plnMargin: 4.03, intranetId: 16980, category: "zabudowy foldable akcesoria", origin: "Chiny" },
  "adfloor taśma LED RGB (5mb)": { plnPrice: 249.788, plnMargin: 89.21, intranetId: 15441, category: "zabudowy kasetony", origin: "Polska" },
  "mFrame - zestaw łączników": { plnPrice: 156.884, plnMargin: 56.03, intranetId: 16338, category: "zabudowy mframe", origin: "Polska" },
  "mFrame - zestaw łączników zapas": { plnPrice: 0, plnMargin: 0, intranetId: 19261, category: "zabudowy mframe", origin: "Polska" },
  "mFrame DRZWI 992x2480 KOMPLET": { plnPrice: 2324.98, plnMargin: 830.35, intranetId: 12423, category: "zabudowy mframe", origin: "Polska" },
  "mFrame DRZWI 992x2480 KOMPLET NEW (bez wydruku)": { plnPrice: 3051.16, plnMargin: 1089.7, intranetId: 17845, category: "zabudowy mframe", origin: "Polska" },
  "mFrame MASKOWNICA LED zestaw": { plnPrice: 0, plnMargin: 0, intranetId: 19771, category: "zabudowy mframe", origin: "NULL" },
  "mFrame MASKOWNICA ŁUK R1488": { plnPrice: 67.396, plnMargin: 24.07, intranetId: 18857, category: "zabudowy mframe", origin: "Polska" },
  "mFrame MASKOWNICA ŁUK R2976": { plnPrice: 67.396, plnMargin: 24.07, intranetId: 18365, category: "zabudowy mframe", origin: "Polska" },
  "mFrame MASKOWNICA ŁUK R992": { plnPrice: 54.6, plnMargin: 19.5, intranetId: 18858, category: "zabudowy mframe", origin: "Polska" },
  "mFrame RAMA 248x248": { plnPrice: 0, plnMargin: 0, intranetId: 19762, category: "zabudowy mframe", origin: "NULL" },
  "mFrame RAMA 248x2480": { plnPrice: 0, plnMargin: 0, intranetId: 19167, category: "zabudowy mframe", origin: "Polska" },
  "mFrame RAMA 248x2976": { plnPrice: 0, plnMargin: 0, intranetId: 19168, category: "zabudowy mframe", origin: "Polska" },
  "mFrame RAMA 248x496": { plnPrice: 0, plnMargin: 0, intranetId: 19165, category: "zabudowy mframe", origin: "Polska" },
  "mFrame RAMA 248x992": { plnPrice: 0, plnMargin: 0, intranetId: 19166, category: "zabudowy mframe", origin: "Polska" },
  "mFrame RAMA 496x1488": { plnPrice: 601.44, plnMargin: 214.8, intranetId: 11391, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 496x1984": { plnPrice: 749.392, plnMargin: 267.64, intranetId: 11392, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 496x2480": { plnPrice: 883.624, plnMargin: 315.58, intranetId: 10863, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 496x2480 stan": { plnPrice: 928.48, plnMargin: 331.6, intranetId: 19052, category: "zabudowy mframe", origin: "Polska" },
  "mFrame RAMA 496x2976": { plnPrice: 1017.828, plnMargin: 363.51, intranetId: 16388, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 496x496": { plnPrice: 346.752, plnMargin: 123.84, intranetId: 10860, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 496x992": { plnPrice: 480.956, plnMargin: 171.77, intranetId: 10861, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 992x1240": { plnPrice: 711.396, plnMargin: 254.07, intranetId: 10864, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 992x1488": { plnPrice: 735.672, plnMargin: 262.74, intranetId: 11393, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 992x1984": { plnPrice: 883.624, plnMargin: 315.58, intranetId: 11394, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 992x2480": { plnPrice: 1017.828, plnMargin: 363.51, intranetId: 10865, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 992x2480 stan": { plnPrice: 1222.116, plnMargin: 436.47, intranetId: 17164, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 992x2976": { plnPrice: 1152.06, plnMargin: 411.45, intranetId: 16434, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA 992x992": { plnPrice: 615.16, plnMargin: 219.7, intranetId: 11232, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame rama curved corner arch 496x496": { plnPrice: 393.064, plnMargin: 140.38, intranetId: 18361, category: "zabudowy mframe", origin: "Polska" },
  "mFrame RAMA ŁUK 496x1488": { plnPrice: 930.244, plnMargin: 332.23, intranetId: 11395, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA ŁUK 496x2480": { plnPrice: 1352.232, plnMargin: 482.94, intranetId: 10870, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA ŁUK 496x2480 RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 18372, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA ŁUK 496x2976": { plnPrice: 1346.66, plnMargin: 480.95, intranetId: 16549, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA ŁUK 496x496": { plnPrice: 701.904, plnMargin: 250.68, intranetId: 10867, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame RAMA ŁUK 496x992": { plnPrice: 809.816, plnMargin: 289.22, intranetId: 10868, category: "zabudowy mframe", origin: "Chiny" },
  "mFrame trybunka 100x50": { plnPrice: 2358.524, plnMargin: 842.33, intranetId: 17354, category: "zabudowy mframe", origin: "Polska" },
  "mFrame trybunka LED z drzwiami 100x50": { plnPrice: 6395.788, plnMargin: 2284.21, intranetId: 18791, category: "zabudowy mframe", origin: "Polska" },
  "mFrame trybunka LED z drzwiami 100x50 (bez wydruku)": { plnPrice: 5961.788, plnMargin: 2129.21, intranetId: 18789, category: "zabudowy mframe", origin: "Polska" },
  "mFrame trybunka z drzwiami 100x50 (bez wydruku)": { plnPrice: 5713.484, plnMargin: 2040.53, intranetId: 18579, category: "zabudowy mframe", origin: "Polska" },
  "mFrame zabudowa": { plnPrice: 0, plnMargin: 0, intranetId: 10789, category: "zabudowy mframe", origin: "Polska" },
  "stoisko mFrame - ZABUDOWY 2x3 \"I\"": { plnPrice: 4923.352, plnMargin: 1758.34, intranetId: 17012, category: "zabudowy mframe", origin: "Polska" },
  "stoisko mFrame - ZABUDOWY 5x4 \"L\"": { plnPrice: 15270.332, plnMargin: 5453.69, intranetId: 17037, category: "zabudowy mframe", origin: "Polska" },
  "stoisko multiframe - custom 1": { plnPrice: 0, plnMargin: 0, intranetId: 19699, category: "zabudowy mframe", origin: "NULL" },
  "stoisko multiframe - custom 1 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19700, category: "zabudowy mframe", origin: "NULL" },
  "Adtent express - Rzep miękki szary 25mm [pętelka]": { plnPrice: 0.112, plnMargin: 0.04, intranetId: 18736, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "Blat niestandardowy - zabudowy": { plnPrice: 0.196, plnMargin: 0.07, intranetId: 16345, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame - PCV 3mm 5,6x87,3cm OŚCIEŻNICA DRZWI(góra)": { plnPrice: 68.348, plnMargin: 24.41, intranetId: 17365, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame - PCV 3mm 6,2x248cm maskownica pcv": { plnPrice: 27.916, plnMargin: 9.97, intranetId: 18566, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame - PCV OŚCIEŻNICA DRZWI KOMPLET": { plnPrice: 110.992, plnMargin: 39.64, intranetId: 17366, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame - Rzep miękki szary [pętelka]": { plnPrice: 0.56, plnMargin: 0.2, intranetId: 12041, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame - Rzep twardy szary [haczyk]": { plnPrice: 0.504, plnMargin: 0.18, intranetId: 12042, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Blaszka do równania maskownic": { plnPrice: 12.572, plnMargin: 4.49, intranetId: 15080, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame CLAMP CONNECTOR": { plnPrice: 53.256, plnMargin: 19.02, intranetId: 10847, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame CLAMP CONNECTOR PLASTIC": { plnPrice: 14.392, plnMargin: 5.14, intranetId: 12060, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame CLAMP DOOR CONNECTOR": { plnPrice: 77.756, plnMargin: 27.77, intranetId: 10846, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame DOOR NEW ZAWIAS komplet": { plnPrice: 220.836, plnMargin: 78.87, intranetId: 19044, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Glass wall 992x2480 Door set": { plnPrice: 3200.456, plnMargin: 1143.02, intranetId: 18455, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Glass wall pin connector + srew nut": { plnPrice: 140.364, plnMargin: 50.13, intranetId: 18451, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Glass wall rama 99,2x248 boczny RENTAL": { plnPrice: 3.08, plnMargin: 1.1, intranetId: 19101, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Glass wall rama 99,2x248 środkowy RENTAL": { plnPrice: 2.996, plnMargin: 1.07, intranetId: 19100, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Klamka do drzwi": { plnPrice: 101.556, plnMargin: 36.27, intranetId: 15082, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame LAMPKA ADAPTER": { plnPrice: 66.248, plnMargin: 23.66, intranetId: 12079, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame LAMPKA LED": { plnPrice: 318.052, plnMargin: 113.59, intranetId: 10848, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame MASKOWNICA KWADRATOWA": { plnPrice: 81.676, plnMargin: 29.17, intranetId: 12089, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame MASKOWNICA KWADRATOWA GRAFIKA": { plnPrice: 112.112, plnMargin: 40.04, intranetId: 11323, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame MASKOWNICA KWADRATOWA z gwintem": { plnPrice: 257.824, plnMargin: 92.08, intranetId: 17842, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame MASKOWNICA KWADRATOWA z gwintem x4": { plnPrice: 269.528, plnMargin: 96.26, intranetId: 18362, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame MASKOWNICA MOCOWANIE PLASTIKOWE": { plnPrice: 2.94, plnMargin: 1.05, intranetId: 10859, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame MASKOWNICA PŁASKA": { plnPrice: 29.82, plnMargin: 10.65, intranetId: 11321, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame MASKOWNICA ZAŚLEPKA KWADRATOWA": { plnPrice: 9.716, plnMargin: 3.47, intranetId: 12078, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame MASKOWNICA ZAŚLEPKA KWADRATOWA z gwintem": { plnPrice: 9.016, plnMargin: 3.22, intranetId: 17843, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame MASKOWNICA ZAŚLEPKA KWADRATOWA z gwintem x3 i x4": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18370, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame MASKOWNICA ĆWIERĆWAŁEK": { plnPrice: 83.104, plnMargin: 29.68, intranetId: 11322, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame MASKOWNICA ŁUKU ALUMINIOWA": { plnPrice: 73.724, plnMargin: 26.33, intranetId: 10855, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame mocowanie płyty OSB": { plnPrice: 46.144, plnMargin: 16.48, intranetId: 17136, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame NAKRĘTKA DOOR CONNECTOR": { plnPrice: 24.248, plnMargin: 8.66, intranetId: 10878, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame NAKRĘTKA FAT": { plnPrice: 24.248, plnMargin: 8.66, intranetId: 10882, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame NAKRĘTKA SUPERSLIM": { plnPrice: 28.084, plnMargin: 10.03, intranetId: 17882, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame PANEL TV": { plnPrice: 274.372, plnMargin: 97.99, intranetId: 10853, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame PANEL TV z łącznikami": { plnPrice: 476.84, plnMargin: 170.3, intranetId: 17121, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame PIN FAT 10CM": { plnPrice: 34.076, plnMargin: 12.17, intranetId: 11380, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN FAT 4CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 10880, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN FAT 5,6CM (do maskownicy)": { plnPrice: 25.816, plnMargin: 9.22, intranetId: 17844, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN FAT 7CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 11504, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN MOCOWANIE MASKOWNICY ŁUKOWEJ": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 12125, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN SLIM 4CM": { plnPrice: 33.712, plnMargin: 12.04, intranetId: 15077, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN SUPERSLIM 4CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 10881, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN SUPERSLIM 7CM": { plnPrice: 26.404, plnMargin: 9.43, intranetId: 15076, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PIN T LMSM": { plnPrice: 11.06, plnMargin: 3.95, intranetId: 11735, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PROFIL L=1488": { plnPrice: 195.216, plnMargin: 69.72, intranetId: 11383, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PROFIL L=248": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18842, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame PROFIL L=2976": { plnPrice: 353.752, plnMargin: 126.34, intranetId: 13603, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PROFIL L=496": { plnPrice: 74.256, plnMargin: 26.52, intranetId: 10884, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PROFIL L=992": { plnPrice: 117.908, plnMargin: 42.11, intranetId: 10885, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PROFIL ŁUK FI 496MM": { plnPrice: 235.844, plnMargin: 84.23, intranetId: 10888, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PROFIL ŁĄCZNIK 90°": { plnPrice: 9.548, plnMargin: 3.41, intranetId: 11898, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PROFIL ŁĄCZNIK 90° ŁUK R1488": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 18855, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Próg do drzwi": { plnPrice: 101.052, plnMargin: 36.09, intranetId: 15084, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame PÓŁKA UCHWYT PIN LED KOMPLET": { plnPrice: 224.868, plnMargin: 80.31, intranetId: 12464, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame PÓŁKA ZESTAW": { plnPrice: 598.556, plnMargin: 213.77, intranetId: 17938, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame płyta OSB 18mm 860x400mm (pod mocowanie)": { plnPrice: 89.068, plnMargin: 31.81, intranetId: 17449, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame STOPA": { plnPrice: 231.308, plnMargin: 82.61, intranetId: 10857, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame STOPA BLACHA DWUSTRONNA METALOWA 992x496": { plnPrice: 583.464, plnMargin: 208.38, intranetId: 14780, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame STOPA BLACHA JEDNOSTRONNA KRÓTKA": { plnPrice: 143.892, plnMargin: 51.39, intranetId: 11933, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame STOPA POŁÓWKA": { plnPrice: 152.74, plnMargin: 54.55, intranetId: 11141, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame STOPA POŁÓWKA BOCZNA ZESTAW": { plnPrice: 252.812, plnMargin: 90.29, intranetId: 17908, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame STOPA ZESTAW": { plnPrice: 296.94, plnMargin: 106.05, intranetId: 17907, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame TRANSPORT PLASTIK OCHRONNY": { plnPrice: 1.792, plnMargin: 0.64, intranetId: 12468, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame TRANSPORT PLASTIK OCHRONNY ver2 (narożny)": { plnPrice: 5.404, plnMargin: 1.93, intranetId: 17714, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame WÓZEK 6 RAM": { plnPrice: 341.964, plnMargin: 122.13, intranetId: 12092, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame WÓZEK 6/8 RAM PAS BLOKUJĄCY": { plnPrice: 43.82, plnMargin: 15.65, intranetId: 12467, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame WÓZEK 8 RAM": { plnPrice: 383.908, plnMargin: 137.11, intranetId: 12091, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame WÓZEK 8 RAM PAS BLOKUJĄCY": { plnPrice: 43.82, plnMargin: 15.65, intranetId: 12466, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame Zawias do drzwi (komplet)": { plnPrice: 129.164, plnMargin: 46.13, intranetId: 15086, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame ŁĄCZNIK I 2PIN 180 STOPNI": { plnPrice: 92.4, plnMargin: 33, intranetId: 16017, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK I 4PIN 180 STOPNI": { plnPrice: 77.392, plnMargin: 27.64, intranetId: 10833, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK I 6PIN 180 STOPNI": { plnPrice: 82.852, plnMargin: 29.59, intranetId: 11386, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK I REG. DŁ. 180 STOPNI": { plnPrice: 137.48, plnMargin: 49.1, intranetId: 10837, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK L 90 STOPNI": { plnPrice: 115.612, plnMargin: 41.29, intranetId: 10832, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK L REG. DŁ. 90 STOPNI": { plnPrice: 170.24, plnMargin: 60.8, intranetId: 10838, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK LMD UNIWER": { plnPrice: 68.376, plnMargin: 24.42, intranetId: 16113, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame ŁĄCZNIK RAMA REGULOWANA": { plnPrice: 76.692, plnMargin: 27.39, intranetId: 16442, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "mFrame ŁĄCZNIK REGULOWANY KĄT": { plnPrice: 148.372, plnMargin: 52.99, intranetId: 10836, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK T": { plnPrice: 132.216, plnMargin: 47.22, intranetId: 10835, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK WEW/ZEW 90 STOPNI": { plnPrice: 35.196, plnMargin: 12.57, intranetId: 10839, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK ZEW/ZEW 90 STOPNI": { plnPrice: 35.196, plnMargin: 12.57, intranetId: 10840, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "mFrame ŁĄCZNIK ZEW/ZEW/ZEW": { plnPrice: 46.872, plnMargin: 16.74, intranetId: 11143, category: "zabudowy mframe akcesoria", origin: "Chiny" },
  "Taśma dwustronna do wykładzin 50mm x 25m": { plnPrice: 4.648, plnMargin: 1.66, intranetId: 18275, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "Usługa cięcia mFrame RAMA": { plnPrice: 26.67, plnMargin: 0, intranetId: 19114, category: "zabudowy mframe akcesoria", origin: "Polska" },
  "Multiframe 250 SET1 (Black)": { plnPrice: 2978.024, plnMargin: 1063.58, intranetId: 12111, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET1 (Black) (bez wydruku)": { plnPrice: 2857.96, plnMargin: 1020.7, intranetId: 16599, category: "zabudowy multiframe", origin: "Chiny" },
  "Multiframe 250 SET2 (Black)": { plnPrice: 4280.5, plnMargin: 1528.75, intranetId: 12112, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET2 (Black) (bez wydruku)": { plnPrice: 4066.076, plnMargin: 1452.17, intranetId: 16600, category: "zabudowy multiframe", origin: "Chiny" },
  "Multiframe 250 SET2 (Black) dwustronny": { plnPrice: 4494.896, plnMargin: 1605.32, intranetId: 17892, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET3 (Black)": { plnPrice: 5582.948, plnMargin: 1993.91, intranetId: 12113, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET3 (Black) dwustronny": { plnPrice: 5891.704, plnMargin: 2104.18, intranetId: 17893, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET4 (Black)": { plnPrice: 7800.66, plnMargin: 2785.95, intranetId: 12114, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET4 (Black) (bez wydruku)": { plnPrice: 7397.544, plnMargin: 2641.98, intranetId: 16602, category: "zabudowy multiframe", origin: "Chiny" },
  "Multiframe 250 SET4 (Black) dwustronny": { plnPrice: 8203.748, plnMargin: 2929.91, intranetId: 17894, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET5 (Black)": { plnPrice: 9103.164, plnMargin: 3251.13, intranetId: 12115, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 250 SET6 (Black)": { plnPrice: 10405.64, plnMargin: 3716.3, intranetId: 12116, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 301 SET1 (Black)": { plnPrice: 3519.628, plnMargin: 1257.01, intranetId: 17342, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 301 SET1 (Black) (bez wydruku)": { plnPrice: 3366.076, plnMargin: 1202.17, intranetId: 17332, category: "zabudowy multiframe", origin: "Chiny" },
  "Multiframe 301 SET2 (Black)": { plnPrice: 5140.268, plnMargin: 1835.81, intranetId: 16754, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 301 SET3 (Black)": { plnPrice: 7134.68, plnMargin: 2548.1, intranetId: 17347, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 301 SET3 (Black) dwustronny": { plnPrice: 7524.58, plnMargin: 2687.35, intranetId: 17898, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe 301 SET4 (Black)": { plnPrice: 9003.792, plnMargin: 3215.64, intranetId: 16755, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe kantorek 250 (Black)": { plnPrice: 9949.268, plnMargin: 3553.31, intranetId: 11989, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe kantorek 250 (Black) (bez wydruku)": { plnPrice: 9467.444, plnMargin: 3381.23, intranetId: 17931, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe kantorek 301cm (Black)": { plnPrice: 11790.772, plnMargin: 4210.99, intranetId: 16727, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe kantorek drzwi 250 (Black)": { plnPrice: 3172.204, plnMargin: 1132.93, intranetId: 11991, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe NADSTAWKA 100cm (Black) (bez wydruku)": { plnPrice: 2740.976, plnMargin: 978.92, intranetId: 16718, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe Tribune (Black)": { plnPrice: 3355.24, plnMargin: 1198.3, intranetId: 11841, category: "zabudowy multiframe", origin: "Polska" },
  "Multiframe Tribune (Black) (bez wydruku)": { plnPrice: 3263.904, plnMargin: 1165.68, intranetId: 10403, category: "zabudowy multiframe", origin: "Polska" },
  "stoisko Multiframe 250 3x3 \"L\"": { plnPrice: 4458.24, plnMargin: 4029.05, intranetId: 17091, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "stoisko Multiframe 250 4x3 \"L\"": { plnPrice: 7682.88, plnMargin: 7075.97, intranetId: 17095, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "stoisko Multiframe 250 5x4 \"L\"": { plnPrice: 9056.64, plnMargin: 8333.16, intranetId: 17104, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "mFrame blat 995x620 trybunka z drzwiami": { plnPrice: 590.212, plnMargin: 210.79, intranetId: 18402, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria kostka 3x - bez stopki": { plnPrice: 25.116, plnMargin: 8.97, intranetId: 12455, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria kostka 3x - ze stopką": { plnPrice: 32.76, plnMargin: 11.7, intranetId: 12425, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria kostka 4x - bez stopki": { plnPrice: 26.18, plnMargin: 9.35, intranetId: 12454, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria kostka 4x - ze stopką": { plnPrice: 32.76, plnMargin: 11.7, intranetId: 12453, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria ledy do półki": { plnPrice: 132.384, plnMargin: 47.28, intranetId: 11987, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria mocowanie LED dokręcane (Black)": { plnPrice: 10.696, plnMargin: 3.82, intranetId: 11518, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria stopka do kostki 3x": { plnPrice: 0, plnMargin: 0, intranetId: 16410, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria wypełnienie kostki (black)": { plnPrice: 0.112, plnMargin: 0.04, intranetId: 12412, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria zamek profila": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 17516, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria zawieszka (pojedyncza)": { plnPrice: 11.116, plnMargin: 3.97, intranetId: 10407, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe akcesoria zawieszka okrągła 3W": { plnPrice: 135.52, plnMargin: 48.4, intranetId: 11272, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe Blat 1045x400": { plnPrice: 581.224, plnMargin: 207.58, intranetId: 12427, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe panel na zawieszki": { plnPrice: 348.628, plnMargin: 124.51, intranetId: 10400, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe panel TV (Black) NEW": { plnPrice: 821.8, plnMargin: 293.5, intranetId: 10406, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe panel TV (Black) PL OLD": { plnPrice: 1212.596, plnMargin: 433.07, intranetId: 16448, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe profil pionowy dolny 250 (Black)": { plnPrice: 368.704, plnMargin: 131.68, intranetId: 11975, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil pionowy górny 250 (Black)": { plnPrice: 368.704, plnMargin: 131.68, intranetId: 11974, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil poziomy 25cm (Black)": { plnPrice: 154.952, plnMargin: 55.34, intranetId: 11541, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil poziomy 40cm (Black)": { plnPrice: 153.776, plnMargin: 54.92, intranetId: 11192, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil poziomy 89,9cm (Black)": { plnPrice: 196.028, plnMargin: 70.01, intranetId: 11977, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil przedłużka 100 (Black)": { plnPrice: 341.18, plnMargin: 121.85, intranetId: 10402, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil przedłużka 50 (Black)": { plnPrice: 213.388, plnMargin: 76.21, intranetId: 15427, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil rozpórka (Black)": { plnPrice: 83.3, plnMargin: 29.75, intranetId: 11978, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil rozpórka 40cm (Black)": { plnPrice: 66.276, plnMargin: 23.67, intranetId: 14213, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe profil rozpórka do kantorka (Black)": { plnPrice: 126.14, plnMargin: 45.05, intranetId: 10967, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe półka": { plnPrice: 410.34, plnMargin: 146.55, intranetId: 11980, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe stopa ciężka (Black)": { plnPrice: 273.028, plnMargin: 97.51, intranetId: 11982, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe stopa ciężka PL (Black) 1 szt bez opakowania": { plnPrice: 520.52, plnMargin: 185.9, intranetId: 16100, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe stopa połówka": { plnPrice: 214.032, plnMargin: 76.44, intranetId: 10745, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe stopy ciężkie (Black) 2szt z torba": { plnPrice: 1132.6, plnMargin: 404.5, intranetId: 17125, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe stopy połówki 2szt z torbą": { plnPrice: 1132.6, plnMargin: 404.5, intranetId: 17126, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe torba bez kółek 250": { plnPrice: 372.372, plnMargin: 132.99, intranetId: 11976, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe torba na kółkach krótka": { plnPrice: 475.468, plnMargin: 169.81, intranetId: 11836, category: "zabudowy multiframe akcesoria", origin: "Chiny" },
  "Multiframe uchwyt na zawieszki płaski MF003": { plnPrice: 146.804, plnMargin: 52.43, intranetId: 11275, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe zestaw dwóch półek": { plnPrice: 911.848, plnMargin: 325.66, intranetId: 15578, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe zestaw łączników kantorek 250": { plnPrice: 1008.532, plnMargin: 360.19, intranetId: 17349, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe łącznik dwustronny nadstawka Black": { plnPrice: 47.152, plnMargin: 16.84, intranetId: 11905, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe łącznik kantorek 250 klamka (dolny+górny)": { plnPrice: 314.048, plnMargin: 112.16, intranetId: 12119, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe łącznik kantorek 250 zawias (dolny+górny)": { plnPrice: 321.524, plnMargin: 114.83, intranetId: 12120, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe łącznik kantorek 350": { plnPrice: 169.4, plnMargin: 60.5, intranetId: 16922, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe łącznik kantorek prosty": { plnPrice: 142.1, plnMargin: 50.75, intranetId: 12121, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe łącznik L 90° (Black)": { plnPrice: 57.708, plnMargin: 20.61, intranetId: 11575, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe łącznik TV bok kantorka (zestaw NEW TV)": { plnPrice: 323.568, plnMargin: 115.56, intranetId: 17998, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe śruba do stopy": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17159, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "Multiframe śruba do łącznika L": { plnPrice: 0.364, plnMargin: 0.13, intranetId: 17160, category: "zabudowy multiframe akcesoria", origin: "Polska" },
  "adTribune SEGO Cubic 1x1": { plnPrice: 1142.904, plnMargin: 408.18, intranetId: 18335, category: "zabudowy sego", origin: "Polska" },
  "adTribune SEGO Cubic 4x1": { plnPrice: 1271.928, plnMargin: 454.26, intranetId: 18326, category: "zabudowy sego", origin: "Polska" },
  "adTribune SEGO Cubic lock": { plnPrice: 2332.988, plnMargin: 833.21, intranetId: 19259, category: "zabudowy sego", origin: "Polska" },
  "POKAZÓWKA_SEGO 100x250": { plnPrice: 11.256, plnMargin: 4.02, intranetId: 17932, category: "zabudowy sego", origin: "NULL" },
  "SEGO 100x200": { plnPrice: 2434.208, plnMargin: 869.36, intranetId: 13692, category: "zabudowy sego", origin: "Polska" },
  "SEGO 100x200 (bez wydruku)": { plnPrice: 2181.564, plnMargin: 779.13, intranetId: 13524, category: "zabudowy sego", origin: "Chiny" },
  "SEGO 100x250": { plnPrice: 2617.468, plnMargin: 934.81, intranetId: 13693, category: "zabudowy sego", origin: "Polska" },
  "SEGO 100x250 (bez wydruku)": { plnPrice: 2331, plnMargin: 832.5, intranetId: 13525, category: "zabudowy sego", origin: "Chiny" },
  "SEGO 100x250 v2": { plnPrice: 2452.772, plnMargin: 875.99, intranetId: 17833, category: "zabudowy sego", origin: "Polska" },
  "SEGO 200x250": { plnPrice: 4577.048, plnMargin: 1634.66, intranetId: 18680, category: "zabudowy sego", origin: "Polska" },
  "SEGO 200x250 (bez wydruku)": { plnPrice: 4083.66, plnMargin: 1458.45, intranetId: 18495, category: "zabudowy sego", origin: "Chiny" },
  "SEGO 300x250": { plnPrice: 5931.884, plnMargin: 2118.53, intranetId: 13694, category: "zabudowy sego", origin: "Polska" },
  "SEGO 300x250 (bez wydruku)": { plnPrice: 5312.328, plnMargin: 1897.26, intranetId: 13526, category: "zabudowy sego", origin: "Chiny" },
  "SEGO 85x250": { plnPrice: 2494.744, plnMargin: 890.98, intranetId: 18347, category: "zabudowy sego", origin: "Polska" },
  "SEGO 85x250 (bez wydruku)": { plnPrice: 2233.28, plnMargin: 797.6, intranetId: 18100, category: "zabudowy sego", origin: "Chiny" },
  "SEGO 85x250 v2": { plnPrice: 2460.36, plnMargin: 878.7, intranetId: 18346, category: "zabudowy sego", origin: "Polska" },
  "SEGO Counter 100x100": { plnPrice: 2064.188, plnMargin: 737.21, intranetId: 13695, category: "zabudowy sego", origin: "Polska" },
  "SEGO Counter 100x100 (bez wydruku)": { plnPrice: 1857.268, plnMargin: 663.31, intranetId: 13523, category: "zabudowy sego", origin: "Polska" },
  "SEGO Cubic Counter 50x50x100 (bez wydruku)": { plnPrice: 973.56, plnMargin: 347.7, intranetId: 18104, category: "zabudowy sego", origin: "Polska" },
  "SEGO Door Kit 100cm with wheel": { plnPrice: 818.244, plnMargin: 292.23, intranetId: 17143, category: "zabudowy sego", origin: "Polska" },
  "stoisko SEGO": { plnPrice: 0, plnMargin: 0, intranetId: 17997, category: "zabudowy sego", origin: "Polska" },
  "stoisko SEGO Light Box 2x3 \"L\"": { plnPrice: 4159.35, plnMargin: 3864.4, intranetId: 17002, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "stoisko SEGO Light Box 3x3 \"L\"": { plnPrice: 12036.556, plnMargin: 4298.77, intranetId: 17004, category: "zabudowy sego", origin: "Polska" },
  "GVE zasilacz 252W SEGO": { plnPrice: 608.524, plnMargin: 217.33, intranetId: 13536, category: "zabudowy sego akcesoria", origin: "Polska" },
  "Pasek ledowy do SEGO 100cm": { plnPrice: 404.292, plnMargin: 144.39, intranetId: 13534, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO 180 Connector": { plnPrice: 52.304, plnMargin: 18.68, intranetId: 16963, category: "zabudowy sego akcesoria", origin: "Chiny" },
  "SEGO End block L for VP": { plnPrice: 0, plnMargin: 0, intranetId: 13543, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO End block R for VP": { plnPrice: 0, plnMargin: 0, intranetId: 13544, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO Extender 50 cm": { plnPrice: 97.076, plnMargin: 34.67, intranetId: 16964, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO Extension Cable 5m": { plnPrice: 59.696, plnMargin: 21.32, intranetId: 13555, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO Hi-LOW connector": { plnPrice: 12.348, plnMargin: 4.41, intranetId: 16962, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO kabel S 1.2m": { plnPrice: 43.792, plnMargin: 15.64, intranetId: 13538, category: "zabudowy sego akcesoria", origin: "Chiny" },
  "SEGO kabel Y 2.6m": { plnPrice: 96.572, plnMargin: 34.49, intranetId: 13537, category: "zabudowy sego akcesoria", origin: "Chiny" },
  "SEGO kabel Y 3.5m": { plnPrice: 123.76, plnMargin: 44.2, intranetId: 18774, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO klamra do stóp": { plnPrice: 1.092, plnMargin: 0.39, intranetId: 13548, category: "zabudowy sego akcesoria", origin: "Chiny" },
  "SEGO LED Extension – łącznik": { plnPrice: 35.252, plnMargin: 12.59, intranetId: 13539, category: "zabudowy sego akcesoria", origin: "Chiny" },
  "SEGO Mini FOOT": { plnPrice: 23.94, plnMargin: 8.55, intranetId: 17145, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO MP cross": { plnPrice: 0, plnMargin: 0, intranetId: 13551, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO MP support": { plnPrice: 1.092, plnMargin: 0.39, intranetId: 13550, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO Półstopa lewa": { plnPrice: 295.456, plnMargin: 105.52, intranetId: 16960, category: "zabudowy sego akcesoria", origin: "Chiny" },
  "SEGO Półstopa prawa": { plnPrice: 187.964, plnMargin: 67.13, intranetId: 16961, category: "zabudowy sego akcesoria", origin: "Chiny" },
  "SEGO Shelf Kit 100cm": { plnPrice: 708.512, plnMargin: 253.04, intranetId: 13529, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO Slide block for HP": { plnPrice: 5.6, plnMargin: 2, intranetId: 13545, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO Slide block R for HP": { plnPrice: 5.516, plnMargin: 1.97, intranetId: 13541, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO TV Bracket Kit 100cm": { plnPrice: 830.816, plnMargin: 296.72, intranetId: 13528, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO łącznik Bridge": { plnPrice: 38.052, plnMargin: 13.59, intranetId: 13533, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO łącznik clamp": { plnPrice: 11.676, plnMargin: 4.17, intranetId: 13530, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO łącznik wewnętrzny L": { plnPrice: 11.676, plnMargin: 4.17, intranetId: 13531, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SEGO łącznik zewnętrzny L": { plnPrice: 57.624, plnMargin: 20.58, intranetId: 13532, category: "zabudowy sego akcesoria", origin: "Polska" },
  "SET10 adFrame Smart 200x250 3szt + 100x200 + 100x250 + adtribune smart": { plnPrice: 17519.152, plnMargin: 6256.84, intranetId: 16258, category: "zabudowy smart", origin: "Polska" },
  "SET2 adFrame Smart 100x250 3szt + adtribune smart": { plnPrice: 7761.768, plnMargin: 2772.06, intranetId: 16244, category: "zabudowy smart", origin: "Polska" },
  "SET3 adFrame Smart 100x250 7szt + adtribune smart": { plnPrice: 16630.124, plnMargin: 5939.33, intranetId: 16245, category: "zabudowy smart", origin: "Polska" },
  "SET4 adFrame Smart 100x250 5szt + adtribune smart": { plnPrice: 12325.18, plnMargin: 4401.85, intranetId: 16246, category: "zabudowy smart", origin: "Polska" },
  "SET5 adFrame Smart 200x250 4szt + adtribune smart": { plnPrice: 16948.344, plnMargin: 6052.98, intranetId: 16247, category: "zabudowy smart", origin: "Polska" },
  "SET6 adFrame Smart 300x250 2szt + 200x250 2szt + adtribune smart": { plnPrice: 26998.496, plnMargin: 9642.32, intranetId: 16254, category: "zabudowy smart", origin: "Polska" },
  "SET7 adFrame Smart 300x250 + 200x250 + adtribune smart": { plnPrice: 10643.556, plnMargin: 3801.27, intranetId: 16255, category: "zabudowy smart", origin: "Polska" },
  "adStand L 100": { plnPrice: 312.76, plnMargin: 111.7, intranetId: 16, category: "ścianki banerowe", origin: "Polska" },
  "adStand L 120": { plnPrice: 449.736, plnMargin: 160.62, intranetId: 10039, category: "ścianki banerowe", origin: "Polska" },
  "adStand L 150": { plnPrice: 688.128, plnMargin: 245.76, intranetId: 10041, category: "ścianki banerowe", origin: "Polska" },
  "adStand L 60": { plnPrice: 346.192, plnMargin: 123.64, intranetId: 10009, category: "ścianki banerowe", origin: "Polska" },
  "adStand L 80": { plnPrice: 360.08, plnMargin: 128.6, intranetId: 69, category: "ścianki banerowe", origin: "Polska" },
  "adWall L 200": { plnPrice: 774.844, plnMargin: 276.73, intranetId: 10043, category: "ścianki banerowe", origin: "Polska" },
  "adStand L maszt": { plnPrice: 65.912, plnMargin: 23.54, intranetId: 10149, category: "ścianki banerowe akcesoria", origin: "Polska" },
  "adBag - torba reklamowa": { plnPrice: 30.03, plnMargin: 4.2, intranetId: 18194, category: "wydruk premium", origin: "Polska", noPrice: true },
  "adBoard Hips 68x120 (bez wydruku)": { plnPrice: 214.59, plnMargin: 206.26, intranetId: 16138, category: "potykacze", origin: "Polska", noPrice: true },
  "adBoard LED - big water base": { plnPrice: 124.99, plnMargin: 123.32, intranetId: 16195, category: "potykacze", origin: "Chiny", noPrice: true },
  "adBoard LED - frame 65x100cm": { plnPrice: 297.26, plnMargin: 295.59, intranetId: 16203, category: "potykacze", origin: "Chiny", noPrice: true },
  "adBoard LED - frame 85x120cm": { plnPrice: 368.59, plnMargin: 366.92, intranetId: 16196, category: "potykacze", origin: "Chiny", noPrice: true },
  "adBoard LED - small water base": { plnPrice: 82.14, plnMargin: 80.47, intranetId: 16202, category: "potykacze", origin: "Chiny", noPrice: true },
  "adBoard LED 65x100": { plnPrice: 475.51, plnMargin: 414.17, intranetId: 16215, category: "potykacze", origin: "Polska", noPrice: true },
  "adBoard LED 65x100 (bez wydruku)": { plnPrice: 396.04, plnMargin: 376.04, intranetId: 16218, category: "potykacze", origin: "Chiny", noPrice: true },
  "adBoard LED 85x120 (bez wydruku)": { plnPrice: 510.23, plnMargin: 490.23, intranetId: 16217, category: "potykacze", origin: "Chiny", noPrice: true },
  "adBoard OWZ B2(bez wydruku)": { plnPrice: 160.27, plnMargin: 151.94, intranetId: 13895, category: "potykacze", origin: "Chiny", noPrice: true },
  "adBox Easy (bez wydruku)": { plnPrice: 143.82, plnMargin: 127.15, intranetId: 19178, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "adBox Elypse blat niestandard": { plnPrice: 66.59, plnMargin: 59.92, intranetId: 15103, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "AdBox Elypse CN (bez wydruku)": { plnPrice: 320.53, plnMargin: 312.2, intranetId: 19641, category: "półprodukty", origin: "NULL", noPrice: true },
  "adBox Elypse komplet blat+półka": { plnPrice: 126.51, plnMargin: 119.84, intranetId: 17460, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Elypse Mini blat": { plnPrice: 64.97, plnMargin: 58.3, intranetId: 11339, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Hit blat": { plnPrice: 78.17, plnMargin: 71.5, intranetId: 11337, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Hit C (bez wydruku)": { plnPrice: 415.64, plnMargin: 381.2, intranetId: 10362, category: "stoiska degustacyjne", origin: "Chiny", noPrice: true },
  "adBox Hit C blat niestandard": { plnPrice: 0, plnMargin: 0, intranetId: 15105, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Hit C toper": { plnPrice: 28.58, plnMargin: 16.71, intranetId: 13933, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Hit komplet blat+półka": { plnPrice: 124.36, plnMargin: 117.69, intranetId: 17491, category: "półprodukty", origin: "Polska", noPrice: true },
  "adBox Hit Mini (bez wydruku)": { plnPrice: 327.2, plnMargin: 282.76, intranetId: 10104, category: "stoiska degustacyjne", origin: "Chiny", noPrice: true },
  "adBox Hit Mini komplet blat+półka": { plnPrice: 91.57, plnMargin: 74.9, intranetId: 17537, category: "classic", origin: "Polska", noPrice: true },
  "adBox Hit mini toper": { plnPrice: 24.68, plnMargin: 12.81, intranetId: 10273, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Hit toper": { plnPrice: 28.58, plnMargin: 16.71, intranetId: 10047, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Ring (bez wydruku)": { plnPrice: 345.86, plnMargin: 305.59, intranetId: 10276, category: "stoiska degustacyjne", origin: "Chiny", noPrice: true },
  "adBox Ring blat": { plnPrice: 60.17, plnMargin: 53.5, intranetId: 11342, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Ring komplet blat + półka": { plnPrice: 135.16, plnMargin: 126.83, intranetId: 18182, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "adBox Standard (bez wydruku)": { plnPrice: 701.28, plnMargin: 634.61, intranetId: 10017, category: "stoiska degustacyjne", origin: "Chiny", noPrice: true },
  "adBox Standard komplet blat+półka": { plnPrice: 166.07, plnMargin: 159.4, intranetId: 17566, category: "półprodukty", origin: "Polska", noPrice: true },
  "AdCart 200": { plnPrice: 152.13, plnMargin: 152.13, intranetId: 19678, category: "zabudowy akcesoria", origin: "NULL", noPrice: true },
  "adColumn Air podstawa drewniana": { plnPrice: 0, plnMargin: 0, intranetId: 16144, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adColumn Air ∅60x100": { plnPrice: 374.86, plnMargin: 252.08, intranetId: 11868, category: "słupy", origin: "Chiny", noPrice: true },
  "adColumn Air ∅60x100 - ver TPU (bez wydruku)": { plnPrice: 320.56, plnMargin: 290.56, intranetId: 18668, category: "słupy", origin: "Polska", noPrice: true },
  "adColumn Air ∅60x100 TPU": { plnPrice: 116.54, plnMargin: 99.87, intranetId: 15752, category: "słupy", origin: "Chiny", noPrice: true },
  "adColumn Air ∅60x100 TPU z zaworem": { plnPrice: 0, plnMargin: 0, intranetId: 18618, category: "słupy", origin: "Polska", noPrice: true },
  "adColumn Air ∅60x220 (bez wydruku)": { plnPrice: 195.21, plnMargin: 165.21, intranetId: 11778, category: "słupy", origin: "Chiny", noPrice: true },
  "adColumn Air ∅60x220 - zestaw bez TPU": { plnPrice: 130.09, plnMargin: 100.09, intranetId: 19603, category: "słupy", origin: "NULL", noPrice: true },
  "adColumn Air ∅60x220 TPU": { plnPrice: 172.61, plnMargin: 155.94, intranetId: 15743, category: "słupy", origin: "Chiny", noPrice: true },
  "adColumn Air ∅60x300 (bez wydruku)": { plnPrice: 219.17, plnMargin: 185.84, intranetId: 11777, category: "słupy", origin: "Chiny", noPrice: true },
  "adDeck personalizowany dwustronny": { plnPrice: 142.26, plnMargin: 73.99, intranetId: 15852, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "adFlag DROP PRO XL": { plnPrice: 222.82, plnMargin: 118.93, intranetId: 15661, category: "flagi", origin: "Polska", noPrice: true },
  "adFlag DROP XL": { plnPrice: 192.49, plnMargin: 90.27, intranetId: 15657, category: "flagi", origin: "Polska", noPrice: true },
  "Adflag Karton 1szt": { plnPrice: 2.76, plnMargin: 0.26, intranetId: 15733, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "Adflag Karton 5szt": { plnPrice: 6.03, plnMargin: 0.4, intranetId: 17643, category: "półprodukty", origin: "Polska", noPrice: true },
  "adFlag L CN (bez wydruku)": { plnPrice: 51.24, plnMargin: 46.24, intranetId: 19635, category: "flagi", origin: "NULL", noPrice: true },
  "adFlag M CN (bez wydruku)": { plnPrice: 43, plnMargin: 38, intranetId: 19636, category: "flagi", origin: "NULL", noPrice: true },
  "adFlag nóżki gumowe 4 szt - kpl": { plnPrice: 9.96, plnMargin: 6.63, intranetId: 15694, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adFlag nóżki plastikowe 4 szt - kpl": { plnPrice: 3.37, plnMargin: 0.04, intranetId: 19723, category: "outdoor akcesoria", origin: "NULL", noPrice: true },
  "adFlag PRO L (bez wydruku)": { plnPrice: 65.88, plnMargin: 60.88, intranetId: 15682, category: "flagi", origin: "Polska", noPrice: true },
  "adFlag PRO M (bez wydruku)": { plnPrice: 50.48, plnMargin: 45.48, intranetId: 15684, category: "flagi", origin: "Polska", noPrice: true },
  "adFlag PRO zacisk do masztu S/M/L": { plnPrice: 7.2, plnMargin: 2.2, intranetId: 16817, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adFlag PRO zacisk do masztu XL": { plnPrice: 7.2, plnMargin: 2.2, intranetId: 16816, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adFlag S CN (bez wydruku)": { plnPrice: 34.78, plnMargin: 29.78, intranetId: 19637, category: "flagi", origin: "NULL", noPrice: true },
  "Adflag Torba CN": { plnPrice: 6.67, plnMargin: 0, intranetId: 19639, category: "outdoor akcesoria", origin: "NULL", noPrice: true },
  "adFlag XL CN (bez wydruku)": { plnPrice: 67.73, plnMargin: 62.73, intranetId: 19638, category: "flagi", origin: "NULL", noPrice: true },
  "adFlag zacisk do masztu XL": { plnPrice: 5.53, plnMargin: 2.2, intranetId: 16819, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adFloor 5x4": { plnPrice: 5691.12, plnMargin: 5462.79, intranetId: 16120, category: "adfloor", origin: "Polska", noPrice: true },
  "adFloor 5x4 najazdy": { plnPrice: 4001.02, plnMargin: 3847.69, intranetId: 16265, category: "adfloor", origin: "Polska", noPrice: true },
  "adFloor kontroler LED + pilot (1szt max na 10mb taśmy LED RGB)": { plnPrice: 70.18, plnMargin: 68.51, intranetId: 15443, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor kontroler LED RGB": { plnPrice: 31.01, plnMargin: 29.34, intranetId: 18783, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor LED RGB": { plnPrice: 0, plnMargin: 0, intranetId: 19502, category: "adfloor", origin: "NULL", noPrice: true },
  "adFloor maskownica prosta": { plnPrice: 85.13, plnMargin: 83.46, intranetId: 16153, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor najazd narożny lewy": { plnPrice: 143.18, plnMargin: 136.51, intranetId: 15381, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd narożny PCV listwa": { plnPrice: 16.32, plnMargin: 14.65, intranetId: 15388, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd narożny prawy": { plnPrice: 143.18, plnMargin: 136.51, intranetId: 15382, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd narożny sklejka": { plnPrice: 41.26, plnMargin: 39.59, intranetId: 15391, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor najazd plastikowy narożnik": { plnPrice: 25.04, plnMargin: 23.37, intranetId: 15389, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd prosty": { plnPrice: 143.38, plnMargin: 136.71, intranetId: 15380, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd prosty PCV kątownik długi na LED": { plnPrice: 3.87, plnMargin: 2.2, intranetId: 15722, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd prosty PCV kątownik krótki na LED": { plnPrice: 4.07, plnMargin: 2.4, intranetId: 15384, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd prosty PCV listwa": { plnPrice: 16.32, plnMargin: 14.65, intranetId: 15383, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor najazd prosty sklejka": { plnPrice: 41.26, plnMargin: 39.59, intranetId: 15390, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor pilot do kontrolera RGB": { plnPrice: 54.78, plnMargin: 53.11, intranetId: 18784, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor profil panelowy 0,5m": { plnPrice: 17.69, plnMargin: 16.02, intranetId: 16456, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor profil wzmocnienie 0,5m": { plnPrice: 21.69, plnMargin: 20.02, intranetId: 16457, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFloor płyta 496x997mm, grubość 12mm": { plnPrice: 36.29, plnMargin: 34.62, intranetId: 17206, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor zasilacz 450W/12V do taśma LED RGB": { plnPrice: 581.29, plnMargin: 577.96, intranetId: 15442, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "adFloor złączka LED": { plnPrice: 4.65, plnMargin: 2.98, intranetId: 15444, category: "adfloor akcesoria", origin: "Chiny", noPrice: true },
  "adFoam Cube NIESTANDARD (bez wydruku)": { plnPrice: 46.91, plnMargin: 38.58, intranetId: 15732, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "adFoam Forma (bez wydruku)": { plnPrice: 558.33, plnMargin: 550, intranetId: 11820, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "adFoam Roller (bez wydruku)": { plnPrice: 1085.06, plnMargin: 1076.73, intranetId: 11830, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "adFoam Roller Mini(bez wydruku)": { plnPrice: 125.86, plnMargin: 117.53, intranetId: 11819, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "adFoam Via (bez wydruku)": { plnPrice: 581.96, plnMargin: 581.96, intranetId: 10574, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "adFolder A4 walizka w kartonie": { plnPrice: 52.36, plnMargin: 44.03, intranetId: 17146, category: "stojaki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adFolder Premium z nadstawką": { plnPrice: 0, plnMargin: 0, intranetId: 19109, category: "stojaki reklamowe", origin: "Polska", noPrice: true },
  "adFolder Prestige/Premium nadstawka": { plnPrice: 34.98, plnMargin: 12.33, intranetId: 12316, category: "stojaki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adFolder Prestige/Premium nadstawka (bez wydruku)": { plnPrice: 25.33, plnMargin: 8.66, intranetId: 12313, category: "stojaki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adFrame - Pakowanie (aby poprawnie dobrać karton, należy zweryfikować który profil jest najdłuższy i wybrać karton, w który się zmieści)": { plnPrice: 138.92, plnMargin: 113.64, intranetId: 12210, category: "usługi", origin: "Polska", noPrice: true },
  "adFrame - Pakowanie STF/STFL": { plnPrice: 0, plnMargin: 0, intranetId: 19841, category: "usługi", origin: "NULL", noPrice: true },
  "adFrame - Pakowanie STF/STFL (aby poprawnie dobrać karton, należy zweryfikować który profil jest najdłuższy i wybrać karton, w który się zmieści)": { plnPrice: 0, plnMargin: 0, intranetId: 19842, category: "usługi", origin: "NULL", noPrice: true },
  "adFrame - taśma do wydruku": { plnPrice: 0.61, plnMargin: 0.06, intranetId: 15596, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame - Zasilacze (aby poprawnie dobrać zasilacz, należy obliczyć moc (W) i uwzględnić 20% zapas)": { plnPrice: 0, plnMargin: 0, intranetId: 19843, category: "usługi", origin: "NULL", noPrice: true },
  "adFrame - zestaw do podwieszenia 2m (1 PKT) do MO": { plnPrice: 1.67, plnMargin: 0, intranetId: 17791, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "adFrame adFrame Challenger 100x250 (bez wydruku)": { plnPrice: 2205.7, plnMargin: 2197.37, intranetId: 18234, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame CTF 100x100x100 (bez wydruku)": { plnPrice: 393.57, plnMargin: 268.57, intranetId: 15128, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF 100x100x100 Hanging": { plnPrice: 854.66, plnMargin: 539.91, intranetId: 15835, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame CTF 100x100x100 Hanging (bez wydruku)": { plnPrice: 444.75, plnMargin: 318.08, intranetId: 15836, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame CTF 100x50x100 (bez wydruku)": { plnPrice: 356.49, plnMargin: 238.16, intranetId: 15123, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF 100x50x100 Hanging": { plnPrice: 760, plnMargin: 448.34, intranetId: 15837, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame CTF 100x50x100 Hanging (bez wydruku)": { plnPrice: 407.67, plnMargin: 287.67, intranetId: 15838, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame CTF 100x50x100 Hanging LED": { plnPrice: 862.58, plnMargin: 544.6, intranetId: 15223, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame CTF 100x50x100 Hanging LED (bez wydruku)": { plnPrice: 569.34, plnMargin: 407.67, intranetId: 15224, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame CTF 102x104x100 (bez wydruku) Nadstawka multiframe LED": { plnPrice: 702.25, plnMargin: 551.45, intranetId: 17601, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame CTF 102x104x50 (bez wydruku) Nadstawka multiframe": { plnPrice: 379.07, plnMargin: 258.27, intranetId: 16278, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame CTF 102x104x50 (bez wydruku) Nadstawka multiframe LED": { plnPrice: 545.05, plnMargin: 407.58, intranetId: 16276, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame CTF 150x100x150 Hanging (bez wydruku)": { plnPrice: 528.17, plnMargin: 388.17, intranetId: 15840, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame CTF 150x150x150": { plnPrice: 1054.15, plnMargin: 688.31, intranetId: 15133, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame CTF 150x150x150 (bez wydruku)": { plnPrice: 514.09, plnMargin: 369.09, intranetId: 15129, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF 150x150x150 Hanging (bez wydruku)": { plnPrice: 565.27, plnMargin: 418.6, intranetId: 15843, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame CTF 200x100x200 Hanging": { plnPrice: 1110.67, plnMargin: 747.43, intranetId: 16537, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame CTF 200x100x200 Hanging (bez wydruku)": { plnPrice: 606.56, plnMargin: 453.23, intranetId: 16536, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame CTF 245x245x100 (bez wydruku)": { plnPrice: 641.37, plnMargin: 472.7, intranetId: 15125, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF 300x300x100 (bez wydruku)": { plnPrice: 735.74, plnMargin: 552.41, intranetId: 15126, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF 30x30x120": { plnPrice: 586.3, plnMargin: 290.59, intranetId: 15139, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame CTF 30x30x120 (bez wydruku)": { plnPrice: 307.4, plnMargin: 198.4, intranetId: 15121, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF 400x400x100 (bez wydruku)": { plnPrice: 892.55, plnMargin: 682.55, intranetId: 15127, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF 50x50x50 (bez wydruku)": { plnPrice: 282.3, plnMargin: 177.3, intranetId: 15122, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame CTF Hanging (bez wydruku)": { plnPrice: 614.84, plnMargin: 448.17, intranetId: 18691, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame CTF Hanging LED (bez wydruku)": { plnPrice: 628.53, plnMargin: 469.29, intranetId: 16130, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame CTF lampa plafon 30x30 BARWA NEUTRALNA": { plnPrice: 29.36, plnMargin: 24.36, intranetId: 18986, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "adFrame CTF lampa plafon 30x30 BARWA ZIMNA": { plnPrice: 35.58, plnMargin: 30.58, intranetId: 18957, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "adFrame CTF łącznik nadstawki na mframe": { plnPrice: 23.07, plnMargin: 21.4, intranetId: 19298, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame CTF/SUPPORT pianka ochronna": { plnPrice: 2.87, plnMargin: 0.11, intranetId: 14814, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame DCF łącznik 90° A": { plnPrice: 6.47, plnMargin: 4.8, intranetId: 18223, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame DCF łącznik 90° B": { plnPrice: 6.47, plnMargin: 4.8, intranetId: 18224, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame DTF 100x100 Hanging (bez wydruku)": { plnPrice: 280.37, plnMargin: 175.06, intranetId: 14609, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame DTF 100x150 Hanging (bez wydruku)": { plnPrice: 323.52, plnMargin: 214.88, intranetId: 14611, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame DTF 100x200 (bez wydruku)": { plnPrice: 526.94, plnMargin: 385.87, intranetId: 14485, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 100x200 Hanging (bez wydruku)": { plnPrice: 408.25, plnMargin: 274.82, intranetId: 14615, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame DTF 100x250 Hanging (bez wydruku)": { plnPrice: 436.81, plnMargin: 300.34, intranetId: 14617, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame DTF 100x300 Hanging (bez wydruku)": { plnPrice: 474.82, plnMargin: 334.72, intranetId: 14621, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adFrame DTF 120x200 (bez wydruku)": { plnPrice: 541.77, plnMargin: 398.4, intranetId: 14486, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 150x200 (bez wydruku)": { plnPrice: 568.6, plnMargin: 422.53, intranetId: 14487, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 150x250": { plnPrice: 803.65, plnMargin: 562.1, intranetId: 14549, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame DTF 150x250 (bez wydruku)": { plnPrice: 601.17, plnMargin: 451.77, intranetId: 14488, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 200x250 (bez wydruku)": { plnPrice: 734.43, plnMargin: 546.47, intranetId: 14490, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 300x200 (bez wydruku)": { plnPrice: 801.62, plnMargin: 604.57, intranetId: 14491, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 300x250 (bez wydruku)": { plnPrice: 839.23, plnMargin: 637.18, intranetId: 14492, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 400x200": { plnPrice: 1273.19, plnMargin: 943.24, intranetId: 14554, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame DTF 400x200 (bez wydruku)": { plnPrice: 888.81, plnMargin: 681.76, intranetId: 14493, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 400x250 (bez wydruku)": { plnPrice: 956.74, plnMargin: 736.65, intranetId: 14497, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 500x200 (bez wydruku)": { plnPrice: 1134.86, plnMargin: 858.91, intranetId: 14498, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 500x250 (bez wydruku)": { plnPrice: 1190.45, plnMargin: 906.17, intranetId: 14499, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 50x100": { plnPrice: 410.72, plnMargin: 232.44, intranetId: 14544, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame DTF 50x100 (bez wydruku)": { plnPrice: 294.19, plnMargin: 188.88, intranetId: 14482, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 600x200 (bez wydruku)": { plnPrice: 1160.77, plnMargin: 904.02, intranetId: 14500, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 600x250 (bez wydruku)": { plnPrice: 1173.21, plnMargin: 910, intranetId: 14501, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF 80x200": { plnPrice: 0, plnMargin: 0, intranetId: 14546, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame DTF 80x200 (bez wydruku)": { plnPrice: 510.85, plnMargin: 371.78, intranetId: 14484, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame DTF A1 85x200 Hanging (bez wydruku)": { plnPrice: 396.18, plnMargin: 264.25, intranetId: 14625, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame DTF B1 70x100 Hanging (bez wydruku)": { plnPrice: 260.81, plnMargin: 157.5, intranetId: 14624, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame DTF mocowanie stopy": { plnPrice: 2.28, plnMargin: 0.61, intranetId: 11499, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF mocowanie stopy podwójne": { plnPrice: 7.19, plnMargin: 5.52, intranetId: 16791, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF narożnik 90 stopni (bez gwintu) / zamiennik ELSTAR": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17429, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame DTF narożnik 90 stopni (z gwintem) / zamiennik ELSTAR": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17428, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame DTF narożnik łukowy": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 11313, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF stopa boczna": { plnPrice: 72.51, plnMargin: 67.51, intranetId: 11741, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF stopa boczna czarna": { plnPrice: 91.82, plnMargin: 86.82, intranetId: 19067, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF stopa trójkątna": { plnPrice: 81.02, plnMargin: 76.02, intranetId: 10942, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame DTF uchwyt lampki": { plnPrice: 13.69, plnMargin: 12.02, intranetId: 15411, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF łącznik 180 stopni bez gwintu / zamiennik ELSTAR": { plnPrice: 7.02, plnMargin: 5.35, intranetId: 18483, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF łącznik 180 stopni z gwintem / zamiennik ELSTAR": { plnPrice: 7.02, plnMargin: 5.35, intranetId: 18482, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF/STF pianka ochronna": { plnPrice: 2.47, plnMargin: 0.07, intranetId: 14813, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame DTF/STF/LMSM styropian ochronny [16x16cm]": { plnPrice: 0.36, plnMargin: 0.03, intranetId: 14881, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame DTF/STF/LMSM styropian ochronny [26x16cm]": { plnPrice: 0.6, plnMargin: 0.06, intranetId: 14882, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Adframe Flex Led 198,4x248 (bez wydruku)": { plnPrice: 853.18, plnMargin: 836.51, intranetId: 19528, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "Adframe Flex Led 199,4x248 (bez wydruku)": { plnPrice: 813.36, plnMargin: 796.69, intranetId: 19124, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "Adframe Flex Led 200x250 ver2.0 (bez wydruku)": { plnPrice: 937.26, plnMargin: 920.59, intranetId: 19793, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Adframe Flex Led 99,2x248 (bez wydruku)": { plnPrice: 493.08, plnMargin: 476.41, intranetId: 19125, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "Adframe Flex Led door kit": { plnPrice: 360.97, plnMargin: 344.3, intranetId: 19130, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "Adframe Flex Led extension set 100x248 (bez wydruku)": { plnPrice: 308.59, plnMargin: 300.26, intranetId: 19126, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Adframe Flex Led extension set 100x250 (bez wydruku)": { plnPrice: 268.74, plnMargin: 260.41, intranetId: 18416, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Adframe Flex Led extension set 99,2x248 (bez wydruku)": { plnPrice: 323.61, plnMargin: 315.28, intranetId: 19529, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Adframe Flex LED Screws connect to M frame": { plnPrice: 32.69, plnMargin: 16.02, intranetId: 19754, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Adframe Flex NOLed 198,4x248 (bez wydruku)": { plnPrice: 368.98, plnMargin: 352.31, intranetId: 19128, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Adframe Flex NOLed 99,2x248 (bez wydruku)": { plnPrice: 264.89, plnMargin: 248.22, intranetId: 19127, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Adframe Flex NOLed extension set 99,2x248 (bez wydruku)": { plnPrice: 148.44, plnMargin: 140.11, intranetId: 19129, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame FLIGHT CASE 100cm": { plnPrice: 506.13, plnMargin: 501.12, intranetId: 11739, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame GO 200x250": { plnPrice: 1456.76, plnMargin: 1331.2, intranetId: 19486, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "adFrame GO 200x250 (bez wydruku)": { plnPrice: 1234.18, plnMargin: 1217.51, intranetId: 19137, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame GO 300x250": { plnPrice: 1893.05, plnMargin: 1749.83, intranetId: 19059, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame GO 300x250 (bez wydruku)": { plnPrice: 1604.23, plnMargin: 1587.56, intranetId: 19058, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame GO 400x250": { plnPrice: 2542, plnMargin: 2377.78, intranetId: 19492, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "adFrame GO 400x250 (bez wydruku)": { plnPrice: 2181.79, plnMargin: 2165.12, intranetId: 19138, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame GO extension set": { plnPrice: 405.55, plnMargin: 388.88, intranetId: 19139, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Kabel zasilający 4pin 120-250W": { plnPrice: 47.41, plnMargin: 45.74, intranetId: 14864, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame Kabel zasilający 4pin 120-250W JACK": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18116, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame Kabel zasilający 6pin 250-300W": { plnPrice: 45.54, plnMargin: 43.87, intranetId: 16134, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LCD": { plnPrice: 346.01, plnMargin: 132.68, intranetId: 13504, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "adFrame LCD profil przedni bez gumki": { plnPrice: 22.23, plnMargin: 18.9, intranetId: 12058, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LCD profil przedni bez gumki 30cm": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 12098, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LCD profil tylny z gumką/bez gumki 30cm": { plnPrice: 5.68, plnMargin: 4.01, intranetId: 16409, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LCD VER2 profil wewnętrzny": { plnPrice: 21.34, plnMargin: 18.01, intranetId: 18462, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LCD VER2 profil z gumką": { plnPrice: 19.35, plnMargin: 16.02, intranetId: 18460, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LCD VER2 profil środkowy": { plnPrice: 43.35, plnMargin: 40.02, intranetId: 18461, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LCD VER2 łącznik": { plnPrice: 11.68, plnMargin: 10.01, intranetId: 18459, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LCD VER2 łącznik 2": { plnPrice: 11.68, plnMargin: 10.01, intranetId: 18481, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LCD VER2 łącznik support": { plnPrice: 13.69, plnMargin: 12.02, intranetId: 18458, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LCD łącznik 90°": { plnPrice: 51.17, plnMargin: 49.5, intranetId: 16666, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD 100x100 ND Hanging": { plnPrice: 800.88, plnMargin: 475.27, intranetId: 14732, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x100 ND Hanging (bez wydruku)": { plnPrice: 665.55, plnMargin: 415.66, intranetId: 14629, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x100 PK Hanging (bez wydruku)": { plnPrice: 678.01, plnMargin: 428.12, intranetId: 14628, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x150 ND Hanging (bez wydruku)": { plnPrice: 774.83, plnMargin: 496.06, intranetId: 14634, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x150 NK Hanging (bez wydruku)": { plnPrice: 710.33, plnMargin: 463.52, intranetId: 14635, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x150 PD Hanging (bez wydruku)": { plnPrice: 745.7, plnMargin: 499.42, intranetId: 14637, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x150 PK Hanging (bez wydruku)": { plnPrice: 698.12, plnMargin: 467.55, intranetId: 14636, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x200": { plnPrice: 1076.98, plnMargin: 782.92, intranetId: 11583, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x200 NK Hanging (bez wydruku)": { plnPrice: 832.27, plnMargin: 558.9, intranetId: 14632, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x200 PK Hanging": { plnPrice: 954.27, plnMargin: 621.42, intranetId: 14739, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x200 PK Hanging (bez wydruku)": { plnPrice: 820.07, plnMargin: 562.94, intranetId: 14630, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x248 NK (drzwi kantorka)": { plnPrice: 656.73, plnMargin: 477.73, intranetId: 18927, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x248 PK (drzwi kantorka)": { plnPrice: 641.07, plnMargin: 462.07, intranetId: 17465, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x250 ND Hanging (bez wydruku)": { plnPrice: 1124.41, plnMargin: 751.28, intranetId: 14641, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x250 NK Hanging (bez wydruku)": { plnPrice: 878.33, plnMargin: 601.09, intranetId: 14640, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x250 PK (bez wydruku) stan": { plnPrice: 2668.17, plnMargin: 2601.5, intranetId: 16564, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x250 PK Hanging (bez wydruku)": { plnPrice: 866.11, plnMargin: 605.12, intranetId: 14638, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x300 ND Hanging (bez wydruku)": { plnPrice: 1345.08, plnMargin: 909.13, intranetId: 14645, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x300 PD Hanging": { plnPrice: 1486.68, plnMargin: 1025.99, intranetId: 14747, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x300 PD Hanging (bez wydruku)": { plnPrice: 1233.63, plnMargin: 872.99, intranetId: 14643, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x300 PK Hanging (bez wydruku)": { plnPrice: 915.69, plnMargin: 650.83, intranetId: 14642, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x348 ND (drzwi kantorka)": { plnPrice: 0, plnMargin: 0, intranetId: 19024, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 100x350 PD (bez wydruku)": { plnPrice: 1647.08, plnMargin: 1247.03, intranetId: 17708, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 102x250 NK (tył kantorka)": { plnPrice: 635.03, plnMargin: 461.53, intranetId: 18928, category: "frames", origin: "Polska", noPrice: true },
  "adFrame LMD 102x250 PK": { plnPrice: 882.15, plnMargin: 651.91, intranetId: 17099, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 102x250 PK (tył kantorka)": { plnPrice: 650.68, plnMargin: 477.18, intranetId: 17489, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 12cm": { plnPrice: 1203.84, plnMargin: 862.92, intranetId: 13604, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD 12cm (bez wydruku)": { plnPrice: 911.67, plnMargin: 697.26, intranetId: 18775, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD 12cm kątownik 90": { plnPrice: 5.68, plnMargin: 4.01, intranetId: 13598, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD 12cm łącznik 180": { plnPrice: 5.68, plnMargin: 4.01, intranetId: 13597, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD 150x200 ND": { plnPrice: 1373.23, plnMargin: 932.75, intranetId: 14070, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x200 NO (bez wydruku)": { plnPrice: 1879.05, plnMargin: 1380.17, intranetId: 14071, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x200 PD (bez wydruku)": { plnPrice: 1127.14, plnMargin: 807.95, intranetId: 14063, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x200 PK": { plnPrice: 1189.71, plnMargin: 836.93, intranetId: 14062, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x200 PK (bez wydruku)": { plnPrice: 1013.29, plnMargin: 749.31, intranetId: 14061, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x200 PO (bez wydruku)": { plnPrice: 1636.31, plnMargin: 1276.38, intranetId: 14065, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x250 NK (bez wydruku)": { plnPrice: 1274.22, plnMargin: 935.47, intranetId: 14081, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x250 PD (bez wydruku)": { plnPrice: 1283.87, plnMargin: 956.5, intranetId: 14077, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x250 PK (bez wydruku)": { plnPrice: 1085.71, plnMargin: 813.4, intranetId: 14074, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 150x250 PO (bez wydruku)": { plnPrice: 1888.59, plnMargin: 1492.84, intranetId: 14079, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 170x250 PK (bez wydruku)": { plnPrice: 1084.3, plnMargin: 835.52, intranetId: 17181, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD 186x250 PK (bez wydruku)": { plnPrice: 1277.58, plnMargin: 992.54, intranetId: 17167, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD 200x200 NK (bez wydruku)": { plnPrice: 1565.28, plnMargin: 1155.52, intranetId: 14092, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x200 NK (bez wydruku) stan": { plnPrice: 1730.62, plnMargin: 1663.95, intranetId: 18093, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x200 NO": { plnPrice: 2402.34, plnMargin: 1743.1, intranetId: 14093, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x200 NO (bez wydruku)": { plnPrice: 2204.96, plnMargin: 1640.27, intranetId: 14094, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x200 PO (bez wydruku)": { plnPrice: 2663.24, plnMargin: 2176.01, intranetId: 14089, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 ND (bez wydruku)": { plnPrice: 1728.59, plnMargin: 1265.09, intranetId: 14106, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 ND (bez wydruku) TEST": { plnPrice: 0, plnMargin: 0, intranetId: 19115, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 ND (bez wydruku) TEST akcesoria": { plnPrice: 0, plnMargin: 0, intranetId: 19119, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 ND (bez wydruku) TEST profile": { plnPrice: 0, plnMargin: 0, intranetId: 19118, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 ND TEST": { plnPrice: 0, plnMargin: 0, intranetId: 19116, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 NK (bez wydruku)": { plnPrice: 1504.09, plnMargin: 1131.08, intranetId: 14104, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 NK (bez wydruku) stan": { plnPrice: 0, plnMargin: 0, intranetId: 16479, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 NO (bez wydruku)": { plnPrice: 2773.43, plnMargin: 2106.28, intranetId: 14108, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 PD (bez wydruku)": { plnPrice: 1489.3, plnMargin: 1141.18, intranetId: 17240, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x250 PK (bez wydruku)": { plnPrice: 1426.79, plnMargin: 1059.29, intranetId: 14096, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 200x350 PD (bez wydruku)": { plnPrice: 1747.63, plnMargin: 1337.58, intranetId: 14100, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 270x250 PD (bez wydruku)": { plnPrice: 1424.54, plnMargin: 1114.44, intranetId: 17184, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD 272x250 PD (bez wydruku)": { plnPrice: 1544.92, plnMargin: 1202.09, intranetId: 17175, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD 286x250 PD (bez wydruku)": { plnPrice: 1567.61, plnMargin: 1223.41, intranetId: 17173, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD 300x100 NK Hanging": { plnPrice: 1323.83, plnMargin: 897.45, intranetId: 14745, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x100 NK Hanging (bez wydruku)": { plnPrice: 1070.76, plnMargin: 744.43, intranetId: 14644, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x200 ND (bez wydruku)": { plnPrice: 1613.24, plnMargin: 1211.38, intranetId: 14119, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x200 NK (bez wydruku)": { plnPrice: 1555.98, plnMargin: 1148.38, intranetId: 14117, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x200 NO (bez wydruku)": { plnPrice: 2338.98, plnMargin: 1798.34, intranetId: 14121, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x200 PK (bez wydruku)": { plnPrice: 1454.94, plnMargin: 1096.08, intranetId: 14110, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x250 ND (bez wydruku)": { plnPrice: 1675.11, plnMargin: 1260, intranetId: 14130, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x250 ND (bez wydruku) stan": { plnPrice: 0, plnMargin: 0, intranetId: 16261, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x250 NK (bez wydruku)": { plnPrice: 1721.19, plnMargin: 1292.35, intranetId: 14128, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x250 NK (bez wydruku) stan": { plnPrice: 0, plnMargin: 0, intranetId: 16284, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x250 PK (bez wydruku)": { plnPrice: 1736.24, plnMargin: 1320.03, intranetId: 14123, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x250 PO": { plnPrice: 2884.82, plnMargin: 2225.64, intranetId: 16856, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 300x250 PO (bez wydruku)": { plnPrice: 2614.16, plnMargin: 2063.2, intranetId: 16857, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 386x250 PD (bez wydruku)": { plnPrice: 1933.93, plnMargin: 1512.61, intranetId: 17273, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD 400x200 ND (bez wydruku)": { plnPrice: 2014.21, plnMargin: 1481.86, intranetId: 14137, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x200 NO": { plnPrice: 2346.15, plnMargin: 1690.9, intranetId: 14138, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x200 NO (bez wydruku)": { plnPrice: 2832.82, plnMargin: 2185.79, intranetId: 14139, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x200 PD": { plnPrice: 2306.51, plnMargin: 1716.23, intranetId: 14131, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x200 PD (bez wydruku)": { plnPrice: 1974.57, plnMargin: 1507.18, intranetId: 14132, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x200 PO (bez wydruku)": { plnPrice: 3118.49, plnMargin: 2601.42, intranetId: 14134, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x250 ND (bez wydruku)": { plnPrice: 2068.94, plnMargin: 1530.13, intranetId: 14148, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x250 NO (bez wydruku)": { plnPrice: 3835.72, plnMargin: 2818.23, intranetId: 14150, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x250 PD (bez wydruku)": { plnPrice: 1902.49, plnMargin: 1493.64, intranetId: 14141, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 400x250 PO (bez wydruku)": { plnPrice: 3260.71, plnMargin: 2706.15, intranetId: 14144, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x200 ND (bez wydruku)": { plnPrice: 2926.08, plnMargin: 2295.58, intranetId: 14158, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x200 NO (bez wydruku)": { plnPrice: 3642.07, plnMargin: 2883.74, intranetId: 14160, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x200 PD": { plnPrice: 2864.91, plnMargin: 2148.6, intranetId: 14152, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x200 PD (bez wydruku)": { plnPrice: 2475.58, plnMargin: 1891, intranetId: 14153, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x200 PO (bez wydruku)": { plnPrice: 3347.89, plnMargin: 2679.52, intranetId: 14156, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x250 ND (bez wydruku)": { plnPrice: 2372.93, plnMargin: 1780.78, intranetId: 14168, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x250 NO (bez wydruku)": { plnPrice: 3569.87, plnMargin: 2732.39, intranetId: 14170, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 500x250 PD (bez wydruku)": { plnPrice: 2581.08, plnMargin: 1992.27, intranetId: 14162, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x200 ND (bez wydruku)": { plnPrice: 3255.37, plnMargin: 2548.23, intranetId: 14177, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x200 NO (bez wydruku)": { plnPrice: 4073.86, plnMargin: 3166.39, intranetId: 14179, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x200 PD": { plnPrice: 3867.1, plnMargin: 3265.6, intranetId: 14171, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x200 PD (bez wydruku)": { plnPrice: 3520.36, plnMargin: 2959.43, intranetId: 14172, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x200 PO (bez wydruku)": { plnPrice: 3753.81, plnMargin: 3073.77, intranetId: 14174, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x250 ND (bez wydruku)": { plnPrice: 2704.74, plnMargin: 2073.44, intranetId: 14186, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x250 NO": { plnPrice: 0, plnMargin: 0, intranetId: 14187, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 600x250 PD (bez wydruku)": { plnPrice: 2874.25, plnMargin: 2188.21, intranetId: 14182, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD 70x100 (B1) ND Hanging (bez wydruku)": { plnPrice: 639.99, plnMargin: 392.1, intranetId: 14649, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 70x100 (B1) NK Hanging (bez wydruku)": { plnPrice: 628.68, plnMargin: 403.97, intranetId: 14648, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 85x200 (A1) ND Hanging (bez wydruku)": { plnPrice: 959.17, plnMargin: 624.42, intranetId: 14653, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 85x200 (A1) NK Hanging (bez wydruku)": { plnPrice: 787.16, plnMargin: 533.65, intranetId: 14652, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 85x200 (A1) PD Hanging (bez wydruku)": { plnPrice: 969.93, plnMargin: 636.95, intranetId: 14651, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD 85x200 (A1) PK Hanging (bez wydruku)": { plnPrice: 763.92, plnMargin: 526.65, intranetId: 14650, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adFrame LMD DOOR 100cm NA BOK": { plnPrice: 1202.86, plnMargin: 992.86, intranetId: 15358, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD DOOR 150cm NA BOK": { plnPrice: 498.24, plnMargin: 288.24, intranetId: 15361, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD DOOR 150cm NA ŚRODEK": { plnPrice: 0, plnMargin: 0, intranetId: 15362, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMD door klawiatura": { plnPrice: 45.7, plnMargin: 44.03, intranetId: 12088, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD door klips zbliżeniowy": { plnPrice: 21.69, plnMargin: 20.02, intranetId: 15356, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD door listwy 150cm NA BOK - zestaw": { plnPrice: 280.07, plnMargin: 80.07, intranetId: 12052, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD door listwy 150cm NA ŚRODKU - zestaw": { plnPrice: 0, plnMargin: 0, intranetId: 12053, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD door przycisk wewnętrzny": { plnPrice: 29.69, plnMargin: 28.02, intranetId: 15354, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD door skobel": { plnPrice: 29.69, plnMargin: 28.02, intranetId: 15355, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD door zasilacz": { plnPrice: 69.73, plnMargin: 68.06, intranetId: 15353, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD heksagon (bez wydruku)": { plnPrice: 1760.68, plnMargin: 1450.15, intranetId: 18913, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD narożnik": { plnPrice: 3.27, plnMargin: 1.6, intranetId: 10951, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD narożnik 105°": { plnPrice: 45.54, plnMargin: 43.87, intranetId: 16440, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD narożnik 120°": { plnPrice: 43.4, plnMargin: 41.73, intranetId: 18031, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD narożnik 135°": { plnPrice: 157.81, plnMargin: 156.14, intranetId: 11140, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD narożnik 45°": { plnPrice: 44.57, plnMargin: 42.9, intranetId: 11133, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD narożnik 75°": { plnPrice: 45.54, plnMargin: 43.87, intranetId: 16441, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD narożnik łukowy": { plnPrice: 7.67, plnMargin: 6, intranetId: 11312, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD stopa blacha": { plnPrice: 203.9, plnMargin: 202.23, intranetId: 17846, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD stopa wąska długa": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 15372, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD sześciokąt foremny (bez wydruku)": { plnPrice: 2005.81, plnMargin: 1680.28, intranetId: 18520, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMD łącznik 180° krótki": { plnPrice: 13.69, plnMargin: 12.02, intranetId: 11787, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD ŁĄCZNIK ZEW/ZEW": { plnPrice: 53.26, plnMargin: 51.59, intranetId: 16458, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD/LMS - Torba 155cm 3K": { plnPrice: 376.33, plnMargin: 366.33, intranetId: 11749, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD/LMS - Torba 155cm 4K": { plnPrice: 165.69, plnMargin: 160.69, intranetId: 11952, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMD/LMS styropian ochronny [33x16cm]": { plnPrice: 0.76, plnMargin: 0.07, intranetId: 14880, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMD/LMS śruba - nakrętka FAT mFrame": { plnPrice: 5.8, plnMargin: 0.8, intranetId: 17453, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMS 100x100 NO (bez wydruku)": { plnPrice: 897.65, plnMargin: 604.63, intranetId: 14349, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x100 PK": { plnPrice: 825.64, plnMargin: 540.33, intranetId: 14435, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x100 PK (bez wydruku)": { plnPrice: 754.81, plnMargin: 510.53, intranetId: 14348, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x100 PO (bez wydruku)": { plnPrice: 814.31, plnMargin: 553.77, intranetId: 14343, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x200 ND (bez wydruku)": { plnPrice: 1117.63, plnMargin: 779.66, intranetId: 14364, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x200 NK (bez wydruku)": { plnPrice: 952.5, plnMargin: 664.45, intranetId: 14354, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x200 NO (bez wydruku)": { plnPrice: 1264.28, plnMargin: 861.34, intranetId: 14353, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x200 PD (bez wydruku)": { plnPrice: 1036.05, plnMargin: 730.57, intranetId: 14363, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x200 PK (bez wydruku)": { plnPrice: 908.36, plnMargin: 651.62, intranetId: 14352, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x200 PO (bez wydruku)": { plnPrice: 1202.05, plnMargin: 847.41, intranetId: 14351, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x250 ND": { plnPrice: 1316.09, plnMargin: 933.97, intranetId: 14444, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x250 ND (bez wydruku)": { plnPrice: 1240.81, plnMargin: 901.38, intranetId: 14367, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x250 NO (bez wydruku)": { plnPrice: 1383.84, plnMargin: 967.57, intranetId: 14358, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x250 PD (bez wydruku)": { plnPrice: 1183.66, plnMargin: 849.03, intranetId: 14366, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 100x250 PO (bez wydruku)": { plnPrice: 1423.05, plnMargin: 1014.88, intranetId: 14355, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x200 NO (bez wydruku)": { plnPrice: 1396.79, plnMargin: 1006.63, intranetId: 14369, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x200 PD (bez wydruku)": { plnPrice: 1093.44, plnMargin: 817.42, intranetId: 14368, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x200 PK (bez wydruku)": { plnPrice: 1014.82, plnMargin: 771.3, intranetId: 14362, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x200 PO (bez wydruku)": { plnPrice: 1332.81, plnMargin: 983.26, intranetId: 14361, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x250 ND (bez wydruku)": { plnPrice: 1305.94, plnMargin: 914.94, intranetId: 14377, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x250 NK": { plnPrice: 1325.13, plnMargin: 947.04, intranetId: 14457, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x250 NK (bez wydruku)": { plnPrice: 1229.77, plnMargin: 902.29, intranetId: 14376, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x250 NO (bez wydruku)": { plnPrice: 1503.9, plnMargin: 1031.26, intranetId: 14375, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x250 PD (bez wydruku)": { plnPrice: 1260.3, plnMargin: 901.8, intranetId: 14374, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 150x250 PK (bez wydruku)": { plnPrice: 1090.57, plnMargin: 797.05, intranetId: 14373, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x200 NO (bez wydruku)": { plnPrice: 1758.22, plnMargin: 1245.97, intranetId: 14382, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x200 PO (bez wydruku)": { plnPrice: 1615.96, plnMargin: 1160.56, intranetId: 14380, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x250 ND (bez wydruku)": { plnPrice: 1540.38, plnMargin: 1111.34, intranetId: 14389, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x250 NK (bez wydruku)": { plnPrice: 1485.21, plnMargin: 1088.66, intranetId: 14388, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x250 NO (bez wydruku)": { plnPrice: 1877.94, plnMargin: 1334.77, intranetId: 14387, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x250 PD (bez wydruku)": { plnPrice: 1501.46, plnMargin: 1104.91, intranetId: 14386, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x250 PK (bez wydruku)": { plnPrice: 1476.79, plnMargin: 1079.13, intranetId: 14385, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 200x250 PO (bez wydruku)": { plnPrice: 1770.78, plnMargin: 1284.47, intranetId: 14384, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x200 ND (bez wydruku)": { plnPrice: 1745, plnMargin: 1279.61, intranetId: 14396, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x200 NK (bez wydruku)": { plnPrice: 1620.5, plnMargin: 1202.8, intranetId: 14395, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x200 PD": { plnPrice: 1942.38, plnMargin: 1412.23, intranetId: 14474, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x200 PD (bez wydruku)": { plnPrice: 1799.96, plnMargin: 1332, intranetId: 14393, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x200 PK (bez wydruku)": { plnPrice: 1547.69, plnMargin: 1162.48, intranetId: 14392, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x200 PO (bez wydruku)": { plnPrice: 1941.95, plnMargin: 1434.48, intranetId: 14391, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x250 ND (bez wydruku)": { plnPrice: 1859.39, plnMargin: 1360.62, intranetId: 14401, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x250 PD": { plnPrice: 1961.84, plnMargin: 1493.88, intranetId: 14479, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x250 PD (bez wydruku)": { plnPrice: 1817.86, plnMargin: 1412.67, intranetId: 17915, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x250 PK (bez wydruku)": { plnPrice: 1653.42, plnMargin: 1314.32, intranetId: 17248, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 300x250 PO (bez wydruku)": { plnPrice: 2169.46, plnMargin: 1605.72, intranetId: 14397, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 400x200 ND (bez wydruku)": { plnPrice: 2130.42, plnMargin: 1547.68, intranetId: 14407, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 400x200 NO (bez wydruku)": { plnPrice: 2524.17, plnMargin: 1795.22, intranetId: 14406, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 400x200 PD (bez wydruku)": { plnPrice: 2032.69, plnMargin: 1547.4, intranetId: 14404, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 400x200 PO (bez wydruku)": { plnPrice: 2331.85, plnMargin: 1748.67, intranetId: 14403, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 400x250 ND (bez wydruku)": { plnPrice: 2201.27, plnMargin: 1613.53, intranetId: 14411, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 400x250 NO (bez wydruku)": { plnPrice: 2606.05, plnMargin: 1871.67, intranetId: 14410, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 400x250 PO (bez wydruku)": { plnPrice: 2493.79, plnMargin: 1873.14, intranetId: 14408, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x200 ND (bez wydruku)": { plnPrice: 2515.71, plnMargin: 1842.03, intranetId: 14414, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x200 NO (bez wydruku)": { plnPrice: 2729.58, plnMargin: 2002.29, intranetId: 14415, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x200 PD": { plnPrice: 2654.43, plnMargin: 1997.76, intranetId: 14765, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x200 PD (bez wydruku)": { plnPrice: 2445.61, plnMargin: 1868.96, intranetId: 14413, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x200 PO (bez wydruku)": { plnPrice: 2822.95, plnMargin: 2116.34, intranetId: 14412, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x250 ND (bez wydruku)": { plnPrice: 2586.55, plnMargin: 1907.87, intranetId: 14420, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x250 NO (bez wydruku)": { plnPrice: 3070.54, plnMargin: 2212.73, intranetId: 14421, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x250 PD (bez wydruku)": { plnPrice: 2942.72, plnMargin: 2214.86, intranetId: 14419, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 500x250 PO (bez wydruku)": { plnPrice: 2942.72, plnMargin: 2214.86, intranetId: 14418, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 600x200 ND (bez wydruku)": { plnPrice: 2719.99, plnMargin: 2034.15, intranetId: 14425, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 600x200 NO (bez wydruku)": { plnPrice: 3200.02, plnMargin: 2351.31, intranetId: 14426, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 600x200 PD (bez wydruku)": { plnPrice: 2636.68, plnMargin: 2080.38, intranetId: 14424, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 600x200 PO (bez wydruku)": { plnPrice: 2984.76, plnMargin: 2314.32, intranetId: 14422, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 600x250 ND (bez wydruku)": { plnPrice: 3063.33, plnMargin: 2260.92, intranetId: 14430, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS 600x250 NO (bez wydruku)": { plnPrice: 3588.05, plnMargin: 2590.69, intranetId: 14431, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMS narożnik 135° (gwintowany)": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 11139, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMS narożnik 45° (bez gwintu)": { plnPrice: 3.67, plnMargin: 2, intranetId: 15345, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMS narożnik 45° (gwintowany)": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 11137, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMS pianka ochronna": { plnPrice: 2.84, plnMargin: 0.1, intranetId: 11738, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMS stopa (stary typ)": { plnPrice: 21.69, plnMargin: 20.02, intranetId: 16394, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMS stopa blacha": { plnPrice: 1.68, plnMargin: 0.01, intranetId: 17655, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMS łącznik narożny LMS": { plnPrice: 25.9, plnMargin: 20.9, intranetId: 17155, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMS ŁĄCZNIK ZEW/ZEW": { plnPrice: 27.64, plnMargin: 25.97, intranetId: 16499, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMS-mFrame docisk łącznika": { plnPrice: 12.7, plnMargin: 7.7, intranetId: 18301, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMS-mFrame łącznik 90 stopni": { plnPrice: 21.39, plnMargin: 16.39, intranetId: 18303, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x100 NK (bez wydruku)": { plnPrice: 615.97, plnMargin: 378.43, intranetId: 14668, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x150 ND": { plnPrice: 860.23, plnMargin: 554.17, intranetId: 14686, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x150 ND (bez wydruku)": { plnPrice: 788.46, plnMargin: 523.43, intranetId: 14672, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x150 NK": { plnPrice: 732.53, plnMargin: 458.97, intranetId: 14687, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x150 NK (bez wydruku)": { plnPrice: 660.78, plnMargin: 428.24, intranetId: 14671, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x150 PD": { plnPrice: 794.98, plnMargin: 505.18, intranetId: 14688, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x150 PD (bez wydruku)": { plnPrice: 723.24, plnMargin: 474.46, intranetId: 14670, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x150 PK (bez wydruku)": { plnPrice: 626.43, plnMargin: 410.13, intranetId: 14669, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x200 ND (bez wydruku)": { plnPrice: 975.24, plnMargin: 625.9, intranetId: 14678, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x200 PD (bez wydruku)": { plnPrice: 972.22, plnMargin: 622.88, intranetId: 14676, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x200 PK": { plnPrice: 786.91, plnMargin: 497.78, intranetId: 14693, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 100x200 PK (bez wydruku)": { plnPrice: 716.64, plnMargin: 468.54, intranetId: 14675, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 120x200 ND (bez wydruku)": { plnPrice: 930.2, plnMargin: 635.75, intranetId: 15165, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 120x200 NK (bez wydruku)": { plnPrice: 747.2, plnMargin: 517.73, intranetId: 15168, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 120x200 PD (bez wydruku)": { plnPrice: 842.19, plnMargin: 580.22, intranetId: 15170, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 120x200 PK (bez wydruku)": { plnPrice: 703.47, plnMargin: 490.24, intranetId: 15172, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 150x150 NK": { plnPrice: 954.71, plnMargin: 620.19, intranetId: 14694, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 150x150 NK (bez wydruku)": { plnPrice: 862.88, plnMargin: 577.31, intranetId: 14674, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 150x150 PK": { plnPrice: 889.46, plnMargin: 571.2, intranetId: 14695, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 150x150 PK (bez wydruku)": { plnPrice: 797.65, plnMargin: 528.33, intranetId: 14673, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 150x200 NK (bez wydruku)": { plnPrice: 783.11, plnMargin: 549.89, intranetId: 15176, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 200x200 NK (bez wydruku)": { plnPrice: 887.61, plnMargin: 603.47, intranetId: 15181, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 200x200 PK (bez wydruku)": { plnPrice: 1133.11, plnMargin: 756.98, intranetId: 15185, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 50x50 NK (bez wydruku)": { plnPrice: 397.05, plnMargin: 238.86, intranetId: 15155, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 50x50 PK (bez wydruku)": { plnPrice: 399.92, plnMargin: 241.73, intranetId: 15157, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 60x100 ND (bez wydruku)": { plnPrice: 594.26, plnMargin: 356.77, intranetId: 14657, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 60x100 PD (bez wydruku)": { plnPrice: 553.61, plnMargin: 332.36, intranetId: 14655, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 60x100 PK": { plnPrice: 584.71, plnMargin: 338.75, intranetId: 14699, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 60x100 PK (bez wydruku)": { plnPrice: 514.71, plnMargin: 309.7, intranetId: 14654, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 70x120 ND (bez wydruku)": { plnPrice: 596.54, plnMargin: 357.12, intranetId: 14662, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 70x120 PD (bez wydruku)": { plnPrice: 564.55, plnMargin: 357.61, intranetId: 14660, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 70x120 PK (bez wydruku)": { plnPrice: 501.06, plnMargin: 310.37, intranetId: 14658, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 80x140 NK (bez wydruku)": { plnPrice: 603.9, plnMargin: 378.72, intranetId: 14665, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 80x140 PD (bez wydruku)": { plnPrice: 643.85, plnMargin: 418.67, intranetId: 14664, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 80x140 PK (bez wydruku)": { plnPrice: 580.66, plnMargin: 371.72, intranetId: 14663, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 80x80 NK (bez wydruku)": { plnPrice: 451.59, plnMargin: 286.65, intranetId: 15159, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 80x80 PK (bez wydruku)": { plnPrice: 454.46, plnMargin: 289.52, intranetId: 15160, category: "ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "adFrame LMSM 99,2x248 (Mframe) ND (bez wydruku)": { plnPrice: 915.03, plnMargin: 597.27, intranetId: 14682, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMSM 99,2x248 (Mframe) NK (bez wydruku)": { plnPrice: 791.41, plnMargin: 520.1, intranetId: 14681, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMSM 99,2x248 (Mframe) PD (bez wydruku)": { plnPrice: 906.97, plnMargin: 603.17, intranetId: 14680, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "adFrame LMSM narożnik 135°": { plnPrice: 0, plnMargin: 0, intranetId: 17412, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMSM łącznik 180° support rurka": { plnPrice: 13.81, plnMargin: 8.81, intranetId: 16204, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame LMSM łącznik narożny mFrame": { plnPrice: 0, plnMargin: 0, intranetId: 17452, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LMSM/LMSM mFrame pianka ochronna": { plnPrice: 0, plnMargin: 0, intranetId: 14812, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame LPO 100x100": { plnPrice: 403.45, plnMargin: 362.13, intranetId: 16285, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame LPO 100x100 (bez wydruku)": { plnPrice: 340.95, plnMargin: 332.62, intranetId: 16197, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame LPO 100x293 (bez wydruku)": { plnPrice: 741.17, plnMargin: 732.84, intranetId: 16199, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Lumina RGB 100x200cm jednostronny": { plnPrice: 2010.65, plnMargin: 1948, intranetId: 18417, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Lumina RGB łącznik regulowany kąt": { plnPrice: 87.86, plnMargin: 82.86, intranetId: 18525, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame PLASTIC 100x200 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 12006, category: "frames", origin: "Polska", noPrice: true },
  "adFrame Poster 100x100 (bez wydruku)": { plnPrice: 248.32, plnMargin: 239.99, intranetId: 16728, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Poster 100x150 (bez wydruku)": { plnPrice: 310.77, plnMargin: 302.44, intranetId: 16729, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Poster 100x200 (bez wydruku)": { plnPrice: 355.57, plnMargin: 347.24, intranetId: 16730, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Poster 100x250": { plnPrice: 494.11, plnMargin: 461.12, intranetId: 16747, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Poster 100x250 (bez wydruku)": { plnPrice: 437.14, plnMargin: 428.81, intranetId: 16731, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Przewód [1x0,75mm] czarny": { plnPrice: 0.5, plnMargin: 0.04, intranetId: 16238, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Przewód [1x0,75mm] czerwony": { plnPrice: 0.44, plnMargin: 0.03, intranetId: 16239, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Przewód [1x0,75mm] żółto-zielony uziemienie": { plnPrice: 0, plnMargin: 0, intranetId: 19532, category: "ramy tekstylne akcesoria", origin: "NULL", noPrice: true },
  "adFrame Przewód [2x0,75mm] biały": { plnPrice: 1.04, plnMargin: 0.1, intranetId: 18177, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Przewód [2x0,75mm] czarny": { plnPrice: 1.16, plnMargin: 0.1, intranetId: 14865, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Przewód [4x0,75mm] czarny": { plnPrice: 1.95, plnMargin: 0.13, intranetId: 14867, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Quick 100x200": { plnPrice: 535.16, plnMargin: 482.51, intranetId: 12164, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick 100x200 (bez wydruku) profil C1": { plnPrice: 10.57, plnMargin: 3.9, intranetId: 17850, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Quick 100x200 ver 2.0 (bez wydruku)": { plnPrice: 1109.416, plnMargin: 396.22, intranetId: 17870, category: "ramy tekstylne p&p", origin: "9405618090", noPrice: true },
  "adFrame Quick 100x200 wersja 2.0": { plnPrice: 500.11, plnMargin: 447.46, intranetId: 17887, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick 100x250 (bez wydruku)": { plnPrice: 526.62, plnMargin: 519.95, intranetId: 12244, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Quick 100x250 ver 2.0 (bez wydruku)": { plnPrice: 546.1, plnMargin: 539.43, intranetId: 17871, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Quick 100x250 ver 2.0 w torbie na kółkach (bez wydruku)": { plnPrice: 1542.296, plnMargin: 550.82, intranetId: 17935, category: "ramy tekstylne p&p", origin: "9405618090", noPrice: true },
  "adFrame Quick 100x250 w torbie na kółkach (bez wydruku)": { plnPrice: 1588.608, plnMargin: 567.36, intranetId: 12272, category: "ramy tekstylne p&p", origin: "9405618090", noPrice: true },
  "adFrame Quick 100x250 wersja 2.0": { plnPrice: 660.01, plnMargin: 604.03, intranetId: 17890, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick 85x200 ver 2.0 w torbie na kółkach (bez wydruku)": { plnPrice: 425.21, plnMargin: 418.54, intranetId: 17884, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Quick 85x250 ver 2.0 w torbie na kółkach (bez wydruku)": { plnPrice: 524.18, plnMargin: 517.51, intranetId: 17885, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Quick Battery - support": { plnPrice: 16.91, plnMargin: 11.91, intranetId: 18609, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick Battery - łącznik 180": { plnPrice: 8.9, plnMargin: 3.9, intranetId: 18608, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick Budget 100x250 (bez wydruku)": { plnPrice: 202.93, plnMargin: 186.26, intranetId: 13481, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Quick kabel 180 stopni": { plnPrice: 3.36, plnMargin: 1.69, intranetId: 16641, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Quick Safe Case BLACK 85x200 (bez wydruku)": { plnPrice: 464.92, plnMargin: 454.92, intranetId: 19074, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick Safe Case Silver 85x200 (bez wydruku)": { plnPrice: 457.13, plnMargin: 447.13, intranetId: 19006, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick Single 85x200 (bez wydruku) DO PRZEROBIENIA": { plnPrice: 320.23, plnMargin: 295.23, intranetId: 13475, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame Quick Single Przekładka 1150x230": { plnPrice: 2.67, plnMargin: 0.09, intranetId: 18135, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick Single Przekładka 1430x230": { plnPrice: 2.75, plnMargin: 0.1, intranetId: 18136, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick Slim - łącznik 180": { plnPrice: 9.01, plnMargin: 4.01, intranetId: 18612, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Quick white connector - uchwyt złączki 180°": { plnPrice: 2.06, plnMargin: 0.39, intranetId: 17984, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame Quick white connector - złączka 180°": { plnPrice: 4.38, plnMargin: 2.71, intranetId: 16550, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame Quick zamek": { plnPrice: 8.88, plnMargin: 7.21, intranetId: 16635, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame SAF (black) (bez wydruku)": { plnPrice: 74.3, plnMargin: 27.63, intranetId: 15900, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame SAF (silver) (bez wydruku)": { plnPrice: 74.3, plnMargin: 27.63, intranetId: 15898, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame SAF - sklep - wieszak na magnes": { plnPrice: 7.67, plnMargin: 6, intranetId: 15893, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame SAF - sklep - łącznik do supportu": { plnPrice: 9.68, plnMargin: 8.01, intranetId: 15904, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame SAF/SWF - sklep - magnes do wieszaka": { plnPrice: 3.67, plnMargin: 2, intranetId: 17512, category: "frames", origin: "Polska", noPrice: true },
  "adFrame SAF/SWF - sklep - łącznik 180° beznarzędziowy": { plnPrice: 11.41, plnMargin: 9.74, intranetId: 15895, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame SAF/SWF - sklep - łącznik 90° beznarzędziowy": { plnPrice: 10.24, plnMargin: 8.57, intranetId: 15894, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Screw for lock no tools": { plnPrice: 0, plnMargin: 0, intranetId: 12076, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame Slim 100x200 BLACK - 65mm (bez wydruku)": { plnPrice: 306.55, plnMargin: 299.88, intranetId: 19629, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "adFrame Slim 100x250 BLACK - 65mm (bez wydruku)": { plnPrice: 357.17, plnMargin: 350.5, intranetId: 19631, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "adFrame SLM łącznik 90° A": { plnPrice: 18.06, plnMargin: 16.39, intranetId: 18221, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame SLM łącznik 90° B": { plnPrice: 6.47, plnMargin: 4.8, intranetId: 18222, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Smart 100x250 torba z wkładem": { plnPrice: 104.43, plnMargin: 87.76, intranetId: 19570, category: "ramy tekstylne akcesoria", origin: "NULL", noPrice: true },
  "adFrame Smart 200x250 torba": { plnPrice: 0, plnMargin: 0, intranetId: 19531, category: "ramy tekstylne akcesoria", origin: "NULL", noPrice: true },
  "adFrame Smart 300x250 i 200x250 support krzyżak": { plnPrice: 21.23, plnMargin: 4.56, intranetId: 17054, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame Smart 300x250 support komplet rurek": { plnPrice: 57.62, plnMargin: 40.95, intranetId: 17055, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame Smart 85x200 ALU (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 16672, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame Smart 85x250 (bez wydruku)": { plnPrice: 638.24, plnMargin: 629.91, intranetId: 17325, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "Adframe smart Extender 50": { plnPrice: 46.35, plnMargin: 44.68, intranetId: 19871, category: "zabudowy sego akcesoria", origin: "NULL", noPrice: true },
  "adFrame Smart stopa boczna L kształtna": { plnPrice: 33.7, plnMargin: 32.03, intranetId: 14036, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Starter 100x250 (bez wydruku)": { plnPrice: 198.84, plnMargin: 192.17, intranetId: 19694, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "adFrame Starter extension set": { plnPrice: 32.7, plnMargin: 26.03, intranetId: 19693, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "adFrame STF (bez wydruku)": { plnPrice: 269.8, plnMargin: 136.89, intranetId: 10333, category: "ramy tekstylne custom niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 100x100 (bez wydruku)": { plnPrice: 209.73, plnMargin: 102.96, intranetId: 14502, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 100x250": { plnPrice: 419.27, plnMargin: 228.2, intranetId: 14567, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STF 100x250 (bez wydruku)": { plnPrice: 336.6, plnMargin: 196.55, intranetId: 14505, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 150x250 (bez wydruku)": { plnPrice: 378.18, plnMargin: 232.96, intranetId: 14507, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 200x200": { plnPrice: 590.78, plnMargin: 350.19, intranetId: 14570, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STF 200x200 (bez wydruku)": { plnPrice: 475.06, plnMargin: 296, intranetId: 14508, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 200x250": { plnPrice: 621.3, plnMargin: 372.78, intranetId: 14571, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STF 200x250 (bez wydruku)": { plnPrice: 501.22, plnMargin: 317.66, intranetId: 14509, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 300x200": { plnPrice: 685.18, plnMargin: 425.51, intranetId: 14572, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STF 300x200 (bez wydruku)": { plnPrice: 536.35, plnMargin: 347.79, intranetId: 14510, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 300x250 (bez wydruku)": { plnPrice: 569.78, plnMargin: 375.72, intranetId: 14511, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 400x200": { plnPrice: 794.05, plnMargin: 501.59, intranetId: 14574, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STF 400x200 (bez wydruku)": { plnPrice: 610.05, plnMargin: 400.45, intranetId: 14512, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 400x250 (bez wydruku)": { plnPrice: 718.03, plnMargin: 483.44, intranetId: 14513, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 500x250 (bez wydruku)": { plnPrice: 776.21, plnMargin: 531.62, intranetId: 14515, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 600x200 (bez wydruku)": { plnPrice: 803.67, plnMargin: 555.75, intranetId: 14516, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 600x250": { plnPrice: 1091.49, plnMargin: 733.88, intranetId: 14579, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STF 600x250 (bez wydruku)": { plnPrice: 838.61, plnMargin: 584.86, intranetId: 14517, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STF 70x100": { plnPrice: 261.8, plnMargin: 112.73, intranetId: 18349, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STF 70x100 (bez wydruku)": { plnPrice: 195.67, plnMargin: 90.9, intranetId: 18351, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 100x100 (bez wydruku)": { plnPrice: 163.61, plnMargin: 55.95, intranetId: 14528, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 100x200 (bez wydruku)": { plnPrice: 223.36, plnMargin: 106.74, intranetId: 14529, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 100x250 (bez wydruku)": { plnPrice: 231.41, plnMargin: 105.17, intranetId: 14530, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 150x200 (bez wydruku)": { plnPrice: 273.53, plnMargin: 152.68, intranetId: 14531, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 150x250 (bez wydruku)": { plnPrice: 229.84, plnMargin: 115.65, intranetId: 14532, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 200x200": { plnPrice: 390.71, plnMargin: 188.84, intranetId: 14588, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STFL 200x200 (bez wydruku)": { plnPrice: 274.99, plnMargin: 134.64, intranetId: 14533, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 200x250": { plnPrice: 410.42, plnMargin: 200.88, intranetId: 14587, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STFL 200x250 (bez wydruku)": { plnPrice: 290.33, plnMargin: 145.75, intranetId: 14534, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 300x200 (bez wydruku)": { plnPrice: 304.68, plnMargin: 156.76, intranetId: 14535, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 300x250 (bez wydruku)": { plnPrice: 319.02, plnMargin: 167.77, intranetId: 14536, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 400x200 (bez wydruku)": { plnPrice: 325.89, plnMargin: 191.7, intranetId: 14537, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 400x250 (bez wydruku)": { plnPrice: 347.71, plnMargin: 189.79, intranetId: 14538, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 500x200": { plnPrice: 603.98, plnMargin: 343.84, intranetId: 14593, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STFL 500x200 (bez wydruku)": { plnPrice: 390.99, plnMargin: 219.22, intranetId: 14539, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 500x250": { plnPrice: 619.24, plnMargin: 355.77, intranetId: 14594, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STFL 500x250 (bez wydruku)": { plnPrice: 405.34, plnMargin: 230.23, intranetId: 14540, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 50x100 (bez wydruku)": { plnPrice: 137.78, plnMargin: 44.49, intranetId: 14527, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 50x50": { plnPrice: 192.43, plnMargin: 49.95, intranetId: 14596, category: "ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "adFrame STFL 50x50 (bez wydruku)": { plnPrice: 133.03, plnMargin: 33.75, intranetId: 14526, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 600x200 (bez wydruku)": { plnPrice: 383.25, plnMargin: 235.73, intranetId: 14541, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL 600x250 (bez wydruku)": { plnPrice: 434.01, plnMargin: 252.24, intranetId: 14542, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL A0 84x118 (bez wydruku)": { plnPrice: 163.88, plnMargin: 56.35, intranetId: 14525, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL B1 70x100 (bez wydruku)": { plnPrice: 155, plnMargin: 49.34, intranetId: 14519, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL B2 50x70 (bez wydruku)": { plnPrice: 62.22, plnMargin: 42.21, intranetId: 14520, category: "ramy tekstylne standard niepodświetlane", origin: "Chiny", noPrice: true },
  "adFrame STFL narożnik": { plnPrice: 3.27, plnMargin: 1.6, intranetId: 10953, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame support zamek 45° left": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 11119, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame support zamek 45° right": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 11120, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame support łącznik 180 stopni wzmocniony / zamiennik ELSTAR": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17431, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame support łącznik rurkowy": { plnPrice: 40.31, plnMargin: 35.31, intranetId: 17058, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "adFrame SWF (bez wydruku)": { plnPrice: 88.4, plnMargin: 68.4, intranetId: 15899, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "adFrame SWF - sklep - łącznik do supportu": { plnPrice: 6.34, plnMargin: 4.67, intranetId: 15901, category: "ramy tekstylne p&p", origin: "Chiny", noPrice: true },
  "adFrame torx T30": { plnPrice: 1.4, plnMargin: 0.13, intranetId: 13758, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "adFrame wieszak linka oczko": { plnPrice: 21.69, plnMargin: 20.02, intranetId: 11128, category: "systemy podwieszane akcesoria", origin: "Chiny", noPrice: true },
  "adFrame Z 100x200": { plnPrice: 365.29, plnMargin: 340.29, intranetId: 19300, category: "inne", origin: "Polska", noPrice: true },
  "adFrame łącznik LMS-mFrame ZESTAW": { plnPrice: 45.29, plnMargin: 33.34, intranetId: 18306, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "adGate Air Square 4,5m - zestaw sznurków (4szt)": { plnPrice: 0, plnMargin: 0, intranetId: 16323, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adGate Air Square 4,5m TPU": { plnPrice: 0, plnMargin: 0, intranetId: 16180, category: "bramy pneumatyczne", origin: "Polska", noPrice: true },
  "adGate Air Square 4,5m ver2": { plnPrice: 1629.39, plnMargin: 1209.6, intranetId: 17919, category: "bramy pneumatyczne", origin: "Polska", noPrice: true },
  "adGate Air Square 6,5m (bez wydruku)": { plnPrice: 1314.08, plnMargin: 1280.75, intranetId: 18352, category: "bramy pneumatyczne", origin: "Chiny", noPrice: true },
  "adGate Air Triangle 6,5m - zestaw sznurków (6szt)": { plnPrice: 0, plnMargin: 0, intranetId: 16293, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adGate Air Triangle 6,5m ver2 (bez wydruku)": { plnPrice: 1225.36, plnMargin: 1192.03, intranetId: 16820, category: "bramy pneumatyczne", origin: "Chiny", noPrice: true },
  "adGate Quick Arch (bez wydruku)": { plnPrice: 354.06, plnMargin: 329.06, intranetId: 18606, category: "vario light", origin: "Polska", noPrice: true },
  "adGate Quick Arch - konstrukcja (bez wydruku)": { plnPrice: 124.94, plnMargin: 116.61, intranetId: 18406, category: "inne", origin: "Polska", noPrice: true },
  "adGate Round (bez wydruku)": { plnPrice: 1386.55, plnMargin: 1353.22, intranetId: 18353, category: "bramy pneumatyczne", origin: "Polska", noPrice: true },
  "adPuff inflate (bez wydruku)": { plnPrice: 58.94, plnMargin: 42.27, intranetId: 18833, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Adstand Drop - 120 (bez wydruku)": { plnPrice: 124.23, plnMargin: 109.11, intranetId: 18444, category: "rollupy", origin: "Polska", noPrice: true },
  "adStand Eco 100 (bez wydruku)": { plnPrice: 54.91, plnMargin: 51.58, intranetId: 10203, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Eco 85 (bez wydruku)": { plnPrice: 53.23, plnMargin: 48.23, intranetId: 10204, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand L 100 (bez wydruku)": { plnPrice: 100.49, plnMargin: 90.96, intranetId: 10033, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand L 120 (bez wydruku)": { plnPrice: 146.54, plnMargin: 136.89, intranetId: 10040, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand L 150 (bez wydruku)": { plnPrice: 200.56, plnMargin: 185.71, intranetId: 10042, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand L 60 (bez wydruku)": { plnPrice: 114.81, plnMargin: 105.54, intranetId: 10037, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand L 80 (bez wydruku)": { plnPrice: 117.26, plnMargin: 107.85, intranetId: 10035, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand L noga pomalowana": { plnPrice: 14.94, plnMargin: 11.2, intranetId: 10144, category: "ścianki banerowe akcesoria", origin: "Polska", noPrice: true },
  "adStand L noga surowa": { plnPrice: 8.25, plnMargin: 8.25, intranetId: 16337, category: "ścianki banerowe akcesoria", origin: "Polska", noPrice: true },
  "adStand L noga uzbrojona": { plnPrice: 14.64, plnMargin: 12.97, intranetId: 17873, category: "ścianki banerowe akcesoria", origin: "Polska", noPrice: true },
  "adStand Level 100 (bez wydruku)": { plnPrice: 319.3, plnMargin: 310.34, intranetId: 10184, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Level 85 (bez wydruku)": { plnPrice: 219.84, plnMargin: 210.62, intranetId: 10185, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Lux 120 (bez wydruku)": { plnPrice: 125.2, plnMargin: 116.87, intranetId: 10179, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Lux 85 (bez wydruku)": { plnPrice: 72.6, plnMargin: 67.6, intranetId: 10199, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Octa 100": { plnPrice: 224.27, plnMargin: 136.86, intranetId: 19410, category: "rollupy", origin: "Polska", noPrice: true },
  "adStand Octa 100 (bez wydruku)": { plnPrice: 101.83, plnMargin: 92.61, intranetId: 19076, category: "rollupy", origin: "Polska", noPrice: true },
  "adStand Octa 85 (bez wydruku)": { plnPrice: 90.7, plnMargin: 83.19, intranetId: 19078, category: "rollupy", origin: "Polska", noPrice: true },
  "adStand Premium 100 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 10022, category: "rollupy", origin: "Polska", noPrice: true },
  "adStand Premium 100 uzbrojony rozbieg": { plnPrice: 19.23, plnMargin: 19.23, intranetId: 12296, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "adStand Premium 120 (bez wydruku)": { plnPrice: 328.73, plnMargin: 289.11, intranetId: 10023, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Premium 120 mechanizm zwijania surowy": { plnPrice: 21.6, plnMargin: 18.27, intranetId: 17590, category: "półprodukty", origin: "Polska", noPrice: true },
  "adStand Premium 120 uzbrojony rozbieg": { plnPrice: 19.23, plnMargin: 19.23, intranetId: 12297, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "adStand Premium 150 (bez wydruku)": { plnPrice: 421.06, plnMargin: 371.84, intranetId: 10134, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Premium 150 uzbrojony rozbieg": { plnPrice: 19.23, plnMargin: 19.23, intranetId: 12298, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "adStand Premium 85 (bez wydruku)": { plnPrice: 341.22, plnMargin: 303.16, intranetId: 10020, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Premium 85 uzbrojony rozbieg": { plnPrice: 19.23, plnMargin: 19.23, intranetId: 12294, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Adstand Premium CN 120 (bez wydruku)": { plnPrice: 205.1, plnMargin: 190.1, intranetId: 18440, category: "rollupy", origin: "Chiny", noPrice: true },
  "Adstand Premium CN 150 (bez wydruku)": { plnPrice: 252.23, plnMargin: 237.23, intranetId: 18441, category: "rollupy", origin: "Chiny", noPrice: true },
  "Adstand Premium CN 85 (bez wydruku)": { plnPrice: 160.81, plnMargin: 145.81, intranetId: 18438, category: "rollupy", origin: "Chiny", noPrice: true },
  "adStand Premium sprężyna do mechanizmu zwijania": { plnPrice: 7.55, plnMargin: 7.55, intranetId: 12295, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "adStand Premium łożysko do mechanizmu zwijania": { plnPrice: 1.21, plnMargin: 1.21, intranetId: 17581, category: "półprodukty", origin: "Polska", noPrice: true },
  "adStand R3 Black 100 (bez wydruku)": { plnPrice: 45.84, plnMargin: 42.51, intranetId: 19080, category: "rollupy", origin: "Polska", noPrice: true },
  "adStand R3 White 100 (bez wydruku)": { plnPrice: 37.38, plnMargin: 34.05, intranetId: 19281, category: "rollupy", origin: "Polska", noPrice: true },
  "adStand R3 White 85 (bez wydruku)": { plnPrice: 32.17, plnMargin: 28.84, intranetId: 19282, category: "rollupy", origin: "Polska", noPrice: true },
  "adTent Air 3x3 (bez wydruku)": { plnPrice: 1110.54, plnMargin: 1060.54, intranetId: 11097, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent Air 4x4 (bez wydruku)": { plnPrice: 1379.81, plnMargin: 1313.14, intranetId: 11098, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent Air 5x5 (bez wydruku)": { plnPrice: 1818.59, plnMargin: 1735.26, intranetId: 11099, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent Air 5x5 (bez wydruku) SZARY": { plnPrice: 1768.14, plnMargin: 1701.47, intranetId: 17459, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent Air 5x5 TPU": { plnPrice: 306.87, plnMargin: 240.2, intranetId: 16179, category: "namioty", origin: "Polska", noPrice: true },
  "adTent Air 6x6 (bez wydruku)": { plnPrice: 190.27, plnMargin: 106.94, intranetId: 11207, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent Air KOMPLET 2 PLECAKÓW DO NAMIOTU 3X3": { plnPrice: 181.01, plnMargin: 161.01, intranetId: 14028, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent Air Oświetlenie LED - 4x4": { plnPrice: 320.27, plnMargin: 320.27, intranetId: 15599, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent Air premium - zestaw MARKIZA 5x5": { plnPrice: 1489.11, plnMargin: 810.57, intranetId: 15530, category: "namioty", origin: "Polska", noPrice: true },
  "adTent Air premium - zestaw sznurki 3x3 worek": { plnPrice: 1.67, plnMargin: 0, intranetId: 15524, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent Air premium - zestaw sznurki 4x4 worek": { plnPrice: 1.67, plnMargin: 0, intranetId: 15525, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent Air premium - zestaw sznurki 5x5 worek": { plnPrice: 1.67, plnMargin: 0, intranetId: 15526, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent Air premium - zestaw sznurki 6x6 worek": { plnPrice: 25, plnMargin: 0, intranetId: 15527, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent Air premium 1x1 SET (bez wydruku)": { plnPrice: 396.75, plnMargin: 380.08, intranetId: 18357, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent Air premium 3x3 (stelaż+dach+4xściana boczna jednostronna)": { plnPrice: 3285.32, plnMargin: 2185.93, intranetId: 14016, category: "namioty", origin: "Polska", noPrice: true },
  "adTent Air premium 4x6 (bez wydruku)": { plnPrice: 1869.11, plnMargin: 1835.05, intranetId: 18355, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent Air premium 5x5 (stelaż+dach+4xściana boczna jednostronna)": { plnPrice: 5196.41, plnMargin: 3687.58, intranetId: 14018, category: "namioty", origin: "Polska", noPrice: true },
  "adTent Air premium Automatic 4x4 (bez wydruku)": { plnPrice: 2261.76, plnMargin: 2224.36, intranetId: 18802, category: "namioty", origin: "Polska", noPrice: true },
  "adTent Air premium Automatic 5x5 (bez wydruku)": { plnPrice: 2929.76, plnMargin: 2892.36, intranetId: 18801, category: "namioty", origin: "Polska", noPrice: true },
  "adTent Air premium Automatic 6x6 (bez wydruku)": { plnPrice: 3326.58, plnMargin: 3289.18, intranetId: 18803, category: "namioty", origin: "Polska", noPrice: true },
  "adTent Air premium SMART 4x4 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18505, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent EXPRESS - noga środkowa": { plnPrice: 0, plnMargin: 0, intranetId: 18752, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent EXPRESS - obejma rzep biała": { plnPrice: 0.73, plnMargin: 0.07, intranetId: 18814, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent EXPRESS - obejma rzep czarna": { plnPrice: 4.04, plnMargin: 0.07, intranetId: 18813, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent EXPRESS - obejma rzep szara": { plnPrice: 0.71, plnMargin: 0.07, intranetId: 18815, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent EXPRESS - plastik do noga środkowa": { plnPrice: 0, plnMargin: 0, intranetId: 18754, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "Adtent express - Rzep twardy szary 25mm [haczyk]": { plnPrice: 1.18, plnMargin: 0.08, intranetId: 18737, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "adTent EXPRESS 3x4,5m torba na kółkach": { plnPrice: 28.69, plnMargin: 27.02, intranetId: 15590, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "adTent EXPRESS 3x6m (konstrukcja+wydruk dach+4x sciana)": { plnPrice: 2957.21, plnMargin: 1848.71, intranetId: 15731, category: "namioty", origin: "Polska", noPrice: true },
  "adTent EXPRESS 3x6m torba na kółkach": { plnPrice: 103.57, plnMargin: 101.9, intranetId: 15591, category: "outdoor akcesoria", origin: "Chiny", noPrice: true },
  "adTent EXPRESS PRO 3x3m torba na kółkach": { plnPrice: 73.08, plnMargin: 71.41, intranetId: 17505, category: "outdoor", origin: "Chiny", noPrice: true },
  "adTent EXPRESS PRO 3x6m torba na kółkach": { plnPrice: 100.48, plnMargin: 98.81, intranetId: 17506, category: "outdoor", origin: "Chiny", noPrice: true },
  "adTent V - zestaw Śledzie Outdoor 18 szt": { plnPrice: 77.93, plnMargin: 39.6, intranetId: 17940, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "adTent V 4x4 (bez wydruku)": { plnPrice: 2336.15, plnMargin: 2224.48, intranetId: 17379, category: "namioty", origin: "Chiny", noPrice: true },
  "adTent V 4x4 akcesoria": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 17529, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "adTent V 5x5 (bez wydruku)": { plnPrice: 2805.98, plnMargin: 2694.31, intranetId: 17380, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "adTent V 6x6 (bez wydruku)": { plnPrice: 3408.24, plnMargin: 3294.91, intranetId: 17381, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "adTent Vario 3x3 (bez wydruku)": { plnPrice: 3305.428, plnMargin: 1180.51, intranetId: 11108, category: "namioty", origin: "6306220000", noPrice: true },
  "adTowel 100x150cm": { plnPrice: 100.38, plnMargin: 47.99, intranetId: 15583, category: "tekstylia użytkowe", origin: "Polska", noPrice: true },
  "adTribune Air ∅60x100 Tribune": { plnPrice: 396.51, plnMargin: 282.06, intranetId: 11603, category: "słupy", origin: "Polska", noPrice: true },
  "adTribune Air ∅60x100 Tribune (bez wydruku)": { plnPrice: 262.41, plnMargin: 240.74, intranetId: 11779, category: "słupy", origin: "Chiny", noPrice: true },
  "adTribune Air ∅60x100 Tribune - ver TPU (bez wydruku)": { plnPrice: 317.59, plnMargin: 295.92, intranetId: 18144, category: "słupy", origin: "Chiny", noPrice: true },
  "adTribune Big Case (bez wydruku)": { plnPrice: 420.12, plnMargin: 415.12, intranetId: 10907, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Edge 1x1 (bez wydruku)": { plnPrice: 404.92, plnMargin: 384.92, intranetId: 11103, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Elypse blat": { plnPrice: 80.5, plnMargin: 73.83, intranetId: 10375, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "adTribune Elypse blat niestandardowy": { plnPrice: 82.57, plnMargin: 75.9, intranetId: 13686, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Elypse Mini (bez wydruku)": { plnPrice: 282.37, plnMargin: 257.37, intranetId: 10111, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Elypse Mini komplet blat+półka": { plnPrice: 109.39, plnMargin: 102.72, intranetId: 17536, category: "półprodukty", origin: "Polska", noPrice: true },
  "adTribune Expo 100x100 (bez wydruku) klasa 2": { plnPrice: 517.99, plnMargin: 477.92, intranetId: 18117, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Expo 100x100 klasa 2": { plnPrice: 582.64, plnMargin: 507.62, intranetId: 18118, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Expo bok lewy (bez wydruku)": { plnPrice: 59.04, plnMargin: 54.04, intranetId: 16968, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Expo bok prawy (bez wydruku)": { plnPrice: 59.04, plnMargin: 54.04, intranetId: 16969, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Expo półka (bez wydruku)": { plnPrice: 5.04, plnMargin: 0.04, intranetId: 16970, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Flex Expo (bez wydruku)": { plnPrice: 784.43, plnMargin: 759.43, intranetId: 19234, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Flex Lock Door Set": { plnPrice: 382.09, plnMargin: 357.09, intranetId: 19758, category: "trybunki reklamowe", origin: "NULL", noPrice: true },
  "adTribune Flex Lock konsturkcja (bez wydruku)": { plnPrice: 867.14, plnMargin: 842.14, intranetId: 19235, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Flex Simple (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19232, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Flex Simple LED (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19233, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Hit blat": { plnPrice: 78.17, plnMargin: 71.5, intranetId: 10373, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Hit blat niestandardowy": { plnPrice: 76.22, plnMargin: 69.55, intranetId: 15106, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Hit C (bez wydruku)": { plnPrice: 335.1, plnMargin: 305.21, intranetId: 10361, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Hit C komplet blat+półka": { plnPrice: 139.35, plnMargin: 132.68, intranetId: 17493, category: "półprodukty", origin: "Polska", noPrice: true },
  "adTribune Hit komplet blat+półka": { plnPrice: 124.36, plnMargin: 117.69, intranetId: 17492, category: "półprodukty", origin: "Polska", noPrice: true },
  "adTribune Hit mini blat": { plnPrice: 53.75, plnMargin: 47.08, intranetId: 11332, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Hit Mini komplet blat+półka": { plnPrice: 107.62, plnMargin: 90.95, intranetId: 17538, category: "classic", origin: "Polska", noPrice: true },
  "adTribune Oval (bez wydruku)": { plnPrice: 263.28, plnMargin: 258.28, intranetId: 10337, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Oval Maxi (bez wydruku)": { plnPrice: 373.71, plnMargin: 368.71, intranetId: 11401, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune PVC Oval (bez wydruku)": { plnPrice: 138.14, plnMargin: 121.47, intranetId: 19428, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "adTribune PVC Oval-owijka (bez wydruku)": { plnPrice: 12.23, plnMargin: 3.9, intranetId: 19796, category: "stoiska degustacyjne", origin: "NULL", noPrice: true },
  "adTribune PVC Round (bez wydruku)": { plnPrice: 152.53, plnMargin: 135.86, intranetId: 19429, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "adTribune PVC Round-owijka (bez wydruku)": { plnPrice: 12.23, plnMargin: 3.9, intranetId: 19799, category: "stoiska degustacyjne", origin: "NULL", noPrice: true },
  "adTribune Quick Kidney (bez wydruku)": { plnPrice: 221.81, plnMargin: 216.81, intranetId: 19172, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Quick LED (bez wydruku)": { plnPrice: 229.19, plnMargin: 224.19, intranetId: 19123, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Quick Max": { plnPrice: 568.91, plnMargin: 505.92, intranetId: 19751, category: "trybunki reklamowe", origin: "NULL", noPrice: true },
  "adTribune Quick Max (bez wydruku)": { plnPrice: 475.37, plnMargin: 470.37, intranetId: 19229, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Quick Max LED": { plnPrice: 715.58, plnMargin: 653.52, intranetId: 19752, category: "trybunki reklamowe", origin: "NULL", noPrice: true },
  "adTribune Quick Max LED (bez wydruku)": { plnPrice: 614.17, plnMargin: 609.17, intranetId: 19230, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Quick Round (bez wydruku)": { plnPrice: 183.54, plnMargin: 178.54, intranetId: 19173, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Quick Square": { plnPrice: 278.48, plnMargin: 215.49, intranetId: 19749, category: "trybunki reklamowe", origin: "NULL", noPrice: true },
  "adTribune Quick Square (bez wydruku)": { plnPrice: 184.94, plnMargin: 179.94, intranetId: 19174, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Quick Square LED": { plnPrice: 393.17, plnMargin: 331.11, intranetId: 19750, category: "trybunki reklamowe", origin: "NULL", noPrice: true },
  "adTribune Quick Square LED (bez wydruku)": { plnPrice: 291.76, plnMargin: 286.76, intranetId: 19175, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Ring (bez wydruku)": { plnPrice: 316.64, plnMargin: 278.03, intranetId: 10278, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Ring blat": { plnPrice: 53.75, plnMargin: 47.08, intranetId: 11333, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Ring komplet blat + półka": { plnPrice: 0, plnMargin: 0, intranetId: 18183, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune Seg (konstrukcja) - NIE SPRZEDAWAĆ": { plnPrice: 209.16, plnMargin: 184.16, intranetId: 16106, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune SEG blat": { plnPrice: 164.31, plnMargin: 162.64, intranetId: 12158, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Seg komplet blat+półka": { plnPrice: 222.81, plnMargin: 216.14, intranetId: 17568, category: "półprodukty", origin: "Polska", noPrice: true },
  "adTribune Seg NEW (bez wydruku)": { plnPrice: 414.31, plnMargin: 380.98, intranetId: 17747, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Seg NEW (konstrukcja)": { plnPrice: 184.16, plnMargin: 184.16, intranetId: 17752, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Shell rzep": { plnPrice: 8.01, plnMargin: 8.01, intranetId: 12292, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "adTribune Smart LED (bez wydruku)": { plnPrice: 638.25, plnMargin: 613.25, intranetId: 12230, category: "trybunki reklamowe", origin: "Chiny", noPrice: true },
  "adTribune Standard blat": { plnPrice: 72.67, plnMargin: 66, intranetId: 10377, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "adTribune Standard komplet blat+półka": { plnPrice: 121.16, plnMargin: 114.49, intranetId: 17567, category: "półprodukty", origin: "Chiny", noPrice: true },
  "adTribune Starter komplet łączników": { plnPrice: 12.05, plnMargin: 0.38, intranetId: 18636, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Starter półka": { plnPrice: 48.12, plnMargin: 36.45, intranetId: 18781, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "adTribune Tex mini blat": { plnPrice: 61.24, plnMargin: 54.57, intranetId: 11335, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Adtribune/Adbox Elypse CN zestaw (bez wydruku)": { plnPrice: 297.73, plnMargin: 291.06, intranetId: 19640, category: "półprodukty", origin: "NULL", noPrice: true },
  "adTribune/adBox Standard konstrukcja surowa": { plnPrice: 369.15, plnMargin: 369.15, intranetId: 18478, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adTribune/adBox Standard konstrukcja uzbrojona": { plnPrice: 380.06, plnMargin: 380.06, intranetId: 11856, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "adUp Vario Clover Maxi (bez wydruku)": { plnPrice: 665.02, plnMargin: 656.69, intranetId: 11074, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adUp Vario Trapfloat (bez wydruku)": { plnPrice: 446.21, plnMargin: 437.88, intranetId: 10917, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adUp Vario Trapfloat jednostronne": { plnPrice: 900.13, plnMargin: 612.86, intranetId: 10913, category: "systemy podwieszane", origin: "Polska", noPrice: true },
  "adUp Vario Trifloat (bez wydruku)": { plnPrice: 475.75, plnMargin: 467.42, intranetId: 10914, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "Advideo A-board 43`": { plnPrice: 1591.51, plnMargin: 1558.18, intranetId: 19632, category: "digital", origin: "NULL", noPrice: true },
  "Advideo A-board 55`": { plnPrice: 2077.77, plnMargin: 2044.44, intranetId: 19633, category: "digital", origin: "NULL", noPrice: true },
  "adVideo InfoKiosk 55` flight case": { plnPrice: 1393.96, plnMargin: 1385.63, intranetId: 18670, category: "digital", origin: "Polska", noPrice: true },
  "adVideo InfoKiosk 55` OUTDOOR": { plnPrice: 5055.72, plnMargin: 4855.72, intranetId: 18671, category: "digital", origin: "Polska", noPrice: true },
  "adVideo InfoKiosk 65": { plnPrice: 6187.92, plnMargin: 5987.92, intranetId: 16035, category: "digital", origin: "Chiny", noPrice: true },
  "adVideo InfoKiosk 65` flight case": { plnPrice: 1684.2, plnMargin: 1675.87, intranetId: 17500, category: "digital", origin: "Polska", noPrice: true },
  "adVideo InfoKiosk 65` ver2.0 flight case": { plnPrice: 1765.97, plnMargin: 1757.64, intranetId: 19028, category: "digital", origin: "Polska", noPrice: true },
  "adVideo InfoKiosk 65` with flight case": { plnPrice: 8072.13, plnMargin: 7663.8, intranetId: 17855, category: "digital", origin: "Chiny", noPrice: true },
  "adVideo Poster Fold [P1.86]": { plnPrice: 5880.47, plnMargin: 5680.47, intranetId: 19645, category: "digital", origin: "NULL", noPrice: true },
  "adVideo Poster Fold [P2.5]": { plnPrice: 5121.08, plnMargin: 4921.08, intranetId: 19646, category: "digital", origin: "NULL", noPrice: true },
  "adVideo Stand Flex 32`": { plnPrice: 1686.21, plnMargin: 1652.88, intranetId: 19642, category: "digital", origin: "NULL", noPrice: true },
  "adVideo Stand Surface 32`": { plnPrice: 2326.3, plnMargin: 2292.97, intranetId: 19643, category: "digital", origin: "NULL", noPrice: true },
  "adWall 3x3/3x4 smart prosta - COKOŁY (komplet)": { plnPrice: 87.27, plnMargin: 87.27, intranetId: 12168, category: "ścianki popup akcesoria", origin: "Polska", noPrice: true },
  "adWall 3x3/3x4 smart prosta - taśma magnetyczna": { plnPrice: 70.14, plnMargin: 70.14, intranetId: 12169, category: "ścianki popup akcesoria", origin: "Polska", noPrice: true },
  "adWall 3x3/3x4 smart łukowa - COKOŁY (komplet)": { plnPrice: 49.88, plnMargin: 49.88, intranetId: 12167, category: "ścianki popup akcesoria", origin: "Polska", noPrice: true },
  "adWall 3x3/3x4 smart łukowa - taśma magnetyczna": { plnPrice: 58.46, plnMargin: 58.46, intranetId: 12170, category: "ścianki popup akcesoria", origin: "Polska", noPrice: true },
  "adWall Edge 3x1S (bez wydruku)": { plnPrice: 258.81, plnMargin: 248.81, intranetId: 11213, category: "ścianki popup", origin: "Chiny", noPrice: true },
  "adWall Edge Plus 1x3S SS": { plnPrice: 553.37, plnMargin: 473.42, intranetId: 12320, category: "ścianki popup", origin: "Polska", noPrice: true },
  "adWall Edge Plus 1x3S SS(bez wydruku)": { plnPrice: 456.79, plnMargin: 448.46, intranetId: 11454, category: "ścianki popup", origin: "Polska", noPrice: true },
  "adWall Edge Plus 2x3S SS(bez wydruku)": { plnPrice: 548.31, plnMargin: 539.98, intranetId: 11453, category: "ścianki popup", origin: "Polska", noPrice: true },
  "adWall L 200 (bez wydruku)": { plnPrice: 231.54, plnMargin: 216.37, intranetId: 10044, category: "rollupy", origin: "Chiny", noPrice: true },
  "adWall Smart karton": { plnPrice: 11.49, plnMargin: 0.75, intranetId: 12417, category: "ścianki popup akcesoria", origin: "Polska", noPrice: true },
  "adWall Smart prosta 3x3 (bez wydruku)": { plnPrice: 721.53, plnMargin: 704.86, intranetId: 10169, category: "ścianki popup", origin: "Chiny", noPrice: true },
  "adWall Smart łukowa 3x3(bez wydruku)": { plnPrice: 1121.17, plnMargin: 1104.5, intranetId: 10167, category: "ścianki popup", origin: "Chiny", noPrice: true },
  "adWall Smart łukowa 4x3": { plnPrice: 2281.82, plnMargin: 1831.79, intranetId: 10018, category: "ścianki popup", origin: "Polska", noPrice: true },
  "adWall Smart łukowa 4x3 (bez wydruku)": { plnPrice: 1222.43, plnMargin: 1205.76, intranetId: 10168, category: "ścianki popup", origin: "Chiny", noPrice: true },
  "adWall Vario Add (bez wydruku)": { plnPrice: 261.15, plnMargin: 252.82, intranetId: 11077, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Add - łącznik": { plnPrice: 4.35, plnMargin: 2.68, intranetId: 17644, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Add lewy jednostronne": { plnPrice: 523.45, plnMargin: 411.15, intranetId: 11081, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Add prawy jednostronne": { plnPrice: 523.45, plnMargin: 411.15, intranetId: 15868, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Arch A (bez wydruku)": { plnPrice: 603.7, plnMargin: 595.37, intranetId: 10427, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Arch B": { plnPrice: 0, plnMargin: 0, intranetId: 10559, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Arch B (bez wydruku)": { plnPrice: 603.7, plnMargin: 595.37, intranetId: 10557, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Big Island (bez wydruku)": { plnPrice: 629.18, plnMargin: 620.85, intranetId: 10431, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario C-wall (bez wydruku)": { plnPrice: 402.52, plnMargin: 394.19, intranetId: 10297, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Classic 100 (bez wydruku)": { plnPrice: 339.68, plnMargin: 331.35, intranetId: 17629, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Classic 100 dwustronne (rollup)": { plnPrice: 483.99, plnMargin: 398.17, intranetId: 17947, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "adWall Vario Classic 100 jednostronne": { plnPrice: 483.99, plnMargin: 398.17, intranetId: 17720, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "adWall Vario Classic 220 (bez wydruku)": { plnPrice: 1027.46, plnMargin: 366.95, intranetId: 10213, category: "vario klasyczne ścianki", origin: "7616999099", noPrice: true },
  "adWall Vario Classic 220 dwustronne": { plnPrice: 597.68, plnMargin: 491.99, intranetId: 12493, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "adWall Vario Classic 220 jednostronne": { plnPrice: 597.68, plnMargin: 491.99, intranetId: 10211, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "adWall Vario Classic 340 (bez wydruku)": { plnPrice: 413.67, plnMargin: 405.34, intranetId: 10311, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Classic Light 180 (bez wydruku)": { plnPrice: 30, plnMargin: 0, intranetId: 11555, category: "vario light", origin: "5", noPrice: true },
  "adWall Vario Classic Light 180 dwustronne": { plnPrice: 522.52, plnMargin: 420.12, intranetId: 12527, category: "vario light", origin: "Polska", noPrice: true },
  "adWall Vario Classic Light 300 (bez wydruku)": { plnPrice: 30, plnMargin: 0, intranetId: 11556, category: "vario light", origin: "4", noPrice: true },
  "adWall Vario Classic/Prosta Stopa": { plnPrice: 6.1, plnMargin: 1.1, intranetId: 15434, category: "vario akcesoria", origin: "Polska", noPrice: true },
  "adWall Vario Cone (bez wydruku)": { plnPrice: 524.29, plnMargin: 515.96, intranetId: 11071, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario CR (bez wydruku)": { plnPrice: 410.33, plnMargin: 402, intranetId: 11404, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario CR dwustronne": { plnPrice: 0, plnMargin: 0, intranetId: 12505, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Craft (bez wydruku)": { plnPrice: 836.95, plnMargin: 828.62, intranetId: 10435, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Craft OLD (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 11107, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Crown": { plnPrice: 2322.11, plnMargin: 1808.17, intranetId: 11087, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Crown (bez wydruku)": { plnPrice: 1086.92, plnMargin: 1078.59, intranetId: 11076, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Fall (bez wydruku)": { plnPrice: 323.5, plnMargin: 315.17, intranetId: 10330, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Flat Ring Water Base (bez wydruku)": { plnPrice: 274.78, plnMargin: 266.45, intranetId: 16192, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario In (bez wydruku)": { plnPrice: 537.13, plnMargin: 528.8, intranetId: 10339, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Island (bez wydruku)": { plnPrice: 440.27, plnMargin: 431.94, intranetId: 10370, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Kite (bez wydruku)": { plnPrice: 562.65, plnMargin: 554.32, intranetId: 10429, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Kite dwustronne": { plnPrice: 0, plnMargin: 0, intranetId: 12525, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Kite jednostronne": { plnPrice: 0, plnMargin: 0, intranetId: 10428, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Magnet Wall (bez wydruku)": { plnPrice: 545.83, plnMargin: 529.16, intranetId: 11114, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Peak (bez wydruku)": { plnPrice: 523.79, plnMargin: 515.46, intranetId: 10347, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Podwieszane kwadrat 14x14m (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 12253, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adWall Vario Podwieszane kółko 4m (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 12002, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adWall Vario Podwieszane kółko 6m (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 12003, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adWall Vario Podwieszane kółko 8m (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 12004, category: "systemy podwieszane", origin: "Chiny", noPrice: true },
  "adWall Vario Presto - zawieszka na ulotki": { plnPrice: 37.07, plnMargin: 20.4, intranetId: 11496, category: "vario akcesoria", origin: "Polska", noPrice: true },
  "adWall Vario Presto 150 (bez wydruku)": { plnPrice: 478.548, plnMargin: 170.91, intranetId: 10452, category: "vario klasyczne ścianki", origin: "7616999099", noPrice: true },
  "adWall Vario Presto Light 120 (bez wydruku) VS": { plnPrice: 213.37, plnMargin: 205.04, intranetId: 18778, category: "vario light", origin: "Polska", noPrice: true },
  "adWall Vario Presto Light Screw 060 (bez wydruku)": { plnPrice: 94.94, plnMargin: 86.61, intranetId: 11487, category: "vario light", origin: "Chiny", noPrice: true },
  "adWall Vario Presto Light Screw 150 (bez wydruku)": { plnPrice: 126.12, plnMargin: 117.79, intranetId: 11486, category: "vario light", origin: "Chiny", noPrice: true },
  "adWall Vario Presto Outdoor - konstrukcja (bez wydruku)": { plnPrice: 144.37, plnMargin: 136.04, intranetId: 18407, category: "inne", origin: "Polska", noPrice: true },
  "adWall Vario Presto Outdoor - podstawa (bez wydruku)": { plnPrice: 220.78, plnMargin: 212.45, intranetId: 18404, category: "inne", origin: "Polska", noPrice: true },
  "adWall Vario Presto Outdoor - łącznik": { plnPrice: 2.47, plnMargin: 0.8, intranetId: 18676, category: "inne", origin: "Polska", noPrice: true },
  "adWall Vario Prosta 220 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 10282, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Prosta 240 Ø43 w torbie na kółkach jednostronne": { plnPrice: 684.23, plnMargin: 572.46, intranetId: 19514, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Prosta 300 Ø43 (bez wydruku)": { plnPrice: 392.87, plnMargin: 384.54, intranetId: 10352, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Prosta 340 (bez wydruku)": { plnPrice: 479.88, plnMargin: 471.55, intranetId: 10556, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Prosta 400 Ø43 (bez wydruku)": { plnPrice: 402.1, plnMargin: 393.77, intranetId: 10982, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Prosta 400 Ø43 jednostronne": { plnPrice: 759.12, plnMargin: 629.75, intranetId: 10981, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "adWall Vario Prosta 500 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 642.19, plnMargin: 608.86, intranetId: 19470, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Prosta 520 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 10319, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Prosta 600 Ø43 (bez wydruku)": { plnPrice: 630.31, plnMargin: 621.98, intranetId: 10354, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Prosta 600 Ø43 dwustronne": { plnPrice: 1136.92, plnMargin: 968.88, intranetId: 12609, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "adWall Vario Prosta 600 Ø43 jednostronne": { plnPrice: 1136.92, plnMargin: 968.88, intranetId: 10353, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "adWall Vario Prosta 600 Ø43 torbie na kółkach (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19471, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Prosta Black 240 (bez wydruku)": { plnPrice: 120.77, plnMargin: 104.1, intranetId: 19431, category: "frames light", origin: "Polska", noPrice: true },
  "adWall Vario Prosta Black 300 (bez wydruku)": { plnPrice: 124.77, plnMargin: 108.1, intranetId: 19432, category: "frames light", origin: "Polska", noPrice: true },
  "adWall Vario Prosta Black 400 (bez wydruku)": { plnPrice: 148.78, plnMargin: 132.11, intranetId: 19433, category: "frames light", origin: "Polska", noPrice: true },
  "adWall Vario Prosta Black 500 (bez wydruku)": { plnPrice: 168.8, plnMargin: 152.13, intranetId: 19434, category: "frames light", origin: "Polska", noPrice: true },
  "adWall Vario Qring (bez wydruku)": { plnPrice: 368.07, plnMargin: 359.74, intranetId: 10561, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Ring New (bez wydruku)": { plnPrice: 320.27, plnMargin: 320.27, intranetId: 11406, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Ring New stopa": { plnPrice: 20.02, plnMargin: 20.02, intranetId: 19695, category: "vario crazy", origin: "NULL", noPrice: true },
  "adWall Vario S 100 (bez wydruku)": { plnPrice: 233.9, plnMargin: 225.57, intranetId: 10324, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario S 150 (bez wydruku)": { plnPrice: 276.73, plnMargin: 268.4, intranetId: 10368, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario S 80 (bez wydruku)": { plnPrice: 233.68, plnMargin: 225.35, intranetId: 10322, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Serpentyna 300 (bez wydruku)": { plnPrice: 425.06, plnMargin: 416.73, intranetId: 10388, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Serpentyna 600 (bez wydruku)": { plnPrice: 681.18, plnMargin: 672.85, intranetId: 10395, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Serpentyna 600 jednostronne": { plnPrice: 1280.04, plnMargin: 1051.95, intranetId: 10394, category: "vario crazy", origin: "Polska", noPrice: true },
  "adWall Vario Slope (bez wydruku)": { plnPrice: 485.61, plnMargin: 477.28, intranetId: 10341, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario T (bez wydruku)": { plnPrice: 340.23, plnMargin: 331.9, intranetId: 10326, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Tower (bez wydruku)": { plnPrice: 433.41, plnMargin: 425.08, intranetId: 10383, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Tower 3m (bez wydruku)": { plnPrice: 394.47, plnMargin: 386.14, intranetId: 10563, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Tunel (bez wydruku)": { plnPrice: 738.21, plnMargin: 729.88, intranetId: 10380, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Twist (bez wydruku)": { plnPrice: 843.93, plnMargin: 835.6, intranetId: 10345, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Wave (bez wydruku)": { plnPrice: 936.24, plnMargin: 927.91, intranetId: 10343, category: "vario crazy", origin: "Chiny", noPrice: true },
  "adWall Vario Łukowa 240 Ø43 (bez wydruku) bez stóp": { plnPrice: 373.28, plnMargin: 364.95, intranetId: 10287, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Łukowa 240 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 467.08, plnMargin: 450.41, intranetId: 19472, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 240 Ø43 w torbie na kółkach jednostronne": { plnPrice: 703.71, plnMargin: 592.03, intranetId: 19534, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 300 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 506.05, plnMargin: 489.38, intranetId: 19473, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 400 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 541.64, plnMargin: 516.64, intranetId: 19474, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 400 Ø43 w torbie na kółkach dwustronne": { plnPrice: 891.99, plnMargin: 747.05, intranetId: 19537, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 400 Ø43 w torbie na kółkach jednostronne": { plnPrice: 891.99, plnMargin: 747.05, intranetId: 19538, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 500 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 585.49, plnMargin: 560.49, intranetId: 19476, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 500 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1065.92, plnMargin: 874.14, intranetId: 19541, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 500 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1065.92, plnMargin: 874.14, intranetId: 19542, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 600 Ø43 (bez wydruku)": { plnPrice: 603.04, plnMargin: 594.71, intranetId: 10601, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Łukowa 600 Ø43 (bez wydruku) bez stóp": { plnPrice: 361.99, plnMargin: 353.66, intranetId: 10291, category: "vario klasyczne ścianki", origin: "Chiny", noPrice: true },
  "adWall Vario Łukowa 600 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 613.83, plnMargin: 580.5, intranetId: 19477, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 600 Ø43 w torbie na kółkach dwustronne": { plnPrice: 1150.77, plnMargin: 938.53, intranetId: 19539, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa 600 Ø43 w torbie na kółkach jednostronne": { plnPrice: 1150.77, plnMargin: 938.53, intranetId: 19540, category: "vario klasyczne ścianki", origin: "NULL", noPrice: true },
  "adWall Vario Łukowa Light 400 (bez wydruku)": { plnPrice: 30, plnMargin: 0, intranetId: 11527, category: "vario light", origin: "3", noPrice: true },
  "adWall Vario Łukowa Light 500 (bez wydruku)": { plnPrice: 30, plnMargin: 0, intranetId: 11528, category: "vario light", origin: "4", noPrice: true },
  "adWall Vario Łukowa Light 600 (bez wydruku)": { plnPrice: 30, plnMargin: 0, intranetId: 11529, category: "vario light", origin: "3", noPrice: true },
  "AS Elipsa stoisko komplet": { plnPrice: 354.78, plnMargin: 344.78, intranetId: 13488, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "AS Elipsa trybunka komplet": { plnPrice: 331.99, plnMargin: 323.66, intranetId: 10252, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "AS ElipsaMINI stoisko komplet": { plnPrice: 288.5, plnMargin: 278.5, intranetId: 13489, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "AS ElipsaMINI trybunka komplet": { plnPrice: 265.7, plnMargin: 257.37, intranetId: 10253, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "AS Hit C stoisko komplet": { plnPrice: 398.97, plnMargin: 381.2, intranetId: 13490, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "AS Hit C trybunka komplet": { plnPrice: 318.43, plnMargin: 305.21, intranetId: 10357, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "AS Hit stoisko komplet": { plnPrice: 309.36, plnMargin: 299.36, intranetId: 13491, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "AS Hit trybunka komplet": { plnPrice: 282.78, plnMargin: 274.45, intranetId: 10254, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "AS HitMINI stoisko komplet": { plnPrice: 310.53, plnMargin: 282.76, intranetId: 13492, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "AS HitMINI trybunka komplet": { plnPrice: 300.61, plnMargin: 277.39, intranetId: 10255, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "AS Maszt Hit - do MO": { plnPrice: 11.09, plnMargin: 9.42, intranetId: 10163, category: "stoiska degustacyjne akcesoria", origin: "Chiny", noPrice: true },
  "AS Maszt Hit - do ZP": { plnPrice: 12.69, plnMargin: 6.8, intranetId: 17064, category: "stoiska degustacyjne akcesoria", origin: "Chiny", noPrice: true },
  "AS Maszt Standard - do MO": { plnPrice: 11.09, plnMargin: 9.42, intranetId: 17869, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "AS Maszt Standard - do ZP": { plnPrice: 12.69, plnMargin: 6.8, intranetId: 17883, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "AS Noga komplet": { plnPrice: 14.64, plnMargin: 12.97, intranetId: 10256, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "AS Ring stoisko komplet": { plnPrice: 329.2, plnMargin: 305.59, intranetId: 16562, category: "stoiska degustacyjne", origin: "Polska", noPrice: true },
  "Baner oczkowany / BANER 125": { plnPrice: 29.45, plnMargin: 6.82, intranetId: 12221, category: "media do druku", origin: "Polska", noPrice: true },
  "Blat CTF 455 x 455 (do CTF 50x50)": { plnPrice: 53.5, plnMargin: 53.5, intranetId: 19742, category: "półprodukty", origin: "NULL", noPrice: true },
  "Boliwia PP białe siedzisko": { plnPrice: 37.71, plnMargin: 36.04, intranetId: 18379, category: "modular", origin: "Polska", noPrice: true },
  "Boliwia PP czarne siedzisko": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18381, category: "modular", origin: "Polska", noPrice: true },
  "Bridge Connector for SEGO 3M": { plnPrice: 29.24, plnMargin: 12.57, intranetId: 18904, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "chip do drukarek": { plnPrice: 69.55, plnMargin: 4.55, intranetId: 19310, category: "modern", origin: "Polska", noPrice: true },
  "COMBO adFrame Starter 100x250 and adTribune Starter": { plnPrice: 669.41, plnMargin: 536.83, intranetId: 18638, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "CZ - adFrame Quick ver 2. narożnik metalowy": { plnPrice: 0, plnMargin: 0, intranetId: 19626, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adStand Premium CN maszt aluminiowy": { plnPrice: 0, plnMargin: 0, intranetId: 19697, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adTribune Big Quick LED zasilacz+kabel": { plnPrice: 0, plnMargin: 0, intranetId: 19359, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Big Quick/Big Quick LED blat (bez otworów)": { plnPrice: 0, plnMargin: 0, intranetId: 19356, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Big Quick/Big Quick LED stelaż": { plnPrice: 0, plnMargin: 0, intranetId: 19357, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Big Quick/Big Quick LED torba": { plnPrice: 0, plnMargin: 0, intranetId: 19358, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Expo 100x100 podpora pod półkę": { plnPrice: 0, plnMargin: 0, intranetId: 19809, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adTribune Expo 100x100 profil z zasilaczem": { plnPrice: 0, plnMargin: 0, intranetId: 19625, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adTribune Expo 150x100 kurtynka": { plnPrice: 0, plnMargin: 0, intranetId: 19354, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Expo 150x100 profil z zasilacze": { plnPrice: 0, plnMargin: 0, intranetId: 19813, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adTribune Expo 150x100 support": { plnPrice: 0, plnMargin: 0, intranetId: 19355, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Expo 150x100 torba": { plnPrice: 79.26, plnMargin: 79.26, intranetId: 19353, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Expo kabel zasilający": { plnPrice: 0, plnMargin: 0, intranetId: 19810, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adTribune Quick blat dolny": { plnPrice: 0, plnMargin: 0, intranetId: 19312, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Quick blat górny": { plnPrice: 0, plnMargin: 0, intranetId: 19311, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Quick stelaż": { plnPrice: 0, plnMargin: 0, intranetId: 19313, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adTribune Quick torba": { plnPrice: 0, plnMargin: 0, intranetId: 19314, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adVideo Stand 32` (wersja biała) podstawa z baterią": { plnPrice: 0, plnMargin: 0, intranetId: 19627, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adVideo Stand 32` (wersja biała) słupek": { plnPrice: 0, plnMargin: 0, intranetId: 19815, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adVideo Stand 32` (wersja różowa) podstawa z baterią": { plnPrice: 0, plnMargin: 0, intranetId: 19814, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adWall Vario Light 600 Prosta/Łukowa torba": { plnPrice: 101.76, plnMargin: 100.09, intranetId: 19755, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adWall Vario Presto Light torba": { plnPrice: 21.69, plnMargin: 20.02, intranetId: 19158, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adWall Vario Presto Light łącznik T": { plnPrice: 12.88, plnMargin: 11.21, intranetId: 19156, category: "części zamienne", origin: "Polska", noPrice: true },
  "CZ - adWall Vario Prosta/Łukowa Light stopa (mocowanie przy krawędzi)": { plnPrice: 0, plnMargin: 0, intranetId: 19840, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adWall Vario Prosta/Łukowa Light łuk": { plnPrice: 0, plnMargin: 0, intranetId: 19846, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adWall Vario Prosta/Łukowa Light łącznik T": { plnPrice: 0, plnMargin: 0, intranetId: 19845, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - adWall Vario Prosta/Łukowa Ø43 stopa": { plnPrice: 0, plnMargin: 0, intranetId: 19812, category: "części zamienne", origin: "NULL", noPrice: true },
  "CZ - zaślepka do blatów chińskich": { plnPrice: 0, plnMargin: 0, intranetId: 19628, category: "części zamienne", origin: "NULL", noPrice: true },
  "Czyściwo": { plnPrice: 3.8, plnMargin: 0.25, intranetId: 12363, category: "modern", origin: "Polska", noPrice: true },
  "DELEGACJA akcesoria [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19580, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA dodatkowe rzeczy klienta [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19583, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA dojazd [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19572, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA ekrany [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19578, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA elektryka [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19579, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA konstrukcja dodatkowa [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19577, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA konstrukcja główna [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19576, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA odbiór stoiska [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19586, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA pakowanie i załadunek [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19585, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA podwieszenie [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19575, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA podłoga [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19574, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA rozładunek [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19573, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA sprzątanie i zabezpieczenie stoiska [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19584, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA wydruki [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19581, category: "usługi montażu", origin: "NULL", noPrice: true },
  "DELEGACJA wyposażenie stoiska [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19582, category: "usługi montażu", origin: "NULL", noPrice: true },
  "Display wall 4x3m (bez wydruku)": { plnPrice: 1858.89, plnMargin: 1821.49, intranetId: 18356, category: "namioty", origin: "Polska", noPrice: true },
  "Dodatkowa noga/TPU do Air Tent Premium 4x4 zawór bezpieczeństwa na dole": { plnPrice: 245.3, plnMargin: 236.97, intranetId: 19674, category: "namioty akcesoria", origin: "NULL", noPrice: true },
  "Dodatkowa noga/TPU do Air Tent Premium 8x8": { plnPrice: 577.83, plnMargin: 569.5, intranetId: 18283, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "Elypse konstrukcja pomalowana": { plnPrice: 174.65, plnMargin: 148.44, intranetId: 16326, category: "półprodukty", origin: "Polska", noPrice: true },
  "Elypse konstrukcja uzbrojona": { plnPrice: 440.412, plnMargin: 157.29, intranetId: 10150, category: "półprodukty", origin: "Polska", noPrice: true },
  "ELYPSE MINI komplet blat+półka CN": { plnPrice: 84.26, plnMargin: 77.59, intranetId: 18621, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "Elypse Mini konstrukcja pomalowana": { plnPrice: 161.81, plnMargin: 135.6, intranetId: 16332, category: "półprodukty", origin: "Polska", noPrice: true },
  "Elypse Mini konstrukcja uzbrojona": { plnPrice: 404.46, plnMargin: 144.45, intranetId: 10151, category: "półprodukty", origin: "Polska", noPrice: true },
  "Elypse Mini konstrukcja uzbrojona CN": { plnPrice: 127.58, plnMargin: 127.58, intranetId: 18595, category: "półprodukty", origin: "Polska", noPrice: true },
  "Etykiety termiczne białe 100x150 mm 500 szt.": { plnPrice: 9.96, plnMargin: 0.9, intranetId: 19147, category: "inne", origin: "Polska", noPrice: true },
  "Etykiety termiczne białe 100x60 mm 500 szt.": { plnPrice: 9.36, plnMargin: 0.86, intranetId: 19009, category: "inne", origin: "Polska", noPrice: true },
  "etykiety żółte 100x60mm": { plnPrice: 75.9, plnMargin: 6.9, intranetId: 18777, category: "inne", origin: "Polska", noPrice: true },
  "FLUSHING LIQUID 03 10L": { plnPrice: 0, plnMargin: 0, intranetId: 19367, category: "modern", origin: "Polska", noPrice: true },
  "FLUSHING LIQUID 03 2L": { plnPrice: 0, plnMargin: 0, intranetId: 15873, category: "modern", origin: "Polska", noPrice: true },
  "Foldable 300x250": { plnPrice: 728.79, plnMargin: 646.46, intranetId: 19857, category: "zabudowy foldable", origin: "NULL", noPrice: true },
  "Foldable łącznik profili czesc zamienna": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17496, category: "frames light", origin: "???", noPrice: true },
  "folia bąbelkowa B1 120cm": { plnPrice: 53.9, plnMargin: 4.9, intranetId: 12351, category: "frames", origin: "Polska", noPrice: true },
  "Folia montażowa ORABOND 4040D-00 szer.105cm": { plnPrice: 15.17, plnMargin: 15.17, intranetId: 17286, category: "media do druku", origin: "Polska", noPrice: true },
  "folia PCV 0,2mm transparentna": { plnPrice: 19.8, plnMargin: 19.8, intranetId: 13911, category: "media do druku", origin: "Polska", noPrice: true },
  "folia stretch 23/500/1,5kg czarna": { plnPrice: 12.73, plnMargin: 0.83, intranetId: 12370, category: "półprodukty", origin: "Polska", noPrice: true },
  "folia stretch 23/500/1,7kg transparentna": { plnPrice: 17.6, plnMargin: 1.15, intranetId: 12369, category: "półprodukty", origin: "Polska", noPrice: true },
  "folia stretch maszynowa STANDARD": { plnPrice: 175.48, plnMargin: 11.48, intranetId: 15071, category: "półprodukty", origin: "Polska", noPrice: true },
  "folia stretch mini-rolki 10cm/150m transparentna": { plnPrice: 13.91, plnMargin: 0.91, intranetId: 19770, category: "półprodukty", origin: "NULL", noPrice: true },
  "Formatka PCV 4mm 100x100cm": { plnPrice: 18.27, plnMargin: 18.27, intranetId: 11936, category: "półprodukty", origin: "Polska", noPrice: true },
  "Formatka PCV 4mm 110x30cm": { plnPrice: 15.17, plnMargin: 13.5, intranetId: 11912, category: "półprodukty", origin: "Polska", noPrice: true },
  "Formatka PCV 4mm 60x30cm": { plnPrice: 9.59, plnMargin: 7.92, intranetId: 11923, category: "półprodukty", origin: "Polska", noPrice: true },
  "Formatka PCV 4mm 90x30cm": { plnPrice: 13.5, plnMargin: 11.83, intranetId: 11922, category: "półprodukty", origin: "Polska", noPrice: true },
  "Formatka PCV 4mm BOK": { plnPrice: 10.77, plnMargin: 10.77, intranetId: 11935, category: "półprodukty", origin: "Polska", noPrice: true },
  "Formatka PCV 4mm FRONT": { plnPrice: 20.33, plnMargin: 20.33, intranetId: 11934, category: "półprodukty", origin: "Polska", noPrice: true },
  "Formatka PCV 4mm ∅35cm (okrągły)": { plnPrice: 12.19, plnMargin: 12.19, intranetId: 11924, category: "półprodukty", origin: "Polska", noPrice: true },
  "Fotel Alaska 2 biały-chrom": { plnPrice: 504.11, plnMargin: 487.44, intranetId: 11719, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Fotel Alaska 2 biały-chrom bez stopek": { plnPrice: 0, plnMargin: 0, intranetId: 17495, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Fotel Alaska 2 czarny-chrom": { plnPrice: 504.11, plnMargin: 487.44, intranetId: 11720, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Fotel Alaska czarny-chrom": { plnPrice: 508.17, plnMargin: 491.5, intranetId: 11123, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Granulat styropianowy": { plnPrice: 55, plnMargin: 55, intranetId: 11806, category: "modern", origin: "Polska", noPrice: true },
  "GREENFIELDS/BETAFENCE - paleta 1": { plnPrice: 0, plnMargin: 0, intranetId: 19553, category: "modular", origin: "NULL", noPrice: true },
  "Guma do standarda": { plnPrice: 0, plnMargin: 0, intranetId: 17611, category: "modern", origin: "Polska", noPrice: true },
  "Gumosznurek 4mm": { plnPrice: 0.88, plnMargin: 0.08, intranetId: 12361, category: "usunięte", origin: "Polska", noPrice: true },
  "GVE zasilacz 95W SEGO": { plnPrice: 79.3, plnMargin: 77.63, intranetId: 13535, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "GYEON_adTent Air premium 6x6": { plnPrice: 34.4, plnMargin: 1.07, intranetId: 17755, category: "inne", origin: "Polska", noPrice: true },
  "HDWR-adBoard LED 85x120 (bez wydruku)": { plnPrice: 510.23, plnMargin: 490.23, intranetId: 19423, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adBox Easy (bez wydruku)": { plnPrice: 143.82, plnMargin: 127.15, intranetId: 19430, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFolder Prestige 4 komory (bez wydruku)": { plnPrice: 282.73, plnMargin: 274.4, intranetId: 19384, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame LPO 100x100 (bez wydruku)": { plnPrice: 340.95, plnMargin: 332.62, intranetId: 19402, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame LPO 100x200 (bez wydruku)": { plnPrice: 491.11, plnMargin: 482.78, intranetId: 19403, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame LPO 100x293 (bez wydruku)": { plnPrice: 741.17, plnMargin: 732.84, intranetId: 19404, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Lumina RGB 100x200cm (bez wydruku)": { plnPrice: 1890.4, plnMargin: 1880.4, intranetId: 19390, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Lumina RGB 100x250 cm (bez wydruku)": { plnPrice: 2046.52, plnMargin: 2029.85, intranetId: 19391, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Poster 100x100 (bez wydruku)": { plnPrice: 248.32, plnMargin: 239.99, intranetId: 19396, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Poster 100x150 (bez wydruku)": { plnPrice: 310.77, plnMargin: 302.44, intranetId: 19397, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Poster 100x200 (bez wydruku)": { plnPrice: 355.57, plnMargin: 347.24, intranetId: 19398, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Poster 100x250 (bez wydruku)": { plnPrice: 437.14, plnMargin: 428.81, intranetId: 19399, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Poster 100x300 (bez wydruku)": { plnPrice: 492.07, plnMargin: 483.74, intranetId: 19400, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Poster 70x100 (bez wydruku)": { plnPrice: 224.05, plnMargin: 215.72, intranetId: 19401, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Poster hanger set": { plnPrice: 38.1, plnMargin: 36.43, intranetId: 19394, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "HDWR-adFrame Quick 85x200 ver 2.0 w torbie na kółkach (bez wydruku)": { plnPrice: 425.21, plnMargin: 418.54, intranetId: 19392, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Slim 100x200 NO LED - 65mm (bez wydruku)": { plnPrice: 178.03, plnMargin: 171.36, intranetId: 19405, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adFrame Slim 100x250 - 65mm (bez wydruku)": { plnPrice: 341.59, plnMargin: 334.92, intranetId: 19407, category: "hardware", origin: "NULL", noPrice: true },
  "HDWR-Adstand Drop - 120 (bez wydruku)": { plnPrice: 124.23, plnMargin: 109.11, intranetId: 19371, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-Adstand Drop - 85 (bez wydruku)": { plnPrice: 95.38, plnMargin: 84.49, intranetId: 19369, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adStand Eco 85 (bez wydruku)": { plnPrice: 53.23, plnMargin: 48.23, intranetId: 19375, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adStand Lux 120 (bez wydruku)": { plnPrice: 72.6, plnMargin: 67.6, intranetId: 19373, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adStand Lux 85 (bez wydruku)": { plnPrice: 125.2, plnMargin: 116.87, intranetId: 19374, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adStand Octa 85 (bez wydruku)": { plnPrice: 90.7, plnMargin: 83.19, intranetId: 19377, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTent EXPRESS 3x3m (bez wydruku)": { plnPrice: 321.81, plnMargin: 316.81, intranetId: 19418, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTent EXPRESS PRO 3x3m (bez wydruku)": { plnPrice: 681.81, plnMargin: 651.81, intranetId: 19421, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTent EXPRESS PRO 3x6m (bez wydruku)": { plnPrice: 1219.68, plnMargin: 1189.68, intranetId: 19422, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTent V 4x4 (bez wydruku)": { plnPrice: 2336.15, plnMargin: 2224.48, intranetId: 19386, category: "namioty", origin: "Polska", noPrice: true },
  "HDWR-adTent V 5x5 (bez wydruku)": { plnPrice: 2805.98, plnMargin: 2694.31, intranetId: 19387, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTent V 6x6 (bez wydruku)": { plnPrice: 3408.24, plnMargin: 3294.91, intranetId: 19388, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTribune Lumina RGB (bez wydruku)": { plnPrice: 1345.8, plnMargin: 1329.13, intranetId: 19389, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTribune Oval (bez wydruku)": { plnPrice: 263.28, plnMargin: 258.28, intranetId: 19395, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTribune Oval Maxi (bez wydruku)": { plnPrice: 373.71, plnMargin: 368.71, intranetId: 19393, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adTribune PVC Round (bez wydruku)": { plnPrice: 152.53, plnMargin: 135.86, intranetId: 19288, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adWall Vario Prosta Black 300 (bez wydruku)": { plnPrice: 124.77, plnMargin: 108.1, intranetId: 19277, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adWall Vario Prosta Black 400 (bez wydruku)": { plnPrice: 148.78, plnMargin: 132.11, intranetId: 19278, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adWall Vario Prosta Black 500 (bez wydruku)": { plnPrice: 168.8, plnMargin: 152.13, intranetId: 19279, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-adWall Vario Prosta Black 600 (bez wydruku)": { plnPrice: 180.81, plnMargin: 164.14, intranetId: 19280, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-X-banner 100x200 (bez wydruku)": { plnPrice: 23.74, plnMargin: 15.41, intranetId: 19285, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-X-banner 60x160 (bez wydruku)": { plnPrice: 16.26, plnMargin: 7.93, intranetId: 19283, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-X-banner PRO 100x200 (bez wydruku)": { plnPrice: 34.51, plnMargin: 26.18, intranetId: 19286, category: "hardware", origin: "Polska", noPrice: true },
  "HDWR-X-banner PRO 60x160 (bez wydruku)": { plnPrice: 23.59, plnMargin: 15.26, intranetId: 19284, category: "hardware", origin: "Polska", noPrice: true },
  "HIT C komplet blat+półka CN": { plnPrice: 176.76, plnMargin: 170.09, intranetId: 18620, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "Hit C Konstrukcja pomalowana": { plnPrice: 0, plnMargin: 0, intranetId: 17243, category: "półprodukty", origin: "Polska", noPrice: true },
  "Hit C Konstrukcja uzbrojona": { plnPrice: 119.84, plnMargin: 119.84, intranetId: 10358, category: "półprodukty", origin: "Polska", noPrice: true },
  "Hit C Konstrukcja uzbrojona CN": { plnPrice: 107.45, plnMargin: 107.45, intranetId: 18596, category: "półprodukty", origin: "Polska", noPrice: true },
  "HIT komplet blat+półka CN": { plnPrice: 128.14, plnMargin: 121.47, intranetId: 18623, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "Hit Konstrukcja uzbrojona CN": { plnPrice: 104.57, plnMargin: 104.57, intranetId: 18597, category: "półprodukty", origin: "Polska", noPrice: true },
  "HIT MINI komplet blat+półka CN": { plnPrice: 84.26, plnMargin: 77.59, intranetId: 18624, category: "stoiska degustacyjne akcesoria", origin: "Polska", noPrice: true },
  "Hit MINI Konstrukcja uzbrojona CN": { plnPrice: 105.47, plnMargin: 105.47, intranetId: 18598, category: "półprodukty", origin: "Polska", noPrice: true },
  "HitMINI Konstrukcja pomalowana": { plnPrice: 127.25, plnMargin: 106.87, intranetId: 16330, category: "półprodukty", origin: "Polska", noPrice: true },
  "HitMINI Konstrukcja uzbrojona": { plnPrice: 133.75, plnMargin: 133.75, intranetId: 10152, category: "półprodukty", origin: "Polska", noPrice: true },
  "Hoker Cortina czarny": { plnPrice: 0, plnMargin: 0, intranetId: 19698, category: "zabudowy smart", origin: "NULL", noPrice: true },
  "IPAD-03": { plnPrice: 0, plnMargin: 0, intranetId: 11670, category: "stojaki reklamowe", origin: "Polska", noPrice: true },
  "IPAD-06": { plnPrice: 0, plnMargin: 0, intranetId: 11671, category: "stojaki reklamowe", origin: "Polska", noPrice: true },
  "Kabel biały do SEGO [m]": { plnPrice: 0, plnMargin: 0, intranetId: 18491, category: "vario akcesoria", origin: "Polska", noPrice: true },
  "Kabel trójnik adFrame Quick": { plnPrice: 20.02, plnMargin: 20.02, intranetId: 16459, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel wymienny adFrame Quick": { plnPrice: 13.69, plnMargin: 12.02, intranetId: 12456, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel wymienny adFrame Quick UK": { plnPrice: 13.14, plnMargin: 11.47, intranetId: 17262, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel zasilający bez uziemienia": { plnPrice: 23.96, plnMargin: 23.96, intranetId: 17490, category: "półprodukty", origin: "Polska", noPrice: true },
  "Kabel zasilający do zasilacza (AC 3PIN) 3m": { plnPrice: 17.82, plnMargin: 17.82, intranetId: 13683, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel zasilający do zasilacza (AC 3PIN) 5m": { plnPrice: 16.96, plnMargin: 15.29, intranetId: 17782, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel zasilający do zasilacza (AC 3PIN) SZWAJCARIA": { plnPrice: 0, plnMargin: 0, intranetId: 17427, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel zasilający do zasilacza (AC 3PIN) USA": { plnPrice: 26.07, plnMargin: 26.07, intranetId: 15888, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel zasilający do zasilacza lampki Multiframe/Vario LED (ósemkowy)": { plnPrice: 2.81, plnMargin: 2.81, intranetId: 17276, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Kabel zasilający z uziemieniem": { plnPrice: 23.65, plnMargin: 23.65, intranetId: 19549, category: "półprodukty", origin: "NULL", noPrice: true },
  "Karabińczyk z nakrętką DIN5299": { plnPrice: 1.89, plnMargin: 1.89, intranetId: 18926, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "Karton - Air Column 60x60x20": { plnPrice: 9.12, plnMargin: 9.12, intranetId: 13485, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - EXPO 100x100": { plnPrice: 8.19, plnMargin: 0.74, intranetId: 17809, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - Hit/MiniHit/MiniElipsa/Ring": { plnPrice: 9.51, plnMargin: 9.51, intranetId: 11351, category: "trybunki reklamowe akcesoria", origin: "Polska", noPrice: true },
  "Karton - Kostka1": { plnPrice: 7.51, plnMargin: 0.68, intranetId: 11796, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Karton - Kostka1/2": { plnPrice: 6.17, plnMargin: 0.57, intranetId: 17654, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Karton - Kostka2": { plnPrice: 9.32, plnMargin: 0.84, intranetId: 11797, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - Leżak 1 szt": { plnPrice: 10.4, plnMargin: 10.4, intranetId: 16591, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Karton - Leżak 5 szt": { plnPrice: 10.09, plnMargin: 10.09, intranetId: 15580, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Karton - Rollup 100": { plnPrice: 7.81, plnMargin: 0.71, intranetId: 14249, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - Standard / SEG": { plnPrice: 9.94, plnMargin: 9.94, intranetId: 12239, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - topper 110x30cm": { plnPrice: 5.32, plnMargin: 3.65, intranetId: 17331, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - topper 90x30cm": { plnPrice: 5.31, plnMargin: 3.64, intranetId: 16736, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - Wydruki Vario 30x30x15": { plnPrice: 3.76, plnMargin: 0.34, intranetId: 11799, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton - Wydruki Vario 30x30x30": { plnPrice: 4.03, plnMargin: 0.37, intranetId: 11800, category: "vario akcesoria", origin: "Polska", noPrice: true },
  "Karton 113/33/22 - kaseton profil max.100cm 3K": { plnPrice: 18.18, plnMargin: 13.18, intranetId: 12203, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton 143/44/22 - kaseton profil max.130cm 4K": { plnPrice: 37.51, plnMargin: 16.19, intranetId: 12206, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton 163/33/22 - kaseton profil max.150cm 3K": { plnPrice: 21.23, plnMargin: 16.23, intranetId: 12207, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton 210/33/22 - kaseton profil max.200cm 3K": { plnPrice: 24.67, plnMargin: 19.67, intranetId: 16171, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton Adstand 120/STFL - 125x9,5x26,5cm": { plnPrice: 6.2, plnMargin: 0.57, intranetId: 11354, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton Adstand 150/STFL - 155x9,5x26,5cm": { plnPrice: 7.47, plnMargin: 0.68, intranetId: 11355, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton Adstand 85/STFL - 90x9,5x26,5cm": { plnPrice: 4.6, plnMargin: 0.42, intranetId: 11352, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton DTF/STF/LMSM - 110x16x16cm": { plnPrice: 0, plnMargin: 0, intranetId: 14835, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton DTF/STF/LMSM - 110x16x16cm gruby": { plnPrice: 17.86, plnMargin: 12.86, intranetId: 16210, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton DTF/STF/LMSM - 110x16x26cm": { plnPrice: 23.17, plnMargin: 18.17, intranetId: 14836, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton DTF/STF/LMSM - 135x16x16cm": { plnPrice: 15.59, plnMargin: 10.59, intranetId: 14837, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton DTF/STF/LMSM - 135x16x26cm": { plnPrice: 20.51, plnMargin: 15.51, intranetId: 14838, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton DTF/STF/LMSM - 160x16x16cm": { plnPrice: 25.28, plnMargin: 20.28, intranetId: 14839, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton DTF/STF/LMSM - 160x16x26cm": { plnPrice: 24.56, plnMargin: 19.56, intranetId: 14840, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton LMD/LMS - 160x16x33cm": { plnPrice: 36.19, plnMargin: 31.19, intranetId: 14843, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton Multiframe do paneli LCD": { plnPrice: 4.38, plnMargin: 0.29, intranetId: 13421, category: "półprodukty", origin: "Polska", noPrice: true },
  "Karton – Wydruk Smart dwustr. zamykany": { plnPrice: 9.36, plnMargin: 0.86, intranetId: 13483, category: "półprodukty", origin: "Polska", noPrice: true },
  "Kaseta085 adStand Premium pomalowana": { plnPrice: 177.98, plnMargin: 171.21, intranetId: 16334, category: "rollupy", origin: "Polska", noPrice: true },
  "Kaseta085 adStand Premium uzbrojona": { plnPrice: 171.2, plnMargin: 171.2, intranetId: 10145, category: "rollupy", origin: "Polska", noPrice: true },
  "Kaseta100 adStand Premium pomalowana": { plnPrice: 196.17, plnMargin: 189.4, intranetId: 16281, category: "rollupy", origin: "Polska", noPrice: true },
  "Kaseta100 adStand Premium uzbrojona": { plnPrice: 189.39, plnMargin: 189.39, intranetId: 10146, category: "rollupy", origin: "Polska", noPrice: true },
  "Kaseta120 adStand Premium pomalowana": { plnPrice: 219.71, plnMargin: 212.94, intranetId: 16395, category: "rollupy", origin: "Polska", noPrice: true },
  "Kaseta120 adStand Premium uzbrojona": { plnPrice: 212.93, plnMargin: 212.93, intranetId: 10147, category: "rollupy", origin: "Polska", noPrice: true },
  "Kaseta150 adStand Premium uzbrojona": { plnPrice: 268.57, plnMargin: 268.57, intranetId: 10148, category: "rollupy", origin: "Polska", noPrice: true },
  "Keder 9x3mm - Multiframe": { plnPrice: 30, plnMargin: 0, intranetId: 11814, category: "modern", origin: "3", noPrice: true },
  "Keder płaski pcv biały 14x3": { plnPrice: 2.156, plnMargin: 0.77, intranetId: 12356, category: "modern", origin: "Polska", noPrice: true },
  "Kijek do parawanu 100cm": { plnPrice: 2.42, plnMargin: 2.42, intranetId: 13941, category: "tekstylia użytkowe", origin: "Polska", noPrice: true },
  "klucz imbus 8mm": { plnPrice: 0.83, plnMargin: 0.06, intranetId: 17384, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "Komandorki podwójne, białe": { plnPrice: 0.34, plnMargin: 0.02, intranetId: 12373, category: "półprodukty", origin: "Polska", noPrice: true },
  "kostka WAGO x2": { plnPrice: 109.56, plnMargin: 9.97, intranetId: 19551, category: "ramy tekstylne akcesoria", origin: "NULL", noPrice: true },
  "kostka WAGO x3": { plnPrice: 67.38, plnMargin: 4.41, intranetId: 19530, category: "ramy tekstylne akcesoria", origin: "NULL", noPrice: true },
  "kostka WAGO x5": { plnPrice: 60.5, plnMargin: 5.5, intranetId: 19728, category: "ramy tekstylne akcesoria", origin: "NULL", noPrice: true },
  "końcówka tulejkowa izolowana 0.75mm2": { plnPrice: 0.04, plnMargin: 0, intranetId: 15885, category: "frames", origin: "Polska", noPrice: true },
  "końcówka tulejkowa izolowana 1.5mm2": { plnPrice: 0.04, plnMargin: 0, intranetId: 18250, category: "frames", origin: "Polska", noPrice: true },
  "końcówka tulejkowa izolowana 1mm2": { plnPrice: 0.05, plnMargin: 0, intranetId: 18249, category: "frames", origin: "Polska", noPrice: true },
  "końcówka tulejkowa izolowana podwójna": { plnPrice: 0.1, plnMargin: 0.01, intranetId: 17880, category: "frames", origin: "Polska", noPrice: true },
  "Krzesło Altea białe siedzisko bez poduszki": { plnPrice: 0, plnMargin: 0, intranetId: 17411, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Krzesło Arona biurowe białe siedzisko": { plnPrice: 177.99, plnMargin: 164.66, intranetId: 14878, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Krzesło Arona biurowe czarne siedzisko": { plnPrice: 177.99, plnMargin: 164.66, intranetId: 14879, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Krzesło Boliwia PP różowe siedzisko": { plnPrice: 36.04, plnMargin: 36.04, intranetId: 16502, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Krzesło Boliwia PP siedzisko mix kolorów": { plnPrice: 91.64, plnMargin: 78.31, intranetId: 14805, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Krzesło Monaco czarne": { plnPrice: 0, plnMargin: 0, intranetId: 15365, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "kółka do wózków Mframe": { plnPrice: 16.42, plnMargin: 14.75, intranetId: 17474, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "Kątownik tekturowy 60x60x2000mm": { plnPrice: 0, plnMargin: 0, intranetId: 16870, category: "półprodukty", origin: "Polska", noPrice: true },
  "Laminat ATP Guard, przycięty do 914mm": { plnPrice: 10.57, plnMargin: 10.57, intranetId: 12386, category: "media do druku", origin: "Polska", noPrice: true },
  "Laminat ORACAL 3164BŁYSK szer.105cm": { plnPrice: 7.1, plnMargin: 7.1, intranetId: 14853, category: "media do druku", origin: "Polska", noPrice: true },
  "Laminat ORACAL 3164BŁYSK szer.160cm": { plnPrice: 0, plnMargin: 0, intranetId: 16665, category: "media do druku", origin: "Polska", noPrice: true },
  "Laminat ORACAL 3164MAT szer.105cm": { plnPrice: 6.57, plnMargin: 6.57, intranetId: 14850, category: "media do druku", origin: "Polska", noPrice: true },
  "Laminat ORACAL 3164MAT szer.137cm": { plnPrice: 6.97, plnMargin: 6.97, intranetId: 14851, category: "media do druku", origin: "Polska", noPrice: true },
  "Laminat ORACAL 3164MAT szer.160cm": { plnPrice: 11.26, plnMargin: 11.26, intranetId: 14852, category: "media do druku", origin: "Polska", noPrice: true },
  "Laminat ORACAL 640MAT szer.100cm": { plnPrice: 5.9, plnMargin: 5.9, intranetId: 12389, category: "media do druku", origin: "Polska", noPrice: true },
  "Lampka LED 116 czarna SET Mframe": { plnPrice: 0, plnMargin: 0, intranetId: 19870, category: "vario akcesoria", origin: "NULL", noPrice: true },
  "Leżak - stelaż (z plastikami)": { plnPrice: 60.25, plnMargin: 51.92, intranetId: 18561, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Leżak - stelaż klejony": { plnPrice: 59.64, plnMargin: 52.97, intranetId: 19068, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Leżak Bora beżowy": { plnPrice: 77.34, plnMargin: 54.86, intranetId: 13755, category: "leżaki reklamowe", origin: "Polska", noPrice: true },
  "Leżak śruba do stelaża": { plnPrice: 0.01, plnMargin: 0.01, intranetId: 15770, category: "outdoor", origin: "Polska", noPrice: true },
  "Lightbox 100x200 - 65mm (bez wydruku)": { plnPrice: 374.98, plnMargin: 358.31, intranetId: 17930, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Linka stalowa ∅4mm": { plnPrice: 1.49, plnMargin: 1.49, intranetId: 11877, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "Listwa adStand 85 pomalowana": { plnPrice: 13.74, plnMargin: 13.19, intranetId: 11418, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L surowa": { plnPrice: 11.61, plnMargin: 9.94, intranetId: 13512, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L100 D pomalowana": { plnPrice: 16.95, plnMargin: 16.35, intranetId: 11414, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L100 D surowa do malowania": { plnPrice: 9.86, plnMargin: 9.86, intranetId: 17797, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L100 G / Adstand 100 pomalowana": { plnPrice: 16.52, plnMargin: 15.92, intranetId: 11410, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L100 G / Adstand 100 surowa": { plnPrice: 13.27, plnMargin: 9.94, intranetId: 17812, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L100 G / Adstand 100 surowa do malowania": { plnPrice: 9.44, plnMargin: 9.44, intranetId: 17798, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L120 D pomalowana": { plnPrice: 20.04, plnMargin: 19.38, intranetId: 11415, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L120 D surowa do malowania": { plnPrice: 11.32, plnMargin: 11.32, intranetId: 17799, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L120 G / Adstand 120 pomalowana": { plnPrice: 19.75, plnMargin: 19.09, intranetId: 11411, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L120 G / Adstand 120 surowa": { plnPrice: 15.61, plnMargin: 11.94, intranetId: 17813, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L120 G / Adstand 120 surowa do malowania": { plnPrice: 11.32, plnMargin: 11.32, intranetId: 17800, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L150 D pomalowana": { plnPrice: 23.44, plnMargin: 22.68, intranetId: 11416, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L150 D surowa": { plnPrice: 24.6, plnMargin: 14.96, intranetId: 17817, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L150 D surowa do malowania": { plnPrice: 14.15, plnMargin: 14.15, intranetId: 17801, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L150 G / Adstand 150 surowa": { plnPrice: 20.75, plnMargin: 14.92, intranetId: 17815, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L150 G / Adstand 150 surowa do malowania": { plnPrice: 14.15, plnMargin: 14.15, intranetId: 17816, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L200 D surowa": { plnPrice: 30.41, plnMargin: 19.94, intranetId: 17818, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L200 D surowa do malowania": { plnPrice: 18.88, plnMargin: 18.88, intranetId: 17802, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L200 G pomalowana": { plnPrice: 30.57, plnMargin: 29.65, intranetId: 11413, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L200 G surowa": { plnPrice: 26.55, plnMargin: 19.88, intranetId: 17819, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L200 G surowa do malowania": { plnPrice: 18.86, plnMargin: 18.86, intranetId: 17803, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L60 D pomalowana": { plnPrice: 10.87, plnMargin: 10.4, intranetId: 11808, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L60 D surowa": { plnPrice: 10.56, plnMargin: 5.99, intranetId: 17821, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L60 D surowa do malowania": { plnPrice: 5.66, plnMargin: 5.66, intranetId: 17804, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L60 G pomalowana": { plnPrice: 10.47, plnMargin: 10, intranetId: 11807, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L60 G surowa": { plnPrice: 8.63, plnMargin: 5.96, intranetId: 17820, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L60 G surowa do malowania": { plnPrice: 5.66, plnMargin: 5.66, intranetId: 17805, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L80 D pomalowana": { plnPrice: 10.5, plnMargin: 9.96, intranetId: 11408, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L80 D surowa": { plnPrice: 12.88, plnMargin: 7.97, intranetId: 17823, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L80 D surowa do malowania": { plnPrice: 7.55, plnMargin: 7.55, intranetId: 17806, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L80 G pomalowana": { plnPrice: 13.28, plnMargin: 12.74, intranetId: 11407, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L80 G surowa": { plnPrice: 11.21, plnMargin: 7.97, intranetId: 17822, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Listwa L80 G surowa do malowania": { plnPrice: 7.55, plnMargin: 7.55, intranetId: 17807, category: "rollupy akcesoria", origin: "Polska", noPrice: true },
  "Luminous LED COB RGB LED STRIPS, 24V,8MM": { plnPrice: 18.89, plnMargin: 17.22, intranetId: 18449, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "Luminous LED COB złączka do zasilania": { plnPrice: 3.75, plnMargin: 2.08, intranetId: 18642, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "Luminous LED COB łącznik 180": { plnPrice: 3.07, plnMargin: 1.4, intranetId: 18641, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "Luminous LED COB łącznik 90": { plnPrice: 4.3, plnMargin: 2.63, intranetId: 18644, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "Luminous zamek": { plnPrice: 2.4, plnMargin: 2.4, intranetId: 18580, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "Markiza konstrukcja Air Tent Premium 5x5": { plnPrice: 680.59, plnMargin: 680.59, intranetId: 13568, category: "namioty", origin: "Polska", noPrice: true },
  "Maszt Aluminiowy - Adstand": { plnPrice: 12.12, plnMargin: 12.12, intranetId: 44, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Medium adFlag 260cm": { plnPrice: 14.42, plnMargin: 8.92, intranetId: 16283, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Banner 110": { plnPrice: 26.68, plnMargin: 21.18, intranetId: 10813, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Banner 160": { plnPrice: 36.19, plnMargin: 30.69, intranetId: 10875, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Banner 90": { plnPrice: 22.83, plnMargin: 17.33, intranetId: 10873, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Banner Econo 130cm": { plnPrice: 12.26, plnMargin: 6.76, intranetId: 10892, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Big Quick LED": { plnPrice: 47.8, plnMargin: 42.3, intranetId: 11788, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Blockout - Kaseton (PLECY NIE DO DRUKU)": { plnPrice: 18.17, plnMargin: 18.17, intranetId: 11113, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium do leżaków barwione beżowy": { plnPrice: 12.03, plnMargin: 6.53, intranetId: 13759, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium do leżaków barwione szary": { plnPrice: 12.03, plnMargin: 6.53, intranetId: 13802, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium ECO-SOL Shell 2w1": { plnPrice: 35.15, plnMargin: 26.32, intranetId: 14856, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium ECO-SOL Smart": { plnPrice: 40.11, plnMargin: 31.28, intranetId: 10815, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Folia 105": { plnPrice: 21.07, plnMargin: 12.24, intranetId: 10871, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Folia 105 połysk": { plnPrice: 0, plnMargin: 0, intranetId: 19803, category: "media do druku", origin: "NULL", noPrice: true },
  "Medium Folia 137": { plnPrice: 24.08, plnMargin: 15.25, intranetId: 10876, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Folia 160": { plnPrice: 28.23, plnMargin: 19.4, intranetId: 10872, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Kocyk 420": { plnPrice: 33.22, plnMargin: 27.72, intranetId: 15723, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Rollup 110": { plnPrice: 18.25, plnMargin: 9.42, intranetId: 15759, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Rollup 127": { plnPrice: 20.07, plnMargin: 11.24, intranetId: 15820, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Rollup 152": { plnPrice: 22.24, plnMargin: 13.41, intranetId: 15821, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Rollup 91,4": { plnPrice: 17.06, plnMargin: 8.23, intranetId: 14855, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Ręcznik": { plnPrice: 51.64, plnMargin: 46.14, intranetId: 15545, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium summer do leżaków": { plnPrice: 23.89, plnMargin: 18.39, intranetId: 12651, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Tex Blockout 320cm": { plnPrice: 41.95, plnMargin: 36.45, intranetId: 16112, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Tex Kaseton LED 220 CN": { plnPrice: 14.3, plnMargin: 8.8, intranetId: 19823, category: "media do druku", origin: "NULL", noPrice: true },
  "Medium Tex Kaseton LED 320": { plnPrice: 33.16, plnMargin: 27.66, intranetId: 15824, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Tex Kaseton LED CN": { plnPrice: 23.32, plnMargin: 17.82, intranetId: 19822, category: "media do druku", origin: "NULL", noPrice: true },
  "Medium Tex Premium 250cm FR": { plnPrice: 32.52, plnMargin: 27.02, intranetId: 18875, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Tex Vario 320cm": { plnPrice: 41.97, plnMargin: 36.47, intranetId: 15579, category: "media do druku", origin: "Polska", noPrice: true },
  "Medium Tex Vario CN": { plnPrice: 15.13, plnMargin: 9.63, intranetId: 19017, category: "media do druku", origin: "Polska", noPrice: true },
  "mFrame - Pakowanie zabudowy": { plnPrice: 1.67, plnMargin: 0, intranetId: 12107, category: "modular", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 112,7x97,5cm ŁUK1167x992 R2976 WEW": { plnPrice: 24.93, plnMargin: 24.93, intranetId: 18666, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 114,7x97,5cm ŁUK1167x992 R2976 ZEW": { plnPrice: 24.95, plnMargin: 24.95, intranetId: 18667, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 74,5x148cm ŁUK150 WEW FOLIA": { plnPrice: 58.47, plnMargin: 58.47, intranetId: 12133, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 74,5x196,6cm ŁUK250 WEW FOLIA": { plnPrice: 0, plnMargin: 0, intranetId: 19743, category: "wydruk classic", origin: "NULL", noPrice: true },
  "mFrame - PCV 2mm 74,5x197,7cm ŁUK200 WEW FOLIA": { plnPrice: 67.03, plnMargin: 67.03, intranetId: 17253, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 74,5x24,1cm ŁUK100 WEW FOLIA": { plnPrice: 0, plnMargin: 0, intranetId: 19736, category: "wydruk classic", origin: "NULL", noPrice: true },
  "mFrame - PCV 2mm 74,5x247,2cm ŁUK250 WEW FOLIA": { plnPrice: 81.91, plnMargin: 81.91, intranetId: 12331, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 74,5x48,9cm ŁUK100 WEW FOLIA": { plnPrice: 15.66, plnMargin: 15.66, intranetId: 19737, category: "wydruk classic", origin: "NULL", noPrice: true },
  "mFrame - PCV 2mm 74,5x49cm ŁUK50 WEW FOLIA": { plnPrice: 13.62, plnMargin: 13.62, intranetId: 12044, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 74,5x98,5cm ŁUK100 WEW FOLIA": { plnPrice: 12.81, plnMargin: 12.81, intranetId: 12022, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83,6x148cm ŁUK150 ZEW FOLIA": { plnPrice: 27.79, plnMargin: 27.79, intranetId: 12134, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83,6x247,2cm ŁUK250 ZEW FOLIA": { plnPrice: 82.29, plnMargin: 82.29, intranetId: 16227, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83,6x297cm ŁUK300 ZEW FOLIA": { plnPrice: 97.76, plnMargin: 97.76, intranetId: 17701, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83,6x49cm ŁUK50 ZEW FOLIA": { plnPrice: 15.66, plnMargin: 15.66, intranetId: 12045, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83,6x98,5cm ŁUK100 ZEW FOLIA": { plnPrice: 17.98, plnMargin: 17.98, intranetId: 12015, category: "wydruk classic", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83x196,6cm ŁUK200 ZEW MATERIAŁ": { plnPrice: 78.51, plnMargin: 71.84, intranetId: 17252, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83x24,1cm ŁUK50 ZEW MATERIAŁ": { plnPrice: 0, plnMargin: 0, intranetId: 19740, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "mFrame - PCV 2mm 83x246,2cm ŁUK250 ZEW MATERIAŁ": { plnPrice: 56.59, plnMargin: 49.92, intranetId: 15597, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83x48cm ŁUK50 ZEW MATERIAŁ": { plnPrice: 16.08, plnMargin: 9.41, intranetId: 12043, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "mFrame - PCV 2mm 83x97,5cm ŁUK100 ZEW MATERIAŁ": { plnPrice: 32.04, plnMargin: 25.37, intranetId: 12014, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "mFrame - PCV 3mm 197,7x98,5cm": { plnPrice: 91.86, plnMargin: 91.86, intranetId: 12019, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame - PCV 3mm 247,2x98,5cm": { plnPrice: 59.92, plnMargin: 59.92, intranetId: 12010, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame - PCV 3mm 5,6x247,2cm OŚCIEŻNICA DRZWI(bok)": { plnPrice: 7.03, plnMargin: 7.03, intranetId: 17364, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame - PCV 3mm 86,3x240,5cm DRZWI": { plnPrice: 1.1, plnMargin: 1.1, intranetId: 12025, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame - PCV 3mm 98,5x98,5cm": { plnPrice: 27.37, plnMargin: 27.37, intranetId: 12012, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame - Rzep miękki czarny [pętelka]": { plnPrice: 2.14, plnMargin: 0.2, intranetId: 17425, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame - Rzepowanie ramy (DWUSTRONNIE)": { plnPrice: 13.33, plnMargin: 0, intranetId: 12039, category: "modular", origin: "Polska", noPrice: true },
  "mFrame - Rzepowanie ramy (JEDNOSTRONNIE)": { plnPrice: 6.67, plnMargin: 0, intranetId: 12038, category: "modular", origin: "Polska", noPrice: true },
  "mFrame - zestaw łączników trening": { plnPrice: 346.81, plnMargin: 210.14, intranetId: 18921, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame blat do półki - białe": { plnPrice: 100.67, plnMargin: 99, intranetId: 16490, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame blat do półki - białe ver3": { plnPrice: 103.32, plnMargin: 101.65, intranetId: 19161, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame blat do półki - czarne": { plnPrice: 100.67, plnMargin: 99, intranetId: 16491, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame blat do półki - czarne ver3": { plnPrice: 103.32, plnMargin: 101.65, intranetId: 19162, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame blat do półki - szare": { plnPrice: 97.97, plnMargin: 96.3, intranetId: 12664, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame blat do półki - szare ver3": { plnPrice: 97.97, plnMargin: 96.3, intranetId: 17989, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame blat półki 920x420 trybunka z drzwiami": { plnPrice: 210.79, plnMargin: 210.79, intranetId: 18403, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW KLAMKA": { plnPrice: 37.71, plnMargin: 36.04, intranetId: 19043, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW PROFIL A": { plnPrice: 127.78, plnMargin: 126.11, intranetId: 19036, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW PROFIL B": { plnPrice: 127.78, plnMargin: 126.11, intranetId: 19037, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW PROFIL C": { plnPrice: 127.78, plnMargin: 126.11, intranetId: 19038, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW PROFIL D": { plnPrice: 127.78, plnMargin: 126.11, intranetId: 19039, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW PROFIL E": { plnPrice: 127.78, plnMargin: 126.11, intranetId: 19040, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW PROFIL F": { plnPrice: 127.78, plnMargin: 126.11, intranetId: 19041, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR NEW PRÓG": { plnPrice: 45.7, plnMargin: 44.03, intranetId: 19042, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR PROFIL A": { plnPrice: 141.78, plnMargin: 140.11, intranetId: 15435, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR PROFIL B": { plnPrice: 141.78, plnMargin: 140.11, intranetId: 15436, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR PROFIL C": { plnPrice: 141.78, plnMargin: 140.11, intranetId: 15437, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR PROFIL D": { plnPrice: 141.78, plnMargin: 140.11, intranetId: 15438, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame DOOR PROFIL E": { plnPrice: 35.3, plnMargin: 33.63, intranetId: 15439, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame drzwi trybunka 992x992 komplet": { plnPrice: 824.86, plnMargin: 779.86, intranetId: 18401, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame drzwi trybunka 992x992 komplet do MO": { plnPrice: 287.84, plnMargin: 286.17, intranetId: 18477, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame Glass wall 3mm PC panel": { plnPrice: 161.81, plnMargin: 160.14, intranetId: 18454, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame Glass wall 90° connector": { plnPrice: 11.68, plnMargin: 10.01, intranetId: 18453, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame Glass wall 992x2480 z otworami": { plnPrice: 732.33, plnMargin: 670.86, intranetId: 18585, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame Kostka do progu drzwi": { plnPrice: 0, plnMargin: 0, intranetId: 15085, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame kątownik pod półkę do trybunki": { plnPrice: 16.05, plnMargin: 16.05, intranetId: 17416, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "Mframe lampa plafon": { plnPrice: 118.2, plnMargin: 113.2, intranetId: 17251, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame LAMPKA LED tulejka": { plnPrice: 13.01, plnMargin: 8.01, intranetId: 16222, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame LAMPKA LED V2": { plnPrice: 226.86, plnMargin: 220.19, intranetId: 18863, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame LAMPKA LED V2 case": { plnPrice: 206.85, plnMargin: 200.18, intranetId: 18864, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame LAMPKA LED V2 pilot": { plnPrice: 26.69, plnMargin: 20.02, intranetId: 18866, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame LAMPKA LED V2 przedłużka kabla zasilającego": { plnPrice: 18.36, plnMargin: 11.69, intranetId: 19154, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame LAMPKA LED V2 zasilacz": { plnPrice: 206.85, plnMargin: 200.18, intranetId: 18865, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame MASKOWNICA KWADRAT z gwintem 2480": { plnPrice: 231.47, plnMargin: 229.8, intranetId: 18456, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame MASKOWNICA KWADRAT z gwintem 2480 - drzwi": { plnPrice: 231.47, plnMargin: 229.8, intranetId: 18457, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame MASKOWNICA KWADRATOWA GRAFIKA 992 stan": { plnPrice: 61.83, plnMargin: 53.5, intranetId: 18562, category: "rental", origin: "Chiny", noPrice: true },
  "mFrame MASKOWNICA KWADRATOWA z gwintem x3": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 18363, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame MASKOWNICA LED Metal end cap": { plnPrice: 6.2, plnMargin: 1.2, intranetId: 18479, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "mFrame MASKOWNICA LED plastic cover": { plnPrice: 13.81, plnMargin: 8.81, intranetId: 18229, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "mFrame MASKOWNICA PCV 2480 (apla do cięcia)": { plnPrice: 0, plnMargin: 0, intranetId: 18735, category: "wydruk blockout", origin: "Polska", noPrice: true },
  "mFrame MASKOWNICA PCV z wydrukiem": { plnPrice: 120.75, plnMargin: 51.83, intranetId: 19781, category: "wydruk blockout", origin: "NULL", noPrice: true },
  "mFrame MASKOWNICA ZAŚLEPKA ĆWIERĆWAŁEK": { plnPrice: 21.6, plnMargin: 19.93, intranetId: 12460, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame obciążenie 5 kg": { plnPrice: 74.79, plnMargin: 66.46, intranetId: 18860, category: "rental", origin: "Polska", noPrice: true },
  "mFrame panel ażurowy 100x250": { plnPrice: 1211.67, plnMargin: 1210, intranetId: 17134, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PANEL NA ZAWIESZKI": { plnPrice: 187.02, plnMargin: 170.35, intranetId: 10849, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PIN FAT 5,6CM (do Luminous_M6)": { plnPrice: 10.87, plnMargin: 9.2, intranetId: 18640, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PIN FAT 8,5CM": { plnPrice: 11.68, plnMargin: 10.01, intranetId: 15074, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame PODPORA POD BLAT": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 16664, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame Pojemnik na akcesoria 21L": { plnPrice: 32.04, plnMargin: 27.04, intranetId: 16714, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame Pojemnik na akcesoria 32L": { plnPrice: 37.02, plnMargin: 32.02, intranetId: 16715, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PROFIL L=1240": { plnPrice: 66.92, plnMargin: 65.25, intranetId: 10886, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame PROFIL L=1984": { plnPrice: 97.75, plnMargin: 96.08, intranetId: 11384, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame PROFIL L=2480": { plnPrice: 133.46, plnMargin: 131.79, intranetId: 10887, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame PROFIL TRÓJKĄT 992x496 1109mm 63/27": { plnPrice: 60.06, plnMargin: 60.06, intranetId: 19085, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame PROFIL TRÓJKĄT 992x496 496mm 90/63": { plnPrice: 32.03, plnMargin: 32.03, intranetId: 19087, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame PROFIL TRÓJKĄT 992x496 992mm 90/27": { plnPrice: 44.03, plnMargin: 44.03, intranetId: 19084, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame PROFIL TRÓJKĄT 992x992 1403mm 45/45": { plnPrice: 100.09, plnMargin: 100.09, intranetId: 19081, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame PROFIL TRÓJKĄT 992x992 992mm 45/90": { plnPrice: 50.03, plnMargin: 50.03, intranetId: 19086, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame PROFIL ŁUK 1167 R2976": { plnPrice: 85.74, plnMargin: 84.07, intranetId: 18853, category: "modular", origin: "Polska", noPrice: true },
  "mFrame PROFIL ŁUK 776 R992": { plnPrice: 73.74, plnMargin: 72.07, intranetId: 18845, category: "modular", origin: "Polska", noPrice: true },
  "mFrame PROFIL ŁĄCZNIK 180°": { plnPrice: 37.24, plnMargin: 37.24, intranetId: 15088, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame PROFIL ŁĄCZNIK 90° ŁUK R2976": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 18856, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PROFIL ŁĄCZNIK 90° ŁUK R992": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 18846, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA - śrubka": { plnPrice: 0.85, plnMargin: 0.85, intranetId: 19228, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA DWUSTRONNA (czarny/komplet)": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17419, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA DWUSTRONNA UCHWYT PIN SZT": { plnPrice: 181, plnMargin: 176, intranetId: 15294, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA LED": { plnPrice: 99.52, plnMargin: 97.85, intranetId: 12463, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA SKOS UCHWYT PIN KOMPLET": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 15293, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA UCHWYT PIN KOMPLET (czarny)": { plnPrice: 0, plnMargin: 0, intranetId: 17391, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA UCHWYT PIN KOMPLET ver1": { plnPrice: 81.84, plnMargin: 80.17, intranetId: 10851, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA UCHWYT PIN KOMPLET ver2": { plnPrice: 113.4, plnMargin: 80.07, intranetId: 17267, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame PÓŁKA UCHWYT PIN KOMPLET ver3": { plnPrice: 107.27, plnMargin: 102.27, intranetId: 17988, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame płyta OSB 18mm 800x400mm (pod support)": { plnPrice: 32.51, plnMargin: 30.84, intranetId: 16790, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame płyta OSB 18mm 870x772mm": { plnPrice: 64.92, plnMargin: 63.25, intranetId: 17289, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame płyta OSB 18mm 870x812mm": { plnPrice: 64.92, plnMargin: 63.25, intranetId: 17288, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame RAMA 1240x1240": { plnPrice: 328.41, plnMargin: 288.41, intranetId: 17656, category: "zabudowy mframe", origin: "Chiny", noPrice: true },
  "mFrame RAMA 1240x2480": { plnPrice: 437.87, plnMargin: 397.87, intranetId: 15584, category: "zabudowy mframe", origin: "Chiny", noPrice: true },
  "mFrame RAMA 1488x2480": { plnPrice: 413.21, plnMargin: 406.54, intranetId: 12106, category: "zabudowy mframe", origin: "Chiny", noPrice: true },
  "mFrame RAMA 248x1240": { plnPrice: 0, plnMargin: 0, intranetId: 19169, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA 248x1488": { plnPrice: 0, plnMargin: 0, intranetId: 19170, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA 248x1984": { plnPrice: 0, plnMargin: 0, intranetId: 19171, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA 248x496 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19839, category: "rental", origin: "NULL", noPrice: true },
  "mFrame RAMA 496x1240": { plnPrice: 226.12, plnMargin: 206.12, intranetId: 10862, category: "zabudowy mframe", origin: "Chiny", noPrice: true },
  "mFrame RAMA 496x1984 stan": { plnPrice: 284.25, plnMargin: 260.92, intranetId: 19053, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA 992x1984 stan": { plnPrice: 330.2, plnMargin: 306.87, intranetId: 17856, category: "zabudowy mframe", origin: "Chiny", noPrice: true },
  "mFrame RAMA 992x2480 T": { plnPrice: 375.92, plnMargin: 367.59, intranetId: 17792, category: "zabudowy mframe", origin: "Turcja", noPrice: true },
  "mFrame rama 992x992 sklepienie": { plnPrice: 255.53, plnMargin: 232.2, intranetId: 18369, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA 992x992 stan": { plnPrice: 364.45, plnMargin: 331.12, intranetId: 17165, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame rama curved corner arch 992x992": { plnPrice: 291.57, plnMargin: 268.24, intranetId: 18360, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA drzwi 992x992 DCF": { plnPrice: 302.04, plnMargin: 262.04, intranetId: 18398, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA obciążenie": { plnPrice: 40.36, plnMargin: 32.03, intranetId: 18859, category: "rental", origin: "Polska", noPrice: true },
  "mFrame RAMA SLM 992x992 (bez wydurku)": { plnPrice: 508.69, plnMargin: 409.54, intranetId: 18790, category: "zabudowy kasetony", origin: "Polska", noPrice: true },
  "mFrame RAMA TRÓJKĄT 992x496": { plnPrice: 174.95, plnMargin: 174.95, intranetId: 18862, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA TRÓJKĄT 992x992": { plnPrice: 223, plnMargin: 223, intranetId: 18861, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA TRÓJKĄT łącznik narożny 26stopni": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 19089, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA TRÓJKĄT łącznik narożny 45stopni": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 19083, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA TRÓJKĄT łącznik narożny 63stopni": { plnPrice: 12.02, plnMargin: 12.02, intranetId: 19088, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame RAMA ŁUK 1167x992 R2976": { plnPrice: 555.16, plnMargin: 548.49, intranetId: 18364, category: "zabudowy mframe", origin: "Chiny", noPrice: true },
  "mFrame RAMA ŁUK 1167x992 R2976 stan": { plnPrice: 0, plnMargin: 0, intranetId: 19851, category: "zabudowy mframe", origin: "NULL", noPrice: true },
  "mFrame RAMA ŁUK 496x248": { plnPrice: 0, plnMargin: 0, intranetId: 19733, category: "zabudowy mframe", origin: "NULL", noPrice: true },
  "mFrame RAMA ŁUK 496x992 stan": { plnPrice: 427.9, plnMargin: 394.57, intranetId: 17250, category: "zabudowy mframe", origin: "Chiny", noPrice: true },
  "mFrame RAMA ŁUK 776x992 R992": { plnPrice: 0, plnMargin: 0, intranetId: 18851, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame skrzydło drzwi lewe do ramy 992x992": { plnPrice: 260.29, plnMargin: 258.62, intranetId: 18400, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame skrzydło drzwi prawe do ramy 992x992": { plnPrice: 260.29, plnMargin: 258.62, intranetId: 18399, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame STOPA + ŁĄCZNIK PŁASKI ZESTAW": { plnPrice: 0, plnMargin: 0, intranetId: 19297, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame STOPA BLACHA DWUSTRONNA KRÓTKA": { plnPrice: 57.72, plnMargin: 56.05, intranetId: 17450, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame STOPA BOCZNA ZESTAW": { plnPrice: 123.43, plnMargin: 118.25, intranetId: 17910, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame STOPA POŁÓWKA ZESTAW": { plnPrice: 81.44, plnMargin: 78.11, intranetId: 17886, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame STOPA ŁĄCZNIK BOCZNY": { plnPrice: 37.71, plnMargin: 36.04, intranetId: 11387, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame STOPA ŁĄCZNIK PŁASKI": { plnPrice: 81.74, plnMargin: 80.07, intranetId: 10883, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame STYRODUR A": { plnPrice: 99.57, plnMargin: 97.9, intranetId: 17108, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame STYRODUR B": { plnPrice: 99.57, plnMargin: 97.9, intranetId: 17109, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame TRANSPORT PLASTIK OCHRONNY ver2 (prosty)": { plnPrice: 1.6, plnMargin: 1.6, intranetId: 18576, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame trybunka 100x50 (bez wydruku)": { plnPrice: 922.1, plnMargin: 761.18, intranetId: 17263, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame trybunka 100x50 maskownica kwadratowa grafika (bez wydruku)": { plnPrice: 1349.77, plnMargin: 1148.85, intranetId: 17312, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame trybunka 150x50 (bez wydruku)": { plnPrice: 950.57, plnMargin: 816.31, intranetId: 17313, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "mFrame trybunka 150x50 maskownica kwadratowa grafika (bez wydruku)": { plnPrice: 1473.37, plnMargin: 1259.11, intranetId: 17315, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "MFRAME Trybunka Blat 103x65cm": { plnPrice: 116.67, plnMargin: 110, intranetId: 12103, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame TULEJKA DO ŁĄCZNIKÓW": { plnPrice: 0, plnMargin: 0, intranetId: 17218, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame zamek do drzwi": { plnPrice: 19.68, plnMargin: 18.01, intranetId: 17867, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame ZAWIESZKA": { plnPrice: 19.53, plnMargin: 17.86, intranetId: 10850, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame ŁĄCZNIK I 12PIN 180 STOPNI": { plnPrice: 47.2, plnMargin: 47.2, intranetId: 12458, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame ŁĄCZNIK I 4PIN rama łuk R5945 lewy": { plnPrice: 57, plnMargin: 55.33, intranetId: 18367, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame ŁĄCZNIK I 4PIN rama łuk R5945 prawy": { plnPrice: 57, plnMargin: 55.33, intranetId: 18366, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "mFrame ŁĄCZNIK WEW/O 90 STOPNI": { plnPrice: 9.68, plnMargin: 8.01, intranetId: 10841, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame ŁĄCZNIK X": { plnPrice: 58.47, plnMargin: 56.8, intranetId: 10834, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame ŁĄCZNIK ZEW/ZEW/ZEW/ZEW": { plnPrice: 26.18, plnMargin: 24.51, intranetId: 11297, category: "zabudowy mframe akcesoria", origin: "Chiny", noPrice: true },
  "mFrame/multiframe ŁĄCZNIK CTF UNIWER": { plnPrice: 0, plnMargin: 0, intranetId: 19164, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "Mocowanie dispenser Vario Presto Light 090 Medi": { plnPrice: 41.23, plnMargin: 41.23, intranetId: 13937, category: "usunięte", origin: "Polska", noPrice: true },
  "mocowanie żarówki adFrame CTF Hanging": { plnPrice: 36.87, plnMargin: 35.2, intranetId: 15286, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "Modulo (bez wydruku)": { plnPrice: 296.16, plnMargin: 287.83, intranetId: 10575, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Modulo potrójne (bez wydruku)": { plnPrice: 662.1, plnMargin: 653.77, intranetId: 10992, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Montaż plastików do leżaka": { plnPrice: 6.67, plnMargin: 0, intranetId: 17353, category: "outdoor", origin: "Polska", noPrice: true },
  "MP Extender 25cm": { plnPrice: 22.39, plnMargin: 5.72, intranetId: 18903, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "Multiframe 250 (Black)": { plnPrice: 0, plnMargin: 0, intranetId: 11973, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe 250 SET1 (Black) dwustronny": { plnPrice: 1259.31, plnMargin: 1106.46, intranetId: 17891, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe 250 SET3 (Black) (bez wydruku)": { plnPrice: 2023.65, plnMargin: 1883.65, intranetId: 16601, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 250 SET5 (Black) (bez wydruku)": { plnPrice: 3306.81, plnMargin: 3073.48, intranetId: 16603, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 250 SET6 (Black) (bez wydruku)": { plnPrice: 3771.62, plnMargin: 3504.95, intranetId: 16604, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 250 SET7 (Black) (bez wydruku)": { plnPrice: 4589.97, plnMargin: 4263.3, intranetId: 16605, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 250 SET8 (Black) (bez wydruku)": { plnPrice: 5054.79, plnMargin: 4694.79, intranetId: 16606, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 301 SET2 (Black) (bez wydruku)": { plnPrice: 1879.19, plnMargin: 1739.19, intranetId: 16750, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 301 SET3 (Black) (bez wydruku": { plnPrice: 2605.53, plnMargin: 2408.86, intranetId: 17333, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 301 SET4 (Black) (bez wydruku)": { plnPrice: 3254.88, plnMargin: 3021.55, intranetId: 16751, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 301 SET4 (Black) dwustronny": { plnPrice: 3931.99, plnMargin: 3409.72, intranetId: 17899, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe 301 SET5 (Black) (bez wydruku)": { plnPrice: 4126.47, plnMargin: 3809.8, intranetId: 17334, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 301 SET6 (Black) (bez wydruku)": { plnPrice: 4710.15, plnMargin: 4346.82, intranetId: 18847, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe 350 SET1 (Black) (bez wydruku)": { plnPrice: 1386.43, plnMargin: 1293.1, intranetId: 17335, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 350 SET2 (Black) (bez wydruku)": { plnPrice: 2015.58, plnMargin: 1875.58, intranetId: 17337, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 350 SET3 (Black) (bez wydruku)": { plnPrice: 2930, plnMargin: 2723.33, intranetId: 17338, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 350 SET4 (Black) (bez wydruku)": { plnPrice: 3482.2, plnMargin: 3248.87, intranetId: 17339, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe 350 SET5 (Black) (bez wydruku)": { plnPrice: 4271.21, plnMargin: 3961.21, intranetId: 17340, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Multiframe akcesoria blokada zamka": { plnPrice: 0, plnMargin: 0, intranetId: 17519, category: "modular", origin: "Polska", noPrice: true },
  "Multiframe akcesoria rurka pod półką na wieszaki": { plnPrice: 31.14, plnMargin: 29.47, intranetId: 11983, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe akcesoria stopka 3x": { plnPrice: 0, plnMargin: 0, intranetId: 15428, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe akcesoria stopka do kostki 4x": { plnPrice: 4.11, plnMargin: 2.44, intranetId: 16392, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe akcesoria zamek ruchomy rozpórki": { plnPrice: 9.68, plnMargin: 8.01, intranetId: 17521, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe akcesoria zamek stały rozpórki": { plnPrice: 9.68, plnMargin: 8.01, intranetId: 17520, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe akcesoria zawieszka pojedyncza 2W": { plnPrice: 32.7, plnMargin: 31.03, intranetId: 11274, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe akcesoria zawieszka płaska 1W": { plnPrice: 25.87, plnMargin: 24.2, intranetId: 11273, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe Blat 1045x400 CZARNY": { plnPrice: 213.4, plnMargin: 213.4, intranetId: 16779, category: "zabudowy multiframe akcesoria", origin: "Chiny", noPrice: true },
  "Multiframe kantorek 250 extender 100x200 (Black) (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19622, category: "zabudowy multiframe", origin: "NULL", noPrice: true },
  "Multiframe kantorek tył 250 (Black)": { plnPrice: 1925.45, plnMargin: 1918.78, intranetId: 11992, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe maskownica 250 doł": { plnPrice: 61.28, plnMargin: 59.61, intranetId: 11985, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe maskownica 250 góra": { plnPrice: 61.28, plnMargin: 59.61, intranetId: 11984, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe maskownica mocowanie": { plnPrice: 16.93, plnMargin: 13.6, intranetId: 11986, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe NADSTAWKA 100cm (Black)": { plnPrice: 1411.87, plnMargin: 1140.28, intranetId: 16724, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe NADSTAWKA 100cm 1x2m (Black) (bez wydruku)": { plnPrice: 1508.16, plnMargin: 1378.16, intranetId: 17117, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe NADSTAWKA 200x100x100cm (Black) (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19602, category: "zabudowy multiframe", origin: "NULL", noPrice: true },
  "Multiframe NADSTAWKA 50cm 1x1 (Black) (bez wydruku)": { plnPrice: 1005.44, plnMargin: 918.77, intranetId: 16717, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Multiframe profil poziomy 35cm (Black)": { plnPrice: 52.2, plnMargin: 50.53, intranetId: 15424, category: "zabudowy multiframe akcesoria", origin: "Chiny", noPrice: true },
  "Multiframe profil rozpórka 35cm (Black)": { plnPrice: 22.89, plnMargin: 21.22, intranetId: 11601, category: "zabudowy multiframe akcesoria", origin: "Chiny", noPrice: true },
  "Multiframe półka wspornik": { plnPrice: 16.89, plnMargin: 11.89, intranetId: 16136, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe torba do półek": { plnPrice: 37.5, plnMargin: 32.5, intranetId: 10410, category: "zabudowy multiframe akcesoria", origin: "Chiny", noPrice: true },
  "Multiframe torba na kółkach długa": { plnPrice: 199.87, plnMargin: 194.87, intranetId: 11193, category: "zabudowy multiframe akcesoria", origin: "Chiny", noPrice: true },
  "Multiframe torba na kółkach długa FR": { plnPrice: 5.04, plnMargin: 0.04, intranetId: 16470, category: "zabudowy multiframe akcesoria", origin: "Chiny", noPrice: true },
  "Multiframe torba na stopy": { plnPrice: 37.38, plnMargin: 32.38, intranetId: 11602, category: "zabudowy multiframe akcesoria", origin: "Chiny", noPrice: true },
  "Multiframe uchwyt na zawieszki głęboki MF004": { plnPrice: 59.91, plnMargin: 58.24, intranetId: 11276, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe łącznik kantorek 300": { plnPrice: 60.5, plnMargin: 60.5, intranetId: 16921, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe łącznik kantorek klamka 300": { plnPrice: 53.35, plnMargin: 53.35, intranetId: 16919, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe łącznik prosty kantorek ściana 300": { plnPrice: 62.7, plnMargin: 62.7, intranetId: 16920, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Multiframe/Vario LED (Black)": { plnPrice: 194.54, plnMargin: 172.87, intranetId: 11850, category: "zabudowy multiframe akcesoria", origin: "Polska", noPrice: true },
  "Nakrętka motylkowa M8": { plnPrice: 0.07, plnMargin: 0, intranetId: 19408, category: "inne", origin: "Polska", noPrice: true },
  "Nitonakrętka M4": { plnPrice: 0.05, plnMargin: 0, intranetId: 15300, category: "inne", origin: "Polska", noPrice: true },
  "Nitonakrętka M6": { plnPrice: 0.27, plnMargin: 0.27, intranetId: 17369, category: "inne", origin: "Polska", noPrice: true },
  "Nitonakrętka M6 aluminiowa": { plnPrice: 0.19, plnMargin: 0.01, intranetId: 19848, category: "inne", origin: "NULL", noPrice: true },
  "Nitonakrętka M8": { plnPrice: 0.26, plnMargin: 0.02, intranetId: 13513, category: "półprodukty", origin: "Polska", noPrice: true },
  "Nić Tytan 60E": { plnPrice: 0, plnMargin: 0, intranetId: 18131, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "NORMAL LED (łączna długość ledów+opis na którym boku)": { plnPrice: 6.67, plnMargin: 0, intranetId: 19446, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Nóżka gumowa - STANDARD": { plnPrice: 0.83, plnMargin: 0.06, intranetId: 16060, category: "półprodukty", origin: "Polska", noPrice: true },
  "Oczko do banerów ∅11,2mm": { plnPrice: 0.36, plnMargin: 0.03, intranetId: 18246, category: "classic", origin: "Polska", noPrice: true },
  "Oczko do banerów ∅12mm": { plnPrice: 0.13, plnMargin: 0.01, intranetId: 12224, category: "classic", origin: "Polska", noPrice: true },
  "Oczko stalowe M6 otwór gwintowany": { plnPrice: 1.61, plnMargin: 1.61, intranetId: 17534, category: "usługi montażu", origin: "Chiny", noPrice: true },
  "Oczko stalowe M8 otwór gwintowany": { plnPrice: 1.61, plnMargin: 1.61, intranetId: 18146, category: "usługi montażu", origin: "Chiny", noPrice: true },
  "Oczko stalowe M8 śruba gwintowana": { plnPrice: 1.49, plnMargin: 1.49, intranetId: 11881, category: "frames", origin: "Chiny", noPrice: true },
  "Oczkowanie baneru": { plnPrice: 17.17, plnMargin: 0.04, intranetId: 12223, category: "usługi", origin: "Polska", noPrice: true },
  "Opakowanie dostawcy": { plnPrice: 0, plnMargin: 0, intranetId: 15595, category: "usługi", origin: "Polska", noPrice: true },
  "oprawka żarówki do adFrame CTF Hanging": { plnPrice: 5.88, plnMargin: 4.21, intranetId: 16117, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Oświetlenie AdframeLED NORMAL 21cm": { plnPrice: 25.88, plnMargin: 17.75, intranetId: 11795, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "Oświetlenie AdframeLED NORMAL LED 20cm 6,5W ver2": { plnPrice: 19.47, plnMargin: 11.34, intranetId: 18629, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Oświetlenie AdframeLED NORMAL LED 24cm 8W ver2": { plnPrice: 20.28, plnMargin: 12.15, intranetId: 18635, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Oświetlenie AdframeLED NORMAL LED 30cm 10W ver2": { plnPrice: 21.1, plnMargin: 12.97, intranetId: 18632, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Oświetlenie AdframeLED POWER LED 20cm": { plnPrice: 25.3, plnMargin: 17.17, intranetId: 11449, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "Oświetlenie AdframeLED POWER LED 24cm 11W ver2": { plnPrice: 22.27, plnMargin: 14.14, intranetId: 18626, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Oświetlenie AdframeLED POWER LED 30cm": { plnPrice: 31.9, plnMargin: 23.77, intranetId: 11447, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "Oświetlenie AdframeLED POWER LED 50cm": { plnPrice: 44.31, plnMargin: 36.18, intranetId: 11446, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "Pakowanie palety - Classic": { plnPrice: 50, plnMargin: 0, intranetId: 12150, category: "usługi", origin: "Polska", noPrice: true },
  "Pakowanie palety - Kasetony": { plnPrice: 50, plnMargin: 0, intranetId: 12151, category: "usługi", origin: "Polska", noPrice: true },
  "Papier BEAVER 260cm": { plnPrice: 5.06, plnMargin: 5.06, intranetId: 18145, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier BEAVER 320cm": { plnPrice: 6.5, plnMargin: 6.5, intranetId: 18174, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier BEAVER LIGHT 260cm (rolka 1250m)": { plnPrice: 3.87, plnMargin: 3.87, intranetId: 19598, category: "media do druku", origin: "NULL", noPrice: true },
  "Papier do urządzenia Guardian dwuwarstwowy 70g/m2": { plnPrice: 498.62, plnMargin: 32.62, intranetId: 18383, category: "półprodukty", origin: "Polska", noPrice: true },
  "Papier przekładkowy 160cm 32 g": { plnPrice: 0.71, plnMargin: 0.71, intranetId: 14875, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier przekładkowy 260cm 25 g": { plnPrice: 0.92, plnMargin: 0.92, intranetId: 12375, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier przekładkowy 260cm 32 g": { plnPrice: 1.14, plnMargin: 1.14, intranetId: 16789, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier przekładkowy 320cm 24 g": { plnPrice: 0.92, plnMargin: 0.92, intranetId: 15585, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier przekładkowy 320cm 32 g": { plnPrice: 1.37, plnMargin: 0.09, intranetId: 18141, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier TRANSJET ECO II 160cm": { plnPrice: 4.17, plnMargin: 4.17, intranetId: 14876, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier TRANSJET ECO II 257cm": { plnPrice: 6.43, plnMargin: 6.43, intranetId: 12374, category: "media do druku", origin: "Polska", noPrice: true },
  "Papier TRANSJET ECO II 320cm": { plnPrice: 8.01, plnMargin: 8.01, intranetId: 15816, category: "media do druku", origin: "Polska", noPrice: true },
  "Pianki ochronne ROLLUP do wypełniania kartonów 25x10cm": { plnPrice: 8.68, plnMargin: 0.02, intranetId: 18190, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Pianki ochronne ROLLUP do wypełniania kartonów 31x22cm": { plnPrice: 9.09, plnMargin: 0.05, intranetId: 18191, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Pianki ochronne ROLLUP do wypełniania kartonów 42x16cm": { plnPrice: 9.08, plnMargin: 0.05, intranetId: 18192, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "pianki profile u-kształtne": { plnPrice: 2.28, plnMargin: 0.2, intranetId: 12371, category: "modern", origin: "Polska", noPrice: true },
  "Pianki profile u-kształtne GRUBE": { plnPrice: 2.87, plnMargin: 0.27, intranetId: 17050, category: "modern", origin: "Polska", noPrice: true },
  "Podkładka M4": { plnPrice: 0.17, plnMargin: 0.01, intranetId: 19797, category: "classic", origin: "NULL", noPrice: true },
  "Podnóżek Tokyo biała skóra/jasny orzech": { plnPrice: 489.17, plnMargin: 469.17, intranetId: 11011, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Podstawa do fotela Tokyo": { plnPrice: 0, plnMargin: 0, intranetId: 13502, category: "malo", origin: "Polska", noPrice: true },
  "Podstawa do Hokera Boliwia kolor złoty": { plnPrice: 0, plnMargin: 0, intranetId: 13453, category: "malo", origin: "Polska", noPrice: true },
  "Podstawa do Krzesła Altea": { plnPrice: 43.33, plnMargin: 36.66, intranetId: 13436, category: "malo", origin: "Polska", noPrice: true },
  "Podstawa do Krzesła Arona": { plnPrice: 10.68, plnMargin: 4.01, intranetId: 16925, category: "malo", origin: "Polska", noPrice: true },
  "Podstawa do Krzesła Boliwia kolor czarny": { plnPrice: 53.71, plnMargin: 52.04, intranetId: 18388, category: "modular", origin: "Polska", noPrice: true },
  "Podstawa do Krzesła Boliwia kolor złoty": { plnPrice: 58.71, plnMargin: 52.04, intranetId: 13431, category: "malo", origin: "Polska", noPrice: true },
  "Podstawa do Krzesła Malmo": { plnPrice: 0, plnMargin: 0, intranetId: 13434, category: "malo", origin: "Polska", noPrice: true },
  "Podstawa do podnóżka Tokyo": { plnPrice: 61.92, plnMargin: 55.25, intranetId: 13503, category: "malo", origin: "Polska", noPrice: true },
  "podłoga dolny panel": { plnPrice: 80.82, plnMargin: 79.15, intranetId: 18615, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "podłoga górny panel": { plnPrice: 52.88, plnMargin: 51.21, intranetId: 18614, category: "adfloor akcesoria", origin: "Polska", noPrice: true },
  "Pop-up Battery Counter Lightbox 100x100": { plnPrice: 1355.71, plnMargin: 1269.73, intranetId: 19816, category: "trybunki reklamowe", origin: "NULL", noPrice: true },
  "Pop-up Battery Counter Lightbox 100x100 (bez wydruku)": { plnPrice: 1227.38, plnMargin: 1210.71, intranetId: 19146, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "Pop-up Counter Lightbox 100x100 incl. charging": { plnPrice: 631.75, plnMargin: 562.43, intranetId: 18515, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "Pop-up Counter Lightbox 100x100 with door (bez wydruku)": { plnPrice: 1089.59, plnMargin: 1072.92, intranetId: 18920, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "Pop-up Lightbox 100x225": { plnPrice: 688.9, plnMargin: 619.58, intranetId: 19717, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Pop-up Lightbox 100x225 (bez wydruku)": { plnPrice: 577.4, plnMargin: 560.73, intranetId: 19140, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Pop-up Lightbox 100x250": { plnPrice: 727.7, plnMargin: 658.38, intranetId: 19718, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Pop-up Lightbox 100x250 (bez wydruku)": { plnPrice: 615.29, plnMargin: 598.62, intranetId: 19141, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Pop-up Lightbox 120x200": { plnPrice: 676.74, plnMargin: 605.22, intranetId: 19719, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Pop-up Lightbox 120x200 (bez wydruku)": { plnPrice: 555.1, plnMargin: 538.43, intranetId: 19142, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Pop-up Lightbox 120x250": { plnPrice: 749.79, plnMargin: 678.27, intranetId: 19720, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Pop-up Lightbox 120x250 (bez wydruku)": { plnPrice: 626.29, plnMargin: 609.62, intranetId: 19143, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Pop-up Lightbox 150x200": { plnPrice: 1055.32, plnMargin: 980.5, intranetId: 19721, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Pop-up Lightbox 150x200 (bez wydruku)": { plnPrice: 917.1, plnMargin: 900.43, intranetId: 19144, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Pop-up Lightbox 150x250": { plnPrice: 1170.23, plnMargin: 1095.41, intranetId: 19722, category: "ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Pop-up Lightbox 150x250 (bez wydruku)": { plnPrice: 1030.14, plnMargin: 1013.47, intranetId: 19145, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Pop-up Lightbox/Adtribune 100x200 łącznik 90 dolny": { plnPrice: 20.68, plnMargin: 4.01, intranetId: 18648, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Pop-up Lightbox/Adtribune 100x200 łącznik 90 górny": { plnPrice: 20.68, plnMargin: 4.01, intranetId: 18649, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "POWER LED (łączna długość ledów+opis na którym boku)": { plnPrice: 6.67, plnMargin: 0, intranetId: 19445, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "PRESET akcesoria [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19593, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET dodatkowe rzeczy klienta [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19596, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET ekrany [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19591, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET elektryka [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19592, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET konstrukcja dodatkowa [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19590, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET konstrukcja główna [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19589, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET podwieszenie [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19588, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET podłoga [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19587, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET wydruki [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19594, category: "usługi montażu", origin: "NULL", noPrice: true },
  "PRESET wyposażenie stoiska [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19595, category: "usługi montażu", origin: "NULL", noPrice: true },
  "profil DCF": { plnPrice: 59.38, plnMargin: 56.05, intranetId: 18219, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil DTF": { plnPrice: 32.57, plnMargin: 29.24, intranetId: 10932, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil F": { plnPrice: 8.21, plnMargin: 4.88, intranetId: 17735, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil Glass wall": { plnPrice: 65.37, plnMargin: 62.04, intranetId: 18450, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil LMD 12cm": { plnPrice: 51.37, plnMargin: 48.04, intranetId: 13600, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil LMS": { plnPrice: 59.38, plnMargin: 56.05, intranetId: 10935, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil LMSM": { plnPrice: 38.3, plnMargin: 0, intranetId: 10936, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "profil LMSM Mframe": { plnPrice: 37.37, plnMargin: 34.04, intranetId: 11310, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil LMSO": { plnPrice: 0, plnMargin: 0, intranetId: 11058, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil Luminous dwustronny": { plnPrice: 85.11, plnMargin: 81.78, intranetId: 18445, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil Luminous jednostronny": { plnPrice: 101.94, plnMargin: 98.61, intranetId: 18446, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil Luminous Maskownica dwustronny": { plnPrice: 19.1, plnMargin: 15.77, intranetId: 18447, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil Luminous Maskownica jednostronny": { plnPrice: 13.29, plnMargin: 9.96, intranetId: 18448, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil SAF - sklep - ramka - czarny": { plnPrice: 10.26, plnMargin: 6.93, intranetId: 15890, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil SLM": { plnPrice: 47.36, plnMargin: 44.03, intranetId: 18220, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil STF": { plnPrice: 23.43, plnMargin: 20.1, intranetId: 10937, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil STFL": { plnPrice: 14.34, plnMargin: 11.01, intranetId: 10934, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "profil support ELSTAR": { plnPrice: 49.34, plnMargin: 46.01, intranetId: 17269, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "profil support rurka ∅19mm": { plnPrice: 7.01, plnMargin: 3.68, intranetId: 12100, category: "ramy tekstylne akcesoria", origin: "Chiny", noPrice: true },
  "Przedłużacz kabla 1,8m (AC 3PIN)": { plnPrice: 12.66, plnMargin: 1.16, intranetId: 12130, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Przedłużacz z uziemieniem 4 gniazda 5m biały": { plnPrice: 24.91, plnMargin: 23.24, intranetId: 18821, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Przedłużacz z uziemieniem 4 gniazda 5m czarny": { plnPrice: 20.68, plnMargin: 19.01, intranetId: 18824, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Przedłużacz z uziemieniem 5 gniazd, 10m czarny": { plnPrice: 51.25, plnMargin: 49.58, intranetId: 18823, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Przedłużka 120cm do kabel zasilający do zasilacza wew": { plnPrice: 7.62, plnMargin: 7.62, intranetId: 18162, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Przedłużka do kabel zasilający do zasilacza lampki Multiframe/Vario LED (ósemkowy)": { plnPrice: 16.27, plnMargin: 16.27, intranetId: 17277, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Przekładki foliowe 120x160cm kapturki do palet": { plnPrice: 213.89, plnMargin: 13.99, intranetId: 19011, category: "inne", origin: "Polska", noPrice: true },
  "Przelotka kablowa okrągła gumowa 8mm": { plnPrice: 1.73, plnMargin: 0.16, intranetId: 18270, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Przerobienie kasety adstand 100 CN": { plnPrice: 25, plnMargin: 0, intranetId: 18796, category: "inne", origin: "Polska", noPrice: true },
  "Przerobienie kasety adstand 120 CN": { plnPrice: 25, plnMargin: 0, intranetId: 18819, category: "inne", origin: "Polska", noPrice: true },
  "Przerobienie kasety adstand 150 CN": { plnPrice: 25, plnMargin: 0, intranetId: 18820, category: "inne", origin: "Polska", noPrice: true },
  "Przerobienie kasety adstand 85 CN": { plnPrice: 25, plnMargin: 0, intranetId: 18795, category: "inne", origin: "Polska", noPrice: true },
  "przełącznik okrągły 230V": { plnPrice: 31.72, plnMargin: 6.72, intranetId: 15285, category: "frames", origin: "Polska", noPrice: true },
  "Przyklejany uchwyt U 6.4MM": { plnPrice: 0.61, plnMargin: 0.06, intranetId: 13509, category: "classic", origin: "Polska", noPrice: true },
  "puszka hermetyczna": { plnPrice: 26.07, plnMargin: 1.07, intranetId: 18195, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "puszka instalacyjna": { plnPrice: 27.69, plnMargin: 2.69, intranetId: 15284, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Półka - Elypse": { plnPrice: 48.97, plnMargin: 47.3, intranetId: 11345, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Półka - Elypse NIESTANDARD": { plnPrice: 84.06, plnMargin: 82.39, intranetId: 13687, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Półka - Hit/Hit C NIESTANDARD": { plnPrice: 23.67, plnMargin: 22, intranetId: 15107, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Półka - MiniHit": { plnPrice: 40.17, plnMargin: 38.5, intranetId: 11347, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Półka - Ring": { plnPrice: 40.17, plnMargin: 38.5, intranetId: 11348, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Półka - Standard": { plnPrice: 53.37, plnMargin: 51.7, intranetId: 11349, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Półka niestandardowa - zabudowy": { plnPrice: 0, plnMargin: 0, intranetId: 16346, category: "półprodukty", origin: "Polska", noPrice: true },
  "PÓŁKÓŁKO Z DRUTU 20x16x3 OCYNK": { plnPrice: 0.28, plnMargin: 0.02, intranetId: 18782, category: "classic", origin: "Polska", noPrice: true },
  "RETAIL Brochure holder A4": { plnPrice: 0, plnMargin: 0, intranetId: 12087, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL Hanger bracket": { plnPrice: 64.38, plnMargin: 56.05, intranetId: 12093, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL LMD Double magnet": { plnPrice: 56.37, plnMargin: 48.04, intranetId: 12080, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL profil LMD Double gaps with holes": { plnPrice: 62.71, plnMargin: 46.04, intranetId: 12071, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL profil LMD Double gaps without holes": { plnPrice: 52.29, plnMargin: 35.62, intranetId: 12057, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL profil LMD Loop + Screw": { plnPrice: 1.1, plnMargin: 1.1, intranetId: 15346, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL profil LMD Single gaps with holes": { plnPrice: 45.36, plnMargin: 42.03, intranetId: 12122, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL profil LMD Single gaps without holes": { plnPrice: 32.15, plnMargin: 28.82, intranetId: 12124, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "RETAIL uchwyt na półkę komplet": { plnPrice: 78.39, plnMargin: 70.06, intranetId: 12086, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Rura aluminiowa anodowana fi25 Hit": { plnPrice: 6.43, plnMargin: 6.43, intranetId: 10166, category: "półprodukty", origin: "Turcja", noPrice: true },
  "Rura fi25 z klejem": { plnPrice: 7.92, plnMargin: 7.92, intranetId: 12293, category: "półprodukty", origin: "Polska", noPrice: true },
  "rzep biały miękki 5cm": { plnPrice: 1.61, plnMargin: 0.11, intranetId: 18869, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "rzep biały twardy 5cm": { plnPrice: 1.61, plnMargin: 0.11, intranetId: 18873, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "rzep czarny miękki 5cm": { plnPrice: 1.61, plnMargin: 0.11, intranetId: 18870, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "rzep czarny twardy 5cm": { plnPrice: 1.61, plnMargin: 0.11, intranetId: 18874, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "RĘKAW FOLIOWY CZARNY 150 cm gr. 0,06 my": { plnPrice: 2.24, plnMargin: 0.2, intranetId: 18689, category: "półprodukty", origin: "Polska", noPrice: true },
  "Rękaw foliowy do leżaków": { plnPrice: 1.12, plnMargin: 0.07, intranetId: 16617, category: "półprodukty", origin: "Polska", noPrice: true },
  "Rękaw foliowy LDPE 250mm 25cm 0,03 (30 mic)": { plnPrice: 0.36, plnMargin: 0.02, intranetId: 12366, category: "półprodukty", origin: "Polska", noPrice: true },
  "Rękaw foliowy LDPE 300mm 30cm 0,03 (30 mic)": { plnPrice: 0.6, plnMargin: 0.04, intranetId: 19120, category: "półprodukty", origin: "Polska", noPrice: true },
  "SAMPLE_adAir_pump_1200W_GR": { plnPrice: 214.8, plnMargin: 148.13, intranetId: 19136, category: "namioty", origin: "Polska", noPrice: true },
  "SAMPLE_Adboard_fabric_Bannermate": { plnPrice: 0, plnMargin: 0, intranetId: 18521, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_adBox Easy (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19527, category: "stoiska degustacyjne", origin: "NULL", noPrice: true },
  "SAMPLE_adColumn Air ∅60x220 - ver TPU 2.0 (bez wydruku)": { plnPrice: 336.94, plnMargin: 320.27, intranetId: 18386, category: "słupy", origin: "Polska", noPrice: true },
  "SAMPLE_adColumn_Air_320_GR": { plnPrice: 785.48, plnMargin: 718.81, intranetId: 19131, category: "namioty", origin: "Polska", noPrice: true },
  "SAMPLE_adFlag_Air_6m_GR": { plnPrice: 1232.37, plnMargin: 1165.7, intranetId: 19133, category: "namioty", origin: "Polska", noPrice: true },
  "SAMPLE_adFrame Go 100x150": { plnPrice: 0, plnMargin: 0, intranetId: 19299, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Adframe Lumina - bez ledów - 100x250": { plnPrice: 0, plnMargin: 0, intranetId: 18484, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Adframe Lumina - bez ledów - 200x250": { plnPrice: 0, plnMargin: 0, intranetId: 18485, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_adframe smart Crazy 1,78x1,86": { plnPrice: 1637.74, plnMargin: 1629.41, intranetId: 19555, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 1,7x2,47": { plnPrice: 2014.05, plnMargin: 2005.72, intranetId: 19557, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 1,7x2,7": { plnPrice: 2038.08, plnMargin: 2029.75, intranetId: 19556, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 105 degree connector": { plnPrice: 36.35, plnMargin: 28.02, intranetId: 19561, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 120 degree connector": { plnPrice: 36.35, plnMargin: 28.02, intranetId: 19567, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 120 degree foot": { plnPrice: 52.36, plnMargin: 44.03, intranetId: 19566, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 2,5x2,8": { plnPrice: 2150.17, plnMargin: 2141.84, intranetId: 19554, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 75 degree foot": { plnPrice: 52.36, plnMargin: 44.03, intranetId: 19558, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 90 degree connector": { plnPrice: 36.35, plnMargin: 28.02, intranetId: 19560, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy 90 degree foot": { plnPrice: 52.36, plnMargin: 44.03, intranetId: 19559, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy Octagon Assembly pattern 1": { plnPrice: 1753.83, plnMargin: 1745.5, intranetId: 19562, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy Octagon Assembly pattern 2 with 1 lower foot": { plnPrice: 1982.03, plnMargin: 1973.7, intranetId: 19563, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy Octagon Assembly pattern 3 with 1 lower foot": { plnPrice: 1909.97, plnMargin: 1901.64, intranetId: 19565, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_adframe smart Crazy PC line clamp": { plnPrice: 8.72, plnMargin: 0.39, intranetId: 19568, category: "frames light", origin: "NULL", noPrice: true },
  "SAMPLE_Adframe_quick_100x250_modular": { plnPrice: 400.35, plnMargin: 400.35, intranetId: 18343, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_adGate Air 6*3.5*0.6m": { plnPrice: 1301.13, plnMargin: 1301.13, intranetId: 18288, category: "bramy pneumatyczne", origin: "Polska", noPrice: true },
  "SAMPLE_adGate Air Triangle 6.5*4.5*0.6m": { plnPrice: 1197.64, plnMargin: 1197.64, intranetId: 18285, category: "bramy pneumatyczne", origin: "Polska", noPrice: true },
  "SAMPLE_adGate_Air_1/2_GR": { plnPrice: 1279.92, plnMargin: 1213.25, intranetId: 19134, category: "namioty", origin: "Polska", noPrice: true },
  "SAMPLE_adTribune Flex Lock (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19292, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_adTribune Flex Simple( bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19569, category: "inne", origin: "NULL", noPrice: true },
  "Sample_adTribune PVC Oval (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19306, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "SAMPLE_Adtribune quick kidney": { plnPrice: 308.31, plnMargin: 308.31, intranetId: 18956, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Adtribune quick round": { plnPrice: 273.27, plnMargin: 273.27, intranetId: 18955, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Adtribune_KR_oval": { plnPrice: 0, plnMargin: 0, intranetId: 18374, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Adtribune_KR_round": { plnPrice: 0, plnMargin: 0, intranetId: 18373, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Adtribune_quick_AUTO": { plnPrice: 400.35, plnMargin: 400.35, intranetId: 18342, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_adTunel_Air_GR": { plnPrice: 3231, plnMargin: 3164.33, intranetId: 19135, category: "namioty", origin: "Polska", noPrice: true },
  "SAMPLE_Advideo A-board 43`": { plnPrice: 1546.63, plnMargin: 1513.3, intranetId: 19759, category: "digital", origin: "NULL", noPrice: true },
  "Sample_adVideo Stand 32` ver3": { plnPrice: 1841.59, plnMargin: 1841.59, intranetId: 18675, category: "digital", origin: "Polska", noPrice: true },
  "SAMPLE_adVideo Stand Flex 32`": { plnPrice: 1886.93, plnMargin: 1853.6, intranetId: 19724, category: "digital", origin: "NULL", noPrice: true },
  "SAMPLE_adVideo Stand Surface 32`": { plnPrice: 2155.17, plnMargin: 2121.84, intranetId: 19725, category: "digital", origin: "NULL", noPrice: true },
  "SAMPLE_adWall Vario Prosta 300 Ø43 w torbie na kółkach (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19416, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "SAMPLE_adWall Vario Prosta Black 240 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19415, category: "hardware", origin: "Polska", noPrice: true },
  "SAMPLE_adWall Vario Prosta Black 300 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19414, category: "hardware", origin: "Polska", noPrice: true },
  "SAMPLE_adWall Vario Prosta Black 400 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19413, category: "hardware", origin: "Polska", noPrice: true },
  "SAMPLE_adWall Vario Prosta Black 500 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19412, category: "hardware", origin: "Polska", noPrice: true },
  "SAMPLE_adWall Vario Prosta Black 600 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19411, category: "hardware", origin: "Polska", noPrice: true },
  "SAMPLE_Auto Counter 1.0": { plnPrice: 0, plnMargin: 0, intranetId: 18268, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_BIG INSTALED 3000- 2500MM": { plnPrice: 0, plnMargin: 0, intranetId: 18469, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Curve 180 degrees connector-right": { plnPrice: 0, plnMargin: 0, intranetId: 18299, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_ECO POD Counter 1000x1000x1000MM SET": { plnPrice: 0, plnMargin: 0, intranetId: 19148, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_ECO POD Counter 500x1000x1000MM SET": { plnPrice: 0, plnMargin: 0, intranetId: 19151, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_ECO POD Counter 500x1500x1000MM SET": { plnPrice: 0, plnMargin: 0, intranetId: 19150, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_ECO POD Counter 500x500x1000MM SET": { plnPrice: 0, plnMargin: 0, intranetId: 19152, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Foldable counter 100x100 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18273, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "SAMPLE_inflatable wall`s frame4*3m": { plnPrice: 1281.11, plnMargin: 1281.11, intranetId: 18286, category: "outdoor", origin: "Polska", noPrice: true },
  "SAMPLE_INSTALED 1000-2000MM": { plnPrice: 0, plnMargin: 0, intranetId: 18468, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Iron plate 20kg": { plnPrice: 0, plnMargin: 0, intranetId: 19153, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Magic case 1.0": { plnPrice: 0, plnMargin: 0, intranetId: 18267, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Magic case 2.0 (bez wydruku)": { plnPrice: 152.13, plnMargin: 152.13, intranetId: 18348, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_mFrame RAMA 992x992 maskownica wew. LED - prototyp": { plnPrice: 0, plnMargin: 0, intranetId: 18358, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "SAMPLE_Pillow case extension set 100x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18435, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "SAMPLE_Pix of cake": { plnPrice: 0, plnMargin: 0, intranetId: 18271, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Pixlip Pop": { plnPrice: 0, plnMargin: 0, intranetId: 18324, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_PREMIUM COUNTER 1030-1050MM": { plnPrice: 0, plnMargin: 0, intranetId: 18470, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Roll_up-Adstand_premium": { plnPrice: 20.02, plnMargin: 20.02, intranetId: 18341, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Roll_up-DONGHUA": { plnPrice: 20.02, plnMargin: 20.02, intranetId: 18340, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_Roll_up-KR_Display": { plnPrice: 20.02, plnMargin: 20.02, intranetId: 18339, category: "inne", origin: "Polska", noPrice: true },
  "SAMPLE_SEG_TRUSS": { plnPrice: 4804.13, plnMargin: 4804.13, intranetId: 18290, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "SAMPLE_U_shape_podstawa do Vario": { plnPrice: 0, plnMargin: 0, intranetId: 18293, category: "inne", origin: "Polska", noPrice: true },
  "SEGO 100x300": { plnPrice: 1136.32, plnMargin: 1021.66, intranetId: 18493, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO 100x300 (bez wydruku)": { plnPrice: 996.11, plnMargin: 944.44, intranetId: 18673, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO 2.0 100x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19648, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 200x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19647, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 300x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19649, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 400x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19650, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria kabel 2,5m": { plnPrice: 0, plnMargin: 0, intranetId: 19670, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria półstopa lewa": { plnPrice: 20.68, plnMargin: 4.01, intranetId: 19663, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria półstopa prawa": { plnPrice: 0, plnMargin: 0, intranetId: 19664, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria stopa": { plnPrice: 0, plnMargin: 0, intranetId: 19666, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria stopa 180`": { plnPrice: 0, plnMargin: 0, intranetId: 19667, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria stopa twist": { plnPrice: 0, plnMargin: 0, intranetId: 19665, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria uchwyt półka komplet": { plnPrice: 0, plnMargin: 0, intranetId: 19662, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 akcesoria wieszak TV": { plnPrice: 0, plnMargin: 0, intranetId: 19661, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Door Kit 100cm with wheel": { plnPrice: 0, plnMargin: 0, intranetId: 19651, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 extender 100cm pion set": { plnPrice: 0, plnMargin: 0, intranetId: 19671, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 extender 100cm poziom set": { plnPrice: 0, plnMargin: 0, intranetId: 19672, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 profil akcesoria": { plnPrice: 0, plnMargin: 0, intranetId: 19660, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik 180`": { plnPrice: 0, plnMargin: 0, intranetId: 19659, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik 180` top/bottom": { plnPrice: 0, plnMargin: 0, intranetId: 19668, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik 90` zew/zew top/bottom": { plnPrice: 0, plnMargin: 0, intranetId: 19669, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik clamp": { plnPrice: 0, plnMargin: 0, intranetId: 19656, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik Dach": { plnPrice: 0, plnMargin: 0, intranetId: 19652, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik Dach regulowany": { plnPrice: 0, plnMargin: 0, intranetId: 19653, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik nadstawka": { plnPrice: 0, plnMargin: 0, intranetId: 19655, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik Stack": { plnPrice: 0, plnMargin: 0, intranetId: 19654, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik wew/zew": { plnPrice: 20.68, plnMargin: 4.01, intranetId: 19658, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 2.0 Łącznik zew/zew": { plnPrice: 0, plnMargin: 0, intranetId: 19657, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 200x300": { plnPrice: 2072.73, plnMargin: 1892.57, intranetId: 19727, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 200x300 (bez wydruku)": { plnPrice: 1858.29, plnMargin: 1756.62, intranetId: 19726, category: "zabudowy sego", origin: "NULL", noPrice: true },
  "SEGO 300x300": { plnPrice: 2416.76, plnMargin: 2211.1, intranetId: 18494, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO 300x300 (bez wydruku)": { plnPrice: 2134.75, plnMargin: 2016.42, intranetId: 18672, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO 60 Single Side 85x200": { plnPrice: 410.17, plnMargin: 353, intranetId: 17617, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "SEGO 85x200 (bez wydruku)": { plnPrice: 772.65, plnMargin: 755.98, intranetId: 18155, category: "zabudowy sego", origin: "Chiny", noPrice: true },
  "SEGO 85x300": { plnPrice: 1088.5, plnMargin: 978, intranetId: 18490, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO 85x300 (bez wydruku)": { plnPrice: 961.26, plnMargin: 909.59, intranetId: 19252, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO Cubic Counter 100x38x100 (bez wydruku)": { plnPrice: 398.29, plnMargin: 381.62, intranetId: 18531, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO Cubic Counter Door kit for 100x38x100": { plnPrice: 374.91, plnMargin: 358.24, intranetId: 18532, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO extender set 300x250 -> 300x300": { plnPrice: 224.15, plnMargin: 122.48, intranetId: 18872, category: "zabudowy sego", origin: "Polska", noPrice: true },
  "SEGO Extender support bar 25 cm": { plnPrice: 20.68, plnMargin: 4.01, intranetId: 18871, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "SEGO H Connector": { plnPrice: 29.24, plnMargin: 12.57, intranetId: 18905, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "SEGO kabel 3m wysokości": { plnPrice: 0, plnMargin: 0, intranetId: 18492, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "SEGO kabel S 2.6m": { plnPrice: 28.85, plnMargin: 27.18, intranetId: 18291, category: "zabudowy sego akcesoria", origin: "Chiny", noPrice: true },
  "SEGO kabel S 3.5m": { plnPrice: 38.91, plnMargin: 37.24, intranetId: 18773, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "SEGO middle pole 100cm": { plnPrice: 0, plnMargin: 0, intranetId: 19503, category: "zabudowy sego akcesoria", origin: "NULL", noPrice: true },
  "SEGO Mini Display Stand 100x200 (bez wydruku)": { plnPrice: 144.38, plnMargin: 127.71, intranetId: 13552, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "SEGO Mini Display Stand 100x250 (bez wydruku)": { plnPrice: 184.42, plnMargin: 167.75, intranetId: 13553, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "SEGO Outer brochure holder": { plnPrice: 102.7, plnMargin: 86.03, intranetId: 18101, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "SEGO support with middle pole 100cm": { plnPrice: 28.69, plnMargin: 12.02, intranetId: 18032, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "SET1 - Premium Chill Zone": { plnPrice: 6195.59, plnMargin: 4444.11, intranetId: 17981, category: "namioty", origin: "Polska", noPrice: true },
  "SET1 adFrame Smart 100x250 + adtribune smart": { plnPrice: 1540.3, plnMargin: 1372.16, intranetId: 16243, category: "zabudowy smart", origin: "Polska", noPrice: true },
  "SET2 - Zestaw targowy Premium LED": { plnPrice: 5690.35, plnMargin: 5183.27, intranetId: 18085, category: "frames", origin: "Polska", noPrice: true },
  "SET3 - Zestaw targowy Economic Vario": { plnPrice: 1435.71, plnMargin: 1193.98, intranetId: 18098, category: "vario klasyczne ścianki", origin: "Polska", noPrice: true },
  "SET4 - Zestaw eventowy Pop-up LED": { plnPrice: 1667.32, plnMargin: 1474.6, intranetId: 18087, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "SET5 - Zestaw do promocji quick led": { plnPrice: 932.9, plnMargin: 789.63, intranetId: 18089, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "SET8 adFrame Smart 300x250 + 100x250 2szt + adtribune smart": { plnPrice: 6290.6, plnMargin: 5809.42, intranetId: 16256, category: "zabudowy smart", origin: "Polska", noPrice: true },
  "Skrzynia transportowa": { plnPrice: 0, plnMargin: 0, intranetId: 15874, category: "zabudowy mframe akcesoria", origin: "Polska", noPrice: true },
  "Stacking Pole": { plnPrice: 0, plnMargin: 0, intranetId: 18906, category: "zabudowy sego akcesoria", origin: "Polska", noPrice: true },
  "stoisko adframe LMD kantorek 130x100x250 (bez wydruku)": { plnPrice: 3158.57, plnMargin: 2185.83, intranetId: 17481, category: "frames", origin: "Polska", noPrice: true },
  "stoisko FOLDABLE 5x4 \"I\"": { plnPrice: 1247.5, plnMargin: 1091.76, intranetId: 16998, category: "zabudowy foldable", origin: "Polska", noPrice: true },
  "stoisko mFrame - ZABUDOWY 3x3 \"L\"": { plnPrice: 3068.13, plnMargin: 2674.04, intranetId: 17015, category: "zabudowy mframe", origin: "Polska", noPrice: true },
  "stoisko Multiframe 250 2x3 \"I\" (bez wydruku)": { plnPrice: 2023.65, plnMargin: 1883.65, intranetId: 17386, category: "zabudowy multiframe", origin: "Chiny", noPrice: true },
  "Stoisko Multiframe 250 2x3 \"L\"": { plnPrice: 3946.46, plnMargin: 3563.88, intranetId: 17089, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "stoisko Multiframe 250 4x3 \"L\" bez kantorka": { plnPrice: 0, plnMargin: 0, intranetId: 19110, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "stoisko Multiframe 250 4x3 \"U\" bez kantorka": { plnPrice: 0, plnMargin: 0, intranetId: 19111, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "stoisko Multiframe 250 5x4 \"I\"": { plnPrice: 0, plnMargin: 0, intranetId: 17094, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "stoisko Multiframe 250 5x4 \"L\" bez kantorka": { plnPrice: 0, plnMargin: 0, intranetId: 19112, category: "zabudowy multiframe", origin: "Polska", noPrice: true },
  "Stolik Kawowy Ostia biały": { plnPrice: 151.89, plnMargin: 138.56, intranetId: 11293, category: "adfloor", origin: "Polska", noPrice: true },
  "Styk metal. męski PWM-TL": { plnPrice: 0.04, plnMargin: 0, intranetId: 13427, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Styk metal. żeński PHM-TL": { plnPrice: 0.17, plnMargin: 0.01, intranetId: 13425, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Stół Capri okrągły 100 biały blat bez nóg": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 17469, category: "modular", origin: "Polska", noPrice: true },
  "Sznurek biały do zamka Vario": { plnPrice: 6.6, plnMargin: 0.6, intranetId: 18168, category: "outdoor", origin: "Polska", noPrice: true },
  "Sznurek czarny do zamka Vario": { plnPrice: 6.6, plnMargin: 0.6, intranetId: 18502, category: "outdoor", origin: "Polska", noPrice: true },
  "Sznurek do Air Tent Premium 5x5": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 13580, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Sznurek OUTDOOR": { plnPrice: 0.2, plnMargin: 0.02, intranetId: 14858, category: "outdoor akcesoria", origin: "Polska", noPrice: true },
  "Sznurek tapicerski z rdzeniem": { plnPrice: 0.23, plnMargin: 0.02, intranetId: 14859, category: "outdoor", origin: "Polska", noPrice: true },
  "Taśma magazynowa przeźroczysta": { plnPrice: 2.34, plnMargin: 0.15, intranetId: 18315, category: "inne", origin: "Polska", noPrice: true },
  "Taśma silikonowa 15mm czerwona": { plnPrice: 0, plnMargin: 0, intranetId: 16194, category: "classic", origin: "Polska", noPrice: true },
  "Taśma silikonowa 8mm przezroczysta": { plnPrice: 0.35, plnMargin: 0.03, intranetId: 12354, category: "classic", origin: "Polska", noPrice: true },
  "Taśma silikonowa do zasilaczy": { plnPrice: 2.15, plnMargin: 0.2, intranetId: 17383, category: "classic", origin: "Polska", noPrice: true },
  "TELEWIZOR LCD 55\" NOWY": { plnPrice: 2881.47, plnMargin: 2879.8, intranetId: 17704, category: "rental", origin: "Polska", noPrice: true },
  "testadTent Air premium 3x3 (stelaż+dach) test": { plnPrice: 0, plnMargin: 0, intranetId: 19600, category: "namioty", origin: "NULL", noPrice: true },
  "test_adFrame LMD STANDARD (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19459, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD STANDARD WARIANTY": { plnPrice: 0, plnMargin: 0, intranetId: 19443, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD SZEROKOŚĆ": { plnPrice: 0, plnMargin: 0, intranetId: 19481, category: "ramy tekstylne custom podświetlane", origin: "NULL", noPrice: true },
  "test_adFrame LMD WARIANT ILOŚĆ PROFILI PIONOWYCH": { plnPrice: 0, plnMargin: 0, intranetId: 19480, category: "ramy tekstylne custom podświetlane", origin: "NULL", noPrice: true },
  "test_adFrame LMD WARIANT ILOŚĆ PROFILI POZIOMYCH": { plnPrice: 0, plnMargin: 0, intranetId: 19479, category: "ramy tekstylne custom podświetlane", origin: "NULL", noPrice: true },
  "test_adFrame LMD WYSOKOŚĆ": { plnPrice: 0, plnMargin: 0, intranetId: 19482, category: "ramy tekstylne custom podświetlane", origin: "NULL", noPrice: true },
  "test_adFrame LMD ━ zestaw łączników": { plnPrice: 456.39, plnMargin: 380.87, intranetId: 19453, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD ┃ zestaw łączników": { plnPrice: 414.11, plnMargin: 333.83, intranetId: 19452, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD ┃┃ zestaw łączników": { plnPrice: 267.27, plnMargin: 211.75, intranetId: 19458, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD ╋ zestaw łączników": { plnPrice: 415.78, plnMargin: 333.83, intranetId: 19444, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD ╋╋ (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19449, category: "ramy tekstylne custom podświetlane", origin: "NULL", noPrice: true },
  "test_adFrame LMD ╋╋ zestaw łączników": { plnPrice: 597.62, plnMargin: 455.91, intranetId: 19450, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD ╋╋╋ zestaw łączników": { plnPrice: 769.1, plnMargin: 632.63, intranetId: 19451, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "test_adFrame LMD ═ zestaw łączników": { plnPrice: 267.27, plnMargin: 211.75, intranetId: 19457, category: "ramy tekstylne custom podświetlane", origin: "Polska", noPrice: true },
  "Torba adStand 085": { plnPrice: 88.69, plnMargin: 87.02, intranetId: 10155, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Torba adStand 100 lux/eco": { plnPrice: 22.46, plnMargin: 1.89, intranetId: 16206, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Torba adStand 120": { plnPrice: 26.85, plnMargin: 25.18, intranetId: 10157, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Torba adStand 120 - wzmacniana": { plnPrice: 152.5, plnMargin: 150.83, intranetId: 16032, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Torba do adFrame Quick 100x200 - na kółkach": { plnPrice: 329, plnMargin: 117.5, intranetId: 12434, category: "ramy tekstylne akcesoria", origin: "4202129990", noPrice: true },
  "Torba L080": { plnPrice: 45.75, plnMargin: 44.08, intranetId: 10217, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Torba L100": { plnPrice: 19.23, plnMargin: 17.56, intranetId: 10218, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Torba L120": { plnPrice: 56.75, plnMargin: 55.08, intranetId: 10219, category: "rollupy akcesoria", origin: "Chiny", noPrice: true },
  "Torba na kółkach Air Tent uniwersalna": { plnPrice: 86.9, plnMargin: 86.9, intranetId: 15872, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "Torba Standard / SEG": { plnPrice: 68.04, plnMargin: 66.37, intranetId: 10222, category: "trybunki reklamowe akcesoria", origin: "Chiny", noPrice: true },
  "Torba Vario VC/FL": { plnPrice: 82.68, plnMargin: 77.68, intranetId: 10963, category: "vario akcesoria", origin: "Chiny", noPrice: true },
  "Tuba 12x100cm - wydruk AdPoster L100/Shell": { plnPrice: 4.62, plnMargin: 4.62, intranetId: 11358, category: "półprodukty", origin: "Polska", noPrice: true },
  "Tuba 12x120cm - wydruk AdPoster L120": { plnPrice: 6.82, plnMargin: 6.82, intranetId: 11359, category: "półprodukty", origin: "Polska", noPrice: true },
  "Tuba 12x80cm - wydruk AdPoster L80": { plnPrice: 4.55, plnMargin: 4.55, intranetId: 11357, category: "półprodukty", origin: "Polska", noPrice: true },
  "Tusz ELVAJET OPAL SB BLACK": { plnPrice: 149.15, plnMargin: 9.75, intranetId: 16105, category: "modern", origin: "Polska", noPrice: true },
  "Tusz ELVAJET OPAL SB CYAN": { plnPrice: 149.15, plnMargin: 9.75, intranetId: 16102, category: "modern", origin: "Polska", noPrice: true },
  "Tusz ELVAJET OPAL SB MAGENTA": { plnPrice: 149.15, plnMargin: 9.75, intranetId: 16103, category: "modern", origin: "Polska", noPrice: true },
  "Tusz ELVAJET OPAL SB YELLOW": { plnPrice: 152.9, plnMargin: 13.9, intranetId: 16104, category: "modern", origin: "Polska", noPrice: true },
  "Tusz J-ECO SUBLY NANO ABSOLUTE BLACK 1LT WH": { plnPrice: 191.53, plnMargin: 12.53, intranetId: 16554, category: "modern", origin: "Polska", noPrice: true },
  "Tusz J-ECO SUBLY NANO CYAN 1LT WH": { plnPrice: 191.53, plnMargin: 12.53, intranetId: 16551, category: "modern", origin: "Polska", noPrice: true },
  "Tusz J-ECO SUBLY NANO MAGENTA 1LT WH": { plnPrice: 191.53, plnMargin: 12.53, intranetId: 16552, category: "modern", origin: "Polska", noPrice: true },
  "Tusz J-ECO SUBLY NANO YELLOW 1LT WH": { plnPrice: 191.53, plnMargin: 12.53, intranetId: 16553, category: "modern", origin: "Polska", noPrice: true },
  "Tusz KIIAN DIGISTAR k-perform BLACK": { plnPrice: 1177.39, plnMargin: 77.02, intranetId: 19364, category: "modern", origin: "Polska", noPrice: true },
  "Tusz KIIAN DIGISTAR k-perform CYAN": { plnPrice: 1177.39, plnMargin: 77.02, intranetId: 19363, category: "modern", origin: "Polska", noPrice: true },
  "Tusz KIIAN DIGISTAR k-perform MAGENTA": { plnPrice: 1177.39, plnMargin: 77.02, intranetId: 19365, category: "modern", origin: "Polska", noPrice: true },
  "Tusz KIIAN DIGISTAR k-perform YELLOW": { plnPrice: 1177.39, plnMargin: 77.02, intranetId: 19366, category: "modern", origin: "Polska", noPrice: true },
  "Tusz MSS MBIS ink BLACK BAG 2000ML": { plnPrice: 258.12, plnMargin: 16.88, intranetId: 15046, category: "modern", origin: "Polska", noPrice: true },
  "Tusz MSS MBIS ink CYAN BAG 2000ML": { plnPrice: 258.12, plnMargin: 16.88, intranetId: 15047, category: "modern", origin: "Polska", noPrice: true },
  "Tusz MSS MBIS ink MAGENTA BAG 2000ML": { plnPrice: 258.12, plnMargin: 16.88, intranetId: 15048, category: "modern", origin: "Polska", noPrice: true },
  "Tusz MSS MBIS ink YELLOW BAG 2000ML": { plnPrice: 258.12, plnMargin: 16.88, intranetId: 15049, category: "modern", origin: "Polska", noPrice: true },
  "U_shape_podstawa do Vario_ set (2szt)": { plnPrice: 120.11, plnMargin: 120.11, intranetId: 18412, category: "inne", origin: "Polska", noPrice: true },
  "Vario Light support": { plnPrice: 15.01, plnMargin: 10.01, intranetId: 17936, category: "vario akcesoria", origin: "Polska", noPrice: true },
  "VideoWall BOX PROTECT ver3 P1.93": { plnPrice: 762.35, plnMargin: 762.35, intranetId: 17832, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall CABLE POWER CONNECTOR": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 15398, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall CABLE POWER INPUT": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 15400, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall CABLE SIGNAL CONNECTOR": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 15399, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall CABLE SIGNAL INPUT": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 15401, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall MASTER HUB Novastar MCTRL4K": { plnPrice: 51.07, plnMargin: 1.07, intranetId: 18380, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall MASTER HUB VX10x15 HDMI": { plnPrice: 4794.09, plnMargin: 4744.09, intranetId: 17486, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall MASTER HUB VX4x15 HDMI": { plnPrice: 4794.09, plnMargin: 4744.09, intranetId: 17484, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall MASTER HUB VX4x15 USB": { plnPrice: 4664.71, plnMargin: 4614.71, intranetId: 15402, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall MASTER HUB VX6x15 HDMI": { plnPrice: 4794.09, plnMargin: 4744.09, intranetId: 17485, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall PANEL CORNER LEFT ver3 P1.93": { plnPrice: 2823.09, plnMargin: 2806.42, intranetId: 17827, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall PANEL CORNER RIGHT ver3 P1.93": { plnPrice: 2823.09, plnMargin: 2806.42, intranetId: 17828, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall PANEL CORNER SET ver1": { plnPrice: 4300.36, plnMargin: 4283.69, intranetId: 15395, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall PANEL SIDE COVER 496 MM ver3 P1.93": { plnPrice: 76.73, plnMargin: 60.06, intranetId: 17831, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall PANEL SIDE COVER 992 MM ver3 P1.93": { plnPrice: 136.78, plnMargin: 120.11, intranetId: 17830, category: "modular", origin: "Polska", noPrice: true },
  "VideoWall PANEL ver1": { plnPrice: 2448.27, plnMargin: 2431.6, intranetId: 15394, category: "digital", origin: "Polska", noPrice: true },
  "VideoWall PANEL ver2": { plnPrice: 2418.74, plnMargin: 2402.07, intranetId: 17483, category: "modular", origin: "Polska", noPrice: true },
  "Weryfikacja reklamacji Classic o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18317, category: "inne", origin: "Polska", noPrice: true },
  "Weryfikacja reklamacji Kasetony o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18318, category: "inne", origin: "Polska", noPrice: true },
  "Weryfikacja reklamacji Zabudowy o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18320, category: "inne", origin: "Polska", noPrice: true },
  "Weryfikacja zwrotu Classic o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18164, category: "inne", origin: "Polska", noPrice: true },
  "Weryfikacja zwrotu Kasetony o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18165, category: "inne", origin: "Polska", noPrice: true },
  "Weryfikacja zwrotu Zabudowy o nr paczki:": { plnPrice: 50, plnMargin: 0, intranetId: 18166, category: "inne", origin: "Polska", noPrice: true },
  "WIESZAK TV - VESA 26-55\" szeroki": { plnPrice: 53, plnMargin: 51.33, intranetId: 11385, category: "zabudowy akcesoria", origin: "Polska", noPrice: true },
  "WIESZAK TV - VESA 26-55\" wąski": { plnPrice: 46.61, plnMargin: 44.94, intranetId: 16357, category: "zabudowy akcesoria", origin: "Polska", noPrice: true },
  "Wkręt samotnący M4/25mm": { plnPrice: 0.06, plnMargin: 0, intranetId: 19798, category: "classic", origin: "NULL", noPrice: true },
  "Woreczek strunowy 23x32cm": { plnPrice: 0.37, plnMargin: 0.02, intranetId: 16484, category: "inne", origin: "Polska", noPrice: true },
  "Woreczek strunowy 23x32cm - wzmocniony kasetony": { plnPrice: 0.94, plnMargin: 0.06, intranetId: 18022, category: "inne", origin: "Polska", noPrice: true },
  "Worek foliowy na owijkę": { plnPrice: 0.41, plnMargin: 0.41, intranetId: 15068, category: "półprodukty", origin: "Polska", noPrice: true },
  "Worek na akcesoria do Air Tent Premium": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 13569, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Worek na wydruki foliowy 50x80cm": { plnPrice: 0, plnMargin: 0, intranetId: 18323, category: "modern", origin: "Polska", noPrice: true },
  "Worek na wydruki foliowy 60x40x100cm": { plnPrice: 0, plnMargin: 0, intranetId: 17837, category: "modern", origin: "Polska", noPrice: true },
  "Worek na wydruki L (55*90cm)": { plnPrice: 3.26, plnMargin: 0.3, intranetId: 12432, category: "modern", origin: "Polska", noPrice: true },
  "Wspornik markizy Air Tent Premium 4x4": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 13585, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Wspornik markizy Air Tent Premium 5x5": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 13586, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Wydruk adBeanbag": { plnPrice: 200.09, plnMargin: 55.76, intranetId: 19679, category: "meble reklamowe", origin: "NULL", noPrice: true },
  "Wydruk adBoard OWZ A0": { plnPrice: 63.14, plnMargin: 31.84, intranetId: 15958, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk adBoard OWZ B2": { plnPrice: 33.62, plnMargin: 14.69, intranetId: 16559, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk adChair inflate": { plnPrice: 151.77, plnMargin: 64.12, intranetId: 19095, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Wydruk adFlag DROP L": { plnPrice: 85.36, plnMargin: 17.53, intranetId: 15670, category: "wydruk flaga", origin: "Polska", noPrice: true },
  "Wydruk adFlag DROP S": { plnPrice: 67.44, plnMargin: 12, intranetId: 15671, category: "wydruk flaga", origin: "Polska", noPrice: true },
  "Wydruk adFlag DROP XL": { plnPrice: 129.29, plnMargin: 42.9, intranetId: 15672, category: "wydruk flaga", origin: "Polska", noPrice: true },
  "Wydruk adFloor na folii": { plnPrice: 56.51, plnMargin: 13.46, intranetId: 17754, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk adFloor na folii połysk": { plnPrice: 0, plnMargin: 0, intranetId: 19802, category: "wydruk classic", origin: "NULL", noPrice: true },
  "Wydruk adFoam Via": { plnPrice: 330.13, plnMargin: 73.89, intranetId: 11373, category: "wydruk meble reklamowe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 100x100": { plnPrice: 83.55, plnMargin: 36.81, intranetId: 14720, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 100x150": { plnPrice: 76.14, plnMargin: 37.74, intranetId: 14721, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 100x250": { plnPrice: 79.66, plnMargin: 39.59, intranetId: 14723, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 150x150": { plnPrice: 108.92, plnMargin: 53.31, intranetId: 15267, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 150x250": { plnPrice: 112.45, plnMargin: 55.17, intranetId: 15239, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 200x200": { plnPrice: 129.38, plnMargin: 69.52, intranetId: 15240, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 300x200": { plnPrice: 167.94, plnMargin: 100.17, intranetId: 15242, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 300x250": { plnPrice: 163.25, plnMargin: 101.06, intranetId: 15243, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 500x200": { plnPrice: 243.03, plnMargin: 161.33, intranetId: 15246, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 500x250": { plnPrice: 243.96, plnMargin: 162.26, intranetId: 15247, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 600x250": { plnPrice: 283.39, plnMargin: 192.86, intranetId: 15254, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame Blockout 60x100": { plnPrice: 85.5, plnMargin: 36.14, intranetId: 15268, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF 100x100 - górny blockout": { plnPrice: 73.59, plnMargin: 36.97, intranetId: 15261, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF 100x150": { plnPrice: 76.19, plnMargin: 37.9, intranetId: 15231, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF 100x200": { plnPrice: 75.45, plnMargin: 38.83, intranetId: 15143, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF 120x30": { plnPrice: 48.7, plnMargin: 15.93, intranetId: 15150, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF 200x200": { plnPrice: 116.55, plnMargin: 69.43, intranetId: 15144, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF 30x30": { plnPrice: 47.02, plnMargin: 14.25, intranetId: 15149, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF 50x100": { plnPrice: 55.55, plnMargin: 21.68, intranetId: 15141, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF LED 100x150": { plnPrice: 70.58, plnMargin: 30.63, intranetId: 15266, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame CTF LED 50x100": { plnPrice: 43.1, plnMargin: 17.56, intranetId: 15264, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame DTF 100x200": { plnPrice: 79.95, plnMargin: 38.93, intranetId: 14830, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame DTF 150x210": { plnPrice: 105.04, plnMargin: 54.43, intranetId: 19025, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame DTF 150x250": { plnPrice: 105.78, plnMargin: 55.17, intranetId: 14826, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame DTF 80x200": { plnPrice: 72.47, plnMargin: 30.95, intranetId: 14564, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk Adframe Flex Led 300x250 tył": { plnPrice: 155.98, plnMargin: 101.03, intranetId: 18550, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame GO 200x250": { plnPrice: 102.96, plnMargin: 56.85, intranetId: 19484, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk adFrame GO 200x250 tył": { plnPrice: 102.96, plnMargin: 56.85, intranetId: 19487, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk adFrame GO 300x250": { plnPrice: 136.08, plnMargin: 81.13, intranetId: 19488, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk adFrame GO 300x250 tył": { plnPrice: 136.08, plnMargin: 81.13, intranetId: 19489, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Adframe GO 400x250": { plnPrice: 170.85, plnMargin: 105.4, intranetId: 19490, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Adframe GO 400x250 tył": { plnPrice: 172.72, plnMargin: 107.27, intranetId: 19491, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Adframe GO 500x250": { plnPrice: 200.63, plnMargin: 129.68, intranetId: 19701, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Adframe GO 500x250 tył": { plnPrice: 200.63, plnMargin: 129.68, intranetId: 19702, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 120x200": { plnPrice: 74.35, plnMargin: 31.66, intranetId: 15166, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 198,4x248": { plnPrice: 110.17, plnMargin: 56.88, intranetId: 19847, category: "wydruk ramy tekstylne standard podświetlane", origin: "NULL", noPrice: true },
  "wydruk adFrame LMD/LMS/LMSM 198,4x297,6cm": { plnPrice: 143.92, plnMargin: 80.23, intranetId: 19253, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 200x300": { plnPrice: 140.59, plnMargin: 80.23, intranetId: 19772, category: "wydruk ramy tekstylne standard podświetlane", origin: "NULL", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 200x350": { plnPrice: 136.87, plnMargin: 76.51, intranetId: 18133, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 297,6x99,2": { plnPrice: 140.2, plnMargin: 76.51, intranetId: 19256, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 60x100": { plnPrice: 70, plnMargin: 29.05, intranetId: 14714, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 99,2x24,8": { plnPrice: 0, plnMargin: 0, intranetId: 18979, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame LMD/LMS/LMSM 99,2x99,2": { plnPrice: 79.17, plnMargin: 29.81, intranetId: 19258, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame LPO 100x100": { plnPrice: 54.17, plnMargin: 29.51, intranetId: 16288, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame LPO 100x292,5": { plnPrice: 125.41, plnMargin: 78.08, intranetId: 16290, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Lumina RGB 100x200 tył": { plnPrice: 55.29, plnMargin: 28.96, intranetId: 18426, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Lumina RGB 100x250 FLAG": { plnPrice: 44.78, plnMargin: 16.79, intranetId: 18932, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Lumina RGB 100x250 tył": { plnPrice: 60.29, plnMargin: 32.3, intranetId: 18421, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Lumina RGB 100x250 tył FLAG": { plnPrice: 44.78, plnMargin: 16.79, intranetId: 18933, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Lumina RGB BIAŁY 100x200 tył": { plnPrice: 64.96, plnMargin: 38.64, intranetId: 18427, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Lumina RGB BIAŁY 300x250 tył": { plnPrice: 177.64, plnMargin: 101.03, intranetId: 18429, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "wydruk adFrame Pixlip 300x225": { plnPrice: 124.9, plnMargin: 80.61, intranetId: 18769, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "wydruk adFrame Pixlip 85x200": { plnPrice: 53.66, plnMargin: 24.81, intranetId: 18764, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Poster 100x250": { plnPrice: 56.96, plnMargin: 32.3, intranetId: 16741, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Quick 100x250 tył": { plnPrice: 56.96, plnMargin: 32.3, intranetId: 17193, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Quick 85x200 tył": { plnPrice: 49.45, plnMargin: 25.62, intranetId: 18179, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Quick 85x250 tył": { plnPrice: 51.55, plnMargin: 27.72, intranetId: 18113, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Quick Battery 100x200 tył": { plnPrice: 53.24, plnMargin: 29.97, intranetId: 17191, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Quick Battery 85x200": { plnPrice: 50.77, plnMargin: 26.66, intranetId: 16124, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Slim 100x250 - 65mm tył": { plnPrice: 56.03, plnMargin: 31.37, intranetId: 18536, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame SLM (BIAŁY blockout) 992x992": { plnPrice: 95.55, plnMargin: 44.25, intranetId: 18574, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame SLM 992x2480": { plnPrice: 76.4, plnMargin: 34.83, intranetId: 19337, category: "wydruk ramy tekstylne standard podświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 100x100": { plnPrice: 64.66, plnMargin: 29.71, intranetId: 15780, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 100x100 tył": { plnPrice: 64.66, plnMargin: 29.71, intranetId: 17199, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 100x200 tył": { plnPrice: 59.11, plnMargin: 29.16, intranetId: 17200, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 100x250 tył": { plnPrice: 60.79, plnMargin: 32.5, intranetId: 17201, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 200x200 tył": { plnPrice: 95.84, plnMargin: 51.39, intranetId: 17202, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 200x250 tył": { plnPrice: 102.96, plnMargin: 56.85, intranetId: 17203, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 300x200 tył": { plnPrice: 126.85, plnMargin: 73.57, intranetId: 17204, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 300x250 tył": { plnPrice: 136.08, plnMargin: 81.13, intranetId: 17205, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Smart 85x250 tył": { plnPrice: 57.98, plnMargin: 28.85, intranetId: 17565, category: "ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Starter 100x200 tył": { plnPrice: 51.95, plnMargin: 28.96, intranetId: 17194, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame Starter 100x250 tył": { plnPrice: 56.96, plnMargin: 32.3, intranetId: 17195, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 100x100": { plnPrice: 74.88, plnMargin: 28.86, intranetId: 17954, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 200x250": { plnPrice: 120.08, plnMargin: 55.12, intranetId: 17962, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 400x200": { plnPrice: 184.01, plnMargin: 101.15, intranetId: 17966, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 400x250": { plnPrice: 184.93, plnMargin: 102.07, intranetId: 17967, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 500x250": { plnPrice: 213.89, plnMargin: 125.53, intranetId: 17969, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 50x50": { plnPrice: 59.4, plnMargin: 16.2, intranetId: 17972, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 600x250": { plnPrice: 252.87, plnMargin: 149.01, intranetId: 17974, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adFrame STF/STFL 84x118": { plnPrice: 72.31, plnMargin: 25.93, intranetId: 14605, category: "wydruk ramy tekstylne standard niepodświetlane", origin: "Polska", noPrice: true },
  "Wydruk adPuff inflate": { plnPrice: 108.41, plnMargin: 41.83, intranetId: 19092, category: "meble reklamowe", origin: "Polska", noPrice: true },
  "Wydruk adStand 120": { plnPrice: 58.82, plnMargin: 26.4, intranetId: 10717, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand 150": { plnPrice: 65.59, plnMargin: 31.5, intranetId: 10718, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand Basic 85": { plnPrice: 51.8, plnMargin: 19.37, intranetId: 19690, category: "wydruk rollup", origin: "NULL", noPrice: true },
  "Wydruk adStand Drop 120": { plnPrice: 63.83, plnMargin: 26.4, intranetId: 18659, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand L 100": { plnPrice: 55.14, plnMargin: 20.71, intranetId: 10732, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand L 120": { plnPrice: 57.13, plnMargin: 23.58, intranetId: 10733, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand L 150": { plnPrice: 68.37, plnMargin: 28.15, intranetId: 10734, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand L 60": { plnPrice: 47.55, plnMargin: 18.12, intranetId: 12238, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand L 80": { plnPrice: 55.14, plnMargin: 20.71, intranetId: 10731, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand Level 100": { plnPrice: 69.28, plnMargin: 25.43, intranetId: 10754, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand Level 85": { plnPrice: 69.28, plnMargin: 25.43, intranetId: 10755, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand Light 85": { plnPrice: 51.8, plnMargin: 19.37, intranetId: 12263, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand LUX 120": { plnPrice: 59.81, plnMargin: 24.15, intranetId: 10751, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "Wydruk adStand Octa 100": { plnPrice: 59.56, plnMargin: 22.13, intranetId: 19544, category: "wydruk classic", origin: "NULL", noPrice: true },
  "Wydruk adStand Octa 85": { plnPrice: 56.8, plnMargin: 19.37, intranetId: 19546, category: "wydruk classic", origin: "NULL", noPrice: true },
  "Wydruk adStand Octa 85 tył": { plnPrice: 56.8, plnMargin: 19.37, intranetId: 19547, category: "wydruk classic", origin: "NULL", noPrice: true },
  "Wydruk adStand TWINS 100": { plnPrice: 59.56, plnMargin: 22.13, intranetId: 11957, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk adStand TWINS 85": { plnPrice: 56.8, plnMargin: 19.37, intranetId: 11958, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk adStand TWINS 85 tył": { plnPrice: 56.8, plnMargin: 19.37, intranetId: 18409, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk adTent Air 3x3 - DACH": { plnPrice: 758.63, plnMargin: 227.51, intranetId: 11100, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk adTent Air 4x4 - DACH": { plnPrice: 1043.97, plnMargin: 451.91, intranetId: 11101, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk adTent Air premium 1x1 SET": { plnPrice: 250.13, plnMargin: 83.63, intranetId: 18504, category: "namioty", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 3x3 (dach+4x ściana boczna jednostronna)": { plnPrice: 1420.83, plnMargin: 770.9, intranetId: 14020, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 3x3 (sama noga)": { plnPrice: 96.7, plnMargin: 65.81, intranetId: 16640, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 3x3 (same nogi 2)": { plnPrice: 138.41, plnMargin: 97.87, intranetId: 16639, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 3x3 (same nogi 3)": { plnPrice: 178.47, plnMargin: 131.33, intranetId: 16638, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 3x3 (ściana boczna blockout jednostronna": { plnPrice: 169.44, plnMargin: 90.82, intranetId: 15859, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 4x4 (same nogi 2)": { plnPrice: 158.44, plnMargin: 114.6, intranetId: 17293, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 4x4 (ściana boczna blockout jednostronna": { plnPrice: 234.57, plnMargin: 148.28, intranetId: 17541, category: "outdoor", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 4x6 (dach)": { plnPrice: 1142.44, plnMargin: 541.11, intranetId: 18799, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk adTent Air Premium 4x6 (ściana 4x4 boczna jednostronna_Blockout)": { plnPrice: 231.31, plnMargin: 147.98, intranetId: 19818, category: "wydruk namioty premium", origin: "NULL", noPrice: true },
  "Wydruk adTent Air Premium 4x6 (ściana 4x6 boczna jednostronna Blockout)": { plnPrice: 347.97, plnMargin: 201.14, intranetId: 19820, category: "wydruk namioty premium", origin: "NULL", noPrice: true },
  "Wydruk adTent Air premium 5x5 (dach+4xściana boczna jednostronna)": { plnPrice: 2700.9, plnMargin: 1323.74, intranetId: 14022, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 5x5 (sam dach)": { plnPrice: 888.96, plnMargin: 440.77, intranetId: 17301, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 5x5 (same nogi 2)": { plnPrice: 211.84, plnMargin: 159.2, intranetId: 17298, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 5x5 (ściana boczna blockout jednostronna)": { plnPrice: 237.9, plnMargin: 148.28, intranetId: 18154, category: "outdoor", origin: "Polska", noPrice: true },
  "Wydruk adTent Air premium 5x5 (ściana boczna dwustronna)": { plnPrice: 457.03, plnMargin: 283.25, intranetId: 14026, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk adTent Air PREMIUM 6x6 (dach)": { plnPrice: 1208.91, plnMargin: 645.63, intranetId: 14007, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 6x6 (sama noga)": { plnPrice: 108.38, plnMargin: 75.57, intranetId: 17303, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk Adtent Air premium 6x6 (same nogi 3)": { plnPrice: 223.51, plnMargin: 161.98, intranetId: 17305, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk adTent Air PREMIUM 6x6 (ściana boczna dwustronna)": { plnPrice: 742.02, plnMargin: 502.07, intranetId: 14027, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "Wydruk adTent Air Premium 6x6 (ściana boczna jednostronna) WARIANTY": { plnPrice: 461.7, plnMargin: 306.91, intranetId: 14015, category: "wydruk namioty premium", origin: "Polska", noPrice: true },
  "wydruk adTent EXPRESS 3x3m ŚCIANA BLOCKOUT": { plnPrice: 191.84, plnMargin: 112.06, intranetId: 15849, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "wydruk adTent EXPRESS 3x3m ŚCIANA(DO NAMIOTU 6M)": { plnPrice: 180.18, plnMargin: 108.73, intranetId: 17703, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "wydruk adTent EXPRESS 3x4,5m ŚCIANA BLOCKOUT": { plnPrice: 291.8, plnMargin: 163.78, intranetId: 17222, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "wydruk adTent EXPRESS 3x6m DACH + 4XŚCIANA": { plnPrice: 1885.19, plnMargin: 1170.86, intranetId: 15616, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "wydruk adTent EXPRESS 3x6m ŚCIANA BLOCKOUT": { plnPrice: 348.42, plnMargin: 215.5, intranetId: 16786, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "Wydruk adTent V 4x4 (bok)": { plnPrice: 533.64, plnMargin: 195.14, intranetId: 17582, category: "outdoor", origin: "Polska", noPrice: true },
  "Wydruk adTent V 5x5 (bok)": { plnPrice: 617.02, plnMargin: 223.02, intranetId: 17583, category: "outdoor", origin: "Polska", noPrice: true },
  "Wydruk adTent V 5x5 KOMPLET": { plnPrice: 2113.06, plnMargin: 669.06, intranetId: 17526, category: "outdoor", origin: "Polska", noPrice: true },
  "Wydruk adTent V 6x6 (bok)": { plnPrice: 733.78, plnMargin: 278.78, intranetId: 17584, category: "outdoor", origin: "Polska", noPrice: true },
  "Wydruk adTent V 6x6 KOMPLET": { plnPrice: 2491.34, plnMargin: 836.34, intranetId: 17528, category: "outdoor", origin: "Polska", noPrice: true },
  "Wydruk adTent Vario 3x3 - ściana jednostronna BLOCKOUT": { plnPrice: 203.06, plnMargin: 112.32, intranetId: 18950, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "Wydruk adTent Vario 3x3 - ściana jednostronna WARIANTY": { plnPrice: 199.72, plnMargin: 108.98, intranetId: 15863, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "Wydruk adTent Vario 4x4 - ściana jednostronna BLOCKOUT": { plnPrice: 240.72, plnMargin: 143.93, intranetId: 16483, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "Wydruk adTent Vario 4x4 - ściana jednostronna WARIANTY": { plnPrice: 236.44, plnMargin: 139.65, intranetId: 15864, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "wydruk adTribune Cubic - 3 boki razem": { plnPrice: 66.65, plnMargin: 28.93, intranetId: 18333, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "wydruk adTribune Cubic 100x38x100 bok": { plnPrice: 51.12, plnMargin: 15.31, intranetId: 19262, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "wydruk adTribune Cubic 100x38x100 przód": { plnPrice: 74.39, plnMargin: 35.01, intranetId: 19263, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk adTribune Hit mini": { plnPrice: 52.3, plnMargin: 40.99, intranetId: 10728, category: "wydruk trybunka classic", origin: "Polska", noPrice: true },
  "Wydruk adTribune inflate": { plnPrice: 130.05, plnMargin: 32.06, intranetId: 19094, category: "trybunki reklamowe", origin: "Polska", noPrice: true },
  "Wydruk adTribune Quick Max": { plnPrice: 88.54, plnMargin: 35.55, intranetId: 19746, category: "wydruk trybunka vario", origin: "NULL", noPrice: true },
  "Wydruk adTribune Quick Max LED": { plnPrice: 96.41, plnMargin: 44.35, intranetId: 19747, category: "wydruk trybunka vario", origin: "NULL", noPrice: true },
  "Wydruk adTribune Quick Round": { plnPrice: 70.46, plnMargin: 30.07, intranetId: 19267, category: "wydruk trybunka vario", origin: "Polska", noPrice: true },
  "Wydruk adTribune Quick Square": { plnPrice: 88.54, plnMargin: 35.55, intranetId: 19745, category: "wydruk trybunka vario", origin: "NULL", noPrice: true },
  "Wydruk adTribune Quick Square LED": { plnPrice: 96.41, plnMargin: 44.35, intranetId: 19748, category: "wydruk trybunka vario", origin: "NULL", noPrice: true },
  "Wydruk adUp Vario Trapfloat jednostronny": { plnPrice: 453.9, plnMargin: 174.96, intranetId: 10921, category: "wydruk vario podwieszane", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Add lewy dwustronny": { plnPrice: 262.3, plnMargin: 158.33, intranetId: 13602, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Add lewy jednostronny": { plnPrice: 262.3, plnMargin: 158.33, intranetId: 11083, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Add prawy dwustronny": { plnPrice: 262.3, plnMargin: 158.33, intranetId: 15867, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Add prawy jednostronny": { plnPrice: 262.3, plnMargin: 158.33, intranetId: 15866, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Arch (zestaw A+B)": { plnPrice: 1090.63, plnMargin: 488.59, intranetId: 12502, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Arch A": { plnPrice: 478.64, plnMargin: 244.29, intranetId: 10538, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Arch B": { plnPrice: 478.64, plnMargin: 244.29, intranetId: 10741, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Big Island dwustronny": { plnPrice: 1408.29, plnMargin: 790.59, intranetId: 12504, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Changing Room dwustronny": { plnPrice: 0, plnMargin: 0, intranetId: 12506, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Classic 340 dwustronny": { plnPrice: 320.48, plnMargin: 199.93, intranetId: 12498, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Craft NEW dwustronny": { plnPrice: 1118.71, plnMargin: 674.11, intranetId: 12516, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Craft NEW jednostronny": { plnPrice: 1118.71, plnMargin: 674.11, intranetId: 11883, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Flat Ring Water Base jednostronny": { plnPrice: 211.28, plnMargin: 106.77, intranetId: 16213, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Kite dwustronny": { plnPrice: 0, plnMargin: 0, intranetId: 12526, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto 090 jednostronny": { plnPrice: 114.97, plnMargin: 61.81, intranetId: 10543, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto 120 dwustronny BLOCKOUT": { plnPrice: 238.14, plnMargin: 159.5, intranetId: 19063, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto 120 przód Vario": { plnPrice: 103.71, plnMargin: 78.2, intranetId: 19065, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto 120 tył BLOCKOUT": { plnPrice: 106.54, plnMargin: 81.03, intranetId: 19064, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto 150 dwustronny": { plnPrice: 164.87, plnMargin: 95.11, intranetId: 12576, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto Light 060 dwustronny BLOCKOUT": { plnPrice: 105.57, plnMargin: 54.24, intranetId: 19236, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto Light 060 przód Vario": { plnPrice: 47.06, plnMargin: 26.54, intranetId: 19237, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto Light 060 tył BLOCKOUT": { plnPrice: 48.02, plnMargin: 27.5, intranetId: 19238, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto Light 060/180 dwustronny": { plnPrice: 0, plnMargin: 0, intranetId: 14889, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Presto super light 90 dwustronny": { plnPrice: 114.97, plnMargin: 61.81, intranetId: 16271, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Prosta 280 jednostronny": { plnPrice: 268.94, plnMargin: 166.65, intranetId: 10504, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Prosta Light 240 dwustronny BLOCKOUT": { plnPrice: 258.19, plnMargin: 155.69, intranetId: 19060, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Prosta Light 240 przód VARIO": { plnPrice: 104.73, plnMargin: 76.27, intranetId: 19061, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Prosta Light 240 tył BLOCKOUT": { plnPrice: 109.65, plnMargin: 79.23, intranetId: 19062, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario S 80 dwustronny": { plnPrice: 196.76, plnMargin: 105.57, intranetId: 12630, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario S 80 jednostronny": { plnPrice: 196.76, plnMargin: 105.57, intranetId: 10516, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Serpentyna 600 jednostronny": { plnPrice: 598.86, plnMargin: 379.1, intranetId: 10536, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Slope jednostronny": { plnPrice: 382.1, plnMargin: 205.45, intranetId: 10522, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Tower 3m": { plnPrice: 343.83, plnMargin: 194.38, intranetId: 10743, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Tunel dwustronny": { plnPrice: 1790.8, plnMargin: 1109.51, intranetId: 12650, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Twist": { plnPrice: 642.16, plnMargin: 297.02, intranetId: 10524, category: "wydruk vario crazy", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Łukowa 230 Ø34 jednostronny": { plnPrice: 233.96, plnMargin: 142.17, intranetId: 10512, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Łukowa 360 Ø34 jednostronny": { plnPrice: 367.34, plnMargin: 247.1, intranetId: 10530, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Łukowa 600 Ø43 jednostronny": { plnPrice: 536.94, plnMargin: 358.03, intranetId: 10939, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Łukowa 600 Ø43 jednostronny bez stóp": { plnPrice: 536.94, plnMargin: 358.03, intranetId: 10507, category: "wydruk vario klasyczne kształty", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Łukowa Light 240 dwustronny BLOCKOUT": { plnPrice: 256.04, plnMargin: 155.5, intranetId: 19054, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Łukowa Light 240 przód VARIO": { plnPrice: 104.73, plnMargin: 76.27, intranetId: 19057, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario Łukowa Light 240 tył BLOCKOUT": { plnPrice: 107.49, plnMargin: 79.03, intranetId: 19055, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Presto Light 060 dwustronny": { plnPrice: 100.29, plnMargin: 52.88, intranetId: 12578, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Presto Light 060 jednostronny": { plnPrice: 100.29, plnMargin: 52.88, intranetId: 11714, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Presto Light 090 jednostronny": { plnPrice: 118.57, plnMargin: 63.96, intranetId: 11763, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Presto Light 120 jednostronny": { plnPrice: 141.86, plnMargin: 80.62, intranetId: 11715, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Presto Light 150 dwustronny": { plnPrice: 174.17, plnMargin: 102.87, intranetId: 12584, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Presto Light 150 jednostronny": { plnPrice: 174.17, plnMargin: 102.87, intranetId: 11716, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Prosta Light 240 dwustronny": { plnPrice: 253.26, plnMargin: 152.72, intranetId: 12612, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Prosta Light 240 jednostronny": { plnPrice: 253.26, plnMargin: 152.72, intranetId: 11774, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Prosta Light 300 dwustronny": { plnPrice: 292.2, plnMargin: 186.06, intranetId: 12614, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk adWall Vario-2 Prosta Light 300 jednostronny": { plnPrice: 292.2, plnMargin: 186.06, intranetId: 11776, category: "wydruk vario light", origin: "Polska", noPrice: true },
  "Wydruk Air Column ∅60x100 Tribune NEW (z zaworem)": { plnPrice: 113.39, plnMargin: 39.02, intranetId: 18474, category: "wydruk premium", origin: "Polska", noPrice: true },
  "Wydruk Air Column ∅60x220": { plnPrice: 171.72, plnMargin: 39.02, intranetId: 11614, category: "wydruk premium", origin: "Polska", noPrice: true },
  "Wydruk Air Column ∅60x300": { plnPrice: 268.52, plnMargin: 119.87, intranetId: 11615, category: "wydruk premium", origin: "Polska", noPrice: true },
  "Wydruk Air GATE Square 4,5m": { plnPrice: 725.47, plnMargin: 339.02, intranetId: 11092, category: "wydruk premium", origin: "Polska", noPrice: true },
  "Wydruk Air GATE Square 4,5m ver2": { plnPrice: 725.47, plnMargin: 339.02, intranetId: 17920, category: "wydruk premium", origin: "Polska", noPrice: true },
  "Wydruk Air GATE Square 6,5m": { plnPrice: 753.84, plnMargin: 362.71, intranetId: 18733, category: "wydruk premium", origin: "Polska", noPrice: true },
  "Wydruk Air GATE Triangle 6,5m": { plnPrice: 858.9, plnMargin: 394.78, intranetId: 11096, category: "wydruk premium", origin: "Polska", noPrice: true },
  "Wydruk bok adTribune Flex Lock": { plnPrice: 54.85, plnMargin: 16.47, intranetId: 19295, category: "wydruk trybunka podświetlana", origin: "Polska", noPrice: true },
  "Wydruk bok adTribune Seg": { plnPrice: 39.5, plnMargin: 18.14, intranetId: 12217, category: "wydruk trybunka vario", origin: "Polska", noPrice: true },
  "Wydruk bok adTribune Seg NEW": { plnPrice: 39.5, plnMargin: 18.14, intranetId: 17748, category: "wydruk trybunka vario", origin: "Polska", noPrice: true },
  "Wydruk bryt adWall Smart": { plnPrice: 137.95, plnMargin: 75.08, intranetId: 10242, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk do mFrame rama curved corner arch 1984x1984": { plnPrice: 82.73, plnMargin: 41.16, intranetId: 18788, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk do mFrame rama curved corner arch 992x992": { plnPrice: 82.73, plnMargin: 41.16, intranetId: 18787, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk EDGE 3x3 - FRONT": { plnPrice: 171.35, plnMargin: 87.36, intranetId: 12474, category: "wydruk vario", origin: "Polska", noPrice: true },
  "Wydruk EDGE 3x3/4x3 - BOK": { plnPrice: 61.61, plnMargin: 18.04, intranetId: 12476, category: "wydruk vario", origin: "Polska", noPrice: true },
  "Wydruk EDGE 4x3 - FRONT": { plnPrice: 204.58, plnMargin: 115.09, intranetId: 12475, category: "wydruk vario", origin: "Polska", noPrice: true },
  "Wydruk EDGE Backlit Tribune 1x1 White - BOK": { plnPrice: 60.71, plnMargin: 17.13, intranetId: 12326, category: "wydruk trybunka podświetlana", origin: "Polska", noPrice: true },
  "Wydruk EDGE Backlit Tribune 1x1 White - FRONT": { plnPrice: 75.51, plnMargin: 29.18, intranetId: 12304, category: "wydruk trybunka podświetlana", origin: "Polska", noPrice: true },
  "Wydruk EDGE Plus - BOK": { plnPrice: 61.61, plnMargin: 18.04, intranetId: 12322, category: "wydruk vario", origin: "Polska", noPrice: true },
  "Wydruk EDGE Plus 1x3S SS - FRONT": { plnPrice: 96.58, plnMargin: 24.96, intranetId: 12324, category: "wydruk vario", origin: "Polska", noPrice: true },
  "Wydruk EDGE Plus 2x3S SS - FRONT": { plnPrice: 121.51, plnMargin: 45.77, intranetId: 12323, category: "wydruk vario", origin: "Polska", noPrice: true },
  "Wydruk EDGE Plus 4x3S SS - FRONT": { plnPrice: 171.35, plnMargin: 87.36, intranetId: 12308, category: "wydruk vario", origin: "Polska", noPrice: true },
  "Wydruk Foldable 600x250": { plnPrice: 262.84, plnMargin: 190.68, intranetId: 17756, category: "wydruk blockout foldable", origin: "Polska", noPrice: true },
  "Wydruk Foldable 900x250": { plnPrice: 367.84, plnMargin: 280.01, intranetId: 19769, category: "wydruk blockout foldable", origin: "NULL", noPrice: true },
  "Wydruk Foldable pasowanie": { plnPrice: 0, plnMargin: 0, intranetId: 19801, category: "wydruk blockout foldable", origin: "NULL", noPrice: true },
  "Wydruk front adTribune Flex Lock": { plnPrice: 71.83, plnMargin: 30.15, intranetId: 19294, category: "wydruk trybunka podświetlana", origin: "Polska", noPrice: true },
  "Wydruk front adTribune Seg": { plnPrice: 62.59, plnMargin: 35.97, intranetId: 12055, category: "wydruk trybunka vario", origin: "Polska", noPrice: true },
  "wydruk komplet adTribune Cubic Lock": { plnPrice: 207.49, plnMargin: 65.63, intranetId: 19597, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk komplet adTribune Flex Lock": { plnPrice: 214.83, plnMargin: 63.07, intranetId: 19296, category: "wydruk trybunka podświetlana", origin: "Polska", noPrice: true },
  "Wydruk Leżak Bora beżowy": { plnPrice: 17.08, plnMargin: 2.94, intranetId: 13808, category: "wydruk leżak premium", origin: "Polska", noPrice: true },
  "Wydruk Leżak dwustronny": { plnPrice: 81.99, plnMargin: 22.06, intranetId: 15853, category: "wydruk leżak premium", origin: "Polska", noPrice: true },
  "Wydruk MARKIZA Air Tent PREMIUM 4x4": { plnPrice: 791.81, plnMargin: 129.94, intranetId: 15546, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "Wydruk MARKIZA Air Tent PREMIUM 5X5": { plnPrice: 808.48, plnMargin: 129.94, intranetId: 15547, category: "wydruk namioty", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA TRÓJKĄT 496x992 LEWY": { plnPrice: 56.64, plnMargin: 19.05, intranetId: 19182, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA TRÓJKĄT 496x992 PRAWY": { plnPrice: 56.64, plnMargin: 19.05, intranetId: 19226, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA TRÓJKĄT 992x992 LEWY": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19181, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA TRÓJKĄT 992x992 PRAWY": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19227, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x1240 R1488 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19202, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x1240 R1488 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19203, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x1488 R1488 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19205, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x1488 R1488 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19204, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x1984 R1488 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19206, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x1984 R1488 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19207, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x2480 R1488 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19209, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x2480 R1488 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19208, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x2976 R1488 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19210, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x2976 R1488 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19211, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x496 R1488 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19199, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x496 R1488 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19198, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x992 R1488 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19200, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1165x992 R1488 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19201, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x1240 R2976 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19217, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x1240 R2976 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19216, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x1488 R2976 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19218, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x1488 R2976 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19219, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x1984 R2976 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19221, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x1984 R2976 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19220, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x2480 R2976 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19222, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x2480 R2976 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19223, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x2976 R2976 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19225, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x2976 R2976 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19224, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x496 R2976 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19213, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x496 R2976 ZEW": { plnPrice: 56.64, plnMargin: 19.05, intranetId: 19212, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x992 R2976 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19214, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 1167x992 R2976 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19215, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x1240 R992 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19187, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x1240 R992 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19188, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x1488 R992 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19189, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x1488 R992 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19190, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x1984 R992 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19196, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x1984 R992 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19195, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x2480 R992 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19191, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x2480 R992 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19192, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x2976 R992 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19194, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x2976 R992 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19193, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x496 R992 WEW": { plnPrice: 0, plnMargin: 0, intranetId: 19185, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x496 R992 ZEW": { plnPrice: 0, plnMargin: 0, intranetId: 19186, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x992 R992 WEW": { plnPrice: 56.64, plnMargin: 19.05, intranetId: 19183, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame - RAMA ŁUK 776x992 R992 ZEW": { plnPrice: 56.64, plnMargin: 19.05, intranetId: 19184, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame Blockout - BIAŁY PLECY NIE DO DRUKU": { plnPrice: 0, plnMargin: 0, intranetId: 18564, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame Blockout - BIAŁY PLECY NIE DO DRUKU (do 1mb/medium250)": { plnPrice: 0, plnMargin: 0, intranetId: 19241, category: "wydruk blockout adframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na folii z PCV 99,2x248": { plnPrice: 146.13, plnMargin: 91.3, intranetId: 17217, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY (do 12m2)": { plnPrice: 272.78, plnMargin: 179.42, intranetId: 16432, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY (do 1m2)": { plnPrice: 71.11, plnMargin: 40.88, intranetId: 16429, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY (do 4m2)": { plnPrice: 142.82, plnMargin: 77.64, intranetId: 16430, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY (do 8m2)": { plnPrice: 196.63, plnMargin: 121.18, intranetId: 16431, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY (medium320)": { plnPrice: 61.8, plnMargin: 52.77, intranetId: 19012, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 198,4x248cm": { plnPrice: 88.93, plnMargin: 43.7, intranetId: 17994, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 198,4x248cm stan": { plnPrice: 127.02, plnMargin: 92.02, intranetId: 19273, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 297,6x248cm stan": { plnPrice: 129.6, plnMargin: 94.6, intranetId: 19274, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 99,2x148,8cm": { plnPrice: 88.93, plnMargin: 43.7, intranetId: 17993, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 99,2x198,4cm": { plnPrice: 88.93, plnMargin: 43.7, intranetId: 17992, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 99,2x248cm stan": { plnPrice: 127.02, plnMargin: 92.02, intranetId: 19275, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 99,2x297,6cm": { plnPrice: 88.93, plnMargin: 43.7, intranetId: 17996, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY 99,2x99,2cm": { plnPrice: 88.93, plnMargin: 43.7, intranetId: 17991, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - BIAŁY plecy (medium320)": { plnPrice: 0, plnMargin: 0, intranetId: 19774, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK 75x198,4cm KLEJONY WEWNĘTRZNY": { plnPrice: 236.73, plnMargin: 136.8, intranetId: 17282, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK 75x24,8cm KLEJONY WEWNĘTRZNY": { plnPrice: 0, plnMargin: 0, intranetId: 19734, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK 83x198,4cm KLEJONY ZEWNETRZNY": { plnPrice: 240.08, plnMargin: 141.62, intranetId: 17847, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK 83x24,8cm KLEJONY ZEWNETRZNY": { plnPrice: 0, plnMargin: 0, intranetId: 19739, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK 83x24,8cm ZEWNETRZNY": { plnPrice: 0, plnMargin: 0, intranetId: 19744, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK WEWNĘTRZNY Z RZEPEM 75x148,8": { plnPrice: 97.06, plnMargin: 40.82, intranetId: 16416, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK ZEWNĘTRZNY 83x148,8": { plnPrice: 88.72, plnMargin: 40.82, intranetId: 16415, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK ZEWNĘTRZNY 83x198,4": { plnPrice: 88.72, plnMargin: 40.82, intranetId: 18665, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach - ŁUK ZEWNĘTRZNY 83x49,6": { plnPrice: 88.72, plnMargin: 40.82, intranetId: 16414, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 105,4x198,4cm": { plnPrice: 0, plnMargin: 0, intranetId: 19239, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframe na tekstyliach 105.4x248 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19608, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 105.4x297,6 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19609, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach 111,6x99,2cm": { plnPrice: 82.73, plnMargin: 41.16, intranetId: 17359, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach 1190,4x99,2cm": { plnPrice: 524.64, plnMargin: 409.29, intranetId: 18987, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 1196,6x99,2cm": { plnPrice: 524.64, plnMargin: 409.29, intranetId: 18988, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 124x248cm": { plnPrice: 113.92, plnMargin: 50.7, intranetId: 17396, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 1388,8x99,2cm": { plnPrice: 259.68, plnMargin: 174.98, intranetId: 19002, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 1395x99,2cm": { plnPrice: 259.68, plnMargin: 174.98, intranetId: 18998, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 198,4x396,8cm (niestandard z docięciem)": { plnPrice: 0, plnMargin: 0, intranetId: 19853, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 204,8x297,6cm": { plnPrice: 0, plnMargin: 0, intranetId: 19250, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframe na tekstyliach 210,8x248 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19604, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 210,8x297,6cm": { plnPrice: 0, plnMargin: 0, intranetId: 19251, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframe na tekstyliach 24,8x297,6cm": { plnPrice: 0, plnMargin: 0, intranetId: 19613, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 24,8x99,2cm": { plnPrice: 0, plnMargin: 0, intranetId: 19741, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach 241.8x248cm (niestandard z docięciem)": { plnPrice: 0, plnMargin: 0, intranetId: 19692, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach 248x248cm (niestandard z docięciem)": { plnPrice: 0, plnMargin: 0, intranetId: 19804, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach 357x297,6cm (niestandard z docięciem)": { plnPrice: 0, plnMargin: 0, intranetId: 19729, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 396,8x148,8cm": { plnPrice: 0, plnMargin: 0, intranetId: 19617, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 403x248 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19611, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 403x297,6 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19610, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach 409,2x99,2cm": { plnPrice: 224.41, plnMargin: 158.02, intranetId: 19001, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 49,6x124cm": { plnPrice: 0, plnMargin: 0, intranetId: 16934, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 49,6x148,8cm": { plnPrice: 61.79, plnMargin: 24.87, intranetId: 16935, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframe na tekstyliach 496x198,4cm": { plnPrice: 0, plnMargin: 0, intranetId: 19619, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mframe na tekstyliach 55,8x248cm": { plnPrice: 0, plnMargin: 0, intranetId: 19249, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframe na tekstyliach 55,8x297,6cm": { plnPrice: 0, plnMargin: 0, intranetId: 19248, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 595,2x148,8cm": { plnPrice: 286.19, plnMargin: 209.87, intranetId: 18770, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 595,2x198,4cm": { plnPrice: 294.91, plnMargin: 207.59, intranetId: 17147, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframe na tekstyliach 601,4x297,6cm": { plnPrice: 0, plnMargin: 0, intranetId: 19246, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 694,4x99,2cm": { plnPrice: 75.12, plnMargin: 24.87, intranetId: 17406, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 706,8x99,2cm": { plnPrice: 84.39, plnMargin: 41.16, intranetId: 18995, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 892,8x148,8cm": { plnPrice: 407.82, plnMargin: 311.65, intranetId: 18772, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mFrame na tekstyliach 892,8x99,2cm": { plnPrice: 403.01, plnMargin: 307.51, intranetId: 18708, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframe na tekstyliach 897,6x248 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19607, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk mFrame na tekstyliach BIALY - DRZWI (bez wycięcia na klamkę)": { plnPrice: 91.54, plnMargin: 43.64, intranetId: 18577, category: "wydruk blockout mframe", origin: "Polska", noPrice: true },
  "Wydruk mframena tekstyliach 496x198,4cm": { plnPrice: 0, plnMargin: 0, intranetId: 19615, category: "wydruk blockout mframe", origin: "NULL", noPrice: true },
  "Wydruk Multiframe 250 - BIAŁY": { plnPrice: 96.44, plnMargin: 42.88, intranetId: 12216, category: "wydruk blockout multiframe", origin: "Polska", noPrice: true },
  "Wydruk Multiframe 250 SET7 jednostronny": { plnPrice: 361.63, plnMargin: 245.03, intranetId: 16614, category: "wydruk blockout multiframe", origin: "Polska", noPrice: true },
  "Wydruk Multiframe 301 SET1 jednostronny": { plnPrice: 100.48, plnMargin: 49.87, intranetId: 17341, category: "wydruk blockout multiframe", origin: "Polska", noPrice: true },
  "Wydruk Multiframe 301 SET3 jednostronny": { plnPrice: 195.25, plnMargin: 125.3, intranetId: 17329, category: "wydruk blockout multiframe", origin: "Polska", noPrice: true },
  "Wydruk Multiframe Kantorek 301 - Bok kantorka": { plnPrice: 95.55, plnMargin: 48.93, intranetId: 17113, category: "wydruk blockout multiframe", origin: "Polska", noPrice: true },
  "Wydruk Multiframe Kantorek 351 - Bok kantorka": { plnPrice: 178.12, plnMargin: 112.75, intranetId: 17445, category: "wydruk blockout multiframe", origin: "Polska", noPrice: true },
  "Wydruk Multiframe Kantorek 351 - Tył kantorka": { plnPrice: 178.12, plnMargin: 112.75, intranetId: 17446, category: "wydruk blockout multiframe", origin: "Polska", noPrice: true },
  "Wydruk niestandardowy CLASSIC / BANER 110": { plnPrice: 28.35, plnMargin: 21.18, intranetId: 12176, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk niestandardowy CLASSIC / FOLIA 137": { plnPrice: 26.49, plnMargin: 15.99, intranetId: 12173, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk niestandardowy CLASSIC / FOLIA 160": { plnPrice: 29.9, plnMargin: 19.4, intranetId: 12174, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruk niestandardowy CLASSIC / Rollup 110": { plnPrice: 0, plnMargin: 0, intranetId: 19677, category: "wydruk classic", origin: "NULL", noPrice: true },
  "Wydruk owijka na kufer adWall Smart prosta": { plnPrice: 114.04, plnMargin: 66.37, intranetId: 10238, category: "wydruk trybunka classic", origin: "Polska", noPrice: true },
  "Wydruk owijka na kufer adWall Smart łukowa": { plnPrice: 114.04, plnMargin: 66.37, intranetId: 16159, category: "wydruk trybunka classic", origin: "Polska", noPrice: true },
  "Wydruk Pop-up Counter Lightbox 100x100 tył - keder 14x3mm": { plnPrice: 55.83, plnMargin: 29.51, intranetId: 17857, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk Pop-up Lightbox 100x200 tył": { plnPrice: 55.29, plnMargin: 28.96, intranetId: 17860, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk Pop-up Lightbox 100x225": { plnPrice: 55.75, plnMargin: 29.42, intranetId: 19705, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 100x225 tył": { plnPrice: 55.75, plnMargin: 29.42, intranetId: 19706, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 100x250": { plnPrice: 56.22, plnMargin: 29.89, intranetId: 19707, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 100x250 tył": { plnPrice: 56.22, plnMargin: 29.89, intranetId: 19708, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 120x200": { plnPrice: 60.82, plnMargin: 33.39, intranetId: 19709, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 120x200 tył": { plnPrice: 60.82, plnMargin: 33.39, intranetId: 19710, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 120x250": { plnPrice: 61.76, plnMargin: 34.33, intranetId: 19711, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 120x250 tył": { plnPrice: 61.76, plnMargin: 34.33, intranetId: 19712, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 150x200": { plnPrice: 69.12, plnMargin: 40.04, intranetId: 19713, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 150x200 tył": { plnPrice: 69.12, plnMargin: 40.04, intranetId: 19714, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 150x250": { plnPrice: 70.05, plnMargin: 40.97, intranetId: 19715, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk Pop-up Lightbox 150x250 tył": { plnPrice: 70.05, plnMargin: 40.97, intranetId: 19716, category: "wydruk ramy tekstylne p&p", origin: "NULL", noPrice: true },
  "Wydruk płaszcz + topper adBox Hit C": { plnPrice: 0, plnMargin: 0, intranetId: 14338, category: "wydruk trybunka classic", origin: "Polska", noPrice: true },
  "Wydruk płaszcz adTribune/adBox Hit C": { plnPrice: 85.31, plnMargin: 45.65, intranetId: 13494, category: "wydruk trybunka classic", origin: "Polska", noPrice: true },
  "Wydruk płaszcz adTribune/adBox Standard": { plnPrice: 100.8, plnMargin: 61.58, intranetId: 11857, category: "wydruk trybunka classic", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box 100x250 tył [keder 9x3mm]": { plnPrice: 64.73, plnMargin: 31.74, intranetId: 17208, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box 200x200 [keder 9x3mm]": { plnPrice: 90.63, plnMargin: 50.47, intranetId: 18593, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box 200x300 BLOCKOUT [keder 9x3mm]": { plnPrice: 132.06, plnMargin: 86.9, intranetId: 19034, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box 200x300 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 142.06, plnMargin: 86.9, intranetId: 19257, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box 300x300 BLOCKOUT [keder 9x3mm]": { plnPrice: 176.51, plnMargin: 124.19, intranetId: 18939, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box Counter 100x100 FLAG [keder 9x3mm]": { plnPrice: 54.48, plnMargin: 12.31, intranetId: 18936, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box Counter 100x100 tył BLOCKOUT [keder 9x3mm]": { plnPrice: 62.63, plnMargin: 32.13, intranetId: 18931, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Light Box Counter 100x100 tył [keder 9x3mm]": { plnPrice: 56.31, plnMargin: 25.81, intranetId: 17210, category: "wydruk ramy tekstylne p&p", origin: "Polska", noPrice: true },
  "Wydruk SEGO Mini Display Stand 100x250 [keder 9x3mm]": { plnPrice: 60.53, plnMargin: 28.36, intranetId: 13703, category: "wydruk blockout", origin: "Polska", noPrice: true },
  "Wydruk Toper kształtowy": { plnPrice: 16.32, plnMargin: 3.67, intranetId: 10780, category: "wydruk classic", origin: "Polska", noPrice: true },
  "Wydruki EUROSHOP 2026": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19461, category: "modular", origin: "Polska", noPrice: true },
  "Wydruki FBE": { plnPrice: 0, plnMargin: 0, intranetId: 19309, category: "modular", origin: "Polska", noPrice: true },
  "Wydruki REMA 2026": { plnPrice: 0, plnMargin: 0, intranetId: 19308, category: "modular", origin: "Polska", noPrice: true },
  "Wykładzina targowa CZARNY": { plnPrice: 42.47, plnMargin: 35.8, intranetId: 16929, category: "zabudowy akcesoria", origin: "Polska", noPrice: true },
  "Wykładzina targowa RÓŻOWY 1805": { plnPrice: 47.37, plnMargin: 40.7, intranetId: 16930, category: "zabudowy akcesoria", origin: "Polska", noPrice: true },
  "Wymiana wydruku - adStand Level": { plnPrice: 169.63, plnMargin: 61.93, intranetId: 11960, category: "wydruk rollup", origin: "Polska", noPrice: true },
  "X-banner 100x200 (bez wydruku)": { plnPrice: 23.74, plnMargin: 15.41, intranetId: 19424, category: "ścianki banerowe", origin: "Polska", noPrice: true },
  "X-banner 60x160 (bez wydruku)": { plnPrice: 16.26, plnMargin: 7.93, intranetId: 19425, category: "ścianki banerowe", origin: "Polska", noPrice: true },
  "X-banner PRO 100x200 (bez wydruku)": { plnPrice: 34.51, plnMargin: 26.18, intranetId: 19426, category: "ścianki banerowe", origin: "Polska", noPrice: true },
  "X-banner PRO 60x160 (bez wydruku)": { plnPrice: 23.59, plnMargin: 15.26, intranetId: 19427, category: "ścianki banerowe", origin: "Polska", noPrice: true },
  "Zacisk do linki ∅2-3,2mm MEDIUM (Automatyczny)": { plnPrice: 6.6, plnMargin: 6.6, intranetId: 11875, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "Zacisk do linki ∅2mm (Automatyczny) CHINY": { plnPrice: 6.57, plnMargin: 6.57, intranetId: 17430, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "Zacisk do linki ∅3,2-4,2mm LARGE (Automatyczny)": { plnPrice: 10.44, plnMargin: 10.44, intranetId: 11876, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "Zacisk do linki ∅3mm (Automatyczny)": { plnPrice: 6.83, plnMargin: 6.83, intranetId: 16114, category: "systemy podwieszane akcesoria", origin: "Polska", noPrice: true },
  "Zaliczka": { plnPrice: 0, plnMargin: 0, intranetId: 10012, category: "inne", origin: "Polska", noPrice: true },
  "Zamek do Air Tent Premium 3x3 (kpl4szt)": { plnPrice: 68.06, plnMargin: 6.19, intranetId: 13589, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "Zamek do Air Tent Premium 4x4 (kpl4szt)": { plnPrice: 94.09, plnMargin: 8.56, intranetId: 13590, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "Zamek do Air Tent Premium 5x5 (kpl4szt)": { plnPrice: 120.11, plnMargin: 10.92, intranetId: 13591, category: "namioty akcesoria", origin: "Chiny", noPrice: true },
  "Zamek kostkowy biały, dł. 520cm": { plnPrice: 12.1, plnMargin: 1.1, intranetId: 14277, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zamek kostkowy biały, dł. 530cm": { plnPrice: 11.05, plnMargin: 1, intranetId: 14244, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zamek kostkowy biały, dł. 660cm": { plnPrice: 13.69, plnMargin: 1.24, intranetId: 14276, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zamek kostkowy biały, dł. 777cm": { plnPrice: 16.07, plnMargin: 1.47, intranetId: 14243, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zamek kostkowy czarny, dł. 400cm": { plnPrice: 10.84, plnMargin: 0.99, intranetId: 12393, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zamek kostkowy czarny, dł. 520cm": { plnPrice: 10.95, plnMargin: 1, intranetId: 14248, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zamek kostkowy czarny, dł. 530cm": { plnPrice: 12.66, plnMargin: 1.16, intranetId: 14247, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 100cm": { plnPrice: 2.42, plnMargin: 0.22, intranetId: 18464, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 110cm": { plnPrice: 2.51, plnMargin: 0.16, intranetId: 19683, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły biały, dł. 140cm": { plnPrice: 2.91, plnMargin: 0.27, intranetId: 19684, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły biały, dł. 200cm": { plnPrice: 2.81, plnMargin: 0.26, intranetId: 15341, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 250cm": { plnPrice: 3.3, plnMargin: 0.3, intranetId: 13965, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 300cm": { plnPrice: 3.98, plnMargin: 0.37, intranetId: 13966, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 360cm": { plnPrice: 5.04, plnMargin: 0.46, intranetId: 13967, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 400cm": { plnPrice: 5.75, plnMargin: 0.52, intranetId: 13968, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 500cm": { plnPrice: 8.42, plnMargin: 0.77, intranetId: 13969, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 50cm": { plnPrice: 1.87, plnMargin: 0.17, intranetId: 19681, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły biały, dł. 800cm": { plnPrice: 10.26, plnMargin: 0.93, intranetId: 13975, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły biały, dł. 80cm": { plnPrice: 2.19, plnMargin: 0.2, intranetId: 19682, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły czarny, dł. 100cm": { plnPrice: 2.15, plnMargin: 0.2, intranetId: 18465, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 110cm": { plnPrice: 2.58, plnMargin: 0.23, intranetId: 19687, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły czarny, dł. 140cm": { plnPrice: 2.91, plnMargin: 0.27, intranetId: 19688, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły czarny, dł. 160cm": { plnPrice: 2.54, plnMargin: 0.23, intranetId: 12662, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 250cm": { plnPrice: 3.3, plnMargin: 0.3, intranetId: 13970, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 300cm": { plnPrice: 3.98, plnMargin: 0.37, intranetId: 13971, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 360cm": { plnPrice: 5.04, plnMargin: 0.46, intranetId: 13972, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 400cm": { plnPrice: 6.89, plnMargin: 0.63, intranetId: 13973, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 500cm": { plnPrice: 8.52, plnMargin: 0.77, intranetId: 13974, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 50cm": { plnPrice: 1.87, plnMargin: 0.17, intranetId: 19685, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły czarny, dł. 800cm": { plnPrice: 10.26, plnMargin: 0.93, intranetId: 13976, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły czarny, dł. 80cm": { plnPrice: 2.19, plnMargin: 0.2, intranetId: 19686, category: "półprodukty", origin: "NULL", noPrice: true },
  "Zamek zwykły Z METRA biały, dł. 300m": { plnPrice: 93.09, plnMargin: 6.09, intranetId: 19014, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zamek zwykły Z METRA czarny, dł. 300m": { plnPrice: 93.09, plnMargin: 6.09, intranetId: 19013, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny": { plnPrice: 6.67, plnMargin: 0, intranetId: 19447, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny 100W 24V z kablami - NIE SPRZEDAWAĆ": { plnPrice: 110.12, plnMargin: 91.79, intranetId: 18151, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny 150W 24V z kablami - NIE SPRZEDAWAĆ": { plnPrice: 186.57, plnMargin: 168.24, intranetId: 18150, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny 240W 24V": { plnPrice: 134.94, plnMargin: 118.27, intranetId: 17743, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny 75W 24V": { plnPrice: 65.89, plnMargin: 49.22, intranetId: 16157, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny modułowy 200W 24V": { plnPrice: 92.23, plnMargin: 73.9, intranetId: 14866, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny modułowy 350W 24V": { plnPrice: 110.87, plnMargin: 92.54, intranetId: 11320, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz wewnętrzny modułowy 600W 24V": { plnPrice: 123.67, plnMargin: 107, intranetId: 19066, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz zewnętrzny": { plnPrice: 0, plnMargin: 0, intranetId: 19448, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz zewnętrzny 120W 24V": { plnPrice: 219.05, plnMargin: 199.05, intranetId: 10384, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz zewnętrzny 160W 24V": { plnPrice: 209.34, plnMargin: 189.34, intranetId: 10385, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Zasilacz zewnętrzny 360W 24V": { plnPrice: 536.93, plnMargin: 516.93, intranetId: 13997, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "zawieszka do suwaków - biały": { plnPrice: 0.22, plnMargin: 0.02, intranetId: 19807, category: "półprodukty", origin: "NULL", noPrice: true },
  "zawieszka do suwaków - czarny": { plnPrice: 0.22, plnMargin: 0.02, intranetId: 19808, category: "półprodukty", origin: "NULL", noPrice: true },
  "złączka LED - Jack 3,5mm 50cm żeński": { plnPrice: 2.28, plnMargin: 0.2, intranetId: 18157, category: "modular", origin: "Polska", noPrice: true },
  "złączka LED - przedłużka Jack 3,5mm 100cm": { plnPrice: 5.4, plnMargin: 0.49, intranetId: 18158, category: "modular", origin: "Polska", noPrice: true },
  "złączka LED - przedłużka Jack 3,5mm 150cm": { plnPrice: 7.21, plnMargin: 0.66, intranetId: 18159, category: "modular", origin: "Polska", noPrice: true },
  "złączka LED - przedłużka Jack 3,5mm 200cm": { plnPrice: 8.81, plnMargin: 0.8, intranetId: 18160, category: "modular", origin: "Polska", noPrice: true },
  "Zawór do Air tent Premium": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 13587, category: "namioty akcesoria", origin: "Polska", noPrice: true },
  "Zaślepka listwa L (czarna)": { plnPrice: 0.15, plnMargin: 0.01, intranetId: 13511, category: "półprodukty", origin: "Polska", noPrice: true },
  "Zaślepka O bez gwintu": { plnPrice: 0.22, plnMargin: 0.01, intranetId: 11947, category: "classic", origin: "Polska", noPrice: true },
  "Zaślepka O z gwintem": { plnPrice: 2.29, plnMargin: 0.15, intranetId: 11948, category: "classic", origin: "Polska", noPrice: true },
  "Zaślepka ☐ bez gwintu": { plnPrice: 0.23, plnMargin: 0.02, intranetId: 11946, category: "classic", origin: "Polska", noPrice: true },
  "Zaślepka ☐ z gwintem": { plnPrice: 1.82, plnMargin: 0.17, intranetId: 11945, category: "classic", origin: "Polska", noPrice: true },
  "Zbiornik na wodę 1000l": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 18759, category: "classic", origin: "Polska", noPrice: true },
  "ZSZYWKI DO ZAMYKANIA KARTONÓW 35/22 mm (2000 sztuk)": { plnPrice: 38.63, plnMargin: 3.51, intranetId: 18225, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "złączka LED - Jack 3,5mm 50cm męski": { plnPrice: 2.89, plnMargin: 0.27, intranetId: 18156, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "Śruba imbusowa dociskowa M6": { plnPrice: 0.05, plnMargin: 0, intranetId: 18816, category: "inne", origin: "Polska", noPrice: true },
  "Śruba imbusowa M4x12": { plnPrice: 1.77, plnMargin: 0.01, intranetId: 15301, category: "inne", origin: "Chiny", noPrice: true },
  "Śruba imbusowa M5x20": { plnPrice: 0.1, plnMargin: 0.01, intranetId: 19307, category: "inne", origin: "Polska", noPrice: true },
  "Śruba imbusowa M5x8": { plnPrice: 0.11, plnMargin: 0.01, intranetId: 18327, category: "inne", origin: "Chiny", noPrice: true },
  "Śruba imbusowa M8x15": { plnPrice: 1.9, plnMargin: 0.01, intranetId: 19753, category: "inne", origin: "NULL", noPrice: true },
  "śruba M 5x25 DIN 7991 A2 stożkowa": { plnPrice: 0.31, plnMargin: 0.03, intranetId: 18300, category: "inne", origin: "Polska", noPrice: true },
  "Śruba M3/6mm": { plnPrice: 0.02, plnMargin: 0, intranetId: 19800, category: "classic", origin: "NULL", noPrice: true },
  "Śruba M6/50mm": { plnPrice: 0.23, plnMargin: 0.01, intranetId: 17161, category: "classic", origin: "Chiny", noPrice: true },
  "Śruba M8/35mm": { plnPrice: 0.34, plnMargin: 0.02, intranetId: 19550, category: "classic", origin: "NULL", noPrice: true },
  "Śruba M8/45mm": { plnPrice: 0.23, plnMargin: 0.02, intranetId: 13478, category: "classic", origin: "Chiny", noPrice: true },
  "żarówka 100W do adFrame CTF Hanging (duża)": { plnPrice: 83.23, plnMargin: 78.23, intranetId: 17711, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "żarówka 40W do adFrame CTF Hanging (mała)": { plnPrice: 66.78, plnMargin: 61.78, intranetId: 16051, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "żarówka 80W do adFrame CTF Hanging (duża)": { plnPrice: 118.37, plnMargin: 113.37, intranetId: 15232, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "żarówka 80W do adFrame CTF Hanging (duża) ciepła barwa": { plnPrice: 112.33, plnMargin: 107.33, intranetId: 17648, category: "ramy tekstylne akcesoria", origin: "Polska", noPrice: true },
  "blat MDF CTF": { plnPrice: 150, plnMargin: 50, intranetId: 19553, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "blat PLEXI CTF": { plnPrice: 280, plnMargin: 100, intranetId: 19554, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "blat poliwęglan CTF": { plnPrice: 220, plnMargin: 80, intranetId: 19555, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "stopa CTF": { plnPrice: 45, plnMargin: 15, intranetId: 19556, category: "ramy tekstylne akcesoria", origin: "Polska" },
  "adStand Twins 85 (bez wydruku)": { plnPrice: 116.56, plnMargin: 113.23, intranetId: 10097, category: "nowo_dodane", origin: "Chiny" },
  "adFolder Easy": { plnPrice: 0, plnMargin: 0, intranetId: 10135, category: "nowo_dodane", origin: "Polska" },
  "adStand Twins 100 (bez wydruku)": { plnPrice: 113.57, plnMargin: 110.24, intranetId: 10142, category: "nowo_dodane", origin: "Chiny" },
  "adFolder Plate": { plnPrice: 233.76, plnMargin: 225.43, intranetId: 10130, category: "nowo_dodane", origin: "Polska" },
  "Hit Konstrukcja uzbrojona": { plnPrice: 154.46, plnMargin: 154.46, intranetId: 10153, category: "nowo_dodane", origin: "Polska" },
  "adWall Smart prosta 4x3 (bez wydruku)": { plnPrice: 829.4, plnMargin: 812.73, intranetId: 10170, category: "nowo_dodane", origin: "Chiny" },
  "adFolder A3": { plnPrice: 146.29, plnMargin: 137.96, intranetId: 10180, category: "nowo_dodane", origin: "Polska" },
  "adFolder Tex": { plnPrice: 0, plnMargin: 0, intranetId: 10181, category: "nowo_dodane", origin: "Polska" },
  "adFolder Prestige 3 komory": { plnPrice: 267.85, plnMargin: 259.52, intranetId: 10208, category: "nowo_dodane", origin: "Chiny" },
  "adWall Vario Classic 280 (bez wydruku)": { plnPrice: 390.32, plnMargin: 381.99, intranetId: 10214, category: "nowo_dodane", origin: "Chiny" },
  "Torba L060": { plnPrice: 79.93, plnMargin: 78.26, intranetId: 10245, category: "nowo_dodane", origin: "Chiny" },
  "Torba Adwall Profi": { plnPrice: 82.48, plnMargin: 80.81, intranetId: 10247, category: "nowo_dodane", origin: "Chiny" },
  "adStand BannerAd 85 (bez wydruku)": { plnPrice: 175.47, plnMargin: 167.96, intranetId: 10261, category: "nowo_dodane", origin: "Polska" },
  "adStand BannerAd 100 (bez wydruku)": { plnPrice: 206.26, plnMargin: 197.04, intranetId: 10263, category: "nowo_dodane", origin: "Polska" },
  "adTribune Case (bez wydruku)": { plnPrice: 412.99, plnMargin: 404.66, intranetId: 10299, category: "nowo_dodane", origin: "Chiny" },
  "adWall Vario Łukowe F 310 (bez wydruku)": { plnPrice: 366.95, plnMargin: 358.62, intranetId: 10315, category: "nowo_dodane", origin: "Chiny" },
  "adWall Vario S 150 jednostronne": { plnPrice: 615.51, plnMargin: 479.42, intranetId: 10367, category: "nowo_dodane", origin: "Polska" },
  "adTribune Hit C blat": { plnPrice: 80.3, plnMargin: 80.3, intranetId: 10374, category: "nowo_dodane", origin: "Polska" },
  "adWall Vario Presto 090 (bez wydruku)": { plnPrice: 363.3, plnMargin: 129.75, intranetId: 10441, category: "nowo_dodane", origin: "7616999099" },
  "adWall Vario Presto 120 (bez wydruku)": { plnPrice: 422.94, plnMargin: 151.05, intranetId: 10450, category: "nowo_dodane", origin: "7616999099" },
  "adStand Budget 85 (bez wydruku)": { plnPrice: 30.11, plnMargin: 26.78, intranetId: 10554, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adWall Vario S 150 jednostronny": { plnPrice: 338.77, plnMargin: 211.02, intranetId: 10531, category: "nowo_dodane", origin: "Polska" },
  "Podnóżek Tokyo czarna skóra/ebony": { plnPrice: 532.01, plnMargin: 512.01, intranetId: 10763, category: "nowo_dodane", origin: "Polska" },
  "Podnóżek Tokyo czarna skóra/ wiśnia": { plnPrice: 489.17, plnMargin: 469.17, intranetId: 10765, category: "nowo_dodane", origin: "Polska" },
  "Torba Niestandardowa": { plnPrice: 62.66, plnMargin: 60.99, intranetId: 10823, category: "nowo_dodane", origin: "Chiny" },
  "Torba Hit z kółkami": { plnPrice: 130.07, plnMargin: 128.4, intranetId: 10962, category: "nowo_dodane", origin: "Chiny" },
  "Modulo podwójne (bez wydruku)": { plnPrice: 531.56, plnMargin: 523.23, intranetId: 10991, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Popup Counter 1x1 Silver": { plnPrice: 415.95, plnMargin: 415.95, intranetId: 11026, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge L Connector": { plnPrice: 26.9, plnMargin: 25.23, intranetId: 11027, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge I Connector": { plnPrice: 26.9, plnMargin: 25.23, intranetId: 11028, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge foot": { plnPrice: 17.69, plnMargin: 16.02, intranetId: 11029, category: "nowo_dodane", origin: "Polska" },
  "adGate Air Triangle 6,5m (bez wydruku)": { plnPrice: 1243.34, plnMargin: 1210.01, intranetId: 11089, category: "nowo_dodane", origin: "Chiny" },
  "adGate Air Square 4,5m (bez wydruku)": { plnPrice: 903.92, plnMargin: 870.59, intranetId: 11091, category: "nowo_dodane", origin: "Chiny" },
  "adWall Edge TV Mounting Kit": { plnPrice: 0, plnMargin: 0, intranetId: 11183, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge 3x1 lightbox(bez wydruku)": { plnPrice: 1110.27, plnMargin: 1096.94, intranetId: 11214, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge 3x3S (bez wydruku)": { plnPrice: 370.88, plnMargin: 370.88, intranetId: 11215, category: "nowo_dodane", origin: "Chiny" },
  "adWall Edge 3x4S (bez wydruku)": { plnPrice: 429.29, plnMargin: 429.29, intranetId: 11216, category: "nowo_dodane", origin: "Chiny" },
  "adWall Edge 3x2S (bez wydruku)": { plnPrice: 321.48, plnMargin: 321.48, intranetId: 11241, category: "nowo_dodane", origin: "Chiny" },
  "adWall Edge 3x3C (bez wydruku)": { plnPrice: 405.92, plnMargin: 405.92, intranetId: 11304, category: "nowo_dodane", origin: "Chiny" },
  "adWall Edge 3x4C (bez wydruku)": { plnPrice: 476.02, plnMargin: 476.02, intranetId: 11305, category: "nowo_dodane", origin: "Chiny" },
  "adWall Edge 4x1S (bez wydruku)": { plnPrice: 304.86, plnMargin: 304.86, intranetId: 11308, category: "nowo_dodane", origin: "Chiny" },
  "adFrame LMD Quicklock z profilem": { plnPrice: 1.71, plnMargin: 0.04, intranetId: 11317, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMD/LMS Quicklock 90°": { plnPrice: 24.08, plnMargin: 22.41, intranetId: 11318, category: "nowo_dodane", origin: "Polska" },
  "adBox Hit C blat": { plnPrice: 86.97, plnMargin: 80.3, intranetId: 11338, category: "nowo_dodane", origin: "Polska" },
  "adBox MiniHit blat": { plnPrice: 61.67, plnMargin: 55, intranetId: 11340, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 496x1984": { plnPrice: 503.58, plnMargin: 456.91, intranetId: 11396, category: "nowo_dodane", origin: "Chiny" },
  "adWall Vario Storage (bez wydruku)": { plnPrice: 904.77, plnMargin: 904.77, intranetId: 11405, category: "nowo_dodane", origin: "Chiny" },
  "Montaż - dodatkowa półka do stoiska HIT/HIT C": { plnPrice: 62.77, plnMargin: 56.1, intranetId: 11428, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus 4x3S SS(bez wydruku)": { plnPrice: 712.87, plnMargin: 696.2, intranetId: 11451, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus 1x3S DS(bez wydruku)": { plnPrice: 435.49, plnMargin: 427.16, intranetId: 11455, category: "nowo_dodane", origin: "Polska" },
  "adTribune Edge Plus (bez wydruku)": { plnPrice: 547.16, plnMargin: 527.16, intranetId: 11456, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus Channel Bar, 2-section": { plnPrice: 0, plnMargin: 0, intranetId: 11459, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus L Link Connector": { plnPrice: 24.03, plnMargin: 24.03, intranetId: 11462, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus Straight Link Connector": { plnPrice: 24.03, plnMargin: 24.03, intranetId: 11463, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus External Shelf Kit 2": { plnPrice: 210.98, plnMargin: 210.98, intranetId: 11465, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus Bridge, 1x3S-20cm DS": { plnPrice: 427.16, plnMargin: 427.16, intranetId: 11466, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus Bridge, 1x4S-20cm DS": { plnPrice: 427.16, plnMargin: 427.16, intranetId: 11467, category: "nowo_dodane", origin: "Polska" },
  "profil LMD Quicklock": { plnPrice: 0, plnMargin: 0, intranetId: 11596, category: "nowo_dodane", origin: "Chiny" },
  "Tuba 12x60cm - wydruk AdPoster L60": { plnPrice: 3.94, plnMargin: 3.94, intranetId: 11747, category: "nowo_dodane", origin: "Polska" },
  "Karton - Multiframe 250": { plnPrice: 4.8, plnMargin: 0.31, intranetId: 11798, category: "nowo_dodane", origin: "Polska" },
  "adFoam Forma podnóżek (bez wydruku)": { plnPrice: 172.04, plnMargin: 163.71, intranetId: 11821, category: "nowo_dodane", origin: "Polska" },
  "Divano (bez wydruku)": { plnPrice: 296.16, plnMargin: 287.83, intranetId: 11824, category: "nowo_dodane", origin: "Polska" },
  "Divano podwójne (bez wydruku)": { plnPrice: 436.33, plnMargin: 428, intranetId: 11825, category: "nowo_dodane", origin: "Polska" },
  "Divano potrójne (bez wydruku)": { plnPrice: 605.39, plnMargin: 597.06, intranetId: 11827, category: "nowo_dodane", origin: "Polska" },
  "Multiframe profil rozpórka 60cm (Black)": { plnPrice: 133.78, plnMargin: 132.11, intranetId: 11837, category: "nowo_dodane", origin: "Chiny" },
  "Multiframe akcesoria uchwyt półki": { plnPrice: 3.67, plnMargin: 2, intranetId: 11838, category: "nowo_dodane", origin: "Polska" },
  "adTent AIR TENT S3 (bez wydruku)": { plnPrice: 1223.09, plnMargin: 1139.76, intranetId: 11928, category: "nowo_dodane", origin: "Polska" },
  "MFRAME Torba na kółkach 125cm": { plnPrice: 466.89, plnMargin: 433.56, intranetId: 11931, category: "nowo_dodane", origin: "Chiny" },
  "MFRAME Torba na kółkach 150cm": { plnPrice: 502.74, plnMargin: 469.41, intranetId: 11932, category: "nowo_dodane", origin: "Chiny" },
  "adTribune LMD 100x100 blat (biały)": { plnPrice: 7.77, plnMargin: 1.1, intranetId: 11962, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMD mocowanie blatu": { plnPrice: 1.68, plnMargin: 0.01, intranetId: 11963, category: "nowo_dodane", origin: "Chiny" },
  "Multiframe uchwyt lampy okrągłej na dach": { plnPrice: 75.56, plnMargin: 70.56, intranetId: 11988, category: "nowo_dodane", origin: "Polska" },
  "adTribune Seg (bez wydruku) - NIE SPRZEDAWAĆ": { plnPrice: 534.93, plnMargin: 476.6, intranetId: 12054, category: "nowo_dodane", origin: "Polska" },
  "mFrame zabezpieczenie do wózków transp ram plastik": { plnPrice: 2, plnMargin: 2, intranetId: 12061, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Small shelf": { plnPrice: 0, plnMargin: 0, intranetId: 12063, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Ball shape shelf": { plnPrice: 0, plnMargin: 0, intranetId: 12064, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Holder": { plnPrice: 0, plnMargin: 0, intranetId: 12065, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Big hanger rail": { plnPrice: 12.34, plnMargin: 4.01, intranetId: 12067, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Shelf(with hanging pole)": { plnPrice: 244.53, plnMargin: 236.2, intranetId: 12068, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Shelf(without hanging pole)": { plnPrice: 244.53, plnMargin: 236.2, intranetId: 12069, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Glass 980x300x10mm": { plnPrice: 0, plnMargin: 0, intranetId: 12074, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Brochure holder A5": { plnPrice: 0, plnMargin: 0, intranetId: 12075, category: "nowo_dodane", origin: "Polska" },
  "RETAIL Support lock": { plnPrice: 0, plnMargin: 0, intranetId: 12094, category: "nowo_dodane", origin: "Polska" },
  "Multiframe 250 SET7 (Black)": { plnPrice: 4951.59, plnMargin: 4508.33, intranetId: 12117, category: "nowo_dodane", origin: "Polska" },
  "Multiframe 250 SET8 (Black)": { plnPrice: 5458.41, plnMargin: 4973.53, intranetId: 12118, category: "nowo_dodane", origin: "Polska" },
  "MFRAME Trybunka półka 95x46,2 (wcięcia 4x4cm)": { plnPrice: 98.47, plnMargin: 96.8, intranetId: 12104, category: "nowo_dodane", origin: "Polska" },
  "adTribune Seg półka": { plnPrice: 53.5, plnMargin: 53.5, intranetId: 12159, category: "nowo_dodane", origin: "Chiny" },
  "adFrame Quick 100x200 (bez wydruku)": { plnPrice: 431.27, plnMargin: 424.6, intranetId: 12166, category: "nowo_dodane", origin: "Chiny" },
  "Wydruk niestandardowy CLASSIC / BANER 160": { plnPrice: 37.86, plnMargin: 30.69, intranetId: 12178, category: "nowo_dodane", origin: "Polska" },
  "Listwa adStand ECO/LUX/TWINS/R3 85": { plnPrice: 3.3, plnMargin: 3.3, intranetId: 12240, category: "nowo_dodane", origin: "Polska" },
  "Hoker Bogota wood biały Kudos": { plnPrice: 133.25, plnMargin: 119.92, intranetId: 12257, category: "nowo_dodane", origin: "Polska" },
  "adTribune Plate (bez wydruku)": { plnPrice: 770, plnMargin: 770, intranetId: 12258, category: "nowo_dodane", origin: "Polska" },
  "Karton - adFrame Quick 100x250": { plnPrice: 20.02, plnMargin: 1.82, intranetId: 12276, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Plus 3x3S SS": { plnPrice: 769.66, plnMargin: 689.79, intranetId: 12305, category: "nowo_dodane", origin: "Polska" },
  "Toper kształtowy": { plnPrice: 42.9, plnMargin: 3.9, intranetId: 12372, category: "nowo_dodane", origin: "Polska" },
  "Karton - Vario 40x40x100": { plnPrice: 6.67, plnMargin: 0.43, intranetId: 12424, category: "nowo_dodane", origin: "Polska" },
  "IGŁA SCHMETZ": { plnPrice: 0, plnMargin: 0, intranetId: 12437, category: "nowo_dodane", origin: "NULL" },
  "adUp Vario Clover Maxi dwustronne": { plnPrice: 1757.1, plnMargin: 1322.48, intranetId: 12507, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adUp Vario Clover Maxi dwustronny": { plnPrice: 1092.09, plnMargin: 665.8, intranetId: 12508, category: "nowo_dodane", origin: "Polska" },
  "Listwa do adStand Budget 85": { plnPrice: 0.32, plnMargin: 0.32, intranetId: 13423, category: "nowo_dodane", origin: "Polska" },
  "Pianka niestandardowa": { plnPrice: 61.83, plnMargin: 53.5, intranetId: 13473, category: "nowo_dodane", origin: "Polska" },
  "adWall Vario Presto Super Light 90 (bez wydruku)": { plnPrice: 30, plnMargin: 0, intranetId: 13477, category: "nowo_dodane", origin: "5" },
  "adFrame Quick Single 100x250 (bez wydruku) DOP": { plnPrice: 366.99, plnMargin: 360.32, intranetId: 13479, category: "nowo_dodane", origin: "Chiny" },
  "Karton – Wydruk Smart jednostr. zamykany": { plnPrice: 9.57, plnMargin: 0.87, intranetId: 13482, category: "nowo_dodane", origin: "Polska" },
  "Karton – Vario 87x38x25": { plnPrice: 4.96, plnMargin: 0.33, intranetId: 13484, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adTribune Hit C": { plnPrice: 85.31, plnMargin: 45.65, intranetId: 13493, category: "nowo_dodane", origin: "Polska" },
  "SEGO Slide block L for HP": { plnPrice: 3.67, plnMargin: 2, intranetId: 13540, category: "nowo_dodane", origin: "Polska" },
  "SEGO DC cap for VP": { plnPrice: 2.06, plnMargin: 0.39, intranetId: 13547, category: "nowo_dodane", origin: "Polska" },
  "SEGO klamra do kabli": { plnPrice: 3.67, plnMargin: 2, intranetId: 13549, category: "nowo_dodane", origin: "Chiny" },
  "SEGO 60 Single Side 85x200 (bez wydruku)": { plnPrice: 352.58, plnMargin: 327.58, intranetId: 13554, category: "nowo_dodane", origin: "Polska" },
  "Worek na śledzie do Air Tent Premium": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 13577, category: "nowo_dodane", origin: "Polska" },
  "Materiał – próbka do Air Tent Premium": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 13584, category: "nowo_dodane", origin: "Polska" },
  "Zamek do Air Tent Premium 6x6 (kpl4szt)": { plnPrice: 168.15, plnMargin: 15.29, intranetId: 13592, category: "nowo_dodane", origin: "Chiny" },
  "Small clamp connector": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 13596, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Modular LED Curtain 30W 1x3": { plnPrice: 727.43, plnMargin: 727.43, intranetId: 14275, category: "nowo_dodane", origin: "Polska" },
  "Oświetlenie LED - Air Tent Premium": { plnPrice: 320.27, plnMargin: 320.27, intranetId: 13573, category: "nowo_dodane", origin: "Chiny" },
  "Podstawa do hokera Nicea 65 cm": { plnPrice: 10.68, plnMargin: 4.01, intranetId: 15565, category: "nowo_dodane", origin: "Polska" },
  "adFrame Starter 100x200 JEDNOSTRONNY": { plnPrice: 229.98, plnMargin: 200.32, intranetId: 13677, category: "nowo_dodane", origin: "Polska" },
  "adFrame Starter 100x250 JEDNOSTRONNY": { plnPrice: 259.89, plnMargin: 218.56, intranetId: 13680, category: "nowo_dodane", origin: "Polska" },
  "Medium do leżaków barwione niebieski": { plnPrice: 12.03, plnMargin: 6.53, intranetId: 13803, category: "nowo_dodane", origin: "Polska" },
  "Medium do leżaków barwione zielony": { plnPrice: 12.03, plnMargin: 6.53, intranetId: 13809, category: "nowo_dodane", origin: "Polska" },
  "Medium do leżaków barwione czarny": { plnPrice: 12.03, plnMargin: 6.53, intranetId: 13840, category: "nowo_dodane", origin: "Polska" },
  "adBoard OWZ A1(bez wydruku)": { plnPrice: 171.13, plnMargin: 162.8, intranetId: 13896, category: "nowo_dodane", origin: "Chiny" },
  "Dispenser white": { plnPrice: 383.45, plnMargin: 358.45, intranetId: 13898, category: "nowo_dodane", origin: "Polska" },
  "AdDispenser Mocowanie Smart Frame": { plnPrice: 17.07, plnMargin: 15.4, intranetId: 13867, category: "nowo_dodane", origin: "Polska" },
  "Medium Admask Premium print": { plnPrice: 17.03, plnMargin: 11.53, intranetId: 13856, category: "nowo_dodane", origin: "Polska" },
  "Dispenser HIPROM": { plnPrice: 0, plnMargin: 0, intranetId: 13922, category: "nowo_dodane", origin: "Polska" },
  "Ramka OWZ A4 (wydruk Adsystem)": { plnPrice: 23.02, plnMargin: 19.69, intranetId: 13923, category: "nowo_dodane", origin: "Polska" },
  "Torba Standard / SEG 95x65": { plnPrice: 0, plnMargin: 0, intranetId: 14059, category: "nowo_dodane", origin: "Chiny" },
  "adFrame LMD 150x250 ND (bez wydruku)": { plnPrice: 1210.65, plnMargin: 885.75, intranetId: 14083, category: "nowo_dodane", origin: "Polska" },
  "Plecak do AIR TENT S3": { plnPrice: 0, plnMargin: 0, intranetId: 14098, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMD 200x250 PO (bez wydruku)": { plnPrice: 2337.29, plnMargin: 1869.38, intranetId: 14102, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMD 300x200 NO": { plnPrice: 2606.53, plnMargin: 1958.83, intranetId: 14120, category: "nowo_dodane", origin: "Polska" },
  "Hoker Cedro 65 cm czarny/czarne nogi": { plnPrice: 135.19, plnMargin: 121.86, intranetId: 14146, category: "nowo_dodane", origin: "Polska" },
  "adWall Vario Presto Light 060 Medi (bez wydruku) bez dozownika": { plnPrice: 164.23, plnMargin: 155.9, intranetId: 14192, category: "nowo_dodane", origin: "Chiny" },
  "Zamek kostkowy czarny, dł. 660cm": { plnPrice: 13.69, plnMargin: 1.24, intranetId: 14245, category: "nowo_dodane", origin: "Polska" },
  "Zamek kostkowy czarny, dł. 777cm": { plnPrice: 16.07, plnMargin: 1.47, intranetId: 14246, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - PayEye": { plnPrice: 0, plnMargin: 0, intranetId: 15830, category: "nowo_dodane", origin: "Polska" },
  "adFlag H - S (bez wydruku)": { plnPrice: 44.91, plnMargin: 41.58, intranetId: 15833, category: "nowo_dodane", origin: "Polska" },
  "Ramka OWZ A4 CZARNA (wydruk Adsystem)": { plnPrice: 19.27, plnMargin: 15.94, intranetId: 14799, category: "nowo_dodane", origin: "Polska" },
  "profil SAF - sklep - ramka - srebrny": { plnPrice: 10.26, plnMargin: 6.93, intranetId: 15889, category: "nowo_dodane", origin: "Chiny" },
  "Termometr elektroniczny PRO": { plnPrice: 99.22, plnMargin: 90.89, intranetId: 14333, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame DTF 100x100": { plnPrice: 78.08, plnMargin: 37.06, intranetId: 14347, category: "nowo_dodane", origin: "Polska" },
  "adFrame Quick Single 100x250 (bez wydruku)": { plnPrice: 399, plnMargin: 389.69, intranetId: 14365, category: "nowo_dodane", origin: "Chiny" },
  "adFrame Quick Single 100x200 (bez wydruku)": { plnPrice: 315.96, plnMargin: 306.72, intranetId: 14378, category: "nowo_dodane", origin: "Chiny" },
  "adFrame Quick Single 85x200 (bez wydruku)": { plnPrice: 304.42, plnMargin: 297.75, intranetId: 14379, category: "nowo_dodane", origin: "Chiny" },
  "adFrame LMS 100x200 NK": { plnPrice: 1022.78, plnMargin: 693.7, intranetId: 14436, category: "nowo_dodane", origin: "Polska" },
  "adFrame Quick Single - płytka plastikowa do przerobienia": { plnPrice: 0.04, plnMargin: 0, intranetId: 14494, category: "nowo_dodane", origin: "Chiny" },
  "Hoker Evia 65 cm różowy/złote nogi": { plnPrice: 256.72, plnMargin: 243.39, intranetId: 14729, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMD 100x150 PK Hanging": { plnPrice: 835.31, plnMargin: 529.02, intranetId: 14735, category: "nowo_dodane", origin: "Polska" },
  "adFrame STF 100x200 (bez wydruku)": { plnPrice: 313.05, plnMargin: 176.17, intranetId: 14504, category: "nowo_dodane", origin: "Chiny" },
  "Wydruk adFrame Blockout 100x300": { plnPrice: 90.6, plnMargin: 40.53, intranetId: 14724, category: "nowo_dodane", origin: "Polska" },
  "adFrame DTF 600x200": { plnPrice: 1691.87, plnMargin: 1287.89, intranetId: 14558, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame DTF 50x100": { plnPrice: 60.05, plnMargin: 21.78, intranetId: 14562, category: "nowo_dodane", origin: "Polska" },
  "adFrame STF 300x250": { plnPrice: 718.92, plnMargin: 454.33, intranetId: 14573, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 50x70": { plnPrice: 60.18, plnMargin: 16.82, intranetId: 14608, category: "nowo_dodane", origin: "Polska" },
  "adFrame DTF 100x250 Hanging": { plnPrice: 595.58, plnMargin: 380.06, intranetId: 14616, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMSM 70x120 NK (bez wydruku)": { plnPrice: 531.47, plnMargin: 324.53, intranetId: 14661, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMSM 80x140 ND (bez wydruku)": { plnPrice: 566.54, plnMargin: 357.6, intranetId: 14666, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMSM 60x100 PD": { plnPrice: 623.6, plnMargin: 361.4, intranetId: 14698, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMSM 70x120 NK": { plnPrice: 601.84, plnMargin: 353.95, intranetId: 14701, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame LMD/LMS/LMSM 80x140": { plnPrice: 70.75, plnMargin: 29.8, intranetId: 14716, category: "nowo_dodane", origin: "Polska" },
  "Zasilacz do dyspensera": { plnPrice: 11.24, plnMargin: 11.24, intranetId: 14787, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMS 400x200 NO": { plnPrice: 2701.57, plnMargin: 1899.75, intranetId: 14759, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame DTF 600x200": { plnPrice: 282.46, plnMargin: 191.93, intranetId: 14816, category: "nowo_dodane", origin: "Polska" },
  "mFrame DOOR CUT PROFIL A": { plnPrice: 38.91, plnMargin: 37.24, intranetId: 15413, category: "nowo_dodane", origin: "Polska" },
  "mFrame DOOR CUT PROFIL B": { plnPrice: 38.91, plnMargin: 37.24, intranetId: 15414, category: "nowo_dodane", origin: "Polska" },
  "mFrame DOOR CUT PROFIL C": { plnPrice: 38.91, plnMargin: 37.24, intranetId: 15415, category: "nowo_dodane", origin: "Polska" },
  "mFrame DOOR CUT PROFIL D": { plnPrice: 38.91, plnMargin: 37.24, intranetId: 15416, category: "nowo_dodane", origin: "Polska" },
  "mFrame DOOR CUT PROFIL F": { plnPrice: 38.91, plnMargin: 37.24, intranetId: 15418, category: "nowo_dodane", origin: "Polska" },
  "Multiframe lampa plafon": { plnPrice: 80.4, plnMargin: 72.07, intranetId: 15426, category: "nowo_dodane", origin: "Polska" },
  "Hoker Atena (biały) RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16366, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Cortinas (czarny) RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16372, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Manila siedzisko białe RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16373, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Helsinki siedzisko białe RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16374, category: "nowo_dodane", origin: "Polska" },
  "Stolik barowy 60cm blat biały RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16375, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 496x1240 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 15517, category: "nowo_dodane", origin: "Chiny" },
  "Zasilacz do termometra elektronicznego USB 2A BIAŁA": { plnPrice: 14.29, plnMargin: 14.29, intranetId: 14849, category: "nowo_dodane", origin: "Polska" },
  "adFrame Przewód [3x0,75mm] czarny": { plnPrice: 2.33, plnMargin: 0.21, intranetId: 14868, category: "nowo_dodane", origin: "Chiny" },
  "Hoker Nicea 65 cm czarny siedzisko": { plnPrice: 169.58, plnMargin: 162.91, intranetId: 14873, category: "nowo_dodane", origin: "Polska" },
  "AdPanel 500": { plnPrice: 0, plnMargin: 0, intranetId: 15531, category: "nowo_dodane", origin: "Polska" },
  "AdPanel 350": { plnPrice: 0, plnMargin: 0, intranetId: 15532, category: "nowo_dodane", origin: "Polska" },
  "adBarrier stopa T": { plnPrice: 29.96, plnMargin: 29.96, intranetId: 15037, category: "nowo_dodane", origin: "Polska" },
  "adBarrier półstopa L Lewa": { plnPrice: 25.68, plnMargin: 25.68, intranetId: 15038, category: "nowo_dodane", origin: "Polska" },
  "adBarrier półstopa L Prawa": { plnPrice: 25.68, plnMargin: 25.68, intranetId: 15039, category: "nowo_dodane", origin: "Polska" },
  "Usługi malowania": { plnPrice: 0, plnMargin: 0, intranetId: 15553, category: "nowo_dodane", origin: "Polska" },
  "adframe SUP stopa": { plnPrice: 28.07, plnMargin: 26.4, intranetId: 15091, category: "nowo_dodane", origin: "Polska" },
  "adBox Hit blat niestandard": { plnPrice: 78.17, plnMargin: 71.5, intranetId: 15104, category: "nowo_dodane", origin: "Polska" },
  "adTribune Standard blat niestandard": { plnPrice: 0, plnMargin: 0, intranetId: 15117, category: "nowo_dodane", origin: "Chiny" },
  "mFrame DRZWI DZIELONE 992x2480 KOMPLET": { plnPrice: 984.11, plnMargin: 864.11, intranetId: 15089, category: "nowo_dodane", origin: "Polska" },
  "adTribune SEG blat niestandard": { plnPrice: 162.64, plnMargin: 162.64, intranetId: 15118, category: "nowo_dodane", origin: "Polska" },
  "adFrame CTF 200x200x100 (bez wydruku)": { plnPrice: 555.4, plnMargin: 403.73, intranetId: 15124, category: "nowo_dodane", origin: "Chiny" },
  "Ultron 984mm": { plnPrice: 1155, plnMargin: 1155, intranetId: 15202, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame CTF 300x300": { plnPrice: 264, plnMargin: 192.39, intranetId: 15148, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame Blockout 150x200": { plnPrice: 66.55, plnMargin: 54.26, intranetId: 15238, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame Blockout 400x200": { plnPrice: 206.94, plnMargin: 130.74, intranetId: 15244, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame Blockout 50x70": { plnPrice: 67.03, plnMargin: 21.15, intranetId: 15251, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame Blockout 70x120": { plnPrice: 85.98, plnMargin: 36.69, intranetId: 15256, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame Blockout 80x140": { plnPrice: 86.35, plnMargin: 37.06, intranetId: 15257, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Curved Channel Bar, 3-section": { plnPrice: 0, plnMargin: 0, intranetId: 15430, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Side Channel Bar": { plnPrice: 0, plnMargin: 0, intranetId: 15429, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMS narożnik 135° (bez gwintu)": { plnPrice: 0, plnMargin: 0, intranetId: 15344, category: "nowo_dodane", origin: "Chiny" },
  "adFrame DTF - Torba 105x16x26": { plnPrice: 382.85, plnMargin: 376.18, intranetId: 15326, category: "nowo_dodane", origin: "Chiny" },
  "adFrame DTF - Torba 160x16x16": { plnPrice: 418.9, plnMargin: 412.23, intranetId: 15329, category: "nowo_dodane", origin: "Chiny" },
  "adFrame DTF - Torba 110x16x26": { plnPrice: 366.35, plnMargin: 359.68, intranetId: 15327, category: "nowo_dodane", origin: "Chiny" },
  "mFrame RAMA 992x1240 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 15331, category: "nowo_dodane", origin: "Chiny" },
  "adFrame DTF - Torba 135x16x26": { plnPrice: 418.07, plnMargin: 411.4, intranetId: 15328, category: "nowo_dodane", origin: "Chiny" },
  "adFrame DTF - Torba 155x18x26": { plnPrice: 501.4, plnMargin: 494.73, intranetId: 15330, category: "nowo_dodane", origin: "Chiny" },
  "mFrame RAMA 992x1984 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 15334, category: "nowo_dodane", origin: "Chiny" },
  "MSS MBIS ink BLACK BAG 2000ML": { plnPrice: 475.59, plnMargin: 43.23, intranetId: 15620, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta opony": { plnPrice: 0, plnMargin: 0, intranetId: 15761, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta pokazówki": { plnPrice: 0, plnMargin: 0, intranetId: 15762, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta wyposażenie Produkcji": { plnPrice: 0, plnMargin: 0, intranetId: 15764, category: "nowo_dodane", origin: "Polska" },
  "MS Washing Liquid 220ML": { plnPrice: 0, plnMargin: 0, intranetId: 15956, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta wyposażenie Handlowy": { plnPrice: 0, plnMargin: 0, intranetId: 15765, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta części zamienne": { plnPrice: 0, plnMargin: 0, intranetId: 15768, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta wydruki": { plnPrice: 0, plnMargin: 0, intranetId: 15766, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta inne": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 15767, category: "nowo_dodane", origin: "Polska" },
  "Karton Rollup 85": { plnPrice: 5.71, plnMargin: 5.71, intranetId: 16108, category: "nowo_dodane", origin: "Polska" },
  "adTent Air 4x4 - Podłoga": { plnPrice: 0, plnMargin: 0, intranetId: 15810, category: "nowo_dodane", origin: "Polska" },
  "adTent Air 5x5 - Podłoga": { plnPrice: 0, plnMargin: 0, intranetId: 15811, category: "nowo_dodane", origin: "Polska" },
  "adTent Air 6x6 - Podłoga": { plnPrice: 0, plnMargin: 0, intranetId: 15812, category: "nowo_dodane", origin: "Polska" },
  "profil SWF - sklep": { plnPrice: 11.9, plnMargin: 8.57, intranetId: 15891, category: "nowo_dodane", origin: "Chiny" },
  "adTent Air - Worek na wodę": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 15813, category: "nowo_dodane", origin: "Polska" },
  "adFrame SAF/SWF - - sklep - rurka do supportu": { plnPrice: 4.48, plnMargin: 2.81, intranetId: 15902, category: "nowo_dodane", origin: "Polska" },
  "adFrame SAF/SWF/STFL - sklep - pianka": { plnPrice: 2.64, plnMargin: 0.97, intranetId: 15903, category: "nowo_dodane", origin: "Polska" },
  "adTribune Table CDX-T02": { plnPrice: 0, plnMargin: 0, intranetId: 16146, category: "nowo_dodane", origin: "Polska" },
  "Ramka plastikowa 5cm": { plnPrice: 1.15, plnMargin: 1.15, intranetId: 16163, category: "nowo_dodane", origin: "Polska" },
  "Profil zamknięty aluminiowy 10x20mm": { plnPrice: 7.97, plnMargin: 7.97, intranetId: 16164, category: "nowo_dodane", origin: "Polska" },
  "adWall Vario Presto 090 (bez wydruku) - prostokątna podstawa": { plnPrice: 114.42, plnMargin: 106.09, intranetId: 16175, category: "nowo_dodane", origin: "Chiny" },
  "adDynamic Wall 100x250": { plnPrice: 710.55, plnMargin: 536.94, intranetId: 16181, category: "nowo_dodane", origin: "Polska" },
  "adDynamic Wall 300x150": { plnPrice: 710.55, plnMargin: 536.94, intranetId: 16182, category: "nowo_dodane", origin: "Polska" },
  "adDynamic Wall 500x200": { plnPrice: 710.55, plnMargin: 536.94, intranetId: 16183, category: "nowo_dodane", origin: "Polska" },
  "adTribune Table CDX-T06": { plnPrice: 0, plnMargin: 0, intranetId: 16189, category: "nowo_dodane", origin: "Polska" },
  "adTribune Table CDX-T07": { plnPrice: 0, plnMargin: 0, intranetId: 16190, category: "nowo_dodane", origin: "Polska" },
  "adTent Air premium 8x8 (bez wydruku)": { plnPrice: 4146.05, plnMargin: 4103.65, intranetId: 16208, category: "nowo_dodane", origin: "Chiny" },
  "Adsystem - wzorce": { plnPrice: 0, plnMargin: 0, intranetId: 16209, category: "nowo_dodane", origin: "Polska" },
  "adTent Air 4x4 (bez wydruku) SZARY": { plnPrice: 0, plnMargin: 0, intranetId: 16273, category: "nowo_dodane", origin: "Chiny" },
  "Karton - adWall Vario S  80": { plnPrice: 0.04, plnMargin: 0.04, intranetId: 16279, category: "nowo_dodane", origin: "Polska" },
  "adFloor 3x3 maskownice": { plnPrice: 1081.44, plnMargin: 1061.44, intranetId: 16263, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA PŁASKA 496 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16339, category: "nowo_dodane", origin: "Chiny" },
  "mFrame MASKOWNICA PŁASKA 992 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16340, category: "nowo_dodane", origin: "Chiny" },
  "mFrame MASKOWNICA PŁASKA 1240 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16341, category: "nowo_dodane", origin: "Chiny" },
  "mFrame MASKOWNICA PŁASKA 1488 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16342, category: "nowo_dodane", origin: "Chiny" },
  "mFrame MASKOWNICA PŁASKA 1984 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16343, category: "nowo_dodane", origin: "Chiny" },
  "adFrame LMD/LMS stopa RENTAL": { plnPrice: 33.7, plnMargin: 32.03, intranetId: 16400, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA PŁASKA 2480 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16344, category: "nowo_dodane", origin: "Chiny" },
  "WIESZAK TV - VESA 32-82\"\" RENTAL": { plnPrice: 5.53, plnMargin: 3.86, intranetId: 16349, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 496x496 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16350, category: "nowo_dodane", origin: "Chiny" },
  "HALOGEN LED 200W RENTAL (czarne)": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16351, category: "nowo_dodane", origin: "Polska" },
  "HALOGEN LED 100W RENTAL (szare)": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16352, category: "nowo_dodane", origin: "Polska" },
  "HALOGEN LED 300W RENTAL (szare)": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16353, category: "nowo_dodane", origin: "Polska" },
  "HALOGEN LED 300W RENTAL (czarne)": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16354, category: "nowo_dodane", origin: "Polska" },
  "HALOGEN LED 100W RENTAL (czarne)": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16356, category: "nowo_dodane", origin: "Polska" },
  "Karton - Vario 43x43x120": { plnPrice: 0, plnMargin: 0, intranetId: 16358, category: "nowo_dodane", origin: "Polska" },
  "stoisko SEGO Light Box 2x3 \"\"I": { plnPrice: 2175.22, plnMargin: 2053.9, intranetId: 17001, category: "nowo_dodane", origin: "Polska" },
  "stoisko SEGO Light Box 2x3 \"\"U": { plnPrice: 6143.49, plnMargin: 5674.91, intranetId: 17003, category: "nowo_dodane", origin: "Polska" },
  "stoisko SEGO Light Box  4x3 \"\"L": { plnPrice: 5196.3, plnMargin: 4984, intranetId: 17006, category: "nowo_dodane", origin: "Polska" },
  "MFRAME Trybunka Blat 1040x600x18 - (100x50) - szary": { plnPrice: 0, plnMargin: 0, intranetId: 17316, category: "nowo_dodane", origin: "Polska" },
  "adTribune Tex blat niestandard": { plnPrice: 0, plnMargin: 0, intranetId: 17163, category: "nowo_dodane", origin: "Chiny" },
  "Foldable roof connector": { plnPrice: 5.68, plnMargin: 4.01, intranetId: 16981, category: "nowo_dodane", origin: "???" },
  "SEGO Bridge Middle Support": { plnPrice: 19.28, plnMargin: 17.61, intranetId: 17142, category: "nowo_dodane", origin: "Polska" },
  "adFolder A4 RENTAL": { plnPrice: 1.1, plnMargin: 1.1, intranetId: 16486, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta do wyjaśnienia": { plnPrice: 0, plnMargin: 0, intranetId: 16488, category: "nowo_dodane", origin: "Polska" },
  "Półka niestandardowa - kasetony": { plnPrice: 0, plnMargin: 0, intranetId: 16460, category: "nowo_dodane", origin: "Polska" },
  "adFloor płyta 997x997mm, grubość 12mm BIAŁA RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16527, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - produkty inne": { plnPrice: 0, plnMargin: 0, intranetId: 16558, category: "nowo_dodane", origin: "Polska" },
  "Hoker Cortina czarny RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 16560, category: "nowo_dodane", origin: "Polska" },
  "adTent EXPRESS halfbar 3x4,5": { plnPrice: 108.9, plnMargin: 108.9, intranetId: 16542, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adColumn Air ∅60x220": { plnPrice: 0, plnMargin: 0, intranetId: 16565, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTent Air premium 4x4": { plnPrice: 0, plnMargin: 0, intranetId: 16566, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTent EXPRESS 3x3m": { plnPrice: 0, plnMargin: 0, intranetId: 16567, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adWall Vario Prosta Light 240": { plnPrice: 0, plnMargin: 0, intranetId: 16570, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_adWall Vario Presto Light 060 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 16571, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_handel.pl_adTribune Big Quick LED": { plnPrice: 0, plnMargin: 0, intranetId: 16577, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adWall Vario Presto Light 150 (bez wydruku)": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 16579, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_adFrame Smart 200x250 (bez wydruku)": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 16580, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_adFrame Quick 100x200 w torbie na kółkach": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 16582, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand BannerAd 100": { plnPrice: 0, plnMargin: 0, intranetId: 16589, category: "nowo_dodane", origin: "Chiny" },
  "adTribune Shell (bez wydruku) RENTAL": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 16598, category: "nowo_dodane", origin: "Polska" },
  "zlew z szafką RENTAL": { plnPrice: 4.01, plnMargin: 4.01, intranetId: 16671, category: "nowo_dodane", origin: "Polska" },
  "adWall Edge Counter Bar": { plnPrice: 0, plnMargin: 0, intranetId: 16662, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTribune Quick": { plnPrice: 0, plnMargin: 0, intranetId: 16710, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adFrame Quick Single 100x200": { plnPrice: 0, plnMargin: 0, intranetId: 16711, category: "nowo_dodane", origin: "Polska" },
  "Ramka OWZ A3 (wydruk Adsystem)": { plnPrice: 0, plnMargin: 0, intranetId: 16734, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - SUN.STORE": { plnPrice: 1.1, plnMargin: 1.1, intranetId: 16889, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - GYEON EU": { plnPrice: 1.1, plnMargin: 1.1, intranetId: 16892, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adFrame Quick Battery 100x200 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 17256, category: "nowo_dodane", origin: "Chiny" },
  "mFrame LAMPKA LED RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17223, category: "nowo_dodane", origin: "Polska" },
  "mFrame PANEL TV RENTAL": { plnPrice: 26.1, plnMargin: 1.1, intranetId: 17224, category: "nowo_dodane", origin: "Polska" },
  "WIESZAK TV - VESA 26-55\"\" wąski RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17225, category: "nowo_dodane", origin: "Polska" },
  "mFrame PÓŁKA UCHWYT PIN KOMPLET RENTAL": { plnPrice: 34.43, plnMargin: 1.1, intranetId: 17226, category: "nowo_dodane", origin: "Polska" },
  "mFrame ŁĄCZNIK ZEW/ZEW 90 STOPNI RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17227, category: "nowo_dodane", origin: "Chiny" },
  "mFrame ŁĄCZNIK WEW/ZEW 90 STOPNI RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 17228, category: "nowo_dodane", origin: "Chiny" },
  "mFrame CLAMP DOOR CONNECTOR RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17230, category: "nowo_dodane", origin: "Chiny" },
  "mFrame PIN SUPERSLIM 4CM RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17231, category: "nowo_dodane", origin: "Chiny" },
  "mFrame NAKRĘTKA SUPERSLIM RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17414, category: "nowo_dodane", origin: "Polska" },
  "mFrame PIN MOCOWANIE MASKOWNICY ŁUKOWEJ RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17417, category: "nowo_dodane", origin: "Chiny" },
  "mFrame ŁĄCZNIK L 90 STOPNI RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17418, category: "nowo_dodane", origin: "Chiny" },
  "mFrame blat do półki - białe RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 17138, category: "nowo_dodane", origin: "Polska" },
  "Medium Tex Premium 250cm ALTERNATYWA": { plnPrice: 42.35, plnMargin: 36.85, intranetId: 17038, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - HTD": { plnPrice: 1.1, plnMargin: 1.1, intranetId: 17046, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTribune Expo 100x100": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17080, category: "nowo_dodane", origin: "Polska" },
  "mFrame PIN FAT 4CM RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17232, category: "nowo_dodane", origin: "Chiny" },
  "mFrame PIN FAT 5CM RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17233, category: "nowo_dodane", origin: "Chiny" },
  "mFrame PIN FAT 7CM RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17234, category: "nowo_dodane", origin: "Chiny" },
  "mFrame ŁĄCZNIK I 6PIN 180 STOPNI RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17235, category: "nowo_dodane", origin: "Polska" },
  "mFrame ŁĄCZNIK I 4PIN 180 STOPNI RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17236, category: "nowo_dodane", origin: "Chiny" },
  "mFrame NAKRĘTKA FAT RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17237, category: "nowo_dodane", origin: "Polska" },
  "mFrame LAMPKA ADAPTER RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17238, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - LAFARGE": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17285, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - GREENFIELDS/BETAFENCE": { plnPrice: 1.1, plnMargin: 1.1, intranetId: 16924, category: "nowo_dodane", origin: "Polska" },
  "adTribune Expo blat górny (bez wydruku)": { plnPrice: 65.06, plnMargin: 60.06, intranetId: 16967, category: "nowo_dodane", origin: "Polska" },
  "TELEWIZOR LCD 40\"\" RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 16955, category: "nowo_dodane", origin: "Polska" },
  "TELEWIZOR LCD 55\"\" RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 16956, category: "nowo_dodane", origin: "Polska" },
  "TELEWIZOR DOTYKOWY LCD 55\"\" RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 16957, category: "nowo_dodane", origin: "Polska" },
  "Stół kwadratowy 70x70cm blat biały RENTAL": { plnPrice: 418.57, plnMargin: 416.9, intranetId: 16788, category: "nowo_dodane", origin: "Polska" },
  "Stoisko Multiframe 250 2x3 \"\"U": { plnPrice: 5677.96, plnMargin: 5133.83, intranetId: 17090, category: "nowo_dodane", origin: "Polska" },
  "Kabel zasilający do zasilacza KONICZYNKA 1.5m": { plnPrice: 10.74, plnMargin: 10.74, intranetId: 16855, category: "nowo_dodane", origin: "Polska" },
  "regał RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 16869, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - ABC CZEPCZYŃSKI": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17371, category: "nowo_dodane", origin: "Polska" },
  "SEGO Door Kit Wheel": { plnPrice: 11.18, plnMargin: 9.51, intranetId: 17387, category: "nowo_dodane", origin: "Polska" },
  "Karabińczyk TUV": { plnPrice: 1.56, plnMargin: 1.56, intranetId: 17393, category: "nowo_dodane", origin: "Polska" },
  "Rękaw foliowy Multiframe": { plnPrice: 1.15, plnMargin: 0.1, intranetId: 17382, category: "nowo_dodane", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 130,2x248cm": { plnPrice: 113.92, plnMargin: 50.7, intranetId: 17397, category: "nowo_dodane", origin: "Polska" },
  "Multiframe 250 dach 200cm": { plnPrice: 2067.85, plnMargin: 1773.57, intranetId: 17212, category: "nowo_dodane", origin: "Polska" },
  "mFrame STYRODUR C": { plnPrice: 147.97, plnMargin: 146.3, intranetId: 17110, category: "nowo_dodane", origin: "Polska" },
  "Wydruk Adtent Air premium 6x6 (same nogi 2)": { plnPrice: 160.12, plnMargin: 116, intranetId: 17304, category: "nowo_dodane", origin: "Polska" },
  "Wydruk Adtent Air premium 6x6 (same nogi 4)": { plnPrice: 276.92, plnMargin: 206.59, intranetId: 17306, category: "nowo_dodane", origin: "Polska" },
  "MFRAME Trybunka półka 980x376x18 - (100x50)": { plnPrice: 0, plnMargin: 0, intranetId: 17322, category: "nowo_dodane", origin: "Polska" },
  "LISTWA LED (długa) RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 17434, category: "nowo_dodane", origin: "Polska" },
  "LISTWA LED (krótka) RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 17435, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - HEATPEX": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17437, category: "nowo_dodane", origin: "Polska" },
  "SEGO zaślepka do kabli": { plnPrice: 0, plnMargin: 0, intranetId: 17440, category: "nowo_dodane", origin: "Polska" },
  "Multiframe kantorek 350cm (Black)": { plnPrice: 4929.71, plnMargin: 4483.92, intranetId: 17444, category: "nowo_dodane", origin: "Polska" },
  "adFrame STFL narożnik 90 stopni ELSTAR": { plnPrice: 0, plnMargin: 0, intranetId: 17432, category: "nowo_dodane", origin: "Chiny" },
  "Multiframe fasolka do stopy": { plnPrice: 0, plnMargin: 0, intranetId: 17447, category: "nowo_dodane", origin: "Polska" },
  "adTribune LMD 100x100 blat (czarny)": { plnPrice: 0, plnMargin: 0, intranetId: 17448, category: "nowo_dodane", origin: "Polska" },
  "adFloor płyta 997x997mm, grubość 18mm (acryl)": { plnPrice: 180.57, plnMargin: 178.9, intranetId: 17451, category: "nowo_dodane", origin: "Polska" },
  "mFrame PANEL TV regulowany": { plnPrice: 265.2, plnMargin: 240.2, intranetId: 17454, category: "nowo_dodane", origin: "Polska" },
  "profil STF elstar": { plnPrice: 26.87, plnMargin: 23.54, intranetId: 17455, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA PŁASKA 2976 RENTAL": { plnPrice: 9.43, plnMargin: 1.1, intranetId: 17462, category: "nowo_dodane", origin: "Chiny" },
  "Stół barowy Peru biały 60 cm (wysoki) RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17468, category: "nowo_dodane", origin: "Polska" },
  "Stół Lima okrągły 100 biały blat bez nóg": { plnPrice: 0, plnMargin: 0, intranetId: 17470, category: "nowo_dodane", origin: "Polska" },
  "Podstawa do Hokera Boliwia kolor czarny RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17475, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - paleta torby zamienne": { plnPrice: 0, plnMargin: 0, intranetId: 17476, category: "nowo_dodane", origin: "Polska" },
  "STATYW RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17498, category: "nowo_dodane", origin: "Polska" },
  "mFrame WÓZEK 6 RAM POPRAWIONE": { plnPrice: 127.97, plnMargin: 119.64, intranetId: 17499, category: "nowo_dodane", origin: "Polska" },
  "adGate Air Triangle 6,5m ver2 TPU": { plnPrice: 500.35, plnMargin: 400.35, intranetId: 17508, category: "nowo_dodane", origin: "Polska" },
  "Stolik Moss czarny RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17511, category: "nowo_dodane", origin: "Polska" },
  "HALOGEN LED 22W RENTAL (biały)": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17514, category: "nowo_dodane", origin: "Polska" },
  "adTent Air 3x3 zamek do dachu": { plnPrice: 64.01, plnMargin: 14.01, intranetId: 17532, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Porto czarne RENTAL": { plnPrice: 14.4, plnMargin: 1.07, intranetId: 17556, category: "nowo_dodane", origin: "Polska" },
  "Stolik Ande (ciemny niebieski) RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17558, category: "nowo_dodane", origin: "Polska" },
  "lodówka barowa RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17561, category: "nowo_dodane", origin: "Polska" },
  "Stół okrągły 80 czarny RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17562, category: "nowo_dodane", origin: "Polska" },
  "adTent Air 4x4 & 5x5 zamek do dachu": { plnPrice: 66.42, plnMargin: 16.42, intranetId: 17579, category: "nowo_dodane", origin: "Polska" },
  "POMPKA ELEKTRYCZNA BRAVO RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 17585, category: "nowo_dodane", origin: "Chiny" },
  "Wydruk mFrame na tekstyliach - 99,2x198,4cm KLEJONY": { plnPrice: 254.09, plnMargin: 168.15, intranetId: 17595, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Helsinki podstawa metalowa czarna RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17604, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Manila podstawa RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17605, category: "nowo_dodane", origin: "Polska" },
  "Stolik barowy podstawa RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17606, category: "nowo_dodane", origin: "Polska" },
  "Stół Capri podstawa RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17607, category: "nowo_dodane", origin: "Polska" },
  "adWall Vario Presto Light 090 (bez wydruku) RENTAL": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 17620, category: "nowo_dodane", origin: "Chiny" },
  "adTribune Seg RENTAL": { plnPrice: 26.07, plnMargin: 1.07, intranetId: 17621, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTent V 6X6 (sama konstrukcja)": { plnPrice: 0, plnMargin: 0, intranetId: 17624, category: "nowo_dodane", origin: "Polska" },
  "Zamek kostkowy biały - wodzik": { plnPrice: 0.96, plnMargin: 0.09, intranetId: 17626, category: "nowo_dodane", origin: "Polska" },
  "adVideo Kiosk 65` RENTAL": { plnPrice: 201.07, plnMargin: 1.07, intranetId: 17613, category: "nowo_dodane", origin: "Polska" },
  "Stare złączki led do kasetonów": { plnPrice: 0, plnMargin: 0, intranetId: 17649, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Boliwia białe siedzisko/czarne nogi komplet": { plnPrice: 91.4, plnMargin: 88.07, intranetId: 17636, category: "nowo_dodane", origin: "Polska" },
  "Stolik barowy 60cm biały komplet RENTAL": { plnPrice: 7.17, plnMargin: 2.17, intranetId: 17638, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO 60 Single Side 85x200": { plnPrice: 0, plnMargin: 0, intranetId: 17658, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO Mini Display Stand 100x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 17659, category: "nowo_dodane", origin: "Polska" },
  "VideoWall BOX PROTECT RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17660, category: "nowo_dodane", origin: "Polska" },
  "VideoWall CABLE POWER CONNECTOR RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17661, category: "nowo_dodane", origin: "Polska" },
  "VideoWall CABLE POWER INPUT RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17662, category: "nowo_dodane", origin: "Polska" },
  "VideoWall CABLE SIGNAL CONNECTOR RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17663, category: "nowo_dodane", origin: "Polska" },
  "VideoWall CABLE SIGNAL INPUT RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17664, category: "nowo_dodane", origin: "Polska" },
  "VideoWall MASTER HUB VX10x15 HDMI RENTAL": { plnPrice: 51.07, plnMargin: 1.07, intranetId: 17666, category: "nowo_dodane", origin: "Polska" },
  "VideoWall MASTER HUB VX4x15 USB RENTAL": { plnPrice: 51.07, plnMargin: 1.07, intranetId: 17668, category: "nowo_dodane", origin: "Polska" },
  "VideoWall MASTER HUB VX6x15 HDMI RENTAL": { plnPrice: 51.07, plnMargin: 1.07, intranetId: 17669, category: "nowo_dodane", origin: "Polska" },
  "VideoWall PANEL ver2 RENTAL": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 17672, category: "nowo_dodane", origin: "Polska" },
  "VideoWall PIN FAT M6 RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17674, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - FIREFLY PL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17699, category: "nowo_dodane", origin: "Polska" },
  "adFrame Quick 100x200 - wkład do torby": { plnPrice: 16.34, plnMargin: 8.01, intranetId: 17709, category: "nowo_dodane", origin: "Polska" },
  "adFrame Quick 100x250 - wkład do torby": { plnPrice: 14.68, plnMargin: 8.01, intranetId: 17710, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - blokada miejsca": { plnPrice: 0, plnMargin: 0, intranetId: 17745, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - NIPPLEX": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17713, category: "nowo_dodane", origin: "Polska" },
  "adFrame Quick Single 85x200 plecy do wymiany": { plnPrice: 2, plnMargin: 2, intranetId: 17715, category: "nowo_dodane", origin: "Polska" },
  "adFrame STFL 100x70 (bez wydruku) ELSTAR": { plnPrice: 0, plnMargin: 0, intranetId: 17716, category: "nowo_dodane", origin: "elstar????" },
  "adWall Vario Classic 100 dwustronne": { plnPrice: 483.99, plnMargin: 398.17, intranetId: 17719, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 297,6x248": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17724, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 297,6x198,4": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 17727, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMS 372x200": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 17729, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adGate Air Triangle 6,5m ver2 (bez wydruku)": { plnPrice: 34.4, plnMargin: 1.07, intranetId: 17737, category: "nowo_dodane", origin: "Polska" },
  "multiframe LAMPKA LED 116 RENTAL (srebrna)": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17740, category: "nowo_dodane", origin: "Chiny" },
  "multiframe LAMPKA LED 116 RENTAL (czarna)": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17741, category: "nowo_dodane", origin: "Chiny" },
  "Stół Peru czarny 70 cm(niski) RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17763, category: "nowo_dodane", origin: "Polska" },
  "Stół barowy Peru czarny 60 cm(wysoki) RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17764, category: "nowo_dodane", origin: "Polska" },
  "Sofa Kavos szary RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17765, category: "nowo_dodane", origin: "Polska" },
  "Blat do stołu  Siena  szary RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 17766, category: "nowo_dodane", origin: "Polska" },
  "Podstawa do stołu  Siena RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 17767, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Boliwia czarne siedzisko/czarne nogi komplet": { plnPrice: 56.44, plnMargin: 53.11, intranetId: 17771, category: "nowo_dodane", origin: "Polska" },
  "Mframe plafon RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17786, category: "nowo_dodane", origin: "Polska" },
  "Ekspozytor CTF RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17787, category: "nowo_dodane", origin: "Polska" },
  "Krzesło (niebieskie) RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 17825, category: "nowo_dodane", origin: "Polska" },
  "Worek na wydruki foliowy 60x40x60cm": { plnPrice: 0, plnMargin: 0, intranetId: 17836, category: "nowo_dodane", origin: "Polska" },
  "Krzesło Helsinki podstawa drewniana RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 17838, category: "nowo_dodane", origin: "Polska" },
  "adFrame Quick 100x200 (bez wydruku) profil B1": { plnPrice: 10.57, plnMargin: 3.9, intranetId: 17848, category: "nowo_dodane", origin: "Chiny" },
  "adFrame Quick 100x200 (bez wydruku) profil B2": { plnPrice: 10.57, plnMargin: 3.9, intranetId: 17849, category: "nowo_dodane", origin: "Chiny" },
  "adFrame Quick 100x200 (bez wydruku) profil C2": { plnPrice: 10.57, plnMargin: 3.9, intranetId: 17851, category: "nowo_dodane", origin: "Chiny" },
  "adFrame Quick 100x200 (bez wydruku) profil D": { plnPrice: 10.57, plnMargin: 3.9, intranetId: 17852, category: "nowo_dodane", origin: "Chiny" },
  "Torba Vario MagnetWall 31x11x120cm": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 17863, category: "nowo_dodane", origin: "Chiny" },
  "ekspres do kawy kapsułkowy RENTAL": { plnPrice: 426.93, plnMargin: 426.93, intranetId: 17864, category: "nowo_dodane", origin: "Polska" },
  "Hoker Evia Teddy 65 cm szary/złote nogi": { plnPrice: 0, plnMargin: 0, intranetId: 17866, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_handel.pl_Pop-up Counter Lightbox 100x100": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 17874, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_handel.pl_adFrame Smart 100x200": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 17877, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_handel.pl_adFrame Quick Budget 100x200": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 17878, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_handel.pl_adTent EXPRESS PRO 3x3m": { plnPrice: 34.4, plnMargin: 1.07, intranetId: 17879, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - SYMETRICUS/AK UNIVERSE": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18233, category: "nowo_dodane", origin: "Polska" },
  "mFrame ŁĄCZNIK LMD UNIWER RENTAL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18028, category: "nowo_dodane", origin: "Polska" },
  "adFloor profil panelowy RENTAL": { plnPrice: 27.7, plnMargin: 26.03, intranetId: 18119, category: "nowo_dodane", origin: "Chiny" },
  "adFloor profil wzmocnienie RENTAL": { plnPrice: 30.49, plnMargin: 28.82, intranetId: 18120, category: "nowo_dodane", origin: "Chiny" },
  "adFloor łącznik profili RENTAL": { plnPrice: 23.69, plnMargin: 22.02, intranetId: 18121, category: "nowo_dodane", origin: "Chiny" },
  "adFloor najazd prosty RENTAL": { plnPrice: 143.38, plnMargin: 136.71, intranetId: 18122, category: "nowo_dodane", origin: "Chiny" },
  "adFloor najazd narożny lewy RENTAL": { plnPrice: 147.14, plnMargin: 140.47, intranetId: 18123, category: "nowo_dodane", origin: "Chiny" },
  "adFloor najazd narożny prawy RENTAL": { plnPrice: 147.14, plnMargin: 140.47, intranetId: 18124, category: "nowo_dodane", origin: "Chiny" },
  "adFloor najazd narożny sklejka RENTAL": { plnPrice: 41.26, plnMargin: 39.59, intranetId: 18125, category: "nowo_dodane", origin: "Polska" },
  "adFloor najazd prosty PCV kątownik długi na LED RENTAL": { plnPrice: 3.87, plnMargin: 2.2, intranetId: 18126, category: "nowo_dodane", origin: "Chiny" },
  "adFloor najazd prosty PCV kątownik krótki na LED RENTAL": { plnPrice: 4.07, plnMargin: 2.4, intranetId: 18127, category: "nowo_dodane", origin: "Chiny" },
  "adFloor najazd prosty PCV listwa RENTAL": { plnPrice: 16.32, plnMargin: 14.65, intranetId: 18128, category: "nowo_dodane", origin: "Chiny" },
  "zabudowa - dach double deck": { plnPrice: 0, plnMargin: 0, intranetId: 18137, category: "nowo_dodane", origin: "Polska" },
  "Oczko stalowe M10 otwór gwintowany": { plnPrice: 1.61, plnMargin: 1.61, intranetId: 18147, category: "nowo_dodane", origin: "Chiny" },
  "Torba do adFrame Quick Budget 100x200": { plnPrice: 36.25, plnMargin: 8.99, intranetId: 18149, category: "nowo_dodane", origin: "Chiny" },
  "zabudowa - IBSA": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18180, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - DUOLIFE": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18181, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_handel.pl_adWall Vario Łukowa Light 300": { plnPrice: 0, plnMargin: 0, intranetId: 18186, category: "nowo_dodane", origin: "Chiny" },
  "RENTAL_adFrame LMD 286x247,7": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18196, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMS 372x198,4": { plnPrice: 0, plnMargin: 0, intranetId: 18199, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM 70x198,2": { plnPrice: 0, plnMargin: 0, intranetId: 18203, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 100x250": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18204, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 297,6x99,2": { plnPrice: 0, plnMargin: 0, intranetId: 18205, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM 99,1x99,1": { plnPrice: 0, plnMargin: 0, intranetId: 18208, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM 70x198,3": { plnPrice: 0, plnMargin: 0, intranetId: 18209, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 198,4x347,2": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18211, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM 148,6x99,2": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18212, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMS 297,2x200": { plnPrice: 0, plnMargin: 0, intranetId: 18213, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 96,2x346,8": { plnPrice: 0, plnMargin: 0, intranetId: 18216, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LCD STOPS.IT 16773-2": { plnPrice: 0, plnMargin: 0, intranetId: 18218, category: "nowo_dodane", origin: "Polska" },
  "Karton stopa boczna DTF": { plnPrice: 3.86, plnMargin: 0.36, intranetId: 18245, category: "nowo_dodane", origin: "Polska" },
  "Zamek kostkowy czarny, dł. 620cm": { plnPrice: 12.08, plnMargin: 1.1, intranetId: 18247, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_marketing_adTribune Expo 100x100 (bez wydruku) klasa 2": { plnPrice: 42.64, plnMargin: 2.57, intranetId: 18259, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_marketing_adWall Vario Horizontal (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18260, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_marketing_Leżak": { plnPrice: 0, plnMargin: 0, intranetId: 18261, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_marketing_adWall Vario Prosta 600 Ø43 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18262, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_marketing_adFoam Cube": { plnPrice: 0, plnMargin: 0, intranetId: 18263, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_marketing_adFrame Quick Single 100x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18264, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_marketing_adFlag Bagnet": { plnPrice: 0, plnMargin: 0, intranetId: 18265, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_marketing_adFlag PRO S (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18266, category: "nowo_dodane", origin: "Chiny" },
  "adFrame CTF 30x30x120 (bez wydruku) - na stan": { plnPrice: 0, plnMargin: 0, intranetId: 18276, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA KWADRATOWA z gwintem + zaślepka 496 RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 18277, category: "nowo_dodane", origin: "Chiny" },
  "mFrame RAMA 1240x1488 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 18278, category: "nowo_dodane", origin: "Chiny" },
  "mFrame MASKOWNICA KWADRATOWA z gwintem + zaślepka 992 RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 18279, category: "nowo_dodane", origin: "Chiny" },
  "mFrame MASKOWNICA KWADRATOWA z gwintem + zaślepka 2976 RENTAL": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 18292, category: "nowo_dodane", origin: "Chiny" },
  "RENTAL_adFrame LMD 260x297,6": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18302, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM MFrame 198,4x99,2": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 18305, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO 300x250 (bez wydruku)": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 18309, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO Extender 50 cm": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 18310, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO łącznik wewnętrzny L": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18311, category: "nowo_dodane", origin: "Polska" },
  "adGate Air Square 4,5m (bez wydruku) ver2": { plnPrice: 903.92, plnMargin: 870.59, intranetId: 17918, category: "nowo_dodane", origin: "Chiny" },
  "adFrame LMD/LMS Quicklock 180°": { plnPrice: 0, plnMargin: 0, intranetId: 17924, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO 100x200": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 17933, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - Betard": { plnPrice: 0, plnMargin: 0, intranetId: 17934, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 992x2976 stan": { plnPrice: 550.79, plnMargin: 527.46, intranetId: 17945, category: "nowo_dodane", origin: "Chiny" },
  "adTribune Expo 150x100 ver2. (blaty z PL)": { plnPrice: 509.41, plnMargin: 484.41, intranetId: 17948, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 150x250": { plnPrice: 102.33, plnMargin: 43.39, intranetId: 17961, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame STF/STFL 500x200": { plnPrice: 212.97, plnMargin: 124.61, intranetId: 17968, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adFrame Poster 100x100 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 17983, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_handel.pl_adTent Vario 4x4": { plnPrice: 0, plnMargin: 0, intranetId: 18092, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_handel.pl_adFrame Slim 65mm": { plnPrice: 0, plnMargin: 0, intranetId: 18297, category: "nowo_dodane", origin: "Polska" },
  "adFrame CTF 100x100x100 LED (bez wydruku) - na stan": { plnPrice: 0, plnMargin: 0, intranetId: 18298, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO Extension Cable 5m": { plnPrice: 0, plnMargin: 0, intranetId: 18312, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO Monitor Bracket Kit 100cm": { plnPrice: 0, plnMargin: 0, intranetId: 18313, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_SEGO łącznik clamp": { plnPrice: 0, plnMargin: 0, intranetId: 18314, category: "nowo_dodane", origin: "Polska" },
  "mFrame PANEL NA ZAWIESZKI RENTAL": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 18328, category: "nowo_dodane", origin: "Polska" },
  "mFrame ZAWIESZKA RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18329, category: "nowo_dodane", origin: "Chiny" },
  "RENTAL_adFrame 300x500 double side new profile": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18331, category: "nowo_dodane", origin: "Polska" },
  "wydruk adTribune Cubic - 2 boki razem": { plnPrice: 69.39, plnMargin: 35.01, intranetId: 18332, category: "nowo_dodane", origin: "Polska" },
  "adTribune SEGO Cubic custom": { plnPrice: 454.77, plnMargin: 385.82, intranetId: 18336, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_Multiframe Tribune (Black)": { plnPrice: 0, plnMargin: 0, intranetId: 18384, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 496x1488 RENTAL": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 18371, category: "nowo_dodane", origin: "Chiny" },
  "RENTAL adFrame Poster 100x150 (bez wydruku)": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 18375, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand Premium 100": { plnPrice: 0, plnMargin: 0, intranetId: 18376, category: "nowo_dodane", origin: "Chiny" },
  "RENTAL_adFrame LMD 992x2850 black": { plnPrice: 0, plnMargin: 0, intranetId: 18389, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 992x1640 black": { plnPrice: 0, plnMargin: 0, intranetId: 18390, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 992x1600 black": { plnPrice: 0, plnMargin: 0, intranetId: 18391, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - GYEON USA": { plnPrice: 0, plnMargin: 0, intranetId: 18405, category: "nowo_dodane", origin: "Polska" },
  "Adsystem - Multiframe 250 kantorek rental": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18463, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adFrame Quick 100x200 ver 2.0 w torbie na kółkach": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 18467, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adWall Vario Twist": { plnPrice: 0, plnMargin: 0, intranetId: 18487, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_adWall Vario In": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 18488, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_adWall Vario Bow": { plnPrice: 0, plnMargin: 0, intranetId: 18489, category: "nowo_dodane", origin: "Chiny" },
  "POKAZÓWKA_Pop-up Counter Lightbox 100x100 incl. charging": { plnPrice: 0, plnMargin: 0, intranetId: 18522, category: "nowo_dodane", origin: "Polska" },
  "Pokazówka_adTent Air premium 1x1 SET": { plnPrice: 33.33, plnMargin: 0, intranetId: 18530, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA LED 2480 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18539, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA LED 496 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18541, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA LED 1488 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18542, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_Lumina RGB 100x250 dwustronny": { plnPrice: 0, plnMargin: 0, intranetId: 18568, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adFrame Lumina RGB 100x200cm (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 18588, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM 49,6X148,6": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 18590, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - EINHELL": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18616, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - LINKEDIN": { plnPrice: 0, plnMargin: 0, intranetId: 18617, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - GYEON UK": { plnPrice: 0, plnMargin: 0, intranetId: 18687, category: "nowo_dodane", origin: "Polska" },
  "profil Luminous dwustronny 99,2cm RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 18695, category: "nowo_dodane", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 446,4x198,4cm": { plnPrice: 226.77, plnMargin: 160.38, intranetId: 18712, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA adTent Air premium 1x1 SET": { plnPrice: 0, plnMargin: 0, intranetId: 18727, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adTribune Expo 100x100 klasa 2": { plnPrice: 0, plnMargin: 0, intranetId: 18738, category: "nowo_dodane", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 446,4x148,8cm": { plnPrice: 226.77, plnMargin: 160.38, intranetId: 18723, category: "nowo_dodane", origin: "Polska" },
  "profil Luminous dwustronny 204,5cm RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 18724, category: "nowo_dodane", origin: "Polska" },
  "profil Luminous dwustronny 248cm RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 18725, category: "nowo_dodane", origin: "Polska" },
  "profil Luminous jednostronny 396,6cm RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 18726, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adFrame Slim 65mm": { plnPrice: 0, plnMargin: 0, intranetId: 18739, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adFoam Cube": { plnPrice: 0, plnMargin: 0, intranetId: 18740, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adFlag STANDARD M": { plnPrice: 0, plnMargin: 0, intranetId: 18741, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adWall Vario Prosta 400 Ø43": { plnPrice: 0, plnMargin: 0, intranetId: 18743, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_Wydruki Lumina RGB 100x250": { plnPrice: 0, plnMargin: 0, intranetId: 18742, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adWall Vario Gate": { plnPrice: 0, plnMargin: 0, intranetId: 18744, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adTribune Cubic 1x1(adsystem)": { plnPrice: 0, plnMargin: 0, intranetId: 18745, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adFoam Cube(adsystem)": { plnPrice: 0, plnMargin: 0, intranetId: 18746, category: "nowo_dodane", origin: "Polska" },
  "Linked_in_Local_adFrame Quick Battery 100x200(adsystem)": { plnPrice: 0, plnMargin: 0, intranetId: 18747, category: "nowo_dodane", origin: "Polska" },
  "adVideo Kiosk 65` flight case RENTAL": { plnPrice: 201.07, plnMargin: 1.07, intranetId: 18750, category: "nowo_dodane", origin: "Polska" },
  "mFrame STOPA RENTAL": { plnPrice: 2.95, plnMargin: 1.08, intranetId: 18760, category: "nowo_dodane", origin: "Polska" },
  "wydruk adFrame Pixlip 200x200": { plnPrice: 88.44, plnMargin: 51.32, intranetId: 18765, category: "nowo_dodane", origin: "Polska" },
  "adTribune SEG NEW RENTAL": { plnPrice: 414.31, plnMargin: 380.98, intranetId: 18785, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 400x200": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18817, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA KWADRAT z gwintem 3970 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18825, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA KWADRAT z gwintem 2464 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18826, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA KWADRAT z gwintem 496 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18827, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA KWADRAT z gwintem 2480 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 18828, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame LMD zaokrąglone rogi (do 1mb/medium250)": { plnPrice: 81.85, plnMargin: 33.13, intranetId: 18836, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adFrame LMD zaokrąglone rogi (pow. 3mb/medium250)": { plnPrice: 254.15, plnMargin: 133.43, intranetId: 18840, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 776x1240 R992": { plnPrice: 0, plnMargin: 0, intranetId: 18843, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 776x496 R992": { plnPrice: 0, plnMargin: 0, intranetId: 18852, category: "nowo_dodane", origin: "Polska" },
  "Wydruk Adtent Air premium 4x6 (same nogi 2)": { plnPrice: 158.44, plnMargin: 114.6, intranetId: 18880, category: "nowo_dodane", origin: "Polska" },
  "Wydruk Adtent Air premium 4x6 (same nogi 3)": { plnPrice: 208.51, plnMargin: 156.42, intranetId: 18881, category: "nowo_dodane", origin: "Polska" },
  "Wydruk Adtent Air premium 4x6 (same nogi 4)": { plnPrice: 258.57, plnMargin: 198.23, intranetId: 18882, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1165x1240 R1488": { plnPrice: 211.96, plnMargin: 171.96, intranetId: 18885, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1165x1488 R1488": { plnPrice: 220.63, plnMargin: 180.63, intranetId: 18886, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1165x1984 R1488": { plnPrice: 273.48, plnMargin: 233.48, intranetId: 18889, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1165x2480 R1488": { plnPrice: 321.41, plnMargin: 281.41, intranetId: 18890, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1165x2976 R1488": { plnPrice: 369.34, plnMargin: 329.34, intranetId: 18891, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 776x1488 R992": { plnPrice: 0, plnMargin: 0, intranetId: 18892, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 776x2976 R992": { plnPrice: 0, plnMargin: 0, intranetId: 18893, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1167x496 R2976": { plnPrice: 0, plnMargin: 0, intranetId: 18894, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1167x1240 R2976": { plnPrice: 337.37, plnMargin: 330.7, intranetId: 18895, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1167x1488 R2976": { plnPrice: 346.06, plnMargin: 339.39, intranetId: 18896, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1167x1984 R2976": { plnPrice: 399.02, plnMargin: 392.35, intranetId: 18897, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1167x2480 R2976": { plnPrice: 470.45, plnMargin: 463.78, intranetId: 18898, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 1167x2976 R2976": { plnPrice: 459.07, plnMargin: 452.4, intranetId: 18899, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 776x2480 R992": { plnPrice: 0, plnMargin: 0, intranetId: 18900, category: "nowo_dodane", origin: "Polska" },
  "Wydruk Adtent Air premium 4x6 (sama noga)": { plnPrice: 105.04, plnMargin: 72.78, intranetId: 18911, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - adsystem trening": { plnPrice: 0, plnMargin: 0, intranetId: 18914, category: "nowo_dodane", origin: "Polska" },
  "Wydruk Multiframe 350 SET4 jednostronny": { plnPrice: 271.58, plnMargin: 201.53, intranetId: 18935, category: "nowo_dodane", origin: "Polska" },
  "Lumina RGB 100x250 RENTAL": { plnPrice: 26.07, plnMargin: 1.07, intranetId: 18937, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM Mframe 49,6X99,2": { plnPrice: 0, plnMargin: 0, intranetId: 18951, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_mFrame trybunka LED z drzwiami 100x50": { plnPrice: 2286.68, plnMargin: 2090.86, intranetId: 18977, category: "nowo_dodane", origin: "NULL" },
  "Wydruk adFrame LMD/LMS/LMSM 99,2x198,4": { plnPrice: 81.01, plnMargin: 31.66, intranetId: 18978, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - MOLDOW": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 18982, category: "nowo_dodane", origin: "Polska" },
  "Wydruk adTribune Lumina RGB tył": { plnPrice: 65.58, plnMargin: 27.29, intranetId: 18985, category: "nowo_dodane", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 210,8x99,2cm": { plnPrice: 524.64, plnMargin: 409.29, intranetId: 18989, category: "nowo_dodane", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 62x248cm": { plnPrice: 51.06, plnMargin: 41.16, intranetId: 18994, category: "nowo_dodane", origin: "Polska" },
  "Wydruk mFrame na tekstyliach 31x248cm": { plnPrice: 51.06, plnMargin: 41.16, intranetId: 18996, category: "nowo_dodane", origin: "Polska" },
  "mFrame MASKOWNICA KWADRAT z gwintem 992 RENTAL": { plnPrice: 2.77, plnMargin: 1.1, intranetId: 19007, category: "nowo_dodane", origin: "Polska" },
  "mFrame PROFIL L=868 RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19008, category: "nowo_dodane", origin: "Polska" },
  "adTribune Shell cokół dolny": { plnPrice: 0, plnMargin: 0, intranetId: 19020, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - ANUGA KOLONIA": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19022, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMD 100x350 ND (bok kantorka)": { plnPrice: 0, plnMargin: 0, intranetId: 19023, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM MFrame 248x99,2": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 19030, category: "nowo_dodane", origin: "Polska" },
  "adTent Air IGLO 6x6 (bez wydruku)": { plnPrice: 2695.72, plnMargin: 2629.05, intranetId: 19046, category: "nowo_dodane", origin: "Polska" },
  "adTent Air IGLO 8x8 (bez wydruku)": { plnPrice: 5609.84, plnMargin: 5543.17, intranetId: 19047, category: "nowo_dodane", origin: "Polska" },
  "POKAZOWKA_adTent Air IGLO 6x6 WYDRUK BIAŁY": { plnPrice: 4021.07, plnMargin: 3954.4, intranetId: 19048, category: "nowo_dodane", origin: "Polska" },
  "POKAZOWKA_adTent Air IGLO 8x8 WYDRUK BIAŁY": { plnPrice: 8811.36, plnMargin: 8744.69, intranetId: 19050, category: "nowo_dodane", origin: "Polska" },
  "adTent Air IGLO pompka elektryczna": { plnPrice: 218.32, plnMargin: 151.65, intranetId: 19051, category: "nowo_dodane", origin: "Polska" },
  "mFrame PIN FAT 5,6CM (do maskownicy) RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19163, category: "nowo_dodane", origin: "Polska" },
  "adTribune Expo 100x100 (bez wydruku) RENTAL": { plnPrice: 26.07, plnMargin: 1.07, intranetId: 19102, category: "nowo_dodane", origin: "Polska" },
  "RENTAL adFrame Poster 100x200 (bez wydruku)": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 19103, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMS 100x200 ND (bez wydruku) STAN": { plnPrice: 1248.85, plnMargin: 1215.52, intranetId: 19122, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - SNUS": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19106, category: "nowo_dodane", origin: "Polska" },
  "Pokazówka_adTribune Big Quick LED Auto": { plnPrice: 0, plnMargin: 0, intranetId: 19121, category: "nowo_dodane", origin: "Polska" },
  "zabudowa - EPIR": { plnPrice: 0, plnMargin: 0, intranetId: 19179, category: "nowo_dodane", origin: "Polska" },
  "LISTA ZABUDOWY": { plnPrice: 0, plnMargin: 0, intranetId: 19180, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA ŁUK 776x1984 R992": { plnPrice: 0, plnMargin: 0, intranetId: 19197, category: "nowo_dodane", origin: "Polska" },
  "adFrame LMSM MFrame 248x99,2": { plnPrice: 0, plnMargin: 0, intranetId: 19245, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mframe na tekstyliach 601,4x248 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19247, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adColumn Air ∅60x220 - ver TPU": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 19301, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adFrame Quick Safe Case BLACK 85x200 (bez wydruku)": { plnPrice: 17.74, plnMargin: 1.07, intranetId: 19303, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_kantorek SEGO 100x100x300 + zestaw łączników": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19305, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 930x992 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19316, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 930x2976 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19317, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 992x1426 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19318, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 310x2480 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19319, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 198,4x496cm": { plnPrice: 0, plnMargin: 0, intranetId: 19320, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand Octa 85": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 19321, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adFrame Slim 100x200 NO LED - 65mm": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 19323, category: "nowo_dodane", origin: "Polska" },
  "Multiframe kantorek 350cm (Black) (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19349, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 248x992 RENTAL": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 19350, category: "nowo_dodane", origin: "Polska" },
  "mFrame RAMA 248x2480 RENTAL": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 19351, category: "nowo_dodane", origin: "Polska" },
  "POKAZOWKA_adTribune Tube_SQUARE (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19352, category: "nowo_dodane", origin: "Polska" },
  "Stolik wysoki barowy Jula 60cm biała noga/ blat dąb RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19335, category: "nowo_dodane", origin: "Polska" },
  "Hoker Sting siedzisko białe/podstawa dąb RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19336, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand R3 Black 100": { plnPrice: 0, plnMargin: 0, intranetId: 19338, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand R3 Black 85": { plnPrice: 0, plnMargin: 0, intranetId: 19339, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand Octa 100": { plnPrice: 0, plnMargin: 0, intranetId: 19340, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand Drop 100": { plnPrice: 0, plnMargin: 0, intranetId: 19341, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand Eco 100": { plnPrice: 0, plnMargin: 0, intranetId: 19342, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand Lux 100": { plnPrice: 0, plnMargin: 0, intranetId: 19343, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adStand Lux 85": { plnPrice: 0, plnMargin: 0, intranetId: 19344, category: "nowo_dodane", origin: "Polska" },
  "mFrame trybunka SLM + drzwi 100x50 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19348, category: "nowo_dodane", origin: "Polska" },
  "adTribune Big Quick RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19361, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTribune inflate": { plnPrice: 0, plnMargin: 0, intranetId: 19417, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adChair inflate": { plnPrice: 0, plnMargin: 0, intranetId: 19439, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adPuff inflate": { plnPrice: 0, plnMargin: 0, intranetId: 19440, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adBox Hit C": { plnPrice: 0, plnMargin: 0, intranetId: 19441, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTribune Hit C": { plnPrice: 0, plnMargin: 0, intranetId: 19442, category: "nowo_dodane", origin: "Polska" },
  "HDWR-adTent Air IGLO 6x6 (bez wydruku)": { plnPrice: 2695.72, plnMargin: 2629.05, intranetId: 19437, category: "nowo_dodane", origin: "Polska" },
  "HDWR-adTent Air IGLO 8x8 (bez wydruku)": { plnPrice: 5609.84, plnMargin: 5543.17, intranetId: 19438, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 198,4x595,2": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19460, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTribune Quick Kidney LED (bez wydruku)": { plnPrice: 6.07, plnMargin: 1.07, intranetId: 19463, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_Noga do namiotu premium": { plnPrice: 26.07, plnMargin: 1.07, intranetId: 19464, category: "nowo_dodane", origin: "NULL" },
  "adVideo Kiosk 55` flight case RENTAL": { plnPrice: 201.07, plnMargin: 1.07, intranetId: 19465, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - adFrame LCD double deck": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19466, category: "nowo_dodane", origin: "NULL" },
  "RENTAL_adFrame SLM 496x496": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19325, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMSM 496x496": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19326, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMD 496x496": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19327, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_adFrame LMS 496x496": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19328, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_mFrame Glass wall 496x496": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19329, category: "nowo_dodane", origin: "Polska" },
  "RENTAL_podloga LED 1x1": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19330, category: "nowo_dodane", origin: "Polska" },
  "Adsystem_torba": { plnPrice: 12.72, plnMargin: 11.05, intranetId: 19331, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_X-banner 100x200": { plnPrice: 0, plnMargin: 0, intranetId: 19346, category: "nowo_dodane", origin: "Polska" },
  "Adsystem_czapeczka": { plnPrice: 21.69, plnMargin: 20.02, intranetId: 19332, category: "nowo_dodane", origin: "Polska" },
  "Adsystem_długopis": { plnPrice: 3.48, plnMargin: 1.81, intranetId: 19333, category: "nowo_dodane", origin: "Polska" },
  "Adsystem_kubek": { plnPrice: 9.68, plnMargin: 8.01, intranetId: 19334, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_X-banner PRO 100x200": { plnPrice: 0, plnMargin: 0, intranetId: 19347, category: "nowo_dodane", origin: "Polska" },
  "HDWR-adFolder Tex": { plnPrice: 0, plnMargin: 0, intranetId: 19385, category: "nowo_dodane", origin: "Polska" },
  "POKAZÓWKA_adTribune Shell (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19601, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mframe na tekstyliach 1091,2x248 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19605, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mframe na tekstyliach 1091,2x297,6 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19606, category: "nowo_dodane", origin: "NULL" },
  "adFloor maskownica prosta RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19523, category: "nowo_dodane", origin: "NULL" },
  "adFloor maskownica narożna prawa RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19524, category: "nowo_dodane", origin: "NULL" },
  "adFloor maskownica narożna lewa RENTAL": { plnPrice: 2.74, plnMargin: 1.07, intranetId: 19525, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - Ragsy": { plnPrice: 0, plnMargin: 0, intranetId: 19543, category: "nowo_dodane", origin: "NULL" },
  "Wydruk adStand Octa 100 tył": { plnPrice: 59.56, plnMargin: 22.13, intranetId: 19545, category: "nowo_dodane", origin: "NULL" },
  "mFrame RAMA 248x2976 RENTAL": { plnPrice: 9.4, plnMargin: 1.07, intranetId: 19548, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_adTribune Quick Round LED (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19526, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mframe na tekstyliach 124x99,2cm": { plnPrice: 0, plnMargin: 0, intranetId: 19618, category: "nowo_dodane", origin: "NULL" },
  "adFrame LMD łącznik narożny mFrame RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19620, category: "nowo_dodane", origin: "NULL" },
  "Oświetlenie do mFrame 116 srebrna RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19621, category: "nowo_dodane", origin: "NULL" },
  "adFloor najazd narożny lewy RENTAL 9006": { plnPrice: 0, plnMargin: 0, intranetId: 19730, category: "nowo_dodane", origin: "NULL" },
  "adFloor najazd narożny prawy RENTAL 9006": { plnPrice: 0, plnMargin: 0, intranetId: 19731, category: "nowo_dodane", origin: "NULL" },
  "adFloor najazd prosty RENTAL 9006": { plnPrice: 0, plnMargin: 0, intranetId: 19732, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - Radeq Lab": { plnPrice: 0, plnMargin: 0, intranetId: 19691, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - ROBO CHALLANGE": { plnPrice: 0, plnMargin: 0, intranetId: 19696, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_adFrame Quick Safe Case Silver 100x200 wtyczka UK": { plnPrice: 0, plnMargin: 0, intranetId: 19680, category: "nowo_dodane", origin: "NULL" },
  "adStand Basic 85": { plnPrice: 88.31, plnMargin: 52.55, intranetId: 19689, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - PHH": { plnPrice: 0, plnMargin: 0, intranetId: 19773, category: "nowo_dodane", origin: "NULL" },
  "mFrame MASKOWNICA LED 1984 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19775, category: "nowo_dodane", origin: "NULL" },
  "RENTAL_adFrame LMD 198,4x198,4": { plnPrice: 0, plnMargin: 0, intranetId: 19776, category: "nowo_dodane", origin: "NULL" },
  "mFrame RAMA ŁUK 496x1984 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19777, category: "nowo_dodane", origin: "NULL" },
  "mFrame RAMA ŁUK 496x248 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19778, category: "nowo_dodane", origin: "NULL" },
  "adTribune Expo 150x100 (bez wydruku) RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19779, category: "nowo_dodane", origin: "NULL" },
  "Karton - adWall Vario Light 300 Prosta/Łukowa": { plnPrice: 4.01, plnMargin: 0.37, intranetId: 19757, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_adTribune Quick Round (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19763, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 3": { plnPrice: 1, plnMargin: 1, intranetId: 19782, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 4": { plnPrice: 1.07, plnMargin: 1.07, intranetId: 19783, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 9": { plnPrice: 1, plnMargin: 1, intranetId: 19784, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 13": { plnPrice: 1, plnMargin: 1, intranetId: 19785, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 14": { plnPrice: 1, plnMargin: 1, intranetId: 19786, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 15": { plnPrice: 1, plnMargin: 1, intranetId: 19787, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 18": { plnPrice: 0, plnMargin: 0, intranetId: 19790, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 16": { plnPrice: 1, plnMargin: 1, intranetId: 19788, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 19": { plnPrice: 1, plnMargin: 1, intranetId: 19791, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 17": { plnPrice: 1, plnMargin: 1, intranetId: 19789, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 24 uszkodzone": { plnPrice: 1, plnMargin: 1, intranetId: 19792, category: "nowo_dodane", origin: "NULL" },
  "mFrame RAMA ŁUK 776x2976 R992 rental": { plnPrice: 0, plnMargin: 0, intranetId: 19765, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_LuminaStick 250 cm": { plnPrice: 0, plnMargin: 0, intranetId: 19767, category: "nowo_dodane", origin: "NULL" },
  "mFrame RAMA 992x1984 DRZWI RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19780, category: "nowo_dodane", origin: "NULL" },
  "adVideo Kiosk 55` RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19806, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 25": { plnPrice: 0, plnMargin: 0, intranetId: 19825, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 26": { plnPrice: 0, plnMargin: 0, intranetId: 19826, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 35": { plnPrice: 0, plnMargin: 0, intranetId: 19827, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 28": { plnPrice: 0, plnMargin: 0, intranetId: 19828, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - vitasynth paleta 1": { plnPrice: 0, plnMargin: 0, intranetId: 19829, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - vitasynth paleta 2": { plnPrice: 0, plnMargin: 0, intranetId: 19830, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - vitasynth paleta 3": { plnPrice: 0, plnMargin: 0, intranetId: 19831, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - vitasynth paleta 4": { plnPrice: 0, plnMargin: 0, intranetId: 19832, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 29": { plnPrice: 0, plnMargin: 0, intranetId: 19833, category: "nowo_dodane", origin: "NULL" },
  "RENTAL adFrame Poster 70x100 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19834, category: "nowo_dodane", origin: "NULL" },
  "mFrame RAMA 992x2108 RENTAL": { plnPrice: 0, plnMargin: 0, intranetId: 19835, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 30": { plnPrice: 0, plnMargin: 0, intranetId: 19836, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 31": { plnPrice: 0, plnMargin: 0, intranetId: 19837, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 32": { plnPrice: 0, plnMargin: 0, intranetId: 19838, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_adFrame Smart 300x250 (bez wydruku)": { plnPrice: 0, plnMargin: 0, intranetId: 19824, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT2": { plnPrice: 0, plnMargin: 0, intranetId: 19849, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT2 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19850, category: "nowo_dodane", origin: "NULL" },
  "adBoard Hips 58x100 - drogowskaz eventowy": { plnPrice: 0, plnMargin: 0, intranetId: 19858, category: "nowo_dodane", origin: "NULL" },
  "adBoard Hips 68x120 - drogowskaz eventowy": { plnPrice: 0, plnMargin: 0, intranetId: 19859, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 33": { plnPrice: 0, plnMargin: 0, intranetId: 19860, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 13A": { plnPrice: 0, plnMargin: 0, intranetId: 19861, category: "nowo_dodane", origin: "NULL" },
  "Wydruk adFrame DTF 160x200": { plnPrice: 107.08, plnMargin: 57.59, intranetId: 19873, category: "nowo_dodane", origin: "NULL" },
  "Leżak - patyczek": { plnPrice: 0, plnMargin: 0, intranetId: 19874, category: "nowo_dodane", origin: "NULL" },
  "Podkładka M5": { plnPrice: 0.02, plnMargin: 0, intranetId: 19875, category: "nowo_dodane", origin: "NULL" },
  "adFrame Smart 100x250 (bez wydruku) clone": { plnPrice: 666.18, plnMargin: 666.18, intranetId: 19876, category: "nowo_dodane", origin: "NULL" },
  "Wydruk do mFrame rama curved corner arch 496x496 PRAWY": { plnPrice: 0, plnMargin: 0, intranetId: 19877, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 21": { plnPrice: 0, plnMargin: 0, intranetId: 19878, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 37": { plnPrice: 0, plnMargin: 0, intranetId: 19879, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 37A": { plnPrice: 0, plnMargin: 0, intranetId: 19880, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 38": { plnPrice: 0, plnMargin: 0, intranetId: 19881, category: "nowo_dodane", origin: "NULL" },
  "SAMPLE_Aluminium lightbox display stand": { plnPrice: 0, plnMargin: 0, intranetId: 19882, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_adBoard LED - frame 85x120cm": { plnPrice: 0, plnMargin: 0, intranetId: 19883, category: "nowo_dodane", origin: "NULL" },
  "POKAZÓWKA_adBoard LED - big water base": { plnPrice: 0, plnMargin: 0, intranetId: 19884, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT3": { plnPrice: 0, plnMargin: 0, intranetId: 19885, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT3 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19886, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT4": { plnPrice: 0, plnMargin: 0, intranetId: 19887, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT4 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19888, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT5": { plnPrice: 0, plnMargin: 0, intranetId: 19889, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT5 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19890, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT6": { plnPrice: 0, plnMargin: 0, intranetId: 19891, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT6 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19892, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT7": { plnPrice: 0, plnMargin: 0, intranetId: 19893, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT7 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19894, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 34": { plnPrice: 0, plnMargin: 0, intranetId: 19862, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 27": { plnPrice: 0, plnMargin: 0, intranetId: 19863, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 23": { plnPrice: 0, plnMargin: 0, intranetId: 19864, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 6": { plnPrice: 0, plnMargin: 0, intranetId: 19865, category: "nowo_dodane", origin: "NULL" },
  "zabudowa - GYEON paleta 36": { plnPrice: 0, plnMargin: 0, intranetId: 19868, category: "nowo_dodane", origin: "NULL" },
  "Sofa Kavos szary": { plnPrice: 0, plnMargin: 0, intranetId: 19872, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT8": { plnPrice: 0, plnMargin: 0, intranetId: 19895, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT8 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19896, category: "nowo_dodane", origin: "NULL" },
  "adTribune Seg NEW blat": { plnPrice: 66.73, plnMargin: 60.06, intranetId: 19899, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT9": { plnPrice: 0, plnMargin: 0, intranetId: 19897, category: "nowo_dodane", origin: "NULL" },
  "stoisko multiframe - custom MT9 z dodatkami": { plnPrice: 0, plnMargin: 0, intranetId: 19898, category: "nowo_dodane", origin: "NULL" },
  "Zestaw wydruków mFrame do Double Deck": { plnPrice: 3445.64, plnMargin: 1589.99, intranetId: 19900, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 2362x1054mm BALUSTRADA WEW C": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19901, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 3972x1054mm BALUSTRADA WEW A": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19902, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 3724x1054mm BALUSTRADA WEW B": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19903, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 2362x1265mm BALUSTRADA ZEW C": { plnPrice: 0, plnMargin: 0, intranetId: 19906, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 3972x1265mm BALUSTRADA ZEW A": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19907, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 3724x1265mm BALUSTRADA ZEW B": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19908, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1240x1054mm BALUSTRADA WEW D": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19910, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1240x1265mm BALUSTRADA ZEW D": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19911, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 123x3775mm SŁUP DW": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19916, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 140x3775mm SŁUP DS": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19917, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1488x1054mm BALUSTRADA WEW E": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19912, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1488x1265mm BALUSTRADA ZEW E": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19913, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 248x1054mm BALUSTRADA WEW F": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19914, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 248x1054mm BALUSTRADA ZEW F": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19915, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 140x2480mm SŁUP KW": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19918, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 155x2480mm SŁUP KS": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19919, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 123x2480mm SŁUP KW1": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19920, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1240x2480mm TYŁ KANTORKA": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19921, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1488x2480mm BOK KANTORKA": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19922, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - DRZWI KANTORKA": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19923, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1x1mm BALUSTRADA WEW SCHODY": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19924, category: "nowo_dodane", origin: "NULL" },
  "zestaw taśma LED RGBIC COB (5mb)+zasilacz+kontroler": { plnPrice: 0, plnMargin: 0, intranetId: 19927, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1x1mm BALUSTRADA ZEW SCHODY OTWARTE": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19925, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame DD - 1x1mm BALUSTRADA ZEW SCHODY ZAMKNIĘTE": { plnPrice: 74.91, plnMargin: 34.57, intranetId: 19926, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame na tekstyliach - DRZWI 198,4cm (bez wycięcia na klamkę": { plnPrice: 0, plnMargin: 0, intranetId: 19928, category: "nowo_dodane", origin: "NULL" },
  "Usługa wewnętrzna Magazyn [min]": { plnPrice: 0, plnMargin: 0, intranetId: 19932, category: "nowo_dodane", origin: "NULL" },
  "Taśma dwustronna do wykładzin 100mm x 25m": { plnPrice: 0, plnMargin: 0, intranetId: 19933, category: "nowo_dodane", origin: "NULL" },
  "adVideo InfoKiosk 65` OUTDOOR": { plnPrice: 0, plnMargin: 0, intranetId: 19934, category: "nowo_dodane", origin: "NULL" },
  "Wydruk mFrame na tekstyliach - DRZWI 198,4cm Z OŚCIEŻNICĄ PCV (bez wycięcia na klamkę)": { plnPrice: 0, plnMargin: 0, intranetId: 19929, category: "nowo_dodane", origin: "NULL" },
  "Medium BLM 630 SM 91,4": { plnPrice: 0, plnMargin: 0, intranetId: 19930, category: "nowo_dodane", origin: "NULL" },
  "Heatpex - kaseton LMD 200x248cm": { plnPrice: 0, plnMargin: 0, intranetId: 19931, category: "nowo_dodane", origin: "NULL" },
};
window.KASETON_PRICES = KASETON_PRICES;

function calculateWydrukArea(name) {
  if (!name || typeof name !== 'string') return null;
  if (!/wydruk/i.test(name)) return null;
  const normalized = name.replace(/,/g, '.');
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const val1 = parseFloat(match[1]);
  const val2 = parseFloat(match[2]);
  if (isNaN(val1) || isNaN(val2)) return null;
  if (val1 <= 15 && val2 <= 15) {
    return val1 * val2;
  } else {
    return (val1 / 100) * (val2 / 100);
  }
}
window.calculateWydrukArea = calculateWydrukArea;

window.customPriceOverrides = window.customPriceOverrides || {};

window.overrideBomPrice = function (itemName, newPriceEUR) {
  window.customPriceOverrides = window.customPriceOverrides || {};
  const priceVal = parseFloat(newPriceEUR);
  if (!isNaN(priceVal)) {
    window.customPriceOverrides[itemName] = priceVal;
  } else {
    delete window.customPriceOverrides[itemName];
  }
  if (typeof render === 'function') {
    render();
  } else if (typeof generateKasetonBOM === 'function') {
    generateKasetonBOM();
  }
};

function finishKasetonBOM(bomItems, W, H, sys, config) {
  const D = parseFloat(config.height3D) || 120;
  // --- PACKING SYSTEM CONVERSION LOGIC ---
  const packing = (config && config.packing) || 'kartony';

  // 1. Calculate numCutsW and numCutsH
  let numCutsW = 0, numCutsH = 0;
  if (config.cut && config.cut.includes('half_w')) numCutsW = 1;
  else if (config.cut && config.cut.includes('3w')) numCutsW = 2;
  else if (config.cut && config.cut.includes('4w')) numCutsW = 3;
  else if (config.cut && config.cut.includes('5w')) numCutsW = 4;

  if (config.cut && config.cut.includes('half_h')) numCutsH = 1;
  else if (config.cut && config.cut.includes('3h')) numCutsH = 2;
  else if (config.cut && config.cut.includes('4h')) numCutsH = 3;
  else if (config.cut && config.cut.includes('5h')) numCutsH = 4;

  if (config.cut && config.cut.startsWith('auto')) {
    const maxLen = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200);
    if (W > maxLen) numCutsW = Math.ceil(W / maxLen) - 1;
    if (H > maxLen) numCutsH = Math.ceil(H / maxLen) - 1;
  } else if (config.cut === 'custom' && config.customCuts) {
    if (sys === 'CTF' || sys === 'CTF_LED') {
      const cc = config.customCuts;
      const fbV = cc.frontBack?.vertical || [];
      const fbH = cc.frontBack?.horizontal || [];
      numCutsW = fbV.length;
      numCutsH = fbH.length;
    } else {
      const cc = config.customCuts;
      numCutsW = (cc.vertical || []).length;
      numCutsH = (cc.horizontal || []).length;
    }
  }

  // 2. Calculate outer segments (main frame)
  let outerSegmentsCount = 0;
  if (sys === 'CTF' || sys === 'CTF_LED') {
    const D = parseFloat(config.height3D) || 120;
    let numSegW = numCutsW + 1;
    let numSegH = numCutsH + 1;
    let numSegZ = D > 200 ? 2 : 1;
    outerSegmentsCount = 4 * numSegW + 4 * numSegH + 4 * numSegZ;
  } else {
    outerSegmentsCount = 2 * (numCutsW + 1) + 2 * (numCutsH + 1);
  }

  // 3. Calculate support segments (stabilizers)
  let supportSegmentsCount = 0;
  if (config.cut === 'custom' && config.customSupports) {
    if (sys === 'CTF' || sys === 'CTF_LED') {
      const cs = config.customSupports;
      supportSegmentsCount = 
        (cs.frontBack?.vertical || []).length + (cs.frontBack?.horizontal || []).length +
        (cs.leftRight?.vertical || []).length + (cs.leftRight?.horizontal || []).length +
        (cs.topBottom?.vertical || []).length + (cs.topBottom?.horizontal || []).length;
    } else {
      const cs = config.customSupports;
      supportSegmentsCount = (cs.vertical || []).length + (cs.horizontal || []).length;
    }
  } else {
    if (sys === 'CTF' || sys === 'CTF_LED') {
      const D = parseFloat(config.height3D) || 120;
      supportSegmentsCount = (numCutsW * 2) + (numCutsH * 2);
      if (D > 200) {
        supportSegmentsCount += 2;
      }
    } else {
      const isWallSTF_STFL = (sys === 'STF' || sys === 'STFL') && config.usage === 'wall';
      supportSegmentsCount = isWallSTF_STFL ? 0 : (numCutsW + numCutsH);
    }
  }

  // Sync back to config for foam calculations to use the same correct count
  config.supportSegmentsCount = supportSegmentsCount;

  // 4. Calculate total segments
  const totalSegments = outerSegmentsCount + supportSegmentsCount;

  // 5. Select correct packaging size based on max segment length
  let maxSegmentLen = Math.max(W / (numCutsW + 1), H / (numCutsH + 1));
  if (sys === 'CTF' || sys === 'CTF_LED') {
    const D = parseFloat(config.height3D) || 120;
    let numSegZ = D > 200 ? 2 : 1;
    maxSegmentLen = Math.max(maxSegmentLen, D / numSegZ);
  }
  if (maxSegmentLen > 200) {
    maxSegmentLen = maxSegmentLen / 2;
  }

  const requiredCartonLength = maxSegmentLen + 10;

  // 6. Loop and remove any old cardboard box or bag items
  for (let i = bomItems.length - 1; i >= 0; i--) {
    if (bomItems[i].name.startsWith('Karton') || bomItems[i].name.includes('Torba')) {
      bomItems.splice(i, 1);
    }
  }

  // 7. Resolve package name, ID and quantity
  if (packing !== 'luzem') {
    let packName = '';
    let packId = 0;

    if (packing === 'torby') {
      packName = "adFrame LMD/LMS - Torba 205cm z kółkami";
      packId = 11574;
      if (maxSegmentLen <= 100) {
        packName = "adFrame LMD/LMS - Torba 105cm z kółkami";
        packId = 11573;
      } else if (maxSegmentLen <= 130) {
        packName = "adFrame LMD/LMS - Torba 130cm z kółkami";
        packId = 15217;
      } else if (maxSegmentLen <= 150) {
        packName = "adFrame LMD/LMS - Torba 155cm z kółkami";
        packId = 15218;
      }
    } else {
      // kartony
      packName = 'Karton LMD/LMS/DTF - 210x16x33cm';
      packId = 14844;

      if (sys === 'DTF' || sys === 'STF' || sys === 'STFL' || sys === 'LMSM') {
        const totalCuts = numCutsW + numCutsH;
        packName = 'Karton DTF/STF/LMSM - 110x16x16cm';
        packId = 14835;
        if (requiredCartonLength <= 110) {
          packName = totalCuts > 4 ? 'Karton DTF/STF/LMSM - 110x16x26cm' : 'Karton DTF/STF/LMSM - 110x16x16cm';
          packId = totalCuts > 4 ? 14836 : 14835;
        } else if (requiredCartonLength <= 135) {
          packName = 'Karton DTF/STF/LMSM - 135x16x26cm';
          packId = 14838;
        } else if (requiredCartonLength <= 160) {
          packName = 'Karton DTF/STF/LMSM - 160x16x26cm';
          packId = 14840;
        }
      } else {
        if (requiredCartonLength <= 110) {
          packName = 'Karton LMD/LMS - 110x16x33cm';
          packId = 14841;
        } else if (requiredCartonLength <= 135) {
          packName = 'Karton LMD/LMS - 135x16x33cm';
          packId = 14842;
        } else if (requiredCartonLength <= 160) {
          packName = 'Karton LMD/LMS - 160x16x33cm';
          packId = 14843;
        }
      }
    }

    // Maximum 8 segments per package
    let finalPackQty = Math.ceil(totalSegments / 8);
    if (finalPackQty < 1) finalPackQty = 1;

    // Weight payload check adjustments
    finalPackQty = adjustCartonsByWeight(config, finalPackQty, packName);

    // Push new item to BOM
    bomItems.push({
      name: packName,
      qty: finalPackQty,
      unit: 'szt',
      intranetId: packId
    });

    config.cartonName = packName;
    config.cartonQty = finalPackQty;
  } else {
    config.cartonName = '';
    config.cartonQty = 0;
  }

  // --- GLOBAL PROTECTIVE FOAM REPLACEMENT LOGIC ---
  const totalFoamQty = outerSegmentsCount + supportSegmentsCount;

  let foamName = 'adFrame LMD pianka ochronna';
  let foamId = 11736;
  
  if (sys === 'LMS') {
    foamName = 'adFrame LMS pianka ochronna';
    foamId = 11738;
  } else if (sys === 'LMSM' || sys === 'LCD_LMD') {
    foamName = 'adFrame LMSM/LMSM mFrame pianka ochronna';
    foamId = 14812;
  } else if (sys === 'DTF' || sys === 'STF' || sys === 'STFL') {
    foamName = 'adFrame DTF/STF pianka ochronna';
    foamId = 14813;
  } else if (sys === 'CTF' || sys === 'CTF_LED') {
    foamName = 'adFrame CTF/SUPPORT pianka ochronna';
    foamId = 14814;
  }
  
  // Filter out any existing foam entries to prevent duplication
  for (let i = bomItems.length - 1; i >= 0; i--) {
    const item = bomItems[i];
    if (item.name.includes('pianka ochronna') || item.name.includes('sklep - pianka')) {
      bomItems.splice(i, 1);
    }
  }

  if (totalFoamQty > 0) {
    bomItems.push({ name: foamName, qty: totalFoamQty, unit: 'szt', intranetId: foamId });
  }

  // --- CUSTOM CUTS DESCRIPTION INJECTOR ---
  if (config && config.cut === 'custom' && config.customCuts) {
    let parentCutsDesc = "";
    const isCTF = (sys === 'CTF' || sys === 'CTF_LED');
    const cc = config.customCuts;

    const fbV = (cc.frontBack?.vertical || []).map(c => `${c.pos}cm`).join(", ") || "w całości";
    const fbH = (cc.frontBack?.horizontal || []).map(c => `${c.pos}cm`).join(", ") || "w całości";
    const lrV = (cc.leftRight?.vertical || []).map(c => `${c.pos}cm`).join(", ") || "w całości";
    const lrH = (cc.leftRight?.horizontal || []).map(c => `${c.pos}cm`).join(", ") || "w całości";
    const tbV = (cc.topBottom?.vertical || []).map(c => `${c.pos}cm`).join(", ") || "w całości";
    const tbH = (cc.topBottom?.horizontal || []).map(c => `${c.pos}cm`).join(", ") || "w całości";

    const vCuts = (cc.vertical || []).map(c => `${c.pos}cm`).join(", ") || "w całości";
    const hCuts = (cc.horizontal || []).map(c => `${c.pos}cm`).join(", ") || "w całości";

    if (isCTF) {
      parentCutsDesc = `Cięcia niestandardowe: pionowe przód/tył (odległość od lewej): [${fbV}] / poziome przód/tył (odległość od dołu): [${fbH}] / pionowe boki (odległość od lewej): [${lrV}] / poziome boki (odległość od dołu): [${lrH}] / szerokość góra/dół (odległość od lewej): [${tbV}] / głębokość góra/dół (odległość od dołu): [${tbH}]`;
    } else {
      parentCutsDesc = `Cięcie niestandardowe - pionowe (odległość od lewej): ${vCuts} / poziome (odległość od dołu): ${hCuts}`;
    }

    // LED combo text calculations for flat systems
    const ledOption = config.light || 'power_long';
    const isPower = ledOption.startsWith('power');
    const type = isPower ? 'POWER' : 'NORMAL';
    const drawBottom = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
    const drawTop = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
    const drawLeft = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));
    const drawRight = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));

    let numHorizFaces = (drawTop ? 1 : 0) + (drawBottom ? 1 : 0);
    let numVertFaces = (drawLeft ? 1 : 0) + (drawRight ? 1 : 0);

    if (sys === 'LCD_LMD') {
      const isTop = ledOption === 'top_bottom' || ledOption === 'top_only';
      const isBottom = ledOption === 'top_bottom' || ledOption === 'bottom_only';
      numHorizFaces = (isTop ? 2 : 0) + (isBottom ? 2 : 0);
      numVertFaces = (isTop ? 2 : 0) + (isBottom ? 2 : 0);
    }

    function getLedComboText(length, count) {
      if (count <= 0 || ledOption === 'no_light') return '';
      const sizes = [50, 30, 24, 20];
      let best = [], bestSum = 0;
      function go(idx, combo, sum) {
        if (sum > length) return;
        if (sum > bestSum || (sum === bestSum && combo.length < best.length)) {
          bestSum = sum; best = [...combo];
        }
        for (let i = idx; i < sizes.length; i++) {
          go(i, [...combo, sizes[i]], sum + sizes[i]);
        }
      }
      go(0, [], 0);
      if (best.length === 0) return '';
      
      const counts = {};
      best.forEach(s => counts[s] = (counts[s] || 0) + count);
      return Object.keys(counts).map(s => `${counts[s]}x LED ${type} ${s}cm`).join(", ");
    }

    const horizLedsText = getLedComboText(sys === 'LCD_LMD' ? W - 28 : W - 10, numHorizFaces);
    const vertLedsText = getLedComboText(sys === 'LCD_LMD' ? D - 28 : H - 10, numVertFaces);

    const parentNames = ['adFrame STF', 'adFrame LMD', 'adFrame LMS', 'adFrame LMSM', 'adFrame DTF', 'adFrame STFL', 'adFrame CTF', 'adFrame CTF_LED', 'adFrame LCD', 'adFrame LCD (bez wydruku)'];
    bomItems.forEach(item => {
      const isParent = parentNames.includes(item.name) || item.name.startsWith("adFrame CTF");
      const isProfile = (item.name.startsWith("profil ") && !item.name.includes("support") && !item.name.includes("zamek") && !item.name.includes("łącznik"));
      
      if (isParent) {
        item.description = (item.description ? item.description + " | " : "") + parentCutsDesc;
      } else if (isProfile) {
        if (isCTF) {
          let ctfProfileDesc = `Cięcia - Szerokość (odległość od lewej): Przód/Tył = [${fbV}], Góra/Dół = [${tbV}] | Wysokość (odległość od dołu): Przód/Tył = [${fbH}], Boki = [${lrH}] | Głębokość (odległość od dołu): Boki = [${lrV}], Góra/Dół = [${tbH}]`;
          
          let ctfLedText = '';
          if (config.system === 'CTF_LED' && config.light) {
            if (config.light === 'paski_led') ctfLedText = 'paski LED obwodowo pod blatem';
            else if (config.light === 'plafon_dol') ctfLedText = 'Plafon LED (dół)';
            else if (config.light === 'plafon_gora') ctfLedText = 'Plafon LED (góra)';
            else if (config.light === 'plafon_gora_dol') ctfLedText = 'Plafon LED (góra + dół)';
            else if (config.light === 'zarowka') ctfLedText = 'żarówka';
          }
          if (ctfLedText) ctfProfileDesc += ` | LED: ${ctfLedText}`;

          let ctfCableText = '';
          if (config.cableExit && config.cableExit.startsWith('drill') && config.cableDrillVal) {
            const exitLabels = { drill_top: 'góra', drill_bottom: 'dół', drill_left: 'lewy', drill_right: 'prawy' };
            ctfCableText = `nawiert ${exitLabels[config.cableExit] || ''}: ${config.cableDrillVal} mm`;
          }
          if (ctfCableText) ctfProfileDesc += ` | ${ctfCableText}`;
          
          item.description = ctfProfileDesc;
        } else {
          // Flat profiles
          if (item.description && item.description.includes("Szerokość")) {
            // Split width profile
            let desc = `Szerokość: cięcie pionowe (odległość od lewej): ${vCuts}`;
            if (config.cableExit && (config.cableExit === 'drill_top' || config.cableExit === 'drill_bottom') && config.cableDrillVal) {
              const dir = config.cableExit === 'drill_top' ? 'góra' : 'dół';
              desc += ` / nawiert ${dir}: ${config.cableDrillVal} mm`;
            }
            item.description = desc;
          } else if (item.description && item.description.includes("Wysokość")) {
            // Split height profile
            let desc = `Wysokość: cięcie poziome (odległość od dołu): ${hCuts}`;
            if (config.cableExit && (config.cableExit === 'drill_left' || config.cableExit === 'drill_right') && config.cableDrillVal) {
              const dir = config.cableExit === 'drill_left' ? 'lewy' : 'prawy';
              desc += ` / nawiert ${dir}: ${config.cableDrillVal} mm`;
            }
            item.description = desc;
          } else {
            // Combined profile row (LMD/LMS/LMSM)
            let wPart = `Szerokość: cięcie pionowe (odległość od lewej): ${vCuts}`;
            if (config.cableExit && (config.cableExit === 'drill_top' || config.cableExit === 'drill_bottom') && config.cableDrillVal) {
              const dir = config.cableExit === 'drill_top' ? 'góra' : 'dół';
              wPart += `, nawiert ${dir}: ${config.cableDrillVal} mm`;
            }
            if (horizLedsText) wPart += `, LED: ${horizLedsText}`;

            let hPartName = (sys === 'LCD_LMD') ? 'Głębokość' : 'Wysokość';
            let hPart = `${hPartName}: cięcie poziome (odległość od dołu): ${hCuts}`;
            if (config.cableExit && (config.cableExit === 'drill_left' || config.cableExit === 'drill_right') && config.cableDrillVal) {
              const dir = config.cableExit === 'drill_left' ? 'lewy' : 'prawy';
              hPart += `, nawiert ${dir}: ${config.cableDrillVal} mm`;
            }
            if (vertLedsText) hPart += `, LED: ${vertLedsText}`;

            item.description = `${wPart} | ${hPart}`;
          }
        }
      }
      if (item.name && item.name.includes("adFrame LCD profil")) {
        item.description = `Wysokość ${H}cm (pionowy profil LCD)`;
      }
    });
  }

  // Clear descriptions of connectors and foams
  bomItems.forEach(item => {
    const isConnOrFoamOrImbus = item.name.includes('łącznik') || item.name.includes('zamek') || item.name.includes('connector') || item.name.includes('pianka') || item.name.includes('imbus');
    if (isConnOrFoamOrImbus) {
      item.description = '';
    }
  });

  // Add powder coating if active
  if (config && config.coating && config.coating !== 'none') {
    let totalCoatingMeters = (2 * W + 2 * H) / 100;
    if (sys === 'CTF' || sys === 'CTF_LED') {
      const D = parseFloat(config.height3D) || 120;
      totalCoatingMeters = (4 * W + 4 * H + 4 * D) / 100;
    }
    
    let profileNameType = "profil LMD";
    if (sys === 'LMS') profileNameType = "profil LMS";
    else if (sys === 'LMSM') profileNameType = "profil LMSM";
    else if (sys === 'STF') profileNameType = "profil STF";
    else if (sys === 'STFL') profileNameType = "profil STFL";
    else if (sys === 'DTF') profileNameType = "profil DTF";
    else if (sys === 'CTF' || sys === 'CTF_LED') profileNameType = "profil CTF";

    const isStd = config.coating.includes('standard');
    const ralText = config.ral || (isStd ? 'RAL 7016' : '');
    const glossText = config.coating.includes('mat') ? 'mat' : (config.coating.includes('semi') ? 'półmat' : 'połysk');
    const stdText = isStd ? 'standardowy' : 'niestandardowy';
    
    const coatingDesc = `${profileNameType} / ${totalCoatingMeters.toFixed(2)} mb / ${ralText} / ${glossText} / ${stdText}`;
    
    bomItems.push({
      name: 'malowanie proszkowe',
      qty: parseFloat(totalCoatingMeters.toFixed(2)),
      unit: 'mb',
      intranetId: 11906,
      description: coatingDesc
    });
  }

  const ratePLN = window.KURS_PLN_DYNAMIC || 4.20;
  const rateUSD = window.KURS_USD_DYNAMIC || 1.15;
  let totalEUR = 0;

  bomItems.forEach(item => {
    let plnPrice = 0;
    let plnMargin = 0;
    let priceEUR = 0;
    let hasNoPrice = false;

    const parentNames = ['adFrame STF', 'adFrame LMD', 'adFrame LMS', 'adFrame LMSM', 'adFrame DTF', 'adFrame STFL', 'adFrame LCD', 'adFrame LCD (bez wydruku)'];
    if (item.forceZeroPrice || parentNames.includes(item.name)) {
      item.plnPrice = 0;
      item.plnMargin = 0;
      item.price = 0;
      item.hasNoPrice = false;
      // Przeskakujemy resztę kalkulacji cennika dla tej konkretnej pozycji
      item.plnPrice = 0; item.plnMargin = 0; item.price = 0; item.hasNoPrice = false;
    } else {

      let isWydrukWithArea = false;
      let wydrukArea = 0;
      const area = calculateWydrukArea(item.name);
      if (area !== null) {
        isWydrukWithArea = true;
        wydrukArea = area;
      }

      let hasNoPrice = false;
      if (KASETON_PRICES[item.name] && KASETON_PRICES[item.name].noPrice) {
        if (!isWydrukWithArea) {
          hasNoPrice = true;
        }
      }

      if (window.customPriceOverrides && window.customPriceOverrides[item.name] !== undefined) {
        priceEUR = window.customPriceOverrides[item.name];
        plnPrice = priceEUR * ratePLN;
        plnMargin = plnPrice / 2.8;
        hasNoPrice = false; // Override clears warning
      } else if (isWydrukWithArea) {
        priceEUR = wydrukArea * 24;
        plnPrice = wydrukArea * 100;
        plnMargin = plnPrice / 2.8;
      } else if (item.isManual) {
        plnPrice = item.plnPrice;
        plnMargin = item.plnMargin;
        priceEUR = plnPrice / ratePLN;
      } else if (item.name.startsWith("profil support light") && KASETON_PRICES["profil support light"]) {
        plnPrice = KASETON_PRICES["profil support light"].plnPrice;
        plnMargin = KASETON_PRICES["profil support light"].plnMargin;
        priceEUR = plnPrice / ratePLN;
        item.intranetId = KASETON_PRICES["profil support light"].intranetId;
      } else if (KASETON_PRICES[item.name]) {
        plnPrice = KASETON_PRICES[item.name].plnPrice;
        plnMargin = KASETON_PRICES[item.name].plnMargin;
        priceEUR = plnPrice / ratePLN;
        if (KASETON_PRICES[item.name].intranetId) {
          item.intranetId = KASETON_PRICES[item.name].intranetId;
        }
      } else if (item.name.startsWith("Wydruk adFrame")) {
        const areaM2 = (W * H) / 10000;
        priceEUR = areaM2 * 24;
        plnPrice = areaM2 * 100;
        plnMargin = plnPrice / 2.8;
        const PRINT_INTRANET_IDS = {
          "Wydruk adFrame LMD/LMS/LMSM 100x200": 14442,
          "Wydruk adFrame Blockout - BIAŁY PLECY NIE DO DRUKU 100x200": 14722,
          "Wydruk adFrame Blockout 100x200 plecy nie do druku": 14722
        };
        if (PRINT_INTRANET_IDS[item.name]) {
          item.intranetId = PRINT_INTRANET_IDS[item.name];
        }
      } else {
        // Fallback for new/unknown items not in prices database
        hasNoPrice = true;
        priceEUR = 0;
        plnPrice = 0;
        plnMargin = 0;
      }

      if (window.customPriceOverrides && window.customPriceOverrides[item.name] !== undefined) {
        // already set
      } else if (!isWydrukWithArea && !item.name.startsWith("Wydruk adFrame")) {
        priceEUR = plnPrice / ratePLN;
      }

      if (plnPrice > 0 || priceEUR > 0) {
        hasNoPrice = false;
      }
    }

    item.plnPrice = plnPrice;
    item.plnMargin = plnMargin;
    item.price = priceEUR;
    item.hasNoPrice = hasNoPrice;

    totalEUR += item.price * parseFloat(item.qty);
  });


  // 🛠️ AKTUALIZACJA: Pobranie zniżki i obliczenie finalnej wartości EUR po rabacie
  const discountInputEl = document.getElementById('discountInput');
  const discount = discountInputEl ? (parseFloat(discountInputEl.value) || 0) : 0;
  const finalEUR = totalEUR * (1 - discount / 100);

  // Update global pricing metrics z uwzględnieniem rabatu
  globalTotalEUR = finalEUR;
  globalTotalPLN = finalEUR * ratePLN;

  const finalPLN = globalTotalPLN;
  const finalUSD = finalEUR * rateUSD;

  document.getElementById('valPLN').innerHTML = `<b>${Math.round(finalPLN).toLocaleString()} PLN</b>`;
  document.getElementById('valUSD').innerHTML = `<b>${Math.round(finalUSD).toLocaleString()} $</b>`;

  // Render BOM to sidebar
  let html = '<div class="bom-item highlight" style="margin-top:8px; border-bottom:1px solid #444; padding-bottom:4px;">';
  html += '<span><b>KASETON ' + sys + ' (' + W + '\u00d7' + H + ' cm)</b></span><span></span></div>';

  bomItems.forEach(item => {
    const q = item.qty;
    const u = item.unit ? (' ' + item.unit) : 'x';
    const lineTotal = item.price * parseFloat(q);

    let inputStyle = 'width: 65px; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid #444; border-radius: 4px; padding: 2px 4px; text-align: right; font-family: inherit; font-size: 11px;';
    let warningHtml = '';
    if (item.hasNoPrice) {
      inputStyle = 'width: 65px; background: rgba(255, 50, 50, 0.15); color: #ff3333; border: 1px solid #ff3333; border-radius: 4px; padding: 2px 4px; text-align: right; font-family: inherit; font-size: 11px; font-weight: bold;';
      warningHtml = '<span style="color: #ff3333; font-weight: bold; margin-left: 5px; font-size: 10px;">[Brak ceny!]</span>';
    }

    const escapedName = item.name.replace(/\x27/g, "\\\x27").replace(/\x22/g, "&quot;");

    // 🔥 NOWOŚĆ: Generowanie podglądu opisu technicznego w locie na okienku wyceny
    let itemDescHtml = item.description ? `<br><span style="color: #8f95b2; font-size: 10px; font-style: italic; margin-left: 15px; display: block; margin-top: 2px;">↳ ${item.description}</span>` : '';

    html += '<div class="bom-item" style="align-items: center; gap: 5px;' + (item.hasNoPrice ? ' background: rgba(255,0,0,0.1); border-radius: 4px; padding: 2px;' : '') + '">';
    // Wstrzyknięcie itemDescHtml bezpośrednio do komórki nazwy produktu
    html += '<span style="flex-grow: 1; text-align: left;"><b>' + q + u + '</b> ' + item.name + itemDescHtml + warningHtml + '</span>';
    html += '<div style="display: flex; align-items: center; gap: 4px;">';
    html += '<input type="number" step="0.01" style="' + inputStyle + '" value="' + item.price.toFixed(2) + '" onchange="window.overrideBomPrice(\'' + escapedName + '\', this.value)">';
    html += '<span style="min-width: 55px; text-align: right;">' + lineTotal.toFixed(2) + ' \u20ac</span>';
    html += '</div></div>';
  });

  document.getElementById('bomList').innerHTML = html;
  // 🛠️ AKTUALIZACJA: Przypisanie zrabatowanej ceny do końcowego pola tekstowego EUR
  document.getElementById('totalPrice').innerText = Math.round(finalEUR).toLocaleString() + ' \u20ac';
  document.getElementById('totalPower').innerText = '\u26a1 Moc: ' + Math.round(config.totalPowerW || 0) + ' W';
  window.lastGeneratedBOM = bomItems;
}

function calculateKasetonWeight(config) {
  const sys = config.system || 'LMD';
  const W = parseFloat(config.width) || 120;
  const H = parseFloat(config.depth) || 200;
  const wt = KASETON_WEIGHT_DATA[sys] || KASETON_WEIGHT_DATA.LMD;
  if (wt && typeof wt.getWeight === 'function') {
    return wt.getWeight(W / 100, H / 100);
  }
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

  // Cartons / Bags / Loose
  const cName = config.cartonName || 'Karton LMD/LMS/DTF - 210x16x33cm';
  const cQty = config.cartonQty || 0;
  const packing = config.packing || 'kartony';

  if (packing === 'torby') {
    const KASETON_BAG_WEIGHTS = {
      'adFrame LMD/LMS - Torba 105cm z kółkami': 4.5,
      'adFrame LMD/LMS - Torba 130cm z kółkami': 5.0,
      'adFrame LMD/LMS - Torba 155cm z kółkami': 5.5,
      'adFrame LMD/LMS - Torba 205cm z kółkami': 6.5
    };
    total += (KASETON_BAG_WEIGHTS[cName] || 5.0) * cQty;
  } else if (packing === 'luzem') {
    // No carton/bag weight
  } else {
    total += (KASETON_CARTON_WEIGHTS[cName] || 2.0) * cQty;
  }

  // Foam (0 if loose packaging has 0 cartons)
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

function adjustCartonsByWeight(config, initialQty, cartonName) {
  config.cartonName = cartonName;
  config.cartonQty = initialQty;

  let currentWeight = calculateKasetonWeight(config);
  let attempts = 0;

  // Iteratively split into more packages until weight per package is <= 28 kg
  while (currentWeight / config.cartonQty > 28 && attempts < 20) {
    config.cartonQty++;
    currentWeight = calculateKasetonWeight(config);
    attempts++;
  }

  return config.cartonQty;
}

