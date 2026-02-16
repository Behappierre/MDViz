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
      className="md-visualizer-document-view"
      style={{
        background: '#fff',
        padding: '24px 20px',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        minHeight: 200,
        outline: 'none',
      }}
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
