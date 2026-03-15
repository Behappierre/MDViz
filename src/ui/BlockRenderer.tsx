/**
 * Renders read-only block list from AST; supports top-level drag/drop reorder.
 */

import React, { useCallback, useState } from 'react';
import type { Doc, BlockId } from '../core/astTypes';
import { BlockCard } from './BlockCard';

export interface BlockRendererProps {
  doc: Doc;
  selectedIds: Set<string>;
  onSelect: (id: string, addToSelection: boolean) => void;
  onReorder: (sourceId: BlockId, targetId: BlockId | null) => void;
}

export function BlockRenderer({ doc, selectedIds, onSelect, onReorder }: BlockRendererProps) {
  const [draggedId, setDraggedId] = useState<BlockId | null>(null);
  const [dropTargetId, setDropTargetId] = useState<BlockId | null>(null);

  const handleDragStart = useCallback((id: BlockId) => {
    setDraggedId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDropTargetId(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, blockId: BlockId) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedId && blockId !== draggedId) setDropTargetId(blockId);
    },
    [draggedId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: BlockId) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData('text/plain');
      if (sourceId && sourceId !== targetId) {
        onReorder(sourceId, targetId);
      }
      setDraggedId(null);
      setDropTargetId(null);
    },
    [onReorder]
  );

  const handleDropOnList = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData('text/plain');
      if (sourceId && doc.blocks.length > 0) {
        const lastId = doc.blocks[doc.blocks.length - 1].id;
        if (sourceId !== lastId) onReorder(sourceId, lastId);
      }
      setDraggedId(null);
      setDropTargetId(null);
    },
    [doc.blocks, onReorder]
  );

  if (doc.blocks.length === 0) {
    return null;
  }

  return (
    <div onDragOver={(e) => e.preventDefault()} onDragEnd={handleDragEnd} style={{ outline: 'none' }}>
      {doc.blocks.map((block) => (
        <React.Fragment key={block.id}>
          {dropTargetId === block.id && (
            <div className="drop-indicator" aria-hidden />
          )}
          <div
            onDragOver={(e) => handleDragOver(e, block.id)}
            onDrop={(e) => handleDrop(e, block.id)}
            style={{
              opacity: draggedId === block.id ? 0.5 : 1,
            }}
          >
            <BlockCard
              block={block}
              selected={selectedIds.has(block.id)}
              onSelect={onSelect}
              onDragStart={handleDragStart}
            />
          </div>
        </React.Fragment>
      ))}
      <div
        onDragOver={(e) => { e.preventDefault(); setDropTargetId('__end'); }}
        onDragLeave={() => setDropTargetId(null)}
        onDrop={handleDropOnList}
        style={{
          minHeight: dropTargetId === '__end' ? 24 : 12,
          background: dropTargetId === '__end' ? 'rgba(99,102,241,0.08)' : 'transparent',
          borderRadius: 4,
          marginTop: 4,
        }}
      />
    </div>
  );
}
