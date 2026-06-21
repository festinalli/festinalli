import * as THREE from 'three';
import { generateWorld, buildWorldMesh, spawnHeight } from './world/world.js';
import { createControls } from './player/controls.js';

const WORLD_SEED = 1337; // seed fixa: mundo determinístico (constitution)

// --- Renderer ---
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

// --- Cena e céu ---
const scene = new THREE.Scene();
const SKY = 0x87b7e8;
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.Fog(SKY, 40, 120);

// --- Câmera ---
const camera = new THREE.PerspectiveCamera(
  72,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// --- Luzes ---
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(40, 80, 20);
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x4a5a3a, 0.7));
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

// --- Mundo ---
const voxels = generateWorld(WORLD_SEED);
const worldMesh = buildWorldMesh(voxels);
scene.add(worldMesh);

camera.position.set(0, spawnHeight(voxels), 0);
camera.lookAt(8, spawnHeight(voxels) - 2, 8);

// --- Controles + overlay ---
const { controls, update } = createControls(camera, renderer.domElement);
scene.add(controls.object); // PointerLockControls move este objeto (a câmera)

const overlay = document.getElementById('overlay');
const crosshair = document.getElementById('crosshair');
const hud = document.getElementById('hud');

overlay.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => {
  overlay.classList.add('hidden');
  crosshair.classList.remove('hidden');
  hud.classList.remove('hidden');
});
controls.addEventListener('unlock', () => {
  overlay.classList.remove('hidden');
  crosshair.classList.add('hidden');
  hud.classList.add('hidden');
});

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Loop ---
const clock = new THREE.Clock();
const fpsEl = document.getElementById('fps');
let fpsAccum = 0;
let fpsFrames = 0;

function animate() {
  const dt = Math.min(clock.getDelta(), 0.1); // clamp p/ evitar saltos
  update(dt);

  fpsAccum += dt;
  fpsFrames++;
  if (fpsAccum >= 0.5) {
    fpsEl.textContent = Math.round(fpsFrames / fpsAccum);
    fpsAccum = 0;
    fpsFrames = 0;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
