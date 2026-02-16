/**
 * Renders a single block's content only (no card, no label, no drag handle).
 * Used for both BlockCard body and DocumentView continuous flow.
 */

import React from 'react';
import type { Block, Inline } from '../core/astTypes';
import { sanitizeHtml } from '../core/sanitize';

function inlineToHtml(inline: Inline): string {
  switch (inline.t) {
    case 'text':
      return inline.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    case 'strong':
      return `<strong>${inline.children.map(inlineToHtml).join('')}</strong>`;
    case 'emphasis':
      return `<em>${inline.children.map(inlineToHtml).join('')}</em>`;
    case 'code':
      return `<code>${inline.value.replace(/</g, '&lt;')}</code>`;
    case 'link':
      return `<a href="${inline.url.replace(/"/g, '&quot;')}">${inline.children.map(inlineToHtml).join('')}</a>`;
    case 'image':
      return `<img src="${inline.url}" alt="${(inline.alt ?? '').replace(/"/g, '&quot;')}" />`;
    default:
      return '';
  }
}

export interface BlockContentProps {
  block: Block;
}

/**
 * Content-only render of one block. Recurses for blockquote/list so
 * document view has no nested cards.
 */
export function BlockContent({ block }: BlockContentProps): React.ReactNode {
  switch (block.t) {
    case 'paragraph':
      return <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.children.map(inlineToHtml).join('')) }} />;
    case 'heading': {
      const H = `h${block.depth}` as keyof JSX.IntrinsicElements;
      return <H dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.children.map(inlineToHtml).join('')) }} />;
    }
    case 'code':
      return (
        <pre>
          <code className={block.lang ? `language-${block.lang}` : ''}>{block.value}</code>
        </pre>
      );
    case 'blockquote':
      return (
        <blockquote>
          {block.children.map((b) => (
            <BlockContent key={b.id} block={b} />
          ))}
        </blockquote>
      );
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul';
      const start = block.ordered ? block.start : undefined;
      return (
        <List start={start}>
          {block.items.map((itemBlocks, i) => (
            <li key={i}>
              {itemBlocks.map((b) => (
                <BlockContent key={b.id} block={b} />
              ))}
            </li>
          ))}
        </List>
      );
    }
    case 'table':
      return (
        <table>
          <thead>
            <tr>
              {block.header.map((cell, i) => (
                <th key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(cell.map(inlineToHtml).join('')) }} />
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} dangerouslySetInnerHTML={{ __html: sanitizeHtml(cell.map(inlineToHtml).join('')) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'thematicBreak':
      return <hr />;
    case 'html':
      return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.value) }} />;
    case 'unknown':
      return <pre className="raw-block">{block.raw}</pre>;
    default:
      return null;
  }
}
