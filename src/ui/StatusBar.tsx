/**
 * Status bar: selection count, status message, error state.
 */


export interface StatusBarProps {
  status: 'idle' | 'loading' | 'error' | 'success';
  statusMessage: string;
  selectedCount: number;
  blockCount: number;
}

export function StatusBar({ status, statusMessage, selectedCount, blockCount }: StatusBarProps) {
  const isError = status === 'error';
  return (
    <div className={`status-bar${isError ? ' status-bar--error' : ''}`}>
      <span>
        {blockCount} block{blockCount !== 1 ? 's' : ''}
        {selectedCount > 0 && ` · ${selectedCount} selected`}
      </span>
      {statusMessage && <span role="status">{statusMessage}</span>}
    </div>
  );
}
