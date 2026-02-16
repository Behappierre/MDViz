# MD Visualizer

MVP web app to visualize Markdown as blocks, reorder them, copy with formatting, and export back to Markdown.

**Repo:** [github.com/Behappierre/MDViz](https://github.com/Behappierre/MDViz)

## Setup

- **Node**: 18+
- **Install**: `npm install`
- **Dev**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (output in `dist/`)
- **Preview**: `npm run preview` (serve `dist/`)
- **Tests**: `npm run test`
- **Coverage**: `npm run test:coverage`

## Architecture

- **Single source of truth**: Canonical AST in `src/core/astTypes.ts`. All document state is a `Doc` (ordered list of `Block`s with stable IDs).
- **Pipeline**: Markdown string → **parser** (remark) → mdast → **normalizer** → canonical AST → **serializer** → Markdown string.
- **No destructive handling**: Unsupported nodes become `BlockUnknown` with raw passthrough; they are never dropped.
- **Rendering**: All block HTML is sanitized via `sanitize.ts` (DOMPurify); no unsanitized HTML is ever rendered.
- **Reorder**: Pure functions in `reorder.ts`; state uses immutable history in `history.ts` so every reorder is undoable.
- **Clipboard**: `clipboard.ts` builds HTML (sanitized), plain text, and markdown; clipboard API uses HTML + plain so pastes get formatting with plain-text fallback.

### Module layout

```
src/
  core/          # Pure pipeline, no UI
    astTypes.ts  # Canonical AST types
    parser.ts    # Markdown → mdast
    normalizer.ts# mdast → canonical Doc
    serializer.ts# Doc → Markdown
    reorder.ts   # Reorder by ID (pure)
    clipboard.ts # Selection → HTML/plain/markdown
    sanitize.ts  # Safe HTML output
  state/
    store.ts     # App state shape
    history.ts   # Undo/redo stack
  ui/            # React components
  tests/         # Vitest + fixtures
```

## Supported Markdown (MVP)

- Headings (h1–h6)
- Paragraphs with **bold**, *emphasis*, `code`, [links](url), images
- Fenced code blocks (with optional language)
- Blockquotes
- Ordered and unordered lists (including nested)
- Tables (header + body rows)
- Thematic break (---)
- Raw HTML (rendered sanitized)
- Unknown / unsupported → preserved as raw block (passthrough)

## Known Limitations

- No nested block drag (top-level only).
- List/blockquote contents are not reorderable at block level.
- Export does not wait on warnings; it always exports current doc.
- Clipboard behavior varies by browser (see Compatibility).

## Compatibility (clipboard)

- **Chrome/Edge**: ClipboardItem with `text/html` + `text/plain` works; paste into Docs/Word keeps formatting.
- **Firefox**: May strip HTML in some contexts; plain-text fallback always available.
- **Safari**: Similar to Chrome; some apps may prefer plain text.
- **Slack/Email**: Usually keep basic formatting (bold, links) when pasting HTML; plain text is used if HTML is not accepted.

## Test report summary

- **Parser**: parse success/error, non-string input.
- **Normalizer**: round-trip and passthrough.
- **Serializer**: all block types, order preserved.
- **Reorder**: indexById, move, reorder, invalid id, move to end.
- **Clipboard**: payload has HTML + plain + markdown, sanitized.
- **Sanitize**: safe tags allowed, script/javascript stripped.
- **Fixtures**: short markdown samples round-trip parse → normalize → serialize.

Run `npm run test` for full suite; `npm run test:coverage` for core coverage (parser, normalizer, serializer, reorder, clipboard, sanitize, astTypes).

---

## Git (push to GitHub)

From the project root:

```bash
git init
git add .
git commit -m "Initial commit: MD Visualizer MVP"
git branch -M main
git remote add origin https://github.com/Behappierre/MDViz.git
git push -u origin main
```

Use a personal access token or SSH key if prompted for auth. To use SSH:

```bash
git remote add origin git@github.com:Behappierre/MDViz.git
git push -u origin main
```

---

## Deploy on Netlify

1. **Connect the repo**
   - Log in at [netlify.com](https://www.netlify.com) → **Add new site** → **Import an existing project**.
   - Choose **GitHub** and authorize; select **Behappierre/MDViz**.

2. **Build settings** (usually auto-detected from `netlify.toml`)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (leave empty)

3. **Deploy**
   - Click **Deploy site**. Netlify runs `npm run build` and publishes the `dist` folder. Your app will be available at a `*.netlify.app` URL.

4. **Optional**
   - **Environment:** Node 18+ is used by default; you can set `NODE_VERSION=18` under **Site settings → Environment variables** if needed.
   - **Custom domain:** In **Domain management** add your own domain and follow Netlify’s DNS instructions.
