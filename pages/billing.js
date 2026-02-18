import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '../lib/auth';

function BillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [exportMessage, setExportMessage] = useState(null);
  const [savingLoading, setSavingLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please authenticate.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/billing/invoices', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices.');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handlePayInvoice = async (invoiceId, amount) => {
    setPaymentMessage(null);
    setError(null);
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please authenticate.');
      return;
    }
    try {
      const response = await fetch('/api/billing/payments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ invoiceId, amount, paymentMethod: 'Credit Card' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed.');
      }

      const data = await response.json();
      setPaymentMessage(`Payment successful for Invoice ${invoiceId}! Transaction ID: ${data.transactionId}`);
      fetchInvoices();
    } catch (err) {
      setError(err.message || 'An error occurred during payment.');
      console.error('Payment error:', err);
    }
  };

  const handleSaveInvoices = async () => {
    setSavingLoading(true);
    setSaveMessage(null);
    setError(null);
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please authenticate.');
      setSavingLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/billing/invoices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(invoices), // Sending the whole array for simplicity
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save invoices.');
      }

      setSaveMessage('Invoices saved successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred while saving invoices.');
      console.error('Save invoices error:', err);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleExportInvoices = async () => {
    setExportLoading(true);
    setExportMessage(null);
    setError(null);
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please authenticate.');
      setExportLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/billing/export-invoices', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Assuming JSON for simulation

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'invoices.json';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setExportMessage('Invoices exported successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred while exporting invoices.');
      console.error('Export invoices error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Billing - Contract Services</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Billing & Invoices
        </h2>

        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={handleSaveInvoices}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={savingLoading}
          >
            {savingLoading ? 'Saving...' : 'Save Current Invoices'}
          </button>
          <button
            onClick={handleExportInvoices}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export Invoices Data'}
          </button>
        </div>

        {saveMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{saveMessage}</span>
          </div>
        )}
        {exportMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{exportMessage}</span>
          </div>
        )}

        {paymentMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{paymentMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">Error: {error}</span>
          </div>
        )}

        {loading && <p className="text-center text-gray-600">Loading invoices...</p>}

        {!loading && !error && invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contractor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Service ID: {invoice.serviceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.contractor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {invoice.status === 'Pending' && (
                        <button
                          onClick={() => handlePayInvoice(invoice.id, invoice.amount)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && !error && <p className="text-center text-gray-600">No invoices found.</p>
        )}
      </div>
    </div>
  );
}

export default BillingPage;
