const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET search notes (must come before /:id)
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const notes = await Note.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new note
router.post('/', async (req, res) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const note = new Note({ 
      title, 
      content, 
      tags: tags || [], 
      color: color || '#ffffff',
      isPinned: isPinned || false 
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;
    const updateData = { title, content };
    
    if (tags !== undefined) updateData.tags = tags;
    if (color !== undefined) updateData.color = color;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle pin
router.patch('/:id/pin', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    note.isPinned = !note.isPinned;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
