export type Locale = 'zh' | 'en';
export type ArticleStatus = 'draft' | 'published' | 'scheduled';

export type Localized = { zh: string; en: string };

export interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  slug: string;
  summary: string;
  summaryEn?: string;
  contentMarkdown: string;
  contentMarkdownEn?: string;
  category: string;
  tags: string[];
  coverUrl?: string;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  readTime?: number;
}

export interface ArticlePayload {
  title: string;
  titleEn?: string;
  slug: string;
  summary: string;
  summaryEn?: string;
  contentMarkdown: string;
  contentMarkdownEn?: string;
  category: string;
  tags: string[];
  coverUrl?: string;
  status: ArticleStatus;
  publishedAt?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
}

export interface Project {
  id: string;
  index: string;
  year: string;
  title: Localized;
  type: Localized;
  summary: Localized;
  stack: string[];
  art: string;
}

export interface ApiErrorShape {
  code?: string;
  message?: string;
  details?: unknown;
}
