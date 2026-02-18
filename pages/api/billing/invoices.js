export default async function handler(req, res) {
  // In a real application, this would fetch invoices from a database
  const invoices = [
    { id: 'INV001', amount: 150.00, status: 'Paid', date: '2026-01-15', serviceId: 1, contractor: 'John Doe' },
    { id: 'INV002', amount: 250.00, status: 'Pending', date: '2026-02-01', serviceId: 2, contractor: 'Jane Smith' },
  ];

  if (req.method === 'GET') {
    res.status(200).json(invoices);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
