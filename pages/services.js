
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import ContactForm from '../components/ContactForm'; // Import the new ContactForm component

function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [geolocationError, setGeolocationError] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false); // State to control form visibility
  const [selectedServiceForContact, setSelectedServiceForContact] = useState(null); // State to hold service for contact
  const [trackedContractors, setTrackedContractors] = useState([]); // State to hold tracked contractors

  useEffect(() => {
    const storedTracked = localStorage.getItem('trackedContractors');
    if (storedTracked) {
      setTrackedContractors(JSON.parse(storedTracked));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('trackedContractors', JSON.stringify(trackedContractors));
  }, [trackedContractors]);

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

  const handleGeolocation = () => {
    setGeolocationLoading(true);
    setGeolocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocationLoading(false);
          // Next step: integrate reverse geocoding API to convert these coords to zip code
          console.log('Latitude:', position.coords.latitude, 'Longitude:', position.coords.longitude);
          // Integrate reverse geocoding API
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(response => response.json())
            .then(data => {
              const postcode = data.address.postcode;
              if (postcode) {
                setZipCode(postcode); // Update the zipCode state
                alert(`Found your zip code: ${postcode}. Searching services...`);
              } else {
                setGeolocationError('Could not find zip code for your location.');
                alert('Could not find zip code for your location.');
              }
            })
            .catch(error => {
              setGeolocationError('Failed to reverse geocode location.');
              console.error('Reverse geocoding error:', error);
              alert('Failed to reverse geocode location.');
            })
            .finally(() => {
              setGeolocationLoading(false);
            });
        },
        (error) => {
          setGeolocationLoading(false);
          setGeolocationError(error.message);
          console.error('Geolocation error:', error);
          alert(`Geolocation failed: ${error.message}`);
        }
      );
    } else {
      setGeolocationLoading(false);
      setGeolocationError('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleContactClick = (service) => {
    setSelectedServiceForContact(service);
    setShowContactForm(true);
  };

  const handleContactFormClose = () => {
    setShowContactForm(false);
    setSelectedServiceForContact(null);
  };

  const handleContactFormSubmit = (formData) => {
    console.log('Contact form submitted:', formData);
    // Here you would typically make an API call to send the message
    handleContactFormClose();
  };

  const handleTrackToggle = (service) => {
    setTrackedContractors((prevTracked) => {
      const isCurrentlyTracked = prevTracked.some(tc => tc.userId === service.userId);
      if (isCurrentlyTracked) {
        return prevTracked.filter(tc => tc.userId !== service.userId);
      } else {
        return [...prevTracked, { userId: service.userId, zip: service.zip }];
      }
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Services - Contract Services</title>
        <meta name="description" content="Browse available contract services. Find plumbers, electricians, gardeners, web developers, and more in your area." />
      </Head>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-textPrimary text-center mb-8">
          Available Services
        </h2>

        <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
          <input
            type="text"
            placeholder="Enter your Zip Code..."
            className="w-full sm:w-auto p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          {/* A conceptual button for geolocation */}
          <button
            onClick={handleGeolocation}
            className="w-full sm:w-auto py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            disabled={geolocationLoading}
          >
            {geolocationLoading ? 'Getting Location...' : 'Use My Current Location'}
          </button>
          <input
            type="text"
            placeholder="Search services by keyword..."
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {geolocationError && (
          <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">Geolocation Error: {geolocationError}</span>
          </div>
        )}

        {loading && <p className="text-center text-textSecondary">Loading services...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {!loading && !error && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => {
              const isContractorTracked = trackedContractors.some(tc => tc.userId === service.userId);
              let competitorRate = null;

              if (isContractorTracked) {
                const competitors = services.filter(compService =>
                  compService.zip === service.zip &&
                  compService.userId !== service.userId &&
                  compService.price // Ensure price exists
                );

                if (competitors.length > 0) {
                  const totalCompetitorPrice = competitors.reduce((sum, compService) => sum + compService.price, 0);
                  competitorRate = (totalCompetitorPrice / competitors.length).toFixed(2);
                }
              }

              return (
              <div key={service.id} className="bg-backgroundSecondary rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-textPrimary mb-2">{service.title}</h3>
                <p className="text-textSecondary mb-4">{service.description}</p>

                <p className="text-sm text-textSecondary"><strong>Zip Code:</strong> {service.zip}</p>
                <p className="text-sm text-textSecondary"><strong>Base Price:</strong> ${service.price ? service.price.toFixed(2) : 'N/A'}</p>
                <p className="text-sm text-textSecondary"><strong>Estimated Price (Local):</strong> ${service.estimatedPrice ? service.estimatedPrice.toFixed(2) : 'N/A'}</p>
                <p className="text-sm text-textSecondary"><strong>Estimates:</strong> {service.estimates || 'N/A'}</p>
                <p className="text-sm text-textSecondary"><strong>Plan:</strong> {service.plan || 'N/A'}</p>
                {service.contractor && <p className="text-sm text-textSecondary"><strong>Contractor:</strong> {service.contractor}</p>}

                {isContractorTracked && competitorRate && (
                  <p className="text-sm text-green-600 font-semibold">Avg. Competitor Rate (Same Zip): ${competitorRate}</p>
                )}
                {isContractorTracked && !competitorRate && (
                  <p className="text-sm text-yellow-600">No direct competitors found in this zip for tracking.</p>
                )}
                <button
                  onClick={() => handleContactClick(service)} // Updated onClick handler
                  className="mt-4 w-full bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Contact Contractor
                </button>
                <button
                  onClick={() => handleTrackToggle(service)}
                  className={`mt-2 w-full ${isContractorTracked ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                >
                  {isContractorTracked ? 'Untrack Contractor' : 'Track Contractor'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && <p className="text-center text-textSecondary col-span-full">No services found matching your criteria.</p>
        )}
      </div>

      {/* Render the ContactForm conditionally */}
      {showContactForm && selectedServiceForContact && (
        <ContactForm
          service={selectedServiceForContact}
          onClose={handleContactFormClose}
          onSubmit={handleContactFormSubmit}
        />
      )}
    </div>
  );
}

export default ServicesPage;
