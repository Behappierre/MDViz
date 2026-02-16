import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../core/parser';

describe('parser', () => {
  it('parses empty string to root with no children', () => {
    const r = parseMarkdown('');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.ast.type).toBe('root');
      expect(r.ast.children).toEqual([]);
    }
  });

  it('parses a heading', () => {
    const r = parseMarkdown('# Hello');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.ast.children.length).toBeGreaterThanOrEqual(1);
      const first = r.ast.children[0];
      expect(first.type).toBe('heading');
      expect((first as { depth?: number }).depth).toBe(1);
    }
  });

  it('parses paragraph and list', () => {
    const r = parseMarkdown('Hello world\n\n- a\n- b');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.ast.children.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('returns error for non-string input', () => {
    const r = parseMarkdown(undefined as unknown as string);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBeDefined();
  });
});
