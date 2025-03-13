// server/models/weatherModel.js
const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../data/weather.json');
const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Ensure weather.json exists
async function ensureWeatherFile() {
  try {
    await fs.access(dbPath);
  } catch (error) {
    // Create weather data with sample entries
    const sampleData = {
      cities: {
        "new york": generateWeatherData("New York", 40.7128, -74.0060),
        "los angeles": generateWeatherData("Los Angeles", 34.0522, -118.2437),
        "chicago": generateWeatherData("Chicago", 41.8781, -87.6298),
        "houston": generateWeatherData("Houston", 29.7604, -95.3698),
        "london": generateWeatherData("London", 51.5074, -0.1278),
        "tokyo": generateWeatherData("Tokyo", 35.6762, 139.6503),
        "sydney": generateWeatherData("Sydney", -33.8688, 151.2093),
        "paris": generateWeatherData("Paris", 48.8566, 2.3522),
        "berlin": generateWeatherData("Berlin", 52.5200, 13.4050),
        "beijing": generateWeatherData("Beijing", 39.9042, 116.4074)
      },
      coordinates: {}
    };
    
    await fs.writeFile(dbPath, JSON.stringify(sampleData, null, 2));
  }
}

// Helper function to generate weather data for a location
function generateWeatherData(city, lat, lon) {
  // Current data
  const current = generateCurrentWeather(city, lat, lon);
  
  // Forecast data (7 days)
  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      temperature: {
        min: Math.round(Math.random() * 10 + 10),
        max: Math.round(Math.random() * 15 + 20)
      },
      humidity: Math.round(Math.random() * 30 + 40),
      windSpeed: Math.round(Math.random() * 20 + 5),
      precipitation: Math.round(Math.random() * 100),
      weather: getRandomWeather()
    });
  }
  
  // Historical data (7 days)
  const historical = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i - 1);
    
    historical.push({
      date: date.toISOString().split('T')[0],
      temperature: {
        min: Math.round(Math.random() * 10 + 10),
        max: Math.round(Math.random() * 15 + 20)
      },
      humidity: Math.round(Math.random() * 30 + 40),
      windSpeed: Math.round(Math.random() * 20 + 5),
      precipitation: Math.round(Math.random() * 100),
      weather: getRandomWeather()
    });
  }
  
  return {
    name: city,
    coordinates: { lat, lon },
    current,
    forecast,
    historical
  };
}

// Generate current weather data
function generateCurrentWeather(city, lat, lon) {
  const date = new Date();
  const weather = getRandomWeather();
  const temperature = Math.round(Math.random() * 30 + 5);
  const feelsLike = temperature + Math.round(Math.random() * 5 - 2);
  
  return {
    timestamp: date.toISOString(),
    temperature: temperature,
    feelsLike: feelsLike,
    humidity: Math.round(Math.random() * 30 + 40),
    windSpeed: Math.round(Math.random() * 20 + 5),
    windDirection: Math.round(Math.random() * 360),
    pressure: Math.round(Math.random() * 50 + 980),
    uv: Math.round(Math.random() * 10),
    visibility: Math.round(Math.random() * 5 + 5),
    weather: weather,
    icon: getWeatherIcon(weather)
  };
}

// Get random weather condition
function getRandomWeather() {
  const conditions = [
    'Clear', 'Partly Cloudy', 'Cloudy', 'Overcast',
    'Rain', 'Light Rain', 'Heavy Rain', 'Thunderstorm',
    'Snow', 'Light Snow', 'Heavy Snow', 'Fog', 'Haze'
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
  const icons = {
    'Clear': 'sun',
    'Partly Cloudy': 'cloud-sun',
    'Cloudy': 'cloud',
    'Overcast': 'clouds',
    'Rain': 'cloud-rain',
    'Light Rain': 'cloud-drizzle',
    'Heavy Rain': 'cloud-showers-heavy',
    'Thunderstorm': 'cloud-bolt',
    'Snow': 'snowflake',
    'Light Snow': 'snowflake',
    'Heavy Snow': 'snowflake',
    'Fog': 'smog',
    'Haze': 'smog'
  };
  
  return icons[condition] || 'question';
}

// Get weather data for a city
exports.getWeatherByCity = async (city) => {
  await ensureDataDirectory();
  await ensureWeatherFile();
  
  const data = await fs.readFile(dbPath, 'utf8');
  const weatherData = JSON.parse(data);
  
  const normalizedCity = city.toLowerCase();
  if (!weatherData.cities[normalizedCity]) {
    return null;
  }
  
  // Update current weather to ensure it's always fresh
  weatherData.cities[normalizedCity].current = generateCurrentWeather(
    weatherData.cities[normalizedCity].name,
    weatherData.cities[normalizedCity].coordinates.lat,
    weatherData.cities[normalizedCity].coordinates.lon
  );
  
  await fs.writeFile(dbPath, JSON.stringify(weatherData, null, 2));
  
  return weatherData.cities[normalizedCity];
};

// Get weather data by coordinates
exports.getWeatherByCoordinates = async (lat, lon) => {
  await ensureDataDirectory();
  await ensureWeatherFile();
  
  const data = await fs.readFile(dbPath, 'utf8');
  const weatherData = JSON.parse(data);
  
  // Round coordinates for caching
  const roundedLat = parseFloat(lat).toFixed(2);
  const roundedLon = parseFloat(lon).toFixed(2);
  const key = `${roundedLat}_${roundedLon}`;
  
  // Check if we have cached data for these coordinates
  if (!weatherData.coordinates[key]) {
    // Generate new weather data for these coordinates
    const city = `Location at ${roundedLat}, ${roundedLon}`;
    weatherData.coordinates[key] = generateWeatherData(city, parseFloat(lat), parseFloat(lon));
    
    await fs.writeFile(dbPath, JSON.stringify(weatherData, null, 2));
  } else {
    // Update current weather to ensure it's always fresh
    weatherData.coordinates[key].current = generateCurrentWeather(
      weatherData.coordinates[key].name,
      weatherData.coordinates[key].coordinates.lat,
      weatherData.coordinates[key].coordinates.lon
    );
    
    await fs.writeFile(dbPath, JSON.stringify(weatherData, null, 2));
  }
  
  return weatherData.coordinates[key];
};

// Get forecast data for a city
exports.getForecastByCity = async (city) => {
  const weatherData = await exports.getWeatherByCity(city);
  if (!weatherData) return null;
  
  return weatherData.forecast;
};

// Get forecast data by coordinates
exports.getForecastByCoordinates = async (lat, lon) => {
  const weatherData = await exports.getWeatherByCoordinates(lat, lon);
  if (!weatherData) return null;
  
  return weatherData.forecast;
};

// Get historical data for a city
exports.getHistoricalByCity = async (city) => {
  const weatherData = await exports.getWeatherByCity(city);
  if (!weatherData) return null;
  
  return weatherData.historical;
};

// Get historical data by coordinates
exports.getHistoricalByCoordinates = async (lat, lon) => {
  const weatherData = await exports.getWeatherByCoordinates(lat, lon);
  if (!weatherData) return null;
  
  return weatherData.historical;
};

// Add a new city to the database
exports.addCity = async (city, lat, lon) => {
  await ensureDataDirectory();
  await ensureWeatherFile();
  
  const data = await fs.readFile(dbPath, 'utf8');
  const weatherData = JSON.parse(data);
  
  const normalizedCity = city.toLowerCase();
  
  // Check if city already exists
  if (weatherData.cities[normalizedCity]) {
    throw new Error('City already exists');
  }
  
  // Add new city with generated weather data
  weatherData.cities[normalizedCity] = generateWeatherData(city, lat, lon);
  
  await fs.writeFile(dbPath, JSON.stringify(weatherData, null, 2));
  
  return weatherData.cities[normalizedCity];
};