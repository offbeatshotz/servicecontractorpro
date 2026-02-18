import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';

function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [postMessage, setPostMessage] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/support/tickets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch tickets.');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setPostMessage(null);
    setError(null);

    if (!newTicketSubject || !newTicketDescription) {
      setError('Subject and description are required for a new ticket.');
      return;
    }

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: newTicketSubject, description: newTicketDescription, userId: 'current_user_id' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create ticket.');
      }

      setPostMessage('Support ticket created successfully!');
      setNewTicketSubject('');
      setNewTicketDescription('');
      fetchTickets(); // Refresh the list of tickets
    } catch (err) {
      setError(err.message || 'An error occurred while creating the ticket.');
      console.error('Create ticket error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Support - Contract Services</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Customer Support
        </h2>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label htmlFor="ticketSubject" className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                id="ticketSubject"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ticketDescription" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="ticketDescription"
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newTicketDescription}
                onChange={(e) => setNewTicketDescription(e.target.value)}
                required
              ></textarea>
            </div>
            {postMessage && <p className="text-green-600 text-sm">{postMessage}</p>}
            {error && <p className="text-red-500 text-sm">Error: {error}</p>}
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Tickets</h3>
        {loading && <p className="text-center text-gray-600">Loading tickets...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && tickets.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <li key={ticket.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">{ticket.subject}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>ID: {ticket.id}</p>
                    <p>Created: {ticket.createdAt}</p>
                  </div>
                  {/* More details could be added here, possibly a link to a detail page */}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && !error && <p className="text-center text-gray-600">No support tickets found.</p>
        )}
      </div>
    </div>
  );
}

export default SupportPage;
