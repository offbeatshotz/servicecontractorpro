import React, { useState } from 'react';
import { getAuthToken } from '../lib/auth';
import { useRouter } from 'next/router';

function FeedbackForm({ service, onClose, onSubmit }) {
  const [score, setScore] = useState(5); // Default to 5 stars
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication required to submit feedback.');
      setLoading(false);
      router.push('/register');
      return;
    }

    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          serviceId: service.id,
          score: parseInt(score),
          comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Feedback submitted successfully!');
        onSubmit(data.feedback); // Pass the new feedback data up
        onClose(); // Close the form after successful submission
      } else {
        throw new Error(data.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting feedback.');
      console.error('Feedback submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-backgroundSecondary p-8 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-textSecondary hover:text-textPrimary text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-textPrimary mb-4">Leave Feedback for {service.title}</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="score" className="block text-sm font-medium text-textSecondary">Score (1-5)</label>
            <select
              id="score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-textSecondary">Comment</label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
