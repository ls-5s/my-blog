export const articleStatuses = ['draft', 'published', 'scheduled'] as const;
export type ArticleStatus = (typeof articleStatuses)[number];
