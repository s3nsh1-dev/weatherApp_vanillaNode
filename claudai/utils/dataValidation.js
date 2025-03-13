// server/utils/dataValidation.js
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.validatePassword = (password) => {
  // At least 8 characters, must include at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

exports.validateLocation = (location) => {
  if (!location) return false;
  
  if (typeof location === 'string') {
    // If location is a city name, make sure it's not empty
    return location.trim().length > 0;
  } else if (typeof location === 'object') {
    // If location is coordinates, validate lat and lon
    const { lat, lon } = location;
    return (
      typeof lat === 'number' && 
      typeof lon === 'number' && 
      lat >= -90 && lat <= 90 && 
      lon >= -180 && lon <= 180
    );
  }
  
  return false;
};