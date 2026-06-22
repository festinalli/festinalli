import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeChunks, deserializeChunks } from '../src/world/persistence.js';

test('serializeChunks -> deserializeChunks faz round-trip exato', () => {
  const data = new Uint8Array(16 * 16 * 48);
  for (let i = 0; i < data.length; i++) data[i] = (i * 7 + 3) % 9;
  const entries = [['2,-1', data]];
  const player = { x: 1.5, y: 20.25, z: -3.75 };

  const str = serializeChunks(entries, 1337, player);
  const back = deserializeChunks(str);

  assert.equal(back.seed, 1337);
  assert.deepEqual(back.player, player);
  assert.equal(back.chunks.length, 1);
  const [key, bytes] = back.chunks[0];
  assert.equal(key, '2,-1');
  assert.deepEqual([...bytes], [...data]);
});

test('deserializeChunks rejeita versão/JSON inválido', () => {
  assert.equal(deserializeChunks('{nao json'), null);
  assert.equal(deserializeChunks(JSON.stringify({ v: 1, chunks: {} })), null);
  assert.equal(deserializeChunks(JSON.stringify({ v: 2 })), null);
});
