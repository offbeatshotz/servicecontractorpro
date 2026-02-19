import '../styles/globals.css';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken, decryptToken, saveAuthToken, removeAuthToken } from '../lib/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const authenticateUser = async () => {
      setLoadingAuth(true);
      let token = getAuthToken();
      let currentUserId = null;

      if (token) {
        currentUserId = decryptToken(token);
        if (!currentUserId) {
          removeAuthToken(); // Invalid token, remove it
          token = null; // Force re-authentication
        }
      }

      if (!token) {
        // Attempt automatic IP-based login
        try {
          const response = await fetch('/api/auth/ip-login');
          const data = await response.json();

          if (response.ok) {
            saveAuthToken(data.authToken);
            currentUserId = data.userId;
            console.log('Automatic IP-based authentication successful.');
          } else {
            console.error('Automatic IP-based authentication failed:', data.message);
            removeAuthToken();
          }
        } catch (err) {
          console.error('Network error during automatic IP-based authentication:', err);
          removeAuthToken();
        }
      }

      if (currentUserId) {
        setIsAuthenticated(true);
        setUserId(currentUserId);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
      setLoadingAuth(false);
    };

    authenticateUser();

  }, []); // Run only once on mount

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Setting up your session...</p>
      </div>
    );
  }

  return (
    <Layout userId={userId} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setUserId={setUserId}> {/* Pass auth status to Layout if needed */}
      <Component {...pageProps} userId={userId} isAuthenticated={isAuthenticated} /> {/* Pass to individual pages */}
    </Layout>
  );
}

export default MyApp;