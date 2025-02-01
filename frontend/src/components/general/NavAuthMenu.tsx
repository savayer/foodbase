'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { CircleUserRoundIcon } from 'lucide-react';
import Link from 'next/link';

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }

  return (
    <>
      <Link href={'/login'} className="flex items-center gap-2">
        <CircleUserRoundIcon className="size-6" />
        Sign in
      </Link>
    </>
  );
}

export default function NavAuthMenu() {
  return <AuthButton />;
}
