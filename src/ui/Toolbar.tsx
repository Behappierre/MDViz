/**
 * Toolbar: View toggle, Copy, Export, Undo, Redo.
 */

export type ViewMode = 'blocks' | 'document';

export interface ToolbarProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onCopy: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  hasBlocks: boolean;
  copyFeedback?: boolean;
  exportFeedback?: boolean;
}

export function Toolbar({
  viewMode,
  onViewChange,
  onCopy,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasSelection,
  hasBlocks,
  copyFeedback,
  exportFeedback,
}: ToolbarProps) {
  const copyEnabled = viewMode === 'document' ? hasBlocks : hasSelection;
  const copyTitle =
    viewMode === 'document'
      ? 'Copy full document (Ctrl/Cmd+C)'
      : 'Copy selected blocks (Ctrl/Cmd+C)';

  return (
    <div className="toolbar">
      <div className="view-toggle">
        <button
          type="button"
          className="view-toggle-btn"
          onClick={() => onViewChange('blocks')}
          aria-pressed={viewMode === 'blocks'}
        >
          Blocks
        </button>
        <button
          type="button"
          className="view-toggle-btn"
          onClick={() => onViewChange('document')}
          aria-pressed={viewMode === 'document'}
        >
          Document
        </button>
      </div>
      <div className="toolbar-spacer" />
      <div className="toolbar-group">
        <button
          type="button"
          className={`btn${copyFeedback ? ' btn--success' : ''}`}
          onClick={onCopy}
          disabled={!copyEnabled}
          title={copyTitle}
        >
          {copyFeedback ? '✓ Copied' : '⎘ Copy'}
        </button>
        <button
          type="button"
          className={`btn${exportFeedback ? ' btn--success' : ''}`}
          onClick={onExport}
          disabled={!hasBlocks}
          title="Export as .md file"
        >
          {exportFeedback ? '✓ Exported' : '↓ Export'}
        </button>
        <button type="button" className="btn" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl/Cmd+Z)">
          ↩ Undo
        </button>
        <button type="button" className="btn" onClick={onRedo} disabled={!canRedo} title="Redo (Shift+Ctrl/Cmd+Z)">
          ↪ Redo
        </button>
      </div>
    </div>
  );
}
