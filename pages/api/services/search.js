export default async function handler(req, res) {
  const allServices = [
    { id: 'internal-1', title: 'Plumbing Services', description: 'Experienced plumber available for all your needs.', contractor: 'John Doe', zip: '90210', source: 'internal' },
    { id: 'internal-2', title: 'Electrical Work', description: 'Certified electrician for residential and commercial projects.', contractor: 'Jane Smith', zip: '10001', source: 'internal' },
    { id: 'internal-3', title: 'Garden Maintenance', description: 'Professional gardening and landscaping services.', contractor: 'Green Thumb', zip: '90210', source: 'internal' },
    { id: 'internal-4', title: 'Web Development', description: 'Custom website design and development.', contractor: 'Code Master', zip: '02108', source: 'internal' },
  ];

  if (req.method === 'GET') {
    const { query, zipCode } = req.query;

    let combinedServices = [];

    // 1. Fetch internal services
    let internalServices = allServices.filter(service => {
      const matchesQuery = query ? (
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()) ||
        service.contractor.toLowerCase().includes(query.toLowerCase())
      ) : true;
      const matchesZipCode = zipCode ? service.zip === zipCode : true;
      return matchesQuery && matchesZipCode;
    });
    combinedServices.push(...internalServices);

    // 2. Conceptually fetch external services
    // In a real application, you would make an actual API call here to an external service
    // like DataForSEO Business Listings API.
    let externalServices = [];
    if (query && zipCode) { // Only fetch external if both query and zipCode are provided
      try {
        // const externalApiResponse = await fetch(`EXTERNAL_API_ENDPOINT?q=${query}&zip=${zipCode}&api_key=YOUR_API_KEY`);
        // const externalData = await externalApiResponse.json();

        // Simulate external data for demonstration
        const simulatedExternalData = [
          { id: 'ext-5', name: 'Local Electrician Pro', specialty: 'Electrical Installations', location: '123 Main St, Anytown, 02108', contact: '555-1111' },
          { id: 'ext-6', name: 'Reliable Plumbers LLC', specialty: 'Drain Cleaning', location: '456 Oak Ave, Anytown, 90210', contact: '555-2222' },
          { id: 'ext-7', name: 'Quick Fix Handyman', specialty: 'Home Repairs', location: '789 Pine Ln, Villagetown, 02108', contact: '555-3333' },
          { id: 'ext-8', name: 'Elite Landscapers', specialty: 'Yard Maintenance', location: '101 Garden Rd, Greentown, 90210', contact: '555-4444' },
          { id: 'ext-9', name: 'Tech Solutions IT', specialty: 'Computer Repair', location: '222 Byte Blvd, Digitville, 10001', contact: '555-5555' },
        ];

        // Filter simulated external data by zip code and query
        const filteredExternalData = simulatedExternalData.filter(extService => {
          const serviceZip = extService.location.match(/\b\d{5}\b/)?.[0]; // Extract zip code
          const matchesExtQuery = extService.name.toLowerCase().includes(query.toLowerCase()) ||
                                  extService.specialty.toLowerCase().includes(query.toLowerCase());
          return matchesExtQuery && (zipCode === serviceZip);
        });

        // Map external data to internal service format
        externalServices = filteredExternalData.map(extService => ({
          id: extService.id,
          title: extService.name, // Use name as title
          description: extService.specialty, // Use specialty as description
          contractor: extService.name, // Use name as contractor
          zip: extService.location.match(/\b\d{5}\b/)?.[0] || 'N/A', // Extract zip code
          source: 'external', // Indicate source
        }));

        combinedServices.push(...externalServices);

      } catch (externalError) {
        console.error('Error fetching external services:', externalError);
        // Optionally, send a partial response or log the error
      }
    }

    // 3. Remove duplicates (conceptual: in a real app, might need more sophisticated matching)
    const uniqueServices = Array.from(new Map(combinedServices.map(item => [item.id, item])).values());

    res.status(200).json(uniqueServices);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
