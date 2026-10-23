import { Router } from 'express';
import { Article } from '../models/Article.js';
import { requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { articlePatchSchema, articleSchema, idSchema, listQuerySchema } from '../validation.js';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getArticleOrThrow = async (id: string) => {
  const parsedId = idSchema.parse(id);
  const article = await Article.findById(parsedId);
  if (!article) throw new AppError(404, 'ARTICLE_NOT_FOUND', '文章不存在');
  return article;
};

adminRouter.get('/articles', async (request, response, next) => {
  try {
    const query = listQuerySchema.parse(request.query);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.q) {
      const search = escapeRegex(query.q);
      filter.$or = [{ title: { $regex: search, $options: 'i' } }, { summary: { $regex: search, $options: 'i' } }, { tags: { $regex: search, $options: 'i' } }];
    }
    const sortValue = query.order === 'asc' ? 1 : -1;
    const articles = await Article.find(filter).sort({ [query.sort]: sortValue }).lean();
    response.json({ data: articles });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/articles/:id', async (request, response, next) => {
  try {
    response.json({ data: await getArticleOrThrow(request.params.id) });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/articles', async (request, response, next) => {
  try {
    const payload = articleSchema.parse(request.body);
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();
    const article = await Article.create(payload);
    response.status(201).json({ data: article });
  } catch (error) {
    next(error);
  }
});

adminRouter.patch('/articles/:id', async (request, response, next) => {
  try {
    const payload = articlePatchSchema.parse(request.body);
    if (payload.status === 'published' && !payload.publishedAt) payload.publishedAt = new Date();
    const article = await getArticleOrThrow(request.params.id);
    Object.assign(article, payload);
    await article.save();
    response.json({ data: article });
  } catch (error) {
    next(error);
  }
});

adminRouter.post('/articles/:id/publish', async (request, response, next) => {
  try {
    const article = await getArticleOrThrow(request.params.id);
    article.status = 'published';
    article.publishedAt = article.publishedAt ?? new Date();
    await article.save();
    response.json({ data: article });
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/articles/:id', async (request, response, next) => {
  try {
    const article = await getArticleOrThrow(request.params.id);
    await article.deleteOne();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
