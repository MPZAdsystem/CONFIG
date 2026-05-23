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
 let colls = 0; let x = 0, y = 0, angle = 0;
 let walls = []; let pendingTurnItem = null;

 for (let item of testPlan) {
 if (item.type === 'turn') {
 item.prevAngle = angle; angle += item.angle; item.currAngle = angle;
 item.cornerX = x; item.cornerY = y; pendingTurnItem = item;
 } else if (item.type === 'jump') {
 let targetNode = testPlan[item.target];
 if (targetNode) { x = targetNode.x; y = targetNode.y; angle = targetNode.angle; }
 } else if (item.type === 'wall') {
 let tempX = x, tempY = y;
 if (pendingTurnItem) {
 let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
 let rad2 = pendingTurnItem.currAngle * Math.PI / 180;
 let offset = (item.thickness || 12) / 2;
 let sV1 = 0, sV2 = 0;
 let cType = pendingTurnItem.cornerType || 'wew-zew-1';

 // 💎 BAZOWE WEKTORY (Zawsze poprawne dla naturalnego ciągu)
 if (cType === 'zew-zew') { sV1 = offset; sV2 = offset; }
 else if (cType === 'wew-zew-1') { sV1 = -offset; sV2 = offset; }
 else if (cType === 'wew-zew-2') { sV1 = offset; sV2 = -offset; }

 // 💎 FIX "PUNKTU POCZĄTKOWEGO" (Twój strzał w dziesiątkę!)
 let isBranchingFromStart = false;
 for (let w of walls) {
 if (Math.abs(pendingTurnItem.cornerX - w.startX) < 1 && Math.abs(pendingTurnItem.cornerY - w.startY) < 1) {
 isBranchingFromStart = true; break;
 }
 }
 // Jeśli rysujemy od początku ramy, odwracamy jej wektor ucieczki
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
 alert("Blokada: Nie możesz zawrócić o 180 stopni, aby nie nałożyć ścian na siebie!");
 return;
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

 function addModule(id) {
 // Przeskok rysowania na zaznaczoną ścianę (Zostawiamy, to genialna funkcja!)
 if (selectedItemIndex !== null && plan[selectedItemIndex] && plan[selectedItemIndex].type === 'wall') {
 if (plan[selectedItemIndex].endNodeIndex !== undefined) plan.push({ type: 'jump', target: plan[selectedItemIndex].endNodeIndex });
 selectedItemIndex = null;
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

 function addSuspended(id) { let newItem = JSON.parse(JSON.stringify(DB[id])); newItem.offsetX = 0; newItem.offsetY = 0; newItem.quadTextures = {}; plan.push(newItem); render(); }

 function jumpTo(nodeIndex) { plan.push({ type: 'jump', target: nodeIndex }); selectedItemIndex = null; render(); }

 function selectItem(index, e) { e.stopPropagation(); selectedItemIndex = index; render(); }

 function deselectItem(e) { if (e.target.id === 'stage' && !isDraggingView) { selectedItemIndex = null; render(); } }

 function undo() { plan.pop(); selectedItemIndex = null; render(); }

 function clearPlan() {
 plan = [];
 selectedItemIndex = null;
 manualItems = {}; // 👈 Czyści zawartość koszyka
 lastSystemForManual = null; // Wymusza przerysowanie przycisków
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
 if (mat.map) { // Świecą tylko te strony, które mają nałożoną grafikę!
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

 const config = window.currentKasetonConfig || {
 system: 'LMD',
 width: 120,
 depth: 200, // Depth input is used as Height (Wysokość)
 cut: 'none',
 print: 'single',
 usage: 'freestanding'
 };

 const W = parseFloat(config.width) || 120;
 const H = parseFloat(config.depth) || 200;
 const sys = config.system || 'LMD';
 
 console.log('📐 Drawing custom Kaseton frame in 3D:', W, 'x', H, 'cm, System:', sys);

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

 const isLedSys = ['LMD', 'LMS', 'CTF_LED', 'LCD_LMD'].includes(sys);

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
 } else {
 // Softer, richer back-light that does not overexpose colors
 matParams.emissive = new THREE.Color(0x282828);
 matParams.emissiveIntensity = 1.0;
 }
 }
 if (textureUrl) {
 const tex = new THREE.TextureLoader().load(textureUrl);
 tex.encoding = THREE.sRGBEncoding;
 matParams.map = tex;
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

 // 3. GENERATOR PROFILU - WYBOR SYSTEMU (LMD vs LMS)
 function createProfileGroup(L) {
 if (sys === 'LMS') return createProfileGroupLMS(L);
 return createProfileGroupLMD(L);
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
  allGeoms.forEach(function(gg) {
  var edg = new THREE.EdgesGeometry(gg);
  var ln = new THREE.LineSegments(edg, edgeMat2);
  lmsGroup.add(ln);
  });

  return { group: lmsGroup };
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
 const ledY = (sys === 'LMS') ? 3.93 : 2.0;
 const ledZ = (sys === 'LMS') ? -3.5 : 0;
 
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

 // Techniczne etykietowanie w trybie blueprint
 if (isBlueprintMode && typeof window.tryLabelBlueprint === 'function') {
 const ledKey = `LED_${size}`;
 const isPower = (config.light || 'power_long').startsWith('power');
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

 const absolutePos = new THREE.Vector3(currentOffset + size / 2, ledY, ledZ);
 absolutePos.applyEuler(targetGroup.rotation);
 absolutePos.add(targetGroup.position);

 // dynamiczny offset strzałki w zależności od orientacji
 let offsetVec = new THREE.Vector3(25, 20, 20);
 if (Math.abs(targetGroup.rotation.z) > 0.1) {
 offsetVec.set(targetGroup.position.x > 0 ? 30 : -45, 20, 20);
 }
 window.tryLabelBlueprint(ledKey, absolutePos, nameMap[size] || `MODUŁ LED ${size}CM`, offsetVec);
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

 // Globalna wysokość/pozycja na podłodze (suspended = +100cm)
 const elevY = config.usage === 'suspended' ? 100 : 0;

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

 // Rejestr i funkcja pomocnicza do etykietowania LED w trybie technicznym
 const ledLabeled = new Set();
 window.tryLabelBlueprint = (key, absolutePos, text, offsetVec) => {
 if (!ledLabeled.has(key)) {
 ledLabeled.add(key);
 if (typeof window.addTechnicalLabelBlueprint === 'function') {
 window.addTechnicalLabelBlueprint(key, absolutePos, text, offsetVec);
 }
 }
 };

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
 for (let i = 1; i <= numCutsW; i++) cutX.push(-W/2 + (W / numSegmentsW) * i);
 const cutY = [];
 for (let i = 1; i <= numCutsH; i++) cutY.push(elevY + (H / numSegmentsH) * i);

 // Vertical supports (continuous)
 cutX.forEach(cx => {
 const vGeom = new THREE.BoxGeometry(5, H - 6.4, 1.5);
 const vMesh = new THREE.Mesh(vGeom, supportMat);
 vMesh.position.set(cx, elevY + H/2, (sys === 'LMS' ? -3.5 : 0));
 kGroup.add(vMesh);
 });

 // Horizontal supports (broken at vertical intersections)
 const xBounds = [-W/2 + 3.2];
 cutX.forEach(cx => { xBounds.push(cx - 2.5, cx + 2.5); });
 xBounds.push(W/2 - 3.2);

 cutY.forEach(cy => {
 for (let i = 0; i < xBounds.length; i += 2) {
 const left = xBounds[i];
 const right = xBounds[i+1];
 if (right > left) {
 const hGeom = new THREE.BoxGeometry(right - left, 5, 1.5);
 const hMesh = new THREE.Mesh(hGeom, supportMat);
 hMesh.position.set((left + right)/2, cy, (sys === 'LMS' ? -3.5 : 0));
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
 const zPos180 = isLMS ? [-5.5] : [-5.4, 5.4];
 const connZWidth = isLMS ? 0.8 : 1.5;

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
 connGroupLeft.position.set(-W/2 + xOffsetLeft, cy, zPos);
 kGroup.add(connGroupLeft);

 // Prawy profil
 const connGroupRight = connGroupLeft.clone();
 const xOffsetRight = isLMS ? 0.8 : 0.4;
 connGroupRight.position.set(W/2 - xOffsetRight, cy, zPos);
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
 [-5.4, 5.4].forEach(zPos => {
 const cGroup = new THREE.Group();
 // Horizontal arm (10cm length in X, 0.5cm height in Y, 1.5cm width in Z)
 const hArm = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 1.5), cornerMat);
 hArm.position.set(corner.dx * 5, corner.dy * 0.4, 0);
 cGroup.add(hArm);
 // Vertical arm (0.5cm width in X, 10cm length in Y, 1.5cm width in Z)
 const vArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 1.5), cornerMat);
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
 if (config.usage === 'freestanding') {
 const footGeom = new THREE.BoxGeometry(8, 2, 40);
 const footXPositions = [-W/2 + 15, W/2 - 15];
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

 uniqueX.forEach(x => {
 const footMesh = new THREE.Mesh(footGeom, aluMat);
 footMesh.position.set(x, elevY - 1, 0); // Sits at Y range [-2, 0] under the kaseton bottom profile at Y=0
 kGroup.add(footMesh);
 });
 }

 // 7.6. GENEROWANIE PODWIESZENIA (dla konfiguracji suspended)
 if (config.usage === 'suspended') {
 const suspColor = isBlueprintMode ? 0xff2222 : 0x888888;
 const suspEmissive = isBlueprintMode ? 0xaa0000 : 0x000000;
 const wireMat = new THREE.MeshStandardMaterial({ color: suspColor, emissive: suspEmissive, emissiveIntensity: isBlueprintMode ? 0.6 : 0, roughness: 0.3, metalness: 0.9 });
 const eyeletMat = new THREE.MeshStandardMaterial({ color: suspColor, emissive: suspEmissive, emissiveIntensity: isBlueprintMode ? 0.6 : 0, roughness: 0.3, metalness: 0.8 });

 // Calculate eyelet X positions on top profile
 const eyeletXPositions = [-W/2 + 1.5, W/2 - 1.5];

 // Add eyelets at cuts (30mm = 3cm offset each side)
 if (numCutsW > 0) {
 cutX.forEach(cx => {
 eyeletXPositions.push(cx - 3);
 eyeletXPositions.push(cx + 3);
 });
 }

 // Check segments between cuts for >200cm spans
 const topEdges = [-W/2];
 cutX.forEach(cx => topEdges.push(cx));
 topEdges.push(W/2);
 for (let i = 0; i < topEdges.length - 1; i++) {
 const segLen = topEdges[i+1] - topEdges[i];
 if (segLen > 200) {
 eyeletXPositions.push((topEdges[i] + topEdges[i+1]) / 2);
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
 }

 // 8. GENEROWANIE TKANINY REKLAMOWEJ (WYDRUKI)
 const printOption = config.print || 'single';
 if (printOption !== 'no_print' && !isBlueprintMode) {
 const printW = W - 0.4;
 const printH = H - 0.4;
 const planeGeom = new THREE.PlaneGeometry(printW, printH);
 const pD = (sys === 'LMS') ? 12.0 : 14.0;

 // Przód
 const hasFrontMesh = (sys === 'LMS')
 ? ['backlit_white', 'backlit_blockout'].includes(printOption)
 : ['single', 'double', 'front_blockout', 'front_blockout_2'].includes(printOption);

 if (hasFrontMesh) {
 const isFrontBlockout = false;
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
 : ['double', 'front_blockout', 'front_blockout_2', 'back_blockout'].includes(printOption);

 if (hasBackMesh) {
 const isBackBlockout = (sys === 'LMS')
 ? ['backlit_blockout'].includes(printOption)
 : ['front_blockout', 'front_blockout_2', 'back_blockout'].includes(printOption);

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
 if (!drawLeft) emptyProfiles.push({ axis: 'y', x: -W/2 + 2, rot: Math.PI/2, len: H });
 if (!drawRight) emptyProfiles.push({ axis: 'y', x: W/2 - 2, rot: Math.PI/2, len: H });
 
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
 px = -W/2 + 15 + idxOnProf * 20; // Start near left corner
 py = prof.y;
 if (px > W/2 - 10) px = W/2 - 10;
 } else {
 px = prof.x;
 py = elevY + 15 + idxOnProf * 20; // Start near bottom corner
 if (py > elevY + H - 10) py = elevY + H - 10;
 }

 pMesh.position.set(px, py, 0);
 kGroup.add(pMesh);

 // Red cable to nearest corner (where LED starts)
 const cx = px < 0 ? -W/2 + 2 : W/2 - 2;
 const cy = py < elevY + H/2 ? elevY + 2 : elevY + H - 2;
 const startPt = new THREE.Vector3(px, py, 0);
 const cornerPt = new THREE.Vector3(cx, cy, 0);
 const cGeomRed = new THREE.TubeGeometry(new THREE.LineCurve3(startPt, cornerPt), 8, 0.15, 6, false);
 kGroup.add(new THREE.Mesh(cGeomRed, cableRedMat));

 // Black power cable routing to the nearest exit corner (bottom-left or bottom-right)
 const exitX = px < 0 ? -W/2 + 2 : W/2 - 2;
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
 for(let j=0; j<=25; j++) {
 const t = j/25;
 const r = 3 + t * 2;
 const cx_coil = exitX + (px < 0 ? -5 : 5) + Math.cos(angle)*r*(px < 0 ? 1 : -1);
 const cz_coil = 12 + Math.sin(angle)*r;
 const cy_coil = elevY - 10 - t*6;
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
 const px = -W/2 - 10 - i*20;
 const py = elevY - 15;
 pMesh.position.set(px, py, 5);
 kGroup.add(pMesh);

 // Red cable from Kaseton corner to PSU
 const startPt = new THREE.Vector3(-W/2, elevY, 5);
 const endPt = new THREE.Vector3(px, py + psuBoxH/2, 5);
 const cGeomRed = new THREE.TubeGeometry(new THREE.LineCurve3(startPt, endPt), 8, 0.15, 6, false);
 kGroup.add(new THREE.Mesh(cGeomRed, cableRedMat));

 // Black coiled cable from PSU
 const coilPts = [new THREE.Vector3(px, py - psuBoxH/2, 5)];
 let angle = 0;
 for(let j=0; j<=15; j++) {
 const t = j/15;
 const r = 2 + t;
 const cx_coil = px - 3 + Math.cos(angle)*r;
 const cz_coil = 8 + Math.sin(angle)*r;
 const cy_coil = py - 3 - t*4;
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
 // TRYB TECHNICZNY (BLUEPRINT MODE) - STRZAŁKI, OPISY I MIARKI W 3D
 
 // Funkcja pomocnicza generująca strzałkę oraz etykietę o wysokości dokładnie 30cm (30 jednostek 3D)
 function addTechnicalLabel3D(targetPt, text, labelOffset, labelColor) {
 const color = labelColor || '#ffffff';
 const colorHex = parseInt(color.replace('#', ''), 16);
 const arrowPt = targetPt.clone().add(labelOffset.clone().multiplyScalar(1.5));
 
 // Linia łącząca element z tekstem
 const lineGeo = new THREE.BufferGeometry().setFromPoints([targetPt, arrowPt]);
 const lineMat = new THREE.LineBasicMaterial({ color: colorHex, depthTest: false, transparent: true, opacity: 0.9 });
 const line = new THREE.Line(lineGeo, lineMat);
 line.renderOrder = 999;
 kGroup.add(line);

 // Główka strzałki (stożek) na targetPt
 const dir = targetPt.clone().sub(arrowPt).normalize();
 const coneGeom = new THREE.ConeGeometry(1.5, 4.0, 8);
 const coneMat = new THREE.MeshBasicMaterial({ color: colorHex, depthTest: false });
 const cone = new THREE.Mesh(coneGeom, coneMat);
 cone.position.copy(targetPt);
 cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
 cone.renderOrder = 999;
 kGroup.add(cone);

 // Płótno 2D do narysowania tekstu
 const canvas = document.createElement('canvas');
 const ctx = canvas.getContext('2d');
 canvas.width = 1024;
 canvas.height = 512;
 
 ctx.fillStyle = 'rgba(0,0,0,0)';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 
 ctx.font = 'bold 54px Arial';
 ctx.fillStyle = color;
 ctx.textAlign = 'left';
 ctx.textBaseline = 'top';
 
 const words = text.toUpperCase().split(' ');
 let lineStr = '';
 let lines = [];
 const maxWidth = 980;
 
 for(let n = 0; n < words.length; n++) {
 const testLine = lineStr + words[n] + ' ';
 const metrics = ctx.measureText(testLine);
 if (metrics.width > maxWidth && n > 0) {
 lines.push(lineStr);
 lineStr = words[n] + ' ';
 } else {
 lineStr = testLine;
 }
 }
 lines.push(lineStr);
 
 const lineHeight = 64;
 const totalHeight = lines.length * lineHeight;
 let startY = (canvas.height - totalHeight) / 2;
 
 lines.forEach(l => {
 ctx.fillText(l.trim(), 20, startY);
 startY += lineHeight;
 });
 
 const texture = new THREE.CanvasTexture(canvas);
 const spriteMat = new THREE.SpriteMaterial({
 map: texture,
 transparent: true,
 depthTest: false
 });
 const sprite = new THREE.Sprite(spriteMat);
 
 const aspect = canvas.width / canvas.height;
 sprite.scale.set(40 * aspect, 40, 1);
 sprite.position.copy(arrowPt.clone().add(new THREE.Vector3(2, 0, 5)));
 sprite.renderOrder = 1000;
 kGroup.add(sprite);
 }

 // Globalna etykieta i registry
 const labeledItems = new Set();
 const tryLabel = (key, targetPt, text, offset, labelColor) => {
 if (!labeledItems.has(key)) {
 labeledItems.add(key);
 addTechnicalLabel3D(targetPt, text, offset, labelColor);
 }
 };

 // Definiujemy globalny handler dla LEDów, aby addLedStripesToProfileGroup mógł narysować strzałki
 window.addTechnicalLabelBlueprint = (key, absolutePos, text, offsetVec) => {
 addTechnicalLabel3D(absolutePos, text, offsetVec);
 };

 // Ponowne narysowanie LEDów (żeby wywołać etykietowanie), ponieważ diody LED są już dodane,
 // ale etykiety LED generowane są tylko wtedy, gdy addTechnicalLabelBlueprint jest zdefiniowany.
 // Ponieważ jednak LEDy są generowane bezpośrednio w drawKasetonScene powyżej, przed zdefiniowaniem
 // addTechnicalLabelBlueprint, po prostu wywołujemy tryLabel na diodach LED z zarejestrowanych pozycji,
 // lub po prostu pozwalamy, żeby system narysował je automatycznie przy odświeżeniu sceny!
 // W rzeczywistości, ponieważ update3DScene() kasuje całą scenę i rysuje kaseton OD NOWA przy zmianie
 // trybu wymiarów, to przy wejściu w tryb Blueprint cała funkcja drawKasetonScene() uruchamia się od nowa,
 // a window.addTechnicalLabelBlueprint byłby undefined podczas generowania LEDów!
 // ROZWIĄZANIE: Przenosimy rejestrację window.addTechnicalLabelBlueprint na sam początek drawKasetonScene()
 // w celu perfekcyjnej synchronizacji! Poniżej go jedynie usuwamy po zakończeniu rysowania.

 // A) Profil główny (np. dolny bok)
 tryLabel('MAIN_PROFILE', new THREE.Vector3(-W / 3, elevY, 0), 'PROFIL LMD ODCHUDZONY', new THREE.Vector3(-25, -45, 20));

 // B) Narożniki kasetonu
 tryLabel('CORNER', new THREE.Vector3(-W / 2, elevY, 0), 'ADFRAME LMD NAROŻNIK WZMACNIANY', new THREE.Vector3(-45, -20, 25));

 // C) Supporty i ich zamki (jeśli istnieją)
 if (numCutsW > 0 || numCutsH > 0) {
 if (cutX.length > 0) {
 tryLabel('SUPPORT', new THREE.Vector3(cutX[0], elevY + H / 2, 0), 'PROFIL SUPPORT LIGHT', new THREE.Vector3(35, 35, 20));
 tryLabel('LOCK', new THREE.Vector3(cutX[0], elevY + 5, 0), 'ADFRAME SUPPORT ZAMEK', new THREE.Vector3(35, -15, 20));
 }
 }

 // C2) łączniki długie (pomarańczowe)
 if (numCutsW > 0 || numCutsH > 0) {
 if (cutX.length > 0) {
 tryLabel('LONG_CONNECTOR', new THREE.Vector3(cutX[0], elevY, 5.4), 'ADFRAME LMD ŁĄCZNIK 180° DŁUGI', new THREE.Vector3(40, -40, 25), '#ff8c00');
 } else if (cutY.length > 0) {
 tryLabel('LONG_CONNECTOR', new THREE.Vector3(-W / 2, cutY[0], 5.4), 'ADFRAME LMD ŁĄCZNIK 180° DŁUGI', new THREE.Vector3(-50, 20, 25), '#ff8c00');
 }
 }

 // C3) Narożniki wzmacniane (fioletowe)
 tryLabel('CORNER_REINFORCED', new THREE.Vector3(-W / 2 + 5, elevY + 5, 5.4), 'ADFRAME LMD NAROŻNIK WZMACNIANY', new THREE.Vector3(-50, -35, 25), '#aa00ff');

 // D) Zasilacz (wewnętrzny / zewnętrzny)
 if (config.power !== 'none' && isLedSys) {
 const reqPower = totalPowerW * 1.1;
 let psuLabel = 'ZASILACZ WEWNĘTRZNY';
 if ((config.light || '').includes('around')) psuLabel = 'ZASILACZ ZEWNĘTRZNY';
 tryLabel('PSU', new THREE.Vector3(0, elevY + 15, 0), psuLabel, new THREE.Vector3(-40, 25, 25));
 }

 // E) Dodatkowe profesjonalne miarki wymiarowe (ruler tapes) dla Szerokości i Wysokości
 const pW1 = new THREE.Vector3(-W/2, elevY, 0);
 const pW2 = new THREE.Vector3(W/2, elevY, 0);
 const dimWGroup = addDimension3D(pW1, pW2, `${W} cm`, new THREE.Vector3(0, -25, 0), 1.3);
 kGroup.add(dimWGroup);

 const pH1 = new THREE.Vector3(W/2, elevY, 0);
 const pH2 = new THREE.Vector3(W/2, elevY + H, 0);
 const dimHGroup = addDimension3D(pH1, pH2, `${H} cm`, new THREE.Vector3(25, 0, 0), 1.3);
 kGroup.add(dimHGroup);
 }

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