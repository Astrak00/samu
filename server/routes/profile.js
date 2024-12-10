import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create or update profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { age, weight, height, foodPreferences, dietaryRestrictions } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    user.age = age;
    user.weight = weight;
    user.height = height;
    user.foodPreferences = foodPreferences;
    user.dietaryRestrictions = dietaryRestrictions;

    // Calculate BMI and add to health history
    const heightInMeters = height / 100;
    const bmi = +(weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    const healthData = {
      date: new Date(),
      weight,
      height,
      bmi
    };

    // Initialize healthHistory if it doesn't exist
    if (!user.healthHistory) {
      user.healthHistory = [];
    }
    
    user.healthHistory.push(healthData);

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        bmi: user.bmi,
        foodPreferences: user.foodPreferences,
        dietaryRestrictions: user.dietaryRestrictions,
        healthHistory: user.healthHistory
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('savedRecipes')
      .populate('savedWorkouts');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update health data
router.post('/health', authenticateToken, async (req, res) => {
  try {
    const { weight, height } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update current stats
    user.weight = weight;
    user.height = height;

    // Calculate new BMI
    const heightInMeters = height / 100;
    const bmi = +(weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Add to health history
    const healthData = {
      date: new Date(),
      weight,
      height,
      bmi
    };

    user.healthHistory.push(healthData);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Health update error:', error);
    res.status(500).json({ message: 'Error updating health data', error: error.message });
  }
});

export default router;