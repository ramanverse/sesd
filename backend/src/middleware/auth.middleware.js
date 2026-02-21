'use strict';

const jwt = require('jsonwebtoken');

/**
 * authMiddleware — JWT access token validation middleware.
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches decoded payload to req.user.
 *
 * Returns 401 if token is missing or invalid.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_access_secret';

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, iat, exp }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Access token has expired. Please refresh your token.',
      });
    }
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid token. Authentication failed.',
    });
  }
};

module.exports = authMiddleware;
