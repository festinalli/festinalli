# Plan 008 — Testes automatizados + CI

> O COMO.

## Abordagem
- **Runner nativo `node:test`** + `node:assert/strict` (Node 22) — sem framework,
  coerente com a constitution (só Three.js como dependência de runtime; nada novo
  em runtime, e nada de framework de teste).
- Testes vivem em `test/*.test.js` (ESM). `npm test` = `node --test`.
- Cobrir apenas o que é **determinístico/headless** (sem WebGL/DOM):
  - `test/world.test.js`: chunkCoord/localCoord/parseKey (negativos), generateChunk
    determinístico e ≠ entre seeds, World.getBlock == generateChunk, Y fora = AIR,
    setBlock+isModified, buildChunkMesh não-vazio com uv, surfaceY.
  - `test/collision.test.js`: collidesAABB dentro/fora, acima da superfície.
  - `test/editing.test.js`: resolveTarget (topo/+x/-z) hit & place.
  - `test/atlas.test.js`: tileFor (grama/madeira/demais), uvForTile em [0,1],
    multi-linha, tiles distintos.
  - `test/persistence.test.js`: serializeChunks→deserializeChunks round-trip e
    rejeição de versão inválida.

## CI
`.github/workflows/ci.yml` (na raiz do repo do jogo): em push/PR, Node 22 →
`npm ci` → `npm run build` → `npm test`.

> Nota de logística: na branch do festinalli o arquivo fica em
> `voxelcraft/.github/...` e não dispara (workflows só rodam na raiz do repo).
> Ao sincronizar `voxelcraft/*` para a raiz do repo próprio, vira
> `.github/workflows/ci.yml` e passa a rodar.

## Decisão
- `node:test` em vez de Jest/Vitest: zero deps, suficiente para funções puras,
  alinhado à constitution. Registrado no ADR 0007.

## Validação
- `npm test` verde + `npm run build` ok (cobre todos os critérios).
