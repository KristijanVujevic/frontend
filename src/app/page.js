import Image from "next/image";
function getRandomInt() {
  return Math.floor(Math.random() * (500 - 1 + 1)) + 1;
}
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <section className="row-start-1 flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold">Welcome to Our Shop</h1>
          <p className="text-lg text-center max-w-2xl">
            Discover our exclusive collection of items. We offer a variety of
            products to suit your needs. Browse through our featured items
            below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border p-4 rounded-lg shadow-lg">
              <Image
                src={`https://picsum.photos/id/${getRandomInt()}/600/400`}
                alt="Featured Item 1"
                width={300}
                height={200}
                className="rounded"
              />
              <h2 className="text-xl font-semibold mt-4">Featured Item 1</h2>
              <p className="text-sm mt-2">
                Description of the featured item 1.
              </p>
            </div>
            <div className="border p-4 rounded-lg shadow-lg">
              <Image
                src={`https://picsum.photos/id/${getRandomInt()}/600/400`}
                alt="Featured Item 2"
                width={300}
                height={200}
                className="rounded"
              />
              <h2 className="text-xl font-semibold mt-4">Featured Item 2</h2>
              <p className="text-sm mt-2">
                Description of the featured item 2.
              </p>
            </div>
            <div className="border p-4 rounded-lg shadow-lg">
              <Image
                src={`https://picsum.photos/id/${getRandomInt()}/600/400`}
                alt="Featured Item 3"
                width={300}
                height={200}
                className="rounded"
              />
              <h2 className="text-xl font-semibold mt-4">Featured Item 3</h2>
              <p className="text-sm mt-2">
                Description of the featured item 3.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
