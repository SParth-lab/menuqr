import { Schema, model, models, type Model, type Types } from 'mongoose';
import type { ThemeConfig } from '@/types';

export interface ITemplate {
  _id: Types.ObjectId;
  key: string;
  name: string;
  category: string;
  description: string;
  defaultConfig: ThemeConfig;
  isActive: boolean;
  sortOrder: number;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    key: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    defaultConfig: { type: Schema.Types.Mixed, required: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Template: Model<ITemplate> =
  models.Template || model<ITemplate>('Template', TemplateSchema);
