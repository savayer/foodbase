'use client';

import { CircleUserRoundIcon } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NavAuthMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <CircleUserRoundIcon className="size-6" />
        <span>{user?.name || ''}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push('/user/profile')}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            logout();
            router.push('/');
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href={'/login'} className="flex items-center gap-2">
      <CircleUserRoundIcon className="size-6" />
      Sign in
    </Link>
  );
}
