import test from 'node:test';
import assert from 'node:assert/strict';
import { World, generateChunk, buildChunkMesh } from '../src/world/world.js';
import { BLOCK, isSolid } from '../src/blocks.js';

test('água é não-sólida (não colide / não oclui)', () => {
  assert.equal(isSolid(BLOCK.WATER), false);
  assert.equal(isSolid(BLOCK.STONE), true);
  assert.equal(isSolid(BLOCK.AIR), false);
});

test('a geração produz água nas depressões', () => {
  let water = 0;
  for (let cx = 0; cx < 8; cx++) {
    for (let cz = 0; cz < 8; cz++) {
      const data = generateChunk(1337, cx, cz);
      for (const b of data) if (b === BLOCK.WATER) water++;
    }
  }
  assert.ok(water > 0, 'deveria haver blocos de água');
});

test('buildChunkMesh separa opaco (com uv) e água (sem uv)', () => {
  const w = new World(1337);
  // procura um chunk que tenha água
  let res = null;
  for (let cx = 0; cx < 8 && !res; cx++) {
    for (let cz = 0; cz < 8; cz++) {
      const data = generateChunk(1337, cx, cz);
      if (data.includes(BLOCK.WATER)) { res = buildChunkMesh(w, cx, cz); break; }
    }
  }
  assert.ok(res, 'esperava um chunk com água');
  assert.ok(res.opaque.geometry.getAttribute('uv')); // opaco tem uv (atlas)
  assert.ok(res.water, 'deveria ter malha de água');
  assert.ok(res.water.geometry.getAttribute('position').count > 0);
  assert.equal(res.water.geometry.getAttribute('uv'), undefined); // água sem uv
});
