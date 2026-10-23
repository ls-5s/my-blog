import { seedArticles } from '../data/seedArticles.js';
import { getArticleBySlug, insertArticle, updateArticle } from './database.js';

/** Add missing sample articles and backfill English fields without replacing edited content. */
export const ensureSeedArticles = async (): Promise<void> => {
  let seeded = 0;
  let translated = 0;
  for (const seed of seedArticles) {
    const existing = getArticleBySlug(seed.slug);
    if (!existing) {
      insertArticle(seed);
      seeded += 1;
      continue;
    }
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
  if (seeded) console.log(`Seeded ${seeded} sample articles`);
  if (translated) console.log(`Backfilled English content for ${translated} sample articles`);
};
