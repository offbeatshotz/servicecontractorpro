import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthToken, getUserId } from '../../../lib/auth';

function UploadLegalFormsPage() {
  const [fileName, setFileName] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isContractor, setIsContractor] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const userId = getUserId();

    if (token && userId) {
      setIsAuthenticated(true);
      // Conceptual check: only 'ip_user_mock1' is a contractor
      if (userId.startsWith('ip_user_mock1')) {
        setIsContractor(true);
      } else {
        setError('Access Denied: Only contractors can upload legal forms.');
        router.push('/dashboard'); // Redirect non-contractors
      }
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
      const response = await fetch('/api/contractor/upload-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fileName,
          ticketId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Legal form uploaded successfully!');
        setFileName('');
        setTicketId('');
      } else {
        throw new Error(data.message || 'Failed to upload legal form.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while uploading the legal form.');
      console.error('Upload legal form error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isContractor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-textPrimary">Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundPrimary flex flex-col items-center py-10">
      <Head>
        <title>Upload Legal Forms</title>
        <meta name="description" content="Contractor legal form upload for services." />
      </Head>
      <div className="bg-backgroundSecondary p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-textPrimary mb-6 text-center">Upload Legal Forms</h1>

        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-textSecondary">File Name (e.g., ServiceAgreement.pdf)</label>
            <input
              type="text"
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="ticketId" className="block text-sm font-medium text-textSecondary">Associate with Ticket ID (e.g., TKT001)</label>
            <input
              type="text"
              id="ticketId"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? 'Uploading Form...' : 'Upload Form'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadLegalFormsPage;
