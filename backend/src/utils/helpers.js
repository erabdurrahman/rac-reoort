const generateToken = (id, secret, expiresIn) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id }, secret || process.env.JWT_SECRET, { expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d' });
};

const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateRandomToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { generateToken, paginate, sendResponse, asyncHandler, createError, generateRandomToken };
