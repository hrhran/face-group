const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const auth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp >= (Date.now() / 1000)) {
      res.status(401);
      throw new Error('Session has expired. Login again.');
    }
    try {
      token = req.headers.authorization.split(' ')[1];
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, No token');
  }
});

module.exports = { auth };
