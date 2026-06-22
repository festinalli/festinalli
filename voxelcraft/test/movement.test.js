import test from 'node:test';
import assert from 'node:assert/strict';
import { moveHorizontalWithStep } from '../src/player/movement.js';
import { PLAYER } from '../src/player/collision.js';
import { BLOCK } from '../src/blocks.js';

// Mundo-fake: só os blocos sólidos declarados (isola o cenário do terreno gerado).
function fakeWorld(coords) {
  const solid = new Set(coords.map(([x, y, z]) => `${x},${y},${z}`));
  return { getBlock: (x, y, z) => (solid.has(`${x},${y},${z}`) ? BLOCK.STONE : BLOCK.AIR) };
}

// piso em y=10 (topo = 11) para x=0..4, z=0
const FLOOR = [];
for (let x = 0; x <= 4; x++) FLOOR.push([x, 10, 0]);
const startEye = 11 + PLAYER.eye; // pés no topo do piso

test('sobe degrau de 1 bloco apenas andando', () => {
  const world = fakeWorld([...FLOOR, [3, 11, 0]]); // degrau de 1 bloco em x=3
  const pos = { x: 1.5, y: startEye, z: 0.5 };
  moveHorizontalWithStep(world, pos, 2.0, 0, true);
  assert.ok(pos.x > 3.0, `deveria passar do degrau, x=${pos.x}`);
  assert.ok(pos.y > startEye + 0.5, `deveria ter subido, y=${pos.y}`);
});

test('NÃO sobe parede de 2 blocos', () => {
  const world = fakeWorld([...FLOOR, [3, 11, 0], [3, 12, 0]]);
  const pos = { x: 1.5, y: startEye, z: 0.5 };
  moveHorizontalWithStep(world, pos, 2.0, 0, true);
  assert.ok(pos.x < 3.0, `deveria ficar bloqueado, x=${pos.x}`);
  assert.ok(Math.abs(pos.y - startEye) < 0.2, `não deveria subir, y=${pos.y}`);
});

test('no ar (sem chão) não faz step-up', () => {
  const world = fakeWorld([...FLOOR, [3, 11, 0]]);
  const pos = { x: 1.5, y: startEye, z: 0.5 };
  moveHorizontalWithStep(world, pos, 2.0, 0, false); // grounded=false
  assert.ok(pos.x < 3.0, `não deveria subir/escalar, x=${pos.x}`);
  assert.ok(Math.abs(pos.y - startEye) < 0.2, `y não deveria mudar, y=${pos.y}`);
});
