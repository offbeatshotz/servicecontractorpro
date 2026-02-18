import { allInvoices } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(allInvoices);
  } else if (req.method === 'POST') {
    const newInvoice = req.body;

    // In a real application, you would save this to a database.
    // For simulation, we'll add/update it in our in-memory array.
    const existingIndex = allInvoices.findIndex(inv => inv.id === newInvoice.id);
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
