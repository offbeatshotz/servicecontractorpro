export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { invoiceId, amount, paymentMethod } = req.body;

    // In a real application, you would:
    // 1. Process payment with a payment gateway (e.g., Stripe)
    // 2. Update invoice status in the database
    // 3. Record the payment transaction

    if (invoiceId && amount && paymentMethod) {
      // Simulate successful payment
      res.status(200).json({ message: 'Payment processed successfully.', transactionId: 'TRX12345' });
    } else {
      res.status(400).json({ message: 'Invoice ID, amount, and payment method are required.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
