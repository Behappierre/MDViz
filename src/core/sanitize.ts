/**
 * Sanitize HTML so it is safe to render. Never render unsanitized HTML.
 * Uses allowlist of tags/attributes for markdown-derived content.
 */

import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'span', 'div',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'code', 'pre',
  'a', 'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'hr', 'img',
];

/**
 * Sanitize HTML string for safe insertion into the DOM.
 * Scripts, event handlers, and dangerous attributes are stripped.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'class'],
    ADD_ATTR: [],
  });
}

/**
 * Check if a string contains potentially dangerous content before sanitization.
 */
export function hasDangerousContent(html: string): boolean {
  const sanitized = sanitizeHtml(html);
  const lower = html.toLowerCase();
  return (
    lower.includes('<script') ||
    lower.includes('javascript:') ||
    lower.includes('onerror') ||
    lower.includes('onload') ||
    (html.length > 0 && sanitized.length === 0 && /<[a-z]/.test(html))
  );
}
