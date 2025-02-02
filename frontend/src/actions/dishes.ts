import { fetchWrapper } from '@/lib/fetchWrapper';

// @todo create swagger and generate types, instead of creating them manually
export interface Dish {
  _id: string;
  name: string;
  description?: string;
  image: string;
  user_id: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  lastCooked?: Date;
  tags?: string[];
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getPublicDishes = async (): Promise<Dish[]> => {
  return await fetchWrapper.get('/dishes/public');
};

export const getDishes = async (): Promise<Dish[]> => {
  return await fetchWrapper.get('/dishes/public');
};
