import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const SCENE_PATH = 'assets/models/scene-208.glb';

// ── Coordinates discovered with debug-coords overlay ─────────────────────────
// All values are in centred scene space (origin = model bounding-box centre).

const ROUTE_LIGHTS = [
  { label: 'entrance-lobby', position: { x: -7.85, y: 2.00, z:  8.50 } },
  { label: 'main-corridor',  position: { x: -3.75, y: 2.00, z:  0.50 } },
  { label: 'briefing-room',  position: { x:  2.50, y: 2.00, z:  0.50 } },
  { label: 'lounge',         position: { x:  1.00, y: 2.00, z: -7.75 } },
];
// ─────────────────────────────────────────────────────────────────────────────

// Animation step durations (seconds)
const D_FADE_IN   = 0.6;   // per-light sequential fade-in
const D_HOLD      = 1.5;   // all route lights on
const D_FADE_OUT  = 0.4;   // simultaneous fade-out
const D_PAUSE     = 0.8;   // dark pause before repeat
const D_TOTAL     = ROUTE_LIGHTS.length * D_FADE_IN + D_HOLD + D_FADE_OUT + D_PAUSE;

const TARGET_INTENSITY  = 5.0;
const LIGHT_COLOUR      = 0xfff5e0;   // warm white
const AMBIENT_INTENSITY = 0.15;        // dark base scene
const LIGHT_DISTANCE    = 30;         // point-light falloff radius

// Returns an intensity [0..TARGET_INTENSITY] for each light at time t.
function lightIntensities(t) {
  const n            = ROUTE_LIGHTS.length;
  const holdStart    = n * D_FADE_IN;
  const fadeOutStart = holdStart + D_HOLD;
  const pauseStart   = fadeOutStart + D_FADE_OUT;

  if (t < holdStart) {
    return ROUTE_LIGHTS.map((_, i) => {
      const start = i * D_FADE_IN;
      if (t < start) return 0;
      if (t >= start + D_FADE_IN) return TARGET_INTENSITY;
      return TARGET_INTENSITY * (t - start) / D_FADE_IN;
    });
  }
  if (t < fadeOutStart) {
    return ROUTE_LIGHTS.map(() => TARGET_INTENSITY);
  }
  if (t < pauseStart) {
    const alpha = 1 - (t - fadeOutStart) / D_FADE_OUT;
    return ROUTE_LIGHTS.map(() => TARGET_INTENSITY * alpha);
  }
  return ROUTE_LIGHTS.map(() => 0);
}

function init() {
  const canvas = document.getElementById('example3-viewer');
  if (!canvas) return;

  // Defer all Three.js work until the canvas enters the viewport.
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    startViewer(canvas);
  }, { threshold: 0.1 });
  observer.observe(canvas);
}

function startViewer(canvas) {
  // ── Renderer ──────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.8;
  renderer.setClearColor(0x000000, 0);

  // ── Camera ────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.up.set(0, 0, -1);   // +X right, -Z up in viewport for top-down orientation

  // ── Controls ──────────────────────────────────────
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = true;
  controls.autoRotate = false;
  // Zoom disabled until first pointerdown — prevents OrbitControls from calling
  // preventDefault() on wheel events and blocking page scroll.
  controls.enableZoom = false;
  controls.target.set(0, 0, 0);
  controls.update();

  renderer.domElement.addEventListener('pointerdown', () => {
    controls.enableZoom = true;
  }, { once: true });

  // ── Scene ─────────────────────────────────────────
  const scene = new THREE.Scene();

  // ── Lights ────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, AMBIENT_INTENSITY));

  const pointLights = ROUTE_LIGHTS.map(({ position }) => {
    const light = new THREE.PointLight(LIGHT_COLOUR, 0, LIGHT_DISTANCE, 2);
    light.position.set(position.x, position.y, position.z);
    scene.add(light);
    return light;
  });

  // ── Load GLB ──────────────────────────────────────
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  const loadingEl = canvas.parentElement.querySelector('.viewer-loading');

  loader.load(
    SCENE_PATH,
    (gltf) => {
      // Centre model at origin.
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const centre = new THREE.Vector3();
      box.getCenter(centre);
      gltf.scene.position.sub(centre);

      const size = box.getSize(new THREE.Vector3()).length();
      camera.near = size * 0.001;
      camera.far  = size * 10;
      camera.updateProjectionMatrix();
      controls.maxDistance = size * 4;

      // Position camera directly above scene centre, looking straight down.
      camera.position.set(0, size, 0);
      controls.update();

      scene.add(gltf.scene);
      if (loadingEl) loadingEl.remove();
    },
    undefined,
    (err) => {
      console.error('viewer-example-3 GLB load error:', err);
      if (loadingEl) loadingEl.textContent = 'Scene unavailable.';
    }
  );

  // ── Resize ────────────────────────────────────────
  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(canvas.parentElement);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // ── Render loop ───────────────────────────────────
  let startTime = null;

  function animate(now) {
    requestAnimationFrame(animate);

    if (startTime === null) startTime = now;
    const elapsed = (now - startTime) * 0.001;
    const t = elapsed % D_TOTAL;

    controls.update();

    const intensities = lightIntensities(t);
    intensities.forEach((intensity, i) => {
      pointLights[i].intensity = intensity;
    });

    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

init();
