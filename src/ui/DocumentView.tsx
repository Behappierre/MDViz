/**
 * Continuous document view: renders the full document as one flowing article
 * (Word-style), with copy/paste working on selection or full document.
 */

import type { Doc } from '../core/astTypes';
import { BlockContent } from './BlockContent';

export interface DocumentViewProps {
  doc: Doc;
}

export function DocumentView({ doc }: DocumentViewProps) {
  if (doc.blocks.length === 0) return null;

  return (
    <article
      className="document-view"
      tabIndex={0}
      role="document"
      aria-label="Document view"
    >
      {doc.blocks.map((block) => (
        <div key={block.id} style={{ marginBottom: '1em' }}>
          <BlockContent block={block} />
        </div>
      ))}
    </article>
  );
}
