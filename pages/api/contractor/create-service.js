import { getUserIdFromRequest } from '../../../lib/auth';
import { addService } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    // Conceptual check: only 'ip_user_mock1' can create services
    if (!userId.startsWith('ip_user_mock1')) {
      return res.status(403).json({ message: 'Forbidden: Only contractors can create services.' });
    }

    const { title, description, zip, price, estimates, plan } = req.body;

    // Basic validation
    if (!title || !description || !zip || !price || !estimates || !plan) {
      return res.status(400).json({ message: 'All service fields are required.' });
    }

    const newService = {
      id: `srv-${Date.now()}`,
      title,
      description,
      contractor: 'Contractor Name Placeholder', // This would ideally come from user data
      zip,
      userId,
      price: parseFloat(price),
      estimates,
      plan,
      ratings: [], // Initialize with an empty ratings array
    };

    addService(newService);

    res.status(201).json({ message: 'Service created successfully', service: newService });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
