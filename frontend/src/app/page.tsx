import { getPublicDishes } from '@/actions/dishes';
import Link from 'next/link';

export default async function Home() {
  const dishes = await getPublicDishes();

  return (
    <main className="mb-auto">
      <section className="container mt-10 grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
        {dishes.map((dish) => (
          <div key={dish._id}>
            <Link href={`/user/dishes/${dish._id}`}>
              <img
                src={dish.image}
                className="w-full h-80 object-cover rounded"
                alt={dish.name}
                width={320}
                height={320}
              />

              <h3 className="text-2xl font-bold mt-3">{dish.name}</h3>
              <p className="truncate">{dish.description}</p>
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
