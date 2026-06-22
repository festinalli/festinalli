// Inventário com quantidades — PURO (sem DOM/THREE), testável.
// counts: mapa blockType(number) -> quantidade.

export function makeInventory(blocks, initial = 0) {
  const counts = {};
  for (const b of blocks) counts[b] = initial;
  return { counts };
}

export function count(inv, block) {
  return inv.counts[block] || 0;
}

export function addBlock(inv, block, n = 1) {
  inv.counts[block] = (inv.counts[block] || 0) + n;
}

/** Remove 1 do bloco; retorna true se havia estoque, false se 0. */
export function takeBlock(inv, block) {
  if ((inv.counts[block] || 0) <= 0) return false;
  inv.counts[block] -= 1;
  return true;
}

export function toJSON(inv) {
  return inv.counts;
}

export function fromJSON(obj, blocks) {
  const inv = makeInventory(blocks, 0);
  if (obj) {
    for (const k of Object.keys(obj)) inv.counts[k] = obj[k];
  }
  return inv;
}
