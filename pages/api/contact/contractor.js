import { getUserIdFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    const { serviceId, message } = req.body;

    if (!serviceId || !message) {
      return res.status(400).json({ message: 'Service ID and message are required.' });
    }

    // In a real application, you would:
    // 1. Look up the contractor associated with the serviceId
    // 2. Send an email to the contractor with the user's message and userId
    // 3. Save the message to a database (e.g., CRM logs, support tickets)
    console.log(`User ${userId} wants to contact contractor for service ${serviceId} with message: "${message}"`);

    res.status(200).json({ message: 'Contact request sent successfully.' });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
