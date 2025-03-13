// server/models/userModel.js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, '../data/users.json');
const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Ensure users.json exists
async function ensureUsersFile() {
  try {
    await fs.access(dbPath);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(dbPath, JSON.stringify([]));
  }
}

// Read all users
async function getAllUsers() {
  await ensureDataDirectory();
  await ensureUsersFile();
  
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// Hash password
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

// Verify password
function verifyPassword(password, hash, salt) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Create a new user
exports.createUser = async (userData) => {
  const users = await getAllUsers();
  
  // Check if user with email already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const { hash, salt } = hashPassword(userData.password);
  
  // Create new user
  const newUser = {
    id: crypto.randomUUID(),
    email: userData.email,
    passwordHash: hash,
    passwordSalt: salt,
    name: userData.name || '',
    role: userData.role || 'user',
    favorites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add user to database
  users.push(newUser);
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  
  // Return user without sensitive information
  const { passwordHash, passwordSalt, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Read a user by ID
exports.readUser = async (userId) => {
  const users = await getAllUsers();
  const user = users.find(user => user.id === userId);
  
  if (!user) return null;
  
  // Return user without sensitive information
  const { passwordHash, passwordSalt, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Read a user by email (for authentication)
exports.readUserByEmail = async (email) => {
  const users = await getAllUsers();
  return users.find(user => user.email === email);
};

// Update a user
exports.updateUser = async (userId, updateData) => {
  const users = await getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user fields
  const updatedUser = {
    ...users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  // If updating password, hash it
  if (updateData.password) {
    const { hash, salt } = hashPassword(updateData.password);
    updatedUser.passwordHash = hash;
    updatedUser.passwordSalt = salt;
    delete updatedUser.password;
  }
  
  users[userIndex] = updatedUser;
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  
  // Return user without sensitive information
  const { passwordHash, passwordSalt, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

// Delete a user
exports.deleteUser = async (userId) => {
  const users = await getAllUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  
  if (filteredUsers.length === users.length) {
    throw new Error('User not found');
  }
  
  await fs.writeFile(dbPath, JSON.stringify(filteredUsers, null, 2));
  return true;
};

// Authenticate user
exports.authenticateUser = async (email, password) => {
  const user = await exports.readUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  // Verify password
  if (verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    // Return user without sensitive information
    const { passwordHash, passwordSalt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

// Add location to favorites
exports.addFavorite = async (userId, location) => {
  const user = await exports.readUser(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Get all users to update the specific one
  const users = await getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  // Check if location already exists in favorites
  const favorites = users[userIndex].favorites || [];
  const locationExists = favorites.some(fav => {
    if (typeof location === 'string' && typeof fav === 'string') {
      return fav.toLowerCase() === location.toLowerCase();
    } else if (typeof location === 'object' && typeof fav === 'object') {
      return fav.lat === location.lat && fav.lon === location.lon;
    }
    return false;
  });
  
  if (locationExists) {
    throw new Error('Location already in favorites');
  }
  
  // Add to favorites
  users[userIndex].favorites = [...favorites, location];
  users[userIndex].updatedAt = new Date().toISOString();
  
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  
  // Return user without sensitive information
  const { passwordHash, passwordSalt, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

// Remove location from favorites
exports.removeFavorite = async (userId, locationIndex) => {
  const user = await exports.readUser(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Get all users to update the specific one
  const users = await getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  // Check if location exists in favorites
  const favorites = users[userIndex].favorites || [];
  
  if (locationIndex < 0 || locationIndex >= favorites.length) {
    throw new Error('Invalid favorite location index');
  }
  
  // Remove from favorites
  users[userIndex].favorites.splice(locationIndex, 1);
  users[userIndex].updatedAt = new Date().toISOString();
  
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  
  // Return user without sensitive information
  const { passwordHash, passwordSalt, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};
