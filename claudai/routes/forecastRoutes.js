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
