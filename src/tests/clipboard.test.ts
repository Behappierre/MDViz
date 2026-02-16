import { describe, it, expect } from 'vitest';
import type { Block } from '../core/astTypes';
import { buildClipboardPayload } from '../core/clipboard';

describe('clipboard', () => {
  it('produces plain text fallback', () => {
    const blocks: Block[] = [{ id: '1', t: 'paragraph', children: [{ t: 'text', value: 'Hello' }] }];
    const p = buildClipboardPayload(blocks);
    expect(p.plain).toBeDefined();
    expect(p.plain.length).toBeGreaterThan(0);
    expect(p.plain).toContain('Hello');
  });

  it('produces HTML and markdown', () => {
    const blocks: Block[] = [{ id: '1', t: 'paragraph', children: [{ t: 'text', value: 'Hi' }] }];
    const p = buildClipboardPayload(blocks);
    expect(p.html).toBeDefined();
    expect(p.markdown).toBeDefined();
    expect(p.html).not.toContain('<script');
  });

  it('sanitizes HTML (no script)', () => {
    const blocks: Block[] = [{ id: '1', t: 'paragraph', children: [{ t: 'text', value: 'Hi' }] }];
    const p = buildClipboardPayload(blocks);
    expect(p.html.toLowerCase()).not.toContain('script');
  });

  it('handles multiple blocks', () => {
    const blocks: Block[] = [
      { id: '1', t: 'paragraph', children: [{ t: 'text', value: 'A' }] },
      { id: '2', t: 'paragraph', children: [{ t: 'text', value: 'B' }] },
    ];
    const p = buildClipboardPayload(blocks);
    expect(p.plain).toContain('A');
    expect(p.plain).toContain('B');
  });
});
