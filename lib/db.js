let allInvoices = [
  { id: 'INV001', amount: 150.00, status: 'Paid', date: '2026-01-15', serviceId: 1, contractor: 'John Doe', userId: 'ip_user_mock1' },
  { id: 'INV002', amount: 250.00, status: 'Pending', date: '2026-02-01', serviceId: 2, contractor: 'Jane Smith', userId: 'ip_user_mock2' },
];

let allCrmLogs = [
  { id: 'LOG001', timestamp: '2026-02-17T10:00:00Z', user: 'Admin', action: 'Contacted John Doe', details: 'Discussed project INV001', userId: 'ip_user_mock1' },
  { id: 'LOG002', timestamp: '2026-02-17T11:30:00Z', user: 'Jane Smith', action: 'Updated service details', details: 'Added new skills', userId: 'ip_user_mock2' },
];



let allTickets = [
  { id: 'TKT001', subject: 'Payment Issue', status: 'Open', createdAt: '2026-02-10', userId: 'ip_user_mock1', legalForms: [] },
  { id: 'TKT002', subject: 'Service Inquiry', status: 'Closed', createdAt: '2026-02-05', userId: 'ip_user_mock2', legalForms: [] },
];

let allLegalForms = [];

let allServices = [
  // Services from pages/api/services/index.js
  { id: 'srv-1', title: 'Plumbing Services', description: 'Experienced plumber available for all your needs.', contractor: 'John Doe', zip: '90210', userId: 'ip_user_mock1', price: 100, estimates: 'Provided after consultation', plan: 'Basic service plan', ratings: [] },
  { id: 'srv-2', title: 'Electrical Work', description: 'Certified electrician for residential and commercial projects.', contractor: 'Jane Smith', zip: '10001', userId: 'ip_user_mock2', price: 150, estimates: 'Free initial estimate', plan: 'Standard service plan', ratings: [] },
  { id: 'srv-3', title: 'Garden Maintenance', description: 'Professional gardening and landscaping services.', contractor: 'Green Thumb', zip: '90210', userId: 'ip_user_mock1', price: 80, estimates: 'Hourly rate, project-based estimates', plan: 'Seasonal maintenance package', ratings: [] },
  { id: 'srv-4', title: 'Web Development', description: 'Custom website design and development.', contractor: 'Code Master', zip: '02108', userId: 'ip_user_mock3', price: 500, estimates: 'Project-based quote', plan: 'Full-stack development', ratings: [] },

  // Services from pages/api/services/search.js (merged and updated)
  { id: 'internal-1', title: 'Plumbing Services', description: 'Experienced plumber available for all your needs.', zip: '90210', source: 'internal', price: 100, priceModifiers: { '90210': 1.2, '10001': 1.0 }, estimates: 'Provided after consultation', plan: 'Basic service plan', contractor: 'Internal Plumber', userId: 'ip_user_internal_plumber', ratings: [] },
  { id: 'internal-2', title: 'Electrical Work', description: 'Certified electrician for residential and commercial projects.', zip: '10001', source: 'internal', price: 150, priceModifiers: { '10001': 1.1, '90210': 1.0 }, estimates: 'Free initial estimate', plan: 'Standard service plan', contractor: 'Internal Electrician', userId: 'ip_user_internal_electrician', ratings: [] },
  { id: 'internal-3', title: 'Garden Maintenance', description: 'Professional gardening and landscaping services.', zip: '90210', source: 'internal', price: 80, priceModifiers: { '90210': 1.1, '02108': 1.0 }, estimates: 'Hourly rate, project-based estimates', plan: 'Seasonal maintenance package', contractor: 'Internal Gardener', userId: 'ip_user_internal_gardener', ratings: [] },
  { id: 'internal-4', title: 'Web Development', description: 'Custom website design and development.', zip: '02108', source: 'internal', price: 500, priceModifiers: { '02108': 1.0, '60601': 1.2 }, estimates: 'Project-based quote', plan: 'Full-stack development', contractor: 'Internal Web Dev', userId: 'ip_user_internal_webdev', ratings: [] },
  { id: 'internal-5', title: 'House Cleaning', description: 'Thorough and reliable house cleaning services.', zip: '60601', source: 'internal', price: 90, priceModifiers: { '60601': 1.0, '75001': 1.1 }, estimates: 'Per square foot, or flat rate', plan: 'Deep cleaning package', contractor: 'Internal Cleaner', userId: 'ip_user_internal_cleaner', ratings: [] },
  { id: 'internal-6', title: 'IT Support', description: 'On-site and remote IT assistance.', zip: '75001', source: 'internal', price: 120, priceModifiers: { '75001': 1.0, '94103': 1.2 }, estimates: 'Hourly rate', plan: 'Remote assistance', contractor: 'Internal IT Support', userId: 'ip_user_internal_itsupport', ratings: [] },
  { id: 'internal-7', title: 'Mobile Car Wash', description: 'We come to you for a sparkling clean car.', zip: '94103', source: 'internal', price: 50, priceModifiers: { '94103': 1.0, '10001': 1.1 }, estimates: 'Flat rate per car type', plan: 'Premium wash', contractor: 'Internal Car Wash', userId: 'ip_user_internal_carwash', ratings: [] },
  { id: 'internal-8', title: 'Tutoring Services', description: 'Experienced tutors for all subjects.', zip: '10001', source: 'internal', price: 70, priceModifiers: { '10001': 1.0, '90210': 1.1 }, estimates: 'Hourly rate', plan: 'Personalized tutoring sessions', contractor: 'Internal Tutor', userId: 'ip_user_internal_tutor', ratings: [] },
  { id: 'internal-9', title: 'Personal Training', description: 'Achieve your fitness goals with a certified trainer.', zip: '90210', source: 'internal', price: 100, priceModifiers: { '90210': 1.0, '02108': 1.1 }, estimates: 'Package deals available', plan: 'Custom workout plan', contractor: 'Internal Trainer', userId: 'ip_user_internal_trainer', ratings: [] },
  { id: 'internal-10', title: 'Pet Sitting', description: 'Reliable and caring pet sitting services.', zip: '02108', source: 'internal', price: 40, priceModifiers: { '02108': 1.0, '60601': 1.1 }, estimates: 'Daily rate', plan: 'Overnight care', contractor: 'Internal Pet Sitter', userId: 'ip_user_internal_petsitter', ratings: [] },
];

let allFeedback = [];

export { allInvoices, allCrmLogs, allTickets, allServices, allLegalForms, allFeedback };