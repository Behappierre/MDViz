/**
 * Undo/redo stack for reorder operations. Immutable history.
 */

import type { Doc } from '../core/astTypes';

const MAX_HISTORY = 100;

export interface HistoryState {
  past: Doc[];
  present: Doc;
  future: Doc[];
}

export function initHistory(doc: Doc): HistoryState {
  return { past: [], present: doc, future: [] };
}

export function pushHistory(state: HistoryState, nextDoc: Doc): HistoryState {
  if (state.past.length >= MAX_HISTORY) {
    return {
      past: [...state.past.slice(1), state.present],
      present: nextDoc,
      future: [],
    };
  }
  return {
    past: [...state.past, state.present],
    present: nextDoc,
    future: [],
  };
}

export function undo(state: HistoryState): HistoryState | null {
  if (state.past.length === 0) return null;
  const prev = state.past[state.past.length - 1];
  return {
    past: state.past.slice(0, -1),
    present: prev,
    future: [state.present, ...state.future],
  };
}

export function redo(state: HistoryState): HistoryState | null {
  if (state.future.length === 0) return null;
  const next = state.future[0];
  return {
    past: [...state.past, state.present],
    present: next,
    future: state.future.slice(1),
  };
}

export function canUndo(state: HistoryState): boolean {
  return state.past.length > 0;
}

export function canRedo(state: HistoryState): boolean {
  return state.future.length > 0;
}
