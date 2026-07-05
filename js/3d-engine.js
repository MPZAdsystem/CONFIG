window.showHallEnvironment = false;
function toggleHallEnvironment() {
  window.showHallEnvironment = !window.showHallEnvironment;
  const btn = document.getElementById('btnToggleHallEnv');
  if (btn) {
    btn.classList.toggle('active', window.showHallEnvironment);
    btn.innerText = window.showHallEnvironment ? '🏢 Otoczenie Hali (WŁ)' : '🏢 Otoczenie Hali';
  }
  if (typeof render === 'function') render();
}
window.toggleHallEnvironment = toggleHallEnvironment;

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
    light.position.set(lData.offsetX, 450, lData.offsetY); // Podwyższone źródło dla lepszego kąta cieni
    light.target.position.set(0, 100, 0);

    // Włączenie generowania cieni dla światła kierunkowego (tylko 2 główne, by nie przeciążać GPU)
    if (lData.id === 4 || lData.id === 1) {
      light.castShadow = true;
      light.shadow.mapSize.width = 2048; // Zwiększona jakość cieni
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 1800;
      
      const d = 1200;
      light.shadow.camera.left = -d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d;
      light.shadow.camera.bottom = -d;
      light.shadow.bias = -0.0004;
    } else {
      light.castShadow = false;
    }

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
    window.activeLedMaterials.forEach(mat => {
      if (mat.userData && mat.userData.isRgbLed) {
        mat.emissive.copy(colorObj);
      } else {
        mat.emissive.setHex(0xffffff); // Neutralna biel 5000K dla kasetonów
      }
    });
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
  window.currentBgType = type;
  if (!scene) return;

  scene.environment = null;
  if (windowExpoFloor) { scene.remove(windowExpoFloor); windowExpoFloor.geometry.dispose(); windowExpoFloor.material.dispose(); windowExpoFloor = null; }
  if (windowExpoCeiling) { scene.remove(windowExpoCeiling); windowExpoCeiling.geometry.dispose(); windowExpoCeiling.material.dispose(); windowExpoCeiling = null; }
  if (windowExpoWalls) { scene.remove(windowExpoWalls); windowExpoWalls.geometry.dispose(); windowExpoWalls.material.dispose(); windowExpoWalls = null; }

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

    const hallRadius = 1500;
    const hallHeight = 800;

    const floorGeom = new THREE.CircleGeometry(hallRadius, 64);
    const floorTex = createBrickFloorTexture('#141414', '#000000', hallRadius); // Antracyt z czarną fugą
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.6,
      metalness: 0.1
    });
    windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
    windowExpoFloor.rotation.x = -Math.PI / 2;
    windowExpoFloor.position.y = -0.5;
    scene.add(windowExpoFloor);

    const ceilingGeom = new THREE.CircleGeometry(hallRadius, 64);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, side: THREE.DoubleSide });
    windowExpoCeiling = new THREE.Mesh(ceilingGeom, ceilingMat);
    windowExpoCeiling.rotation.x = Math.PI / 2;
    windowExpoCeiling.position.y = hallHeight;
    scene.add(windowExpoCeiling);

    const wallGeom = new THREE.CylinderGeometry(hallRadius, hallRadius, hallHeight, 32, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1.0, side: THREE.BackSide });
    windowExpoWalls = new THREE.Mesh(wallGeom, wallMat);
    windowExpoWalls.position.y = hallHeight / 2;
    scene.add(windowExpoWalls);

    let oldText = "";
    if (btnElement) { oldText = btnElement.innerText; btnElement.innerText = "⏳ Ładowanie HDRI..."; }
    const HDR_URL = 'https://raw.githubusercontent.com/MPZAdsystem/Background/main/b2.hdr';

    new THREE.RGBELoader().load(HDR_URL, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = new THREE.Color(0x000000);

      if (btnElement) btnElement.innerText = oldText;
      if (typeof render === 'function') render();
    }, undefined, function (err) {
      console.error("Błąd ładowania mapy HDR:", err);
      if (btnElement) btnElement.innerText = "❌ Błąd HDR";
    });

  } else if (type === 'dark_hall') {
    if (windowGridHelper) { scene.remove(windowGridHelper); windowGridHelper = null; }

    const quadRadius = 2000;
    const quadHeight = 1000;

    const floorGeom = new THREE.CircleGeometry(quadRadius, 64);
    const floorTex = createBrickFloorTexture('#141414', '#000000', quadRadius);
    const floorMat = new THREE.MeshBasicMaterial({
      map: floorTex
    });
    windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
    windowExpoFloor.rotation.x = -Math.PI / 2;
    windowExpoFloor.position.y = -0.5;
    scene.add(windowExpoFloor);

    scene.background = new THREE.Color(0x000000);

    const base = "https://raw.githubusercontent.com/Valaron86/hall-image/441241fed4ce12515406ff856aafa60982fc3cda/";
    const darkTextures = [
      base + "darkhall3.jpg",
      base + "darkhall3.jpg",
      base + "darkhall3.jpg",
      base + "darkhall3.jpg"
    ];

    if (typeof createQuadBackground === 'function') {
      createQuadBackground(scene, darkTextures, quadRadius, quadHeight);
    }
    if (typeof camera !== 'undefined') {
      camera.far = 15000;
      camera.updateProjectionMatrix();
    }

    if (typeof renderer !== 'undefined') {
      renderer.toneMappingExposure = 1.2;
    }

    if (typeof render === 'function') render();
  }
  else if (type === 'quad_test') {
    if (windowGridHelper) { scene.remove(windowGridHelper); windowGridHelper = null; }

    const quadRadius = 2000;
    const quadHeight = 1500;

    const floorGeom = new THREE.CircleGeometry(quadRadius, 64);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.4 });
    windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
    windowExpoFloor.rotation.x = -Math.PI / 2;
    windowExpoFloor.position.y = -0.5;
    scene.add(windowExpoFloor);

    scene.background = new THREE.Color(0x111111);

    const testTextures = [
      'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png',
      'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png',
      'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png',
      'https://raw.githubusercontent.com/Valaron86/hall-image/main/Gemini_Generated_Image_namtc7namtc7namt.png'
    ];

    if (typeof createQuadBackground === 'function') {
      createQuadBackground(scene, testTextures, quadRadius, quadHeight);
    } else {
      console.error("Nie znaleziono funkcji createQuadBackground!");
    }

    if (typeof render === 'function') render();

  } else if (type === 'dark_sketch') {
    if (windowGridHelper) { scene.remove(windowGridHelper); windowGridHelper = null; }

    if (typeof windowExpoFloor !== 'undefined' && windowExpoFloor) {
      scene.remove(windowExpoFloor);
    }
    if (typeof windowCeiling !== 'undefined' && windowCeiling) {
      scene.remove(windowCeiling);
    }

    const quadRadius = 2500;
    const quadHeight = 1200;

    const floorGeom = new THREE.CircleGeometry(quadRadius, 64);
    const floorTex = createBrickFloorTexture('#141414', '#000000', quadRadius);
    const floorMat = new THREE.MeshBasicMaterial({
      map: floorTex
    });
    windowExpoFloor = new THREE.Mesh(floorGeom, floorMat);
    windowExpoFloor.rotation.x = -Math.PI / 2;
    windowExpoFloor.position.y = -0.1;
    scene.add(windowExpoFloor);

    const ceilGeom = new THREE.CircleGeometry(quadRadius, 64);
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 1.0,
      metalness: 0.0,
      envMapIntensity: 0.0
    });
    window.windowCeiling = new THREE.Mesh(ceilGeom, ceilMat);
    window.windowCeiling.rotation.x = Math.PI / 2;
    window.windowCeiling.position.y = quadHeight;
    scene.add(window.windowCeiling);

    scene.background = new THREE.Color(0x000000);

    const sketchTextureUrl = "https://raw.githubusercontent.com/Valaron86/hall-image/13be81aea219940f1f2a728047716440735474e6/Darkhallsketch.jpg";
    const sketchTextures = [sketchTextureUrl, sketchTextureUrl, sketchTextureUrl, sketchTextureUrl];

    if (typeof createQuadBackground === 'function') {
      createQuadBackground(scene, sketchTextures, quadRadius, quadHeight);
    }

    if (typeof camera !== 'undefined') {
      camera.far = 15000;
      camera.updateProjectionMatrix();
    }
    if (typeof renderer !== 'undefined') renderer.toneMappingExposure = 1.3;

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

  const oldCanvas = container.querySelector('canvas');
  if (oldCanvas) oldCanvas.remove();

  scene = new THREE.Scene();

  arGroup = new THREE.Group();
  scene.add(arGroup);

  windowGridHelper = new THREE.GridHelper(2000, 40, 0xcccccc, 0xe0e0e0);
  scene.add(windowGridHelper);

  windowAmbientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(windowAmbientLight);

  updateLighting();
  setSceneBg('dark_sketch');

  if (typeof loadWalkingMan === 'function') {
    loadWalkingMan();
  }

  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 10000);
  camera.position.set(600, 500, 800);

  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // Włączenie cieni w rendererze
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.addEventListener('webglcontextlost', function (event) {
    event.preventDefault();
    const crashScreen = document.getElementById('crash-screen');
    if (crashScreen) crashScreen.style.display = 'flex';
  }, false);

  container.appendChild(renderer.domElement);

  renderer.xr.enabled = true;

  const arBtn = ARButton.createButton(renderer, { optionalFeatures: ['hit-test'] });
  arBtn.id = 'ARButton';

  const arContainer = document.getElementById('ARButtonContainer') || document.querySelector('.fab-container-left');
  if (arContainer) arContainer.appendChild(arBtn);

  const reticleGeom = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
  const reticleMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  reticle = new THREE.Mesh(reticleGeom, reticleMat);
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

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
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.25;
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

        // Normalize side names to base keys (Front, Back, Left, Right, Top, Bottom)
        const lowerSide = side.toLowerCase();
        let dir = 'Front';
        if (lowerSide.includes('back')) dir = 'Back';
        else if (lowerSide.includes('left')) dir = 'Left';
        else if (lowerSide.includes('right')) dir = 'Right';
        else if (lowerSide.includes('top')) dir = 'Top';
        else if (lowerSide.includes('bottom')) dir = 'Bottom';

        const isInner = lowerSide.includes('inner');
        const keySuffix = dir + (isInner ? 'Inner' : '');

        const nameKey = 'texture' + keySuffix + 'Name';
        const texKey = 'texture' + keySuffix;
        window.currentKasetonConfig[nameKey] = file.name;
        refreshGraphicsList();
        handleDroppedFile(file, fileExt, (source) => {
          let dataUrl = typeof source === 'string' ? source : source.toDataURL('image/jpeg', 0.95);
          window.currentKasetonConfig[texKey] = dataUrl;
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
              const isFlipped = plan[planIdx] ? plan[planIdx].isFlipped : false;
              if (isFlipped) {
                if (matIndex === 4) plan[planIdx].textureBackName = file.name;
                else plan[planIdx].textureFrontName = file.name;
              } else {
                if (matIndex === 4) plan[planIdx].textureFrontName = file.name;
                else plan[planIdx].textureBackName = file.name;
              }
            }
            refreshGraphicsList();
            handleDroppedFile(file, fileExt, (source) => applyTextureToMesh(mesh, matIndex, planIdx, source, quadIdx, false));
            break;
          }
        }
      }
    }
  }); // 👍 KOREKTA 1: Prawidłowe zamknięcie zdarzenia 'drop'

  // =================================================================
  // LISTENERY INTERAKCJI (Ruch i upuszczenie ludzika w 3D)
  // =================================================================
  container.addEventListener('mousedown', (e) => {
    if (!is3DMode || !human3DModel) return;
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(human3DModel, true);
    if (intersects.length > 0) {
      isDraggingHuman3D = true;
      controls.enabled = false;
    }
  });

  container.addEventListener('mousemove', (e) => {
    // Jeśli nie jesteśmy w trybie 3D, nie przeciągamy ludzika lub model nie istnieje - przerywamy
    if (!is3DMode || !isDraggingHuman3D || !human3DModel) return;

    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(plane3D, intersection3D)) {
      // 1. Aktualizujemy współrzędne w globalnym obiekcie stanu (data.js)
      humanPos.x = intersection3D.x;
      humanPos.z = intersection3D.z;

      // 2. Płynnie przesuwamy model 3D na wirtualnej podłodze halii
      human3DModel.position.x = humanPos.x;
      human3DModel.position.z = humanPos.z;

      // 3. Aktualizujemy pozycję płaskiej ikonki 2D, aby poruszała się równolegle w HTML
      const man2D = document.getElementById('man2DElement');
      const stg = document.getElementById('stage');
      if (man2D && stg) {
        const stageCenterStartX = stg.clientWidth / 2 - 100;
        const stageCenterStartY = stg.clientHeight / 2 + 100;
        let px = stageCenterStartX + humanPos.x;
        let py = stageCenterStartY + humanPos.z;
        man2D.style.left = (px - 15) + 'px';
        man2D.style.top = (py - 15) + 'px';
      }
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDraggingHuman3D) {
      isDraggingHuman3D = false;
      controls.enabled = true;
      if (typeof render === 'function') render();
    }
  });
} // 👍 KOREKTA 2: Prawidłowe zamknięcie całej funkcji init3D() przed animate3D()

// =================================================================
// FUNKCJA ŁADOWANIA MODELU LUDZIKA (Wyciągnięta do poziomu globalnego)
// =================================================================
function loadWalkingMan() {
  if (human3DModel) {
    scene.remove(human3DModel);
    human3DModel = null;
  }

  const loader = new THREE.GLTFLoader();
  const isSoldier = window.currentHumanType === 'soldier';

  const modelUrl = isSoldier
    ? "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb"
    : "https://raw.githubusercontent.com/Valaron86/hall-image/50708911485c87399051b9673d42829ec6758060/man.glb";

  loader.load(modelUrl, function (gltf) {
    const model = gltf.scene;
    human3DModel = model;

    if (isSoldier) {
      model.scale.set(100, 100, 100);
    } else {
      model.scale.set(66, 66, 66);
    }

    const initialRotation = humanPos.rotation !== undefined ? humanPos.rotation : 180;
    model.position.set(humanPos.x, 0, humanPos.z);
    model.rotation.y = initialRotation * Math.PI / 180;

    const box = new THREE.Box3().setFromObject(model);
    const elevation = typeof globalElevationY !== 'undefined' ? globalElevationY : 0;
    model.position.y = elevation + Math.abs(box.min.y);

    if (isSoldier) {
      model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
    } else {
      model.traverse(function (node) {
        // Ukrywanie linii pomocniczych, szkieletów (LineSegments/Line) i chmur punktów, które rysują białe kontury
        if (node.isLine || node.isLineSegments || node.isPoints || (node.type && (node.type.includes('Line') || node.type.includes('Points')))) {
          node.visible = false;
          return;
        }

        if (node.isMesh) {
          const nameLower = node.name.toLowerCase();
          if (nameLower.includes('outline') || nameLower.includes('helper') || nameLower.includes('edge') || nameLower.includes('collider')) {
            node.visible = false;
            return;
          }

          if (node.geometry) {
            node.geometry.deleteAttribute('color');
          }

          if (node.material) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            const newMats = mats.map((mat, idx) => {
              if (!mat.map) {
                return new THREE.MeshStandardMaterial({
                  color: 0x000000,
                  roughness: 1.0,
                  metalness: 0.0,
                  skinning: true,
                  visible: false
                });
              }

              const newMat = new THREE.MeshStandardMaterial({
                map: mat.map,
                color: 0xffffff,
                roughness: 1.0,
                metalness: 0.0,
                transparent: mat.transparent,
                alphaTest: 0.5,
                depthWrite: true,
                side: THREE.FrontSide,
                shadowSide: THREE.FrontSide,
                skinning: true
              });

              newMat.map.minFilter = THREE.LinearFilter;
              newMat.map.magFilter = THREE.LinearFilter;
              newMat.map.generateMipmaps = false;
              newMat.map.wrapS = THREE.ClampToEdgeWrapping;
              newMat.map.wrapT = THREE.ClampToEdgeWrapping;
              newMat.map.needsUpdate = true;

              return newMat;
            });

            node.material = Array.isArray(node.material) ? newMats : newMats[0];
          }

          node.castShadow = true;
          node.receiveShadow = false;
        }
      });
    }

    scene.add(model);

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      const animIdx = isSoldier ? 1 : 0;
      const action = mixer.clipAction(gltf.animations[animIdx]);
      action.play();
    }
  }, undefined, function (error) {
    console.error('Błąd podczas asynchronicznego ładowania modelu ludzika:', error);
  });
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

      if (mixer && typeof clock !== 'undefined') {
        const delta = clock.getDelta();
        if (delta < 0.1) mixer.update(delta);
      }

      if (controls) controls.update();

      // Dynamiczny efekt "oddychania" diod LED oraz zmiana kolorów dla trybu auto
      if (window.activeLedMaterials && window.activeLedMaterials.length > 0) {
        const ledTime = Date.now() * 0.002;
        const baseIntensity = typeof currentLedIntensity !== 'undefined' ? currentLedIntensity : 1.5;
        const breathingIntensity = baseIntensity * (0.85 + 0.15 * Math.sin(ledTime * 1.5));
        
        window.activeLedMaterials.forEach(mat => {
          mat.emissiveIntensity = breathingIntensity;
        });

        if (currentLedMode === 'auto') {
          const hslColor = new THREE.Color().setHSL((ledTime * 0.02) % 1, 1, 0.5);
          window.activeLedMaterials.forEach(mat => {
            if (mat.userData && mat.userData.isRgbLed) {
              mat.emissive.copy(hslColor);
            } else {
              mat.emissive.setHex(0xffffff); // Biel 5000K
            }
          });
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

function createCarpetTexture(w, h, baseColorHex, gridColorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 512, 512);

  // Dyskretne ziarno tkaniny
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 1500; i++) {
    let rx = Math.random() * 512;
    let ry = Math.random() * 512;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Wrysowanie dylatacji płyt w teksturę zamiast oddzielnych linii 3D
  ctx.strokeStyle = gridColorHex;
  ctx.lineWidth = 4;
  const stepX = 512 / (w / 50);
  const stepY = 512 / (h / 50);

  for (let x = 0; x <= 512; x += stepX) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let y = 0; y <= 512; y += stepY) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  if (typeof THREE.sRGBEncoding !== 'undefined') tex.encoding = THREE.sRGBEncoding;
  return tex;
}

function createBrickFloorTexture(baseColorHex, gridColorHex, radius) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle concrete texture grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  for (let i = 0; i < 2000; i++) {
    let rx = Math.random() * 512;
    let ry = Math.random() * 512;
    ctx.fillRect(rx, ry, 1, 1);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  for (let i = 0; i < 2000; i++) {
    let rx = Math.random() * 512;
    let ry = Math.random() * 512;
    ctx.fillRect(rx, ry, 1, 1);
  }

  // Draw grout lines (joint width)
  ctx.strokeStyle = gridColorHex;
  ctx.lineWidth = 3;

  // Horizontal seams (representing 100cm rows)
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(512, 0);
  ctx.moveTo(0, 256); ctx.lineTo(512, 256);
  ctx.moveTo(0, 512); ctx.lineTo(512, 512);
  ctx.stroke();

  // Row 0 vertical seams (x: 0, 256, 512)
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(0, 256);
  ctx.moveTo(256, 0); ctx.lineTo(256, 256);
  ctx.moveTo(512, 0); ctx.lineTo(512, 256);
  ctx.stroke();

  // Row 1 vertical seams offset by 50% (x: 128, 384)
  ctx.beginPath();
  ctx.moveTo(128, 256); ctx.lineTo(128, 512);
  ctx.moveTo(384, 256); ctx.lineTo(384, 512);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  const repeatCount = radius / 100;
  tex.repeat.set(repeatCount, repeatCount);
  if (typeof THREE.sRGBEncoding !== 'undefined') tex.encoding = THREE.sRGBEncoding;
  return tex;
}

function buildOctanormBooth3D(cx, cz) {
  const group = new THREE.Group();
  group.position.set(cx, 0, cz);

  const aluMat = new THREE.MeshStandardMaterial({ color: 0xd0d4dc, metalness: 0.85, roughness: 0.25 });
  const panelMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f7, roughness: 0.65, metalness: 0.05 });
  const carpetTex = createCarpetTexture(300, 300, '#22252a', 'rgba(10, 12, 15, 0.7)');
  const carpetMat = new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.9 });
  const spotMat = new THREE.MeshStandardMaterial({ color: 0xdadada, metalness: 0.9, roughness: 0.2 });

  // 1. Podłoga wykładzinowa 300x300 cm (jedna płachta z teksturą)
  const floorGeo = new THREE.PlaneGeometry(300, 300);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMesh = new THREE.Mesh(floorGeo, carpetMat);
  floorMesh.position.set(0, 0.5, 0);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // 2. Słupki Octanorm (szerokość 4.5cm, wysokość 250cm)
  const postGeo = new THREE.BoxGeometry(4.5, 250, 4.5);
  const addPost = (px, pz) => {
    const post = new THREE.Mesh(postGeo, aluMat);
    post.position.set(px, 125, pz);
    post.castShadow = true;
    group.add(post);
  };

  // Narożne słupki
  addPost(-150, -150); addPost(150, -150);
  addPost(-150, 150);  addPost(150, 150);
  // Pośrednie słupki na ścianach (układ 3x3 modułowy)
  addPost(-50, -150);  addPost(50, -150);  // Tył
  addPost(150, -50);   addPost(150, 50);   // Prawa ściana

  // 3. Ściany wypełniające białe (Back Wall & Right Wall)
  const panelH = 230;
  const panelThick = 1.2;

  // Tylna ściana (3 sekcje po ~95cm)
  const backPanelGeo = new THREE.BoxGeometry(95.5, panelH, panelThick);
  [-100, 0, 100].forEach(px => {
    const p = new THREE.Mesh(backPanelGeo, panelMat);
    p.position.set(px, 115, -150);
    p.castShadow = true;
    group.add(p);
  });

  // Prawa ściana (3 sekcje po ~95cm)
  const rightPanelGeo = new THREE.BoxGeometry(panelThick, panelH, 95.5);
  [-100, 0, 100].forEach(pz => {
    const p = new THREE.Mesh(rightPanelGeo, panelMat);
    p.position.set(150, 115, pz);
    p.castShadow = true;
    group.add(p);
  });

  // 4. Rygle aluminiowe dolne i górne (Beam rails)
  const railHGeo = new THREE.BoxGeometry(300, 4, 4);
  const railVGeo = new THREE.BoxGeometry(4, 4, 300);

  [2, 230].forEach(ry => {
    let rB = new THREE.Mesh(railHGeo, aluMat); rB.position.set(0, ry, -150); group.add(rB);
    let rF = new THREE.Mesh(railHGeo, aluMat); rF.position.set(0, ry, 150); group.add(rF);
    let rR = new THREE.Mesh(railVGeo, aluMat); rR.position.set(150, ry, 0); group.add(rR);
    let rL = new THREE.Mesh(railVGeo, aluMat); rL.position.set(-150, ry, 0); group.add(rL);
  });

  // Górne rygle zwieńczające ramę (wysokość 250cm)
  let rTopF = new THREE.Mesh(railHGeo, aluMat); rTopF.position.set(0, 248, 150); group.add(rTopF);
  let rTopL = new THREE.Mesh(railVGeo, aluMat); rTopL.position.set(-150, 248, 0); group.add(rTopL);
  let rTopR = new THREE.Mesh(railVGeo, aluMat); rTopR.position.set(150, 248, 0); group.add(rTopR);
  let rTopB = new THREE.Mesh(railHGeo, aluMat); rTopB.position.set(0, 248, -150); group.add(rTopB);

  // 5. Fryz / Fascia board z napisem "COMPANY NAME" i grafiką swoosh
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1024, 128);
  
  // Dynamiczna grafika dekoracyjna z motywem łuków
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.moveTo(800, 0); ctx.quadraticCurveTo(850, 128, 1024, 60); ctx.lineTo(1024, 0); ctx.fill();
  ctx.fillStyle = '#f4a261'; ctx.beginPath(); ctx.moveTo(750, 0); ctx.quadraticCurveTo(820, 128, 980, 128); ctx.lineTo(880, 0); ctx.fill();
  ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.moveTo(700, 0); ctx.quadraticCurveTo(760, 128, 900, 128); ctx.lineTo(820, 0); ctx.fill();

  ctx.fillStyle = '#1d3557'; ctx.font = 'bold 38px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('COMPANY NAME', 400, 64);
  ctx.fillStyle = '#e63946'; ctx.font = 'bold 32px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('A1', 40, 64);

  const fasciaTex = new THREE.CanvasTexture(canvas);
  if (typeof THREE.sRGBEncoding !== 'undefined') fasciaTex.encoding = THREE.sRGBEncoding;
  const fasciaMat = new THREE.MeshStandardMaterial({ map: fasciaTex, roughness: 0.4 });

  // Fryz Przód
  const fasciaFrontGeo = new THREE.BoxGeometry(292, 18, 1.5);
  const fasciaFront = new THREE.Mesh(fasciaFrontGeo, fasciaMat);
  fasciaFront.position.set(0, 239, 150);
  group.add(fasciaFront);

  // Fryz Lewa strona
  const fasciaLeftGeo = new THREE.BoxGeometry(1.5, 18, 292);
  const fasciaLeft = new THREE.Mesh(fasciaLeftGeo, fasciaMat);
  fasciaLeft.position.set(-150, 239, 0);
  group.add(fasciaLeft);

  // 6. Reflektorki oświetleniowe (Spotlights)
  [-60, 60].forEach(spX => {
    const spotGroup = new THREE.Group();
    spotGroup.position.set(spX, 232, 145);

    const armGeo = new THREE.CylinderGeometry(0.8, 0.8, 12);
    armGeo.rotateX(Math.PI / 4);
    const arm = new THREE.Mesh(armGeo, spotMat);
    spotGroup.add(arm);

    const headGeo = new THREE.ConeGeometry(4.5, 10, 16);
    headGeo.rotateX(-Math.PI / 3);
    const head = new THREE.Mesh(headGeo, spotMat);
    head.position.set(0, -6, -6);
    spotGroup.add(head);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfffaed }));
    bulb.position.set(0, -9, -9);
    spotGroup.add(bulb);

    group.add(spotGroup);
  });

  return group;
}

function buildOctanormBooth4x33D(cx, cz) {
  const group = new THREE.Group();
  group.position.set(cx, 0, cz);

  const aluMat = new THREE.MeshStandardMaterial({ color: 0xd0d4dc, metalness: 0.85, roughness: 0.25 });
  const panelMat = new THREE.MeshStandardMaterial({ color: 0xf0f3f6, roughness: 0.65, metalness: 0.05 });
  const carpetTex = createCarpetTexture(400, 300, '#1a2430', 'rgba(10, 15, 22, 0.7)');
  const carpetMat = new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.9 });
  const spotMat = new THREE.MeshStandardMaterial({ color: 0xdadada, metalness: 0.9, roughness: 0.2 });

  // 1. Podłoga 400x300 cm (jedna płachta z teksturą)
  const floorGeo = new THREE.PlaneGeometry(400, 300);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMesh = new THREE.Mesh(floorGeo, carpetMat);
  floorMesh.position.set(0, 0.5, 0);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // 2. Słupki Octanorm (wysokość 250cm)
  const postGeo = new THREE.BoxGeometry(4.5, 250, 4.5);
  const addPost = (px, pz) => {
    const post = new THREE.Mesh(postGeo, aluMat);
    post.position.set(px, 125, pz);
    post.castShadow = true;
    group.add(post);
  };

  // Narożne słupki
  addPost(-200, -150); addPost(200, -150);
  addPost(-200, 150);  addPost(200, 150);
  // Pośrednie słupki
  addPost(-100, -150); addPost(0, -150); addPost(100, -150); // Tył (4 sekcje)
  addPost(-200, -50);  addPost(-200, 50);                   // Lewa (3 sekcje)
  addPost(200, -50);   addPost(200, 50);                    // Prawa (3 sekcje)

  // 3. Ściany wypełniające białe (Back, Left & Right Walls - Układ U)
  const panelH = 230;
  const panelThick = 1.2;

  // Tylna ściana 4m (4 sekcje)
  const backPanelGeo = new THREE.BoxGeometry(95.5, panelH, panelThick);
  [-150, -50, 50, 150].forEach(px => {
    const p = new THREE.Mesh(backPanelGeo, panelMat);
    p.position.set(px, 115, -150);
    p.castShadow = true;
    group.add(p);
  });

  // Lewa ściana 3m & Prawa ściana 3m (po 3 sekcje)
  const sidePanelGeo = new THREE.BoxGeometry(panelThick, panelH, 95.5);
  [-100, 0, 100].forEach(pz => {
    const pL = new THREE.Mesh(sidePanelGeo, panelMat); pL.position.set(-200, 115, pz); group.add(pL);
    const pR = new THREE.Mesh(sidePanelGeo, panelMat); pR.position.set(200, 115, pz); group.add(pR);
  });

  // 4. Rygle aluminiowe
  const rail400Geo = new THREE.BoxGeometry(400, 4, 4);
  const rail300Geo = new THREE.BoxGeometry(4, 4, 300);

  [2, 230, 248].forEach(ry => {
    let rB = new THREE.Mesh(rail400Geo, aluMat); rB.position.set(0, ry, -150); group.add(rB);
    let rF = new THREE.Mesh(rail400Geo, aluMat); rF.position.set(0, ry, 150); group.add(rF);
    let rL = new THREE.Mesh(rail300Geo, aluMat); rL.position.set(-200, ry, 0); group.add(rL);
    let rR = new THREE.Mesh(rail300Geo, aluMat); rR.position.set(200, ry, 0); group.add(rR);
  });

  // 5. Fryz / Fascia board (Front 4m) z napisem "TECH CORP" i motywem cyan
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1024, 128);

  ctx.fillStyle = '#00b4d8'; ctx.beginPath(); ctx.moveTo(750, 0); ctx.quadraticCurveTo(850, 128, 1024, 40); ctx.lineTo(1024, 0); ctx.fill();
  ctx.fillStyle = '#90e0ef'; ctx.beginPath(); ctx.moveTo(700, 0); ctx.quadraticCurveTo(780, 128, 950, 128); ctx.lineTo(850, 0); ctx.fill();

  ctx.fillStyle = '#03045e'; ctx.font = 'bold 38px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('TECH CORP', 400, 64);
  ctx.fillStyle = '#00b4d8'; ctx.font = 'bold 32px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('B2', 40, 64);

  const fasciaTex = new THREE.CanvasTexture(canvas);
  if (typeof THREE.sRGBEncoding !== 'undefined') fasciaTex.encoding = THREE.sRGBEncoding;
  const fasciaMat = new THREE.MeshStandardMaterial({ map: fasciaTex, roughness: 0.4 });

  const fasciaFront = new THREE.Mesh(new THREE.BoxGeometry(392, 18, 1.5), fasciaMat);
  fasciaFront.position.set(0, 239, 150);
  group.add(fasciaFront);

  // 6. Reflektorki (3 sztuki na przedniej belce 4m)
  [-100, 0, 100].forEach(spX => {
    const spotGroup = new THREE.Group();
    spotGroup.position.set(spX, 232, 145);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 12), spotMat); arm.rotation.x = Math.PI / 4; spotGroup.add(arm);
    const head = new THREE.Mesh(new THREE.ConeGeometry(4.5, 10, 16), spotMat); head.rotation.x = -Math.PI / 3; head.position.set(0, -6, -6); spotGroup.add(head);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfffaed })); bulb.position.set(0, -9, -9); spotGroup.add(bulb);

    group.add(spotGroup);
  });

  return group;
}

function update3DScene() {
  if (typeof window.foldablePlanes !== 'undefined') {
    window.foldablePlanes = [];
  } else {
    window.foldablePlanes = [];
  }

  foldablePlanes = window.foldablePlanes;

  if (!scene) return;

  const addModuleLetterMesh = (letter, targetGroup, height, thickness) => {
    if (!letter) return;
    const letterCanvas = document.createElement('canvas');
    letterCanvas.width = 256;
    letterCanvas.height = 256;
    const letterCtx = letterCanvas.getContext('2d');
    
    letterCtx.clearRect(0, 0, 256, 256);
    letterCtx.font = 'bold 200px "Segoe UI", Arial';
    letterCtx.fillStyle = '#ff1133'; // Vibrant neon red
    letterCtx.textAlign = 'center';
    letterCtx.textBaseline = 'middle';
    letterCtx.fillText(letter, 128, 128);

    const letterTex = new THREE.CanvasTexture(letterCanvas);
    const letterMat = new THREE.MeshBasicMaterial({
      map: letterTex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const letterSize = 35;
    const halfThick = thickness / 2;

    // Front letter
    const letterMeshFront = new THREE.Mesh(new THREE.PlaneGeometry(letterSize, letterSize), letterMat);
    letterMeshFront.position.set(0, height, halfThick + 0.1);
    letterMeshFront.userData = { isInternalAnatomy: true };
    letterMeshFront.renderOrder = 1002;
    targetGroup.add(letterMeshFront);

    // Back letter
    const letterMeshBack = new THREE.Mesh(new THREE.PlaneGeometry(letterSize, letterSize), letterMat);
    letterMeshBack.position.set(0, height, -halfThick - 0.1);
    letterMeshBack.rotation.y = Math.PI;
    letterMeshBack.userData = { isInternalAnatomy: true };
    letterMeshBack.renderOrder = 1002;
    targetGroup.add(letterMeshBack);
  };

  const addModuleOverlayMesh = (letter, sizeText, targetGroup, height, thickness) => {
    if (!letter) return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Clear and draw white background
    ctx.clearRect(0, 0, 512, 512);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    
    const isBW = typeof showModuleListMode !== 'undefined' && showModuleListMode === 'bw';

    // Nice border
    ctx.strokeStyle = isBW ? '#222222' : '#dddddd';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, 496, 496);
    
    // Letter in center-top
    ctx.fillStyle = isBW ? '#222222' : '#ff1133';
    ctx.font = 'bold 220px "Segoe UI", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 256, 190);
    
    // Size text below
    ctx.fillStyle = isBW ? '#555555' : '#111111';
    ctx.font = 'bold 60px "Segoe UI", Arial';
    ctx.fillText(sizeText, 256, 380);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const overlaySize = 45; // 45x45 cm square overlay
    const halfThick = thickness / 2;

    // Front overlay
    const meshFront = new THREE.Mesh(new THREE.PlaneGeometry(overlaySize, overlaySize), mat);
    meshFront.position.set(0, height, halfThick + 0.15);
    meshFront.userData = { isModuleListOverlay: true };
    meshFront.renderOrder = 1003;
    targetGroup.add(meshFront);

    // Back overlay
    const meshBack = new THREE.Mesh(new THREE.PlaneGeometry(overlaySize, overlaySize), mat);
    meshBack.position.set(0, height, -halfThick - 0.15);
    meshBack.rotation.y = Math.PI;
    meshBack.userData = { isModuleListOverlay: true };
    meshBack.renderOrder = 1003;
    targetGroup.add(meshBack);
  };

  // 1. CZYSZCZENIE BUFORÓW I GEOMETRII (Twój obecny kod)
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

  // =========================================================================
  // 🔄 TUTAJ ZNAJDUJE SIĘ TWÓJ ISTNIEJĄCY KOD ODBUDOWYWANIA SCENY (REBUILD)
  // (Pętla typu plan.forEach(item => { ... }) generująca ramy na nowo)
  // =========================================================================


  // ═════════════════════════════════════════════════════════════════════════
  // 🔥 KROK 2: Automatyczna kontrola widoczności anatomii wewnętrznej SEGO
  // ═════════════════════════════════════════════════════════════════════════
  if (typeof scene !== 'undefined' && scene) {
    scene.traverse(obj => {
      if (obj.userData && obj.userData.isInternalAnatomy) {
        obj.visible = (typeof showDimensions !== 'undefined' && showDimensions);
      }
      if (obj.userData && obj.userData.isModuleListOverlay) {
        obj.visible = (typeof showModuleListMode !== 'undefined' && showModuleListMode);
      }
    });
  }
  ;

  sceneObjects = [];
  window.activeLedMaterials = [];
  let globalElevationY = 0;

  if (currentSystem === 'mframe_pallet') {
    if (typeof drawMframePalletScene === 'function') drawMframePalletScene();
    return;
  }

  if (currentSystem === 'kasetony_niestandardowe') {
    if (isBlueprintMode) {
      scene.background = new THREE.Color(0x0a1a35);
      scene.fog = null;
    } else {
      scene.background = new THREE.Color(0x333333);
    }
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
      ledMat.userData = { isRgbLed: true };
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

  // Sort walls and daszek parts to assign letters A-Z logically from left to right (along X-axis)
  const modules = [];
  computed3DData.forEach(item => {
    if (item.type === 'wall') {
      modules.push({
        item: item,
        part: 'wall',
        cx: item.cx
      });
    } else if (item.type === 'daszek') {
      const rot = -item.angle * Math.PI / 180;
      // Roof part (center z_local = 131)
      modules.push({
        item: item,
        part: 'roof',
        cx: item.cx + 131 * Math.sin(rot)
      });
      // Leg part (center z_local = 262)
      modules.push({
        item: item,
        part: 'leg',
        cx: item.cx + 262 * Math.sin(rot)
      });
    }
  });

  // Sort modules by cx (left to right)
  modules.sort((a, b) => a.cx - b.cx);

  // Assign letters A-Z
  const wallLetters = new Map();
  modules.forEach((mod, index) => {
    const letter = String.fromCharCode(65 + (mod.index !== undefined ? mod.index : index) % 26); // A-Z
    if (mod.part === 'wall') {
      wallLetters.set(mod.item, letter);
    } else {
      wallLetters.set(mod.item.planIndex + '_' + mod.part, letter);
    }
  });

  window.wallLetters = wallLetters;
  window.assignedModulesList = modules;

  computed3DData.forEach(item => {
    if (item.type === 'wall') {
      const moduleLetter = wallLetters.get(item);
      const group = new THREE.Group();
      group.position.set(item.cx, globalElevationY + (item.elevation || 0), item.cz);
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
        if (item.leftFoot !== false) {
          const fL = new THREE.Mesh(footG, footM); fL.position.set(-len / 2 + th / 2, 0.3, 0);
          frameGroup.add(fL);
        }
        if (item.rightFoot !== false) {
          const fR = new THREE.Mesh(footG, footM); fR.position.set(len / 2 - th / 2, 0.3, 0);
          frameGroup.add(fR);
        }

        let existingPlane = foldablePlanes.find(p => Math.abs(p.angle - item.angle) < 1 && p.walls.some(w => Math.sqrt(Math.pow(w.cx - item.cx, 2) + Math.pow(w.cz - item.cz, 2)) <= item.length + 15));
        if (existingPlane) {
          existingPlane.walls.push(item);
        } else {
          foldablePlanes.push({ angle: item.angle, walls: [item] });
        }
        group.add(frameGroup);
      }
      else {
        const wDim = (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? item.length - 0.2 : item.length;
        const hDim = (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? item.height - 0.2 : item.height;
        const dDim = (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? 11.8 : 12;
        const geom = new THREE.BoxGeometry(wDim, hDim, dDim);
        let hexColor = item.isDoor ? 0x004466 : 0x999999;

        // POPRAWKA: frameMat reaguje teraz na tryb Blueprint (staje się półprzezroczysty, by odsłonić supporty)
        const frameMat = new THREE.MeshStandardMaterial({
          color: isBlueprintMode ? 0x4488ff : hexColor,
          metalness: 0.7,
          roughness: 0.2,
          transparent: isBlueprintMode,
          opacity: isBlueprintMode ? 0.2 : 1.0
        });

        const texLoader = new THREE.TextureLoader();
        const getWallMat = (texUrl) => {
          if (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) return new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
          
          let mat;
          const baseIntensity = typeof currentLedIntensity !== 'undefined' ? currentLedIntensity : 1.5;
          const baseEmissiveColor = typeof currentLedColor !== 'undefined' ? new THREE.Color(currentLedColor) : new THREE.Color(0xffffff);

          if (!texUrl) {
            mat = new THREE.MeshStandardMaterial({ 
              color: 0xffffff, 
              roughness: 1.0,
              metalness: 0.0,
              emissive: baseEmissiveColor,
              emissiveIntensity: baseIntensity * 0.15
            });
          } else {
            let tex = texLoader.load(texUrl);
            tex.encoding = THREE.sRGBEncoding;
            mat = new THREE.MeshStandardMaterial({ 
              map: tex, 
              roughness: 1.0,
              metalness: 0.0,
              emissive: baseEmissiveColor,
              emissiveMap: tex,
              emissiveIntensity: baseIntensity * 0.6
            });
          }

          if (window.activeLedMaterials) {
            window.activeLedMaterials.push(mat);
          }
          return mat;
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

          // POPRAWKA: Dynamiczne generowanie wewnętrznych rur i krzyżaków MP w trybie inżynieryjnym
          // ═════════════════════════════════════════════════════════════════════════
          // 🔥 NOWOŚĆ: Wywołanie zaawansowanej geometrii anatomii wewnętrznej SEGO
          // ═════════════════════════════════════════════════════════════════════════
          if (typeof currentSystem !== 'undefined' && (currentSystem === 'SEGO' || currentSystem === 'SEGO_2_0')) {
            buildSegoInternalAnatomy(item, group);
          }
        }

        if (item.quadIdx === undefined) {
          const footG = new THREE.BoxGeometry(6, 0.6, 40);
          const footM = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.5 });
          const th = item.thickness || 12;
          const len = item.length;
          
          if (item.leftFoot !== false && !item.elevation && !item.isStacked) {
            const fL = new THREE.Mesh(footG, footM);
            fL.position.set(-len / 2 + th / 2, 0.3, 0);
            group.add(fL);
          }
          if (item.rightFoot !== false && !item.elevation && !item.isStacked) {
            const fR = new THREE.Mesh(footG, footM);
            fR.position.set(len / 2 - th / 2, 0.3, 0);
            group.add(fR);
          }
        }
      }

      // ─────────────────────────────────────────────────────────────────
      // BLOK ETYKIETOWANIA I GENEROWANIA MIAR (Niezmieniony potok)
      // ─────────────────────────────────────────────────────────────────
      const labelCol = (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? "#8bb3ff" : "#ffffff";
      let labelText = item.labelEN || item.name;
      if (typeof isBlueprintMode !== 'undefined' && isBlueprintMode && moduleLetter) {
        labelText = `[Moduł ${moduleLetter}] ` + labelText;
      }
      const labelSprite = createTextSprite(labelText, labelCol, 16);
      labelSprite.position.set(0, item.height + 25, 0);
      group.add(labelSprite);
      group.add(createLeaderLine(item.height, item.height + 15, 0));

      if (typeof showDimensions !== 'undefined' && showDimensions) {
        const p1W = new THREE.Vector3(-item.length / 2, 0, 0);
        const p2W = new THREE.Vector3(item.length / 2, 0, 0);
        group.add(addDimension3D(p1W, p2W, `${item.length} cm`, new THREE.Vector3(0, -25, 0), 0.5));
      }

      if (moduleLetter) {
        addModuleLetterMesh(moduleLetter, group, 40, item.thickness || (item.isFoldable ? 4.5 : 12));
        addModuleOverlayMesh(moduleLetter, `${item.length}x${item.height} cm`, group, item.height / 2, item.thickness || (item.isFoldable ? 4.5 : 12));
      }

      scene.add(group);
      sceneObjects.push(group);
    }
    else if (item.type === 'daszek') {
      const group = new THREE.Group();
      group.position.set(item.cx, globalElevationY, item.cz);
      group.rotation.y = -item.angle * Math.PI / 180;

      const legHeight = item.wallHeight;
      const frameMat = new THREE.MeshStandardMaterial({
        color: isBlueprintMode ? 0x4488ff : 0x999999,
        metalness: 0.7,
        roughness: 0.2,
        transparent: isBlueprintMode,
        opacity: isBlueprintMode ? 0.2 : 1.0
      });
      const texLoader = new THREE.TextureLoader();

      const getMat = (texUrl) => {
        if (isBlueprintMode) return new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
        
        let mat;
        const baseIntensity = typeof currentLedIntensity !== 'undefined' ? currentLedIntensity : 1.5;
        const baseEmissiveColor = typeof currentLedColor !== 'undefined' ? new THREE.Color(currentLedColor) : new THREE.Color(0xffffff);

        if (!texUrl) {
          mat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor, 
            emissiveIntensity: baseIntensity * 0.15 
          });
        } else {
          let tex = texLoader.load(texUrl);
          tex.encoding = THREE.sRGBEncoding;
          mat = new THREE.MeshStandardMaterial({ 
            map: tex, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor, 
            emissiveMap: tex, 
            emissiveIntensity: baseIntensity * 0.6 
          });
        }

        if (window.activeLedMaterials) {
          window.activeLedMaterials.push(mat);
        }
        return mat;
      };

      const roofLen = (item.accData && item.accData.roofLength) ? item.accData.roofLength : 250;
      const roofZ = (roofLen / 2) + 6;
      const legZ = roofLen + 12;

      const roofGeom = new THREE.BoxGeometry(100, roofLen, 12);
      const roofMesh = new THREE.Mesh(roofGeom, [frameMat, frameMat, frameMat, frameMat, getMat(item.accData.texRoofFront), getMat(item.accData.texRoofBack)]);
      roofMesh.rotation.x = -Math.PI / 2; roofMesh.position.set(0, item.wallHeight - 6, roofZ);
      roofMesh.userData = { isDaszekPart: true, planIndex: item.planIndex, accIdx: item.accIndex, part: 'Roof' };
      roofMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(roofGeom), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })));
      group.add(roofMesh);

      const legGeom = new THREE.BoxGeometry(100, legHeight, 12);
      const legMesh = new THREE.Mesh(legGeom, [frameMat, frameMat, frameMat, frameMat, getMat(item.accData.texLegFront), getMat(item.accData.texLegBack)]);
      legMesh.position.set(0, legHeight / 2, legZ);
      legMesh.userData = { isDaszekPart: true, planIndex: item.planIndex, accIdx: item.accIndex, part: 'Leg' };
      legMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(legGeom), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })));
      group.add(legMesh);

      // Pobranie liter modułów dla dachu i nogi
      const roofLetter = wallLetters.get(item.planIndex + '_roof');
      const legLetter = wallLetters.get(item.planIndex + '_leg');

      if (roofLetter) {
        addModuleOverlayMesh(roofLetter, `100x${roofLen} cm`, roofMesh, 0, 12);
      }
      if (legLetter) {
        addModuleOverlayMesh(legLetter, `100x${legHeight} cm`, legMesh, 0, 12);
      }

      // Wstrzyknięcie anatomii wewnętrznej SEGO (rozpórki, ledy, duży napis wymiarowy)
      if (typeof currentSystem !== 'undefined' && (currentSystem === 'SEGO' || currentSystem === 'SEGO_2_0')) {
        // Anatomia pionowej Nogi (Leg)
        const legGroup = new THREE.Group();
        legGroup.position.set(0, 0, legZ);
        buildSegoInternalAnatomy({ length: 100, height: legHeight }, legGroup);
        if (legLetter) {
          addModuleLetterMesh(legLetter, legGroup, 40, 12);
        }
        group.add(legGroup);

        // Anatomia poziomego Dachu (Roof)
        const roofGroup = new THREE.Group();
        roofGroup.position.set(0, item.wallHeight - 6, roofZ);
        roofGroup.rotation.x = -Math.PI / 2;

        const roofAnatomySubGroup = new THREE.Group();
        roofAnatomySubGroup.position.set(0, -roofLen / 2, 0); // Przesunięcie o połowę długości, aby wycentrować anatomię
        buildSegoInternalAnatomy({ length: 100, height: roofLen }, roofAnatomySubGroup);
        if (roofLetter) {
          addModuleLetterMesh(roofLetter, roofAnatomySubGroup, 40, 12);
        }
        roofGroup.add(roofAnatomySubGroup);
        group.add(roofGroup);
      }

      // Etykieta tekstowa daszka z oznaczeniem modułów
      let labelText = item.labelEN || "Daszek";
      if (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) {
        if (roofLetter && legLetter) {
          labelText = `[Moduł ${roofLetter}/${legLetter}] ` + labelText;
        } else if (roofLetter) {
          labelText = `[Moduł ${roofLetter}] ` + labelText;
        }
      }
      const labelCol = (typeof isBlueprintMode !== 'undefined' && isBlueprintMode) ? "#8bb3ff" : "#ffffff";
      const labelSprite = createTextSprite(labelText, labelCol, 16);
      labelSprite.position.set(0, item.wallHeight + 40, 131);
      group.add(labelSprite);
      group.add(createLeaderLine(item.wallHeight + 12, item.wallHeight + 30, 131));
      scene.add(group); sceneObjects.push(group);
    }
    else if (item.type === 'accessory') {
      const isTV = item.id === 'tvPanel';
      const group = new THREE.Group();
      group.position.set(item.cx, globalElevationY, item.cz);
      group.rotation.y = -item.wallAngle * Math.PI / 180;

      let color = isTV ? 0xffcc00 : 0xff9900;
      if (item.hasCollision) {
        color = 0xff0000;
      }
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(80, isTV ? 50 : 5, isTV ? 5 : 25), new THREE.MeshStandardMaterial({ color: color }));
      let zOffset = (item.dir === 1 ? 1 : -1) * (6 + (isTV ? 2.5 : 12.5));

      let yPos = item.wallHeight / 2;
      if (item.accData.heightCm !== undefined) {
        yPos = item.accData.heightCm;
      } else if (item.accData.heightPct !== undefined) {
        yPos = item.wallHeight * (item.accData.heightPct / 100);
      } else if (item.accData.slot === 1) {
        yPos = item.wallHeight * 0.33;
      } else if (item.accData.slot === 3) {
        yPos = item.wallHeight * 0.66;
      }

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
        
        let mat;
        const baseIntensity = typeof currentLedIntensity !== 'undefined' ? currentLedIntensity : 1.5;
        const baseEmissiveColor = typeof currentLedColor !== 'undefined' ? new THREE.Color(currentLedColor) : new THREE.Color(0xffffff);

        if (!texUrl) {
          mat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor, 
            emissiveIntensity: baseIntensity * 0.15 
          });
        } else {
          let tex = texLoader.load(texUrl);
          tex.encoding = THREE.sRGBEncoding;
          mat = new THREE.MeshStandardMaterial({ 
            map: tex, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor, 
            emissiveMap: tex, 
            emissiveIntensity: baseIntensity * 0.6 
          });
        }

        if (window.activeLedMaterials) {
          window.activeLedMaterials.push(mat);
        }
        return mat;
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
        
        let mat;
        const baseIntensity = typeof currentLedIntensity !== 'undefined' ? currentLedIntensity : 1.5;
        const baseEmissiveColor = typeof currentLedColor !== 'undefined' ? new THREE.Color(currentLedColor) : new THREE.Color(0xffffff);

        if (!texUrl) {
          mat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor, 
            emissiveIntensity: baseIntensity * 0.15 
          });
        } else {
          let tex = texLoader.load(texUrl);
          tex.encoding = THREE.sRGBEncoding;
          mat = new THREE.MeshStandardMaterial({ 
            map: tex, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor, 
            emissiveMap: tex, 
            emissiveIntensity: baseIntensity * 0.6 
          });
        }

        if (window.activeLedMaterials) {
          window.activeLedMaterials.push(mat);
        }
        return mat;
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
          
          let mat;
          const baseIntensity = typeof currentLedIntensity !== 'undefined' ? currentLedIntensity : 1.5;
          const baseEmissiveColor = typeof currentLedColor !== 'undefined' ? new THREE.Color(currentLedColor) : new THREE.Color(0xffffff);

          if (!texUrl) {
            mat = new THREE.MeshStandardMaterial({ 
              color: 0xffffff, 
              roughness: 1.0, 
              metalness: 0.0,
              emissive: baseEmissiveColor, 
              emissiveIntensity: baseIntensity * 0.15 
            });
          } else {
            let tex = texLoader.load(texUrl);
            tex.encoding = THREE.sRGBEncoding;
            mat = new THREE.MeshStandardMaterial({ 
              map: tex, 
              roughness: 1.0, 
              metalness: 0.0,
              emissive: baseEmissiveColor, 
              emissiveMap: tex, 
              emissiveIntensity: baseIntensity * 0.6 
            });
          }

          if (window.activeLedMaterials) {
            window.activeLedMaterials.push(mat);
          }
          return mat;
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
        const baseIntensity = typeof currentLedIntensity !== 'undefined' ? currentLedIntensity : 1.5;
        const baseEmissiveColor = typeof currentLedColor !== 'undefined' ? new THREE.Color(currentLedColor) : new THREE.Color(0xffffff);

        if (isBlueprintMode) {
          mat = new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.1 });
        } else if (tData) {
          let tex = texLoader.load(tData); if (!isOut) { tex.wrapS = THREE.RepeatWrapping; tex.repeat.x = -1; }
          mat = new THREE.MeshStandardMaterial({ 
            map: tex, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor, 
            emissiveMap: tex, 
            emissiveIntensity: baseIntensity * 0.6, 
            side: isOut ? THREE.FrontSide : THREE.BackSide, 
            transparent: true, 
            alphaTest: 0.1 
          });
          if (window.activeLedMaterials) window.activeLedMaterials.push(mat);
        } else {
          mat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            roughness: 1.0, 
            metalness: 0.0,
            emissive: baseEmissiveColor,
            emissiveIntensity: baseIntensity * 0.15,
            side: isOut ? THREE.FrontSide : THREE.BackSide 
          });
          if (window.activeLedMaterials) window.activeLedMaterials.push(mat);
        }

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
    else if (item.type === 'table_chairs') {
      const group = new THREE.Group();
      group.position.set(item.cx, globalElevationY, item.cz);
      group.rotation.y = -(item.rotation || 0) * Math.PI / 180;
      
      const woodColor = 0xd7a15c;
      const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.6, metalness: 0.1 });
      const metalMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.8 });
      const whitePlasticMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.1 });

      const tableGroup = new THREE.Group();
      
      const tabletopGeom = new THREE.CylinderGeometry(40, 40, 3, 32);
      const tabletopMesh = new THREE.Mesh(tabletopGeom, whitePlasticMat);
      tabletopMesh.position.set(0, 73.5, 0);
      tabletopMesh.castShadow = true;
      tabletopMesh.receiveShadow = true;
      tableGroup.add(tabletopMesh);
      
      const bracketX = new THREE.Mesh(new THREE.BoxGeometry(30, 1.5, 4), metalMat);
      bracketX.position.set(0, 71.25, 0);
      const bracketZ = new THREE.Mesh(new THREE.BoxGeometry(4, 1.5, 30), metalMat);
      bracketZ.position.set(0, 71.25, 0);
      tableGroup.add(bracketX, bracketZ);

      const createLeg = (startX, startZ, endX, endZ, height, legRadius, legMat) => {
        const midX = (startX + endX) / 2;
        const midZ = (startZ + endZ) / 2;
        const dx = endX - startX;
        const dz = endZ - startZ;
        const dist2D = Math.sqrt(dx*dx + dz*dz);
        const legLen = Math.sqrt(dist2D*dist2D + height*height);
        
        const legGeom = new THREE.CylinderGeometry(legRadius * 0.6, legRadius, legLen, 16);
        const legMesh = new THREE.Mesh(legGeom, legMat);
        legMesh.castShadow = true;
        legMesh.position.set(midX, height / 2, midZ);
        
        const pitchAngle = Math.atan2(dist2D, height);
        const yawAngle = Math.atan2(dx, dz);
        
        legMesh.rotation.set(0, yawAngle, 0);
        legMesh.rotateX(-pitchAngle);
        
        return legMesh;
      };
      
      tableGroup.add(createLeg(10, 10, 18, 18, 71.25, 2.2, woodMat));
      tableGroup.add(createLeg(-10, 10, -18, 18, 71.25, 2.2, woodMat));
      tableGroup.add(createLeg(10, -10, 18, -18, 71.25, 2.2, woodMat));
      tableGroup.add(createLeg(-10, -10, -18, -18, 71.25, 2.2, woodMat));

      const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire1.position.set(0, 36, 14);
      wire1.rotation.z = Math.PI / 4;
      tableGroup.add(wire1);
      
      const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire2.position.set(0, 36, 14);
      wire2.rotation.z = -Math.PI / 4;
      tableGroup.add(wire2);

      const wire3 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire3.position.set(0, 36, -14);
      wire3.rotation.z = Math.PI / 4;
      tableGroup.add(wire3);
      
      const wire4 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire4.position.set(0, 36, -14);
      wire4.rotation.z = -Math.PI / 4;
      tableGroup.add(wire4);

      const wire5 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire5.position.set(-14, 36, 0);
      wire5.rotation.x = Math.PI / 4;
      tableGroup.add(wire5);
      
      const wire6 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire6.position.set(-14, 36, 0);
      wire6.rotation.x = -Math.PI / 4;
      tableGroup.add(wire6);

      const wire7 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire7.position.set(14, 36, 0);
      wire7.rotation.x = Math.PI / 4;
      tableGroup.add(wire7);
      
      const wire8 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), metalMat);
      wire8.position.set(14, 36, 0);
      wire8.rotation.x = -Math.PI / 4;
      tableGroup.add(wire8);

      group.add(tableGroup);

      const angles = [0, 120, 240];
      angles.forEach(angDeg => {
        const chairGroup = new THREE.Group();
        const angRad = angDeg * Math.PI / 180;
        
        chairGroup.position.set(60 * Math.sin(angRad), 0, 60 * Math.cos(angRad));
        chairGroup.rotation.y = angRad;
        
        chairGroup.add(createLeg(5, 5, 9, 9, 43, 1.2, woodMat));
        chairGroup.add(createLeg(-5, 5, -9, 9, 43, 1.2, woodMat));
        chairGroup.add(createLeg(5, -5, 9, -9, 43, 1.2, woodMat));
        chairGroup.add(createLeg(-5, -5, -9, -9, 43, 1.2, woodMat));

        const chairWire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 15), metalMat);
        chairWire1.position.set(0, 22, 7);
        chairWire1.rotation.z = Math.PI / 4;
        chairGroup.add(chairWire1);
        
        const chairWire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 15), metalMat);
        chairWire2.position.set(0, 22, 7);
        chairWire2.rotation.z = -Math.PI / 4;
        chairGroup.add(chairWire2);
        
        const chairWire3 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 15), metalMat);
        chairWire3.position.set(0, 22, -7);
        chairWire3.rotation.z = Math.PI / 4;
        chairGroup.add(chairWire3);
        
        const chairWire4 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 15), metalMat);
        chairWire4.position.set(0, 22, -7);
        chairWire4.rotation.z = -Math.PI / 4;
        chairGroup.add(chairWire4);

        const seatGroup = new THREE.Group();
        seatGroup.position.set(0, 44, 0);
        
        // 1. Rounded Seat Base Shape
        const seatShape = new THREE.Shape();
        const sw = 38, sd = 38, sr = 6;
        seatShape.moveTo(-sw/2 + sr, -sd/2);
        seatShape.lineTo(sw/2 - sr, -sd/2);
        seatShape.quadraticCurveTo(sw/2, -sd/2, sw/2, -sd/2 + sr);
        seatShape.lineTo(sw/2, sd/2 - sr);
        seatShape.quadraticCurveTo(sw/2, sd/2, sw/2 - sr, sd/2);
        seatShape.lineTo(-sw/2 + sr, sd/2);
        seatShape.quadraticCurveTo(-sw/2, sd/2, -sw/2, sd/2 - sr);
        seatShape.lineTo(-sw/2, -sd/2 + sr);
        seatShape.quadraticCurveTo(-sw/2, -sd/2, -sw/2 + sr, -sd/2);

        const seatBaseGeom = new THREE.ExtrudeGeometry(seatShape, {
          depth: 1.2,
          bevelEnabled: true,
          bevelThickness: 0.4,
          bevelSize: 0.4,
          bevelSegments: 3
        });
        const seatBase = new THREE.Mesh(seatBaseGeom, whitePlasticMat);
        seatBase.castShadow = true;
        seatBase.receiveShadow = true;
        seatBase.rotation.x = Math.PI / 2;
        seatBase.position.set(0, 0.8, 0);
        seatGroup.add(seatBase);
        
        // 2. Rounded Backrest Shape (Trapezoidal with rounded top corners)
        const backShape = new THREE.Shape();
        const bw = 38, tw = 28, bh = 38, br = 6;
        backShape.moveTo(-bw/2, 0);
        backShape.lineTo(bw/2, 0);
        backShape.lineTo(tw/2, bh - br);
        backShape.quadraticCurveTo(tw/2, bh, tw/2 - br, bh);
        backShape.lineTo(-tw/2 + br, bh);
        backShape.quadraticCurveTo(-tw/2, bh, -tw/2, bh - br);
        backShape.lineTo(-bw/2, 0);

        const backGeom = new THREE.ExtrudeGeometry(backShape, {
          depth: 1.0,
          bevelEnabled: true,
          bevelThickness: 0.4,
          bevelSize: 0.4,
          bevelSegments: 3
        });
        const backrest = new THREE.Mesh(backGeom, whitePlasticMat);
        backrest.castShadow = true;
        backrest.receiveShadow = true;
        backrest.position.set(0, 0, 17);
        backrest.rotation.x = 15 * Math.PI / 180;
        seatGroup.add(backrest);

        // 3. Rounded Side Wings
        const wingShape = new THREE.Shape();
        const wl = 34, wh = 8, wr = 4;
        wingShape.moveTo(-wl/2, 0);
        wingShape.lineTo(wl/2, 0);
        wingShape.quadraticCurveTo(wl/2, wh, wl/2 - wr, wh);
        wingShape.lineTo(-wl/2 + wr, wh);
        wingShape.quadraticCurveTo(-wl/2, wh, -wl/2, 0);

        const wingGeom = new THREE.ExtrudeGeometry(wingShape, {
          depth: 1.0,
          bevelEnabled: true,
          bevelThickness: 0.3,
          bevelSize: 0.3,
          bevelSegments: 3
        });

        const leftWing = new THREE.Mesh(wingGeom, whitePlasticMat);
        leftWing.castShadow = true;
        leftWing.receiveShadow = true;
        leftWing.position.set(-18, 0.8, 0);
        leftWing.rotation.y = Math.PI / 2;
        leftWing.rotateX(8 * Math.PI / 180);
        seatGroup.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeom, whitePlasticMat);
        rightWing.castShadow = true;
        rightWing.receiveShadow = true;
        rightWing.position.set(18, 0.8, 0);
        rightWing.rotation.y = Math.PI / 2;
        rightWing.rotateX(-8 * Math.PI / 180);
        seatGroup.add(rightWing);

        // 4. Soft Rounded Cushion
        const cushionShape = new THREE.Shape();
        const cw = 34, cd = 34, cr = 6;
        cushionShape.moveTo(-cw/2 + cr, -cd/2);
        cushionShape.lineTo(cw/2 - cr, -cd/2);
        cushionShape.quadraticCurveTo(cw/2, -cd/2, cw/2, -cd/2 + cr);
        cushionShape.lineTo(cw/2, cd/2 - cr);
        cushionShape.quadraticCurveTo(cw/2, cd/2, cw/2 - cr, cd/2);
        cushionShape.lineTo(-cw/2 + cr, cd/2);
        cushionShape.quadraticCurveTo(-cw/2, cd/2, -cw/2, cd/2 - cr);
        cushionShape.lineTo(-cw/2, -cd/2 + cr);
        cushionShape.quadraticCurveTo(-cw/2, -cd/2, -cw/2 + cr, -cd/2);

        const cushionGeom = new THREE.ExtrudeGeometry(cushionShape, {
          depth: 0.8,
          bevelEnabled: true,
          bevelThickness: 0.5,
          bevelSize: 0.5,
          bevelSegments: 3
        });
        const cushion = new THREE.Mesh(cushionGeom, new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.8 }));
        cushion.castShadow = true;
        cushion.receiveShadow = true;
        cushion.rotation.x = Math.PI / 2;
        cushion.position.set(0, 1.8, -1);
        seatGroup.add(cushion);

        chairGroup.add(seatGroup);
        group.add(chairGroup);
      });

      const labelSprite = createTextSprite(item.labelEN || item.name);
      labelSprite.position.set(0, 75 + 40, 0);
      group.add(labelSprite);
      group.add(createLeaderLine(75, 75 + 30, 0));

      scene.add(group);
      sceneObjects.push(group);
    }
    else if (item.type === 'potted_plant') {
      const group = new THREE.Group();
      group.position.set(item.cx, globalElevationY, item.cz);
      group.rotation.y = -(item.rotation || 0) * Math.PI / 180;

      // --- Leaf texture with veins, dark edges, lighter center ---
      function createLeafTexture(baseR, baseG, baseB) {
        const c = document.createElement('canvas');
        c.width = 128; c.height = 64;
        const ctx = c.getContext('2d');

        // Gradient: darker edges, lighter center
        const grad = ctx.createLinearGradient(0, 0, 0, 64);
        grad.addColorStop(0, `rgb(${Math.max(0,baseR-30)},${Math.max(0,baseG-20)},${Math.max(0,baseB-20)})`);
        grad.addColorStop(0.35, `rgb(${baseR+15},${baseG+25},${baseB+10})`);
        grad.addColorStop(0.5, `rgb(${baseR+25},${baseG+40},${baseB+15})`);
        grad.addColorStop(0.65, `rgb(${baseR+15},${baseG+25},${baseB+10})`);
        grad.addColorStop(1, `rgb(${Math.max(0,baseR-30)},${Math.max(0,baseG-20)},${Math.max(0,baseB-20)})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 64);

        // Central vein (midrib)
        ctx.strokeStyle = `rgba(${Math.max(0,baseR-50)},${Math.max(0,baseG-30)},${Math.max(0,baseB-30)}, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.lineTo(128, 32);
        ctx.stroke();

        // Secondary veins branching from center
        ctx.strokeStyle = `rgba(${Math.max(0,baseR-40)},${Math.max(0,baseG-20)},${Math.max(0,baseB-20)}, 0.35)`;
        ctx.lineWidth = 0.8;
        for (let v = 10; v < 125; v += 8 + Math.random() * 6) {
          ctx.beginPath();
          ctx.moveTo(v, 32);
          ctx.lineTo(v + 8, 10 + Math.random() * 8);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(v, 32);
          ctx.lineTo(v + 8, 46 + Math.random() * 8);
          ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
      }

      // --- Materials ---
      const potMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x6B5B3A, roughness: 1.0, metalness: 0 });
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5A7A1A, roughness: 0.85, metalness: 0 });
      const pebbleMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5, metalness: 0.1 });

      // Leaf materials with veins — dark and medium green variants
      const leafTexDark = createLeafTexture(20, 90, 20);
      const leafTexMed = createLeafTexture(30, 110, 25);
      const leafTexLight = createLeafTexture(40, 130, 30);
      const leafMatDark = new THREE.MeshStandardMaterial({ map: leafTexDark, roughness: 0.55, metalness: 0, side: THREE.DoubleSide });
      const leafMatMed = new THREE.MeshStandardMaterial({ map: leafTexMed, roughness: 0.55, metalness: 0, side: THREE.DoubleSide });
      const leafMatLight = new THREE.MeshStandardMaterial({ map: leafTexLight, roughness: 0.55, metalness: 0, side: THREE.DoubleSide });
      const leafMats = [leafMatDark, leafMatDark, leafMatMed, leafMatMed, leafMatLight];

      // --- White square pot (30x30x30 cm) ---
      const potH = 30, potW = 30;
      const potShape = new THREE.Shape();
      const pr = 2;
      potShape.moveTo(-potW/2 + pr, 0);
      potShape.lineTo(potW/2 - pr, 0);
      potShape.quadraticCurveTo(potW/2, 0, potW/2, pr);
      potShape.lineTo(potW/2, potH - pr);
      potShape.quadraticCurveTo(potW/2, potH, potW/2 - pr, potH);
      potShape.lineTo(-potW/2 + pr, potH);
      potShape.quadraticCurveTo(-potW/2, potH, -potW/2, potH - pr);
      potShape.lineTo(-potW/2, pr);
      potShape.quadraticCurveTo(-potW/2, 0, -potW/2 + pr, 0);

      const potGeom = new THREE.ExtrudeGeometry(potShape, { depth: potW, bevelEnabled: false });
      const potMesh = new THREE.Mesh(potGeom, potMat);
      potMesh.castShadow = true;
      potMesh.receiveShadow = true;
      potMesh.rotation.x = -Math.PI / 2;
      potMesh.position.set(0, 0, potW / 2);
      group.add(potMesh);

      // Soil — raised above pot rim to avoid z-fighting
      const soilGeom = new THREE.BoxGeometry(potW - 3, 3, potW - 3);
      const soilMesh = new THREE.Mesh(soilGeom, soilMat);
      soilMesh.position.set(0, potH + 0.5, 0);
      soilMesh.receiveShadow = true;
      group.add(soilMesh);

      // Decorative white pebbles on soil
      for (let p = 0; p < 15; p++) {
        const pebGeom = new THREE.SphereGeometry(1 + Math.random() * 1.5, 8, 6);
        const peb = new THREE.Mesh(pebGeom, pebbleMat);
        peb.position.set(
          (Math.random() - 0.5) * (potW - 8),
          potH + 2,
          (Math.random() - 0.5) * (potW - 8)
        );
        peb.scale.y = 0.5;
        peb.castShadow = true;
        group.add(peb);
      }

      // --- Helper: create a single palm frond ---
      function createFrond(fLen, fWidth) {
        const s = new THREE.Shape();
        s.moveTo(0, 0);
        s.quadraticCurveTo(fLen * 0.25, fWidth, fLen * 0.5, fWidth * 0.8);
        s.quadraticCurveTo(fLen * 0.75, fWidth * 0.4, fLen, 0);
        s.quadraticCurveTo(fLen * 0.75, -fWidth * 0.4, fLen * 0.5, -fWidth * 0.8);
        s.quadraticCurveTo(fLen * 0.25, -fWidth, 0, 0);
        return new THREE.ShapeGeometry(s);
      }

      // --- Palm stems with drooping + upward fronds ---
      const stemCount = 6;
      for (let s = 0; s < stemCount; s++) {
        const stemAngle = (s / stemCount) * Math.PI * 2 + Math.random() * 0.3;
        const stemLean = 0.06 + Math.random() * 0.14;
        const stemH = 45 + Math.random() * 35;
        const stemR = 0.8 + Math.random() * 0.5;

        const stemGeom = new THREE.CylinderGeometry(stemR * 0.5, stemR, stemH, 8);
        const stemMesh = new THREE.Mesh(stemGeom, trunkMat);
        const stemX = Math.cos(stemAngle) * 5;
        const stemZ = Math.sin(stemAngle) * 5;
        stemMesh.position.set(stemX, potH + stemH / 2, stemZ);
        stemMesh.rotation.x = Math.cos(stemAngle) * stemLean;
        stemMesh.rotation.z = -Math.sin(stemAngle) * stemLean;
        stemMesh.castShadow = true;
        group.add(stemMesh);

        const topY = potH + stemH;
        const topX = stemX;
        const topZ = stemZ;

        // A) Drooping fronds (outward and down) — the classic palm look
        const droopCount = 5 + Math.floor(Math.random() * 3);
        for (let f = 0; f < droopCount; f++) {
          const fAngle = (f / droopCount) * Math.PI * 2 + Math.random() * 0.6;
          const fLen = 28 + Math.random() * 22;
          const fDroop = 0.35 + Math.random() * 0.55;

          const geom = createFrond(fLen, 2.5 + Math.random());
          const mat = leafMats[Math.floor(Math.random() * leafMats.length)];
          const mesh = new THREE.Mesh(geom, mat);
          mesh.castShadow = true;
          mesh.position.set(topX, topY, topZ);
          mesh.rotation.y = fAngle;
          mesh.rotation.z = -fDroop;
          mesh.rotation.x = (Math.random() - 0.5) * 0.25;
          group.add(mesh);
        }

        // B) Upward fronds (pointing up at various angles) — makes it bushy
        const upCount = 3 + Math.floor(Math.random() * 3);
        for (let u = 0; u < upCount; u++) {
          const uAngle = (u / upCount) * Math.PI * 2 + Math.random() * 0.8;
          const uLen = 18 + Math.random() * 15;
          const uLift = 0.15 + Math.random() * 0.45;

          const geom = createFrond(uLen, 2 + Math.random() * 0.8);
          const mat = leafMats[Math.floor(Math.random() * leafMats.length)];
          const mesh = new THREE.Mesh(geom, mat);
          mesh.castShadow = true;
          mesh.position.set(topX, topY + 2, topZ);
          mesh.rotation.y = uAngle;
          mesh.rotation.z = uLift;  // positive = upward tilt
          mesh.rotation.x = (Math.random() - 0.5) * 0.3;
          group.add(mesh);
        }
      }

      // C) Extra central upward burst — tall young leaves in the center
      for (let c = 0; c < 5; c++) {
        const cAngle = (c / 5) * Math.PI * 2 + Math.random() * 0.5;
        const cLen = 12 + Math.random() * 10;
        const cLift = 0.6 + Math.random() * 0.5;

        const geom = createFrond(cLen, 1.5 + Math.random() * 0.5);
        const mat = leafMats[Math.floor(Math.random() * leafMats.length)];
        const mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.position.set(0, potH + 75, 0);
        mesh.rotation.y = cAngle;
        mesh.rotation.z = cLift;
        group.add(mesh);
      }

      // Label
      const labelSprite = createTextSprite(item.labelEN || 'Plant');
      labelSprite.position.set(0, 140, 0);
      group.add(labelSprite);
      group.add(createLeaderLine(120, 135, 0));

      scene.add(group);
      sceneObjects.push(group);
    }
    else if (item.type === 'adfolder') {
      const group = new THREE.Group();
      group.position.set(item.cx, globalElevationY, item.cz);
      group.rotation.y = -(item.rotation || 0) * Math.PI / 180;

      // Base
      const baseGeom = new THREE.BoxGeometry(27, 2, 35);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
      const baseMesh = new THREE.Mesh(baseGeom, baseMat);
      baseMesh.position.set(0, 1, 0);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // Scissor rails / X-frames (Left & Right)
      const levelsCount = 3;
      const levelHeight = 123 / levelsCount;
      const D = 30; // depth

      // Material for aluminum struts
      const aluMat = new THREE.MeshStandardMaterial({ color: 0xd0d4d9, metalness: 0.85, roughness: 0.2 });
      
      function createStrut(x, y1, z1, y2, z2) {
        const p1 = new THREE.Vector3(x, y1, z1);
        const p2 = new THREE.Vector3(x, y2, z2);
        const distance = p1.distanceTo(p2);
        const strutGeom = new THREE.CylinderGeometry(0.5, 0.5, distance, 6);
        const strutMesh = new THREE.Mesh(strutGeom, aluMat);
        strutMesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        
        const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
        const alignAxis = new THREE.Vector3(0, 1, 0);
        strutMesh.quaternion.setFromUnitVectors(alignAxis, direction);
        strutMesh.castShadow = true;
        group.add(strutMesh);
      }

      for (let xSide of [-13, 13]) {
        for (let lvl = 0; lvl < levelsCount; lvl++) {
          const y1 = 2 + lvl * levelHeight;
          const y2 = 2 + (lvl + 1) * levelHeight;
          createStrut(xSide, y1, -D/2, y2, D/2);
          createStrut(xSide, y1, D/2, y2, -D/2);
        }
      }

      // Horizontal pins linking sides
      for (let lvl = 0; lvl <= levelsCount; lvl++) {
        const y = 2 + lvl * levelHeight;
        for (let zSide of [-D/2, D/2]) {
          const crossGeom = new THREE.CylinderGeometry(0.4, 0.4, 25.5, 6);
          const crossMesh = new THREE.Mesh(crossGeom, aluMat);
          crossMesh.rotation.z = Math.PI / 2;
          crossMesh.position.set(0, y, zSide);
          crossMesh.castShadow = true;
          group.add(crossMesh);
        }
      }

      // Shelves (6 pockets)
      const shelfCount = 6;
      const shelfSpacing = 110 / (shelfCount - 1);
      const acrylicMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.4, 
        roughness: 0.1, 
        metalness: 0.8,
        side: THREE.DoubleSide 
      });

      for (let s = 0; s < shelfCount; s++) {
        const y = 8 + s * shelfSpacing;
        const isEven = (s % 2 === 0);
        const angle = isEven ? 25 * Math.PI / 180 : -25 * Math.PI / 180;
        const lipZ = isEven ? -14 : 14;

        const shelfGroup = new THREE.Group();
        shelfGroup.position.set(0, y, 0);

        // Shelf board
        const board = new THREE.Mesh(new THREE.BoxGeometry(24, 0.5, 28), acrylicMat);
        board.castShadow = true;
        board.receiveShadow = true;
        shelfGroup.add(board);

        // Metal lip
        const lip = new THREE.Mesh(new THREE.BoxGeometry(24, 1.8, 0.5), aluMat);
        lip.position.set(0, 0.9, lipZ);
        lip.castShadow = true;
        shelfGroup.add(lip);

        shelfGroup.rotation.x = angle;
        group.add(shelfGroup);

        // Add some brochure sheets to some shelves
        if (s === 1 || s === 3 || s === 4) {
          const brColor = s === 1 ? 0x0066cc : (s === 3 ? 0xff4400 : 0x00b359);
          const brochureMat = new THREE.MeshStandardMaterial({ color: brColor, roughness: 0.8 });
          const brochure = new THREE.Mesh(new THREE.BoxGeometry(21, 0.3, 26), brochureMat);
          brochure.position.set(0, 0.4, isEven ? -2 : 2);
          shelfGroup.add(brochure);
        }
      }

      // Label
      const labelSprite = createTextSprite(item.labelEN || 'adFolder A4');
      labelSprite.position.set(0, 145, 0);
      group.add(labelSprite);
      group.add(createLeaderLine(127, 140, 0));

      scene.add(group);
      sceneObjects.push(group);
    }
  });

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

  // ─── OBLICZANIE GRANIC STOISKA 3D (Bounding Box) ───
  let minX3D = Infinity, maxX3D = -Infinity, minZ3D = Infinity, maxZ3D = -Infinity;
  let found3DObjects = false;

  if (Array.isArray(computed3DData) && computed3DData.length > 0) {
    computed3DData.forEach(item => {
      if (!item) return;
      let cx = isFinite(item.cx) ? item.cx : 0;
      let cz = isFinite(item.cz) ? item.cz : 0;

      if (item.type === 'wall' || item.type === 'daszek') {
        found3DObjects = true;
        let len = item.length || 100;
        let rad = -(item.angle || 0) * Math.PI / 180;
        let dx = (len / 2) * Math.cos(rad);
        let dz = (len / 2) * Math.sin(rad);
        let thick = item.thickness || 12;
        let perpX = Math.abs(Math.sin(rad)) * (thick / 2);
        let perpZ = Math.abs(Math.cos(rad)) * (thick / 2);

        let p1x = cx - dx, p1z = cz - dz;
        let p2x = cx + dx, p2z = cz + dz;

        minX3D = Math.min(minX3D, p1x - perpX, p2x - perpX);
        maxX3D = Math.max(maxX3D, p1x + perpX, p2x + perpX);
        minZ3D = Math.min(minZ3D, p1z - perpZ, p2z - perpZ);
        maxZ3D = Math.max(maxZ3D, p1z + perpZ, p2z + perpZ);
      } else if (item.type === 'kantorek_1x1') {
        found3DObjects = true;
        minX3D = Math.min(minX3D, cx - 50);
        maxX3D = Math.max(maxX3D, cx + 50);
        minZ3D = Math.min(minZ3D, cz - 50);
        maxZ3D = Math.max(maxZ3D, cz + 50);
      } else if (item.width || item.length || item.depth || item.diameter) {
        found3DObjects = true;
        let w = item.width || item.length || item.diameter || 100;
        let d = item.depth || item.diameter || 100;
        minX3D = Math.min(minX3D, cx - w / 2);
        maxX3D = Math.max(maxX3D, cx + w / 2);
        minZ3D = Math.min(minZ3D, cz - d / 2);
        maxZ3D = Math.max(maxZ3D, cz + d / 2);
      }
    });
  }

  if (typeof floorConfig !== 'undefined' && floorConfig.type !== 'none' && floorConfig.width > 0 && floorConfig.depth > 0) {
    found3DObjects = true;
    let fx = isFinite(floorConfig.offsetX) ? floorConfig.offsetX : 0;
    let fz = isFinite(floorConfig.offsetY) ? floorConfig.offsetY : 0;
    let fw = floorConfig.width;
    let fd = floorConfig.depth;

    minX3D = minX3D !== Infinity ? Math.min(minX3D, fx - fw / 2) : (fx - fw / 2);
    maxX3D = maxX3D !== -Infinity ? Math.max(maxX3D, fx + fw / 2) : (fx + fw / 2);
    minZ3D = minZ3D !== Infinity ? Math.min(minZ3D, fz - fd / 2) : (fz - fd / 2);
    maxZ3D = maxZ3D !== -Infinity ? Math.max(maxZ3D, fz + fd / 2) : (fz + fd / 2);
  }

  const hasWalls3D = Array.isArray(computed3DData) && computed3DData.some(item => item && item.type === 'wall');

  // ─── GENEROWANIE ALEJEK WYSTAWIENNICZYCH 3D I STOISK W TLE ───
  if (typeof window.showHallEnvironment !== 'undefined' && window.showHallEnvironment) {
    const bMinX = (found3DObjects && isFinite(minX3D)) ? minX3D : -150;
    const bMaxX = (found3DObjects && isFinite(maxX3D)) ? maxX3D : 150;
    const bMinZ = (found3DObjects && isFinite(minZ3D)) ? minZ3D : -150;
    const bMaxZ = (found3DObjects && isFinite(maxZ3D)) ? maxZ3D : 150;

    const aislesGroup = new THREE.Group();
    const aisleWidth = 300; // Rozszerzenie alejek do 3m (300cm)
    const aisleOffset = 50; // Odsunięcie 50cm od obrysu stoiska/podłogi
    const hallLen = 8000; // Rozciągnięcie alejek na całą halę

    const isBW = typeof showModuleListMode !== 'undefined' && showModuleListMode === 'bw';
    const isBlue = typeof isBlueprintMode !== 'undefined' && isBlueprintMode;
    const aisleColor = isBlue ? 0x2c4263 : (isBW ? 0x333333 : 0x5c6570); // Architektoniczny beton
    const borderColor = isBlue ? 0x5a7ba8 : (isBW ? 0x555555 : 0x3b4249);

    const useBasicAisle = typeof window.currentBgType !== 'undefined' && (window.currentBgType === 'dark_hall' || window.currentBgType === 'dark_sketch');
    const aisleMat = useBasicAisle
      ? new THREE.MeshBasicMaterial({
          color: window.currentBgType === 'dark_hall' ? 0x181818 : 0x5c6570, // Antracytowe dla dark hall, średnioszare dla dark sketch
          transparent: true,
          opacity: 0.85
        })
      : new THREE.MeshStandardMaterial({
          color: aisleColor,
          roughness: 1.0,
          metalness: 0.0,
          transparent: true,
          opacity: 0.85
        });

    const borderMat = new THREE.LineBasicMaterial({
      color: borderColor,
      transparent: true,
      opacity: 0.7
    });

    const create3DAisleSection = (w, d, cx, cz) => {
      if (!isFinite(w) || !isFinite(d) || !isFinite(cx) || !isFinite(cz) || w <= 0 || d <= 0) return;
      const geom = new THREE.PlaneGeometry(w, d);
      geom.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geom, aisleMat);
      mesh.position.set(cx, 1.0, cz);
      mesh.receiveShadow = true;
      aislesGroup.add(mesh);

      const halfW = w / 2, halfD = d / 2;
      const points = [
        new THREE.Vector3(-halfW, 1.02, -halfD),
        new THREE.Vector3(halfW, 1.02, -halfD),
        new THREE.Vector3(halfW, 1.02, halfD),
        new THREE.Vector3(-halfW, 1.02, halfD),
        new THREE.Vector3(-halfW, 1.02, -halfD)
      ];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMesh = new THREE.Line(lineGeom, borderMat);
      lineMesh.position.set(cx, 0, cz);
      aislesGroup.add(lineMesh);
    };

    const zNorth = bMinZ - aisleOffset - aisleWidth / 2;
    const zSouth = bMaxZ + aisleOffset + aisleWidth / 2;
    const xWest = bMinX - aisleOffset - aisleWidth / 2;
    const xEast = bMaxX + aisleOffset + aisleWidth / 2;

    // ELIMINACJA Z-FIGHTING: Ciągłe pasy poziome (Północ/Południe) + podzielone pasy pionowe (Zachód/Wschód) z dylatacją na przecięciach
    const zN_bot = zNorth + aisleWidth / 2;
    const zS_top = zSouth - aisleWidth / 2;
    const gap = 1; // 1 cm gap (dilatation) at intersections

    const d1 = (zNorth - aisleWidth / 2 - gap) - (-hallLen / 2);
    const cz1 = (-hallLen / 2 + zNorth - aisleWidth / 2 - gap) / 2;

    const d2 = zS_top - zN_bot - 2 * gap;
    const cz2 = (zN_bot + zS_top) / 2;

    const d3 = hallLen / 2 - (zSouth + aisleWidth / 2 + gap);
    const cz3 = (zSouth + aisleWidth / 2 + gap + hallLen / 2) / 2;

    // A. Tył (Północ) - Cały ciągły pas poziomy 80m
    create3DAisleSection(hallLen, aisleWidth, 0, zNorth);
    // B. Przód (Południe) - Cały ciągły pas poziomy 80m
    create3DAisleSection(hallLen, aisleWidth, 0, zSouth);

    // C. Lewa (Zachód) - 3 sekcje z dylatacją
    create3DAisleSection(aisleWidth, d1, xWest, cz1);
    create3DAisleSection(aisleWidth, d2, xWest, cz2);
    create3DAisleSection(aisleWidth, d3, xWest, cz3);

    // D. Prawa (Wschód) - 3 sekcje z dylatacją
    create3DAisleSection(aisleWidth, d1, xEast, cz1);
    create3DAisleSection(aisleWidth, d2, xEast, cz2);
    create3DAisleSection(aisleWidth, d3, xEast, cz3);

    scene.add(aislesGroup);
    sceneObjects.push(aislesGroup);

    // ─── TLE: STOISKA OCTANORM PO DRUGIEJ STRONIE ALEJEK ───
    let oct1Cx = (bMinX + bMaxX) / 2;
    let oct1Cz = bMinZ - 50 - 300 - 180;
    const octanormBooth1 = buildOctanormBooth3D(oct1Cx, oct1Cz);
    scene.add(octanormBooth1);
    sceneObjects.push(octanormBooth1);

    // Drugie stoisko Octanorm 4x3m z prawej strony (układ U-shape 4x3)
    let oct2Cx = bMaxX + 50 + 300 + 50 + 200;
    let oct2Cz = (bMinZ + bMaxZ) / 2;
    const octanormBooth2 = buildOctanormBooth4x33D(oct2Cx, oct2Cz);
    scene.add(octanormBooth2);
    sceneObjects.push(octanormBooth2);
  }

  if (showDimensions && hasWalls3D) {
    const totalW = maxX3D - minX3D;
    const zBehind = minZ3D - 60;
    const zFront = maxZ3D + 40;
    let maxY = 250;
    computed3DData.forEach(item => { if (item.height) maxY = Math.max(maxY, item.height); });

    const p1Total = new THREE.Vector3(minX3D, 0, zBehind);
    const p2Total = new THREE.Vector3(maxX3D, 0, zBehind);
    const dimTotal = addDimension3D(p1Total, p2Total, `Szerokość całkowita: ${totalW.toFixed(0)} cm`, new THREE.Vector3(0, 0, 0), 0.7);
    scene.add(dimTotal); sceneObjects.push(dimTotal);

    const p1HR = new THREE.Vector3(maxX3D + 40, 0, zFront);
    const p2HR = new THREE.Vector3(maxX3D + 40, maxY, zFront);
    const dimHR = addDimension3D(p1HR, p2HR, `Wys. ${maxY.toFixed(0)} cm`, new THREE.Vector3(0, 0, 0), 0.6);
    scene.add(dimHR); sceneObjects.push(dimHR);
  }

  if (typeof arGroup !== 'undefined' && arGroup && typeof isARMode !== 'undefined' && isARMode) {
    sceneObjects.forEach(obj => {
      scene.remove(obj);
      arGroup.add(obj);
    });
  }
  if (human3DModel) {
    human3DModel.position.x = humanPos.x;
    human3DModel.position.z = humanPos.z;
    
    // Obliczenie wysokości z uwzględnieniem podwyższenia podłogi (globalElevationY)
    human3DModel.position.y = 0;
    const box = new THREE.Box3().setFromObject(human3DModel);
    const elevation = typeof globalElevationY !== 'undefined' ? globalElevationY : 0;
    human3DModel.position.y = elevation + Math.abs(box.min.y);

    const rotation = humanPos.rotation !== undefined ? humanPos.rotation : 180;
    human3DModel.rotation.y = rotation * Math.PI / 180;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 🔥 NOWOŚĆ: Automatyczna kontrola widoczności + Dynamiczna Legenda SEGO (Wzór LMD)
  // ═════════════════════════════════════════════════════════════════════════

  // 1. Czyszczenie starego panelu legendy przed ewentualną przebudową
  const oldLegend = document.getElementById('segoBlueprintLegend');
  if (oldLegend) oldLegend.remove();

  // 2. Kontrola widoczności obiektów 3D anatomii wewnętrznej w scenie WebGL
  if (typeof scene !== 'undefined' && scene) {
    scene.traverse(obj => {
      if (obj.userData && obj.userData.isInternalAnatomy) {
        obj.visible = (typeof showDimensions !== 'undefined' && showDimensions);
      }
      if (obj.userData && obj.userData.isModuleListOverlay) {
        obj.visible = (typeof showModuleListMode !== 'undefined' && showModuleListMode);
      }
    });
  }

  // 3. Wstrzykiwanie panelu legendy inżynieryjnej do interfejsu (lewy górny róg)
  if (typeof showDimensions !== 'undefined' && showDimensions && window.blueprintLegendItems && window.blueprintLegendItems.length > 0) {
    const container3D = document.getElementById('stage3DContainer');
    if (container3D) {
      const legendDiv = document.createElement('div');
      legendDiv.id = 'segoBlueprintLegend';

      // Nadanie panelowi luksusowego, ciemnego wyglądu z cienką ramką
      legendDiv.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(10, 10, 20, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 15px;
        color: #ffffff;
        font-family: 'Segoe UI', sans-serif;
        font-size: 12px;
        z-index: 100;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
        pointer-events: none;
        min-width: 260px;
        backdrop-filter: blur(4px);
      `;

      // Nagłówek legendy technicznej
      let legendHTML = '<div style="font-weight: bold; font-size: 13px; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); padding-bottom: 6px; letter-spacing: 1px; color: #8bb3ff;">LEGENDA TECHNICZNA</div>';

      // Dynamiczne mapowanie zarejestrowanych punktów konstrukcyjnych SEGO
      window.blueprintLegendItems.forEach(item => {
        legendHTML += `
          <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
            <div style="
              background: ${item.color};
              color: #000000;
              font-weight: bold;
              border-radius: 50%;
              width: 18px;
              height: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              margin-right: 12px;
              flex-shrink: 0;
              box-shadow: 0 0 8px ${item.color}88;
            ">${item.num}</div>
            <div>
              <div style="font-weight: bold; color: #ffffff; font-size: 11px; letter-spacing: 0.5px;">${item.name.toUpperCase()}</div>
              <div style="color: #aaaaaa; font-size: 10.5px; margin-top: 2px; line-height: 1.2;">${item.desc}</div>
            </div>
          </div>
        `;
      });

      legendDiv.innerHTML = legendHTML;
      container3D.appendChild(legendDiv);
    }
  }

  // Refresh module list table in sidebar if active
  if (typeof showModuleListMode !== 'undefined' && showModuleListMode && typeof window.buildModuleListTable === 'function') {
    window.buildModuleListTable();
  }

  // Włączenie cieni dla wszystkich nowo wygenerowanych obiektów w scenie
  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child === windowExpoFloor) {
          child.receiveShadow = true;
          child.castShadow = false;
        } else if (child === windowExpoCeiling || child === windowExpoWalls) {
          child.receiveShadow = false;
          child.castShadow = false;
        } else if (child.name === 'windowGridHelper' || child.isLine || child.isSprite) {
          child.castShadow = false;
          child.receiveShadow = false;
        } else {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      }
    });
  }

  if (typeof renderer !== 'undefined' && renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}


function render() {
  let isOutOfBounds = false; let hasWallCollision = false;
  const layer = document.getElementById('drawingLayer'); const stage = document.getElementById('stage');
  if (!layer || !stage) return;
  layer.innerHTML = ''; computed3DData = [];
  let sWidth = stage.clientWidth || window.innerWidth - 400; let sHeight = stage.clientHeight || window.innerHeight;
  const stageCenterStartX = sWidth / 2 - 100; const stageCenterStartY = sHeight / 2 + 100;

  if (typeof applyTransform2D === 'function') {
    applyTransform2D();
  }

  let x = stageCenterStartX, y = stageCenterStartY; let currentAngle = 0; let prevWallAngle = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity; let baseCost = 0; let counts = {}; let lastItemType = null;
  let pendingTurn90 = false; let pendingTurnItem = null; let placedWalls = []; let kantorekCount = 0; let floorBounds = null; let currentDrawingFlipped = false; let manualKantorekWallIndices = new Set();

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
      const rate = 4.27;

      let q_plyta = W * D;
      let łącznik = (W + 1) * (D + 1);
      let A = Math.min(W, D); let B = Math.max(W, D);
      let q_profil = (A + 1) * B + (B + 1) * A;
      let q_wzmocnienie = q_plyta;
      let q_maskownica = obwod;

      const addSub = (n, q, eurPrice) => {
        if (q > 0) {
          addItemToBom("- " + n, q, eurPrice, counts);
          baseCost += (q * eurPrice);
        }
      };

      addSub("Adfloor płyta 997x997", q_plyta, 254 / rate);
      addSub("Adfloor łącznik profili", łącznik, 63 / rate);
      addSub("Adfloor profil panelowy", q_profil, 78 / rate);
      addSub("Adfloor profil wzmocnienie", q_wzmocnienie, 87 / rate);
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

  const feetFlags = computeWallFeetFlags(plan);
  let nodes = []; nodes.push({ x: x, y: y, angle: currentAngle, isFlipped: false }); createJoint(layer, x, y, 0);

  // ─── Pomocnik: czy element jest w multi-selekcji ─────────────────────────────
  const isMultiSel = (idx) => typeof selectedItemIndices !== 'undefined' && selectedItemIndices.has(idx);

  for (let index = 0; index < plan.length; index++) {
    let item = plan[index];

    // ─── MODUŁ NADSTAWKOWY / STACKED WALL (BUDOWANIE DO GÓRY) ─────────────────
    if (item.type === 'wall' && (item.isStacked || item.stackedOnIndex !== undefined)) {
      let parent3D = (item.stackedOnIndex !== undefined) ? computed3DData.find(d => d.type === 'wall' && d.planIndex === item.stackedOnIndex) : null;
      if (!parent3D) {
        for (let i = computed3DData.length - 1; i >= 0; i--) {
          if (computed3DData[i].type === 'wall' && computed3DData[i].planIndex < index) {
            parent3D = computed3DData[i]; break;
          }
        }
      }

      let pCx = parent3D ? parent3D.cx : 0;
      let pCz = parent3D ? parent3D.cz : 0;
      let pAngle = parent3D ? parent3D.angle : 0;
      let pHeight = parent3D ? parent3D.height : 250;
      let pElev = parent3D ? (parent3D.elevation || 0) : 0;

      item.elevation = pElev + pHeight;
      const thick = item.thickness || 12;
      const fx = stageCenterStartX + pCx;
      const fy = stageCenterStartY + pCz;
      const isSel = selectedItemIndex === index;
      const isMSel = isMultiSel(index);

      let wallClasses = 'sego-wall stacked-wall';
      if (isSel) wallClasses += ' selected';
      if (isMSel) wallClasses += ' multi-selected';

      let stackedWallEl = document.createElement('div');
      stackedWallEl.className = wallClasses;
      stackedWallEl.style.width = item.length + 'px';
      stackedWallEl.style.height = thick + 'px';
      stackedWallEl.style.left = (fx - item.length / 2) + 'px';
      stackedWallEl.style.top = (fy - thick / 2) + 'px';
      stackedWallEl.style.transformOrigin = '50% 50%';
      stackedWallEl.style.transform = `rotate(${pAngle}deg)`;
      if (item.color) { stackedWallEl.style.borderColor = item.color; stackedWallEl.style.boxShadow = `0 0 8px ${item.color}`; }

      const isBW = typeof showModuleListMode !== 'undefined' && showModuleListMode === 'bw';
      const textRot = (pAngle % 360 >= 90 && pAngle % 360 <= 270) ? 180 : 0;
      let heightLabel = `<br><span style="font-size:7px;color:#ffcc00;font-weight:bold;">⬆️+${item.elevation}</span>`;
      stackedWallEl.innerHTML = `<span style="transform: rotate(${textRot}deg); pointer-events: none; text-align:center; line-height:1;">${item.length}${heightLabel}</span>`;

      stackedWallEl.onclick = (e) => selectItem(index, e);
      stackedWallEl.onmousedown = function (e) {
        if (e.target.tagName === 'SPAN') return;
        e.preventDefault(); e.stopPropagation();
        selectItem(index, e);
      };
      stackedWallEl.ondragover = (e) => { e.preventDefault(); e.stopPropagation(); };
      stackedWallEl.ondrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          let file = e.dataTransfer.files[0];
          let validExts = ['jpg', 'jpeg', 'png', 'pdf', 'tiff', 'tif'];
          let fileExt = file.name.split('.').pop().toLowerCase();
          if (validExts.includes(fileExt)) {
            const isFlipped = item.isFlipped !== undefined ? item.isFlipped : (parent3D ? parent3D.isFlipped : false);
            if (isFlipped) {
              item.textureBackName = file.name;
            } else {
              item.textureFrontName = file.name;
            }
            handleDroppedFile(file, fileExt, (source) => {
              let dataUrl = typeof source === 'string' ? source : source.toDataURL('image/jpeg', 0.95);
              if (isFlipped) {
                item.textureBack = dataUrl;
              } else {
                item.textureFront = dataUrl;
              }
              if (typeof refreshGraphicsList === 'function') refreshGraphicsList();
              render();
            });
          } else alert("Obsługiwane formaty to: JPG, PNG, TIFF, PDF");
        }
      };
      layer.appendChild(stackedWallEl);

      addItemToBom(item.name, 1, item.price, counts);
      baseCost += item.price;
      if (DB.segoStackConn) {
        addItemToBom(DB.segoStackConn.name, 2, DB.segoStackConn.price, counts);
        baseCost += (2 * DB.segoStackConn.price);
      }

      computed3DData.push({
        type: 'wall', planIndex: index, cx: pCx, cz: pCz, length: item.length, height: item.height || 250, angle: pAngle, color: item.color, isDoor: item.isDoor, labelEN: item.labelEN, textureFront: item.textureFront, textureBack: item.textureBack, textureFrontName: item.textureFrontName, textureBackName: item.textureBackName, isFoldable: item.isFoldable, thickness: thick, isFlipped: item.isFlipped !== undefined ? item.isFlipped : (parent3D ? parent3D.isFlipped : false), leftFoot: false, rightFoot: false, elevation: item.elevation, isStacked: true
      });

      continue; // ZIGNORUJ STRZAŁKĘ RYSOWANIA
    }

    // ─── WOLNA ŚCIANA (wyrwana z łańcucha) ─────────────────────────────────────
    if (item.type === 'wall' && item.offsetX !== undefined) {
      const freeAngle = item.freeAngle || 0;
      const thick = item.thickness || 12;
      const fx = stageCenterStartX + item.offsetX;
      const fy = stageCenterStartY + item.offsetY;
      const isSel = selectedItemIndex === index;
      const isMSel = isMultiSel(index);
      let wFlags = feetFlags[index] || { leftFoot: true, rightFoot: true };

      // Ściana przestaje być freestanding (dashed border) jeśli ma klipowanego partnera
      let wallClasses = 'sego-wall';
      if (item._cornerWith === undefined && item._collinearWith === undefined) {
        wallClasses += ' free-wall';
      }
      if (isSel) wallClasses += ' selected';
      if (isMSel) wallClasses += ' multi-selected';

      let freeWallEl = document.createElement('div');
      freeWallEl.className = wallClasses;
      freeWallEl.style.width = item.length + 'px';
      freeWallEl.style.height = thick + 'px';
      freeWallEl.style.left = (fx - item.length / 2) + 'px';
      freeWallEl.style.top = (fy - thick / 2) + 'px';
      freeWallEl.style.transformOrigin = '50% 50%';
      freeWallEl.style.transform = `rotate(${freeAngle}deg)`;
      if (item.color) { freeWallEl.style.borderColor = item.color; freeWallEl.style.boxShadow = `0 0 8px ${item.color}`; }

      const textRot = (freeAngle % 360 >= 90 && freeAngle % 360 <= 270) ? 180 : 0;
      const heightLabel = item.height === 300 ? `<br><span style="font-size:8px;color:${item.color || '#ff0080'};">3m</span>` : '';
      freeWallEl.innerHTML = `<span style="transform: rotate(${textRot}deg); pointer-events: none; text-align:center; line-height:1;">${item.length}${heightLabel}</span>`;

      freeWallEl.onclick = (e) => selectItem(index, e);

      // Usunięto bezpośrednie przeciąganie wolnej ściany. Wejście w ruch tylko przez klawisz M.
      // Dajemy mousedown do celów zaznaczania (w tym Ctrl+klik)
      freeWallEl.onmousedown = function (e) {
        if (e.target.tagName === 'SPAN') return;
        e.preventDefault(); e.stopPropagation();
        selectItem(index, e);
      };

      layer.appendChild(freeWallEl);

      // Guzik toggle narożnika jeśli ściana ma klipowanego partnera 90 stopni
      if (item._cornerWith !== undefined && item._clipCornerX !== undefined) {
        const btnX = item._clipCornerX;
        const btnY = item._clipCornerY;

        let cTypes = ['zew-zew', 'wew-zew-1', 'wew-zew-2'];
        if (typeof currentSystem !== 'undefined' && currentSystem === 'foldable') cTypes = ['wew-zew-1', 'wew-zew-2'];
        if (typeof currentSystem !== 'undefined' && currentSystem === 'multiframe') cTypes = ['cube'];

        const cType = item._cornerType || 'zew-zew';
        const cLabel = cType === 'zew-zew' ? 'Z-Z' : (cType === 'wew-zew-2' ? 'W-Z 2' : (cType === 'cube' ? '⬜' : 'W-Z 1'));

        if (cTypes.length > 1) {
          const cornerBtn = document.createElement('div');
          cornerBtn.className = 'clip-corner-btn';
          cornerBtn.style.left = btnX + 'px';
          cornerBtn.style.top = btnY + 'px';
          cornerBtn.innerText = cLabel;
          cornerBtn.title = 'Zmień typ łączenia narożnika';
          cornerBtn.onmousedown = (e) => e.stopPropagation();
          const captIdx = index, captPartner = item._cornerWith;
          cornerBtn.onclick = (e) => {
            e.stopPropagation();
            if (typeof cycleClipCornerType === 'function') cycleClipCornerType(captIdx, captPartner);
          };
          layer.appendChild(cornerBtn);
        }
      }

      // --- DODAWANIE DO BOM I NALICZANIE KOSZTÓW DLA WOLNEJ ŚCIANY ---
      addItemToBom(item.name, 1, item.price, counts);
      baseCost += item.price;
      if (item.elevation > 0 || item.isStacked) {
        if (DB.segoStackConn) {
          addItemToBom(DB.segoStackConn.name, 2, DB.segoStackConn.price, counts);
          baseCost += (2 * DB.segoStackConn.price);
        }
      }
      if (item.isDoor) {
        addItemToBom(DB.sego100x250.name, 1, DB.sego100x250.price, counts);
        baseCost += DB.sego100x250.price;
      }

      // Stopki (stopy płaskie) dla wolnej ściany - USUNIĘTO (mini stopy tylko przy kantorkach)

      // Łączniki dla klipowanych wolnych ścian (liczone tylko raz dla pary)
      if (item._cornerWith !== undefined && index < item._cornerWith) {
        const partner = plan[item._cornerWith];
        if (partner) {
          // Połączenie 90 stopni (narożnik)
          if (item.isFoldable) {
            addItemToBom("Foldable set 90deg connector", 2, 4, counts);
            baseCost += (2 * 4);
          } else {
            const cType = item._cornerType || 'zew-zew';
            const cName = cType === 'zew-zew' ? DB.zewzew.name : DB.wewzew.name;
            const cPrice = cType === 'zew-zew' ? DB.zewzew.price : DB.wewzew.price;
            addItemToBom(cName, 2, cPrice, counts);
            baseCost += (2 * cPrice);
          }
        }
      }
      if (item._collinearWith !== undefined && index < item._collinearWith) {
        const partner = plan[item._collinearWith];
        if (partner) {
          // Połączenie 180 stopni (kolinearne)
          if (item.isFoldable) {
            addItemToBom("Foldable set 180° connector", 2, 4, counts);
            baseCost += (2 * 4);
          } else {
            addItemToBom(DB.clamp.name, 2, DB.clamp.price, counts);
            baseCost += (2 * DB.clamp.price);
          }
        }
      }

      // Dodaj dwa końce wolnej ściany jako węzły i stwórz dla nich jointy
      const radEp = (freeAngle * Math.PI) / 180;
      const halfLEp = item.length / 2;
      const epX1 = fx - halfLEp * Math.cos(radEp);
      const epY1 = fy - halfLEp * Math.sin(radEp);
      const epX2 = fx + halfLEp * Math.cos(radEp);
      const epY2 = fy + halfLEp * Math.sin(radEp);

      nodes.push({ x: epX1, y: epY1, angle: freeAngle, isFlipped: false });
      let nodeIdxStart = nodes.length - 1;
      createJoint(layer, epX1, epY1, nodeIdxStart);

      nodes.push({ x: epX2, y: epY2, angle: freeAngle, isFlipped: false });
      let nodeIdxEnd = nodes.length - 1;
      createJoint(layer, epX2, epY2, nodeIdxEnd);

      // Zapisujemy pozycję wolnej ściany do placedWalls, aby była uwzględniana w obrysie i kolizjach
      placedWalls.push({ startX: epX1, startY: epY1, endX: epX2, endY: epY2, isDoor: item.isDoor, planIndex: index });

      let perpX = Math.abs(Math.sin(radEp)) * (thick / 2);
      let perpY = Math.abs(Math.cos(radEp)) * (thick / 2);
      minX = Math.min(minX, epX1 - perpX, epX2 - perpX);
      maxX = Math.max(maxX, epX1 + perpX, epX2 + perpX);
      minY = Math.min(minY, epY1 - perpY, epY2 - perpY);
      maxY = Math.max(maxY, epY1 + perpY, epY2 + perpY);

      // Dodaj do computed3DData z obliczonymi wFlags stopkami
      computed3DData.push({ type: 'wall', planIndex: index, cx: item.offsetX, cz: item.offsetY, length: item.length, height: item.height || 250, angle: freeAngle, color: item.color, isDoor: item.isDoor, labelEN: item.labelEN, isFoldable: item.isFoldable, thickness: thick, isFlipped: item.isFlipped, leftFoot: wFlags.leftFoot, rightFoot: wFlags.rightFoot, elevation: item.elevation || 0, isStacked: item.isStacked || false });

      // --- ZACHOWAJ PRZERWĘ W ŁAŃCUCHU ---
      let tempX = x, tempY = y;
      if (pendingTurnItem) {
        let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
        let rad2 = pendingTurnItem.currAngle * Math.PI / 180;
        let offset = (item.thickness || 12) / 2;
        let sV1 = 0, sV2 = 0;
        let cType = pendingTurnItem.cornerType || 'wew-zew-1';

        if (cType === 'zew-zew') { sV1 = offset; sV2 = offset; }
        else if (cType === 'wew-zew-1') { sV1 = -offset; sV2 = offset; }
        else if (cType === 'wew-zew-2') { sV1 = offset; sV2 = -offset; }

        let isBranchingFromStart = false;
        for (let w of placedWalls) {
          if (Math.abs(pendingTurnItem.cornerX - w.startX) < 1 && Math.abs(pendingTurnItem.cornerY - w.startY) < 1) {
            isBranchingFromStart = true; break;
          }
        }
        if (isBranchingFromStart) sV1 = -sV1;

        tempX = pendingTurnItem.cornerX + sV1 * Math.cos(rad1) + sV2 * Math.cos(rad2);
        tempY = pendingTurnItem.cornerY + sV1 * Math.sin(rad1) + sV2 * Math.sin(rad2);
        pendingTurnItem = null;
      }

      let chainRad = currentAngle * Math.PI / 180;
      x = tempX + item.length * Math.cos(chainRad);
      y = tempY + item.length * Math.sin(chainRad);
      prevWallAngle = currentAngle;
      nodes.push({ x: x, y: y, angle: currentAngle });
      item.endNodeIndex = nodes.length - 1;

      continue; // Pomiń logikę łańcucha dla tej ściany
    }

    if (item.type === 'suspended' || item.type === 'suspended_ring') {
      let fx = stageCenterStartX + item.offsetX; let fy = stageCenterStartY + item.offsetY;
      computed3DData.push({ type: item.type, planIndex: index, id: item.id, cx: item.offsetX, cz: item.offsetY, width: item.width || item.diameter, height: item.height, depth: item.depth || item.diameter, diameter: item.diameter, labelEN: item.labelEN, quadTextures: item.quadTextures || {} });
      let suspEl = document.createElement('div'); suspEl.className = 'sego-suspended' + (selectedItemIndex === index ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
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
      let freeEl = document.createElement('div'); freeEl.className = 'sego-freestanding' + (selectedItemIndex === index ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
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
        document.addEventListener('mousemove', onMouseMove); document.onmouseup = function () { document.removeEventListener('mousemove', onMouseMove); document.onmouseup = null; if (typeof _autoClipProximity === 'function') _autoClipProximity(index); render(); };
      };
      layer.appendChild(freeEl); addItemToBom(item.name, 1, item.price, counts); baseCost += item.price; continue;
    }
    else if (item.type === 'table_chairs') {
      let fx = stageCenterStartX + item.offsetX; let fy = stageCenterStartY + item.offsetY;
      computed3DData.push({ type: 'table_chairs', planIndex: index, id: item.id, cx: item.offsetX, cz: item.offsetY, width: item.width, height: item.height, depth: item.depth, rotation: item.rotation || 0, labelEN: item.labelEN });
      
      let containerEl = document.createElement('div');
      containerEl.className = 'sego-table-chairs' + (selectedItemIndex === index ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
      containerEl.style.position = 'absolute';
      containerEl.style.width = '160px';
      containerEl.style.height = '160px';
      containerEl.style.left = (fx - 80) + 'px';
      containerEl.style.top = (fy - 80) + 'px';
      containerEl.style.transform = `rotate(${item.rotation || 0}deg)`;
      containerEl.style.cursor = 'move';
      containerEl.style.zIndex = '90';
      containerEl.style.display = 'flex';
      containerEl.style.alignItems = 'center';
      containerEl.style.justifyContent = 'center';

      let isSel = (selectedItemIndex === index);
      let highlightStroke = isSel ? 'var(--highlight)' : '#ff0080';
      let highlightShadow = isSel ? '0px 0px 12px var(--highlight)' : '0px 0px 5px rgba(255, 0, 128, 0.4)';
      let highlightBorder = isSel ? '2px dashed var(--highlight)' : 'none';

      let svgHtml = `
        <svg width="160" height="160" viewBox="0 0 160 160" style="pointer-events: none;">
          <!-- Chair 1 (top/0 deg) -->
          <path d="M 60,35 Q 80,15 100,35 L 95,50 Q 80,45 65,50 Z" fill="rgba(255,255,255,0.9)" stroke="#333" stroke-width="2"/>
          <!-- Chair 2 (120 deg) -->
          <path d="M 60,35 Q 80,15 100,35 L 95,50 Q 80,45 65,50 Z" fill="rgba(255,255,255,0.9)" stroke="#333" stroke-width="2" transform="rotate(120, 80, 80)"/>
          <!-- Chair 3 (240 deg) -->
          <path d="M 60,35 Q 80,15 100,35 L 95,50 Q 80,45 65,50 Z" fill="rgba(255,255,255,0.9)" stroke="#333" stroke-width="2" transform="rotate(240, 80, 80)"/>

          <!-- Table: Circle of diameter 80 at center -->
          <circle cx="80" cy="80" r="40" fill="#ffffff" stroke="${highlightStroke}" stroke-width="3" style="filter: drop-shadow(${highlightShadow});"/>
          
          <!-- Wooden base cross under table -->
          <line x1="60" y1="60" x2="100" y2="100" stroke="#d7a15c" stroke-width="3"/>
          <line x1="100" y1="60" x2="60" y2="100" stroke="#d7a15c" stroke-width="3"/>
          <circle cx="80" cy="80" r="8" fill="#222"/>
          
          <text x="80" y="84" font-size="10" font-family="sans-serif" font-weight="bold" fill="#333" text-anchor="middle">STÓŁ</text>
        </svg>
        <div class="acc-controls" style="position: absolute; bottom: -5px; right: -5px; display: ${isSel ? 'flex' : 'none'};">
          <span class="acc-btn" onclick="rotateFreestanding(${index}, event)">🔄</span>
          <span class="acc-btn" onclick="removeFreestanding(${index}, event)" style="color:#ff5555">❌</span>
        </div>
      `;
      containerEl.innerHTML = svgHtml;
      
      if (isSel) {
        containerEl.style.border = highlightBorder;
        containerEl.style.borderRadius = '50%';
        containerEl.style.boxShadow = '0 0 10px rgba(0, 210, 255, 0.3)';
      }

      containerEl.onclick = (e) => {
        e.stopPropagation();
        selectItem(index, e);
      };
      
      containerEl.onmousedown = function (e) {
        if (e.target.classList.contains('acc-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        selectItem(index, e);
        
        let startX = e.clientX;
        let startY = e.clientY;
        let initX = item.offsetX;
        let initY = item.offsetY;
        let vs = typeof viewScale !== 'undefined' ? viewScale : 1;
        
        function onMouseMove(event) {
          item.offsetX = initX + (event.clientX - startX) / vs;
          item.offsetY = initY + (event.clientY - startY) / vs;
          let newFx = stageCenterStartX + item.offsetX;
          let newFy = stageCenterStartY + item.offsetY;
          containerEl.style.left = (newFx - 80) + 'px';
          containerEl.style.top = (newFy - 80) + 'px';
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);
          document.onmouseup = null;
          if (typeof _autoClipProximity === 'function') _autoClipProximity(index);
          render();
        };
      };
      
      layer.appendChild(containerEl);
      addItemToBom(item.name, 1, item.price, counts);
      baseCost += item.price;
      continue;
    }
    else if (item.type === 'potted_plant') {
      let fx = stageCenterStartX + item.offsetX; let fy = stageCenterStartY + item.offsetY;
      computed3DData.push({ type: 'potted_plant', planIndex: index, id: item.id, cx: item.offsetX, cz: item.offsetY, width: item.width, height: item.height, depth: item.depth, rotation: item.rotation || 0, labelEN: item.labelEN });

      
      let containerEl = document.createElement('div');
      containerEl.className = 'sego-potted-plant' + (selectedItemIndex === index ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
      containerEl.style.position = 'absolute';
      containerEl.style.width = '60px';
      containerEl.style.height = '60px';
      containerEl.style.left = (fx - 30) + 'px';
      containerEl.style.top = (fy - 30) + 'px';
      containerEl.style.transform = `rotate(${item.rotation || 0}deg)`;
      containerEl.style.cursor = 'move';
      containerEl.style.zIndex = '90';
      containerEl.style.display = 'flex';
      containerEl.style.alignItems = 'center';
      containerEl.style.justifyContent = 'center';

      let isSel = (selectedItemIndex === index);
      let highlightStroke = isSel ? 'var(--highlight)' : '#00ff88';
      let highlightShadow = isSel ? '0px 0px 12px var(--highlight)' : '0px 0px 5px rgba(0, 255, 136, 0.4)';
      let highlightBorder = isSel ? '2px dashed var(--highlight)' : 'none';

      let svgHtml = `
        <svg width="60" height="60" viewBox="0 0 60 60" style="pointer-events: none;">
          <!-- Green plant leaves (protruding) -->
          <path d="M 30,30 Q 15,10 5,20 Q 20,25 30,30" fill="#00ff88" opacity="0.8"/>
          <path d="M 30,30 Q 45,10 55,20 Q 40,25 30,30" fill="#00ff88" opacity="0.8"/>
          <path d="M 30,30 Q 10,45 20,55 Q 25,40 30,30" fill="#00ff88" opacity="0.8"/>
          <path d="M 30,30 Q 50,45 40,55 Q 35,40 30,30" fill="#00ff88" opacity="0.8"/>
          <path d="M 30,30 Q 30,5 30,0 Q 35,15 30,30" fill="#00ff88" opacity="0.8"/>

          <!-- White square pot in the center -->
          <rect x="15" y="15" width="30" height="30" rx="3" fill="#ffffff" stroke="${highlightStroke}" stroke-width="2" style="filter: drop-shadow(${highlightShadow});"/>
          
          <!-- Pebbles inside the pot -->
          <circle cx="22" cy="22" r="2.5" fill="#ddd"/>
          <circle cx="27" cy="25" r="2" fill="#bbb"/>
          <circle cx="33" cy="22" r="3" fill="#eee"/>
          <circle cx="38" cy="27" r="2.5" fill="#ccc"/>
          <circle cx="25" cy="35" r="3" fill="#ddd"/>
          <circle cx="35" cy="35" r="2" fill="#bbb"/>
          
          <text x="30" y="33" font-size="7" font-family="sans-serif" font-weight="bold" fill="#333" text-anchor="middle">🌿</text>
        </svg>
        <div class="acc-controls" style="position: absolute; bottom: -15px; right: -15px; display: ${isSel ? 'flex' : 'none'};">
          <span class="acc-btn" onclick="rotateFreestanding(${index}, event)">🔄</span>
          <span class="acc-btn" onclick="removeFreestanding(${index}, event)" style="color:#ff5555">❌</span>
        </div>
      `;
      containerEl.innerHTML = svgHtml;
      
      if (isSel) {
        containerEl.style.border = highlightBorder;
        containerEl.style.boxShadow = '0 0 10px rgba(0, 255, 136, 0.3)';
      }

      containerEl.onclick = (e) => {
        e.stopPropagation();
        selectItem(index, e);
      };
      
      containerEl.onmousedown = function (e) {
        if (e.target.classList.contains('acc-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        selectItem(index, e);
        
        let startX = e.clientX;
        let startY = e.clientY;
        let initX = item.offsetX;
        let initY = item.offsetY;
        let vs = typeof viewScale !== 'undefined' ? viewScale : 1;
        
        function onMouseMove(event) {
          item.offsetX = initX + (event.clientX - startX) / vs;
          item.offsetY = initY + (event.clientY - startY) / vs;
          let newFx = stageCenterStartX + item.offsetX;
          let newFy = stageCenterStartY + item.offsetY;
          containerEl.style.left = (newFx - 30) + 'px';
          containerEl.style.top = (newFy - 30) + 'px';
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);
          document.onmouseup = null;
          if (typeof _autoClipProximity === 'function') _autoClipProximity(index);
          render();
        };
      };
      
      layer.appendChild(containerEl);
      addItemToBom(item.name, 1, item.price, counts);
      baseCost += item.price;
      continue;
    }
    else if (item.type === 'adfolder') {
      let fx = stageCenterStartX + item.offsetX; let fy = stageCenterStartY + item.offsetY;
      computed3DData.push({ type: 'adfolder', planIndex: index, id: item.id, cx: item.offsetX, cz: item.offsetY, width: item.width, height: item.height, depth: item.depth, rotation: item.rotation || 0, labelEN: item.labelEN });

      
      let containerEl = document.createElement('div');
      containerEl.className = 'sego-adfolder' + (selectedItemIndex === index ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
      containerEl.style.position = 'absolute';
      containerEl.style.width = '30px';
      containerEl.style.height = '40px';
      containerEl.style.left = (fx - 15) + 'px';
      containerEl.style.top = (fy - 20) + 'px';
      containerEl.style.transform = `rotate(${item.rotation || 0}deg)`;
      containerEl.style.cursor = 'move';
      containerEl.style.zIndex = '90';
      containerEl.style.display = 'flex';
      containerEl.style.alignItems = 'center';
      containerEl.style.justifyContent = 'center';

      let isSel = (selectedItemIndex === index);
      let highlightStroke = isSel ? 'var(--highlight)' : '#c0c0c0';
      let highlightShadow = isSel ? '0px 0px 12px var(--highlight)' : '0px 0px 5px rgba(192, 192, 192, 0.4)';
      let highlightBorder = isSel ? '2px dashed var(--highlight)' : 'none';

      let svgHtml = `
        <svg width="30" height="40" viewBox="0 0 30 40" style="pointer-events: none;">
          <!-- Steel base -->
          <rect x="2" y="4" width="26" height="32" rx="2" fill="#c0c0c0" stroke="${highlightStroke}" stroke-width="2" style="filter: drop-shadow(${highlightShadow});"/>
          <!-- Inner divider or zigzag lines -->
          <path d="M 5,8 L 25,12 L 5,18 L 25,24 L 5,30 L 25,34" fill="none" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="15" y="24" font-size="9" font-family="sans-serif" font-weight="bold" fill="#333" text-anchor="middle">📰</text>
        </svg>
        <div class="acc-controls" style="position: absolute; bottom: -15px; right: -15px; display: ${isSel ? 'flex' : 'none'};">
          <span class="acc-btn" onclick="rotateFreestanding(${index}, event)">🔄</span>
          <span class="acc-btn" onclick="removeFreestanding(${index}, event)" style="color:#ff5555">❌</span>
        </div>
      `;
      containerEl.innerHTML = svgHtml;
      
      if (isSel) {
        containerEl.style.border = highlightBorder;
        containerEl.style.boxShadow = '0 0 10px rgba(192, 192, 192, 0.3)';
      }

      containerEl.onclick = (e) => {
        e.stopPropagation();
        selectItem(index, e);
      };
      
      containerEl.onmousedown = function (e) {
        if (e.target.classList.contains('acc-btn')) return;
        e.preventDefault();
        e.stopPropagation();
        selectItem(index, e);
        
        let startX = e.clientX;
        let startY = e.clientY;
        let initX = item.offsetX;
        let initY = item.offsetY;
        let vs = typeof viewScale !== 'undefined' ? viewScale : 1;
        
        function onMouseMove(event) {
          item.offsetX = initX + (event.clientX - startX) / vs;
          item.offsetY = initY + (event.clientY - startY) / vs;
          let newFx = stageCenterStartX + item.offsetX;
          let newFy = stageCenterStartY + item.offsetY;
          containerEl.style.left = (newFx - 15) + 'px';
          containerEl.style.top = (newFy - 20) + 'px';
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);
          document.onmouseup = null;
          if (typeof _autoClipProximity === 'function') _autoClipProximity(index);
          render();
        };
      };
      
      layer.appendChild(containerEl);
      addItemToBom(item.name, 1, item.price, counts);
      baseCost += item.price;
      continue;
    }
    if (item.type === 'kantorek_1x1') {
      if (item.rotation === undefined) {
        item.rotation = (currentAngle === 270 || currentAngle === -90) ? -90 : 0;
      }

      let dOp = item.doorOpposite || false;
      let fx, fy, nextX, nextY, nextAngle;

      if (item.isFree) {
        fx = stageCenterStartX + item.offsetX;
        fy = stageCenterStartY + item.offsetY;
        nextX = x;
        nextY = y;
        nextAngle = currentAngle;
      } else {
        if (item.rotation === 0) {
          fx = x + 62;
          fy = y + 44;
          nextX = fx + 56;
          nextY = fy + 50;
          nextAngle = 90;
        } else {
          fx = x + 44;
          fy = y - 62;
          nextX = fx + 50;
          nextY = fy - 56;
          nextAngle = 0;
        }
        item.offsetX = fx - stageCenterStartX;
        item.offsetY = fy - stageCenterStartY;
      }

      let kantEl = document.createElement('div');
      kantEl.className = 'sego-freestanding' + (selectedItemIndex === index ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
      kantEl.style.width = (item.rotation === 0 ? '124px' : '100px');
      kantEl.style.height = (item.rotation === 0 ? '100px' : '124px');
      kantEl.style.left = (fx - (item.rotation === 0 ? 62 : 50)) + 'px';
      kantEl.style.top = (fy - (item.rotation === 0 ? 50 : 62)) + 'px';
      kantEl.style.transform = `rotate(0deg)`;
      kantEl.style.backgroundColor = 'transparent';
      kantEl.style.border = 'none';

      let bCol = selectedItemIndex === index ? '#00d2ff' : '#ff0080';
      let hGlow = selectedItemIndex === index ? '0 0 15px #00d2ff' : '0 0 10px rgba(255,0,128,0.6)';

      let normBg = 'rgba(255,0,128,0.05)';
      let doorBg = 'rgba(0,210,255,0.05)'; let doorBrd = '#00d2ff'; let doorGlw = '0 0 15px #00d2ff';

      if (item.rotation === 0) {
        let topBg = dOp ? doorBg : normBg; let topC = dOp ? doorBrd : bCol; let topG = dOp ? doorGlw : hGlow;
        let botBg = dOp ? normBg : doorBg; let botC = dOp ? bCol : doorBrd; let botG = dOp ? hGlow : doorGlw;

        kantEl.innerHTML = `
          <div style="position:absolute; top:0; left:0; width:12px; height:100px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
          <div style="position:absolute; top:0; right:0; width:12px; height:100px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
          <div style="position:absolute; top:0; left:12px; width:100px; height:12px; background:${topBg}; border:2px solid ${topC}; box-shadow:${topG}; box-sizing:border-box;"></div>
          <div style="position:absolute; bottom:0; left:12px; width:100px; height:12px; background:${botBg}; border:2px solid ${botC}; box-shadow:${botG}; box-sizing:border-box;"></div>
        `;
      } else {
        let lftBg = dOp ? doorBg : normBg; let lftC = dOp ? doorBrd : bCol; let lftG = dOp ? doorGlw : hGlow;
        let rgtBg = dOp ? normBg : doorBg; let rgtC = dOp ? bCol : doorBrd; let rgtG = dOp ? hGlow : doorGlw;

        kantEl.innerHTML = `
          <div style="position:absolute; top:0; left:0; width:100px; height:12px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
          <div style="position:absolute; bottom:0; left:0; width:100px; height:12px; background:${normBg}; border:2px solid ${bCol}; box-shadow:${hGlow}; box-sizing:border-box;"></div>
          <div style="position:absolute; top:12px; left:0; width:12px; height:100px; background:${lftBg}; border:2px solid ${lftC}; box-shadow:${lftG}; box-sizing:border-box;"></div>
          <div style="position:absolute; top:12px; right:0; width:12px; height:100px; background:${rgtBg}; border:2px solid ${rgtC}; box-shadow:${rgtG}; box-sizing:border-box;"></div>
        `;
      }

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
      kantEl.onmousedown = function (e) {
        if (e.target.classList.contains('acc-btn')) return;
        e.preventDefault(); e.stopPropagation();
        selectItem(index, e);
      };
      layer.appendChild(kantEl);

      if (!item.quadTextures) item.quadTextures = {};
      let rad = item.rotation * Math.PI / 180;

      const addVirtualWall = (isDoor, locX, locZ, rotOffset, subIdx) => {
        let cx3D = item.offsetX + (locX * Math.cos(rad) - locZ * Math.sin(rad));
        let cz3D = item.offsetY + (locX * Math.sin(rad) + locZ * Math.cos(rad));
        let globAngle = ((item.rotation || 0) + rotOffset) % 360;
        if (globAngle < 0) globAngle += 360;
        let key = index + '_' + subIdx;
        let wFlags = feetFlags[key] || { leftFoot: true, rightFoot: true };
        computed3DData.push({
          type: 'wall', planIndex: index, quadIdx: subIdx, cx: cx3D, cz: cz3D, length: 100, height: 250, angle: globAngle, color: isDoor ? "#00d2ff" : "#ff00ff",
          isDoor: isDoor, labelEN: isDoor ? "Kantorek Door" : "Kantorek Wall", textureFront: item.quadTextures['Out' + subIdx], textureBack: item.quadTextures['In' + subIdx],
          textureFrontName: item.quadTextures['Out' + subIdx + 'Name'], textureBackName: item.quadTextures['In' + subIdx + 'Name'], isFoldable: false, thickness: 12, isFlipped: false,
          leftFoot: wFlags.leftFoot, rightFoot: wFlags.rightFoot
        });
      };

      let doorIdx = dOp ? 1 : 3;

      addVirtualWall(doorIdx === 1, 0, -44, 180, 1);
      addVirtualWall(false, 56, 0, 270, 2);
      addVirtualWall(doorIdx === 3, 0, 44, 0, 3);
      addVirtualWall(false, -56, 0, 90, 4);

      if (DB['sego100x250'] && DB['door100']) {
        addItemToBom(DB['sego100x250'].name, 4, DB['sego100x250'].price, counts);
        addItemToBom(DB['door100'].name, 1, DB['door100'].price, counts);
        addItemToBom(DB.miniFoot.name, 4, DB.miniFoot.price, counts);
        // 8 łączników kątowych dla presetowanego kantorka (klawisz K)
        addItemToBom(DB.wewzew.name, 8, DB.wewzew.price, counts);
        baseCost += (DB['sego100x250'].price * 4) + DB['door100'].price + (DB.miniFoot.price * 4) + (DB.wewzew.price * 8);
      }

      x = nextX;
      y = nextY;
      currentAngle = nextAngle;

      let wBox = item.rotation === 0 ? 124 : 100;
      let hBox = item.rotation === 0 ? 100 : 124;
      minX = Math.min(minX, fx - wBox / 2); maxX = Math.max(maxX, fx + wBox / 2);
      minY = Math.min(minY, fy - hBox / 2); maxY = Math.max(maxY, fy + hBox / 2);

      // Dodaj 4 narożniki kantorka jako węzły (nodes) i stwórz dla nich jointy
      let cBoxW = item.rotation === 0 ? 56 : 50;
      let cBoxH = item.rotation === 0 ? 50 : 56;
      let corners = [
        { x: fx - cBoxW, y: fy - cBoxH, angle: item.rotation === 0 ? 180 : 270 },
        { x: fx + cBoxW, y: fy - cBoxH, angle: item.rotation === 0 ? 270 : 0 },
        { x: fx + cBoxW, y: fy + cBoxH, angle: item.rotation === 0 ? 0 : 90 },
        { x: fx - cBoxW, y: fy + cBoxH, angle: item.rotation === 0 ? 90 : 180 }
      ];
      corners.forEach(c => {
        nodes.push({ x: c.x, y: c.y, angle: c.angle, isFlipped: false });
        let nodeIdx = nodes.length - 1;
        createJoint(layer, c.x, c.y, nodeIdx);
      });

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

          if (cType === 'zew-zew') { sV1 = offset; sV2 = offset; }
          else if (cType === 'wew-zew-1') { sV1 = -offset; sV2 = offset; }
          else if (cType === 'wew-zew-2') { sV1 = offset; sV2 = -offset; }

          let isBranchingFromStart = false;
          for (let w of placedWalls) {
            if (Math.abs(pendingTurnItem.cornerX - w.startX) < 1 && Math.abs(pendingTurnItem.cornerY - w.startY) < 1) {
              isBranchingFromStart = true; break;
            }
          }
          if (isBranchingFromStart) sV1 = -sV1;

          tempX = pendingTurnItem.cornerX + sV1 * Math.cos(rad1) + sV2 * Math.cos(rad2);
          tempY = pendingTurnItem.cornerY + sV1 * Math.sin(rad1) + sV2 * Math.sin(rad2);
        } else if (lastItemType === 'wall' || lastItemType === 'jump') {
          // Połączenie na prosto (180 deg / kolinearne) - dodaj 3mm (0.3cm) odstępu
          let radCol = currentAngle * Math.PI / 180;
          tempX += 0.3 * Math.cos(radCol);
          tempY += 0.3 * Math.sin(radCol);
        }

        let rad = currentAngle * Math.PI / 180;
        let nX = tempX + item.length * Math.cos(rad);
        let nY = tempY + item.length * Math.sin(rad);

        let collision = false;
        let m = 2;
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

      x = res.endX;
      y = res.endY;
      prevWallAngle = currentAngle;

      if (pendingTurnItem) {
        let toggleBtn = document.createElement('div');
        toggleBtn.className = 'turn-toggle-btn';

        let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
        let rad2 = pendingTurnItem.currAngle * Math.PI / 180;

        let offX = Math.cos(rad1) - Math.cos(rad2);
        let offY = Math.sin(rad1) - Math.sin(rad2);
        if (Math.abs(offX) < 0.01 && Math.abs(offY) < 0.01) { offX = 1; offY = -1; }
        let len = Math.sqrt(offX * offX + offY * offY);

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
        if (lastItemType === 'wall' || lastItemType === 'jump') {
          addItemToBom("Foldable set 180° connector", 2, 4, counts); baseCost += (2 * 4);
        } else if (lastItemType === 'turn' && pendingTurn90) {
          addItemToBom("Foldable set 90deg connector", 2, 4, counts); baseCost += (2 * 4); pendingTurn90 = false;
        }
      }

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
      let wFlags = feetFlags[index] || { leftFoot: true, rightFoot: true };
      computed3DData.push({ type: 'wall', planIndex: index, cx: wallStartX + (x - wallStartX) / 2 - stageCenterStartX, cz: wallStartY + (y - wallStartY) / 2 - stageCenterStartY, length: item.length, height: item.height, angle: currentAngle, color: item.color, isDoor: item.isDoor, labelEN: item.labelEN, textureFront: item.textureFront, textureBack: item.textureBack, textureFrontName: item.textureFrontName, textureBackName: item.textureBackName, isFoldable: item.isFoldable, thickness: item.thickness, isFlipped: item.isFlipped, leftFoot: wFlags.leftFoot, rightFoot: wFlags.rightFoot, elevation: item.elevation || 0, isStacked: item.isStacked || false });

      item.endNodeIndex = thisNodeIndex;
      if (item.isFlipped === undefined) {
        item.isFlipped = typeof currentDrawingFlipped !== 'undefined' ? currentDrawingFlipped : false;
      }
      let currentWallIndex = placedWalls.length;
      for (let i = 0; i < currentWallIndex; i++) {
        if (Math.hypot(x - placedWalls[i].startX, y - placedWalls[i].startY) < 15) {
          if (!item.isFoldable) {
            addItemToBom(DB.wewzew.name, 2, DB.wewzew.price, counts); baseCost += (2 * DB.wewzew.price);
          } else {
            addItemToBom("Foldable set 90deg connector", 2, 4, counts); baseCost += (2 * 4);
          }
          if (currentWallIndex - i === 3) {
            let doorFound = item.isDoor;
            for (let j = i; j <= currentWallIndex; j++) {
              if (placedWalls[j] && placedWalls[j].isDoor) doorFound = true;
            }
            if (doorFound) {
              kantorekCount++;
              manualKantorekWallIndices.add(index);
              for (let j = i; j < currentWallIndex; j++) {
                if (placedWalls[j] && placedWalls[j].planIndex !== undefined) {
                  manualKantorekWallIndices.add(placedWalls[j].planIndex);
                }
              }
            }
          }
        }
      }

      placedWalls.push({ startX: wallStartX, startY: wallStartY, endX: x, endY: y, isDoor: item.isDoor, planIndex: index });

      let cx = wallStartX + (x - wallStartX) / 2;
      let cy = wallStartY + (y - wallStartY) / 2;

      let thick = item.thickness || 12;
      let wall = document.createElement('div');
      wall.className = 'sego-wall' + (selectedItemIndex === index ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
      wall.style.width = item.length + 'px';
      wall.style.height = thick + 'px';
      wall.style.left = wallStartX + 'px';
      wall.style.top = (wallStartY - (thick / 2)) + 'px';
      wall.style.transformOrigin = '0 50%';
      wall.style.transform = `rotate(${currentAngle}deg)`;

      const isBW = typeof showModuleListMode !== 'undefined' && showModuleListMode === 'bw';
      if (isBW) {
        wall.style.borderColor = '#000000';
        wall.style.backgroundColor = '#000000';
        wall.style.boxShadow = 'none';
        wall.style.color = '#ffffff';
      } else {
        if (item.color) { wall.style.borderColor = item.color; wall.style.boxShadow = `0 0 8px ${item.color}`; }
      }
      let textRot = (currentAngle % 360 >= 90 && currentAngle % 360 <= 270) ? 180 : 0;
      let heightLabel = item.height === 300 ? `<br><span style="font-size:8px;color:${isBW ? '#888888' : item.color};">3m</span>` : '';
      if (item.elevation) heightLabel += `<br><span style="font-size:7px;color:#ffcc00;">⬆️+${item.elevation}</span>`;
      wall.innerHTML = `<span style="transform: rotate(${textRot}deg); pointer-events: none; text-align:center; line-height:1;">${item.length}${heightLabel}</span>`;
      wall.onclick = (e) => selectItem(index, e);
      layer.appendChild(wall);

      createJoint(layer, x, y, typeof thisNodeIndex !== 'undefined' ? thisNodeIndex : 0);

      if (item.isDoor) {
        let doorCtrl = document.createElement('div');
        doorCtrl.className = 'acc-controls';
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

      if (item.accessories && item.accessories.length > 0) {
        // Pre-calculate wall accessories collisions
        let wallAccs = item.accessories.filter(a => a.id !== 'daszek' && a.id !== 'daszek100x200');
        let wallCollisions = new Set();
        if (window.checkAccessoriesCollisions) {
          wallCollisions = window.checkAccessoriesCollisions(wallAccs, item.height || 250);
        }

        item.accessories.forEach((acc, accIdx) => {
          let effectiveDir = item.isFlipped ? -acc.dir : acc.dir;

          if (acc.id === 'daszek' || acc.id === 'daszek100x200') {
            let roofModule = acc.id === 'daszek100x200' ? DB.sego100x200 : DB.sego100x250;
            let roofLen = acc.roofLength || (acc.id === 'daszek100x200' ? 200 : 250);
            let roofName = acc.id === 'daszek100x200' ? "- Daszek: Moduł 100x200 (Dach)" : "- Daszek: Moduł 100x250 (Dach)";

            let legPrice = item.height === 300 ? DB.sego100x300.price : DB.sego100x250.price;
            let legName = item.height === 300 ? DB.sego100x300.name : DB.sego100x250.name;
            addItemToBom(roofName, 1, roofModule.price, counts);
            addItemToBom(`- Daszek: ${legName} (Noga)`, 1, legPrice, counts);
            addItemToBom("- Daszek: Bridge Connector", 4, DB.bridge.price, counts);
            baseCost += roofModule.price + legPrice + (4 * DB.bridge.price);

            let dAngle = effectiveDir === 1 ? 0 : 180;
            let finalAngle = currentAngle + dAngle;
            computed3DData.push({ type: 'daszek', planIndex: index, accIndex: accIdx, accData: acc, cx: cx - stageCenterStartX, cz: cy - stageCenterStartY, wallHeight: item.height, angle: finalAngle, labelEN: acc.labelEN });

            let daszekEl = document.createElement('div');
            daszekEl.className = 'sego-daszek' + (selectedItemIndex === `daszek_${index}_${accIdx}` ? ' selected' : '') + (isMultiSel(index) ? ' multi-selected' : '');
            daszekEl.onclick = (e) => selectItem(`daszek_${index}_${accIdx}`, e);

            const startOffset = 6;
            const daszekX = cx - startOffset * Math.sin(finalAngle * Math.PI / 180);
            const daszekY = cy + startOffset * Math.cos(finalAngle * Math.PI / 180);

            daszekEl.style.width = '100px'; daszekEl.style.height = roofLen + 'px'; daszekEl.style.left = daszekX + 'px'; daszekEl.style.top = daszekY + 'px'; daszekEl.style.marginLeft = '-50px'; daszekEl.style.transformOrigin = '50% 0'; daszekEl.style.transform = `rotate(${finalAngle}deg)`;
            if (isBW) {
              daszekEl.style.backgroundColor = '#111111';
              daszekEl.style.borderColor = '#000000';
              daszekEl.style.borderTopColor = '#000000';
              daszekEl.style.borderBottomColor = '#000000';
            }
            let dRad = finalAngle * Math.PI / 180; let dEndX = daszekX - roofLen * Math.sin(dRad); let dEndY = daszekY + roofLen * Math.cos(dRad);
            minX = Math.min(minX, dEndX - 50); maxX = Math.max(maxX, dEndX + 50); minY = Math.min(minY, dEndY - 50); maxY = Math.max(maxY, dEndY + 50);
            daszekEl.innerHTML = `<div class="acc-controls"><span class="acc-btn" onclick="toggleAccDir(${index}, ${accIdx}, event)">🔄</span><span class="acc-btn" onclick="removeAccessory(${index}, ${accIdx}, event)" style="color:#ff5555">❌</span></div>`;
            layer.appendChild(daszekEl);

            if (!acc.accessories) acc.accessories = [];
            
            // Pre-calculate leg accessories collisions
            let legCollisions = new Set();
            if (window.checkAccessoriesCollisions) {
              legCollisions = window.checkAccessoriesCollisions(acc.accessories, item.height || 250);
            }

            acc.accessories.forEach((legAcc, legAccIdx) => {
              addItemToBom(legAcc.name, 1, legAcc.price, counts); baseCost += legAcc.price;

              let legX = daszekX - (roofLen + 6) * Math.sin(dRad);
              let legY = daszekY + (roofLen + 6) * Math.cos(dRad);
              
              let hasColl = legCollisions.has(legAccIdx);
              computed3DData.push({ type: 'accessory', id: legAcc.id, accData: legAcc, cx: legX - stageCenterStartX, cz: legY - stageCenterStartY, wallHeight: item.height, wallAngle: finalAngle, dir: legAcc.dir, labelEN: legAcc.labelEN, hasCollision: hasColl });

              let accEl = document.createElement('div'); accEl.className = 'sego-accessory'; accEl.style.width = '24px'; accEl.style.height = '24px';
              let offsetRad = (finalAngle + (legAcc.dir === 1 ? 90 : -90)) * Math.PI / 180;
              let accX = legX + 18 * Math.cos(offsetRad); let accY = legY + 18 * Math.sin(offsetRad);

              accEl.style.left = (accX - 12) + 'px'; accEl.style.top = (accY - 12 - (legAccIdx * 5)) + 'px';
              if (isBW || hasColl) {
                accEl.style.background = hasColl ? '#ff2222' : '#222222';
                accEl.style.border = hasColl ? '1px solid #ff0000' : '1px solid #000000';
                accEl.style.boxShadow = hasColl ? '0 0 8px #ff0000' : 'none';
                accEl.style.color = '#ffffff';
              } else {
                accEl.style.background = legAcc.color;
                accEl.style.boxShadow = `0 0 8px ${legAcc.color}`;
              }
              accEl.innerHTML = `<div class="acc-controls"><span class="acc-btn" onclick="window.showHeightSlider(${index}, ${legAccIdx}, true, event)" style="font-size: 14px;" title="Ustaw wysokość">📏</span><span class="acc-btn" onclick="toggleLegAccDir(${index}, ${accIdx}, ${legAccIdx}, event)">🔄</span><span class="acc-btn" onclick="removeLegAccessory(${index}, ${accIdx}, ${legAccIdx}, event)" style="color:#ff5555">❌</span></div><span style="transform: rotate(${textRot}deg); pointer-events: none;">${legAcc.short}</span>`;
              layer.appendChild(accEl);
            });
          } else {
            addItemToBom(acc.name, 1, acc.price, counts); baseCost += acc.price;
            
            let wallIdx = wallAccs.indexOf(acc);
            let hasColl = wallIdx !== -1 && wallCollisions.has(wallIdx);
            computed3DData.push({ type: 'accessory', id: acc.id, accData: acc, cx: cx - stageCenterStartX, cz: cy - stageCenterStartY, wallHeight: item.height, wallAngle: currentAngle, dir: effectiveDir, labelEN: acc.labelEN, hasCollision: hasColl });

            let accEl = document.createElement('div'); accEl.className = 'sego-accessory'; accEl.style.width = '24px'; accEl.style.height = '24px';

            let offsetRad = (currentAngle + (effectiveDir === 1 ? 90 : -90)) * Math.PI / 180;
            let accX = cx + 18 * Math.cos(offsetRad); let accY = cy + 18 * Math.sin(offsetRad);
            accEl.style.left = (accX - 12) + 'px'; accEl.style.top = (accY - 12 - (accIdx * 5)) + 'px';
            if (isBW || hasColl) {
              accEl.style.background = hasColl ? '#ff2222' : '#222222';
              accEl.style.border = hasColl ? '1px solid #ff0000' : '1px solid #000000';
              accEl.style.boxShadow = hasColl ? '0 0 8px #ff0000' : 'none';
              accEl.style.color = '#ffffff';
            } else {
              accEl.style.background = acc.color;
              accEl.style.boxShadow = `0 0 8px ${acc.color}`;
            }
            accEl.innerHTML = `<div class="acc-controls"><span class="acc-btn" onclick="window.showHeightSlider(${index}, ${accIdx}, false, event)" style="font-size: 14px;" title="Ustaw wysokość">📏</span><span class="acc-btn" onclick="toggleAccDir(${index}, ${accIdx}, event)">🔄</span><span class="acc-btn" onclick="removeAccessory(${index}, ${accIdx}, event)" style="color:#ff5555">❌</span></div><span style="transform: rotate(${textRot}deg); pointer-events: none;">${acc.short}</span>`;
            layer.appendChild(accEl);
          }
        });
      }

      lastItemType = 'wall'; addItemToBom(item.name, 1, item.price, counts); baseCost += item.price;
      if (item.elevation > 0 || item.isStacked) {
        if (DB.segoStackConn) {
          addItemToBom(DB.segoStackConn.name, 2, DB.segoStackConn.price, counts);
          baseCost += (2 * DB.segoStackConn.price);
        }
      }
      if (item.isDoor) {
        let frameMod = item.height === 300 ? DB.sego100x300 : DB.sego100x250;
        addItemToBom(frameMod.name, 1, frameMod.price, counts); baseCost += frameMod.price;
      }
      // Stopki dla standardowej ściany - USUNIĘTO (mini stopy tylko przy kantorkach)

    } else if (item.type === 'turn') {
      if (!item.cornerType) item.cornerType = 'wew-zew-1';
      item.prevAngle = currentAngle; currentAngle += item.angle; item.currAngle = currentAngle; item.cornerX = x; item.cornerY = y;
      lastItemType = 'turn'; if (Math.abs(item.angle) === 90) pendingTurn90 = true; pendingTurnItem = item;

    } else if (item.type === 'jump') {
      if (item.x !== undefined && item.y !== undefined) {
        x = item.x;
        y = item.y;
        currentAngle = item.angle !== undefined ? item.angle : 0;
        prevWallAngle = currentAngle;
        currentDrawingFlipped = false;
        
        nodes.push({ x: x, y: y, angle: currentAngle, isFlipped: false });
        let thisNodeIndex = nodes.length - 1;
        createJoint(layer, x, y, thisNodeIndex);
      } else {
        let targetNode = nodes[item.target];
        if (targetNode) {
          x = targetNode.x; y = targetNode.y; currentAngle = targetNode.angle; prevWallAngle = currentAngle;

          currentDrawingFlipped = targetNode.isFlipped || false;
          let isStartNode = false;
          for (let w of placedWalls) {
            if (Math.abs(x - w.startX) < 1 && Math.abs(y - w.startY) < 1) {
              isStartNode = true; break;
            }
          }
          if (isStartNode) currentDrawingFlipped = !currentDrawingFlipped;
        }
      }

      lastItemType = 'jump'; pendingTurn90 = false;
      pendingTurnItem = null;
    }
  }

  let cursorX = x, cursorY = y, cursorAngle = currentAngle;
  if (selectedItemIndex !== null && plan[selectedItemIndex] && plan[selectedItemIndex].type === 'wall' && plan[selectedItemIndex].endNodeIndex !== undefined) {
    let targetNode = nodes[plan[selectedItemIndex].endNodeIndex];
    if (targetNode) { cursorX = targetNode.x; cursorY = targetNode.y; cursorAngle = targetNode.angle; }
  }
  window.currentCursorAngle = cursorAngle;

  let cursor = document.createElement('div'); cursor.className = 'build-cursor';
  cursor.style.left = cursorX + 'px'; cursor.style.top = cursorY + 'px';
  cursor.style.transform = `translate(-50%, -50%) rotate(${cursorAngle}deg)`; layer.appendChild(cursor);

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

  if (kantorekCount > 0) {
    addItemToBom(DB.miniFoot.name, 4 * kantorekCount, DB.miniFoot.price, counts); baseCost += (4 * kantorekCount * DB.miniFoot.price);
  }

  // Po zbudowaniu manualKantorekWallIndices: wyzeruj stopy 3D dla ścian należących do ręcznego kantorka
  if (manualKantorekWallIndices.size > 0) {
    for (let d3 of computed3DData) {
      if (d3.type === 'wall' && d3.quadIdx === undefined && manualKantorekWallIndices.has(d3.planIndex)) {
        d3.leftFoot = false;
        d3.rightFoot = false;
      }
    }
  }

  if (currentSystem === 'foldable' && typeof foldablePlanes !== 'undefined' && foldablePlanes.length > 0) {
    foldablePlanes.forEach(plane => {
      let totalLen = plane.walls.reduce((sum, w) => sum + w.length, 0);
      let leaderItem = plane.walls[0];
      let fSet = (plan[leaderItem.planIndex] && plan[leaderItem.planIndex].foldableSettings) ? plan[leaderItem.planIndex].foldableSettings : { div: 'seamless', side: 'double', hasPrint: false };

      if (fSet.hasPrint) {
        let multiplier = (fSet.side === 'double') ? 2 : 1;

        const addPrintToBom = (width) => {
          let name = `Wydruk Foldable ${width}x250`;
          let area = (width / 100) * 2.5;
          let price = area * 24;
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

  const plnInput = document.getElementById('rate-pln');
  const usdInput = document.getElementById('rate-usd');
  const currentRatePLN = plnInput ? parseFloat(plnInput.value) : 4.20;
  const currentRateUSD = usdInput ? parseFloat(usdInput.value) : 1.15;

  window.KURS_PLN_DYNAMIC = currentRatePLN;
  window.KURS_USD_DYNAMIC = currentRateUSD;

  if (typeof refreshManualPanel === 'function') refreshManualPanel();
  for (let key in manualItems) {
    let item = manualItems[key];
    let qty = (item && typeof item === 'object') ? item.qty : item;
    if (qty > 0) {
      if (item && typeof item === 'object') {
        let mult = item.multiplier || 2.8;
        let plnSalesPrice = item.plnMargin * mult;
        let eurPrice = plnSalesPrice / currentRatePLN;
        addItemToBom(item.name, qty, eurPrice, counts);
        baseCost += (eurPrice * qty);
      } else if (DB[key]) {
        addItemToBom(DB[key].name, qty, DB[key].price, counts);
        baseCost += (DB[key].price * qty);
      }
    }
  }

  const discount = parseFloat(document.getElementById('discountInput').value) || 0;
  const finalEUR = baseCost * (1 - discount / 100);

  const finalPLN = finalEUR * currentRatePLN;
  const finalUSD = finalEUR * currentRateUSD;

  globalWidth = Math.ceil((placedWalls.length > 0 ? (maxX - minX) + 12 : 0) / 50) * 50;
  globalDepth = Math.ceil((placedWalls.length > 0 ? (maxY - minY) + 12 : 0) / 50) * 50;

  if (floorBounds && placedWalls.length > 0) {
    if (minX < floorBounds.minX || maxX > floorBounds.maxX || minY < floorBounds.minY || maxY > floorBounds.maxY) {
      isOutOfBounds = true;
    }
  }
  globalCounts = counts; globalTotalEUR = finalEUR; globalTotalPLN = finalPLN;

  document.getElementById('valPLN').innerHTML = `<b>${Math.round(finalPLN).toLocaleString()} PLN</b>`;
  document.getElementById('valUSD').innerHTML = `<b>${Math.round(finalUSD).toLocaleString()} $</b>`;

  let bomHTML = '';
  for (let name in counts) {
    let cssClass = ""; if (name.includes("Kantorek")) cssClass = "highlight"; else if (name.includes("Cable")) cssClass = "warn"; else if (name.startsWith("- ")) cssClass = "sub-item";
    if (counts[name].unitPrice === 0 && counts[name].total === 0) { bomHTML += `<div class="bom-item highlight" style="margin-top:8px; border-bottom: 1px solid #444; padding-bottom: 4px;"><span><b>${name}</b></span><span></span></div>`; }
    else { bomHTML += `<div class="bom-item ${cssClass}"><span>${counts[name].qty}x ${name}</span> <span>${Math.round(counts[name].total)} €</span></div>`; }
  }
  if (typeof currentSystem === 'undefined' || currentSystem !== 'kasetony_niestandardowe') {
    document.getElementById('bomList').innerHTML = bomHTML || '<center style="color:#444">Projekt pusty</center>';
    document.getElementById('totalPrice').innerText = Math.round(finalEUR).toLocaleString() + ' €';

    // Assign letters A-Z dynamically for the current state of computed3DData
    const tempWallLetters = new Map();
    const tempModules = [];
    
    computed3DData.forEach(d3 => {
      if (d3.type === 'wall') {
        tempModules.push({ itemIndex: d3.planIndex, part: 'wall', cx: d3.cx, key: d3 });
      } else if (d3.type === 'daszek') {
        let rot = -d3.angle * Math.PI / 180;
        let roofLen = (d3.accData && d3.accData.roofLength) ? d3.accData.roofLength : 250;
        tempModules.push({ itemIndex: d3.planIndex, part: 'roof', cx: d3.cx + (roofLen / 2 + 6) * Math.sin(rot) });
        tempModules.push({ itemIndex: d3.planIndex, part: 'leg', cx: d3.cx + (roofLen + 12) * Math.sin(rot) });
      }
    });
    
    tempModules.sort((a, b) => a.cx - b.cx);
    
    tempModules.forEach((mod, idx) => {
      const letter = String.fromCharCode(65 + idx % 26);
      if (mod.part === 'wall') {
        tempWallLetters.set(mod.key, letter);
        tempWallLetters.set(mod.itemIndex + '_wall', letter);
      } else {
        tempWallLetters.set(mod.itemIndex + '_' + mod.part, letter);
      }
    });

    // Scan accessories layout positions
    const shelfDetails = [];
    const tvDetails = [];
    
    plan.forEach((item, pIdx) => {
      if (item.type === 'wall') {
        const wallLetter = tempWallLetters.get(pIdx + '_wall') || 'A';
        
        if (item.accessories) {
          item.accessories.forEach(acc => {
            if (acc.id === 'shelfKit' || acc.id === 'tvPanel') {
              const side = acc.dir === 1 ? 'front' : 'tył';
              const y = acc.heightCm !== undefined ? acc.heightCm : (acc.heightPct !== undefined ? Math.round(item.height * acc.heightPct / 100) : Math.round(item.height / 2));
              const desc = `moduł ${wallLetter} ${side} / wys: ${y}cm`;
              if (acc.id === 'shelfKit') shelfDetails.push(desc);
              if (acc.id === 'tvPanel') tvDetails.push(desc);
            }
            if (acc.id === 'daszek' || acc.id === 'daszek100x200') {
              const legLetter = tempWallLetters.get(pIdx + '_leg') || 'A';
              if (acc.accessories) {
                acc.accessories.forEach(legAcc => {
                  if (legAcc.id === 'shelfKit' || legAcc.id === 'tvPanel') {
                    const side = legAcc.dir === 1 ? 'front' : 'tył';
                    const y = legAcc.heightCm !== undefined ? legAcc.heightCm : (legAcc.heightPct !== undefined ? Math.round(item.height * legAcc.heightPct / 100) : Math.round(item.height / 2));
                    const desc = `moduł ${legLetter} ${side} / wys: ${y}cm`;
                    if (legAcc.id === 'shelfKit') shelfDetails.push(desc);
                    if (legAcc.id === 'tvPanel') tvDetails.push(desc);
                  }
                });
              }
            }
          });
        }
      }
    });

    const formatDetails = (list) => list.map((d, i) => `#${i + 1} - ${d}`).join(' / ');

    let bomItems = [];
    for (let name in counts) {
      if (counts[name].qty > 0) {
        let intranetId = null;

        for (let key in manualItems) {
          let mItem = manualItems[key];
          if (mItem && typeof mItem === 'object' && mItem.name === name) {
            intranetId = mItem.intranetId || null;
            break;
          }
        }

        if (!intranetId && typeof DB !== 'undefined') {
          for (let key in DB) {
            if (DB[key].name === name) {
              intranetId = DB[key].intranetId || DB[key].catNo || null;
              break;
            }
          }
        }

        if (!intranetId && window.KASETON_PRICES && window.KASETON_PRICES[name]) {
          intranetId = window.KASETON_PRICES[name].intranetId || null;
        }

        let description = '';
        if (typeof DB !== 'undefined') {
          if (name === DB.shelfKit.name && shelfDetails.length > 0) {
            description = formatDetails(shelfDetails);
          } else if (name === DB.tvPanel.name && tvDetails.length > 0) {
            description = formatDetails(tvDetails);
          }
        }
        
        counts[name].description = description;

        bomItems.push({
          name: name,
          qty: counts[name].qty,
          intranetId: intranetId,
          description: description
        });
      }
    }
    window.lastGeneratedBOM = bomItems;

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
  // --- RENDEROWANIE ALEJEK 2D (BETON 300 cm ciągnący się przez halę) ---
  if (typeof window.showHallEnvironment !== 'undefined' && window.showHallEnvironment) {
    let minX2 = minX, maxX2 = maxX, minY2 = minY, maxY2 = maxY;
    if (typeof floorConfig !== 'undefined' && floorConfig.type !== 'none' && floorConfig.width > 0 && floorConfig.depth > 0) {
      let fx1 = stageCenterStartX + floorConfig.offsetX - floorConfig.width / 2;
      let fx2 = stageCenterStartX + floorConfig.offsetX + floorConfig.width / 2;
      let fy1 = stageCenterStartY + floorConfig.offsetY - floorConfig.depth / 2;
      let fy2 = stageCenterStartY + floorConfig.offsetY + floorConfig.depth / 2;

      minX2 = minX !== Infinity ? Math.min(minX, fx1) : fx1;
      maxX2 = maxX !== -Infinity ? Math.max(maxX, fx2) : fx2;
      minY2 = minY !== Infinity ? Math.min(minY, fy1) : fy1;
      maxY2 = maxY !== -Infinity ? Math.max(maxY, fy2) : fy2;
    }

    const bMinX2D = (minX2 !== Infinity) ? minX2 : stageCenterStartX - 150;
    const bMaxX2D = (maxX2 !== -Infinity) ? maxX2 : stageCenterStartX + 150;
    const bMinY2D = (minY2 !== Infinity) ? minY2 : stageCenterStartY - 150;
    const bMaxY2D = (maxY2 !== -Infinity) ? maxY2 : stageCenterStartY + 150;

    const aisleW = 300; // Rozszerzenie alejek do 3m
    const aisleGap = 50; // Odsunięcie 50 cm od obrysu stoiska/podłogi
    const inf2D = 4000; // Długie aleje w nieskończoność
    const isBW = typeof showModuleListMode !== 'undefined' && showModuleListMode === 'bw';
    const aisleBg = isBW ? 'rgba(50, 50, 50, 0.15)' : 'rgba(100, 110, 120, 0.15)';
    const aisleBorder = isBW ? '1px dashed #666' : '1px dashed #6c757d';
    const aisleTextColor = isBW ? '#555' : '#a0aab2';

    const create2DAisle = (left, top, w, h, text) => {
      let el = document.createElement('div');
      el.className = 'aisle-2d-strip';
      el.style.cssText = `position:absolute; left:${left}px; top:${top}px; width:${w}px; height:${h}px; background:${aisleBg}; border:${aisleBorder}; pointer-events:none; z-index:0; display:flex; align-items:center; justify-content:center; color:${aisleTextColor}; font-size:11px; font-weight:bold; letter-spacing:1px; font-family:'Segoe UI', sans-serif; box-sizing:border-box;`;
      el.innerHTML = `<span style="opacity:0.7;">🚶 ${text}</span>`;
      layer.appendChild(el);
    };

    const midX2D = (bMinX2D + bMaxX2D) / 2;
    const midY2D = (bMinY2D + bMaxY2D) / 2;

    // Góra (Północ)
    create2DAisle(midX2D - inf2D / 2, bMinY2D - aisleGap - aisleW, inf2D, aisleW, 'ALEJKA BETON 300 cm');
    // Dół (Południe)
    create2DAisle(midX2D - inf2D / 2, bMaxY2D + aisleGap, inf2D, aisleW, 'ALEJKA BETON 300 cm');
    // Lewa (Zachód)
    create2DAisle(bMinX2D - aisleGap - aisleW, midY2D - inf2D / 2, aisleW, inf2D, 'ALEJKA BETON 300 cm');
    // Prawa (Wschód)
    create2DAisle(bMaxX2D + aisleGap, midY2D - inf2D / 2, aisleW, inf2D, 'ALEJKA BETON 300 cm');
  }

  if (placedWalls.length > 0) {
    const totalW = maxX - minX;
    const totalD = maxY - minY;
    const aisleW = 300; const aisleGap = 50;
    let lineW = document.createElement('div');
    lineW.className = 'total-dim-2d';
    lineW.style.cssText = `position:absolute; border-bottom:2px solid var(--highlight); width:${totalW}px; left:${minX}px; top:${maxY + (window.showHallEnvironment ? aisleGap + aisleW : 0) + 20}px; text-align:center; padding-bottom:5px; color:var(--highlight); font-weight:bold; font-size:16px; pointer-events:none; z-index:1;`;
    lineW.innerText = `${totalW.toFixed(0)} cm`;
    layer.appendChild(lineW);

    let lineD = document.createElement('div');
    lineD.className = 'total-dim-2d';
    lineD.style.cssText = `position:absolute; border-right:2px solid var(--highlight); height:${totalD}px; left:${maxX + (window.showHallEnvironment ? aisleGap + aisleW : 0) + 20}px; top:${minY}px; display:flex; align-items:center; padding-left:10px; color:var(--highlight); font-weight:bold; font-size:16px; pointer-events:none; z-index:1;`;
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

  // --- REPREZENTACJA CZŁOWIEKA 2D NA MODELU 2D ---
  (function () {
    const stage = document.getElementById('stage');
    if (!stage) return;

    // Definiowanie globalnych metod zaznaczania i obracania człowieka
    window.selectHuman = function(e) {
      if (e) e.stopPropagation();
      window.isHumanSelected = true;
      selectedItemIndex = null;
      if (typeof selectedItemIndices !== 'undefined') selectedItemIndices.clear();
      render();
    };

    window.rotateHuman = function(e) {
      if (e) e.stopPropagation();
      let r = humanPos.rotation !== undefined ? humanPos.rotation : 180;
      humanPos.rotation = (r + 45) % 360;
      if (human3DModel) {
        human3DModel.rotation.y = humanPos.rotation * Math.PI / 180;
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }
      render();
    };

    const oldMan2D = document.getElementById('man2DElement');
    if (oldMan2D) oldMan2D.remove();

    const isSel = !!window.isHumanSelected;
    const rotation = humanPos.rotation !== undefined ? humanPos.rotation : 180;

    const man2D = document.createElement('div');
    man2D.id = 'man2DElement';
    man2D.style.position = 'absolute';
    man2D.style.width = '30px';
    man2D.style.height = '30px';
    man2D.style.borderRadius = '50%';
    man2D.style.backgroundColor = '#00ff88';
    man2D.style.border = isSel ? '3px solid #00ff88' : '2px solid #000';
    man2D.style.boxShadow = isSel ? '0 0 15px #00ff88, inset 0 0 5px #00ff88' : '0 0 10px #00ff88';
    man2D.style.cursor = 'move';
    man2D.style.zIndex = '99';
    man2D.style.display = 'flex';
    man2D.style.alignItems = 'center';
    man2D.style.justifyContent = 'center';

    let controlsHTML = '';
    if (isSel) {
      controlsHTML = `
        <div class="acc-controls" style="display: flex; position: absolute; top: -35px; left: 50%; transform: translateX(-50%); z-index: 100;">
          <span class="acc-btn" onclick="window.rotateHuman(event)" title="Obróć człowieka" style="background:#00ff88; color:#000; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:12px; border: 1px solid #000; font-weight:bold;">🔄</span>
        </div>
      `;
    }

    man2D.innerHTML = `
      <span style="pointer-events: none; display: block; transform: rotate(${rotation - 180}deg); font-size: 16px;">🧍</span>
      ${controlsHTML}
    `;

    let px = stageCenterStartX + humanPos.x;
    let py = stageCenterStartY + humanPos.z;

    man2D.style.left = (px - 15) + 'px';
    man2D.style.top = (py - 15) + 'px';

    man2D.onclick = function(e) {
      window.selectHuman(e);
    };

    man2D.onmousedown = function (e) {
      if (e.target.classList.contains('acc-btn')) return; // ignorowanie przeciągania na przycisku obrotu
      e.preventDefault();
      e.stopPropagation();
      window.selectHuman(e);
      
      let startX = e.clientX;
      let startY = e.clientY;
      let initX = humanPos.x;
      let initZ = humanPos.z;
      let vs = typeof viewScale !== 'undefined' ? viewScale : 1;

      function onMouseMove(event) {
        humanPos.x = initX + (event.clientX - startX) / vs;
        humanPos.z = initZ + (event.clientY - startY) / vs;

        let newPx = stageCenterStartX + humanPos.x;
        let newPy = stageCenterStartY + humanPos.z;
        man2D.style.left = (newPx - 15) + 'px';
        man2D.style.top = (newPy - 15) + 'px';

        // Aktualizacja pozycji modelu 3D w locie podczas przeciągania myszką
        if (human3DModel) {
          human3DModel.position.x = humanPos.x;
          human3DModel.position.z = humanPos.z;

          // REFRESH 3D: Wymuszamy na silniku przerysowanie okna 3D przy każdym ruchu myszy
          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        }
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        render();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    layer.appendChild(man2D);
  })();
  // Cleanup old 2D module list elements if any
  const oldSvg = document.getElementById('leaderLinesSvg');
  if (oldSvg) oldSvg.remove();
  const oldLabels = document.querySelectorAll('.draggable-module-label');
  oldLabels.forEach(l => l.remove());

  // If Module List Mode is active, generate 2D draggable overlays
  if (typeof showModuleListMode !== 'undefined' && showModuleListMode) {
      // Rebuild window.assignedModulesList first
      const modules = [];
      computed3DData.forEach(item => {
        if (item.type === 'wall') {
          modules.push({
            item: item,
            part: 'wall',
            cx: item.cx
          });
        } else if (item.type === 'daszek') {
          const rot = -item.angle * Math.PI / 180;
          modules.push({
            item: item,
            part: 'roof',
            cx: item.cx + 131 * Math.sin(rot)
          });
          modules.push({
            item: item,
            part: 'leg',
            cx: item.cx + 262 * Math.sin(rot)
          });
        }
      });

      modules.sort((a, b) => a.cx - b.cx);

      const wallLetters = new Map();
      modules.forEach((mod, index) => {
        const letter = String.fromCharCode(65 + index % 26);
        if (mod.part === 'wall') {
          wallLetters.set(mod.item, letter);
        } else {
          wallLetters.set(mod.item.planIndex + '_' + mod.part, letter);
        }
      });

      window.wallLetters = wallLetters;
      window.assignedModulesList = modules;

      // Draw 2D drag-and-drop overlays
      if (typeof draw2DModuleListLabels === 'function') {
        draw2DModuleListLabels(layer, stageCenterStartX, stageCenterStartY);
      }
  }

  if (is3DMode) update3DScene();
}

function recoverEngine() {
  document.getElementById('crash-screen').style.display = 'none';

  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }

  const container = document.getElementById('canvas-container');
  if (container) container.innerHTML = '';

  init3D();

  if (typeof render === 'function') {
    render();
  }

  console.log("Silnik 3D zrestartowany pomyślnie.");
}

function getWallPositions(testPlan) {
  const stage = document.getElementById('stage');
  const sWidth = stage ? (stage.clientWidth || window.innerWidth - 400) : (window.innerWidth - 400);
  const sHeight = stage ? (stage.clientHeight || window.innerHeight) : window.innerHeight;
  const stageCenterStartX = sWidth / 2 - 100;
  const stageCenterStartY = sHeight / 2 + 100;

  let x = stageCenterStartX, y = stageCenterStartY, angle = 0;
  let nodes = [{ x: x, y: y, angle: angle }];
  let walls = [];
  let pendingTurnItem = null;

  for (let index = 0; index < testPlan.length; index++) {
    let item = testPlan[index];
    if (item.type === 'turn') {
      item.prevAngle = angle;
      angle += item.angle;
      item.currAngle = angle;
      item.cornerX = x;
      item.cornerY = y;
      pendingTurnItem = item;
    } else if (item.type === 'jump') {
      if (item.x !== undefined && item.y !== undefined) {
        x = item.x;
        y = item.y;
        angle = item.angle !== undefined ? item.angle : 0;
        nodes.push({ x: x, y: y, angle: angle });
      } else {
        let targetNode = nodes[item.target];
        if (targetNode) { x = targetNode.x; y = targetNode.y; angle = targetNode.angle; }
      }
    } else if (item.type === 'wall') {
      if (item.offsetX !== undefined) {
        const rad = ((item.freeAngle || 0) * Math.PI) / 180;
        const halfL = item.length / 2;
        const fx = stageCenterStartX + item.offsetX;
        const fy = stageCenterStartY + item.offsetY;
        const epX1 = fx - halfL * Math.cos(rad);
        const epY1 = fy - halfL * Math.sin(rad);
        const epX2 = fx + halfL * Math.cos(rad);
        const epY2 = fy + halfL * Math.sin(rad);

        // Dodaj start i koniec wolnej ściany do nodes
        nodes.push({ x: epX1, y: epY1, angle: item.freeAngle || 0 });
        nodes.push({ x: epX2, y: epY2, angle: item.freeAngle || 0 });

        walls.push({
          planIndex: index,
          startX: epX1,
          startY: epY1,
          endX: epX2,
          endY: epY2,
          angle: item.freeAngle || 0,
          length: item.length,
          isFoldable: !!item.isFoldable
        });

        // --- ZACHOWAJ PRZERWĘ W ŁAŃCUCHU ---
        let tempX = x, tempY = y;
        if (pendingTurnItem) {
          let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
          let rad2 = pendingTurnItem.currAngle * Math.PI / 180;
          let offset = (item.thickness || 12) / 2;
          let sV1 = 0, sV2 = 0;
          let cType = pendingTurnItem.cornerType || 'wew-zew-1';

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

        let chainRad = angle * Math.PI / 180;
        x = tempX + item.length * Math.cos(chainRad);
        y = tempY + item.length * Math.sin(chainRad);
        nodes.push({ x: x, y: y, angle: angle });

        continue;
      }
      let tempX = x, tempY = y;
      if (pendingTurnItem) {
        let rad1 = pendingTurnItem.prevAngle * Math.PI / 180;
        let rad2 = pendingTurnItem.currAngle * Math.PI / 180;
        let offset = (item.thickness || 12) / 2;
        let sV1 = 0, sV2 = 0;
        let cType = pendingTurnItem.cornerType || 'wew-zew-1';

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

      walls.push({
        planIndex: index,
        startX: tempX,
        startY: tempY,
        endX: nX,
        endY: nY,
        angle: angle,
        length: item.length,
        isFoldable: !!item.isFoldable
      });
      x = nX;
      y = nY;
      nodes.push({ x: x, y: y, angle: angle });
    } else if (item.type === 'kantorek_1x1') {
      if (item.rotation === undefined) {
        item.rotation = (angle === 270 || angle === -90) ? -90 : 0;
      }

      let dOp = item.doorOpposite || false;
      let fx, fy, nextX, nextY, nextAngle;

      if (item.isFree) {
        fx = stageCenterStartX + item.offsetX;
        fy = stageCenterStartY + item.offsetY;
        nextX = x;
        nextY = y;
        nextAngle = angle;
      } else {
        if (item.rotation === 0) {
          fx = x + 62;
          fy = y + 44;
          nextX = fx + 56;
          nextY = fy + 50;
          nextAngle = 90;
        } else {
          fx = x + 44;
          fy = y - 62;
          nextX = fx + 50;
          nextY = fy - 56;
          nextAngle = 0;
        }
      }

      let rad = item.rotation * Math.PI / 180;

      const addVirtualWallPos = (locX, locZ, rotOffset, subIdx) => {
        let cx = fx + (locX * Math.cos(rad) - locZ * Math.sin(rad));
        let cy = fy + (locX * Math.sin(rad) + locZ * Math.cos(rad));
        let globAngle = ((item.rotation || 0) + rotOffset) % 360;
        if (globAngle < 0) globAngle += 360;
        
        let length = 100;
        let radW = globAngle * Math.PI / 180;
        
        let startX = cx - (length / 2) * Math.cos(radW);
        let startY = cy - (length / 2) * Math.sin(radW);
        let endX = cx + (length / 2) * Math.cos(radW);
        let endY = cy + (length / 2) * Math.sin(radW);
        
        walls.push({
          planIndex: index,
          quadIdx: subIdx,
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY,
          angle: globAngle,
          length: 100,
          isFoldable: false
        });
      };

      addVirtualWallPos(0, -44, 180, 1);
      addVirtualWallPos(56, 0, 270, 2);
      addVirtualWallPos(0, 44, 0, 3);
      addVirtualWallPos(-56, 0, 90, 4);

      // Dodaj 4 narożniki do nodes (identycznie jak w render)
      let cBoxW = item.rotation === 0 ? 56 : 50;
      let cBoxH = item.rotation === 0 ? 50 : 56;
      let corners = [
        { x: fx - cBoxW, y: fy - cBoxH, angle: item.rotation === 0 ? 180 : 270 },
        { x: fx + cBoxW, y: fy - cBoxH, angle: item.rotation === 0 ? 270 : 0 },
        { x: fx + cBoxW, y: fy + cBoxH, angle: item.rotation === 0 ? 0 : 90 },
        { x: fx - cBoxW, y: fy + cBoxH, angle: item.rotation === 0 ? 90 : 180 }
      ];
      corners.forEach(c => {
        nodes.push({ x: c.x, y: c.y, angle: c.angle });
      });

      x = nextX;
      y = nextY;
      angle = nextAngle;
      nodes.push({ x: x, y: y, angle: angle });
    }
  }
  return walls;
}

function computeWallFeetFlags(testPlan) {
  let walls = getWallPositions(testPlan);
  let flags = {};
  
  for (let w of walls) {
    let key = w.quadIdx !== undefined ? (w.planIndex + '_' + w.quadIdx) : w.planIndex;
    flags[key] = { leftFoot: true, rightFoot: true };
  }
  
  for (let i = 0; i < walls.length; i++) {
    let w1 = walls[i];
    for (let j = i + 1; j < walls.length; j++) {
      let w2 = walls[j];
      
      let diff = Math.abs(w1.angle - w2.angle) % 180;
      let is90deg = Math.abs(diff - 90) < 5 || Math.abs(diff - 270) < 5;
      
      if (is90deg) {
        let key1 = w1.quadIdx !== undefined ? (w1.planIndex + '_' + w1.quadIdx) : w1.planIndex;
        let key2 = w2.quadIdx !== undefined ? (w2.planIndex + '_' + w2.quadIdx) : w2.planIndex;

        let dSS = Math.hypot(w1.startX - w2.startX, w1.startY - w2.startY);
        let dSE = Math.hypot(w1.startX - w2.endX, w1.startY - w2.endY);
        let dES = Math.hypot(w1.endX - w2.startX, w1.endY - w2.startY);
        let dEE = Math.hypot(w1.endX - w2.endX, w1.endY - w2.endY);
        
        let conn = null;
        if (dSS < 15) conn = { w1Side: 'left', w2Side: 'left' };
        else if (dSE < 15) conn = { w1Side: 'left', w2Side: 'right' };
        else if (dES < 15) conn = { w1Side: 'right', w2Side: 'left' };
        else if (dEE < 15) conn = { w1Side: 'right', w2Side: 'right' };
        
        if (conn) {
          let w1Length = w1.length || 0;
          let w2Length = w2.length || 0;
          
          let removeW1 = false;
          if (w1Length < w2Length) {
            removeW1 = true;
          } else if (w2Length < w1Length) {
            removeW1 = false;
          } else {
            removeW1 = (w1.planIndex <= w2.planIndex);
          }
          
          if (removeW1) {
            if (conn.w1Side === 'left') flags[key1].leftFoot = false;
            else flags[key1].rightFoot = false;
          } else {
            if (conn.w2Side === 'left') flags[key2].leftFoot = false;
            else flags[key2].rightFoot = false;
          }
        }
      }
    }
  }
  
  return flags;
}

function draw2DModuleListLabels(layer, stageCenterStartX, stageCenterStartY) {
    const oldSvg = document.getElementById('leaderLinesSvg');
    if (oldSvg) oldSvg.remove();
    const oldLabels = document.querySelectorAll('.draggable-module-label');
    oldLabels.forEach(l => l.remove());

    if (!window.assignedModulesList || window.assignedModulesList.length === 0) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'leaderLinesSvg';
    svg.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1001;';
    layer.appendChild(svg);

    window.module2DOffsets = window.module2DOffsets || new Map();
    const totalModules = window.assignedModulesList.length;
    const isBW = typeof showModuleListMode !== 'undefined' && showModuleListMode === 'bw';

    window.assignedModulesList.forEach((mod, index) => {
        const item = mod.item;
        const part = mod.part;

        let letter = '';
        let widthCm = 0;
        let heightCm = 0;
        let isSego = false;
        let moduleId = '';
        let center = { x: 0, y: 0 };

        if (typeof currentSystem !== 'undefined' && (currentSystem === 'SEGO' || currentSystem === 'SEGO_2_0')) {
            isSego = true;
        }

        if (part === 'wall') {
            letter = window.wallLetters.get(item);
            widthCm = item.length;
            heightCm = item.height;
            moduleId = 'wall_' + item.planIndex;
            center.x = item.cx + stageCenterStartX;
            center.y = item.cz + stageCenterStartY;
        } else if (part === 'roof') {
            letter = window.wallLetters.get(item.planIndex + '_roof');
            widthCm = 100;
            heightCm = 250;
            moduleId = 'roof_' + item.planIndex;
            const dRad = item.angle * Math.PI / 180;
            center.x = item.cx + stageCenterStartX - 131 * Math.sin(dRad);
            center.y = item.cz + stageCenterStartY + 131 * Math.cos(dRad);
        } else if (part === 'leg') {
            letter = window.wallLetters.get(item.planIndex + '_leg');
            widthCm = 100;
            heightCm = item.wallHeight || 250;
            moduleId = 'leg_' + item.planIndex;
            const dRad = item.angle * Math.PI / 180;
            center.x = item.cx + stageCenterStartX - 262 * Math.sin(dRad);
            center.y = item.cz + stageCenterStartY + 262 * Math.cos(dRad);
        }

        let offset = window.module2DOffsets.get(moduleId);
        if (!offset) {
            const angle = (index * 2 * Math.PI) / totalModules - Math.PI / 2;
            const dist = 130;
            offset = { dx: dist * Math.cos(angle), dy: dist * Math.sin(angle) };
            window.module2DOffsets.set(moduleId, offset);
        }

        const sides = [];
        if (part === 'wall') {
            sides.push({ label: 'Przód', index: 1, fileName: item.textureFrontName, w: widthCm, h: heightCm });
            sides.push({ label: 'Tył', index: 2, fileName: item.textureBackName, w: widthCm, h: heightCm });
        } else if (part === 'roof') {
            const accData = item.accData || {};
            sides.push({ label: 'Góra', index: 1, fileName: accData.texRoofFrontName || (accData.texRoofFront ? 'Grafika' : null), w: widthCm, h: heightCm });
            sides.push({ label: 'Dół', index: 2, fileName: accData.texRoofBackName || (accData.texRoofBack ? 'Grafika' : null), w: widthCm, h: heightCm });
        } else if (part === 'leg') {
            const accData = item.accData || {};
            sides.push({ label: 'Przód', index: 1, fileName: accData.texLegFrontName || (accData.texLegFront ? 'Grafika' : null), w: widthCm, h: heightCm });
            sides.push({ label: 'Tył', index: 2, fileName: accData.texLegBackName || (accData.texLegBack ? 'Grafika' : null), w: widthCm, h: heightCm });
        }

        const labelEl = document.createElement('div');
        labelEl.className = 'draggable-module-label';
        labelEl.dataset.centerX = center.x;
        labelEl.dataset.centerY = center.y;
        labelEl.style.cssText = isBW ? `
            position: absolute;
            background: rgba(240, 240, 240, 0.95);
            border: 1px solid #555555;
            border-radius: 6px;
            padding: 6px 10px;
            color: #222222;
            font-family: 'Segoe UI', sans-serif;
            font-size: 11px;
            z-index: 1002;
            cursor: move;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            min-width: 140px;
            pointer-events: auto;
            user-select: none;
            backdrop-filter: blur(2px);
        ` : `
            position: absolute;
            background: rgba(10, 10, 15, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 6px 10px;
            color: #fff;
            font-family: 'Segoe UI', sans-serif;
            font-size: 11px;
            z-index: 1002;
            cursor: move;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6);
            min-width: 140px;
            pointer-events: auto;
            user-select: none;
            backdrop-filter: blur(2px);
        `;

        let sidesHTML = '';
        sides.forEach(s => {
            const gName = s.fileName ? s.fileName : 'Brak';
            let gross = '';
            if (isSego) {
                gross = `${(s.w * 10) + 7}x${(s.h * 10) + 7} mm`;
            } else {
                gross = `${s.w * 10}x${s.h * 10} mm`;
            }
            
            const textColor = isBW ? '#555555' : '#00d2ff';
            const fileNameColor = isBW ? '#777777' : '#aaa';
            sidesHTML += `
                <div style="margin-top: 3px; font-family: monospace; font-size: 9.5px; line-height: 1.2;">
                    <span style="color:${textColor}; font-weight:bold;">${letter}${s.index}: ${gross}</span> 
                    <span style="color:${fileNameColor};">[${gName}]</span>
                </div>
            `;
        });

        const headerColor = isBW ? '#222222' : '#ffffff';
        labelEl.innerHTML = `
            <div style="font-weight: bold; color: ${headerColor}; font-size: 12px; margin-bottom: 2px; text-shadow: ${isBW ? 'none' : '0 1px 2px rgba(0,0,0,0.8)'};">
                ${letter}: ${widthCm}x${heightCm} cm
            </div>
            <div class="label-underline" style="
                height: 2px;
                background: ${isBW ? '#555555' : '#39ff14'};
                margin: 4px -10px;
                box-shadow: ${isBW ? 'none' : '0 0 6px #39ff14'};
                border-radius: 1px;
            "></div>
            <div style="margin-top: 4px;">
                ${sidesHTML}
            </div>
        `;

        layer.appendChild(labelEl);

        requestAnimationFrame(() => {
            labelEl.style.left = (center.x + offset.dx - labelEl.offsetWidth / 2) + 'px';
            labelEl.style.top = (center.y + offset.dy - labelEl.offsetHeight / 2) + 'px';
            drawLeaderLines();
        });

        labelEl.onmousedown = function (e) {
            e.preventDefault(); e.stopPropagation();
            let startX = e.clientX;
            let startY = e.clientY;
            let initDx = offset.dx;
            let initDy = offset.dy;
            let vs = typeof viewScale !== 'undefined' ? viewScale : 1;

            function onMouseMove(event) {
                offset.dx = initDx + (event.clientX - startX) / vs;
                offset.dy = initDy + (event.clientY - startY) / vs;

                labelEl.style.left = (center.x + offset.dx - labelEl.offsetWidth / 2) + 'px';
                labelEl.style.top = (center.y + offset.dy - labelEl.offsetHeight / 2) + 'px';
                drawLeaderLines();
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
    });

    function drawLeaderLines() {
        svg.innerHTML = '';
        const labels = document.querySelectorAll('.draggable-module-label');
        labels.forEach(label => {
            const px = parseFloat(label.dataset.centerX);
            const py = parseFloat(label.dataset.centerY);
            const leftVal = parseFloat(label.style.left) || 0;
            const topVal = parseFloat(label.style.top) || 0;
            const wVal = label.offsetWidth || 0;
            const hVal = label.offsetHeight || 0;

            const underlineEl = label.querySelector('.label-underline');
            let uy = topVal + 22;
            if (underlineEl) {
                uy = topVal + underlineEl.offsetTop + underlineEl.offsetHeight / 2;
            }

            let anchorX = leftVal;
            if (leftVal + wVal / 2 < px) {
                anchorX = leftVal + wVal;
            }

            // 1. Leader Line: Solid line with glow or gray without glow
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${px} ${py} L ${anchorX} ${uy}`);
            path.setAttribute('stroke', isBW ? '#555555' : '#39ff14');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('fill', 'none');
            if (!isBW) {
                path.style.filter = 'drop-shadow(0 0 3px #39ff14)';
            }
            svg.appendChild(path);

            // 3. Anchor dot: Small circle with glow at the module center
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', px);
            circle.setAttribute('cy', py);
            circle.setAttribute('r', '3');
            circle.setAttribute('fill', isBW ? '#555555' : '#39ff14');
            if (!isBW) {
                circle.style.filter = 'drop-shadow(0 0 3px #39ff14)';
            }
            svg.appendChild(circle);
        });
    }

    window.drawLeaderLines = drawLeaderLines;
}
window.draw2DModuleListLabels = draw2DModuleListLabels;