const Resource = require('../models/Resource');

// @desc    Get resources with optional filtering
// @route   GET /api/resources
const getResources = async (req, res, next) => {
  try {
    const { phaseNumber, type } = req.query;
    let query = {
      $or: [{ isGlobal: true }]
    };

    if (req.user) {
      query.$or.push({ userId: req.user._id });
    }

    if (phaseNumber) {
      query.phaseNumber = parseInt(phaseNumber);
    }

    if (type) {
      query.type = type;
    }

    const resources = await Resource.find(query).sort({ phaseNumber: 1, createdAt: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a custom bookmark/resource
// @route   POST /api/resources
const createResource = async (req, res, next) => {
  try {
    const { title, url, type, phaseNumber, topicName, description } = req.body;

    const resource = await Resource.create({
      title,
      url,
      type: type || 'Documentation',
      phaseNumber: phaseNumber || 1,
      topicName: topicName || 'General',
      description,
      isGlobal: false,
      userId: req.user._id
    });

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom resource
// @route   DELETE /api/resources/:id
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (resource.isGlobal && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot delete global seed resource' });
    }

    if (!resource.isGlobal && resource.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    res.json({ success: true, message: 'Resource removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResources,
  createResource,
  deleteResource
};
