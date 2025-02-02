'use client';

import GoogleIcon from '@/components/icons/Google';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

export default function GoogleAuthButton({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 w-full"
      onClick={() =>
        (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
      }
    >
      <GoogleIcon className="size-4" />
      {children}
    </Button>
  );
}
