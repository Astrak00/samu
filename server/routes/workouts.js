import express from 'express';
import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate('author', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name' }
      });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error: error.message });
  }
});

// Create new workout
router.post('/', authenticateToken, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      author: req.user.userId,
      comments: []
    });
    
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ message: 'Error creating workout', error: error.message });
  }
});

// Get user's saved workouts
router.get('/saved', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'savedWorkouts',
        populate: [
          { path: 'author', select: 'name' },
          { path: 'comments', populate: { path: 'author', select: 'name' } }
        ]
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedWorkouts || []);
  } catch (error) {
    res.json([]);
  }
});

// Get single workout
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('author', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name' }
      });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout', error: error.message });
  }
});

// Save workout to user's favorites
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const workoutIndex = user.savedWorkouts.indexOf(req.params.id);
    if (workoutIndex === -1) {
      user.savedWorkouts.push(workout._id);
    } else {
      user.savedWorkouts.splice(workoutIndex, 1);
    }
    
    await user.save();
    res.json({ message: 'Workout saved status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating saved workout', error: error.message });
  }
});

export default router;