// server/routes/favoriteRoutes.js
const { readUser, addFavorite, removeFavorite } = require('../models/userModel');
const { validateLocation } = require('../utils/dataValidation');
const { sendJson, sendError } = require('../utils/responseHelpers');
const { authenticate } = require('../middlewares/auth');

exports.handleFavoriteRoutes = async (req, res, pathname, queryParams) => {
  // GET /api/favorites
  if (pathname === '/api/favorites' && req.method === 'GET') {
    try {
      // Authenticate user
      const isAuthenticated = await authenticate(req, res);
      if (!isAuthenticated) return;
      
      // Get user
      const user = await readUser(req.user.id);
      
      if (!user) {
        return sendError(res, 404, 'User not found');
      }
      
      return sendJson(res, 200, user.favorites || []);
    } catch (error) {
      return sendError(res, 500, 'Failed to get favorites', error.message);
    }
  }
  
  // POST /api/favorites
  if (pathname === '/api/favorites' && req.method === 'POST') {
    try {
      // Authenticate user
      const isAuthenticated = await authenticate(req, res);
      if (!isAuthenticated) return;
      
      const { city, lat, lon } = req.body;
      let location;
      
      // Validate location
      if (city) {
        if (!validateLocation(city)) {
          return sendError(res, 400, 'Invalid city name');
        }
        location = city;
      } else if (lat !== undefined && lon !== undefined) {
        const coordinates = { lat: parseFloat(lat), lon: parseFloat(lon) };
        if (!validateLocation(coordinates)) {
          return sendError(res, 400, 'Invalid coordinates');
        }
        location = coordinates;
      } else {
        return sendError(res, 400, 'Location is required (city or lat/lon)');
      }
      
      // Add to favorites
      const user = await addFavorite(req.user.id, location);
      
      return sendJson(res, 201, user.favorites);
    } catch (error) {
      if (error.message === 'Location already in favorites') {
        return sendError(res, 409, error.message);
      }
      return sendError(res, 500, 'Failed to add favorite', error.message);
    }
  }
  
  // DELETE /api/favorites/:index
  if (pathname.match(/^\/api\/favorites\/\d+$/) && req.method === 'DELETE') {
    try {
      // Authenticate user
      const isAuthenticated = await authenticate(req, res);
      if (!isAuthenticated) return;
      
      // Get index from pathname
      const index = parseInt(pathname.split('/').pop());
      
      // Remove from favorites
      const user = await removeFavorite(req.user.id, index);
      
      return sendJson(res, 200, user.favorites);
    } catch (error) {
      if (error.message === 'Invalid favorite location index') {
        return sendError(res, 400, error.message);
      }
      return sendError(res, 500, 'Failed to remove favorite', error.message);
    }
  }
  
  // If no route matches, return 404
  return sendError(res, 404, 'Favorites endpoint not found');
};