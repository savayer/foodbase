import { getDishes } from '@/actions/dishes';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DishesPage() {
  const userDishes = await getDishes();

  return (
    <main className="container mb-auto mt-10">
      <section>
        <div className="flex justify-between">
          <h1 className="text-3xl font-black">My dishes</h1>

          <Button variant="default" className="font-bold">
            <Link href="/dishes/create">Create dish</Link>
          </Button>
        </div>

        <div className="mt-6">
          {userDishes.map((dish) => (
            <div key={dish._id}>
              <img
                src={dish.image}
                className="size-80 object-cover rounded"
                alt={dish.name}
                width={320}
                height={320}
              />

              <h3 className="text-2xl font-bold mt-1">{dish.name}</h3>
              <p>{dish.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
