const Note = require('../models/Note');

// @desc    Get user notes
// @route   GET /api/notes
const getNotes = async (req, res, next) => {
  try {
    const { phaseNumber, search } = req.query;
    let query = { userId: req.user._id };

    if (phaseNumber) {
      query.phaseNumber = parseInt(phaseNumber);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create note
// @route   POST /api/notes
const createNote = async (req, res, next) => {
  try {
    const { title, content, phaseNumber, topicName, tags } = req.body;

    const note = await Note.create({
      userId: req.user._id,
      title,
      content,
      phaseNumber,
      topicName,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
    });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this note' });
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();
    res.json({ success: true, message: 'Note removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote
};
