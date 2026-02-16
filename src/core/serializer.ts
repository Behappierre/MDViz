/**
 * Serialize canonical AST back to markdown. Pure function; no mutation.
 */

import type { Doc, Block, Inline, TableRow } from './astTypes';

function escapeCode(s: string): string {
  return s.replace(/`/g, '\\`');
}

function serializeInline(inline: Inline): string {
  switch (inline.t) {
    case 'text':
      return inline.value;
    case 'strong':
      return `**${inline.children.map(serializeInline).join('')}**`;
    case 'emphasis':
      return `*${inline.children.map(serializeInline).join('')}*`;
    case 'code':
      return `\`${escapeCode(inline.value)}\``;
    case 'link':
      return `[${inline.children.map(serializeInline).join('')}](${inline.url}${inline.title ? ` "${inline.title}"` : ''})`;
    case 'image':
      return `![${inline.alt ?? ''}](${inline.url}${inline.title ? ` "${inline.title}"` : ''})`;
    default:
      return '';
  }
}

function serializeTableRow(row: TableRow): string {
  return '| ' + row.map((cell) => cell.map(serializeInline).join('')).join(' | ') + ' |';
}

function serializeBlock(block: Block): string {
  switch (block.t) {
    case 'paragraph':
      return block.children.map(serializeInline).join('') || '';
    case 'heading':
      return '#'.repeat(block.depth) + ' ' + block.children.map(serializeInline).join('');
    case 'code':
      return '```' + (block.lang ? block.lang : '') + '\n' + block.value + '\n```';
    case 'blockquote':
      return block.children.map((b) => serializeBlock(b).split('\n').map((l) => '> ' + l).join('\n')).join('\n\n');
    case 'list':
      return block.items
        .map((itemBlocks, i) => {
          const bullet = block.ordered ? `${(block.start ?? 1) + i}. ` : '- ';
          return itemBlocks.map((b) => serializeBlock(b).split('\n').map((l, j) => (j === 0 ? bullet + l : '  ' + l)).join('\n')).join('\n');
        })
        .join('\n');
    case 'table': {
      const sep = '| ' + block.header.map(() => '---').join(' | ') + ' |';
      return [serializeTableRow(block.header), sep, ...block.rows.map(serializeTableRow)].join('\n');
    }
    case 'thematicBreak':
      return '---';
    case 'html':
      return block.value;
    case 'unknown':
      return block.raw;
    default:
      return '';
  }
}

/**
 * Serialize Doc to markdown string. Order of blocks is preserved.
 */
export function serialize(doc: Doc): string {
  return doc.blocks.map(serializeBlock).join('\n\n');
}
