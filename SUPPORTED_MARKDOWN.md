# Supported Markdown (MD Visualizer)

## Block-level

| Feature        | Import | Export | Notes                    |
|----------------|--------|--------|--------------------------|
| Headings 1–6   | ✓      | ✓      |                          |
| Paragraphs    | ✓      | ✓      |                          |
| Code blocks   | ✓      | ✓      | Language label preserved |
| Blockquotes   | ✓      | ✓      | Nested blocks             |
| Bullet lists  | ✓      | ✓      | Nested                    |
| Ordered lists | ✓      | ✓      | Start number preserved    |
| Tables        | ✓      | ✓      | Header + rows             |
| Thematic break| ✓      | ✓      | `---`                    |
| Raw HTML      | ✓      | ✓      | Rendered sanitized        |
| Other         | ✓      | ✓      | Passthrough as raw        |

## Inline

| Feature   | In blocks      |
|-----------|----------------|
| **Bold**  | ✓              |
| *Emphasis*| ✓              |
| `Code`    | ✓              |
| [Links](url) | ✓           |
| Images    | ✓              |

Unsupported markdown is never dropped; it is kept as a single raw block so round-trip is non-destructive.
