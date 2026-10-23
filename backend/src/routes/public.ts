import { Router } from 'express';
import { AppError } from '../middleware/error.js';
import { getArticleBySlug, listArticles, listCategories } from '../services/database.turso.js';

export const publicRouter = Router();

publicRouter.get('/articles', async (request, response, next) => {
  try {
    const query = typeof request.query.q === 'string' ? request.query.q.trim() : '';
    const category = typeof request.query.category === 'string' ? request.query.category.trim() : '';
    const articles = await listArticles({ q: query || undefined, category: category || undefined, sort: 'publishedAt', order: 'desc', publishedOnly: true });
    response.json({ data: articles });
  } catch (error) {
    next(error);
  }
});

publicRouter.get('/articles/:slug', async (request, response, next) => {
  try {
    const article = await getArticleBySlug(request.params.slug, true);
    if (!article) throw new AppError(404, 'ARTICLE_NOT_FOUND', '文章不存在');
    response.json({ data: article });
  } catch (error) {
    next(error);
  }
});

publicRouter.get('/categories', async (_request, response, next) => {
  try {
    response.json({ data: await listCategories() });
  } catch (error) {
    next(error);
  }
});
