# Plan 011 — Água

> O COMO.

## blocks.js
- Novo `BLOCK.WATER`; `BLOCK_COLOR[WATER]` (azul).
- **`isSolid` passa a excluir WATER** → água não oclui faces nem colide.

## world.js
- `generateChunk`: após preencher a coluna, se `height < WATER_LEVEL`, preenche
  `y = height+1 .. WATER_LEVEL` com WATER (fundo segue sendo SAND).
- `buildChunkMesh` agora retorna **`{ opaque, water }`** (duas geometrias):
  - **opaco** (sólidos): face desenhada se vizinho `!isSolid` (logo, faces viradas
    pra água SÃO desenhadas → vê-se o fundo). Mantém uv/atlas + vertexColors.
  - **água**: para cada bloco WATER, desenha uma face só se o vizinho é **AIR**
    (superfície no topo; laterais só em bordas expostas). Sem uv; vertexColors =
    azul·sombreamento.
  - assinatura: `buildChunkMesh(world, cx, cz, materials?)`, `materials =
    { opaque, water }` (defaults p/ teste headless).

## collision.js
- Sem mudança de código: usa `isSolid`, que agora ignora WATER (água não colide).

## streamer.js
- Passa a guardar por chunk `{ opaque, water }`; adiciona/dispõe ambos.
  `getMeshes()` retorna só os **opacos** (raycast de edição ignora a água).

## main.js
- Cria `waterMaterial` (transparente, `depthWrite:false`, `DoubleSide`,
  vertexColors); passa `materials = { opaque, water }` ao streamer.

## Decisão (ADR 0008)
- Água como **bloco não-sólido** + **passe transparente** com `depthWrite:false`
  (evita artefatos de ordenação). Sem simulação de fluido (estática). Registrado
  no ADR 0008.

## Validação
- `test/water.test.js`: `isSolid(WATER)` falso; geração produz WATER; `buildChunkMesh`
  devolve `{opaque, water}` com água não-vazia e sem uv (água) / com uv (opaco).
- `npm run build` + print renderizado.
