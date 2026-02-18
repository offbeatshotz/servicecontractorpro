import { getUserIdFromRequest, IP_USER_ID_PREFIX } from '../../../lib/auth';

let allServices = [
  { id: 'srv-1', title: 'Plumbing Services', description: 'Experienced plumber available for all your needs.', contractor: 'John Doe', zip: '90210', userId: 'ip_user_mock1' },
  { id: 'srv-2', title: 'Electrical Work', description: 'Certified electrician for residential and commercial projects.', contractor: 'Jane Smith', zip: '10001', userId: 'ip_user_mock2' },
  { id: 'srv-3', title: 'Garden Maintenance', description: 'Professional gardening and landscaping services.', contractor: 'Green Thumb', zip: '90210', userId: 'ip_user_mock1' },
  { id: 'srv-4', title: 'Web Development', description: 'Custom website design and development.', contractor: 'Code Master', zip: '02108', userId: 'ip_user_mock3' },
];

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
