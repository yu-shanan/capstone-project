const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');
const generateToken = require('../utils/generateToken');

const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
});

// @route  POST /api/users/register   (public)
// Creates a user; the password is hashed by the User model's pre('save') hook.
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(new ErrorHandler('username, email and password are required', 400));
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      user: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/users/login   (public)
// Verifies the password with bcrypt and returns a signed JWT.
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler('email and password are required', 400));
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    res.json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/users/me   (protected)
// Lets the client verify a stored token after a page refresh.
exports.getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: publicUser(req.user) });
  } catch (err) {
    next(err);
  }
};
