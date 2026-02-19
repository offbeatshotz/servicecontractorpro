import { useState } from 'react';
import { getAuthToken } from '../lib/auth';

function ContactForm({ service, onClose, onSubmit }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    const authToken = getAuthToken();
    if (!authToken) {
      setSubmitStatus('error');
      console.error('Authentication token not found. Cannot send message.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact/contractor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ serviceId: service.id, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        onSubmit({ serviceId: service.id, message });
        setMessage('');
        setTimeout(onClose, 2000);
      } else {
        throw new Error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Contact form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-backgroundSecondary p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-textSecondary hover:text-textPrimary text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-textPrimary mb-4">Contact for {service.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceCategory" className="block text-sm font-medium text-textSecondary">
              Service Category
            </label>
            <input
              type="text"
              id="serviceCategory"
              value={service.title}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-textSecondary"
            />
          </div>

          <div>
            <label htmlFor="contractor" className="block text-sm font-medium text-textSecondary">
              Contractor (Conceptual)
            </label>
            <input
              type="text"
              id="contractor"
              value={`For service: ${service.title}`}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-textSecondary"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-textSecondary">
              Your Message
            </label>
            <textarea
              id="message"
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'success' && (
            <p className="text-center text-primary mt-2">Message sent successfully!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-center text-red-600 mt-2">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
