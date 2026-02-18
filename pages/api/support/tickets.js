export default async function handler(req, res) {
  // In a real application, this would interact with a database
  const tickets = [
    { id: 'TKT001', subject: 'Payment Issue', status: 'Open', createdAt: '2026-02-10', userId: 'user123' },
    { id: 'TKT002', subject: 'Service Inquiry', status: 'Closed', createdAt: '2026-02-05', userId: 'user456' },
  ];

  if (req.method === 'GET') {
    res.status(200).json(tickets);
  } else if (req.method === 'POST') {
    const { subject, description, userId } = req.body;

    // Simulate creating a new ticket
    if (subject && description && userId) {
      const newTicket = { id: `TKT00${tickets.length + 1}`, subject, description, status: 'Open', createdAt: new Date().toISOString().split('T')[0], userId };
      // In a real app, you'd save this to DB and return the saved object
      res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
    } else {
      res.status(400).json({ message: 'Subject, description, and user ID are required.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
