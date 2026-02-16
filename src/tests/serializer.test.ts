import { describe, it, expect } from 'vitest';
import type { Doc, Block, TableRow } from '../core/astTypes';
import { serialize } from '../core/serializer';

function doc(blocks: Block[]): Doc {
  return { blocks };
}

describe('serializer', () => {
  it('serializes empty doc to empty string', () => {
    expect(serialize(doc([]))).toBe('');
  });

  it('serializes paragraph', () => {
    const d = doc([{ id: '1', t: 'paragraph', children: [{ t: 'text', value: 'Hi' }] }]);
    expect(serialize(d)).toContain('Hi');
  });

  it('serializes heading', () => {
    const d = doc([{ id: '1', t: 'heading', depth: 2, children: [{ t: 'text', value: 'Title' }] }]);
    expect(serialize(d)).toBe('## Title');
  });

  it('serializes code block', () => {
    const d = doc([{ id: '1', t: 'code', lang: 'js', value: 'const x = 1;' }]);
    expect(serialize(d)).toContain('```');
    expect(serialize(d)).toContain('const x = 1;');
  });

  it('serializes table', () => {
    const headerRow: TableRow = [[{ t: 'text', value: 'A' }], [{ t: 'text', value: 'B' }]];
    const dataRows: TableRow[] = [[[{ t: 'text', value: '1' }], [{ t: 'text', value: '2' }]]];
    const d = doc([
      {
        id: '1',
        t: 'table',
        header: headerRow,
        rows: dataRows,
      },
    ]);
    const s = serialize(d);
    expect(s).toContain('|');
    expect(s).toContain('---');
  });

  it('serializes blockquote and list', () => {
    const d = doc([
      { id: '1', t: 'blockquote', children: [{ id: '2', t: 'paragraph', children: [{ t: 'text', value: 'Quote' }] }] },
      {
        id: '3',
        t: 'list',
        ordered: false,
        items: [[{ id: '4', t: 'paragraph', children: [{ t: 'text', value: 'Item' }] }]],
      },
    ]);
    const s = serialize(d);
    expect(s).toContain('Quote');
    expect(s).toContain('Item');
  });

  it('serializes thematicBreak, html, unknown', () => {
    const d = doc([
      { id: '1', t: 'thematicBreak' },
      { id: '2', t: 'html', value: '<p>raw</p>' },
      { id: '3', t: 'unknown', raw: '<!-- comment -->' },
    ]);
    const s = serialize(d);
    expect(s).toContain('---');
    expect(s).toContain('<p>raw</p>');
    expect(s).toContain('<!-- comment -->');
  });

  it('preserves block order', () => {
    const d = doc([
      { id: '1', t: 'heading', depth: 1, children: [{ t: 'text', value: 'First' }] },
      { id: '2', t: 'heading', depth: 1, children: [{ t: 'text', value: 'Second' }] },
    ]);
    const s = serialize(d);
    expect(s.indexOf('First')).toBeLessThan(s.indexOf('Second'));
  });
});
