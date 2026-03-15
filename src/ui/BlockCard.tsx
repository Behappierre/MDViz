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
      className={`block-card${selected ? ' block-card--selected' : ''}`}
    >
      {onDragStart && (
        <span
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', block.id);
            e.dataTransfer.effectAllowed = 'move';
            onDragStart(block.id);
          }}
          className="drag-handle"
          aria-label="Drag to reorder"
        >
          ⠿
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="block-type-badge">{blockTypeLabel(block)}</div>
        <BlockContent block={block} />
      </div>
    </div>
  );
}
