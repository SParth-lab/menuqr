import { Schema, model, models, type Model, type Types } from 'mongoose';
import { VIEW_SOURCES, type ViewSource } from '@/types';

export interface IPageView {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  day: string; // YYYY-MM-DD, so rollups group without date arithmetic
  source: ViewSource;
  itemId?: Types.ObjectId;
  createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  day: { type: String, required: true },
  source: { type: String, enum: VIEW_SOURCES, default: 'DIRECT' },
  itemId: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
  createdAt: { type: Date, default: Date.now },
});

PageViewSchema.index({ restaurantId: 1, day: 1 });
// Raw events are only needed for the popular-items breakdown; rollups are permanent.
PageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const PageView: Model<IPageView> =
  models.PageView || model<IPageView>('PageView', PageViewSchema);
