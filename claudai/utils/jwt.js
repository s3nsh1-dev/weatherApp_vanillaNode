// server/utils/jwt.js
const crypto = require('crypto');

// In a production app, you would use a proper JWT library like jsonwebtoken
// This is a simplified implementation for demonstration purposes
const JWT_SECRET = process.env.JWT_SECRET || 'weather-app-secret-key';

// Generate a token
exports.generateToken = (payload) => {
  // Create a simple token structure
  const header = { alg: 'HS256', typ: 'JWT' };
  const currentTime = Math.floor(Date.now() / 1000);
  payload.iat = currentTime;
  payload.exp = currentTime + 24 * 60 * 60; // 24 hours

  // Encode header and payload
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
  
  // Create signature
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '');
  
  // Return the complete token
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Verify and decode a token
exports.verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '');
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }
    
    // Decode payload
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
    
    // Check if token has expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token has expired');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token: ' + error.message);
  }
};