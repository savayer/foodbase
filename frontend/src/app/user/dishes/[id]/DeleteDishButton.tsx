'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { deleteDish } from '@/actions/dishes';

type Props = {
  id: string;
};

export default function DeleteDishButton({ id }: Props) {
  const router = useRouter();

  const deleteDishHandler = useCallback(async () => {
    await deleteDish(id);
    router.push('/user/dishes');
  }, [router, id]);

  return (
    <Button variant="destructive" onClick={deleteDishHandler}>
      Delete
    </Button>
  );
}
