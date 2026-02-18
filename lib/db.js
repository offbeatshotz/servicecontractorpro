let allInvoices = [
  { id: 'INV001', amount: 150.00, status: 'Paid', date: '2026-01-15', serviceId: 1, contractor: 'John Doe' },
  { id: 'INV002', amount: 250.00, status: 'Pending', date: '2026-02-01', serviceId: 2, contractor: 'Jane Smith' },
];

let allCrmLogs = [
  { id: 'LOG001', timestamp: '2026-02-17T10:00:00Z', user: 'Admin', action: 'Contacted John Doe', details: 'Discussed project INV001' },
  { id: 'LOG002', timestamp: '2026-02-17T11:30:00Z', user: 'Jane Smith', action: 'Updated service details', details: 'Added new skills' },
];

export { allInvoices, allCrmLogs };