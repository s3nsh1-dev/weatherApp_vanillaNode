// server/middlewares/auth.js
const { verifyToken } = require('../utils/jwt');
const { readUser } = require('../models/userModel');

exports.authenticate = async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized', message: 'Authentication token is required' }));
    return false;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = verifyToken(token);
    const user = await readUser(decoded.userId);
    
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized', message: 'User not found' }));
      return false;
    }
    
    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    return true;
  } catch (error) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized', message: 'Invalid token' }));
    return false;
  }
};