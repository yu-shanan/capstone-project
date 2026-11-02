const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');
const ErrorHandler = require('../utils/ErrorHandler');

// @route  GET /api/blog/:postId/comments   (public)
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort('createdAt');
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/blog/:postId/comments   (protected)
exports.createComment = async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body) return next(new ErrorHandler('body is required', 400));

    const post = await BlogPost.findById(req.params.postId);
    if (!post) return next(new ErrorHandler('Post not found', 404));

    let comment = await Comment.create({
      body,
      author: req.user._id,
      post: post._id,
    });

    comment = await comment.populate('author', 'username');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};
