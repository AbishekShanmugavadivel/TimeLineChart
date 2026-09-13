const Project = require('../models/Project');

// @desc    Get all projects for logged in user
// @route   GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description, technology, phaseNumber, githubUrl, liveUrl, status, difficulty } = req.body;

    const project = await Project.create({
      userId: req.user._id,
      name,
      description,
      technology: Array.isArray(technology) ? technology : (technology ? technology.split(',').map(s => s.trim()) : []),
      phaseNumber,
      githubUrl,
      liveUrl,
      status,
      difficulty
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this project' });
    }

    if (req.body.technology && typeof req.body.technology === 'string') {
      req.body.technology = req.body.technology.split(',').map(s => s.trim());
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
