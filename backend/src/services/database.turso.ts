import { createClient, type Client, type InStatement, type Row } from '@libsql/client';
import { createHash } from 'node:crypto';
import type { ArticleStatus } from '../models/Article.js';
import { config } from '../config.js';

export type ArticleRecord = {
  _id: string; title: string; slug: string; summary: string; contentMarkdown: string;
  titleEn?: string; summaryEn?: string; contentMarkdownEn?: string;
  category: string; tags: string[]; coverUrl?: string; status: ArticleStatus;
  publishedAt?: string; createdAt: string; updatedAt: string;
};
type ArticleInput = Omit<ArticleRecord, '_id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { publishedAt?: string | Date };
type DatabaseRow = Row & Record<string, unknown>;
let database: Client | undefined;
let initialization: Promise<void> | undefined;
const now = (): string => new Date().toISOString();
const toIso = (value: unknown): string | undefined => value ? new Date(String(value)).toISOString() : undefined;
const idFor = (slug: string): string => createHash('sha256').update(slug).digest('hex').slice(0, 24);
const fetchWithDiagnostics: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok && config.nodeEnv !== 'production') {
    const body = (await response.clone().text()).replace(/\s+/g, ' ').trim();
    console.error(`Database request failed (HTTP ${response.status}): ${body.slice(0, 1_000) || '<empty response body>'}`);
  }
  return response;
};
const db = (): Client => {
  if (!database) database = createClient({
    url: config.databaseUrl,
    ...(config.tursoAuthToken ? { authToken: config.tursoAuthToken } : {}),
    ...(config.nodeEnv !== 'production' ? { fetch: fetchWithDiagnostics } : {}),
  });
  return database;
};
const mapArticle = (row: DatabaseRow): ArticleRecord => ({
  _id: String(row.id), title: String(row.title), slug: String(row.slug), summary: String(row.summary), contentMarkdown: String(row.content_markdown), category: String(row.category),
  ...(row.title_en ? { titleEn: String(row.title_en) } : {}), ...(row.summary_en ? { summaryEn: String(row.summary_en) } : {}), ...(row.content_markdown_en ? { contentMarkdownEn: String(row.content_markdown_en) } : {}),
  tags: JSON.parse(String(row.tags_json)) as string[], ...(row.cover_url ? { coverUrl: String(row.cover_url) } : {}), status: String(row.status) as ArticleStatus,
  ...(row.published_at ? { publishedAt: toIso(row.published_at) } : {}), createdAt: toIso(row.created_at) ?? now(), updatedAt: toIso(row.updated_at) ?? now(),
});
export const getDatabase = (): Client => db();
export const initializeDatabase = async (): Promise<void> => {
  if (!initialization) initialization = (async () => {
    const schema: InStatement[] = [
      "CREATE TABLE IF NOT EXISTS admins (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TEXT NOT NULL)",
      "CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, title TEXT NOT NULL, title_en TEXT, slug TEXT NOT NULL UNIQUE, summary TEXT NOT NULL, summary_en TEXT, content_markdown TEXT NOT NULL, content_markdown_en TEXT, category TEXT NOT NULL, tags_json TEXT NOT NULL DEFAULT '[]', cover_url TEXT, status TEXT NOT NULL, published_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
      'CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at)', 'CREATE INDEX IF NOT EXISTS idx_articles_category_status ON articles(category, status)',
    ];
    for (const statement of schema) await db().execute(statement);
    // Keep migrations compatible with Turso's remote SQL parser; avoid PRAGMA-based introspection.
    for (const [name, type] of [['title_en', 'TEXT'], ['summary_en', 'TEXT'], ['content_markdown_en', 'TEXT']] as const) {
      try {
        await db().execute(`ALTER TABLE articles ADD COLUMN ${name} ${type}`);
      } catch (error) {
        if (!/duplicate column/i.test(String(error))) throw error;
      }
    }
    const invalidIds = (await db().execute("SELECT id, slug FROM articles WHERE length(id) <> 24 OR id GLOB '*[^a-fA-F0-9]*'")).rows as DatabaseRow[];
    for (const row of invalidIds) await db().execute({ sql: 'UPDATE articles SET id = ? WHERE id = ?', args: [idFor(String(row.slug)), String(row.id)] });
  })();
  await initialization;
};
export const closeDatabase = async (): Promise<void> => { if (initialization) await initialization; if (database) await database.close(); database = undefined; initialization = undefined; };
export const findAdmin = async (username: string): Promise<{ id: string; username: string; passwordHash: string; role: 'admin' } | undefined> => {
  const row = (await db().execute({ sql: 'SELECT id, username, password_hash FROM admins WHERE username = ?', args: [username] })).rows[0] as DatabaseRow | undefined;
  return row ? { id: String(row.id), username: String(row.username), passwordHash: String(row.password_hash), role: 'admin' } : undefined;
};
export const insertAdmin = async (input: { id: string; username: string; passwordHash: string }): Promise<void> => { await db().execute({ sql: 'INSERT INTO admins (id, username, password_hash, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role', args: [input.id, input.username, input.passwordHash, now()] }); };
export const removeOtherAdmins = async (username: string): Promise<void> => { await db().execute({ sql: 'DELETE FROM admins WHERE username <> ?', args: [username] }); };
export const countArticles = async (): Promise<number> => Number(((await db().execute('SELECT COUNT(*) AS count FROM articles')).rows[0] as DatabaseRow).count);
export const insertArticle = async (input: ArticleInput & { _id?: string }): Promise<ArticleRecord> => {
  const timestamp = now(); const id = input._id ?? idFor(input.slug); const publishedAt = input.publishedAt ? new Date(input.publishedAt).toISOString() : null;
  await db().execute({ sql: 'INSERT INTO articles (id, title, title_en, slug, summary, summary_en, content_markdown, content_markdown_en, category, tags_json, cover_url, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', args: [id, input.title, input.titleEn ?? null, input.slug, input.summary, input.summaryEn ?? null, input.contentMarkdown, input.contentMarkdownEn ?? null, input.category, JSON.stringify(input.tags), input.coverUrl ?? null, input.status, publishedAt, timestamp, timestamp] });
  return (await getArticleById(id))!;
};
export const getArticleById = async (id: string): Promise<ArticleRecord | undefined> => { const row = (await db().execute({ sql: 'SELECT * FROM articles WHERE id = ?', args: [id] })).rows[0] as DatabaseRow | undefined; return row ? mapArticle(row) : undefined; };
export const getArticleBySlug = async (slug: string, publishedOnly = false): Promise<ArticleRecord | undefined> => { const query = publishedOnly ? "SELECT * FROM articles WHERE slug = ? AND status = 'published'" : 'SELECT * FROM articles WHERE slug = ?'; const row = (await db().execute({ sql: query, args: [slug] })).rows[0] as DatabaseRow | undefined; return row ? mapArticle(row) : undefined; };
export const listArticles = async (filters: { q?: string; category?: string; status?: ArticleStatus; sort?: 'updatedAt' | 'publishedAt' | 'title'; order?: 'asc' | 'desc'; publishedOnly?: boolean }): Promise<ArticleRecord[]> => {
  const conditions: string[] = []; const values: string[] = []; if (filters.publishedOnly) conditions.push("status = 'published'"); if (filters.status) { conditions.push('status = ?'); values.push(filters.status); } if (filters.category) { conditions.push('category = ?'); values.push(filters.category); }
  if (filters.q) { conditions.push('(title LIKE ? COLLATE NOCASE OR title_en LIKE ? COLLATE NOCASE OR summary LIKE ? COLLATE NOCASE OR summary_en LIKE ? COLLATE NOCASE OR tags_json LIKE ? COLLATE NOCASE)'); const query = `%${filters.q}%`; values.push(query, query, query, query, query); }
  const sortColumn = filters.sort === 'title' ? 'title' : filters.sort === 'publishedAt' ? 'published_at' : 'updated_at'; const order = filters.order === 'asc' ? 'ASC' : 'DESC'; const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = (await db().execute({ sql: `SELECT * FROM articles ${where} ORDER BY ${sortColumn} ${order}, updated_at DESC`, args: values })).rows as DatabaseRow[]; return rows.map(mapArticle);
};
export const listCategories = async (): Promise<string[]> => (await db().execute("SELECT DISTINCT category FROM articles WHERE status = 'published' ORDER BY category COLLATE NOCASE")).rows.map((row) => String(row.category));
export const updateArticle = async (id: string, patch: Partial<ArticleInput>): Promise<ArticleRecord | undefined> => {
  const current = await getArticleById(id); if (!current) return undefined; const next = { ...current, ...patch, updatedAt: now() }; const publishedAt = next.publishedAt ? new Date(next.publishedAt).toISOString() : null;
  await db().execute({ sql: 'UPDATE articles SET title = ?, title_en = ?, slug = ?, summary = ?, summary_en = ?, content_markdown = ?, content_markdown_en = ?, category = ?, tags_json = ?, cover_url = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?', args: [next.title, next.titleEn ?? null, next.slug, next.summary, next.summaryEn ?? null, next.contentMarkdown, next.contentMarkdownEn ?? null, next.category, JSON.stringify(next.tags), next.coverUrl ?? null, next.status, publishedAt, next.updatedAt, id] }); return getArticleById(id);
};
export const deleteArticle = async (id: string): Promise<boolean> => (await db().execute({ sql: 'DELETE FROM articles WHERE id = ?', args: [id] })).rowsAffected > 0;
