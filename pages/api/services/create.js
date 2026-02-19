import { getUserIdFromRequest, IP_USER_ID_PREFIX } from '../../../lib/auth';
import { allServices } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    const { title, description, price, estimates, plan, zipCode } = req.body;

    if (!title || !description || !price || !estimates || !plan || !zipCode) {
      return res.status(400).json({ message: 'All service details (title, description, price, estimates, plan, zip code) are required.' });
    }

    const newService = {
      id: `srv-${Date.now()}`,
      title,
      description,
      contractor: `User ${userId.substring(IP_USER_ID_PREFIX.length)}`, // Conceptual contractor name
      zip: zipCode,
      userId,
      price: parseFloat(price),
      estimates,
      plan,
    };

    allServices.push(newService);

    res.status(201).json({ message: 'Service created successfully', service: newService });

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
