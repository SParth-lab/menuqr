import { Schema, model, models, type Model, type Types } from 'mongoose';
import { POST_STATUSES, POST_TYPES, type PostStatus, type PostType } from '@/types';

export interface IPost {
  _id: Types.ObjectId;
  slug: string;
  type: PostType;
  title: string;
  h1: string;
  excerpt?: string;
  bodyMd: string;
  metaTitle?: string;
  metaDescription?: string;
  coverUrl?: string;
  tags: string[];
  author: string;
  readMinutes?: number;
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: POST_TYPES, default: 'BLOG' },
    title: { type: String, required: true },
    h1: { type: String, required: true },
    excerpt: String,
    bodyMd: { type: String, default: '' },
    metaTitle: String,
    metaDescription: String,
    coverUrl: String,
    tags: { type: [String], default: [] },
    author: { type: String, default: 'QR4Menu Editorial' },
    readMinutes: Number,
    status: { type: String, enum: POST_STATUSES, default: 'DRAFT' },
    publishedAt: Date,
  },
  { timestamps: true }
);

PostSchema.index({ type: 1, status: 1, publishedAt: -1 });

export const Post: Model<IPost> = models.Post || model<IPost>('Post', PostSchema);
