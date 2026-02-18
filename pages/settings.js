import Head from 'next/head';
import { useState, useEffect } from 'react';

function SettingsPage() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userRole, setUserRole] = useState('client'); // Simulate user role
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching user settings
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setUserName('Jane Doe');
      setUserEmail('jane.doe@example.com');
      setNotificationsEnabled(true);
      setUserRole('contractor'); // Example role
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Simulate API call to update settings
    try {
      console.log('Saving settings:', { userName, userEmail, notificationsEnabled });
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      setMessage('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Settings - Contract Services</title>
      </Head>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          User Settings
        </h2>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">Error: {error}</span>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading settings...</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSaveSettings}>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                id="userName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="userEmail"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                value={userEmail}
                disabled // Email is often not directly editable here
              />
            </div>

            <div className="flex items-center">
              <input
                id="notificationsEnabled"
                name="notificationsEnabled"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
              <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-900">
                Enable email notifications
              </label>
            </div>

            {/* Conceptual Account Restrictions based on role */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Account Status & Restrictions</h4>
              <p className="mt-2 text-sm text-gray-600">
                Your current role: <span className="font-semibold capitalize">{userRole}</span>
              </p>
              {userRole === 'contractor' && (
                <p className="mt-1 text-sm text-gray-500">
                  As a contractor, you can post services and receive payment requests.
                </p>
              )}
              {userRole === 'client' && (
                <p className="mt-1 text-sm text-gray-500">
                  As a client, you can browse services and contact contractors.
                </p>
              )}
              {userRole === 'admin' && (
                <p className="mt-1 text-sm text-gray-500">
                  As an administrator, you have full access to all platform features and management tools.
                </p>
              )}
              <p className="mt-3 text-sm text-blue-600">
                (In a real application, certain settings or features would be enabled/disabled based on this role.)
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
