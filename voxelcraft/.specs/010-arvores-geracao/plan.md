# Plan 010 — Árvores na geração

> O COMO.

## Mudanças em `src/world/world.js`
- `hash01(x,z,seed,salt)`: hash determinístico → [0,1).
- `columnHeight(noise,wx,wz)` extraído (usado por terreno e árvores) +
  `terrainHeight(seed,wx,wz)` exportado (conveniência p/ testes).
- `hasTree(seed,wx,wz)`: `hash01 < TREE_DENSITY` (exportado).
- `stampTree(data, baseX, baseZ, seed, wx, wz, h)`: tronco (WOOD) `h+1..h+trunkH`
  (trunkH 4–6 por hash) + copa (LEAVES) em camadas (raio 2 embaixo, 1 no topo,
  cantos arredondados). `setLocal` grava só se a célula cair no chunk; folhas só
  em AIR.
- `generateChunk`: após o terreno, percorre origens de árvore numa **margem**
  `TREE_MARGIN=2` ao redor do chunk e carimba cada árvore — assim a copa que
  nasce num chunk vizinho é gravada na parte que invade o chunk atual.

## Por que stamping com margem
Geração é por chunk, mas árvores são maiores que 1 coluna. Como tudo é
determinístico por coordenada global, cada chunk recomputa as mesmas árvores das
colunas vizinhas (até `TREE_MARGIN`) e grava só os blocos que caem nele →
**cross-chunk seamless**, sem estado compartilhado.

## Validação
- `test/trees.test.js`: `hasTree` determinístico; existem WOOD e LEAVES gerados;
  **copa cruza a fronteira** (acha uma árvore com origem em `localCoord>=14` e
  confirma LEAVES na coluna `wx+2` — que está no chunk seguinte).
- `npm run build`.
