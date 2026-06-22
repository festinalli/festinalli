# Plan 013 — Drops + inventário com quantidades

> O COMO.

## `src/player/inventory.js` (PURO)
```js
makeInventory(blocks, initial=0): { counts }
count(inv, block): number
addBlock(inv, block, n=1): void
takeBlock(inv, block): boolean   // -1 se houver; false se 0
toJSON(inv) / fromJSON(obj, blocks)
```

## `src/player/editing.js`
- Recebe `inventory` + `onInventoryChange`.
- **Quebrar:** lê o bloco antes de apagar; `addBlock(inv, broken)`; rebuild; avisa.
- **Colocar:** só se `count(inv, selected) > 0` → `takeBlock`; senão, nada.

## `main.js`
- Cria `inventory = fromJSON(saved.inv, HOTBAR)` ou `makeInventory(HOTBAR, INITIAL)`.
- `renderHotbar(selected)` mostra a **quantidade** por slot (slot zerado fica apagado).
- Passa `inventory` e `onInventoryChange` (re-render HUD + autosave) ao editing.

## `src/world/persistence.js`
- `serializeChunks(entries, seed, player, inv)` inclui `inv`; `deserializeChunks`
  devolve `inv`. Mantém **VERSION=2** (campo novo é opcional/retrocompatível).

## Decisão (ADR 0009)
- Sai o "criativo infinito", entra **inventário finito** (coletar/consumir), com
  estoque inicial modesto pra não travar a construção. Registrado no ADR 0009.

## Validação
- `test/inventory.test.js`: add/take/count, take em 0 falha; round-trip JSON.
- `test/persistence.test.js`: round-trip agora inclui `inv`.
- `npm run build`.
