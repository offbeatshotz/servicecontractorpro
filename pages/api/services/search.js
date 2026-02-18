export default async function handler(req, res) {
  // In a real application, this would interact with a database
  const allServices = [
    { id: 1, title: 'Plumbing Services', description: 'Experienced plumber available for all your needs.', contractor: 'John Doe', zip: '90210' },
    { id: 2, title: 'Electrical Work', description: 'Certified electrician for residential and commercial projects.', contractor: 'Jane Smith', zip: '10001' },
    { id: 3, title: 'Garden Maintenance', description: 'Professional gardening and landscaping services.', contractor: 'Green Thumb', zip: '90210' },
    { id: 4, title: 'Web Development', description: 'Custom website design and development.', contractor: 'Code Master', zip: '02108' },
  ];

  if (req.method === 'GET') {
    const { query, zipCode } = req.query;

    let filteredServices = allServices;

    if (query) {
      filteredServices = filteredServices.filter(service => 
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()) ||
        service.contractor.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (zipCode) {
      filteredServices = filteredServices.filter(service => service.zip === zipCode);
    }

    res.status(200).json(filteredServices);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
