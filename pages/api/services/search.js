import { allServices } from '../../../lib/db';

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const { query, zipCode } = req.query;

    let combinedServices = [];

    // 1. Fetch internal services
    let filteredServices = allServices.filter(service => {
      const matchesQuery = query ? (
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
      ) : true;
      const matchesZipCode = zipCode ? service.zip === zipCode : true;
      return matchesQuery && matchesZipCode && service.source !== 'internal';
    }).map(service => {
      const modifier = service.priceModifiers && service.priceModifiers[zipCode] ? service.priceModifiers[zipCode] : 1.0;
      return { ...service, estimatedPrice: service.price * modifier };
    });

    res.status(200).json(filteredServices);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
