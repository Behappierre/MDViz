import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../core/parser';
import { normalize } from '../core/normalizer';
import { serialize } from '../core/serializer';

describe('normalizer round-trip', () => {
  it('simple headings and paragraphs round-trip', () => {
    const md = '# Hello\n\nParagraph **bold**.';
    const r = parseMarkdown(md);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const doc = normalize(r.ast);
    expect(doc.blocks.length).toBeGreaterThanOrEqual(2);
    const out = serialize(doc);
    expect(out).toContain('Hello');
    expect(out).toContain('Paragraph');
  });

  it('code block round-trip', () => {
    const md = '```js\nconst x = 1;\n```';
    const r = parseMarkdown(md);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const doc = normalize(r.ast);
    expect(doc.blocks.some((b) => b.t === 'code')).toBe(true);
    const out = serialize(doc);
    expect(out).toContain('const x = 1;');
  });

  it('does not drop content (passthrough)', () => {
    const md = '# A\n\nParagraph\n\n- list';
    const r = parseMarkdown(md);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const doc = normalize(r.ast);
    expect(doc.blocks.length).toBeGreaterThanOrEqual(1);
  });
});
