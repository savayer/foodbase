import LoginForm from '@/app/login/LoginForm';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import OrSeparator from '@/components/general/OrSeparator';
import Link from 'next/link';

export default function LoginPage() {
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
