# Spec 008 — Testes automatizados + CI

> O QUÊ e o PORQUÊ.

## Intenção

Transformar a verificação (que na fase 1 eram scripts descartáveis) em uma
**suíte de testes commitada** e rodando em **CI**, para que cada mudança seja
verificada automaticamente — fechando a maior lacuna de rigor apontada na análise.

## Por que agora

O projeto se vende como "rápido sem apodrecer". Sem testes versionados nem CI, a
parte "não apodrece" fica só na promessa. É o primeiro passo da fase 2.

## Escopo

### Faz parte
- Suíte com o runner nativo **`node:test`** (zero dependências novas), cobrindo as
  partes puras/headless: coordenadas e geração de mundo, colisão, raycast
  (resolveTarget), atlas (tileFor/uvForTile) e persistência (round-trip).
- Script `npm test`.
- **CI no GitHub Actions**: a cada push/PR roda `npm ci`, `npm run build`, `npm test`.

### NÃO faz parte
- Testes de browser/E2E (pointer lock, render WebGL) — ficam como validação manual.
- Cobertura de UI/DOM.

## Critérios de aceitação
1. `npm test` roda e **passa** localmente, sem dependências novas.
2. Os testes cobrem: coordenadas (incl. negativos), determinismo da geração,
   `World.getBlock`, colisão AABB, `resolveTarget`, atlas e persistência.
3. Existe workflow de CI que roda build + testes em Node 22.
4. `npm run build` continua passando.
