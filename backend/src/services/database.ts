import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import type { ArticleStatus } from '../models/Article.js';
import { config } from '../config.js';

export type ArticleRecord = {
  _id: string; title: string; slug: string; summary: string; contentMarkdown: string;
  titleEn?: string; summaryEn?: string; contentMarkdownEn?: string;
  category: string; tags: string[]; coverUrl?: string; status: ArticleStatus;
  publishedAt?: string; createdAt: string; updatedAt: string;
};

type ArticleInput = Omit<ArticleRecord, '_id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { publishedAt?: string | Date };
type Row = Record<string, unknown>;
let database: DatabaseSync | undefined;

const now = (): string => new Date().toISOString();
const toIso = (value: unknown): string | undefined => value ? new Date(String(value)).toISOString() : undefined;
const idFor = (slug: string): string => createHash('sha256').update(slug).digest('hex').slice(0, 24);

const mapArticle = (row: Row): ArticleRecord => ({
  _id: String(row.id), title: String(row.title), slug: String(row.slug), summary: String(row.summary),
  contentMarkdown: String(row.content_markdown), category: String(row.category),
  ...(row.title_en ? { titleEn: String(row.title_en) } : {}),
  ...(row.summary_en ? { summaryEn: String(row.summary_en) } : {}),
  ...(row.content_markdown_en ? { contentMarkdownEn: String(row.content_markdown_en) } : {}),
  tags: JSON.parse(String(row.tags_json)) as string[],
  ...(row.cover_url ? { coverUrl: String(row.cover_url) } : {}), status: String(row.status) as ArticleStatus,
  ...(row.published_at ? { publishedAt: toIso(row.published_at) } : {}),
  createdAt: toIso(row.created_at) ?? now(), updatedAt: toIso(row.updated_at) ?? now(),
});

export const getDatabase = (): DatabaseSync => {
  if (!database) {
    mkdirSync(dirname(config.sqlitePath), { recursive: true });
    database = new DatabaseSync(config.sqlitePath);
    database.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS admins (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, title TEXT NOT NULL, title_en TEXT, slug TEXT NOT NULL UNIQUE, summary TEXT NOT NULL, summary_en TEXT, content_markdown TEXT NOT NULL, content_markdown_en TEXT, category TEXT NOT NULL, tags_json TEXT NOT NULL DEFAULT '[]', cover_url TEXT, status TEXT NOT NULL, published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at);
      CREATE INDEX IF NOT EXISTS idx_articles_category_status ON articles(category, status);
    `);
    const columns = new Set((database.prepare('PRAGMA table_info(articles)').all() as Row[]).map((row) => String(row.name)));
    for (const [name, type] of [['title_en', 'TEXT'], ['summary_en', 'TEXT'], ['content_markdown_en', 'TEXT']] as const) {
      if (!columns.has(name)) database.exec(`ALTER TABLE articles ADD COLUMN ${name} ${type}`);
    }
    const invalidIds = database.prepare("SELECT id, slug FROM articles WHERE length(id) <> 24 OR id GLOB '*[^a-fA-F0-9]*'").all() as Row[];
    const updateId = database.prepare('UPDATE articles SET id = ? WHERE id = ?');
    for (const row of invalidIds) updateId.run(idFor(String(row.slug)), String(row.id));
  }
  return database;
};

export const closeDatabase = (): void => { database?.close(); database = undefined; };

export const findAdmin = (username: string): { id: string; username: string; passwordHash: string; role: 'admin' } | undefined => {
  const row = getDatabase().prepare('SELECT id, username, password_hash FROM admins WHERE username = ?').get(username) as Row | undefined;
  return row ? { id: String(row.id), username: String(row.username), passwordHash: String(row.password_hash), role: 'admin' } : undefined;
};

export const insertAdmin = (input: { id: string; username: string; passwordHash: string }): void => {
  getDatabase().prepare('INSERT INTO admins (id, username, password_hash, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role').run(input.id, input.username, input.passwordHash, now());
};

export const removeOtherAdmins = (username: string): void => {
  getDatabase().prepare('DELETE FROM admins WHERE username <> ?').run(username);
};

export const countArticles = (): number => Number((getDatabase().prepare('SELECT COUNT(*) AS count FROM articles').get() as { count: number }).count);

export const insertArticle = (input: ArticleInput & { _id?: string }): ArticleRecord => {
  const timestamp = now(); const id = input._id ?? idFor(input.slug);
  const publishedAt = input.publishedAt ? new Date(input.publishedAt).toISOString() : null;
  getDatabase().prepare('INSERT INTO articles (id, title, title_en, slug, summary, summary_en, content_markdown, content_markdown_en, category, tags_json, cover_url, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, input.title, input.titleEn ?? null, input.slug, input.summary, input.summaryEn ?? null, input.contentMarkdown, input.contentMarkdownEn ?? null, input.category, JSON.stringify(input.tags), input.coverUrl ?? null, input.status, publishedAt, timestamp, timestamp);
  return getArticleById(id)!;
};

export const getArticleById = (id: string): ArticleRecord | undefined => {
  const row = getDatabase().prepare('SELECT * FROM articles WHERE id = ?').get(id) as Row | undefined;
  return row ? mapArticle(row) : undefined;
};

export const getArticleBySlug = (slug: string, publishedOnly = false): ArticleRecord | undefined => {
  const query = publishedOnly ? "SELECT * FROM articles WHERE slug = ? AND status = 'published'" : 'SELECT * FROM articles WHERE slug = ?';
  const row = getDatabase().prepare(query).get(slug) as Row | undefined;
  return row ? mapArticle(row) : undefined;
};

export const listArticles = (filters: { q?: string; category?: string; status?: ArticleStatus; sort?: 'updatedAt' | 'publishedAt' | 'title'; order?: 'asc' | 'desc'; publishedOnly?: boolean }): ArticleRecord[] => {
  const conditions: string[] = []; const values: string[] = [];
  if (filters.publishedOnly) conditions.push("status = 'published'");
  if (filters.status) { conditions.push('status = ?'); values.push(filters.status); }
  if (filters.category) { conditions.push('category = ?'); values.push(filters.category); }
  if (filters.q) { conditions.push('(title LIKE ? COLLATE NOCASE OR title_en LIKE ? COLLATE NOCASE OR summary LIKE ? COLLATE NOCASE OR summary_en LIKE ? COLLATE NOCASE OR tags_json LIKE ? COLLATE NOCASE)'); const query = `%${filters.q}%`; values.push(query, query, query, query, query); }
  const sortColumn = filters.sort === 'title' ? 'title' : filters.sort === 'publishedAt' ? 'published_at' : 'updated_at';
  const order = filters.order === 'asc' ? 'ASC' : 'DESC'; const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = getDatabase().prepare(`SELECT * FROM articles ${where} ORDER BY ${sortColumn} ${order}, updated_at DESC`).all(...values) as Row[];
  return rows.map(mapArticle);
};

export const listCategories = (): string[] => (getDatabase().prepare("SELECT DISTINCT category FROM articles WHERE status = 'published' ORDER BY category COLLATE NOCASE").all() as Array<{ category: string }>).map((row) => row.category);

export const updateArticle = (id: string, patch: Partial<ArticleInput>): ArticleRecord | undefined => {
  const current = getArticleById(id); if (!current) return undefined;
  const next = { ...current, ...patch, updatedAt: now() }; const publishedAt = next.publishedAt ? new Date(next.publishedAt).toISOString() : null;
  getDatabase().prepare('UPDATE articles SET title = ?, title_en = ?, slug = ?, summary = ?, summary_en = ?, content_markdown = ?, content_markdown_en = ?, category = ?, tags_json = ?, cover_url = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?')
    .run(next.title, next.titleEn ?? null, next.slug, next.summary, next.summaryEn ?? null, next.contentMarkdown, next.contentMarkdownEn ?? null, next.category, JSON.stringify(next.tags), next.coverUrl ?? null, next.status, publishedAt, next.updatedAt, id);
  return getArticleById(id);
};

export const deleteArticle = (id: string): boolean => getDatabase().prepare('DELETE FROM articles WHERE id = ?').run(id).changes > 0;
