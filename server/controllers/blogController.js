const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const ErrorHandler = require('../utils/ErrorHandler');

// @route  GET /api/blog   (public)
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'username')
      .sort('-createdAt');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/blog/:id   (public)
exports.getPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username');
    if (!post) return next(new ErrorHandler('Post not found', 404));

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username')
      .sort('createdAt');

    res.json({ ...post.toObject(), comments });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/blog   (protected)
exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return next(new ErrorHandler('title and content are required', 400));
    }

    const post = await BlogPost.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/blog/:id   (protected, author only)
exports.updatePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return next(new ErrorHandler('Post not found', 404));

    if (post.author.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler('Not authorized to update this post', 403));
    }

    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.content !== undefined) post.content = req.body.content;

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/blog/:id   (protected, author only)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return next(new ErrorHandler('Post not found', 404));

    if (post.author.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler('Not authorized to delete this post', 403));
    }

    // remove the post's comments as well
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};
