/**
 * Single block card: renders one canonical block and supports selection/drag handle.
 */

import React from 'react';
import type { Block } from '../core/astTypes';
import { blockTypeLabel } from '../core/astTypes';
import { BlockContent } from './BlockContent';

export interface BlockCardProps {
  block: Block;
  selected: boolean;
  onSelect: (id: string, addToSelection: boolean) => void;
  onDragStart?: (id: string) => void;
}

export function BlockCard({ block, selected, onSelect, onDragStart }: BlockCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    onSelect(block.id, e.shiftKey);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(block.id, e.shiftKey);
        }
      }}
      data-block-id={block.id}
      aria-selected={selected}
      style={{
        border: selected ? '2px solid #0a7ea4' : '1px solid #ddd',
        borderRadius: 6,
        padding: 12,
        marginBottom: 8,
        cursor: 'pointer',
        background: selected ? '#e8f4f8' : '#fff',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
      }}
    >
      {onDragStart && (
        <span
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', block.id);
            e.dataTransfer.effectAllowed = 'move';
            onDragStart(block.id);
          }}
          style={{ cursor: 'grab', padding: 4, userSelect: 'none' }}
          aria-label="Drag to reorder"
        >
          ⋮⋮
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{blockTypeLabel(block)}</div>
        <BlockContent block={block} />
      </div>
    </div>
  );
}
