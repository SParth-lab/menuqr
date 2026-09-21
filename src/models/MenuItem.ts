import { Schema, model, models, type Model, type Types } from 'mongoose';

export interface IMenuItem {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    // Denormalised from the category so every owner query scopes on one indexed
    // field, and tenant isolation is a single filter rather than a join.
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    imageUrl: String,
    isVeg: { type: Boolean, default: true },
    isSpicy: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MenuItemSchema.index({ restaurantId: 1, categoryId: 1, sortOrder: 1 });

export const MenuItem: Model<IMenuItem> =
  models.MenuItem || model<IMenuItem>('MenuItem', MenuItemSchema);
