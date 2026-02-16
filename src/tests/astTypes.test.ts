import { describe, it, expect } from 'vitest';
import { blockTypeLabel, hasChildBlocks } from '../core/astTypes';
import type { Block } from '../core/astTypes';

describe('astTypes', () => {
  it('blockTypeLabel returns labels for all block types', () => {
    expect(blockTypeLabel({ id: '1', t: 'heading', depth: 1, children: [] })).toBe('Heading 1');
    expect(blockTypeLabel({ id: '1', t: 'paragraph', children: [] })).toBe('Paragraph');
    expect(blockTypeLabel({ id: '1', t: 'code', lang: 'js', value: '' })).toBe('Code (js)');
    expect(blockTypeLabel({ id: '1', t: 'blockquote', children: [] })).toBe('Blockquote');
    expect(blockTypeLabel({ id: '1', t: 'list', ordered: true, items: [] })).toBe('Ordered list');
    expect(blockTypeLabel({ id: '1', t: 'list', ordered: false, items: [] })).toBe('Bullet list');
    expect(blockTypeLabel({ id: '1', t: 'table', header: [], rows: [] })).toBe('Table');
    expect(blockTypeLabel({ id: '1', t: 'thematicBreak' })).toBe('Horizontal rule');
    expect(blockTypeLabel({ id: '1', t: 'html', value: '' })).toBe('HTML');
    expect(blockTypeLabel({ id: '1', t: 'unknown', raw: '' })).toBe('Raw');
  });

  it('hasChildBlocks true for blockquote and list', () => {
    const bq: Block = { id: '1', t: 'blockquote', children: [] };
    const list: Block = { id: '2', t: 'list', ordered: false, items: [] };
    expect(hasChildBlocks(bq)).toBe(true);
    expect(hasChildBlocks(list)).toBe(true);
  });

  it('hasChildBlocks false for paragraph', () => {
    const p: Block = { id: '1', t: 'paragraph', children: [] };
    expect(hasChildBlocks(p)).toBe(false);
  });
});
