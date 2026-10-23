import { fallbackArticles } from '../data/site';
import type { AdminUser, ApiErrorShape, Article, ArticlePayload, ArticleStatus } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(status: number, shape: ApiErrorShape) {
    super(shape.message ?? '请求失败');
    this.name = 'ApiError';
    this.status = status;
    this.code = shape.code;
    this.details = shape.details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
      ...options,
    });
  } catch (error) {
    throw error;
  }

  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(response.status, body?.error ?? { message: '请求失败' });
  }
  return (body?.data ?? body) as T;
}

const isNetworkError = (error: unknown): boolean => error instanceof TypeError || (error instanceof Error && error.message.includes('fetch'));

export const publicApi = {
  async listArticles(filters: { q?: string; category?: string } = {}): Promise<Article[]> {
    try {
      const params = new URLSearchParams();
      if (filters.q) params.set('q', filters.q);
      if (filters.category && filters.category !== 'all') params.set('category', filters.category);
      return await request<Article[]>(`/articles${params.size ? `?${params.toString()}` : ''}`);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      const query = filters.q?.toLowerCase() ?? '';
      return fallbackArticles.filter((article) => {
        const categoryMatch = !filters.category || filters.category === 'all' || article.category === filters.category;
        const queryMatch = !query || `${article.title} ${article.summary} ${article.tags.join(' ')}`.toLowerCase().includes(query);
        return categoryMatch && queryMatch;
      });
    }
  },
  async getArticle(slug: string): Promise<Article> {
    try {
      return await request<Article>(`/articles/${encodeURIComponent(slug)}`);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      const article = fallbackArticles.find((item) => item.slug === slug);
      if (!article) throw new ApiError(404, { code: 'ARTICLE_NOT_FOUND', message: '文章不存在' });
      return article;
    }
  },
  async listCategories(): Promise<string[]> {
    try {
      return await request<string[]>('/categories');
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      return [...new Set(fallbackArticles.map((article) => article.category))];
    }
  },
};

export const authApi = {
  login(username: string, password: string): Promise<AdminUser> {
    return request<AdminUser>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  },
  me(): Promise<AdminUser> {
    return request<AdminUser>('/auth/me');
  },
  logout(): Promise<void> {
    return request<void>('/auth/logout', { method: 'POST' });
  },
};

export const adminApi = {
  listArticles(filters: { q?: string; category?: string; status?: ArticleStatus; sort?: string; order?: string } = {}): Promise<Article[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    return request<Article[]>(`/admin/articles${params.size ? `?${params.toString()}` : ''}`);
  },
  getArticle(id: string): Promise<Article> {
    return request<Article>(`/admin/articles/${encodeURIComponent(id)}`);
  },
  createArticle(payload: ArticlePayload): Promise<Article> {
    return request<Article>('/admin/articles', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateArticle(id: string, payload: Partial<ArticlePayload>): Promise<Article> {
    return request<Article>(`/admin/articles/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  publishArticle(id: string): Promise<Article> {
    return request<Article>(`/admin/articles/${encodeURIComponent(id)}/publish`, { method: 'POST' });
  },
  removeArticle(id: string): Promise<void> {
    return request<void>(`/admin/articles/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
};
