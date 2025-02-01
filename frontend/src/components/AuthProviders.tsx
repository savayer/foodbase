'use client';

import { ClientSafeProvider, LiteralUnion, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { BuiltInProviderType } from 'next-auth/providers/index';
import GoogleIcon from '@/components/icons/Google';

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export default function AuthProviders({ providers }: Props) {
  return (
    providers &&
    Object.values(providers).map((provider) => (
      <div key={provider.name}>
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full"
          onClick={() => signIn(provider.id)}
        >
          {provider.id === 'google' && <GoogleIcon />}
          Sign in with {provider.name}
        </Button>
      </div>
    ))
  );
}
