// hooks/useAuth.ts
import { create } from 'zustand';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { User } from '@/types';

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const getInitialState = () => {
  const token = getCookie('access_token')?.toString() || null;
  const userStr = getCookie('user')?.toString();
  const user = userStr ? JSON.parse(userStr) : null;

  return { token, user };
};

export const useAuth = create<AuthStore>((set) => ({
  ...getInitialState(),
  setAuth: (token, user) => {
    setCookie('access_token', token, {
      maxAge: 60 * 60 * 24 * 30,
    });
    setCookie('user', user, {
      maxAge: 60 * 60 * 24 * 30,
    });
    set({ token, user });
  },
  logout: () => {
    deleteCookie('access_token');
    deleteCookie('user');
    set({ token: null, user: null });
  },
}));
