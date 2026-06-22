# Spec 010 — Árvores na geração

> O QUÊ e o PORQUÊ.

## Intenção
Enriquecer o terreno (hoje só relevo por altura) com **árvores** — tronco de
madeira + copa de folhas — geradas proceduralmente, dando vida e escala ao mundo.

## Por que agora
É o maior salto visual de baixo custo e ataca a crítica "terreno plano demais".
Bom material pro post também.

## Escopo
### Faz parte
- Árvores **determinísticas** por coordenada global (mesma seed ⇒ mesmas árvores).
- Só em terra acima do nível da água; densidade baixa.
- **Copa que cruza fronteiras de chunk sem cortar** (stamping consistente).

### NÃO faz parte
- Tipos variados de árvore, frutos, decaimento de folhas, biomas.

## Critérios de aceitação
1. O mundo passa a ter árvores (tronco WOOD + copa LEAVES) espalhadas.
2. Geração continua **determinística** (mesma seed ⇒ mesmo mundo, incluindo árvores).
3. Uma árvore na borda de um chunk aparece **inteira** — a copa não é cortada na
   fronteira (verificável: célula de copa do outro lado do chunk existe).
4. `npm test` e `npm run build` verdes.
