import { describe, it, expect } from 'vitest';
import type { Doc, Block } from '../core/astTypes';
import { indexOfBlock, moveBlock, moveBlockById, reorderBlocks, reorderBlocksById } from '../core/reorder';

function doc(blocks: Block[]): Doc {
  return { blocks };
}

describe('reorder', () => {
  const b = (id: string): Block =>
    ({ id, t: 'paragraph', children: [] });

  it('indexOfBlock finds block by id', () => {
    const d = doc([b('a'), b('b'), b('c')]);
    expect(indexOfBlock(d, 'b')).toBe(1);
    expect(indexOfBlock(d, 'x')).toBe(-1);
  });

  it('moveBlock moves block and returns new doc', () => {
    const d = doc([b('a'), b('b'), b('c')]);
    const out = moveBlock(d, 0, 2);
    expect(out.blocks.map((x) => x.id)).toEqual(['b', 'c', 'a']);
    expect(d.blocks.map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('moveBlock does not mutate original', () => {
    const d = doc([b('a'), b('b')]);
    moveBlock(d, 0, 1);
    expect(d.blocks[0].id).toBe('a');
  });

  it('reorderBlocks inserts source before target', () => {
    const d = doc([b('a'), b('b'), b('c')]);
    const out = reorderBlocks(d, 2, 0);
    expect(out.blocks.map((x) => x.id)).toEqual(['c', 'a', 'b']);
  });

  it('reorderBlocksById moves by id', () => {
    const d = doc([b('a'), b('b'), b('c')]);
    const out = reorderBlocksById(d, 'c', 'a');
    expect(out.blocks.map((x) => x.id)).toEqual(['c', 'a', 'b']);
  });

  it('reorderBlocksById with null moves to end', () => {
    const d = doc([b('a'), b('b'), b('c')]);
    const out = reorderBlocksById(d, 'a', null);
    expect(out.blocks.map((x) => x.id)).toEqual(['b', 'c', 'a']);
  });

  it('reorderBlocksById returns same doc for invalid id', () => {
    const d = doc([b('a'), b('b')]);
    expect(reorderBlocksById(d, 'x', 'a')).toBe(d);
    expect(reorderBlocksById(d, 'a', 'x')).toBe(d);
  });

  it('moveBlock returns same doc for out-of-range indices', () => {
    const d = doc([b('a'), b('b')]);
    expect(moveBlock(d, -1, 0)).toBe(d);
    expect(moveBlock(d, 0, 10)).toBe(d);
  });

  it('moveBlockById moves to index', () => {
    const d = doc([b('a'), b('b'), b('c')]);
    const out = moveBlockById(d, 'a', 2);
    expect(out.blocks.map((x) => x.id)).toEqual(['b', 'c', 'a']);
  });

  it('reorderBlocks handles target before source', () => {
    const d = doc([b('a'), b('b'), b('c')]);
    const out = reorderBlocks(d, 0, 2);
    expect(out.blocks.map((x) => x.id)).toEqual(['b', 'a', 'c']);
  });
});
