import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthToken } from '../lib/auth';

function PostServicePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [estimates, setEstimates] = useState('');
  const [plan, setPlan] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push('/register'); // Redirect to register/login if not authenticated
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please authenticate.');
      setLoading(false);
      router.push('/register');
      return;
    }

    try {
      const response = await fetch('/api/services/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          price,
          estimates,
          plan,
          zipCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Service posted successfully!');
        // Clear form
        setTitle('');
        setDescription('');
        setPrice('');
        setEstimates('');
        setPlan('');
        setZipCode('');
        // Optionally redirect or show success state
      } else {
        throw new Error(data.message || 'Failed to post service.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while posting the service.');
      console.error('Post service error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-textPrimary">Redirecting for authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundPrimary flex flex-col items-center py-10">
      <Head>
        <title>Post a New Service</title>
        <meta name="description" content="Post your professional services to reach a wider client base. Add details about pricing, estimates, and service plans." />
      </Head>
      <div className="bg-backgroundSecondary p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-textPrimary mb-6 text-center">Post a New Service</h1>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-textSecondary">Service Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-textSecondary">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-textSecondary">Base Price (e.g., 100.00)</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="estimates" className="block text-sm font-medium text-textSecondary">Estimates (e.g., 'Free consultation', 'Hourly rate')</label>
            <input
              type="text"
              id="estimates"
              value={estimates}
              onChange={(e) => setEstimates(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-textSecondary">Service Plan/Offerings</label>
            <input
              type="text"
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-textSecondary">Service Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              maxLength="5"
              pattern="^\d{5}$"
              title="Five digit zip code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? 'Posting Service...' : 'Post Service'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostServicePage;
