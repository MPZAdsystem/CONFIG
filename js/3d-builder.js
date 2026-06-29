function addKantorek1x1() {
  plan.push({
    type: 'kantorek_1x1',
    x: 0,
    y: 0,
    ang: 0, // Kąt początkowy
    system: currentSystem || 'SEGO'
  });
  selectedItemIndex = plan.length - 1;
  if (typeof render === 'function') render();
}

function buildMiteredRing(hw, hd, profile, material) {
  if (profile === "LMSM") {
    const group = new THREE.Group();
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x444444 });
    const segmentsConfig = [
      { zMin: -3.25, zMax: -3.0, t: 1.4 }, // Ścianka zewnętrzna tylna
      { zMin: -3.0, zMax: 1.25, t: 4.3 }, // Kanał wewnętrzny konstrukcyjny / LED
      { zMin: 1.25, zMax: 2.25, t: 1.6 }, // Ścianka montażowa stopy
      { zMin: 2.25, zMax: 3.25, t: 0.5 }  // Cienka krawędź frontowa Slim
    ];

    segmentsConfig.forEach(seg => {
      const subProfile = [
        { x: seg.zMin, y: 0 },
        { x: seg.zMin, y: seg.t },
        { x: seg.zMax, y: seg.t },
        { x: seg.zMax, y: 0 },
        { x: seg.zMin, y: 0 }
      ];

      const verts = [];
      for (let side = 0; side < 4; side++) {
        for (let i = 0; i < subProfile.length - 1; i++) {
          const pA = subProfile[i];
          const pB = subProfile[i + 1];
          let L_A, R_A, L_B, R_B;
          if (side === 0) {
            L_A = [-hw - pA.x, pA.y, hd + pA.x]; R_A = [hw + pA.x, pA.y, hd + pA.x];
            L_B = [-hw - pB.x, pB.y, hd + pB.x]; R_B = [hw + pB.x, pB.y, hd + pB.x];
          } else if (side === 1) {
            L_A = [hw + pA.x, pA.y, hd + pA.x]; R_A = [hw + pA.x, pA.y, -hd - pA.x];
            L_B = [hw + pB.x, pB.y, hd + pB.x]; R_B = [hw + pB.x, pB.y, -hd - pB.x];
          } else if (side === 2) {
            L_A = [hw + pA.x, pA.y, -hd - pA.x]; R_A = [-hw - pA.x, pA.y, -hd - pA.x];
            L_B = [hw + pB.x, pB.y, -hd - pB.x]; R_B = [-hw - pB.x, pB.y, -hd - pB.x];
          } else if (side === 3) {
            L_A = [-hw - pA.x, pA.y, -hd - pA.x]; R_A = [-hw - pA.x, pA.y, hd + pA.x];
            L_B = [-hw - pB.x, pB.y, -hd - pB.x]; R_B = [-hw - pB.x, pB.y, hd + pB.x];
          }
          verts.push(...L_A, ...L_B, ...R_B);
          verts.push(...L_A, ...R_B, ...R_A);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, material);
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, edgeMat);
      mesh.add(line);
      group.add(mesh);
    });

    return group;
  }

  const verts = [];
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < profile.length - 1; i++) {
      const pA = profile[i];
      const pB = profile[i + 1];
      let L_A, R_A, L_B, R_B;
      if (side === 0) {
        L_A = [-hw - pA.x, pA.y, hd + pA.x]; R_A = [hw + pA.x, pA.y, hd + pA.x];
        L_B = [-hw - pB.x, pB.y, hd + pB.x]; R_B = [hw + pB.x, pB.y, hd + pB.x];
      } else if (side === 1) {
        L_A = [hw + pA.x, pA.y, hd + pA.x]; R_A = [hw + pA.x, pA.y, -hd - pA.x];
        L_B = [hw + pB.x, pB.y, hd + pB.x]; R_B = [hw + pB.x, pB.y, -hd - pB.x];
      } else if (side === 2) {
        L_A = [hw + pA.x, pA.y, -hd - pA.x]; R_A = [-hw - pA.x, pA.y, -hd - pA.x];
        L_B = [hw + pB.x, pB.y, -hd - pB.x]; R_B = [-hw - pB.x, pB.y, -hd - pB.x];
      } else if (side === 3) {
        L_A = [-hw - pA.x, pA.y, -hd - pA.x]; R_A = [-hw - pA.x, pA.y, hd + pA.x];
        L_B = [-hw - pB.x, pB.y, -hd - pB.x]; R_B = [-hw - pB.x, pB.y, hd + pB.x];
      }
      verts.push(...L_A, ...L_B, ...R_B);
      verts.push(...L_A, ...R_B, ...R_A);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function addDimension3D(p1, p2, text, offsetVector, customScale = 1.0) {
  const group = new THREE.Group();
  const p1Offset = p1.clone().add(offsetVector);
  const p2Offset = p2.clone().add(offsetVector);

  const color = isBlueprintMode ? 0x00ffff : 0xffaa00;
  const lineMat = new THREE.LineBasicMaterial({ color: color, depthTest: false, transparent: true, opacity: 0.8 });

  const lineGeo = new THREE.BufferGeometry().setFromPoints([p1Offset, p2Offset]);
  group.add(new THREE.Line(lineGeo, lineMat));

  const tickDir = offsetVector.clone().normalize().multiplyScalar(-6);
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1Offset.clone().add(tickDir), p1Offset.clone().sub(tickDir)]), lineMat));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p2Offset.clone().add(tickDir), p2Offset.clone().sub(tickDir)]), lineMat));

  // NOWE: Dynamiczne płótno dla wymiarów, aby nigdy nie obcinało "Szerokości całkowitej"
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fontSize = 48 * customScale;
  ctx.font = `bold ${fontSize}px Arial`;
  const textWidth = ctx.measureText(text).width;

  canvas.width = textWidth + 80;
  canvas.height = fontSize + 40;

  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = isBlueprintMode ? '#00ffff' : '#ffaa00';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);

  // depthTest: false - linie i wymiary zawsze na wierzchu!
  const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMat);

  const aspect = canvas.width / canvas.height;
  const baseHeight = 30 * customScale;

  const midPoint = new THREE.Vector3().addVectors(p1Offset, p2Offset).multiplyScalar(0.5);
  sprite.position.copy(midPoint).add(offsetVector.clone().normalize().multiplyScalar(15 * customScale));

  // Skalowanie proporcjonalne do dynamicznego płótna
  sprite.scale.set(baseHeight * aspect, baseHeight, 1);
  group.add(sprite);

  group.renderOrder = 999;
  return group;
}

function applyTransform2D() {
  const layer = document.getElementById('drawingLayer');
  layer.style.transform = `translate(${viewPanX}px, ${viewPanY}px) scale(${viewScale})`;
  
  const stage = document.getElementById('stage');
  if (stage) {
    let sWidth = stage.clientWidth || window.innerWidth - 400;
    let sHeight = stage.clientHeight || window.innerHeight;
    const stageCenterStartX = sWidth / 2 - 100;
    const stageCenterStartY = sHeight / 2 + 100;

    let scaledGridSize100 = 100 * viewScale;
    let scaledGridSize50 = 50 * viewScale;
    let bgPosX = viewPanX + stageCenterStartX * viewScale;
    let bgPosY = viewPanY + stageCenterStartY * viewScale;
    
    stage.style.backgroundSize = `${scaledGridSize100}px ${scaledGridSize100}px, ${scaledGridSize100}px ${scaledGridSize100}px, ${scaledGridSize50}px ${scaledGridSize50}px, ${scaledGridSize50}px ${scaledGridSize50}px`;
    stage.style.backgroundPosition = `${bgPosX}px ${bgPosY}px, ${bgPosX}px ${bgPosY}px, ${bgPosX}px ${bgPosY}px, ${bgPosX}px ${bgPosY}px`;
  }
}

function updateFloor() {
  floorConfig.type = document.getElementById('floorType').value;
  floorConfig.width = parseFloat(document.getElementById('floorWidth').value) || 0;
  floorConfig.depth = parseFloat(document.getElementById('floorDepth').value) || 0;
  floorConfig.offsetX = 0;
  floorConfig.offsetY = 0;
  render();
}

function loadWalkingMan() {
  const loader = new THREE.GLTFLoader();

  // 🔗 Bezpośredni link RAW do Twojego GitHuba
  const modelUrl = "https://raw.githubusercontent.com/Valaron86/hall-image/50708911485c87399051b9673d42829ec6758060/man.glb";

  loader.load(modelUrl, function (gltf) {
    const model = gltf.scene;

    // 📏 ZMNIEJSZONE SKALOWANIE (66% oryginalnej wielkości)
    model.scale.set(66, 66, 66);

    // 📍 POZYCJA BAZOWA
    model.position.set(0, 0, 350);
    model.rotation.y = Math.PI;

    // 🚀 NOWOŚĆ: AUTOMATYCZNE WYCIĄGANIE Z PODŁOGI
    // Silnik analizuje najniższy punkt buta i podnosi ludzika idealnie na ziemię
    const box = new THREE.Box3().setFromObject(model);
    model.position.y += Math.abs(box.min.y);

    // Włączenie cieni
    model.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(model);

    // Odpalenie animacji chodu
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
  }, undefined, function (error) {
    console.error('Błąd ładowania ludzika z GitHuba:', error);
  });
}

function applyTextureToMesh(mesh, matIndex, planIdx, source, quadIdx, isFloor = false, ringSide = null) {
  // 1. POPRAWKA: Zmiana kompresji z 0.8 na 0.95 (zapobiega utracie jakości i kolorów przy wgrywaniu)
  let dataUrl = typeof source === 'string' ? source : source.toDataURL('image/jpeg', 0.95);

  // 2. POPRAWKA: Metalness zmienione z 0.1 na 0.0 (usuwa szary, "plastikowy" odblask od świateł)
  const PBR_SETTINGS = {
    roughness: 1.0,
    metalness: 0.0,
    emissive: 0x000000,
    emissiveIntensity: 0
  };

  // 3. POPRAWKA: Tworzymy funkcję, która nałoży materiał DOPIERO, gdy tekstura całkowicie się załaduje
  const applyToMaterial = (texture) => {
    // Wymuszenie przestrzeni barw sRGB na pliku (teraz zadziała na 100%, bo plik jest już wczytany)
    texture.encoding = THREE.sRGBEncoding;

    // Zabezpieczenie ostrości tekstury pod kątem
    if (typeof renderer !== 'undefined') {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }

    if (isFloor) {
      floorConfig.textureData = dataUrl;
      mesh.material[matIndex] = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.15, // Płytka Adfloor jest lekko błyszcząca
        metalness: 0.0
      });
      mesh.material[matIndex].needsUpdate = true;
    } else if (ringSide) {
      if (!plan[planIdx].quadTextures) plan[planIdx].quadTextures = {};
      plan[planIdx].quadTextures[ringSide + quadIdx] = dataUrl;

      let isOut = ringSide === 'Out';
      if (!isOut) { texture.wrapS = THREE.RepeatWrapping; texture.repeat.x = -1; }

      // Aktualizujemy pierścień
      mesh.material = new THREE.MeshStandardMaterial({
        map: texture,
        side: isOut ? THREE.FrontSide : THREE.BackSide,
        transparent: true,
        alphaTest: 0.1,
        ...PBR_SETTINGS
      });
      mesh.material.needsUpdate = true;
    } else {
      if (quadIdx !== undefined) {
        if (!plan[planIdx].quadTextures) plan[planIdx].quadTextures = {};
        let side = matIndex === 4 ? 'Out' : 'In';
        plan[planIdx].quadTextures[side + quadIdx] = dataUrl;
      } else {
        if (matIndex === 4) plan[planIdx].textureFront = dataUrl;
        if (matIndex === 5) plan[planIdx].textureBack = dataUrl;
      }

      // Aktualizujemy ścianę/daszek
      mesh.material[matIndex] = new THREE.MeshStandardMaterial({
        map: texture,
        ...PBR_SETTINGS
      });
      mesh.material[matIndex].needsUpdate = true;
    }

    // Odświeżamy scenę po fizycznym nałożeniu tekstury
    if (typeof render === 'function') render();
  };

  // Odpalamy ładowanie tekstury asynchronicznie (aby silnik nie gubił kolorów przed zdekodowaniem JPG)
  if (typeof source === 'string') {
    new THREE.TextureLoader().load(source, applyToMaterial);
  } else {
    const canvasTex = new THREE.CanvasTexture(source);
    applyToMaterial(canvasTex);
  }
}

function rotateCamera(degrees) {
  if (!controls) return;
  controls.autoRotate = false;
  document.getElementById('btnAutoRotate').classList.remove('active');
  document.getElementById('btnAutoRotate').innerText = "🔄 Auto-Obrót: WYŁ";
  let rad = degrees * Math.PI / 180;
  let targetAngle = controls.getAzimuthalAngle() + rad;
  controls.minAzimuthAngle = targetAngle; controls.maxAzimuthAngle = targetAngle; controls.update();
  controls.minAzimuthAngle = -Infinity; controls.maxAzimuthAngle = Infinity;
}

function createTextSprite(message, color = "black", fontSize = 24) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const scaleFactor = 4; // Podbicie rozdzielczości dla idealnej ostrości

  context.font = `bold ${fontSize * scaleFactor}px "Segoe UI", sans-serif`;
  const textWidth = context.measureText(message).width;

  canvas.width = textWidth + (20 * scaleFactor);
  canvas.height = (fontSize * scaleFactor) + (20 * scaleFactor);

  context.font = `bold ${fontSize * scaleFactor}px "Segoe UI", sans-serif`;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.strokeStyle = isBlueprintMode ? "rgba(10, 26, 53, 0.8)" : "rgba(255, 255, 255, 0.5)";
  context.lineWidth = 2 * scaleFactor;
  context.strokeText(message, canvas.width / 2, canvas.height / 2);
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(spriteMat);

  const ratio = canvas.width / canvas.height;

  // KLUCZOWA ZMIANA: Wysokość w 3D zależy teraz od rozmiaru czcionki!
  const finalHeight = fontSize * 0.25;
  sprite.scale.set(finalHeight * ratio, finalHeight, 1);

  sprite.renderOrder = 1000;
  return sprite;
}

function createLeaderLine(startY, endY, zOffset = 0) {
  const lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, startY, zOffset), new THREE.Vector3(0, endY, zOffset)]);
  return new THREE.Line(lineGeom, new THREE.LineBasicMaterial({ color: 0x555555, opacity: 0.5, transparent: true }));
}

function countCollisions(testPlan) {
  const stage = document.getElementById('stage');
  const sWidth = stage ? (stage.clientWidth || window.innerWidth - 400) : (window.innerWidth - 400);
  const sHeight = stage ? (stage.clientHeight || window.innerHeight) : window.innerHeight;
  const stageCenterStartX = sWidth / 2 - 100;
  const stageCenterStartY = sHeight / 2 + 100;

  let colls = 0;
  let x = stageCenterStartX, y = stageCenterStartY, angle = 0;
  let walls = [];
  let pendingTurnItem = null;
  let nodes = [{ x: x, y: y, angle: angle }];

  for (let item of testPlan) {
    if (item.type === 'turn') {
      item.prevAngle = angle; angle += item.angle; item.currAngle = angle;
      item.cornerX = x; item.cornerY = y; pendingTurnItem = item;
    } else if (item.type === 'jump') {
      if (item.x !== undefined && item.y !== undefined) {
        x = item.x; y = item.y; angle = item.angle !== undefined ? item.angle : 0;
        nodes.push({ x: x, y: y, angle: angle });
      } else {
        let targetNode = nodes[item.target];
        if (targetNode) { x = targetNode.x; y = targetNode.y; angle = targetNode.angle; }
      }
    } else if (item.type === 'wall') {
      let tempX = x, tempY = y;
      if (pendingTurnItem) {
        let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
        let rad2 = pendingTurnItem.currAngle * Math.PI / 180;
        let offset = (item.thickness || 12) / 2;
        let sV1 = 0, sV2 = 0;
        let cType = pendingTurnItem.cornerType || 'wew-zew-1';

        // 💎 BAZOWE WEKTORY
        if (cType === 'zew-zew') { sV1 = offset; sV2 = offset; }
        else if (cType === 'wew-zew-1') { sV1 = -offset; sV2 = offset; }
        else if (cType === 'wew-zew-2') { sV1 = offset; sV2 = -offset; }

        let isBranchingFromStart = false;
        for (let w of walls) {
          if (Math.abs(pendingTurnItem.cornerX - w.startX) < 1 && Math.abs(pendingTurnItem.cornerY - w.startY) < 1) {
            isBranchingFromStart = true; break;
          }
        }
        if (isBranchingFromStart) sV1 = -sV1;

        tempX = pendingTurnItem.cornerX + sV1 * Math.cos(rad1) + sV2 * Math.cos(rad2);
        tempY = pendingTurnItem.cornerY + sV1 * Math.sin(rad1) + sV2 * Math.sin(rad2);
        pendingTurnItem = null;
      }
      let rad = angle * Math.PI / 180;
      let nX = tempX + item.length * Math.cos(rad);
      let nY = tempY + item.length * Math.sin(rad);

      let minX1 = Math.min(tempX, nX) + 1; let maxX1 = Math.max(tempX, nX) - 1;
      let minY1 = Math.min(tempY, nY) + 1; let maxY1 = Math.max(tempY, nY) - 1;
      let dx1 = nX - tempX; let dy1 = nY - tempY;

      for (let w of walls) {
        let isShared = (Math.abs(tempX - w.endX) < 15 && Math.abs(tempY - w.endY) < 15) ||
          (Math.abs(nX - w.startX) < 15 && Math.abs(nY - w.startY) < 15) ||
          (Math.abs(tempX - w.startX) < 15 && Math.abs(tempY - w.startY) < 15) ||
          (Math.abs(nX - w.endX) < 15 && Math.abs(nY - w.endY) < 15);

        let dx2 = w.endX - w.startX; let dy2 = w.endY - w.startY;
        let isAntiParallel = (dx1 * dx2 + dy1 * dy2 < 0) && (Math.abs(dx1 * dy2 - dy1 * dx2) < 1);

        if (isShared && isAntiParallel) {
          colls += 100;
        } else if (!isShared) {
          if (minX1 < w.maxX && maxX1 > w.minX && minY1 < w.maxY && maxY1 > w.minY) colls++;
        }
      }
      walls.push({ startX: tempX, startY: tempY, endX: nX, endY: nY, minX: minX1, maxX: maxX1, minY: minY1, maxY: maxY1 });
      x = nX; y = nY;
      nodes.push({ x: x, y: y, angle: angle });
    }
  }
  return colls;
}

function autoResolveCorners() {
  let turns = [];
  for (let i = 0; i < plan.length; i++) {
    if (plan[i].type === 'turn') turns.push(i);
  }
  if (turns.length === 0) return;

  let changed = false;
  for (let t of turns) {
    let original = plan[t].cornerType || 'wew-zew-1';
    let options = (currentSystem === 'foldable') ? ['wew-zew-1', 'wew-zew-2'] : ['wew-zew-1', 'wew-zew-2', 'zew-zew'];
    let best = original;
    let minColl = countCollisions(plan);

    for (let opt of options) {
      plan[t].cornerType = opt;
      let c = countCollisions(plan);
      if (c < minColl) {
        minColl = c;
        best = opt;
      }
    }
    plan[t].cornerType = best;
    if (best !== original) changed = true;
  }
  render();
  if (changed) alert("Narożniki zostały automatycznie zoptymalizowane, aby usunąć kolizje!");
}

function addTurn(direction) {
  let angleChange = (direction === 'left') ? -90 : 90;

  if (plan.length > 0 && plan[plan.length - 1].type === 'turn') {
    let lastTurn = plan[plan.length - 1];
    let newAngle = lastTurn.angle + angleChange;

    if (newAngle % 360 === 0) {
      plan.pop();
    } else if (Math.abs(newAngle) % 360 === 180) {
      if (currentSystem === 'kasetony_niestandardowe') {
        alert("Blokada: Nie możesz zawrócić o 180 stopni, aby nie nałożyć ścian na siebie!");
        return;
      } else {
        lastTurn.angle = newAngle;
      }
    } else {
      lastTurn.angle = newAngle;
    }
  } else {
    plan.push({
      type: 'turn',
      angle: angleChange,
      cornerType: (currentSystem === 'foldable' ? 'wew-zew-1' : 'wew-zew-1')
    });
  }

  selectedItemIndex = null;
  render();
}

function checkWillGoBackwards() {
  let currentAngle = 0;
  let lastWallAngle = null;
  let hasJumpSinceLastWall = false;
  
  for (let item of plan) {
    if (item.type === 'wall') {
      lastWallAngle = currentAngle;
      hasJumpSinceLastWall = false;
    } else if (item.type === 'turn') {
      currentAngle += item.angle;
    } else if (item.type === 'jump') {
      hasJumpSinceLastWall = true;
    }
  }
  
  if (lastWallAngle !== null && !hasJumpSinceLastWall) {
    let normCurrent = ((currentAngle % 360) + 360) % 360;
    let normLastWall = ((lastWallAngle % 360) + 360) % 360;
    let diff = Math.abs(normCurrent - normLastWall) % 360;
    if (diff === 180) {
      return true;
    }
  }
  return false;
}

function addModule(id) {
  // Przeskok rysowania na zaznaczoną ścianę (Zostawiamy, to genialna funkcja!)
  if (selectedItemIndex !== null && plan[selectedItemIndex] && plan[selectedItemIndex].type === 'wall') {
    if (plan[selectedItemIndex].endNodeIndex !== undefined) plan.push({ type: 'jump', target: plan[selectedItemIndex].endNodeIndex });
    selectedItemIndex = null;
  }

  let isWallModule = false;
  if (id === 'foldable100x250') {
    isWallModule = true;
  } else {
    let itemData = DB[id];
    if (itemData && itemData.type === 'wall') {
      isWallModule = true;
    }
  }

  if (isWallModule && currentSystem !== 'kasetony_niestandardowe') {
    if (checkWillGoBackwards()) {
      alert("Blokada: Nie możesz postawić ściany w kierunku wstecz!");
      return;
    }
  }

  let newItem;

  // --- LOGIKA FOLDABLE ---
  if (id === 'foldable100x250') {

    newItem = {
      name: "Foldable 100x250 (bez wydruku)",
      labelEN: "Foldable 100x250",
      type: 'wall',
      length: 100,
      height: 250,
      thickness: 4.5,
      isFoldable: true,
      price: 119,
      accessories: [],
      foldableSettings: { div: 'seamless', side: 'double', hasPrint: false }
    };
  }
  // --- STANDARDOWA LOGIKA BAZY DANYCH (SEGO) ---
  else {
    newItem = JSON.parse(JSON.stringify(DB[id]));
    newItem.accessories = [];
  }

  plan.push(newItem);
  render();
}

function addAccessory(id) {
  let target = selectedItemIndex;
  if (target === null) for (let i = plan.length - 1; i >= 0; i--) if (plan[i].type === 'wall') { target = i; break; }

  // 💎 NOWE: Obsługa kliknięcia w nogę mostka i przypięcia akcesorium
  if (typeof target === 'string' && target.startsWith('daszek_')) {
    let parts = target.split('_'); let pIdx = parseInt(parts[1]); let aIdx = parseInt(parts[2]);
    let accItem = JSON.parse(JSON.stringify(DB[id])); accItem.dir = 1; accItem.slot = 2;
    let daszek = plan[pIdx].accessories[aIdx];
    if (!daszek.accessories) daszek.accessories = [];
    daszek.accessories.push(accItem); render(); return;
  }

  if (target !== null && plan[target].type === 'wall') {
    if (plan[target].length !== 100) { alert("ZABLOKOWANO: Akcesoria mogą być instalowane wyłącznie na modułach o szerokości 100 cm!"); return; }
    let accItem = JSON.parse(JSON.stringify(DB[id])); accItem.dir = 1; accItem.slot = 2; plan[target].accessories.push(accItem); render();
  } else alert("Narysuj ścianę 100cm lub zaznacz ją klikając!");
}

function addFreestanding(id) { let newItem = JSON.parse(JSON.stringify(DB[id])); newItem.offsetX = 0; newItem.offsetY = 300; plan.push(newItem); render(); }

function addSuspended(id) { if (!DB[id]) return; let newItem = JSON.parse(JSON.stringify(DB[id])); newItem.offsetX = 0; newItem.offsetY = 300; plan.push(newItem); render(); }

function removeFreestanding(index, e) { e.stopPropagation(); plan.splice(index, 1); render(); }

function toggleKantorekDoor(index, e) {
  e.stopPropagation();
  if (plan[index].doorOpposite === undefined) plan[index].doorOpposite = false;
  plan[index].doorOpposite = !plan[index].doorOpposite;
  render();
}

function rotateFreestanding(index, e) {
  e.stopPropagation();
  if (plan[index].rotation === undefined) plan[index].rotation = 0;

  // 🔒 Ograniczenie obrotu TYLKO dla kantorka (0 = drzwi w dół, -90 = drzwi w prawo)
  if (plan[index].type === 'kantorek_1x1') {
    plan[index].rotation = plan[index].rotation === 0 ? -90 : 0;
  } else {
    plan[index].rotation = (plan[index].rotation + 90) % 360;
  }
  render();
}

function selectItem(index, e) {

  e.stopPropagation();
  if (e && e.ctrlKey) {
    // Ctrl+Klik – multi-select
    if (typeof selectedItemIndices !== 'undefined') {
      if (selectedItemIndices.has(index)) {
        selectedItemIndices.delete(index);
      } else {
        selectedItemIndices.add(index);
      }
    }
    selectedItemIndex = index;
  } else {
    // Zwykłe kliknięcie – singiel
    if (typeof selectedItemIndices !== 'undefined') selectedItemIndices.clear();
    selectedItemIndex = index;
    if (typeof selectedItemIndices !== 'undefined') selectedItemIndices.add(index);
  }

  if (typeof selectedItemIndices !== 'undefined' && selectedItemIndices.size >= 2) {
    if (typeof autoClipSelectedCollinear === 'function') {
      autoClipSelectedCollinear(Array.from(selectedItemIndices));
    }
  }

  render();
}

function undo() {
  plan.pop();
  selectedItemIndex = null;
  if (typeof selectedItemIndices !== 'undefined') selectedItemIndices.clear();
  render();
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔓 WYRWANIE ŚCIANY Z ŁAŃCUCHA (detachWallFromChain)
// Zmienia ścianę z 'wall' w łańcuchu na 'freeWall' z własną pozycją i kątem.
// ─────────────────────────────────────────────────────────────────────────────
function detachElementFromChain(index) {
  const item = plan[index];
  if (!item) return;

  const stageEl = document.getElementById('stage');
  const sWidth = stageEl ? (stageEl.clientWidth || window.innerWidth - 400) : (window.innerWidth - 400);
  const sHeight = stageEl ? (stageEl.clientHeight || window.innerHeight) : window.innerHeight;
  const stageCenterStartX = sWidth / 2 - 100;
  const stageCenterStartY = sHeight / 2 + 100;

  if (item.type === 'wall') {
    if (item.offsetX !== undefined) return; // Już wyrwana
    let offsetX = 0, offsetY = 0, angle = 0;

    // Oblicz pozycję z computed3DData (aktualizowanej przez render)
    if (typeof computed3DData !== 'undefined') {
      const found3D = computed3DData.find(d => d.type === 'wall' && d.planIndex === index && d.quadIdx === undefined);
      if (found3D) {
        offsetX = found3D.cx;
        offsetY = found3D.cz;
        angle = found3D.angle || 0;
      }
    }

    item.offsetX = offsetX;
    item.offsetY = offsetY;
    item.freeAngle = angle;

    // Zamień poprzedni turn na jump, by nie zaburzać łańcucha
    // const prevItem = plan[index - 1];
    // if (prevItem && prevItem.type === 'turn') {
    //   plan[index - 1] = { type: 'jump', target: prevItem.prevNodeIndex || 0 };
    // }
  } else if (item.type === 'kantorek_1x1') {
    if (item.isFree) return;
    let offsetX = 0, offsetY = 0;
    if (typeof computed3DData !== 'undefined') {
      const found3D = computed3DData.find(d => d.type === 'kantorek_1x1' && d.planIndex === index);
      if (found3D) {
        offsetX = found3D.cx;
        offsetY = found3D.cz;
      }
    }
    item.offsetX = offsetX;
    item.offsetY = offsetY;
    item.isFree = true;

    // const prevItem = plan[index - 1];
    // if (prevItem && prevItem.type === 'turn') {
    //   plan[index - 1] = { type: 'jump', target: prevItem.prevNodeIndex || 0 };
    // }
  }
}
    // ─────────────────────────────────────────────────────────────────────────────
// 🔗 POMOCNIK: Końce dowolnej ściany (worldspace)
// Zwraca { x1,y1, x2,y2 } – start i koniec ściany (standardowej lub wolnej)
// ─────────────────────────────────────────────────────────────────────────────
function getWallEndpoints(index, item) {
  if (typeof getWallPositions === 'function') {
    const all = getWallPositions(plan);
    const pos = all.find(w => w.planIndex === index && w.quadIdx === undefined);
    if (pos) {
      return { x1: pos.startX, y1: pos.startY, x2: pos.endX, y2: pos.endY };
    }
  }
  return _wallEndpoints(item);
}

function _wallEndpoints(item) {
  const rad = ((item.freeAngle || 0) * Math.PI) / 180;
  const halfL = item.length / 2;
  const stage = document.getElementById('stage');
  const sWidth = stage ? (stage.clientWidth || window.innerWidth - 400) : (window.innerWidth - 400);
  const sHeight = stage ? (stage.clientHeight || window.innerHeight) : window.innerHeight;
  const stageCenterStartX = sWidth / 2 - 100;
  const stageCenterStartY = sHeight / 2 + 100;
  return {
    x1: stageCenterStartX + item.offsetX - halfL * Math.cos(rad),
    y1: stageCenterStartY + item.offsetY - halfL * Math.sin(rad),
    x2: stageCenterStartX + item.offsetX + halfL * Math.cos(rad),
    y2: stageCenterStartY + item.offsetY + halfL * Math.sin(rad),
  };
}

function getWallAngle(index, item) {
  if (item.offsetX !== undefined) {
    return ((item.freeAngle || 0) + 360) % 360;
  }
  if (typeof getWallPositions === 'function') {
    const all = getWallPositions(plan);
    const pos = all.find(w => w.planIndex === index && w.quadIdx === undefined);
    if (pos) {
      return ((pos.angle || 0) + 360) % 360;
    }
  }
  return 0;
}


function undo() {
  plan.pop();
  selectedItemIndex = null;
  if (typeof selectedItemIndices !== 'undefined') selectedItemIndices.clear();
  render();
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔓 WYRWANIE ŚCIANY Z ŁAŃCUCHA (detachWallFromChain)
// Zmienia ścianę z 'wall' w łańcuchu na 'freeWall' z własną pozycją i kątem.
// ─────────────────────────────────────────────────────────────────────────────
function detachElementFromChain(index) {
  const item = plan[index];
  if (!item) return;

  const stageEl = document.getElementById('stage');
  const sWidth = stageEl ? (stageEl.clientWidth || window.innerWidth - 400) : (window.innerWidth - 400);
  const sHeight = stageEl ? (stageEl.clientHeight || window.innerHeight) : window.innerHeight;
  const stageCenterStartX = sWidth / 2 - 100;
  const stageCenterStartY = sHeight / 2 + 100;

  if (item.type === 'wall') {
    if (item.offsetX !== undefined) return; // Już wyrwana
    let offsetX = 0, offsetY = 0, angle = 0;

    // Oblicz pozycję z computed3DData (aktualizowanej przez render)
    if (typeof computed3DData !== 'undefined') {
      const found3D = computed3DData.find(d => d.type === 'wall' && d.planIndex === index && d.quadIdx === undefined);
      if (found3D) {
        offsetX = found3D.cx;
        offsetY = found3D.cz;
        angle = found3D.angle || 0;
      }
    }

    item.offsetX = offsetX;
    item.offsetY = offsetY;
    item.freeAngle = angle;

    // Zamień poprzedni turn na jump, by nie zaburzać łańcucha
    // const prevItem = plan[index - 1];
    // if (prevItem && prevItem.type === 'turn') {
    //   plan[index - 1] = { type: 'jump', target: prevItem.prevNodeIndex || 0 };
    // }
  } else if (item.type === 'kantorek_1x1') {
    if (item.isFree) return;
    let offsetX = 0, offsetY = 0;
    if (typeof computed3DData !== 'undefined') {
      const found3D = computed3DData.find(d => d.type === 'kantorek_1x1' && d.planIndex === index);
      if (found3D) {
        offsetX = found3D.cx;
        offsetY = found3D.cz;
      }
    }
    item.offsetX = offsetX;
    item.offsetY = offsetY;
    item.isFree = true;

    // const prevItem = plan[index - 1];
    // if (prevItem && prevItem.type === 'turn') {
    //   plan[index - 1] = { type: 'jump', target: prevItem.prevNodeIndex || 0 };
    // }
  }
}



// ─────────────────────────────────────────────────────────────────────────────
// 🔗 AUTOMATYCZNE POŁĄCZENIE ZAZNACZONYCH ŚCIAN KOLINEARNYCH (MAGNES)
// ─────────────────────────────────────────────────────────────────────────────
function autoClipSelectedCollinear(indices) {
  const freeWalls = indices
    .map(idx => ({ idx, item: plan[idx] }))
    .filter(w => w.item && w.item.type === 'wall' && w.item.offsetX !== undefined);

  if (freeWalls.length < 2) return;

  const SNAP_THRESHOLD = 10; // 10cm

  for (let i = 0; i < freeWalls.length; i++) {
    const wA = freeWalls[i];
    for (let j = i + 1; j < freeWalls.length; j++) {
      const wB = freeWalls[j];
      
      const angleA = ((wA.item.freeAngle || 0) + 360) % 360;
      const angleB = ((wB.item.freeAngle || 0) + 360) % 360;
      let diff = Math.abs(angleA - angleB) % 360;
      if (diff > 180) diff = 360 - diff;

      // Jeśli pod tym samym kątem (kolinearnie)
      if (diff < 15 || Math.abs(diff - 180) < 15) {
        const epA = getWallEndpoints(wA.idx, wA.item);
        const epB = getWallEndpoints(wB.idx, wB.item);

        const pairs = [
          [epA.x2, epA.y2, epB.x1, epB.y1],
          [epA.x2, epA.y2, epB.x2, epB.y2],
          [epA.x1, epA.y1, epB.x1, epB.y1],
          [epA.x1, epA.y1, epB.x2, epB.y2],
        ];
        const minD = Math.min(...pairs.map(([ax, ay, bx, by]) => Math.hypot(ax - bx, ay - by)));

        if (minD <= SNAP_THRESHOLD) {
          _snapAndClipPair(wA.idx, wA.item, wB.idx, wB.item, true);
        }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔗 CLIPPING WIELU ŚCIAN (C) – każdą ścianę z selekcji łączy z NAJBLIŻSZĄ
// ─────────────────────────────────────────────────────────────────────────────
function clipSelectedWalls(indices) {
  if (!indices || indices.length < 1) return;

  const freeWalls = indices
    .map(idx => ({ idx, item: plan[idx] }))
    .filter(w => w.item && w.item.type === 'wall' && w.item.offsetX !== undefined);

  if (freeWalls.length === 0) return;

  freeWalls.forEach(({ idx: idxA, item: itemA }) => {
    let best = null, bestDist = Infinity;
    const epA = getWallEndpoints(idxA, itemA);

    if (typeof getWallPositions === 'function') {
      const allPositions = getWallPositions(plan);
      for (let wB of allPositions) {
        if (wB.planIndex === idxA) continue;
        
        const pairs = [
          [epA.x2, epA.y2, wB.startX, wB.startY],
          [epA.x2, epA.y2, wB.endX, wB.endY],
          [epA.x1, epA.y1, wB.startX, wB.startY],
          [epA.x1, epA.y1, wB.endX, wB.endY],
        ];
        pairs.forEach(([ax, ay, bx, by]) => {
          const d = Math.hypot(ax - bx, ay - by);
          if (d < bestDist) {
            bestDist = d;
            best = { idx: wB.planIndex, item: plan[wB.planIndex] };
          }
        });
      }
    }

    if (best !== null) {
      _snapAndClipPair(idxA, itemA, best.idx, best.item, true);
    }
  });
  render();
}

function _autoClipProximity(movedIdx) {
  const movedItem = plan[movedIdx];
  if (!movedItem || movedItem.offsetX === undefined) return;

  const SNAP_THRESHOLD = 10;
  let bestDist = SNAP_THRESHOLD;
  let bestOtherIdx = null;

  const epMoved = getWallEndpoints(movedIdx, movedItem);

  if (typeof getWallPositions === 'function') {
    const allPositions = getWallPositions(plan);
    for (let wB of allPositions) {
      if (wB.planIndex === movedIdx) continue;
      
      const pairs = [
        [epMoved.x2, epMoved.y2, wB.startX, wB.startY],
        [epMoved.x2, epMoved.y2, wB.endX, wB.endY],
        [epMoved.x1, epMoved.y1, wB.startX, wB.startY],
        [epMoved.x1, epMoved.y1, wB.endX, wB.endY],
      ];
      const minPairDist = Math.min(...pairs.map(([ax, ay, bx, by]) => Math.hypot(ax - bx, ay - by)));
      if (minPairDist < bestDist) {
        bestDist = minPairDist;
        bestOtherIdx = wB.planIndex;
      }
    }
  }

  if (bestOtherIdx !== null) {
    _snapAndClipPair(movedIdx, movedItem, bestOtherIdx, plan[bestOtherIdx], false);
  }
}

function _snapAndClipPair(idxA, itemA, idxB, itemB, forceClip) {
  // We want itemB to be the free wall that is repositioned.
  // If B is standard, we must swap.
  // If both are free walls, A is the moved wall, so we want B to be the moved wall A (meaning we swap).
  const isAfree = (itemA.offsetX !== undefined);
  const isBfree = (itemB.offsetX !== undefined);
  
  if (!isBfree || (isAfree && isBfree)) {
    const tempIdx = idxA; idxA = idxB; idxB = tempIdx;
    const tempItem = itemA; itemA = itemB; itemB = tempItem;
  }

  console.log('DEBUG _snapAndClipPair START:', {
    original_idxA: idxB, original_idxB: idxA, // since swapped
    idxA, idxB,
    itemA_type: itemA.type, itemA_free: (itemA.offsetX !== undefined),
    itemB_type: itemB.type, itemB_free: (itemB.offsetX !== undefined),
    itemA_offsetX: itemA.offsetX, itemA_offsetY: itemA.offsetY,
    itemB_offsetX: itemB.offsetX, itemB_offsetY: itemB.offsetY,
  });

  const stage = document.getElementById('stage');
  const sWidth = stage ? (stage.clientWidth || window.innerWidth - 400) : (window.innerWidth - 400);
  const sHeight = stage ? (stage.clientHeight || window.innerHeight) : window.innerHeight;
  const stageCenterStartX = sWidth / 2 - 100;
  const stageCenterStartY = sHeight / 2 + 100;

  const THRESHOLD = 10;
  const angleA = getWallAngle(idxA, itemA);
  const angleB = getWallAngle(idxB, itemB);

  let diff = Math.abs(angleA - angleB) % 360;
  if (diff > 180) diff = 360 - diff;

  const epA = getWallEndpoints(idxA, itemA);
  const thick = (itemA.thickness || 12);
  const halfThick = thick / 2;

  if (diff < 15 || Math.abs(diff - 180) < 15) {
    // 180 degrees (collinear) - snap end-to-end with 0.2px (2mm) gap and align angle
    if (diff < 15) {
      itemB.freeAngle = angleA;
    } else {
      itemB.freeAngle = (angleA + 180) % 360;
    }
    const alignedAngleB = ((itemB.freeAngle || 0) + 360) % 360;

    // Recalculate B endpoints with aligned angle (ABSOLUTE coords)
    const epB_new = {
      x1: stageCenterStartX + itemB.offsetX - (itemB.length / 2) * Math.cos(alignedAngleB * Math.PI / 180),
      y1: stageCenterStartY + itemB.offsetY - (itemB.length / 2) * Math.sin(alignedAngleB * Math.PI / 180),
      x2: stageCenterStartX + itemB.offsetX + (itemB.length / 2) * Math.cos(alignedAngleB * Math.PI / 180),
      y2: stageCenterStartY + itemB.offsetY + (itemB.length / 2) * Math.sin(alignedAngleB * Math.PI / 180),
    };

    const candA = [epA.x1, epA.y1, epA.x2, epA.y2];
    const candB = [epB_new.x1, epB_new.y1, epB_new.x2, epB_new.y2];
    let bestD = Infinity, bestAisFar = false, bestBisFar = false;
    for (let ai = 0; ai < 2; ai++) {
      for (let bi = 0; bi < 2; bi++) {
        const ax = ai === 0 ? epA.x1 : epA.x2, ay = ai === 0 ? epA.y1 : epA.y2;
        const bx = bi === 0 ? epB_new.x1 : epB_new.x2, by = bi === 0 ? epB_new.y1 : epB_new.y2;
        const d = Math.hypot(ax - bx, ay - by);
        if (d < bestD) { bestD = d; bestAisFar = (ai === 1); bestBisFar = (bi === 0); }
      }
    }
    if (!forceClip && bestD > THRESHOLD) return;

    const baseX = bestAisFar ? epA.x2 : epA.x1;
    const baseY = bestAisFar ? epA.y2 : epA.y1;
    const signB = bestBisFar ? 1 : -1;
    const radB = alignedAngleB * Math.PI / 180;
    const gapX = 0.2 * Math.cos(radB);
    const gapY = 0.2 * Math.sin(radB);
    
    console.log('DEBUG _snapAndClipPair COLLINEAR PRE:', {
      baseX, baseY, signB, radB, gapX, gapY, stageCenterStartX, stageCenterStartY,
      epA, epB_new
    });

    itemB.offsetX = baseX + gapX + signB * (itemB.length / 2) * Math.cos(radB) - stageCenterStartX;
    itemB.offsetY = baseY + gapY + signB * (itemB.length / 2) * Math.sin(radB) - stageCenterStartY;

    console.log('DEBUG _snapAndClipPair COLLINEAR POST:', {
      new_offsetX: itemB.offsetX, new_offsetY: itemB.offsetY
    });

    if (itemA._collinearWith !== undefined && itemA._collinearWith !== idxB) {
      const oldCol = plan[itemA._collinearWith];
      if (oldCol) delete oldCol._collinearWith;
    }
    if (itemB._collinearWith !== undefined && itemB._collinearWith !== idxA) {
      const oldCol = plan[itemB._collinearWith];
      if (oldCol) delete oldCol._collinearWith;
    }
    itemA._collinearWith = idxB;
    itemB._collinearWith = idxA;
    if (itemA._cornerWith === idxB) {
      delete itemA._cornerWith; delete itemA._clipCornerX; delete itemA._clipCornerY; delete itemA._cornerType;
    }
    if (itemB._cornerWith === idxA) {
      delete itemB._cornerWith; delete itemB._clipCornerX; delete itemB._clipCornerY; delete itemB._cornerType;
    }
  } else if (diff > 75 && diff < 105) {
    const epB = getWallEndpoints(idxB, itemB);
    const pairList = [
      { ai: 1, bi: 0, ax: epA.x2, ay: epA.y2, bx: epB.x1, by: epB.y1 },
      { ai: 1, bi: 1, ax: epA.x2, ay: epA.y2, bx: epB.x2, by: epB.y2 },
      { ai: 0, bi: 0, ax: epA.x1, ay: epA.y1, bx: epB.x1, by: epB.y1 },
      { ai: 0, bi: 1, ax: epA.x1, ay: epA.y1, bx: epB.x2, by: epB.y2 },
    ];
    let bestPair = pairList[0], bestPairDist = Infinity;
    pairList.forEach(p => {
      const d = Math.hypot(p.ax - p.bx, p.ay - p.by);
      if (d < bestPairDist) { bestPairDist = d; bestPair = p; }
    });
    if (!forceClip && bestPairDist > THRESHOLD) return;

    let cornerType = itemA._cornerType || itemB._cornerType || 'zew-zew';
    if (typeof currentSystem !== 'undefined') {
      if (currentSystem === 'foldable' && cornerType === 'zew-zew') cornerType = 'wew-zew-1';
      if (currentSystem === 'multiframe') cornerType = 'cube';
    }

    const cornerX = bestPair.ax;
    const cornerY = bestPair.ay;
    const radA = angleA * Math.PI / 180;
    const radB = angleB * Math.PI / 180;
    const signA = bestPair.ai === 1 ? 1 : -1;
    const signB = bestPair.bi === 0 ? -1 : 1;

    let dxA = 0, dyA = 0, dxB = 0, dyB = 0;
    if (cornerType === 'zew-zew') {
      dxB = -halfThick * signA * Math.cos(radB); dyB = -halfThick * signA * Math.sin(radB);
      dxA = -halfThick * signB * Math.cos(radA); dyA = -halfThick * signB * Math.sin(radA);
    } else if (cornerType === 'wew-zew-1') {
      dxB = -halfThick * signA * Math.cos(radB); dyB = -halfThick * signA * Math.sin(radB);
      dxA =  halfThick * signB * Math.cos(radA); dyA =  halfThick * signB * Math.sin(radA);
    } else if (cornerType === 'wew-zew-2') {
      dxB =  halfThick * signA * Math.cos(radB); dyB =  halfThick * signA * Math.sin(radB);
      dxA = -halfThick * signB * Math.cos(radA); dyA = -halfThick * signB * Math.sin(radA);
    }

    const cx = cornerX + dxA + dxB;
    const cy = cornerY + dyA + dyB;

    console.log('DEBUG _snapAndClipPair 90 PRE:', {
      cornerX, cornerY, radA, radB, signA, signB, dxA, dyA, dxB, dyB, cx, cy, stageCenterStartX, stageCenterStartY
    });

    if (itemA.offsetX !== undefined) {
      itemA.offsetX = cx - signA * (itemA.length / 2) * Math.cos(radA) - dxA - stageCenterStartX;
      itemA.offsetY = cy - signA * (itemA.length / 2) * Math.sin(radA) - dyA - stageCenterStartY;
    }
    if (itemB.offsetX !== undefined) {
      itemB.offsetX = cx - signB * (itemB.length / 2) * Math.cos(radB) - dxB - stageCenterStartX;
      itemB.offsetY = cy - signB * (itemB.length / 2) * Math.sin(radB) - dyB - stageCenterStartY;
    }

    console.log('DEBUG _snapAndClipPair 90 POST:', {
      itemA_offsetX: itemA.offsetX, itemA_offsetY: itemA.offsetY,
      itemB_offsetX: itemB.offsetX, itemB_offsetY: itemB.offsetY
    });

    if (itemA._cornerWith !== undefined && itemA._cornerWith !== idxB) {
      const oldPartner = plan[itemA._cornerWith];
      if (oldPartner) {
        delete oldPartner._cornerWith;
        delete oldPartner._clipCornerX;
        delete oldPartner._clipCornerY;
        delete oldPartner._cornerType;
      }
    }
    if (itemB._cornerWith !== undefined && itemB._cornerWith !== idxA) {
      const oldPartner = plan[itemB._cornerWith];
      if (oldPartner) {
        delete oldPartner._cornerWith;
        delete oldPartner._clipCornerX;
        delete oldPartner._clipCornerY;
        delete oldPartner._cornerType;
      }
    }
    if (itemA._collinearWith !== undefined && itemA._collinearWith !== idxB) {
      const oldCol = plan[itemA._collinearWith];
      if (oldCol) delete oldCol._collinearWith;
    }
    if (itemB._collinearWith !== undefined && itemB._collinearWith !== idxA) {
      const oldCol = plan[itemB._collinearWith];
      if (oldCol) delete oldCol._collinearWith;
    }

    itemA._clipCornerX = cx; itemA._clipCornerY = cy;
    itemB._clipCornerX = cx; itemB._clipCornerY = cy;
    itemA._cornerWith = idxB; itemA._cornerType = cornerType;
    itemB._cornerWith = idxA; itemB._cornerType = cornerType;
    if (itemA._collinearWith === idxB) delete itemA._collinearWith;
    if (itemB._collinearWith === idxA) delete itemB._collinearWith;
  }
}

function cycleClipCornerType(idxA, idxB) {
  const itemA = plan[idxA];
  const itemB = plan[idxB];
  if (!itemA || !itemB) return;

  const typeOrder = (typeof currentSystem !== 'undefined' && currentSystem === 'foldable')
    ? ['wew-zew-1', 'wew-zew-2']
    : (currentSystem === 'multiframe' ? ['cube'] : ['zew-zew', 'wew-zew-1', 'wew-zew-2']);

  const current = (itemA._cornerType || 'zew-zew');
  const nextIdx = (typeOrder.indexOf(current) + 1) % typeOrder.length;
  const next = typeOrder[nextIdx];

  // Ustaw nowy typ i ponownie zastosuj clip
  itemA._cornerType = next;
  itemB._cornerType = next;
  _snapAndClipPair(idxA, itemA, idxB, itemB, true);
  render();
}

function magnetPull() {
  const freeWallIndices = plan
    .map((item, idx) => ({ item, idx }))
    .filter(o => o.item && o.item.type === 'wall' && o.item.offsetX !== undefined);

  if (freeWallIndices.length === 0) return;

  // Sort from left to right by offsetX
  freeWallIndices.sort((a, b) => a.item.offsetX - b.item.offsetX);

  for (let i = 0; i < freeWallIndices.length; i++) {
    const wA = freeWallIndices[i];

    if (typeof getWallPositions !== 'function') break;
    const allPositions = getWallPositions(plan);

    const epA = getWallEndpoints(wA.idx, wA.item);
    const angleA = ((wA.item.freeAngle || 0) + 360) % 360;

    let bestOther = null;
    let bestDist = Infinity;

    for (let wB of allPositions) {
      if (wB.planIndex === wA.idx) continue;

      const pairs = [
        [epA.x2, epA.y2, wB.startX, wB.startY],
        [epA.x2, epA.y2, wB.endX, wB.endY],
        [epA.x1, epA.y1, wB.startX, wB.startY],
        [epA.x1, epA.y1, wB.endX, wB.endY],
      ];
      const minD = Math.min(...pairs.map(([ax, ay, bx, by]) => Math.hypot(ax - bx, ay - by)));
      if (minD < bestDist) {
        bestDist = minD;
        bestOther = wB;
      }
    }

    if (bestOther) {
      const angleB = ((bestOther.angle || 0) + 360) % 360;
      let diff = Math.abs(angleA - angleB) % 360;
      if (diff > 180) diff = 360 - diff;

      if (diff < 45 || Math.abs(diff - 180) < 45) {
        // Snap collinear
        if (diff < 45) {
          wA.item.freeAngle = angleB;
        } else {
          wA.item.freeAngle = (angleB + 180) % 360;
        }
      } else {
        // Snap 90 degrees
        const option1 = (angleB + 90) % 360;
        const option2 = (angleB - 90 + 360) % 360;
        let diff1 = Math.abs(angleA - option1) % 360; if (diff1 > 180) diff1 = 360 - diff1;
        let diff2 = Math.abs(angleA - option2) % 360; if (diff2 > 180) diff2 = 360 - diff2;
        if (diff1 < diff2) {
          wA.item.freeAngle = option1;
        } else {
          wA.item.freeAngle = option2;
        }
      }

      _snapAndClipPair(wA.idx, wA.item, bestOther.planIndex, plan[bestOther.planIndex], true);
    }
  }

  render();
}
window.magnetPull = magnetPull;


function deselectItem(e) {
  if (e.target.id === 'stage' && !isDraggingView) {

    const stage = document.getElementById('stage');
    const rect = stage ? stage.getBoundingClientRect() : { left: 0, top: 0 };
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const localX = (clickX - viewPanX) / viewScale;
    const localY = (clickY - viewPanY) / viewScale;
    const sWidth = stage ? (stage.clientWidth || window.innerWidth - 400) : (window.innerWidth - 400);
    const sHeight = stage ? (stage.clientHeight || window.innerHeight) : window.innerHeight;
    const stageCenterStartX = sWidth / 2 - 100;
    const stageCenterStartY = sHeight / 2 + 100;

    // ── TRYB PRZESUWANIA (M): kliknięcie = umieść wszystkie zaznaczone elementy ──
    if (typeof isMoveMode !== 'undefined' && isMoveMode) {
      const dx = localX - stageCenterStartX;
      const dy = localY - stageCenterStartY;

      // Snap do siatki metrycznej (100px = 100cm, próg 10px)
      const SNAP_THRESHOLD = 10;
      const GRID_SIZE = 100;
      let snappedDx = dx;
      let snappedDy = dy;
      const modX = ((dx % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
      const modY = ((dy % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
      if (modX < SNAP_THRESHOLD || modX > GRID_SIZE - SNAP_THRESHOLD) {
        snappedDx = Math.round(dx / GRID_SIZE) * GRID_SIZE;
      }
      if (modY < SNAP_THRESHOLD || modY > GRID_SIZE - SNAP_THRESHOLD) {
        snappedDy = Math.round(dy / GRID_SIZE) * GRID_SIZE;
      }

      // Przesuń wszystkie zaznaczone elementy
      const activeIndices = new Set(typeof selectedItemIndices !== 'undefined' ? selectedItemIndices : []);
      if (typeof selectedItemIndex !== 'undefined' && selectedItemIndex !== null) activeIndices.add(selectedItemIndex);

      // Oblicz offset od pierwszego elementu do kursora
      const movers = Array.from(activeIndices).filter(idx => plan[idx] && plan[idx].offsetX !== undefined);
      if (movers.length > 0) {
        const firstItem = plan[movers[0]];
        const baseOffX = snappedDx - (firstItem.offsetX || 0);
        const baseOffY = snappedDy - (firstItem.offsetY || 0);
        movers.forEach(idx => {
          plan[idx].offsetX = (plan[idx].offsetX || 0) + baseOffX;
          plan[idx].offsetY = (plan[idx].offsetY || 0) + baseOffY;
        });

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

        // Automatyczny clipping zbliżeniowy po umieszczeniu (każda ściana do najbliższej)
        const collinearClipped = new Set();
        movers.forEach(idx => {
          const item = plan[idx];
          if (!item || item.type !== 'wall' || item.offsetX === undefined) return;

          const SNAP_THRESHOLD = 10;
          let bestOtherIdx = null;
          let bestDist = SNAP_THRESHOLD;
          const angleA = ((item.freeAngle || 0) + 360) % 360;
          const epA = getWallEndpoints(idx, item);

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
            _snapAndClipPair(idx, item, bestOtherIdx, plan[bestOtherIdx], true);
            collinearClipped.add(idx);
            collinearClipped.add(bestOtherIdx);
          }
        });

        movers.forEach(idx => {
          if (!collinearClipped.has(idx)) {
            if (typeof _autoClipProximity === 'function') _autoClipProximity(idx);
          }
        });

      }

      // Wyjdź z trybu M
      isMoveMode = false;
      moveModeTargets = [];
      if (stage) stage.classList.remove('move-mode');
      render();
      return;
    }

    // ── NORMALNE KLIKNIĘCIE: usuń zaznaczenie ──────────────────────────────────
    selectedItemIndex = null;
    if (typeof selectedItemIndices !== 'undefined') selectedItemIndices.clear();

    const dx = localX - stageCenterStartX;
    const dy = localY - stageCenterStartY;
    const snappedDx = Math.round(dx / 50) * 50;
    const snappedDy = Math.round(dy / 50) * 50;
    const snappedX = stageCenterStartX + snappedDx;
    const snappedY = stageCenterStartY + snappedDy;
    const currentAngle = window.currentCursorAngle !== undefined ? window.currentCursorAngle : 0;

    if (plan.length > 0 && plan[plan.length - 1].type === 'jump' && plan[plan.length - 1].x !== undefined) {
      plan[plan.length - 1].x = snappedX;
      plan[plan.length - 1].y = snappedY;
      plan[plan.length - 1].angle = currentAngle;
    } else {
      plan.push({
        type: 'jump',
        x: snappedX,
        y: snappedY,
        angle: currentAngle
      });
    }
    render();
  }
}





function clearPlan() {
  plan = [];
  selectedItemIndex = null;
  manualItems = {}; // 👈 Czyści zawartość koszyka
  lastSystemForManual = null; // Wymusza przerysowanie przycisków
  render();
}

function jumpTo(nodeIndex) {
  plan.push({ type: 'jump', target: nodeIndex });
  selectedItemIndex = null;
  if (typeof selectedItemIndices !== 'undefined') selectedItemIndices.clear();
  render();
}

function createJoint(layer, x, y, nodeIndex) {
  let joint = document.createElement('div'); joint.className = 'sego-joint'; joint.style.left = x + 'px'; joint.style.top = y + 'px';
  joint.onclick = (e) => { e.stopPropagation(); jumpTo(nodeIndex); }; layer.appendChild(joint);
}

function toggleWallFlip(index, e) {
  if (e) e.stopPropagation();
  // Przełączamy flagę isFlipped dla pojedynczej ściany
  plan[index].isFlipped = !plan[index].isFlipped;
  render(); // Odświeżamy widok
}

function autoFrameForScreenshot(angleDeg = -30) {
  if (!sceneObjects || sceneObjects.length === 0) return null;

  const box = new THREE.Box3();
  let hasValidObjects = false;

  sceneObjects.forEach(obj => {
    // IGNORUJEMY SIATKI! Jeśli coś jest większe niż 30 metrów (3000 jednostek), kamera to ignoruje.
    const tBox = new THREE.Box3().setFromObject(obj);
    const tSize = tBox.getSize(new THREE.Vector3());
    if (tSize.x > 3000 || tSize.z > 3000) return;

    if (obj.type === 'GridHelper') return;

    box.expandByObject(obj);
    hasValidObjects = true;
  });

  if (!hasValidObjects) return null;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const fov = camera.fov * (Math.PI / 180);

  // Wpisanie stoiska w kulę, by zawsze mieściło się od lewej do prawej
  const sphereRadius = size.length() / 2;
  let cameraDist = Math.abs(sphereRadius / Math.sin(fov / 2)) * 1.05; // 5% marginesu ochronnego

  if (cameraDist < 250) cameraDist = 250; // Zabezpieczenie przed uderzeniem w ścianę

  const rad = angleDeg * Math.PI / 180;
  camera.position.set(
    center.x + Math.sin(rad) * cameraDist,
    center.y + (size.y * 0.4),
    center.z + Math.cos(rad) * cameraDist
  );

  controls.target.copy(center);
  camera.lookAt(center);
  controls.update();
  renderer.render(scene, camera);

  return renderer.domElement.toDataURL('image/jpeg', 0.95);
}

function captureManualScreenshots() {
  return new Promise((resolve, reject) => {
    const ui = document.getElementById('manualScreenshotUI');
    const btnTake = document.getElementById('btnTakeScreenshot');
    const btnCancel = document.getElementById('btnCancelScreenshot');
    const text = document.getElementById('manualScreenshotText');

    let manualImages = [];
    ui.style.display = 'block';
    text.innerText = "Ustaw kamerę w widoku 3D i zrób pierwsze zdjęcie.";
    btnTake.innerText = "Zrób rzut 1";

    // Upewniamy się, że jesteśmy w trybie 3D
    if (!is3DMode) {
      const container3D = document.getElementById('stage3DContainer');
      is3DMode = true; container3D.style.display = 'block'; container3D.style.opacity = '1';
      if (typeof scene === 'undefined' || !scene) init3D();
      renderer.setSize(container3D.clientWidth, container3D.clientHeight);
    }

    const takeHandler = () => {
      // Wymuszamy render klatki przed zrobieniem zdjęcia żeby uniknąć czarnego ekranu na niektórych urządzeniach
      if (typeof render === 'function') render();
      const imgData = renderer.domElement.toDataURL('image/jpeg', 0.95);
      manualImages.push(imgData);

      if (manualImages.length === 1) {
        text.innerText = "Świetnie! Teraz ustaw kamerę i zrób drugie zdjęcie.";
        btnTake.innerText = "Zrób rzut 2";
      } else if (manualImages.length === 2) {
        cleanup();
        resolve(manualImages);
      }
    };

    const cancelHandler = () => {
      cleanup();
      reject("User cancelled manual screenshot");
    };

    const cleanup = () => {
      ui.style.display = 'none';
      btnTake.removeEventListener('click', takeHandler);
      btnCancel.removeEventListener('click', cancelHandler);
    };

    btnTake.addEventListener('click', takeHandler);
    btnCancel.addEventListener('click', cancelHandler);
  });
}

function changeMframeItem(id, delta) {
  const item = mframePalletData.items.find(i => i.id === id);
  if (item) {
    item.count = Math.max(0, item.count + delta);
    document.getElementById('mframe-qty-' + id).value = item.count;
    updateMframeStats();
    if (typeof render === 'function') render();
  }
}

function setMframeItem(id, val) {
  const item = mframePalletData.items.find(i => i.id === id);
  if (item) {
    item.count = Math.max(0, parseInt(val) || 0);
    document.getElementById('mframe-qty-' + id).value = item.count;
    updateMframeStats();
    if (typeof render === 'function') render();
  }
}

function updateMframeStats() {
  let allFrames = [];
  mframePalletData.items.forEach(item => {
    for (let i = 0; i < item.count; i++) {
      allFrames.push({ width: item.width, height: item.height, id: item.id, weight: item.weight });
    }
  });

  // Funkcja pomocnicza do pakowania jednej palety
  function packOnePallet(frames) {
    let items = JSON.parse(JSON.stringify(frames));
    items.sort((a, b) => {
      if (a.width !== b.width) return a.width - b.width;
      return b.height - a.height;
    });

    // Nesting (gniazdowanie)
    for (let i = 0; i < items.length; i++) {
      let outer = items[i];
      if (outer.nested) continue;
      let innerW = outer.width - 12.5;
      let innerH = outer.height - 12.5;
      for (let j = items.length - 1; j > i; j--) {
        let inner = items[j];
        if (inner.nested) continue;
        if (inner.width <= innerW && inner.height <= innerH) {
          inner.nested = true;
          outer.nestedChild = { ...inner, rotated: false };
          break;
        }
        if (inner.height <= innerW && inner.width <= innerH) {
          inner.nested = true;
          outer.nestedChild = { ...inner, rotated: true };
          break;
        }
      }
    }

    let layoutItems = items.filter(item => !item.nested);
    let layers = [];
    while (layoutItems.length > 0) {
      let layer = { items: [] };
      let usedZ = 0;
      while (layoutItems.length > 0) {
        let firstInRow = layoutItems[0];
        let colWidth = firstInRow.width;

        // Limit szerokości (depth 120cm)
        if (usedZ + colWidth > mframePalletData.palletDepth) break;

        let usedX = 0;
        let i = 0;
        while (i < layoutItems.length) {
          let item = layoutItems[i];
          // Pozwól na wystawanie na długość (270cm) tylko dla pierwszego elementu w rzędzie
          const fitsX = (usedX === 0) || (usedX + item.height <= mframePalletData.palletWidth);
          if (item.width === colWidth && fitsX) {
            layoutItems.splice(i, 1);
            layer.items.push({ ...item, posX: usedX + item.height / 2, posZ: usedZ + colWidth / 2 });
            usedX += item.height;
          } else { i++; }
        }
        usedZ += colWidth + 5;
      }
      layers.push(layer);
    }

    let weight = mframePalletData.palletWeight + frames.reduce((sum, f) => sum + f.weight, 0);
    let height = mframePalletData.palletHeight + (layers.length * mframePalletData.profileDepth);
    return { layers, weight, height };
  }

  // Próba podziału na N palet (podział po równo)
  function tryDistribution(n) {
    let pList = Array.from({ length: n }, () => []);
    allFrames.forEach((f, idx) => pList[idx % n].push(f));
    let results = pList.map(p => packOnePallet(p));
    let exceeds = results.some(r => r.weight > 850 || r.height > 200);
    return { results, exceeds };
  }

  let dist = tryDistribution(1);
  if (dist.exceeds && allFrames.length > 0) {
    dist = tryDistribution(2);
    if (dist.exceeds) {
      dist = tryDistribution(3);
    }
  }

  mframePalletData.pallets = dist.results;

  // Aktualizacja statystyk w UI
  let totalWeight = dist.results.reduce((sum, r) => sum + r.weight, 0);
  let maxHeight = 0;
  let globalMaxL = 270, globalMaxW = 120;

  dist.results.forEach(p => {
    maxHeight = Math.max(maxHeight, p.height);
    let pMinX = -135, pMaxX = 135, pMinZ = -60, pMaxZ = 60;
    p.layers.forEach(l => {
      l.items.forEach(item => {
        const x = item.posX - 135;
        const z = item.posZ - 60;
        pMinX = Math.min(pMinX, x - item.height / 2);
        pMaxX = Math.max(pMaxX, x + item.height / 2);
        pMinZ = Math.min(pMinZ, z - item.width / 2);
        pMaxZ = Math.max(pMaxZ, z + item.width / 2);
      });
    });
    globalMaxL = Math.max(globalMaxL, pMaxX - pMinX);
    globalMaxW = Math.max(globalMaxW, pMaxZ - pMinZ);
  });

  const elWeight = document.getElementById('mframe-total-weight');
  const elLayers = document.getElementById('mframe-total-layers');
  const elHeight = document.getElementById('mframe-total-height');

  if (elWeight) elWeight.innerText = totalWeight.toFixed(1) + " kg (" + dist.results.length + " pal.)";
  if (elLayers) elLayers.innerText = dist.results.reduce((sum, r) => sum + r.layers.length, 0);
  if (elHeight) {
    elHeight.innerHTML = `H: ${maxHeight.toFixed(1)} cm<br>L: ${globalMaxL.toFixed(1)} cm | W: ${globalMaxW.toFixed(1)} cm`;
    elHeight.style.height = "auto";
    elHeight.style.display = "block";
  }
}

function drawMframePalletScene() {
  const pW = 270;
  const pD = 120;
  const pH = 15;
  const palletGap = 50;
  const stepX = pW + palletGap;

  const loader = new THREE.TextureLoader();
  const woodTex = loader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.repeat.set(2, 2);
  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 1.0, metalness: 0.0 });

  if (!mframePalletData.pallets) return;

  const matFrame = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.2, roughness: 0.5 });
  const profileCache = new Map();

  function getProfileGeometry(L, depth, thickness) {
    const key = `${L}-${depth}-${thickness}`;
    if (profileCache.has(key)) return profileCache.get(key);
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(L, 0); shape.lineTo(L, depth); shape.lineTo(0, depth); shape.lineTo(0, 0);
    for (let x = 3.1; x <= L - 3.1; x += 6.2) {
      const holePath = new THREE.Path();
      holePath.absarc(x, depth / 2, 1.5, 0, Math.PI * 2, true);
      shape.holes.push(holePath);
    }
    const geom = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    geom.translate(-L / 2, -depth / 2, -thickness / 2);
    profileCache.set(key, geom);
    return geom;
  }

  mframePalletData.pallets.forEach((pallet, pIdx) => {
    const offsetX = pIdx * stepX;
    const groupPallet = new THREE.Group();

    // Podstawa palety
    const beamW = 10;
    const beamH = 10;
    [-50, 0, 50].forEach(z => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(pW, beamH, beamW), woodMat);
      beam.position.set(0, beamH / 2, z);
      groupPallet.add(beam);
    });
    const support = new THREE.Mesh(new THREE.BoxGeometry(beamW, beamH, pD), woodMat);
    support.position.set(0, beamH / 2, 0);
    groupPallet.add(support);
    const boardW = 20;
    const boardH = 5;
    [-50, -25, 0, 25, 50].forEach(z => {
      const board = new THREE.Mesh(new THREE.BoxGeometry(pW, boardH, boardW), woodMat);
      board.position.set(0, beamH + boardH / 2, z);
      groupPallet.add(board);
    });

    // --- WARSTWY RAM ---
    let currentY = pH;
    let minX = -135, maxX = 135;
    let minZ = -60, maxZ = 60;

    pallet.layers.forEach((layer) => {
      layer.items.forEach(frame => {
        const fw = frame.height;
        const fd = frame.width;
        const ft = 6.2;
        const fprof = 5.5;

        const group = new THREE.Group();
        const addProfile = (target, L, d, t, px, py, pz, ry = 0) => {
          const geom = getProfileGeometry(L, d, t);
          const mesh = new THREE.Mesh(geom, matFrame);
          mesh.position.set(px, py, pz);
          mesh.rotation.y = ry;
          const e = new THREE.EdgesGeometry(geom);
          mesh.add(new THREE.LineSegments(e, new THREE.LineBasicMaterial({ color: 0x555555 })));
          target.add(mesh);
        };

        addProfile(group, fw, ft, fprof, 0, 0, -fd / 2 + fprof / 2);
        addProfile(group, fw, ft, fprof, 0, 0, fd / 2 - fprof / 2);
        addProfile(group, fd - 2 * fprof, ft, fprof, -fw / 2 + fprof / 2, 0, 0, Math.PI / 2);
        addProfile(group, fd - 2 * fprof, ft, fprof, fw / 2 - fprof / 2, 0, 0, Math.PI / 2);

        if (frame.nestedChild) {
          const child = frame.nestedChild;
          const cfw = child.rotated ? child.width : child.height;
          const cfd = child.rotated ? child.height : child.width;
          const cry = child.rotated ? Math.PI / 2 : 0;
          const cGroup = new THREE.Group();
          addProfile(cGroup, cfw, ft, fprof, 0, 0, -cfd / 2 + fprof / 2);
          addProfile(cGroup, cfw, ft, fprof, 0, 0, cfd / 2 - fprof / 2);
          addProfile(cGroup, cfd - 2 * fprof, ft, fprof, -cfw / 2 + fprof / 2, 0, 0, Math.PI / 2);
          addProfile(cGroup, cfd - 2 * fprof, ft, fprof, cfw / 2 - fprof / 2, 0, 0, Math.PI / 2);
          cGroup.rotation.y = cry;
          group.add(cGroup);
        }

        const realPosX = frame.posX - 135;
        const realPosZ = frame.posZ - 60;
        group.position.set(realPosX, currentY + ft / 2, realPosZ);
        groupPallet.add(group);

        minX = Math.min(minX, realPosX - fw / 2);
        maxX = Math.max(maxX, realPosX + fw / 2);
        minZ = Math.min(minZ, realPosZ - fd / 2);
        maxZ = Math.max(maxZ, realPosZ + fd / 2);
      });
      currentY += 6.2;
    });

    groupPallet.position.x = offsetX;
    scene.add(groupPallet);
    sceneObjects.push(groupPallet);

    // MIAREK
    const drawRuler = (p1, p2, label) => {
      const material = new THREE.LineBasicMaterial({ color: 0x00d2ff });
      const points = [new THREE.Vector3(p1.x, p1.y, p1.z), new THREE.Vector3(p2.x, p2.y, p2.z)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      groupPallet.add(new THREE.Line(geometry, material));
      const sprite = createTextSprite(label, "#00d2ff", 32);
      sprite.position.addVectors(p1, p2).multiplyScalar(0.5);
      sprite.position.y += 15;
      groupPallet.add(sprite);
    };

    drawRuler({ x: minX, y: 5, z: maxZ + 20 }, { x: maxX, y: 5, z: maxZ + 20 }, `L: ${(maxX - minX).toFixed(1)} cm`);
    drawRuler({ x: maxX + 20, y: 5, z: minZ }, { x: maxX + 20, y: 5, z: maxZ }, `W: ${(maxZ - minZ).toFixed(1)} cm`);
    drawRuler({ x: minX - 20, y: 0, z: minZ - 20 }, { x: minX - 20, y: currentY, z: minZ - 20 }, `H: ${currentY.toFixed(1)} cm`);
  });
}

function updateWallEmissive() {
  if (typeof scene !== 'undefined' && scene) {
    scene.traverse(function (child) {
      if (child.isMesh && child.material) {
        // Tworzymy tablicę, bo ściany składają się z 6 różnych materiałów
        let mats = Array.isArray(child.material) ? child.material : [child.material];

        mats.forEach(mat => {
          if (mat.name === 'led_print') {
            mat.emissive = new THREE.Color(0xffffff);
            mat.emissiveIntensity = isNightMode ? 1.2 : 0.8;
            if (mat.map && !mat.emissiveMap) {
              mat.emissiveMap = mat.map;
            }
            mat.needsUpdate = true;
          } else if (mat.map) { // Świecą tylko te strony, które mają nałożoną grafikę!
            if (isNightMode) {
              mat.emissive = new THREE.Color(0xffffff);
              mat.emissiveIntensity = 0.45;
            } else {
              mat.emissive = new THREE.Color(0x000000);
              mat.emissiveIntensity = 0;
            }
            mat.needsUpdate = true;
          }
        });
      }
    });
  }
}

function createQuadBackground(scene, textureUrls, radius = 2000, height = 1000) {
  // 1. Usuwamy stare tło
  const existingBg = scene.getObjectByName('QuadBackgroundGroup');
  if (existingBg) scene.remove(existingBg);

  const bgGroup = new THREE.Group();
  bgGroup.name = 'QuadBackgroundGroup';

  const loader = new THREE.TextureLoader();
  const startAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

  for (let i = 0; i < 4; i++) {
    // Geometria
    const geo = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, startAngles[i], Math.PI / 2);

    // Ładowanie tekstury (musi być przed materiałem!)
    const texture = loader.load(textureUrls[i]);
    texture.encoding = THREE.sRGBEncoding; // 👈 TO ZABIERA WYBLAKŁOŚĆ Z PLIKU
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = -1;

    // Tworzymy materiał
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      toneMapped: true, // 👈 TO NAKŁADA KINOWY KONTRAST (GŁĘBOKĄ CZERŃ) ZAMIAST SZAROŚCI
      color: 0xffffff // Biały kolor = wyświetl oryginalną jasność zdjęcia
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = height / 2;

    bgGroup.add(mesh);
  }

  scene.add(bgGroup);
}

function drawKasetonScene() {
  if (!scene) return;

  const oldKasetony = [];
  scene.traverse(obj => { if (obj.userData && obj.userData.isKaseton) oldKasetony.push(obj); });
  oldKasetony.forEach(obj => scene.remove(obj));

  if (!window.currentKasetonConfig) {
    window.currentKasetonConfig = {
      system: 'LMD',
      width: 120,
      depth: 200,
      cut: 'none',
      print: 'single',
      usage: 'freestanding'
    };
  }
  const config = window.currentKasetonConfig;

  const W = parseFloat(config.width) || 120;
  const H = parseFloat(config.depth) || 200;
  const sys = config.system || 'LMD';

  // CTF: completely different 3D model (box/cuboid), delegate to dedicated function
  if (sys === 'CTF' || sys === 'CTF_LED') {
    return drawCTFScene(config);
  }

  const pD = (sys === 'LMS') ? 12.0 : (sys === 'LMSM' ? 6.5 : (sys === 'DTF' ? 4.5 : (sys === 'STF' ? 2.6 : (sys === 'STFL' ? 1.6 : 14.0))));

  // 🟢 TUTAJ: Resetujemy licznik LED przy każdym nowym renderowaniu sceny
  window.kasetonLedSummary = {};

  console.log('📐 Drawing custom Kaseton frame in 3D:', W, 'x', H, 'cm, System:', sys);
  // ... dalsza część kodu

  // 1. MOTYW I MATERIAŁY (Premium Anodized Aluminum)
  // Zmniejszona połyskliwość (roughness: 0.45, metalness: 0.55) zgodnie z zaleceniem
  const aluMat = new THREE.MeshStandardMaterial({
    color: 0xd0d4d9,
    metalness: 0.55,
    roughness: 0.45,
    name: 'anodized_aluminum'
  });

  const supportMat = isBlueprintMode ? new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x166534,
    emissiveIntensity: 0.8,
    roughness: 0.4,
    metalness: 0.2
  }) : aluMat;

  const isLedSys = ['LMD', 'LMS', 'LMSM', 'CTF_LED', 'LCD_LMD'].includes(sys);

  // Zoptymalizowana emisyjność i głębia kolorów dla grafik i blockoutów
  function getPrintMaterial(textureUrl, isBlockout) {
    const matParams = {
      color: 0xffffff,
      roughness: isBlockout ? 0.95 : 0.75, // Blockout is completely matte, prints have realistic fabric finish
      metalness: 0.0,
      transparent: false,
      opacity: 1.0,
      side: THREE.DoubleSide
    };
    if (isLedSys) {
      if (isBlockout) {
        matParams.emissive = new THREE.Color(0x000000);
        matParams.emissiveIntensity = 0.0;
        matParams.name = 'blockout_print';
      } else {
        // Efekt świecenia bez utraty żywości kolorów
        matParams.emissive = new THREE.Color(0xffffff);
        matParams.emissiveIntensity = 0.8;
        matParams.name = 'led_print';
      }
    } else {
      matParams.name = 'standard_print';
    }
    if (textureUrl) {
      const tex = new THREE.TextureLoader().load(textureUrl);
      tex.encoding = THREE.sRGBEncoding;
      matParams.map = tex;
      if (isLedSys && !isBlockout) {
        matParams.emissiveMap = tex;
      }
    }
    return new THREE.MeshStandardMaterial(matParams);
  }

  // 2. MODUŁ BUDOWANIA JEDNEGO SEGMENTU PROFILU Z SCIĘCIEM 45 STOPNI
  function createMiteredSegmentGeometry(L, zMin, zMax, t) {
    const geom = new THREE.BufferGeometry();

    const vertices = new Float32Array([
      // Start (x = y)
      0, 0, zMin, // 0
      0, 0, zMax, // 1
      t, t, zMax, // 2
      t, t, zMin, // 3

      // Koniec (x = L - y)
      L, 0, zMin, // 4
      L, 0, zMax, // 5
      L - t, t, zMax, // 6
      L - t, t, zMin // 7
    ]);

    const indices = [
      // Dół (y = 0) - płaski zewnętrzny obwód ramy
      0, 4, 5, 0, 5, 1,
      // Góra (y = t) - wewnętrzny profil
      2, 6, 7, 2, 7, 3,
      // Tył (z = zMin)
      0, 3, 7, 0, 7, 4,
      // Przód (z = zMax)
      1, 5, 6, 1, 6, 2,
      // Lewa ścianka ukośna (x = y)
      0, 1, 2, 0, 2, 3,
      // Prawa ścianka ukośna (x = L - y)
      4, 7, 6, 4, 6, 5
    ];

    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }

  // 2b. MODUŁ BUDOWANIA SEGMENTU SKOŚNEGO (SLOPED) Z SCIĘCIEM 45 STOPNI
  function createMiteredSlopedGeometry(L, zMin, zMax, yStart, yEnd) {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, zMin,
      0, 0, zMax,
      yEnd, yEnd, zMax,
      yStart, yStart, zMin,
      L, 0, zMin,
      L, 0, zMax,
      L - yEnd, yEnd, zMax,
      L - yStart, yStart, zMin
    ]);
    const indices = [
      0, 4, 5, 0, 5, 1,
      2, 6, 7, 2, 7, 3,
      0, 3, 7, 0, 7, 4,
      1, 5, 6, 1, 6, 2,
      0, 1, 2, 0, 2, 3,
      4, 7, 6, 4, 6, 5
    ];
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }

  // 3. GENERATOR PROFILU - WYBOR SYSTEMU (LMD vs LMS vs LMSM vs STF vs STFL vs DTF)
  function createProfileGroup(L) {
    if (sys === 'LMSM') return createProfileGroupLMSM(L);
    if (sys === 'LMS') return createProfileGroupLMS(L);
    if (sys === 'STF') return createProfileGroupSTF(L);
    if (sys === 'STFL') return createProfileGroupSTFL(L);
    if (sys === 'DTF') return createProfileGroupDTF(L);
    return createProfileGroupLMD(L);
  }

  function createProfileGroupLMSM(L) {
    const group = new THREE.Group();
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x444444 });
    const segmentsConfig = [
      { zMin: -3.25, zMax: -3.0, t: 1.4 }, // Ścianka zewnętrzna tylna
      { zMin: -3.0, zMax: 1.25, t: 4.3 }, // Kanał wewnętrzny konstrukcyjny / LED
      { zMin: 1.25, zMax: 2.25, t: 1.6 }, // Ścianka montażowa stopy
      { zMin: 2.25, zMax: 3.25, t: 0.5 }  // Cienka krawędź frontowa Slim
    ];

    segmentsConfig.forEach(seg => {
      const segmentGeom = createMiteredSegmentGeometry(L, seg.zMin, seg.zMax, seg.t);
      const mesh = new THREE.Mesh(segmentGeom, aluMat);
      const edges = new THREE.EdgesGeometry(segmentGeom);
      const line = new THREE.LineSegments(edges, edgeMat);
      mesh.add(line);
      group.add(mesh);
    });

    return { group };
  }

  // 3a. PROFIL LMD (140mm glebokosci, symetryczny)
  // Modeluje rynienke o szerokosci 25mm oraz glebokosci 12mm wewnatrz profilu
  function createProfileGroupLMD(L) {
    const group = new THREE.Group();
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x444444 });

    const leftGeom = createMiteredSegmentGeometry(L, -7, -3.8, 0.8);
    const leftMesh = new THREE.Mesh(leftGeom, aluMat);
    group.add(leftMesh);

    const bodyLeftGeom = createMiteredSegmentGeometry(L, -3.8, -1.25, 3.2);
    const bodyLeftMesh = new THREE.Mesh(bodyLeftGeom, aluMat);
    group.add(bodyLeftMesh);

    const channelGeom = createMiteredSegmentGeometry(L, -1.25, 1.25, 2.0);
    const channelMesh = new THREE.Mesh(channelGeom, aluMat);
    group.add(channelMesh);

    const bodyRightGeom = createMiteredSegmentGeometry(L, 1.25, 3.8, 3.2);
    const bodyRightMesh = new THREE.Mesh(bodyRightGeom, aluMat);
    group.add(bodyRightMesh);

    const rightGeom = createMiteredSegmentGeometry(L, 3.8, 7, 0.8);
    const rightMesh = new THREE.Mesh(rightGeom, aluMat);
    group.add(rightMesh);

    [leftGeom, bodyLeftGeom, channelGeom, bodyRightGeom, rightGeom].forEach(g => {
      const edges = new THREE.EdgesGeometry(g);
      const line = new THREE.LineSegments(edges, edgeMat);
      group.add(line);
    });

    return { group };
  }

  // 3b. PROFIL LMS (120mm głębokości, asymetryczny, jednostronny)
  // Przekrój odzwierciedla rysunek techniczny i wytyczne użytkownika:
  // - Całkowita głębokość: 12.0cm (120mm) od z = -6.0 do z = +6.0
  // - Wysoki tył (4.5cm) z płaskim zewnętrznym obwodem
  // - LED i supporty umieszczone 25mm od tylnej krawędzi (środek na z = -3.5)
  // - Przejście w postaci jednej płaskiej płaszczyzny pod kątem 135 stopni (skos 45 stopni)
  // - Niski przód (skrzydło 0.4cm)
  function createProfileGroupLMS(L) {
    var lmsGroup = new THREE.Group();
    var edgeMat2 = new THREE.LineBasicMaterial({ color: 0x444444 });
    var allGeoms = [];

    // Segment 1: Tylne skrzydło (uchwyt) - z = -6.0 do -5.0, wysokość 0.4
    var g1 = createMiteredSegmentGeometry(L, -6.0, -5.0, 0.4);
    lmsGroup.add(new THREE.Mesh(g1, aluMat));
    allGeoms.push(g1);

    // Segment 2: Tylna ściana - z = -5.0 do -4.5, wysokość 4.5
    var g2 = createMiteredSegmentGeometry(L, -5.0, -4.5, 4.5);
    lmsGroup.add(new THREE.Mesh(g2, aluMat));
    allGeoms.push(g2);

    // Segment 3: Kanał LED (wgłębienie 5.7mm) - z = -4.5 do -2.5, wysokość 3.93
    var g3 = createMiteredSegmentGeometry(L, -4.5, -2.5, 3.93);
    lmsGroup.add(new THREE.Mesh(g3, aluMat));
    allGeoms.push(g3);

    // Segment 4: Ścianka kanału LED (wewnętrzna) - z = -2.5 do -2.0, wysokość 4.5
    var g4 = createMiteredSegmentGeometry(L, -2.5, -2.0, 4.5);
    lmsGroup.add(new THREE.Mesh(g4, aluMat));
    allGeoms.push(g4);

    // Segment 5: Jedna płaska płaszczyzna skosu pod kątem 135 st. (skos z 4.5 do 0.4) - z = -2.0 do 2.1
    var g5 = createMiteredSlopedGeometry(L, -2.0, 2.1, 4.5, 0.4);
    lmsGroup.add(new THREE.Mesh(g5, aluMat));
    allGeoms.push(g5);

    // Segment 6: Przednie skrzydło (uchwyt) - z = 2.1 do 6.0, wysokość 0.4
    var g6 = createMiteredSegmentGeometry(L, 2.1, 6.0, 0.4);
    lmsGroup.add(new THREE.Mesh(g6, aluMat));
    allGeoms.push(g6);

    // Linie konturowe
    allGeoms.forEach(function (gg) {
      var edg = new THREE.EdgesGeometry(gg);
      var ln = new THREE.LineSegments(edg, edgeMat2);
      lmsGroup.add(ln);
    });

    return { group: lmsGroup };
  }

  // 3c. PROFIL STF (26mm głębokości, jednostronny płaski slim)
  // Prostokątny przekrój o szerokości 4.0cm z jednym rowkiem (t=0.8) na frontowej krawędzi (z = -1.3 do -0.9)
  function createProfileGroupSTF(L) {
    const group = new THREE.Group();
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x444444 });
    // Frontowy rowek (cienki kołnierz)
    const frontGeom = createMiteredSegmentGeometry(L, -1.3, -0.9, 0.8);
    const frontMesh = new THREE.Mesh(frontGeom, aluMat);
    group.add(frontMesh);
    // Korpus główny ramy
    const bodyGeom = createMiteredSegmentGeometry(L, -0.9, 1.3, 4.0);
    const bodyMesh = new THREE.Mesh(bodyGeom, aluMat);
    group.add(bodyMesh);

    [frontGeom, bodyGeom].forEach(g => {
      const edges = new THREE.EdgesGeometry(g);
      const line = new THREE.LineSegments(edges, edgeMat);
      group.add(line);
    });
    return { group };
  }

  // 3d. PROFIL STFL (16mm głębokości, jednostronny płaski extra slim)
  // Prostokątny przekrój o szerokości 4.0cm z jednym rowkiem (t=0.8) na frontowej krawędzi (z = -0.8 do -0.5)
  function createProfileGroupSTFL(L) {
    const group = new THREE.Group();
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x444444 });
    // Frontowy rowek (cienki kołnierz)
    const frontGeom = createMiteredSegmentGeometry(L, -0.8, -0.5, 0.8);
    const frontMesh = new THREE.Mesh(frontGeom, aluMat);
    group.add(frontMesh);
    // Korpus główny ramy
    const bodyGeom = createMiteredSegmentGeometry(L, -0.5, 0.8, 4.0);
    const bodyMesh = new THREE.Mesh(bodyGeom, aluMat);
    group.add(bodyMesh);

    [frontGeom, bodyGeom].forEach(g => {
      const edges = new THREE.EdgesGeometry(g);
      const line = new THREE.LineSegments(edges, edgeMat);
      group.add(line);
    });
    return { group };
  }

  // 3e. PROFIL DTF (45mm głębokości, obustronny płaski slim)
  // Prostokątny przekrój o szerokości 4.0cm z rowkami po obu stronach (z = -2.25 do -1.85 oraz z = 1.85 do 2.25)
  function createProfileGroupDTF(L) {
    const group = new THREE.Group();
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x444444 });
    // Frontowy rowek (cienki kołnierz)
    const frontGeom = createMiteredSegmentGeometry(L, -2.25, -1.85, 0.8);
    const frontMesh = new THREE.Mesh(frontGeom, aluMat);
    group.add(frontMesh);
    // Korpus główny
    const bodyGeom = createMiteredSegmentGeometry(L, -1.85, 1.85, 4.0);
    const bodyMesh = new THREE.Mesh(bodyGeom, aluMat);
    group.add(bodyMesh);
    // Tylny rowek (cienki kołnierz)
    const backGeom = createMiteredSegmentGeometry(L, 1.85, 2.25, 0.8);
    const backMesh = new THREE.Mesh(backGeom, aluMat);
    group.add(backMesh);

    [frontGeom, bodyGeom, backGeom].forEach(g => {
      const edges = new THREE.EdgesGeometry(g);
      const line = new THREE.LineSegments(edges, edgeMat);
      group.add(line);
    });
    return { group };
  }

  // 4. STRIP PACKING ALGORITHMS FOR LEDS
  // Wyliczenie segmentów pola roboczego zgodnie z cięciem i 50mm marginesami na rogach
  function getWorkingSegments(profileLength, isHorizontal) {
    let numSegments = 1;
    if (isHorizontal) {
      if (config.cut && config.cut.includes('half_w')) numSegments = 2;
      else if (config.cut && config.cut.includes('3w')) numSegments = 3;
      else if (config.cut && config.cut.includes('4w')) numSegments = 4;
      else if (config.cut && config.cut.includes('5w')) numSegments = 5;
    } else {
      if (config.cut && config.cut.includes('half_h')) numSegments = 2;
      else if (config.cut && config.cut.includes('3h')) numSegments = 3;
      else if (config.cut && config.cut.includes('4h')) numSegments = 4;
      else if (config.cut && config.cut.includes('5h')) numSegments = 5;
    }

    if (config.cut && config.cut.startsWith('auto')) {
      const maxLen = config.cut === 'auto_dedicated' ? 300 : (config.cut === 'auto_courier_150' ? 150 : 200);
      if (profileLength > maxLen) {
        numSegments = Math.ceil(profileLength / maxLen);
      }
    }

    const numSupports = numSegments - 1;
    const totalSupportSpace = numSupports * 10; // 100mm support
    const totalCornerSpace = 10; // 50mm on each end = 100mm total = 10cm

    const totalAvailable = profileLength - totalCornerSpace - totalSupportSpace;
    if (totalAvailable <= 0) return [];

    const segLength = totalAvailable / numSegments;

    const segments = [];
    for (let i = 0; i < numSegments; i++) {
      const start = 5 + i * (segLength + 10);
      const end = start + segLength;
      segments.push({ start, end, length: segLength });
    }
    return segments;
  }

  // Wyszukiwanie optymalnej kombinacji pasków (preferencja większych)
  function getBestLedCombination(maxLength) {
    const sizes = [50, 30, 24, 20];
    let bestCombo = [];
    let bestSum = 0;

    function search(index, currentCombo, currentSum) {
      if (currentSum > maxLength) return;
      if (currentSum > bestSum) {
        bestSum = currentSum;
        bestCombo = [...currentCombo];
      } else if (currentSum === bestSum) {
        if (currentCombo.length < bestCombo.length) {
          bestCombo = [...currentCombo];
        }
      }

      for (let i = index; i < sizes.length; i++) {
        currentCombo.push(sizes[i]);
        search(i, currentCombo, currentSum + sizes[i]);
        currentCombo.pop();
      }
    }

    search(0, [], 0);
    return bestCombo;
  }

  // Modelowanie paska LED z soczewkami co 50mm
  function createLedStripeMesh(size) {
    const stripeGroup = new THREE.Group();

    // PCB white board (kolorowany w trybie blueprint)
    let pcbColor = 0xffffff;
    if (isBlueprintMode) {
      if (size === 50) pcbColor = 0xef4444; // Red
      else if (size === 30) pcbColor = 0x3b82f6; // Blue
      else if (size === 24) pcbColor = 0xf59e0b; // Yellow
      else if (size === 20) pcbColor = 0x06b6d4; // Cyan
    }

    const pcbGeom = new THREE.BoxGeometry(2.4, 0.15, size);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: pcbColor,
      roughness: 0.8,
      metalness: 0.1,
      emissive: isBlueprintMode ? pcbColor : 0x000000,
      emissiveIntensity: isBlueprintMode ? 0.8 : 0.0
    });
    const pcb = new THREE.Mesh(pcbGeom, pcbMat);
    pcb.position.set(0, 0.075, 0);
    stripeGroup.add(pcb);

    // Soczewki
    const numLenses = Math.floor(size / 5);
    const lensGeom = new THREE.CylinderGeometry(1.1, 1.1, 2.0, 16);
    const lensColor = isBlueprintMode ? pcbColor : 0xffcc00;
    const lensMat = new THREE.MeshStandardMaterial({
      color: lensColor,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.8
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: lensColor });
    const glowSphereGeom = new THREE.SphereGeometry(0.2, 8, 8);

    for (let i = 0; i < numLenses; i++) {
      const zPos = -size / 2 + 2.5 + i * 5;
      const lens = new THREE.Mesh(lensGeom, lensMat);
      lens.position.set(0, 1.15, zPos);
      stripeGroup.add(lens);

      const glow = new THREE.Mesh(glowSphereGeom, glowMat);
      glow.position.set(0, 1.15, zPos);
      stripeGroup.add(glow);
    }

    return stripeGroup;
  }

  // Poprawne nanoszenie pasków LED oraz złączek w kanale profilu
  function addLedStripesToProfileGroup(targetGroup, L, isHorizontal) {
    const segments = getWorkingSegments(L, isHorizontal);
    const ledY = (sys === 'LMS' || sys === 'LMSM') ? 3.93 : 2.0;
    const ledZ = (sys === 'LMS') ? -3.5 : (sys === 'LMSM' ? -0.875 : 0);

    segments.forEach(seg => {
      const combo = getBestLedCombination(seg.length);
      const totalStripesLength = combo.reduce((sum, val) => sum + val, 0);
      const startOffset = seg.start + (seg.length - totalStripesLength) / 2;

      let currentOffset = startOffset;
      combo.forEach((size, idx) => {
        const stripe = createLedStripeMesh(size);
        stripe.position.set(currentOffset + size / 2, ledY, ledZ);
        stripe.rotation.y = Math.PI / 2;
        targetGroup.add(stripe);

        // Zliczanie modułów LED bezpośrednio do statystyk bocznego panelu
        if (isBlueprintMode) {
          const isPower = (config.light || 'power_long').startsWith('power');
          const nameMap = isPower ? {
            20: 'AdframeLED POWER LED 20cm 9W v2',
            24: 'AdframeLED POWER LED 24cm 11W v2',
            30: 'AdframeLED POWER LED 30cm 13W v2',
            50: 'AdframeLED POWER LED 50cm 22W v2'
          } : {
            20: 'AdframeLED NORMAL LED 20cm 6,5W v2',
            24: 'AdframeLED NORMAL LED 24cm 8W v2',
            30: 'AdframeLED NORMAL LED 30cm 10W v2',
            50: 'AdframeLED NORMAL LED 50cm 16W v2'
          };

          const ledFullName = nameMap[size] || `Moduł LED ${size}cm`;
          window.kasetonLedSummary[ledFullName] = (window.kasetonLedSummary[ledFullName] || 0) + 1;
        }

        // Czerwona złączka na końcu paska (oprócz ostatniego)
        if (idx < combo.length - 1) {
          const connGeom = new THREE.BoxGeometry(0.3, 0.4, 1.2);
          const connMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5, metalness: 0.2 });
          const conn = new THREE.Mesh(connGeom, connMat);
          conn.position.set(currentOffset + size, ledY + 0.1, ledZ);
          targetGroup.add(conn);
        }

        currentOffset += size;
      });
    });
  }
  // Globalna wysokość/pozycja na podłodze (suspended = +100cm, wall = +70cm)
  const elevY = config.usage === 'suspended' ? 100 : (config.usage === 'wall' ? 70 : 0);

  const kGroup = new THREE.Group();
  kGroup.userData = { isKaseton: true };

  // WSPÓLNA STRUKTURA ETYKIETOWANIA TECHNICZNEGO W BLUEPRINT MODE
  function addTechnicalLabel3D(targetPt, text, labelOffset) {
    const arrowPt = targetPt.clone().add(labelOffset);

    // Linia łącząca element z tekstem (biała, przerywana efektem)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([targetPt, arrowPt]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true, opacity: 0.7 });
    const line = new THREE.Line(lineGeo, lineMat);
    line.renderOrder = 999;
    kGroup.add(line);

    // Główka strzałki (stożek) na targetPt
    const dir = targetPt.clone().sub(arrowPt).normalize();
    const coneGeom = new THREE.ConeGeometry(1.2, 3.5, 8);
    const coneMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false });
    const cone = new THREE.Mesh(coneGeom, coneMat);
    cone.position.copy(targetPt);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    cone.renderOrder = 999;
    kGroup.add(cone);

    // Zawijanie tekstu do wielu linii (max ~22 znaków na linię)
    const upperText = text.toUpperCase();
    const maxChars = 22;
    const words = upperText.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach(word => {
      if (currentLine.length + word.length + 1 <= maxChars) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    // Płótno 2D z zawijaniem i tłem
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = 52;
    const lineHeight = fontSize * 1.35;
    const padding = 16;
    canvas.width = 512;
    canvas.height = padding * 2 + lines.length * lineHeight;

    // Półprzezroczyste ciemne tło panelu
    ctx.fillStyle = 'rgba(10, 10, 20, 0.75)';
    const r = 8;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(canvas.width - r, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
    ctx.lineTo(canvas.width, canvas.height - r);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
    ctx.lineTo(r, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Cienka biała ramka
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tekst biały, CAPSLOCK
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    lines.forEach((ln, i) => {
      ctx.fillText(ln, padding, padding + i * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);

    // Skaluj: 15cm na linię wysokości, szerokość proporcjonalna
    const spriteH = 15 * lines.length;
    const aspect = canvas.width / canvas.height;
    sprite.scale.set(spriteH * aspect, spriteH, 1);
    sprite.position.copy(arrowPt.clone().add(new THREE.Vector3(spriteH * aspect * 0.5, 0, 0)));
    sprite.renderOrder = 1000;
    kGroup.add(sprite);
  }

  window.addTechnicalLabelBlueprint = (key, absolutePos, text, offsetVec) => {
    addTechnicalLabel3D(absolutePos, text, offsetVec);
  };

  // 5. GENEROWANIE I UKŁADANIE 4 PROFILI RAMY (Bottom, Top, Left, Right)
  // Bottom profile (length W)
  const bottomP = createProfileGroup(W);
  bottomP.group.position.set(-W / 2, elevY, 0);
  kGroup.add(bottomP.group);

  // Top profile (length W)
  const topP = createProfileGroup(W);
  topP.group.position.set(W / 2, elevY + H, 0);
  topP.group.rotation.set(0, 0, Math.PI);
  kGroup.add(topP.group);

  // Left profile (length H)
  const leftP = createProfileGroup(H);
  leftP.group.position.set(-W / 2, elevY + H, 0);
  leftP.group.rotation.set(0, 0, -Math.PI / 2);
  kGroup.add(leftP.group);

  // Right profile (length H)
  const rightP = createProfileGroup(H);
  rightP.group.position.set(W / 2, elevY, 0);
  rightP.group.rotation.set(0, 0, Math.PI / 2);
  kGroup.add(rightP.group);

  // 6. ROZMIESZCZENIE LEDÓW ZGODNIE Z OPCJAMI OŚWIETLENIA
  let totalPowerW = 0;
  if (isLedSys) {
    const ledOption = config.light || 'power_around';
    const drawBottom = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
    const drawTop = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
    const drawLeft = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));
    const drawRight = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));



    if (drawBottom) addLedStripesToProfileGroup(bottomP.group, W, true);
    if (drawTop) addLedStripesToProfileGroup(topP.group, W, true);
    if (drawLeft) addLedStripesToProfileGroup(leftP.group, H, false);
    if (drawRight) addLedStripesToProfileGroup(rightP.group, H, false);

    // Poprawne oświetlenie przeniesione do sekcji generowania grafik dla uzyskania perfekcyjnego realizmu i głębi kolorów

    // Power calculation
    const isPower = ledOption.startsWith('power');
    const wattMap = isPower ? { 20: 9, 24: 11, 30: 13, 50: 22 } : { 20: 6.5, 24: 8, 30: 10, 50: 16 };
    function getLedPower(profLen, isHoriz) {
      let power = 0;
      getWorkingSegments(profLen, isHoriz).forEach(seg => {
        getBestLedCombination(seg.length).forEach(size => power += wattMap[size]);
      });
      return power;
    }
    if (drawBottom) totalPowerW += getLedPower(W, true);
    if (drawTop) totalPowerW += getLedPower(W, true);
    if (drawLeft) totalPowerW += getLedPower(H, false);
    if (drawRight) totalPowerW += getLedPower(H, false);
  }

  // 7. GENEROWANIE SUPPORTÓW (ZAMKI, ŁĄCZNIKI)
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
  const cutX = [];
  for (let i = 1; i <= numCutsW; i++) cutX.push(-W / 2 + (W / numSegmentsW) * i);
  const cutY = [];
  for (let i = 1; i <= numCutsH; i++) cutY.push(elevY + (H / numSegmentsH) * i);

  let supportThickness = 1.5;
  let supportZ = 0;
  if (sys === 'LMS') {
    supportZ = -3.5;
  } else if (sys === 'LMSM') {
    supportZ = -0.875;
  } else if (sys === 'STFL') {
    supportThickness = 0.6;
    supportZ = 0.5;
  } else if (sys === 'STF') {
    supportThickness = 1.2;
    supportZ = 0.7;
  } else if (sys === 'DTF') {
    supportThickness = 1.5;
    supportZ = 0;
  }

  // Vertical supports (continuous)
  cutX.forEach(cx => {
    const vGeom = new THREE.BoxGeometry(5, H - 6.4, supportThickness);
    const vMesh = new THREE.Mesh(vGeom, supportMat);
    vMesh.position.set(cx, elevY + H / 2, supportZ);
    kGroup.add(vMesh);
  });

  // Horizontal supports (broken at vertical intersections)
  const xBounds = [-W / 2 + 3.2];
  cutX.forEach(cx => { xBounds.push(cx - 2.5, cx + 2.5); });
  xBounds.push(W / 2 - 3.2);

  cutY.forEach(cy => {
    for (let i = 0; i < xBounds.length; i += 2) {
      const left = xBounds[i];
      const right = xBounds[i + 1];
      if (right > left) {
        const hGeom = new THREE.BoxGeometry(right - left, 5, supportThickness);
        const hMesh = new THREE.Mesh(hGeom, supportMat);
        hMesh.position.set((left + right) / 2, cy, supportZ);
        kGroup.add(hMesh);
      }
    }
  });

  // 7.1. ŁĄCZNIKI DŁUGIE W ZEWNĘTRZNYCH ROWKACH (przy cięciach profili głównych)
  // 200mm × 15mm × 5mm = 20 × 1.5 × 0.5 cm in 3D units
  const connectorMat = isBlueprintMode ? new THREE.MeshStandardMaterial({
    color: 0xff8c00, emissive: 0xcc6600, emissiveIntensity: 0.8,
    roughness: 0.4, metalness: 0.2
  }) : aluMat;
  const connHoleMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.1 });

  const isLMS = (sys === 'LMS');
  const isLMSM = (sys === 'LMSM');
  
  let zPos180 = [-5.4, 5.4];
  let connZWidth = 1.5;
  if (isLMS) {
    zPos180 = [-5.5];
    connZWidth = 0.8;
  } else if (isLMSM) {
    zPos180 = [-2.5, 2.5];
    connZWidth = 1.5;
  } else if (sys === 'DTF') {
    zPos180 = [0];
    connZWidth = 1.5;
  } else if (sys === 'STF') {
    zPos180 = [0.2];
    connZWidth = 1.2;
  } else if (sys === 'STFL') {
    zPos180 = [0.15];
    connZWidth = 0.8;
  }

  // Cięcia pionowe (cutX) przecinają profile poziome (dół i góra)
  cutX.forEach(cx => {
    zPos180.forEach(zPos => {
      // Dolny profil
      const connGroupBottom = new THREE.Group();
      const connGeomH = new THREE.BoxGeometry(20, 0.5, connZWidth);
      connGroupBottom.add(new THREE.Mesh(connGeomH, connectorMat));
      for (let h = 0; h < 4; h++) {
        const holeGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 8);
        const hole = new THREE.Mesh(holeGeom, connHoleMat);
        hole.position.set(-7.5 + h * 5, 0, 0);
        connGroupBottom.add(hole);
      }
      const yOffsetBottom = isLMS ? 0.8 : 0.4;
      connGroupBottom.position.set(cx, elevY + yOffsetBottom, zPos);
      kGroup.add(connGroupBottom);

      // Górny profil
      const connGroupTop = connGroupBottom.clone();
      const yOffsetTop = isLMS ? 0.8 : 0.4;
      connGroupTop.position.set(cx, elevY + H - yOffsetTop, zPos);
      kGroup.add(connGroupTop);
    });
  });

  // Cięcia poziome (cutY) przecinają profile pionowe (lewy i prawy)
  cutY.forEach(cy => {
    zPos180.forEach(zPos => {
      // Lewy profil
      const connGroupLeft = new THREE.Group();
      const connGeomV = new THREE.BoxGeometry(0.5, 20, connZWidth);
      connGroupLeft.add(new THREE.Mesh(connGeomV, connectorMat));
      for (let h = 0; h < 4; h++) {
        const holeGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 8);
        const hole = new THREE.Mesh(holeGeom, connHoleMat);
        hole.position.set(0, -7.5 + h * 5, 0);
        hole.rotation.z = Math.PI / 2;
        connGroupLeft.add(hole);
      }
      const xOffsetLeft = isLMS ? 0.8 : 0.4;
      connGroupLeft.position.set(-W / 2 + xOffsetLeft, cy, zPos);
      kGroup.add(connGroupLeft);

      // Prawy profil
      const connGroupRight = connGroupLeft.clone();
      const xOffsetRight = isLMS ? 0.8 : 0.4;
      connGroupRight.position.set(W / 2 - xOffsetRight, cy, zPos);
      kGroup.add(connGroupRight);
    });
  });

  // 7.2. NAROŻNIKI WZMACNIANE W ZEWNĘTRZNYCH ROWKACH (Tymczasowo usunięte dla modułu LMS)
  if (!isLMS) {
    const cornerMat = isBlueprintMode ? new THREE.MeshStandardMaterial({
      color: 0xaa00ff, emissive: 0x8800cc, emissiveIntensity: 0.9,
      roughness: 0.4, metalness: 0.2
    }) : aluMat;

    const cornerPositions = [
      { x: -W / 2, y: elevY, dx: 1, dy: 1 }, // bottom-left
      { x: W / 2, y: elevY, dx: -1, dy: 1 }, // bottom-right
      { x: -W / 2, y: elevY + H, dx: 1, dy: -1 }, // top-left
      { x: W / 2, y: elevY + H, dx: -1, dy: -1 } // top-right
    ];

    cornerPositions.forEach(corner => {
      let zPositions = [-5.4, 5.4];
      let armWidthZ = 1.5;
      if (sys === 'LMSM') {
        zPositions = [-2.5, 2.5];
      } else if (sys === 'DTF') {
        zPositions = [0];
      } else if (sys === 'STF') {
        zPositions = [0.2];
      } else if (sys === 'STFL') {
        zPositions = [0.15];
        armWidthZ = 0.8;
      }

      zPositions.forEach(zPos => {
        const cGroup = new THREE.Group();
        // Horizontal arm (10cm length in X, 0.5cm height in Y)
        const hArm = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, armWidthZ), cornerMat);
        hArm.position.set(corner.dx * 5, corner.dy * 0.4, 0);
        cGroup.add(hArm);
        // Vertical arm (0.5cm width in X, 10cm length in Y)
        const vArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, armWidthZ), cornerMat);
        vArm.position.set(corner.dx * 0.4, corner.dy * 5, 0);
        cGroup.add(vArm);
        cGroup.position.set(corner.x, corner.y, zPos);
        kGroup.add(cGroup);
      });
    });
  }

  window.currentKasetonConfig.numCutsW = numCutsW;
  window.currentKasetonConfig.numCutsH = numCutsH;
  window.currentKasetonConfig.totalSupportLengthM = (numCutsW * (H - 6.4 + 1.0) + numCutsH * (W - 6.4 + 1.0)) / 100; // +5mm na każde łączenie z profilem głównym (2 łączenia × 0.5cm = 1.0cm)
  window.currentKasetonConfig.totalPowerW = totalPowerW;

  // 7.5. GENEROWANIE STÓP (dla konfiguracji wolnostojącej)
  if (config.usage === 'freestanding' || config.usage === 'freestanding_tri') {
    const isTriFoot = (config.usage === 'freestanding_tri' && sys === 'DTF');
    const footXPositions = [-W / 2 + 15, W / 2 - 15];
    if (numCutsW > 0) {
      cutX.forEach(cx => footXPositions.push(cx));
    } else if (W >= 200) {
      footXPositions.push(0);
    }

    // Deduplicate foot positions
    const uniqueX = [];
    footXPositions.forEach(x => {
      if (!uniqueX.some(ux => Math.abs(ux - x) < 1)) {
        uniqueX.push(x);
      }
    });

    if (isTriFoot) {
      // Wymodelowanie stopy trójkątnej o szerokości 50cm i wysokości 25cm z wycięciami i łukiem
      const shape = new THREE.Shape();
      shape.moveTo(-25, 0);
      shape.lineTo(-24, 0.5);
      shape.lineTo(-2.5, 23);
      shape.lineTo(-2.5, 25);
      shape.lineTo(2.5, 25);
      shape.lineTo(2.5, 23);
      shape.lineTo(24, 0.5);
      shape.lineTo(25, 0);
      shape.lineTo(18, 0);
      shape.quadraticCurveTo(0, 8, -18, 0);
      shape.closePath();

      // Lewy i prawy otwór trójkątny o zaokrąglonych brzegach, oddalone od zewnętrznej krawędzi o ok. 30mm
      const hole1 = new THREE.Path();
      hole1.moveTo(-14.7, 5.2);
      hole1.quadraticCurveTo(-16, 4.5, -14.9, 5.6);
      hole1.lineTo(-5.1, 15.4);
      hole1.quadraticCurveTo(-4, 16.5, -4.0, 14.5);
      hole1.lineTo(-4.0, 11.5);
      hole1.quadraticCurveTo(-4, 10.5, -5.0, 10.0);
      hole1.closePath();
      shape.holes.push(hole1);

      const hole2 = new THREE.Path();
      hole2.moveTo(14.7, 5.2);
      hole2.quadraticCurveTo(16, 4.5, 14.9, 5.6);
      hole2.lineTo(5.1, 15.4);
      hole2.quadraticCurveTo(4, 16.5, 4.0, 14.5);
      hole2.lineTo(4.0, 11.5);
      hole2.quadraticCurveTo(4, 10.5, 5.0, 10.0);
      hole2.closePath();
      shape.holes.push(hole2);

      const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const triGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      triGeom.center(); // Centrowanie geometrii

      // Stopy trójkątne są montowane po bokach bocznych profili (X = -W/2 oraz W/2), zawsze dokładnie 2 sztuki.
      const dtfFootX = [-W / 2 - 0.4, W / 2 + 0.4];
      dtfFootX.forEach(x => {
        const footMesh = new THREE.Mesh(triGeom, aluMat);
        // Obrót wokół Y o 90 stopni, aby stopa była prostopadle do kasetonu
        footMesh.rotation.y = Math.PI / 2;
        // geom.center() środkuje Y (wysokość 25) w 12.5, więc stawiamy na elevY + 12.5
        footMesh.position.set(x, elevY + 12.5, 0);
        kGroup.add(footMesh);

        // Krawędzie
        const edges = new THREE.EdgesGeometry(triGeom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x444444 }));
        footMesh.add(line);
      });
    } else {
      // Dla DTF z płaskimi stopami również montujemy po bokach bocznych profili, zawsze 2 sztuki.
      if (sys === 'DTF') {
        const dtfFlatFootX = [-W / 2 - 4, W / 2 + 4];
        const footGeom = new THREE.BoxGeometry(8, 2, 40);
        dtfFlatFootX.forEach(x => {
          const footMesh = new THREE.Mesh(footGeom, aluMat);
          footMesh.position.set(x, elevY - 1, 0);
          kGroup.add(footMesh);
        });
      } else {
        // Pozostałe systemy korzystają ze starej logiki montażu na profilu dolnym
        const footGeom = new THREE.BoxGeometry(8, 2, 40);
        uniqueX.forEach(x => {
          const footMesh = new THREE.Mesh(footGeom, aluMat);
          footMesh.position.set(x, elevY - 1, 0); // Sits at Y range [-2, 0] under the kaseton bottom profile at Y=0
          kGroup.add(footMesh);
        });
      }
    }
  }

  // 7.6. GENEROWANIE PODWIESZENIA (dla konfiguracji suspended)
  if (config.usage === 'suspended') {
    const suspColor = isBlueprintMode ? 0xff2222 : 0x888888;
    const suspEmissive = isBlueprintMode ? 0xaa0000 : 0x000000;
    const wireMat = new THREE.MeshStandardMaterial({ color: suspColor, emissive: suspEmissive, emissiveIntensity: isBlueprintMode ? 0.6 : 0, roughness: 0.3, metalness: 0.9 });
    const eyeletMat = new THREE.MeshStandardMaterial({ color: suspColor, emissive: suspEmissive, emissiveIntensity: isBlueprintMode ? 0.6 : 0, roughness: 0.3, metalness: 0.8 });

    // Calculate eyelet X positions on top profile
    const eyeletXPositions = [-W / 2 + 1.5, W / 2 - 1.5];

    // Add eyelets at cuts (30mm = 3cm offset each side)
    if (numCutsW > 0) {
      cutX.forEach(cx => {
        eyeletXPositions.push(cx - 3);
        eyeletXPositions.push(cx + 3);
      });
    }

    // Check segments between cuts for >200cm spans
    const topEdges = [-W / 2];
    cutX.forEach(cx => topEdges.push(cx));
    topEdges.push(W / 2);
    for (let i = 0; i < topEdges.length - 1; i++) {
      const segLen = topEdges[i + 1] - topEdges[i];
      if (segLen > 200) {
        eyeletXPositions.push((topEdges[i] + topEdges[i + 1]) / 2);
      }
    }

    // Deduplicate
    const uniqueEyelets = [];
    eyeletXPositions.forEach(x => {
      if (!uniqueEyelets.some(ux => Math.abs(ux - x) < 1)) {
        uniqueEyelets.push(x);
      }
    });
    uniqueEyelets.sort((a, b) => a - b);

    const wireLen = 200; // 2m wire going up
    let firstEyeletLabeled = false;
    uniqueEyelets.forEach(x => {
      // Eyelet ring (torus) on top profile
      const eyeletGeom = new THREE.TorusGeometry(0.5, 0.15, 8, 16);
      const eyelet = new THREE.Mesh(eyeletGeom, eyeletMat);
      eyelet.position.set(x, elevY + H + 0.5, 0);
      eyelet.rotation.x = Math.PI / 2;
      kGroup.add(eyelet);

      // Steel wire going up
      const wireGeom = new THREE.CylinderGeometry(0.1, 0.1, wireLen, 6);
      const wire = new THREE.Mesh(wireGeom, wireMat);
      wire.position.set(x, elevY + H + 0.5 + wireLen / 2, 0);
      kGroup.add(wire);

      // Blueprint label for first eyelet only
      if (isBlueprintMode && !firstEyeletLabeled) {
        firstEyeletLabeled = true;
        addTechnicalLabel3D(
          new THREE.Vector3(x, elevY + H + wireLen * 0.4, 0),
          'ZESTAW DO PODWIESZENIA ∅2MM',
          new THREE.Vector3(30, 20, 15)
        );
      }
    });

    window.currentKasetonConfig.numSuspensionSets = uniqueEyelets.length;

    // Wieszaki (metalowe płytki z tyłu kasetonu)
    if (sys === 'STF' || sys === 'STFL' || sys === 'DTF') {
      const plateGeom = new THREE.BoxGeometry(4, 6, 0.1);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
      const leftPlate = new THREE.Mesh(plateGeom, plateMat);
      leftPlate.position.set(-W / 2 + 5, elevY + H - 3, pD / 2 + 0.05);
      kGroup.add(leftPlate);

      const rightPlate = new THREE.Mesh(plateGeom, plateMat);
      rightPlate.position.set(W / 2 - 5, elevY + H - 3, pD / 2 + 0.05);
      kGroup.add(rightPlate);
    }
  }

  // 8. GENEROWANIE TKANINY REKLAMOWEJ (WYDRUKI)
  const printOption = config.print || 'single';
  if (printOption !== 'no_print' && !isBlueprintMode) {
    const printW = W - 0.4;
    const printH = H - 0.4;
    const planeGeom = new THREE.PlaneGeometry(printW, printH);
    const pD = (sys === 'LMS') ? 12.0 : (sys === 'LMSM' ? 6.5 : (sys === 'DTF' ? 4.5 : (sys === 'STF' ? 2.6 : (sys === 'STFL' ? 1.6 : 14.0))));


    // Przód
    const hasFrontMesh = (sys === 'LMS')
      ? ['backlit_white', 'backlit_blockout'].includes(printOption)
      : ['single', 'double', 'front_blockout', 'front_blockout_2', 'double_blockout'].includes(printOption);

    if (hasFrontMesh) {
      const isFrontBlockout = (printOption === 'front_blockout' || printOption === 'double_blockout');
      const frontMat = getPrintMaterial(config.textureFront, isFrontBlockout);
      const frontPrint = new THREE.Mesh(planeGeom, frontMat);
      frontPrint.position.set(0, elevY + H / 2, -pD / 2 + 0.2);
      frontPrint.rotation.y = Math.PI;
      frontPrint.userData = { isKasetonPrint: true, side: 'front' };
      kGroup.add(frontPrint);
    }

    // Tył
    const hasBackMesh = (sys === 'LMS')
      ? ['backlit_white', 'backlit_blockout', 'back_white'].includes(printOption)
      : ['single', 'double', 'front_blockout', 'front_blockout_2', 'back_blockout', 'double_blockout'].includes(printOption);

    if (hasBackMesh) {
      const isBackBlockout = (sys === 'LMS')
        ? ['backlit_blockout'].includes(printOption)
        : ['single', 'front_blockout', 'front_blockout_2', 'back_blockout', 'double_blockout'].includes(printOption);

      const backMat = getPrintMaterial(config.textureBack, isBackBlockout);
      const backPrint = new THREE.Mesh(planeGeom, backMat);
      backPrint.position.set(0, elevY + H / 2, pD / 2 - 0.2);
      backPrint.rotation.y = 0;
      backPrint.userData = { isKasetonPrint: true, side: 'back' };
      kGroup.add(backPrint);
    }

    // 8.5. EFEKTOWNE OŚWIETLENIE KRAWĘDZIOWE LED (GŁĘBIA BARW I REALISTYCZNY BLOOM)
    if (isLedSys) {
      const ledOption = config.light || 'power_around';
      const drawBottom = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
      const drawTop = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
      const drawLeft = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));
      const drawRight = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));

      const hasFrontBacklight = (printOption !== 'back_blockout');
      const hasBackBacklight = (printOption === 'double');

      const addEdgeLights = (x, y, isFront) => {
        const zPos = isFront ? -7.3 : 7.3;
        const pLight = new THREE.PointLight(0xfffae8, 4.5, 35); // Ciepłe, naturalne światło LED o szybkim zanikaniu
        pLight.position.set(x, y, zPos);
        kGroup.add(pLight);
      };

      // Dół
      if (drawBottom) {
        const steps = [-W * 0.35, -W * 0.15, 0, W * 0.15, W * 0.35];
        steps.forEach(x => {
          if (hasFrontBacklight) addEdgeLights(x, elevY + 3.5, true);
          if (hasBackBacklight) addEdgeLights(x, elevY + 3.5, false);
        });
      }
      // Góra
      if (drawTop) {
        const steps = [-W * 0.35, -W * 0.15, 0, W * 0.15, W * 0.35];
        steps.forEach(x => {
          if (hasFrontBacklight) addEdgeLights(x, elevY + H - 3.5, true);
          if (hasBackBacklight) addEdgeLights(x, elevY + H - 3.5, false);
        });
      }
      // Lewo
      if (drawLeft) {
        const steps = [elevY + H * 0.15, elevY + H * 0.35, elevY + H * 0.5, elevY + H * 0.65, elevY + H * 0.85];
        steps.forEach(y => {
          if (hasFrontBacklight) addEdgeLights(-W / 2 + 3.5, y, true);
          if (hasBackBacklight) addEdgeLights(-W / 2 + 3.5, y, false);
        });
      }
      // Prawo
      if (drawRight) {
        const steps = [elevY + H * 0.15, elevY + H * 0.35, elevY + H * 0.5, elevY + H * 0.65, elevY + H * 0.85];
        steps.forEach(y => {
          if (hasFrontBacklight) addEdgeLights(W / 2 - 3.5, y, true);
          if (hasBackBacklight) addEdgeLights(W / 2 - 3.5, y, false);
        });
      }

      // Delikatne doświetlenie środka płótna, eliminujące czarne plamy bez spłaszczania kolorów
      if (hasFrontBacklight) {
        const frontFill = new THREE.PointLight(0xfff5e6, 1.5, 200);
        frontFill.position.set(0, elevY + H / 2, -9.0);
        kGroup.add(frontFill);
      }
      if (hasBackBacklight) {
        const backFill = new THREE.PointLight(0xfff5e6, 1.5, 200);
        backFill.position.set(0, elevY + H / 2, 9.0);
        kGroup.add(backFill);
      }
    }
  }

  // 9. ZASILACZ 3D MODEL
  if (isLedSys && config.power !== 'none') {
    const ledOption = config.light || 'power_long';
    let psuType = config.power || 'internal';
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

    // NOWA LOGIKA DOBORU ZASILACZY:
    // 1. Zapas 10% mocy (reqPower = totalPowerW * 1.1)
    // 2. Jeśli N > 1, zasilacze muszą być identyczne (nie mieszamy mocy) i ich liczba musi być parzysta.
    // 3. Preferujemy mniejszą liczbę sztuk, a przy równej liczbie sztuk - mniejszy nadmiar mocy.
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

    // Sortowanie kandydatów:
    // 1. Liczba zasilaczy (mniejsza = lepsza)
    // 2. Łączna moc (mniejsza = lepsza)
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
        bestCombo.push(best.psu);
      }
    }

    window.currentKasetonConfig.psuCombo = bestCombo.map(p => p.name);

    const psuBoxW = 12, psuBoxH = 3, psuBoxD = 4;
    const psuMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.3 });
    const psuGeom = new THREE.BoxGeometry(psuBoxW, psuBoxH, psuBoxD);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85, metalness: 0.1 });

    if (psuType === 'internal') {
      const drawBottom = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
      const drawTop = ledOption.includes('around') || (W >= H && ledOption.includes('long')) || (W < H && ledOption.includes('short'));
      const drawLeft = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));
      const drawRight = ledOption.includes('around') || (W < H && ledOption.includes('long')) || (W >= H && ledOption.includes('short'));

      const emptyProfiles = [];
      if (!drawBottom) emptyProfiles.push({ axis: 'x', y: elevY + 2, rot: 0, len: W });
      if (!drawTop) emptyProfiles.push({ axis: 'x', y: elevY + H - 2, rot: 0, len: W });
      if (!drawLeft) emptyProfiles.push({ axis: 'y', x: -W / 2 + 2, rot: Math.PI / 2, len: H });
      if (!drawRight) emptyProfiles.push({ axis: 'y', x: W / 2 - 2, rot: Math.PI / 2, len: H });

      if (emptyProfiles.length === 0) emptyProfiles.push({ axis: 'x', y: elevY + 2, rot: 0, len: W });

      const cableRedMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.85, metalness: 0.1 });
      const cableBlackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85, metalness: 0.1 });

      bestCombo.forEach((psu, i) => {
        const prof = emptyProfiles[i % emptyProfiles.length];
        const idxOnProf = Math.floor(i / emptyProfiles.length);

        const pMesh = new THREE.Mesh(psuGeom, psuMat);
        pMesh.rotation.z = prof.rot;

        let px, py;
        if (prof.axis === 'x') {
          px = -W / 2 + 15 + idxOnProf * 20; // Start near left corner
          py = prof.y;
          if (px > W / 2 - 10) px = W / 2 - 10;
        } else {
          px = prof.x;
          py = elevY + 15 + idxOnProf * 20; // Start near bottom corner
          if (py > elevY + H - 10) py = elevY + H - 10;
        }

        pMesh.position.set(px, py, 0);
        kGroup.add(pMesh);

        // Red cable to nearest corner (where LED starts)
        const cx = px < 0 ? -W / 2 + 2 : W / 2 - 2;
        const cy = py < elevY + H / 2 ? elevY + 2 : elevY + H - 2;
        const startPt = new THREE.Vector3(px, py, 0);
        const cornerPt = new THREE.Vector3(cx, cy, 0);
        const cGeomRed = new THREE.TubeGeometry(new THREE.LineCurve3(startPt, cornerPt), 8, 0.15, 6, false);
        kGroup.add(new THREE.Mesh(cGeomRed, cableRedMat));

        // Black power cable routing to the nearest exit corner (bottom-left or bottom-right)
        const exitX = px < 0 ? -W / 2 + 2 : W / 2 - 2;
        const exitPtInside = new THREE.Vector3(exitX, elevY + 2, 0);
        if (startPt.distanceTo(exitPtInside) > 5) {
          const cGeomBlack = new THREE.TubeGeometry(new THREE.LineCurve3(startPt, exitPtInside), 8, 0.18, 6, false);
          kGroup.add(new THREE.Mesh(cGeomBlack, cableBlackMat));
        }

        // Coiled main power cable exiting the kaseton at this corner
        const coilPts = [
          exitPtInside,
          new THREE.Vector3(exitX, elevY, 5), // pass through fabric
          new THREE.Vector3(exitX + (px < 0 ? -3 : 3), elevY - 5, 8)
        ];
        let angle = 0;
        for (let j = 0; j <= 25; j++) {
          const t = j / 25;
          const r = 3 + t * 2;
          const cx_coil = exitX + (px < 0 ? -5 : 5) + Math.cos(angle) * r * (px < 0 ? 1 : -1);
          const cz_coil = 12 + Math.sin(angle) * r;
          const cy_coil = elevY - 10 - t * 6;
          coilPts.push(new THREE.Vector3(cx_coil, cy_coil, cz_coil));
          angle += Math.PI * 0.45;
        }
        const coilCurve = new THREE.CatmullRomCurve3(coilPts);
        const coilGeom = new THREE.TubeGeometry(coilCurve, 64, 0.25, 8, false);
        kGroup.add(new THREE.Mesh(coilGeom, cableBlackMat));
      });
    } else {
      const cableRedMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.85, metalness: 0.1 });
      const cableBlackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85, metalness: 0.1 });

      bestCombo.forEach((psu, i) => {
        const pMesh = new THREE.Mesh(psuGeom, psuMat);
        const px = -W / 2 - 10 - i * 20;
        const py = elevY - 15;
        pMesh.position.set(px, py, 5);
        kGroup.add(pMesh);

        // Red cable from Kaseton corner to PSU
        const startPt = new THREE.Vector3(-W / 2, elevY, 5);
        const endPt = new THREE.Vector3(px, py + psuBoxH / 2, 5);
        const cGeomRed = new THREE.TubeGeometry(new THREE.LineCurve3(startPt, endPt), 8, 0.15, 6, false);
        kGroup.add(new THREE.Mesh(cGeomRed, cableRedMat));

        // Black coiled cable from PSU
        const coilPts = [new THREE.Vector3(px, py - psuBoxH / 2, 5)];
        let angle = 0;
        for (let j = 0; j <= 15; j++) {
          const t = j / 15;
          const r = 2 + t;
          const cx_coil = px - 3 + Math.cos(angle) * r;
          const cz_coil = 8 + Math.sin(angle) * r;
          const cy_coil = py - 3 - t * 4;
          coilPts.push(new THREE.Vector3(cx_coil, cy_coil, cz_coil));
          angle += Math.PI * 0.6;
        }
        const coilCurve = new THREE.CatmullRomCurve3(coilPts);
        const coilGeom = new THREE.TubeGeometry(coilCurve, 32, 0.25, 8, false);
        kGroup.add(new THREE.Mesh(coilGeom, cableBlackMat));
      });
    }
  }

  // 10. LINIE WYMIAROWE I NAPISY
  if (!isBlueprintMode) {
    const dimWSprite = createTextSprite(W + " cm", "var(--kaseton-neon, #00e5ff)", 24);
    dimWSprite.position.set(0, elevY - 14, 15);
    kGroup.add(dimWSprite);

    const dimHSprite = createTextSprite(H + " cm", "var(--kaseton-neon, #00e5ff)", 24);
    dimHSprite.position.set(W / 2 + 18, elevY + H / 2, 0);
    kGroup.add(dimHSprite);

    const titleSprite = createTextSprite("SYSTEM " + sys + " (" + W + "x" + H + " cm)", "var(--kaseton-neon, #00e5ff)", 28);
    titleSprite.position.set(0, elevY + H + 25, 0);
    kGroup.add(titleSprite);
  } else {
    // ═══════════════════════════════════════════════════════════
    // TRYB TECHNICZNY – PONUMEROWANE KÓŁKA + PANEL LEGENDY
    // ═══════════════════════════════════════════════════════════
    const BADGE_COLORS = ['#00e5ff', '#00ff99', '#ffcc00', '#ff8c00', '#ff4466', '#aa66ff', '#66ccff', '#ccff66'];
    const labelRegistry = new Map();
    const legendItems = [];

    function addNumberedMarker(key, targetPt, name, desc) {
      if (labelRegistry.has(key)) return;
      const idx = legendItems.length;
      labelRegistry.set(key, idx);
      const color = BADGE_COLORS[idx % BADGE_COLORS.length];
      legendItems.push({ num: idx + 1, name, desc: desc || '', color });

      // Numbered circle sprite
      const cvs = document.createElement('canvas');
      cvs.width = 128; cvs.height = 128;
      const cx = cvs.getContext('2d');
      // Glow
      const grad = cx.createRadialGradient(64, 64, 20, 64, 64, 60);
      grad.addColorStop(0, color + 'cc'); grad.addColorStop(1, color + '00');
      cx.fillStyle = grad;
      cx.beginPath(); cx.arc(64, 64, 60, 0, Math.PI * 2); cx.fill();
      // Solid circle
      cx.fillStyle = color;
      cx.beginPath(); cx.arc(64, 64, 36, 0, Math.PI * 2); cx.fill();
      // Number
      cx.fillStyle = '#000'; cx.font = 'bold 42px Arial';
      cx.textAlign = 'center'; cx.textBaseline = 'middle';
      cx.fillText(String(idx + 1), 64, 65);

      const tex = new THREE.CanvasTexture(cvs);
      const spMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true });
      const sprite = new THREE.Sprite(spMat);
      sprite.scale.set(14, 14, 1);
      const spritePos = targetPt.clone().add(new THREE.Vector3(0, 4, 4));
      sprite.position.copy(spritePos);
      sprite.renderOrder = 1001;
      kGroup.add(sprite);

      // Thin leader line
      const lMat = new THREE.LineBasicMaterial({ color: parseInt(color.replace('#', ''), 16), depthTest: false, transparent: true, opacity: 0.6 });
      const lGeo = new THREE.BufferGeometry().setFromPoints([targetPt, spritePos.clone().add(new THREE.Vector3(0, -7, -4))]);
      kGroup.add(new THREE.Line(lGeo, lMat));
    }

    // ── A) Profil główny ──
    addNumberedMarker('MAIN_PROFILE',
      new THREE.Vector3(-W / 3, elevY, 0),
      sys === 'LMS' ? 'Profil LMS' : 'Profil LMD odchudzony',
      'Profil obwodowy kasetonu');

    // ── B) Narożnik ──
    addNumberedMarker('CORNER',
      new THREE.Vector3(-W / 2, elevY, 0),
      'ADFRAME LMD Narożnik wzmacniany',
      '4 szt. – po jednym na każdy narożnik');

    // ── C) Supporty + zamki ──
    if (numCutsW > 0 || numCutsH > 0) {
      if (cutX.length > 0) {
        addNumberedMarker('SUPPORT',
          new THREE.Vector3(cutX[0], elevY + H / 2, 0),
          'Profil Support Light',
          cutX.length + ' szt. – poprzeczki poziome');
        addNumberedMarker('LOCK',
          new THREE.Vector3(cutX[0], elevY + 5, 0),
          'ADFRAME Support Zamek',
          'Mocowanie supportu do profilu');
        addNumberedMarker('LONG_CONNECTOR',
          new THREE.Vector3(cutX[0], elevY, 5.4),
          'ADFRAME LMD Łącznik 180° Długi',
          'Łączy dwa segmenty profilu w linii');
      } else if (cutY.length > 0) {
        addNumberedMarker('SUPPORT_V',
          new THREE.Vector3(-W / 2, cutY[0], 0),
          'Profil Support Light (pionowy)',
          cutY.length + ' szt. – poprzeczki pionowe');
        addNumberedMarker('LONG_CONNECTOR',
          new THREE.Vector3(-W / 2, cutY[0], 5.4),
          'ADFRAME LMD Łącznik 180° Długi',
          'Łączy dwa segmenty profilu w linii');
      }
    }

    // ── D) Zasilacz ──
    if (config.power !== 'none' && isLedSys) {
      const psuType = (config.light || '').includes('around') ? 'zewnętrzny' : 'wewnętrzny';
      addNumberedMarker('PSU',
        new THREE.Vector3(0, elevY + 15, 0),
        'Zasilacz LED ' + psuType,
        'Moc: ~' + Math.ceil(totalPowerW * 1.1) + ' W');
    }

    // ── E) Taśma LED ──
    if (isLedSys && config.light && config.light !== 'none') {
      let ledDesc = '';

      // Jeśli mamy zebrane dane o konkretnych modułach, budujemy ładny string
      if (window.kasetonLedSummary && Object.keys(window.kasetonLedSummary).length > 0) {
        ledDesc = Object.entries(window.kasetonLedSummary)
          .map(([name, count]) => `${name} (${count} szt.)`)
          .join(', ');
      } else {
        ledDesc = (config.light || '').replace(/_/g, ' ');
      }

      // Przekazujemy ładne podsumowanie do okienka po lewej stronie!
      addNumberedMarker('LED_STRIP',
        new THREE.Vector3(0, elevY + H * 0.75, -pD / 2 + 2),
        'Taśma LED',
        ledDesc
      );
    }

    // Publikuj dane do panelu HTML
    window.blueprintLegendItems = legendItems;
    window.blueprintDimensions = { W, H, sys };

    // ── F) Miarki wymiarowe (ruler tapes) ──
    const pW1 = new THREE.Vector3(-W / 2, elevY, 0);
    const pW2 = new THREE.Vector3(W / 2, elevY, 0);
    kGroup.add(addDimension3D(pW1, pW2, W + ' cm', new THREE.Vector3(0, -25, 0), 1.3));

    const pH1 = new THREE.Vector3(W / 2, elevY, 0);
    const pH2 = new THREE.Vector3(W / 2, elevY + H, 0);
    kGroup.add(addDimension3D(pH1, pH2, H + ' cm', new THREE.Vector3(25, 0, 0), 1.3));
  }

  if (config.usage === 'wall') {
    const wallGroup = new THREE.Group();
    wallGroup.name = "WallGroup";
    wallGroup.position.z = 0.02; // Przesunięcie ściany o 0.2mm w celu uniknięcia kolizji i Z-fighting z ramą kasetonu

    // Drzwi szklane dwyskrzydłowe o wysokości 250 cm
    const doorW = 120; // Dwuskrzydłowe, łącznie 120 cm szerokości (skrzydło 60 cm)
    const doorLeafW = doorW / 2;
    const doorH = 250;
    const doorD = 2;
    
    // Szara ściana za kasetonem o wysokości co najmniej 500 cm i minimum 300 cm po bokach drzwi
    const wallH = Math.max(500, (elevY + H) + 50);
    const wallD = 10; // grubość ściany 10 cm
    // Generator proceduralnej tekstury tynku/gipsu o wysokim realizmie (bump mapy)
    const createPlasterTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Neutralne średnio-szare tło jako mapa wysokości
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 512, 512);
      
      // Generowanie drobnoziarnistego szumu tynku
      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        let noise = (Math.random() - 0.5) * 14;
        data[i]     += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      }
      ctx.putImageData(imgData, 0, 0);
      
      // Dodawanie większych, nieregularnych plam tynku dla efektu organiczności
      for (let i = 0; i < 45; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 8 + Math.random() * 25;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const alpha = 0.04 + Math.random() * 0.05;
        const colorVal = Math.random() > 0.5 ? 255 : 0;
        grad.addColorStop(0, `rgba(${colorVal},${colorVal},${colorVal},${alpha})`);
        grad.addColorStop(1, 'rgba(128,128,128,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
      return texture;
    };

    const plasterTex = createPlasterTexture();
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd, // Elegancki, matowy, lekko ciepły jasnoszary/off-white kolor ściany
      roughness: 0.95,
      metalness: 0.0,
      bumpMap: plasterTex,
      bumpScale: 0.04,
      name: 'wall_plaster'
    });
    
    // Budujemy ścianę z wycięciami na drzwi (struktura architektoniczna)
    // 1. Środkowy segment ściany (między drzwiami lewymi i prawymi)
    const middleWallW = W + 300; // 150 cm po każdej stronie kasetonu do drzwi
    const middleWallGeom = new THREE.BoxGeometry(middleWallW, wallH, wallD);
    const middleWallMesh = new THREE.Mesh(middleWallGeom, wallMat);
    middleWallMesh.position.set(0, wallH / 2, pD / 2 + wallD / 2);
    middleWallMesh.castShadow = true;
    middleWallMesh.receiveShadow = true;
    wallGroup.add(middleWallMesh);

    // 2. Nadproża (lintels) i ściany boczne za drzwiami (przedłużone o 10m = 1300 cm)
    const sideWallW = 1300;
    const lintelH = wallH - doorH;
    
    const sideWallGeom = new THREE.BoxGeometry(sideWallW, wallH, wallD);
    const lintelGeom = new THREE.BoxGeometry(doorW, lintelH, wallD);
    
    // Lewe skrzydło ścienne (boczne)
    const leftSideWall = new THREE.Mesh(sideWallGeom, wallMat);
    leftSideWall.position.set(-middleWallW / 2 - doorW - sideWallW / 2, wallH / 2, pD / 2 + wallD / 2);
    leftSideWall.castShadow = true;
    leftSideWall.receiveShadow = true;
    wallGroup.add(leftSideWall);
    
    // Lewe nadproże (nad lewymi drzwiami)
    const leftLintel = new THREE.Mesh(lintelGeom, wallMat);
    leftLintel.position.set(-middleWallW / 2 - doorW / 2, doorH + lintelH / 2, pD / 2 + wallD / 2);
    leftLintel.castShadow = true;
    leftLintel.receiveShadow = true;
    wallGroup.add(leftLintel);
    
    // Prawe skrzydło ścienne (boczne)
    const rightSideWall = new THREE.Mesh(sideWallGeom, wallMat);
    rightSideWall.position.set(middleWallW / 2 + doorW + sideWallW / 2, wallH / 2, pD / 2 + wallD / 2);
    rightSideWall.castShadow = true;
    rightSideWall.receiveShadow = true;
    wallGroup.add(rightSideWall);
    
    // Prawe nadproże (nad prawymi drzwiami)
    const rightLintel = new THREE.Mesh(lintelGeom, wallMat);
    rightLintel.position.set(middleWallW / 2 + doorW / 2, doorH + lintelH / 2, pD / 2 + wallD / 2);
    rightLintel.castShadow = true;
    rightLintel.receiveShadow = true;
    wallGroup.add(rightLintel);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f7fa,
      transparent: true,
      opacity: 1.0,
      transmission: 0.9,
      roughness: 0.05,
      metalness: 0.1,
      ior: 1.5,
      thickness: doorD,
      depthWrite: false, // Poprawne renderowanie obiektów przezroczystych za szkłem
      name: 'glass_door'
    });
    
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.9
    });

    const doorLeafGeom = new THREE.BoxGeometry(doorLeafW, doorH, doorD);
    const frameGeom = new THREE.BoxGeometry(doorW + 2, doorH + 2, doorD + 0.4);
    const frameEdges = new THREE.EdgesGeometry(frameGeom);
    const frameLineMat = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2 });
    
    // Pionowe uchwyty drzwi: rurka 80 cm, średnica 0.8 cm (promień 0.4)
    const handleBarGeom = new THREE.CylinderGeometry(0.4, 0.4, 80, 16);
    const handleSupportGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);

    const setupDoubleDoor = (doorCenterX) => {
      // Skrzydło lewe
      const leafL = new THREE.Mesh(doorLeafGeom, glassMat);
      leafL.position.set(doorCenterX - doorLeafW / 2, doorH / 2, pD / 2 + doorD / 2);
      wallGroup.add(leafL);
      
      // Skrzydło prawe
      const leafR = new THREE.Mesh(doorLeafGeom, glassMat);
      leafR.position.set(doorCenterX + doorLeafW / 2, doorH / 2, pD / 2 + doorD / 2);
      wallGroup.add(leafR);
      
      // Ościeżnica
      const frameLine = new THREE.LineSegments(frameEdges, frameLineMat);
      frameLine.position.set(doorCenterX, doorH / 2, pD / 2 + doorD / 2);
      wallGroup.add(frameLine);
      
      // Dodajemy pionowe uchwyty przy krawędziach styku skrzydeł (X = doorCenterX)
      // Uchwyt dla lewego skrzydła (przesunięty o 3 cm w lewo od styku)
      const handleLX = doorCenterX - 3;
      
      // Uchwyty od strony frontowej (pokój)
      const hBarL_F = new THREE.Mesh(handleBarGeom, handleMat);
      hBarL_F.position.set(handleLX, 120, pD / 2 + doorD + 1.5);
      wallGroup.add(hBarL_F);
      
      const hSupL1_F = new THREE.Mesh(handleSupportGeom, handleMat);
      hSupL1_F.position.set(handleLX, 90, pD / 2 + doorD + 0.75);
      hSupL1_F.rotation.x = Math.PI / 2;
      wallGroup.add(hSupL1_F);
      
      const hSupL2_F = hSupL1_F.clone();
      hSupL2_F.position.y = 150;
      wallGroup.add(hSupL2_F);

      // Uchwyty od strony tylnej (zewnętrznej)
      const hBarL_B = new THREE.Mesh(handleBarGeom, handleMat);
      hBarL_B.position.set(handleLX, 120, pD / 2 - 1.5);
      wallGroup.add(hBarL_B);
      
      const hSupL1_B = new THREE.Mesh(handleSupportGeom, handleMat);
      hSupL1_B.position.set(handleLX, 90, pD / 2 - 0.75);
      hSupL1_B.rotation.x = -Math.PI / 2;
      wallGroup.add(hSupL1_B);
      
      const hSupL2_B = hSupL1_B.clone();
      hSupL2_B.position.y = 150;
      wallGroup.add(hSupL2_B);

      // Uchwyt dla prawego skrzydła (przesunięty o 3 cm w prawo od styku)
      const handleRX = doorCenterX + 3;
      
      // Uchwyty od strony frontowej (pokój)
      const hBarR_F = new THREE.Mesh(handleBarGeom, handleMat);
      hBarR_F.position.set(handleRX, 120, pD / 2 + doorD + 1.5);
      wallGroup.add(hBarR_F);
      
      const hSupR1_F = new THREE.Mesh(handleSupportGeom, handleMat);
      hSupR1_F.position.set(handleRX, 90, pD / 2 + doorD + 0.75);
      hSupR1_F.rotation.x = Math.PI / 2;
      wallGroup.add(hSupR1_F);
      
      const hSupR2_F = hSupR1_F.clone();
      hSupR2_F.position.y = 150;
      wallGroup.add(hSupR2_F);

      // Uchwyty od strony tylnej (zewnętrznej)
      const hBarR_B = new THREE.Mesh(handleBarGeom, handleMat);
      hBarR_B.position.set(handleRX, 120, pD / 2 - 1.5);
      wallGroup.add(hBarR_B);
      
      const hSupR1_B = new THREE.Mesh(handleSupportGeom, handleMat);
      hSupR1_B.position.set(handleRX, 90, pD / 2 - 0.75);
      hSupR1_B.rotation.x = -Math.PI / 2;
      wallGroup.add(hSupR1_B);
      
      const hSupR2_B = hSupR1_B.clone();
      hSupR2_B.position.y = 150;
      wallGroup.add(hSupR2_B);
    };

    // Generujemy lewy i prawy zestaw drzwi
    setupDoubleDoor(-middleWallW / 2 - doorW / 2);
    setupDoubleDoor(middleWallW / 2 + doorW / 2);

    // Generator proceduralnej ciemniejszej tekstury drewna z horyzontalnymi słojami
    const createWoodTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Bazowy ciemniejszy kolor drewna (np. orzech włoski / ciemny dąb)
      ctx.fillStyle = '#664024';
      ctx.fillRect(0, 0, 512, 512);
      
      // Rysowanie słojów drewna horyzontalnie (wzdłuż osi X)
      for (let x = 0; x < 512; x += 3) {
        let yOffset = Math.sin(x * 0.035) * 15 + Math.sin(x * 0.007) * 30;
        yOffset += (Math.random() - 0.5) * 1.5;
        
        for (let y = -60; y < 572; y += 40) {
          const py = y + yOffset;
          ctx.strokeStyle = `rgba(50, 26, 8, ${0.12 + Math.random() * 0.16})`;
          ctx.lineWidth = 1 + Math.random() * 1.5;
          ctx.beginPath();
          ctx.moveTo(x, py);
          ctx.lineTo(x + 3, py + (Math.random() - 0.5) * 3);
          ctx.stroke();
        }
      }
      
      // Dodawanie horyzontalnych sęków
      for (let k = 0; k < 4; k++) {
        const kx = Math.random() * 512;
        const ky = Math.random() * 512;
        const kr = 15 + Math.random() * 20;
        
        for (let r = kr; r > 3; r -= 3) {
          ctx.strokeStyle = `rgba(40, 18, 2, ${0.06 + (1 - r/kr) * 0.22})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          // Horyzontalna elipsa (szeroka, spłaszczona w Y)
          ctx.ellipse(kx, ky, r, r * 0.45, Math.PI / 16 + (Math.random() - 0.5) * 0.1, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const woodTex = createWoodTexture();
    
    // Tworzymy zestaw 10 materiałów z losowym przesunięciem tekstury wzdłuż osi X i Y
    const woodMaterials = [];
    for (let i = 0; i < 10; i++) {
      const tex = woodTex.clone();
      tex.offset.set(Math.random(), Math.random());
      tex.needsUpdate = true;
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        bumpMap: tex,
        bumpScale: 0.02,
        roughness: 0.88, // Matowe wykończenie
        metalness: 0.04,
        name: 'wood_plank_' + i
      });
      woodMaterials.push(mat);
    }

    const plankH = 20;  // Wysokość deski 20 cm
    const plankL = 100; // Długość deski 100 cm
    const plankD = 1.5; // Grubość deski 1.5 cm

    // Proceduralne układanie desek w sposób cegiełkowy i przycinanie przy krawędziach
    const buildPlanks = (xMin, xMax) => {
      // Dwa rzędy desek: rząd 0 (Y=110 cm) i rząd 1 (Y=130 cm)
      for (let row = 0; row < 2; row++) {
        const yCenter = 110 + row * 20;
        
        // Przesunięcie cegiełkowe o połowę długości (50cm) dla górnego rzędu
        const startXOffset = row === 1 ? -50 : 0;
        
        // Obliczamy zakres indeksów desek, które mogą zachodzić na [xMin, xMax]
        const firstIdx = Math.floor((xMin - startXOffset) / plankL);
        const lastIdx = Math.ceil((xMax - startXOffset) / plankL);
        
        for (let i = firstIdx; i <= lastIdx; i++) {
          const plankStartX = startXOffset + i * plankL;
          const plankEndX = plankStartX + plankL;
          
          // Przycięcie deski do obszaru ściany (np. przy ościeżnicy drzwi)
          const finalStartX = Math.max(plankStartX, xMin);
          const finalEndX = Math.min(plankEndX, xMax);
          
          if (finalEndX > finalStartX) {
            const width = finalEndX - finalStartX;
            const cx = finalStartX + width / 2;
            
            // BoxGeometry z dylatacjami 1mm po bokach i 2mm w pionie
            const plankGeom = new THREE.BoxGeometry(width - 0.1, plankH - 0.2, plankD);
            const plankMat = woodMaterials[Math.floor(Math.random() * woodMaterials.length)];
            const plankMesh = new THREE.Mesh(plankGeom, plankMat);
            
            plankMesh.position.set(cx, yCenter, pD / 2 - plankD / 2);
            plankMesh.castShadow = true;
            plankMesh.receiveShadow = true;
            wallGroup.add(plankMesh);
          }
        }
      }
    };

    // Układamy deski na 4 segmentach solidnych ścian (omijając drzwi i światło ramy kasetonu)
    // 1. Lewa ściana boczna
    buildPlanks(-middleWallW / 2 - doorW - sideWallW, -middleWallW / 2 - doorW);
    
    // 2. Lewy środkowy segment (między drzwiami lewymi a kasetonem)
    const midPanelW = 150;
    buildPlanks(-W / 2 - midPanelW, -W / 2);
    
    // 3. Prawy środkowy segment (między kasetonem a drzwiami prawymi)
    buildPlanks(W / 2, W / 2 + midPanelW);
    
    // 4. Prawa ściana boczna
    buildPlanks(middleWallW / 2 + doorW, middleWallW / 2 + doorW + sideWallW);

    kGroup.add(wallGroup);
  }

  kGroup.rotation.y = Math.PI;

  scene.add(kGroup);
  sceneObjects.push(kGroup);

  // 11. AUTOFOCUS KAMERY NA ŚRODEK NOWEGO KASETONU
  if (controls) {
    controls.target.set(0, elevY + H / 2, 0);
    const maxDim = Math.max(W, H);
    camera.position.set(0, elevY + H / 2 + 10, maxDim * 1.5);
    controls.update();
  }

  // 12. GENERUJ BOM
  generateKasetonBOM();

  console.log('✨ 3D Kaseton scene rendered successfully!');
}

// =================================================================
// CTF BOX SCENE — Prostopadłościan z profilami pod kątem 45° i trójdzielnymi łącznikami
// =================================================================
function drawCTFScene(config) {
  if (!scene) return;

  // Usuwamy poprzedni kaseton
  const oldKasetony = [];
  scene.traverse(obj => { if (obj.userData && obj.userData.isKaseton) oldKasetony.push(obj); });
  oldKasetony.forEach(obj => scene.remove(obj));

  const W = parseFloat(config.width) || 100;   // Szerokość (X)
  const H = parseFloat(config.depth) || 200;    // Wysokość (Y)
  const D = parseFloat(config.height3D) || 120;  // Głębokość 3D (Z)
  const elevY = config.usage === 'suspended' ? 100 : 0;

  const connLen = 6;   // Długość ramienia łącznika (60mm = 6cm od wierzchołka)
  const profW = 6;     // Szerokość profilu 60mm = 6cm
  const profT = 2;     // Grubość profilu 20mm = 2cm

  const eOffset = 2.0 / Math.sqrt(2); // Odległość krawędzi (corner) od osi (~1.41 cm)
  const gxOffset = 2.7 / Math.sqrt(2); // Odległość rowka od osi w rzucie płaskim (~1.91 cm)
  const cOffset = 4.0 / Math.sqrt(2); // Odległość krawędzi od środka w rzucie normalnym (~2.83 cm)
  const gOffset = 3.3 / Math.sqrt(2); // Odległość rowka od środka w rzucie normalnym (~2.33 cm)

  console.log('📦 Drawing CTF box in 3D:', W, 'x', H, 'x', D, 'cm');

  const kGroup = new THREE.Group();
  kGroup.userData = { isKaseton: true };

  // --- MATERIAŁY ---
  const aluMat = isBlueprintMode ? new THREE.MeshStandardMaterial({
    color: 0x4488ff,
    metalness: 0.7,
    roughness: 0.2,
    transparent: true,
    opacity: 0.2,
    name: 'ctf_aluminum_blueprint'
  }) : new THREE.MeshStandardMaterial({
    color: 0xd0d4d9,
    metalness: 0.55,
    roughness: 0.45,
    name: 'ctf_aluminum'
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x444444 });
  const supportMat = isBlueprintMode ? new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: 0x166534,
    emissiveIntensity: 0.8,
    roughness: 0.4,
    metalness: 0.2
  }) : aluMat;

  // Łącznik: satynowy szary plastik z delikatną teksturą proceduralną
  const plasticCanvas = document.createElement('canvas');
  plasticCanvas.width = 128;
  plasticCanvas.height = 128;
  const pCtx = plasticCanvas.getContext('2d');
  pCtx.fillStyle = '#909090'; // Neutralny szary plastik
  pCtx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const a = Math.random() * 0.06;
    pCtx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    pCtx.fillRect(x, y, 1, 1);
  }
  const plasticTex = new THREE.CanvasTexture(plasticCanvas);
  plasticTex.wrapS = THREE.RepeatWrapping;
  plasticTex.wrapT = THREE.RepeatWrapping;

  const connMat = isBlueprintMode ? new THREE.MeshStandardMaterial({
    color: 0x4488ff,
    metalness: 0.7,
    roughness: 0.2,
    transparent: true,
    opacity: 0.2,
    name: 'ctf_connector_blueprint'
  }) : new THREE.MeshStandardMaterial({
    map: plasticTex,
    color: 0xdddddd, // Rozjaśnienie tekstury bazowej do szarego koloru z próbki
    metalness: 0.05,
    roughness: 0.8,
    name: 'ctf_connector_plastic'
  });

  // --- FUNKCJA BAZOWA: Tworzenie profilu z rowkami ---
  function createCTFProfileMesh(length) {
    const shape = new THREE.Shape();
    shape.moveTo(-3, -1);
    shape.lineTo(-3, 1);
    shape.lineTo(3, 1);
    // Rowek 1
    shape.lineTo(3, 0.45);
    shape.lineTo(1.5, 0.45);
    shape.lineTo(1.5, 0.15);
    shape.lineTo(3, 0.15);
    // Środek
    shape.lineTo(3, -0.15);
    // Rowek 2
    shape.lineTo(1.5, -0.15);
    shape.lineTo(1.5, -0.45);
    shape.lineTo(3, -0.45);
    // Dół
    shape.lineTo(3, -1);
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false });
    geom.center();

    const mesh = new THREE.Mesh(geom, aluMat);

    // Krawędzie konturu
    const edges = new THREE.EdgesGeometry(geom);
    const line = new THREE.LineSegments(edges, edgeMat);
    mesh.add(line);

    return mesh;
  }

  // --- FUNKCJA POMOCNICZA: Pozycjonowanie i orientacja profilu ---
  function createCTFProfile(length, startPoint, endPoint, outerDir) {
    const mesh = createCTFProfileMesh(length);

    // Pozycja w połowie drogi
    const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
    mesh.position.copy(midPoint);

    // Kierunki bazowe
    const dirLong = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
    const dirOuter = outerDir.clone().normalize();
    const dirThickness = new THREE.Vector3().crossVectors(dirLong, dirOuter).normalize();

    // Ustawienie orientacji
    const matrix = new THREE.Matrix4();
    matrix.makeBasis(dirOuter, dirThickness, dirLong);
    mesh.quaternion.setFromRotationMatrix(matrix);

    return mesh;
  }

  // --- FUNKCJA: Trójdzielny łącznik narożny z mitrowaniem wierzchołka ---
  function createCTFConnector(cx, cy, cz, dx, dy, dz) {
    const cGroup = new THREE.Group();

    function createConnectorArm(startPt, endPt, outerDir, armType) {
      const shape = new THREE.Shape();
      shape.moveTo(-3, -1);
      shape.lineTo(-3, 1);
      shape.lineTo(3, 1);
      // Rowek 1
      shape.lineTo(3, 0.45);
      shape.lineTo(1.5, 0.45);
      shape.lineTo(1.5, 0.15);
      shape.lineTo(3, 0.15);
      // Środek
      shape.lineTo(3, -0.15);
      // Rowek 2
      shape.lineTo(1.5, -0.15);
      shape.lineTo(1.5, -0.45);
      shape.lineTo(3, -0.45);
      // Dół
      shape.lineTo(3, -1);
      shape.closePath();

      const overlap = 4.0;
      const totalLen = connLen + overlap;
      const geom = new THREE.ExtrudeGeometry(shape, { depth: totalLen, bevelEnabled: false });
      geom.center();

      const dirLong = new THREE.Vector3().subVectors(endPt, startPt).normalize();
      const dirOuter = outerDir.clone().normalize();
      const dirThickness = new THREE.Vector3().crossVectors(dirLong, dirOuter).normalize();

      const matrix = new THREE.Matrix4();
      matrix.makeBasis(dirOuter, dirThickness, dirLong);

      // Zastosowanie orientacji i pozycji bezpośrednio do wierzchołków
      geom.applyMatrix4(matrix);
      const midPoint = new THREE.Vector3().copy(startPt).addScaledVector(dirLong, (connLen - overlap) * 0.5);
      geom.translate(midPoint.x, midPoint.y, midPoint.z);

      // Przycinanie wierzchołków na stykach diagonalnych
      const posAttr = geom.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        v.fromBufferAttribute(posAttr, i);

        const rx = (v.x - cx) * dx;
        const ry = (v.y - cy) * dy;
        const rz = (v.z - cz) * dz;

        if (armType === 'X') {
          const rx_new = Math.max(rx, ry, rz);
          v.x = cx + rx_new * dx;
        } else if (armType === 'Y') {
          const ry_new = Math.max(ry, rx, rz);
          v.y = cy + ry_new * dy;
        } else if (armType === 'Z') {
          const rz_new = Math.max(rz, rx, ry);
          v.z = cz + rz_new * dz;
        }

        posAttr.setXYZ(i, v.x, v.y, v.z);
      }
      geom.computeVertexNormals();

      const mesh = new THREE.Mesh(geom, connMat);
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, edgeMat);
      mesh.add(line);

      return mesh;
    }

    const sX = cx < 0 ? -1 : 1;
    const sY = cy === 0 ? -1 : 1;
    const sZ = cz < 0 ? -1 : 1;

    // Ramię X
    cGroup.add(createConnectorArm(
      new THREE.Vector3(cx, cy, cz),
      new THREE.Vector3(cx + dx * connLen, cy, cz),
      new THREE.Vector3(0, sY, sZ),
      'X'
    ));

    // Ramię Y
    cGroup.add(createConnectorArm(
      new THREE.Vector3(cx, cy, cz),
      new THREE.Vector3(cx, cy + dy * connLen, cz),
      new THREE.Vector3(sX, 0, sZ),
      'Y'
    ));

    // Ramię Z
    cGroup.add(createConnectorArm(
      new THREE.Vector3(cx, cy, cz),
      new THREE.Vector3(cx, cy, cz + dz * connLen),
      new THREE.Vector3(sX, sY, 0),
      'Z'
    ));

    return cGroup;
  }

  // --- MATERIAŁ DLA TKANIN ---
  function createFabricMaterial(textureUrl, isBlockout = false) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: isBlockout ? 0.95 : 0.75,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    if (textureUrl) {
      const tex = new THREE.TextureLoader().load(textureUrl);
      tex.encoding = THREE.sRGBEncoding;
      mat.map = tex;
    } else if (isBlockout) {
      mat.color.setHex(0xeeeeee);
    }
    return mat;
  }

  // --- FUNKCJA BAZOWA: Tworzenie geometrii tkaniny z zagięciem (nieindeksowana, bez rozciągania) ---
  function createFabricGeometry(wVal, hVal) {
    const geom = new THREE.BufferGeometry();
    const hw = wVal / 2;
    const hh = hVal / 2;

    const dz = -(cOffset - gOffset); // Przesunięcie rowka w głąb (ok. -0.50 cm)
    const bw = Math.sqrt((gxOffset - eOffset) * (gxOffset - eOffset) + dz * dz); // Szerokość rozwiniętego zagięcia

    const totalW = wVal + 2 * eOffset + 2 * bw;
    const totalH = hVal + 2 * eOffset + 2 * bw;

    const vertices = [];
    const uvs = [];

    function addVertex(x, y, z) {
      vertices.push(x, y, z);

      // Obliczenie współrzędnych na płaskim rozwinięciu tkaniny
      let x_unfolded, y_unfolded;
      if (Math.abs(z) < 0.01) {
        // Wierzchołek na płaszczyźnie głównej
        x_unfolded = x;
        y_unfolded = y;
      } else {
        // Wierzchołek w rowku (zagięty)
        x_unfolded = Math.sign(x) * (hw + eOffset + bw);
        y_unfolded = Math.sign(y) * (hh + eOffset + bw);
      }

      const u = (x_unfolded + hw + eOffset + bw) / totalW;
      const v = (y_unfolded + hh + eOffset + bw) / totalH;
      uvs.push(u, v);
    }

    // Definiujemy 10 trójkątów tworzących płachtę (geometria nieindeksowana)

    // 1. Główna część płótna (2 trójkąty)
    // T1: v0, v1, v2
    addVertex(-hw - eOffset, -hh - eOffset, 0);
    addVertex(hw + eOffset, -hh - eOffset, 0);
    addVertex(hw + eOffset, hh + eOffset, 0);
    // T2: v0, v2, v3
    addVertex(-hw - eOffset, -hh - eOffset, 0);
    addVertex(hw + eOffset, hh + eOffset, 0);
    addVertex(-hw - eOffset, hh + eOffset, 0);

    // 2. Dolny pas załamania (2 trójkąty)
    // T1: v0, v4, v5
    addVertex(-hw - eOffset, -hh - eOffset, 0);
    addVertex(-hw - gxOffset, -hh - gxOffset, dz);
    addVertex(hw + gxOffset, -hh - gxOffset, dz);
    // T2: v0, v5, v1
    addVertex(-hw - eOffset, -hh - eOffset, 0);
    addVertex(hw + gxOffset, -hh - gxOffset, dz);
    addVertex(hw + eOffset, -hh - eOffset, 0);

    // 3. Prawy pas załamania (2 trójkąty)
    // T1: v1, v5, v6
    addVertex(hw + eOffset, -hh - eOffset, 0);
    addVertex(hw + gxOffset, -hh - gxOffset, dz);
    addVertex(hw + gxOffset, hh + gxOffset, dz);
    // T2: v1, v6, v2
    addVertex(hw + eOffset, -hh - eOffset, 0);
    addVertex(hw + gxOffset, hh + gxOffset, dz);
    addVertex(hw + eOffset, hh + eOffset, 0);

    // 4. Górny pas załamania (2 trójkąty)
    // T1: v2, v6, v7
    addVertex(hw + eOffset, hh + eOffset, 0);
    addVertex(hw + gxOffset, hh + gxOffset, dz);
    addVertex(-hw - gxOffset, hh + gxOffset, dz);
    // T2: v2, v7, v3
    addVertex(hw + eOffset, hh + eOffset, 0);
    addVertex(-hw - gxOffset, hh + gxOffset, dz);
    addVertex(-hw - eOffset, hh + eOffset, 0);

    // 5. Lewy pas załamania (2 trójkąty)
    // T1: v3, v7, v4
    addVertex(-hw - eOffset, hh + eOffset, 0);
    addVertex(-hw - gxOffset, hh + gxOffset, dz);
    addVertex(-hw - gxOffset, -hh - gxOffset, dz);
    // T2: v3, v4, v0
    addVertex(-hw - eOffset, hh + eOffset, 0);
    addVertex(-hw - gxOffset, -hh - gxOffset, dz);
    addVertex(-hw - eOffset, -hh - eOffset, 0);

    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geom.computeVertexNormals();
    return geom;
  }

  // --- WYMIARY PROFILI (skrócone o 2×connLen na łączniki) ---
  const profLenX = W - 2 * connLen;  // Długość profili wzdłuż X
  const profLenY = H - 2 * connLen;  // Długość profili wzdłuż Y
  const profLenZ = D - 2 * connLen;  // Długość profili wzdłuż Z

  const hw = W / 2;  // half width
  const hh = H / 2;  // half height
  const hd = D / 2;  // half depth

  // --- GENEROWANIE 12 PROFILI ---

  // 4 krawędzie pionowe (wzdłuż Y)
  const vertProfilesConfig = [
    { start: new THREE.Vector3(hw, connLen, -hd), end: new THREE.Vector3(hw, H - connLen, -hd), outer: new THREE.Vector3(1, 0, -1) },
    { start: new THREE.Vector3(-hw, connLen, -hd), end: new THREE.Vector3(-hw, H - connLen, -hd), outer: new THREE.Vector3(-1, 0, -1) },
    { start: new THREE.Vector3(hw, connLen, hd), end: new THREE.Vector3(hw, H - connLen, hd), outer: new THREE.Vector3(1, 0, 1) },
    { start: new THREE.Vector3(-hw, connLen, hd), end: new THREE.Vector3(-hw, H - connLen, hd), outer: new THREE.Vector3(-1, 0, 1) }
  ];
  vertProfilesConfig.forEach(cfg => {
    const startP = cfg.start.clone();
    startP.y += elevY;
    const endP = cfg.end.clone();
    endP.y += elevY;
    const prof = createCTFProfile(profLenY, startP, endP, cfg.outer);
    kGroup.add(prof);
  });

  // 4 krawędzie poziome wzdłuż X
  const horizXProfilesConfig = [
    { start: new THREE.Vector3(-hw + connLen, 0, -hd), end: new THREE.Vector3(hw - connLen, 0, -hd), outer: new THREE.Vector3(0, -1, -1) },
    { start: new THREE.Vector3(-hw + connLen, 0, hd), end: new THREE.Vector3(hw - connLen, 0, hd), outer: new THREE.Vector3(0, -1, 1) },
    { start: new THREE.Vector3(-hw + connLen, H, -hd), end: new THREE.Vector3(hw - connLen, H, -hd), outer: new THREE.Vector3(0, 1, -1) },
    { start: new THREE.Vector3(-hw + connLen, H, hd), end: new THREE.Vector3(hw - connLen, H, hd), outer: new THREE.Vector3(0, 1, 1) }
  ];
  horizXProfilesConfig.forEach(cfg => {
    const startP = cfg.start.clone();
    startP.y += elevY;
    const endP = cfg.end.clone();
    endP.y += elevY;
    const prof = createCTFProfile(profLenX, startP, endP, cfg.outer);
    kGroup.add(prof);
  });

  // 4 krawędzie poziome wzdłuż Z
  const horizZProfilesConfig = [
    { start: new THREE.Vector3(-hw, 0, -hd + connLen), end: new THREE.Vector3(-hw, 0, hd - connLen), outer: new THREE.Vector3(-1, -1, 0) },
    { start: new THREE.Vector3(hw, 0, -hd + connLen), end: new THREE.Vector3(hw, 0, hd - connLen), outer: new THREE.Vector3(1, -1, 0) },
    { start: new THREE.Vector3(-hw, H, -hd + connLen), end: new THREE.Vector3(-hw, H, hd - connLen), outer: new THREE.Vector3(-1, 1, 0) },
    { start: new THREE.Vector3(hw, H, -hd + connLen), end: new THREE.Vector3(hw, H, hd - connLen), outer: new THREE.Vector3(1, 1, 0) }
  ];
  horizZProfilesConfig.forEach(cfg => {
    const startP = cfg.start.clone();
    startP.y += elevY;
    const endP = cfg.end.clone();
    endP.y += elevY;
    const prof = createCTFProfile(profLenZ, startP, endP, cfg.outer);
    kGroup.add(prof);
  });

  // --- 8 ŁĄCZNIKÓW NAROŻNYCH ---
  const corners = [
    // Dolne 4 narożniki
    { x: -hw, y: 0, z: -hd, dx: 1, dy: 1, dz: 1 },
    { x: hw, y: 0, z: -hd, dx: -1, dy: 1, dz: 1 },
    { x: -hw, y: 0, z: hd, dx: 1, dy: 1, dz: -1 },
    { x: hw, y: 0, z: hd, dx: -1, dy: 1, dz: -1 },
    // Górne 4 narożniki
    { x: -hw, y: H, z: -hd, dx: 1, dy: -1, dz: 1 },
    { x: hw, y: H, z: -hd, dx: -1, dy: -1, dz: 1 },
    { x: -hw, y: H, z: hd, dx: 1, dy: -1, dz: -1 },
    { x: hw, y: H, z: hd, dx: -1, dy: -1, dz: -1 }
  ];
  corners.forEach(c => {
    const conn = createCTFConnector(c.x, c.y, c.z, c.dx, c.dy, c.dz);
    conn.position.set(0, elevY, 0); // profile positions relative to center of cuboid
    kGroup.add(conn);
  });

  // --- TKANINY REKLAMOWE (6 płacht od rowka do rowka z zagięciem) ---
  const printOption = config.print || '6_sides';
  if (printOption !== 'no_print' && !isBlueprintMode) {
    const showFront = ['6_sides', '4_sides', '5_sides_top_open', '5_sides_bottom_open', 'all_sides', 'front_back', 'single_front'].includes(printOption);
    const showBack = ['6_sides', '4_sides', '5_sides_top_open', '5_sides_bottom_open', 'all_sides', 'front_back'].includes(printOption);
    const showLeft = ['6_sides', '4_sides', '5_sides_top_open', '5_sides_bottom_open', 'all_sides'].includes(printOption);
    const showRight = ['6_sides', '4_sides', '5_sides_top_open', '5_sides_bottom_open', 'all_sides'].includes(printOption);
    const showTop = ['6_sides', '5_sides_bottom_open'].includes(printOption);
    const showBottom = ['6_sides', '5_sides_top_open'].includes(printOption);

    // 1. Przód (Z = -hd - cOffset)
    if (showFront) {
      const frontGeom = createFabricGeometry(W, H);
      const frontMat = createFabricMaterial(config.textureFront, !config.textureFront);
      const frontMesh = new THREE.Mesh(frontGeom, frontMat);
      frontMesh.position.set(0, elevY + hh, -hd - cOffset);
      frontMesh.rotation.y = Math.PI;
      frontMesh.userData = { isKasetonPrint: true, side: 'front' };
      kGroup.add(frontMesh);
    }

    // 2. Tył (Z = hd + cOffset)
    if (showBack) {
      const backGeom = createFabricGeometry(W, H);
      const backMat = createFabricMaterial(config.textureBack, !config.textureBack);
      const backMesh = new THREE.Mesh(backGeom, backMat);
      backMesh.position.set(0, elevY + hh, hd + cOffset);
      backMesh.userData = { isKasetonPrint: true, side: 'back' };
      kGroup.add(backMesh);
    }

    // 3. Lewo (X = -hw - cOffset)
    if (showLeft) {
      const leftGeom = createFabricGeometry(D, H);
      const leftMat = createFabricMaterial(config.textureLeft, !config.textureLeft);
      const leftMesh = new THREE.Mesh(leftGeom, leftMat);
      leftMesh.position.set(-hw - cOffset, elevY + hh, 0);
      leftMesh.rotation.y = -Math.PI / 2;
      leftMesh.userData = { isKasetonPrint: true, side: 'left' };
      kGroup.add(leftMesh);
    }

    // 4. Prawo (X = hw + cOffset)
    if (showRight) {
      const rightGeom = createFabricGeometry(D, H);
      const rightMat = createFabricMaterial(config.textureRight, !config.textureRight);
      const rightMesh = new THREE.Mesh(rightGeom, rightMat);
      rightMesh.position.set(hw + cOffset, elevY + hh, 0);
      rightMesh.rotation.y = Math.PI / 2;
      rightMesh.userData = { isKasetonPrint: true, side: 'right' };
      kGroup.add(rightMesh);
    }

    // 5. Góra (Y = H + cOffset)
    if (showTop) {
      const topFabGeom = createFabricGeometry(W, D);
      const topFabMat = createFabricMaterial(config.textureTop, !config.textureTop);
      const topFabMesh = new THREE.Mesh(topFabGeom, topFabMat);
      topFabMesh.position.set(0, elevY + H + cOffset, 0);
      topFabMesh.rotation.x = -Math.PI / 2;
      topFabMesh.userData = { isKasetonPrint: true, side: 'top' };
      kGroup.add(topFabMesh);
    }

    // 6. Dół (Y = -cOffset)
    if (showBottom) {
      const bottomFabGeom = createFabricGeometry(W, D);
      const bottomFabMat = createFabricMaterial(config.textureBottom, !config.textureBottom);
      const bottomFabMesh = new THREE.Mesh(bottomFabGeom, bottomFabMat);
      bottomFabMesh.position.set(0, elevY - cOffset, 0);
      bottomFabMesh.rotation.x = Math.PI / 2;
      bottomFabMesh.userData = { isKasetonPrint: true, side: 'bottom' };
      kGroup.add(bottomFabMesh);
    }
  }

  // =========================================================================
  // 🛠️ NOWOŚĆ: GENERATOR I SOLVER POPRZECZEK WZMACNIAJĄCYCH SUPPORT LIGHT
  // =========================================================================
  let totalSupportLengthM = 0;

  // 1. Definicja linii podziałów pod segmenty ramy (logika LMD)
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

  const cutX = [];
  if (numSegmentsW > 1) {
    for (let i = 1; i < numSegmentsW; i++) cutX.push(-W / 2 + (W / numSegmentsW) * i);
  } else if (W > 200) { cutX.push(0); } // Reguła wzmocnienia dla nieciętej ramy > 2m

  const cutY = [];
  if (numSegmentsH > 1) {
    for (let i = 1; i < numSegmentsH; i++) cutY.push((H / numSegmentsH) * i);
  } else if (H > 200) { cutY.push(H / 2); } // Reguła wzmocnienia dla nieciętej ramy > 2m

  const cutZ = D > 200 ? [0] : []; // Wzmocnienie osi głębokości (Z) jeśli boki > 2m

  const allX = [-W / 2, ...cutX, W / 2];
  const allY = [0, ...cutY, H];
  const allZ = [-hd, ...cutZ, hd];

  // 2. Uniwersalny, trójwymiarowy generator belek z docięciem krawędziowym 45 stopni
  function createCustomSupportMesh(sizeX, sizeY, sizeZ, miterType, touchStart, touchEnd) {
    const boxGeom = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const posAttr = boxGeom.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      if (miterType === 'V') {
        // Słupki pionowe (oś Y) – docinanie krańców pod profil skośny ramy obwodowej
        const thick = (sizeX < sizeZ) ? x : z;
        if (touchStart && y < -sizeY / 2 + 0.1) y += thick;
        if (touchEnd && y > sizeY / 2 - 0.1) y -= thick;
      } else if (miterType === 'H') {
        // Belki poziome (oś X) – docinanie krańców pod profil skośny ramy obwodowej
        const thick = (sizeY < sizeZ) ? y : z;
        if (touchStart && x < -sizeX / 2 + 0.1) x += thick;
        if (touchEnd && x > sizeX / 2 - 0.1) x -= thick;
      } else if (miterType === 'Z_XY') {
        // Belki głębokości (oś Z) na ścianach bocznych/suficie – docinanie krańców pod profil skośny
        const thick = (sizeX < sizeY) ? x : y;
        if (touchStart && z < -sizeZ / 2 + 0.1) z += thick;
        if (touchEnd && z > sizeZ / 2 - 0.1) z -= thick;
      }
      posAttr.setXYZ(i, x, y, z);
    }
    boxGeom.computeVertexNormals();

    const mesh = new THREE.Mesh(boxGeom, supportMat);
    mesh.userData = { isKaseton: true };
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(boxGeom), edgeMat));
    return mesh;
  }

  const innerAttachOffset = 2.1213; // Przesunięcie montażowe (3cm × cos(45°)) do płaskiej ścianki wewnętrznej ramy
  const frontZ = -hd + innerAttachOffset;
  const backZ = hd - innerAttachOffset;
  const leftX = -hw + innerAttachOffset;
  const rightX = hw - innerAttachOffset;
  const bottomY = innerAttachOffset;
  const topY = H - innerAttachOffset;
  const lenY = H - 2 * innerAttachOffset;

  // 3. 📱 ŚCIANA FRONTOWA I TYLNA (Płaszczyzny XY)
  // Słupki pionowe (Ciągłe)
  cutX.forEach(cx => {
    const vFront = createCustomSupportMesh(5, lenY, 1.5, 'V', true, true);
    vFront.position.set(cx, elevY + H / 2, frontZ);
    kGroup.add(vFront); totalSupportLengthM += lenY / 100;

    const vBack = createCustomSupportMesh(5, lenY, 1.5, 'V', true, true);
    vBack.position.set(cx, elevY + H / 2, backZ);
    vBack.rotation.y = Math.PI;
    kGroup.add(vBack); totalSupportLengthM += lenY / 100;
  });

  // Belki poziome (Dzielone / Interlocking)
  cutY.forEach(cy => {
    for (let i = 0; i < allX.length - 1; i++) {
      let startX = allX[i]; let endX = allX[i + 1];
      let touchLeft = (i === 0); let touchRight = (i === allX.length - 2);

      if (!touchLeft) startX += 2.5;
      if (!touchRight) endX -= 2.5;
      const segLen = endX - startX;

      if (segLen > 0) {
        const hFront = createCustomSupportMesh(segLen, 5, 1.5, 'H', touchLeft, touchRight);
        hFront.position.set(startX + segLen / 2, elevY + cy, frontZ);
        kGroup.add(hFront); totalSupportLengthM += segLen / 100;

        const hBack = createCustomSupportMesh(segLen, 5, 1.5, 'H', touchLeft, touchRight);
        hBack.position.set(startX + segLen / 2, elevY + cy, backZ);
        hBack.rotation.y = Math.PI;
        kGroup.add(hBack); totalSupportLengthM += segLen / 100;
      }
    }
  });

  // 4. 🚪 ŚCIANA LEWA I PRAWA (Płaszczyzny ZY)
  // Słupki pionowe (Dla głębokich kasetonów na linii cięcia osi Z)
  cutZ.forEach(cz => {
    const vLeft = createCustomSupportMesh(1.5, lenY, 5, 'V', true, true);
    vLeft.position.set(leftX, elevY + H / 2, cz);
    vLeft.rotation.y = Math.PI / 2;
    kGroup.add(vLeft); totalSupportLengthM += lenY / 100;

    const vRight = createCustomSupportMesh(1.5, lenY, 5, 'V', true, true);
    vRight.position.set(rightX, elevY + H / 2, cz);
    vRight.rotation.y = -Math.PI / 2;
    kGroup.add(vRight); totalSupportLengthM += lenY / 100;
  });

  // Belki głębokości (Dzielone rury Z zorientowane poziomo na ścianach bocznych)
  cutY.forEach(cy => {
    for (let j = 0; j < allZ.length - 1; j++) {
      let startZ = allZ[j]; let endZ = allZ[j + 1];
      let touchFront = (j === 0); let touchBack = (j === allZ.length - 2);

      if (!touchFront) startZ += 2.5;
      if (!touchBack) endZ -= 2.5;
      const segLen = endZ - startZ;

      if (segLen > 0) {
        const zLeft = createCustomSupportMesh(1.5, 5, segLen, 'Z_XY', touchFront, touchBack);
        zLeft.position.set(leftX, elevY + cy, startZ + segLen / 2);
        kGroup.add(zLeft); totalSupportLengthM += segLen / 100;

        const zRight = createCustomSupportMesh(1.5, 5, segLen, 'Z_XY', touchFront, touchBack);
        zRight.position.set(rightX, elevY + cy, startZ + segLen / 2);
        kGroup.add(zRight); totalSupportLengthM += segLen / 100;
      }
    }
  });

  // 5. 🗺️ PODŁOGA I SUFIT (Płaszczyzny XZ)
  const sys = config.system || 'CTF';

  // Belki głębokości Z na dole (zBottom) - rysujemy jeśli brak plafonów na dole
  if (config.light !== 'plafon_dol') {
    cutX.forEach(cx => {
      for (let j = 0; j < allZ.length - 1; j++) {
        let startZ = allZ[j]; let endZ = allZ[j + 1];
        let touchFront = (j === 0); let touchBack = (j === allZ.length - 2);

        if (!touchFront) startZ += 2.5;
        if (!touchBack) endZ -= 2.5;
        const segLen = endZ - startZ;

        if (segLen > 0) {
          const zBottom = createCustomSupportMesh(5, 1.5, segLen, 'Z_XY', touchFront, touchBack);
          zBottom.position.set(cx, elevY + bottomY, startZ + segLen / 2);
          kGroup.add(zBottom); totalSupportLengthM += segLen / 100;
        }
      }
    });
  }

  // Belki głębokości Z na górze (zTop) - rysujemy jeśli brak plafonów na górze
  if (config.light !== 'plafon_gora') {
    const sufitCutX = (config.light === 'zarowka' && cutX.length === 0) ? [0] : cutX;
    sufitCutX.forEach(cx => {
      for (let j = 0; j < allZ.length - 1; j++) {
        let startZ = allZ[j]; let endZ = allZ[j + 1];
        let touchFront = (j === 0); let touchBack = (j === allZ.length - 2);

        if (!touchFront) startZ += 2.5;
        if (!touchBack) endZ -= 2.5;
        const segLen = endZ - startZ;

        if (segLen > 0) {
          const zTop = createCustomSupportMesh(5, 1.5, segLen, 'Z_XY', touchFront, touchBack);
          zTop.position.set(cx, elevY + topY, startZ + segLen / 2);
          kGroup.add(zTop); totalSupportLengthM += segLen / 100;
        }
      }
    });
  }

  // Belki poziome X (Dla głębokich kasetonów leżące płasko na liniach cutZ)
  cutZ.forEach(cz => {
    for (let i = 0; i < allX.length - 1; i++) {
      let startX = allX[i]; let endX = allX[i + 1];
      let touchLeft = (i === 0); let touchRight = (i === allX.length - 2);

      if (!touchLeft) startX += 2.5;
      if (!touchRight) endX -= 2.5;
      const segLen = endX - startX;

      if (segLen > 0) {
        // Dół (hBottom) - rysujemy jeśli brak plafonów na dole
        if (config.light !== 'plafon_dol') {
          const hBottom = createCustomSupportMesh(segLen, 1.5, 5, 'H', touchLeft, touchRight);
          hBottom.position.set(startX + segLen / 2, elevY + bottomY, cz);
          kGroup.add(hBottom); totalSupportLengthM += segLen / 100;
        }

        // Góra (hTop) - rysujemy jeśli brak plafonów na górze
        if (config.light !== 'plafon_gora') {
          const hTop = createCustomSupportMesh(segLen, 1.5, 5, 'H', touchLeft, touchRight);
          hTop.position.set(startX + segLen / 2, elevY + topY, cz);
          kGroup.add(hTop); totalSupportLengthM += segLen / 100;
        }
      }
    }
  });

  const topPanel = config.topPanel || 'none';

  // =========================================================================
  // MODELOWANIE ELEMENTÓW LIGHT CTF_LED
  // =========================================================================

  // 1. Opcja: żarówka (zarowka)
  if (sys === 'CTF_LED' && config.light === 'zarowka') {
    const cableLen = topY - (H / 2 + 14);
    if (cableLen > 0) {
      const cableGeo = new THREE.CylinderGeometry(0.15, 0.15, cableLen, 8);
      const cableMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
      const cableMesh = new THREE.Mesh(cableGeo, cableMat);
      cableMesh.position.set(0, elevY + topY - cableLen / 2, 0);
      kGroup.add(cableMesh);
    }

    const baseGeo = new THREE.CylinderGeometry(1.2, 1.5, 3.5, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, elevY + H / 2 + 12.25, 0);
    kGroup.add(baseMesh);

    const capGeo = new THREE.CylinderGeometry(1.5, 4.0, 3.0, 24);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(0, elevY + H / 2 + 9.0, 0);
    kGroup.add(capMesh);

    const bulbGeo = new THREE.CylinderGeometry(4.0, 4.0, 18.0, 24);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff0dd,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.1
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.set(0, elevY + H / 2 - 1.5, 0);
    kGroup.add(bulbMesh);

    const tipGeo = new THREE.CylinderGeometry(4.0, 3.5, 1.5, 24);
    const tipMesh = new THREE.Mesh(tipGeo, baseMat);
    tipMesh.position.set(0, elevY + H / 2 - 11.25, 0);
    kGroup.add(tipMesh);
  }

  // 2. Opcja: Plafony LED (plafon_dol / plafon_gora)
  if (sys === 'CTF_LED' && (config.light === 'plafon_dol' || config.light === 'plafon_gora')) {
    const isGora = (config.light === 'plafon_gora');
    const railY = isGora ? topY : bottomY;

    let numX = Math.floor((W - 5) / 35);
    if (numX < 1 && W >= 40) numX = 1;
    let numZ = Math.floor((D - 5) / 35);
    if (numZ < 1 && D >= 40) numZ = 1;

    const zStart = -D/2 + 20;
    const zEnd = D/2 - 20;
    const stepZ = (numZ > 1) ? (zEnd - zStart) / (numZ - 1) : 0;

    const xStart = -W/2 + 20;
    const xEnd = W/2 - 20;
    const stepX = (numX > 1) ? (xEnd - xStart) / (numX - 1) : 0;

    const railLen = W - 2 * innerAttachOffset;

    for (let j = 0; j < numZ; j++) {
      const zVal = (numZ > 1) ? (zStart + j * stepZ) : 0;

      // Szyna z dwóch belek montażowych
      const rail1 = createCustomSupportMesh(railLen, 1.5, 5, 'H', true, true);
      rail1.position.set(0, elevY + railY, zVal - 10);
      kGroup.add(rail1);
      totalSupportLengthM += railLen / 100;

      const rail2 = createCustomSupportMesh(railLen, 1.5, 5, 'H', true, true);
      rail2.position.set(0, elevY + railY, zVal + 10);
      kGroup.add(rail2);
      totalSupportLengthM += railLen / 100;

      for (let i = 0; i < numX; i++) {
        const xVal = (numX > 1) ? (xStart + i * stepX) : 0;
        const centerY = isGora ? (topY - 2.25) : (bottomY + 2.25);

        // Świecąca część plafonu
        const panelGeo = new THREE.BoxGeometry(28, 1.4, 28);
        const panelMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 1.5,
          roughness: 0.1,
          metalness: 0.1
        });
        const panelMesh = new THREE.Mesh(panelGeo, panelMat);
        panelMesh.position.set(xVal, elevY + centerY, zVal);
        kGroup.add(panelMesh);

        // Ramka metalowa obwódki
        const frameGeo = new THREE.BoxGeometry(30, 1.5, 30);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4, metalness: 0.8 });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        frameMesh.position.set(xVal, elevY + centerY, zVal);
        frameMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), edgeMat));
        kGroup.add(frameMesh);
      }
    }
  }

  // Helpery do pasków LED pod blatem
  function getCTFLedSegments(lineLength) {
    const totalCornerSpace = 10;
    const totalAvailable = lineLength - totalCornerSpace;
    if (totalAvailable <= 0) return [];
    return [{ start: 5, end: lineLength - 5, length: totalAvailable }];
  }

  function getCTFBestLedCombo(maxLength) {
    const sizes = [50, 30, 24, 20];
    let bestCombo = [];
    let bestSum = 0;

    function search(index, currentCombo, currentSum) {
      if (currentSum > maxLength) return;
      if (currentSum > bestSum) {
        bestSum = currentSum;
        bestCombo = [...currentCombo];
      } else if (currentSum === bestSum) {
        if (currentCombo.length < bestCombo.length) {
          bestCombo = [...currentCombo];
        }
      }
      for (let i = index; i < sizes.length; i++) {
        currentCombo.push(sizes[i]);
        search(i, currentCombo, currentSum + sizes[i]);
        currentCombo.pop();
      }
    }
    search(0, [], 0);
    return bestCombo;
  }

  function createCTFLedStripeMesh(size) {
    const stripeGroup = new THREE.Group();
    const pcbGeom = new THREE.BoxGeometry(2.4, 0.15, size);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1
    });
    const pcb = new THREE.Mesh(pcbGeom, pcbMat);
    pcb.position.set(0, 0.075, 0);
    stripeGroup.add(pcb);

    const numLenses = Math.floor(size / 5);
    const lensGeom = new THREE.CylinderGeometry(1.1, 1.1, 2.0, 16);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.8
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const glowSphereGeom = new THREE.SphereGeometry(0.2, 8, 8);

    for (let i = 0; i < numLenses; i++) {
      const zPos = -size / 2 + 2.5 + i * 5;
      const lens = new THREE.Mesh(lensGeom, lensMat);
      lens.position.set(0, 1.15, zPos);
      stripeGroup.add(lens);

      const glow = new THREE.Mesh(glowSphereGeom, glowMat);
      glow.position.set(0, 1.15, zPos);
      stripeGroup.add(glow);
    }
    return stripeGroup;
  }

  function drawUnderCounterLedLine(startX, startZ, endX, endZ, isHorizontal) {
    const dx = endX - startX;
    const dz = endZ - startZ;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len <= 0) return;

    const segments = getCTFLedSegments(len);
    const ledY = H + cOffset - 0.2; // Underside of MDF counter
    const angle = Math.atan2(endZ - startZ, endX - startX);

    // Kierujemy wszystkie paski pionowo w dół (rotacja wokół lokalnej osi Z o 180 stopni)
    const rotZ = Math.PI;

    segments.forEach(seg => {
      const combo = getCTFBestLedCombo(seg.length);
      const totalStripesLength = combo.reduce((sum, val) => sum + val, 0);
      const startOffset = seg.start + (seg.length - totalStripesLength) / 2;

      let currentOffset = startOffset;
      combo.forEach((size, idx) => {
        const stripe = createCTFLedStripeMesh(size);
        const dOffset = currentOffset + size / 2;
        const posX = startX + (dx / len) * dOffset;
        const posZ = startZ + (dz / len) * dOffset;

        stripe.position.set(posX, elevY + ledY, posZ);
        stripe.rotation.y = Math.PI / 2 - angle;
        stripe.rotation.z = rotZ;
        kGroup.add(stripe);

        if (idx < combo.length - 1) {
          const connGeom = new THREE.BoxGeometry(0.3, 0.4, 1.2);
          const connMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5 });
          const conn = new THREE.Mesh(connGeom, connMat);
          const connOffset = currentOffset + size;
          const cX = startX + (dx / len) * connOffset;
          const cZ = startZ + (dz / len) * connOffset;
          conn.position.set(cX, elevY + ledY + 0.1, cZ);
          conn.rotation.y = Math.PI / 2 - angle;
          conn.rotation.z = rotZ;
          kGroup.add(conn);
        }
        currentOffset += size;
      });
    });
  }

  // 3. Opcja: Paski LED pod blatem (paski_led)
  if (sys === 'CTF_LED' && config.light === 'paski_led' && topPanel === 'mdf') {
    const W_blat = W + 2 * eOffset;
    const D_blat = D + 2 * eOffset;

    // Zasilacz na środku
    const psuGeo = new THREE.BoxGeometry(15, 3, 5);
    const psuMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
    const psuMesh = new THREE.Mesh(psuGeo, psuMat);
    psuMesh.position.set(0, elevY + H + cOffset - 1.5, 0);
    kGroup.add(psuMesh);

    // X Lines
    if (D_blat <= 60) {
      drawUnderCounterLedLine(-W_blat/2 + 14, 0, W_blat/2 - 14, 0, true);
    } else {
      drawUnderCounterLedLine(-W_blat/2 + 14, -D_blat/2 + 10, W_blat/2 - 14, -D_blat/2 + 10, true);
      drawUnderCounterLedLine(-W_blat/2 + 14, D_blat/2 - 10, W_blat/2 - 14, D_blat/2 - 10, true);
    }

    // Z Lines
    if (W_blat <= 60) {
      drawUnderCounterLedLine(0, -D_blat/2 + 14, 0, D_blat/2 - 14, false);
    } else {
      drawUnderCounterLedLine(-W_blat/2 + 10, -D_blat/2 + 14, -W_blat/2 + 10, D_blat/2 - 14, false);
      drawUnderCounterLedLine(W_blat/2 - 10, -D_blat/2 + 14, W_blat/2 - 10, D_blat/2 - 14, false);
    }
  }

  window.currentKasetonConfig.totalSupportLengthM = totalSupportLengthM;
  // =========================================================================

  // --- BLAT GÓRNY ---
  if (topPanel !== 'none') {
    let topMat;
    if (isBlueprintMode) {
      topMat = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
    } else if (topPanel === 'mdf') {
      topMat = new THREE.MeshStandardMaterial({
        color: 0xf0ece0,
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide
      });
    } else if (topPanel === 'plexi') {
      topMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
    } else if (topPanel === 'polycarbonate') {
      topMat = new THREE.MeshStandardMaterial({
        color: 0xf8f8ff,
        roughness: 0.3,
        metalness: 0.05,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
    }
    if (topMat) {
      const topGeom = new THREE.BoxGeometry(W + 2 * eOffset, 1, D + 2 * eOffset);
      const topMesh = new THREE.Mesh(topGeom, topMat);
      topMesh.position.set(0, elevY + H + cOffset + 0.5, 0);
      kGroup.add(topMesh);

      // Krawędzie blatu
      const topEdges = new THREE.EdgesGeometry(topGeom);
      const topLine = new THREE.LineSegments(topEdges, edgeMat);
      topMesh.add(topLine);
    }
  }



  // --- PODWIESZENIE (suspended) ---
  if (config.usage === 'suspended') {
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x888888, roughness: 0.3, metalness: 0.9
    });

    const wirePositions = [
      { x: -hw + 3, z: -hd + 3 },
      { x: hw - 3, z: -hd + 3 },
      { x: -hw + 3, z: hd - 3 },
      { x: hw - 3, z: hd - 3 }
    ];

    wirePositions.forEach(pos => {
      // Linka
      const wireGeom = new THREE.CylinderGeometry(0.1, 0.1, 100, 6);
      const wire = new THREE.Mesh(wireGeom, wireMat);
      wire.position.set(pos.x, elevY + H + 50, pos.z);
      kGroup.add(wire);

      // Oczko
      const eyeGeom = new THREE.TorusGeometry(0.8, 0.2, 8, 16);
      const eye = new THREE.Mesh(eyeGeom, wireMat);
      eye.position.set(pos.x, elevY + H + 0.5, pos.z);
      eye.rotation.x = Math.PI / 2;
      kGroup.add(eye);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // TRYB TECHNICZNY DLA CTF/CTF_LED — MARKERY I MIARKI
  // ═══════════════════════════════════════════════════════════
  if (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) {
    const BADGE_COLORS = ['#00e5ff', '#00ff99', '#ffcc00', '#ff8c00', '#ff4466', '#aa66ff', '#66ccff', '#ccff66'];
    const labelRegistry = new Map();
    const legendItems = [];

    function addNumberedMarker(key, targetPt, name, desc) {
      if (labelRegistry.has(key)) return;
      const idx = legendItems.length;
      labelRegistry.set(key, idx);
      const color = BADGE_COLORS[idx % BADGE_COLORS.length];
      legendItems.push({ num: idx + 1, name, desc: desc || '', color });

      // Numbered circle sprite
      const cvs = document.createElement('canvas');
      cvs.width = 128; cvs.height = 128;
      const cx = cvs.getContext('2d');
      // Glow
      const grad = cx.createRadialGradient(64, 64, 20, 64, 64, 60);
      grad.addColorStop(0, color + 'cc'); grad.addColorStop(1, color + '00');
      cx.fillStyle = grad;
      cx.beginPath(); cx.arc(64, 64, 60, 0, Math.PI * 2); cx.fill();
      // Solid circle
      cx.fillStyle = color;
      cx.beginPath(); cx.arc(64, 64, 36, 0, Math.PI * 2); cx.fill();
      // Number
      cx.fillStyle = '#000'; cx.font = 'bold 42px Arial';
      cx.textAlign = 'center'; cx.textBaseline = 'middle';
      cx.fillText(String(idx + 1), 64, 65);

      const tex = new THREE.CanvasTexture(cvs);
      const spMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true });
      const sprite = new THREE.Sprite(spMat);
      sprite.scale.set(14, 14, 1);
      const spritePos = targetPt.clone().add(new THREE.Vector3(0, 4, 4));
      sprite.position.copy(spritePos);
      sprite.renderOrder = 1001;
      kGroup.add(sprite);

      // Thin leader line
      const lMat = new THREE.LineBasicMaterial({ color: parseInt(color.replace('#', ''), 16), depthTest: false, transparent: true, opacity: 0.6 });
      const lGeo = new THREE.BufferGeometry().setFromPoints([targetPt, spritePos.clone().add(new THREE.Vector3(0, -7, -4))]);
      kGroup.add(new THREE.Line(lGeo, lMat));
    }

    // 1. Profil główny
    addNumberedMarker('MAIN_PROFILE',
      new THREE.Vector3(-W / 3, elevY, -hd),
      'Profil CTF',
      'Profil obwodowy kasetonu (aluminiowy)');

    // 2. Łącznik narożny
    addNumberedMarker('CONNECTOR',
      new THREE.Vector3(-hw, elevY, -hd),
      'adFrame CTF Plastic connector',
      'Łącznik plastikowy 3-kierunkowy (8 szt.)');

    // 3. Belki poprzeczne (supporty)
    if (totalSupportLengthM > 0) {
      addNumberedMarker('SUPPORT',
        new THREE.Vector3(0, elevY + H / 2, frontZ),
        'Profil Support Light',
        'Belki wzmacniające konstrukcję');
    }

    // 4. Elementy oświetlenia dla CTF_LED
    if (sys === 'CTF_LED') {
      if (config.light === 'zarowka') {
        addNumberedMarker('LIGHT_BULB',
          new THREE.Vector3(0, elevY + H / 2 - 1.5, 0),
          'Żarówka LED 40W',
          'Oświetlenie wiszące (wisząca kukurydza)');
      } else if (config.light === 'plafon_dol' || config.light === 'plafon_gora') {
        const isGora = (config.light === 'plafon_gora');
        addNumberedMarker('LIGHT_PLAFON',
          new THREE.Vector3(0, elevY + (isGora ? (topY - 2.25) : (bottomY + 2.25)), 0),
          'Plafon LED 30x30',
          'Kasetonowy panel oświetleniowy montowany na szynach');
      } else if (config.light === 'paski_led' && topPanel === 'mdf') {
        addNumberedMarker('LIGHT_STRIP',
          new THREE.Vector3(0, elevY + H + cOffset - 1.5, 0),
          'Paski LED obwodowe',
          'Oświetlenie krawędziowe podblatowe z zasilaczem');
      }
    }

    // 5. Blat górny
    if (topPanel !== 'none') {
      let panelName = 'Blat MDF';
      if (topPanel === 'plexi') panelName = 'Blat PLEXI';
      else if (topPanel === 'polycarbonate') panelName = 'Blat Poliwęglan';

      addNumberedMarker('TOP_PANEL',
        new THREE.Vector3(0, elevY + H + cOffset + 0.5, 0),
        panelName,
        'Wykończenie górne kasetonu');
    }

    // Zapis do rejestru
    window.blueprintLegendItems = legendItems;
    window.blueprintDimensions = { W, H, D, sys };

    // Miarki wymiarowe w 3D (W, H, D)
    const pW1 = new THREE.Vector3(-W / 2, elevY, -hd);
    const pW2 = new THREE.Vector3(W / 2, elevY, -hd);
    kGroup.add(addDimension3D(pW1, pW2, W + ' cm', new THREE.Vector3(0, -25, 0), 1.3));

    const pH1 = new THREE.Vector3(W / 2, elevY, -hd);
    const pH2 = new THREE.Vector3(W / 2, elevY + H, -hd);
    kGroup.add(addDimension3D(pH1, pH2, H + ' cm', new THREE.Vector3(25, 0, 0), 1.3));

    const pD1 = new THREE.Vector3(W / 2, elevY, -hd);
    const pD2 = new THREE.Vector3(W / 2, elevY, hd);
    kGroup.add(addDimension3D(pD1, pD2, D + ' cm', new THREE.Vector3(20, 0, 20), 1.3));
  }

  kGroup.rotation.y = Math.PI;

  scene.add(kGroup);

  // Ustawienie kamery na widok kasetonu
  if (camera && controls) {
    const maxDim = Math.max(W, H, D);
    camera.position.set(maxDim * 0.8, elevY + H * 0.6, maxDim * 1.2);
    controls.target.set(0, elevY + H / 2, 0);
    controls.update();
  }

  if (typeof generateKasetonBOM === 'function') generateKasetonBOM();

  console.log('✨ 3D CTF box scene rendered successfully!');
}

function drawCartonScene() {
  if (!scene) return;
  const config = window.currentKasetonConfig;
  if (!config) return;

  const cartonName = config.cartonName || 'Karton LMD/LMS/DTF - 210x16x33cm';
  const cartonQty = config.cartonQty || 1;
  const dims = KASETON_CARTON_DIMENSIONS[cartonName] || { l: 210, w: 16, h: 33 };
  const totalWeight = calculateKasetonWeight(config);

  const kGroup = new THREE.Group();
  kGroup.userData = { isKaseton: true };

  // --- Procedural cardboard texture ---
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 512;
  texCanvas.height = 512;
  const tCtx = texCanvas.getContext('2d');

  // Base color
  tCtx.fillStyle = '#c69c6d';
  tCtx.fillRect(0, 0, 512, 512);

  // Grain noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const a = Math.random() * 0.12;
    tCtx.fillStyle = Math.random() > 0.5
      ? `rgba(180, 140, 90, ${a})`
      : `rgba(220, 180, 130, ${a})`;
    tCtx.fillRect(x, y, Math.random() * 3 + 1, 1);
  }

  // Horizontal corrugation lines
  tCtx.strokeStyle = 'rgba(160, 120, 70, 0.12)';
  tCtx.lineWidth = 1;
  for (let y = 0; y < 512; y += 6) {
    tCtx.beginPath();
    tCtx.moveTo(0, y + Math.random() * 2);
    tCtx.lineTo(512, y + Math.random() * 2);
    tCtx.stroke();
  }

  const cardboardTex = new THREE.CanvasTexture(texCanvas);
  cardboardTex.wrapS = THREE.RepeatWrapping;
  cardboardTex.wrapT = THREE.RepeatWrapping;

  const cardboardMat = new THREE.MeshStandardMaterial({
    map: cardboardTex,
    roughness: 0.85,
    metalness: 0.0,
    color: 0xc69c6d
  });

  // Tape material
  const tapeMat = new THREE.MeshStandardMaterial({
    color: 0xD2B48C,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.7
  });

  // Position cartons side by side
  const spacing = dims.w + 8;
  const totalSpan = cartonQty * dims.w + (cartonQty - 1) * 8;
  const startZ = -totalSpan / 2 + dims.w / 2;

  for (let i = 0; i < cartonQty; i++) {
    const zPos = startZ + i * spacing;

    // Main box
    const boxGeom = new THREE.BoxGeometry(dims.l, dims.h, dims.w);
    const box = new THREE.Mesh(boxGeom, cardboardMat);
    box.position.set(0, dims.h / 2, zPos);
    box.castShadow = true;
    box.receiveShadow = true;
    kGroup.add(box);

    // Tape strip on top (center seam)
    const tapeGeom = new THREE.BoxGeometry(dims.l * 0.92, 0.4, 5);
    const tape = new THREE.Mesh(tapeGeom, tapeMat);
    tape.position.set(0, dims.h + 0.2, zPos);
    kGroup.add(tape);

    // Cross tape
    const crossTapeGeom = new THREE.BoxGeometry(5, 0.4, dims.w * 0.92);
    const crossTape = new THREE.Mesh(crossTapeGeom, tapeMat);
    crossTape.position.set(0, dims.h + 0.2, zPos);
    kGroup.add(crossTape);

    // Edge wireframe
    const edgeGeo = new THREE.EdgesGeometry(boxGeom);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x8B6914,
      transparent: true,
      opacity: 0.4
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.position.copy(box.position);
    kGroup.add(edges);

    // Flap lines on top (decorative crease)
    const flapMat = new THREE.LineBasicMaterial({ color: 0x9B7B4A, transparent: true, opacity: 0.3 });
    const flapGeo1 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-dims.l / 2, dims.h + 0.1, zPos - dims.w / 4),
      new THREE.Vector3(dims.l / 2, dims.h + 0.1, zPos - dims.w / 4)
    ]);
    kGroup.add(new THREE.Line(flapGeo1, flapMat));
    const flapGeo2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-dims.l / 2, dims.h + 0.1, zPos + dims.w / 4),
      new THREE.Vector3(dims.l / 2, dims.h + 0.1, zPos + dims.w / 4)
    ]);
    kGroup.add(new THREE.Line(flapGeo2, flapMat));
  }

  // --- Label sprite helper ---
  function makeLabel(text, fontSize, bgColor) {
    const c = document.createElement('canvas');
    const cx = c.getContext('2d');
    c.width = 1024;
    c.height = 192;
    // Background
    cx.fillStyle = bgColor || 'rgba(10, 10, 20, 0.8)';
    cx.beginPath();
    cx.roundRect(8, 8, 1008, 176, 16);
    cx.fill();
    // Border glow
    cx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    cx.lineWidth = 2;
    cx.stroke();
    // Text
    cx.fillStyle = '#ffffff';
    cx.font = `bold ${fontSize || 56}px Arial, sans-serif`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(text, 512, 100);
    const tex = new THREE.CanvasTexture(c);
    const spMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(spMat);
    sprite.scale.set(70, 70 * 192 / 1024, 1);
    sprite.renderOrder = 999;
    return sprite;
  }

  // Carton name + dimensions
  const dimText = `${dims.l} \u00d7 ${dims.w} \u00d7 ${dims.h} cm`;
  const dimLabel = makeLabel(dimText, 60);
  dimLabel.position.set(0, dims.h + 18, 0);
  kGroup.add(dimLabel);

  // Weight label
  const weightText = `Waga paczki: ${totalWeight.toFixed(1)} kg`;
  const weightLabel = makeLabel(weightText, 54, 'rgba(15, 157, 88, 0.85)');
  weightLabel.position.set(0, dims.h + 32, 0);
  kGroup.add(weightLabel);

  // Carton type label
  const typeLabel = makeLabel(cartonName, 40, 'rgba(30, 30, 50, 0.85)');
  typeLabel.position.set(0, dims.h + 46, 0);
  kGroup.add(typeLabel);

  // Quantity label (if multiple)
  if (cartonQty > 1) {
    const qtyLabel = makeLabel(`Ilo\u015b\u0107 karton\u00f3w: ${cartonQty}`, 50, 'rgba(230, 126, 34, 0.85)');
    qtyLabel.position.set(0, dims.h + 60, 0);
    kGroup.add(qtyLabel);
  }

  // --- Dimension arrows ---
  const arrowColor = 0x00e5ff;
  const arrowMat = new THREE.LineBasicMaterial({ color: arrowColor, depthTest: false, linewidth: 2 });

  // Length (X)
  const lY = -5;
  const lZ = startZ - dims.w / 2 - 10;
  const lPts = [
    new THREE.Vector3(-dims.l / 2, lY, lZ),
    new THREE.Vector3(dims.l / 2, lY, lZ)
  ];
  kGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lPts), arrowMat));
  // End ticks
  kGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-dims.l / 2, lY - 3, lZ),
    new THREE.Vector3(-dims.l / 2, lY + 3, lZ)
  ]), arrowMat));
  kGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(dims.l / 2, lY - 3, lZ),
    new THREE.Vector3(dims.l / 2, lY + 3, lZ)
  ]), arrowMat));
  const lLabel = makeLabel(`${dims.l} cm`, 48);
  lLabel.position.set(0, lY, lZ - 12);
  lLabel.scale.set(45, 45 * 192 / 1024, 1);
  kGroup.add(lLabel);

  // Height (Y)
  const hX = dims.l / 2 + 12;
  const hZ = startZ - dims.w / 2 - 5;
  const hPts = [
    new THREE.Vector3(hX, 0, hZ),
    new THREE.Vector3(hX, dims.h, hZ)
  ];
  kGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(hPts), arrowMat));
  kGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(hX - 3, 0, hZ),
    new THREE.Vector3(hX + 3, 0, hZ)
  ]), arrowMat));
  kGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(hX - 3, dims.h, hZ),
    new THREE.Vector3(hX + 3, dims.h, hZ)
  ]), arrowMat));
  const hLabel = makeLabel(`${dims.h} cm`, 48);
  hLabel.position.set(hX + 20, dims.h / 2, hZ);
  hLabel.scale.set(40, 40 * 192 / 1024, 1);
  kGroup.add(hLabel);

  // Width (Z) - only if > 1 carton to show total span
  const wX = -dims.l / 2 - 12;
  const wPts = [
    new THREE.Vector3(wX, 0, startZ - dims.w / 2),
    new THREE.Vector3(wX, 0, startZ - dims.w / 2 + totalSpan)
  ];
  kGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(wPts), arrowMat));
  const wLabel = makeLabel(`${dims.w} cm`, 44);
  wLabel.position.set(wX - 18, 0, startZ - dims.w / 2 + totalSpan / 2);
  wLabel.scale.set(35, 35 * 192 / 1024, 1);
  kGroup.add(wLabel);

  // Add to scene
  scene.add(kGroup);
  sceneObjects.push(kGroup);

  // Camera positioning
  const maxDim = Math.max(dims.l, dims.h, totalSpan);
  camera.position.set(dims.l * 0.4, dims.h * 1.5, maxDim * 1.1);
  controls.target.set(0, dims.h / 2, 0);
  controls.update();

  console.log('📦 Carton scene rendered:', cartonQty, 'x', cartonName, '| Weight:', totalWeight.toFixed(1), 'kg');
}
/**
 * Silnik renderujący anatomię wewnętrzną kasetonów SEGO v7
 * Zmiany: Szerokość jako pierwsza w napisie, rozbudowa modułu 200cm o pionowy słupek i MP Cross.
 */
function buildSegoInternalAnatomy(item, group) {
  const w = parseFloat(item.length) || 100;
  const h = parseFloat(item.height) || 250;
  const roundedW = Math.round(w);
  const roundedH = Math.round(h);
  const tubeRadius = 0.95; // fi 19mm -> promień 0.95cm

  // ─────────────────────────────────────────────────────────────────
  // DEFINICJA MATERIAŁÓW KOLORYSTYCZNYCH (ZGODNYCH Z LEGENDĄ)
  // ─────────────────────────────────────────────────────────────────
  const defaultMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffcc00, side: THREE.DoubleSide });    // 1. Żółty dla rurek MP
  const supportMat = new THREE.MeshBasicMaterial({ color: 0xdddddd, side: THREE.DoubleSide }); // Uchwyty (neutralny jasnoszary)
  const crossMat = new THREE.MeshBasicMaterial({ color: 0x00ff99, side: THREE.DoubleSide });   // 2. Zielony dla MP Cross
  const extender50Mat = new THREE.MeshBasicMaterial({ color: 0xff0033, side: THREE.DoubleSide }); // 3. Mocna czerwień
  const extender25Mat = new THREE.MeshBasicMaterial({ color: 0xff5500, side: THREE.DoubleSide }); // 4. Mocny pomarańcz

  const edgeMat = new THREE.LineBasicMaterial({ color: 0x666666 });

  // ─────────────────────────────────────────────────────────────────
  // SUB-GENERATOR SYSTEMU ZNAKOWANIA (KROPKI Z LICZBAMI)
  // ─────────────────────────────────────────────────────────────────
  function addNumberedMarker(num, targetPt, color = '#ffcc00') {
    const cvs = document.createElement('canvas');
    cvs.width = 128; cvs.height = 128;
    const cx = cvs.getContext('2d');

    const grad = cx.createRadialGradient(64, 64, 20, 64, 64, 60);
    grad.addColorStop(0, color + 'cc'); grad.addColorStop(1, color + '00');
    cx.fillStyle = grad; cx.beginPath(); cx.arc(64, 64, 60, 0, Math.PI * 2); cx.fill();

    cx.fillStyle = color; cx.beginPath(); cx.arc(64, 64, 36, 0, Math.PI * 2); cx.fill();

    cx.fillStyle = '#000'; cx.font = 'bold 44px Arial';
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(String(num), 64, 64);

    const tex = new THREE.CanvasTexture(cvs);
    const spMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true });
    const sprite = new THREE.Sprite(spMat);
    sprite.scale.set(14, 14, 1);
    sprite.position.copy(targetPt);
    sprite.userData = { isInternalAnatomy: true };
    sprite.renderOrder = 1001;
    group.add(sprite);
  }

  // REJESTRACJA ELEMENTÓW DO GLOBALNEJ LEGENDY HTML
  if (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) {
    if (!window.blueprintLegendItems) window.blueprintLegendItems = [];
    const addLegendObj = (num, name, desc, color) => {
      if (!window.blueprintLegendItems.some(i => i.name === name)) {
        window.blueprintLegendItems.push({ num, name, desc, color });
      }
    };
    addLegendObj(1, 'Rozpórki rurkowe MP', 'Elementy konstrukcyjne tworzące poprzeczki i słupki', '#ffcc00');
    if (roundedW === 200 || roundedW === 300) addLegendObj(2, 'MP Cross', 'Czwórnik / złącze krzyżowe rozpórek', '#00ff99');
    if (roundedH === 300) {
      addLegendObj(3, 'SEGO Extender 50cm', 'Profil przedłużający wysokość ramy o 50cm', '#ff0033');
      if (roundedW === 200 || roundedW === 300) addLegendObj(4, 'MP Extender 25cm', 'Rurki przedłużające wewnętrzną kratownicę ramy', '#ff5500');
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 🔥 ZMIANA 1: GENEROWANIE NAGŁÓWKA MODUŁU (SZEROKOŚĆ X WYSOKOŚĆ)
  // ─────────────────────────────────────────────────────────────────
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512; labelCanvas.height = 256;
  const lCtx = labelCanvas.getContext('2d');

  lCtx.font = 'bold 90px "Segoe UI", Arial'; lCtx.fillStyle = '#888888'; lCtx.textAlign = 'center'; lCtx.textBaseline = 'middle';
  lCtx.fillText('SEGO', 256, 75);

  lCtx.font = 'bold 65px "Segoe UI", Arial';
  // Zmiana kolejności: roundedW (szerokość) jako pierwsza wartość przed znakiem 'x'
  const dimString = `${roundedW}x${roundedH} CM`;
  lCtx.fillText(dimString, 256, 180);

  const labelTex = new THREE.CanvasTexture(labelCanvas);
  const labelMeshMat = new THREE.MeshBasicMaterial({
    map: labelTex, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false
  });

  const mainBigMesh = new THREE.Mesh(new THREE.PlaneGeometry(56, 28), labelMeshMat);
  mainBigMesh.position.set(0, h - 40, 6.1);
  mainBigMesh.userData = { isInternalAnatomy: true }; mainBigMesh.renderOrder = 1002;
  group.add(mainBigMesh);

  // ─────────────────────────────────────────────────────────────────
  // GENERATOR PROFILI OBWODOWYCH (Ścięcie 45° / Grubość 5mm)
  // ─────────────────────────────────────────────────────────────────
  function createMiteredSegmentGeometry(L, zMin, zMax, t) {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, zMin, 0, 0, zMax, t, t, zMax, t, t, zMin,
      L, 0, zMin, L, 0, zMax, L - t, t, zMax, L - t, t, zMin
    ]);
    const indices = [
      0, 4, 5, 0, 5, 1, 2, 6, 7, 2, 7, 3,
      0, 3, 7, 0, 7, 4, 1, 5, 6, 1, 6, 2,
      0, 1, 2, 0, 2, 3, 4, 7, 6, 4, 6, 5
    ];
    geom.setIndex(indices); geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals(); return geom;
  }

  function createProfileGroup(L, customMat = defaultMat) {
    const profGroup = new THREE.Group();
    const geom = createMiteredSegmentGeometry(L, -6, 6, 0.5);
    profGroup.add(new THREE.Mesh(geom, customMat));
    profGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(geom), edgeMat));
    profGroup.userData = { isInternalAnatomy: true };
    return profGroup;
  }

  const bottomP = createProfileGroup(w, defaultMat); bottomP.position.set(-w / 2, 0, 0); group.add(bottomP);
  const topP = createProfileGroup(w, defaultMat); topP.position.set(w / 2, h, 0); topP.rotation.z = Math.PI; group.add(topP);

  if (roundedH === 300) {
    const leftLower = createProfileGroup(125, defaultMat); leftLower.position.set(-w / 2, 125, 0); leftLower.rotation.z = -Math.PI / 2; group.add(leftLower);
    const leftExtender = createProfileGroup(50, extender50Mat); leftExtender.position.set(-w / 2, 175, 0); leftExtender.rotation.z = -Math.PI / 2; group.add(leftExtender);
    const leftUpper = createProfileGroup(125, defaultMat); leftUpper.position.set(-w / 2, 300, 0); leftUpper.rotation.z = -Math.PI / 2; group.add(leftUpper);

    const rightLower = createProfileGroup(125, defaultMat); rightLower.position.set(w / 2, 0, 0); rightLower.rotation.z = Math.PI / 2; group.add(rightLower);
    const rightExtender = createProfileGroup(50, extender50Mat); rightExtender.position.set(w / 2, 125, 0); rightExtender.rotation.z = Math.PI / 2; group.add(rightExtender);
    const rightUpper = createProfileGroup(125, defaultMat); rightUpper.position.set(w / 2, 175, 0); rightUpper.rotation.z = Math.PI / 2; group.add(rightUpper);

    addNumberedMarker(3, new THREE.Vector3(-w / 2 - 8, 150, 4), '#ff0033');
  } else {
    const leftP = createProfileGroup(h, defaultMat); leftP.position.set(-w / 2, h, 0); leftP.rotation.z = -Math.PI / 2; group.add(leftP);
    const rightP = createProfileGroup(h, defaultMat); rightP.position.set(w / 2, 0, 0); rightP.rotation.z = Math.PI / 2; group.add(rightP);
  }

  // ─────────────────────────────────────────────────────────────────
  // GENERATOR ROZPÓREK RURKOWYCH
  // ─────────────────────────────────────────────────────────────────
  function createTube(length, isHorizontal = true, customMat = tubeMat) {
    const geom = new THREE.CylinderGeometry(tubeRadius, tubeRadius, length, 16);
    const mesh = new THREE.Mesh(geom, customMat);
    if (isHorizontal) mesh.rotation.z = Math.PI / 2;
    mesh.userData = { isInternalAnatomy: true };
    return mesh;
  }

  function createMpSupport() {
    const supportGroup = new THREE.Group();
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.5, 3), supportMat); supportGroup.add(baseMesh);
    const sleeveMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.5, 16).rotateZ(Math.PI / 2), supportMat); sleeveMesh.position.x = 1.0; supportGroup.add(sleeveMesh);
    supportGroup.userData = { isInternalAnatomy: true }; return supportGroup;
  }

  function createMpCross() {
    const crossGroup = new THREE.Group();
    const horizSleeve = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 16).rotateZ(Math.PI / 2), crossMat);
    const vertSleeve = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 16), crossMat);
    crossGroup.add(horizSleeve, vertSleeve); crossGroup.userData = { isInternalAnatomy: true }; return crossGroup;
  }

  // CONFIG A: MODUŁY 85 ORAZ 100 (Tylko poprzeczka pozioma)
  if (roundedW === 85 || roundedW === 100) {
    const mainHorizTube = createTube(w - 2, true, tubeMat); mainHorizTube.position.set(0, h / 2, 0); group.add(mainHorizTube);

    const supportLeft = createMpSupport(); supportLeft.position.set(-w / 2 + 0.5, h / 2, 0); group.add(supportLeft);
    const supportRight = createMpSupport(); supportRight.position.set(w / 2 - 0.5, h / 2, 0); supportRight.rotation.y = Math.PI; group.add(supportRight);

    addNumberedMarker(1, new THREE.Vector3(-w / 2 + 6, h / 2 + 6, 4), '#ffcc00');
  }
  // 🔥 ZMIANA 2: DEDYKOWANY UKŁAD KRZYŻOWY DLA MODUŁU 200 CM
  else if (roundedW === 200) {
    // Ciągła poprzeczka pozioma
    const mainHorizTube = createTube(w - 2, true, tubeMat); mainHorizTube.position.set(0, h / 2, 0); group.add(mainHorizTube);

    const supportLeft = createMpSupport(); supportLeft.position.set(-w / 2 + 0.5, h / 2, 0); group.add(supportLeft);
    const supportRight = createMpSupport(); supportRight.position.set(w / 2 - 0.5, h / 2, 0); supportRight.rotation.y = Math.PI; group.add(supportRight);

    // Czwórnik centralny MP Cross dokładnie w połowie belki poziomej (x = 0)
    const centerCross = createMpCross(); centerCross.position.set(0, h / 2, 0); group.add(centerCross);

    // Słupek pionowy przechodzący osiowo przez środek (x = 0)
    if (roundedH === 300) {
      const vertLower = createTube(124, false, tubeMat); vertLower.position.set(0, 63, 0); group.add(vertLower);
      const extLower = createTube(25, false, extender25Mat); extLower.position.set(0, 137.5, 0); group.add(extLower);
      const extUpper = createTube(25, false, extender25Mat); extUpper.position.set(0, 162.5, 0); group.add(extUpper);
      const vertUpper = createTube(124, false, tubeMat); vertUpper.position.set(0, 237, 0); group.add(vertUpper);

      addNumberedMarker(4, new THREE.Vector3(8, 137.5, 4), '#ff5500');
    } else {
      const vertTube = createTube(h - 2, false, tubeMat); vertTube.position.set(0, h / 2, 0); group.add(vertTube);
    }

    // Stabilizacja słupka pionowego z każdej strony (Dół i Góra ramy) uchwytem MP Support
    const supportBottom = createMpSupport(); supportBottom.position.set(0, 0.5, 0); supportBottom.rotation.z = Math.PI / 2; group.add(supportBottom);
    const supportTop = createMpSupport(); supportTop.position.set(0, h - 0.5, 0); supportTop.rotation.z = -Math.PI / 2; group.add(supportTop);

    addNumberedMarker(1, new THREE.Vector3(-w / 2 + 6, h / 2 + 6, 4), '#ffcc00');
    addNumberedMarker(2, new THREE.Vector3(0, h / 2 + 8, 4), '#00ff99');
  }
  // CONFIG C: MODUŁ 300 CM (Dwie rurki pionowe w 1/3 i 2/3 szerokości)
  else if (roundedW === 300) {
    const mainHorizTube = createTube(w - 2, true, tubeMat); mainHorizTube.position.set(0, h / 2, 0); group.add(mainHorizTube);

    const verticalXPositions = [-50, 50];
    verticalXPositions.forEach((xPos, idx) => {
      if (roundedH === 300) {
        const vertLower = createTube(124, false, tubeMat); vertLower.position.set(xPos, 63, 0); group.add(vertLower);
        const extLower = createTube(25, false, extender25Mat); extLower.position.set(xPos, 137.5, 0); group.add(extLower);
        const extUpper = createTube(25, false, extender25Mat); extUpper.position.set(xPos, 162.5, 0); group.add(extUpper);
        const vertUpper = createTube(124, false, tubeMat); vertUpper.position.set(xPos, 237, 0); group.add(vertUpper);

        if (idx === 0) addNumberedMarker(4, new THREE.Vector3(xPos + 8, 137.5, 4), '#ff5500');
      } else {
        const vertTube = createTube(h - 2, false, tubeMat); vertTube.position.set(xPos, h / 2, 0); group.add(vertTube);
      }

      const supportBottom = createMpSupport(); supportBottom.position.set(xPos, 0.5, 0); supportBottom.rotation.z = Math.PI / 2; group.add(supportBottom);
      const supportTop = createMpSupport(); supportTop.position.set(xPos, h - 0.5, 0); supportTop.rotation.z = -Math.PI / 2; group.add(supportTop);
      const centerCross = createMpCross(); centerCross.position.set(xPos, h / 2, 0); group.add(centerCross);
    });

    const supportOuterLeft = createMpSupport(); supportOuterLeft.position.set(-w / 2 + 0.5, h / 2, 0); group.add(supportOuterLeft);
    const supportOuterRight = createMpSupport(); supportOuterRight.position.set(w / 2 - 0.5, h / 2, 0); supportOuterRight.rotation.y = Math.PI; group.add(supportOuterRight);

    addNumberedMarker(1, new THREE.Vector3(-w / 2 + 6, h / 2 + 6, 4), '#ffcc00');
    addNumberedMarker(2, new THREE.Vector3(-50, h / 2 + 8, 4), '#00ff99');
  }

  // ─────────────────────────────────────────────────────────────────
  // OŚWIETLENIE LED Z SOCZEWKAMI LMD
  // ─────────────────────────────────────────────────────────────────
  function getBestLedCombination(maxLength) {
    const sizes = [50, 30, 24, 20]; let bestCombo = []; let bestSum = 0;
    function search(index, currentCombo, currentSum) {
      if (currentSum > maxLength) return;
      if (currentSum > bestSum) { bestSum = currentSum; bestCombo = [...currentCombo]; }
      else if (currentSum === bestSum && currentCombo.length < bestCombo.length) { bestCombo = [...currentCombo]; }
      for (let i = index; i < sizes.length; i++) { currentCombo.push(sizes[i]); search(i, currentCombo, currentSum + sizes[i]); currentCombo.pop(); }
    }
    search(0, [], 0); return bestCombo;
  }

  function createLedStripeMesh(size) {
    const stripeGroup = new THREE.Group();
    let pcbColor = 0xffffff;
    if (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) {
      if (size === 50) pcbColor = 0xef4444; else if (size === 30) pcbColor = 0x3b82f6; else if (size === 24) pcbColor = 0xf59e0b; else if (size === 20) pcbColor = 0x06b6d4;
    }
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, size), new THREE.MeshStandardMaterial({
      color: pcbColor, roughness: 0.8, metalness: 0.1,
      emissive: (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? pcbColor : 0x000000, emissiveIntensity: (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? 0.8 : 0.0
    }));
    pcb.position.set(0, 0.075, 0); stripeGroup.add(pcb);

    const numLenses = Math.floor(size / 5);
    const lensGeom = new THREE.CylinderGeometry(1.1, 1.1, 2.0, 16);
    const lensColor = (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? pcbColor : 0xffcc00;
    const lensMat = new THREE.MeshStandardMaterial({ color: lensColor, transparent: true, opacity: 0.6, roughness: 0.1, metalness: 0.8 });
    const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: lensColor }));

    for (let i = 0; i < numLenses; i++) {
      const zPos = -size / 2 + 2.5 + i * 5;
      const lens = new THREE.Mesh(lensGeom, lensMat); lens.position.set(0, 1.15, zPos); stripeGroup.add(lens);
      const gl = glowMesh.clone(); gl.position.set(0, 1.15, zPos); stripeGroup.add(gl);
    }
    stripeGroup.userData = { isInternalAnatomy: true }; return stripeGroup;
  }

  function populateProfileLeds(profileGroup, length) {
    const availableLength = length - 10; if (availableLength <= 0) return;
    const combo = getBestLedCombination(availableLength);
    const totalStripesLength = combo.reduce((sum, val) => sum + val, 0);
    let currentOffset = 5 + (availableLength - totalStripesLength) / 2;

    combo.forEach((size, idx) => {
      const stripe = createLedStripeMesh(size); stripe.position.set(currentOffset + size / 2, 0.5, 0); stripe.rotation.y = Math.PI / 2; profileGroup.add(stripe);
      if (idx < combo.length - 1) {
        const conn = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 1.2), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.5, metalness: 0.2 }));
        conn.position.set(currentOffset + size, 0.6, 0); profileGroup.add(conn);
      }
      currentOffset += size;
    });
  }

  populateProfileLeds(bottomP, w); populateProfileLeds(topP, w);
}