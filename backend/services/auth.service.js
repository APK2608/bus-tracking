const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const admins = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin1@college.edu',
    password: 'admin123'
  },
  {
    id: 2,
    name: 'Operations Admin',
    email: 'admin2@college.edu',
    password: 'admin123'
  },
  {
    id: 3,
    name: 'Security Admin',
    email: 'admin3@college.edu',
    password: 'admin123'
  }
];

exports.login = async (credentials) => {
  const { email, password } = credentials || {};

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  const admin = admins.find(
    (item) => item.email === email && item.password === password
  );

  if (!admin) {
    const error = new Error('Invalid admin credentials');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: 'admin' },
    jwtSecret,
    { expiresIn: '8h' }
  );

  return {
    success: true,
    message: 'Login successful',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    }
  };
};

exports.register = async () => {
  const error = new Error('Admin registration is disabled in V1');
  error.status = 403;
  throw error;
};
