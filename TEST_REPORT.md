# Test report summary

## Scope

- **Core modules**: `parser`, `normalizer`, `serializer`, `reorder`, `clipboard`, `sanitize`, `astTypes`.
- **Test runner**: Vitest.
- **Coverage**: V8; reported for `src/core/**/*.ts` (excluding test files and fixtures).

## Test suites

| Suite           | Description |
|-----------------|-------------|
| parser.test     | Empty input, heading, paragraph+list, non-string input. |
| normalizer.test | Round-trip (headings, code), passthrough. |
| serializer.test | Empty doc, paragraph, heading, code, table, blockquote/list, thematicBreak/html/unknown, block order. |
| reorder.test    | indexOfBlock, moveBlock, reorderBlocks, reorderBlocksById (including null = move to end), invalid id, moveBlockById, out-of-range moveBlock. |
| clipboard.test  | Plain fallback, HTML and markdown present, no script in HTML, multiple blocks. |
| sanitize.test   | Safe tags allowed, script stripped, javascript: stripped, hasDangerousContent. |
| astTypes.test   | blockTypeLabel for all block types, hasChildBlocks. |
| fixtures.test   | Short fixture round-trips (parse → normalize → serialize), malformed still parses. |

## How to run

```bash
npm run test           # run once
npm run test:watch     # watch mode
npm run test:coverage  # with coverage report
```

## Coverage (core)

Run `npm run test:coverage` for current numbers. Target is 80%+ on core; reorder and sanitize are well covered; parser/normalizer/clipboard have additional branches that can be covered with more targeted tests.
