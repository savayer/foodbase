import React from 'react';
import DishForm from '../../DishForm';
import { getDish } from '@/actions/dishes';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const dish = await getDish(params.id);

  return (
    <div className="container mb-auto mt-10">
      <h1 className="text-3xl font-bold">Editing dish</h1>
      <div className="max-w-xl mt-6">
        <DishForm dish={dish} />
      </div>
    </div>
  );
}
