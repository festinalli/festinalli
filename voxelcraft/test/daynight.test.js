import test from 'node:test';
import assert from 'node:assert/strict';
import { skyState } from '../src/world/daynight.js';

test('meio-dia é mais claro/intenso que meia-noite', () => {
  const noon = skyState(0.25);
  const midnight = skyState(0.75);
  assert.ok(noon.sunIntensity > midnight.sunIntensity);
  assert.ok(noon.ambient > midnight.ambient);
  const noonLum = noon.sky.r + noon.sky.g + noon.sky.b;
  const nightLum = midnight.sky.r + midnight.sky.g + midnight.sky.b;
  assert.ok(noonLum > nightLum, 'céu de dia mais claro');
});

test('day vale ~1 ao meio-dia e ~0 à meia-noite', () => {
  assert.ok(skyState(0.25).day > 0.9);
  assert.equal(skyState(0.75).day, 0);
});

test('sol acima do horizonte ao meio-dia, abaixo à meia-noite', () => {
  assert.ok(skyState(0.25).sunDir.y > 0);
  assert.ok(skyState(0.75).sunDir.y < 0);
});

test('sunDir é normalizado', () => {
  const d = skyState(0.4).sunDir;
  const len = Math.hypot(d.x, d.y, d.z);
  assert.ok(Math.abs(len - 1) < 1e-6);
});
