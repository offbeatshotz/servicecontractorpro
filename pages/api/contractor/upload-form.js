import { getUserIdFromRequest, IP_USER_ID_PREFIX } from '../../../lib/auth';
import { allLegalForms, allTickets } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    // Conceptual check: only 'ip_user_mock1' can upload forms
    if (!userId.startsWith('ip_user_mock1')) {
      return res.status(403).json({ message: 'Forbidden: Only contractors can upload legal forms.' });
    }

    const { fileName, ticketId } = req.body;

    if (!fileName || !ticketId) {
      return res.status(400).json({ message: 'File name and Ticket ID are required.' });
    }

    const ticket = allTickets.find(t => t.id === ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const newForm = {
      id: `form-${Date.now()}`,
      fileName,
      uploadedAt: new Date().toISOString(),
      uploaderId: userId,
      ticketId,
    };

    allLegalForms.push(newForm);
    ticket.legalForms.push({ id: newForm.id, fileName: newForm.fileName });

    res.status(201).json({ message: 'Legal form uploaded successfully', form: newForm });

  } else if (req.method === 'GET') {
    // Optionally, allow contractors to view their uploaded forms
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
    }

    // Conceptual check: only 'ip_user_mock1' can view their forms
    if (!userId.startsWith('ip_user_mock1')) {
      return res.status(403).json({ message: 'Forbidden: Only contractors can view legal forms.' });
    }

    const contractorForms = allLegalForms.filter(form => form.uploaderId === userId);
    res.status(200).json(contractorForms);

  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
