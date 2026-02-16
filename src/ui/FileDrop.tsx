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
      style={{
        border: '2px dashed #666',
        borderRadius: 8,
        padding: 24,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        onChange={onInputChange}
        style={{ display: 'none' }}
        aria-hidden
      />
      {children ?? 'Drop .md file here or click to upload'}
    </div>
  );
}
