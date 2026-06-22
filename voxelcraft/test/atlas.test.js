import test from 'node:test';
import assert from 'node:assert/strict';
import { tileFor, uvForTile, TILES, ATLAS_COLS } from '../src/world/atlas.js';
import { BLOCK } from '../src/blocks.js';

test('tileFor mapeia faces de grama e madeira distintamente', () => {
  assert.equal(tileFor(BLOCK.GRASS, 'top'), TILES.GRASS_TOP);
  assert.equal(tileFor(BLOCK.GRASS, 'side'), TILES.GRASS_SIDE);
  assert.equal(tileFor(BLOCK.GRASS, 'bottom'), TILES.DIRT);
  assert.equal(tileFor(BLOCK.WOOD, 'top'), TILES.WOOD_TOP);
  assert.equal(tileFor(BLOCK.WOOD, 'side'), TILES.WOOD_SIDE);
  assert.notEqual(TILES.WOOD_TOP, TILES.WOOD_SIDE);
  assert.equal(tileFor(BLOCK.STONE, 'top'), TILES.STONE);
});

test('uvForTile fica em [0,1], válido e com tiles distintos', () => {
  const n = Object.keys(TILES).length;
  const seen = new Set();
  for (let i = 0; i < n; i++) {
    const r = uvForTile(i);
    assert.ok(r.u0 >= 0 && r.u1 <= 1 && r.v0 >= 0 && r.v1 <= 1);
    assert.ok(r.u0 < r.u1 && r.v0 < r.v1);
    const key = `${r.u0.toFixed(4)},${r.v0.toFixed(4)}`;
    assert.ok(!seen.has(key), 'tiles não devem se sobrepor');
    seen.add(key);
  }
});

test('atlas usa múltiplas linhas quando passa de ATLAS_COLS', () => {
  const n = Object.keys(TILES).length;
  if (n > ATLAS_COLS) {
    const r = uvForTile(ATLAS_COLS); // primeiro tile da 2a linha
    assert.ok(r.v0 > 0);
  }
});
