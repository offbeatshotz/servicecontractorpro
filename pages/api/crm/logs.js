import { allCrmLogs } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(allCrmLogs);
  } else if (req.method === 'POST') {
    const newLog = req.body;

    // In a real application, you would save this to a database.
    // For simulation, we'll add it to our in-memory array.
    if (!newLog.action || !newLog.user) {
      return res.status(400).json({ message: 'Action and User are required for a CRM log.' });
    }

    const logEntry = {
      id: `LOG00${allCrmLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      ...newLog,
    };
    allCrmLogs.push(logEntry);
    res.status(201).json({ message: 'CRM log added successfully.', log: logEntry });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
