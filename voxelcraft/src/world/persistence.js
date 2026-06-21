// Persistência do mundo. Parte PURA (serialize/deserialize) testável headless;
// parte browser usa localStorage.

const VERSION = 1;
const KEY = 'voxelcraft.save.v1';

// --- PURO ---

/**
 * Serializa o mundo num JSON com os bytes dos blocos em base64.
 * @param {Uint8Array} blocks
 * @param {number} seed
 * @param {{x:number,y:number,z:number}} player
 * @returns {string}
 */
export function serializeWorld(blocks, seed, player) {
  let bin = '';
  const CHUNK = 0x8000; // evita estourar argumentos de fromCharCode
  for (let i = 0; i < blocks.length; i += CHUNK) {
    bin += String.fromCharCode(...blocks.subarray(i, i + CHUNK));
  }
  return JSON.stringify({
    v: VERSION,
    seed,
    len: blocks.length,
    player,
    blocks: btoa(bin),
  });
}

/**
 * Desserializa. Retorna null se inválido ou de versão incompatível.
 * @param {string} str
 * @returns {{seed:number, len:number, player:object, data:Uint8Array} | null}
 */
export function deserializeWorld(str) {
  let obj;
  try {
    obj = JSON.parse(str);
  } catch {
    return null;
  }
  if (!obj || obj.v !== VERSION || typeof obj.blocks !== 'string') return null;

  let bin;
  try {
    bin = atob(obj.blocks);
  } catch {
    return null;
  }
  const data = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);

  return { seed: obj.seed, len: obj.len, player: obj.player, data };
}

// --- Browser (localStorage) ---

export function saveWorld(voxels, seed, player) {
  try {
    localStorage.setItem(KEY, serializeWorld(voxels.data, seed, player));
    return true;
  } catch {
    return false; // cota cheia / indisponível: não quebra o jogo
  }
}

export function loadWorld() {
  try {
    const s = localStorage.getItem(KEY);
    return s ? deserializeWorld(s) : null;
  } catch {
    return null;
  }
}

export function clearWorld() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function hasSave() {
  try {
    return localStorage.getItem(KEY) != null;
  } catch {
    return false;
  }
}
