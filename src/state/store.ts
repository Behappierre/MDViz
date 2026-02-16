/**
 * Application state: document (AST), history for undo/redo, selection, and status.
 */

import type { Doc } from '../core/astTypes';
import type { HistoryState } from './history';

export type Status = 'idle' | 'loading' | 'error' | 'success';

export interface AppState {
  doc: Doc;
  history: HistoryState;
  selectedIds: Set<string>;
  status: Status;
  statusMessage: string;
  copyFeedback: boolean;
  exportFeedback: boolean;
}

export const initialDoc: Doc = { blocks: [] };

export function createInitialState(): AppState {
  return {
    doc: initialDoc,
    history: { past: [], present: initialDoc, future: [] },
    selectedIds: new Set(),
    status: 'idle',
    statusMessage: '',
    copyFeedback: false,
    exportFeedback: false,
  };
}
