import { collidesAABB } from './collision.js';

// Varredura/colisão de movimento — PURO (opera sobre pos {x,y,z} = olho do jogador).
// Testável headless: usa apenas collidesAABB(world, x, y, z).

const MAX_STEP = 0.2; // subdivisão do movimento (anti-tunneling)
export const STEP_HEIGHT = 1.05; // altura máxima de degrau auto-subível (1 bloco)

/**
 * Move `pos` ao longo de um eixo por `amount`, em substeps, parando antes de
 * colidir. Retorna true se algum passo foi bloqueado. Muta `pos`.
 */
export function sweepAxis(world, pos, axis, amount) {
  if (amount === 0) return false;
  const steps = Math.max(1, Math.ceil(Math.abs(amount) / MAX_STEP));
  const step = amount / steps;
  let blocked = false;
  for (let i = 0; i < steps; i++) {
    const prev = pos[axis];
    pos[axis] += step;
    if (collidesAABB(world, pos.x, pos.y, pos.z)) {
      pos[axis] = prev;
      blocked = true;
      break;
    }
  }
  return blocked;
}

function climb(world, pos, maxH) {
  let done = 0;
  const s = 0.1;
  while (done < maxH) {
    const d = Math.min(s, maxH - done);
    pos.y += d;
    if (collidesAABB(world, pos.x, pos.y, pos.z)) {
      pos.y -= d;
      break;
    }
    done += d;
  }
  return done;
}

function dropDown(world, pos, maxH) {
  let done = 0;
  const s = 0.1;
  while (done < maxH) {
    const d = Math.min(s, maxH - done);
    pos.y -= d;
    if (collidesAABB(world, pos.x, pos.y, pos.z)) {
      pos.y += d;
      break;
    }
    done += d;
  }
  return done;
}

function moveAxisStep(world, pos, axis, amount, grounded) {
  if (amount === 0) return;
  const start = pos[axis];
  const y0 = pos.y;
  const blocked = sweepAxis(world, pos, axis, amount);
  if (!blocked || !grounded) return;

  const blockedVal = pos[axis];
  // desfaz a tentativa rasa e tenta subir o degrau
  pos[axis] = start;
  pos.y = y0;
  const climbed = climb(world, pos, STEP_HEIGHT);
  if (climbed <= 0) {
    pos[axis] = blockedVal;
    pos.y = y0;
    return;
  }
  sweepAxis(world, pos, axis, amount);
  const stepVal = pos[axis];
  dropDown(world, pos, climbed + 0.05); // assenta no topo do degrau

  // sem progresso extra? reverte (evita flutuar ao bater em parede)
  if (Math.abs(stepVal - start) <= Math.abs(blockedVal - start) + 1e-6) {
    pos[axis] = blockedVal;
    pos.y = y0;
  }
}

/**
 * Move horizontalmente (X e Z) com auto step-up de até STEP_HEIGHT,
 * somente quando `grounded`. Muta `pos`.
 */
export function moveHorizontalWithStep(world, pos, dx, dz, grounded) {
  moveAxisStep(world, pos, 'x', dx, grounded);
  moveAxisStep(world, pos, 'z', dz, grounded);
}
