import test from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../src/world/world.js';
import { collidesAABB, PLAYER } from '../src/player/collision.js';

test('collidesAABB detecta sólido e ar livre', () => {
  const w = new World(99999);
  const sy = w.surfaceY(0, 0); // topo do bloco mais alto
  // pés dentro do terreno -> colide
  assert.equal(collidesAABB(w, 0.5, 1 + PLAYER.eye, 0.5), true);
  // bem acima da superfície -> não colide
  assert.equal(collidesAABB(w, 0.5, sy + 0.1 + PLAYER.eye, 0.5), false);
  // muito alto -> não colide
  assert.equal(collidesAABB(w, 0.5, 200, 0.5), false);
});
