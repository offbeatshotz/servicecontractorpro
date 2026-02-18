import Head from 'next/head';

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Dashboard - Contract Services</title>
      </Head>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Welcome to your Dashboard!
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          This is a protected route, accessible only to authenticated users.
        </p>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
}

export default DashboardPage;
