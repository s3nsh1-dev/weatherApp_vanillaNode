// server/routes/userRoutes.js
const { 
  createUser, 
  readUser, 
  updateUser, 
  deleteUser, 
  authenticateUser 
} = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const { validateEmail, validatePassword } = require('../utils/dataValidation');
const { sendJson, sendError } = require('../utils/responseHelpers');
const { authenticate } = require('../middlewares/auth');

exports.handleUserRoutes = async (req, res, pathname, queryParams) => {
  // POST /api/users/register
  if (pathname === '/api/users/register' && req.method === 'POST') {
    try {
      const { email, password, name } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }
      
      // Validate email format
      if (!validateEmail(email)) {
        return sendError(res, 400, 'Invalid email format');
      }
      
      // Validate password strength
      if (!validatePassword(password)) {
        return sendError(res, 400, 'Password must be at least 8 characters and include uppercase, lowercase, and numbers');
      }
      
      // Create user
      const user = await createUser({ email, password, name });
      
      // Generate token
      const token = generateToken({ userId: user.id });
      
      return sendJson(res, 201, { user, token });
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        return sendError(res, 409, error.message);
      }
      return sendError(res, 500, 'Failed to register user', error.message);
    }
  }
  
  // POST /api/users/login
  if (pathname === '/api/users/login' && req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }
      
      // Authenticate user
      const user = await authenticateUser(email, password);
      
      if (!user) {
        return sendError(res, 401, 'Invalid email or password');
      }
      
      // Generate token
      const token = generateToken({ userId: user.id });
      
      return sendJson(res, 200, { user, token });
    } catch (error) {
      return sendError(res, 500, 'Failed to login', error.message);
    }
  }
  
  // GET /api/users/profile
  if (pathname === '/api/users/profile' && req.method === 'GET') {
    try {
      // Authenticate user
      const isAuthenticated = await authenticate(req, res);
      if (!isAuthenticated) return;
      
      // Get user
      const user = await readUser(req.user.id);
      
      if (!user) {
        return sendError(res, 404, 'User not found');
      }
      
      return sendJson(res, 200, user);
    } catch (error) {
      return sendError(res, 500, 'Failed to get user profile', error.message);
    }
  }
  
  // PUT /api/users/profile
  if (pathname === '/api/users/profile' && req.method === 'PUT') {
    try {
      // Authenticate user
      const isAuthenticated = await authenticate(req, res);
      if (!isAuthenticated) return;
      
      const { name, email, password } = req.body;
      const updateData = {};
      
      // Only update provided fields
      if (name) updateData.name = name;
      
      if (email) {
        if (!validateEmail(email)) {
          return sendError(res, 400, 'Invalid email format');
        }
        updateData.email = email;
      }
      
      if (password) {
        if (!validatePassword(password)) {
          return sendError(res, 400, 'Password must be at least 8 characters and include uppercase, lowercase, and numbers');
        }
        updateData.password = password;
      }
      
      // Update user
      const user = await updateUser(req.user.id, updateData);
      
      return sendJson(res, 200, user);
    } catch (error) {
      return sendError(res, 500, 'Failed to update user profile', error.message);
    }
  }
  
  // DELETE /api/users/profile
  if (pathname === '/api/users/profile' && req.method === 'DELETE') {
    try {
      // Authenticate user
      const isAuthenticated = await authenticate(req, res);
      if (!isAuthenticated) return;
      
      // Delete user
      await deleteUser(req.user.id);
      
      return sendJson(res, 200, { message: 'User deleted successfully' });
    } catch (error) {
      return sendError(res, 500, 'Failed to delete user', error.message);
    }
  }
  
  // If no route matches, return 404
  return sendError(res, 404, 'User endpoint not found');
};
