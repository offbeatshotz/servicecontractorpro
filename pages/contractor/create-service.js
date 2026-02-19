import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAuthToken } from '../../lib/auth';

function CreateServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    zip: '',
    price: '',
    estimates: '',
    plan: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication required. Please log in as a contractor.');
      setLoading(false);
      router.push('/register'); // Redirect to login/register
      return;
    }

    try {
      const response = await fetch('/api/contractor/create-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Service created successfully!');
        // Optionally clear form or redirect
        setFormData({
          title: '',
          description: '',
          zip: '',
          price: '',
          estimates: '',
          plan: '',
        });
      } else {
        throw new Error(data.message || 'Failed to create service.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Create service error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-backgroundPrimary">
      <Head>
        <title>Create New Service - Contractor Dashboard</title>
      </Head>
      <div className="max-w-2xl mx-auto bg-backgroundSecondary p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-textPrimary text-center mb-6">Create New Service</h2>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-textSecondary">Service Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-textSecondary">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-textSecondary">Zip Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-textSecondary">Price (USD)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="estimates" className="block text-sm font-medium text-textSecondary">Estimates</label>
            <input
              type="text"
              id="estimates"
              name="estimates"
              value={formData.estimates}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-textSecondary">Plan</label>
            <input
              type="text"
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Creating Service...' : 'Create Service'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateServicePage;
