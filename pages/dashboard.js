import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getAuthToken, getUserId } from '../lib/auth';
import Link from 'next/link';

function DashboardPage() {
  const [invoices, setInvoices] = useState([]);
  const [crmLogs, setCrmLogs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContractor, setIsContractor] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const authToken = getAuthToken();
      const currentUserId = getUserId();

      if (!authToken || !currentUserId) {
        setError('Authentication required to view dashboard.');
        setLoading(false);
        return;
      }

      // Conceptual check for contractor role
      setIsContractor(currentUserId.startsWith('ip_user_mock1')); // Example: user 'ip_user_mock1' is a contractor

      const headers = {
        'Authorization': `Bearer ${authToken}`,
      };

      try {
        const [invoicesRes, crmLogsRes, ticketsRes] = await Promise.all([
          fetch('/api/billing/invoices', { headers }),
          fetch('/api/crm/logs', { headers }),
          fetch('/api/support/tickets', { headers }),
        ]);

        if (!invoicesRes.ok) throw new Error(`Error fetching invoices: ${invoicesRes.statusText}`);
        if (!crmLogsRes.ok) throw new Error(`Error fetching CRM logs: ${crmLogsRes.statusText}`);
        if (!ticketsRes.ok) throw new Error(`Error fetching tickets: ${ticketsRes.statusText}`);

        const invoicesData = await invoicesRes.json();
        const crmLogsData = await crmLogsRes.json();
        const ticketsData = await ticketsRes.json();

        setInvoices(invoicesData);
        setCrmLogs(crmLogsData);
        setTickets(ticketsData);

      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backgroundPrimary text-textPrimary">
        <p className="text-textSecondary text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backgroundPrimary text-textPrimary">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backgroundPrimary py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Head>
        <title>Dashboard - Contract Services</title>
      </Head>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-textPrimary text-center mb-8">
          Welcome to your Dashboard!
        </h2>

        {isContractor && (
          <div className="text-center mb-8 flex justify-center space-x-4">
            <Link href="/post-service">
              <p className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Post a New Service
              </p>
            </Link>
            <Link href="/contractor/upload-forms">
              <p className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Upload Legal Forms
              </p>
            </Link>
            <Link href="/contractor/create-service">
              <p className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Create New Service
              </p>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Invoices Section */}
          <div className="bg-backgroundSecondary shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-textPrimary mb-4">Your Invoices</h3>
            {invoices.length > 0 ? (
              <ul className="space-y-2">
                {invoices.map(invoice => (
                  <li key={invoice.id} className="text-textSecondary">
                    {invoice.id}: {invoice.amount} - {invoice.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-textSecondary">No invoices found.</p>
            )}
          </div>

          {/* CRM Logs Section */}
          <div className="bg-backgroundSecondary shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-textPrimary mb-4">Your CRM Logs</h3>
            {crmLogs.length > 0 ? (
              <ul className="space-y-2">
                {crmLogs.map(log => (
                  <li key={log.id} className="text-textSecondary">
                    {new Date(log.timestamp).toLocaleDateString()}: {log.action}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-textSecondary">No CRM logs found.</p>
            )}
          </div>

          {/* Support Tickets Section */}
          <div className="bg-backgroundSecondary shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold text-textPrimary mb-4">Your Support Tickets</h3>
            {tickets.length > 0 ? (
              <ul className="space-y-2">
                {tickets.map(ticket => (
                  <li key={ticket.id} className="text-textSecondary">
                    {ticket.id}: {ticket.subject} - {ticket.status}
                    {ticket.legalForms && ticket.legalForms.length > 0 && (
                      <ul className="ml-4 mt-1 text-xs text-textSecondary">
                        <strong>Legal Forms:</strong>
                        {ticket.legalForms.map(form => (
                          <li key={form.id}><a href={`#form-${form.id}`} className="text-blue-400 hover:underline">{form.fileName}</a></li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-textSecondary">No support tickets found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
