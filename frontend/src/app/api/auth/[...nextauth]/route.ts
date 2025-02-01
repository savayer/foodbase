import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FetchWrapper } from '@/lib/fetchWrapper';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_API_URL);
        const response = await fetchWrapper.post('/auth/google/login', user);

        if (account) {
          account.backendTokens = response?.access_token;
        }

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
