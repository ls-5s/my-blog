import type { Article, Locale } from '../types';

const localized = (value: string, english: string | undefined, locale: Locale): string =>
  locale === 'en' && english?.trim() ? english : value;

export const localizeArticle = (article: Article, locale: Locale): Article => ({
  ...article,
  title: localized(article.title, article.titleEn, locale),
  summary: localized(article.summary, article.summaryEn, locale),
  contentMarkdown: localized(article.contentMarkdown, article.contentMarkdownEn, locale),
});

export const articleSearchText = (article: Article): string => [
  article.title,
  article.titleEn,
  article.summary,
  article.summaryEn,
  article.category,
  ...article.tags,
].filter(Boolean).join(' ');
