/**
 * Thin wrapper around GA4 gtag. All calls are no-ops if gtag isn't loaded
 * (e.g. blocked by an ad blocker or during local dev without the script).
 */

declare function gtag(...args: unknown[]): void;

function fire(eventName: string, params?: Record<string, unknown>) {
  if (typeof gtag !== 'function') return;
  gtag('event', eventName, params ?? {});
}

export function trackFileLoaded(blockCount: number) {
  fire('file_loaded', { block_count: blockCount });
}

export function trackCopyUsed(viewMode: string, blockCount: number) {
  fire('copy_used', { view_mode: viewMode, block_count: blockCount });
}

export function trackExportUsed(blockCount: number) {
  fire('export_used', { block_count: blockCount });
}

export function trackViewSwitched(toMode: string) {
  fire('view_switched', { to_mode: toMode });
}

export function trackErrorOccurred(message: string) {
  fire('error_occurred', { error_message: message });
}
