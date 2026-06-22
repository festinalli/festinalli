# Spec 011 — Água (nível do mar)

> O QUÊ e o PORQUÊ.

## Intenção
Adicionar **água** ao mundo: depressões abaixo do nível do mar enchem com água
**semi-transparente**, criando lagos/oceanos e dando profundidade visual.

## Por que agora
Grande salto de imersão/atmosfera, e combina com as árvores (010) pra um mundo
mais "vivo". Ótimo pro post.

## Escopo
### Faz parte
- Bloco **WATER** preenchendo colunas abaixo do nível do mar (sobre o fundo de areia).
- Renderização em **passe transparente** separado (vê-se o fundo através da água).
- Água **não-sólida**: não bloqueia o jogador (ele afunda) e não oculta o terreno.
- Determinística (faz parte da geração por seed).

### NÃO faz parte
- Física de fluido (água não escorre ao cavar); natação/empuxo; ondas animadas;
  névoa subaquática.

## Critérios de aceitação
1. Existem corpos d'água visíveis (azul translúcido) nas partes baixas do mundo.
2. Dá pra **ver o fundo** (terreno) através da água (transparência).
3. A água **não colide** com o jogador (não é sólida); não há trees na água.
4. Só a **superfície/bordas** expostas ao ar são desenhadas (sem faces internas).
5. Geração continua determinística; `npm test` e `npm run build` verdes.
