import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { sweepAxis, moveHorizontalWithStep } from './movement.js';
// `world` expõe getBlock(bx,by,bz) em coordenadas globais.

// Constantes de movimento (fonte única).
const WALK_SPEED = 6; // andar (blocos/s)
const RUN_MULT = 1.8; // Ctrl
const FLY_SPEED = 14; // horizontal em modo voo
const FLY_VERTICAL = 12; // subir/descer em modo voo
const GRAVITY = 28; // blocos/s²
const JUMP_SPEED = 9; // impulso do pulo

/**
 * Câmera/jogador em 1ª pessoa: pointer lock para olhar; WASD para andar;
 * gravidade + colisão AABB; pulo (Espaço no chão); modo voo (F).
 *
 * @param {THREE.Camera} camera
 * @param {HTMLElement} domElement
 * @param {import('../world/world.js').World} world
 * @param {{onStep?: () => void}} [opts]
 */
export function createControls(camera, domElement, world, opts = {}) {
  const controls = new PointerLockControls(camera, domElement);
  const STRIDE = 2.4; // distância (blocos) entre passos
  let walkAccum = 0;

  const keys = {
    forward: false, backward: false, left: false, right: false,
    up: false, down: false, run: false,
  };

  let flyMode = false;
  let velY = 0;
  let onGround = false;

  function onKeyDown(e) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': keys.forward = true; break;
      case 'KeyS': case 'ArrowDown': keys.backward = true; break;
      case 'KeyA': case 'ArrowLeft': keys.left = true; break;
      case 'KeyD': case 'ArrowRight': keys.right = true; break;
      case 'ControlLeft': case 'ControlRight': keys.run = true; break;
      case 'ShiftLeft': case 'ShiftRight': keys.down = true; break;
      case 'KeyF': flyMode = !flyMode; velY = 0; break;
      case 'Space':
        if (flyMode) keys.up = true;
        else if (onGround) { velY = JUMP_SPEED; onGround = false; }
        break;
      default: return;
    }
    e.preventDefault();
  }

  function onKeyUp(e) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': keys.forward = false; break;
      case 'KeyS': case 'ArrowDown': keys.backward = false; break;
      case 'KeyA': case 'ArrowLeft': keys.left = false; break;
      case 'KeyD': case 'ArrowRight': keys.right = false; break;
      case 'ControlLeft': case 'ControlRight': keys.run = false; break;
      case 'ShiftLeft': case 'ShiftRight': keys.down = false; break;
      case 'Space': keys.up = false; break;
      default: return;
    }
    e.preventDefault();
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  const forwardDir = new THREE.Vector3();
  const rightDir = new THREE.Vector3();
  const move = new THREE.Vector3();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const pos = { x: 0, y: 0, z: 0 };

  function update(dt) {
    if (!controls.isLocked) return;

    // direção horizontal a partir do olhar
    camera.getWorldDirection(forwardDir);
    forwardDir.y = 0;
    forwardDir.normalize();
    rightDir.crossVectors(forwardDir, worldUp).normalize();

    move.set(0, 0, 0);
    if (keys.forward) move.add(forwardDir);
    if (keys.backward) move.sub(forwardDir);
    if (keys.right) move.add(rightDir);
    if (keys.left) move.sub(rightDir);
    if (move.lengthSq() > 0) move.normalize();

    pos.x = camera.position.x;
    pos.y = camera.position.y;
    pos.z = camera.position.z;

    const hSpeed = (flyMode ? FLY_SPEED : WALK_SPEED) * (keys.run ? RUN_MULT : 1);
    const dx = move.x * hSpeed * dt;
    const dz = move.z * hSpeed * dt;

    if (flyMode) {
      sweepAxis(world, pos, 'x', dx);
      sweepAxis(world, pos, 'z', dz);
      velY = 0;
      onGround = false;
      let dy = 0;
      if (keys.up) dy += FLY_VERTICAL * dt;
      if (keys.down) dy -= FLY_VERTICAL * dt;
      sweepAxis(world, pos, 'y', dy);
    } else {
      const sx = pos.x;
      const sz = pos.z;
      const wasGround = onGround;
      moveHorizontalWithStep(world, pos, dx, dz, onGround);
      velY -= GRAVITY * dt;
      const blocked = sweepAxis(world, pos, 'y', velY * dt);
      if (blocked) {
        if (velY < 0) onGround = true;
        velY = 0;
      } else {
        onGround = false;
      }
      // passos: acumula distância andada no chão
      if (wasGround) {
        const moved = Math.hypot(pos.x - sx, pos.z - sz);
        walkAccum += moved;
        if (walkAccum >= STRIDE) {
          walkAccum = 0;
          opts.onStep?.();
        }
      }
    }

    camera.position.set(pos.x, pos.y, pos.z);
  }

  return { controls, update };
}
