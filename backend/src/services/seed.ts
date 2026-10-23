import { seedArticles } from '../data/seedArticles.js';
import { countArticles, getArticleBySlug, insertArticle, updateArticle } from './database.js';

/** Seed an empty collection and backfill English fields without replacing existing content. */
export const ensureSeedArticles = async (): Promise<void> => {
  const articleCount = countArticles();
  if (articleCount === 0) {
    for (const article of seedArticles) insertArticle(article);
    console.log(`Seeded ${seedArticles.length} sample articles`);
    return;
  }

  let translated = 0;
  for (const seed of seedArticles) {
    const existing = getArticleBySlug(seed.slug);
    if (!existing) continue;
    const isUnmodifiedSeed = existing.title === seed.title
      && existing.summary === seed.summary
      && existing.contentMarkdown === seed.contentMarkdown;
    if (!isUnmodifiedSeed) continue;
    const patch: Partial<Pick<typeof seed, 'titleEn' | 'summaryEn' | 'contentMarkdownEn'>> = {};
    if (!existing.titleEn) patch.titleEn = seed.titleEn;
    if (!existing.summaryEn) patch.summaryEn = seed.summaryEn;
    if (!existing.contentMarkdownEn) patch.contentMarkdownEn = seed.contentMarkdownEn;
    if (Object.keys(patch).length) {
      updateArticle(existing._id, patch);
      translated += 1;
    }
  }
  if (translated) console.log(`Backfilled English content for ${translated} sample articles`);
};
