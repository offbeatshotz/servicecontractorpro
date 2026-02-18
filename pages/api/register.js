export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // In a real application, you would:
    // 1. Validate input (email format, password strength)
    // 2. Check if user already exists in the database
    // 3. Hash the password (e.g., using bcrypt)
    // 4. Store user data in the database
    // 5. Potentially send a verification email

    if (email && password) {
      // Simulate successful registration
      res.status(201).json({ message: 'User registered successfully.' });
    } else {
      res.status(400).json({ message: 'Email and password are required.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
