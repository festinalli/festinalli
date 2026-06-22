# Plan 014 — Sons procedurais

> O COMO.

## `src/audio/sound.js`
```js
export function createSound(): {
  resume(),         // cria/retoma o AudioContext (após gesto)
  playBreak(), playPlace(), playStep(),
  toggle(): boolean // mute on/off
}
```
- `AudioContext` é criado **lazy** dentro de `resume()` — import seguro em Node
  (sem `window`/`AudioContext` no topo).
- Síntese: quebrar = rajada de ruído branco com filtro + envelope rápido;
  colocar = oscilador grave curto; passo = toque suave/curto e baixo.
- `playX()` é no-op se não houver contexto (ex.: Node) ou se mutado.

## Integração
- `main.js`: `const sound = createSound()`; no evento `lock` → `sound.resume()`;
  tecla `M` → `sound.toggle()`.
- `editing.js`: novos callbacks `onBreak`/`onPlace` (disparados ao quebrar/colocar)
  → `main` liga em `sound.playBreak/ playPlace`.
- `controls.js`: aceita `opts.onStep`; acumula distância horizontal andada no chão
  e dispara `onStep` a cada passada (`STRIDE`) → `main` liga em `sound.playStep`.

## Decisão (ADR 0010)
- **Áudio procedural via Web Audio**, sem arquivos (coerente com o atlas
  procedural / constitution: repo 100% texto). Registrado no ADR 0010.

## Validação
- `test/sound.test.js`: `createSound()` retorna a API e `playBreak/Place/Step`
  não lançam fora do browser (no-op). + `npm run build`.
