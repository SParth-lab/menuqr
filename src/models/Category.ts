import { Schema, model, models, type Model, type Types } from 'mongoose';

export interface ICategory {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  name: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true, trim: true },
    description: String,
    sortOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CategorySchema.index({ restaurantId: 1, sortOrder: 1 });

export const Category: Model<ICategory> =
  models.Category || model<ICategory>('Category', CategorySchema);
