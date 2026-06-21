import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const SPEED = 14; // unidades/segundo (andar)
const RUN_MULTIPLIER = 2.2; // Ctrl
const VERTICAL_SPEED = 12; // subir/descer (voo)

/**
 * Câmera em primeira pessoa: pointer lock para olhar, WASD para mover no plano
 * do olhar, Espaço/Shift para subir/descer (voo livre, sem colisão na v1).
 *
 * @param {THREE.Camera} camera
 * @param {HTMLElement} domElement
 */
export function createControls(camera, domElement) {
  const controls = new PointerLockControls(camera, domElement);

  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    run: false,
  };

  function onKey(down) {
    return (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.forward = down; break;
        case 'KeyS': case 'ArrowDown': keys.backward = down; break;
        case 'KeyA': case 'ArrowLeft': keys.left = down; break;
        case 'KeyD': case 'ArrowRight': keys.right = down; break;
        case 'Space': keys.up = down; break;
        case 'ShiftLeft': case 'ShiftRight': keys.down = down; break;
        case 'ControlLeft': case 'ControlRight': keys.run = down; break;
        default: return;
      }
      e.preventDefault();
    };
  }

  document.addEventListener('keydown', onKey(true));
  document.addEventListener('keyup', onKey(false));

  const forwardDir = new THREE.Vector3();
  const rightDir = new THREE.Vector3();
  const move = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  function update(dt) {
    if (!controls.isLocked) return;

    // direção do olhar projetada no plano horizontal
    camera.getWorldDirection(forwardDir);
    forwardDir.y = 0;
    forwardDir.normalize();
    rightDir.crossVectors(forwardDir, up).normalize();

    move.set(0, 0, 0);
    if (keys.forward) move.add(forwardDir);
    if (keys.backward) move.sub(forwardDir);
    if (keys.right) move.add(rightDir);
    if (keys.left) move.sub(rightDir);
    if (move.lengthSq() > 0) move.normalize();

    const speed = SPEED * (keys.run ? RUN_MULTIPLIER : 1);
    camera.position.addScaledVector(move, speed * dt);

    if (keys.up) camera.position.y += VERTICAL_SPEED * dt;
    if (keys.down) camera.position.y -= VERTICAL_SPEED * dt;
  }

  return { controls, update };
}
