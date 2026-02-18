import { allCrmLogs } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // In a real application, you would fetch all CRM logs from your database
    // and then format them (e.g., to CSV, Excel, or JSON).
    // For this simulation, we'll just return the current in-memory logs as JSON.

    // For a real export, you might set headers like:
    // res.setHeader('Content-Type', 'text/csv');
    // res.setHeader('Content-Disposition', 'attachment; filename="crm_logs.csv"');

    res.status(200).json(allCrmLogs);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
