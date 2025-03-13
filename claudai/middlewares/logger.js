// server/middlewares/logger.js
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple logging middleware
exports.logger = (req, res) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${req.method} ${req.url}\n`;
  
  // Log to console
  console.log(logEntry.trim());
  
  // Log to file
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
  
  // Add responseTime to logs
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const responseLog = `[${timestamp}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms\n`;
    console.log(responseLog.trim());
    fs.appendFile(logFile, responseLog, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
  });
};