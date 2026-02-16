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
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', padding: '8px 0' }}>
      <span style={{ marginRight: 8, fontSize: 14, color: '#555' }}>View:</span>
      <button
        type="button"
        onClick={() => onViewChange('blocks')}
        aria-pressed={viewMode === 'blocks'}
        style={{
          padding: '4px 10px',
          fontWeight: viewMode === 'blocks' ? 600 : 400,
          background: viewMode === 'blocks' ? '#e0e0e0' : 'transparent',
        }}
      >
        Blocks
      </button>
      <button
        type="button"
        onClick={() => onViewChange('document')}
        aria-pressed={viewMode === 'document'}
        style={{
          padding: '4px 10px',
          fontWeight: viewMode === 'document' ? 600 : 400,
          background: viewMode === 'document' ? '#e0e0e0' : 'transparent',
        }}
      >
        Document
      </button>
      <span style={{ width: 16 }} />
      <button type="button" onClick={onCopy} disabled={!copyEnabled} title={copyTitle}>
        {copyFeedback ? '✓ Copied' : 'Copy'}
      </button>
      <button type="button" onClick={onExport} disabled={!hasBlocks} title="Export as .md file">
        {exportFeedback ? '✓ Exported' : 'Export'}
      </button>
      <button type="button" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl/Cmd+Z)">
        Undo
      </button>
      <button type="button" onClick={onRedo} disabled={!canRedo} title="Redo (Shift+Ctrl/Cmd+Z)">
        Redo
      </button>
    </div>
  );
}
