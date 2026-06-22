import test from 'node:test';
import assert from 'node:assert/strict';
import { createSound } from '../src/audio/sound.js';

test('createSound expõe a API e não quebra fora do browser', () => {
  const s = createSound();
  assert.equal(typeof s.resume, 'function');
  assert.equal(typeof s.playBreak, 'function');
  assert.equal(typeof s.playPlace, 'function');
  assert.equal(typeof s.playStep, 'function');
  assert.equal(typeof s.toggle, 'function');

  // sem window/AudioContext (Node): tudo é no-op seguro
  assert.doesNotThrow(() => {
    s.resume();
    s.playBreak();
    s.playPlace();
    s.playStep();
  });
});

test('toggle alterna o estado de mute', () => {
  const s = createSound();
  const a = s.toggle();
  const b = s.toggle();
  assert.equal(typeof a, 'boolean');
  assert.notEqual(a, b);
});
