// server/index.js
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { handleWeatherRoutes } = require('./routes/weatherRoutes');
const { handleUserRoutes } = require('./routes/userRoutes');
const { handleForecastRoutes } = require('./routes/forecastRoutes');
const { handleFavoriteRoutes } = require('./routes/favoriteRoutes');
const { logger } = require('./middlewares/logger');
const { corsMiddleware } = require('./middlewares/cors');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Apply middlewares
  logger(req, res);
  corsMiddleware(req, res);
  
  // Parse the URL and query parameters
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const queryParams = parsedUrl.query;
  
  // Get request body if exists
  let body = '';
  
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    await new Promise((resolve) => {
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch (error) {
          req.body = {};
        }
        resolve();
      });
    });
  }
  
  // Route handling
  try {
    if (pathname.startsWith('/api/weather')) {
      await handleWeatherRoutes(req, res, pathname, queryParams);
    } else if (pathname.startsWith('/api/users')) {
      await handleUserRoutes(req, res, pathname, queryParams);
    } else if (pathname.startsWith('/api/forecast')) {
      await handleForecastRoutes(req, res, pathname, queryParams);
    } else if (pathname.startsWith('/api/favorites')) {
      await handleFavoriteRoutes(req, res, pathname, queryParams);
    } else if (pathname === '/api/health') {
      // Health check endpoint
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } else {
      // Handle 404 - Not Found
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found', message: 'The requested resource was not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    // Handle 500 - Internal Server Error
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
  }
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});