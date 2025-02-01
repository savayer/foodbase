import LoginForm from '@/app/login/LoginForm';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getProviders } from 'next-auth/react';
import { redirect } from 'next/navigation';
import AuthProviders from '@/components/AuthProviders';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  const providers = await getProviders();

  return (
    <div className="m-auto max-w-lg w-full container">
      <h1 className="text-3xl font-black text-center">Sign in</h1>

      <div className="mt-6">
        <LoginForm />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div className="h-px grow bg-neutral-200" />
        or
        <div className="h-px grow bg-neutral-200" />
      </div>

      <div className="mt-4">
        <AuthProviders providers={providers} />
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
