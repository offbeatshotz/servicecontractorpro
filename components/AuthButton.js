import { useState } from 'react';
import { saveAuthToken, removeAuthToken } from '../lib/auth';

function AuthButton({ isAuthenticated, userId, onAuthSuccess, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleAuthClick = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch('/api/auth/ip-login');
      const data = await response.json();

      if (response.ok) {
        saveAuthToken(data.authToken);
        onAuthSuccess(data.userId); // Update parent state with new userId
        setMessage('Authentication successful!');
      } else {
        setError(data.message || 'Authentication failed.');
        removeAuthToken();
        onLogout(); // Clear parent auth state
      }
    } catch (err) {
      setError('Network error during authentication.');
      console.error('Authentication error:', err);
      removeAuthToken();
      onLogout(); // Clear parent auth state
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    removeAuthToken();
    onLogout();
    setMessage('Logged out.');
  };

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm">Welcome, {userId}</span>
          <button
            onClick={handleLogoutClick}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleAuthClick}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          {loading ? 'Authenticating...' : 'Authenticate'}
        </button>
      )}
      {message && <p className="text-green-500 text-sm mt-1">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default AuthButton;
