import { getDish } from '@/actions/dishes';
import { notFound } from 'next/navigation';
import DishActions from '@/app/user/dishes/[id]/DishActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DishPage({ params }: PageProps) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  return (
    <main className="container mb-auto mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">{dish.name}</h1>

        <DishActions dish={dish} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-10">
        <div>
          <img
            src={dish.image}
            className="w-full h-[500px] object-cover rounded"
            alt={dish.name}
            width={500}
            height={500}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-600">{dish.description}</p>

          {dish.ingredients && dish.ingredients.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mt-8 mb-4">Ingredients</h2>
              <ul className="list-disc list-inside">
                {dish.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name}
                    {ingredient.amount && ` - ${ingredient.amount}`}
                    {ingredient.unit && ` ${ingredient.unit}`}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/*<div className="mt-8">
            <p className="text-sm text-gray-500">
              Last cooked:{' '}
              {dish.lastCooked
                ? new Date(dish.lastCooked).toLocaleDateString()
                : 'Never'}
            </p>

            {dish.tags && (
              <div className="mt-2 flex gap-2">
                {dish.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>*/}
        </div>
      </div>
    </main>
  );
}
