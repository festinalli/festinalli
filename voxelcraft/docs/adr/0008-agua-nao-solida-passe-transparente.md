# ADR 0008 — Água: bloco não-sólido + passe transparente

- **Status:** Aceito
- **Data:** 2026-06-22

## Contexto
A feature 011 adiciona água. Precisamos decidir como a água interage com colisão,
face culling e renderização (transparência).

## Decisão
1. **Água é um bloco não-sólido** (`isSolid(WATER) === false`): não colide com o
   jogador (ele afunda) e **não oculta** as faces dos blocos vizinhos — por isso
   se vê o fundo do terreno através dela.
2. **Renderização em passe separado:** `buildChunkMesh` devolve duas malhas por
   chunk — `opaque` (sólidos, com atlas) e `water` (transparente). A malha de
   água usa `transparent:true`, `opacity:0.7`, **`depthWrite:false`** e
   `DoubleSide`, com `renderOrder` após o opaco.
3. **Faces de água só contra AR** (superfície no topo e bordas expostas); faces
   água-água e água-sólido não são desenhadas.
4. **Sem simulação de fluido:** a água é estática (não escorre ao cavar). Fica
   como possível feature futura.

## Consequências
- **Positivo:** visual de água translúcida com fundo visível; reaproveita o
  pipeline de face culling; `depthWrite:false` evita artefatos de ordenação.
- **Negativo:** sem natação/empuxo (o jogador afunda) e sem fluxo; a água não
  reage a edições. O raycast de edição ignora a água (clica-se "através" dela).
- O streamer passa a gerenciar duas malhas por chunk; `getMeshes()` (raycast)
  retorna apenas as opacas.
