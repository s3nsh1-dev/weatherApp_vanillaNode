# Weather App API

A Node.js backend API for a weather application. Provides current weather, forecasts, historical data, and user management with favorites.

## Features

- Current weather data
- 7-day weather forecasts
- Historical weather data
- User registration and authentication
- Favorite locations management
- Location-based queries (city name or coordinates)

## API Endpoints

### Weather

- `GET /api/weather/current`: Get current weather
  - Query params: `city` or `lat` & `lon`
- `GET /api/weather`: Get all weather data
  - Query params: `city` or `lat` & `lon`

### Forecast

- `GET /api/forecast`: Get weather forecast
  - Query params: `city` or `lat` & `lon`, optional `days`

### User Management

- `POST /api/users/register`: Register a new user
  - Body: `email`, `password`, `name`
- `POST /api/users/login`: Login
  - Body: `email`, `password`
- `GET /api/users/profile`: Get user profile
  - Headers: `Authorization: Bearer <token>`
- `PUT /api/users/profile`: Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: `name`, `email`, `password` (all optional)
- `DELETE /api/users/profile`: Delete user
  - Headers: `Authorization: Bearer <token>`

### Favorites

- `GET /api/favorites`: Get user's favorite locations
  - Headers: `Authorization: Bearer <token>`
- `POST /api/favorites`: Add a location to favorites
  - Headers: `Authorization: Bearer <token>`
  - Body: `city` or `lat` & `lon`
- `DELETE /api/favorites/:index`: Remove a location from favorites
  - Headers: `Authorization: Bearer <token>`

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file based on the example
4. Start the server: `npm start`
5. For development with auto-restart: `npm run dev`

## Data Structure

The application uses JSON files to store data:
- `data/users.json`: User accounts and favorites
- `data/weather.json`: Weather, forecast, and historical data

## Error Handling

All API responses follow a standard format:
- Success: `{ data }` with appropriate HTTP status code
- Error: `{ error: "Error Type", message: "Error message", details: "..." }`