# Spec 009 — Step-up de colisão

> O QUÊ e o PORQUÊ.

## Intenção

Permitir que o jogador **suba degraus de 1 bloco apenas andando** (sem precisar
pular), como no Minecraft. Hoje a colisão "trava" ao esbarrar em qualquer bloco —
o que foi apontado como aspereza de UX na análise.

## Por que agora
É um retoque pequeno de altíssimo retorno na sensação de jogo, e abre caminho pra
mover a lógica de movimento pra um módulo puro/testável (alinha com o rigor da 008).

## Escopo

### Faz parte
- Auto **step-up de até 1 bloco** ao andar, somente quando o jogador está no chão.
- Mover a lógica de varredura/colisão de movimento de `controls.js` para um módulo
  **puro** (`movement.js`), testável headless.
- Manter modo voo, pulo e gravidade funcionando como antes.

### NÃO faz parte
- Rampas/slabs com meia altura; subir mais de 1 bloco; "coyote time".

## Critérios de aceitação
1. Andando contra um degrau de **1 bloco**, no chão, o jogador **sobe** sem pular.
2. Contra uma parede de **2 blocos**, o jogador **não** sobe (continua bloqueado).
3. No ar (sem estar no chão), não há step-up (não "escala" paredes).
4. Modo voo, pulo e gravidade seguem funcionando.
5. A lógica de step-up é **verificável** por teste (módulo puro).
6. `npm test` e `npm run build` verdes.
