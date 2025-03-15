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
