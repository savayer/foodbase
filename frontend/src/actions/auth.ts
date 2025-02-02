import { FetchWrapper } from '@/lib/fetchWrapper';
import { User } from '@/types';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_API_URL);

interface LoginResponse {
  access_token: string;
  user: User;
}

export const loginAction = async (data): Promise<LoginResponse> => {
  return await fetchWrapper.post('/auth/login', data);
};
