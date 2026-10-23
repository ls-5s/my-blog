import { seedArticles } from '../data/seedArticles.js';
import { countArticles, insertArticle } from './database.js';

/** Seed only an empty collection; existing admin-authored data is never overwritten. */
export const ensureSeedArticles = async (): Promise<void> => {
  const articleCount = countArticles();
  if (articleCount > 0) return;
  for (const article of seedArticles) insertArticle(article);
  console.log(`Seeded ${seedArticles.length} sample articles`);
};
