import { allCrmLogs } from '../../../lib/db';
import { getUserIdFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
  const userId = getUserIdFromRequest(req);

  if (!userId && req.method !== 'GET') {
    return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
  }

  if (req.method === 'GET') {
    // In a real application, you would filter logs by the authenticated user
    const userCrmLogs = allCrmLogs.filter(log => log.userId === userId);
    res.status(200).json(userCrmLogs);
  } else if (req.method === 'POST') {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    const newLog = req.body;

    // In a real application, you would save this to a database.
    // For simulation, we'll add it to our in-memory array.
    if (!newLog.action) {
      return res.status(400).json({ message: 'Action is required for a CRM log.' });
    }

    const logEntry = {
      id: `LOG00${allCrmLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      userId,
      ...newLog,
    };
    allCrmLogs.push(logEntry);
    res.status(201).json({ message: 'CRM log added successfully.', log: logEntry });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
