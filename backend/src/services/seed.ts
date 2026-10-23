import { Article } from '../models/Article.js';
import { seedArticles } from '../data/seedArticles.js';

/** Seed only an empty collection; existing admin-authored data is never overwritten. */
export const ensureSeedArticles = async (): Promise<void> => {
  const articleCount = await Article.countDocuments();
  if (articleCount > 0) return;
  await Article.insertMany(seedArticles, { ordered: true });
  console.log(`Seeded ${seedArticles.length} sample articles`);
};
