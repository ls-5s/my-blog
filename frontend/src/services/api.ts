import type { AdminUser, ApiErrorShape, Article, ArticlePayload, ArticleStatus } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '');

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
    if (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch'))) {
      throw new ApiError(0, {
        code: 'API_UNAVAILABLE',
        message: '无法连接到文章 API，请检查后端服务与 API 地址配置',
      });
    }
    throw error;
  }

  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) {
    throw new ApiError(response.status, body?.error ?? { message: '请求失败' });
  }
  return (body?.data ?? body) as T;
}

export const publicApi = {
  async listArticles(filters: { q?: string; category?: string } = {}): Promise<Article[]> {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    return request<Article[]>(`/articles${params.size ? `?${params.toString()}` : ''}`);
  },
  async getArticle(slug: string): Promise<Article> {
    return request<Article>(`/articles/${encodeURIComponent(slug)}`);
  },
  async listCategories(): Promise<string[]> {
    return request<string[]>('/categories');
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
