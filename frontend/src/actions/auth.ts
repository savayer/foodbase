import { User } from '@/types';
import { fetchWrapper } from '@/lib/fetchWrapper';

interface LoginResponse {
  access_token: string;
  user: User;
}

interface LoginPayload {
  email: string;
  password: string;
  [key: string]: unknown;
}

export const loginAction = async (
  data: LoginPayload,
): Promise<LoginResponse> => {
  return await fetchWrapper.post('/auth/login', data);
};

interface RegisterResponse {
  name: string;
  email: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

export const registerAction = async (
  data: RegisterPayload,
): Promise<RegisterResponse> => {
  return await fetchWrapper.post('/auth/register', data);
};
