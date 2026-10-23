import { model, Schema, type InferSchemaType } from 'mongoose';

export const articleStatuses = ['draft', 'published', 'scheduled'] as const;
export type ArticleStatus = (typeof articleStatuses)[number];

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 180 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 200 },
    summary: { type: String, required: true, trim: true, maxlength: 500 },
    contentMarkdown: { type: String, required: true },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    tags: { type: [String], default: [] },
    coverUrl: { type: String, trim: true, maxlength: 2_000 },
    status: { type: String, enum: articleStatuses, default: 'draft', required: true },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });

export type ArticleDocument = InferSchemaType<typeof articleSchema>;
export const Article = model('Article', articleSchema);
