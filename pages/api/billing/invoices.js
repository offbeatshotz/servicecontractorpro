import { allInvoices } from '../../../lib/db';
import { getUserIdFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);

  if (!userId && req.method !== 'GET') {
    return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
  }

  if (req.method === 'GET') {
    // In a real application, you would filter invoices by the authenticated user
    // For this conceptual implementation, we'll filter allInvoices
    const userInvoices = allInvoices.filter(invoice => invoice.userId === userId);
    res.status(200).json(userInvoices);
  } else if (req.method === 'POST') {
    const newInvoice = { ...req.body, userId }; // Associate invoice with the user

    // In a real application, you would save this to a database.
    // For simulation, we'll add/update it in our in-memory array.
    const existingIndex = allInvoices.findIndex(inv => inv.id === newInvoice.id && inv.userId === userId);
    if (existingIndex > -1) {
      allInvoices[existingIndex] = { ...allInvoices[existingIndex], ...newInvoice };
      res.status(200).json({ message: 'Invoice updated successfully.', invoice: allInvoices[existingIndex] });
    } else {
      allInvoices.push({ ...newInvoice, id: `INV00${allInvoices.length + 1}` });
      res.status(201).json({ message: 'Invoice saved successfully.', invoice: newInvoice });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
