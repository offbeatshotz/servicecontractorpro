// pages/auth-ip.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { saveAuthToken, removeAuthToken } from '../lib/auth';

function AuthIpPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const authenticateWithIp = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/auth/ip-login');
        const data = await response.json();

        if (response.ok) {
          saveAuthToken(data.authToken);
          console.log('Authentication successful (IP-based):', data.userId);
          router.push('/dashboard'); // Redirect to dashboard or home
        } else {
          removeAuthToken(); // Ensure no stale token on failure
          setError(data.message || 'IP-based authentication failed.');
        }
      } catch (err) {
        removeAuthToken();
        setError('Network error or server issue during authentication.');
        console.error('IP-based authentication error:', err);
      } finally {
        setLoading(false);
      }
    };

    authenticateWithIp();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Authenticating via IP...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-red-600 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => router.reload()} // Allow user to retry
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry Authentication
        </button>
      </div>
    );
  }

  return null; // Should redirect before this renders for long
}

export default AuthIpPage;
