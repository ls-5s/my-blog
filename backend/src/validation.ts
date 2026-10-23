import { z } from 'zod';
import { articleStatuses } from './models/Article.js';

const optionalUrl = z.string().trim().url().max(2_000).optional().or(z.literal(''));

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export const articleSchema = z.object({
  title: z.string().trim().min(1).max(180),
  titleEn: z.string().trim().max(180).optional(),
  slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 只能包含小写字母、数字和连字符'),
  summary: z.string().trim().min(1).max(500),
  summaryEn: z.string().trim().max(500).optional(),
  contentMarkdown: z.string().min(1),
  contentMarkdownEn: z.string().optional(),
  category: z.string().trim().min(1).max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
  coverUrl: optionalUrl,
  status: z.enum(articleStatuses).default('draft'),
  publishedAt: z.coerce.date().optional(),
});

export const articlePatchSchema = articleSchema.partial();

// Article IDs are persisted by SQLite. Seeded records use slug-derived IDs,
// while newly created records use a 24-character hash, so both formats are valid.
export const idSchema = z.string().trim().min(1).max(64).regex(/^[a-z\d-]+$/i, '无效的文章 ID');

export const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(80).optional(),
  status: z.enum(articleStatuses).optional(),
  sort: z.enum(['updatedAt', 'publishedAt', 'title']).default('updatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
