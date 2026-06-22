import test from 'node:test';
import assert from 'node:assert/strict';
import {
  World, generateChunk, chunkCoord, localCoord, chunkKey, parseKey,
  buildChunkMesh, CHUNK_SIZE, WORLD_HEIGHT,
} from '../src/world/world.js';
import { BLOCK } from '../src/blocks.js';

test('conversão de coordenadas (inclui negativos)', () => {
  assert.equal(chunkCoord(0), 0);
  assert.equal(chunkCoord(15), 0);
  assert.equal(chunkCoord(16), 1);
  assert.equal(chunkCoord(-1), -1);
  assert.equal(localCoord(-1), 15);
  assert.equal(localCoord(16), 0);
  const [a, b] = parseKey(chunkKey(-3, 7));
  assert.deepEqual([a, b], [-3, 7]);
});

test('generateChunk é determinístico e varia por seed/posição', () => {
  const a = generateChunk(1337, 2, -1);
  const b = generateChunk(1337, 2, -1);
  assert.deepEqual([...a], [...b]);
  const c = generateChunk(1337, 3, 3);
  assert.notDeepEqual([...a], [...c]);
  const d = generateChunk(42, 2, -1);
  assert.notDeepEqual([...a], [...d]);
});

test('World.getBlock coincide com generateChunk em coords globais', () => {
  const seed = 1337, cx = 2, cz = -1, lx = 5, lz = 9, y = 3;
  const data = generateChunk(seed, cx, cz);
  const expected = data[lx + lz * CHUNK_SIZE + y * CHUNK_SIZE * CHUNK_SIZE];
  const w = new World(seed);
  assert.equal(w.getBlock(cx * CHUNK_SIZE + lx, y, cz * CHUNK_SIZE + lz), expected);
});

test('Y fora dos limites retorna AIR', () => {
  const w = new World(1);
  assert.equal(w.getBlock(0, -1, 0), BLOCK.AIR);
  assert.equal(w.getBlock(0, WORLD_HEIGHT, 0), BLOCK.AIR);
});

test('setBlock grava e marca o chunk como modificado', () => {
  const w = new World(7);
  w.setBlock(33, 5, -2, BLOCK.WOOD);
  assert.equal(w.getBlock(33, 5, -2), BLOCK.WOOD);
  assert.equal(w.isModified(chunkCoord(33), chunkCoord(-2)), true);
  assert.equal(w.isModified(99, 99), false);
});

test('buildChunkMesh gera geometria não-vazia com uv casando', () => {
  const w = new World(1337);
  const mesh = buildChunkMesh(w, 0, 0);
  const pos = mesh.geometry.getAttribute('position').count;
  const uv = mesh.geometry.getAttribute('uv').count;
  assert.ok(pos > 0);
  assert.equal(uv, pos);
});

test('surfaceY aponta acima do bloco sólido mais alto', () => {
  const w = new World(1337);
  const sy = w.surfaceY(0, 0);
  assert.equal(typeof sy, 'number');
  assert.ok(sy > 0 && sy <= WORLD_HEIGHT);
  assert.ok(sy >= 1);
});
