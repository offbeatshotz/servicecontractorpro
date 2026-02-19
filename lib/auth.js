// lib/auth.js

const TOKEN_KEY = 'browser_auth_token';
const IP_USER_ID_PREFIX = 'ip_user_';

// --- Conceptual IP-based User ID Management ---

// A very simple, non-cryptographic hash function for conceptual IP-based user ID
// In a real application, this would be handled server-side securely.
function generateIpBasedUserId(ipAddress) {
  if (!ipAddress) {
    return null;
  }
  // Simulate a unique ID based on IP - NOT for production use
  return IP_USER_ID_PREFIX + btoa(ipAddress).replace(/=/g, '');
}

// --- Conceptual Encrypted Browser Token Management ---

// Simulate encryption by base64 encoding the user ID
function encryptToken(userId) {
  if (!userId) return null;
  // In a real app, use a robust encryption library
  return btoa(userId);
}

// Simulate decryption by base64 decoding the token
function decryptToken(token) {
  if (!token) return null;
  try {
    // In a real app, use a robust encryption library
    return atob(token);
  } catch (e) {
    console.error('Error decrypting token:', e);
    return null;
  }
}

// --- Browser Storage for Conceptual Token ---

function saveAuthToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// --- Server-side Token/User ID Extraction ---

// Extracts and decrypts the user ID from an incoming API request
function getUserIdFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length);
    return decryptToken(token);
  }
  return null; // No token or invalid format
}

export {
  generateIpBasedUserId,
  encryptToken,
  decryptToken,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  getUserIdFromRequest,
  TOKEN_KEY,
  IP_USER_ID_PREFIX,
  getUserId,
  getMockUserName,
};

function getUserId() {
  const token = getAuthToken();
  return decryptToken(token);
}

const MOCK_NAMES = [
  "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Ethan Hunt",
  "Fiona Glenanne", "George Jetson", "Hannah Montana", "Ivan Drago", "Jessica Rabbit"
];

function getMockUserName(userId) {
  if (!userId) return "Guest";
  // A simple, consistent hash to pick a name based on userId
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return MOCK_NAMES[hash % MOCK_NAMES.length];
}

// Helper for Mock Login
function loginUser(userId) {
  const token = encryptToken(userId);
  saveAuthToken(token);
}

export {
  generateIpBasedUserId,
  encryptToken,
  decryptToken,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  getUserIdFromRequest,
  TOKEN_KEY,
  IP_USER_ID_PREFIX,
  getUserId,
  getMockUserName,
  loginUser,
};