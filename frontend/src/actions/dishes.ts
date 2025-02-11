'use server';

import { createFetchWrapper } from '@/lib/createFetchWrapper';

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
  const fetchWrapper = await createFetchWrapper(false);

  return await fetchWrapper.get('/dishes/public');
};

export const getDishes = async (): Promise<Dish[]> => {
  const fetchWrapper = await createFetchWrapper(true);

  return await fetchWrapper.get('/dishes');
};

export const createDishAction = async (data): Promise<Dish> => {
  const fetchWrapper = await createFetchWrapper(true);

  return await fetchWrapper.post('/dishes', data);
};
