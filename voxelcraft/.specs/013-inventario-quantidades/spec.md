# Spec 013 — Drops + inventário com quantidades

> O QUÊ e o PORQUÊ.

## Intenção
Dar peso às ações: **quebrar um bloco te dá aquele bloco** (drop) e **colocar
consome** uma unidade do tipo selecionado. A hotbar passa a mostrar **quantidades**.

## Por que agora
Transforma o "modo criativo infinito" num laço de gameplay real (coletar →
construir), pedido na frente "mais gameplay".

## Escopo
### Faz parte
- Inventário com **contagem por tipo de bloco**.
- Quebrar adiciona +1 do bloco quebrado; colocar consome 1 do selecionado.
- Não dá pra colocar um bloco com quantidade 0.
- HUD da hotbar mostra a **quantidade** de cada slot.
- Estoque inicial modesto por bloco (pra dá pra construir de cara).
- Inventário **persiste** no save.

### NÃO faz parte
- Grade de inventário arrastável, stacking limitado (ex.: 64), craft, ferramentas.

## Critérios de aceitação
1. Ao quebrar um bloco, a quantidade daquele tipo **aumenta** na hotbar.
2. Ao colocar, a quantidade do selecionado **diminui**; em 0, não coloca.
3. A HUD mostra as quantidades e reflete as mudanças na hora.
4. O inventário sobrevive ao recarregar (persistido).
5. A lógica de inventário é **pura e testável**; `npm test` e `npm run build` verdes.
