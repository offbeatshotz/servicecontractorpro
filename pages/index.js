import Head from 'next/head';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Contract Services - Find and Offer Professional Services</title>
        <meta name="description" content="Discover a wide range of contract services, find skilled contractors, or become a contractor and offer your services to clients." />
      </Head>
      <h1 className="text-5xl font-bold text-blue-600">
        Welcome to <span className="text-green-500">Contract Services</span> Web Page
      </h1>

      <p className="mt-3 text-2xl">
        Find the best contractors for your needs.
      </p>

      <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
        <a
          href="/services"
          className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
        >
          <h3 className="text-2xl font-bold">Browse Services &rarr;</h3>
          <p className="mt-4 text-xl">
            Discover a wide range of contract services available near you.
          </p>
        </a>

        <a
          href="/register"
          className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
        >
          <h3 className="text-2xl font-bold">Become a Contractor &rarr;</h3>
          <p className="mt-4 text-xl">
            Join our platform and offer your services to clients.
          </p>
        </a>
      </div>
    </div>
  );
}

export default Home;
