export default async function handler(req, res) {
  const allServices = [
    { id: 'internal-1', title: 'Plumbing Services', description: 'Experienced plumber available for all your needs.', zip: '90210', source: 'internal', basePrice: 100, priceModifiers: { '90210': 1.2, '10001': 1.0 } },
    { id: 'internal-2', title: 'Electrical Work', description: 'Certified electrician for residential and commercial projects.', zip: '10001', source: 'internal', basePrice: 150, priceModifiers: { '10001': 1.1, '90210': 1.0 } },
    { id: 'internal-3', title: 'Garden Maintenance', description: 'Professional gardening and landscaping services.', zip: '90210', source: 'internal', basePrice: 80, priceModifiers: { '90210': 1.1, '02108': 1.0 } },
    { id: 'internal-4', title: 'Web Development', description: 'Custom website design and development.', zip: '02108', source: 'internal', basePrice: 500, priceModifiers: { '02108': 1.0, '60601': 1.2 } },
    { id: 'internal-5', title: 'House Cleaning', description: 'Thorough and reliable house cleaning services.', zip: '60601', source: 'internal', basePrice: 90, priceModifiers: { '60601': 1.0, '75001': 1.1 } },
    { id: 'internal-6', title: 'IT Support', description: 'On-site and remote IT assistance.', zip: '75001', source: 'internal', basePrice: 120, priceModifiers: { '75001': 1.0, '94103': 1.2 } },
    { id: 'internal-7', title: 'Mobile Car Wash', description: 'We come to you for a sparkling clean car.', zip: '94103', source: 'internal', basePrice: 50, priceModifiers: { '94103': 1.0, '10001': 1.1 } },
    { id: 'internal-8', title: 'Tutoring Services', description: 'Experienced tutors for all subjects.', zip: '10001', source: 'internal', basePrice: 70, priceModifiers: { '10001': 1.0, '90210': 1.1 } },
    { id: 'internal-9', title: 'Personal Training', description: 'Achieve your fitness goals with a certified trainer.', zip: '90210', source: 'internal', basePrice: 100, priceModifiers: { '90210': 1.0, '02108': 1.1 } },
    { id: 'internal-10', title: 'Pet Sitting', description: 'Reliable and caring pet sitting services.', zip: '02108', source: 'internal', basePrice: 40, priceModifiers: { '02108': 1.0, '60601': 1.1 } },
  ];

  if (req.method === 'GET') {
    const { query, zipCode } = req.query;

    let combinedServices = [];

    // 1. Fetch internal services
    let internalServices = allServices.filter(service => {
      const matchesQuery = query ? (
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
      ) : true;
      const matchesZipCode = zipCode ? service.zip === zipCode : true;
      return matchesQuery && matchesZipCode && service.source === 'internal';
    }).map(service => {
      const modifier = service.priceModifiers[zipCode] || 1.0; // Default to 1.0 if no specific modifier
      return { ...service, estimatedPrice: service.basePrice * modifier };
    });
    combinedServices.push(...internalServices);

    // 2. Conceptually fetch external services - REMOVED
    // The application will now only show services from internal contractors.

    res.status(200).json(uniqueServices);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
