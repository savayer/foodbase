import Link from 'next/link';
import RegisterForm from '@/app/register/RegisterForm';
import OrSeparator from '@/components/general/OrSeparator';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function RegisterPage() {
  return (
    <div className="m-auto max-w-lg w-full container">
      <h1 className="text-3xl font-black text-center">Sign up</h1>

      <div className="mt-6">
        <RegisterForm />
      </div>

      <OrSeparator />

      <div className="mt-4">
        <GoogleAuthButton>Sign up with Google</GoogleAuthButton>
      </div>

      <div className="mt-8 text-center">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
