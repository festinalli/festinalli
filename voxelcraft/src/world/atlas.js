import * as THREE from 'three';
import { BLOCK } from '../blocks.js';

// --- Layout do atlas (PURO, sem DOM) ---
export const TILE_PX = 16; // resolução de cada tile
export const ATLAS_COLS = 8; // tiles por linha (128px de largura, potência de 2)

export const TILES = {
  GRASS_TOP: 0,
  GRASS_SIDE: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
};

/** Tile do atlas para um (tipo de bloco, face). face ∈ 'top'|'bottom'|'side'. */
export function tileFor(blockType, faceName) {
  switch (blockType) {
    case BLOCK.GRASS:
      if (faceName === 'top') return TILES.GRASS_TOP;
      if (faceName === 'bottom') return TILES.DIRT;
      return TILES.GRASS_SIDE;
    case BLOCK.DIRT:
      return TILES.DIRT;
    case BLOCK.STONE:
      return TILES.STONE;
    case BLOCK.SAND:
      return TILES.SAND;
    default:
      return TILES.STONE;
  }
}

/** UVs do tile, com meio-texel de inset para evitar bleeding entre tiles. */
export function uvForTile(tileIndex) {
  const col = tileIndex % ATLAS_COLS;
  const inset = 0.5 / (ATLAS_COLS * TILE_PX);
  const u0 = col / ATLAS_COLS + inset;
  const u1 = (col + 1) / ATLAS_COLS - inset;
  return { u0, v0: inset, u1, v1: 1 - inset };
}

// --- Geração da imagem (browser) ---

// PRNG determinístico (mulberry32) p/ ruído estável dos tiles.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  return { r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255 };
}

// Desenha um tile com ruído por pixel a partir de uma cor base.
function drawNoisy(ctx, col, baseHex, jitter, rand) {
  const base = hexToRgb(baseHex);
  for (let y = 0; y < TILE_PX; y++) {
    for (let x = 0; x < TILE_PX; x++) {
      const d = (rand() - 0.5) * 2 * jitter;
      const r = Math.max(0, Math.min(255, base.r + d));
      const g = Math.max(0, Math.min(255, base.g + d));
      const b = Math.max(0, Math.min(255, base.b + d));
      ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
      ctx.fillRect(col * TILE_PX + x, y, 1, 1);
    }
  }
}

/**
 * Gera a textura-atlas em runtime (canvas). Browser only.
 * @returns {THREE.CanvasTexture}
 */
export function makeAtlasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_COLS * TILE_PX;
  canvas.height = TILE_PX;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(0xa11ce);

  // grama topo (verde), terra, pedra, areia
  drawNoisy(ctx, TILES.GRASS_TOP, 0x6ab04c, 28, rand);
  drawNoisy(ctx, TILES.DIRT, 0x8b5a2b, 30, rand);
  drawNoisy(ctx, TILES.STONE, 0x8d8d92, 26, rand);
  drawNoisy(ctx, TILES.SAND, 0xe4d7a3, 22, rand);

  // grama lateral: base de terra + faixa de grama no topo, com "pingos"
  drawNoisy(ctx, TILES.GRASS_SIDE, 0x8b5a2b, 30, rand);
  const sideX = TILES.GRASS_SIDE * TILE_PX;
  for (let x = 0; x < TILE_PX; x++) {
    const overhang = 3 + Math.floor(rand() * 3); // 3–5 px de grama
    for (let y = 0; y < overhang; y++) {
      const d = (rand() - 0.5) * 56;
      ctx.fillStyle = `rgb(${(0x6a + d) | 0},${(0xb0 + d) | 0},${(0x4c + d) | 0})`;
      ctx.fillRect(sideX + x, y, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
