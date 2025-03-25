import express from 'express';
import {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} from '../../controllers/thoughtController.js';

const router = express.Router();

router.route('/')
  .get(getThoughts)
  .post(createThought);

router.route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router.route('/:thoughtId/reactions')
  .post(addReaction)
  .delete(removeReaction);

export default router;