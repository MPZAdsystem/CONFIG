function updateLighting() {
 if (!scene) return;
 let ambVal = parseFloat(document.getElementById('ambLightSlider').value);
 if (windowAmbientLight) windowAmbientLight.intensity = ambVal;

 let dirVal = parseFloat(document.getElementById('dirLightSlider').value);

 windowDirLights.forEach(l => {
 scene.remove(l);
 if (l.target) scene.remove(l.target);
 });
 windowDirLights = [];

 studioLights.forEach(lData => {
 let light = new THREE.DirectionalLight(0xffffff, dirVal);
 light.position.set(lData.offsetX, 300, lData.offsetY);
 light.target.position.set(0, 125, 0);
 scene.add(light);
 scene.add(light.target);
 windowDirLights.push(light);
 });
}

function updateLedSettings() {
 currentLedIntensity = parseFloat(document.getElementById('ledIntensitySlider').value);
 window.activeLedMaterials.forEach(mat => {
 mat.emissiveIntensity = currentLedIntensity;
 });
}

function setLedMode(mode, colorHex) {
 currentLedMode = mode;
 if (mode === 'static' && colorHex) {
 currentLedColor = colorHex;
 const colorObj = new THREE.Color(colorHex);
 window.activeLedMaterials.forEach(mat => mat.emissive.copy(colorObj));
 document.getElementById('ledColorPicker').value = colorHex;
 }
}

function rebuildGrid(colorCenterLine, colorGrid) {
 if (!scene || !windowGridHelper) return;
 scene.remove(windowGridHelper);
 windowGridHelper.geometry.dispose();
 windowGridHelper.material.dispose();
 windowGridHelper = new THREE.GridHelper(2000, 40, colorCenterLine, colorGrid);
 scene.add(windowGridHelper);
}

function setSceneBg(type, btnElement = null) {
 if (!scene) return;

 // 1. Sprzątanie starej hali przed zmianą trybu
 scene.environment = null;
 if (windowExpoFloor) { scene.remove(windowExpoFloor); windowExpoFloor.geometry.dispose(); windowExpoFloor.material.dispose(); windowExpoFloor = null; }
 if (windowExpoCeiling) { scene.remove(windowExpoCeiling); windowExpoCeiling.geometry.dispose(); windowExpoCeiling.material.dispose(); windowExpoCeiling = null; }
 if (windowExpoWalls) { scene.remove(windowExpoWalls); windowExpoWalls.geometry.dispose(); windowExpoWalls.material.dispose(); windowExpoWalls = null; }

 // Sprzątanie po trybie Quad (jeśli był włączony)
 const existingQuadBg = scene.getObjectByName('QuadBackgroundGroup');
 if (existingQuadBg) scene.remove(existingQuadBg);

 if (type === 'white') {
 scene.background = new THREE.Color(0xf0f0f0);
 if (typeof rebuildGrid === 'function') rebuildGrid(0xcccccc, 0xe0e0e0);
 isNightMode = false;
 } else if (type === 'black') {
 scene.background = new THREE.Color(0x121212);
 if (typeof rebuildGrid === 'function') rebuildGrid(0x444444, 0x222222);
 } else if (type === 'blue') {
 scene.background = new THREE.Color(0x1e3b70);
 if (typeof rebuildGrid === 'function') rebuildGrid(0x8bb3ff, 0x2a52be);
 isNightMode = false;
 } else if (type === 'expo') {
 if (windowGridHelper) { scene.remove(windowGridHelper); windowGridHelper = null; }

 // --- BUDOWA FIZYCZNEJ HALI TARGOWEJ 3D ---
 const hallRadius = 1500; // 15 metrów promienia
 const hallHeight = 800; // 8 metrów wysokości

 // Podłoga (lekko błyszcząca)
 const floorGeom = new THREE.CircleGeometry(hallRadius, 64);
 const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.4 });
 windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
 windowExpoFloor.rotation.x = -Math.PI / 2;
 windowExpoFloor.position.y = -0.5;
 scene.add(windowExpoFloor);

 // Sufit (czarny, matowy)
 const ceilingGeom = new THREE.CircleGeometry(hallRadius, 64);
 const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, side: THREE.DoubleSide });
 windowExpoCeiling = new THREE.Mesh(ceilingGeom, ceilingMat);
 windowExpoCeiling.rotation.x = Math.PI / 2;
 windowExpoCeiling.position.y = hallHeight;
 scene.add(windowExpoCeiling);

 // Ściany boczne (cylinder otaczający stoisko)
 const wallGeom = new THREE.CylinderGeometry(hallRadius, hallRadius, hallHeight, 32, 1, true);
 const wallMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1.0, side: THREE.BackSide });
 windowExpoWalls = new THREE.Mesh(wallGeom, wallMat);
 windowExpoWalls.position.y = hallHeight / 2;
 scene.add(windowExpoWalls);

 // --- ŁADOWANIE MAPY ODBIĆ HDR (Metaliczne ramki) ---
 let oldText = "";
 if (btnElement) { oldText = btnElement.innerText; btnElement.innerText = "⏳ Ładowanie HDRI..."; }
 const HDR_URL = 'https://raw.githubusercontent.com/MPZAdsystem/Background/main/b2.hdr';

 new THREE.RGBELoader().load(HDR_URL, function (texture) {
 texture.mapping = THREE.EquirectangularReflectionMapping;
 scene.environment = texture; // Ustawienie HDR na odbicia światła
 scene.background = new THREE.Color(0x000000); // Wypełnienie tła pod halą na czarno

 if (btnElement) btnElement.innerText = oldText;
 if (typeof render === 'function') render();
 }, undefined, function (err) {
 console.error("Błąd ładowania mapy HDR:", err);
 if (btnElement) btnElement.innerText = "❌ Błąd HDR";
 });

 } else if (type === 'dark_hall') {
 // --- KLON TRYBU QUAD (DARK HALL) ---
 if (windowGridHelper) { scene.remove(windowGridHelper); windowGridHelper = null; }

 const quadRadius = 2000;
 // 1. Zmniejszamy wysokość do 1000, aby zachować proporcje Twojej grafiki i uniknąć szarości
 const quadHeight = 1000;

 // Podłoga: Absolutna czerń (0x000000) i pełny mat (roughness 1.0)
 const floorGeom = new THREE.CircleGeometry(quadRadius, 64);
 const floorMat = new THREE.MeshStandardMaterial({
 color: 0x000000,
 roughness: 1.0,
 metalness: 0.0
 });
 windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
 windowExpoFloor.rotation.x = -Math.PI / 2;
 windowExpoFloor.position.y = -0.5;
 scene.add(windowExpoFloor);

 // Czarne tło sceny
 scene.background = new THREE.Color(0x000000);

 // --- TWOJE GRAFIKI DARK HALL ---
 const base = "https://raw.githubusercontent.com/Valaron86/hall-image/441241fed4ce12515406ff856aafa60982fc3cda/";
 const darkTextures = [
 base + "darkhall3.jpg", // Front
 base + "darkhall3.jpg", // Prawo
 base + "darkhall3.jpg", // Tył
 base + "darkhall3.jpg" // Lewo
 ];

 if (typeof createQuadBackground === 'function') {
 createQuadBackground(scene, darkTextures, quadRadius, quadHeight);
 }
 // 🔥 NAPRAWA ZASIĘGU WIDZENIA KAMERY 🔥
 if (typeof camera !== 'undefined') {
 camera.far = 15000; // Zwiększamy zasięg widzenia do 150 metrów
 camera.updateProjectionMatrix(); // Wymuszamy aktualizację optyki
 }

 // 2. Korekta ekspozycji renderera, aby wyciągnąć kontrast (możesz regulować od 1.0 do 1.5)
 if (typeof renderer !== 'undefined') {
 renderer.toneMappingExposure = 1.2;
 }

 if (typeof render === 'function') render();
 }
 else if (type === 'quad_test') {
 // --- NASZ NOWY TRYB Z 4 GRAFIKAMI ---
 if (windowGridHelper) { scene.remove(windowGridHelper); windowGridHelper = null; }

 const quadRadius = 2000; // 20 metrów promienia (oddalenie grafik)
 const quadHeight = 1500; // Wysokość ścian

 // Podłoga dopasowana do promienia 20 metrów
 const floorGeom = new THREE.CircleGeometry(quadRadius, 64);
 const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.4 });
 windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
 windowExpoFloor.rotation.x = -Math.PI / 2;
 windowExpoFloor.position.y = -0.5;
 scene.add(windowExpoFloor);

 scene.background = new THREE.Color(0x111111); // Tło za oknami/krawędziami na ciemny szary

 // Testowe linki (obrazki placeholder). 
 // Podmień na własne linki do grafik, gdy będziesz gotowy!
 const testTextures = [
 'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png',
 'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png',
 'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png',
 'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png'
 ];

 // Wywołanie naszej zewnętrznej funkcji do zbudowania ścian
 if (typeof createQuadBackground === 'function') {
 createQuadBackground(scene, testTextures, quadRadius, quadHeight);
 } else {
 console.error("Nie znaleziono funkcji createQuadBackground!");
 }

 if (typeof render === 'function') render();

 } else if (type === 'dark_sketch') {
 // --- HYBRYDA: DARK SKETCH + HDRI (BLACK BOX VERSION) ---
 if (windowGridHelper) { scene.remove(windowGridHelper); windowGridHelper = null; }

 // 💎 USUWANIE STAREJ ŚNIEŻNOBIAŁEJ PODŁOGI:
 if (typeof windowExpoFloor !== 'undefined' && windowExpoFloor) {
 scene.remove(windowExpoFloor);
 }
 if (typeof windowCeiling !== 'undefined' && windowCeiling) {
 scene.remove(windowCeiling);
 }

 const quadRadius = 2500;
 const quadHeight = 1200;

 // 1. CZARNA MATOWA PODŁOGA (Odcięta od refleksów HDRI)
 const floorGeom = new THREE.CircleGeometry(quadRadius, 64);
 const floorMat = new THREE.MeshStandardMaterial({
 color: 0x000000,
 roughness: 1.0,
 metalness: 0.0,
 envMapIntensity: 0.0 // 👈 To blokuje błyszczenie od mapy środowiskowej
 });
 windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
 windowExpoFloor.rotation.x = -Math.PI / 2;
 windowExpoFloor.position.y = -0.1; // 👈 Podnosimy tuż pod stoisko
 scene.add(windowExpoFloor);

 // 2. CZARNY MATOWY SUFIT (Odcięty od refleksów HDRI)
 const ceilGeom = new THREE.CircleGeometry(quadRadius, 64);
 const ceilMat = new THREE.MeshStandardMaterial({
 color: 0x000000,
 roughness: 1.0,
 metalness: 0.0,
 envMapIntensity: 0.0 // 👈 To blokuje błyszczenie
 });
 window.windowCeiling = new THREE.Mesh(ceilGeom, ceilMat);
 window.windowCeiling.rotation.x = Math.PI / 2; // Obrót, aby "patrzył" w dół
 window.windowCeiling.position.y = quadHeight;
 scene.add(window.windowCeiling);

 // 3. Czarne tło systemowe
 scene.background = new THREE.Color(0x000000);

 // 4. Wgrywanie grafik Dark Sketch na ściany boczne
 const sketchTextureUrl = "https://raw.githubusercontent.com/Valaron86/hall-image/13be81aea219940f1f2a728047716440735474e6/Darkhallsketch.jpg";
 const sketchTextures = [sketchTextureUrl, sketchTextureUrl, sketchTextureUrl, sketchTextureUrl];

 if (typeof createQuadBackground === 'function') {
 createQuadBackground(scene, sketchTextures, quadRadius, quadHeight);
 }

 // 5. KOREKTA KAMERY I EKSPOZYCJI
 if (typeof camera !== 'undefined') {
 camera.far = 15000;
 camera.updateProjectionMatrix();
 }
 if (typeof renderer !== 'undefined') renderer.toneMappingExposure = 1.3;

 // 6. REFLEKSY HDRI
 let oldText = "";
 if (btnElement) { oldText = btnElement.innerText; btnElement.innerText = "⏳ Ładowanie HDRI..."; }
 const HDR_URL = 'https://raw.githubusercontent.com/MPZAdsystem/Background/main/b2.hdr';

 new THREE.RGBELoader().load(HDR_URL, function (texture) {
 texture.mapping = THREE.EquirectangularReflectionMapping;
 scene.environment = texture;

 if (btnElement) btnElement.innerText = oldText;
 if (typeof render === 'function') render();
 });

 if (typeof render === 'function') render();
 }
}

function init3D() {
 const container = document.getElementById('stage3DContainer');

 // Czyszczenie starego płótna przed inicjalizacją nowego, zapobiega powielaniu okien WebGL
 const oldCanvas = container.querySelector('canvas');
 if (oldCanvas) oldCanvas.remove();

 scene = new THREE.Scene();

 // NOWE: Grupa niosąca całe stoisko dla AR
 arGroup = new THREE.Group();
 scene.add(arGroup);

 windowGridHelper = new THREE.GridHelper(2000, 40, 0xcccccc, 0xe0e0e0);
 scene.add(windowGridHelper);

 // 1. Światło globalne (Ambient)
 windowAmbientLight = new THREE.AmbientLight(0xffffff, 0.45);
 scene.add(windowAmbientLight);

 // 2. Generujemy układ świateł 3D (4 lampy studyjne) wyłącznie na podstawie Twoich suwaków z menu
 updateLighting();
 setSceneBg('dark_sketch');

 camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 10000);
 camera.position.set(600, 500, 800);

 // ZMIANA: Opcja alpha: true pozwala kamerze telefonu widzieć świat zewnętrzny
 renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
 renderer.setSize(container.clientWidth, container.clientHeight);

 // 🔥 USTAWIENIA "LIVELY COLORS" (Wierność DTP):
 renderer.outputEncoding = THREE.sRGBEncoding;
 renderer.toneMapping = THREE.LinearToneMapping; // 👈 Zmienione z ACES, żeby chronić żółty kolor!
 renderer.toneMappingExposure = 0.85;

 // 🚨 WYKRYWANIE AWARII KARTY GRAFICZNEJ (Zabezpieczenie przed Szarym Ekranem)
 renderer.domElement.addEventListener('webglcontextlost', function (event) {
 event.preventDefault(); // Powstrzymujemy przeglądarkę przed ubiciem karty
 const crashScreen = document.getElementById('crash-screen');
 if (crashScreen) crashScreen.style.display = 'flex'; // Pokazujemy ratunkowy ekran awarii
 }, false);

 container.appendChild(renderer.domElement);

 // --- INICJALIZACJA AR --- 
 renderer.xr.enabled = true;

 const arBtn = ARButton.createButton(renderer, { optionalFeatures: ['hit-test'] });
 arBtn.id = 'ARButton'; // Dodajemy ID aby zadziałał nasz nowy, piękny CSS

 const leftFabContainer = document.querySelector('.fab-container-left');
 if (leftFabContainer) leftFabContainer.appendChild(arBtn);

 // Celownik AR
 const reticleGeom = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
 const reticleMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
 reticle = new THREE.Mesh(reticleGeom, reticleMat);
 reticle.matrixAutoUpdate = false;
 reticle.visible = false;
 scene.add(reticle);

 // Stawianie stoiska
 const controller = renderer.xr.getController(0);
 controller.addEventListener('select', function () {
 if (reticle.visible) {
 arGroup.position.setFromMatrixPosition(reticle.matrix);
 arGroup.scale.set(0.01, 0.01, 0.01);
 arGroup.visible = true;
 } else if (isARMode) {
 const cameraDirection = new THREE.Vector3();
 camera.getWorldDirection(cameraDirection);

 arGroup.position.copy(camera.position).add(cameraDirection.multiplyScalar(3));
 arGroup.position.y -= 1.5;

 arGroup.scale.set(0.01, 0.01, 0.01);
 arGroup.visible = true;
 }
 });
 scene.add(controller);

 // Obsługa ekranu po wejściu do AR
 renderer.xr.addEventListener('sessionstart', () => {
 isARMode = true;
 scene.background = null;
 if (windowGridHelper) windowGridHelper.visible = false;
 if (windowExpoFloor) windowExpoFloor.visible = false;
 if (windowExpoCeiling) windowExpoCeiling.visible = false;
 arGroup.visible = false;
 const uiPanel = document.querySelector('.ui-3d-panel');
 if (uiPanel) uiPanel.style.display = 'none';
 });

 // Powrót do 3D po wyjściu z AR
 renderer.xr.addEventListener('sessionend', () => {
 isARMode = false;
 arGroup.position.set(0, 0, 0);
 arGroup.scale.set(1, 1, 1);
 arGroup.visible = true;
 if (windowGridHelper) windowGridHelper.visible = true;
 if (windowExpoFloor) windowExpoFloor.visible = true;
 if (windowExpoCeiling) windowExpoCeiling.visible = true;
 setSceneBg(isBlueprintMode ? 'blue' : 'white');
 const uiPanel = document.querySelector('.ui-3d-panel');
 if (uiPanel) uiPanel.style.display = 'flex';
 });

 controls = new THREE.OrbitControls(camera, renderer.domElement);
 controls.target.set(0, 125, 0);
 controls.autoRotate = false;
 controls.autoRotateSpeed = 1.5;
 controls.enableDamping = true;
 controls.update();

 const raycaster = new THREE.Raycaster();
 const mouse = new THREE.Vector2();
 container.addEventListener('dragover', (e) => e.preventDefault());

 container.addEventListener('drop', (event) => {
 event.preventDefault();
 if (!is3DMode) return;

 const file = event.dataTransfer.files[0];
 if (!file) return;

 const validExts = ['jpg', 'jpeg', 'png', 'pdf', 'tiff', 'tif'];
 const fileExt = file.name.split('.').pop().toLowerCase();

 if (!validExts.includes(fileExt)) {
 alert("Obsługiwane formaty to: JPG, PNG, TIFF, PDF"); return;
 }

 const rect = container.getBoundingClientRect();
 mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
 mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

 raycaster.setFromCamera(mouse, camera);
 const intersects = raycaster.intersectObjects(sceneObjects, true);

 for (let i = 0; i < intersects.length; i++) {
 const intersect = intersects[i];
 const mesh = intersect.object;

 if (mesh.userData && mesh.userData.isFloor) {
 const matIndex = intersect.face.materialIndex;
 if (matIndex === 2) {
 floorConfig.textureName = file.name;
 refreshGraphicsList();
 handleDroppedFile(file, fileExt, (source) => applyTextureToMesh(mesh, matIndex, null, source, null, true));
 break;
 }
 } else if (mesh.userData && mesh.userData.isDaszekPart) {
 const planIdx = mesh.userData.planIndex;
 const accIdx = mesh.userData.accIdx;
 const part = mesh.userData.part;
 const matIndex = intersect.face ? intersect.face.materialIndex : null;

 if (matIndex === 4 || matIndex === 5) {
 let side = matIndex === 4 ? 'Front' : 'Back';
 let acc = plan[planIdx].accessories[accIdx];
 if (!acc) return;
 acc['tex' + part + side + 'Name'] = file.name;
 refreshGraphicsList();

 handleDroppedFile(file, fileExt, (source) => {
 let texture;
 let dataUrl = typeof source === 'string' ? source : source.toDataURL('image/jpeg', 0.8);
 if (typeof source === 'string') texture = new THREE.TextureLoader().load(source);
 else { texture = new THREE.CanvasTexture(source); texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); }

 acc['tex' + part + side] = dataUrl;
 mesh.material[matIndex] = new THREE.MeshStandardMaterial({
 map: texture,
 roughness: 0.35,
 metalness: 0.1
 });
 mesh.material[matIndex].needsUpdate = true;
 });
 break;
 }
 } else if (mesh.userData && mesh.userData.isKasetonPrint) {
 const side = mesh.userData.side;
 if (!window.currentKasetonConfig) window.currentKasetonConfig = {};
 if (side === 'front') {
 window.currentKasetonConfig.textureFrontName = file.name;
 } else {
 window.currentKasetonConfig.textureBackName = file.name;
 }
 refreshGraphicsList();
 handleDroppedFile(file, fileExt, (source) => {
 let dataUrl = typeof source === 'string' ? source : source.toDataURL('image/jpeg', 0.95);
 if (side === 'front') {
 window.currentKasetonConfig.textureFront = dataUrl;
 } else {
 window.currentKasetonConfig.textureBack = dataUrl;
 }
 update3DScene();
 });
 break;
 } else if (mesh.userData && mesh.userData.isWall) {
 const planIdx = mesh.userData.planIndex;
 const quadIdx = mesh.userData.quadIdx;

 if (mesh.userData.isRingOut !== undefined) {
 if (!plan[planIdx].quadTextures) plan[planIdx].quadTextures = {};
 let side = mesh.userData.isRingOut ? 'Out' : 'In';
 plan[planIdx].quadTextures[side + quadIdx + 'Name'] = file.name;
 refreshGraphicsList();
 handleDroppedFile(file, fileExt, (source) => applyTextureToMesh(mesh, null, planIdx, source, quadIdx, false, side));
 break;
 } else {
 const matIndex = intersect.face ? intersect.face.materialIndex : null;
 if (matIndex === 4 || matIndex === 5) {
 if (quadIdx !== undefined) {
 if (!plan[planIdx].quadTextures) plan[planIdx].quadTextures = {};
 let side = matIndex === 4 ? 'Out' : 'In';
 plan[planIdx].quadTextures[side + quadIdx + 'Name'] = file.name;
 } else {
 if (matIndex === 4) plan[planIdx].textureFrontName = file.name;
 else plan[planIdx].textureBackName = file.name;
 }
 refreshGraphicsList();
 handleDroppedFile(file, fileExt, (source) => applyTextureToMesh(mesh, matIndex, planIdx, source, quadIdx, false));
 break;
 }
 }
 }
 }
 });
 loadWalkingMan();
}

function animate3D() {
 if (is3DMode) {
 isAnimating = true;

 renderer.setAnimationLoop((timestamp, frame) => {
 if (!is3DMode) {
 renderer.setAnimationLoop(null);
 isAnimating = false;
 return;
 }

 // Bezpieczna ochrona asynchronicznego miksera kości animacji
 if (mixer && typeof clock !== 'undefined') {
 const delta = clock.getDelta();
 if (delta < 0.1) mixer.update(delta); // Zabezpieczenie przed skokami klatek (Lag spike)
 }

 if (controls) controls.update();

 if (currentLedMode === 'auto') {
 const time = Date.now() * 0.001;
 const hslColor = new THREE.Color().setHSL((time * 0.05) % 1, 1, 0.5);
 if (window.activeLedMaterials) {
 window.activeLedMaterials.forEach(mat => mat.emissive.copy(hslColor));
 }
 }

 renderer.render(scene, camera);

 if (currentSystem === 'foldable' && typeof updateFoldableRadialMenus === 'function') {
 updateFoldableRadialMenus(camera, renderer);
 }
 });
 } else {
 isAnimating = false;
 if (renderer) renderer.setAnimationLoop(null);
 }
}

function update3DScene() {
 // Całkowicie bezpieczna inicjalizacja/czyszczenie bez względu na zasięg leksykalny
 if (typeof window.foldablePlanes !== 'undefined') {
 window.foldablePlanes = [];
 } else {
 window.foldablePlanes = [];
 }

 foldablePlanes = window.foldablePlanes;

 if (!scene) return;

 sceneObjects.forEach(obj => {
 if (scene) scene.remove(obj);
 if (arGroup) arGroup.remove(obj);

 if (obj.isMesh) {
 if (obj.geometry) {
 obj.geometry.dispose();
 }

 if (obj.material) {
 if (Array.isArray(obj.material)) {
 obj.material.forEach(m => {
 if (m) m.dispose();
 });
 } else {
 obj.material.dispose();
 }
 }
 } else if (obj.isGroup) {
 obj.children.forEach(child => {
 if (child.isMesh || child.isLineSegments || child.isLine) {
 if (child.geometry) child.geometry.dispose();

 if (child.material) {
 if (Array.isArray(child.material)) {
 child.material.forEach(m => {
 if (m) m.dispose();
 });
 } else {
 child.material.dispose();
 }
 }
 } else if (child.isSprite) {
 if (child.material) {
 if (child.material.map) child.material.map.dispose();
 child.material.dispose();
 }
 }
 });
 }
 });

 sceneObjects = [];
 window.activeLedMaterials = [];
 let globalElevationY = 0;

 if (currentSystem === 'mframe_pallet') {
 if (typeof drawMframePalletScene === 'function') drawMframePalletScene();
 return;
 }

 if (currentSystem === 'kasetony_niestandardowe') {
 if (window.isKasetonPackedMode && typeof drawCartonScene === 'function') {
 drawCartonScene();
 } else if (typeof drawKasetonScene === 'function') {
 drawKasetonScene();
 }
 const btnSpakuj = document.getElementById('btnSpakuj');
 if (btnSpakuj) btnSpakuj.style.display = is3DMode ? 'flex' : 'none';
 return;
 }

 if (floorConfig.type !== 'none' && floorConfig.width > 0 && floorConfig.depth > 0) {
 let thickness = floorConfig.type === 'carpet' ? 2 : (floorConfig.type === 'adfloor' || floorConfig.type === 'adfloor_led' || floorConfig.type === 'adfloor_viz' ? 12 : 4);
 if (floorConfig.type === 'adfloor' || floorConfig.type === 'adfloor_led' || floorConfig.type === 'adfloor_viz') globalElevationY = 12;

 const geom = new THREE.BoxGeometry(floorConfig.width, thickness, floorConfig.depth);
 const sideMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
 const texLoader = new THREE.TextureLoader();

 let topMat;
 if (floorConfig.textureData) {
 topMat = new THREE.MeshStandardMaterial({ map: texLoader.load(floorConfig.textureData), roughness: 0.15, metalness: 0.0, color: 0xffffff });
 } else {
 if (floorConfig.type === 'adfloor' || floorConfig.type === 'adfloor_led' || floorConfig.type === 'adfloor_viz') {
 topMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.15, metalness: 0.0 });
 } else {
 topMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
 }
 }

 const floorMesh = new THREE.Mesh(geom, [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
 floorMesh.position.set(floorConfig.offsetX, globalElevationY - thickness / 2, floorConfig.offsetY);
 floorMesh.userData = { isFloor: true };
 scene.add(floorMesh); sceneObjects.push(floorMesh);

 if (floorConfig.type === 'adfloor' || floorConfig.type === 'adfloor_led' || floorConfig.type === 'adfloor_viz') {
 const gridGroup = new THREE.Group();
 gridGroup.userData = { isGrid: true };
 const lineMat = new THREE.LineBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.8 });

 const startX = -floorConfig.width / 2;
 const startZ = -floorConfig.depth / 2;
 const topY = globalElevationY + 0.1;

 for (let x = 0; x <= floorConfig.width; x += 100) {
 const lGeo = new THREE.BufferGeometry().setFromPoints([
 new THREE.Vector3(startX + x + floorConfig.offsetX, topY, startZ + floorConfig.offsetY),
 new THREE.Vector3(startX + x + floorConfig.offsetX, topY, startZ + floorConfig.depth + floorConfig.offsetY)
 ]);
 gridGroup.add(new THREE.Line(lGeo, lineMat));
 }
 for (let z = 0; z <= floorConfig.depth; z += 100) {
 const lGeo = new THREE.BufferGeometry().setFromPoints([
 new THREE.Vector3(startX + floorConfig.offsetX, topY, startZ + z + floorConfig.offsetY),
 new THREE.Vector3(startX + floorConfig.width + floorConfig.offsetX, topY, startZ + z + floorConfig.offsetY)
 ]);
 gridGroup.add(new THREE.Line(lGeo, lineMat));
 }
 scene.add(gridGroup);
 sceneObjects.push(gridGroup);
 }

 if (floorConfig.type === 'adfloor_led' || floorConfig.type === 'adfloor_viz') {
 const hw = floorConfig.width / 2;
 const hd = floorConfig.depth / 2;

 const rampProfile = [
 { x: 0, y: 12 }, { x: 1.0, y: 12 }, { x: 1.0, y: 10 }, { x: 5.0, y: 10 },
 { x: 5.0, y: 12 }, { x: 5.8, y: 12 }, { x: 17.8, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 12 }
 ];

 const rampMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.6, metalness: 0.2, side: THREE.DoubleSide });
 const rampMesh = buildMiteredRing(hw, hd, rampProfile, rampMat);
 rampMesh.position.set(floorConfig.offsetX, globalElevationY - 12, floorConfig.offsetY);
 scene.add(rampMesh); sceneObjects.push(rampMesh);

 const ledProfile = [
 { x: 1.01, y: 12 }, { x: 4.99, y: 12 }, { x: 4.99, y: 10.01 }, { x: 1.01, y: 10.01 }, { x: 1.01, y: 12 }
 ];

 const baseLedColor = currentLedMode === 'static' ? new THREE.Color(currentLedColor) : new THREE.Color(0xffffff);
 const ledMat = new THREE.MeshStandardMaterial({
 color: 0x000000,
 emissive: baseLedColor,
 emissiveIntensity: currentLedIntensity,
 side: THREE.DoubleSide,
 toneMapped: false,
 envMapIntensity: 0.0
 });
 window.activeLedMaterials.push(ledMat);

 const ledMesh = buildMiteredRing(hw, hd, ledProfile, ledMat);
 ledMesh.position.set(floorConfig.offsetX, globalElevationY - 12, floorConfig.offsetY);
 scene.add(ledMesh); sceneObjects.push(ledMesh);
 }

 const dimWSprite = createTextSprite(floorConfig.width + " cm", "#ff0080", 28);
 dimWSprite.position.set(floorConfig.offsetX, globalElevationY + 5, floorConfig.offsetY + floorConfig.depth / 2 + 20);
 scene.add(dimWSprite); sceneObjects.push(dimWSprite);

 const dimDSprite = createTextSprite(floorConfig.depth + " cm", "#ff0080", 28);
 dimDSprite.position.set(floorConfig.offsetX + floorConfig.width / 2 + 30, globalElevationY + 5, floorConfig.offsetY);
 scene.add(dimDSprite); sceneObjects.push(dimDSprite);
 }

 if (isBlueprintMode) {
 scene.background = new THREE.Color(0x0a1a35);
 scene.fog = null;
 } else {
 scene.background = new THREE.Color(0x333333);
 }

 let largestWallIndex = -1;
 let maxLen = 0;

 computed3DData.forEach(item => {
 if (item.type === 'kantorek_1x1') {
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz);
 group.rotation.y = -(item.rotation || 0) * Math.PI / 180;

 const frameMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.7, roughness: 0.2 });
 const doorMat = new THREE.MeshStandardMaterial({ color: 0x004466, metalness: 0.7, roughness: 0.2 });
 const printMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0 });

 const buildKWall = (w, h, x, z, rotY, isDoor) => {
 const geom = new THREE.BoxGeometry(w, h, 6);
 let mat = isDoor ? doorMat : frameMat;
 const mesh = new THREE.Mesh(geom, [mat, mat, mat, mat, printMat, printMat]);
 mesh.position.set(x, h / 2, z);
 mesh.rotation.y = rotY;
 group.add(mesh);

 const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
 edges.position.copy(mesh.position);
 edges.rotation.copy(mesh.rotation);
 group.add(edges);
 };

 const th = 6;
 buildKWall(100, 250, -th / 2, -50 + th / 2, 0, false);
 buildKWall(100, 250, 50 - th / 2, -th / 2, Math.PI / 2, false);
 buildKWall(100, 250, th / 2, 50 - th / 2, 0, true);
 buildKWall(100, 250, -50 + th / 2, th / 2, Math.PI / 2, false);

 const labelSprite = createTextSprite("Kantorek 1x1", "#ffaa00", 16);
 labelSprite.position.set(0, 250 + 40, 0);
 group.add(labelSprite);
 group.add(createLeaderLine(250, 250 + 30, 0));

 scene.add(group);
 sceneObjects.push(group);
 }
 if (item.type === 'wall' && item.length > maxLen) {
 maxLen = item.length;
 largestWallIndex = item.planIndex;
 }
 });

 const gridGroup = new THREE.Group();
 const gridColor = isBlueprintMode ? 0x1e3b70 : 0x444444;
 const gridMat = new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: 0.3 });
 const gridSize = 2000;
 const step = 100;

 for (let i = -gridSize; i <= gridSize; i += step) {
 const pZ = [new THREE.Vector3(i, 0, -gridSize), new THREE.Vector3(i, 0, gridSize)];
 gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pZ), gridMat));
 const pX = [new THREE.Vector3(-gridSize, 0, i), new THREE.Vector3(gridSize, 0, i)];
 gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pX), gridMat));
 }
 scene.add(gridGroup);
 sceneObjects.push(gridGroup);

 computed3DData.forEach(item => {
 if (item.type === 'wall') {
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz);
 group.rotation.y = -item.angle * Math.PI / 180;

 if (item.isFoldable) {
 const frameGroup = new THREE.Group();
 const aluMat = new THREE.MeshStandardMaterial({ color: 0xdadada, metalness: 0.8, roughness: 0.5 });
 const th = item.thickness || 4.5; const len = item.length; const h = item.height;

 const vertG = new THREE.BoxGeometry(th, h, th);
 const leftP = new THREE.Mesh(vertG, aluMat); leftP.position.set(-len / 2 + th / 2, h / 2, 0);
 const rightP = new THREE.Mesh(vertG, aluMat); rightP.position.set(len / 2 - th / 2, h / 2, 0);
 const horizG = new THREE.BoxGeometry(len - 2 * th, th, th);
 const topP = new THREE.Mesh(horizG, aluMat); topP.position.set(0, h - th / 2, 0);
 const botP = new THREE.Mesh(horizG, aluMat); botP.position.set(0, th / 2, 0);
 frameGroup.add(leftP, rightP, topP, botP);

 const supGeom = new THREE.BoxGeometry(len - 2 * th, 4, th);
 const s1 = new THREE.Mesh(supGeom, aluMat); s1.position.set(0, 100, 0);
 const s2 = new THREE.Mesh(supGeom, aluMat); s2.position.set(0, 150, 0);
 frameGroup.add(s1, s2);
 const footG = new THREE.BoxGeometry(6, 0.6, 40);
 const footM = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.5 });
 const fL = new THREE.Mesh(footG, footM); fL.position.set(-len / 2 + th / 2, 0.3, 0);
 const fR = new THREE.Mesh(footG, footM); fR.position.set(len / 2 - th / 2, 0.3, 0);
 frameGroup.add(fL, fR);

 let existingPlane = foldablePlanes.find(p => Math.abs(p.angle - item.angle) < 1 && p.walls.some(w => Math.sqrt(Math.pow(w.cx - item.cx, 2) + Math.pow(w.cz - item.cz, 2)) <= item.length + 15));
 if (existingPlane) {
 existingPlane.walls.push(item);
 } else {
 foldablePlanes.push({ angle: item.angle, walls: [item] });
 }
 group.add(frameGroup);
 }
 else {
 const geom = new THREE.BoxGeometry(item.length, item.height, 12);
 let hexColor = item.isDoor ? 0x004466 : 0x999999;
 const frameMat = new THREE.MeshStandardMaterial({ color: hexColor, metalness: 0.7, roughness: 0.2 });
 const texLoader = new THREE.TextureLoader();
 const getWallMat = (texUrl) => {
 if (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) return new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
 if (!texUrl) return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1.0 });

 let tex = texLoader.load(texUrl);
 tex.encoding = THREE.sRGBEncoding;
 return new THREE.MeshStandardMaterial({ map: tex, roughness: 1.0 });
 };

 let matFront = getWallMat(item.textureFront);
 let matBack = getWallMat(item.textureBack);
 if (item.isFlipped) {
 let temp = matFront;
 matFront = matBack;
 matBack = temp;
 }

 if (item.isDoor) {
 const doorGroup = new THREE.Group();
 const stripThick = 4;
 const doorW = item.length;
 const doorH = item.height;
 const doorD = 12;

 const stripGeo = new THREE.BoxGeometry(doorW, stripThick, doorD);
 const topStrip = new THREE.Mesh(stripGeo, frameMat);
 topStrip.position.set(0, doorH - stripThick / 2, 0);
 doorGroup.add(topStrip);

 const botStrip = new THREE.Mesh(stripGeo, frameMat);
 botStrip.position.set(0, stripThick / 2, 0);
 doorGroup.add(botStrip);

 const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
 const topEdges = new THREE.LineSegments(new THREE.EdgesGeometry(stripGeo), edgeMat);
 topEdges.position.copy(topStrip.position);
 doorGroup.add(topEdges);

 const botEdges = new THREE.LineSegments(new THREE.EdgesGeometry(stripGeo), edgeMat);
 botEdges.position.copy(botStrip.position);
 doorGroup.add(botEdges);

 const doorSide = item.isFlipped ? -1 : 1;
 const pivot = new THREE.Group();
 pivot.position.set(doorW / 2, 0, (doorD / 2) * doorSide);
 pivot.rotation.y = (35 * Math.PI / 180) * doorSide;

 const leafW = doorW;
 const leafH = doorH - (2 * stripThick);
 const leafD = doorD - 2;
 const leafGeo = new THREE.BoxGeometry(leafW, leafH, leafD);

 const leafMesh = new THREE.Mesh(leafGeo, [frameMat, frameMat, frameMat, frameMat, matFront, matBack]);
 leafMesh.position.set(-doorW / 2, doorH / 2, (-doorD / 2) * doorSide);
 leafMesh.userData = { isWall: true, planIndex: item.planIndex };
 if (item.quadIdx !== undefined) leafMesh.userData.quadIdx = item.quadIdx;
 pivot.add(leafMesh);

 const leafEdges = new THREE.LineSegments(new THREE.EdgesGeometry(leafGeo), edgeMat);
 leafEdges.position.copy(leafMesh.position);
 pivot.add(leafEdges);

 const lockGeo = new THREE.CylinderGeometry(3.5, 3.5, doorD + 6, 32);
 lockGeo.rotateX(Math.PI / 2);
 const lockMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
 const lockMesh = new THREE.Mesh(lockGeo, lockMat);
 lockMesh.position.set(-doorW + 8, doorH / 2, (-doorD / 2) * doorSide);
 pivot.add(lockMesh);

 doorGroup.add(pivot);
 group.add(doorGroup);

 } else {
 const mesh = new THREE.Mesh(geom, [frameMat, frameMat, frameMat, frameMat, matFront, matBack]);
 mesh.position.y = item.height / 2;
 mesh.userData = { isWall: true, planIndex: item.planIndex };
 if (item.quadIdx !== undefined) mesh.userData.quadIdx = item.quadIdx;
 group.add(mesh);

 const sepGeom = new THREE.BoxGeometry(0.4, item.height, 12.2);
 const sepMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
 const separator = new THREE.Mesh(sepGeom, sepMat);
 separator.position.set(item.length / 2, item.height / 2, 0);
 group.add(separator);

 const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 }));
 edges.position.y = item.height / 2;
 group.add(edges);
 }
 }

 const labelCol = (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? "#8bb3ff" : "#ffffff";
 const labelSprite = createTextSprite(item.labelEN || item.name, labelCol, 16);
 labelSprite.position.set(0, item.height + 25, 0);
 group.add(labelSprite);
 group.add(createLeaderLine(item.height, item.height + 15, 0));

 if (typeof showDimensions !== 'undefined' && showDimensions) {
 const p1W = new THREE.Vector3(-item.length / 2, 0, 0); const p2W = new THREE.Vector3(item.length / 2, 0, 0);
 group.add(addDimension3D(p1W, p2W, `${item.length} cm`, new THREE.Vector3(0, -25, 0), 0.5));
 }
 scene.add(group);
 sceneObjects.push(group);
 }

 else if (item.type === 'daszek') {
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz);
 group.rotation.y = -item.angle * Math.PI / 180;

 const legHeight = item.wallHeight;
 const frameMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.7, roughness: 0.2 });
 const texLoader = new THREE.TextureLoader();

 const getMat = (texUrl) => {
 if (isBlueprintMode) return new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
 if (!texUrl) return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, emissive: 0xffffff, emissiveIntensity: 0.15 });
 let tex = texLoader.load(texUrl);
 tex.encoding = THREE.sRGBEncoding;
 return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.4 });
 };

 const roofGeom = new THREE.BoxGeometry(100, 250, 12);
 const roofMesh = new THREE.Mesh(roofGeom, [frameMat, frameMat, frameMat, frameMat, getMat(item.accData.texRoofFront), getMat(item.accData.texRoofBack)]);
 roofMesh.rotation.x = -Math.PI / 2; roofMesh.position.set(0, item.wallHeight - 6, 131);
 roofMesh.userData = { isDaszekPart: true, planIndex: item.planIndex, accIdx: item.accIndex, part: 'Roof' };
 roofMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(roofGeom), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })));
 group.add(roofMesh);

 const legGeom = new THREE.BoxGeometry(100, legHeight, 12);
 const legMesh = new THREE.Mesh(legGeom, [frameMat, frameMat, frameMat, frameMat, getMat(item.accData.texLegFront), getMat(item.accData.texLegBack)]);
 legMesh.position.set(0, legHeight / 2, 262);
 legMesh.userData = { isDaszekPart: true, planIndex: item.planIndex, accIdx: item.accIndex, part: 'Leg' };
 legMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(legGeom), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })));
 group.add(legMesh);

 const labelSprite = createTextSprite(item.labelEN); labelSprite.position.set(0, item.wallHeight + 40, 131); group.add(labelSprite); group.add(createLeaderLine(item.wallHeight + 12, item.wallHeight + 30, 131));
 scene.add(group); sceneObjects.push(group);
 }
 else if (item.type === 'accessory') {
 const isTV = item.id === 'tvPanel';
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz);
 group.rotation.y = -item.wallAngle * Math.PI / 180;

 const mesh = new THREE.Mesh(new THREE.BoxGeometry(80, isTV ? 50 : 5, isTV ? 5 : 25), new THREE.MeshStandardMaterial({ color: isTV ? 0xffcc00 : 0xff9900 }));
 let zOffset = (item.dir === 1 ? 1 : -1) * (6 + (isTV ? 2.5 : 12.5));

 let yPos = item.wallHeight / 2;
 if (item.accData.slot === 1) yPos = item.wallHeight * 0.33;
 else if (item.accData.slot === 3) yPos = item.wallHeight * 0.66;

 mesh.position.set(0, yPos, zOffset);

 const labelSprite = createTextSprite(item.labelEN); labelSprite.position.set(0, yPos + 40, zOffset); group.add(labelSprite); group.add(createLeaderLine(yPos + 5, yPos + 30, zOffset));
 group.add(mesh); scene.add(group); sceneObjects.push(group);
 }
 else if (item.type === 'freestanding') {
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz); group.rotation.y = -(item.rotation || 0) * Math.PI / 180;

 const whiteWoodMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.1 });
 const texLoader = new THREE.TextureLoader();

 const getFreeMat = (texUrl) => {
 if (isBlueprintMode) return new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
 if (!texUrl) return new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.1 });
 let tex = texLoader.load(texUrl);
 tex.encoding = THREE.sRGBEncoding;
 return new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.4 });
 };
 const frontMat = getFreeMat(item.textureFront);

 const top = new THREE.Mesh(new THREE.BoxGeometry(item.width, 2, item.depth), whiteWoodMat); top.position.set(0, item.height - 1, 0); group.add(top);
 const bot = new THREE.Mesh(new THREE.BoxGeometry(item.width, 2, item.depth), whiteWoodMat); bot.position.set(0, 1, 0); group.add(bot);
 const sideL = new THREE.Mesh(new THREE.BoxGeometry(2, item.height - 4, item.depth - 2), whiteWoodMat); sideL.position.set(-item.width / 2 + 1, item.height / 2, -1); group.add(sideL);
 const sideR = new THREE.Mesh(new THREE.BoxGeometry(2, item.height - 4, item.depth - 2), whiteWoodMat); sideR.position.set(item.width / 2 - 1, item.height / 2, -1); group.add(sideR);
 const shelf = new THREE.Mesh(new THREE.BoxGeometry(item.width - 4, 2, item.depth - 2), whiteWoodMat); shelf.position.set(0, item.height / 2, -1); group.add(shelf);

 const front = new THREE.Mesh(new THREE.BoxGeometry(item.width, item.height - 4, 2), [whiteWoodMat, whiteWoodMat, whiteWoodMat, whiteWoodMat, frontMat, whiteWoodMat]);
 front.position.set(0, item.height / 2, item.depth / 2 - 1); front.userData = { isWall: true, planIndex: item.planIndex }; group.add(front);

 const labelSprite = createTextSprite(item.labelEN); labelSprite.position.set(0, item.height + 40, item.depth / 2); group.add(labelSprite); group.add(createLeaderLine(item.height, item.height + 30, item.depth / 2));

 if (isBlueprintMode && item.id === 'adTribuneExpo') {
 const lblColor = "#ff9900";
 const lblSize = 28;

 const lblSide = createTextSprite("płyta MDF 12mm", lblColor, lblSize);
 lblSide.position.set(-item.width / 2 - 20, item.height / 2, 0);
 group.add(lblSide);

 const lblFront = createTextSprite("kurtynka świetlna LED", lblColor, lblSize);
 lblFront.position.set(0, item.height / 2, item.depth / 2 + 15);
 group.add(lblFront);

 const lblShelf = createTextSprite("półka MDF", lblColor, lblSize);
 lblShelf.position.set(0, item.height - 5, 0);
 group.add(lblShelf);
 }

 scene.add(group); sceneObjects.push(group);

 if (showDimensions) {
 const p1 = new THREE.Vector3(-item.width / 2, 100, 0); const p2 = new THREE.Vector3(item.width / 2, 100, 0);
 group.add(addDimension3D(p1, p2, `${item.width} cm`, new THREE.Vector3(0, 20, 0), 1.0));
 }
 }
 else if (item.type === 'freestanding_s') {
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz); group.rotation.y = -(item.rotation || 0) * Math.PI / 180;

 const sGeom = new THREE.BoxGeometry(item.width, item.height, 4, 1, 150, 1);
 const pos = sGeom.attributes.position; const yOffset = -item.height / 2;

 for (let i = 0; i < pos.count; i++) {
 let y = pos.getY(i); let z = pos.getZ(i); let t = (y / item.height) + 0.5; let waveZ = 0; let newY = 0;
 const smooth = (val) => 0.5 - Math.cos(val * Math.PI) / 2;
 if (t < 0.15) { let p = t / 0.15; let sp = smooth(p); waveZ = 35 * Math.cos(sp * Math.PI); newY = yOffset + sp * 4; }
 else if (t < 0.40) { let p = (t - 0.15) / 0.25; let sp = smooth(p); waveZ = -35 * Math.cos(sp * Math.PI / 2) - Math.sin(sp * Math.PI) * 28; newY = yOffset + 4 + Math.pow(sp, 1.8) * 66; }
 else { let p = (t - 0.40) / 0.60; let sp = smooth(p); waveZ = Math.sin(sp * Math.PI) * 25 + sp * 12; newY = yOffset + 70 + sp * (item.height - 70); }
 pos.setZ(i, z + waveZ); pos.setY(i, newY);
 }
 sGeom.computeVertexNormals();

 const texLoader = new THREE.TextureLoader();
 const frameMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 });

 const getFreeSMat = (texUrl) => {
 if (isBlueprintMode) return new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
 if (!texUrl) return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, emissive: 0xffffff, emissiveIntensity: 0.15 });
 let tex = texLoader.load(texUrl);
 tex.encoding = THREE.sRGBEncoding;
 return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.4 });
 };
 const frontMat = getFreeSMat(item.textureFront); const backMat = getFreeSMat(item.textureBack);

 const mesh = new THREE.Mesh(sGeom, [frameMat, frameMat, frameMat, frameMat, frontMat, backMat]);
 mesh.position.set(0, item.height / 2, 0); mesh.userData = { isWall: true, planIndex: item.planIndex }; group.add(mesh);
 const edges = new THREE.LineSegments(new THREE.EdgesGeometry(sGeom, 30), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 })); edges.position.copy(mesh.position); group.add(edges);

 const labelSprite = createTextSprite(item.labelEN); labelSprite.position.set(0, item.height + 40, 0); group.add(labelSprite); group.add(createLeaderLine(item.height, item.height + 30, 0));
 scene.add(group); sceneObjects.push(group);
 }
 else if (item.type === 'suspended') {
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz);
 group.rotation.y = -(item.rotation || 0) * Math.PI / 180;

 const frameMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.2, metalness: 0.7, side: THREE.DoubleSide });
 const texLoader = new THREE.TextureLoader();

 const createQuadWall = (w, d, x, z, rotY, quadIdx) => {
 const geom = new THREE.BoxGeometry(w, item.height, d);
 let tOut = item.quadTextures['Out' + quadIdx]; let tIn = item.quadTextures['In' + quadIdx];

 const getQuadMat = (texUrl) => {
 if (isBlueprintMode) return new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
 if (!texUrl) return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
 let tex = texLoader.load(texUrl);
 tex.encoding = THREE.sRGBEncoding;
 return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.4 });
 };
 const matOut = getQuadMat(tOut); const matIn = getQuadMat(tIn);

 const mesh = new THREE.Mesh(geom, [frameMat, frameMat, frameMat, frameMat, matOut, matIn]);
 mesh.position.set(x, 400 + item.height / 2, z); mesh.rotation.y = rotY; mesh.userData = { isWall: true, planIndex: item.planIndex, quadIdx: quadIdx }; group.add(mesh);
 const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 })); edges.position.copy(mesh.position); edges.rotation.copy(mesh.rotation); group.add(edges);
 };

 createQuadWall(item.width, 2, 0, item.depth / 2, 0, 1); createQuadWall(item.depth, 2, item.width / 2, 0, Math.PI / 2, 2); createQuadWall(item.width, 2, 0, -item.depth / 2, Math.PI, 3); createQuadWall(item.depth, 2, -item.width / 2, 0, -Math.PI / 2, 4);

 const cableMat = new THREE.LineBasicMaterial({ color: 0x888888 });
 const addCable = (x, z) => { group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 400 + item.height, z), new THREE.Vector3(x, 800, z)]), cableMat)); };
 addCable(item.width / 2, item.depth / 2); addCable(-item.width / 2, item.depth / 2); addCable(item.width / 2, -item.depth / 2); addCable(-item.width / 2, -item.depth / 2);

 const labelSprite = createTextSprite(item.labelEN); labelSprite.position.set(0, 400 + item.height + 40, item.depth / 2); group.add(labelSprite);
 scene.add(group); sceneObjects.push(group);

 if (showDimensions) {
 const p1 = new THREE.Vector3(-item.width / 2, 400, 0); const p2 = new THREE.Vector3(item.width / 2, 400, 0);
 group.add(addDimension3D(p1, p2, `${item.width} x ${item.depth} cm`, new THREE.Vector3(0, 40, 0), 1.5));
 }
 }
 else if (item.type === 'suspended_ring') {
 const group = new THREE.Group();
 group.position.set(item.cx, globalElevationY, item.cz);

 const frameMat = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.2, metalness: 0.7, side: THREE.DoubleSide });
 const texLoader = new THREE.TextureLoader();
 const rOut = item.diameter / 2; const rIn = rOut - 2;

 const createArc = (radius, thetaStart, thetaLen, isOut, segIdx) => {
 const geom = new THREE.CylinderGeometry(radius, radius, item.height, 128, 1, true, thetaStart, thetaLen);
 let tName = (isOut ? 'Out' : 'In') + segIdx; let tData = item.quadTextures[tName];
 let mat;
 if (isBlueprintMode) mat = new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
 else if (tData) {
 let tex = texLoader.load(tData); if (!isOut) { tex.wrapS = THREE.RepeatWrapping; tex.repeat.x = -1; }
 mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.4, side: isOut ? THREE.FrontSide : THREE.BackSide, transparent: true, alphaTest: 0.1 });
 } else mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, side: isOut ? THREE.FrontSide : THREE.BackSide });

 const mesh = new THREE.Mesh(geom, mat); mesh.position.set(0, 400 + item.height / 2, 0); mesh.userData = { isWall: true, planIndex: item.planIndex, quadIdx: segIdx, isRingOut: isOut }; group.add(mesh);
 const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 30), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 })); edges.position.copy(mesh.position); group.add(edges);
 };

 const thirdPi = (2 * Math.PI) / 3;
 for (let i = 1; i <= 3; i++) { let tStart = (i - 1) * thirdPi; createArc(rOut, tStart, thirdPi, true, i); createArc(rIn, tStart, thirdPi, false, i); }

 const ringShape = new THREE.Shape(); ringShape.absarc(0, 0, rOut, 0, Math.PI * 2, false);
 const holePath = new THREE.Path(); holePath.absarc(0, 0, rIn, 0, Math.PI * 2, true); ringShape.holes.push(holePath);
 const extrudeSettings = { depth: 2, bevelEnabled: false, curveSegments: 256 };
 const ringGeom = new THREE.ExtrudeGeometry(ringShape, extrudeSettings); ringGeom.rotateX(Math.PI / 2);

 const topRing = new THREE.Mesh(ringGeom, frameMat); topRing.position.set(0, 400 + item.height + 1, 0); group.add(topRing);
 const botRing = new THREE.Mesh(ringGeom, frameMat); botRing.position.set(0, 400 + 1, 0); group.add(botRing);

 const cableMat = new THREE.LineBasicMaterial({ color: 0x888888 });
 const addCable = (angle) => { let cx = Math.cos(angle) * (rOut - 1); let cz = Math.sin(angle) * (rOut - 1); group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(cx, 400 + item.height, cz), new THREE.Vector3(cx, 800, cz)]), cableMat)); };
 addCable(Math.PI / 4); addCable(3 * Math.PI / 4); addCable(5 * Math.PI / 4); addCable(7 * Math.PI / 4);

 const labelSprite = createTextSprite(item.labelEN); labelSprite.position.set(0, 400 + item.height + 40, rOut); group.add(labelSprite);
 scene.add(group); sceneObjects.push(group);

 if (showDimensions) {
 const p1 = new THREE.Vector3(-rOut, 400, 0); const p2 = new THREE.Vector3(rOut, 400, 0);
 group.add(addDimension3D(p1, p2, `Ø ${item.diameter} cm`, new THREE.Vector3(0, 40, 0), 1.5));
 }
 }
 });

 // --- NAKŁADANIE ZBIORCZYCH PŁÓCIEN FOLDABLE I MENU ---
 foldablePlanes.forEach(plane => {
 let rad = -plane.angle * Math.PI / 180;
 let vx = Math.cos(rad); let vz = -Math.sin(rad);
 plane.walls.sort((a, b) => (a.cx * vx + a.cz * vz) - (b.cx * vx + b.cz * vz));

 let sumX = 0, sumZ = 0, totalLen = 0;
 plane.walls.forEach(w => { sumX += w.cx; sumZ += w.cz; totalLen += w.length; });
 plane.center3D = new THREE.Vector3(sumX / plane.walls.length, 350, sumZ / plane.walls.length);

 let leaderItem = plane.walls[0];
 let originalPlanItem = plan[leaderItem.planIndex];
 let fSet = (originalPlanItem && originalPlanItem.foldableSettings) ? originalPlanItem.foldableSettings : { div: 'seamless', side: 'double', hasPrint: false };

 if (fSet.hasPrint) {
 const canvasGroup = new THREE.Group();
 canvasGroup.position.set(plane.center3D.x, globalElevationY, plane.center3D.z);
 canvasGroup.rotation.y = rad;

 const texLoader = new THREE.TextureLoader();
 let th = leaderItem.thickness || 4.5; let h = leaderItem.height;
 const zF = th / 2 + 0.1; const zB = -th / 2 - 0.1;

 const buildCanvas = (cLen, offX, zOff, wallRef) => {
 let texF = wallRef ? wallRef.textureFront : leaderItem.textureFront;
 let texB = wallRef ? wallRef.textureBack : leaderItem.textureBack;

 let matF = new THREE.MeshStandardMaterial({
 color: 0xffffff,
 roughness: 1.0,
 metalness: 0.0,
 envMapIntensity: 0.0,
 transparent: false,
 opacity: 1
 });

 if (texF) {
 let loadedTexF = texLoader.load(texF);
 loadedTexF.encoding = THREE.sRGBEncoding;
 if (typeof renderer !== 'undefined') {
 loadedTexF.anisotropy = renderer.capabilities.getMaxAnisotropy();
 }
 matF.map = loadedTexF;
 }

 let matB = new THREE.MeshStandardMaterial({
 color: 0xffffff,
 roughness: 1.0,
 metalness: 0.0,
 envMapIntensity: 0.0,
 transparent: false,
 opacity: 1
 });

 if (texB) {
 let loadedTexB = texLoader.load(texB);
 loadedTexB.encoding = THREE.sRGBEncoding;
 if (typeof renderer !== 'undefined') {
 loadedTexB.anisotropy = renderer.capabilities.getMaxAnisotropy();
 }
 matB.map = loadedTexB;
 }

 const invMat = new THREE.MeshBasicMaterial({ visible: false });
 const pGeo = new THREE.BoxGeometry(cLen - 0.2, h - 0.8, 0.2);
 const pMesh = new THREE.Mesh(pGeo, [invMat, invMat, invMat, invMat, matF, matB]);
 pMesh.position.set(offX, h / 2, zOff);

 pMesh.userData = { isWall: true, planIndex: wallRef ? wallRef.planIndex : leaderItem.planIndex };
 canvasGroup.add(pMesh);

 const planeForEdge = new THREE.PlaneGeometry(cLen - 0.2, h - 0.8);
 const keder = new THREE.LineSegments(new THREE.EdgesGeometry(planeForEdge), new THREE.LineBasicMaterial({ color: 0xffcc00, opacity: 0.5, transparent: true }));
 keder.position.set(offX, h / 2, zOff);
 canvasGroup.add(keder);
 };

 if (fSet.div === 'seamless') {
 if (fSet.side === 'double' || fSet.side === 'front') buildCanvas(totalLen, 0, zF, leaderItem);
 if (fSet.side === 'double' || fSet.side === 'back') buildCanvas(totalLen, 0, zB, leaderItem);
 }
 else if (fSet.div === 'half') {
 let len1 = Math.ceil((totalLen / 2) / 100) * 100;
 if (len1 >= totalLen) len1 = totalLen / 2;
 let len2 = totalLen - len1;

 let midIndex = Math.floor(plane.walls.length / 2);
 let wall2Ref = plane.walls[midIndex] || leaderItem;

 let off1 = -totalLen / 2 + len1 / 2;
 let off2 = totalLen / 2 - len2 / 2;

 if (fSet.side === 'double' || fSet.side === 'front') { buildCanvas(len1, off1, zF, leaderItem); buildCanvas(len2, off2, zF, wall2Ref); }
 if (fSet.side === 'double' || fSet.side === 'back') { buildCanvas(len1, off1, zB, leaderItem); buildCanvas(len2, off2, zB, wall2Ref); }
 }
 else if (fSet.div === 'single') {
 let currX = -totalLen / 2;
 plane.walls.forEach(w => {
 let wOff = currX + w.length / 2;
 if (fSet.side === 'double' || fSet.side === 'front') buildCanvas(w.length, wOff, zF, w);
 if (fSet.side === 'double' || fSet.side === 'back') buildCanvas(w.length, wOff, zB, w);
 currX += w.length;
 });
 }
 scene.add(canvasGroup);
 sceneObjects.push(canvasGroup);
 }
 });

 // --- GLOBALNE WYMIARY (DLA CAŁEGO STOISKA) ---
 if (showDimensions) {
 let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, maxY = 0;
 let hasWalls = false;

 computed3DData.forEach(item => {
 if (item.type === 'wall' || item.type === 'daszek') {
 hasWalls = true;
 let rad = -item.angle * Math.PI / 180;
 let dx = (item.length / 2) * Math.cos(rad);
 let dz = (item.length / 2) * Math.sin(rad);

 let p1x = item.cx - dx, p1z = item.cz - dz;
 let p2x = item.cx + dx, p2z = item.cz + dz;

 let perpX = Math.abs(Math.sin(rad)) * 6;
 let perpZ = Math.abs(Math.cos(rad)) * 6;

 minX = Math.min(minX, p1x - perpX, p2x - perpX);
 maxX = Math.max(maxX, p1x + perpX, p2x + perpX);
 minZ = Math.min(minZ, p1z - perpZ, p2z - perpZ);
 maxZ = Math.max(maxZ, p1z + perpZ, p2z + perpZ);
 maxY = Math.max(maxY, item.height || item.wallHeight);
 }
 });

 if (hasWalls) {
 const totalW = maxX - minX;
 const zBehind = minZ - 60;
 const zFront = maxZ + 40;

 const p1Total = new THREE.Vector3(minX, 0, zBehind);
 const p2Total = new THREE.Vector3(maxX, 0, zBehind);
 const dimTotal = addDimension3D(p1Total, p2Total, `Szerokość całkowita: ${totalW.toFixed(0)} cm`, new THREE.Vector3(0, 0, 0), 0.7);
 scene.add(dimTotal); sceneObjects.push(dimTotal);

 const p1HR = new THREE.Vector3(maxX + 40, 0, zFront);
 const p2HR = new THREE.Vector3(maxX + 40, maxY, zFront);
 const dimHR = addDimension3D(p1HR, p2HR, `Wys. ${maxY.toFixed(0)} cm`, new THREE.Vector3(0, 0, 0), 0.6);
 scene.add(dimHR); sceneObjects.push(dimHR);
 }
 }

 // --- MAGIA AR: Przenosimy wygenerowane stoisko z ekranu wirtualnego do "Pudła AR" ---
 if (typeof arGroup !== 'undefined' && arGroup) {
 sceneObjects.forEach(obj => {
 scene.remove(obj);
 arGroup.add(obj);
 });
 }
}

function render() {
 let isOutOfBounds = false; let hasWallCollision = false;
 const layer = document.getElementById('drawingLayer'); const stage = document.getElementById('stage');
 if (!layer || !stage) return;
 layer.innerHTML = ''; computed3DData = [];
 let sWidth = stage.clientWidth || window.innerWidth - 400; let sHeight = stage.clientHeight || window.innerHeight;
 const stageCenterStartX = sWidth / 2 - 100; const stageCenterStartY = sHeight / 2 + 100;
 let x = stageCenterStartX, y = stageCenterStartY; let currentAngle = 0; let prevWallAngle = 0;
 let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity; let baseCost = 0; let counts = {}; let lastItemType = null;
 let pendingTurn90 = false; let pendingTurnItem = null; let placedWalls = []; let kantorekCount = 0; let floorBounds = null; let currentDrawingFlipped = false;

 if (currentSystem === 'wydruki') {
 renderWydruki(layer);
 return;
 }

 if (floorConfig.type !== 'none' && floorConfig.width > 0 && floorConfig.depth > 0) {
 let fx = stageCenterStartX + floorConfig.offsetX; let fy = stageCenterStartY + floorConfig.offsetY;
 floorBounds = { minX: fx - floorConfig.width / 2, maxX: fx + floorConfig.width / 2, minY: fy - floorConfig.depth / 2, maxY: fy + floorConfig.depth / 2 };
 let floor2D = document.createElement('div'); floor2D.style.position = 'absolute'; floor2D.style.width = floorConfig.width + 'px'; floor2D.style.height = floorConfig.depth + 'px';
 floor2D.style.left = floorBounds.minX + 'px'; floor2D.style.top = floorBounds.minY + 'px'; floor2D.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; floor2D.style.border = '2px dashed #666'; floor2D.style.zIndex = 1;
 floor2D.style.display = 'flex'; floor2D.style.alignItems = 'center'; floor2D.style.justifyContent = 'center'; floor2D.style.color = '#666'; floor2D.style.fontSize = '12px'; floor2D.style.fontWeight = 'bold'; floor2D.style.cursor = 'grab';
 floor2D.innerHTML = `<span style="pointer-events:none;">Podłoga<br>${floorConfig.width}x${floorConfig.depth}</span><div class="floor-dimension" style="top: -20px; left: 50%; transform: translateX(-50%);">${floorConfig.width} cm</div><div class="floor-dimension" style="bottom: -20px; left: 50%; transform: translateX(-50%);">${floorConfig.width} cm</div><div class="floor-dimension" style="top: 50%; left: -45px; transform: translateY(-50%);">${floorConfig.depth} cm</div><div class="floor-dimension" style="top: 50%; right: -45px; transform: translateY(-50%);">${floorConfig.depth} cm</div>`;

 floor2D.onmousedown = function (e) {
 e.preventDefault(); e.stopPropagation(); floor2D.style.cursor = 'grabbing';
 let startX = e.clientX; let startY = e.clientY; let initX = floorConfig.offsetX; let initY = floorConfig.offsetY; let vs = typeof viewScale !== 'undefined' ? viewScale : 1;
 function onMouseMove(event) {
 floorConfig.offsetX = initX + (event.clientX - startX) / vs; floorConfig.offsetY = initY + (event.clientY - startY) / vs;
 let newFx = stageCenterStartX + floorConfig.offsetX; let newFy = stageCenterStartY + floorConfig.offsetY;
 floor2D.style.left = (newFx - floorConfig.width / 2) + 'px'; floor2D.style.top = (newFy - floorConfig.depth / 2) + 'px';
 }
 document.addEventListener('mousemove', onMouseMove);
 document.onmouseup = function () { document.removeEventListener('mousemove', onMouseMove); document.onmouseup = null; floor2D.style.cursor = 'grab'; render(); };
 };
 layer.appendChild(floor2D);

 let m2 = (floorConfig.width * floorConfig.depth) / 10000;
 if (floorConfig.type === 'carpet') { addItemToBom("Wykładzina dywanowa (m2)", parseFloat(m2.toFixed(2)), 10, counts); baseCost += (m2 * 10); }
 else if (floorConfig.type === 'adfloor') {
 addItemToBom("Adfloor prosty", 1, 0, counts);
 let W = Math.ceil(floorConfig.width / 100);
 let D = Math.ceil(floorConfig.depth / 100);
 if (W === 0) W = 1; if (D === 0) D = 1;

 let obwod = (2 * W) + (2 * D);
 const rate = 4.27; // Kurs przeliczeniowy dla pozycji z cennika PLN

 let q_plyta = W * D;
 let łącznik = (W + 1) * (D + 1);
 let A = Math.min(W, D); let B = Math.max(W, D);
 let q_profil = (A + 1) * B + (B + 1) * A;
 let q_wzmocnienie = q_plyta;
 let q_maskownica = obwod; // 1 sztuka na każdy metr obwodu

 const addSub = (n, q, eurPrice) => {
 if (q > 0) {
 addItemToBom("- " + n, q, eurPrice, counts);
 baseCost += (q * eurPrice);
 }
 };

 // Skopiowane pozycje konstrukcyjne (ceny bazowe PLN / 4.27)
 addSub("Adfloor płyta 997x997", q_plyta, 254 / rate);
 addSub("Adfloor łącznik profili", łącznik, 63 / rate);
 addSub("Adfloor profil panelowy", q_profil, 78 / rate);
 addSub("Adfloor profil wzmocnienie", q_wzmocnienie, 87 / rate);

 // NOWOŚĆ: Maskownica prosta w cenie 43 EUR
 addSub("adFloor maskownica prosta", q_maskownica, 43);
 }
 else if (floorConfig.type === 'adfloor_led') {
 addItemToBom("Adfloor z najazdami LED", 1, 0, counts); let W = Math.ceil(floorConfig.width / 100); let D = Math.ceil(floorConfig.depth / 100); if (W === 0) W = 1; if (D === 0) D = 1;
 let obwod = (2 * W) + (2 * D); const rate = 4.27; let q_plyta = W * D; let łącznik = (W + 1) * (D + 1); let q_naj_prawy = 4; let q_naj_lewy = 4;
 let q_naj_prosty = obwod - 8; if (q_naj_prosty < 0) q_naj_prosty = 0; let q_led = Math.ceil(obwod / 10); let q_plastik = 4; let A = Math.min(W, D); let B = Math.max(W, D);
 let q_profil = (A + 1) * B + (B + 1) * A; let q_wzmocnienie = q_plyta;
 const addSub = (n, q, plnPrice) => { if (q > 0) { let eurPrice = plnPrice / rate; addItemToBom("- " + n, q, eurPrice, counts); baseCost += (q * eurPrice); } };
 addSub("Adfloor płyta 997x997", q_plyta, 254); addSub("Adfloor łącznik profili", łącznik, 63); addSub("Adfloor najazd narożny prawy", q_naj_prawy, 389); addSub("Adfloor najazd narożny lewy", q_naj_lewy, 389); addSub("Adfloor najazd prosty", q_naj_prosty, 348); addSub("Adfloor Oświetlenie LED RGB (zestaw 10m)", q_led, 1260); addSub("Adfloor najazd plastikowy narożnik", q_plastik, 68); addSub("Adfloor profil panelowy", q_profil, 78); addSub("Adfloor profil wzmocnienie", q_wzmocnienie, 87);
 }
 }

 // Podmień tę linię na:
 let nodes = []; nodes.push({ x: x, y: y, angle: currentAngle, isFlipped: false }); createJoint(layer, x, y, 0);

 for (let index = 0; index < plan.length; index++) {
 let item = plan[index];

 if (item.type === 'suspended' || item.type === 'suspended_ring') {
 let fx = stageCenterStartX + item.offsetX; let fy = stageCenterStartY + item.offsetY;
 computed3DData.push({ type: item.type, planIndex: index, id: item.id, cx: item.offsetX, cz: item.offsetY, width: item.width || item.diameter, height: item.height, depth: item.depth || item.diameter, diameter: item.diameter, labelEN: item.labelEN, quadTextures: item.quadTextures || {} });
 let suspEl = document.createElement('div'); suspEl.className = 'sego-suspended' + (selectedItemIndex === index ? ' selected' : '');
 suspEl.style.width = (item.width || item.diameter) + 'px'; suspEl.style.height = (item.depth || item.diameter) + 'px';
 if (item.type === 'suspended_ring') suspEl.style.borderRadius = '50%';
 suspEl.style.left = (fx - (item.width || item.diameter) / 2) + 'px'; suspEl.style.top = (fy - (item.depth || item.diameter) / 2) + 'px';
 suspEl.innerHTML = `<span style="pointer-events:none; text-align:center;">${item.type === 'suspended_ring' ? 'Ringfloat' : 'Quadfloat'}<br>H: 400cm</span><div class="acc-controls"><span class="acc-btn" onclick="removeSuspended(${index}, event)" style="color:#ff5555">❌</span></div>`;
 suspEl.onclick = (e) => selectItem(index, e);
 suspEl.onmousedown = function (e) {
 if (e.target.classList.contains('acc-btn')) return; e.preventDefault(); e.stopPropagation(); selectItem(index, e);
 let startX = e.clientX; let startY = e.clientY; let initX = item.offsetX; let initY = item.offsetY; let vs = typeof viewScale !== 'undefined' ? viewScale : 1;
 function onMouseMove(event) {
 item.offsetX = initX + (event.clientX - startX) / vs; item.offsetY = initY + (event.clientY - startY) / vs;
 let newFx = stageCenterStartX + item.offsetX; let newFy = stageCenterStartY + item.offsetY;
 suspEl.style.left = (newFx - (item.width || item.diameter) / 2) + 'px'; suspEl.style.top = (newFy - (item.depth || item.diameter) / 2) + 'px';
 }
 document.addEventListener('mousemove', onMouseMove); document.onmouseup = function () { document.removeEventListener('mousemove', onMouseMove); document.onmouseup = null; render(); };
 };
 layer.appendChild(suspEl); addItemToBom(item.name, 1, item.price, counts); baseCost += item.price; continue;
 }
 else if (item.type === 'freestanding' || item.type === 'freestanding_s') {
 let fx = stageCenterStartX + item.offsetX; let fy = stageCenterStartY + item.offsetY;
 computed3DData.push({ type: item.type, planIndex: index, id: item.id, cx: item.offsetX, cz: item.offsetY, width: item.width, height: item.height, depth: item.depth, rotation: item.rotation || 0, labelEN: item.labelEN, textureFront: item.textureFront, textureBack: item.textureBack });
 let freeEl = document.createElement('div'); freeEl.className = 'sego-freestanding' + (selectedItemIndex === index ? ' selected' : '');
 freeEl.style.width = item.width + 'px'; freeEl.style.height = item.depth + 'px';
 freeEl.style.left = (fx - item.width / 2) + 'px'; freeEl.style.top = (fy - item.depth / 2) + 'px'; freeEl.style.transform = `rotate(${item.rotation || 0}deg)`;
 if (item.type === 'freestanding_s') { freeEl.style.borderColor = item.color; freeEl.style.color = item.color; freeEl.style.boxShadow = `0 0 10px ${item.color}88`; }
 freeEl.innerHTML = `<span style="pointer-events:none; transform: rotate(-${item.rotation || 0}deg); display:block;">${item.type === 'freestanding_s' ? 'Vario S-80' : 'Trybunka'}</span><div class="acc-controls"><span class="acc-btn" onclick="rotateFreestanding(${index}, event)">🔄</span><span class="acc-btn" onclick="removeFreestanding(${index}, event)" style="color:#ff5555">❌</span></div>`;
 freeEl.onclick = (e) => selectItem(index, e);
 freeEl.onmousedown = function (e) {
 if (e.target.classList.contains('acc-btn')) return; e.preventDefault(); e.stopPropagation(); selectItem(index, e);
 let startX = e.clientX; let startY = e.clientY; let initX = item.offsetX; let initY = item.offsetY; let vs = typeof viewScale !== 'undefined' ? viewScale : 1;
 function onMouseMove(event) {
 item.offsetX = initX + (event.clientX - startX) / vs; item.offsetY = initY + (event.clientY - startY) / vs;
 let newFx = stageCenterStartX + item.offsetX; let newFy = stageCenterStartY + item.offsetY;
 freeEl.style.left = (newFx - item.width / 2) + 'px'; freeEl.style.top = (newFy - item.depth / 2) + 'px';
 }
 document.addEventListener('mousemove', onMouseMove); document.onmouseup = function () { document.removeEventListener('mousemove', onMouseMove); document.onmouseup = null; render(); };
 };
 layer.appendChild(freeEl); addItemToBom(item.name, 1, item.price, counts); baseCost += item.price; continue;
 }
 if (item.type === 'kantorek_1x1') {
 // 🔄 AUTO-OBRÓT:
 if (item.rotation === undefined) {
 item.rotation = (currentAngle === 270 || currentAngle === -90) ? -90 : 0;
 }

 // 🚪 STATUS DRZWI: Sprawdzamy czy użytkownik kliknął przerzucenie o 180 stopni
 let dOp = item.doorOpposite || false;

 let fx, fy, nextX, nextY, nextAngle;

 if (item.rotation === 0) {
 // 🥪 KONFIGURACJA 0 (Rysowanie w Prawo)
 fx = x + 62;
 fy = y + 44;
 nextX = fx + 56;
 nextY = fy + 50;
 nextAngle = 90;
 } else {
 // 🥪 KONFIGURACJA -90 (Rysowanie w Górę)
 fx = x + 44;
 fy = y - 62;
 nextX = fx + 50;
 nextY = fy - 56;
 nextAngle = 0;
 }

 item.offsetX = fx - stageCenterStartX;
 item.offsetY = fy - stageCenterStartY;

 // 🎨 WIZUALIZACJA 2D "KANAPKI" Z DYNAMICZNYMI DRZWIAMI
 let kantEl = document.createElement('div');
 kantEl.className = 'sego-freestanding' + (selectedItemIndex === index ? ' selected' : '');
 kantEl.style.width = (item.rotation === 0 ? '124px' : '100px');
 kantEl.style.height = (item.rotation === 0 ? '100px' : '124px');
 kantEl.style.left = (fx - (item.rotation === 0 ? 62 : 50)) + 'px';
 kantEl.style.top = (fy - (item.rotation === 0 ? 50 : 62)) + 'px';
 kantEl.style.transform = `rotate(0deg)`;
 kantEl.style.backgroundColor = 'transparent';
 kantEl.style.border = 'none';

 let bCol = selectedItemIndex === index ? '#00d2ff' : '#ff0080';
 let hGlow = selectedItemIndex === index ? '0 0 15px #00d2ff' : '0 0 10px rgba(255,0,128,0.6)';

 // Zmienne dla kolorów drzwi (Niebieski) i ścian (Różowy)
 let normBg = 'rgba(255,0,128,0.05)';
 let doorBg = 'rgba(0,210,255,0.05)'; let doorBrd = '#00d2ff'; let doorGlw = '0 0 15px #00d2ff';

 if (item.rotation === 0) {
 // Podmiana kolorów góra/dół na podstawie flagi dOp
 let topBg = dOp ? doorBg : normBg; let topC = dOp ? doorBrd : bCol; let topG = dOp ? doorGlw : hGlow;
 let botBg = dOp ? normBg : doorBg; let botC = dOp ? bCol : doorBrd; let botG = dOp ? hGlow : doorGlw;

 kantEl.innerHTML = `
 <div style="position:absolute; top:0; left:0; width:12px; height:100px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
 <div style="position:absolute; top:0; right:0; width:12px; height:100px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
 <div style="position:absolute; top:0; left:12px; width:100px; height:12px; background:${topBg}; border:2px solid ${topC}; box-shadow:${topG}; box-sizing:border-box;"></div>
 <div style="position:absolute; bottom:0; left:12px; width:100px; height:12px; background:${botBg}; border:2px solid ${botC}; box-shadow:${botG}; box-sizing:border-box;"></div>
 `;
 } else {
 // Podmiana kolorów lewo/prawo na podstawie flagi dOp
 let lftBg = dOp ? doorBg : normBg; let lftC = dOp ? doorBrd : bCol; let lftG = dOp ? doorGlw : hGlow;
 let rgtBg = dOp ? normBg : doorBg; let rgtC = dOp ? bCol : doorBrd; let rgtG = dOp ? hGlow : doorGlw;

 kantEl.innerHTML = `
 <div style="position:absolute; top:0; left:0; width:100px; height:12px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
 <div style="position:absolute; bottom:0; left:0; width:100px; height:12px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
 <div style="position:absolute; top:12px; left:0; width:12px; height:100px; background:${lftBg}; border:2px solid ${lftC}; box-shadow:${lftG}; box-sizing:border-box;"></div>
 <div style="position:absolute; top:12px; right:0; width:12px; height:100px; background:${rgtBg}; border:2px solid ${rgtC}; box-shadow:${rgtG}; box-sizing:border-box;"></div>
 `;
 }

 // 🎛️ NOWY PANEL PRZYCISKÓW (Dodany przycisk Przerzucenia Drzwi)
 kantEl.innerHTML += `
 <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; font-weight:bold; pointer-events:none; text-align:center; line-height: 1.2;">
 KANT<br>1x1<br><span style="font-size:14px; margin-top:2px; display:block; transform: rotate(${item.rotation}deg);">🚪</span>
 </div>
 <div class="acc-controls">
 <span class="acc-btn" onclick="toggleKantorekDoor(${index}, event)" title="Przerzuć drzwi o 180°" style="color:#00d2ff; margin-right:3px;">🚪🔄</span>
 <span class="acc-btn" onclick="rotateFreestanding(${index}, event)" title="Zmień tryb wpięcia w róg">🔄</span>
 <span class="acc-btn" onclick="removeFreestanding(${index}, event)" style="color:#ff5555">❌</span>
 </div>
 `;

 kantEl.onclick = (e) => selectItem(index, e);
 layer.appendChild(kantEl);

 // 🧊 WYPYCHANIE WIRTUALNYCH ŚCIAN 3D (Zamiana miejscami drzwi i ściany tylnej!)
 if (!item.quadTextures) item.quadTextures = {};
 let rad = item.rotation * Math.PI / 180;

 const addVirtualWall = (isDoor, locX, locZ, rotOffset, subIdx) => {
 let cx3D = item.offsetX + (locX * Math.cos(rad) - locZ * Math.sin(rad));
 let cz3D = item.offsetY + (locX * Math.sin(rad) + locZ * Math.cos(rad));
 let globAngle = ((item.rotation || 0) + rotOffset) % 360;
 if (globAngle < 0) globAngle += 360;
 computed3DData.push({
 type: 'wall', planIndex: index, quadIdx: subIdx, cx: cx3D, cz: cz3D, length: 100, height: 250, angle: globAngle, color: isDoor ? "#00d2ff" : "#ff00ff",
 isDoor: isDoor, labelEN: isDoor ? "Kantorek Door" : "Kantorek Wall", textureFront: item.quadTextures['Out' + subIdx], textureBack: item.quadTextures['In' + subIdx],
 textureFrontName: item.quadTextures['Out' + subIdx + 'Name'], textureBackName: item.quadTextures['In' + subIdx + 'Name'], isFoldable: false, thickness: 12, isFlipped: false
 });
 };

 // 🎯 MAGIA: Jeśli dOp = true, "Drzwi" w 3D podpinane są do indeksu 1 (Tył), a "Ściana" do 3 (Front)!
 let doorIdx = dOp ? 1 : 3;

 addVirtualWall(doorIdx === 1, 0, -44, 180, 1); // Tył (Może stać się drzwiami)
 addVirtualWall(false, 56, 0, 270, 2); // Prawa
 addVirtualWall(doorIdx === 3, 0, 44, 0, 3); // Front (Standardowo drzwi)
 addVirtualWall(false, -56, 0, 90, 4); // Lewa

 // 💰 KOSZTORYS
 if (DB['sego100x250'] && DB['door100']) {
 addItemToBom(DB['sego100x250'].name, 3, DB['sego100x250'].price, counts);
 addItemToBom(DB['door100'].name, 1, DB['door100'].price, counts);
 baseCost += (DB['sego100x250'].price * 3) + DB['door100'].price;
 }

 // 🚀 AKTUALIZACJA ŁAŃCUCHA DLA NASTĘPNEJ ŚCIANY
 x = nextX;
 y = nextY;
 currentAngle = nextAngle;

 let wBox = item.rotation === 0 ? 124 : 100;
 let hBox = item.rotation === 0 ? 100 : 124;
 minX = Math.min(minX, fx - wBox / 2); maxX = Math.max(maxX, fx + wBox / 2);
 minY = Math.min(minY, fy - hBox / 2); maxY = Math.max(maxY, fy + hBox / 2);

 nodes.push({ x: x, y: y, angle: currentAngle, isFlipped: false });
 let thisNodeIndex = nodes.length - 1;
 item.endNodeIndex = thisNodeIndex;
 createJoint(layer, x, y, thisNodeIndex);

 lastItemType = 'kantorek';
 continue;
 }

 else if (item.type === 'wall') {
 let tryDrawWall = (cType) => {
 let tempX = x, tempY = y;
 if (pendingTurnItem) {
 let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
 let rad2 = pendingTurnItem.currAngle * Math.PI / 180;
 let offset = (item.thickness || 12) / 2;
 let sV1 = 0, sV2 = 0;

 // 💎 BAZOWE WEKTORY
 if (cType === 'zew-zew') { sV1 = offset; sV2 = offset; }
 else if (cType === 'wew-zew-1') { sV1 = -offset; sV2 = offset; }
 else if (cType === 'wew-zew-2') { sV1 = offset; sV2 = -offset; }

 // 💎 FIX "PUNKTU POCZĄTKOWEGO" 
 let isBranchingFromStart = false;
 for (let w of placedWalls) {
 if (Math.abs(pendingTurnItem.cornerX - w.startX) < 1 && Math.abs(pendingTurnItem.cornerY - w.startY) < 1) {
 isBranchingFromStart = true; break;
 }
 }
 if (isBranchingFromStart) sV1 = -sV1;

 tempX = pendingTurnItem.cornerX + sV1 * Math.cos(rad1) + sV2 * Math.cos(rad2);
 tempY = pendingTurnItem.cornerY + sV1 * Math.sin(rad1) + sV2 * Math.sin(rad2);
 }

 let rad = currentAngle * Math.PI / 180;
 let nX = tempX + item.length * Math.cos(rad);
 let nY = tempY + item.length * Math.sin(rad);

 let collision = false;
 let m = 2; // Delikatnie zwiększony margines błędu dla "ślimaków"
 for (let w of placedWalls) {
 if (Math.min(tempX, nX) + m < Math.max(w.startX, w.endX) - m &&
 Math.max(tempX, nX) - m > Math.min(w.startX, w.endX) + m &&
 Math.min(tempY, nY) + m < Math.max(w.startY, w.endY) - m &&
 Math.max(tempY, nY) - m > Math.min(w.startY, w.endY) + m) {
 collision = true; break;
 }
 }
 return { startX: tempX, startY: tempY, endX: nX, endY: nY, collision: collision };
 };

 let currentTurnCornerType = pendingTurnItem ? (pendingTurnItem.cornerType || 'wew-zew-1') : 'wew-zew-1';
 let res = tryDrawWall(currentTurnCornerType);

 if (res.collision) hasWallCollision = true;

 let wallStartX = res.startX;
 let wallStartY = res.startY;

 // 💎 PRZYWRÓCONE FIZYCZNE ŚLEDZENIE
 x = res.endX;
 y = res.endY;
 prevWallAngle = currentAngle;

 if (pendingTurnItem) {
 let toggleBtn = document.createElement('div');
 toggleBtn.className = 'turn-toggle-btn';

 // INTELIGENTNE ODSUWANIE IKONY ZAWSZE W PUSTĄ PRZESTRZEŃ ZEWNĘTRZNĄ
 let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
 let rad2 = pendingTurnItem.currAngle * Math.PI / 180;

 let offX = Math.cos(rad1) - Math.cos(rad2);
 let offY = Math.sin(rad1) - Math.sin(rad2);
 if (Math.abs(offX) < 0.01 && Math.abs(offY) < 0.01) { offX = 1; offY = -1; }
 let len = Math.sqrt(offX * offX + offY * offY);

 // Odsunięcie na bezpieczne 40px od samego rogu
 toggleBtn.style.left = (pendingTurnItem.cornerX + (offX / len) * 40) + 'px';
 toggleBtn.style.top = (pendingTurnItem.cornerY + (offY / len) * 40) + 'px';

 let btnText = pendingTurnItem.cornerType === 'zew-zew' ? 'Z-Z' : (pendingTurnItem.cornerType === 'wew-zew-2' ? 'W-Z 2' : 'W-Z 1');
 toggleBtn.innerHTML = btnText;
 toggleBtn.title = 'Zmień typ łączenia narożnika';
 toggleBtn.onmousedown = (e) => e.stopPropagation();
 let turnObj = pendingTurnItem;
 toggleBtn.onclick = (e) => {
 e.stopPropagation();
 if (currentSystem === 'foldable') {
 turnObj.cornerType = (turnObj.cornerType === 'wew-zew-1') ? 'wew-zew-2' : 'wew-zew-1';
 } else {
 if (turnObj.cornerType === 'wew-zew-1') turnObj.cornerType = 'wew-zew-2';
 else if (turnObj.cornerType === 'wew-zew-2') turnObj.cornerType = 'zew-zew';
 else turnObj.cornerType = 'wew-zew-1';
 }
 render();
 };
 layer.appendChild(toggleBtn);
 pendingTurnItem = null;
 }

 if (!item.isFoldable) {
 if (lastItemType === 'wall' || lastItemType === 'jump') { addItemToBom(DB.clamp.name, 2, DB.clamp.price, counts); baseCost += (2 * DB.clamp.price); }
 else if (lastItemType === 'turn' && pendingTurn90) {
 let cName = currentTurnCornerType === 'zew-zew' ? DB.zewzew.name : DB.wewzew.name; let cPrice = currentTurnCornerType === 'zew-zew' ? DB.zewzew.price : DB.wewzew.price;
 addItemToBom(cName, 2, cPrice, counts); baseCost += (2 * cPrice); pendingTurn90 = false;
 }
 } else {
 // FOLDABLE: Nowe łączniki za 4 EUR sztuka
 if (lastItemType === 'wall' || lastItemType === 'jump') {
 addItemToBom("Foldable set 180° connector", 2, 4, counts); baseCost += (2 * 4);
 } else if (lastItemType === 'turn' && pendingTurn90) {
 addItemToBom("Foldable set 90deg connector", 2, 4, counts); baseCost += (2 * 4); pendingTurn90 = false;
 }
 }

 // --- DYNAMICZNA KALKULACJA OBRYSU (Uwzględnia grubość ramy) ---
 let radForDim = currentAngle * Math.PI / 180;
 let currentThick = item.thickness || 12;
 let halfThick = currentThick / 2;

 let perpX = Math.abs(Math.sin(radForDim)) * halfThick;
 let perpY = Math.abs(Math.cos(radForDim)) * halfThick;

 minX = Math.min(minX, wallStartX - perpX, x - perpX);
 maxX = Math.max(maxX, wallStartX + perpX, x + perpX);
 minY = Math.min(minY, wallStartY - perpY, y - perpY);
 maxY = Math.max(maxY, wallStartY + perpY, y + perpY);

 nodes.push({ x: x, y: y, angle: currentAngle });
 let thisNodeIndex = nodes.length - 1;

 item.endNodeIndex = thisNodeIndex;
 if (item.isFlipped === undefined) {
 item.isFlipped = typeof currentDrawingFlipped !== 'undefined' ? currentDrawingFlipped : false;
 }
 let currentWallIndex = placedWalls.length;
 for (let i = 0; i < currentWallIndex; i++) {
 if (Math.abs(x - placedWalls[i].startX) < 2 && Math.abs(y - placedWalls[i].startY) < 2) {
 if (!item.isFoldable) {
 addItemToBom(DB.wewzew.name, 2, DB.wewzew.price, counts); baseCost += (2 * DB.wewzew.price);
 } else {
 addItemToBom("Foldable set 90deg connector", 2, 4, counts); baseCost += (2 * 4);
 }
 if (currentWallIndex - i === 3) { let doorFound = item.isDoor; for (let j = i; j <= currentWallIndex; j++) if (placedWalls[j] && placedWalls[j].isDoor) doorFound = true; if (doorFound) kantorekCount++; }
 }
 }

 placedWalls.push({ startX: wallStartX, startY: wallStartY, endX: x, endY: y, isDoor: item.isDoor });

 let cx = wallStartX + (x - wallStartX) / 2;
 let cy = wallStartY + (y - wallStartY) / 2;

 // Wypychanie do 3D
 computed3DData.push({ type: 'wall', planIndex: index, cx: cx - stageCenterStartX, cz: cy - stageCenterStartY, length: item.length, height: item.height, angle: currentAngle, color: item.color, isDoor: item.isDoor, labelEN: item.labelEN, textureFront: item.textureFront, textureBack: item.textureBack, isFoldable: item.isFoldable, thickness: item.thickness, isFlipped: item.isFlipped });

 // ZAKTUALIZOWANY RZUT 2D
 let thick = item.thickness || 12;
 let wall = document.createElement('div');
 wall.className = 'sego-wall' + (selectedItemIndex === index ? ' selected' : '');
 wall.style.width = item.length + 'px';
 wall.style.height = thick + 'px';
 wall.style.left = wallStartX + 'px';
 wall.style.top = (wallStartY - (thick / 2)) + 'px';
 wall.style.transformOrigin = '0 50%';
 wall.style.transform = `rotate(${currentAngle}deg)`;

 if (item.color) { wall.style.borderColor = item.color; wall.style.boxShadow = `0 0 8px ${item.color}`; }
 let textRot = (currentAngle % 360 >= 90 && currentAngle % 360 <= 270) ? 180 : 0;
 let heightLabel = item.height === 300 ? `<br><span style="font-size:8px;color:${item.color};">3m</span>` : '';
 wall.innerHTML = `<span style="transform: rotate(${textRot}deg); pointer-events: none; text-align:center; line-height:1;">${item.length}${heightLabel}</span>`;
 wall.onclick = (e) => selectItem(index, e);
 layer.appendChild(wall);

 createJoint(layer, x, y, typeof thisNodeIndex !== 'undefined' ? thisNodeIndex : 0);

 // 🚪 --- PRZYCISK LUSTRZANEGO ODBICIA DRZWI W 2D ---
 if (item.isDoor) {
 let doorCtrl = document.createElement('div');
 doorCtrl.className = 'acc-controls';

 // 🔧 TE DWIE LINIJKI WYMUSZĄ POJAWIENIE SIĘ PRZYCISKU:
 doorCtrl.style.position = 'absolute';
 doorCtrl.style.zIndex = '1000';

 let offsetRadDoor = (currentAngle - 90) * Math.PI / 180;
 doorCtrl.style.left = (wallStartX + (x - wallStartX) / 2 + 25 * Math.cos(offsetRadDoor)) + 'px';
 doorCtrl.style.top = (wallStartY + (y - wallStartY) / 2 + 25 * Math.sin(offsetRadDoor)) + 'px';

 doorCtrl.style.display = (selectedItemIndex === index) ? 'flex' : 'none';

 doorCtrl.innerHTML = `
 <span class="acc-btn" onclick="toggleWallFlip(${index}, event)" title="Przełącz otwieranie drzwi (Przód/Tył)" style="color:#00d2ff; background: rgba(0,0,0,0.8); border: 1px solid #00d2ff; border-radius: 50%; padding: 4px; cursor: pointer;">🚪🔄</span>
 `;
 layer.appendChild(doorCtrl);
 }

 // --- IKONA ŻARÓWKI ---
 if (!item.isFoldable) {
 if (item.lightsOn === undefined) item.lightsOn = true;
 let lightBtn = document.createElement('div'); lightBtn.className = 'light-toggle-btn'; lightBtn.innerHTML = item.lightsOn ? '💡' : '⚫'; lightBtn.style.position = 'absolute'; lightBtn.style.fontSize = '12px'; lightBtn.style.cursor = 'pointer'; lightBtn.style.zIndex = '25'; lightBtn.style.transform = 'translate(-50%, -50%)'; lightBtn.title = 'Włącz/Wyłącz zasilanie';

 let lightDir = item.isFlipped ? -90 : 90;
 let offsetRadLight = (currentAngle + lightDir) * Math.PI / 180;
 lightBtn.style.left = (cx + 15 * Math.cos(offsetRadLight)) + 'px';
 lightBtn.style.top = (cy + 15 * Math.sin(offsetRadLight)) + 'px';

 lightBtn.onmousedown = (e) => e.stopPropagation(); lightBtn.onclick = (e) => { e.stopPropagation(); item.lightsOn = !item.lightsOn; render(); };
 layer.appendChild(lightBtn);
 }

 // --- PĘTLA AKCESORIÓW ---
 if (item.accessories && item.accessories.length > 0) {
 item.accessories.forEach((acc, accIdx) => {
 let effectiveDir = item.isFlipped ? -acc.dir : acc.dir;

 if (acc.id === 'daszek') {
 let legPrice = item.height === 300 ? DB.sego100x300.price : DB.sego100x250.price;
 let legName = item.height === 300 ? DB.sego100x300.name : DB.sego100x250.name;
 addItemToBom("- Daszek: Moduł 100x250 (Dach)", 1, DB.sego100x250.price, counts);
 addItemToBom(`- Daszek: ${legName} (Noga)`, 1, legPrice, counts);
 addItemToBom("- Daszek: Bridge Connector", 4, DB.bridge.price, counts);
 baseCost += DB.sego100x250.price + legPrice + (4 * DB.bridge.price);

 let dAngle = effectiveDir === 1 ? 0 : 180;
 let finalAngle = currentAngle + dAngle;
 computed3DData.push({ type: 'daszek', planIndex: index, accIndex: accIdx, accData: acc, cx: cx - stageCenterStartX, cz: cy - stageCenterStartY, wallHeight: item.height, angle: finalAngle, labelEN: acc.labelEN });

 let daszekEl = document.createElement('div');
 daszekEl.className = 'sego-daszek' + (selectedItemIndex === `daszek_${index}_${accIdx}` ? ' selected' : '');
 daszekEl.onclick = (e) => selectItem(`daszek_${index}_${accIdx}`, e);

 daszekEl.style.width = '100px'; daszekEl.style.height = '250px'; daszekEl.style.left = cx + 'px'; daszekEl.style.top = cy + 'px'; daszekEl.style.marginLeft = '-50px'; daszekEl.style.transformOrigin = '50% 0'; daszekEl.style.transform = `rotate(${finalAngle}deg)`;
 let dRad = finalAngle * Math.PI / 180; let dEndX = cx - 250 * Math.sin(dRad); let dEndY = cy + 250 * Math.cos(dRad);
 minX = Math.min(minX, dEndX - 50); maxX = Math.max(maxX, dEndX + 50); minY = Math.min(minY, dEndY - 50); maxY = Math.max(maxY, dEndY + 50);
 daszekEl.innerHTML = `<div class="acc-controls"><span class="acc-btn" onclick="toggleAccDir(${index}, ${accIdx}, event)">🔄</span><span class="acc-btn" onclick="removeAccessory(${index}, ${accIdx}, event)" style="color:#ff5555">❌</span></div>`;
 layer.appendChild(daszekEl);

 // Akcesoria doczepione do daszku
 if (!acc.accessories) acc.accessories = [];
 acc.accessories.forEach((legAcc, legAccIdx) => {
 addItemToBom(legAcc.name, 1, legAcc.price, counts); baseCost += legAcc.price;

 let legX = cx - 244 * Math.sin(dRad); let legY = cy + 244 * Math.cos(dRad);
 computed3DData.push({ type: 'accessory', id: legAcc.id, accData: legAcc, cx: legX - stageCenterStartX, cz: legY - stageCenterStartY, wallHeight: item.height, wallAngle: finalAngle, dir: legAcc.dir, labelEN: legAcc.labelEN });

 let accEl = document.createElement('div'); accEl.className = 'sego-accessory'; accEl.style.width = '24px'; accEl.style.height = '24px';
 let offsetRad = (finalAngle + (legAcc.dir === 1 ? 90 : -90)) * Math.PI / 180;
 let accX = legX + 18 * Math.cos(offsetRad); let accY = legY + 18 * Math.sin(offsetRad);

 accEl.style.left = (accX - 12) + 'px'; accEl.style.top = (accY - 12 - (legAccIdx * 5)) + 'px'; accEl.style.background = legAcc.color; accEl.style.boxShadow = `0 0 8px ${legAcc.color}`;
 accEl.innerHTML = `<div class="acc-controls"><span class="acc-btn" onclick="cycleLegAccSlot(${index}, ${accIdx}, ${legAccIdx}, event)" title="Zmień wysokość">↕️</span><span class="acc-btn" onclick="toggleLegAccDir(${index}, ${accIdx}, ${legAccIdx}, event)">🔄</span><span class="acc-btn" onclick="removeLegAccessory(${index}, ${accIdx}, ${legAccIdx}, event)" style="color:#ff5555">❌</span></div><span style="transform: rotate(${textRot}deg); pointer-events: none;">${legAcc.short}</span>`;
 layer.appendChild(accEl);
 });
 } else {
 // Standardowe akcesoria (np. półki, wieszaki)
 addItemToBom(acc.name, 1, acc.price, counts); baseCost += acc.price;
 computed3DData.push({ type: 'accessory', id: acc.id, accData: acc, cx: cx - stageCenterStartX, cz: cy - stageCenterStartY, wallHeight: item.height, wallAngle: currentAngle, dir: effectiveDir, labelEN: acc.labelEN });

 let accEl = document.createElement('div'); accEl.className = 'sego-accessory'; accEl.style.width = '24px'; accEl.style.height = '24px';

 let offsetRad = (currentAngle + (effectiveDir === 1 ? 90 : -90)) * Math.PI / 180;
 let accX = cx + 18 * Math.cos(offsetRad); let accY = cy + 18 * Math.sin(offsetRad);
 accEl.style.left = (accX - 12) + 'px'; accEl.style.top = (accY - 12 - (accIdx * 5)) + 'px'; accEl.style.background = acc.color; accEl.style.boxShadow = `0 0 8px ${acc.color}`;
 accEl.innerHTML = `<div class="acc-controls"><span class="acc-btn" onclick="cycleAccSlot(${index}, ${accIdx}, event)" title="Zmień wysokość">↕️</span><span class="acc-btn" onclick="toggleAccDir(${index}, ${accIdx}, event)">🔄</span><span class="acc-btn" onclick="removeAccessory(${index}, ${accIdx}, event)" style="color:#ff5555">❌</span></div><span style="transform: rotate(${textRot}deg); pointer-events: none;">${acc.short}</span>`;
 layer.appendChild(accEl);
 }
 });
 }


 lastItemType = 'wall'; addItemToBom(item.name, 1, item.price, counts); baseCost += item.price;
 if (item.isDoor) { addItemToBom(DB.sego100x250.name, 1, DB.sego100x250.price, counts); baseCost += DB.sego100x250.price; }

 } else if (item.type === 'turn') {
 if (!item.cornerType) item.cornerType = 'wew-zew-1';
 item.prevAngle = currentAngle; currentAngle += item.angle; item.currAngle = currentAngle; item.cornerX = x; item.cornerY = y;
 lastItemType = 'turn'; if (Math.abs(item.angle) === 90) pendingTurn90 = true; pendingTurnItem = item;

 } else if (item.type === 'jump') {
 let targetNode = nodes[item.target]; x = targetNode.x; y = targetNode.y; currentAngle = targetNode.angle; prevWallAngle = currentAngle;

 // 💎 FIX: Rozpoznawanie odnogi i obracanie ściany
 currentDrawingFlipped = targetNode.isFlipped || false;
 let isStartNode = false;
 for (let w of placedWalls) {
 if (Math.abs(x - w.startX) < 1 && Math.abs(y - w.startY) < 1) {
 isStartNode = true; break;
 }
 }
 if (isStartNode) currentDrawingFlipped = !currentDrawingFlipped;

 lastItemType = 'jump'; pendingTurn90 = false;
 pendingTurnItem = null; // 👈 TO CZYŚCI PAMIĘĆ O ZAKRĘCIE
 }
 }

 // NOWE: Dynamiczne przeniesienie punktu rysowania!
 let cursorX = x, cursorY = y, cursorAngle = currentAngle;
 if (selectedItemIndex !== null && plan[selectedItemIndex] && plan[selectedItemIndex].type === 'wall' && plan[selectedItemIndex].endNodeIndex !== undefined) {
 let targetNode = nodes[plan[selectedItemIndex].endNodeIndex];
 if (targetNode) { cursorX = targetNode.x; cursorY = targetNode.y; cursorAngle = targetNode.angle; }
 }

 let cursor = document.createElement('div'); cursor.className = 'build-cursor';
 cursor.style.left = cursorX + 'px'; cursor.style.top = cursorY + 'px';
 cursor.style.transform = `translate(-50%, -50%) rotate(${cursorAngle}deg)`; layer.appendChild(cursor);

 // --- ZACHOWANE: Logika przesuwania świateł na rzucie 2D ---
 studioLights.forEach((light) => {
 let fx = stageCenterStartX + light.offsetX; let fy = stageCenterStartY + light.offsetY;
 let lEl = document.createElement('div'); lEl.className = 'studio-light-2d'; lEl.style.left = fx + 'px'; lEl.style.top = fy + 'px'; lEl.innerHTML = '💡'; lEl.title = 'Przesuń, by zmienić kąt światła w 3D';
 lEl.onmousedown = function (e) {
 e.preventDefault(); e.stopPropagation(); let startX = e.clientX; let startY = e.clientY; let initX = light.offsetX; let initY = light.offsetY; let vs = typeof viewScale !== 'undefined' ? viewScale : 1;
 function onMouseMove(event) {
 light.offsetX = initX + (event.clientX - startX) / vs; light.offsetY = initY + (event.clientY - startY) / vs;
 let newFx = stageCenterStartX + light.offsetX; let newFy = stageCenterStartY + light.offsetY;
 lEl.style.left = newFx + 'px'; lEl.style.top = newFy + 'px'; if (is3DMode) updateLighting();
 }
 document.addEventListener('mousemove', onMouseMove); document.onmouseup = function () { document.removeEventListener('mousemove', onMouseMove); document.onmouseup = null; };
 };
 layer.appendChild(lEl);
 });

 // 💎 ZMIENIONE: Nowa logika dla kabli (SEGO, co 5 metrów długości ścian)
 let totalWallLength = 0;
 let hasSegoWall = false;
 for (let item of plan) {
 if (item.type === 'wall') {
 totalWallLength += item.length;
 if (!item.isFoldable) hasSegoWall = true;
 }
 }
 if (hasSegoWall && totalWallLength >= 500) {
 let cablesNeeded = Math.floor(totalWallLength / 500);
 addItemToBom(DB.extCable.name, cablesNeeded, DB.extCable.price, counts);
 baseCost += (cablesNeeded * DB.extCable.price);
 }

 // --- ZACHOWANE: Pełne wyposażenie kantorka (nóżki + łączniki wew/zew) ---
 if (kantorekCount > 0) {
 addItemToBom(DB.miniFoot.name, 4 * kantorekCount, DB.miniFoot.price, counts); baseCost += (4 * kantorekCount * DB.miniFoot.price);
 addItemToBom(DB.wewzew.name, 2 * kantorekCount, DB.wewzew.price, counts); baseCost += (2 * kantorekCount * DB.wewzew.price);
 }
 // ========================================================
 // --- INTELIGENTNE ZLICZANIE WYDRUKÓW FOLDABLE Z 3D ---
 // ========================================================
 if (currentSystem === 'foldable' && typeof foldablePlanes !== 'undefined' && foldablePlanes.length > 0) {
 foldablePlanes.forEach(plane => {
 let totalLen = plane.walls.reduce((sum, w) => sum + w.length, 0);
 let leaderItem = plane.walls[0];
 let fSet = (plan[leaderItem.planIndex] && plan[leaderItem.planIndex].foldableSettings) ? plan[leaderItem.planIndex].foldableSettings : { div: 'seamless', side: 'double', hasPrint: false };

 if (fSet.hasPrint) {
 let multiplier = (fSet.side === 'double') ? 2 : 1;

 const addPrintToBom = (width) => {
 let name = `Wydruk Foldable ${width}x250`;
 let area = (width / 100) * 2.5; // M2
 let price = area * 24; // 24 EUR/m2
 addItemToBom(name, multiplier, price, counts);
 baseCost += (price * multiplier);
 };

 if (fSet.div === 'seamless') {
 addPrintToBom(totalLen);
 } else if (fSet.div === 'half') {
 let len1 = Math.ceil((totalLen / 2) / 100) * 100;
 if (len1 >= totalLen) len1 = totalLen / 2;
 let len2 = totalLen - len1;
 addPrintToBom(len1); addPrintToBom(len2);
 } else if (fSet.div === 'single') {
 plane.walls.forEach(w => addPrintToBom(w.length));
 }
 }
 });
 }
 /// 💎 DODAWANIE RĘCZNE DO KOSZTORYSU (TERAZ IDEALNIE ZSUMOWANE Z RYSUNKIEM)
 if (typeof refreshManualPanel === 'function') refreshManualPanel();
 for (let key in manualItems) {
 let qty = manualItems[key];
 if (qty > 0 && DB[key]) {
 // Podajemy czystą nazwę z bazy DB - system zsumuje to z elementami 2D/3D
 addItemToBom(DB[key].name, qty, DB[key].price, counts);
 baseCost += (DB[key].price * qty);
 }
 }

 const discount = parseFloat(document.getElementById('discountInput').value) || 0;
 const finalEUR = baseCost * (1 - discount / 100);

 // 💎 DYNAMICZNE KURSY: Pobieranie z UI (zabezpieczone domyślnymi wartościami)
 const plnInput = document.getElementById('rate-pln');
 const usdInput = document.getElementById('rate-usd');
 const currentRatePLN = plnInput ? parseFloat(plnInput.value) : 4.20;
 const currentRateUSD = usdInput ? parseFloat(usdInput.value) : 1.15;

 const finalPLN = finalEUR * currentRatePLN;
 const finalUSD = finalEUR * currentRateUSD;

 // Zapisujemy kursy globalnie, by generator PDF wiedział przez co mnożyć
 window.KURS_PLN_DYNAMIC = currentRatePLN;
 window.KURS_USD_DYNAMIC = currentRateUSD;

 globalWidth = Math.ceil((placedWalls.length > 0 ? (maxX - minX) + 12 : 0) / 50) * 50;
 globalDepth = Math.ceil((placedWalls.length > 0 ? (maxY - minY) + 12 : 0) / 50) * 50;
 globalCounts = counts; globalTotalEUR = finalEUR; globalTotalPLN = finalPLN;

 document.getElementById('valPLN').innerHTML = `<b>${Math.round(finalPLN).toLocaleString()} PLN</b>`;
 document.getElementById('valUSD').innerHTML = `<b>${Math.round(finalUSD).toLocaleString()} $</b>`;

 let bomHTML = '';
 for (let name in counts) {
 let cssClass = ""; if (name.includes("Kantorek")) cssClass = "highlight"; else if (name.includes("Cable")) cssClass = "warn"; else if (name.startsWith("- ")) cssClass = "sub-item";
 if (counts[name].unitPrice === 0 && counts[name].total === 0) { bomHTML += `<div class="bom-item highlight" style="margin-top:8px; border-bottom: 1px solid #444; padding-bottom: 4px;"><span><b>${name}</b></span><span></span></div>`; }
 else { bomHTML += `<div class="bom-item ${cssClass}"><span>${counts[name].qty}x ${name}</span> <span>${Math.round(counts[name].total)} €</span></div>`; }
 }
 // Skip BOM/power updates for kaseton system (handled by generateKasetonBOM)
 if (typeof currentSystem === 'undefined' || currentSystem !== 'kasetony_niestandardowe') {
 document.getElementById('bomList').innerHTML = bomHTML || '<center style="color:#444">Projekt pusty</center>';
 document.getElementById('totalPrice').innerText = Math.round(finalEUR).toLocaleString() + ' €';

 // --- NOWOŚĆ: KALKULACJA ZUŻYCIA MOCY (68W / 1 metr) ---
 let totalPowerW = 0;
 plan.forEach(item => {
 if (item.type === 'wall' && !item.isFoldable && item.lightsOn !== false) {
 totalPowerW += (item.length / 100) * 68;
 }
 if (item.accessories) {
 item.accessories.forEach(acc => {
 if (acc.id === 'tvPanel') totalPowerW += 150;
 });
 }
 if (item.id === 'adTribuneExpo') {
 totalPowerW += 100;
 }
 if (item.type === 'kantorek_1x1') {
 totalPowerW += 3 * 68;
 }
 });
 document.getElementById('totalPower').innerText = `⚡ Moc: ${Math.round(totalPowerW)} W`;
 }
 // --- NOWOŚĆ: WYMIARY CAŁKOWITE W RZUCIE 2D ---
 if (placedWalls.length > 0) {
 const totalW = maxX - minX;
 const totalD = maxY - minY;

 let lineW = document.createElement('div');
 lineW.className = 'total-dim-2d';
 lineW.style.cssText = `position:absolute; border-bottom:2px solid var(--highlight); width:${totalW}px; left:${minX}px; top:${maxY + 50}px; text-align:center; padding-bottom:5px; color:var(--highlight); font-weight:bold; font-size:16px; pointer-events:none; z-index:1;`;
 lineW.innerText = `${totalW.toFixed(0)} cm`;
 layer.appendChild(lineW);

 let lineD = document.createElement('div');
 lineD.className = 'total-dim-2d';
 lineD.style.cssText = `position:absolute; border-right:2px solid var(--highlight); height:${totalD}px; left:${maxX + 50}px; top:${minY}px; display:flex; align-items:center; padding-left:10px; color:var(--highlight); font-weight:bold; font-size:16px; pointer-events:none; z-index:1;`;
 lineD.innerText = `${totalD.toFixed(0)} cm`;
 layer.appendChild(lineD);
 }
 const boundWarningId = 'boundaryWarningOverlay'; let boundWarningEl = document.getElementById(boundWarningId);
 if (isOutOfBounds) {
 if (!boundWarningEl) {
 boundWarningEl = document.createElement('div'); boundWarningEl.id = boundWarningId; boundWarningEl.style.position = 'absolute'; boundWarningEl.style.top = '20px'; boundWarningEl.style.left = '50%'; boundWarningEl.style.transform = 'translateX(-50%)'; boundWarningEl.style.backgroundColor = 'rgba(255, 0, 0, 0.9)'; boundWarningEl.style.color = '#fff'; boundWarningEl.style.padding = '12px 24px'; boundWarningEl.style.borderRadius = '5px'; boundWarningEl.style.fontWeight = 'bold'; boundWarningEl.style.zIndex = '1000'; boundWarningEl.style.pointerEvents = 'none'; boundWarningEl.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)'; boundWarningEl.style.border = '1px solid #ffaaaa'; boundWarningEl.innerText = '⚠️ OSTRZEŻENIE: Stoisko wychodzi poza obrys podłogi!';
 document.getElementById('stage').appendChild(boundWarningEl);
 }
 } else { if (boundWarningEl) boundWarningEl.remove(); }

 const collWarningId = 'wallCollisionWarningOverlay'; let collWarningEl = document.getElementById(collWarningId);
 if (hasWallCollision) {
 if (!collWarningEl) {
 collWarningEl = document.createElement('div'); collWarningEl.id = collWarningId; collWarningEl.style.position = 'absolute'; collWarningEl.style.top = '70px'; collWarningEl.style.left = '50%'; collWarningEl.style.transform = 'translateX(-50%)'; collWarningEl.style.backgroundColor = 'rgba(255, 100, 0, 0.9)'; collWarningEl.style.color = '#fff'; collWarningEl.style.padding = '12px 24px'; collWarningEl.style.borderRadius = '5px'; collWarningEl.style.fontWeight = 'bold'; collWarningEl.style.zIndex = '1000'; collWarningEl.style.pointerEvents = 'none'; collWarningEl.style.boxShadow = '0 0 15px rgba(255, 100, 0, 0.8)'; collWarningEl.style.border = '1px solid #ffaaaa'; collWarningEl.innerText = '⚠️ KOLIZJA ŚCIAN! Użyj opcji "Auto-Naprawa Narożników" w menu z lewej strony.';
 document.getElementById('stage').appendChild(collWarningEl);
 }
 } else { if (collWarningEl) collWarningEl.remove(); }

 if (is3DMode) update3DScene();
}

function recoverEngine() {
 // 1. Ukrywamy ekran błędu
 document.getElementById('crash-screen').style.display = 'none';

 // 2. Czyścimy pamięć ze starego, zepsutego renderera
 if (renderer) {
 renderer.dispose();
 renderer.forceContextLoss(); // Upewniamy się, że VRAM jest zwolniony
 }

 // 3. Usuwamy martwe płótno 3D (canvas) z HTML
 const container = document.getElementById('canvas-container');
 if (container) container.innerHTML = '';

 // 4. Odpalamy silnik całkowicie na nowo
 init3D();

 // 5. Zmuszamy nowy silnik do narysowania ścian, które klient miał w pamięci (tablica plan)
 if (typeof render === 'function') {
 render();
 }

 console.log("Silnik 3D zrestartowany pomyślnie.");
}
