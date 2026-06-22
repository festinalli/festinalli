import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTarget } from '../src/player/editing.js';

test('resolveTarget topo (+y): bloco atingido e vizinho acima', () => {
  const r = resolveTarget({ x: 10.5, y: 6, z: 10.5 }, { x: 0, y: 1, z: 0 });
  assert.deepEqual(r.hit, { x: 10, y: 5, z: 10 });
  assert.deepEqual(r.place, { x: 10, y: 6, z: 10 });
});

test('resolveTarget face +x: vizinho à direita', () => {
  const r = resolveTarget({ x: 11, y: 5.5, z: 10.5 }, { x: 1, y: 0, z: 0 });
  assert.deepEqual(r.hit, { x: 10, y: 5, z: 10 });
  assert.deepEqual(r.place, { x: 11, y: 5, z: 10 });
});

test('resolveTarget face -z: vizinho atrás', () => {
  const r = resolveTarget({ x: 10.5, y: 5.5, z: 10 }, { x: 0, y: 0, z: -1 });
  assert.deepEqual(r.hit, { x: 10, y: 5, z: 10 });
  assert.deepEqual(r.place, { x: 10, y: 5, z: 9 });
});
