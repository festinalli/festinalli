# ADR 0009 — Inventário finito (coletar/consumir)

- **Status:** Aceito
- **Data:** 2026-06-22

## Contexto
Até a fase 1 a colocação de blocos era "criativa/infinita" (qualquer quantidade).
A feature 013 introduz um laço de gameplay: quebrar dá blocos, colocar consome.

## Decisão
Adotar um **inventário finito** com contagem por tipo de bloco:
- **Quebrar** um bloco adiciona +1 daquele tipo ao inventário (drop).
- **Colocar** consome 1 do tipo selecionado; com 0, a colocação é bloqueada.
- O jogador começa com um **estoque inicial modesto** por tipo de bloco, para a
  construção não travar logo de cara.
- O inventário é **persistido** no save (campo opcional, retrocompatível).

A lógica fica num módulo **puro** (`inventory.js`), testável.

## Consequências
- **Positivo:** dá propósito a quebrar (coletar) e peso a construir; testável;
  base para futuras mecânicas (stack limitado, craft).
- **Negativo:** muda a sensação "criativa"; sem stacking limitado, craft ou
  ferramentas (ficam fora de escopo). Quem quiser modo criativo precisaria de um
  toggle (não incluso).
- Substitui o comportamento de blocos infinitos das features 002/007.
