import { Thought, User } from '../models/index.js';

// GET all thoughts
export const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    console.error('Error in getThoughts:', err);
    res.status(500).json(err);
  }
};

// GET a single thought by ID
export const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    console.error('Error in getThoughtById:', err);
    res.status(500).json(err);
  }
};

// POST to create a new thought
export const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });
    res.json(thought);
  } catch (err) {
    console.error('Error in createThought:', err);
    res.status(500).json(err);
  }
};

// PUT to update a thought by ID
export const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    console.error('Error in updateThought:', err);
    res.status(500).json(err);
  }
};

// DELETE a thought by ID
export const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json({ message: 'Thought deleted!' });
  } catch (err) {
    console.error('Error in deleteThought:', err);
    res.status(500).json(err);
  }
};

// POST to add a reaction
export const addReaction = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $addToSet: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    console.error('Error in addReaction:', err);
    res.status(500).json(err);
  }
};

// DELETE to remove a reaction
export const removeReaction = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.body.reactionId } } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(thought);
  } catch (err) {
    console.error('Error in removeReaction:', err);
    res.status(500).json(err);
  }
};