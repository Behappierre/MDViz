/**
 * Pure reorder operations on Doc. No direct mutation of AST.
 * All operations use stable block IDs.
 */

import type { Doc, BlockId } from './astTypes';

/**
 * Find index of block by id. Returns -1 if not found.
 */
export function indexOfBlock(doc: Doc, id: BlockId): number {
  return doc.blocks.findIndex((b) => b.id === id);
}

/**
 * Move block from fromIndex to toIndex. Returns new Doc; does not mutate.
 * Indices are for current blocks array.
 */
export function moveBlock(doc: Doc, fromIndex: number, toIndex: number): Doc {
  const blocks = [...doc.blocks];
  if (fromIndex < 0 || fromIndex >= blocks.length || toIndex < 0 || toIndex >= blocks.length) {
    return doc;
  }
  const [removed] = blocks.splice(fromIndex, 1);
  blocks.splice(toIndex, 0, removed);
  return { blocks };
}

/**
 * Move block by id to new index. Returns new Doc; does not mutate.
 */
export function moveBlockById(doc: Doc, id: BlockId, toIndex: number): Doc {
  const fromIndex = indexOfBlock(doc, id);
  if (fromIndex === -1) return doc;
  return moveBlock(doc, fromIndex, toIndex);
}

/**
 * Reorder: take block at sourceIndex and insert before block at targetIndex.
 * If targetIndex === sourceIndex or sourceIndex + 1, no change.
 */
export function reorderBlocks(doc: Doc, sourceIndex: number, targetIndex: number): Doc {
  const len = doc.blocks.length;
  if (sourceIndex < 0 || sourceIndex >= len || targetIndex < 0 || targetIndex > len) {
    return doc;
  }
  let toIndex = targetIndex;
  if (targetIndex > sourceIndex) toIndex = targetIndex - 1;
  return moveBlock(doc, sourceIndex, toIndex);
}

/**
 * Reorder by block id: move block with sourceId so it ends up before block with targetId.
 * If targetId is null, move to end.
 */
export function reorderBlocksById(doc: Doc, sourceId: BlockId, targetId: BlockId | null): Doc {
  const srcIdx = indexOfBlock(doc, sourceId);
  if (srcIdx === -1) return doc;
  if (targetId === null) {
    return moveBlock(doc, srcIdx, doc.blocks.length - 1);
  }
  const tgtIdx = indexOfBlock(doc, targetId);
  if (tgtIdx === -1) return doc;
  return reorderBlocks(doc, srcIdx, tgtIdx);
}
