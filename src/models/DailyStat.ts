import { Schema, model, models, type Model, type Types } from 'mongoose';

export interface IDailyStat {
  _id: Types.ObjectId;
  restaurantId: Types.ObjectId;
  day: string;
  views: number;
  qrScans: number;
}

const DailyStatSchema = new Schema<IDailyStat>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    day: { type: String, required: true },
    views: { type: Number, default: 0 },
    qrScans: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DailyStatSchema.index({ restaurantId: 1, day: 1 }, { unique: true });

export const DailyStat: Model<IDailyStat> =
  models.DailyStat || model<IDailyStat>('DailyStat', DailyStatSchema);
