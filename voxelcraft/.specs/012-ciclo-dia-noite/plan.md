# Plan 012 — Ciclo dia/noite

> O COMO.

## `src/world/daynight.js` (PURO)
```js
export function skyState(t): {   // t = fração do dia em [0,1)
  sunDir: {x,y,z},               // direção do sol (normalizada)
  sunIntensity, ambient, hemi,   // intensidades de luz
  sky: {r,g,b}, fog: {r,g,b},    // cores (sRGB 0..1)
  day,                           // 0 (noite) .. 1 (dia) p/ referência/teste
}
```
- `ang = t·2π`; `elev = sin(ang)` (meio-dia em t=0.25, meia-noite em t=0.75).
- `day = smoothstep(clamp((elev+0.1)/0.4, 0, 1))` (com crepúsculo).
- céu = mistura(NOITE, DIA, day); tinta de **alvorada/entardecer** (laranja)
  proporcional a `exp(-elev²/…)` (pico no horizonte).
- intensidades interpoladas por `day` (sol/ambiente/hemisfério fracos à noite).

## `main.js`
- Guarda refs de `ambient`/`hemi`; mantém `dayT` e avança `dayT += dt/DAY_LENGTH`
  (ciclo ~120 s). A cada frame aplica `skyState(dayT)`: posição/intensidade do
  sol, ambiente, hemisfério, `scene.background` e `scene.fog.color`
  (via `setRGB(r,g,b, SRGBColorSpace)`).

## Decisão
- Estado do céu numa função pura (sem THREE) → testável e reaproveitável.
  (Imersão; sem ADR — não muda arquitetura.)

## Validação
- `test/daynight.test.js`: meio-dia mais claro/intenso que meia-noite; `day≈1`
  ao meio-dia e `≈0` à meia-noite; `sunDir.y` positivo ao meio-dia, negativo à
  meia-noite. + `npm run build`.
