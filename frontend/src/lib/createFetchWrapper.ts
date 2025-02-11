import { cookies } from 'next/headers';
import { FetchWrapper } from './fetchWrapper';

export async function createFetchWrapper(requiresAuth = false) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  return new FetchWrapper({
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
    accessToken: requiresAuth ? accessToken : undefined,
  });
}
