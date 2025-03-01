'use server';

import { createFetchWrapper } from '@/lib/createFetchWrapper';
import { IngredientItem } from '../../../src/dishes/dish.model';

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
  ingredients: IngredientItem[];
}

export const getPublicDishes = async (): Promise<Dish[]> => {
  const fetchWrapper = await createFetchWrapper(false);

  return await fetchWrapper.get('/dishes/public');
};

export const getDishes = async (): Promise<Dish[]> => {
  const fetchWrapper = await createFetchWrapper(true);

  return await fetchWrapper.get('/dishes');
};

export const getDish = async (id: string): Promise<Dish> => {
  const fetchWrapper = await createFetchWrapper(true);

  return await fetchWrapper.get(`/dishes/${id}`);
};

export const deleteDish = async (id: string): Promise<Dish[]> => {
  const fetchWrapper = await createFetchWrapper(true);

  return await fetchWrapper.delete(`/dishes/${id}`);
};

export const createDishAction = async (data): Promise<Dish> => {
  const fetchWrapper = await createFetchWrapper(true);

  return await fetchWrapper.post('/dishes', data);
};
