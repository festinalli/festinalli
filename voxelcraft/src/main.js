import * as THREE from 'three';
import { generateWorld, buildWorldMesh, spawnSurfaceY } from './world/world.js';
import { PLAYER } from './player/collision.js';
import { createControls } from './player/controls.js';
import { createEditing, HOTBAR } from './player/editing.js';
import { makeAtlasTexture } from './world/atlas.js';
import { BLOCK_COLOR } from './blocks.js';

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
const atlas = makeAtlasTexture();
const worldMaterial = new THREE.MeshStandardMaterial({
  map: atlas,
  vertexColors: true, // sombreamento por face multiplica a textura
  roughness: 0.95,
  metalness: 0.0,
});

const voxels = generateWorld(WORLD_SEED);
let worldMesh = buildWorldMesh(voxels, worldMaterial);
scene.add(worldMesh);

// Reconstrói a malha inteira após uma edição (ver ADR 0003). Reusa o material.
function rebuildWorld() {
  scene.remove(worldMesh);
  worldMesh.geometry.dispose();
  worldMesh = buildWorldMesh(voxels, worldMaterial);
  scene.add(worldMesh);
}

// Spawn: olho alguns blocos acima da superfície → o jogador cai e pousa.
const surfaceY = spawnSurfaceY(voxels);
camera.position.set(0, surfaceY + PLAYER.eye + 3, 0);
camera.lookAt(12, surfaceY, 12);

// --- Controles + overlay ---
const { controls, update } = createControls(camera, renderer.domElement, voxels);
scene.add(controls.object); // PointerLockControls move este objeto (a câmera)

const overlay = document.getElementById('overlay');
const crosshair = document.getElementById('crosshair');
const hud = document.getElementById('hud');
const hotbar = document.getElementById('hotbar');

// --- Edição (quebrar/colocar blocos) ---
const editing = createEditing({
  camera,
  scene,
  voxels,
  getMesh: () => worldMesh,
  rebuild: rebuildWorld,
  isLocked: () => controls.isLocked,
  getPlayerPos: (out) => out.copy(camera.position),
  onSelect: (block) => renderHotbar(block),
});

// HUD da hotbar: um quadradinho por tipo, destacando o selecionado.
function renderHotbar(selected) {
  hotbar.innerHTML = '';
  HOTBAR.forEach((block, i) => {
    const slot = document.createElement('div');
    slot.className = 'slot' + (block === selected ? ' active' : '');
    slot.style.background = '#' + BLOCK_COLOR[block].toString(16).padStart(6, '0');
    slot.innerHTML = `<span>${i + 1}</span>`;
    hotbar.appendChild(slot);
  });
}

overlay.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => {
  overlay.classList.add('hidden');
  crosshair.classList.remove('hidden');
  hud.classList.remove('hidden');
  hotbar.classList.remove('hidden');
});
controls.addEventListener('unlock', () => {
  overlay.classList.remove('hidden');
  crosshair.classList.add('hidden');
  hud.classList.add('hidden');
  hotbar.classList.add('hidden');
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
  editing.updateHighlight();

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
