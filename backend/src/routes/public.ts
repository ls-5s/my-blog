import { Router } from 'express';
import { Article } from '../models/Article.js';
import { AppError } from '../middleware/error.js';

export const publicRouter = Router();

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

publicRouter.get('/articles', async (request, response, next) => {
  try {
    const query = typeof request.query.q === 'string' ? request.query.q.trim() : '';
    const category = typeof request.query.category === 'string' ? request.query.category.trim() : '';
    const filter: Record<string, unknown> = { status: 'published' };
    if (category) filter.category = category;
    if (query) {
      const search = escapeRegex(query);
      filter.$or = [{ title: { $regex: search, $options: 'i' } }, { summary: { $regex: search, $options: 'i' } }, { tags: { $regex: search, $options: 'i' } }];
    }
    const articles = await Article.find(filter).sort({ publishedAt: -1, updatedAt: -1 }).lean();
    response.json({ data: articles });
  } catch (error) {
    next(error);
  }
});

publicRouter.get('/articles/:slug', async (request, response, next) => {
  try {
    const article = await Article.findOne({ slug: request.params.slug, status: 'published' }).lean();
    if (!article) throw new AppError(404, 'ARTICLE_NOT_FOUND', '文章不存在');
    response.json({ data: article });
  } catch (error) {
    next(error);
  }
});

publicRouter.get('/categories', async (_request, response, next) => {
  try {
    const categories = await Article.distinct('category', { status: 'published' });
    response.json({ data: categories.sort((a, b) => a.localeCompare(b)) });
  } catch (error) {
    next(error);
  }
});
