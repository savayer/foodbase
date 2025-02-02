'use client';

import GoogleIcon from '@/components/icons/Google';
import { Button } from '@/components/ui/button';

export default function GoogleAuthButton() {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 w-full"
      onClick={() =>
        (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
      }
    >
      <GoogleIcon className="size-4" />
      Sign in with Google
    </Button>
  );
}
