import React from 'react';
import DishForm from '../../DishForm';
import { getDish } from '@/actions/dishes';
import { cookies } from 'next/headers';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get('user')?.value || '{}');
  const dish = await getDish(params.id);

  /*  if (dish.user_id !== user._id) {
    return (
      <div className="flex m-auto mb-auto">
        <b className="text-3xl font-bold text-center">
          You can only edit your own dishes
        </b>
      </div>
    );
  }*/

  return (
    <div className="container mb-auto mt-10">
      <h1 className="text-3xl font-bold">Editing dish</h1>
      <div className="max-w-xl mt-6">
        <DishForm dish={dish} />
      </div>
    </div>
  );
}
