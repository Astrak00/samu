import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe.js';
import Workout from '../models/Workout.js';
import { recipes } from '../data/recipes.js';
import { workouts } from '../data/workouts.js';

dotenv.config();

async function initializeDb() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Recipe.deleteMany({}),
      Workout.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert new data
    const insertedRecipes = await Recipe.insertMany(recipes);
    const insertedWorkouts = await Workout.insertMany(workouts);
    
    console.log(`Inserted ${insertedRecipes.length} recipes`);
    console.log(`Inserted ${insertedWorkouts.length} workouts`);
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initializeDb();