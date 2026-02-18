export default async function handler(req, res) {
  // In a real application, this would interact with a database
  const services = [
    { id: 1, title: 'Plumbing Services', description: 'Experienced plumber available for all your needs.', contractor: 'John Doe', zip: '90210' },
    { id: 2, title: 'Electrical Work', description: 'Certified electrician for residential and commercial projects.', contractor: 'Jane Smith', zip: '10001' },
    { id: 3, title: 'Garden Maintenance', description: 'Professional gardening and landscaping services.', contractor: 'Green Thumb', zip: '90210' },
    { id: 4, title: 'Web Development', description: 'Custom website design and development.', contractor: 'Code Master', zip: '02108' },
  ];

  if (req.method === 'GET') {
    // Simulate fetching all services
    res.status(200).json(services);
  } else if (req.method === 'POST') {
    const { title, description, zipCode } = req.body;

    // Simulate creating a new service
    if (title && description && zipCode) {
      const newService = { id: services.length + 1, title, description, contractor: 'Current User', zip: zipCode };
      // In a real app, you'd save this to DB and return the saved object
      res.status(201).json({ message: 'Service created successfully', service: newService });
    } else {
      res.status(400).json({ message: 'Title, description, and zip code are required.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
