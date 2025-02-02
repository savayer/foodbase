import LoginForm from '@/app/login/LoginForm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import OrSeparator from '@/components/general/OrSeparator';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (token) {
    redirect('/');
  }

  return (
    <div className="m-auto max-w-lg w-full container">
      <h1 className="text-3xl font-black text-center">Sign in</h1>

      <div className="mt-6">
        <LoginForm />
      </div>

      <OrSeparator />

      <div className="mt-4">
        <GoogleAuthButton>Sign in with Google</GoogleAuthButton>
      </div>

      <div className="mt-8 text-center">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
