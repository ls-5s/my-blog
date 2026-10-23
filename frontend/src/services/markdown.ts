import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

export const renderMarkdown = (markdown: string): string =>
  DOMPurify.sanitize(marked.parse(markdown) as string, {
    USE_PROFILES: { html: true },
  });
