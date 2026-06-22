# Spec 014 — Sons procedurais

> O QUÊ e o PORQUÊ.

## Intenção
Dar **feedback sonoro** às ações: um som ao quebrar, outro ao colocar bloco, e
passos ao andar. Sons **gerados em runtime** (Web Audio), sem arquivos.

## Por que agora
Áudio fecha o laço de gameplay (013) e aumenta muito a sensação de presença —
com custo baixo e sem adicionar binários ao repo (igual ao atlas de texturas).

## Escopo
### Faz parte
- Sons sintetizados via **Web Audio API**: quebrar (ruído curto), colocar (toque
  grave), passos (toque suave ao andar no chão).
- `AudioContext` só inicia após gesto do usuário (no clique/lock).
- Mute liga/desliga (tecla `M`).

### NÃO faz parte
- Trilha/ambiente, sons por tipo de bloco, espacialização 3D, volume na UI.

## Critérios de aceitação
1. Quebrar e colocar emitem sons distintos; andar no chão gera passos ritmados.
2. O áudio só começa após interação (clique) — sem erro de autoplay.
3. `M` muta/desmuta.
4. O módulo de áudio **não quebra fora do browser** (import seguro em Node) e é
   minimamente testável; `npm test` e `npm run build` verdes.
