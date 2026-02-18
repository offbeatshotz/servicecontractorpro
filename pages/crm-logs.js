import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { getAuthToken } from '../lib/auth';

function CrmLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLogAction, setNewLogAction] = useState('');
  const [newLogDetails, setNewLogDetails] = useState('');
  // const [newLogUser, setNewLogUser] = useState('Admin'); // Default user, now derived from auth
  const [addLogLoading, setAddLogLoading] = useState(false);
  const [addLogMessage, setAddLogMessage] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please authenticate.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/crm/logs', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch CRM logs.');
      console.error('Error fetching CRM logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    setAddLogLoading(true);
    setAddLogMessage(null);
    setError(null);

    if (!newLogAction) {
      setError('Action is required to add a log.');
      setAddLogLoading(false);
      return;
    }

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication token not found. Please authenticate.');
      setAddLogLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/crm/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ action: newLogAction, details: newLogDetails }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add CRM log.');
      }

      setAddLogMessage('CRM log added successfully!');
      setNewLogAction('');
      setNewLogDetails('');
      fetchLogs(); // Refresh logs
    } catch (err) {
      setError(err.message || 'An error occurred while adding the log.');
      console.error('Add log error:', err);
    } finally {
      setAddLogLoading(false);
    }
  };

  const handleExportLogs = async () => {
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
      const response = await fetch('/api/crm/export-logs', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'crm_logs.json';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setExportMessage('CRM logs exported successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred while exporting CRM logs.');
      console.error('Export logs error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>CRM Logs - Contract Services</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          CRM Logs
        </h2>

        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={handleExportLogs}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={exportLoading}
          >
            {exportLoading ? 'Exporting...' : 'Export CRM Logs Data'}
          </button>
        </div>

        {addLogMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{addLogMessage}</span>
          </div>
        )}
        {exportMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{exportMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">Error: {error}</span>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New CRM Log</h3>
          <form onSubmit={handleAddLog} className="space-y-4">
            <div>
              <label htmlFor="logAction" className="block text-sm font-medium text-gray-700">Action</label>
              <input
                type="text"
                id="logAction"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newLogAction}
                onChange={(e) => setNewLogAction(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="logDetails" className="block text-sm font-medium text-gray-700">Details (Optional)</label>
              <textarea
                id="logDetails"
                rows="2"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newLogDetails}
                onChange={(e) => setNewLogDetails(e.target.value)}
              ></textarea>
            </div>
            {/* The user for the log will be derived from the auth token, no need for explicit input */}
            {/*
            <div>
              <label htmlFor="logUser" className="block text-sm font-medium text-gray-700">User</label>
              <input
                type="text"
                id="logUser"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newLogUser}
                onChange={(e) => setNewLogUser(e.target.value)}
                required
              />
            </div>
            */}
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={addLogLoading}
              >
                {addLogLoading ? 'Adding...' : 'Add CRM Log'}
              </button>
            </div>
          </form>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">All CRM Logs</h3>
        {loading && <p className="text-center text-gray-600">Loading CRM logs...</p>}

        {!loading && !error && logs.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {logs.map((log) => (
                <li key={log.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-900">{log.action}</p>
                    <span className="text-sm text-gray-500">By {log.user} at {new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  {log.details && <p className="mt-2 text-sm text-gray-600">Details: {log.details}</p>}
                  <p className="mt-2 text-sm text-gray-600">ID: {log.id}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !loading && !error && <p className="text-center text-gray-600">No CRM logs found.</p>
        )}
      </div>
    </div>
  );
}

export default CrmLogsPage;
