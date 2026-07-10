const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authorization token required');
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, jwtSecret, (error, decoded) => {
    if (error) {
      const authError = new Error('Invalid or expired token');
      authError.status = 401;
      return next(authError);
    }

    req.admin = decoded;
    next();
  });
};
