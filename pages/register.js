import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken, getUserId } from '../lib/auth';
import Head from 'next/head';

function RegisterContractorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContractor, setIsContractor] = useState(false); // Conceptual state

  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const userId = getUserId();
    if (token && userId) {
      setIsAuthenticated(true);
      setCurrentUserId(userId);
      // In a real app, you'd check a backend API to see if this userId is already a contractor
      // For this conceptual demo, we'll simulate it.
      // For now, assume a fresh login means they are not yet a contractor.
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
    }
    setLoading(false);
  }, []);

  const handleBecomeContractor = () => {
    // In a real application, this would involve:
    // 1. Sending a request to a backend API to update the user's role to 'contractor'.
    // 2. Potentially collecting more information (e.g., service categories, description).
    // For this conceptual demo, we'll just set a local state.
    if (isAuthenticated) {
      setIsContractor(true);
      // Redirect to a contractor dashboard or service posting page
      // router.push('/contractor-dashboard');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-textPrimary">Loading authentication status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundPrimary flex flex-col items-center justify-center py-10">
      <Head>
        <title>Become a Contractor - Register Your Services</title>
        <meta name="description" content="Register to become a contractor on our platform. Offer your services to clients and manage your contracts." />
      </Head>
      <div className="bg-backgroundSecondary p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-textPrimary mb-6">Become a Contractor</h1>

        {isAuthenticated ? (
          <>
            <p className="text-lg text-textSecondary mb-4">
              You are currently logged in as <span className="font-semibold">{currentUserId}</span>.
            </p>
            {isContractor ? (
              <p className="text-green-600 font-semibold text-xl">
                Congratulations! You are now a contractor.
                <br /> (Conceptual registration complete)
              </p>
            ) : (
              <>
                <p className="text-textSecondary mb-6">
                  Click the button below to register as a contractor and start offering your services.
                </p>
                <button
                  onClick={handleBecomeContractor}
                  className="bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Register as Contractor
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <p className="text-lg text-textSecondary mb-6">
              Please authenticate to register as a contractor.
            </p>
            {/* In a full application, you might have a dedicated login form here or redirect.
                For this demo, we assume authentication happens via the Navbar's AuthButton. */}
            <p className="text-sm text-textSecondary">
              (Use the "Authenticate" button in the navigation bar to log in.)
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterContractorPage;
