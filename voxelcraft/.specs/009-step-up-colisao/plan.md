# Plan 009 — Step-up de colisão

> O COMO.

## Novo módulo `src/player/movement.js` (PURO, testável)
Opera sobre um `pos = {x,y,z}` (posição do olho) e usa `collidesAABB(world,...)`.

```js
export const STEP_HEIGHT = 1.05;
export function sweepAxis(world, pos, axis, amount): boolean  // move c/ substep; true se bloqueou
export function moveHorizontalWithStep(world, pos, dx, dz, grounded): void
```

`moveHorizontalWithStep` (por eixo X e Z):
1. tenta `sweepAxis(axis, amount)`; se não bloqueou ou não está no chão, fim.
2. se bloqueou e está no chão: desfaz, **sobe** até `STEP_HEIGHT` (parando se a
   cabeça bater), tenta mover de novo no eixo, e **desce** (assenta no degrau).
3. se não houve progresso extra além da tentativa rasa, **reverte** (posição e Y
   originais) — evita "flutuar" ao bater numa parede.

## `controls.js` (refactor)
- Remove o `moveAxis` local; passa a montar um `pos` a partir de `camera.position`,
  usa `movement.js` (horizontal com step quando andando; `sweepAxis` no voo e na
  vertical de gravidade/pulo) e copia `pos` de volta pra câmera.
- Constantes de movimento seguem em `controls.js`; `STEP_HEIGHT`/varredura em
  `movement.js`.

## Decisão
- Step-up só quando `onGround` (critério 3) — não vira "escalada de parede".
- Mover a varredura pra módulo puro foi a escolha que torna a física testável.
  (Refinamento do ADR 0004; sem ADR novo.)

## Validação
- `test/movement.test.js`: degrau de 1 bloco → sobe; parede de 2 → não sobe;
  no ar → não sobe. + `npm run build`.
