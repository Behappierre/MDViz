/**
 * Fixture-based import -> export round-trip tests.
 */

import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../core/parser';
import { normalize } from '../core/normalizer';
import { serialize } from '../core/serializer';

const fixtures = [
  ['simple', '# A\n\nP'],
  ['headings', '# H1\n## H2\n### H3'],
  ['lists', '- a\n- b\n- c'],
  ['code', '```js\nx\n```'],
  ['table', '| A | B |\n| --- | --- |\n| 1 | 2 |'],
  ['links', '[x](https://y.com)'],
];

describe('fixtures round-trip', () => {
  for (const [name, md] of fixtures) {
    it(`${name}: import -> export produces valid markdown`, () => {
      const r = parseMarkdown(md);
      expect(r.ok).toBe(true);
      if (!r.ok) return;
      const doc = normalize(r.ast);
      expect(doc.blocks.length).toBeGreaterThanOrEqual(1);
      const out = serialize(doc);
      expect(out).toBeDefined();
      expect(typeof out).toBe('string');
      const round = parseMarkdown(out);
      expect(round.ok).toBe(true);
    });
  }

  it('malformed markdown still parses (no destructive drop)', () => {
    const md = '# Ok\n\nUnclosed **bold\n\n- item';
    const r = parseMarkdown(md);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const doc = normalize(r.ast);
    expect(doc.blocks.length).toBeGreaterThanOrEqual(1);
    const out = serialize(doc);
    expect(out).toContain('Ok');
  });
});
