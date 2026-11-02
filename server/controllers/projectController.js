const Project = require('../models/Project');
const ErrorHandler = require('../utils/ErrorHandler');

// @route  GET /api/projects   (public)
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('user', 'username')
      .sort('-createdAt');
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/projects/:id   (public)
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'username');
    if (!project) return next(new ErrorHandler('Project not found', 404));
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/projects   (protected)
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;
    if (!title || !description) {
      return next(new ErrorHandler('title and description are required', 400));
    }

    const project = await Project.create({
      title,
      description,
      imageUrl,
      repoUrl,
      liveUrl,
      user: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/projects/:id   (protected)
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new ErrorHandler('Project not found', 404));

    const fields = ['title', 'description', 'imageUrl', 'repoUrl', 'liveUrl'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    await project.save();
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/projects/:id   (protected)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return next(new ErrorHandler('Project not found', 404));

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};
