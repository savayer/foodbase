import React from 'react';
import DishForm from './DishForm';

export default function Page() {
  return (
    <div className="container mb-auto mt-10">
      <h1 className="text-3xl font-bold">Creating dish</h1>
      <div className="max-w-xl mt-6">
        <DishForm />
      </div>
    </div>
  );
}
