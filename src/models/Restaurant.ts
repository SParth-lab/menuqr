import { Schema, model, models, type Model, type Types } from 'mongoose';
import { RESTAURANT_STATUSES, type RestaurantStatus, type ThemeConfig } from '@/types';

export interface IRestaurant {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  address?: string;
  city?: string;
  citySlug?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  currency: string;
  socials: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
  openingHours?: string;
  status: RestaurantStatus;
  rejectionReason?: string;
  seoTitle?: string;
  seoDescription?: string;
  design: { templateKey: string; isCustom: boolean; config: Partial<ThemeConfig> };
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: String,
    description: String,
    logoUrl: String,
    coverUrl: String,
    address: String,
    city: { type: String, trim: true },
    citySlug: { type: String, lowercase: true, trim: true },
    state: String,
    country: String,
    phone: String,
    email: String,
    currency: { type: String, default: 'INR' },
    socials: {
      website: String,
      instagram: String,
      facebook: String,
      twitter: String,
      youtube: String,
      whatsapp: String,
    },
    openingHours: String,
    status: { type: String, enum: RESTAURANT_STATUSES, default: 'PENDING', index: true },
    rejectionReason: String,
    seoTitle: String,
    seoDescription: String,
    design: {
      templateKey: { type: String, default: 'modern' },
      isCustom: { type: Boolean, default: false },
      config: { type: Schema.Types.Mixed, default: {} },
    },
  },
  { timestamps: true }
);

// Drives /city/[city] listings, which only ever ask for approved restaurants.
RestaurantSchema.index({ citySlug: 1, status: 1 });

export const Restaurant: Model<IRestaurant> =
  models.Restaurant || model<IRestaurant>('Restaurant', RestaurantSchema);
