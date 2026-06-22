# Spec 012 — Ciclo dia/noite

> O QUÊ e o PORQUÊ.

## Intenção
Dar ao mundo um **ciclo de dia e noite**: o sol nasce e se põe, a luz e a cor do
céu mudam, com um toque de alvorada/entardecer. Aumenta muito a atmosfera.

## Por que agora
Imersão de baixo custo que transforma a sensação do mundo e rende ótimos frames
pro post (amanhecer, pôr do sol, noite).

## Escopo
### Faz parte
- Sol que percorre o céu; **intensidade de luz, cor do céu e névoa** variando com
  a hora.
- Transição suave noite ↔ dia, com tom alaranjado no nascer/pôr do sol.
- Estado do céu calculado por uma **função pura** (testável).

### NÃO faz parte
- Lua/estrelas, sombras dinâmicas, relógio na HUD, dormir/pular a noite.

## Critérios de aceitação
1. Ao longo do tempo, o céu e a luz mudam (dia claro ↔ noite escura) de forma suave.
2. Ao meio-dia a cena é nitidamente mais clara/intensa que à meia-noite.
3. Há tom de alvorada/entardecer perto do horizonte.
4. `skyState(t)` é **determinística e verificável** (meio-dia > meia-noite em luz).
5. `npm test` e `npm run build` verdes.
