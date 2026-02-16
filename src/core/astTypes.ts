/**
 * Canonical AST for MD Visualizer.
 * Single source of truth; all nodes have stable IDs.
 * Unsupported markdown is preserved as BlockUnknown (passthrough).
 */

export type BlockId = string;

/** Inline content within blocks */
export type Inline =
  | { t: 'text'; value: string }
  | { t: 'strong'; children: Inline[] }
  | { t: 'emphasis'; children: Inline[] }
  | { t: 'code'; value: string }
  | { t: 'link'; url: string; title?: string; children: Inline[] }
  | { t: 'image'; url: string; alt?: string; title?: string };

/** Table cell: array of inline nodes */
export type TableCell = Inline[];

/** Table row: array of cells */
export type TableRow = TableCell[];

/** Supported block types with stable id */
export type Block =
  | { id: BlockId; t: 'heading'; depth: 1 | 2 | 3 | 4 | 5 | 6; children: Inline[] }
  | { id: BlockId; t: 'paragraph'; children: Inline[] }
  | { id: BlockId; t: 'code'; lang: string; value: string }
  | { id: BlockId; t: 'blockquote'; children: Block[] }
  | { id: BlockId; t: 'list'; ordered: boolean; start?: number; items: Block[][] }
  | { id: BlockId; t: 'table'; header: TableRow; rows: TableRow[] }
  | { id: BlockId; t: 'thematicBreak' }
  | { id: BlockId; t: 'html'; value: string }
  | { id: BlockId; t: 'unknown'; raw: string };

/** Root document: ordered list of top-level blocks */
export interface Doc {
  blocks: Block[];
}

/** Type guard: is this block a container (has child blocks)? */
export function hasChildBlocks(b: Block): b is Block & { children?: Block[] } {
  return b.t === 'blockquote' || b.t === 'list';
}

/** Get display label for block type */
export function blockTypeLabel(b: Block): string {
  switch (b.t) {
    case 'heading': return `Heading ${b.depth}`;
    case 'paragraph': return 'Paragraph';
    case 'code': return b.lang ? `Code (${b.lang})` : 'Code';
    case 'blockquote': return 'Blockquote';
    case 'list': return b.ordered ? 'Ordered list' : 'Bullet list';
    case 'table': return 'Table';
    case 'thematicBreak': return 'Horizontal rule';
    case 'html': return 'HTML';
    case 'unknown': return 'Raw';
    default: return 'Block';
  }
}
