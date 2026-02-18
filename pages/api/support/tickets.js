import { getUserIdFromRequest, IP_USER_ID_PREFIX } from '../../../lib/auth';

let allTickets = [
  { id: 'TKT001', subject: 'Payment Issue', status: 'Open', createdAt: '2026-02-10', userId: 'ip_user_mock1' },
  { id: 'TKT002', subject: 'Service Inquiry', status: 'Closed', createdAt: '2026-02-05', userId: 'ip_user_mock2' },
];

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);

  if (!userId && req.method !== 'GET') {
    return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
  }

  if (req.method === 'GET') {
    // In a real application, you would filter tickets by the authenticated user
    const userTickets = allTickets.filter(ticket => ticket.userId === userId);
    res.status(200).json(userTickets);
  } else if (req.method === 'POST') {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    const { subject, description } = req.body;

    // Simulate creating a new ticket
    if (subject && description) {
      const newTicket = { 
        id: `TKT00${allTickets.length + 1}`,
        subject,
        description,
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0],
        userId,
      };
      allTickets.push(newTicket);
      res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
    } else {
      res.status(400).json({ message: 'Subject and description are required.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
