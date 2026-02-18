import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';

function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (zipCode) params.append('zipCode', zipCode);

      const response = await fetch(`/api/services/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError('Failed to fetch services.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, zipCode]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Services - Contract Services</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Available Services
        </h2>

        <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search services..."
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Zip Code..."
            className="w-full sm:w-auto p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        {loading && <p className="text-center text-gray-600">Loading services...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <p className="text-sm text-gray-600"><strong>Contractor:</strong> {service.contractor}</p>
                <p className="text-sm text-gray-600"><strong>Zip Code:</strong> {service.zip}</p>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Contact Contractor
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && <p className="text-center text-gray-600 col-span-full">No services found matching your criteria.</p>
        )}      </div>
    </div>
  );
}

export default ServicesPage;
