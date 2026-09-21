import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/**
 * Post bodies are authored only by the super admin, so this is trusted content.
 * If author roles are ever widened, sanitise here before the output reaches a page.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md ?? '', { async: false });
}

export function readingMinutes(md: string): number {
  const words = (md ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
