/**
 * Parse markdown string into a generic AST (mdast-like).
 * We use remark-parse; output is then normalized to our canonical AST in normalizer.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';

export type MdastRoot = { type: 'root'; children: MdastNode[] };
export type MdastNode =
  | MdastRoot
  | { type: 'paragraph'; children: MdastPhrasing[] }
  | { type: 'heading'; depth: number; children: MdastPhrasing[] }
  | { type: 'text'; value: string }
  | { type: 'emphasis'; children: MdastPhrasing[] }
  | { type: 'strong'; children: MdastPhrasing[] }
  | { type: 'inlineCode'; value: string }
  | { type: 'link'; url: string; title?: string | null; children: MdastPhrasing[] }
  | { type: 'image'; url: string; alt?: string | null; title?: string | null }
  | { type: 'code'; lang?: string | null; value: string }
  | { type: 'blockquote'; children: MdastBlock[] }
  | { type: 'list'; ordered: boolean; start?: number | null; children: MdastListItem[] }
  | { type: 'listItem'; spread?: boolean; children: MdastBlock[] }
  | { type: 'table'; align?: (string | null)[]; children: MdastTableContent[] }
  | { type: 'tableRow'; children: MdastTableCell[] }
  | { type: 'tableCell'; children: MdastPhrasing[] }
  | { type: 'thematicBreak' }
  | { type: 'html'; value: string }
  | { type: string; value?: string; children?: unknown[]; [k: string]: unknown };

export type MdastPhrasing = MdastNode & { type: string };
export type MdastBlock = MdastNode & { type: string };
export type MdastListItem = MdastNode & { type: string };
export type MdastTableContent = MdastNode & { type: string };
export type MdastTableCell = MdastNode & { type: string };

const processor = unified().use(remarkParse, { commonmark: true });

export type ParseResult =
  | { ok: true; ast: MdastRoot }
  | { ok: false; error: string };

/**
 * Parse markdown to mdast. Never throws; returns ParseResult.
 */
export function parseMarkdown(md: string): ParseResult {
  if (typeof md !== 'string') {
    return { ok: false, error: 'Input must be a string' };
  }
  try {
    const ast = processor.parse(md) as MdastRoot;
    if (!ast || typeof ast !== 'object' || ast.type !== 'root') {
      return { ok: false, error: 'Parser returned invalid root' };
    }
    if (!Array.isArray(ast.children)) {
      return { ok: false, error: 'Root has no children array' };
    }
    return { ok: true, ast };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}
