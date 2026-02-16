# Known Limitations (MVP)

- **Nested drag**: Only top-level blocks can be reordered by drag/drop. Blocks inside lists or blockquotes are not draggable.
- **Export**: Export always writes the current document; it is not blocked by warnings.
- **Unknown nodes**: Preserved as one raw block per node; exact formatting may differ on re-export.
- **Clipboard**: Behavior depends on the target app and browser; some targets only accept plain text.
- **Parse errors**: Shown in the status bar; document is cleared on parse failure.
- **File size**: No hard limit; very large files may be slow to parse/render.
