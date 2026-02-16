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
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 8px',
        fontSize: 12,
        color: isError ? '#c00' : '#666',
        borderTop: '1px solid #eee',
        background: '#fafafa',
      }}
    >
      <span>
        {blockCount} block{blockCount !== 1 ? 's' : ''}
        {selectedCount > 0 && ` · ${selectedCount} selected`}
      </span>
      {statusMessage && <span role="status">{statusMessage}</span>}
    </div>
  );
}
