// server/utils/responseHelpers.js
exports.sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

exports.sendError = (res, statusCode, message, errorDetails = null) => {
  const error = {
    error: getErrorNameFromStatusCode(statusCode),
    message: message
  };
  
  if (errorDetails) {
    error.details = errorDetails;
  }
  
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(error));
};

function getErrorNameFromStatusCode(statusCode) {
  const statusCodes = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    503: 'Service Unavailable'
  };
  
  return statusCodes[statusCode] || 'Unknown Error';
}