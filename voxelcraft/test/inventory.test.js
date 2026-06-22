import test from 'node:test';
import assert from 'node:assert/strict';
import { makeInventory, count, addBlock, takeBlock, toJSON, fromJSON } from '../src/player/inventory.js';
import { BLOCK } from '../src/blocks.js';

const BLOCKS = [BLOCK.GRASS, BLOCK.STONE, BLOCK.WOOD];

test('estoque inicial e add', () => {
  const inv = makeInventory(BLOCKS, 5);
  assert.equal(count(inv, BLOCK.GRASS), 5);
  addBlock(inv, BLOCK.GRASS, 2);
  assert.equal(count(inv, BLOCK.GRASS), 7);
});

test('take remove 1 e falha em 0', () => {
  const inv = makeInventory(BLOCKS, 1);
  assert.equal(takeBlock(inv, BLOCK.STONE), true);
  assert.equal(count(inv, BLOCK.STONE), 0);
  assert.equal(takeBlock(inv, BLOCK.STONE), false); // sem estoque
  assert.equal(count(inv, BLOCK.STONE), 0);
});

test('round-trip JSON', () => {
  const inv = makeInventory(BLOCKS, 3);
  addBlock(inv, BLOCK.WOOD, 9);
  const back = fromJSON(toJSON(inv), BLOCKS);
  assert.equal(count(back, BLOCK.WOOD), 12);
  assert.equal(count(back, BLOCK.GRASS), 3);
});
