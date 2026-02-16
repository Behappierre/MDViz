/**
 * Copy pipeline: generate HTML, plain text, and markdown for selected blocks.
 * Clipboard must always provide plain-text fallback.
 */

import type { Block, Inline } from './astTypes';
import { serialize } from './serializer';
import { sanitizeHtml } from './sanitize';

export interface ClipboardPayload {
  html: string;
  plain: string;
  markdown: string;
}

function inlineToPlain(inline: Inline): string {
  switch (inline.t) {
    case 'text':
      return inline.value;
    case 'strong':
    case 'emphasis':
      return inline.children.map(inlineToPlain).join('');
    case 'code':
      return inline.value;
    case 'link':
      return inline.children.map(inlineToPlain).join('');
    case 'image':
      return inline.alt || inline.url || '';
    default:
      return '';
  }
}

function blockToPlain(block: Block): string {
  switch (block.t) {
    case 'paragraph':
      return block.children.map(inlineToPlain).join('') + '\n';
    case 'heading':
      return block.children.map(inlineToPlain).join('') + '\n';
    case 'code':
      return block.value + '\n';
    case 'blockquote':
      return block.children.map(blockToPlain).map((s) => s.split('\n').map((l) => '> ' + l).join('\n')).join('\n') + '\n';
    case 'list':
      return block.items
        .map((itemBlocks, i) => {
          const bullet = block.ordered ? `${(block.start ?? 1) + i}. ` : '- ';
          return itemBlocks.map(blockToPlain).join('').split('\n').map((l, j) => (j === 0 ? bullet + l : '  ' + l)).join('\n');
        })
        .join('\n') + '\n';
    case 'table':
      return block.header.map((cell) => cell.map(inlineToPlain).join('')).join('\t') + '\n' +
        block.rows.map((row) => row.map((cell) => cell.map(inlineToPlain).join('')).join('\t')).join('\n') + '\n';
    case 'thematicBreak':
      return '---\n';
    case 'html':
    case 'unknown':
      return (block.t === 'html' ? block.value : block.raw) + '\n';
    default:
      return '';
  }
}

function inlineToHtml(inline: Inline): string {
  switch (inline.t) {
    case 'text':
      return escapeHtml(inline.value);
    case 'strong':
      return `<strong>${inline.children.map(inlineToHtml).join('')}</strong>`;
    case 'emphasis':
      return `<em>${inline.children.map(inlineToHtml).join('')}</em>`;
    case 'code':
      return `<code>${escapeHtml(inline.value)}</code>`;
    case 'link':
      return `<a href="${escapeAttr(inline.url)}"${inline.title ? ` title="${escapeAttr(inline.title)}"` : ''}>${inline.children.map(inlineToHtml).join('')}</a>`;
    case 'image':
      return `<img src="${escapeAttr(inline.url)}" alt="${escapeAttr(inline.alt ?? '')}"${inline.title ? ` title="${escapeAttr(inline.title)}"` : ''} />`;
    default:
      return '';
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

function blockToHtml(block: Block): string {
  switch (block.t) {
    case 'paragraph':
      return '<p>' + block.children.map(inlineToHtml).join('') + '</p>';
    case 'heading':
      return `<h${block.depth}>${block.children.map(inlineToHtml).join('')}</h${block.depth}>`;
    case 'code':
      return `<pre><code class="language-${escapeAttr(block.lang)}">${escapeHtml(block.value)}</code></pre>`;
    case 'blockquote':
      return '<blockquote>' + block.children.map(blockToHtml).join('') + '</blockquote>';
    case 'list':
      const tag = block.ordered ? 'ol' : 'ul';
      const start = block.ordered && block.start != null ? ` start="${block.start}"` : '';
      const lis = block.items.map((itemBlocks) => '<li>' + itemBlocks.map(blockToHtml).join('') + '</li>').join('');
      return `<${tag}${start}>${lis}</${tag}>`;
    case 'table':
      const headerCells = block.header.map((cell) => '<th>' + cell.map(inlineToHtml).join('') + '</th>').join('');
      const bodyRows = block.rows.map((row) => '<tr>' + row.map((cell) => '<td>' + cell.map(inlineToHtml).join('') + '</td>').join('') + '</tr>').join('');
      return '<table><thead><tr>' + headerCells + '</tr></thead><tbody>' + bodyRows + '</tbody></table>';
    case 'thematicBreak':
      return '<hr />';
    case 'html':
      return block.value;
    case 'unknown':
      return escapeHtml(block.raw);
    default:
      return '';
  }
}

/**
 * Build clipboard payload for selected blocks. HTML is sanitized.
 * Plain text is always present as fallback.
 */
export function buildClipboardPayload(blocks: Block[]): ClipboardPayload {
  const html = sanitizeHtml(blocks.map(blockToHtml).join(''));
  const plain = blocks.map(blockToPlain).join('').trim();
  const markdown = serialize({ blocks });
  return { html, plain, markdown };
}
