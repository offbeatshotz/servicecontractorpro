import '../styles/globals.css';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken, decryptToken, removeAuthToken } from '../lib/auth';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      if (token) {
        const decryptedUserId = decryptToken(token);
        if (decryptedUserId) {
          setIsAuthenticated(true);
          setUserId(decryptedUserId);
        } else {
          removeAuthToken(); // Invalid token, remove it
          setIsAuthenticated(false);
          setUserId(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
      setLoadingAuth(false);
    };

    checkAuth();

    // Listen for route changes to re-check authentication
    const handleRouteChange = () => checkAuth();
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (!loadingAuth && !isAuthenticated && router.pathname !== '/auth-ip') {
      router.push('/auth-ip');
    }
  }, [loadingAuth, isAuthenticated, router.pathname, router]);

  // Optionally, you might want to show a loading spinner while authenticating
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Checking authentication...</p>
      </div>
    );
  }

  // If not authenticated and on a protected route, redirect will handle it.
  // If on /auth-ip or authenticated, render the component.
  return (
    <Layout userId={userId} isAuthenticated={isAuthenticated}> {/* Pass auth status to Layout if needed */}
      <Component {...pageProps} userId={userId} isAuthenticated={isAuthenticated} /> {/* Pass to individual pages */}
    </Layout>
  );
}

export default MyApp;
