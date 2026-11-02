const Message = require('../models/Message');
const ErrorHandler = require('../utils/ErrorHandler');

// @route  POST /api/contact   (public)
exports.createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return next(new ErrorHandler('name, email and message are required', 400));
    }

    const doc = await Message.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message received', data: doc });
  } catch (err) {
    next(err);
  }
};
