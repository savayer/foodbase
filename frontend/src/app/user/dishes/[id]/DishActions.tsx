'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DeleteDishButton from '@/app/user/dishes/[id]/DeleteDishButton';
import { Dish } from '@/actions/dishes';
import { useAuth } from '@/lib/useAuth';

type Props = {
  dish: Dish;
};

export default function DishActions({ dish }: Props) {
  const { user } = useAuth();

  return (
    dish.user_id === user?._id && (
      <div className="space-x-4">
        <Button variant="outline">
          <Link href={`/user/dishes/${dish._id}/edit`}>Edit</Link>
        </Button>

        <DeleteDishButton id={dish._id} />
      </div>
    )
  );
}
