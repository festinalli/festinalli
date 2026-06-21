import * as THREE from 'three';
import { BLOCK, isSolid } from '../blocks.js';
import { makeNoise2D } from './noise.js';
import { tileFor, uvForTile } from './atlas.js';

// --- Constantes canônicas do mundo (fonte única, citadas na constitution) ---
export const CHUNK_SIZE = 16; // blocos por lado em X e Z, por chunk
export const WORLD_CHUNKS = 4; // grade WORLD_CHUNKS × WORLD_CHUNKS de chunks
export const MAX_HEIGHT = 24; // altura máxima de uma coluna (em blocos)

const SIZE_X = CHUNK_SIZE * WORLD_CHUNKS;
const SIZE_Z = CHUNK_SIZE * WORLD_CHUNKS;
const SIZE_Y = MAX_HEIGHT + 1;

const BASE_HEIGHT = 6; // piso mínimo do terreno
const WATER_LEVEL = 8; // colunas baixas ganham areia no topo

/**
 * Dado voxel: bloco em (x, y, z). Centralizado em X/Z em torno da origem.
 */
export class VoxelData {
  constructor() {
    this.data = new Uint8Array(SIZE_X * SIZE_Y * SIZE_Z); // tudo AIR (0)
    this.offsetX = SIZE_X / 2;
    this.offsetZ = SIZE_Z / 2;
  }

  index(x, y, z) {
    return x + z * SIZE_X + y * SIZE_X * SIZE_Z;
  }

  inBounds(x, y, z) {
    return x >= 0 && x < SIZE_X && y >= 0 && y < SIZE_Y && z >= 0 && z < SIZE_Z;
  }

  get(x, y, z) {
    if (!this.inBounds(x, y, z)) return BLOCK.AIR;
    return this.data[this.index(x, y, z)];
  }

  set(x, y, z, block) {
    if (!this.inBounds(x, y, z)) return;
    this.data[this.index(x, y, z)] = block;
  }
}

/**
 * Gera o mundo de forma determinística a partir da seed.
 * @param {number} seed
 * @returns {VoxelData}
 */
export function generateWorld(seed) {
  const voxels = new VoxelData();
  const noise = makeNoise2D(seed);

  for (let x = 0; x < SIZE_X; x++) {
    for (let z = 0; z < SIZE_Z; z++) {
      // noise ~[-1,1] -> altura inteira [BASE_HEIGHT, MAX_HEIGHT]
      const n = (noise(x, z) + 1) / 2; // [0,1]
      const height = Math.max(
        1,
        Math.min(MAX_HEIGHT, Math.floor(BASE_HEIGHT + n * (MAX_HEIGHT - BASE_HEIGHT)))
      );

      for (let y = 0; y <= height; y++) {
        let block;
        if (y === height) {
          block = height <= WATER_LEVEL ? BLOCK.SAND : BLOCK.GRASS;
        } else if (y >= height - 3) {
          block = BLOCK.DIRT;
        } else {
          block = BLOCK.STONE;
        }
        voxels.set(x, y, z, block);
      }
    }
  }

  return voxels;
}

// Tabela de faces de um cubo unitário (winding correto para THREE FrontSide).
// Baseada na convenção clássica de voxel rendering em WebGL.
// Cada face declara: direção (normal), sombreamento, nome (top/bottom/side),
// os 4 corners do cubo unitário e os 4 UVs locais [u,v] já orientados
// (v=0 = topo do tile; em faces laterais V segue o eixo Y do mundo).
const FACES = [
  { dir: [-1, 0, 0], shade: 0.8, name: 'side',
    corners: [[0, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 1]], uv: [[0, 0], [0, 1], [1, 0], [1, 1]] }, // -x
  { dir: [1, 0, 0], shade: 0.8, name: 'side',
    corners: [[1, 1, 1], [1, 0, 1], [1, 1, 0], [1, 0, 0]], uv: [[1, 0], [1, 1], [0, 0], [0, 1]] }, // +x
  { dir: [0, -1, 0], shade: 0.55, name: 'bottom',
    corners: [[1, 0, 1], [0, 0, 1], [1, 0, 0], [0, 0, 0]], uv: [[1, 1], [0, 1], [1, 0], [0, 0]] }, // -y
  { dir: [0, 1, 0], shade: 1.0, name: 'top',
    corners: [[0, 1, 1], [1, 1, 1], [0, 1, 0], [1, 1, 0]], uv: [[0, 1], [1, 1], [0, 0], [1, 0]] }, // +y
  { dir: [0, 0, -1], shade: 0.7, name: 'side',
    corners: [[1, 0, 0], [0, 0, 0], [1, 1, 0], [0, 1, 0]], uv: [[1, 1], [0, 1], [1, 0], [0, 0]] }, // -z
  { dir: [0, 0, 1], shade: 0.7, name: 'side',
    corners: [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]], uv: [[0, 1], [1, 1], [0, 0], [1, 0]] }, // +z
];

/**
 * Constrói UMA malha do mundo inteiro usando face culling: só emite as faces
 * cujo vizinho é AIR. Emite UVs (atlas) + vertex color = sombreamento por face.
 * @param {VoxelData} voxels
 * @param {THREE.Material} [material] material a usar (browser injeta com textura);
 *   sem ele, cai num default só-vertexColors (usado em teste, nunca renderizado).
 * @returns {THREE.Mesh}
 */
export function buildWorldMesh(voxels, material) {
  const positions = [];
  const normals = [];
  const colors = [];
  const uvs = [];
  const indices = [];

  for (let y = 0; y < SIZE_Y; y++) {
    for (let z = 0; z < SIZE_Z; z++) {
      for (let x = 0; x < SIZE_X; x++) {
        const block = voxels.get(x, y, z);
        if (!isSolid(block)) continue;

        for (const face of FACES) {
          const [dx, dy, dz] = face.dir;
          if (isSolid(voxels.get(x + dx, y + dy, z + dz))) continue; // face oculta

          const ndx = positions.length / 3;
          const s = face.shade; // vertex color = sombreamento (cinza) que multiplica a textura
          const rect = uvForTile(tileFor(block, face.name));

          for (let k = 0; k < 4; k++) {
            const [cx, cy, cz] = face.corners[k];
            positions.push(
              x + cx - voxels.offsetX,
              y + cy,
              z + cz - voxels.offsetZ
            );
            normals.push(dx, dy, dz);
            colors.push(s, s, s);
            const [lu, lv] = face.uv[k]; // UV local [0..1] já orientada
            uvs.push(rect.u0 + lu * (rect.u1 - rect.u0), rect.v0 + lv * (rect.v1 - rect.v0));
          }
          indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
        }
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  const mat =
    material ||
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0.0 });

  const mesh = new THREE.Mesh(geometry, mat);
  mesh.name = 'world';
  return mesh;
}

/** Y da SUPERFÍCIE do terreno no centro do mundo (topo do bloco mais alto). */
export function spawnSurfaceY(voxels) {
  const cx = Math.floor(SIZE_X / 2);
  const cz = Math.floor(SIZE_Z / 2);
  for (let y = SIZE_Y - 1; y >= 0; y--) {
    if (isSolid(voxels.get(cx, y, cz))) return y + 1; // topo do bloco
  }
  return BASE_HEIGHT;
}
