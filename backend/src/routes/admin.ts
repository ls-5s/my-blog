import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { articlePatchSchema, articleSchema, idSchema, listQuerySchema } from '../validation.js';
import { deleteArticle, getArticleById, insertArticle, listArticles, updateArticle } from '../services/database.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

const getArticleOrThrow = (id: string) => {
  const parsedId = idSchema.parse(id);
  const article = getArticleById(parsedId);
  if (!article) throw new AppError(404, 'ARTICLE_NOT_FOUND', '文章不存在');
  return article;
};

adminRouter.get('/articles', async (request, response, next) => {
  try {
    const query = listQuerySchema.parse(request.query);
    const articles = listArticles({ q: query.q, category: query.category, status: query.status, sort: query.sort, order: query.order });
    response.json({ data: articles });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/articles/:id', async (request, response, next) => {
  try {
    response.json({ data: getArticleOrThrow(request.params.id) });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/articles', async (request, response, next) => {
  try {
    const payload = articleSchema.parse(request.body);
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();
    const article = insertArticle(payload);
    response.status(201).json({ data: article });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/articles/:id', async (request, response, next) => {
  try {
    const payload = articlePatchSchema.parse(request.body);
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();
    const existing = getArticleOrThrow(request.params.id);
    const article = updateArticle(request.params.id, payload);
    if (!article) throw new AppError(404, 'ARTICLE_NOT_FOUND', '文章不存在');
    response.json({ data: article });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/articles/:id/publish', async (request, response, next) => {
  try {
    const existing = getArticleOrThrow(request.params.id);
    const article = updateArticle(request.params.id, { status: 'published', publishedAt: existing.publishedAt ?? new Date() });
    if (!article) throw new AppError(404, 'ARTICLE_NOT_FOUND', '文章不存在');
    response.json({ data: article });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/articles/:id', async (request, response, next) => {
  try {
    getArticleOrThrow(request.params.id);
    const deleted = deleteArticle(request.params.id);
    if (!deleted) throw new AppError(404, 'ARTICLE_NOT_FOUND', '文章不存在');
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
