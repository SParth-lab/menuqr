export type UiCategory = {
  id: string;
  name: string;
  description: string;
  isVisible: boolean;
};

export type UiItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isVisible: boolean;
};
