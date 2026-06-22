import test from 'node:test';
import assert from 'node:assert/strict';
import {
  World, generateChunk, hasTree, terrainHeight, WATER_LEVEL,
  chunkCoord, localCoord, CHUNK_SIZE, WORLD_HEIGHT,
} from '../src/world/world.js';
import { BLOCK } from '../src/blocks.js';

const SEED = 1337;

test('hasTree é determinístico', () => {
  assert.equal(hasTree(SEED, 5, 7), hasTree(SEED, 5, 7));
  assert.equal(hasTree(SEED, -12, 30), hasTree(SEED, -12, 30));
});

test('o mundo gera árvores (WOOD e LEAVES)', () => {
  let wood = 0, leaves = 0;
  for (let cx = 0; cx < 6; cx++) {
    for (let cz = 0; cz < 6; cz++) {
      const data = generateChunk(SEED, cx, cz);
      for (const b of data) {
        if (b === BLOCK.WOOD) wood++;
        else if (b === BLOCK.LEAVES) leaves++;
      }
    }
  }
  assert.ok(wood > 0, 'deveria haver troncos');
  assert.ok(leaves > 0, 'deveria haver folhas');
});

test('a copa cruza a fronteira de chunk sem cortar (cross-chunk)', () => {
  const w = new World(SEED);
  // acha uma árvore com origem perto da borda +x, cuja copa (raio 2) invade o
  // próximo chunk, e onde o terreno vizinho é baixo o bastante p/ folhas caberem.
  let found = null;
  for (let wx = 0; wx < 200 && !found; wx++) {
    for (let wz = 0; wz < 200; wz++) {
      if (!hasTree(SEED, wx, wz)) continue;
      const h = terrainHeight(SEED, wx, wz);
      if (h <= WATER_LEVEL) continue;
      if (localCoord(wx) < CHUNK_SIZE - 2) continue; // precisa cruzar a borda +x
      if (terrainHeight(SEED, wx + 2, wz) > h) continue; // vizinho não mais alto
      found = { wx, wz, h };
      break;
    }
  }
  assert.ok(found, 'esperava encontrar uma árvore de borda');

  const { wx, wz, h } = found;
  assert.notEqual(chunkCoord(wx + 2), chunkCoord(wx)); // de fato no chunk vizinho

  // deve existir folha na coluna vizinha (wx+2), acima do terreno -> veio da
  // árvore carimbada a partir do chunk de origem.
  let leafAcross = false;
  for (let y = h + 1; y < WORLD_HEIGHT; y++) {
    if (w.getBlock(wx + 2, y, wz) === BLOCK.LEAVES) { leafAcross = true; break; }
  }
  assert.ok(leafAcross, 'a copa deveria continuar no chunk vizinho');
});
