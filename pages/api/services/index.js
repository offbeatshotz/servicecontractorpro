import { getUserIdFromRequest, IP_USER_ID_PREFIX } from '../../../lib/auth';
import { allServices } from '../../../lib/db';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);

  // For GET requests, we allow unauthenticated access for browsing
  if (req.method === 'GET') {
    res.status(200).json(allServices);
  } else if (req.method === 'POST') {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    const { title, description, zipCode } = req.body;

    if (title && description && zipCode) {
      const newService = { 
        id: `srv-${allServices.length + 1}`,
        title,
        description,
        contractor: `User ${userId.substring(IP_USER_ID_PREFIX.length)}`, // Use a representation of the userId
        zip: zipCode,
        userId,
      };
      allServices.push(newService);
      res.status(201).json({ message: 'Service created successfully', service: newService });
    } else {
      res.status(400).json({ message: 'Title, description, and zip code are required.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
