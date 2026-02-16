# Clipboard behavior by environment

Copy in MD Visualizer puts both **HTML** (sanitized) and **plain text** on the clipboard. Paste behavior depends on the target.

## Browsers

- **Chrome / Edge**: `ClipboardItem` with `text/html` and `text/plain` is supported. Rich paste works in Google Docs, Word Online, and most editors.
- **Firefox**: Supports the same API; some apps may still prefer plain text.
- **Safari**: Generally good; some targets may fall back to plain text.

## Paste targets

- **Google Docs**: Uses HTML when available; headings, bold, links, lists, tables are preserved.
- **Microsoft Word (desktop / 365)**: Uses HTML; formatting is preserved.
- **Slack**: Keeps basic formatting (bold, links); complex tables may simplify.
- **Email (Gmail, Outlook)**: Usually preserve formatting when pasting HTML.
- **Plain-text fields**: Always get the plain-text fallback (no formatting).

If the target does not accept HTML, the OS or app uses the plain-text version automatically.
