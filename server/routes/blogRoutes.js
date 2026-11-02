const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { getComments, createComment } = require('../controllers/commentController');

router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// comments on a post
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, createComment);

module.exports = router;
