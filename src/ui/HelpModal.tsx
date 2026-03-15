/**
 * Help modal: keyboard shortcuts, tips, and usage guide.
 */

import { useEffect } from 'react';

export interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal
      aria-labelledby="help-title"
    >
      <div className="modal">
        <div className="modal-header">
          <span id="help-title" className="modal-title">Help</span>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close help">✕</button>
        </div>
        <div className="modal-body">

          <div className="help-section">
            <div className="help-section-title">Getting Started</div>
            <div className="help-row">
              <span className="help-row-label">Open a file</span>
              <span className="help-row-value">Drag &amp; drop a <code>.md</code> file onto the upload zone, or click it to browse</span>
            </div>
          </div>

          <div className="help-section">
            <div className="help-section-title">Views</div>
            <div className="help-row">
              <span className="help-row-label">Blocks</span>
              <span className="help-row-value">Each Markdown block as a card — click to select, drag to reorder</span>
            </div>
            <div className="help-row">
              <span className="help-row-label">Document</span>
              <span className="help-row-value">Continuous reading layout, like a rendered document</span>
            </div>
          </div>

          <div className="help-section">
            <div className="help-section-title">Selecting Blocks</div>
            <div className="help-row">
              <span className="help-row-label">Select one</span>
              <span className="help-row-value">Click a block card</span>
            </div>
            <div className="help-row">
              <span className="help-row-label">Add / remove</span>
              <span className="help-row-value"><kbd>Shift</kbd> + click</span>
            </div>
          </div>

          <div className="help-section">
            <div className="help-section-title">Keyboard Shortcuts</div>
            <div className="help-row">
              <span className="help-row-label">Copy</span>
              <span className="help-row-value"><kbd>Ctrl</kbd> <kbd>C</kbd></span>
            </div>
            <div className="help-row">
              <span className="help-row-label">Undo</span>
              <span className="help-row-value"><kbd>Ctrl</kbd> <kbd>Z</kbd></span>
            </div>
            <div className="help-row">
              <span className="help-row-label">Redo</span>
              <span className="help-row-value"><kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>Z</kbd></span>
            </div>
            <div className="help-row">
              <span className="help-row-label">Close dialog</span>
              <span className="help-row-value"><kbd>Esc</kbd></span>
            </div>
          </div>

          <div className="help-section">
            <div className="help-section-title">Copy &amp; Export</div>
            <div className="help-row">
              <span className="help-row-label">Copy</span>
              <span className="help-row-value">Puts rich HTML on the clipboard — pastes with formatting into Word, Notion, and Google Docs</span>
            </div>
            <div className="help-row">
              <span className="help-row-label">Export</span>
              <span className="help-row-value">Downloads the current document as a <code>.md</code> file, preserving any reordering</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
