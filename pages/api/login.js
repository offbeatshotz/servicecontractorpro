export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // In a real application, you would:
    // 1. Validate input
    // 2. Find user in database by email
    // 3. Compare hashed password
    // 4. If credentials are valid, generate a JWT or set a session cookie

    if (email === 'test@example.com' && password === 'password') {
      // Simulate successful login
      res.status(200).json({ message: 'Login successful.', token: 'fake-jwt-token' });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
