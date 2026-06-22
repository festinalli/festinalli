# Tasks 011 — Água

- [x] T1 — blocks.js: BLOCK.WATER + cor; isSolid exclui WATER.
- [x] T2 — world.js generateChunk: preenche água até o nível do mar.
- [x] T3 — world.js buildChunkMesh: retorna {opaque, water}; faces de água só
  contra AIR; opaco desenha faces viradas pra água.
- [x] T4 — streamer.js: gerencia {opaque, water} por chunk; getMeshes = opacos.
- [x] T5 — main.js: waterMaterial transparente; passa materials ao streamer.
- [x] T6 — ADR 0008 (água não-sólida + passe transparente).
- [x] T7 — test/water.test.js + ajustar world.test (buildChunkMesh → .opaque).
- [x] T8 — npm test + npm run build verdes + print.
- [ ] T9 — Validação manual (água translúcida, fundo visível) — humano.
- [x] T10 — Atualizar LOOP (011 → feito).
