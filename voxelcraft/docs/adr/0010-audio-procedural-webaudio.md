# ADR 0010 — Áudio procedural via Web Audio

- **Status:** Aceito
- **Data:** 2026-06-22

## Contexto
A feature 014 adiciona som (quebrar/colocar/passos). Poderíamos incluir arquivos
de áudio no repo ou sintetizar em runtime.

## Decisão
Sintetizar os sons em runtime com a **Web Audio API** (osciladores + ruído +
envelopes), sem nenhum arquivo de áudio — espelhando a decisão do atlas
procedural (ADR 0005) e a constitution (repositório 100% texto/código).

- `AudioContext` é criado **lazy**, só após gesto do usuário (no clique/lock),
  evitando bloqueio de autoplay.
- O módulo `sound.js` é seguro para importar fora do browser (sem `window` no
  topo); `playX()` vira no-op se não houver contexto ou se estiver mutado.

## Consequências
- **Positivo:** zero binários; import seguro/testável; sem pipeline de assets.
- **Negativo:** sons sintéticos simples (menos ricos que samples reais); sem
  variação por tipo de bloco nem espacialização (ficam fora de escopo).
