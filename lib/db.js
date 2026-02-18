let allInvoices = [
  { id: 'INV001', amount: 150.00, status: 'Paid', date: '2026-01-15', serviceId: 1, contractor: 'John Doe', userId: 'ip_user_mock1' },
  { id: 'INV002', amount: 250.00, status: 'Pending', date: '2026-02-01', serviceId: 2, contractor: 'Jane Smith', userId: 'ip_user_mock2' },
];

let allCrmLogs = [
  { id: 'LOG001', timestamp: '2026-02-17T10:00:00Z', user: 'Admin', action: 'Contacted John Doe', details: 'Discussed project INV001', userId: 'ip_user_mock1' },
  { id: 'LOG002', timestamp: '2026-02-17T11:30:00Z', user: 'Jane Smith', action: 'Updated service details', details: 'Added new skills', userId: 'ip_user_mock2' },
];

let allTickets = [
  { id: 'TKT001', subject: 'Payment Issue', status: 'Open', createdAt: '2026-02-10', userId: 'ip_user_mock1' },
  { id: 'TKT002', subject: 'Service Inquiry', status: 'Closed', createdAt: '2026-02-05', userId: 'ip_user_mock2' },
];

export { allInvoices, allCrmLogs, allTickets };