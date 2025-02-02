import { FetchWrapper, fetchWrapper } from '@/lib/fetchWrapper';
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { useAuth } from '@/lib/useAuth';

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
  const cookiesStore = await cookies();
  const fetchWrapper = new FetchWrapper({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    accessToken: cookiesStore.get('access_token')?.value,
  });

  return await fetchWrapper.get('/dishes');
};
