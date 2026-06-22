# ADR 0007 — Testes com node:test + CI

- **Status:** Aceito
- **Data:** 2026-06-22

## Contexto

Na fase 1 a verificação foi feita com scripts headless descartáveis (rodados e
apagados). Isso provou cada feature na hora, mas não deixou rede de segurança
versionada — a maior lacuna de rigor do projeto.

## Decisão

Adotar o **runner de testes nativo do Node (`node:test` + `node:assert/strict`)**,
com testes em `test/*.test.js`, e **CI no GitHub Actions** rodando
`npm ci → npm run build → npm test` em Node 22.

Os testes cobrem as partes **puras/determinísticas** (coordenadas, geração de
mundo, colisão, raycast, atlas, persistência). Render WebGL, pointer lock e
gameplay seguem como **validação manual** (não automatizados).

## Consequências

- **Positivo:** zero dependências novas (respeita a constitution: só Three.js em
  runtime, e agora nenhum framework de teste); regressões pegas no PR; o discurso
  "rápido sem apodrecer" passa a ter prova versionada.
- **Negativo:** cobertura não inclui browser/E2E — a confiança no que é visual
  ainda depende de rodar o jogo. Mitigado por funções puras isoladas e testáveis.
- O workflow vive em `.github/workflows/ci.yml` na raiz do repositório do jogo.
