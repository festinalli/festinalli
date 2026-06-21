import * as THREE from 'three';
import { BLOCK, isSolid } from '../blocks.js';

export const REACH = 8; // alcance (em blocos) para mirar/editar

// Teclas 1–4 -> tipo de bloco a colocar.
export const HOTBAR = [BLOCK.GRASS, BLOCK.DIRT, BLOCK.STONE, BLOCK.SAND];

/**
 * Função PURA: do ponto de impacto + normal da face para coordenadas de voxel.
 * Consistente com world.js: worldX = voxelX - offsetX (idem Z; Y sem offset).
 *
 * @returns {{hit:{x,y,z}, place:{x,y,z}}}
 *   hit   = bloco atingido (para remover)
 *   place = vizinho na direção da normal (para colocar)
 */
export function resolveTarget(point, normal, offsetX, offsetZ) {
  const hit = {
    x: Math.floor(point.x - normal.x * 0.5 + offsetX),
    y: Math.floor(point.y - normal.y * 0.5),
    z: Math.floor(point.z - normal.z * 0.5 + offsetZ),
  };
  const place = {
    x: hit.x + Math.round(normal.x),
    y: hit.y + Math.round(normal.y),
    z: hit.z + Math.round(normal.z),
  };
  return { hit, place };
}

/**
 * Mira por raycast, realce do bloco alvo e edição (remover/colocar).
 *
 * @param {object} opts
 * @param {THREE.Camera} opts.camera
 * @param {THREE.Scene} opts.scene
 * @param {import('../world/world.js').VoxelData} opts.voxels
 * @param {() => THREE.Mesh} opts.getMesh   mesh atual do mundo
 * @param {() => void} opts.rebuild         reconstrói a mesh após editar
 * @param {() => boolean} opts.isLocked     pointer lock ativo?
 * @param {(out:THREE.Vector3) => void} opts.getPlayerPos  posição da câmera
 * @param {(blockType:number) => void} [opts.onSelect]     callback de seleção
 */
export function createEditing(opts) {
  const { camera, scene, voxels, getMesh, rebuild, isLocked, getPlayerPos, onSelect } = opts;

  const raycaster = new THREE.Raycaster();
  raycaster.far = REACH;
  const center = new THREE.Vector2(0, 0);

  let selectedIndex = 0; // índice na HOTBAR
  let current = null; // último alvo resolvido (ou null)

  // Realce do bloco mirado.
  const highlight = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002)),
    new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.8 })
  );
  highlight.visible = false;
  scene.add(highlight);

  const playerPos = new THREE.Vector3();

  function playerCell() {
    getPlayerPos(playerPos);
    return {
      x: Math.floor(playerPos.x + voxels.offsetX),
      y: Math.floor(playerPos.y),
      z: Math.floor(playerPos.z + voxels.offsetZ),
    };
  }

  function pick() {
    const hits = raycaster.intersectObject(getMesh(), false);
    if (hits.length === 0) return null;
    const h = hits[0];
    if (!h.face) return null;
    return resolveTarget(h.point, h.face.normal, voxels.offsetX, voxels.offsetZ);
  }

  function updateHighlight() {
    if (!isLocked()) {
      highlight.visible = false;
      current = null;
      return;
    }
    raycaster.setFromCamera(center, camera);
    current = pick();
    if (!current) {
      highlight.visible = false;
      return;
    }
    highlight.visible = true;
    highlight.position.set(
      current.hit.x - voxels.offsetX + 0.5,
      current.hit.y + 0.5,
      current.hit.z - voxels.offsetZ + 0.5
    );
  }

  function sameCell(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  }

  function onMouseDown(e) {
    if (!isLocked() || !current) return;

    if (e.button === 0) {
      // remover bloco mirado
      voxels.set(current.hit.x, current.hit.y, current.hit.z, BLOCK.AIR);
      rebuild();
    } else if (e.button === 2) {
      // colocar no vizinho, se vazio e fora do jogador
      const p = current.place;
      const occupied = isSolid(voxels.get(p.x, p.y, p.z));
      if (!occupied && !sameCell(p, playerCell())) {
        voxels.set(p.x, p.y, p.z, HOTBAR[selectedIndex]);
        rebuild();
      }
    }
  }

  function onKeyDown(e) {
    const n = Number(e.key);
    if (n >= 1 && n <= HOTBAR.length) {
      selectedIndex = n - 1;
      onSelect?.(HOTBAR[selectedIndex]);
    }
  }

  function onContextMenu(e) {
    e.preventDefault(); // sem menu do navegador ao clicar com botão direito
  }

  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('contextmenu', onContextMenu);

  // seleção inicial
  onSelect?.(HOTBAR[selectedIndex]);

  function dispose() {
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('contextmenu', onContextMenu);
    scene.remove(highlight);
    highlight.geometry.dispose();
    highlight.material.dispose();
  }

  return { updateHighlight, dispose };
}
