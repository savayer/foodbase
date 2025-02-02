import { fetchWrapper } from '@/lib/fetchWrapper';
import { getPublicDishes } from '@/actions/dishes';

export default async function Home() {
  const dishes = await getPublicDishes();

  return (
    <main className="mb-auto">
      <section className="container mt-10">
        {dishes.map((dish) => (
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
      </section>
    </main>
  );
}
