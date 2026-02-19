import { getUserIdFromRequest } from '../../../lib/auth';
import { allServices, allFeedback } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    const { serviceId, score, comment } = req.body;

    if (!serviceId || score === undefined || score === null || !comment) {
      return res.status(400).json({ message: 'Service ID, score, and comment are required.' });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Score must be between 1 and 5.' });
    }

    const service = allServices.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const newFeedback = {
      id: `fb-${Date.now()}`,
      serviceId,
      reviewerId: userId,
      score: parseInt(score),
      comment,
      timestamp: new Date().toISOString(),
    };

    service.ratings.push(newFeedback);
    allFeedback.push(newFeedback);

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
