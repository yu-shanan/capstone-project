const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return next(new ErrorHandler('Not authorized, no token', 401));
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler('User belonging to this token no longer exists', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorHandler('Not authorized, token failed', 401));
  }
};

module.exports = protect;
