import type { Article } from '../types';

export const articleSearchText = (article: Article): string => [
  article.title,
  article.summary,
  article.category,
  ...article.tags,
].filter(Boolean).join(' ');
