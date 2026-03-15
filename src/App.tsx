/**
 * MD Visualizer: main app state and wiring.
 */

import { useCallback, useEffect, useState } from 'react';
import type { BlockId } from './core/astTypes';
import { parseMarkdown } from './core/parser';
import { normalize } from './core/normalizer';
import { serialize } from './core/serializer';
import { reorderBlocksById } from './core/reorder';
import { buildClipboardPayload } from './core/clipboard';
import { initHistory, pushHistory, undo, redo, canUndo, canRedo } from './state/history';
import { createInitialState } from './state/store';
import { trackFileLoaded, trackCopyUsed, trackExportUsed, trackViewSwitched, trackErrorOccurred } from './core/analytics';
import { FileDrop } from './ui/FileDrop';
import { BlockRenderer } from './ui/BlockRenderer';
import { DocumentView } from './ui/DocumentView';
import { Toolbar } from './ui/Toolbar';
import type { ViewMode } from './ui/Toolbar';
import { StatusBar } from './ui/StatusBar';
import { HelpModal } from './ui/HelpModal';

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [state, setState] = useState(createInitialState);
  const [viewMode, setViewMode] = useState<ViewMode>('blocks');
  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    trackViewSwitched(mode);
  }, []);
  const [showHelp, setShowHelp] = useState(false);

  const handleFile = useCallback((_file: File, text: string) => {
    setState((s) => ({ ...s, status: 'loading', statusMessage: 'Parsing…' }));
    const result = parseMarkdown(text);
    if (!result.ok) {
      trackErrorOccurred(result.error);
      setState((s) => ({
        ...s,
        status: 'error',
        statusMessage: result.error,
        doc: { blocks: [] },
        history: initHistory({ blocks: [] }),
      }));
      return;
    }
    const doc = normalize(result.ast);
    trackFileLoaded(doc.blocks.length);
    setState((s) => ({
      ...s,
      doc,
      history: initHistory(doc),
      selectedIds: new Set(),
      status: 'success',
      statusMessage: `Loaded ${doc.blocks.length} block(s)`,
    }));
  }, []);

  const handleReorder = useCallback((sourceId: BlockId, targetId: BlockId | null) => {
    setState((s) => {
      const nextDoc = reorderBlocksById(s.doc, sourceId, targetId);
      if (nextDoc === s.doc) return s;
      const nextHistory = pushHistory(s.history, nextDoc);
      return { ...s, doc: nextDoc, history: nextHistory };
    });
  }, []);

  const handleSelect = useCallback((id: string, addToSelection: boolean) => {
    setState((s) => {
      const next = new Set(s.selectedIds);
      if (addToSelection) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        next.add(id);
      }
      return { ...s, selectedIds: next };
    });
  }, []);

  const handleCopy = useCallback(() => {
    const blocksToCopy =
      viewMode === 'document' ? state.doc.blocks : state.doc.blocks.filter((b) => state.selectedIds.has(b.id));
    if (blocksToCopy.length === 0) return;
    const { html, plain } = buildClipboardPayload(blocksToCopy);
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([plain], { type: 'text/plain' }),
    });
    navigator.clipboard.write([clipboardItem]).then(
      () => setState((s) => ({ ...s, copyFeedback: true })),
      () => {
        navigator.clipboard.writeText(plain);
        setState((s) => ({ ...s, copyFeedback: true }));
      }
    );
    trackCopyUsed(viewMode, blocksToCopy.length);
    setTimeout(() => setState((s) => ({ ...s, copyFeedback: false })), 2000);
  }, [state.doc, state.selectedIds, viewMode]);

  const handleExport = useCallback(() => {
    const markdown = serialize(state.doc);
    downloadMarkdown(markdown, 'export.md');
    trackExportUsed(state.doc.blocks.length);
    setState((s) => ({ ...s, exportFeedback: true }));
    setTimeout(() => setState((s) => ({ ...s, exportFeedback: false })), 2000);
  }, [state.doc]);

  const handleUndo = useCallback(() => {
    setState((s) => {
      const next = undo(s.history);
      if (!next) return s;
      return { ...s, doc: next.present, history: next };
    });
  }, []);

  const handleRedo = useCallback(() => {
    setState((s) => {
      const next = redo(s.history);
      if (!next) return s;
      return { ...s, doc: next.present, history: next };
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        if (viewMode === 'blocks' && state.selectedIds.size > 0) {
          e.preventDefault();
          handleCopy();
        }
        return;
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        handleRedo();
        return;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewMode, state.selectedIds.size, handleCopy, handleUndo, handleRedo]);

  const hasBlocks = state.doc.blocks.length > 0;
  const hasSelection = state.selectedIds.size > 0;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <div className="app-brand-icon">M↓</div>
            <span className="app-name">MD Visualizer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="app-tagline">Parse · Reorder · Export</span>
            <button
              type="button"
              className="btn-help"
              onClick={() => setShowHelp(true)}
              aria-label="Help"
              title="Help"
            >
              ?
            </button>
          </div>
        </div>
      </header>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      <div className="app-main">
        <FileDrop onFile={handleFile} onError={(msg) => setState((s) => ({ ...s, status: 'error', statusMessage: msg }))} />
        {hasBlocks && (
          <>
            <Toolbar
              viewMode={viewMode}
              onViewChange={handleViewChange}
              onCopy={handleCopy}
              onExport={handleExport}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo(state.history)}
              canRedo={canRedo(state.history)}
              hasSelection={hasSelection}
              hasBlocks={hasBlocks}
              copyFeedback={state.copyFeedback}
              exportFeedback={state.exportFeedback}
            />
            {viewMode === 'blocks' ? (
              <BlockRenderer
                doc={state.doc}
                selectedIds={state.selectedIds}
                onSelect={handleSelect}
                onReorder={handleReorder}
              />
            ) : (
              <DocumentView doc={state.doc} />
            )}
          </>
        )}
        <StatusBar
          status={state.status}
          statusMessage={state.statusMessage}
          selectedCount={state.selectedIds.size}
          blockCount={state.doc.blocks.length}
        />
      </div>
    </div>
  );
}
