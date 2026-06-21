// Fonte única de tipos de bloco e suas cores.
// A constitution proíbe duplicar estes valores em outros lugares.

export const BLOCK = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
};

// Cor sólida por tipo (hex). Usadas como vertex colors na malha do mundo.
export const BLOCK_COLOR = {
  [BLOCK.GRASS]: 0x6ab04c,
  [BLOCK.DIRT]: 0x8b5a2b,
  [BLOCK.STONE]: 0x8d8d92,
  [BLOCK.SAND]: 0xe4d7a3,
};

export function isSolid(block) {
  return block !== BLOCK.AIR && block !== undefined;
}
