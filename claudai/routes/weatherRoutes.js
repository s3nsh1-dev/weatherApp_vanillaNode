// server/routes/weatherRoutes.js
const { getWeatherByCity, getWeatherByCoordinates } = require('../models/weatherModel');
const { validateLocation } = require('../utils/dataValidation');
const { sendJson, sendError } = require('../utils/responseHelpers');

exports.handleWeatherRoutes = async (req, res, pathname, queryParams) => {
  // GET /api/weather/current
  if (pathname === '/api/weather/current' && req.method === 'GET') {
    try {
      // Check if location is provided
      if (!queryParams.city && (!queryParams.lat || !queryParams.lon)) {
        return sendError(res, 400, 'Location is required (city or lat/lon)');
      }
      
      let weatherData;
      
      // Get weather data by city or coordinates
      if (queryParams.city) {
        if (!validateLocation(queryParams.city)) {
          return sendError(res, 400, 'Invalid city name');
        }
        
        weatherData = await getWeatherByCity(queryParams.city);
        
        if (!weatherData) {
          return sendError(res, 404, `Weather data not found for city: ${queryParams.city}`);
        }
      } else {
        const lat = parseFloat(queryParams.lat);
        const lon = parseFloat(queryParams.lon);
        
        if (!validateLocation({ lat, lon })) {
          return sendError(res, 400, 'Invalid coordinates');
        }
        
        weatherData = await getWeatherByCoordinates(lat, lon);
        
        if (!weatherData) {
          return sendError(res, 404, `Weather data not found for coordinates: ${lat}, ${lon}`);
        }
      }
      
      // Return only current weather data
      return sendJson(res, 200, weatherData.current);
    } catch (error) {
      return sendError(res, 500, 'Failed to fetch weather data', error.message);
    }
  }
  
  // GET /api/weather
  if (pathname === '/api/weather' && req.method === 'GET') {
    try {
      // Check if location is provided
      if (!queryParams.city && (!queryParams.lat || !queryParams.lon)) {
        return sendError(res, 400, 'Location is required (city or lat/lon)');
      }
      
      let weatherData;
      
      // Get weather data by city or coordinates
      if (queryParams.city) {
        if (!validateLocation(queryParams.city)) {
          return sendError(res, 400, 'Invalid city name');
        }
        
        weatherData = await getWeatherByCity(queryParams.city);
        
        if (!weatherData) {
          return sendError(res, 404, `Weather data not found for city: ${queryParams.city}`);
        }
      } else {
        const lat = parseFloat(queryParams.lat);
        const lon = parseFloat(queryParams.lon);
        
        if (!validateLocation({ lat, lon })) {
          return sendError(res, 400, 'Invalid coordinates');
        }
        
        weatherData = await getWeatherByCoordinates(lat, lon);
        
        if (!weatherData) {
          return sendError(res, 404, `Weather data not found for coordinates: ${lat}, ${lon}`);
        }
      }
      
      // Return all weather data
      return sendJson(res, 200, weatherData);
    } catch (error) {
      return sendError(res, 500, 'Failed to fetch weather data', error.message);
    }
  }
  
  // If no route matches, return 404
  return sendError(res, 404, 'Weather endpoint not found');
};

// server/routes/forecastRoutes.js
const { getForecastByCity, getForecastByCoordinates } = require('../models/weatherModel');
const { validateLocation } = require('../utils/dataValidation');
const { sendJson, sendError } = require('../utils/responseHelpers');

exports.handleForecastRoutes = async (req, res, pathname, queryParams) => {
  // GET /api/forecast
  if (pathname === '/api/forecast' && req.method === 'GET') {
    try {
      // Check if location is provided
      if (!queryParams.city && (!queryParams.lat || !queryParams.lon)) {
        return sendError(res, 400, 'Location is required (city or lat/lon)');
      }
      
      let forecastData;
      
      // Get forecast data by city or coordinates
      if (queryParams.city) {
        if (!validateLocation(queryParams.city)) {
          return sendError(res, 400, 'Invalid city name');
        }
        
        forecastData = await getForecastByCity(queryParams.city);
        
        if (!forecastData) {
          return sendError(res, 404, `Forecast data not found for city: ${queryParams.city}`);
        }
      } else {
        const lat = parseFloat(queryParams.lat);
        const lon = parseFloat(queryParams.lon);
        
        if (!validateLocation({ lat, lon })) {
          return sendError(res, 400, 'Invalid coordinates');
        }
        
        forecastData = await getForecastByCoordinates(lat, lon);
        
        if (!forecastData) {
          return sendError(res, 404, `Forecast data not found for coordinates: ${lat}, ${lon}`);
        }
      }
      
      // Filter by days if specified
      if (queryParams.days) {
        const days = parseInt(queryParams.days);
        if (isNaN(days) || days <= 0) {
          return sendError(res, 400, 'Days parameter must be a positive number');
        }
        
        forecastData = forecastData.slice(0, days);
      }
      
      return sendJson(res, 200, forecastData);
    } catch (error) {
      return sendError(res, 500, 'Failed to fetch forecast data', error.message);
    }
  }
  
  // If no route matches, return 404
  return sendError(res, 404, 'Forecast endpoint not found');
};

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