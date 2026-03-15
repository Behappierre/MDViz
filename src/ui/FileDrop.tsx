/**
 * File drop zone and click-to-upload for .md files.
 */

import React, { useCallback, useRef } from 'react';

export interface FileDropProps {
  onFile: (file: File, text: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function FileDrop({ onFile, onError, disabled, children }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.md')) {
        onError?.('Please select a .md file');
        return;
      }
      try {
        const text = await file.text();
        onFile(file, text);
      } catch (e) {
        onError?.(e instanceof Error ? e.message : 'Failed to read file');
      }
    },
    [onFile, onError]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'copy';
  }, []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={openPicker}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
      aria-label="Drop or click to upload Markdown file"
      className={`file-drop${disabled ? ' file-drop--disabled' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        onChange={onInputChange}
        style={{ display: 'none' }}
        aria-hidden
      />
      {children ?? (
        <>
          <svg className="file-drop-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div className="file-drop-title">Drop your Markdown file here</div>
          <div className="file-drop-sub">or click to browse &nbsp;·&nbsp; .md files only</div>
        </>
      )}
    </div>
  );
}
