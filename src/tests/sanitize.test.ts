import { describe, it, expect } from 'vitest';
import { sanitizeHtml, hasDangerousContent } from '../core/sanitize';

describe('sanitize', () => {
  it('allows safe tags', () => {
    expect(sanitizeHtml('<p>hello</p>')).toContain('<p>');
    expect(sanitizeHtml('<strong>bold</strong>')).toContain('bold');
  });

  it('strips script tags', () => {
    const out = sanitizeHtml('<script>alert(1)</script><p>ok</p>');
    expect(out).not.toContain('script');
    expect(out).not.toContain('alert');
  });

  it('strips javascript: URLs', () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toContain('javascript:');
  });

  it('hasDangerousContent detects script', () => {
    expect(hasDangerousContent('<script>x</script>')).toBe(true);
    expect(hasDangerousContent('<p>safe</p>')).toBe(false);
  });
});
