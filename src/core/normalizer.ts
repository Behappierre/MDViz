/**
 * Normalize mdast (parser output) into canonical AST.
 * Assigns stable IDs; passes through unsupported nodes as BlockUnknown (non-destructive).
 */

import type { Block, Doc, Inline, BlockId } from './astTypes';
import type { MdastRoot, MdastNode } from './parser';

let idCounter = 0;
function nextId(): BlockId {
  return `n-${(idCounter++).toString(36)}`;
}

function resetIdCounter(): void {
  idCounter = 0;
}

function normalizeInline(node: MdastNode): Inline[] {
  if (!node || typeof node !== 'object') return [];
  switch (node.type) {
    case 'text':
      return [{ t: 'text', value: (node as { value?: string }).value ?? '' }];
    case 'emphasis':
      return [{ t: 'emphasis', children: flattenPhrasing((node as { children?: MdastNode[] }).children) }];
    case 'strong':
      return [{ t: 'strong', children: flattenPhrasing((node as { children?: MdastNode[] }).children) }];
    case 'inlineCode':
      return [{ t: 'code', value: (node as { value?: string }).value ?? '' }];
    case 'link': {
      const n = node as { url?: string; title?: string | null; children?: MdastNode[] };
      return [{ t: 'link', url: n.url ?? '', title: n.title ?? undefined, children: flattenPhrasing(n.children) }];
    }
    case 'image': {
      const n = node as { url?: string; alt?: string | null; title?: string | null };
      return [{ t: 'image', url: n.url ?? '', alt: n.alt ?? undefined, title: n.title ?? undefined }];
    }
    default:
      return [];
  }
}

function flattenPhrasing(nodes: MdastNode[] | undefined): Inline[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.flatMap((n) => normalizeInline(n));
}

function normalizeBlock(node: MdastNode): Block | null {
  if (!node || typeof node !== 'object') return null;
  const id = nextId();
  switch (node.type) {
    case 'paragraph': {
      const n = node as { children?: MdastNode[] };
      return { id, t: 'paragraph', children: flattenPhrasing(n.children) };
    }
    case 'heading': {
      const n = node as { depth?: number; children?: MdastNode[] };
      const d = Math.min(6, Math.max(1, n.depth ?? 1)) as 1 | 2 | 3 | 4 | 5 | 6;
      return { id, t: 'heading', depth: d, children: flattenPhrasing(n.children) };
    }
    case 'code': {
      const n = node as { lang?: string | null; value?: string };
      return { id, t: 'code', lang: n.lang ?? '', value: n.value ?? '' };
    }
    case 'blockquote': {
      const n = node as { children?: MdastNode[] };
      const childBlocks = (n.children ?? []).flatMap((c) => {
        const b = normalizeBlock(c);
        return b ? [b] : [];
      });
      return { id, t: 'blockquote', children: childBlocks };
    }
    case 'list': {
      const n = node as { ordered?: boolean; start?: number | null; children?: MdastNode[] };
      const items: Block[][] = (n.children ?? []).map((li) => {
        const liNode = li as { children?: MdastNode[] };
        return (liNode.children ?? []).flatMap((c) => {
          const b = normalizeBlock(c);
          return b ? [b] : [];
        });
      });
      return {
        id,
        t: 'list',
        ordered: n.ordered ?? false,
        start: n.start ?? undefined,
        items,
      };
    }
    case 'table': {
      const n = node as { children?: MdastNode[] };
      const rows = (n.children ?? []).map((row) => {
        const r = row as { children?: MdastNode[] };
        return (r.children ?? []).map((cell) => flattenPhrasing((cell as { children?: MdastNode[] }).children));
      });
      const header = rows[0] ?? [];
      const tableRows = rows.slice(1);
      return { id, t: 'table', header, rows: tableRows };
    }
    case 'thematicBreak':
      return { id, t: 'thematicBreak' };
    case 'html':
      return { id, t: 'html', value: (node as { value?: string }).value ?? '' };
    default:
      // Passthrough: preserve raw for unknown block types
      return { id, t: 'unknown', raw: stringifyNodeToMarkdown(node) };
  }
}

/** Best-effort stringify unknown node back to markdown for passthrough */
function stringifyNodeToMarkdown(node: MdastNode): string {
  if (node.type === 'root' && 'children' in node && Array.isArray(node.children)) {
    return (node.children as MdastNode[]).map(stringifyNodeToMarkdown).join('\n\n');
  }
  if ('value' in node && typeof (node as { value: string }).value === 'string') {
    return (node as { value: string }).value;
  }
  return '';
}

/**
 * Normalize mdast root to canonical Doc. Resets internal ID counter so runs are deterministic when called once per document.
 */
export function normalize(ast: MdastRoot): Doc {
  resetIdCounter();
  const blocks: Block[] = [];
  const children = (ast as { children?: MdastNode[] }).children ?? [];
  for (const node of children) {
    const b = normalizeBlock(node);
    if (b) blocks.push(b);
  }
  return { blocks };
}
