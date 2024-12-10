import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('author', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name' }
      });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// Create new recipe
router.post('/', authenticateToken, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user.userId,
      comments: []
    });
    
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
});

// Get user's saved recipes
router.get('/saved', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'savedRecipes',
        populate: [
          { path: 'author', select: 'name' },
          { path: 'comments', populate: { path: 'author', select: 'name' } }
        ]
      });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedRecipes || []);
  } catch (error) {
    res.json([]);
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name' }
      });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
});

// Save recipe to user's favorites
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipeIndex = user.savedRecipes.indexOf(req.params.id);
    if (recipeIndex === -1) {
      user.savedRecipes.push(recipe._id);
    } else {
      user.savedRecipes.splice(recipeIndex, 1);
    }
    
    await user.save();
    res.json({ message: 'Recipe saved status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating saved recipe', error: error.message });
  }
});

export default router;